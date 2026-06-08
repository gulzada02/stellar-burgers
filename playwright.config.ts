import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 10000
  },
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4000',
    actionTimeout: 10000,
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    }
  ],
  testMatch: /.*\.pl\.tsx$/,
  webServer: {
    command: 'npm start',
    port: 4000,
    reuseExistingServer: true
  }
};

export default config;
