import DashboardShell from "@/components/dashboard/dashboard-shell";

import { scenarioPathwayItems } from "@/content/scenarios/pathway";

import {
  buildContinueLearningItem,
  buildGamificationStats,
  buildLearnerSummaryMetrics,
  buildWeeklyActivityChart,
} from "@/lib/dashboard/aggregation";

import { DashboardChartPoint, DashboardKpi } from "@/lib/dashboard/types";

import { logMeasuredOperation } from "@/lib/observability/performance";

import { prisma } from "@/lib/prisma";

import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";

import { createClient } from "@/lib/supabase/server";

import { getTranslations } from "next-intl/server";

import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

type ScenarioAttemptForDashboard = {
  id: string;

  scenarioId: string;

  scenarioSlug: string;

  scenarioTitle: string;

  status: string;

  score: number | null;

  startedAt: Date | null;

  lastOpenedAt: Date | null;

  completedAt: Date | null;
};

type LearnerScenarioAttempt = {
  id: string;

  scenarioId: string;

  status: string;

  startedAt: Date;

  lastOpenedAt: Date;

  completedAt: Date | null;

  choiceAttempts: Array<{
    isOptimal: boolean;
  }>;
};

type AdminScenarioAttempt = LearnerScenarioAttempt & {
  user: {
    email: string;

    fullName: string | null;
  };
};

type AdminScenarioAttemptForDashboard = AdminScenarioAttempt & {
  score: number | null;
};

function calculateOptimalChoiceRate(
  choices: ReadonlyArray<{
    isOptimal: boolean;
  }>,
): number | null {
  if (choices.length === 0) {
    return null;
  }

  const optimalChoices = choices.reduce((sum, choice) => sum + (choice.isOptimal ? 1 : 0), 0);

  return Math.round((optimalChoices / choices.length) * 100);
}

function getScenarioPresentation(scenarioId: string, locale: string) {
  const pathwayItem = scenarioPathwayItems.find((item) => item.id === scenarioId);

  const slug = pathwayItem?.slug ?? scenarioId;

  const localizedScenario =
    resolveScenarioBySlug(slug, locale) ?? resolveScenarioBySlug(slug, "en");

  return {
    slug,

    title: localizedScenario?.title ?? pathwayItem?.title ?? scenarioId,
  };
}

function mapScenarioAttempt(
  attempt: LearnerScenarioAttempt,

  locale: string,
): ScenarioAttemptForDashboard {
  const presentation = getScenarioPresentation(attempt.scenarioId, locale);

  return {
    id: attempt.id,

    scenarioId: attempt.scenarioId,

    scenarioSlug: presentation.slug,

    scenarioTitle: presentation.title,

    status: attempt.status,

    score: calculateOptimalChoiceRate(attempt.choiceAttempts),

    startedAt: attempt.startedAt,

    lastOpenedAt: attempt.lastOpenedAt,

    completedAt: attempt.completedAt,
  };
}

function buildTrendLabel(
  current: DashboardChartPoint[],

  previousTotal: number,

  t: Awaited<ReturnType<typeof getTranslations>>,
) {
  const currentTotal = current.reduce((sum, point) => sum + point.value, 0);

  if (currentTotal === 0 && previousTotal === 0) {
    return t("fallback.noChange");
  }

  if (previousTotal === 0) {
    return t("fallback.vsPreviousWeek", {
      value: `+${currentTotal}`,
    });
  }

  const diff = ((currentTotal - previousTotal) / previousTotal) * 100;

  const rounded = Math.round(diff * 10) / 10;

  if (rounded === 0) {
    return t("fallback.noChange");
  }

  return t("fallback.vsPreviousWeek", {
    value: `${rounded > 0 ? "+" : ""}${rounded}%`,
  });
}

function buildWeeklyAttempts(
  attempts: {
    startedAt: Date | null;
  }[],

  startOffsetDays: number,

  endOffsetDays: number,
) {
  const today = new Date();

  const start = new Date(today);

  start.setHours(0, 0, 0, 0);

  start.setDate(today.getDate() - startOffsetDays);

  const end = new Date(today);

  end.setHours(0, 0, 0, 0);

  end.setDate(today.getDate() - endOffsetDays);

  return attempts.filter((attempt) => {
    if (!attempt.startedAt) {
      return false;
    }

    return attempt.startedAt >= start && attempt.startedAt < end;
  });
}

function buildAdminKpis(
  totalUsers: number,

  attempts: AdminScenarioAttemptForDashboard[],

  t: Awaited<ReturnType<typeof getTranslations>>,
): DashboardKpi[] {
  const completedCount = attempts.filter((attempt) => attempt.status === "completed").length;

  const completionRate =
    attempts.length > 0 ? Math.round((completedCount / attempts.length) * 100) : 0;

  const attemptsWithScore = attempts.filter(
    (
      attempt,
    ): attempt is AdminScenarioAttemptForDashboard & {
      score: number;
    } => attempt.score !== null,
  );

  const averageScore =
    attemptsWithScore.reduce((sum, attempt, _, array) => {
      return sum + attempt.score / array.length;
    }, 0) || 0;

  const activeUsers = new Set(attempts.map((attempt) => attempt.user.email)).size;

  return [
    {
      label: t("adminKpis.users"),

      value: String(totalUsers),

      hint: t("adminKpis.usersHint"),
    },

    {
      label: t("adminKpis.attempts"),

      value: String(attempts.length),

      hint: t("adminKpis.attemptsHint"),
    },

    {
      label: t("adminKpis.completionRate"),

      value: `${completionRate}%`,

      hint: t("adminKpis.completionRateHint"),
    },

    {
      label: t("adminKpis.averageScore"),

      value: `${Math.round(averageScore)}%`,

      hint: t("adminKpis.averageScoreHint", {
        count: activeUsers,
      }),
    },
  ];
}

async function getDashboardPageData({ params }: Props) {
  const startedAt = Date.now();

  let records = 0;

  let status: "ok" | "error" = "ok";

  try {
    const { locale } = await params;

    const [t, supabase] = await Promise.all([
      getTranslations({
        locale,

        namespace: "Protected.DashboardPage",
      }),

      createClient(),
    ]);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect(`/${locale}/auth/login`);
    }

    const profile = await prisma.profile.findUnique({
      where: {
        id: user.id,
      },

      select: {
        id: true,

        email: true,

        fullName: true,

        role: true,
      },
    });

    if (!profile) {
      redirect(`/${locale}/auth/login`);
    }

    const role = profile.role;

    const curriculumAttemptsPromise =
      role === "educator"
        ? prisma.userCourseAttempt.findMany({
            where: {
              userId: profile.id,
            },

            orderBy: [
              {
                lastOpenedAt: "desc",
              },

              {
                startedAt: "desc",
              },
            ],

            include: {
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

    const scenarioAttemptsPromise =
      role === "learner" || role === "educator"
        ? prisma.userScenarioAttempt.findMany({
            where: {
              userId: profile.id,
            },

            orderBy: [
              {
                lastOpenedAt: "desc",
              },

              {
                startedAt: "desc",
              },
            ],

            select: {
              id: true,

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

    const adminScenarioAttemptsPromise =
      role === "admin"
        ? prisma.userScenarioAttempt.findMany({
            orderBy: [
              {
                startedAt: "desc",
              },
            ],

            take: 90,

            select: {
              id: true,

              scenarioId: true,

              status: true,

              startedAt: true,

              lastOpenedAt: true,

              completedAt: true,

              user: {
                select: {
                  email: true,

                  fullName: true,
                },
              },

              choiceAttempts: {
                select: {
                  isOptimal: true,
                },
              },
            },
          })
        : Promise.resolve([]);

    const totalUsersPromise = role === "admin" ? prisma.profile.count() : Promise.resolve(0);

    const publishedCoursesCountPromise =
      role === "educator"
        ? prisma.course.count({
            where: {
              status: "published",
            },
          })
        : Promise.resolve(0);

    const [
      curriculumAttempts,

      rawScenarioAttempts,

      rawAdminScenarioAttempts,

      totalUsers,

      publishedCoursesCount,
    ] = await Promise.all([
      curriculumAttemptsPromise,

      scenarioAttemptsPromise,

      adminScenarioAttemptsPromise,

      totalUsersPromise,

      publishedCoursesCountPromise,
    ]);

    const scenarioAttempts = rawScenarioAttempts.map((attempt) =>
      mapScenarioAttempt(attempt, locale),
    );

    const adminScenarioAttempts = rawAdminScenarioAttempts.map((attempt) => ({
      ...attempt,

      score: calculateOptimalChoiceRate(attempt.choiceAttempts),
    }));

    records =
      curriculumAttempts.length +
      scenarioAttempts.length +
      adminScenarioAttempts.length +
      totalUsers +
      publishedCoursesCount;

    const learnerAttemptsForActivity =
      role === "educator"
        ? [...curriculumAttempts, ...scenarioAttempts].map((attempt) => ({
            startedAt: attempt.startedAt,
          }))
        : scenarioAttempts.map((attempt) => ({
            startedAt: attempt.startedAt,
          }));

    const learnerCurrentWeekAttempts = buildWeeklyAttempts(learnerAttemptsForActivity, 6, -1);

    const learnerPreviousWeekAttempts = buildWeeklyAttempts(learnerAttemptsForActivity, 13, 6);

    const learnerActivityData = buildWeeklyActivityChart(learnerCurrentWeekAttempts, locale);

    const learnerTrendLabel = buildTrendLabel(
      learnerActivityData,

      learnerPreviousWeekAttempts.length,

      t,
    );

    const adminActivitySource = adminScenarioAttempts.map((attempt) => ({
      startedAt: attempt.startedAt,
    }));

    const adminCurrentWeekAttempts = buildWeeklyAttempts(adminActivitySource, 6, -1);

    const adminPreviousWeekAttempts = buildWeeklyAttempts(adminActivitySource, 13, 6);

    const adminActivityData = buildWeeklyActivityChart(adminCurrentWeekAttempts, locale);

    const adminTrendLabel = buildTrendLabel(adminActivityData, adminPreviousWeekAttempts.length, t);

    const continueLearning =
      role === "learner" || role === "educator"
        ? buildContinueLearningItem(
            {
              curriculumAttempts,

              scenarioAttempts,

              locale,
            },

            t,
          )
        : null;

    const learnerSummaryMetrics = buildLearnerSummaryMetrics(
      role,

      curriculumAttempts,

      scenarioAttempts,

      t,
    );

    const gamificationStats = buildGamificationStats(
      role,

      role === "educator"
        ? curriculumAttempts.map((attempt) => ({
            startedAt: attempt.startedAt,

            completedAt: attempt.completedAt,
          }))
        : scenarioAttempts.map((attempt) => ({
            startedAt: attempt.startedAt,

            completedAt: attempt.completedAt,
          })),

      t,
    );

    const adminKpis = buildAdminKpis(totalUsers, adminScenarioAttempts, t);

    return {
      locale,

      role,

      displayName: profile.fullName ?? profile.email.split("@")[0],

      heroStats: role === "admin" ? adminKpis : learnerSummaryMetrics,

      continueLearning: role === "learner" || role === "educator" ? continueLearning : null,

      gamificationStats: role === "learner" || role === "educator" ? gamificationStats : [],

      publishedCoursesCount: role === "educator" ? publishedCoursesCount : 0,

      learnerSummaryMetrics: role === "learner" || role === "educator" ? learnerSummaryMetrics : [],

      learnerActivityData: role === "learner" || role === "educator" ? learnerActivityData : [],

      learnerTrendLabel: role === "learner" || role === "educator" ? learnerTrendLabel : "",

      adminActivityData: role === "admin" ? adminActivityData : [],

      adminTrendLabel: role === "admin" ? adminTrendLabel : "",

      adminKpis: role === "admin" ? adminKpis : [],
    };
  } catch (error) {
    status = "error";

    throw error;
  } finally {
    logMeasuredOperation({
      operation: "page.dashboard.data",

      durationMs: Date.now() - startedAt,

      records,

      status,
    });
  }
}

export default async function DashboardPage(props: Props) {
  const dashboardProps = await getDashboardPageData(props);

  return <DashboardShell {...dashboardProps} />;
}
