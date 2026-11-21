alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in (
    'CUSTOMER',
    'CRM',
    'ADMIN',
    'READONLY',
    'OPERATIONS',
    'FINANCE',
    'AIRWAY_EXECUTIVE'
  ));

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    public.current_role_name() in (
      'ADMIN',
      'CRM',
      'READONLY',
      'OPERATIONS',
      'FINANCE',
      'AIRWAY_EXECUTIVE'
    ),
    false
  )
$$;

create or replace function public.can_edit() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    public.current_role_name() in (
      'ADMIN',
      'CRM',
      'OPERATIONS',
      'FINANCE',
      'AIRWAY_EXECUTIVE'
    ),
    false
  )
$$;

insert into public.module_permissions (role, module_key, can_access, can_write) values
  ('OPERATIONS', 'dashboard', true, false),
  ('OPERATIONS', 'customers', true, false),
  ('OPERATIONS', 'airway_requests', false, false),
  ('OPERATIONS', 'road_shipments', true, true),
  ('OPERATIONS', 'documents', true, false),
  ('OPERATIONS', 'quotations', false, false),
  ('OPERATIONS', 'billing', false, false),
  ('OPERATIONS', 'transportation_partners', true, true),
  ('OPERATIONS', 'notifications', true, true),
  ('OPERATIONS', 'reports', true, false),
  ('OPERATIONS', 'settings', false, false),
  ('AIRWAY_EXECUTIVE', 'dashboard', true, false),
  ('AIRWAY_EXECUTIVE', 'customers', true, false),
  ('AIRWAY_EXECUTIVE', 'airway_requests', true, true),
  ('AIRWAY_EXECUTIVE', 'road_shipments', false, false),
  ('AIRWAY_EXECUTIVE', 'documents', true, true),
  ('AIRWAY_EXECUTIVE', 'quotations', true, true),
  ('AIRWAY_EXECUTIVE', 'billing', true, true),
  ('AIRWAY_EXECUTIVE', 'transportation_partners', false, false),
  ('AIRWAY_EXECUTIVE', 'notifications', true, true),
  ('AIRWAY_EXECUTIVE', 'reports', true, false),
  ('AIRWAY_EXECUTIVE', 'settings', false, false),
  ('FINANCE', 'dashboard', true, false),
  ('FINANCE', 'customers', true, false),
  ('FINANCE', 'airway_requests', true, false),
  ('FINANCE', 'road_shipments', true, false),
  ('FINANCE', 'documents', true, false),
  ('FINANCE', 'quotations', true, false),
  ('FINANCE', 'billing', true, true),
  ('FINANCE', 'transportation_partners', false, false),
  ('FINANCE', 'notifications', true, true),
  ('FINANCE', 'reports', true, false),
  ('FINANCE', 'settings', false, false)
on conflict (role, module_key) do update set
  can_access = excluded.can_access,
  can_write = excluded.can_write,
  updated_at = now();
