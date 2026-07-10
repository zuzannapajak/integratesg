import { scenarioPathwayItems } from "@/content/scenarios/pathway";
import type { DashboardScenarioAttemptRow } from "@/lib/admin/types";
import type { AppLocale } from "@/lib/i18n/locales";
import { APP_LOCALES } from "@/lib/i18n/locales";
import { prisma } from "@/lib/prisma";
import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";

type DashboardScenarioStatus = DashboardScenarioAttemptRow["status"];
type DashboardScenarioArea = DashboardScenarioAttemptRow["area"];

type NativeScenarioVariant = {
  id: string;
  language: string;
  title: string;
  availabilityStatus: "available";
};

type NativeScenarioCatalogItem = {
  id: string;
  slug: string;
  area: DashboardScenarioArea;
  variants: NativeScenarioVariant[];
};

type GetNativeScenarioAdminDataInput = {
  locale: AppLocale;
  since: Date;
  includeBreakdowns: boolean;
  includeRows: boolean;
  rowsLimit: number;
};

const SCENARIO_AREA_BY_ID: Record<string, DashboardScenarioArea> = {
  "scenario-01": "cross-cutting",
  "scenario-02": "strategy",
  "scenario-03": "reporting",
  "scenario-04": "cross-cutting",
  "scenario-05": "cross-cutting",
  "scenario-06": "reporting",
};

function getScenarioArea(scenarioId: string): DashboardScenarioArea {
  return SCENARIO_AREA_BY_ID[scenarioId] ?? "cross-cutting";
}

function mapScenarioStatus(status: "incomplete" | "completed"): DashboardScenarioStatus {
  return status;
}

function calculateOptimalChoiceRate(choices: ReadonlyArray<{ isOptimal: boolean }>): number | null {
  if (choices.length === 0) {
    return null;
  }

  const optimalChoices = choices.reduce((sum, choice) => sum + (choice.isOptimal ? 1 : 0), 0);

  return Math.round((optimalChoices / choices.length) * 100);
}

function average(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const sum = values.reduce((current, value) => current + value, 0);

  return Math.round(sum / values.length);
}

function buildNativeScenarioCatalog(locale: AppLocale): NativeScenarioCatalogItem[] {
  return scenarioPathwayItems.flatMap((pathwayItem) => {
    const localizedScenario = resolveScenarioBySlug(pathwayItem.slug, locale);

    if (!localizedScenario) {
      return [];
    }

    const variantsByLanguage = new Map<string, NativeScenarioVariant>();

    for (const requestedLocale of APP_LOCALES) {
      const resolvedScenario = resolveScenarioBySlug(pathwayItem.slug, requestedLocale);

      if (!resolvedScenario) {
        continue;
      }

      variantsByLanguage.set(resolvedScenario.locale, {
        id: `${pathwayItem.id}:${resolvedScenario.locale}`,
        language: resolvedScenario.locale,
        title: resolvedScenario.title,
        availabilityStatus: "available",
      });
    }

    return [
      {
        id: pathwayItem.id,
        slug: pathwayItem.slug,
        area: getScenarioArea(pathwayItem.id),
        variants: [...variantsByLanguage.values()],
      },
    ];
  });
}

export async function getNativeScenarioAdminData({
  locale,
  since,
  includeBreakdowns,
  includeRows,
  rowsLimit,
}: GetNativeScenarioAdminDataInput) {
  const scenarioCatalog = buildNativeScenarioCatalog(locale);
  const catalogById = new Map(scenarioCatalog.map((scenario) => [scenario.id, scenario]));

  const [
    totalAttempts,
    attemptsByStatusRaw,
    recentAttemptsRaw,
    attemptsByScenarioRaw,
    attemptsByScenarioStatusRaw,
    choiceAttemptsRaw,
    dashboardAttemptsRaw,
  ] = await Promise.all([
    prisma.userScenarioAttempt.count(),

    prisma.userScenarioAttempt.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),

    prisma.userScenarioAttempt.findMany({
      where: {
        OR: [
          {
            startedAt: {
              gte: since,
            },
          },
          {
            lastOpenedAt: {
              gte: since,
            },
          },
          {
            completedAt: {
              gte: since,
            },
          },
        ],
      },
      select: {
        id: true,
        userId: true,
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
    }),

    includeBreakdowns
      ? prisma.userScenarioAttempt.groupBy({
          by: ["scenarioId"],
          _count: {
            _all: true,
          },
        })
      : Promise.resolve([]),

    includeBreakdowns
      ? prisma.userScenarioAttempt.groupBy({
          by: ["scenarioId", "status"],
          _count: {
            _all: true,
          },
        })
      : Promise.resolve([]),

    prisma.userScenarioChoiceAttempt.findMany({
      select: {
        attemptId: true,
        isOptimal: true,
        attempt: {
          select: {
            scenarioId: true,
          },
        },
      },
    }),

    includeRows
      ? prisma.userScenarioAttempt.findMany({
          take: rowsLimit,
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
            scenarioVersion: true,
            locale: true,
            attemptNumber: true,
            status: true,
            startedAt: true,
            lastOpenedAt: true,
            completedAt: true,
            choiceAttempts: {
              select: {
                isOptimal: true,
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  const choicesByAttemptId = new Map<
    string,
    {
      scenarioId: string;
      choices: Array<{ isOptimal: boolean }>;
    }
  >();

  for (const choiceAttempt of choiceAttemptsRaw) {
    const existing = choicesByAttemptId.get(choiceAttempt.attemptId);

    if (existing) {
      existing.choices.push({
        isOptimal: choiceAttempt.isOptimal,
      });

      continue;
    }

    choicesByAttemptId.set(choiceAttempt.attemptId, {
      scenarioId: choiceAttempt.attempt.scenarioId,
      choices: [
        {
          isOptimal: choiceAttempt.isOptimal,
        },
      ],
    });
  }

  const scoreByAttemptId = new Map<string, number>();
  const scoresByScenarioId = new Map<string, number[]>();

  for (const [attemptId, attemptData] of choicesByAttemptId) {
    const score = calculateOptimalChoiceRate(attemptData.choices);

    if (score === null) {
      continue;
    }

    scoreByAttemptId.set(attemptId, score);

    const scenarioScores = scoresByScenarioId.get(attemptData.scenarioId) ?? [];

    scenarioScores.push(score);
    scoresByScenarioId.set(attemptData.scenarioId, scenarioScores);
  }

  const allAttemptScores = [...scoreByAttemptId.values()];

  const publishedScenariosWithVariants = scenarioCatalog;

  const availableScenarioVariants = scenarioCatalog.reduce(
    (sum, scenario) => sum + scenario.variants.length,
    0,
  );

  const scenarioAttemptsAggregate = {
    _count: {
      _all: totalAttempts,
    },
    _avg: {
      score: average(allAttemptScores),
    },
  };

  const scenarioAttemptsByStatus = attemptsByStatusRaw.map((row) => ({
    status: mapScenarioStatus(row.status),
    _count: {
      _all: row._count._all,
    },
  }));

  const scenarioAttemptsRecent = recentAttemptsRaw.map((attempt) => ({
    userId: attempt.userId,
    status: mapScenarioStatus(attempt.status),
    score: calculateOptimalChoiceRate(attempt.choiceAttempts),
    startedAt: attempt.startedAt,
    lastOpenedAt: attempt.lastOpenedAt,
    completedAt: attempt.completedAt,
  }));

  const scenarioAttemptsByScenario = attemptsByScenarioRaw.map((row) => ({
    scenarioId: row.scenarioId,
    _count: {
      _all: row._count._all,
    },
    _avg: {
      score: average(scoresByScenarioId.get(row.scenarioId) ?? []),
    },
  }));

  const scenarioAttemptsByScenarioStatus = attemptsByScenarioStatusRaw.map((row) => ({
    scenarioId: row.scenarioId,
    status: mapScenarioStatus(row.status),
    _count: {
      _all: row._count._all,
    },
  }));

  const scenarioAttemptRowsRaw = dashboardAttemptsRaw.map((attempt) => {
    const catalogScenario = catalogById.get(attempt.scenarioId);

    const localizedVariant =
      catalogScenario?.variants.find((variant) => variant.language === attempt.locale) ??
      catalogScenario?.variants[0] ??
      null;

    const pathwayScenario = scenarioPathwayItems.find((item) => item.id === attempt.scenarioId);

    return {
      id: attempt.id,
      attemptNumber: attempt.attemptNumber,
      status: mapScenarioStatus(attempt.status),
      score: calculateOptimalChoiceRate(attempt.choiceAttempts),
      startedAt: attempt.startedAt,
      lastOpenedAt: attempt.lastOpenedAt,
      completedAt: attempt.completedAt,
      user: attempt.user,

      scenario: {
        slug: attempt.scenarioId,
        area: catalogScenario?.area ?? getScenarioArea(attempt.scenarioId),
      },

      scenarioVariant: {
        language: attempt.locale,
        title: localizedVariant?.title ?? pathwayScenario?.title ?? attempt.scenarioId,
      },
    };
  });

  return {
    publishedScenarios: publishedScenariosWithVariants.length,
    availableScenarioVariants,
    publishedScenariosWithVariants,
    scenarioAttemptsAggregate,
    scenarioAttemptsByStatus,
    scenarioAttemptsRecent,
    scenarioAttemptsByScenario,
    scenarioAttemptsByScenarioStatus,
    scenarioAttemptRowsRaw,
  };
}
