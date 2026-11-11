import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

import {
  getWp3PlatformFeedbackEligibility,
  isWp3PlatformSurveyEligible,
} from "@/lib/platform-feedback/wp3-eligibility";

type DB = NonNullable<Parameters<typeof getWp3PlatformFeedbackEligibility>[1]>;

function database(options: {
  role?: string;
  assignment?: { cohortCode: string; countryCode: string } | null;
  post?: Date | null;
  submitted?: boolean;
} = {}) {
  return {
    profile: { findUnique: vi.fn().mockResolvedValue({ role: options.role ?? "educator" }) },
    pilotParticipation: {
      findFirst: vi.fn().mockResolvedValue(
        options.assignment === undefined
          ? { cohortCode: "round-1", countryCode: "PL" }
          : options.assignment,
      ),
    },
    curriculumPilot: {
      findUnique: vi.fn().mockResolvedValue({
        postAssessmentCompletedAt:
          options.post === undefined ? new Date("2026-11-10T12:00:00Z") : options.post,
      }),
    },
    surveySubmission: {
      findUnique: vi.fn().mockResolvedValue(options.submitted ? { id: "submitted" } : null),
    },
  };
}

describe("WP3 pilot platform feedback", () => {
  it("checks a real pilot assignment, educator role, POST and no earlier submission", () => {
    const assignment = { cohortCode: "round-1", countryCode: "PL" };
    expect(
      isWp3PlatformSurveyEligible({
        role: "educator",
        assignment,
        postSubmitted: true,
        alreadySubmitted: false,
      }),
    ).toBe(true);
    for (const role of ["learner", "admin"]) {
      expect(
        isWp3PlatformSurveyEligible({ role, assignment, postSubmitted: true, alreadySubmitted: false }),
      ).toBe(false);
    }
    expect(
      isWp3PlatformSurveyEligible({ role: "educator", assignment: null, postSubmitted: true, alreadySubmitted: false }),
    ).toBe(false);
  });

  it("passes only the authenticated user's track, cohort and version to the lookup", async () => {
    const db = database();
    const result = await getWp3PlatformFeedbackEligibility("user-1", db as unknown as DB);
    expect(result).toEqual({ eligible: true, assignment: { cohortCode: "round-1", countryCode: "PL" } });
    expect(db.pilotParticipation.findFirst).toHaveBeenCalledWith({
      where: { userId: "user-1", track: "wp3_curriculum", status: "active" },
      select: { cohortCode: true, countryCode: true },
    });
    expect(db.surveySubmission.findUnique).toHaveBeenCalledWith({
      where: {
        userId_surveyType_roundKey: {
          userId: "user-1",
          surveyType: "platform_wp3",
          roundKey: "round-1",
        },
      },
      select: { id: true },
    });
  });

  it("blocks regular users, wrong roles, incomplete POST and duplicates", async () => {
    for (const options of [
      { assignment: null },
      { role: "learner" },
      { post: null },
      { submitted: true },
    ]) {
      const result = await getWp3PlatformFeedbackEligibility("user-1", database(options) as unknown as DB);
      expect(result.eligible).toBe(false);
    }
  });
});
