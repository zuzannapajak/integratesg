import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const authMocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  getUser: vi.fn(),
}));

const prismaMocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
}));

const navigationMocks = vi.hoisted(() => ({
  redirect: vi.fn((path: string): never => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: authMocks.createClient,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { profile: { findUnique: prismaMocks.findUnique } },
}));

vi.mock("next/navigation", () => ({
  redirect: navigationMocks.redirect,
}));

vi.mock("@/app/[locale]/(auth)/auth/complete-profile/complete-profile-form", () => ({
  default: () => null,
}));

import CompleteProfilePage from "@/app/[locale]/(auth)/auth/complete-profile/page";

beforeEach(() => {
  vi.clearAllMocks();
  authMocks.createClient.mockResolvedValue({ auth: { getUser: authMocks.getUser } });
  prismaMocks.findUnique.mockResolvedValue(null);
});

describe("complete profile after confirming email", () => {
  it("preserves the educator role selected during sign-up", async () => {
    authMocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: "educator-1",
          email: "educator@example.test",
          user_metadata: { role: "educator" },
        },
      },
    });

    const view = await CompleteProfilePage({ params: Promise.resolve({ locale: "en" }) });

    expect(view.props).toMatchObject({
      locale: "en",
      email: "educator@example.test",
      initialRole: "educator",
    });
  });

  it("defaults to learner for missing or invalid metadata", async () => {
    authMocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: "user-2",
          email: "user@example.test",
          user_metadata: { role: "admin" },
        },
      },
    });

    const view = await CompleteProfilePage({ params: Promise.resolve({ locale: "pl" }) });

    expect(view).toMatchObject({ props: { initialRole: "learner" } });
  });

  it("sends unauthenticated users to login", async () => {
    authMocks.getUser.mockResolvedValue({ data: { user: null } });

    await expect(
      CompleteProfilePage({ params: Promise.resolve({ locale: "pl" }) }),
    ).rejects.toThrow("NEXT_REDIRECT:/pl/auth/login");
  });

  it("does not recreate an existing profile", async () => {
    authMocks.getUser.mockResolvedValue({
      data: { user: { id: "user-3", email: "user@example.test" } },
    });
    prismaMocks.findUnique.mockResolvedValue({ id: "user-3", role: "learner" });

    await expect(
      CompleteProfilePage({ params: Promise.resolve({ locale: "de" }) }),
    ).rejects.toThrow("NEXT_REDIRECT:/de/dashboard");
  });
});
