import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  transpilePackages: [
    "@gold-shop/constants",
    "@gold-shop/types",
    "@gold-shop/ui",
    "@gold-shop/utils",
    "@gold-shop/validation"
  ]
};

export default nextConfig;
