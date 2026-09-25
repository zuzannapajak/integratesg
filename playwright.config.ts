import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

loadEnv({
  path: ".env.test",
  // W CI wartości z GitHub Secrets mają pierwszeństwo przed lokalnym .env.test.
  override: !process.env.CI,
  quiet: true,
});

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}. Configure it in .env.test locally or as a CI secret.`);
  }

  return value;
}

const baseURL = "http://127.0.0.1:3000";

const configuredWebServerCommand = process.env.PLAYWRIGHT_SERVER_COMMAND?.trim();

const webServerCommand =
  configuredWebServerCommand && configuredWebServerCommand.length > 0
    ? configuredWebServerCommand
    : "npm run dev";

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
const eportfolioTestPattern = "**/eportfolio/**/*.spec.ts";
const curriculumTestPattern = "**/curriculum/**/*.spec.ts";
const statefulTestPatterns = [scenarioTestPattern, eportfolioTestPattern, curriculumTestPattern];

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

      testIgnore: statefulTestPatterns,

      use: {
        ...devices["Desktop Chrome"],
      },
    },

    {
      name: "chromium-mobile",

      testIgnore: statefulTestPatterns,

      use: {
        ...devices["Pixel 7"],
      },
    },

    /*
     * Testy scenariusza zapisują postęp w bazie.
     * Są uruchamiane osobno i jednym workerem.
     */
    {
      name: "scenario-chromium",

      testMatch: scenarioTestPattern,

      use: {
        ...devices["Desktop Chrome"],
      },
    },

    /*
     * ePortfolio również zapisuje postęp użytkownika.
     * Osobny projekt zapobiega uruchamianiu tego samego flow
     * równolegle w projektach smoke desktop/mobile.
     */
    {
      name: "eportfolio-chromium",

      testMatch: eportfolioTestPattern,

      use: {
        ...devices["Desktop Chrome"],
      },
    },

    /*
     * Curriculum zapisuje postęp w tej samej dedykowanej bazie E2E.
     * Osobne projekty wykonują ten sam stateful flow na desktopie i mobile.
     */
    {
      name: "curriculum-chromium",

      testMatch: curriculumTestPattern,

      use: {
        ...devices["Desktop Chrome"],
      },
    },

    {
      name: "curriculum-mobile",

      testMatch: curriculumTestPattern,

      use: {
        ...devices["Pixel 7"],
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
          command: webServerCommand,
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
