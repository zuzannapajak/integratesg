/**
 * Prisma CLI wrapper that NEVER reads the pilot DB connection from .env.local.
 * Only the isolated .env.test project is eligible, with explicit ref matching.
 *
 * Usage:
 *   node scripts/e2e-prisma.mjs --verify-config
 *   node scripts/e2e-prisma.mjs --status
 *   node scripts/e2e-prisma.mjs --deploy --project-ref=<e2e-ref> --confirm-disposable
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "dotenv";

const BLOCKED_REFS = new Set(["ysctjfuiytpxmgyapgqj"]);
const [operation, ...options] = process.argv.slice(2);
const modes = new Set(["--verify-config", "--status", "--deploy"]);

function fail(message) {
  console.error(`E2E Prisma safety check: ${message}`);
  process.exit(1);
}

if (!modes.has(operation)) {
  fail("Choose --verify-config, --status or --deploy (deployment requires confirmation).");
}

const envPath = resolve(".env.test");
if (!existsSync(envPath))
  fail("Missing .env.test: create a dedicated disposable Supabase project first.");
const testEnv = parse(readFileSync(envPath));
const dbString = (testEnv.PLAYWRIGHT_DATABASE_URL || testEnv.TEST_DATABASE_URL || "").trim();
const apiString = (testEnv.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const projectRef = (testEnv.PLAYWRIGHT_TEST_PROJECT_REF || "").trim();
if (!dbString || !apiString || !projectRef) {
  fail(
    "PLAYWRIGHT_DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL and PLAYWRIGHT_TEST_PROJECT_REF are required in .env.test.",
  );
}
if (
  testEnv.PLAYWRIGHT_ISOLATED_DB_ACK !== "DISPOSABLE_TEST_DATABASE" ||
  testEnv.PLAYWRIGHT_ALLOW_DATABASE_RESET !== "true"
) {
  fail("The disposable project acknowledgment is missing. Never use pilot data for E2E.");
}

let database;
let api;
try {
  database = new URL(dbString);
  api = new URL(apiString);
} catch {
  fail("Invalid test database or Supabase URL.");
}
const directMatch = decodeURIComponent(database.username).match(/^postgres\.([a-z0-9]{12,})$/i);
const hostMatch = database.hostname.match(/^db\.([a-z0-9]{12,})\.supabase\.co$/i);
const dbRef = directMatch?.[1] ?? hostMatch?.[1] ?? null;
const apiRef = api.hostname.match(/^([a-z0-9]{12,})\.supabase\.co$/i)?.[1] ?? null;
const localDb = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(database.hostname);
const localApi = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(api.hostname);
const local = localDb && localApi && projectRef === "local";
if ([projectRef, dbRef, apiRef].some((ref) => ref && BLOCKED_REFS.has(ref))) {
  fail("BLOCKED: requested project is the IntegratESG pilot database.");
}
if (!local && (!dbRef || !apiRef || dbRef !== apiRef || dbRef !== projectRef)) {
  fail(
    `Project refs do not match (DB=${dbRef || "?"}, API=${apiRef || "?"}, expected=${projectRef}).`,
  );
}
if (
  operation === "--deploy" &&
  (!options.includes("--confirm-disposable") || !options.includes(`--project-ref=${projectRef}`))
) {
  fail("Migration requires --confirm-disposable and --project-ref=<the verified E2E project ref>.");
}
if (operation !== "--deploy" && options.length > 0) {
  fail("Unexpected extra options for read-only operation.");
}

console.log(
  `Verified isolated E2E Supabase project: ${projectRef} (${local ? "local" : "remote"}).`,
);
console.log(`Database host: ${database.hostname}; API host: ${api.hostname}.`);
if (operation === "--verify-config") {
  console.log("Configuration check completed. No database connection or writes.");
  process.exit(0);
}

const prismaCli = resolve("node_modules", "prisma", "build", "index.js");
if (!existsSync(prismaCli)) fail("Prisma CLI not found; install project dependencies first.");
// Both variables are overridden so prisma.config.ts cannot use a pilot URL.
const isolatedEnv = {
  ...process.env,
  ...testEnv,
  DATABASE_URL: dbString,
  DIRECT_URL: dbString,
  NEXT_PUBLIC_SUPABASE_URL: apiString,
};
const command = operation === "--deploy" ? "deploy" : "status";
console.log(`Prisma migrate ${command} on the VERIFIED disposable project only.`);
const result = spawnSync(process.execPath, [prismaCli, "migrate", command], {
  cwd: process.cwd(),
  env: isolatedEnv,
  stdio: "inherit",
  windowsHide: true,
});
if (result.error) fail(result.error.message);
process.exit(result.status ?? 1);
