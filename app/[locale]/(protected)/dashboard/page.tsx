import DashboardShell from "@/components/dashboard/dashboard-shell";
import {
  DashboardChartPoint,
  DashboardGamificationStat,
  DashboardKpi,
  DashboardMetric,
  DashboardRole,
} from "@/lib/dashboard/types";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Prisma } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

type TranslationRecord = {
  language: string;
  title: string;
  description: string | null;
};

type AttemptWithCourse = {
  id: string;
  userId: string;
  status: string;
  progressPercent: number;
  preQuizScore: number | null;
  postQuizScore: number | null;
  startedAt: Date | null;
  lastOpenedAt: Date | null;
  completedAt: Date | null;
  course: {
    slug: string;
    translations: TranslationRecord[];
  };
};

const scenarioAttemptWithRelations = Prisma.validator<Prisma.UserScenarioAttemptDefaultArgs>()({
  include: {
    user: {
      select: {
        email: true,
        fullName: true,
      },
    },
    scenario: {
      select: {
        slug: true,
        area: true,
      },
    },
    scenarioVariant: {
      select: {
        title: true,
        language: true,
      },
    },
  },
});

type ScenarioAttemptWithRelations = Prisma.UserScenarioAttemptGetPayload<
  typeof scenarioAttemptWithRelations
>;

function pickTranslation(translations: TranslationRecord[], locale: string) {
  const exactMatch = translations.find((translation) => translation.language === locale);
  if (exactMatch) return exactMatch;

  const englishMatch = translations.find((translation) => translation.language === "en");
  if (englishMatch) return englishMatch;

  return translations.length > 0 ? translations[0] : null;
}

function buildWeeklyActivityChart(
  attempts: { startedAt: Date | null }[],
  locale: string,
): DashboardChartPoint[] {
  const today = new Date();
  const points: DashboardChartPoint[] = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setHours(0, 0, 0, 0);
    day.setDate(today.getDate() - offset);

    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    const count = attempts.filter((attempt) => {
      if (!attempt.startedAt) return false;
      return attempt.startedAt >= day && attempt.startedAt < nextDay;
    }).length;

    points.push({
      label: day.toLocaleDateString(locale, { weekday: "short" }),
      value: count,
    });
  }

  return points;
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
    return t("fallback.vsPreviousWeek", { value: `+${currentTotal}` });
  }

  const diff = ((currentTotal - previousTotal) / previousTotal) * 100;
  const rounded = Math.round(diff * 10) / 10;

  if (rounded === 0) return t("fallback.noChange");

  return t("fallback.vsPreviousWeek", {
    value: `${rounded > 0 ? "+" : ""}${rounded}%`,
  });
}

function buildWeeklyAttempts(
  attempts: { startedAt: Date | null }[],
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
    if (!attempt.startedAt) return false;
    return attempt.startedAt >= start && attempt.startedAt < end;
  });
}

function buildContinueLearningItem(
  attempts: AttemptWithCourse[],
  locale: string,
  t: Awaited<ReturnType<typeof getTranslations>>,
) {
  const latest = [...attempts]
    .sort((a, b) => {
      const left =
        a.lastOpenedAt !== null
          ? a.lastOpenedAt.getTime()
          : a.startedAt !== null
            ? a.startedAt.getTime()
            : 0;

      const right =
        b.lastOpenedAt !== null
          ? b.lastOpenedAt.getTime()
          : b.startedAt !== null
            ? b.startedAt.getTime()
            : 0;

      return right - left;
    })
    .at(0);

  if (!latest) return null;

  const translation = pickTranslation(latest.course.translations, locale);
  const isCompleted = latest.status === "completed";

  return {
    title: translation?.title ?? t("fallback.untitledModule"),
    description: translation?.description ?? t("fallback.continueDescription"),
    href: isCompleted
      ? `/${locale}/curriculum/${latest.course.slug}`
      : `/${locale}/curriculum/${latest.course.slug}/learn`,
    badge: t("fallback.curriculumBadge"),
    ctaLabel: isCompleted ? t("fallback.reviewModule") : t("fallback.continueModule"),
    kindLabel: isCompleted ? t("fallback.lastCompleted") : t("fallback.lastOpened"),
  };
}

function buildLearnerSummaryMetrics(
  role: DashboardRole,
  curriculumAttempts: AttemptWithCourse[],
  scenarioAttempts: {
    status: string;
    score: number | null;
  }[],
  t: Awaited<ReturnType<typeof getTranslations>>,
): DashboardMetric[] {
  if (role === "educator") {
    const attemptsWithPostQuizScore = curriculumAttempts.filter(
      (attempt): attempt is AttemptWithCourse & { postQuizScore: number } =>
        attempt.postQuizScore !== null,
    );

    const averagePostQuiz =
      attemptsWithPostQuizScore.reduce((sum, attempt, _, array) => {
        return sum + attempt.postQuizScore / array.length;
      }, 0) || 0;

    const modulesInProgress = curriculumAttempts.filter(
      (attempt) => attempt.status !== "completed" && attempt.status !== "failed",
    ).length;

    return [
      {
        label: t("metrics.averagePostQuiz"),
        value: `${Math.round(averagePostQuiz)}%`,
      },
      {
        label: t("metrics.modulesInProgress"),
        value: String(modulesInProgress),
      },
    ];
  }

  const completedCount = scenarioAttempts.filter((attempt) =>
    ["completed", "passed"].includes(attempt.status),
  ).length;

  const completionRate = scenarioAttempts.length
    ? Math.round((completedCount / scenarioAttempts.length) * 100)
    : 0;

  const attemptsWithScore = scenarioAttempts.filter(
    (attempt): attempt is { status: string; score: number } => attempt.score !== null,
  );

  const averageScore =
    attemptsWithScore.reduce((sum, attempt, _, array) => {
      return sum + attempt.score / array.length;
    }, 0) || 0;

  return [
    {
      label: t("metrics.completionRate"),
      value: `${completionRate}%`,
    },
    {
      label: t("metrics.averageScore"),
      value: `${Math.round(averageScore)}%`,
    },
  ];
}

function buildGamificationStats(
  role: DashboardRole,
  learnerAttempts: { startedAt: Date | null; completedAt?: Date | null }[],
  t: Awaited<ReturnType<typeof getTranslations>>,
): DashboardGamificationStat[] {
  if (role !== "student" && role !== "educator") {
    return [];
  }

  const sortedDays = learnerAttempts
    .map((attempt) => {
      const sourceDate = attempt.completedAt ?? attempt.startedAt;
      if (!sourceDate) return null;

      const normalized = new Date(sourceDate);
      normalized.setHours(0, 0, 0, 0);
      return normalized.getTime();
    })
    .filter((value): value is number => value !== null)
    .sort((a, b) => a - b);

  const uniqueDays = [...new Set(sortedDays)];

  let streak = 0;

  if (uniqueDays.length > 0) {
    streak = 1;

    for (let i = uniqueDays.length - 1; i > 0; i -= 1) {
      const current = uniqueDays[i];
      const previous = uniqueDays[i - 1];
      const diffDays = (current - previous) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        streak += 1;
      } else {
        break;
      }
    }
  }

  return [
    {
      label: t("gamification.learningStreak"),
      value: String(streak),
    },
  ];
}

function buildAdminKpis(
  totalUsers: number,
  attempts: ScenarioAttemptWithRelations[],
  t: Awaited<ReturnType<typeof getTranslations>>,
): DashboardKpi[] {
  const completedCount = attempts.filter((attempt) =>
    ["completed", "passed"].includes(attempt.status),
  ).length;

  const completionRate = attempts.length ? Math.round((completedCount / attempts.length) * 100) : 0;

  const attemptsWithScore = attempts.filter(
    (attempt): attempt is ScenarioAttemptWithRelations & { score: number } =>
      attempt.score !== null,
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
      hint: t("adminKpis.averageScoreHint", { count: activeUsers }),
    },
  ];
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Protected.DashboardPage" });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
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

  const role = profile.role as DashboardRole;

  const curriculumAttemptsPromise =
    role === "educator"
      ? prisma.userCourseAttempt.findMany({
          where: { userId: profile.id },
          orderBy: [{ lastOpenedAt: "desc" }, { startedAt: "desc" }],
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
    role === "student" || role === "educator"
      ? prisma.userScenarioAttempt.findMany({
          where: { userId: profile.id },
          orderBy: [{ lastOpenedAt: "desc" }, { startedAt: "desc" }],
        })
      : Promise.resolve([]);

  const adminScenarioAttemptsPromise =
    role === "admin"
      ? prisma.userScenarioAttempt.findMany({
          orderBy: [{ startedAt: "desc" }],
          take: 90,
          ...scenarioAttemptWithRelations,
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
    scenarioAttempts,
    adminScenarioAttempts,
    totalUsers,
    publishedCoursesCount,
  ] = await Promise.all([
    curriculumAttemptsPromise,
    scenarioAttemptsPromise,
    adminScenarioAttemptsPromise,
    totalUsersPromise,
    publishedCoursesCountPromise,
  ]);

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
    role === "educator" ? buildContinueLearningItem(curriculumAttempts, locale, t) : null;

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
          completedAt: attempt.completedAt ?? null,
        })),
    t,
  );

  const adminKpis = buildAdminKpis(totalUsers, adminScenarioAttempts, t);

  return (
    <DashboardShell
      locale={locale}
      role={role}
      displayName={profile.fullName ?? profile.email.split("@")[0]}
      continueLearning={role === "student" || role === "educator" ? continueLearning : null}
      gamificationStats={role === "student" || role === "educator" ? gamificationStats : []}
      publishedCoursesCount={role === "educator" ? publishedCoursesCount : 0}
      learnerSummaryMetrics={role === "student" || role === "educator" ? learnerSummaryMetrics : []}
      learnerActivityData={role === "student" || role === "educator" ? learnerActivityData : []}
      learnerTrendLabel={role === "student" || role === "educator" ? learnerTrendLabel : ""}
      adminActivityData={role === "admin" ? adminActivityData : []}
      adminTrendLabel={role === "admin" ? adminTrendLabel : ""}
      adminKpis={role === "admin" ? adminKpis : []}
    />
  );
}
