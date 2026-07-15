import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

loadEnv({
  path: ".env.test",
  override: true,
  quiet: true,
});

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name} in .env.test.`);
  }

  return value;
}

const baseURL = "http://127.0.0.1:3000";

const databaseUrl =
  process.env.PLAYWRIGHT_DATABASE_URL?.trim() ?? process.env.TEST_DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("Missing PLAYWRIGHT_DATABASE_URL or TEST_DATABASE_URL in .env.test.");
}

const testSupabaseUrl = requireEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL");

const testSupabaseAnonKey = requireEnvironmentVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY");

const e2eDatabaseUrl = process.env.PLAYWRIGHT_DATABASE_URL ?? process.env.TEST_DATABASE_URL;

/*
 * Gdy Playwright uruchamia lokalny serwer Next.js, aplikacja
 * oraz test muszą korzystać z tej samej testowej bazy danych.
 */
if (!process.env.PLAYWRIGHT_BASE_URL && e2eDatabaseUrl) {
  process.env.DATABASE_URL = e2eDatabaseUrl;
}

const scenarioTestPattern = "**/scenarios/**/*.spec.ts";

export default defineConfig({
  testDir: "./tests/e2e",

  fullyParallel: true,

  forbidOnly: Boolean(process.env.CI),

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  timeout: 45_000,

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

      testIgnore: scenarioTestPattern,

      use: {
        ...devices["Desktop Chrome"],
      },
    },

    {
      name: "chromium-mobile",

      testIgnore: scenarioTestPattern,

      use: {
        ...devices["Pixel 7"],
      },
    },

    /*
     * Pełny test scenariusza zapisuje postęp w bazie.
     * Jest uruchamiany tylko raz, aby kilka projektów
     * Playwright nie używało równocześnie tego samego konta.
     */
    {
      name: "scenario-chromium",

      testMatch: scenarioTestPattern,

      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  /**
   * Gdy PLAYWRIGHT_BASE_URL nie jest ustawione,
   * Playwright sam uruchamia lokalną aplikację Next.js.
   *
   * Gdy zmienna jest ustawiona, test może działać
   * na istniejącym środowisku testowym.
   */
  ...(process.env.PLAYWRIGHT_BASE_URL
    ? {}
    : {
        webServer: {
          command: "npm run dev",
          url: baseURL,
          reuseExistingServer: false,
          timeout: 120_000,
          stdout: "pipe",
          stderr: "pipe",

          env: {
            ...process.env,

            DATABASE_URL: databaseUrl,
            DIRECT_URL: databaseUrl,

            NEXT_PUBLIC_SUPABASE_URL: testSupabaseUrl,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: testSupabaseAnonKey,

            PLAYWRIGHT_ALLOW_DATABASE_RESET: requireEnvironmentVariable(
              "PLAYWRIGHT_ALLOW_DATABASE_RESET",
            ),

            PLAYWRIGHT_TEST_EMAIL: requireEnvironmentVariable("PLAYWRIGHT_TEST_EMAIL"),

            PLAYWRIGHT_TEST_PASSWORD: requireEnvironmentVariable("PLAYWRIGHT_TEST_PASSWORD"),

            NEXT_PUBLIC_SITE_URL: baseURL,
          },
        },
      }),
});
