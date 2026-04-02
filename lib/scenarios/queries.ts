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
  ScenarioRecord,
  ScenarioVariantRecord,
  UserScenarioAttemptRecord,
} from "@/lib/scenarios/types";
import { Prisma, ScenarioAttemptStatus } from "@prisma/client";

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
    description: normalizeOptionalText(variant.description),
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
    description: normalizeOptionalText(variant.description),
    instruction: normalizeOptionalText(variant.instruction),
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
    description: normalizeOptionalText(variant.description),
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
          language: {
            in: [params.locale, "en"],
          },
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

  const previousRawTrackingData = readRuntimeTrackingObject(latestAttempt?.rawTrackingData);
  const nextTotalTimeState = calculateNextTotalTime({
    previousRawTrackingData,
    incomingSessionTime: input.sessionTime,
    previousTotalTimeString: latestAttempt?.totalTime ?? null,
  });

  const nextRawTrackingData: JsonObject = {
    ...previousRawTrackingData,
    ...(input.rawTrackingData ?? {}),
    [RUNTIME_LAST_SESSION_SNAPSHOT_KEY]: nextTotalTimeState.nextSnapshotCentis,
    [RUNTIME_TOTAL_TIME_CENTIS_KEY]: nextTotalTimeState.nextTotalCentis,
  };

  const updateData = {
    status:
      normalizedStatus ??
      (latestAttempt?.status === "completed" || latestAttempt?.status === "passed"
        ? latestAttempt.status
        : "incomplete"),
    score: normalizedScore ?? latestAttempt?.score ?? null,
    lessonLocation:
      normalizeOptionalText(input.lessonLocation) ?? latestAttempt?.lessonLocation ?? null,
    suspendData: normalizeOptionalText(input.suspendData) ?? latestAttempt?.suspendData ?? null,
    sessionTime: normalizeOptionalText(input.sessionTime) ?? latestAttempt?.sessionTime ?? null,
    totalTime: nextTotalTimeState.nextTotalTime,
    rawTrackingData: toPrismaJsonObject(nextRawTrackingData),
    lastOpenedAt: now,
    completedAt:
      normalizedStatus === "completed" || normalizedStatus === "passed"
        ? now
        : (latestAttempt?.completedAt ?? null),
  };

  if (latestAttempt) {
    await prisma.userScenarioAttempt.update({
      where: { id: latestAttempt.id },
      data: updateData,
    });

    return latestAttempt.id;
  }

  const createdAttempt = await prisma.userScenarioAttempt.create({
    data: {
      userId: input.userId,
      scenarioId: scenario.id,
      scenarioVariantId: variant.id,
      attemptNumber: 1,
      startedAt: now,
      ...updateData,
    },
    select: {
      id: true,
    },
  });

  return createdAttempt.id;
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
          language: {
            in: [params.locale, "en"],
          },
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
