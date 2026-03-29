import { prisma } from "@/lib/prisma";
import {
  ScenarioDetailViewModel,
  ScenarioLaunchViewModel,
  ScenarioListItemViewModel,
  ScenarioProgressStatus,
} from "@/lib/scenarios/types";

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

  return variants.length > 0 ? variants[0] : null;
}

function mapScenarioStatus(attempts: UserScenarioAttemptRecord[]): ScenarioProgressStatus {
  if (attempts.length === 0) {
    return "not_started";
  }

  const hasCompletedAttempt = attempts.some(
    (attempt) => attempt.status === "completed" || attempt.status === "passed",
  );

  if (hasCompletedAttempt) {
    return "completed";
  }

  return "in_progress";
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
      where: {
        id: latestAttempt.id,
      },
      data: {
        lastOpenedAt: now,
      },
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
    select: {
      id: true,
    },
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
      startedAt: true,
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
      select: {
        id: true,
      },
    });

    return createdAttempt.id;
  }

  if (
    latestAttempt.status === "completed" ||
    latestAttempt.status === "passed" ||
    latestAttempt.completedAt !== null
  ) {
    await prisma.userScenarioAttempt.update({
      where: {
        id: latestAttempt.id,
      },
      data: {
        lastOpenedAt: now,
      },
    });

    return latestAttempt.id;
  }

  await prisma.userScenarioAttempt.update({
    where: {
      id: latestAttempt.id,
    },
    data: {
      status: "completed",
      completedAt: now,
      lastOpenedAt: now,
    },
  });

  return latestAttempt.id;
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
