import type {
  AdminCourseStat,
  AdminLanguageStat,
  AdminScenarioStat,
  BasicAdminStats,
  ChartPoint,
  DashboardCurriculumAttemptRow,
  DashboardEportfolioProgressRow,
  DashboardScenarioAttemptRow,
  LocalizedTitleItem,
} from "@/lib/admin/types";
import { APP_LOCALES, DEFAULT_LOCALE, LOCALE_META } from "@/lib/i18n/locales";
import { prisma } from "@/lib/prisma";

function toIntlLocale(locale: string) {
  if (locale === "pl") return "pl-PL";
  if (locale === "it") return "it-IT";
  if (locale === "de") return "de-DE";
  if (locale === "el") return "el-GR";
  if (locale === "bg") return "bg-BG";
  return "en-GB";
}

function toPercent(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

function roundNullable(value: number | null) {
  return value === null ? null : Math.round(value);
}

function averageNullable(values: Array<number | null>) {
  const filtered = values.filter((value): value is number => value !== null);
  if (filtered.length === 0) return null;
  return Math.round(filtered.reduce((sum, value) => sum + value, 0) / filtered.length);
}

function formatScore(value: number | null) {
  if (value === null) return "—";
  const rounded = Number.isInteger(value) ? value : Math.round(value * 10) / 10;
  return `${rounded}%`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfHour(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addHours(date: Date, hours: number) {
  const next = new Date(date);
  next.setHours(next.getHours() + hours);
  return next;
}

function sameDay(a: Date | null, b: Date) {
  if (a === null) return false;

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function sameHour(a: Date | null, b: Date) {
  if (a === null) return false;

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate() &&
    a.getHours() === b.getHours()
  );
}

function buildLastDaysSeries(
  dates: Array<Date | null>,
  days: number,
  formatter: Intl.DateTimeFormat,
): ChartPoint[] {
  const today = startOfDay(new Date());

  return Array.from({ length: days }, (_, index) => {
    const day = addDays(today, index - (days - 1));

    return {
      label: formatter.format(day),
      value: dates.filter((date) => sameDay(date, day)).length,
    };
  });
}

function buildLast24HoursSeries(
  dates: Array<Date | null>,
  formatter: Intl.DateTimeFormat,
): ChartPoint[] {
  const currentHour = startOfHour(new Date());

  return Array.from({ length: 24 }, (_, index) => {
    const hour = addHours(currentHour, index - 23);

    return {
      label: formatter.format(hour),
      value: dates.filter((date) => sameHour(date, hour)).length,
    };
  });
}

function pickLocalizedTitle(items: LocalizedTitleItem[], locale: string, fallback: string) {
  const direct = items.find((item) => item.language === locale);
  if (direct?.title.trim()) return direct.title.trim();

  const english = items.find((item) => item.language === "en");
  if (english?.title.trim()) return english.title.trim();

  const first = items.find((item) => item.title.trim());
  if (first) return first.title.trim();

  return fallback;
}

function hasActivityInRange(
  row: {
    startedAt: Date | null;
    lastOpenedAt: Date | null;
    completedAt: Date | null;
  },
  since: Date,
) {
  return (
    (row.startedAt !== null && row.startedAt >= since) ||
    (row.lastOpenedAt !== null && row.lastOpenedAt >= since) ||
    (row.completedAt !== null && row.completedAt >= since)
  );
}

function getAttemptActivityDates(
  rows: Array<{
    startedAt: Date | null;
    lastOpenedAt: Date | null;
    completedAt: Date | null;
  }>,
) {
  return rows.flatMap((row) => [row.startedAt, row.lastOpenedAt, row.completedAt]);
}

function buildScenarioWindowStats(
  attempts: Array<{
    status: string;
    score: number | null;
  }>,
) {
  const passed = attempts.filter((attempt) => attempt.status === "passed").length;
  const completed = attempts.filter((attempt) => attempt.status === "completed").length;
  const failed = attempts.filter((attempt) => attempt.status === "failed").length;
  const completedLikeTotal = passed + completed;

  return {
    completionRate: toPercent(completedLikeTotal, attempts.length),
    averageScore: averageNullable(attempts.map((attempt) => attempt.score)),
    completedLikeTotal,
    failed,
  };
}

function buildCurriculumWindowStats(
  attempts: Array<{
    status: string;
    preQuizScore: number | null;
    postQuizScore: number | null;
  }>,
) {
  const completed = attempts.filter((attempt) => attempt.status === "completed").length;
  const inProgress = attempts.filter((attempt) => attempt.status === "in_progress").length;

  return {
    completionRate: toPercent(completed, attempts.length),
    averagePreQuizScore: averageNullable(attempts.map((attempt) => attempt.preQuizScore)),
    averagePostQuizScore: averageNullable(attempts.map((attempt) => attempt.postQuizScore)),
    inProgress,
  };
}

function buildEportfolioWindowStats(params: {
  records: Array<{ completedAt: Date | null }>;
  published: number;
  activeUsers: number;
}) {
  const completed = params.records.filter((record) => record.completedAt !== null).length;

  return {
    completionRate: toPercent(completed, params.records.length),
    published: params.published,
    activeUsers: params.activeUsers,
  };
}

function formatDateTimeLabel(date: Date | null, locale: string) {
  if (date === null) return "—";

  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function normalizeArea(area: string): "environmental" | "social" | "governance" | "cross-cutting" {
  if (area === "environmental") return "environmental";
  if (area === "social") return "social";
  if (area === "governance") return "governance";
  return "cross-cutting";
}

export async function getBasicAdminStats(locale = DEFAULT_LOCALE): Promise<BasicAdminStats> {
  const now = new Date();
  const today = startOfDay(now);

  const last24hStart = addHours(now, -24);
  const last7dStart = addDays(today, -6);
  const last30dStart = addDays(today, -29);

  const intlLocale = toIntlLocale(locale);

  const hourFormatter24h = new Intl.DateTimeFormat(intlLocale, { hour: "numeric" });
  const dayFormatter7d = new Intl.DateTimeFormat(intlLocale, { weekday: "short" });
  const dayFormatter30d = new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "short",
  });

  const [
    profiles,
    publishedCoursesWithTranslations,
    publishedCaseStudiesWithTranslations,
    publishedScenariosWithVariants,
    scenarioAttempts,
    courseAttempts,
    caseStudyProgressRecords,
    scenarioAttemptRowsRaw,
    curriculumAttemptRowsRaw,
    eportfolioProgressRowsRaw,
  ] = await Promise.all([
    prisma.profile.findMany({
      select: {
        id: true,
        role: true,
        preferredLanguage: true,
      },
    }),

    prisma.course.findMany({
      where: { status: "published" },
      select: {
        id: true,
        slug: true,
        area: true,
        difficulty: true,
        translations: {
          select: {
            language: true,
            title: true,
          },
        },
        userCourseAttempts: {
          select: {
            status: true,
            preQuizScore: true,
            postQuizScore: true,
            startedAt: true,
            lastOpenedAt: true,
            completedAt: true,
          },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),

    prisma.caseStudy.findMany({
      where: { status: "published" },
      select: {
        id: true,
        slug: true,
        translations: {
          select: {
            language: true,
            title: true,
          },
        },
      },
    }),

    prisma.scenario.findMany({
      where: { status: "published" },
      select: {
        id: true,
        slug: true,
        area: true,
        variants: {
          select: {
            id: true,
            language: true,
            title: true,
            availabilityStatus: true,
            userAttempts: {
              select: {
                userId: true,
                status: true,
                score: true,
                startedAt: true,
                lastOpenedAt: true,
                completedAt: true,
              },
            },
          },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),

    prisma.userScenarioAttempt.findMany({
      select: {
        userId: true,
        status: true,
        score: true,
        startedAt: true,
        lastOpenedAt: true,
        completedAt: true,
      },
    }),

    prisma.userCourseAttempt.findMany({
      select: {
        userId: true,
        status: true,
        preQuizScore: true,
        postQuizScore: true,
        startedAt: true,
        lastOpenedAt: true,
        completedAt: true,
      },
    }),

    prisma.userCaseStudyProgress.findMany({
      select: {
        completedAt: true,
      },
    }),

    prisma.userScenarioAttempt.findMany({
      take: 20,
      orderBy: [{ lastOpenedAt: "desc" }, { startedAt: "desc" }],
      select: {
        id: true,
        attemptNumber: true,
        status: true,
        score: true,
        startedAt: true,
        lastOpenedAt: true,
        completedAt: true,
        user: {
          select: {
            fullName: true,
            email: true,
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
            language: true,
            title: true,
          },
        },
      },
    }),

    prisma.userCourseAttempt.findMany({
      take: 20,
      orderBy: [{ lastOpenedAt: "desc" }, { startedAt: "desc" }],
      select: {
        id: true,
        status: true,
        preQuizScore: true,
        postQuizScore: true,
        startedAt: true,
        lastOpenedAt: true,
        completedAt: true,
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        course: {
          select: {
            slug: true,
            area: true,
            translations: {
              select: {
                language: true,
                title: true,
              },
            },
          },
        },
      },
    }),

    prisma.userCaseStudyProgress.findMany({
      take: 20,
      orderBy: [{ lastOpenedAt: "desc" }, { startedAt: "desc" }, { completedAt: "desc" }],
      select: {
        id: true,
        startedAt: true,
        lastOpenedAt: true,
        completedAt: true,
        user: {
          select: {
            fullName: true,
            email: true,
            preferredLanguage: true,
          },
        },
        caseStudy: {
          select: {
            slug: true,
            translations: {
              select: {
                language: true,
                title: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const totalUsers = profiles.length;
  const totalStudents = profiles.filter((profile) => profile.role === "student").length;
  const totalEducators = profiles.filter((profile) => profile.role === "educator").length;
  const totalAdmins = profiles.filter((profile) => profile.role === "admin").length;

  const publishedCourses = publishedCoursesWithTranslations.length;
  const publishedCaseStudies = publishedCaseStudiesWithTranslations.length;
  const publishedScenarios = publishedScenariosWithVariants.length;
  const availableScenarioVariants = publishedScenariosWithVariants.reduce(
    (sum, scenario) =>
      sum +
      scenario.variants.filter((variant) => variant.availabilityStatus === "available").length,
    0,
  );

  const passedScenarioAttempts = scenarioAttempts.filter(
    (attempt) => attempt.status === "passed",
  ).length;
  const completedScenarioAttempts = scenarioAttempts.filter(
    (attempt) => attempt.status === "completed",
  ).length;
  const failedScenarioAttempts = scenarioAttempts.filter(
    (attempt) => attempt.status === "failed",
  ).length;
  const incompleteScenarioAttempts = scenarioAttempts.filter(
    (attempt) => attempt.status === "incomplete",
  ).length;
  const browsedScenarioAttempts = scenarioAttempts.filter(
    (attempt) => attempt.status === "browsed",
  ).length;
  const scenarioCompletedLike = passedScenarioAttempts + completedScenarioAttempts;
  const scenarioScores = scenarioAttempts
    .map((attempt) => attempt.score)
    .filter((score): score is number => score !== null);

  const completedCourseAttempts = courseAttempts.filter(
    (attempt) => attempt.status === "completed",
  ).length;
  const inProgressCourseAttempts = courseAttempts.filter(
    (attempt) => attempt.status === "in_progress",
  ).length;
  const failedCourseAttempts = courseAttempts.filter(
    (attempt) => attempt.status === "failed",
  ).length;

  const preQuizScores = courseAttempts
    .map((attempt) => attempt.preQuizScore)
    .filter((score): score is number => score !== null);

  const postQuizScores = courseAttempts
    .map((attempt) => attempt.postQuizScore)
    .filter((score): score is number => score !== null);

  const completedCaseStudies = caseStudyProgressRecords.filter(
    (item) => item.completedAt !== null,
  ).length;

  const recentScenarioAttempts24h = scenarioAttempts.filter((attempt) =>
    hasActivityInRange(attempt, last24hStart),
  );
  const recentScenarioAttempts7d = scenarioAttempts.filter((attempt) =>
    hasActivityInRange(attempt, last7dStart),
  );
  const recentScenarioAttempts30d = scenarioAttempts.filter((attempt) =>
    hasActivityInRange(attempt, last30dStart),
  );

  const recentCourseAttempts24h = courseAttempts.filter((attempt) =>
    hasActivityInRange(attempt, last24hStart),
  );
  const recentCourseAttempts7d = courseAttempts.filter((attempt) =>
    hasActivityInRange(attempt, last7dStart),
  );
  const recentCourseAttempts30d = courseAttempts.filter((attempt) =>
    hasActivityInRange(attempt, last30dStart),
  );

  const recentEportfolioRecords24h = caseStudyProgressRecords.filter(
    (item) => item.completedAt !== null && item.completedAt >= last24hStart,
  );
  const recentEportfolioRecords7d = caseStudyProgressRecords.filter(
    (item) => item.completedAt !== null && item.completedAt >= last7dStart,
  );
  const recentEportfolioRecords30d = caseStudyProgressRecords.filter(
    (item) => item.completedAt !== null && item.completedAt >= last30dStart,
  );

  const activeUsersLast24h = new Set([
    ...recentScenarioAttempts24h.map((item) => item.userId),
    ...recentCourseAttempts24h.map((item) => item.userId),
  ]).size;

  const activeUsersLast7Days = new Set([
    ...recentScenarioAttempts7d.map((item) => item.userId),
    ...recentCourseAttempts7d.map((item) => item.userId),
  ]).size;

  const activeUsersLast30Days = new Set([
    ...recentScenarioAttempts30d.map((item) => item.userId),
    ...recentCourseAttempts30d.map((item) => item.userId),
  ]).size;

  const scenarioDates24h = getAttemptActivityDates(recentScenarioAttempts24h);
  const scenarioDates7d = getAttemptActivityDates(recentScenarioAttempts7d);
  const scenarioDates30d = getAttemptActivityDates(recentScenarioAttempts30d);

  const curriculumDates24h = getAttemptActivityDates(recentCourseAttempts24h);
  const curriculumDates7d = getAttemptActivityDates(recentCourseAttempts7d);
  const curriculumDates30d = getAttemptActivityDates(recentCourseAttempts30d);

  const eportfolioDates24h = recentEportfolioRecords24h.map((row) => row.completedAt);
  const eportfolioDates7d = recentEportfolioRecords7d.map((row) => row.completedAt);
  const eportfolioDates30d = recentEportfolioRecords30d.map((row) => row.completedAt);

  const scenarioStats24h = buildScenarioWindowStats(recentScenarioAttempts24h);
  const scenarioStats7d = buildScenarioWindowStats(recentScenarioAttempts7d);
  const scenarioStats30d = buildScenarioWindowStats(recentScenarioAttempts30d);

  const curriculumStats24h = buildCurriculumWindowStats(recentCourseAttempts24h);
  const curriculumStats7d = buildCurriculumWindowStats(recentCourseAttempts7d);
  const curriculumStats30d = buildCurriculumWindowStats(recentCourseAttempts30d);

  const eportfolioStats24h = buildEportfolioWindowStats({
    records: recentEportfolioRecords24h,
    published: publishedCaseStudies,
    activeUsers: activeUsersLast24h,
  });

  const eportfolioStats7d = buildEportfolioWindowStats({
    records: recentEportfolioRecords7d,
    published: publishedCaseStudies,
    activeUsers: activeUsersLast7Days,
  });

  const eportfolioStats30d = buildEportfolioWindowStats({
    records: recentEportfolioRecords30d,
    published: publishedCaseStudies,
    activeUsers: activeUsersLast30Days,
  });

  const languageCodes = new Set<string>();

  for (const profile of profiles) {
    languageCodes.add(profile.preferredLanguage);
  }

  for (const course of publishedCoursesWithTranslations) {
    for (const translation of course.translations) {
      languageCodes.add(translation.language);
    }
  }

  for (const caseStudy of publishedCaseStudiesWithTranslations) {
    for (const translation of caseStudy.translations) {
      languageCodes.add(translation.language);
    }
  }

  for (const scenario of publishedScenariosWithVariants) {
    for (const variant of scenario.variants) {
      languageCodes.add(variant.language);
    }
  }

  const languageBreakdown: AdminLanguageStat[] = APP_LOCALES.map((code) => ({
    code,
    label: LOCALE_META[code].label,
    users: profiles.filter((profile) => profile.preferredLanguage === code).length,
    publishedCourses: publishedCoursesWithTranslations.filter((course) =>
      course.translations.some((translation) => translation.language === code),
    ).length,
    publishedCaseStudies: publishedCaseStudiesWithTranslations.filter((caseStudy) =>
      caseStudy.translations.some((translation) => translation.language === code),
    ).length,
    availableScenarioVariants: publishedScenariosWithVariants.reduce((sum, scenario) => {
      return (
        sum +
        scenario.variants.filter(
          (variant) => variant.language === code && variant.availabilityStatus === "available",
        ).length
      );
    }, 0),
  }));

  const scenarioBreakdown: AdminScenarioStat[] = publishedScenariosWithVariants.map((scenario) => {
    const attempts = scenario.variants.flatMap((variant) => variant.userAttempts);
    const scores = attempts
      .map((attempt) => attempt.score)
      .filter((score): score is number => score !== null);

    const passed = attempts.filter((attempt) => attempt.status === "passed").length;
    const completed = attempts.filter((attempt) => attempt.status === "completed").length;
    const completedLikeTotal = passed + completed;

    return {
      id: scenario.id,
      slug: scenario.slug,
      title: pickLocalizedTitle(
        scenario.variants.map((variant) => ({
          language: variant.language,
          title: variant.title,
        })),
        locale,
        scenario.slug,
      ),
      area: scenario.area,
      languages: [...new Set(scenario.variants.map((variant) => variant.language))].sort(),
      availableVariants: scenario.variants.filter(
        (variant) => variant.availabilityStatus === "available",
      ).length,
      totalAttempts: attempts.length,
      completedLikeTotal,
      completionRate: toPercent(completedLikeTotal, attempts.length),
      averageScore:
        scores.length > 0
          ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length)
          : null,
    };
  });

  const courseBreakdown: AdminCourseStat[] = publishedCoursesWithTranslations.map((course) => {
    const attempts = course.userCourseAttempts;
    const completed = attempts.filter((attempt) => attempt.status === "completed").length;
    const inProgress = attempts.filter((attempt) => attempt.status === "in_progress").length;
    const failed = attempts.filter((attempt) => attempt.status === "failed").length;

    const coursePreScores = attempts
      .map((attempt) => attempt.preQuizScore)
      .filter((score): score is number => score !== null);

    const coursePostScores = attempts
      .map((attempt) => attempt.postQuizScore)
      .filter((score): score is number => score !== null);

    return {
      id: course.id,
      slug: course.slug,
      title: pickLocalizedTitle(course.translations, locale, course.slug),
      area: course.area,
      difficulty: course.difficulty,
      totalAttempts: attempts.length,
      completed,
      inProgress,
      failed,
      completionRate: toPercent(completed, attempts.length),
      averagePreQuizScore:
        coursePreScores.length > 0
          ? Math.round(
              coursePreScores.reduce((sum, value) => sum + value, 0) / coursePreScores.length,
            )
          : null,
      averagePostQuizScore:
        coursePostScores.length > 0
          ? Math.round(
              coursePostScores.reduce((sum, value) => sum + value, 0) / coursePostScores.length,
            )
          : null,
    };
  });

  const scenarioAttemptRows: DashboardScenarioAttemptRow[] = scenarioAttemptRowsRaw.map(
    (attempt) => ({
      id: attempt.id,
      learnerName: attempt.user.fullName ?? attempt.user.email.split("@")[0],
      learnerEmail: attempt.user.email,
      scenarioTitle: attempt.scenarioVariant.title,
      scenarioSlug: attempt.scenario.slug,
      area: normalizeArea(attempt.scenario.area),
      language: attempt.scenarioVariant.language.toUpperCase(),
      attemptNumber: attempt.attemptNumber,
      status: attempt.status as DashboardScenarioAttemptRow["status"],
      scoreLabel: formatScore(attempt.score),
      startedAtLabel: formatDateTimeLabel(attempt.startedAt, locale),
      lastOpenedAtLabel: formatDateTimeLabel(attempt.lastOpenedAt, locale),
      completedAtLabel: formatDateTimeLabel(attempt.completedAt, locale),
    }),
  );

  const curriculumAttemptRows: DashboardCurriculumAttemptRow[] = curriculumAttemptRowsRaw.map(
    (attempt, index) => ({
      id: attempt.id,
      learnerName: attempt.user.fullName ?? attempt.user.email.split("@")[0],
      learnerEmail: attempt.user.email,
      courseTitle: pickLocalizedTitle(attempt.course.translations, locale, attempt.course.slug),
      courseSlug: attempt.course.slug,
      area: normalizeArea(attempt.course.area),
      attemptNumber: index + 1,
      status: attempt.status as DashboardCurriculumAttemptRow["status"],
      preQuizScoreLabel: formatScore(attempt.preQuizScore),
      postQuizScoreLabel: formatScore(attempt.postQuizScore),
      startedAtLabel: formatDateTimeLabel(attempt.startedAt, locale),
      lastOpenedAtLabel: formatDateTimeLabel(attempt.lastOpenedAt, locale),
      completedAtLabel: formatDateTimeLabel(attempt.completedAt, locale),
    }),
  );

  const eportfolioProgressRows: DashboardEportfolioProgressRow[] = eportfolioProgressRowsRaw.map(
    (progress) => ({
      id: progress.id,
      learnerName: progress.user.fullName ?? progress.user.email.split("@")[0],
      learnerEmail: progress.user.email,
      caseStudyTitle: pickLocalizedTitle(
        progress.caseStudy.translations,
        locale,
        progress.caseStudy.slug,
      ),
      caseStudySlug: progress.caseStudy.slug,
      language: progress.user.preferredLanguage.toUpperCase(),
      isCompleted: progress.completedAt !== null,
      startedAtLabel: formatDateTimeLabel(progress.startedAt, locale),
      lastOpenedAtLabel: formatDateTimeLabel(progress.lastOpenedAt, locale),
      completedAtLabel: formatDateTimeLabel(progress.completedAt, locale),
    }),
  );

  return {
    generatedAt: new Date().toISOString(),
    users: {
      total: totalUsers,
      students: totalStudents,
      educators: totalEducators,
      admins: totalAdmins,
    },
    content: {
      publishedCourses,
      publishedCaseStudies,
      publishedScenarios,
      availableScenarioVariants,
    },
    scenarioAttempts: {
      total: scenarioAttempts.length,
      passed: passedScenarioAttempts,
      completed: completedScenarioAttempts,
      failed: failedScenarioAttempts,
      incomplete: incompleteScenarioAttempts,
      browsed: browsedScenarioAttempts,
      completedLikeTotal: scenarioCompletedLike,
      completionRate: toPercent(scenarioCompletedLike, scenarioAttempts.length),
      averageScore:
        scenarioScores.length > 0
          ? roundNullable(
              scenarioScores.reduce((sum, value) => sum + value, 0) / scenarioScores.length,
            )
          : null,
    },
    curriculum: {
      totalAttempts: courseAttempts.length,
      completed: completedCourseAttempts,
      inProgress: inProgressCourseAttempts,
      failed: failedCourseAttempts,
      completionRate: toPercent(completedCourseAttempts, courseAttempts.length),
      averagePreQuizScore:
        preQuizScores.length > 0
          ? roundNullable(
              preQuizScores.reduce((sum, value) => sum + value, 0) / preQuizScores.length,
            )
          : null,
      averagePostQuizScore:
        postQuizScores.length > 0
          ? roundNullable(
              postQuizScores.reduce((sum, value) => sum + value, 0) / postQuizScores.length,
            )
          : null,
    },
    eportfolio: {
      totalProgressRecords: caseStudyProgressRecords.length,
      completedCaseStudies,
      completionRate: toPercent(completedCaseStudies, caseStudyProgressRecords.length),
    },
    activity: {
      activeUsersLast24h,
      activeUsersLast7Days,
      activeUsersLast30Days,

      recentScenarioAttempts24h: recentScenarioAttempts24h.length,
      recentScenarioAttempts: recentScenarioAttempts7d.length,
      recentScenarioAttempts30d: recentScenarioAttempts30d.length,

      recentCourseAttempts24h: recentCourseAttempts24h.length,
      recentCourseAttempts: recentCourseAttempts7d.length,
      recentCourseAttempts30d: recentCourseAttempts30d.length,

      recentEportfolioEvents24h: recentEportfolioRecords24h.length,
      recentEportfolioEvents: recentEportfolioRecords7d.length,
      recentEportfolioEvents30d: recentEportfolioRecords30d.length,

      scenarioSeries24h: buildLast24HoursSeries(scenarioDates24h, hourFormatter24h),
      scenarioSeries: buildLastDaysSeries(scenarioDates7d, 7, dayFormatter7d),
      scenarioSeries30d: buildLastDaysSeries(scenarioDates30d, 30, dayFormatter30d),

      curriculumSeries24h: buildLast24HoursSeries(curriculumDates24h, hourFormatter24h),
      curriculumSeries: buildLastDaysSeries(curriculumDates7d, 7, dayFormatter7d),
      curriculumSeries30d: buildLastDaysSeries(curriculumDates30d, 30, dayFormatter30d),

      eportfolioSeries24h: buildLast24HoursSeries(eportfolioDates24h, hourFormatter24h),
      eportfolioSeries: buildLastDaysSeries(eportfolioDates7d, 7, dayFormatter7d),
      eportfolioSeries30d: buildLastDaysSeries(eportfolioDates30d, 30, dayFormatter30d),

      scenarioStats24h,
      scenarioStats7d,
      scenarioStats30d,

      curriculumStats24h,
      curriculumStats7d,
      curriculumStats30d,

      eportfolioStats24h,
      eportfolioStats7d,
      eportfolioStats30d,
    },
    languageBreakdown,
    scenarioBreakdown,
    courseBreakdown,
    scenarioAttemptRows,
    curriculumAttemptRows,
    eportfolioProgressRows,
  };
}
