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
import type { AppLocale } from "@/lib/i18n/locales";
import { APP_LOCALES, DEFAULT_LOCALE, LOCALE_META } from "@/lib/i18n/locales";
import {
  logMeasuredOperation,
  measureAsyncOperation,
  measureSyncOperation,
} from "@/lib/observability/performance";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const DASHBOARD_ROWS_LIMIT = 12;

function estimateJsonBytes(value: unknown) {
  return new TextEncoder().encode(JSON.stringify(value)).length;
}

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

function averageFromSumAndCount(sum: number, count: number) {
  if (count <= 0) return null;
  return Math.round(sum / count);
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

function incrementMapCount(map: Map<number | string, number>, key: number | string, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function addDateToBucketMap(
  map: Map<number, number>,
  date: Date | null,
  mode: "day" | "hour",
  since: Date,
) {
  if (date === null || date < since) return;

  const bucketStart = mode === "hour" ? startOfHour(date).getTime() : startOfDay(date).getTime();
  incrementMapCount(map, bucketStart);
}

function buildLastDaysSeries(
  bucketCounts: Map<number, number>,
  days: number,
  formatter: Intl.DateTimeFormat,
): ChartPoint[] {
  const today = startOfDay(new Date());

  return Array.from({ length: days }, (_, index) => {
    const day = addDays(today, index - (days - 1));

    return {
      label: formatter.format(day),
      value: bucketCounts.get(day.getTime()) ?? 0,
    };
  });
}

function buildLast24HoursSeries(
  bucketCounts: Map<number, number>,
  formatter: Intl.DateTimeFormat,
): ChartPoint[] {
  const currentHour = startOfHour(new Date());

  return Array.from({ length: 24 }, (_, index) => {
    const hour = addHours(currentHour, index - 23);

    return {
      label: formatter.format(hour),
      value: bucketCounts.get(hour.getTime()) ?? 0,
    };
  });
}

function pickLocalizedTitle(items: LocalizedTitleItem[], locale: string, fallback: string) {
  let englishTitle: string | null = null;
  let firstTitle: string | null = null;

  for (const item of items) {
    const title = item.title.trim();
    if (!title) continue;

    firstTitle ??= title;

    if (item.language === locale) {
      return title;
    }

    if (englishTitle === null && item.language === "en") {
      englishTitle = title;
    }
  }

  return englishTitle ?? firstTitle ?? fallback;
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

function buildRecentActivityWhere(since: Date) {
  return {
    OR: [
      { startedAt: { gte: since } },
      { lastOpenedAt: { gte: since } },
      { completedAt: { gte: since } },
    ],
  };
}

type ScenarioWindowAggregate = {
  total: number;
  passed: number;
  completed: number;
  failed: number;
  scoreSum: number;
  scoreCount: number;
  activeUsers: Set<string>;
  hourBuckets: Map<number, number>;
  dayBuckets: Map<number, number>;
};

type CurriculumWindowAggregate = {
  total: number;
  completed: number;
  inProgress: number;
  preQuizScoreSum: number;
  preQuizScoreCount: number;
  postQuizScoreSum: number;
  postQuizScoreCount: number;
  activeUsers: Set<string>;
  hourBuckets: Map<number, number>;
  dayBuckets: Map<number, number>;
};

type EportfolioWindowAggregate = {
  total: number;
  completed: number;
  hourBuckets: Map<number, number>;
  dayBuckets: Map<number, number>;
};

function createScenarioWindowAggregate(): ScenarioWindowAggregate {
  return {
    total: 0,
    passed: 0,
    completed: 0,
    failed: 0,
    scoreSum: 0,
    scoreCount: 0,
    activeUsers: new Set<string>(),
    hourBuckets: new Map<number, number>(),
    dayBuckets: new Map<number, number>(),
  };
}

function createCurriculumWindowAggregate(): CurriculumWindowAggregate {
  return {
    total: 0,
    completed: 0,
    inProgress: 0,
    preQuizScoreSum: 0,
    preQuizScoreCount: 0,
    postQuizScoreSum: 0,
    postQuizScoreCount: 0,
    activeUsers: new Set<string>(),
    hourBuckets: new Map<number, number>(),
    dayBuckets: new Map<number, number>(),
  };
}

function createEportfolioWindowAggregate(): EportfolioWindowAggregate {
  return {
    total: 0,
    completed: 0,
    hourBuckets: new Map<number, number>(),
    dayBuckets: new Map<number, number>(),
  };
}

function updateScenarioWindowAggregate(
  aggregate: ScenarioWindowAggregate,
  attempt: {
    userId: string;
    status: string;
    score: number | null;
    startedAt: Date | null;
    lastOpenedAt: Date | null;
    completedAt: Date | null;
  },
  since: Date,
  bucketMode: "day" | "hour",
) {
  if (!hasActivityInRange(attempt, since)) return;

  aggregate.total += 1;
  aggregate.activeUsers.add(attempt.userId);

  if (attempt.status === "passed") aggregate.passed += 1;
  if (attempt.status === "completed") aggregate.completed += 1;
  if (attempt.status === "failed") aggregate.failed += 1;

  if (attempt.score !== null) {
    aggregate.scoreSum += attempt.score;
    aggregate.scoreCount += 1;
  }

  const bucketMap = bucketMode === "hour" ? aggregate.hourBuckets : aggregate.dayBuckets;
  addDateToBucketMap(bucketMap, attempt.startedAt, bucketMode, since);
  addDateToBucketMap(bucketMap, attempt.lastOpenedAt, bucketMode, since);
  addDateToBucketMap(bucketMap, attempt.completedAt, bucketMode, since);
}

function updateCurriculumWindowAggregate(
  aggregate: CurriculumWindowAggregate,
  attempt: {
    userId: string;
    status: string;
    preQuizScore: number | null;
    postQuizScore: number | null;
    startedAt: Date | null;
    lastOpenedAt: Date | null;
    completedAt: Date | null;
  },
  since: Date,
  bucketMode: "day" | "hour",
) {
  if (!hasActivityInRange(attempt, since)) return;

  aggregate.total += 1;
  aggregate.activeUsers.add(attempt.userId);

  if (attempt.status === "completed") aggregate.completed += 1;
  if (attempt.status === "in_progress") aggregate.inProgress += 1;

  if (attempt.preQuizScore !== null) {
    aggregate.preQuizScoreSum += attempt.preQuizScore;
    aggregate.preQuizScoreCount += 1;
  }

  if (attempt.postQuizScore !== null) {
    aggregate.postQuizScoreSum += attempt.postQuizScore;
    aggregate.postQuizScoreCount += 1;
  }

  const bucketMap = bucketMode === "hour" ? aggregate.hourBuckets : aggregate.dayBuckets;
  addDateToBucketMap(bucketMap, attempt.startedAt, bucketMode, since);
  addDateToBucketMap(bucketMap, attempt.lastOpenedAt, bucketMode, since);
  addDateToBucketMap(bucketMap, attempt.completedAt, bucketMode, since);
}

function updateEportfolioWindowAggregate(
  aggregate: EportfolioWindowAggregate,
  record: { completedAt: Date | null },
  since: Date,
  bucketMode: "day" | "hour",
) {
  if (record.completedAt === null || record.completedAt < since) return;

  aggregate.total += 1;
  aggregate.completed += 1;

  const bucketMap = bucketMode === "hour" ? aggregate.hourBuckets : aggregate.dayBuckets;
  addDateToBucketMap(bucketMap, record.completedAt, bucketMode, since);
}

function buildScenarioWindowStats(aggregate: ScenarioWindowAggregate) {
  const completedLikeTotal = aggregate.passed + aggregate.completed;

  return {
    completionRate: toPercent(completedLikeTotal, aggregate.total),
    averageScore: averageFromSumAndCount(aggregate.scoreSum, aggregate.scoreCount),
    completedLikeTotal,
    failed: aggregate.failed,
  };
}

function buildCurriculumWindowStats(aggregate: CurriculumWindowAggregate) {
  return {
    completionRate: toPercent(aggregate.completed, aggregate.total),
    averagePreQuizScore: averageFromSumAndCount(
      aggregate.preQuizScoreSum,
      aggregate.preQuizScoreCount,
    ),
    averagePostQuizScore: averageFromSumAndCount(
      aggregate.postQuizScoreSum,
      aggregate.postQuizScoreCount,
    ),
    inProgress: aggregate.inProgress,
  };
}

function buildEportfolioWindowStats(params: {
  aggregate: EportfolioWindowAggregate;
  published: number;
  activeUsers: number;
}) {
  return {
    completionRate: toPercent(params.aggregate.completed, params.aggregate.total),
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

function countCourseTranslations(courses: Array<{ translations: Array<{ language: string }> }>) {
  return courses.reduce((sum, course) => sum + course.translations.length, 0);
}

function countCaseStudyTranslations(
  caseStudies: Array<{ translations: Array<{ language: string }> }>,
) {
  return caseStudies.reduce((sum, caseStudy) => sum + caseStudy.translations.length, 0);
}

function countScenarioVariants(scenarios: Array<{ variants: unknown[] }>) {
  return scenarios.reduce((sum, scenario) => sum + scenario.variants.length, 0);
}

function getGroupedCount<T extends { _count: { _all: number } }>(
  rows: T[],
  predicate: (row: T) => boolean,
) {
  const match = rows.find(predicate);
  return match?._count._all ?? 0;
}

type GetBasicAdminStatsOptions = {
  includeBreakdowns?: boolean;
  includeRows?: boolean;
};

async function getBasicAdminStatsUncached(
  locale: AppLocale = DEFAULT_LOCALE,
  options: GetBasicAdminStatsOptions = {},
): Promise<BasicAdminStats> {
  const includeBreakdowns = options.includeBreakdowns ?? true;
  const includeRows = options.includeRows ?? true;

  return measureAsyncOperation({
    operation: "admin.getBasicAdminStats",
    getRecords: (stats) =>
      stats.scenarioAttemptRows.length +
      stats.curriculumAttemptRows.length +
      stats.eportfolioProgressRows.length,
    execute: async () => {
      const queryStartedAt = Date.now();

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

      const recentActivityWhere = buildRecentActivityWhere(last30dStart);

      const [
        totalUsers,
        profilesByRole,
        usersByLanguageRaw,
        publishedCourses,
        publishedCaseStudies,
        publishedScenarios,
        availableScenarioVariants,
        publishedCoursesWithTranslations,
        publishedCaseStudiesWithTranslations,
        publishedScenariosWithVariants,
        scenarioAttemptsAggregate,
        scenarioAttemptsByStatus,
        scenarioAttemptsRecent,
        scenarioAttemptsByScenario,
        scenarioAttemptsByScenarioStatus,
        courseAttemptsAggregate,
        courseAttemptsByStatus,
        courseAttemptsRecent,
        courseAttemptsByCourse,
        courseAttemptsByCourseStatus,
        totalProgressRecords,
        completedCaseStudies,
        caseStudyProgressRecords,
        scenarioAttemptRowsRaw,
        curriculumAttemptRowsRaw,
        eportfolioProgressRowsRaw,
      ] = await Promise.all([
        prisma.profile.count(),

        prisma.profile.groupBy({
          by: ["role"],
          _count: { _all: true },
        }),

        includeBreakdowns
          ? prisma.profile.groupBy({
              by: ["preferredLanguage"],
              _count: { _all: true },
            })
          : Promise.resolve([]),

        prisma.course.count({
          where: { status: "published" },
        }),

        prisma.caseStudy.count({
          where: { status: "published" },
        }),

        prisma.scenario.count({
          where: { status: "published" },
        }),

        prisma.scenarioVariant.count({
          where: {
            availabilityStatus: "available",
            scenario: {
              status: "published",
            },
          },
        }),

        includeBreakdowns
          ? prisma.course.findMany({
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
              },
              orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            })
          : Promise.resolve([]),

        includeBreakdowns
          ? prisma.caseStudy.findMany({
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
            })
          : Promise.resolve([]),

        includeBreakdowns
          ? prisma.scenario.findMany({
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
                  },
                },
              },
              orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            })
          : Promise.resolve([]),

        prisma.userScenarioAttempt.aggregate({
          _count: { _all: true },
          _avg: { score: true },
        }),

        prisma.userScenarioAttempt.groupBy({
          by: ["status"],
          _count: { _all: true },
        }),

        prisma.userScenarioAttempt.findMany({
          where: recentActivityWhere,
          select: {
            userId: true,
            status: true,
            score: true,
            startedAt: true,
            lastOpenedAt: true,
            completedAt: true,
          },
        }),

        includeBreakdowns
          ? prisma.userScenarioAttempt.groupBy({
              by: ["scenarioId"],
              _count: { _all: true },
              _avg: { score: true },
            })
          : Promise.resolve([]),

        includeBreakdowns
          ? prisma.userScenarioAttempt.groupBy({
              by: ["scenarioId", "status"],
              _count: { _all: true },
            })
          : Promise.resolve([]),

        prisma.userCourseAttempt.aggregate({
          _count: { _all: true },
          _avg: {
            preQuizScore: true,
            postQuizScore: true,
          },
        }),

        prisma.userCourseAttempt.groupBy({
          by: ["status"],
          _count: { _all: true },
        }),

        prisma.userCourseAttempt.findMany({
          where: recentActivityWhere,
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

        includeBreakdowns
          ? prisma.userCourseAttempt.groupBy({
              by: ["courseId"],
              _count: { _all: true },
              _avg: {
                preQuizScore: true,
                postQuizScore: true,
              },
            })
          : Promise.resolve([]),

        includeBreakdowns
          ? prisma.userCourseAttempt.groupBy({
              by: ["courseId", "status"],
              _count: { _all: true },
            })
          : Promise.resolve([]),

        prisma.userCaseStudyProgress.count(),

        prisma.userCaseStudyProgress.count({
          where: {
            completedAt: {
              not: null,
            },
          },
        }),

        prisma.userCaseStudyProgress.findMany({
          where: {
            completedAt: {
              gte: last30dStart,
            },
          },
          select: {
            completedAt: true,
          },
        }),

        includeRows
          ? prisma.userScenarioAttempt.findMany({
              take: DASHBOARD_ROWS_LIMIT,
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
            })
          : Promise.resolve([]),

        includeRows
          ? prisma.userCourseAttempt.findMany({
              take: DASHBOARD_ROWS_LIMIT,
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
            })
          : Promise.resolve([]),

        includeRows
          ? prisma.userCaseStudyProgress.findMany({
              take: DASHBOARD_ROWS_LIMIT,
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
            })
          : Promise.resolve([]),
      ]);

      logMeasuredOperation({
        operation: "admin.getBasicAdminStats.fetch",
        durationMs: Date.now() - queryStartedAt,
        records:
          profilesByRole.length +
          usersByLanguageRaw.length +
          publishedCoursesWithTranslations.length +
          publishedCaseStudiesWithTranslations.length +
          publishedScenariosWithVariants.length +
          scenarioAttemptsByStatus.length +
          scenarioAttemptsRecent.length +
          scenarioAttemptsByScenario.length +
          scenarioAttemptsByScenarioStatus.length +
          courseAttemptsByStatus.length +
          courseAttemptsRecent.length +
          courseAttemptsByCourse.length +
          courseAttemptsByCourseStatus.length +
          caseStudyProgressRecords.length +
          scenarioAttemptRowsRaw.length +
          curriculumAttemptRowsRaw.length +
          eportfolioProgressRowsRaw.length,
        meta: {
          courseTranslations: countCourseTranslations(publishedCoursesWithTranslations),
          caseStudyTranslations: countCaseStudyTranslations(publishedCaseStudiesWithTranslations),
          scenarioVariants: countScenarioVariants(publishedScenariosWithVariants),
          scenarioRecentAttempts: scenarioAttemptsRecent.length,
          courseRecentAttempts: courseAttemptsRecent.length,
          eportfolioRecentRecords: caseStudyProgressRecords.length,
          nodeElements:
            profilesByRole.length +
            usersByLanguageRaw.length +
            publishedCoursesWithTranslations.length +
            publishedCaseStudiesWithTranslations.length +
            publishedScenariosWithVariants.length +
            scenarioAttemptsRecent.length +
            courseAttemptsRecent.length +
            caseStudyProgressRecords.length +
            scenarioAttemptRowsRaw.length +
            curriculumAttemptRowsRaw.length +
            eportfolioProgressRowsRaw.length,
        },
      });

      const mappingStartedAt = Date.now();

      const totalStudents = getGroupedCount(profilesByRole, (row) => row.role === "student");
      const totalEducators = getGroupedCount(profilesByRole, (row) => row.role === "educator");
      const totalAdmins = getGroupedCount(profilesByRole, (row) => row.role === "admin");

      const usersByLanguage = new Map<string, number>();
      if (includeBreakdowns) {
        for (const row of usersByLanguageRaw) {
          incrementMapCount(usersByLanguage, row.preferredLanguage, row._count._all);
        }
      }

      const publishedCoursesByLanguage = new Map<string, number>();
      if (includeBreakdowns) {
        for (const course of publishedCoursesWithTranslations) {
          const languages = new Set(course.translations.map((translation) => translation.language));
          for (const language of languages) {
            incrementMapCount(publishedCoursesByLanguage, language);
          }
        }
      }

      const publishedCaseStudiesByLanguage = new Map<string, number>();
      if (includeBreakdowns) {
        for (const caseStudy of publishedCaseStudiesWithTranslations) {
          const languages = new Set(
            caseStudy.translations.map((translation) => translation.language),
          );
          for (const language of languages) {
            incrementMapCount(publishedCaseStudiesByLanguage, language);
          }
        }
      }

      const availableScenarioVariantsByLanguage = new Map<string, number>();
      if (includeBreakdowns) {
        for (const scenario of publishedScenariosWithVariants) {
          for (const variant of scenario.variants) {
            if (variant.availabilityStatus !== "available") continue;
            incrementMapCount(availableScenarioVariantsByLanguage, variant.language);
          }
        }
      }

      const passedScenarioAttempts = getGroupedCount(
        scenarioAttemptsByStatus,
        (row) => row.status === "passed",
      );
      const completedScenarioAttempts = getGroupedCount(
        scenarioAttemptsByStatus,
        (row) => row.status === "completed",
      );
      const failedScenarioAttempts = getGroupedCount(
        scenarioAttemptsByStatus,
        (row) => row.status === "failed",
      );
      const incompleteScenarioAttempts = getGroupedCount(
        scenarioAttemptsByStatus,
        (row) => row.status === "incomplete",
      );
      const browsedScenarioAttempts = getGroupedCount(
        scenarioAttemptsByStatus,
        (row) => row.status === "browsed",
      );

      const scenarioWindow24h = createScenarioWindowAggregate();
      const scenarioWindow7d = createScenarioWindowAggregate();
      const scenarioWindow30d = createScenarioWindowAggregate();

      for (const attempt of scenarioAttemptsRecent) {
        updateScenarioWindowAggregate(scenarioWindow24h, attempt, last24hStart, "hour");
        updateScenarioWindowAggregate(scenarioWindow7d, attempt, last7dStart, "day");
        updateScenarioWindowAggregate(scenarioWindow30d, attempt, last30dStart, "day");
      }

      const scenarioCompletedLike = passedScenarioAttempts + completedScenarioAttempts;

      const completedCourseAttempts = getGroupedCount(
        courseAttemptsByStatus,
        (row) => row.status === "completed",
      );
      const inProgressCourseAttempts = getGroupedCount(
        courseAttemptsByStatus,
        (row) => row.status === "in_progress",
      );
      const failedCourseAttempts = getGroupedCount(
        courseAttemptsByStatus,
        (row) => row.status === "failed",
      );

      const curriculumWindow24h = createCurriculumWindowAggregate();
      const curriculumWindow7d = createCurriculumWindowAggregate();
      const curriculumWindow30d = createCurriculumWindowAggregate();

      for (const attempt of courseAttemptsRecent) {
        updateCurriculumWindowAggregate(curriculumWindow24h, attempt, last24hStart, "hour");
        updateCurriculumWindowAggregate(curriculumWindow7d, attempt, last7dStart, "day");
        updateCurriculumWindowAggregate(curriculumWindow30d, attempt, last30dStart, "day");
      }

      const eportfolioWindow24h = createEportfolioWindowAggregate();
      const eportfolioWindow7d = createEportfolioWindowAggregate();
      const eportfolioWindow30d = createEportfolioWindowAggregate();

      for (const item of caseStudyProgressRecords) {
        updateEportfolioWindowAggregate(eportfolioWindow24h, item, last24hStart, "hour");
        updateEportfolioWindowAggregate(eportfolioWindow7d, item, last7dStart, "day");
        updateEportfolioWindowAggregate(eportfolioWindow30d, item, last30dStart, "day");
      }

      const activeUsersLast24h = new Set([
        ...scenarioWindow24h.activeUsers,
        ...curriculumWindow24h.activeUsers,
      ]).size;

      const activeUsersLast7Days = new Set([
        ...scenarioWindow7d.activeUsers,
        ...curriculumWindow7d.activeUsers,
      ]).size;

      const activeUsersLast30Days = new Set([
        ...scenarioWindow30d.activeUsers,
        ...curriculumWindow30d.activeUsers,
      ]).size;

      const scenarioStats24h = buildScenarioWindowStats(scenarioWindow24h);
      const scenarioStats7d = buildScenarioWindowStats(scenarioWindow7d);
      const scenarioStats30d = buildScenarioWindowStats(scenarioWindow30d);

      const curriculumStats24h = buildCurriculumWindowStats(curriculumWindow24h);
      const curriculumStats7d = buildCurriculumWindowStats(curriculumWindow7d);
      const curriculumStats30d = buildCurriculumWindowStats(curriculumWindow30d);

      const eportfolioStats24h = buildEportfolioWindowStats({
        aggregate: eportfolioWindow24h,
        published: publishedCaseStudies,
        activeUsers: activeUsersLast24h,
      });

      const eportfolioStats7d = buildEportfolioWindowStats({
        aggregate: eportfolioWindow7d,
        published: publishedCaseStudies,
        activeUsers: activeUsersLast7Days,
      });

      const eportfolioStats30d = buildEportfolioWindowStats({
        aggregate: eportfolioWindow30d,
        published: publishedCaseStudies,
        activeUsers: activeUsersLast30Days,
      });

      const languageBreakdown: AdminLanguageStat[] = includeBreakdowns
        ? APP_LOCALES.map((code) => ({
            code,
            label: LOCALE_META[code].label,
            users: usersByLanguage.get(code) ?? 0,
            publishedCourses: publishedCoursesByLanguage.get(code) ?? 0,
            publishedCaseStudies: publishedCaseStudiesByLanguage.get(code) ?? 0,
            availableScenarioVariants: availableScenarioVariantsByLanguage.get(code) ?? 0,
          }))
        : [];

      const scenarioAttemptsByScenarioId = includeBreakdowns
        ? new Map<
            string,
            {
              totalAttempts: number;
              passed: number;
              completed: number;
              averageScore: number | null;
            }
          >()
        : null;

      if (scenarioAttemptsByScenarioId !== null) {
        for (const row of scenarioAttemptsByScenario) {
          scenarioAttemptsByScenarioId.set(row.scenarioId, {
            totalAttempts: row._count._all,
            passed: 0,
            completed: 0,
            averageScore: row._avg.score ?? null,
          });
        }

        for (const row of scenarioAttemptsByScenarioStatus) {
          const aggregate = scenarioAttemptsByScenarioId.get(row.scenarioId) ?? {
            totalAttempts: 0,
            passed: 0,
            completed: 0,
            averageScore: null,
          };

          if (row.status === "passed") aggregate.passed = row._count._all;
          if (row.status === "completed") aggregate.completed = row._count._all;

          scenarioAttemptsByScenarioId.set(row.scenarioId, aggregate);
        }
      }

      const courseAttemptsByCourseId = includeBreakdowns
        ? new Map<
            string,
            {
              totalAttempts: number;
              completed: number;
              inProgress: number;
              failed: number;
              averagePreQuizScore: number | null;
              averagePostQuizScore: number | null;
            }
          >()
        : null;

      if (courseAttemptsByCourseId !== null) {
        for (const row of courseAttemptsByCourse) {
          courseAttemptsByCourseId.set(row.courseId, {
            totalAttempts: row._count._all,
            completed: 0,
            inProgress: 0,
            failed: 0,
            averagePreQuizScore: row._avg.preQuizScore ?? null,
            averagePostQuizScore: row._avg.postQuizScore ?? null,
          });
        }

        for (const row of courseAttemptsByCourseStatus) {
          const aggregate = courseAttemptsByCourseId.get(row.courseId) ?? {
            totalAttempts: 0,
            completed: 0,
            inProgress: 0,
            failed: 0,
            averagePreQuizScore: null,
            averagePostQuizScore: null,
          };

          if (row.status === "completed") aggregate.completed = row._count._all;
          if (row.status === "in_progress") aggregate.inProgress = row._count._all;
          if (row.status === "failed") aggregate.failed = row._count._all;

          courseAttemptsByCourseId.set(row.courseId, aggregate);
        }
      }

      const scenarioBreakdown: AdminScenarioStat[] = includeBreakdowns
        ? publishedScenariosWithVariants.map((scenario) => {
            let availableVariants = 0;
            const languages = new Set<string>();
            const localizedVariants: LocalizedTitleItem[] = [];

            for (const variant of scenario.variants) {
              languages.add(variant.language);
              localizedVariants.push({
                language: variant.language,
                title: variant.title,
              });
              if (variant.availabilityStatus === "available") availableVariants += 1;
            }

            const aggregate = scenarioAttemptsByScenarioId?.get(scenario.id) ?? {
              totalAttempts: 0,
              passed: 0,
              completed: 0,
              averageScore: null,
            };
            const completedLikeTotal = aggregate.passed + aggregate.completed;

            return {
              id: scenario.id,
              slug: scenario.slug,
              title: pickLocalizedTitle(localizedVariants, locale, scenario.slug),
              area: scenario.area,
              languages: [...languages].sort(),
              availableVariants,
              totalAttempts: aggregate.totalAttempts,
              completedLikeTotal,
              completionRate: toPercent(completedLikeTotal, aggregate.totalAttempts),
              averageScore: aggregate.averageScore,
            };
          })
        : [];

      const courseBreakdown: AdminCourseStat[] = includeBreakdowns
        ? publishedCoursesWithTranslations.map((course) => {
            const aggregate = courseAttemptsByCourseId?.get(course.id) ?? {
              totalAttempts: 0,
              completed: 0,
              inProgress: 0,
              failed: 0,
              averagePreQuizScore: null,
              averagePostQuizScore: null,
            };

            return {
              id: course.id,
              slug: course.slug,
              title: pickLocalizedTitle(course.translations, locale, course.slug),
              area: course.area,
              difficulty: course.difficulty,
              totalAttempts: aggregate.totalAttempts,
              completed: aggregate.completed,
              inProgress: aggregate.inProgress,
              failed: aggregate.failed,
              completionRate: toPercent(aggregate.completed, aggregate.totalAttempts),
              averagePreQuizScore: aggregate.averagePreQuizScore,
              averagePostQuizScore: aggregate.averagePostQuizScore,
            };
          })
        : [];

      const scenarioAttemptRows: DashboardScenarioAttemptRow[] = includeRows
        ? scenarioAttemptRowsRaw.map((attempt) => ({
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
          }))
        : [];

      const curriculumAttemptRows: DashboardCurriculumAttemptRow[] = includeRows
        ? curriculumAttemptRowsRaw.map((attempt, index) => ({
            id: attempt.id,
            learnerName: attempt.user.fullName ?? attempt.user.email.split("@")[0],
            learnerEmail: attempt.user.email,
            courseTitle: pickLocalizedTitle(
              attempt.course.translations,
              locale,
              attempt.course.slug,
            ),
            courseSlug: attempt.course.slug,
            area: normalizeArea(attempt.course.area),
            attemptNumber: index + 1,
            status: attempt.status as DashboardCurriculumAttemptRow["status"],
            preQuizScoreLabel: formatScore(attempt.preQuizScore),
            postQuizScoreLabel: formatScore(attempt.postQuizScore),
            startedAtLabel: formatDateTimeLabel(attempt.startedAt, locale),
            lastOpenedAtLabel: formatDateTimeLabel(attempt.lastOpenedAt, locale),
            completedAtLabel: formatDateTimeLabel(attempt.completedAt, locale),
          }))
        : [];

      const eportfolioProgressRows: DashboardEportfolioProgressRow[] = includeRows
        ? eportfolioProgressRowsRaw.map((progress) => ({
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
          }))
        : [];

      logMeasuredOperation({
        operation: "admin.getBasicAdminStats.map",
        durationMs: Date.now() - mappingStartedAt,
        records:
          scenarioAttemptRowsRaw.length +
          curriculumAttemptRowsRaw.length +
          eportfolioProgressRowsRaw.length,
        meta: {
          nodeElements:
            profilesByRole.length +
            usersByLanguageRaw.length +
            publishedCoursesWithTranslations.length +
            publishedCaseStudiesWithTranslations.length +
            publishedScenariosWithVariants.length +
            scenarioAttemptsRecent.length +
            courseAttemptsRecent.length +
            caseStudyProgressRecords.length +
            scenarioAttemptRowsRaw.length +
            curriculumAttemptRowsRaw.length +
            eportfolioProgressRowsRaw.length,
          scenarioRows: scenarioAttemptRowsRaw.length,
          curriculumRows: curriculumAttemptRowsRaw.length,
          eportfolioRows: eportfolioProgressRowsRaw.length,
        },
      });

      return measureSyncOperation({
        operation: "admin.getBasicAdminStats.responseShape",
        records:
          scenarioAttemptRows.length + curriculumAttemptRows.length + eportfolioProgressRows.length,
        meta: {
          nodeElements:
            scenarioBreakdown.length + courseBreakdown.length + languageBreakdown.length,
          responseBytes: estimateJsonBytes({
            languageBreakdown,
            scenarioBreakdown,
            courseBreakdown,
            scenarioAttemptRows,
            curriculumAttemptRows,
            eportfolioProgressRows,
          }),
        },
        execute: () => ({
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
            total: scenarioAttemptsAggregate._count._all,
            passed: passedScenarioAttempts,
            completed: completedScenarioAttempts,
            failed: failedScenarioAttempts,
            incomplete: incompleteScenarioAttempts,
            browsed: browsedScenarioAttempts,
            completedLikeTotal: scenarioCompletedLike,
            completionRate: toPercent(scenarioCompletedLike, scenarioAttemptsAggregate._count._all),
            averageScore: scenarioAttemptsAggregate._avg.score ?? null,
          },
          curriculum: {
            totalAttempts: courseAttemptsAggregate._count._all,
            completed: completedCourseAttempts,
            inProgress: inProgressCourseAttempts,
            failed: failedCourseAttempts,
            completionRate: toPercent(completedCourseAttempts, courseAttemptsAggregate._count._all),
            averagePreQuizScore: courseAttemptsAggregate._avg.preQuizScore ?? null,
            averagePostQuizScore: courseAttemptsAggregate._avg.postQuizScore ?? null,
          },
          eportfolio: {
            totalProgressRecords,
            completedCaseStudies,
            completionRate: toPercent(completedCaseStudies, totalProgressRecords),
          },
          activity: {
            activeUsersLast24h,
            activeUsersLast7Days,
            activeUsersLast30Days,

            recentScenarioAttempts24h: scenarioWindow24h.total,
            recentScenarioAttempts: scenarioWindow7d.total,
            recentScenarioAttempts30d: scenarioWindow30d.total,

            recentCourseAttempts24h: curriculumWindow24h.total,
            recentCourseAttempts: curriculumWindow7d.total,
            recentCourseAttempts30d: curriculumWindow30d.total,

            recentEportfolioEvents24h: eportfolioWindow24h.total,
            recentEportfolioEvents: eportfolioWindow7d.total,
            recentEportfolioEvents30d: eportfolioWindow30d.total,

            scenarioSeries24h: buildLast24HoursSeries(
              scenarioWindow24h.hourBuckets,
              hourFormatter24h,
            ),
            scenarioSeries: buildLastDaysSeries(scenarioWindow7d.dayBuckets, 7, dayFormatter7d),
            scenarioSeries30d: buildLastDaysSeries(
              scenarioWindow30d.dayBuckets,
              30,
              dayFormatter30d,
            ),

            curriculumSeries24h: buildLast24HoursSeries(
              curriculumWindow24h.hourBuckets,
              hourFormatter24h,
            ),
            curriculumSeries: buildLastDaysSeries(curriculumWindow7d.dayBuckets, 7, dayFormatter7d),
            curriculumSeries30d: buildLastDaysSeries(
              curriculumWindow30d.dayBuckets,
              30,
              dayFormatter30d,
            ),

            eportfolioSeries24h: buildLast24HoursSeries(
              eportfolioWindow24h.hourBuckets,
              hourFormatter24h,
            ),
            eportfolioSeries: buildLastDaysSeries(eportfolioWindow7d.dayBuckets, 7, dayFormatter7d),
            eportfolioSeries30d: buildLastDaysSeries(
              eportfolioWindow30d.dayBuckets,
              30,
              dayFormatter30d,
            ),

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
        }),
      });
    },
  });
}

const getBasicAdminStatsCached = unstable_cache(
  async (locale: AppLocale, includeBreakdowns: boolean, includeRows: boolean) =>
    getBasicAdminStatsUncached(locale, {
      includeBreakdowns,
      includeRows,
    }),
  ["admin.getBasicAdminStats"],
  {
    revalidate: 60,
  },
);

export async function getBasicAdminStats(
  locale: AppLocale = DEFAULT_LOCALE,
  options: GetBasicAdminStatsOptions = {},
): Promise<BasicAdminStats> {
  const includeBreakdowns = options.includeBreakdowns ?? true;
  const includeRows = options.includeRows ?? true;

  return getBasicAdminStatsCached(locale, includeBreakdowns, includeRows);
}
