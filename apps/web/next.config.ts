import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@gold-shop/constants",
    "@gold-shop/types",
    "@gold-shop/ui",
    "@gold-shop/utils",
    "@gold-shop/validation"
  ]
};

export default nextConfig;

