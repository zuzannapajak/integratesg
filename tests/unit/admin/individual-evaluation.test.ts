import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

import type { EvaluationData } from "@/lib/admin/evaluation";
import {
  buildIndividualResponses,
  buildIndividualResponsesCsv,
  filteredIndividualResponses,
  parseIndividualFilters,
} from "@/lib/admin/individual-evaluation";

const fixture: EvaluationData = {
  roles: [{ id: "sensitive-user-id", role: "learner" }],
  participations: [
    {
      userId: "sensitive-user-id",
      track: "wp3_curriculum",
      countryCode: "PL",
      cohortCode: "pilot-one",
      status: "active",
    },
  ],
  curriculum: [
    {
      userId: "sensitive-user-id",
      preAssessmentCompletedAt: new Date("2026-01-01"),
      postAssessmentCompletedAt: null,
      preAssessmentAverageScore: 3,
      postAssessmentAverageScore: null,
      submissions: [
        {
          type: "pre",
          submittedAt: new Date("2026-01-01T12:00:00Z"),
          modulesCompletedBeforeSubmission: 0,
          answers: [
            { valueInt: 3, valueText: "sensitive free text", question: { key: "experience" } },
          ],
        },
      ],
    },
  ],
  courses: [],
  cases: [],
  scenarios: [],
  surveys: [
    {
      surveyType: "wp4_scenarios",
      surveyVersion: 1,
      roundKey: "initial",
      userId: "sensitive-user-id",
      locale: "el",
      countryCode: "CY",
      roleAtSubmission: "learner",
      isPilotAtSubmission: false,
      pilotCohortCode: null,
      answers: {
        incorporationEase: 5,
        challenges: "personal note",
        untrusted: "exclude from export",
        skills: ["systems_thinking"],
      },
      activitySnapshot: { scenariosCompleted: 1, completedScenarioIds: ["private-id"] },
      submittedAt: new Date("2026-01-03T12:00:00Z"),
    },
  ],
};

describe("individual evaluation browsing and filtered export", () => {
  it("keeps country separate from locale and includes historical PRE", () => {
    const rows = buildIndividualResponses(fixture);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      surveyType: "wp4_scenarios",
      countryCode: "CY",
      locale: "el",
      group: "standard",
    });
    expect(rows[1]).toMatchObject({ surveyType: "wp3_pre", countryCode: "PL", group: "pilot" });
  });

  it("applies country/type/group filters equally to table and CSV", () => {
    const filters = parseIndividualFilters(
      new URLSearchParams("country=CY&survey=wp4_scenarios&group=standard"),
    );
    const filtered = filteredIndividualResponses(buildIndividualResponses(fixture), filters);
    expect(filtered).toHaveLength(1);
    const csv = buildIndividualResponsesCsv(filtered);
    expect(csv).toContain('"CY"');
    expect(csv).not.toContain('"PL"');
    expect(csv).not.toContain("sensitive-user-id");
    expect(csv).not.toContain("personal note");
    expect(csv).not.toContain("private-id");
    expect(csv).not.toContain("untrusted");
    expect(buildIndividualResponsesCsv(filtered, true)).toContain("personal note");
  });

  it("rejects malformed filters and escapes spreadsheet formula-like values", () => {
    const filters = parseIndividualFilters(
      new URLSearchParams("country=PL,DE&survey=malicious&page=999999999"),
    );
    expect(filters).toMatchObject({ country: "all", survey: "all", page: 1 });
    const rows = buildIndividualResponses(fixture);
    expect(buildIndividualResponsesCsv(rows)).not.toContain("sensitive free text");
    const injected = rows.map((row) => ({ ...row, cohortCode: "=1+1" }));
    expect(buildIndividualResponsesCsv(injected)).toContain('"\'=1+1"');
  });
});
