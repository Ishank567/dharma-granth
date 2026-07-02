/** @type {import('next').NextConfig} */
// Base path for subdirectory deploys (e.g. GitHub Pages project sites served
// from /<repo>). Set via NEXT_PUBLIC_BASE_PATH in CI; empty for root/local.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: basePath,
  assetPrefix: basePath || undefined,
  // Emit directory-style pages (practice/index.html instead of practice.html)
  // so URLs typed with a trailing slash also resolve on GitHub Pages.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
