import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

import { getWp4PlatformFeedbackEligibility } from "@/lib/platform-feedback/wp4-eligibility";

type DB = NonNullable<Parameters<typeof getWp4PlatformFeedbackEligibility>[1]>;

type Track = "wp4_case_studies" | "wp4_scenarios";

function db(
  options: {
    role?: string;
    tracks?: Track[];
    submitted?: string[];
    alreadySubmitted?: boolean;
    differentCohorts?: boolean;
  } = {},
) {
  const tracks = options.tracks ?? ["wp4_case_studies", "wp4_scenarios"];
  return {
    profile: { findUnique: vi.fn().mockResolvedValue({ role: options.role ?? "educator" }) },
    pilotParticipation: {
      findMany: vi.fn().mockResolvedValue(
        tracks.map((track, index) => ({
          track,
          cohortCode: options.differentCohorts && index > 0 ? "cohort-2" : "cohort-1",
          countryCode: "PL",
        })),
      ),
    },
    surveySubmission: {
      findMany: vi.fn().mockResolvedValue(
        (options.submitted ?? ["wp4_case_studies", "wp4_scenarios"]).map((surveyType) => ({
          surveyType,
        })),
      ),
      findUnique: vi.fn().mockResolvedValue(options.alreadySubmitted ? { id: "previous" } : null),
    },
  };
}

describe("WP4 platform feedback eligibility", () => {
  it("requires both assigned content surveys and permits one platform questionnaire", async () => {
    const database = db();
    const result = await getWp4PlatformFeedbackEligibility("user-1", database as unknown as DB);
    expect(result).toEqual({
      eligible: true,
      assignment: { cohortCode: "cohort-1", countryCode: "PL" },
    });
    expect(database.surveySubmission.findUnique).toHaveBeenCalledWith({
      where: {
        userId_surveyType_roundKey: {
          userId: "user-1",
          surveyType: "platform_wp4",
          roundKey: "cohort-1",
        },
      },
      select: { id: true },
    });
  });
  it("does not block a Case Studies-only pilot because Scenarios is not assigned", async () => {
    const result = await getWp4PlatformFeedbackEligibility(
      "user-1",
      db({
        role: "learner",
        tracks: ["wp4_case_studies"],
        submitted: ["wp4_case_studies"],
      }) as unknown as DB,
    );
    expect(result.eligible).toBe(true);
  });
  it("allows learners in Scenarios-only and joint WP4 pilots after evaluation", async () => {
    const trackSets: Track[][] = [["wp4_scenarios"], ["wp4_case_studies", "wp4_scenarios"]];
    for (const tracks of trackSets) {
      const result = await getWp4PlatformFeedbackEligibility(
        "user-1",
        db({ role: "learner", tracks }) as unknown as DB,
      );
      expect(result.eligible).toBe(true);
    }
  });
  it("blocks missing questionnaires, duplicate, invalid role and conflicting cohorts", async () => {
    for (const options of [
      { submitted: ["wp4_case_studies"] },
      { alreadySubmitted: true },
      { role: "admin" },
      { tracks: [] },
      { differentCohorts: true },
    ]) {
      const result = await getWp4PlatformFeedbackEligibility(
        "user-1",
        db(options) as unknown as DB,
      );
      expect(result.eligible).toBe(false);
    }
  });
});
