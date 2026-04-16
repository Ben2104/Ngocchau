import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@gold-shop/ui",
    "@gold-shop/constants",
    "@gold-shop/types",
    "@gold-shop/utils",
    "@gold-shop/validation"
  ],
  outputFileTracingRoot: path.join(process.cwd(), "../..")
};

export default nextConfig;
