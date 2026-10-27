// @vitest-environment node

import { describe, expect, it } from "vitest";
import { assertSafeE2EEnvironment } from "../../e2e/helpers/safe-test-environment";

const TEST_REF = "e2eabcd123456789abcd";
const OTHER_REF = "different987654321abc";
const PILOT_REF = "ysctjfuiytpxmgyapgqj";

function env(ref = TEST_REF): NodeJS.ProcessEnv {
  return {
    NODE_ENV: "test",
    PLAYWRIGHT_DATABASE_URL: `postgresql://postgres.${ref}:secret@aws-1-eu-central-2.pooler.supabase.com:5432/postgres`,
    NEXT_PUBLIC_SUPABASE_URL: `https://${ref}.supabase.co`,
    PLAYWRIGHT_TEST_PROJECT_REF: ref,
    PLAYWRIGHT_ALLOW_DATABASE_RESET: "true",
    PLAYWRIGHT_ISOLATED_DB_ACK: "DISPOSABLE_TEST_DATABASE",
  };
}

describe("Playwright database isolation guard", () => {
  it("accepts a consistent, explicitly acknowledged disposable project", () => {
    expect(() => { assertSafeE2EEnvironment(env()); }).not.toThrow();
  });

  it("rejects the known live pilot project even with acknowledgment", () => {
    expect(() => { assertSafeE2EEnvironment(env(PILOT_REF)); }).toThrow(/BLOCKED/);
  });

  it("rejects a test URL pointing to the pilot DB with another project ref", () => {
    expect(() => { assertSafeE2EEnvironment({
      ...env(),
      PLAYWRIGHT_DATABASE_URL: env(PILOT_REF).PLAYWRIGHT_DATABASE_URL,
    }); }).toThrow(/BLOCKED/);
  });

  it("rejects a mismatched Supabase API project", () => {
    expect(() => { assertSafeE2EEnvironment({
      ...env(),
      NEXT_PUBLIC_SUPABASE_URL: `https://${OTHER_REF}.supabase.co`,
    }); }).toThrow(/must match/);
  });

  it("fails closed if the DB project ref cannot be extracted", () => {
    expect(() => { assertSafeE2EEnvironment({
      ...env(),
      PLAYWRIGHT_DATABASE_URL: "postgresql://testuser:secret@database.example.com:5432/postgres",
    }); }).toThrow(/must match/);
  });

  it("requires both explicit safety acknowledgments", () => {
    expect(() => { assertSafeE2EEnvironment({
      ...env(), PLAYWRIGHT_ALLOW_DATABASE_RESET: "false",
    }); }).toThrow(/PLAYWRIGHT_ALLOW_DATABASE_RESET/);
    expect(() => { assertSafeE2EEnvironment({
      ...env(), PLAYWRIGHT_ISOLATED_DB_ACK: "",
    }); }).toThrow(/PLAYWRIGHT_ISOLATED_DB_ACK/);
  });

  it("accepts an explicitly acknowledged local Supabase setup", () => {
    expect(() => { assertSafeE2EEnvironment({
      ...env(),
      PLAYWRIGHT_DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      PLAYWRIGHT_TEST_PROJECT_REF: "local",
    }); }).not.toThrow();
  });
});
