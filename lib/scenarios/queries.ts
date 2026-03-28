import { prisma } from "@/lib/prisma";
import { ScenarioListItemViewModel, ScenarioProgressStatus } from "@/lib/scenarios/types";

type ScenarioVariantRecord = {
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

type ScenarioRecord = {
  slug: string;
  area: string;
  variants: ScenarioVariantRecord[];
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

function mapScenarioStatus(): ScenarioProgressStatus {
  return "not_started";
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

function mapScenarioToViewModel(
  scenario: ScenarioRecord,
  locale: string,
): ScenarioListItemViewModel | null {
  const variant = pickVariant(scenario.variants, locale);

  if (!variant) {
    return null;
  }

  return {
    slug: scenario.slug,
    language: variant.language,
    title: variant.title,
    description: variant.description?.trim() ?? "Scenario description has not been added yet.",
    area: mapArea(scenario.area),
    packagePath: variant.launchUrl,
    estimatedDurationMinutes: variant.estimatedDurationMinutes,
    status: mapScenarioStatus(),
  };
}

export async function getScenarioLibrary(params: { locale: string }) {
  const scenarios = await prisma.scenario.findMany({
    where: {
      status: "published",
    },
    select: {
      slug: true,
      area: true,
      variants: {
        select: {
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
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return scenarios
    .map((scenario) => mapScenarioToViewModel(scenario, params.locale))
    .filter((scenario): scenario is ScenarioListItemViewModel => scenario !== null);
}
