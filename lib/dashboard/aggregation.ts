import type {
  DashboardChartPoint,
  DashboardContinueItem,
  DashboardGamificationStat,
  DashboardMetric,
  DashboardRole,
} from "@/lib/dashboard/types";

export type DashboardActivityAttempt = {
  startedAt: Date | null;
  completedAt?: Date | null;
};

export type DashboardCurriculumAttempt = {
  status: string;
  postQuizScore: number | null;
  startedAt: Date | null;
  lastOpenedAt: Date | null;
  completedAt: Date | null;
  course: {
    slug: string;
    translations: Array<{
      language: string;
      title: string;
      description: string | null;
    }>;
  };
};

export type DashboardScenarioAttempt = {
  scenarioId: string;
  scenarioSlug: string;
  scenarioTitle: string;
  status: string;
  score: number | null;
  startedAt: Date | null;
  lastOpenedAt: Date | null;
  completedAt: Date | null;
};

type Translator = (key: string, values?: Record<string, string | number | Date>) => string;

function pickTranslation(
  translations: DashboardCurriculumAttempt["course"]["translations"],
  locale: string,
) {
  const exactMatch = translations.find((translation) => translation.language === locale);

  if (exactMatch) {
    return exactMatch;
  }

  const englishMatch = translations.find((translation) => translation.language === "en");

  if (englishMatch) {
    return englishMatch;
  }

  return translations.length > 0 ? translations[0] : null;
}

export function buildWeeklyActivityChart(
  attempts: Array<{
    startedAt: Date | null;
  }>,
  locale: string,
  now: Date = new Date(),
): DashboardChartPoint[] {
  const points: DashboardChartPoint[] = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(now);

    day.setHours(0, 0, 0, 0);
    day.setDate(now.getDate() - offset);

    const nextDay = new Date(day);

    nextDay.setDate(day.getDate() + 1);

    const count = attempts.filter((attempt) => {
      if (!attempt.startedAt) {
        return false;
      }

      return attempt.startedAt >= day && attempt.startedAt < nextDay;
    }).length;

    points.push({
      label: day.toLocaleDateString(locale, {
        weekday: "short",
      }),
      value: count,
    });
  }

  return points;
}

export function buildContinueLearningItem(
  params: {
    curriculumAttempts: DashboardCurriculumAttempt[];
    scenarioAttempts: DashboardScenarioAttempt[];
    locale: string;
  },
  t: Translator,
): DashboardContinueItem | null {
  const latestCurriculum = [...params.curriculumAttempts]
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

  const latestScenario = [...params.scenarioAttempts]
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

  const latestCurriculumTimestamp = latestCurriculum
    ? (latestCurriculum.lastOpenedAt?.getTime() ?? latestCurriculum.startedAt?.getTime() ?? 0)
    : 0;

  const latestScenarioTimestamp = latestScenario
    ? (latestScenario.lastOpenedAt?.getTime() ?? latestScenario.startedAt?.getTime() ?? 0)
    : 0;

  if (!latestCurriculum && !latestScenario) {
    return null;
  }

  if (latestCurriculum && latestCurriculumTimestamp >= latestScenarioTimestamp) {
    const translation = pickTranslation(latestCurriculum.course.translations, params.locale);

    const isCompleted = latestCurriculum.status === "completed";

    return {
      title: translation?.title ?? t("fallback.untitledModule"),
      description: translation?.description ?? t("fallback.continueDescription"),
      href: isCompleted
        ? `/${params.locale}/curriculum/${latestCurriculum.course.slug}`
        : `/${params.locale}/curriculum/${latestCurriculum.course.slug}/learn`,
      badge: t("fallback.curriculumBadge"),
      ctaLabel: isCompleted ? t("fallback.reviewModule") : t("fallback.continueModule"),
      kindLabel: isCompleted ? t("fallback.lastCompleted") : t("fallback.lastOpened"),
    };
  }

  if (latestScenario) {
    const isCompleted = latestScenario.status === "completed";

    const playHref = `/${params.locale}/scenarios/` + `${latestScenario.scenarioSlug}/play`;

    return {
      title: latestScenario.scenarioTitle,
      description: isCompleted
        ? t("fallback.reviewScenarioDescription")
        : t("fallback.continueScenarioDescription"),
      href: isCompleted ? `${playHref}?mode=review` : playHref,
      badge: t("fallback.scenarioBadge"),
      ctaLabel: isCompleted ? t("fallback.reviewScenario") : t("fallback.continueScenario"),
      kindLabel: isCompleted ? t("fallback.lastCompleted") : t("fallback.lastOpened"),
    };
  }

  return null;
}

export function buildLearnerSummaryMetrics(
  role: DashboardRole,
  curriculumAttempts: DashboardCurriculumAttempt[],
  scenarioAttempts: Array<{
    status: string;
    score: number | null;
  }>,
  t: Translator,
): DashboardMetric[] {
  if (role === "educator") {
    const attemptsWithPostQuizScore = curriculumAttempts.filter(
      (
        attempt,
      ): attempt is DashboardCurriculumAttempt & {
        postQuizScore: number;
      } => attempt.postQuizScore !== null,
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

  const completedCount = scenarioAttempts.filter(
    (attempt) => attempt.status === "completed",
  ).length;

  const completionRate =
    scenarioAttempts.length > 0 ? Math.round((completedCount / scenarioAttempts.length) * 100) : 0;

  const attemptsWithScore = scenarioAttempts.filter(
    (
      attempt,
    ): attempt is {
      status: string;
      score: number;
    } => attempt.score !== null,
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

export function buildGamificationStats(
  role: DashboardRole,
  learnerAttempts: DashboardActivityAttempt[],
  t: Translator,
): DashboardGamificationStat[] {
  if (role !== "learner" && role !== "educator") {
    return [];
  }

  const sortedDays = learnerAttempts
    .map((attempt) => {
      const sourceDate = attempt.completedAt ?? attempt.startedAt;

      if (!sourceDate) {
        return null;
      }

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

    for (let index = uniqueDays.length - 1; index > 0; index -= 1) {
      const current = uniqueDays[index];
      const previous = uniqueDays[index - 1];
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
