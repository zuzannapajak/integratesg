import { describe, expect, it } from "vitest";

import {
  APP_ROLES,
  canAccessCurriculum,
  canAccessStats,
  getDefaultProtectedRoute,
  isSelfServiceRole,
} from "@/lib/auth/roles";

describe("auth role policy", () => {
  it("recognises learner and educator as self-service roles but not admin", () => {
    expect(isSelfServiceRole(APP_ROLES.learner)).toBe(true);
    expect(isSelfServiceRole(APP_ROLES.educator)).toBe(true);
    expect(isSelfServiceRole(APP_ROLES.admin)).toBe(false);
    expect(isSelfServiceRole("unknown")).toBe(false);
  });

  it("keeps curriculum educator-only", () => {
    expect(canAccessCurriculum(APP_ROLES.learner)).toBe(false);
    expect(canAccessCurriculum(APP_ROLES.educator)).toBe(true);
    expect(canAccessCurriculum(APP_ROLES.admin)).toBe(false);
  });

  it("keeps admin statistics admin-only", () => {
    expect(canAccessStats(APP_ROLES.learner)).toBe(false);
    expect(canAccessStats(APP_ROLES.educator)).toBe(false);
    expect(canAccessStats(APP_ROLES.admin)).toBe(true);
  });

  it("returns a locale-preserving default route for every role", () => {
    expect(getDefaultProtectedRoute("pl", APP_ROLES.learner)).toBe("/pl/dashboard");

    expect(getDefaultProtectedRoute("de", APP_ROLES.educator)).toBe("/de/curriculum");

    expect(getDefaultProtectedRoute("it", APP_ROLES.admin)).toBe("/it/admin/stats");
  });
});
