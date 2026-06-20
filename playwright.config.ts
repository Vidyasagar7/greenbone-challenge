import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Run tests in parallel within each file
  fullyParallel: true,

  // Fail the build on CI if test.only is accidentally left in
  forbidOnly: !!process.env.CI,

  // Retry on CI to reduce flakiness from network variance
  retries: process.env.CI ? 2 : 0,

  // Limit workers on CI to reduce load; unlimited locally
  workers: process.env.CI ? 1 : undefined,

  reporter: [['html', { open: 'never' }], ['list']],

  timeout: 90000,
  expect: {
    timeout: 60000,
  },
  use: {
    // All tests target the Sauce Labs demo app
    baseURL: 'https://www.saucedemo.com',

    // saucedemo uses data-test="..." rather than the Playwright default data-testid
    testIdAttribute: 'data-test',

    // Collect trace on first retry to aid debugging
    trace: 'on-first-retry',

    // Screenshot on failure for visibility
    screenshot: 'only-on-failure',

    navigationTimeout: 60000,
    actionTimeout: 60000,
  },

  projects: [
    {
      // Primary: Chromium — the most widely used browser and best supported by Playwright
      name: 'chromium',
      // Only match spec files directly in tests/ — the tests/api/ subdirectory is
      // handled by the api project below so it gets the correct baseURL.
      testMatch: '**/tests/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to add cross-browser coverage:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },

    {
      // API tests use Playwright's request fixture (no browser process spawned).
      // The baseURL here overrides the global one so every client call in
      // tests/api/ resolves against JSONPlaceholder automatically.
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
      },
    },
  ],
});
