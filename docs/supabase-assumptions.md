# Supabase Assumptions

## Identity

- `auth.users` is the source of identity.
- The application role map exists in `public.users` or `public.profiles`.
- The effective role is not trusted solely from JWT claims.

## Existing Tables

The scaffold assumes existing business tables for:

- employees
- products
- inventory
- transactions
- cashbook entries

The exact column names can be adapted through environment variables in `apps/api/.env`.

## Support Tables

Two support tables are included as safe optional migrations:

- `audit_logs`
- `import_sessions`

They use `create table if not exists` so they can coexist with an already provisioned schema.

## Storage

- Excel uploads are expected in the `excel-imports` storage bucket.
- The API uploads and downloads files through the Supabase service role.

