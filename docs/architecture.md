# Architecture

## Principles

- Keep the frontend thin and move business rules into NestJS.
- Keep the schema integration adaptable because the shop already has an existing Supabase schema.
- Optimize for a small team that needs explicit names and low cognitive overhead.

## Request Flow

1. The user signs in with Supabase Auth in `apps/web`.
2. The frontend sends the Supabase access token to `apps/api`.
3. NestJS verifies the JWT against Supabase JWKS.
4. NestJS loads the effective role and employee state from application tables.
5. Business modules execute through repositories and integration services.
6. Important mutations write an audit log record.

## Module Boundaries

- `auth`: token verification and current-user resolution.
- `dashboard`: operational metrics for the owner/manager view.
- `transactions`: sales workflow foundation.
- `cashbook`: cash in/out tracking.
- `inventory`: stock visibility and low-stock reporting.
- `excel-import`: upload, validate, and commit pipeline.
- `audit-logs`: immutable operational tracking.

## Shared Packages

- `@gold-shop/types`: cross-app DTOs and domain types.
- `@gold-shop/constants`: route keys, role names, module names, and storage buckets.
- `@gold-shop/validation`: Zod schemas shared across API and web.
- `@gold-shop/utils`: formatting and object helpers.
- `@gold-shop/ui`: reusable Tailwind-driven UI primitives.

