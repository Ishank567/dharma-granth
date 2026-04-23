import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/dharma-granth' : '';

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  output: isProd ? 'export' : 'standalone',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
