import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const supabaseMocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  getUser: vi.fn(),
}));

const prismaMocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
}));

const navigationMocks = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
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

vi.mock("next/navigation", () => ({
  redirect: navigationMocks.redirect,
}));

import { requireRole } from "@/features/auth/requireRole";
import { requireAuthenticatedUserId } from "@/lib/auth/require-authenticated-user-id";
import { APP_ROLES } from "@/lib/auth/roles";

function mockSupabaseUser(params: {
  user: { id: string; email?: string } | null;
  error?: Error | null;
}) {
  supabaseMocks.getUser.mockResolvedValue({
    data: {
      user: params.user,
    },
    error: params.error ?? null,
  });

  supabaseMocks.createClient.mockResolvedValue({
    auth: {
      getUser: supabaseMocks.getUser,
    },
  });
}

beforeEach(() => {
  supabaseMocks.createClient.mockReset();
  supabaseMocks.getUser.mockReset();
  prismaMocks.findUnique.mockReset();
  navigationMocks.redirect.mockClear();
});

describe("authentication guards", () => {
  describe("requireAuthenticatedUserId", () => {
    it("returns the authenticated user id", async () => {
      mockSupabaseUser({
        user: {
          id: "user-123",
          email: "learner@example.test",
        },
      });

      await expect(requireAuthenticatedUserId()).resolves.toBe("user-123");

      expect(supabaseMocks.getUser).toHaveBeenCalledTimes(1);
    });

    it("rejects a missing session", async () => {
      mockSupabaseUser({
        user: null,
      });

      await expect(requireAuthenticatedUserId()).rejects.toThrow("Unauthorized");
    });

    it("rejects an expired or invalid session", async () => {
      mockSupabaseUser({
        user: null,
        error: new Error("JWT expired"),
      });

      await expect(requireAuthenticatedUserId()).rejects.toThrow("Unauthorized");
    });
  });

  describe("requireRole", () => {
    it("allows a learner to access learner resources", async () => {
      const user = {
        id: "learner-1",
        email: "learner@example.test",
      };

      const profile = {
        id: user.id,
        role: APP_ROLES.learner,
      };

      mockSupabaseUser({
        user,
      });

      prismaMocks.findUnique.mockResolvedValue(profile);

      await expect(requireRole("en", APP_ROLES.learner)).resolves.toEqual({
        user,
        profile,
      });

      expect(prismaMocks.findUnique).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
      });

      expect(navigationMocks.redirect).not.toHaveBeenCalled();
    });

    it("allows an educator when educator is one of the accepted roles", async () => {
      const user = {
        id: "educator-1",
        email: "educator@example.test",
      };

      const profile = {
        id: user.id,
        role: APP_ROLES.educator,
      };

      mockSupabaseUser({
        user,
      });

      prismaMocks.findUnique.mockResolvedValue(profile);

      await expect(requireRole("en", [APP_ROLES.learner, APP_ROLES.educator])).resolves.toEqual({
        user,
        profile,
      });

      expect(navigationMocks.redirect).not.toHaveBeenCalled();
    });

    it("redirects an unauthenticated user to the locale-specific login page", async () => {
      mockSupabaseUser({
        user: null,
      });

      await expect(requireRole("pl", APP_ROLES.learner)).rejects.toThrow(
        "NEXT_REDIRECT:/pl/auth/login",
      );

      expect(navigationMocks.redirect).toHaveBeenCalledWith("/pl/auth/login");

      expect(prismaMocks.findUnique).not.toHaveBeenCalled();
    });

    it("treats an invalid or expired Supabase session as unauthenticated", async () => {
      mockSupabaseUser({
        user: null,
        error: new Error("JWT expired"),
      });

      await expect(requireRole("de", APP_ROLES.educator)).rejects.toThrow(
        "NEXT_REDIRECT:/de/auth/login",
      );

      expect(navigationMocks.redirect).toHaveBeenCalledWith("/de/auth/login");
    });

    it("redirects a learner away from an educator-only resource", async () => {
      const user = {
        id: "learner-2",
        email: "learner-2@example.test",
      };

      mockSupabaseUser({
        user,
      });

      prismaMocks.findUnique.mockResolvedValue({
        id: user.id,
        role: APP_ROLES.learner,
      });

      await expect(requireRole("it", APP_ROLES.educator)).rejects.toThrow(
        "NEXT_REDIRECT:/it/dashboard",
      );

      expect(navigationMocks.redirect).toHaveBeenCalledWith("/it/dashboard");
    });

    it("redirects when the authenticated user has no application profile", async () => {
      const user = {
        id: "profile-missing",
        email: "missing@example.test",
      };

      mockSupabaseUser({
        user,
      });

      prismaMocks.findUnique.mockResolvedValue(null);

      await expect(requireRole("el", [APP_ROLES.learner, APP_ROLES.educator])).rejects.toThrow(
        "NEXT_REDIRECT:/el/dashboard",
      );

      expect(navigationMocks.redirect).toHaveBeenCalledWith("/el/dashboard");
    });

    it("allows an educator to access educator-only curriculum resources", async () => {
      const user = {
        id: "educator-2",
        email: "educator-2@example.test",
      };

      const profile = {
        id: user.id,
        role: APP_ROLES.educator,
      };

      mockSupabaseUser({
        user,
      });

      prismaMocks.findUnique.mockResolvedValue(profile);

      await expect(requireRole("bg", APP_ROLES.educator)).resolves.toEqual({
        user,
        profile,
      });
    });
  });
});
