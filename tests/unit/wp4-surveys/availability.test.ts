import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));
vi.mock("@/lib/wp4-surveys/activity", () => ({ getWp4ActivitySnapshot: vi.fn() }));

import { getWp4ActivitySnapshot } from "@/lib/wp4-surveys/activity";
import { getWp4SurveyAvailability } from "@/lib/wp4-surveys/queries";

type Db = NonNullable<Parameters<typeof getWp4SurveyAvailability>[2]>;

function db(role: string, submitted = false): Db {
  return {
    profile: { findUnique: vi.fn().mockResolvedValue({ role }) },
    surveySubmission: {
      findUnique: vi.fn().mockResolvedValue(submitted ? { submittedAt: new Date() } : null),
    },
    pilotParticipation: { findFirst: vi.fn().mockResolvedValue(null) },
  } as unknown as Db;
}

const emptyActivity = {
  caseStudiesStarted: 0,
  caseStudiesCompleted: 0,
  scenariosStarted: 0,
  scenariosCompleted: 0,
  startedCaseStudyIds: [],
  completedCaseStudyIds: [],
  startedScenarioIds: [],
  completedScenarioIds: [],
  countingRule: "unique_published_case_studies_and_current_scenarios_v1",
};

describe("WP4 Scenarios survey availability on the completion screen", () => {
  it("offers the survey to learners and educators immediately after their first completion", async () => {
    vi.mocked(getWp4ActivitySnapshot).mockResolvedValue(emptyActivity);
    for (const role of ["learner", "educator"]) {
      const availability = await getWp4SurveyAvailability("test-user", "scenarios", db(role));
      expect(availability.eligible).toBe(false);
      expect(availability.canOfferOnCompletion).toBe(true);
    }
  });

  it("does not offer the survey twice or to an admin", async () => {
    vi.mocked(getWp4ActivitySnapshot).mockResolvedValue(emptyActivity);
    const submitted = await getWp4SurveyAvailability("test-user", "scenarios", db("learner", true));
    const admin = await getWp4SurveyAvailability("test-user", "scenarios", db("admin"));
    expect(submitted.canOfferOnCompletion).toBe(false);
    expect(admin.canOfferOnCompletion).toBe(false);
  });
});
