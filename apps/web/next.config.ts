import path from "node:path";

import type { NextConfig } from "next";

const workspaceRoot = path.join(process.cwd(), "../..");

const nextConfig: NextConfig = {
  transpilePackages: [
    "@gold-shop/ui",
    "@gold-shop/constants",
    "@gold-shop/types",
    "@gold-shop/utils",
    "@gold-shop/validation"
  ],
  outputFileTracingRoot: workspaceRoot,
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@gold-shop/constants": path.join(workspaceRoot, "packages/constants/src/index.ts"),
      "@gold-shop/types": path.join(workspaceRoot, "packages/types/src/index.ts"),
      "@gold-shop/ui": path.join(workspaceRoot, "packages/ui/src/index.ts"),
      "@gold-shop/utils": path.join(workspaceRoot, "packages/utils/src/index.ts"),
      "@gold-shop/validation": path.join(workspaceRoot, "packages/validation/src/index.ts")
    };

    return config;
  }
};

export default nextConfig;
