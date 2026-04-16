# Supabase Assumptions

## Identity

- `auth.users` is the source of identity.
- The application role map exists in `public.users` or `public.profiles`.
- The effective role is not trusted solely from JWT claims.
- Runtime setup should target a hosted Supabase dev or staging project before any production project.

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

## MCP Safety

- Supabase MCP should be scoped to a single non-production project.
- Supabase MCP should default to `read_only=true`.
- Schema changes still go through reviewed SQL migrations instead of MCP write access.
