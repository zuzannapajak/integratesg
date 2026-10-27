import type { PrismaClient } from "@prisma/client";

import { assertSafeE2EEnvironment } from "./safe-test-environment";

const LANGUAGES = ["en", "pl", "de", "it", "el", "bg"] as const;

const REQUIRED_TABLES = [
  "Profile",
  "Course",
  "CourseTranslation",
  "CaseStudy",
  "CaseStudyTranslation",
  "UserCourseAttempt",
  "UserCaseStudyProgress",
  "CurriculumPilot",
  "CurriculumPilotQuestion",
  "CurriculumPilotSubmission",
  "PilotSatisfactionSubmission",
  "PlatformFeedbackSubmission",
  "PlatformFeedbackReminder",
] as const;

/**
 * Read-only preflight. State-changing E2E tests must not begin before the
 * disposable database has its migrations AND complete educational fixtures.
 */
export async function assertE2EDatabaseReady(db: PrismaClient): Promise<void> {
  assertSafeE2EEnvironment();

  const tables = await db.$queryRaw<Array<{ table_name: string }>>`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `;
  const present = new Set(tables.map((row) => row.table_name));
  const missingTables = REQUIRED_TABLES.filter((name) => !present.has(name));
  if (missingTables.length > 0) {
    throw new Error(
      `Disposable E2E database is missing Prisma table(s): ${missingTables.join(", ")}. ` +
        "Apply pending migrations to the VERIFIED isolated E2E project, not the pilot database. " +
        "Use: node scripts/e2e-prisma.mjs --status, then --deploy with explicit confirmation.",
    );
  }

  const problems: string[] = [];
  const caseStudies = await db.caseStudy.findMany({
    where: { status: "published" },
    select: { slug: true, translations: { select: { language: true } } },
  });
  if (caseStudies.length !== 16) {
    problems.push(`published ePortfolio case studies: ${caseStudies.length}/16`);
  }
  const untranslated = caseStudies.flatMap((entry) => {
    const languages = new Set(entry.translations.map((translation) => translation.language));
    return LANGUAGES.filter((locale) => !languages.has(locale)).map(
      (locale) => `${entry.slug}/${locale}`,
    );
  });
  if (untranslated.length > 0) {
    problems.push(`missing ePortfolio translations: ${untranslated.join(", ")}`);
  }

  // Previous interrupted E2E attempts may have left temporary courses.
  const courses = (await db.course.findMany({
    where: { status: "published" },
    select: { slug: true, translations: { select: { language: true } } },
  })).filter((course) => !course.slug.startsWith("playwright-e2e-"));
  const completeCourses = courses.filter((course) => {
    const languages = new Set(course.translations.map((translation) => translation.language));
    return LANGUAGES.every((locale) => languages.has(locale));
  });
  if (completeCourses.length < 6) {
    problems.push(`fully localized Curriculum modules: ${completeCourses.length}/6`);
  }

  const activeQuestions = await db.curriculumPilotQuestion.count({ where: { isActive: true } });
  if (activeQuestions < 1) problems.push("no active pilot pre/post-assessment questions");

  if (problems.length > 0) {
    throw new Error(
      `Disposable E2E database lacks test fixtures: ${problems.join("; ")}. ` +
        "Seed only the isolated E2E project, never the live pilot project.",
    );
  }
}
