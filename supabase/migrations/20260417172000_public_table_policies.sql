alter table if exists public.import_sessions enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
      and policyname = 'users_service_role_access'
  ) then
    create policy users_service_role_access
      on public.users
      for all
      to service_role
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'audit_logs'
      and policyname = 'audit_logs_service_role_access'
  ) then
    create policy audit_logs_service_role_access
      on public.audit_logs
      for all
      to service_role
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'import_sessions'
      and policyname = 'import_sessions_service_role_access'
  ) then
    create policy import_sessions_service_role_access
      on public.import_sessions
      for all
      to service_role
      using (true)
      with check (true);
  end if;
end
$$;
