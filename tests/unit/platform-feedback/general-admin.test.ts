import { describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  findLegacy: vi.fn<() => Promise<unknown[]>>(),
  findSurveys: vi.fn<(args: { where: { surveyType: string } }) => Promise<unknown[]>>(),
  count: vi.fn<(args: { where: { surveyType: string } }) => Promise<number>>(),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    platformFeedbackSubmission: { findMany: db.findLegacy },
    surveySubmission: { findMany: db.findSurveys, count: db.count },
  },
}));

import { getPlatformFeedbackAdminStats } from "@/lib/admin/platform-feedback";

describe("general feedback summary privacy", () => {
  it("counts general reports without loading their content or influencing pilot statistics", async () => {
    db.findLegacy.mockResolvedValue([]);
    db.findSurveys.mockResolvedValue([]);
    db.count.mockResolvedValue(135);

    const result = await getPlatformFeedbackAdminStats();
    expect(result.summary.totalSubmissions).toBe(0);
    expect(result.summary.averageOverallSatisfaction).toBeNull();
    expect(result.generalFeedback).toEqual({ totalSubmissions: 135 });
    expect(db.findSurveys).toHaveBeenCalledTimes(1);
    expect(db.findSurveys.mock.calls[0][0].where.surveyType).toBe("platform_wp3");
  });
});
