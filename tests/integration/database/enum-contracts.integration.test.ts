import { describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";

async function readEnum(enumName: string) {
  const rows = await prisma.$queryRaw<Array<{ enumlabel: string }>>`
    SELECT enum_value.enumlabel
    FROM pg_enum AS enum_value
    INNER JOIN pg_type AS enum_type
      ON enum_type.oid = enum_value.enumtypid
    WHERE enum_type.typname = ${enumName}
    ORDER BY enum_value.enumsortorder
  `;

  return rows.map((row) => row.enumlabel);
}

describe("database enum contracts", () => {
  it("matches every PostgreSQL enum used by the Prisma schema", async () => {
    const expectedEnums: Record<string, readonly string[]> = {
      CurriculumPilotStatus: ["pre_prompt_shown", "pre_skipped", "pilot_active", "pilot_completed"],
      CurriculumPilotAssessmentType: ["pre", "post"],
      CurriculumPilotQuestionType: ["likert", "single_choice", "open_text"],
      UserRole: ["educator", "learner", "admin"],
      PublicationStatus: ["draft", "published"],
      QuizType: ["pre", "post"],
      CourseAttemptStatus: ["not_started", "in_progress", "completed", "failed"],
      CourseArea: [
        "environmental",
        "social",
        "governance",
        "cross_cutting",
        "strategy",
        "reporting",
      ],
      CourseDifficulty: ["foundation", "intermediate"],
      CourseStage: ["overview", "pre_quiz", "lessons", "post_quiz", "completed"],
      ScenarioAttemptStatus: ["incomplete", "completed"],
      CaseStudyProgressStatus: ["not_started", "in_progress", "completed"],
    };

    for (const [enumName, expectedValues] of Object.entries(expectedEnums)) {
      await expect(readEnum(enumName), enumName).resolves.toEqual(expectedValues);
    }
  });
});
