# Railway Deploy

Runbook for the production Railway service that hosts `apps/api`.

## Ownership

- Production deploys should be triggered by the deploy jobs inside `.github/workflows/ci.yml`.
- Disable Railway Git auto-deploy for this service so it does not race against GitHub Actions.
- Railway should build from the repository root using `railway.json`.

## Runtime Shape

- Build command: `pnpm install --frozen-lockfile && pnpm --filter @gold-shop/api build`
- Start command: `node apps/api/dist/main.js`
- Healthcheck path: `/api/v1/auth/status`

The start command runs the compiled NestJS backend directly and avoids relying on `pnpm` at runtime.

## Required Railway Environment Variables

Set these in the Railway service environment:

- `NODE_ENV=production`
- `APP_NAME=Gold Shop System API`
- `APP_TIMEZONE=Asia/Ho_Chi_Minh`
- `APP_ALLOWED_ORIGINS=https://ngocchau.vercel.app`
- `APP_SWAGGER_ENABLED=false`
- `SUPABASE_URL=<hosted-supabase-url>`
- `SUPABASE_ANON_KEY=<supabase-anon-key>`
- `SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>`
- `SUPABASE_JWT_ISSUER=<supabase-auth-issuer-url>`
- `SUPABASE_JWT_AUDIENCE=authenticated`
- `SUPABASE_JWKS_URL=<supabase-jwks-url>`

Optional table and column overrides can stay unset unless the production schema differs from the defaults in `apps/api/.env.example`.

Do not set `PORT` manually unless Railway support asks for it. Railway injects the runtime port automatically.

## Vercel Integration

Set this in the Vercel project for `apps/web`:

- `NEXT_PUBLIC_API_BASE_URL=<railway-public-url>/api/v1`

Example:

```text
NEXT_PUBLIC_API_BASE_URL=https://gold-shop-api.up.railway.app/api/v1
```

This value is used at build time by the Next.js app. Any change to `NEXT_PUBLIC_API_BASE_URL` requires a new Vercel deploy.

## Verification Checklist

After each Railway deploy:

1. Open `<railway-public-url>/api/v1/auth/status` and confirm it returns `200`.
2. Open `https://ngocchau.vercel.app/login`.
3. Log in with a valid account.
4. Confirm the dashboard loads instead of the backend-unavailable fail-close screen.
