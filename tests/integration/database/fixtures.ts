import { randomUUID } from "node:crypto";

import { prisma } from "@/lib/prisma";

const createdProfileIds = new Set<string>();
const createdCourseIds = new Set<string>();
const createdCaseStudyIds = new Set<string>();
const createdPilotQuestionIds = new Set<string>();

export function unique(prefix: string) {
  return `${prefix}-${randomUUID()}`;
}

export async function createProfile(role: "learner" | "educator" = "learner") {
  const id = unique("db-contract-user");

  const profile = await prisma.profile.create({
    data: {
      id,
      email: `${id}@example.test`,
      role,
      preferredLanguage: "en",
    },
  });

  createdProfileIds.add(profile.id);

  return profile;
}

export async function createCourse(slug = unique("db-contract-course")) {
  const course = await prisma.course.create({
    data: {
      slug,
      status: "published",
      area: "cross_cutting",
      difficulty: "foundation",
      lessonsCount: 1,
      sortOrder: 999,
      translations: {
        create: {
          language: "en",
          title: "Database contract course",
          description: "Integration-test fixture",
        },
      },
    },
  });

  createdCourseIds.add(course.id);

  return course;
}

export async function createCaseStudy(slug = unique("db-contract-case")) {
  const caseStudy = await prisma.caseStudy.create({
    data: {
      slug,
      status: "published",
      area: "governance",
      countryCode: "PL",
      sortOrder: 999,
      translations: {
        create: {
          language: "en",
          title: "Database contract case study",
          content: "Database contract content",
        },
      },
    },
  });

  createdCaseStudyIds.add(caseStudy.id);

  return caseStudy;
}

export async function createScenarioAttempt(userId: string) {
  return prisma.userScenarioAttempt.create({
    data: {
      userId,
      scenarioId: unique("scenario"),
      scenarioVersion: 1,
      locale: "en",
      attemptNumber: 1,
    },
  });
}

export function trackPilotQuestion(id: string) {
  createdPilotQuestionIds.add(id);
}

export function markProfileDeleted(id: string) {
  createdProfileIds.delete(id);
}

export function markCourseDeleted(id: string) {
  createdCourseIds.delete(id);
}

export function markCaseStudyDeleted(id: string) {
  createdCaseStudyIds.delete(id);
}

export async function cleanupDatabaseFixtures() {
  if (createdProfileIds.size > 0) {
    await prisma.profile.deleteMany({
      where: {
        id: {
          in: [...createdProfileIds],
        },
      },
    });
  }

  if (createdCourseIds.size > 0) {
    await prisma.course.deleteMany({
      where: {
        id: {
          in: [...createdCourseIds],
        },
      },
    });
  }

  if (createdCaseStudyIds.size > 0) {
    await prisma.caseStudy.deleteMany({
      where: {
        id: {
          in: [...createdCaseStudyIds],
        },
      },
    });
  }

  if (createdPilotQuestionIds.size > 0) {
    await prisma.curriculumPilotQuestion.deleteMany({
      where: {
        id: {
          in: [...createdPilotQuestionIds],
        },
      },
    });
  }

  createdProfileIds.clear();
  createdCourseIds.clear();
  createdCaseStudyIds.clear();
  createdPilotQuestionIds.clear();
}
