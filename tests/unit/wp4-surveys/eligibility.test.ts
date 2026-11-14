import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));
vi.mock("@/lib/wp4-surveys/activity", () => ({ getWp4ActivitySnapshot: vi.fn() }));

import { isWp4SurveyEligible } from "@/lib/wp4-surveys/queries";

describe("WP4 content survey access", () => {
  it("offers Case Studies to regular learners and educators after one completion", () => {
    for (const role of ["learner", "educator"]) {
      expect(
        isWp4SurveyEligible({ scope: "case-studies", role, completed: 1, submitted: false }),
      ).toBe(true);
    }
  });
  it("offers Scenarios questionnaires to learners and educators after completion", () => {
    for (const role of ["learner", "educator"]) {
      expect(
        isWp4SurveyEligible({ scope: "scenarios", role, completed: 1, submitted: false }),
      ).toBe(true);
    }
  });
  it("blocks zero completions, admins and duplicate submissions", () => {
    for (const scope of ["case-studies", "scenarios"] as const) {
      for (const role of ["learner", "educator"]) {
        expect(isWp4SurveyEligible({ scope, role, completed: 0, submitted: false })).toBe(false);
        expect(isWp4SurveyEligible({ scope, role, completed: 2, submitted: true })).toBe(false);
      }
      expect(isWp4SurveyEligible({ scope, role: "admin", completed: 2, submitted: false })).toBe(
        false,
      );
    }
  });
});
