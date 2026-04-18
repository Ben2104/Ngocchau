# Vercel Token Deploy

Use this workflow when `vercel login` via browser/device flow gets stuck on `Verifying...`.

## Preconditions

- You have a Vercel token created from the correct account or team.
- You are working from the repository root.
- The Vercel project uses `apps/web` as its Root Directory and enables `Include files outside the root directory in the Build Step` so workspace packages under `packages/*` remain available.

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

In the Vercel dashboard, use `apps/web` as the Root Directory, enable `Include files outside the root directory in the Build Step`, and let the project use the default `build` script from `apps/web/package.json`. If you keep an install override, use:

```bash
pnpm install --frozen-lockfile
```

If GitHub Actions owns production deploys, disable Vercel Git auto-deploy for this project. Otherwise Vercel can start a separate production build on push before the single `ci.yml` workflow reaches the production deploy jobs.

## Notes

- `.vercel/` stays local and is ignored by git.
- This only solves Vercel authentication. It does not fix backend credentials.
- Do not set a `buildCommand` override in `vercel.json`; preview deployments should follow the Vercel project settings for `apps/web`.
- Keep `Include files outside the root directory in the Build Step` enabled, or shared packages like `@gold-shop/ui` may fail to resolve during the build.
- The current backend still requires a valid `SUPABASE_SERVICE_ROLE_KEY` before the full MVP can be verified end-to-end.
