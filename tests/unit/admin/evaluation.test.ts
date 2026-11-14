import { describe, expect, it, vi } from "vitest";

import { buildEvaluationReport, type EvaluationData } from "@/lib/admin/evaluation";
import {
  buildEvaluationResponsesCsv,
  buildEvaluationSummaryCsv,
  csvCell,
} from "@/lib/admin/evaluation-export";

vi.mock("@/lib/prisma", () => ({
  prisma: {},
}));

function fixture(): EvaluationData {
  const date = new Date("2026-11-11T10:00:00.000Z");
  return {
    roles: [
      { id: "educator-1", role: "educator" },
      { id: "learner-2", role: "learner" },
    ],
    participations: [
      {
        userId: "educator-1",
        track: "wp3_curriculum",
        countryCode: "PL",
        cohortCode: "pilot-a",
        status: "active",
      },
      {
        userId: "educator-1",
        track: "wp4_case_studies",
        countryCode: "PL",
        cohortCode: "pilot-a",
        status: "active",
      },
      {
        userId: "educator-1",
        track: "wp4_scenarios",
        countryCode: "PL",
        cohortCode: "pilot-a",
        status: "active",
      },
    ],
    curriculum: [
      {
        userId: "educator-1",
        preAssessmentCompletedAt: date,
        postAssessmentCompletedAt: date,
        preAssessmentAverageScore: 2,
        postAssessmentAverageScore: 4,
        submissions: [
          {
            type: "pre",
            submittedAt: date,
            modulesCompletedBeforeSubmission: 0,
            answers: [{ valueInt: 2, valueText: null, question: { key: "q01" } }],
          },
          {
            type: "post",
            submittedAt: date,
            modulesCompletedBeforeSubmission: 1,
            answers: [{ valueInt: 4, valueText: null, question: { key: "q01" } }],
          },
        ],
      },
    ],
    courses: [
      {
        userId: "educator-1",
        courseId: "course-1",
        status: "completed",
        startedAt: date,
        completedAt: date,
      },
    ],
    cases: [
      {
        userId: "educator-1",
        caseStudyId: "case-1",
        status: "completed",
        startedAt: date,
        lastOpenedAt: date,
        completedAt: date,
      },
      {
        userId: "learner-2",
        caseStudyId: "case-2",
        status: "completed",
        startedAt: date,
        lastOpenedAt: date,
        completedAt: date,
      },
    ],
    scenarios: [
      { userId: "educator-1", scenarioId: "scenario-1", status: "incomplete" },
      { userId: "educator-1", scenarioId: "scenario-1", status: "completed" },
      { userId: "educator-1", scenarioId: "scenario-1", status: "completed" },
    ],
    surveys: [
      {
        userId: "educator-1",
        surveyType: "wp4_case_studies",
        surveyVersion: 1,
        roundKey: "initial",
        locale: "pl",
        countryCode: "PL",
        roleAtSubmission: "educator",
        isPilotAtSubmission: true,
        pilotCohortCode: "pilot-a",
        submittedAt: date,
        answers: {
          engagementEase: 5,
          greenTransitionUnderstanding: 3,
          esgEcosystemUnderstanding: 4,
          skills: ["data_literacy"],
          challenges: '=IMPORTDATA("private")',
        },
        activitySnapshot: { caseStudiesCompleted: 1, completedCaseStudyIds: ["case-1"] },
      },
      {
        userId: "learner-2",
        surveyType: "wp4_case_studies",
        surveyVersion: 1,
        roundKey: "initial",
        locale: "el",
        countryCode: null,
        roleAtSubmission: "learner",
        isPilotAtSubmission: false,
        pilotCohortCode: null,
        submittedAt: date,
        answers: {
          engagementEase: 2,
          greenTransitionUnderstanding: 2,
          esgEcosystemUnderstanding: 2,
          challenges: "A sensitive free-text answer",
        },
        activitySnapshot: { caseStudiesCompleted: 1 },
      },
      {
        userId: "educator-1",
        surveyType: "wp4_scenarios",
        surveyVersion: 1,
        roundKey: "initial",
        locale: "pl",
        countryCode: "PL",
        roleAtSubmission: "educator",
        isPilotAtSubmission: true,
        pilotCohortCode: "pilot-a",
        submittedAt: date,
        answers: { incorporationEase: 5, participantEngagement: 3 },
        activitySnapshot: { scenariosCompleted: 1 },
      },
      {
        userId: "educator-1",
        surveyType: "platform_wp3",
        surveyVersion: 1,
        roundKey: "pilot-a",
        locale: "pl",
        countryCode: "PL",
        roleAtSubmission: "educator",
        isPilotAtSubmission: true,
        pilotCohortCode: "pilot-a",
        submittedAt: date,
        answers: { overallSatisfaction: 5, easeOfUse: 4 },
        activitySnapshot: { modulesCompleted: 1 },
      },
      {
        userId: "educator-1",
        surveyType: "platform_wp4",
        surveyVersion: 1,
        roundKey: "pilot-a",
        locale: "pl",
        countryCode: "PL",
        roleAtSubmission: "educator",
        isPilotAtSubmission: true,
        pilotCohortCode: "pilot-a",
        submittedAt: date,
        answers: { overallSatisfaction: 4 },
        activitySnapshot: { scenariosCompleted: 1 },
      },
    ],
  };
}

describe("evaluation report", () => {
  it("counts users and distinct materials while separating content from platform feedback", () => {
    const report = buildEvaluationReport(fixture());
    expect(report.summary).toMatchObject({
      participants: 2,
      pilotParticipants: 1,
      totalResponses: 7,
      preResponses: 1,
      postResponses: 1,
      contentResponses: 3,
      platformResponses: 2,
      materialsCompleted: 4,
    });
    const wp3 = report.rows.find((row) => row.area === "wp3" && row.group === "pilot");
    expect(wp3).toMatchObject({
      preResponses: 1,
      postResponses: 1,
      platformResponses: 1,
      averagePre: 2,
      averagePost: 4,
      averagePlatform: 5,
    });
    const wp4 = report.rows.find((row) => row.area === "wp4_scenarios");
    expect(wp4).toMatchObject({ materialsStarted: 1, materialsCompleted: 1, averageContent: 4 });
    const standard = report.rows.find(
      (row) => row.area === "wp4_case_studies" && row.group === "standard",
    );
    expect(standard).toMatchObject({ countryCode: null, averageContent: 2, participants: 1 });
  });

  it("exports anonymous ratings and snapshots, with a separate opt-in for free-text fields", () => {
    const data = fixture();
    const standard = buildEvaluationResponsesCsv(data);
    expect(standard).toContain("wp3_pre");
    expect(standard).toContain("wp4_case_studies");
    expect(standard).toContain("caseStudiesCompleted");
    expect(standard).not.toContain("educator-1");
    expect(standard).not.toContain("learner-2");
    expect(standard).not.toContain("A sensitive free-text answer");
    expect(standard).not.toContain("=IMPORTDATA");
    const full = buildEvaluationResponsesCsv(data, { includeText: true });
    expect(full).toContain("A sensitive free-text answer");
    expect(full).toContain("'=IMPORTDATA");
    const aggregate = buildEvaluationSummaryCsv(buildEvaluationReport(data));
    expect(aggregate).toContain("unique_materials_completed");
    expect(aggregate).not.toContain("educator-1");
  });

  it("escapes spreadsheet formula injection and quoted fields", () => {
    expect(csvCell(" =1+2")).toBe('"\' =1+2"');
    expect(csvCell('text "quoted"')).toBe('"text ""quoted"""');
    expect(csvCell("@cmd")).toBe('"\'@cmd"');
  });

  it("excludes administrator test activity from participant statistics", () => {
    const data = fixture();
    data.roles.push({ id: "admin-account", role: "admin" });
    data.courses.push({
      userId: "admin-account",
      courseId: "admin-course",
      status: "completed",
      startedAt: new Date(),
      completedAt: new Date(),
    });
    data.surveys.push({ ...data.surveys[0], userId: "admin-account", roleAtSubmission: "admin" });
    const report = buildEvaluationReport(data);
    expect(report.summary.participants).toBe(2);
    expect(report.summary.materialsCompleted).toBe(4);
    expect(report.summary.totalResponses).toBe(7);
  });

  it("does not count withdrawn membership as a pilot group", () => {
    const data = fixture();
    data.participations = data.participations.map((item) => ({ ...item, status: "withdrawn" }));
    const report = buildEvaluationReport(data);
    expect(report.summary.pilotParticipants).toBe(0);
    expect(
      report.rows.find((row) => row.area === "wp3" && row.group === "standard")?.preResponses,
    ).toBe(1);
  });
});
