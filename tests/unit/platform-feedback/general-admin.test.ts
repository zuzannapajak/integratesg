import { describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({ findLegacy: vi.fn(), findSurveys: vi.fn(), count: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    platformFeedbackSubmission: { findMany: db.findLegacy },
    surveySubmission: { findMany: db.findSurveys, count: db.count },
  },
}));

import { getPlatformFeedbackAdminStats } from "@/lib/admin/platform-feedback";

describe("general feedback in administrator panel", () => {
  it("shows separate general reports without inflating the WP3 pilot rating averages", async () => {
    db.findLegacy.mockResolvedValue([]);
    db.count.mockResolvedValue(1);
    db.findSurveys.mockImplementation(({ where }: { where: { surveyType: string } }) => {
      if (where.surveyType !== "general_platform_feedback") return Promise.resolve([]);
      return Promise.resolve([
        {
          id: "report-one",
          surveyType: "general_platform_feedback",
          locale: "pl",
          roleAtSubmission: "learner",
          submittedAt: new Date("2026-11-14T11:00:00Z"),
          answers: { category: "bug", message: "The button does not work" },
          user: { fullName: "Learner", email: "learner@example.test" },
        },
      ]);
    });

    const result = await getPlatformFeedbackAdminStats();
    expect(result.summary.totalSubmissions).toBe(0);
    expect(result.summary.averageOverallSatisfaction).toBeNull();
    expect(result.generalFeedback.totalSubmissions).toBe(1);
    expect(db.count).toHaveBeenCalledWith({ where: { surveyType: "general_platform_feedback" } });
    expect(result.generalFeedback.rows[0]).toMatchObject({
      role: "learner",
      category: "bug",
      message: "The button does not work",
    });
  });

  it("reports the full count even when only recent feedback rows are loaded", async () => {
    db.findLegacy.mockResolvedValue([]);
    db.findSurveys.mockResolvedValue([]);
    db.count.mockResolvedValue(135);

    const result = await getPlatformFeedbackAdminStats();
    expect(result.generalFeedback.totalSubmissions).toBe(135);
    expect(result.generalFeedback.rows).toEqual([]);
  });
});
