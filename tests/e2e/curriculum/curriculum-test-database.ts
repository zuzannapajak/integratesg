import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type UserRole } from "@prisma/client";

let prisma: PrismaClient | null = null;

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Missing ${name}. Configure the Playwright curriculum test environment before running E2E tests.`,
    );
  }

  return value;
}

function getDatabaseClient(): PrismaClient {
  if (prisma) {
    return prisma;
  }

  if (process.env.PLAYWRIGHT_ALLOW_DATABASE_RESET !== "true") {
    throw new Error(
      [
        "Database cleanup is disabled.",
        "Set PLAYWRIGHT_ALLOW_DATABASE_RESET=true only for a dedicated test database.",
      ].join(" "),
    );
  }

  const databaseUrl =
    process.env.PLAYWRIGHT_DATABASE_URL?.trim() ?? process.env.TEST_DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error(
      "Missing PLAYWRIGHT_DATABASE_URL or TEST_DATABASE_URL for the curriculum E2E test.",
    );
  }

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });

  prisma = new PrismaClient({
    adapter,
    log: ["error"],
  });

  return prisma;
}

export function getCurriculumTestCredentials() {
  return {
    email: requireEnvironmentVariable("PLAYWRIGHT_TEST_EMAIL"),
    password: requireEnvironmentVariable("PLAYWRIGHT_TEST_PASSWORD"),
  };
}

function resolveProjectVariant(projectName: string) {
  return projectName.includes("mobile") ? "mobile" : "desktop";
}

type CurriculumPilotSnapshot = {
  status: "pre_prompt_shown" | "pre_skipped" | "pilot_active" | "pilot_completed";
  preAssessmentSeenAt: Date | null;
  preAssessmentSkippedAt: Date | null;
  preAssessmentCompletedAt: Date | null;
  postAssessmentCompletedAt: Date | null;
  preAssessmentAverageScore: number | null;
  postAssessmentAverageScore: number | null;
  assessmentAverageScoreDelta: number | null;
};

export type CurriculumE2EFixture = {
  userId: string;
  courseId: string;
  slug: string;
  title: string;
  firstLessonTitle: string;
  secondLessonTitle: string;
  originalRole: UserRole;
  originalPreferredLanguage: string;
  originalPilot: CurriculumPilotSnapshot | null;
};

export async function resetCurriculumTestProgress(
  projectName: string,
): Promise<CurriculumE2EFixture> {
  const database = getDatabaseClient();
  const { email } = getCurriculumTestCredentials();

  const profile = await database.profile.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      role: true,
      preferredLanguage: true,
    },
  });

  if (!profile) {
    throw new Error(
      [
        `No Profile record exists for the Playwright account ${email}.`,
        "Create the Supabase test user and its matching Profile record in the dedicated test database.",
      ].join(" "),
    );
  }

  const originalPilot = await database.curriculumPilot.findUnique({
    where: {
      userId: profile.id,
    },
    select: {
      status: true,
      preAssessmentSeenAt: true,
      preAssessmentSkippedAt: true,
      preAssessmentCompletedAt: true,
      postAssessmentCompletedAt: true,
      preAssessmentAverageScore: true,
      postAssessmentAverageScore: true,
      assessmentAverageScoreDelta: true,
    },
  });

  await database.profile.update({
    where: {
      id: profile.id,
    },
    data: {
      role: "educator",
      preferredLanguage: "en",
    },
  });

  const variant = resolveProjectVariant(projectName);
  const slug = `playwright-curriculum-e2e-${variant}`;
  const title = `Playwright curriculum ${variant} module`;
  const firstLessonTitle = `Curriculum ${variant} lesson one`;
  const secondLessonTitle = `Curriculum ${variant} lesson two`;
  const now = new Date();

  await database.course.deleteMany({
    where: {
      slug,
    },
  });

  await database.curriculumPilot.upsert({
    where: {
      userId: profile.id,
    },
    update: {
      status: "pre_skipped",
      preAssessmentSeenAt: now,
      preAssessmentSkippedAt: now,
      preAssessmentCompletedAt: null,
      postAssessmentCompletedAt: null,
      preAssessmentAverageScore: null,
      postAssessmentAverageScore: null,
      assessmentAverageScoreDelta: null,
    },
    create: {
      userId: profile.id,
      status: "pre_skipped",
      preAssessmentSeenAt: now,
      preAssessmentSkippedAt: now,
    },
  });

  const course = await database.course.create({
    data: {
      slug,
      status: "published",
      area: "social",
      difficulty: "foundation",
      estimatedDurationMinutes: 20,
      isFeatured: false,
      lessonsCount: 2,
      sortOrder: -100_000,
      translations: {
        create: {
          language: "en",
          title,
          subtitle: "Playwright curriculum journey",
          description: "A deterministic two-lesson module used by curriculum E2E tests.",
          content: "This module verifies persisted curriculum progress from the browser.",
        },
      },
      sections: {
        create: [
          {
            slug: "lesson-one",
            sortOrder: 1,
            estimatedMinutes: 10,
            translations: {
              create: {
                language: "en",
                title: firstLessonTitle,
                summary: "The first E2E lesson.",
                content: "First curriculum E2E lesson content.",
              },
            },
          },
          {
            slug: "lesson-two",
            sortOrder: 2,
            estimatedMinutes: 10,
            translations: {
              create: {
                language: "en",
                title: secondLessonTitle,
                summary: "The second E2E lesson.",
                content: "Second curriculum E2E lesson content.",
              },
            },
          },
        ],
      },
    },
  });

  return {
    userId: profile.id,
    courseId: course.id,
    slug,
    title,
    firstLessonTitle,
    secondLessonTitle,
    originalRole: profile.role,
    originalPreferredLanguage: profile.preferredLanguage,
    originalPilot,
  };
}

export async function readCurriculumTestProgress(userId: string, courseId: string) {
  const database = getDatabaseClient();

  return database.userCourseAttempt.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    select: {
      status: true,
      currentStage: true,
      currentLessonIndex: true,
      completedLessons: true,
      progressPercent: true,
      startedAt: true,
      lastOpenedAt: true,
      completedAt: true,
    },
  });
}

export async function cleanupCurriculumTestState(fixture: CurriculumE2EFixture): Promise<void> {
  const database = getDatabaseClient();

  await database.course.deleteMany({
    where: {
      id: fixture.courseId,
    },
  });

  if (fixture.originalPilot) {
    await database.curriculumPilot.update({
      where: {
        userId: fixture.userId,
      },
      data: fixture.originalPilot,
    });
  } else {
    await database.curriculumPilot.deleteMany({
      where: {
        userId: fixture.userId,
      },
    });
  }

  await database.profile.update({
    where: {
      id: fixture.userId,
    },
    data: {
      role: fixture.originalRole,
      preferredLanguage: fixture.originalPreferredLanguage,
    },
  });
}

export async function disconnectCurriculumTestDatabase(): Promise<void> {
  if (!prisma) {
    return;
  }

  await prisma.$disconnect();
  prisma = null;
}
