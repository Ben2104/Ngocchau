import { spawnSync } from "node:child_process";

const token = process.env.VERCEL_TOKEN?.trim();
const args = process.argv[2] === "--" ? process.argv.slice(3) : process.argv.slice(2);

if (!token) {
  console.error("Missing VERCEL_TOKEN. Export it in the current shell before running Vercel commands.");
  console.error("Example: export VERCEL_TOKEN=your-token");
  process.exit(1);
}

const result = spawnSync("pnpm", ["dlx", "vercel", ...args, "--token", token], {
  stdio: "inherit",
  env: process.env
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
