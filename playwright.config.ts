import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/e2e",

  fullyParallel: true,

  forbidOnly: Boolean(process.env.CI),

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  timeout: 30_000,

  expect: {
    timeout: 10_000,
  },

  reporter: [
    ["list"],
    [
      "html",
      {
        open: "never",
        outputFolder: "playwright-report",
      },
    ],
  ],

  outputDir: "test-results",

  use: {
    baseURL,

    headless: true,

    trace: "on-first-retry",

    screenshot: "only-on-failure",

    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium-desktop",

      use: {
        ...devices["Desktop Chrome"],
      },
    },

    {
      name: "chromium-mobile",

      use: {
        ...devices["Pixel 7"],
      },
    },
  ],

  /**
   * Gdy PLAYWRIGHT_BASE_URL nie jest ustawione,
   * Playwright sam uruchomi lokalną aplikację Next.js.
   *
   * Gdy zmienna jest ustawiona, testy mogą działać
   * np. na środowisku testowym.
   */
  ...(process.env.PLAYWRIGHT_BASE_URL
    ? {}
    : {
        webServer: {
          command: "npm run dev",
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
});
