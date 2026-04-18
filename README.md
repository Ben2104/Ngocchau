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

1. Fill the local env files that are already scaffolded for this workspace:
   - `.env`
   - `apps/api/.env`
   - `apps/web/.env.local`
2. If you prefer to start from scratch, copy the examples instead:
   - `cp .env.example .env`
   - `cp apps/web/.env.example apps/web/.env.local`
   - `cp apps/api/.env.example apps/api/.env`
3. Replace every `replace-with-*` placeholder with values from a hosted Supabase dev or staging project.
4. Install Node.js 20+ and pnpm 9+.
5. Install dependencies:
   - `pnpm install`
6. Run the apps:
   - `pnpm dev`
   - `pnpm dev:web`
   - `pnpm dev:api`

For the day-to-day local workflow, command examples, and troubleshooting, use [docs/run-app.md](docs/run-app.md).

## Supabase Notes

- The scaffold assumes `auth.users` already exists and user-role mapping is available through `public.users` or `public.profiles`.
- Runtime should point at a hosted Supabase dev or staging project, not production.
- Minimal support migrations are included only for `audit_logs` and `import_sessions`.
- `supabase/config.toml` is included as minimal CLI metadata for this repo. The initial setup is remote-first and does not require `supabase start`.
- Link the repo to your hosted project and inspect migrations with the Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase migration list
npx supabase gen types --linked --lang=typescript --schema public > supabase/types/database.types.ts
```

- The generated type file is imported by both `apps/web` and `apps/api`, so regenerate it whenever the remote schema changes.
- Detailed setup notes, MCP guidance, and verification steps live in `docs/supabase-setup.md`.

## Supabase MCP

- Add a project-scoped, read-only MCP server to `~/.codex/config.toml`.
- Use a dev or staging project only. Gold shop data includes transactions, cashbook, and audit trails, so production access through MCP is intentionally discouraged.
- Recommended URL shape:

```toml
[mcp_servers.supabase]
url = "https://mcp.supabase.com/mcp?project_ref=<your-project-ref>&read_only=true"
```

## Commands

- `pnpm dev`: run web and api with Turbo
- `pnpm build`: build all workspaces
- `pnpm lint`: run workspace lint scripts
- `pnpm typecheck`: run TypeScript checks
- `pnpm test`: run placeholder test commands
- `pnpm vercel:whoami`: verify Vercel token-based CLI auth
- `pnpm vercel:projects`: list Vercel projects with the current token
- `pnpm vercel:deploy:web`: production deploy through the token wrapper

## Vercel Token Workflow

Use a Vercel personal or team token instead of `vercel login` on this machine.

1. Create a token in the Vercel dashboard.
2. Export it only in your current shell:

```bash
export VERCEL_TOKEN=your-token
```

3. Verify auth and project access:

```bash
pnpm vercel:whoami
pnpm vercel:projects
```

4. Link the repo to the target Vercel project from the repo root:

```bash
pnpm vercel:run -- link
```

5. In the Vercel project settings, set the Root Directory to `apps/web` and enable `Include files outside the root directory in the Build Step` so shared workspace packages under `packages/*` are available during the build.
6. Turn off the Build Command override and let the `apps/web` package use its default `build` script. If you keep an explicit install override, use `pnpm install --frozen-lockfile`.
7. Turn off Vercel Git auto-deploy for production so push events do not start a second deploy outside GitHub Actions.
8. Deploy production:

```bash
pnpm vercel:deploy:web
```

- The wrapper script appends `--token` automatically from `VERCEL_TOKEN`.
- `.vercel/` is ignored so local project linkage does not get committed.
- The Vercel project should build from `apps/web`, but it must also include files outside the root directory during the build so workspace packages under `packages/*` remain accessible.
- Do not keep a `buildCommand` override in `vercel.json`; preview deployments should use the Vercel project settings for `apps/web`.
- If Vercel Git auto-deploy stays enabled, Vercel can start a parallel production build on push before the GitHub Actions CI workflow reaches the production deploy jobs.
- Backend runtime still depends on a valid `SUPABASE_SERVICE_ROLE_KEY` in `apps/api/.env`.

## GitHub Actions CI/CD

The repository now uses a single workflow under `.github/workflows`:

- `ci.yml`: runs on every pull request and on pushes to `main`. It detects changed targets, runs `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, boots the compiled backend for a runtime smoke test against `GET /api/v1/auth/status` using staging Supabase secrets, and on `push` to `main` continues into the production deploy jobs for Railway and Vercel.

Deployment behavior:

- Pull requests run verification only and never trigger production deploys.
- Pushes to `main` run the same CI workflow first, then continue into the production deploy jobs.
- The workflow checks changed paths so web-only changes deploy only `apps/web`, API-only changes deploy only `apps/api`, and shared package changes can deploy both.
- Production API deploy must pass a post-deploy Railway healthcheck before any dependent web deploy is allowed to proceed.
- Web production deploy should be owned by `ci.yml`; disable Vercel Git auto-deploy so Vercel does not run a second production deployment in parallel.
- Web-only changes deploy `apps/web` to Vercel.
- API-only changes deploy `apps/api` to Railway.
- Shared package changes can deploy both targets, with web waiting for a healthy API when both deploy.
- Docs-only changes still run CI, but the deploy jobs are skipped.

Required GitHub Actions secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `CI_SUPABASE_URL`
- `CI_SUPABASE_ANON_KEY`
- `CI_SUPABASE_SERVICE_ROLE_KEY`
- `RAILWAY_TOKEN`
- `RAILWAY_PROJECT_ID`
- `RAILWAY_ENVIRONMENT`
- `RAILWAY_SERVICE`
- `RAILWAY_PUBLIC_API_URL`

Important runtime notes:

- Keep production runtime secrets and environment variables in Vercel and Railway. The CI workflow uses staging backend secrets only for pre-deploy runtime smoke checks.
- The backend smoke job derives `SUPABASE_JWT_ISSUER`, `SUPABASE_JWKS_URL`, and `SUPABASE_JWT_AUDIENCE=authenticated` from `CI_SUPABASE_URL`, so those do not need separate GitHub secrets unless your Supabase setup is non-standard.
- The CI workflow still injects safe placeholder public env values so the Next.js build can complete.
- Supabase migrations remain manual in this first version of the pipeline. GitHub Actions does not auto-apply schema changes.

## Current Limitation

This repository can be fully wired only after real Supabase project credentials are supplied. No hosted project ref or keys are stored in git.
