import { afterAll, describe, expect, it } from "vitest";

import { buildEvaluationResponsesCsv } from "@/lib/admin/evaluation-export";
import { buildEvaluationReport, loadEvaluationData } from "@/lib/admin/evaluation";
import { prisma } from "@/lib/prisma";
import {
  cleanupDatabaseFixtures,
  createCaseStudy,
  createProfile,
  unique,
} from "../database/fixtures";

describe("WP3/WP4 evaluation reporting (test database only)", () => {
  afterAll(cleanupDatabaseFixtures);

  it("reads real pilot membership and anonymous WP4 answers", async () => {
    const user = await createProfile("learner");
    const caseStudy = await createCaseStudy(unique("evaluation-case"));
    const cohort = unique("pilot-evaluation");
    await prisma.pilotParticipation.create({
      data: { userId: user.id, track: "wp4_case_studies", countryCode: "PL", cohortCode: cohort },
    });
    await prisma.userCaseStudyProgress.create({
      data: {
        userId: user.id,
        caseStudyId: caseStudy.id,
        status: "completed",
        completedAt: new Date(),
      },
    });
    await prisma.surveySubmission.create({
      data: {
        userId: user.id,
        surveyType: "wp4_case_studies",
        surveyVersion: 1,
        roundKey: "initial",
        locale: "el",
        countryCode: "PL",
        roleAtSubmission: "learner",
        isPilotAtSubmission: true,
        pilotCohortCode: cohort,
        answers: {
          engagementEase: 5,
          greenTransitionUnderstanding: 4,
          esgEcosystemUnderstanding: 3,
          skills: ["systems_thinking"],
          challenges: "private respondent text",
        },
        activitySnapshot: {
          caseStudiesStarted: 1,
          caseStudiesCompleted: 1,
          completedCaseStudyIds: [caseStudy.id],
        },
      },
    });
    const data = await loadEvaluationData();
    const report = buildEvaluationReport(data);
    const row = report.rows.find(
      (item) => item.area === "wp4_case_studies" && item.cohortCode === cohort,
    );
    expect(row).toMatchObject({
      group: "pilot",
      countryCode: "PL",
      participants: 1,
      respondents: 1,
      contentResponses: 1,
      materialsCompleted: 1,
      averageContent: 4,
    });
    // Locale (el) is deliberately different from participant country (PL).
    const csv = buildEvaluationResponsesCsv(data);
    expect(csv).toContain('"el"');
    expect(csv).not.toContain(user.id);
    expect(csv).not.toContain(user.email);
    expect(csv).not.toContain("private respondent text");
  });
});
