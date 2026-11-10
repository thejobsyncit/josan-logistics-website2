-- Migration: 003_tracking_rate_limit.sql
-- Description: Tracking lookup rate limiting table to store HMAC-hashed IP addresses and timestamps.
-- RLS is enabled with NO policies, ensuring only the service role can read/write.

create table if not exists public.tracking_rate_limit (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  created_at timestamptz not null default now()
);

-- Index on (ip_hash, created_at desc) for efficient lookups within sliding time windows
create index if not exists idx_tracking_rate_limit_ip_hash_created_at
  on public.tracking_rate_limit (ip_hash, created_at desc);

-- Enable Row Level Security (RLS) with no policies
-- Anon and authenticated roles have zero access. Only service_role in Edge Functions has access.
alter table public.tracking_rate_limit enable row level security;

-- Function to delete rate limit records older than 24 hours
create or replace function public.cleanup_tracking_rate_limit() returns void
language sql security definer set search_path = public as $$
  delete from public.tracking_rate_limit
  where created_at < now() - interval '24 hours';
$$;

revoke all on function public.cleanup_tracking_rate_limit() from public, anon, authenticated;
grant execute on function public.cleanup_tracking_rate_limit() to service_role;
