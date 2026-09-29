import { defineConfig, devices } from '@playwright/test';

/**
 * Browser smoke test of the built site: `npm run build && npm run test:e2e`.
 * Serves dist/ with scripts/serve-dist.mjs, which applies public/_headers
 * (CSP included) the way Cloudflare Pages does.
 */
export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
