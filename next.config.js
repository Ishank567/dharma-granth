/** @type {import('next').NextConfig} */
// Base path for subdirectory deploys (e.g. GitHub Pages project sites served
// from /<repo>). Set via NEXT_PUBLIC_BASE_PATH in CI; empty for root/local.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  experimental: {
    parallelism: 1,
  },
};

module.exports = nextConfig;
