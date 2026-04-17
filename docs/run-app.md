# Run the App

Practical runbook for local development of the gold shop system.

## Prerequisites

- Node.js `20+`
- `pnpm` `9+`
- A non-production Supabase project with valid keys

## Environment Files

Create or verify these local env files:

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

Required files:

- `.env`
- `apps/web/.env.local`
- `apps/api/.env`

Key values to verify before running:

- `apps/web/.env.local`
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1`
  - `NEXT_PUBLIC_SUPABASE_URL=...`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
- `apps/api/.env`
  - `PORT=4000`
  - `APP_ALLOWED_ORIGINS=http://localhost:3000`
  - `SUPABASE_URL=...`
  - `SUPABASE_SERVICE_ROLE_KEY=...`

## Install Dependencies

From the repo root:

```bash
pnpm install
```

## Run Everything

Use this when you want the normal local stack with web, api, and workspace package watchers:

```bash
pnpm dev
```

What this gives you:

- Next.js web app on `http://localhost:3000`
- NestJS API on `http://localhost:4000`
- shared package watchers through Turbo
- an initial API build so workspace runtime packages exist before Nest starts

## Run Only the Web App

Use this when you only need to work on UI or frontend routing and the API is already running elsewhere.

```bash
pnpm dev:web
```

Notes:

- `@gold-shop/web` now runs with Turbopack in development.
- If the page needs backend data, make sure the API is also running at `http://localhost:4000`.

## Run Only the API

Use this when you are working on NestJS modules or backend integration.

```bash
pnpm dev:api
```

The API runs on:

- `http://localhost:4000`
- global prefix: `/api`
- default version prefix: `/v1`

What `pnpm dev:api` also does:

- builds `@gold-shop/types`, `@gold-shop/constants`, `@gold-shop/validation`, and `@gold-shop/utils` first
- starts watchers for those packages
- recompiles the API with `tsc --watch`
- restarts the API runtime when those package outputs change

Example base URL used by the web app:

- `http://localhost:4000/api/v1`

## When to Run What

- Run `pnpm dev` for normal full-stack local testing.
- Run `pnpm dev:web` for UI-only work when the API is already available.
- Run `pnpm dev:api` for backend-only work, API debugging, or when you are editing shared runtime packages used by the API.

## Quick Verification Checklist

After startup:

1. Open `http://localhost:3000/login` and confirm the login page renders.
2. Open `http://localhost:3000/` and confirm it redirects to `/login` or `/dashboard`.
3. Open `http://localhost:3000/api/health` and confirm the response contains `web-ok`.
4. Confirm the API process is listening on port `4000`.
5. Confirm the web env still points to `http://localhost:4000/api/v1`.

## Troubleshooting

### Frontend compiles too long

- Stop the dev server.
- Remove the Next.js cache:

```bash
rm -rf apps/web/.next
```

- Start again with:

```bash
pnpm dev:web
```

Also check:

- `apps/web/.env.local` exists and has valid Supabase values
- `apps/api/.env` exists if the route depends on backend data
- if you use `pnpm dev`, shared package watchers are actually running

### Web starts but data calls fail

- Confirm `apps/api/.env` is present
- Confirm API is running on port `4000`
- Confirm `NEXT_PUBLIC_API_BASE_URL` is `http://localhost:4000/api/v1`
- Confirm `APP_ALLOWED_ORIGINS` includes `http://localhost:3000`

### API starts but auth or Supabase calls fail

- Recheck `SUPABASE_URL`
- Recheck `SUPABASE_ANON_KEY`
- Recheck `SUPABASE_SERVICE_ROLE_KEY`
- Recheck JWT issuer and JWKS values in `apps/api/.env`
