-- =============================================================================
-- Migration: 006_accounting.sql
-- Module: ACCOUNTANT / Singapore Financial Accounting & Billing Integration
-- =============================================================================

-- 1. Invoices Table Enhancements
alter table public.invoices
  add column if not exists amount_paid numeric(12,2) not null default 0.00,
  add column if not exists balance_due numeric(12,2) not null default 0.00,
  add column if not exists currency text not null default 'SGD',
  add column if not exists exchange_rate numeric(10,4) not null default 1.0000,
  add column if not exists payment_terms_days integer not null default 30,
  add column if not exists locked boolean not null default false;

-- Update status constraint on public.invoices to unified 6-status system
alter table public.invoices
  drop constraint if exists invoices_status_check;

alter table public.invoices
  add constraint invoices_status_check
  check (status in ('Draft', 'Sent', 'Partially Paid', 'Paid', 'Overdue', 'Void'));

-- Sync balance_due trigger on invoices
create or replace function public.calc_invoice_balance() returns trigger
language plpgsql set search_path = public as $$
begin
  new.balance_due := greatest(0.00, round((coalesce(new.total, 0.00) - coalesce(new.amount_paid, 0.00))::numeric, 2));
  if new.balance_due = 0.00 and new.amount_paid > 0.00 and new.status <> 'Void' then
    new.status := 'Paid';
    if new.paid_at is null then
      new.paid_at := now();
    end if;
  elsif new.amount_paid > 0.00 and new.balance_due > 0.00 and new.status <> 'Void' then
    new.status := 'Partially Paid';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_calc_invoice_balance on public.invoices;
create trigger trg_calc_invoice_balance
  before insert or update of total, amount_paid, status on public.invoices
  for each row execute function public.calc_invoice_balance();

-- 2. Invoice Items Table (Itemized Singapore GST line items)
create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  qty numeric(10,2) not null default 1.00,
  unit_price numeric(12,2) not null default 0.00,
  tax_code text not null default 'SR' check (tax_code in ('SR', 'ZR', 'ES', 'OS')),
  tax_amount numeric(12,2) not null default 0.00,
  line_total numeric(12,2) not null default 0.00,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_invoice_items_invoice on public.invoice_items(invoice_id);

-- 3. Payments Table
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  method text not null check (method in ('PayNow', 'Bank Transfer', 'Cheque', 'Card', 'Cash')),
  reference text,
  received_at timestamptz not null default now(),
  recorded_by uuid references public.profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_payments_invoice on public.payments(invoice_id);

-- Trigger to automatically update invoice amount_paid on payments insert / update / delete
create or replace function public.sync_invoice_payments() returns trigger
language plpgsql set search_path = public as $$
declare
  target_inv_id uuid;
  total_received numeric(12,2);
begin
  target_inv_id := case when TG_OP = 'DELETE' then OLD.invoice_id else NEW.invoice_id end;
  
  select coalesce(sum(amount), 0.00)
    into total_received
    from public.payments
   where invoice_id = target_inv_id;

  update public.invoices
     set amount_paid = total_received,
         updated_at = now()
   where id = target_inv_id;

  return null;
end;
$$;

drop trigger if exists trg_sync_invoice_payments on public.payments;
create trigger trg_sync_invoice_payments
  after insert or update or delete on public.payments
  for each row execute function public.sync_invoice_payments();

-- 4. Credit Notes Table
create sequence if not exists public.credit_note_seq start 1;

create table if not exists public.credit_notes (
  id uuid primary key default gen_random_uuid(),
  credit_note_number text unique not null
    default ('CN-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.credit_note_seq')::text, 5, '0')),
  invoice_id uuid not null references public.invoices(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  gst numeric(12,2) not null default 0.00,
  reason text not null,
  issued_at timestamptz not null default now(),
  issued_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_credit_notes_invoice on public.credit_notes(invoice_id);

-- 5. Vendor Bills Table (Partner Carrier Payables)
create table if not exists public.vendor_bills (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.transport_partners(id) on delete set null,
  shipment_id uuid references public.shipments(id) on delete set null,
  bill_number text not null,
  amount numeric(12,2) not null default 0.00,
  gst numeric(12,2) not null default 0.00,
  due_at timestamptz,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Paid', 'Disputed')),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vendor_bills_partner on public.vendor_bills(partner_id);
create index if not exists idx_vendor_bills_shipment on public.vendor_bills(shipment_id);

-- 6. Audit Log Alignment and Triggers
alter table public.audit_log
  add column if not exists table_name text,
  add column if not exists record_id text,
  add column if not exists old_data jsonb,
  add column if not exists new_data jsonb,
  add column if not exists user_id uuid references public.profiles(id) on delete set null;

create or replace function public.audit_financial_mutation() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid := auth.uid();
  v_rec_id text;
begin
  v_rec_id := case when TG_OP = 'DELETE' then OLD.id::text else NEW.id::text end;

  insert into public.audit_log (
    table_name,
    record_id,
    action,
    entity,
    entity_id,
    old_data,
    new_data,
    user_id,
    actor_id,
    created_at
  ) values (
    TG_TABLE_NAME,
    v_rec_id,
    TG_OP,
    TG_TABLE_NAME,
    v_rec_id,
    case when TG_OP in ('UPDATE', 'DELETE') then to_jsonb(OLD) else null end,
    case when TG_OP in ('INSERT', 'UPDATE') then to_jsonb(NEW) else null end,
    v_user_id,
    v_user_id,
    now()
  );

  return null;
end;
$$;

-- Attach triggers to accounting tables
drop trigger if exists trg_audit_invoices on public.invoices;
create trigger trg_audit_invoices
  after insert or update or delete on public.invoices
  for each row execute function public.audit_financial_mutation();

drop trigger if exists trg_audit_payments on public.payments;
create trigger trg_audit_payments
  after insert or update or delete on public.payments
  for each row execute function public.audit_financial_mutation();

drop trigger if exists trg_audit_credit_notes on public.credit_notes;
create trigger trg_audit_credit_notes
  after insert or update or delete on public.credit_notes
  for each row execute function public.audit_financial_mutation();

drop trigger if exists trg_audit_vendor_bills on public.vendor_bills;
create trigger trg_audit_vendor_bills
  after insert or update or delete on public.vendor_bills
  for each row execute function public.audit_financial_mutation();

-- 7. Module Permissions & Row-Level Security (RLS)
insert into public.module_permissions (role, module_key, can_access, can_write) values
  ('admin', 'accounting', true, true),
  ('crm_manager', 'accounting', true, true),
  ('crm_finance', 'accounting', true, true),
  ('ACCOUNTANT', 'accounting', true, true),
  ('FINANCE', 'accounting', true, true),
  ('viewer', 'accounting', true, false),
  ('READONLY', 'accounting', true, false)
on conflict (role, module_key) do update set
  can_access = excluded.can_access,
  can_write = excluded.can_write,
  updated_at = now();

-- Ensure crm_finance and ACCOUNTANT have billing permissions
insert into public.module_permissions (role, module_key, can_access, can_write) values
  ('ACCOUNTANT', 'billing', true, true),
  ('ACCOUNTANT', 'customers', true, false),
  ('ACCOUNTANT', 'dashboard', true, false),
  ('ACCOUNTANT', 'reports', true, false),
  ('ACCOUNTANT', 'notifications', true, true)
on conflict (role, module_key) do update set
  can_access = excluded.can_access,
  can_write = excluded.can_write,
  updated_at = now();

-- Enable RLS on new tables
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.credit_notes enable row level security;
alter table public.vendor_bills enable row level security;

-- Policies for invoice_items
create policy "staff read invoice items" on public.invoice_items for select
  using (public.is_admin() or public.has_module_access('billing', false) or public.has_module_access('accounting', false));

create policy "editors manage invoice items" on public.invoice_items for all
  using (public.is_admin() or public.has_module_access('billing', true) or public.has_module_access('accounting', true))
  with check (public.is_admin() or public.has_module_access('billing', true) or public.has_module_access('accounting', true));

-- Policies for payments
create policy "staff read payments" on public.payments for select
  using (public.is_admin() or public.has_module_access('billing', false) or public.has_module_access('accounting', false));

create policy "editors manage payments" on public.payments for all
  using (public.is_admin() or public.has_module_access('billing', true) or public.has_module_access('accounting', true))
  with check (public.is_admin() or public.has_module_access('billing', true) or public.has_module_access('accounting', true));

-- Policies for credit_notes
create policy "staff read credit notes" on public.credit_notes for select
  using (public.is_admin() or public.has_module_access('accounting', false) or public.has_module_access('billing', false));

create policy "editors manage credit notes" on public.credit_notes for all
  using (public.is_admin() or public.has_module_access('accounting', true) or public.has_module_access('billing', true))
  with check (public.is_admin() or public.has_module_access('accounting', true) or public.has_module_access('billing', true));

-- Policies for vendor_bills
create policy "staff read vendor bills" on public.vendor_bills for select
  using (public.is_admin() or public.has_module_access('accounting', false));

create policy "editors manage vendor bills" on public.vendor_bills for all
  using (public.is_admin() or public.has_module_access('accounting', true))
  with check (public.is_admin() or public.has_module_access('accounting', true));

