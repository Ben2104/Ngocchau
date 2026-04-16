# Vercel Token Deploy

Use this workflow when `vercel login` via browser/device flow gets stuck on `Verifying...`.

## Preconditions

- You have a Vercel token created from the correct account or team.
- You are working from the repository root.
- The Vercel project is configured to install and build from the repository root so workspace packages under `packages/*` are available to `apps/web`.

## Auth

Export the token only in the current shell session:

```bash
export VERCEL_TOKEN=your-token
```

Verify the token before any deploy step:

```bash
pnpm vercel:whoami
pnpm vercel:projects
```

If either command fails, do not continue with linking or deploy.

## Link And Deploy

Link the current repository to the intended Vercel project:

```bash
pnpm vercel:run -- link
```

Common follow-up commands:

```bash
pnpm vercel:run -- env ls
pnpm vercel:deploy:web
```

The wrapper automatically forwards `--token "$VERCEL_TOKEN"` to the Vercel CLI, so the token is never stored in the repo.

In the Vercel dashboard, keep the project rooted at the monorepo and use these commands unless project settings already inherit them from `vercel.json`:

```bash
pnpm install --frozen-lockfile
pnpm --filter @gold-shop/web build
```

## Notes

- `.vercel/` stays local and is ignored by git.
- This only solves Vercel authentication. It does not fix backend credentials.
- Do not configure the project as an isolated `apps/web` checkout, or shared packages like `@gold-shop/ui` may fail to resolve during the build.
- The current backend still requires a valid `SUPABASE_SERVICE_ROLE_KEY` before the full MVP can be verified end-to-end.
