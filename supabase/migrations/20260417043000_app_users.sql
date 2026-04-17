create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  employee_id text not null unique,
  full_name text not null,
  email text not null unique,
  role text not null,
  status text not null default 'active',
  joined_at timestamptz not null default timezone('utc'::text, now()),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint users_role_check check (role in ('owner', 'manager', 'staff', 'accountant')),
  constraint users_status_check check (status in ('active', 'inactive'))
);

create index if not exists users_role_idx on public.users (role);
create index if not exists users_status_idx on public.users (status);
create index if not exists users_joined_at_idx on public.users (joined_at desc);
