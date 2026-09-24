import { afterEach, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";
import {
  cleanupDatabaseFixtures,
  createCaseStudy,
  createCourse,
  createProfile,
  createScenarioAttempt,
  unique,
} from "./fixtures";

type UniqueIndexRow = {
  tableName: string;
  columns: string;
};

type ForeignKeyRow = {
  tableName: string;
  columnName: string;
  referencedTable: string;
  referencedColumn: string;
  deleteAction: string;
};

function uniqueKey(tableName: string, columns: readonly string[]) {
  return `${tableName}:${columns.join(",")}`;
}

async function expectUniqueViolation(operation: Promise<unknown>) {
  await expect(operation).rejects.toMatchObject({
    code: "P2002",
  });
}

async function expectForeignKeyViolation(operation: Promise<unknown>) {
  await expect(operation).rejects.toMatchObject({
    code: "P2003",
  });
}

afterEach(cleanupDatabaseFixtures);

describe("database schema constraints", () => {
  it("contains every application-level unique key declared by the Prisma schema", async () => {
    const rows = await prisma.$queryRaw<UniqueIndexRow[]>`
      SELECT
        table_relation.relname::text AS "tableName",
        string_agg(
          attribute.attname::text,
          ','
          ORDER BY index_column.ordinality
        ) AS "columns"
      FROM pg_index AS index_definition
      INNER JOIN pg_class AS table_relation
        ON table_relation.oid = index_definition.indrelid
      INNER JOIN pg_namespace AS namespace
        ON namespace.oid = table_relation.relnamespace
      CROSS JOIN LATERAL unnest(index_definition.indkey::smallint[])
        WITH ORDINALITY AS index_column(attnum, ordinality)
      INNER JOIN pg_attribute AS attribute
        ON attribute.attrelid = table_relation.oid
       AND attribute.attnum = index_column.attnum
      WHERE namespace.nspname = 'public'
        AND index_definition.indisunique = TRUE
        AND index_definition.indisprimary = FALSE
      GROUP BY table_relation.relname, index_definition.indexrelid
    `;

    const actualKeys = new Set(rows.map((row) => uniqueKey(row.tableName, row.columns.split(","))));

    const expectedKeys = [
      uniqueKey("Profile", ["email"]),
      uniqueKey("CaseStudy", ["slug"]),
      uniqueKey("CaseStudyTranslation", ["caseStudyId", "language"]),
      uniqueKey("UserCaseStudyProgress", ["userId", "caseStudyId"]),
      uniqueKey("Course", ["slug"]),
      uniqueKey("CourseTranslation", ["courseId", "language"]),
      uniqueKey("CourseSection", ["courseId", "slug"]),
      uniqueKey("CourseSectionTranslation", ["courseSectionId", "language"]),
      uniqueKey("Quiz", ["courseId", "type", "sortOrder"]),
      uniqueKey("UserCourseAttempt", ["userId", "courseId"]),
      uniqueKey("CurriculumPilot", ["userId"]),
      uniqueKey("CurriculumPilotQuestion", ["key"]),
      uniqueKey("CurriculumPilotQuestionTranslation", ["questionId", "language"]),
      uniqueKey("CurriculumPilotSubmission", ["pilotId", "type"]),
      uniqueKey("CurriculumPilotAnswer", ["submissionId", "questionId"]),
      uniqueKey("UserScenarioAttempt", [
        "userId",
        "scenarioId",
        "scenarioVersion",
        "attemptNumber",
      ]),
      uniqueKey("UserScenarioChallengeCompletion", ["attemptId", "challengeId"]),
      uniqueKey("UserScenarioChoiceAttempt", ["attemptId", "challengeId", "attemptNumber"]),
      uniqueKey("QuizTranslation", ["quizId", "language"]),
      uniqueKey("QuestionTranslation", ["questionId", "language"]),
      uniqueKey("AnswerTranslation", ["answerId", "language"]),
      uniqueKey("PlatformFeedbackReminder", ["userId"]),
    ];

    for (const expectedKey of expectedKeys) {
      expect(actualKeys.has(expectedKey), `missing unique key ${expectedKey}`).toBe(true);
    }
  });

  it("contains the required foreign keys with the intended delete actions", async () => {
    const rows = await prisma.$queryRaw<ForeignKeyRow[]>`
      SELECT
        child.relname::text AS "tableName",
        child_attribute.attname::text AS "columnName",
        parent.relname::text AS "referencedTable",
        parent_attribute.attname::text AS "referencedColumn",
        CASE foreign_key.confdeltype
          WHEN 'a' THEN 'NO ACTION'
          WHEN 'r' THEN 'RESTRICT'
          WHEN 'c' THEN 'CASCADE'
          WHEN 'n' THEN 'SET NULL'
          WHEN 'd' THEN 'SET DEFAULT'
        END AS "deleteAction"
      FROM pg_constraint AS foreign_key
      INNER JOIN pg_class AS child
        ON child.oid = foreign_key.conrelid
      INNER JOIN pg_class AS parent
        ON parent.oid = foreign_key.confrelid
      INNER JOIN pg_namespace AS namespace
        ON namespace.oid = child.relnamespace
      CROSS JOIN LATERAL unnest(foreign_key.conkey, foreign_key.confkey)
        AS key_pair(child_attnum, parent_attnum)
      INNER JOIN pg_attribute AS child_attribute
        ON child_attribute.attrelid = child.oid
       AND child_attribute.attnum = key_pair.child_attnum
      INNER JOIN pg_attribute AS parent_attribute
        ON parent_attribute.attrelid = parent.oid
       AND parent_attribute.attnum = key_pair.parent_attnum
      WHERE foreign_key.contype = 'f'
        AND namespace.nspname = 'public'
    `;

    const actualRelations = new Set(
      rows.map(
        (row) =>
          `${row.tableName}.${row.columnName}->${row.referencedTable}.${row.referencedColumn}:${row.deleteAction}`,
      ),
    );

    const expectedRelations = [
      "CaseStudyTranslation.caseStudyId->CaseStudy.id:CASCADE",
      "UserCaseStudyProgress.caseStudyId->CaseStudy.id:CASCADE",
      "UserCaseStudyProgress.userId->Profile.id:CASCADE",
      "CourseTranslation.courseId->Course.id:CASCADE",
      "CourseSection.courseId->Course.id:CASCADE",
      "CourseSectionTranslation.courseSectionId->CourseSection.id:CASCADE",
      "Quiz.courseId->Course.id:CASCADE",
      "Question.quizId->Quiz.id:CASCADE",
      "Answer.questionId->Question.id:CASCADE",
      "UserCourseAttempt.courseId->Course.id:CASCADE",
      "UserCourseAttempt.userId->Profile.id:CASCADE",
      "CurriculumPilot.userId->Profile.id:CASCADE",
      "CurriculumPilotQuestionTranslation.questionId->CurriculumPilotQuestion.id:CASCADE",
      "CurriculumPilotSubmission.pilotId->CurriculumPilot.id:CASCADE",
      "CurriculumPilotAnswer.questionId->CurriculumPilotQuestion.id:RESTRICT",
      "CurriculumPilotAnswer.submissionId->CurriculumPilotSubmission.id:CASCADE",
      "UserScenarioAttempt.userId->Profile.id:CASCADE",
      "UserScenarioChallengeCompletion.attemptId->UserScenarioAttempt.id:CASCADE",
      "UserScenarioChoiceAttempt.attemptId->UserScenarioAttempt.id:CASCADE",
      "QuizTranslation.quizId->Quiz.id:CASCADE",
      "QuestionTranslation.questionId->Question.id:CASCADE",
      "AnswerTranslation.answerId->Answer.id:CASCADE",
      "PlatformFeedbackSubmission.userId->Profile.id:CASCADE",
      "PlatformFeedbackReminder.userId->Profile.id:CASCADE",
    ];

    for (const expectedRelation of expectedRelations) {
      expect(actualRelations.has(expectedRelation), `missing foreign key ${expectedRelation}`).toBe(
        true,
      );
    }
  });

  it("rejects duplicate slugs and duplicate per-user progress identities", async () => {
    const profile = await createProfile();
    const courseSlug = unique("unique-course");
    const caseStudySlug = unique("unique-case");
    const course = await createCourse(courseSlug);
    const caseStudy = await createCaseStudy(caseStudySlug);
    const scenarioAttempt = await createScenarioAttempt(profile.id);

    await prisma.userCourseAttempt.create({
      data: {
        userId: profile.id,
        courseId: course.id,
      },
    });

    await prisma.userCaseStudyProgress.create({
      data: {
        userId: profile.id,
        caseStudyId: caseStudy.id,
      },
    });

    await expectUniqueViolation(
      prisma.course.create({
        data: {
          slug: courseSlug,
          status: "draft",
          area: "social",
          difficulty: "foundation",
        },
      }),
    );

    await expectUniqueViolation(
      prisma.caseStudy.create({
        data: {
          slug: caseStudySlug,
          status: "draft",
          area: "social",
          countryCode: "PL",
        },
      }),
    );

    await expectUniqueViolation(
      prisma.userCourseAttempt.create({
        data: {
          userId: profile.id,
          courseId: course.id,
        },
      }),
    );

    await expectUniqueViolation(
      prisma.userCaseStudyProgress.create({
        data: {
          userId: profile.id,
          caseStudyId: caseStudy.id,
        },
      }),
    );

    await expectUniqueViolation(
      prisma.userScenarioAttempt.create({
        data: {
          userId: profile.id,
          scenarioId: scenarioAttempt.scenarioId,
          scenarioVersion: scenarioAttempt.scenarioVersion,
          locale: "en",
          attemptNumber: scenarioAttempt.attemptNumber,
        },
      }),
    );
  });

  it("rejects rows whose required parent records do not exist", async () => {
    const profile = await createProfile();
    const course = await createCourse();

    await expectForeignKeyViolation(
      prisma.userCourseAttempt.create({
        data: {
          userId: unique("missing-user"),
          courseId: course.id,
        },
      }),
    );

    await expectForeignKeyViolation(
      prisma.userCourseAttempt.create({
        data: {
          userId: profile.id,
          courseId: unique("missing-course"),
        },
      }),
    );

    await expectForeignKeyViolation(
      prisma.userCaseStudyProgress.create({
        data: {
          userId: profile.id,
          caseStudyId: unique("missing-case-study"),
        },
      }),
    );

    await expectForeignKeyViolation(
      prisma.userScenarioAttempt.create({
        data: {
          userId: unique("missing-scenario-user"),
          scenarioId: "scenario-01",
          scenarioVersion: 1,
          locale: "en",
        },
      }),
    );

    await expectForeignKeyViolation(
      prisma.userScenarioChallengeCompletion.create({
        data: {
          attemptId: unique("missing-attempt"),
          challengeId: "challenge-1",
        },
      }),
    );
  });
});
