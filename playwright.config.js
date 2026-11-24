// Playwright configuration for post-deploy smoke tests
// Docs: https://playwright.dev/docs/test-configuration

const baseURL = process.env.BASE_URL || 'https://dev.v-15.org';

module.exports = {
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL,
    ignoreHTTPSErrors: /^https:\/\/127\.0\.0\.1(?::\d+)?(?:\/|$)/.test(baseURL),
    headless: true,
  },
};
