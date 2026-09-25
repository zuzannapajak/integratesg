import { prisma } from "@/lib/prisma";
import type { DashboardRole } from "@/lib/dashboard/types";

function getRequestedLanguages(locale: string) {
  return locale === "en" ? ["en"] : [locale, "en"];
}

export async function getDashboardLearningSnapshot(params: {
  userId: string;
  role: DashboardRole;
  locale: string;
}) {
  const requestedLanguages = getRequestedLanguages(params.locale);
  const isLearningRole = params.role === "learner" || params.role === "educator";

  const curriculumAttemptsPromise =
    params.role === "educator"
      ? prisma.userCourseAttempt.findMany({
          where: {
            userId: params.userId,
          },
          orderBy: [{ lastOpenedAt: "desc" }, { startedAt: "desc" }],
          select: {
            id: true,
            userId: true,
            status: true,
            progressPercent: true,
            preQuizScore: true,
            postQuizScore: true,
            startedAt: true,
            lastOpenedAt: true,
            completedAt: true,
            course: {
              select: {
                slug: true,
                translations: {
                  select: {
                    language: true,
                    title: true,
                    description: true,
                  },
                },
              },
            },
          },
        })
      : Promise.resolve([]);

  const scenarioAttemptsPromise = isLearningRole
    ? prisma.userScenarioAttempt.findMany({
        where: {
          userId: params.userId,
        },
        orderBy: [{ lastOpenedAt: "desc" }, { startedAt: "desc" }],
        select: {
          id: true,
          userId: true,
          scenarioId: true,
          status: true,
          startedAt: true,
          lastOpenedAt: true,
          completedAt: true,
          choiceAttempts: {
            select: {
              isOptimal: true,
            },
          },
        },
      })
    : Promise.resolve([]);

  const eportfolioProgressPromise = isLearningRole
    ? prisma.userCaseStudyProgress.findMany({
        where: {
          userId: params.userId,
          caseStudy: {
            status: "published",
          },
        },
        orderBy: [{ lastOpenedAt: "desc" }, { startedAt: "desc" }],
        select: {
          id: true,
          userId: true,
          caseStudyId: true,
          status: true,
          startedAt: true,
          lastOpenedAt: true,
          completedAt: true,
          caseStudy: {
            select: {
              slug: true,
              translations: {
                where: {
                  language: {
                    in: requestedLanguages,
                  },
                },
                select: {
                  language: true,
                  title: true,
                  summary: true,
                },
              },
            },
          },
        },
      })
    : Promise.resolve([]);

  const publishedCoursesCountPromise =
    params.role === "educator"
      ? prisma.course.count({
          where: {
            status: "published",
          },
        })
      : Promise.resolve(0);

  const [curriculumAttempts, scenarioAttempts, eportfolioProgress, publishedCoursesCount] =
    await Promise.all([
      curriculumAttemptsPromise,
      scenarioAttemptsPromise,
      eportfolioProgressPromise,
      publishedCoursesCountPromise,
    ]);

  return {
    curriculumAttempts,
    scenarioAttempts,
    eportfolioProgress,
    publishedCoursesCount,
  };
}
