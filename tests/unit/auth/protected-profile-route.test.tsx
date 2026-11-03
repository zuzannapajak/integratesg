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

vi.mock("@/components/layout/app-sidebar", () => ({ default: () => null }));
vi.mock("@/components/layout/protected-navbar", () => ({ default: () => null }));
vi.mock("@/components/platform-feedback/platform-feedback-bubble", () => ({
  default: () => null,
}));

import ProtectedOverviewLayout from "@/app/[locale]/(protected)/layout";

beforeEach(() => {
  vi.clearAllMocks();
  authMocks.createClient.mockResolvedValue({ auth: { getUser: authMocks.getUser } });
  prismaMocks.findUnique.mockResolvedValue(null);
});

describe("protected route profile recovery", () => {
  it("redirects authenticated users missing a profile to profile completion", async () => {
    authMocks.getUser.mockResolvedValue({
      data: { user: { id: "new-user", email: "new@example.test" } },
    });

    await expect(
      ProtectedOverviewLayout({
        params: Promise.resolve({ locale: "en" }),
        children: null,
      }),
    ).rejects.toThrow("NEXT_REDIRECT:/en/auth/complete-profile");
  });

  it("redirects unauthenticated users to login", async () => {
    authMocks.getUser.mockResolvedValue({ data: { user: null } });

    await expect(
      ProtectedOverviewLayout({
        params: Promise.resolve({ locale: "pl" }),
        children: null,
      }),
    ).rejects.toThrow("NEXT_REDIRECT:/pl/auth/login");

    expect(prismaMocks.findUnique).not.toHaveBeenCalled();
  });
});
