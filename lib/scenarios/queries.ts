import { prisma } from "@/lib/prisma";
import {
  ScenarioDetailViewModel,
  ScenarioLaunchViewModel,
  ScenarioListItemViewModel,
  ScenarioProgressStatus,
} from "@/lib/scenarios/types";
import { Prisma } from "@prisma/client";

type ScenarioVariantRecord = {
  id: string;
  language: string;
  title: string;
  description: string | null;
  instruction: string | null;
  launchUrl: string;
  packagePath: string;
  entryPoint: string;
  thumbnailUrl: string | null;
  estimatedDurationMinutes: number | null;
  availabilityStatus: string;
};

type UserScenarioAttemptRecord = {
  status: string;
  startedAt: Date;
  lastOpenedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
};

type ScenarioRecord = {
  slug: string;
  area: string;
  variants: ScenarioVariantRecord[];
  userAttempts: UserScenarioAttemptRecord[];
};

type ScenarioAttemptDetailRecord = {
  status: string;
  score: number | null;
  startedAt: Date;
  lastOpenedAt: Date | null;
  completedAt: Date | null;
  lessonLocation: string | null;
  suspendData: string | null;
  sessionTime: string | null;
  totalTime: string | null;
  rawTrackingData: Prisma.JsonValue | null;
  createdAt: Date;
};

type ScenarioDetailRecord = {
  slug: string;
  area: string;
  isFeatured: boolean;
  variants: ScenarioVariantRecord[];
  userAttempts: ScenarioAttemptDetailRecord[];
};

type ScenarioLaunchRecord = {
  slug: string;
  area: string;
  variants: ScenarioVariantRecord[];
  userAttempts: ScenarioAttemptDetailRecord[];
};

type RuntimeTrackingInput = {
  locale: string;
  userId: string;
  slug: string;
  lessonStatus?: string | null;
  scoreRaw?: string | null;
  sessionTime?: string | null;
  suspendData?: string | null;
  lessonLocation?: string | null;
  rawTrackingData?: Record<string, string> | null;
};

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

const RUNTIME_LAST_SESSION_SNAPSHOT_KEY = "__runtime.lastSessionTimeSnapshot";
const RUNTIME_TOTAL_TIME_CENTIS_KEY = "__runtime.totalTimeCentis";

function toPrismaJsonObject(value: JsonObject): Prisma.InputJsonObject {
  return value as Prisma.InputJsonObject;
}

function normalizeOptionalText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
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

function pickVariant(
  variants: ScenarioVariantRecord[],
  locale: string,
): ScenarioVariantRecord | null {
  const localeVariant = variants.find((variant) => variant.language === locale);
  if (localeVariant) {
    return localeVariant;
  }

  const englishVariant = variants.find((variant) => variant.language === "en");
  if (englishVariant) {
    return englishVariant;
  }

  return variants[0] ?? null;
}

function mapScenarioStatus(attempts: UserScenarioAttemptRecord[]): ScenarioProgressStatus {
  if (attempts.length === 0) {
    return "not_started";
  }

  const latestAttempt = attempts[0];

  if (latestAttempt.status === "completed" || latestAttempt.status === "passed") {
    return "completed";
  }

  return "in_progress";
}

function normalizeRuntimeStatus(status: string | null | undefined) {
  const normalized = status?.trim().toLowerCase();

  switch (normalized) {
    case "passed":
      return "passed";
    case "completed":
      return "completed";
    case "failed":
      return "failed";
    case "incomplete":
      return "incomplete";
    case "browsed":
      return "browsed";
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

function normalizeScore(scoreRaw: string | null | undefined) {
  if (typeof scoreRaw !== "string" || scoreRaw.trim().length === 0) {
    return null;
  }

  const parsed = Number(scoreRaw);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function parseScormTimeToCentiseconds(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  const match = trimmed.match(/^(\d{1,4}):([0-5]?\d):([0-5]?\d)(?:\.(\d{1,2}))?$/);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  const centisecondsPart = match[4] || "0";
  const centiseconds = Number(centisecondsPart.padEnd(2, "0").slice(0, 2));

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

function formatCentisecondsToScormTime(totalCentiseconds: number | null | undefined) {
  if (
    totalCentiseconds === null ||
    totalCentiseconds === undefined ||
    !Number.isFinite(totalCentiseconds) ||
    totalCentiseconds < 0
  ) {
    return null;
  }

  const normalized = Math.floor(totalCentiseconds);
  const centiseconds = normalized % 100;
  const totalSeconds = Math.floor(normalized / 100);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  return `${String(hours).padStart(4, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function readRuntimeTrackingObject(value: unknown): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as JsonObject;
}

function readStoredCentiseconds(rawTrackingData: JsonObject, key: string) {
  const value = rawTrackingData[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }

  return null;
}

function calculateNextTotalTime(params: {
  previousRawTrackingData: JsonObject;
  incomingSessionTime: string | null | undefined;
  previousTotalTimeString: string | null | undefined;
}) {
  const currentSessionCentis = parseScormTimeToCentiseconds(params.incomingSessionTime);

  const previousSnapshotCentis =
    readStoredCentiseconds(params.previousRawTrackingData, RUNTIME_LAST_SESSION_SNAPSHOT_KEY) ?? 0;

  const previousAccumulatedCentis =
    readStoredCentiseconds(params.previousRawTrackingData, RUNTIME_TOTAL_TIME_CENTIS_KEY) ??
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
  scenario: ScenarioRecord,
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
    title: variant.title,
    description: variant.description?.trim() ?? "Scenario description has not been added yet.",
    area: mapArea(scenario.area),
    packagePath: variant.launchUrl,
    estimatedDurationMinutes: variant.estimatedDurationMinutes,
    status,
    hasAttempt,
  };
}

async function getScenarioLibraryBase(params: { locale: string; userId: string; onlyMy: boolean }) {
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
          availabilityStatus: "available",
        },
        select: {
          id: true,
          language: true,
          title: true,
          description: true,
          instruction: true,
          launchUrl: true,
          packagePath: true,
          entryPoint: true,
          thumbnailUrl: true,
          estimatedDurationMinutes: true,
          availabilityStatus: true,
        },
      },
      userAttempts: {
        where: {
          userId: params.userId,
        },
        select: {
          status: true,
          startedAt: true,
          lastOpenedAt: true,
          completedAt: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: "desc" }],
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return scenarios
    .map((scenario) => mapScenarioToViewModel(scenario, params.locale))
    .filter((scenario): scenario is ScenarioListItemViewModel => scenario !== null);
}

export async function getAllScenarioLibrary(params: { locale: string; userId: string }) {
  return getScenarioLibraryBase({
    locale: params.locale,
    userId: params.userId,
    onlyMy: false,
  });
}

export async function getMyScenarioLibrary(params: { locale: string; userId: string }) {
  return getScenarioLibraryBase({
    locale: params.locale,
    userId: params.userId,
    onlyMy: true,
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
    title: variant.title,
    description: variant.description?.trim() ?? "Scenario description has not been added yet.",
    instruction:
      variant.instruction?.trim() ??
      "Move through the experience step by step, make your decisions, and reflect on the outcome.",
    area: mapArea(scenario.area),
    estimatedDurationMinutes: variant.estimatedDurationMinutes,
    status: mapScenarioStatus(scenario.userAttempts),
    launchUrl: variant.launchUrl,
    thumbnailUrl: variant.thumbnailUrl,
    isFeatured: scenario.isFeatured,
    hasAttempt: latestAttempt !== null,
    score: latestAttempt?.score ?? null,
    startedAt: latestAttempt?.startedAt.toISOString() ?? null,
    lastOpenedAt: latestAttempt?.lastOpenedAt?.toISOString() ?? null,
    completedAt: latestAttempt?.completedAt?.toISOString() ?? null,
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
  const trimmedLaunchUrl = variant.launchUrl.trim();

  return {
    slug: scenario.slug,
    language: variant.language,
    title: variant.title,
    description: variant.description?.trim() ?? "Scenario description has not been added yet.",
    area: mapArea(scenario.area),
    launchUrl: trimmedLaunchUrl.length > 0 ? trimmedLaunchUrl : null,
    status: mapScenarioStatus(scenario.userAttempts),
    hasAttempt: latestAttempt !== null,
    score: latestAttempt?.score ?? null,
    lessonLocation: latestAttempt?.lessonLocation ?? null,
    suspendData: latestAttempt?.suspendData ?? null,
    sessionTime: latestAttempt?.sessionTime ?? null,
    startedAt: latestAttempt?.startedAt.toISOString() ?? null,
    lastOpenedAt: latestAttempt?.lastOpenedAt?.toISOString() ?? null,
    completedAt: latestAttempt?.completedAt?.toISOString() ?? null,
  };
}

export async function getScenarioDetail(params: { locale: string; userId: string; slug: string }) {
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
          availabilityStatus: "available",
        },
        select: {
          id: true,
          language: true,
          title: true,
          description: true,
          instruction: true,
          launchUrl: true,
          packagePath: true,
          entryPoint: true,
          thumbnailUrl: true,
          estimatedDurationMinutes: true,
          availabilityStatus: true,
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
          totalTime: true,
          rawTrackingData: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: "desc" }],
      },
    },
  });

  if (!scenario) {
    return null;
  }

  const mappedScenario = mapScenarioToDetailViewModel(scenario, params.locale);

  if (!mappedScenario) {
    return null;
  }

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
          availabilityStatus: "available",
        },
        select: {
          id: true,
          language: true,
          title: true,
          description: true,
          instruction: true,
          launchUrl: true,
          packagePath: true,
          entryPoint: true,
          thumbnailUrl: true,
          estimatedDurationMinutes: true,
          availabilityStatus: true,
        },
      },
      userAttempts: {
        where: {
          userId: params.userId,
        },
        select: {
          status: true,
          startedAt: true,
          lastOpenedAt: true,
          completedAt: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: "desc" }],
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: 3,
  });

  return {
    scenario: mappedScenario,
    relatedScenarios: relatedScenarios
      .map((item) => mapScenarioToViewModel(item, params.locale))
      .filter((item): item is ScenarioListItemViewModel => item !== null),
  };
}

export async function logScenarioLaunch(params: { locale: string; userId: string; slug: string }) {
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
          instruction: true,
          launchUrl: true,
          packagePath: true,
          entryPoint: true,
          thumbnailUrl: true,
          estimatedDurationMinutes: true,
          availabilityStatus: true,
        },
      },
    },
  });

  if (!scenario) {
    return null;
  }

  const variant = pickVariant(scenario.variants, params.locale);

  if (!variant || variant.launchUrl.trim().length === 0) {
    return null;
  }

  const now = new Date();
  const latestAttempt = await prisma.userScenarioAttempt.findFirst({
    where: {
      userId: params.userId,
      scenarioId: scenario.id,
      scenarioVariantId: variant.id,
    },
    orderBy: [{ attemptNumber: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      attemptNumber: true,
      status: true,
      completedAt: true,
    },
  });

  const shouldResumeExistingAttempt =
    latestAttempt !== null &&
    latestAttempt.completedAt === null &&
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
      scenarioVariantId: variant.id,
      attemptNumber: nextAttemptNumber,
      status: "incomplete",
      startedAt: now,
      lastOpenedAt: now,
    },
    select: { id: true },
  });

  return createdAttempt.id;
}

export async function completeScenarioAttempt(params: {
  locale: string;
  userId: string;
  slug: string;
}) {
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
          instruction: true,
          launchUrl: true,
          packagePath: true,
          entryPoint: true,
          thumbnailUrl: true,
          estimatedDurationMinutes: true,
          availabilityStatus: true,
        },
      },
    },
  });

  if (!scenario) {
    return null;
  }

  const variant = pickVariant(scenario.variants, params.locale);

  if (!variant) {
    return null;
  }

  const now = new Date();
  const latestAttempt = await prisma.userScenarioAttempt.findFirst({
    where: {
      userId: params.userId,
      scenarioId: scenario.id,
      scenarioVariantId: variant.id,
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
        scenarioVariantId: variant.id,
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
}

export async function updateScenarioRuntimeProgress(input: RuntimeTrackingInput) {
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
          title: true,
          description: true,
          instruction: true,
          launchUrl: true,
          packagePath: true,
          entryPoint: true,
          thumbnailUrl: true,
          estimatedDurationMinutes: true,
          availabilityStatus: true,
        },
      },
    },
  });

  if (!scenario) {
    return null;
  }

  const variant = pickVariant(scenario.variants, input.locale);

  if (!variant) {
    return null;
  }

  const now = new Date();
  const normalizedStatus = normalizeRuntimeStatus(input.lessonStatus);
  const normalizedScore = normalizeScore(input.scoreRaw);

  const latestAttempt = await prisma.userScenarioAttempt.findFirst({
    where: {
      userId: input.userId,
      scenarioId: scenario.id,
      scenarioVariantId: variant.id,
    },
    orderBy: [{ attemptNumber: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      attemptNumber: true,
      status: true,
      completedAt: true,
      totalTime: true,
      rawTrackingData: true,
    },
  });

  const nextStatus =
    normalizedStatus ??
    (latestAttempt?.status === "browsed" ? "incomplete" : (latestAttempt?.status ?? "incomplete"));

  const nextCompletedAt =
    nextStatus === "completed" || nextStatus === "passed" || nextStatus === "failed" ? now : null;

  const previousRawTrackingData = readRuntimeTrackingObject(latestAttempt?.rawTrackingData);

  const { nextTotalTime, nextTotalCentis, nextSnapshotCentis } = calculateNextTotalTime({
    previousRawTrackingData,
    incomingSessionTime: input.sessionTime,
    previousTotalTimeString: latestAttempt?.totalTime ?? null,
  });

  const mergedTrackingData: JsonObject = {
    ...previousRawTrackingData,
    ...(input.rawTrackingData ?? {}),
    [RUNTIME_LAST_SESSION_SNAPSHOT_KEY]: nextSnapshotCentis,
    [RUNTIME_TOTAL_TIME_CENTIS_KEY]: nextTotalCentis,
  };

  if (!latestAttempt) {
    await prisma.userScenarioAttempt.create({
      data: {
        userId: input.userId,
        scenarioId: scenario.id,
        scenarioVariantId: variant.id,
        attemptNumber: 1,
        status: nextStatus,
        score: normalizedScore,
        startedAt: now,
        lastOpenedAt: now,
        completedAt: nextCompletedAt,
        sessionTime: normalizeOptionalText(input.sessionTime),
        totalTime: nextTotalTime,
        suspendData: normalizeOptionalText(input.suspendData),
        lessonLocation: normalizeOptionalText(input.lessonLocation),
        rawTrackingData: toPrismaJsonObject(mergedTrackingData),
      },
    });

    return getScenarioLaunch({
      locale: input.locale,
      userId: input.userId,
      slug: input.slug,
    });
  }

  await prisma.userScenarioAttempt.update({
    where: { id: latestAttempt.id },
    data: {
      status: nextStatus,
      score: normalizedScore ?? undefined,
      lastOpenedAt: now,
      completedAt: nextCompletedAt ?? latestAttempt.completedAt ?? undefined,
      sessionTime: normalizeOptionalText(input.sessionTime) ?? undefined,
      totalTime: nextTotalTime ?? undefined,
      suspendData: normalizeOptionalText(input.suspendData) ?? undefined,
      lessonLocation: normalizeOptionalText(input.lessonLocation) ?? undefined,
      rawTrackingData: toPrismaJsonObject(mergedTrackingData),
    },
  });

  return getScenarioLaunch({
    locale: input.locale,
    userId: input.userId,
    slug: input.slug,
  });
}

export async function getScenarioLaunch(params: { locale: string; userId: string; slug: string }) {
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
          availabilityStatus: "available",
        },
        select: {
          id: true,
          language: true,
          title: true,
          description: true,
          instruction: true,
          launchUrl: true,
          packagePath: true,
          entryPoint: true,
          thumbnailUrl: true,
          estimatedDurationMinutes: true,
          availabilityStatus: true,
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
          totalTime: true,
          rawTrackingData: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: "desc" }],
      },
    },
  });

  if (!scenario) {
    return null;
  }

  return mapScenarioToLaunchViewModel(scenario, params.locale);
}
