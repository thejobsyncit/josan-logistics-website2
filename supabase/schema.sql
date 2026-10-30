-- =========================================================
-- JOSAN LOGISTICS - FRESH DATABASE SCHEMA
-- =========================================================
create extension if not exists pgcrypto with schema extensions;

-- ---------- helper functions ----------
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- secure random code from a readable alphabet (no 0, O, 1, I, L)
create or replace function public.random_code(len int) returns text
language plpgsql set search_path = public, extensions as $$
declare
  alphabet constant text := '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  b bytea := gen_random_bytes(len);
  r text := '';
begin
  for i in 0..len-1 loop
    r := r || substr(alphabet, (get_byte(b, i) % 31) + 1, 1);
  end loop;
  return r;
end $$;

-- ---------- profiles (customers and staff) ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique not null,
  phone text,
  company text,
  uen text,
  billing_address text,
  role text not null default 'CUSTOMER'
    check (role in ('CUSTOMER','CRM','ADMIN','READONLY')),
  status text not null default 'Active'
    check (status in ('Active','Invited','Disabled')),
  must_change_password boolean not null default false,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- role helpers (read the role from the database, never from the browser)
create or replace function public.current_role_name() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid() and status = 'Active'
$$;
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role_name() = 'ADMIN', false)
$$;
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role_name() in ('ADMIN','CRM','READONLY'), false)
$$;
create or replace function public.can_edit() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role_name() in ('ADMIN','CRM'), false)
$$;

-- every new sign-up becomes a CUSTOMER by default, or ADMIN/CRM if designated or matching staff credentials
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_role text := 'CUSTOMER';
  v_meta_role text := lower(coalesce(new.raw_user_meta_data->>'role', ''));
  v_email text := lower(new.email);
begin
  if v_email in ('admin@josanlogistics.com', 'admin@josanlogistics.com.sg', 'josanlogisticss@gmail.com')
     or v_meta_role in ('admin', 'administrator') then
    v_role := 'ADMIN';
  elsif v_meta_role in ('crm', 'crm_manager', 'operations_manager', 'coordinator', 'finance', 'operations') then
    v_role := 'CRM';
  elsif v_meta_role in ('readonly', 'read-only', 'read_only', 'viewer') then
    v_role := 'READONLY';
  end if;

  insert into public.profiles (id, email, name, role)
  values (new.id, v_email,
          coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
          v_role)
  on conflict (id) do update set
    name = coalesce(excluded.name, profiles.name),
    role = excluded.role,
    updated_at = now();
  return new;
end $$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- a user can never change their own role, status or email
create or replace function public.protect_profile_columns() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.role   is distinct from old.role
    or new.status is distinct from old.status
    or new.email  is distinct from old.email
    or new.id     is distinct from old.id then
      raise exception 'Not allowed to change role, status or email';
    end if;
  end if;
  return new;
end $$;
create trigger protect_profile_columns
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- ---------- transport partners ----------
create table public.transport_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  contact_phone text,
  contact_email text,
  service_areas text,
  vehicle_types text,
  status text not null default 'Active' check (status in ('Active','Inactive')),
  vetting_notes text,          -- what was actually checked (licence, insurance...)
  verified_on date,            -- fill in before using the word "vetted"
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- quote requests ----------
create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  reference text unique,                       -- set automatically
  is_test boolean not null default false,
  customer_id uuid references public.profiles(id) on delete set null,
  service_type text not null
    check (service_type in ('AIR_FREIGHT_DOCS','ROAD_TRANSPORT','SHIPMENT_DOCS')),
  road_load_type text,                         -- optional: consolidated / dedicated
  add_documentation boolean not null default false,
  pickup_location text,
  delivery_location text,
  preferred_pickup_date date,
  cargo_classification text,
  cargo_description text,
  packages integer,
  gross_weight_kg numeric(10,2),
  length_cm numeric(8,2), width_cm numeric(8,2), height_cm numeric(8,2),
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  company_name text,
  consent_given boolean not null default false,
  consent_at timestamptz,
  copy_to_customer boolean not null default false,
  status text not null default 'New'
    check (status in ('New','In review','Quoted','Accepted','Declined','Closed')),
  assigned_to uuid references public.profiles(id) on delete set null,
  quoted_amount numeric(12,2),                 -- stays empty until prices are approved
  quoted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.quote_requests (status, created_at desc);

create or replace function public.set_quote_reference() returns trigger
language plpgsql set search_path = public as $$
declare code text; ref text; prefix text;
begin
  prefix := case when new.is_test then 'TQ-' else 'QR-' end;
  loop
    code := public.random_code(8);
    ref  := prefix || substr(code,1,4) || '-' || substr(code,5,4);
    exit when not exists (select 1 from public.quote_requests where reference = ref);
  end loop;
  new.reference := ref;                        -- always overwritten, never from the browser
  return new;
end $$;
create trigger set_quote_reference
  before insert on public.quote_requests
  for each row execute function public.set_quote_reference();

create table public.quote_notes (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quote_requests(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);

-- ---------- shipments and tracking ----------
create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_number text unique,                 -- set automatically
  is_test boolean not null default false,
  quote_id uuid references public.quote_requests(id) on delete set null,
  customer_id uuid references public.profiles(id) on delete set null,
  partner_id uuid references public.transport_partners(id) on delete set null,
  service_type text not null
    check (service_type in ('AIR_FREIGHT_DOCS','ROAD_TRANSPORT','SHIPMENT_DOCS')),
  awb_number text,
  road_reference text,
  origin_city text,
  destination_city text,
  pickup_address text,
  delivery_address text,
  cargo_description text,
  packages integer,
  weight_kg numeric(10,2),
  declared_value numeric(12,2),                -- private: staff and the owner only
  freight_fee numeric(12,2),                   -- private: staff and the owner only
  status text not null default 'Booked'
    check (status in ('Booked','Confirmed','Pickup Scheduled','Picked Up',
                      'In Transit','Near Destination','Delivered','Cancelled')),
  estimated_delivery timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.shipments (customer_id);

create or replace function public.set_tracking_number() returns trigger
language plpgsql set search_path = public as $$
declare ref text; prefix text;
begin
  prefix := case when new.is_test then 'TJOS-' else 'JOS-' end;
  loop
    ref := prefix || public.random_code(10);
    exit when not exists (select 1 from public.shipments where tracking_number = ref);
  end loop;
  new.tracking_number := ref;
  return new;
end $$;
create trigger set_tracking_number
  before insert on public.shipments
  for each row execute function public.set_tracking_number();

create table public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  stage text not null,
  location text,
  note text,
  occurred_at timestamptz not null default now(),
  source text not null default 'manual' check (source in ('manual','live feed')),
  is_public boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index on public.tracking_events (shipment_id, occurred_at);

create table public.shipment_documents (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid references public.shipments(id) on delete cascade,
  quote_id uuid references public.quote_requests(id) on delete cascade,
  doc_type text not null,                      -- invoice, packing list, AWB, LR...
  file_path text not null,                     -- path in a PRIVATE Storage bucket
  visible_to_customer boolean not null default false,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------- invoices ----------
create sequence public.invoice_seq start 1;
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null
    default ('INV-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.invoice_seq')::text, 5, '0')),
  customer_id uuid references public.profiles(id) on delete set null,
  shipment_id uuid references public.shipments(id) on delete set null,
  quote_id uuid references public.quote_requests(id) on delete set null,
  amount_excl_gst numeric(12,2) not null,
  gst numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  status text not null default 'Draft' check (status in ('Draft','Sent','Paid','Void')),
  issued_at timestamptz,
  due_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- contact form ----------
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  is_test boolean not null default false,
  name text not null,
  email text not null,
  phone text,
  company text,
  subject text,
  message text not null,
  tracking_ref text,
  consent_given boolean not null default false,
  consent_at timestamptz,
  status text not null default 'New' check (status in ('New','Replied','Closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- chatbot ----------
create table public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references public.quote_requests(id) on delete set null,
  contact_id uuid references public.contact_messages(id) on delete set null,
  shared_by_visitor boolean not null default true,   -- stored only when sent to the team
  created_at timestamptz not null default now(),
  expires_at timestamptz                              -- set when management decides retention
);
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  sender text not null check (sender in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index on public.chat_messages (conversation_id, created_at);

create table public.knowledge_base_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  source text,                                 -- where it came from
  owner_name text,                             -- who is responsible at Josan
  licence_note text,                           -- note if copied from another organisation
  status text not null default 'Draft' check (status in ('Draft','Approved','Retired')),
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- notifications, audit log, settings ----------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value text,
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);

-- starter settings (demo_mode is true; all demo values to be replaced before live launch)
insert into public.site_settings (key, value, is_public) values
  ('company_name',        'Josan Logistics Pte. Ltd.',     true),
  ('uen',                 '',                              true),
  ('gst_reg',             '',                              true),
  ('phone',               '+65 6789 0123',                 true),
  ('whatsapp',            '+65 6789 0123',                 true),
  ('contact_email',       'contact@josanlogistics.com.sg', true),
  ('registered_office',   '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438', true),
  ('dpo_email',           'contact@josanlogistics.com.sg', true),
  ('show_price_estimate', 'false',                         true),
  ('demo_mode',           'true',                          true)
on conflict (key) do update set value = excluded.value;

-- ---------- updated_at triggers ----------
do $$
declare t text;
begin
  foreach t in array array['profiles','transport_partners','quote_requests','shipments',
    'invoices','contact_messages','knowledge_base_documents','site_settings'] loop
    execute format('create trigger set_updated_at before update on public.%I
                    for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------- module permissions (RBAC / RLS toggle enforcement) ----------
create table if not exists public.module_permissions (
  id uuid primary key default gen_random_uuid(),
  role text,                                   -- 'admin', 'crm_manager', 'crm_ops', 'crm_finance', 'viewer', 'CRM', 'READONLY'
  user_id uuid references public.profiles(id) on delete cascade,
  module_key text not null,                    -- 'dashboard','customers','airway_requests','road_shipments','documents','quotations','billing','transportation_partners','notifications','reports','settings'
  can_access boolean not null default true,
  can_write boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint uq_role_module unique (role, module_key),
  constraint uq_user_module unique (user_id, module_key)
);
create index if not exists idx_module_perms_role on public.module_permissions (role, module_key);
create index if not exists idx_module_perms_user on public.module_permissions (user_id, module_key);

-- Helper to check whether the current user has access to a specific CRM module
create or replace function public.has_module_access(p_module text, p_write boolean default false) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare
  v_role text;
  v_uid uuid := auth.uid();
  v_allowed boolean;
begin
  if v_uid is null then
    return false;
  end if;

  select role into v_role from public.profiles where id = v_uid and status = 'Active';
  if v_role is null then
    return false;
  end if;

  -- Admin role always has full unrestricted access
  if upper(v_role) = 'ADMIN' or lower(v_role) = 'admin' then
    return true;
  end if;

  -- Read-only role is strictly view-only: never grant write permissions
  if (upper(v_role) = 'READONLY' or lower(v_role) = 'viewer') and p_write then
    return false;
  end if;

  -- 1. Check user-specific toggle override first
  if p_write then
    select (can_access and can_write) into v_allowed
    from public.module_permissions
    where user_id = v_uid and module_key = p_module;
  else
    select can_access into v_allowed
    from public.module_permissions
    where user_id = v_uid and module_key = p_module;
  end if;

  if v_allowed is not null then
    return v_allowed;
  end if;

  -- 2. Check role-based toggle permission (normalize role keys)
  if p_write then
    select (can_access and can_write) into v_allowed
    from public.module_permissions
    where (lower(role) = lower(v_role) or upper(role) = upper(v_role)) and module_key = p_module;
  else
    select can_access into v_allowed
    from public.module_permissions
    where (lower(role) = lower(v_role) or upper(role) = upper(v_role)) and module_key = p_module;
  end if;

  if v_allowed is not null then
    return v_allowed;
  end if;

  -- 3. Default fallback by role
  if upper(v_role) = 'READONLY' or lower(v_role) = 'viewer' then
    return (not p_write);
  end if;

  if upper(v_role) = 'CRM' or lower(v_role) like 'crm%' then
    return true;
  end if;

  return false;
end $$;

-- Seed default role-based module permissions
insert into public.module_permissions (role, module_key, can_access, can_write) values
  ('admin', 'dashboard', true, true),
  ('admin', 'customers', true, true),
  ('admin', 'airway_requests', true, true),
  ('admin', 'road_shipments', true, true),
  ('admin', 'documents', true, true),
  ('admin', 'quotations', true, true),
  ('admin', 'billing', true, true),
  ('admin', 'transportation_partners', true, true),
  ('admin', 'notifications', true, true),
  ('admin', 'reports', true, true),
  ('admin', 'settings', true, true),

  ('crm_manager', 'dashboard', true, true),
  ('crm_manager', 'customers', true, true),
  ('crm_manager', 'airway_requests', true, true),
  ('crm_manager', 'road_shipments', true, true),
  ('crm_manager', 'documents', true, true),
  ('crm_manager', 'quotations', true, true),
  ('crm_manager', 'billing', true, true),
  ('crm_manager', 'transportation_partners', true, true),
  ('crm_manager', 'notifications', true, true),
  ('crm_manager', 'reports', true, true),
  ('crm_manager', 'settings', false, false),

  ('crm_ops', 'dashboard', true, true),
  ('crm_ops', 'customers', true, true),
  ('crm_ops', 'airway_requests', true, true),
  ('crm_ops', 'road_shipments', true, true),
  ('crm_ops', 'documents', true, true),
  ('crm_ops', 'quotations', false, false),
  ('crm_ops', 'billing', false, false),
  ('crm_ops', 'transportation_partners', true, true),
  ('crm_ops', 'notifications', true, true),
  ('crm_ops', 'reports', false, false),
  ('crm_ops', 'settings', false, false),

  ('crm_finance', 'dashboard', true, true),
  ('crm_finance', 'customers', true, true),
  ('crm_finance', 'airway_requests', false, false),
  ('crm_finance', 'road_shipments', false, false),
  ('crm_finance', 'documents', true, true),
  ('crm_finance', 'quotations', true, true),
  ('crm_finance', 'billing', true, true),
  ('crm_finance', 'transportation_partners', false, false),
  ('crm_finance', 'notifications', true, true),
  ('crm_finance', 'reports', true, true),
  ('crm_finance', 'settings', false, false),

  ('viewer', 'dashboard', true, false),
  ('viewer', 'customers', true, false),
  ('viewer', 'airway_requests', true, false),
  ('viewer', 'road_shipments', true, false),
  ('viewer', 'documents', true, false),
  ('viewer', 'quotations', true, false),
  ('viewer', 'billing', false, false),
  ('viewer', 'transportation_partners', true, false),
  ('viewer', 'notifications', true, false),
  ('viewer', 'reports', true, false),
  ('viewer', 'settings', false, false)
on conflict (role, module_key) do update set
  can_access = excluded.can_access,
  can_write = excluded.can_write;

-- =========================================================
-- ROW LEVEL SECURITY (Enforcing Every Toggle with Database Rules)
-- =========================================================
alter table public.profiles                 enable row level security;
alter table public.module_permissions       enable row level security;
alter table public.transport_partners       enable row level security;
alter table public.quote_requests           enable row level security;
alter table public.quote_notes              enable row level security;
alter table public.shipments                enable row level security;
alter table public.tracking_events          enable row level security;
alter table public.shipment_documents       enable row level security;
alter table public.invoices                 enable row level security;
alter table public.contact_messages         enable row level security;
alter table public.chat_conversations       enable row level security;
alter table public.chat_messages            enable row level security;
alter table public.knowledge_base_documents enable row level security;
alter table public.notifications            enable row level security;
alter table public.audit_log                enable row level security;
alter table public.site_settings            enable row level security;

-- module_permissions: staff read, admins manage
create policy "staff read perms" on public.module_permissions for select
  using (public.is_staff());
create policy "admin manage perms" on public.module_permissions for all
  using (public.is_admin()) with check (public.is_admin());

-- profiles: read own, read staff directory (ADMIN, CRM, READONLY), or read customer profiles if granted 'customers' module
create policy "own or staff read" on public.profiles for select
  using (
    id = auth.uid() 
    or role in ('ADMIN', 'CRM', 'READONLY')
    or public.is_admin()
    or public.has_module_access('customers', false)
  );
create policy "update own profile" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
create policy "admin manage profiles" on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- transport_partners: enforced by 'transportation_partners' module toggle
create policy "staff read partners" on public.transport_partners for select
  using (public.is_admin() or public.has_module_access('transportation_partners', false));
create policy "editors manage partners" on public.transport_partners for all
  using (public.is_admin() or public.has_module_access('transportation_partners', true))
  with check (public.is_admin() or public.has_module_access('transportation_partners', true));

-- quotes & quote_notes: enforced by 'quotations' & 'airway_requests' module toggles
create policy "own quotes" on public.quote_requests for select
  using (customer_id = auth.uid());
create policy "staff read quotes" on public.quote_requests for select
  using (public.is_admin() or public.has_module_access('quotations', false) or public.has_module_access('airway_requests', false));
create policy "editors manage quotes" on public.quote_requests for all
  using (public.is_admin() or public.has_module_access('quotations', true) or public.has_module_access('airway_requests', true))
  with check (public.is_admin() or public.has_module_access('quotations', true) or public.has_module_access('airway_requests', true));

create policy "staff read quote_notes" on public.quote_notes for select
  using (public.is_admin() or public.has_module_access('quotations', false) or public.has_module_access('airway_requests', false));
create policy "editors manage quote_notes" on public.quote_notes for all
  using (public.is_admin() or public.has_module_access('quotations', true) or public.has_module_access('airway_requests', true))
  with check (public.is_admin() or public.has_module_access('quotations', true) or public.has_module_access('airway_requests', true));

-- shipments & tracking: enforced by 'road_shipments' (Road Coordination) and 'airway_requests' (Air Freight Requests)
create or replace function public.owns_shipment(sid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.shipments where id = sid and customer_id = auth.uid())
$$;
create policy "own shipments" on public.shipments for select
  using (customer_id = auth.uid());
create policy "staff read shipments" on public.shipments for select
  using (
    public.is_admin() 
    or (service_type = 'ROAD_TRANSPORT' and public.has_module_access('road_shipments', false))
    or (service_type in ('AIR_FREIGHT_DOCS','SHIPMENT_DOCS') and public.has_module_access('airway_requests', false))
    or public.has_module_access('road_shipments', false)
  );
create policy "editors manage shipments" on public.shipments for all
  using (
    public.is_admin() 
    or (service_type = 'ROAD_TRANSPORT' and public.has_module_access('road_shipments', true))
    or (service_type in ('AIR_FREIGHT_DOCS','SHIPMENT_DOCS') and public.has_module_access('airway_requests', true))
    or public.has_module_access('road_shipments', true)
  )
  with check (
    public.is_admin() 
    or (service_type = 'ROAD_TRANSPORT' and public.has_module_access('road_shipments', true))
    or (service_type in ('AIR_FREIGHT_DOCS','SHIPMENT_DOCS') and public.has_module_access('airway_requests', true))
    or public.has_module_access('road_shipments', true)
  );

create policy "own events" on public.tracking_events for select
  using (public.owns_shipment(shipment_id) and is_public);
create policy "staff read events" on public.tracking_events for select
  using (public.is_admin() or public.has_module_access('road_shipments', false) or public.has_module_access('airway_requests', false));
create policy "editors manage events" on public.tracking_events for all
  using (public.is_admin() or public.has_module_access('road_shipments', true) or public.has_module_access('airway_requests', true))
  with check (public.is_admin() or public.has_module_access('road_shipments', true) or public.has_module_access('airway_requests', true));

-- shipment_documents: enforced by 'documents' (Shipment Documents) module toggle
create policy "own documents" on public.shipment_documents for select
  using (visible_to_customer and public.owns_shipment(shipment_id));
create policy "staff read documents" on public.shipment_documents for select
  using (public.is_admin() or public.has_module_access('documents', false));
create policy "editors manage documents" on public.shipment_documents for all
  using (public.is_admin() or public.has_module_access('documents', true))
  with check (public.is_admin() or public.has_module_access('documents', true));

-- invoices: enforced by 'billing' module toggle
create policy "own invoices" on public.invoices for select
  using (customer_id = auth.uid() and status <> 'Draft');
create policy "staff read invoices" on public.invoices for select
  using (public.is_admin() or public.has_module_access('billing', false));
create policy "editors manage invoices" on public.invoices for all
  using (public.is_admin() or public.has_module_access('billing', true))
  with check (public.is_admin() or public.has_module_access('billing', true));

-- contact messages: enforced by 'customers' module toggle
create policy "staff read contact" on public.contact_messages for select
  using (public.is_admin() or public.has_module_access('customers', false));
create policy "editors manage contact" on public.contact_messages for all
  using (public.is_admin() or public.has_module_access('customers', true))
  with check (public.is_admin() or public.has_module_access('customers', true));

-- notifications: enforced by 'notifications' module toggle
create policy "own notifications" on public.notifications for select
  using (user_id = auth.uid());
create policy "mark own read" on public.notifications for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "staff read notifications" on public.notifications for select
  using (public.is_admin() or public.has_module_access('notifications', false));
create policy "editors create notifications" on public.notifications for insert
  with check (public.is_admin() or public.has_module_access('notifications', true));

-- audit_log: readable by admin and staff, insertable by system / authenticated actions
create policy "staff read audit" on public.audit_log for select
  using (public.is_admin() or public.is_staff());
create policy "insert audit log" on public.audit_log for insert
  with check (true);

-- settings: public readable, staff read governed by 'settings' toggle, admin manages
create policy "public settings" on public.site_settings for select using (is_public);
create policy "staff settings"  on public.site_settings for select
  using (public.is_admin() or public.has_module_access('settings', false));
create policy "admin manage"    on public.site_settings for all
  using (public.is_admin() or public.has_module_access('settings', true))
  with check (public.is_admin() or public.has_module_access('settings', true));

-- chat conversations and knowledge base
create policy "staff read chat"   on public.chat_conversations for select using (public.is_staff());
create policy "admin delete chat" on public.chat_conversations for delete using (public.is_admin());
create policy "staff read chat_msgs" on public.chat_messages for select using (public.is_staff());
create policy "admin delete chat_msgs" on public.chat_messages for delete using (public.is_admin());
create policy "staff read kb"     on public.knowledge_base_documents for select using (public.is_staff());
create policy "admin manage kb"   on public.knowledge_base_documents for all using (public.is_admin()) with check (public.is_admin());

-- public tracking lookup returns limited, non-sensitive data only
create or replace function public.track_shipment(p_tracking text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'tracking_number', s.tracking_number,
    'status', s.status,
    'service_type', s.service_type,
    'origin_city', s.origin_city,
    'destination_city', s.destination_city,
    'estimated_delivery', s.estimated_delivery,
    'last_updated', (select max(e.occurred_at) from public.tracking_events e where e.shipment_id = s.id),
    'events', coalesce((select jsonb_agg(jsonb_build_object(
        'stage', e.stage, 'location', e.location, 'occurred_at', e.occurred_at)
        order by e.occurred_at)
      from public.tracking_events e where e.shipment_id = s.id and e.is_public), '[]'::jsonb))
  from public.shipments s
  where s.tracking_number = upper(trim(p_tracking)) and s.is_test = false
$$;
revoke all on function public.track_shipment(text) from public, anon, authenticated;
grant execute on function public.track_shipment(text) to service_role;


-- =========================================================
-- CHATBOT KNOWLEDGE BASE (pgvector), run AFTER the main schema
-- =========================================================
create extension if not exists vector with schema extensions;

create table public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.knowledge_base_documents(id) on delete cascade,
  chunk_index int not null,
  content text not null,
  token_count int not null default 0,
  embedding extensions.vector(1536),     -- must match your embedding model
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index on public.document_chunks (document_id);
create index on public.document_chunks
  using hnsw (embedding extensions.vector_cosine_ops);

alter table public.document_chunks enable row level security;
create policy "staff read"   on public.document_chunks for select using (public.is_staff());
create policy "admin manage" on public.document_chunks for all
  using (public.is_admin()) with check (public.is_admin());

-- search only APPROVED documents, callable only from the server (Edge Function)
create or replace function public.match_document_chunks(
  query_embedding extensions.vector(1536),
  match_threshold float default 0.5,
  match_count int default 5
) returns table (
  id uuid, document_id uuid, content text, similarity float,
  document_title text, metadata jsonb
)
language sql stable security definer set search_path = public, extensions as $$
  select dc.id, dc.document_id, dc.content,
         (1 - (dc.embedding <=> query_embedding))::float as similarity,
         d.title, dc.metadata
  from public.document_chunks dc
  join public.knowledge_base_documents d on d.id = dc.document_id
  where d.status = 'Approved'
    and (1 - (dc.embedding <=> query_embedding)) > match_threshold
  order by dc.embedding <=> query_embedding
  limit match_count
$$;
revoke all on function public.match_document_chunks(extensions.vector, float, int)
  from public, anon, authenticated;
grant execute on function public.match_document_chunks(extensions.vector, float, int)
  to service_role;