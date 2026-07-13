import { config } from "dotenv";

config({
  path: ".env.test",
  quiet: true,
});

config({
  path: ".env.local",
  override: false,
  quiet: true,
});

config({
  path: ".env",
  override: false,
  quiet: true,
});

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error(
    [
      "TEST_DATABASE_URL is not set.",
      "Scenario integration tests require a separate PostgreSQL test database.",
      "Set TEST_DATABASE_URL and run the Prisma migrations before starting the tests.",
    ].join(" "),
  );
}

/*
 * The application Prisma singleton reads DATABASE_URL during module import.
 * Integration tests deliberately replace it with a separate test database URL.
 */
Object.assign(process.env, {
  DATABASE_URL: testDatabaseUrl,
  NODE_ENV: "test",
});
