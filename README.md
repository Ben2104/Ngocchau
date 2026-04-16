# Gold Shop System

Production-ready Turborepo scaffold for a Vietnamese gold shop management system built with Next.js, NestJS, and Supabase.

## Workspace Overview

```text
apps/
  api/      NestJS business API
  web/      Next.js App Router dashboard
packages/
  constants/
  types/
  ui/
  utils/
  validation/
supabase/
  migrations/
  types/
docs/
```

## Core Architecture

- `apps/web` handles UI, authentication state, and API consumption.
- `apps/api` owns business rules, validation, reporting, Excel import, and audit logging.
- Supabase provides PostgreSQL, Auth, and Storage.
- Shared contracts live in workspace packages to keep frontend and backend aligned.

## Environment Setup

1. Copy the example env files:
   - `cp .env.example .env`
   - `cp apps/web/.env.example apps/web/.env.local`
   - `cp apps/api/.env.example apps/api/.env`
2. Install Node.js 20+ and pnpm 9+.
3. Install dependencies:
   - `pnpm install`
4. Run the apps:
   - `pnpm dev`
   - `pnpm dev:web`
   - `pnpm dev:api`

## Supabase Notes

- The scaffold assumes `auth.users` already exists and user-role mapping is available through `public.users` or `public.profiles`.
- Minimal support migrations are included only for `audit_logs` and `import_sessions`.
- Replace the placeholder type file at `supabase/types/database.types.ts` by generating types from Supabase:

```bash
supabase gen types typescript --project-id your-project-ref --schema public > supabase/types/database.types.ts
```

## Commands

- `pnpm dev`: run web and api with Turbo
- `pnpm build`: build all workspaces
- `pnpm lint`: run workspace lint scripts
- `pnpm typecheck`: run TypeScript checks
- `pnpm test`: run placeholder test commands

## Current Limitation

This repository was scaffolded in an environment where `node` and `pnpm` were not available on `PATH`, so dependency installation and runtime verification still need to be executed after the toolchain is installed locally.

