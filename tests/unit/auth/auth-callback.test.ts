// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const supabaseMocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  exchangeCodeForSession: vi.fn(),
  getUser: vi.fn(),
}));

const prismaMocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: supabaseMocks.createClient,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    profile: {
      findUnique: prismaMocks.findUnique,
    },
  },
}));

import { GET } from "@/app/[locale]/(auth)/auth/callback/route";
import { APP_ROLES } from "@/lib/auth/roles";

function callbackRequest(path: string) {
  return new Request(`https://app.example${path}`);
}

function expectHttpRedirect(response: Response, pathname: string) {
  expect(response.status).toBe(303);

  const location = response.headers.get("location");

  expect(location).not.toBeNull();
  expect(new URL(location as string).pathname).toBe(pathname);

  expect(response.headers.get("cache-control")).toBe("no-store, max-age=0");
}

async function expectHtmlRedirect(response: Response, pathname: string) {
  expect(response.status).toBe(200);

  expect(response.headers.get("location")).toBeNull();

  expect(response.headers.get("content-type")).toContain("text/html");

  expect(response.headers.get("cache-control")).toBe("no-store, max-age=0");

  const html = await response.text();

  const targetUrl = new URL(pathname, "https://app.example");

  expect(html).toContain(`<meta http-equiv="refresh" content="0;url=${targetUrl.toString()}" />`);

  expect(html).toContain(`window.location.replace(${JSON.stringify(targetUrl.toString())});`);
}

function mockSupabase(params?: {
  exchangeError?: Error | null;
  user?: {
    id: string;
    email?: string;
  } | null;
  userError?: Error | null;
}) {
  supabaseMocks.exchangeCodeForSession.mockResolvedValue({
    error: params?.exchangeError ?? null,
  });

  supabaseMocks.getUser.mockResolvedValue({
    data: {
      user:
        params && "user" in params
          ? params.user
          : {
              id: "user-123",
              email: "user@example.test",
            },
    },
    error: params?.userError ?? null,
  });

  supabaseMocks.createClient.mockResolvedValue({
    auth: {
      exchangeCodeForSession: supabaseMocks.exchangeCodeForSession,
      getUser: supabaseMocks.getUser,
    },
  });
}

beforeEach(() => {
  vi.stubEnv("APP_BASE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");

  supabaseMocks.createClient.mockReset();
  supabaseMocks.exchangeCodeForSession.mockReset();
  supabaseMocks.getUser.mockReset();
  prismaMocks.findUnique.mockReset();

  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("Supabase auth callback", () => {
  it("redirects a callback without a code to the locale-specific login page", async () => {
    const response = await GET(callbackRequest("/pl/auth/callback"));

    expectHttpRedirect(response, "/pl/auth/login");

    expect(supabaseMocks.createClient).not.toHaveBeenCalled();
    expect(prismaMocks.findUnique).not.toHaveBeenCalled();
  });

  it("redirects to login when exchanging the OAuth code fails", async () => {
    mockSupabase({
      exchangeError: new Error("Code exchange failed"),
    });

    const response = await GET(callbackRequest("/de/auth/callback?code=invalid-code"));

    expectHttpRedirect(response, "/de/auth/login");

    expect(supabaseMocks.exchangeCodeForSession).toHaveBeenCalledWith("invalid-code");

    expect(supabaseMocks.getUser).not.toHaveBeenCalled();
    expect(prismaMocks.findUnique).not.toHaveBeenCalled();
  });

  it("redirects to login when Supabase cannot verify the user", async () => {
    mockSupabase({
      user: null,
      userError: new Error("JWT expired"),
    });

    const response = await GET(callbackRequest("/it/auth/callback?code=valid-code"));

    expectHttpRedirect(response, "/it/auth/login");

    expect(supabaseMocks.exchangeCodeForSession).toHaveBeenCalledWith("valid-code");

    expect(supabaseMocks.getUser).toHaveBeenCalledTimes(1);
    expect(prismaMocks.findUnique).not.toHaveBeenCalled();
  });

  it("redirects to login when the callback returns no authenticated user", async () => {
    mockSupabase({
      user: null,
    });

    const response = await GET(callbackRequest("/bg/auth/callback?code=valid-code"));

    expectHttpRedirect(response, "/bg/auth/login");

    expect(prismaMocks.findUnique).not.toHaveBeenCalled();
  });

  it("redirects an authenticated user without a profile to complete-profile", async () => {
    mockSupabase();

    prismaMocks.findUnique.mockResolvedValue(null);

    const response = await GET(callbackRequest("/el/auth/callback?code=valid-code"));

    expectHttpRedirect(response, "/el/auth/complete-profile");

    expect(prismaMocks.findUnique).toHaveBeenCalledWith({
      where: {
        id: "user-123",
      },
    });
  });

  it("redirects an existing learner to the default route using the preferred locale", async () => {
    mockSupabase();

    prismaMocks.findUnique.mockResolvedValue({
      id: "user-123",
      role: APP_ROLES.learner,
      preferredLanguage: "pl",
    });

    const response = await GET(callbackRequest("/en/auth/callback?code=valid-code"));

    await expectHtmlRedirect(response, "/pl/dashboard");
  });

  it("redirects an existing educator to curriculum using the preferred locale", async () => {
    mockSupabase();

    prismaMocks.findUnique.mockResolvedValue({
      id: "user-123",
      role: APP_ROLES.educator,
      preferredLanguage: "de",
    });

    const response = await GET(callbackRequest("/en/auth/callback?code=valid-code"));

    await expectHtmlRedirect(response, "/de/curriculum");
  });

  it("honours a safe next path after successful authentication", async () => {
    mockSupabase();

    prismaMocks.findUnique.mockResolvedValue({
      id: "user-123",
      role: APP_ROLES.learner,
      preferredLanguage: "pl",
    });

    const response = await GET(
      callbackRequest("/en/auth/callback?code=valid-code&next=%2Fbg%2Feportfolio"),
    );

    await expectHtmlRedirect(response, "/bg/eportfolio");
  });

  it("rejects an external next destination and falls back to the role default", async () => {
    mockSupabase();

    prismaMocks.findUnique.mockResolvedValue({
      id: "user-123",
      role: APP_ROLES.learner,
      preferredLanguage: "pl",
    });

    const response = await GET(
      callbackRequest("/en/auth/callback?code=valid-code&next=https%3A%2F%2Fevil.example%2Fsteal"),
    );

    await expectHtmlRedirect(response, "/pl/dashboard");
  });

  it("falls back to English when the callback path contains an unsupported locale", async () => {
    mockSupabase();

    prismaMocks.findUnique.mockResolvedValue(null);

    const response = await GET(callbackRequest("/xx/auth/callback?code=valid-code"));

    expectHttpRedirect(response, "/en/auth/complete-profile");
  });
});
