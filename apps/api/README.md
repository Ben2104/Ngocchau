# API App

NestJS API responsible for business rules, validation, reporting, Excel import, and audit logging.

## Key Features

- Supabase JWT verification using JWKS
- Role-aware guards
- Shared API response envelope
- Dashboard metrics starter implementation
- Excel import skeleton with upload, validate, and commit stages
- Audit log support through a dedicated module and repository

## Local Commands

- `pnpm --filter @gold-shop/api start:dev`
- `pnpm --filter @gold-shop/api build`
- `pnpm --filter @gold-shop/api typecheck`

