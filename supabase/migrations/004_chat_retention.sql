-- Migration: 004_chat_retention.sql
-- Description: Automated 30-day retention purge function for public.chat_logs
-- and daily schedule registration via pg_cron (if available).

-- 1. Create function to purge chat_logs older than 30 days
create or replace function public.purge_old_chat_logs()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.chat_logs
  where created_at < now() - interval '30 days';
$$;

-- 2. Revoke execute privileges from anon, authenticated, and public
revoke all on function public.purge_old_chat_logs() from public, anon, authenticated;
grant execute on function public.purge_old_chat_logs() to service_role;

-- 3. Schedule daily execution via pg_cron if extension is available
do $$
begin
  if exists (
    select 1 from pg_extension where extname = 'pg_cron'
  ) then
    -- Remove existing job if already registered to prevent duplicates
    if exists (select 1 from cron.job where jobname = 'purge-chat-logs-daily') then
      perform cron.unschedule('purge-chat-logs-daily');
    end if;

    -- Schedule daily run at 03:00 UTC
    perform cron.schedule(
      'purge-chat-logs-daily',
      '0 3 * * *',
      'select public.purge_old_chat_logs();'
    );
  else
    raise notice 'pg_cron extension is not available. Use an Edge Function or external cron scheduler as alternative.';
  end if;
exception
  when others then
    raise notice 'pg_cron schedule setup bypassed: %', sqlerrm;
end;
$$;

