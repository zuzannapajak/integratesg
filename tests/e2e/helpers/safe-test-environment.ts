/**
 * Runtime barrier for Playwright tests that read/write course progress.
 * The known pilot Supabase project is never a permissible E2E target.
 */
export const FORBIDDEN_E2E_SUPABASE_REFS = ["ysctjfuiytpxmgyapgqj"] as const;

function extractDatabaseRef(url: URL): string | null {
  const match = decodeURIComponent(url.username).match(/^postgres\.([a-z0-9]{12,})$/i);
  if (match) return match[1];
  const hostnameMatch = url.hostname.match(/^db\.([a-z0-9]{12,})\.supabase\.co$/i);
  return hostnameMatch?.[1] ?? null;
}

function extractApiRef(url: URL): string | null {
  const match = url.hostname.match(/^([a-z0-9]{12,})\.supabase\.co$/i);
  return match?.[1] ?? null;
}

export function assertSafeE2EEnvironment(env: NodeJS.ProcessEnv = process.env): void {
  const dbString = env.PLAYWRIGHT_DATABASE_URL?.trim() || env.TEST_DATABASE_URL?.trim();
  const apiString = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const expectedRef = env.PLAYWRIGHT_TEST_PROJECT_REF?.trim();

  if (!dbString || !apiString || !expectedRef) {
    throw new Error(
      "E2E requires PLAYWRIGHT_DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL and PLAYWRIGHT_TEST_PROJECT_REF in .env.test. Never point it at the pilot database.",
    );
  }
  if (env.PLAYWRIGHT_ALLOW_DATABASE_RESET !== "true") {
    throw new Error("Set PLAYWRIGHT_ALLOW_DATABASE_RESET=true only for a disposable E2E database.");
  }
  if (env.PLAYWRIGHT_ISOLATED_DB_ACK !== "DISPOSABLE_TEST_DATABASE") {
    throw new Error(
      "Set PLAYWRIGHT_ISOLATED_DB_ACK=DISPOSABLE_TEST_DATABASE after verifying the dedicated test project.",
    );
  }

  let db: URL;
  let api: URL;
  try {
    db = new URL(dbString);
    api = new URL(apiString);
  } catch {
    throw new Error("Invalid Playwright test database / Supabase URL.");
  }

  const dbRef = extractDatabaseRef(db);
  const apiRef = extractApiRef(api);
  const isLocalDb = ["127.0.0.1", "localhost", "::1", "[::1]"].includes(db.hostname);
  const isLocalApi = ["127.0.0.1", "localhost", "::1", "[::1]"].includes(api.hostname);
  const knownProduction = FORBIDDEN_E2E_SUPABASE_REFS.some((ref) =>
    [expectedRef, dbRef, apiRef].includes(ref),
  );

  if (knownProduction) {
    throw new Error(
      "BLOCKED: The configured Playwright environment references the real pilot Supabase project.",
    );
  }
  if (isLocalDb && isLocalApi && expectedRef === "local") return;
  if (!dbRef || !apiRef || dbRef !== apiRef || dbRef !== expectedRef) {
    throw new Error(
      `E2E DB/API project refs must match PLAYWRIGHT_TEST_PROJECT_REF (got DB=${dbRef ?? "unknown"}, API=${apiRef ?? "unknown"}).`,
    );
  }
}
