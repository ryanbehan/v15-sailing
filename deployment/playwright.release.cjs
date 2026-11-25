const path = require('node:path');
const base = require('../playwright.config');
const { releaseEnvironment } = require('./release-runtime.cjs');

const env = releaseEnvironment();
process.env.BASE_URL = env.BASE_URL;
process.env.WORKER_URL = env.WORKER_URL;

module.exports = {
  ...base,
  testDir: path.resolve(__dirname, '../tests'),
  testMatch: ['**/smoke/*.spec.js', '**/edge/*.spec.js'],
  forbidOnly: true,
  retries: 0,
  workers: 2,
  reporter: [['list'], ['html', { outputFolder: path.resolve(__dirname, '../.wrangler/release/report'), open: 'never' }]],
  outputDir: path.resolve(__dirname, '../.wrangler/release/results'),
  use: { ...base.use, baseURL: env.BASE_URL, ignoreHTTPSErrors: true, trace: 'retain-on-failure' },
  webServer: {
    cwd: path.resolve(__dirname, '..'),
    command: `make serve-worker WORKER_PORT=${env.RELEASE_PORT} WORKER_PROTOCOL=https`,
    url: env.BASE_URL,
    ignoreHTTPSErrors: true,
    reuseExistingServer: false,
    timeout: 60000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    env,
  },
};
