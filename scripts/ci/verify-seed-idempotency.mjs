import { spawnSync } from "node:child_process";
import process from "node:process";

import pg from "pg";

const { Client } = pg;

const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();

if (!connectionString) {
  throw new Error("Missing DIRECT_URL or DATABASE_URL for the seed idempotency check.");
}

const ignoredTables = new Set(
  (process.env.SEED_IDEMPOTENCY_IGNORE_TABLES ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

function runSeed() {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npmCommand, ["run", "db:seed"], {
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Seed command failed with exit code ${result.status ?? "unknown"}.`);
  }
}

async function tableCounts(client) {
  const tableResult = await client.query(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename <> '_prisma_migrations'
    ORDER BY tablename
  `);

  const counts = {};

  for (const { tablename } of tableResult.rows) {
    if (ignoredTables.has(tablename)) {
      continue;
    }

    const safeTableName = String(tablename).replaceAll('"', '""');
    const countResult = await client.query(
      `SELECT COUNT(*)::bigint AS count FROM "public"."${safeTableName}"`,
    );

    counts[tablename] = Number(countResult.rows[0].count);
  }

  return counts;
}

function countDifferences(before, after) {
  const tables = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();

  return tables
    .filter((table) => before[table] !== after[table])
    .map((table) => ({
      table,
      afterFirstSeed: before[table] ?? 0,
      afterSecondSeed: after[table] ?? 0,
    }));
}

const client = new Client({ connectionString });

try {
  console.log("Running seed on the freshly migrated test database...");
  runSeed();

  await client.connect();
  const afterFirstSeed = await tableCounts(client);

  console.log("Running seed a second time to verify idempotency...");
  runSeed();

  const afterSecondSeed = await tableCounts(client);
  const differences = countDifferences(afterFirstSeed, afterSecondSeed);

  if (differences.length > 0) {
    console.error("Seed changed row counts on the second run:");
    console.table(differences);
    process.exitCode = 1;
  } else {
    console.log("Seed idempotency check passed: row counts did not change on the second run.");
  }
} finally {
  await client.end().catch(() => undefined);
}
