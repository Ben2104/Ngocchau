create extension if not exists pgcrypto;

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id),
  actor_role text not null,
  action text not null,
  entity_type text not null,
  entity_id text,
  module_name text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists audit_logs_actor_user_id_idx on public.audit_logs (actor_user_id);
create index if not exists audit_logs_module_name_idx on public.audit_logs (module_name);
create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);

create table if not exists public.import_sessions (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null,
  status text not null,
  uploaded_by uuid references auth.users(id),
  validation_summary jsonb not null default '{}'::jsonb,
  normalized_rows jsonb,
  committed_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists import_sessions_uploaded_by_idx on public.import_sessions (uploaded_by);
create index if not exists import_sessions_status_idx on public.import_sessions (status);

