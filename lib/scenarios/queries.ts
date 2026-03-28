import { prisma } from "@/lib/prisma";
import { ScenarioListItemViewModel, ScenarioProgressStatus } from "@/lib/scenarios/types";

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
