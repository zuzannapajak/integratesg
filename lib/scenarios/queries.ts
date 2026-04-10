import { estimateJsonBytes } from "@/lib/observability/json-size";
import {
  logMeasuredOperation,
  measureAsyncOperation,
  measureSyncOperation,
} from "@/lib/observability/performance";
import { prisma } from "@/lib/prisma";
import {
  JsonObject,
  RuntimeTrackingInput,
  ScenarioDetailRecord,
  ScenarioDetailViewModel,
  ScenarioLaunchRecord,
  ScenarioLaunchViewModel,
  ScenarioListItemViewModel,
  ScenarioProgressStatus,
} from "@/lib/scenarios/types";
import { Prisma, ScenarioAttemptStatus } from "@prisma/client";

const RUNTIME_LAST_SESSION_SNAPSHOT_KEY = "__runtime.lastSessionTimeSnapshot";
const RUNTIME_TOTAL_TIME_CENTIS_KEY = "__runtime.totalTimeCentis";
const RUNTIME_PROGRESS_WRITE_DEBOUNCE_MS = 5000;
const MIN_RUNTIME_SESSION_TIME_WRITE_DELTA_CENTIS = 1000;
const PERSISTED_RUNTIME_TRACKING_KEYS = new Set<string>([
  RUNTIME_LAST_SESSION_SNAPSHOT_KEY,
  RUNTIME_TOTAL_TIME_CENTIS_KEY,
  "cmi.core.entry",
  "cmi.core.exit",
  "cmi.core.lesson_mode",
]);

function toPrismaJsonObject(value: JsonObject): Prisma.InputJsonObject {
  return value as Prisma.InputJsonObject;
}

function normalizeOptionalText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function getRequestedLanguages(locale: string) {
  return locale === "en" ? ["en"] : [locale, "en"];
}

function mapArea(area: string): ScenarioListItemViewModel["area"] {
  switch (area) {
    case "environmental":
      return "environmental";
    case "social":
      return "social";
    case "governance":
      return "governance";
    default:
      return "cross-cutting";
  }
}

function pickVariant<T extends { language: string }>(variants: T[], locale: string): T | null {
  let englishVariant: T | null = null;
  let firstVariant: T | null = null;

  for (const variant of variants) {
    firstVariant ??= variant;

    if (variant.language === locale) {
      return variant;
    }

    if (englishVariant === null && variant.language === "en") {
      englishVariant = variant;
    }
  }

  return englishVariant ?? firstVariant;
}

function mapScenarioStatus(attempts: Array<{ status: string }>): ScenarioProgressStatus {
  if (attempts.length === 0) {
    return "not_started";
  }

  const latestAttempt = attempts[0];

  if (latestAttempt.status === "completed" || latestAttempt.status === "passed") {
    return "completed";
  }

  return "in_progress";
}

function normalizeRuntimeStatus(status: string | null | undefined): ScenarioAttemptStatus | null {
  const normalized = status?.trim().toLowerCase();

  switch (normalized) {
    case "passed":
      return ScenarioAttemptStatus.passed;
    case "completed":
      return ScenarioAttemptStatus.completed;
    case "failed":
      return ScenarioAttemptStatus.failed;
    case "incomplete":
      return ScenarioAttemptStatus.incomplete;
    case "browsed":
      return ScenarioAttemptStatus.browsed;
    case "not attempted":
    case "not_attempted":
    case "unknown":
    case "":
    case undefined:
      return null;
    default:
      return null;
  }
}

function toIsoStringOrNull(value?: Date | null) {
  return value ? value.toISOString() : null;
}

function normalizeScore(scoreRaw: string | null | undefined) {
  if (typeof scoreRaw !== "string" || scoreRaw.trim().length === 0) {
    return null;
  }

  const parsed = Number(scoreRaw);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

function parseScormTimeToCentiseconds(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const match = normalized.match(/^(\d{2,4}):(\d{2}):(\d{2})(?:\.(\d{1,2}))?$/);
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  const centisecondsPart = match[4] ? match[4] : "0";
  const centiseconds = Number(centisecondsPart.padEnd(2, "0"));

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    !Number.isFinite(seconds) ||
    !Number.isFinite(centiseconds)
  ) {
    return null;
  }

  return ((hours * 60 + minutes) * 60 + seconds) * 100 + centiseconds;
}

function formatCentisecondsToScormTime(totalCentiseconds: number) {
  const safeValue = Math.max(0, Math.floor(totalCentiseconds));
  const hours = Math.floor(safeValue / 360000);
  const minutes = Math.floor((safeValue % 360000) / 6000);
  const seconds = Math.floor((safeValue % 6000) / 100);
  const centiseconds = safeValue % 100;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function readRuntimeTrackingObject(value: Prisma.JsonValue | null | undefined): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as JsonObject;
}

function readNumberFromJsonObject(record: JsonObject, key: string): number | null {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function sanitizeRuntimeTrackingData(
  value: Record<string, string> | JsonObject | null | undefined,
) {
  const sanitized: JsonObject = {};

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return sanitized;
  }

  for (const [key, rawValue] of Object.entries(value)) {
    if (!PERSISTED_RUNTIME_TRACKING_KEYS.has(key)) {
      continue;
    }

    if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
      sanitized[key] = rawValue;
      continue;
    }

    if (typeof rawValue === "string") {
      const normalizedValue = normalizeOptionalText(rawValue);
      if (normalizedValue !== null) {
        sanitized[key] = normalizedValue;
      }
    }
  }

  return sanitized;
}

function areJsonObjectsEqual(left: JsonObject, right: JsonObject) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (const key of leftKeys) {
    if (!(key in right) || left[key] !== right[key]) {
      return false;
    }
  }

  return true;
}

function hasMeaningfulSessionTimeDelta(params: {
  previousSessionTime: string | null | undefined;
  nextSessionTime: string | null | undefined;
}) {
  const previousCentis = parseScormTimeToCentiseconds(params.previousSessionTime);
  const nextCentis = parseScormTimeToCentiseconds(params.nextSessionTime);

  if (previousCentis === null || nextCentis === null) {
    return params.previousSessionTime !== params.nextSessionTime;
  }

  return Math.abs(nextCentis - previousCentis) >= MIN_RUNTIME_SESSION_TIME_WRITE_DELTA_CENTIS;
}

function calculateNextTotalTime(params: {
  previousRawTrackingData: JsonObject;
  incomingSessionTime: string | null | undefined;
  previousTotalTimeString: string | null | undefined;
}) {
  const currentSessionCentis = parseScormTimeToCentiseconds(params.incomingSessionTime);
  const previousSnapshotCentis =
    readNumberFromJsonObject(params.previousRawTrackingData, RUNTIME_LAST_SESSION_SNAPSHOT_KEY) ??
    0;
  const previousAccumulatedCentis =
    readNumberFromJsonObject(params.previousRawTrackingData, RUNTIME_TOTAL_TIME_CENTIS_KEY) ??
    parseScormTimeToCentiseconds(params.previousTotalTimeString) ??
    0;

  if (currentSessionCentis === null) {
    return {
      nextTotalTime: params.previousTotalTimeString ?? null,
      nextTotalCentis: previousAccumulatedCentis,
      nextSnapshotCentis: previousSnapshotCentis,
    };
  }

  const deltaCentis =
    currentSessionCentis >= previousSnapshotCentis
      ? currentSessionCentis - previousSnapshotCentis
      : currentSessionCentis;

  const nextTotalCentis = previousAccumulatedCentis + deltaCentis;
  const nextTotalTime = formatCentisecondsToScormTime(nextTotalCentis);

  return {
    nextTotalTime,
    nextTotalCentis,
    nextSnapshotCentis: currentSessionCentis,
  };
}

function mapScenarioToViewModel(
  scenario: {
    slug: string;
    area: string;
    variants: Array<{
      language: string;
      title: string | null;
      description: string | null;
      estimatedDurationMinutes: number | null;
    }>;
    userAttempts: Array<{
      status: string;
    }>;
  },
  locale: string,
): ScenarioListItemViewModel | null {
  const variant = pickVariant(scenario.variants, locale);

  if (!variant) {
    return null;
  }

  const status = mapScenarioStatus(scenario.userAttempts);
  const hasAttempt = scenario.userAttempts.length > 0;

  return {
    slug: scenario.slug,
    language: variant.language,
    title: variant.title ?? scenario.slug,
    description: normalizeOptionalText(variant.description),
    area: mapArea(scenario.area),
    estimatedDurationMinutes: variant.estimatedDurationMinutes ?? null,
    status,
    hasAttempt,
  };
}

function getScenarioCollectionMeta(
  scenarios: Array<{ variants: unknown[]; userAttempts: unknown[] }>,
) {
  let variants = 0;
  let attempts = 0;

  for (const scenario of scenarios) {
    variants += scenario.variants.length;
    attempts += scenario.userAttempts.length;
  }

  return { variants, attempts };
}

function mapScenarioCollectionToViewModels(
  scenarios: Array<{
    slug: string;
    area: string;
    variants: Array<{
      language: string;
      title: string | null;
      description: string | null;
      estimatedDurationMinutes: number | null;
    }>;
    userAttempts: Array<{
      status: string;
    }>;
  }>,
  locale: string,
) {
  const mappedScenarios: ScenarioListItemViewModel[] = [];

  for (const scenario of scenarios) {
    const mappedScenario = mapScenarioToViewModel(scenario, locale);

    if (mappedScenario !== null) {
      mappedScenarios.push(mappedScenario);
    }
  }

  return mappedScenarios;
}

async function getScenarioLibraryBase(params: { locale: string; userId: string; onlyMy: boolean }) {
  const requestedLanguages = getRequestedLanguages(params.locale);

  const prismaStartedAt = Date.now();
  const scenarios = await prisma.scenario.findMany({
    where: {
      status: "published",
      ...(params.onlyMy
        ? {
            userAttempts: {
              some: {
                userId: params.userId,
              },
            },
          }
        : {}),
    },
    select: {
      slug: true,
      area: true,
      variants: {
        where: {
          language: {
            in: requestedLanguages,
          },
          availabilityStatus: "available",
        },
        select: {
          language: true,
          title: true,
          description: true,
          estimatedDurationMinutes: true,
        },
      },
      userAttempts: {
        where: {
          userId: params.userId,
        },
        select: {
          status: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: "desc" }],
        take: 1,
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const collectionMeta = getScenarioCollectionMeta(scenarios);

  logMeasuredOperation({
    operation: params.onlyMy
      ? "scenarios.getMyScenarioLibrary.prisma"
      : "scenarios.getAllScenarioLibrary.prisma",
    durationMs: Date.now() - prismaStartedAt,
    records: scenarios.length,
    meta: {
      variants: collectionMeta.variants,
      attempts: collectionMeta.attempts,
      responseBytes: estimateJsonBytes(scenarios),
    },
  });

  const mappedScenarios = measureSyncOperation({
    operation: params.onlyMy
      ? "scenarios.getMyScenarioLibrary.map"
      : "scenarios.getAllScenarioLibrary.map",
    records: scenarios.length,
    meta: {
      nodeElements: scenarios.length,
      variants: collectionMeta.variants,
      attempts: collectionMeta.attempts,
    },
    execute: () => mapScenarioCollectionToViewModels(scenarios, params.locale),
  });

  logMeasuredOperation({
    operation: params.onlyMy
      ? "scenarios.getMyScenarioLibrary.payload"
      : "scenarios.getAllScenarioLibrary.payload",
    durationMs: 0,
    records: mappedScenarios.length,
    meta: {
      responseBytes: estimateJsonBytes(mappedScenarios),
    },
  });

  return mappedScenarios;
}

export async function getAllScenarioLibrary(params: { locale: string; userId: string }) {
  return measureAsyncOperation({
    operation: "scenarios.getAllScenarioLibrary",
    getRecords: (scenarios) => scenarios.length,
    execute: async () =>
      getScenarioLibraryBase({
        locale: params.locale,
        userId: params.userId,
        onlyMy: false,
      }),
  });
}

export async function getMyScenarioLibrary(params: { locale: string; userId: string }) {
  return measureAsyncOperation({
    operation: "scenarios.getMyScenarioLibrary",
    getRecords: (scenarios) => scenarios.length,
    execute: async () =>
      getScenarioLibraryBase({
        locale: params.locale,
        userId: params.userId,
        onlyMy: true,
      }),
  });
}

function mapScenarioToDetailViewModel(
  scenario: ScenarioDetailRecord,
  locale: string,
): ScenarioDetailViewModel | null {
  const variant = pickVariant(scenario.variants, locale);

  if (!variant) {
    return null;
  }

  const latestAttempt = scenario.userAttempts.at(0) ?? null;

  return {
    slug: scenario.slug,
    language: variant.language,
    title: variant.title ?? scenario.slug,
    description: normalizeOptionalText(variant.description),
    instruction: normalizeOptionalText(variant.instruction),
    area: mapArea(scenario.area),
    estimatedDurationMinutes: variant.estimatedDurationMinutes ?? null,
    status: mapScenarioStatus(scenario.userAttempts),
    launchUrl: variant.launchUrl ?? "",
    thumbnailUrl: variant.thumbnailUrl ?? null,
    isFeatured: scenario.isFeatured,
    hasAttempt: latestAttempt !== null,
    score: latestAttempt?.score ?? null,
    startedAt: toIsoStringOrNull(latestAttempt?.startedAt),
    lastOpenedAt: toIsoStringOrNull(latestAttempt?.lastOpenedAt),
    completedAt: toIsoStringOrNull(latestAttempt?.completedAt),
    lessonLocation: latestAttempt?.lessonLocation ?? null,
  };
}

function mapScenarioToLaunchViewModel(
  scenario: ScenarioLaunchRecord,
  locale: string,
): ScenarioLaunchViewModel | null {
  const variant = pickVariant(scenario.variants, locale);

  if (!variant) {
    return null;
  }

  const latestAttempt = scenario.userAttempts.at(0) ?? null;
  const trimmedLaunchUrl = (variant.launchUrl ?? "").trim();

  return {
    slug: scenario.slug,
    language: variant.language,
    title: variant.title ?? scenario.slug,
    description: normalizeOptionalText(variant.description),
    area: mapArea(scenario.area),
    launchUrl: trimmedLaunchUrl.length > 0 ? trimmedLaunchUrl : null,
    status: mapScenarioStatus(scenario.userAttempts),
    hasAttempt: latestAttempt !== null,
    score: latestAttempt?.score ?? null,
    lessonLocation: latestAttempt?.lessonLocation ?? null,
    suspendData: latestAttempt?.suspendData ?? null,
    sessionTime: latestAttempt?.sessionTime ?? null,
    startedAt: toIsoStringOrNull(latestAttempt?.startedAt),
    lastOpenedAt: toIsoStringOrNull(latestAttempt?.lastOpenedAt),
    completedAt: toIsoStringOrNull(latestAttempt?.completedAt),
  };
}

export async function getScenarioDetail(params: { locale: string; userId: string; slug: string }) {
  return measureAsyncOperation({
    operation: "scenarios.getScenarioDetail",
    getRecords: (result) => (result ? 1 : 0),
    execute: async () => {
      const requestedLanguages = getRequestedLanguages(params.locale);

      const prismaStartedAt = Date.now();
      const scenario = await prisma.scenario.findFirst({
        where: {
          slug: params.slug,
          status: "published",
        },
        select: {
          slug: true,
          area: true,
          isFeatured: true,
          variants: {
            where: {
              language: {
                in: requestedLanguages,
              },
              availabilityStatus: "available",
            },
            select: {
              language: true,
              title: true,
              description: true,
              instruction: true,
              launchUrl: true,
              thumbnailUrl: true,
              estimatedDurationMinutes: true,
            },
          },
          userAttempts: {
            where: {
              userId: params.userId,
            },
            select: {
              status: true,
              score: true,
              startedAt: true,
              lastOpenedAt: true,
              completedAt: true,
              lessonLocation: true,
              createdAt: true,
            },
            orderBy: [{ createdAt: "desc" }],
            take: 1,
          },
        },
      });

      logMeasuredOperation({
        operation: "scenarios.getScenarioDetail.prisma",
        durationMs: Date.now() - prismaStartedAt,
        records: scenario ? 1 : 0,
        meta: {
          variants: scenario ? scenario.variants.length : 0,
          attempts: scenario ? scenario.userAttempts.length : 0,
        },
      });

      if (!scenario) {
        return null;
      }

      return measureSyncOperation({
        operation: "scenarios.getScenarioDetail.map",
        records: 1,
        meta: {
          nodeElements: 1,
          variants: scenario.variants.length,
          attempts: scenario.userAttempts.length,
        },
        execute: () => {
          const mappedScenario = mapScenarioToDetailViewModel(scenario, params.locale);

          if (!mappedScenario) {
            return null;
          }

          logMeasuredOperation({
            operation: "scenarios.getScenarioDetail.payload",
            durationMs: 0,
            records: 1,
            meta: {
              responseBytes: estimateJsonBytes(mappedScenario),
            },
          });

          return {
            scenario: mappedScenario,
          };
        },
      });
    },
  });
}

export async function getRelatedScenarios(params: {
  locale: string;
  userId: string;
  slug: string;
}) {
  return measureAsyncOperation({
    operation: "scenarios.getRelatedScenarios",
    getRecords: (scenarios) => scenarios.length,
    execute: async () => {
      const requestedLanguages = getRequestedLanguages(params.locale);

      const areaLookupStartedAt = Date.now();
      const scenario = await prisma.scenario.findFirst({
        where: {
          slug: params.slug,
          status: "published",
        },
        select: {
          area: true,
        },
      });

      logMeasuredOperation({
        operation: "scenarios.getRelatedScenarios.lookupArea.prisma",
        durationMs: Date.now() - areaLookupStartedAt,
        records: scenario ? 1 : 0,
      });

      if (!scenario) {
        return [];
      }

      const prismaStartedAt = Date.now();
      const relatedScenarios = await prisma.scenario.findMany({
        where: {
          status: "published",
          slug: {
            not: params.slug,
          },
          area: scenario.area,
        },
        select: {
          slug: true,
          area: true,
          variants: {
            where: {
              language: {
                in: requestedLanguages,
              },
              availabilityStatus: "available",
            },
            select: {
              language: true,
              title: true,
              description: true,
              estimatedDurationMinutes: true,
            },
          },
          userAttempts: {
            where: {
              userId: params.userId,
            },
            select: {
              status: true,
              createdAt: true,
            },
            orderBy: [{ createdAt: "desc" }],
            take: 1,
          },
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: 3,
      });

      const collectionMeta = getScenarioCollectionMeta(relatedScenarios);

      logMeasuredOperation({
        operation: "scenarios.getRelatedScenarios.prisma",
        durationMs: Date.now() - prismaStartedAt,
        records: relatedScenarios.length,
        meta: {
          variants: collectionMeta.variants,
          attempts: collectionMeta.attempts,
        },
      });

      const mappedScenarios = measureSyncOperation({
        operation: "scenarios.getRelatedScenarios.map",
        records: relatedScenarios.length,
        meta: {
          nodeElements: relatedScenarios.length,
          variants: collectionMeta.variants,
          attempts: collectionMeta.attempts,
        },
        execute: () => mapScenarioCollectionToViewModels(relatedScenarios, params.locale),
      });

      logMeasuredOperation({
        operation: "scenarios.getRelatedScenarios.payload",
        durationMs: 0,
        records: mappedScenarios.length,
        meta: {
          responseBytes: estimateJsonBytes(mappedScenarios),
        },
      });

      return mappedScenarios;
    },
  });
}

export async function logScenarioLaunch(params: { locale: string; userId: string; slug: string }) {
  return measureAsyncOperation({
    operation: "scenarios.logScenarioLaunch",
    getRecords: (attemptId) => (attemptId ? 1 : 0),
    execute: async () => {
      const requestedLanguages = getRequestedLanguages(params.locale);

      const scenario = await prisma.scenario.findFirst({
        where: {
          slug: params.slug,
          status: "published",
        },
        select: {
          id: true,
          variants: {
            where: {
              language: {
                in: requestedLanguages,
              },
              availabilityStatus: "available",
            },
            select: {
              id: true,
              language: true,
              launchUrl: true,
            },
          },
        },
      });

      if (!scenario) {
        return null;
      }

      const variant = pickVariant(scenario.variants, params.locale);
      const variantId = variant?.id;

      if (!variant || !variantId || variant.launchUrl.trim().length === 0) {
        return null;
      }

      const now = new Date();
      const latestAttempt = await prisma.userScenarioAttempt.findFirst({
        where: {
          userId: params.userId,
          scenarioId: scenario.id,
          scenarioVariantId: variantId,
        },
        orderBy: [{ attemptNumber: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          attemptNumber: true,
          status: true,
          completedAt: true,
          lastOpenedAt: true,
        },
      });

      const shouldResumeExistingAttempt =
        latestAttempt !== null &&
        latestAttempt.status !== "completed" &&
        latestAttempt.status !== "passed" &&
        latestAttempt.status !== "failed";

      if (shouldResumeExistingAttempt) {
        await prisma.userScenarioAttempt.update({
          where: { id: latestAttempt.id },
          data: { lastOpenedAt: now },
        });

        return latestAttempt.id;
      }

      const nextAttemptNumber = (latestAttempt?.attemptNumber ?? 0) + 1;

      const createdAttempt = await prisma.userScenarioAttempt.create({
        data: {
          userId: params.userId,
          scenarioId: scenario.id,
          scenarioVariantId: variantId,
          attemptNumber: nextAttemptNumber,
          status: "incomplete",
          startedAt: now,
          lastOpenedAt: now,
        },
        select: { id: true },
      });

      return createdAttempt.id;
    },
  });
}

export async function completeScenarioAttempt(params: {
  locale: string;
  userId: string;
  slug: string;
}) {
  return measureAsyncOperation({
    operation: "scenarios.completeScenarioAttempt",
    getRecords: (attemptId) => (attemptId ? 1 : 0),
    execute: async () => {
      const scenario = await prisma.scenario.findFirst({
        where: {
          slug: params.slug,
          status: "published",
        },
        select: {
          id: true,
          variants: {
            where: {
              availabilityStatus: "available",
            },
            select: {
              id: true,
              language: true,
              title: true,
              description: true,
              launchUrl: true,
              estimatedDurationMinutes: true,
            },
          },
        },
      });

      if (!scenario) {
        return null;
      }

      const variant = pickVariant(scenario.variants, params.locale);
      const variantId = variant?.id;

      if (!variant || !variantId) {
        return null;
      }

      const now = new Date();
      const latestAttempt = await prisma.userScenarioAttempt.findFirst({
        where: {
          userId: params.userId,
          scenarioId: scenario.id,
          scenarioVariantId: variantId,
        },
        orderBy: [{ attemptNumber: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          attemptNumber: true,
          status: true,
          completedAt: true,
        },
      });

      if (!latestAttempt) {
        const createdAttempt = await prisma.userScenarioAttempt.create({
          data: {
            userId: params.userId,
            scenarioId: scenario.id,
            scenarioVariantId: variantId,
            attemptNumber: 1,
            status: "completed",
            startedAt: now,
            lastOpenedAt: now,
            completedAt: now,
          },
          select: { id: true },
        });

        return createdAttempt.id;
      }

      if (
        latestAttempt.status === "completed" ||
        latestAttempt.status === "passed" ||
        latestAttempt.completedAt !== null
      ) {
        await prisma.userScenarioAttempt.update({
          where: { id: latestAttempt.id },
          data: { lastOpenedAt: now },
        });

        return latestAttempt.id;
      }

      await prisma.userScenarioAttempt.update({
        where: { id: latestAttempt.id },
        data: {
          status: "completed",
          completedAt: now,
          lastOpenedAt: now,
        },
      });

      return latestAttempt.id;
    },
  });
}

export async function updateScenarioRuntimeProgress(input: RuntimeTrackingInput) {
  return measureAsyncOperation({
    operation: "scenarios.updateScenarioRuntimeProgress",
    getRecords: (result) => (result?.attemptId ? 1 : 0),
    execute: async () => {
      const queryStartedAt = Date.now();
      const scenario = await prisma.scenario.findFirst({
        where: {
          slug: input.slug,
          status: "published",
        },
        select: {
          id: true,
          variants: {
            where: {
              availabilityStatus: "available",
            },
            select: {
              id: true,
              language: true,
            },
          },
        },
      });

      logMeasuredOperation({
        operation: "scenarios.updateScenarioRuntimeProgress.fetchScenario",
        durationMs: Date.now() - queryStartedAt,
        records: scenario ? 1 : 0,
      });

      if (!scenario) {
        return null;
      }

      const variant = pickVariant(scenario.variants, input.locale);
      const variantId = variant?.id;

      if (!variant || !variantId) {
        return null;
      }

      const now = new Date();
      const normalizedStatus = normalizeRuntimeStatus(input.lessonStatus);
      const normalizedScore = normalizeScore(input.scoreRaw);

      const latestAttempt = await prisma.userScenarioAttempt.findFirst({
        where: {
          userId: input.userId,
          scenarioId: scenario.id,
          scenarioVariantId: variantId,
        },
        orderBy: [{ attemptNumber: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          attemptNumber: true,
          status: true,
          completedAt: true,
          startedAt: true,
          lastOpenedAt: true,
          lessonLocation: true,
          suspendData: true,
          sessionTime: true,
          totalTime: true,
          score: true,
          rawTrackingData: true,
        },
      });

      const previousRawTrackingData = sanitizeRuntimeTrackingData(
        readRuntimeTrackingObject(latestAttempt?.rawTrackingData),
      );
      const nextTotalTimeState = calculateNextTotalTime({
        previousRawTrackingData,
        incomingSessionTime: input.sessionTime,
        previousTotalTimeString: latestAttempt?.totalTime ?? null,
      });

      const nextRawTrackingData: JsonObject = {
        ...previousRawTrackingData,
        ...sanitizeRuntimeTrackingData(input.rawTrackingData),
        [RUNTIME_LAST_SESSION_SNAPSHOT_KEY]: nextTotalTimeState.nextSnapshotCentis,
        [RUNTIME_TOTAL_TIME_CENTIS_KEY]: nextTotalTimeState.nextTotalCentis,
      };

      const nextStatus =
        normalizedStatus ??
        (latestAttempt?.status === "completed" || latestAttempt?.status === "passed"
          ? latestAttempt.status
          : "incomplete");
      const nextScore = normalizedScore ?? latestAttempt?.score ?? null;
      const nextLessonLocation =
        normalizeOptionalText(input.lessonLocation) ?? latestAttempt?.lessonLocation ?? null;
      const nextSuspendData =
        normalizeOptionalText(input.suspendData) ?? latestAttempt?.suspendData ?? null;
      const nextSessionTime =
        normalizeOptionalText(input.sessionTime) ?? latestAttempt?.sessionTime ?? null;
      const nextCompletedAt =
        normalizedStatus === "completed" || normalizedStatus === "passed"
          ? now
          : (latestAttempt?.completedAt ?? null);

      const updateData = {
        status: nextStatus,
        score: nextScore,
        lessonLocation: nextLessonLocation,
        suspendData: nextSuspendData,
        sessionTime: nextSessionTime,
        totalTime: nextTotalTimeState.nextTotalTime,
        rawTrackingData: toPrismaJsonObject(nextRawTrackingData),
        lastOpenedAt: now,
        completedAt: nextCompletedAt,
      };

      if (latestAttempt) {
        const lastPersistedAt = latestAttempt.lastOpenedAt ?? latestAttempt.startedAt;
        const isWithinDebounceWindow =
          now.getTime() - lastPersistedAt.getTime() < RUNTIME_PROGRESS_WRITE_DEBOUNCE_MS;

        const hasImmediateChange =
          nextStatus !== latestAttempt.status ||
          nextScore !== (latestAttempt.score ?? null) ||
          nextLessonLocation !== (latestAttempt.lessonLocation ?? null) ||
          nextSuspendData !== (latestAttempt.suspendData ?? null) ||
          nextCompletedAt?.getTime() !== latestAttempt.completedAt?.getTime();

        const hasDeferredRuntimeChange =
          hasMeaningfulSessionTimeDelta({
            previousSessionTime: latestAttempt.sessionTime ?? null,
            nextSessionTime,
          }) ||
          nextTotalTimeState.nextTotalTime !== (latestAttempt.totalTime ?? null) ||
          !areJsonObjectsEqual(nextRawTrackingData, previousRawTrackingData);

        if (!hasImmediateChange && !hasDeferredRuntimeChange) {
          return {
            attemptId: latestAttempt.id,
            saved: false,
          };
        }

        if (
          !input.forceWrite &&
          !hasImmediateChange &&
          hasDeferredRuntimeChange &&
          isWithinDebounceWindow
        ) {
          return {
            attemptId: latestAttempt.id,
            saved: false,
          };
        }

        await prisma.userScenarioAttempt.update({
          where: { id: latestAttempt.id },
          data: updateData,
        });

        return {
          attemptId: latestAttempt.id,
          saved: true,
        };
      }

      const createdAttempt = await prisma.userScenarioAttempt.create({
        data: {
          userId: input.userId,
          scenarioId: scenario.id,
          scenarioVariantId: variantId,
          attemptNumber: 1,
          startedAt: now,
          ...updateData,
        },
        select: {
          id: true,
        },
      });

      return {
        attemptId: createdAttempt.id,
        saved: true,
      };
    },
  });
}

export async function getScenarioLaunch(params: { locale: string; userId: string; slug: string }) {
  return measureAsyncOperation({
    operation: "scenarios.getScenarioLaunch",
    getRecords: (scenario) => (scenario ? 1 : 0),
    execute: async () => {
      const requestedLanguages = getRequestedLanguages(params.locale);

      const prismaStartedAt = Date.now();
      const scenario = await prisma.scenario.findFirst({
        where: {
          slug: params.slug,
          status: "published",
        },
        select: {
          slug: true,
          area: true,
          variants: {
            where: {
              language: {
                in: requestedLanguages,
              },
              availabilityStatus: "available",
            },
            select: {
              language: true,
              title: true,
              description: true,
              launchUrl: true,
              estimatedDurationMinutes: true,
            },
          },
          userAttempts: {
            where: {
              userId: params.userId,
            },
            select: {
              status: true,
              score: true,
              startedAt: true,
              lastOpenedAt: true,
              completedAt: true,
              lessonLocation: true,
              suspendData: true,
              sessionTime: true,
              createdAt: true,
            },
            orderBy: [{ createdAt: "desc" }],
            take: 1,
          },
        },
      });

      logMeasuredOperation({
        operation: "scenarios.getScenarioLaunch.prisma",
        durationMs: Date.now() - prismaStartedAt,
        records: scenario ? 1 : 0,
        meta: {
          variants: scenario ? scenario.variants.length : 0,
          attempts: scenario ? scenario.userAttempts.length : 0,
        },
      });

      if (!scenario) {
        return null;
      }

      return measureSyncOperation({
        operation: "scenarios.getScenarioLaunch.map",
        records: 1,
        meta: {
          nodeElements: 1,
          variants: scenario.variants.length,
          attempts: scenario.userAttempts.length,
        },
        execute: () => {
          const mappedScenario = mapScenarioToLaunchViewModel(scenario, params.locale);

          logMeasuredOperation({
            operation: "scenarios.getScenarioLaunch.payload",
            durationMs: 0,
            records: mappedScenario ? 1 : 0,
            meta: {
              responseBytes: estimateJsonBytes(mappedScenario),
            },
          });

          return mappedScenario;
        },
      });
    },
  });
}
