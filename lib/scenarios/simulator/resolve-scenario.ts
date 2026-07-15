import {
  scenario01Data,
  scenario02Data,
  scenario03Data,
  scenario04Data,
  scenario05Data,
  scenario06Data,
} from "@/content/scenarios";
import { applyEnglishFallback } from "@/lib/i18n/english-fallback";
import type { ScenarioData } from "@/lib/scenarios/simulator/format";
import type {
  ResolvedScenario,
  ScenarioId,
  ScenarioLocaleContent,
} from "@/lib/scenarios/simulator/types";

const scenarioDataById = {
  "scenario-01": scenario01Data,
  "scenario-02": scenario02Data,
  "scenario-03": scenario03Data,
  "scenario-04": scenario04Data,
  "scenario-05": scenario05Data,
  "scenario-06": scenario06Data,
} as const;

type ResolvedChallenge = ResolvedScenario["challenges"][number];
type ResolvedChoice = ResolvedChallenge["choices"][number];

type TechnicalChoice = Pick<ResolvedChoice, "id" | "order" | "isOptimal">;

type LocalizedChoice = Omit<ResolvedChoice, keyof TechnicalChoice>;

type TechnicalChallenge = Pick<ResolvedChallenge, "id" | "order" | "hotspot"> & {
  readonly choices: Readonly<Record<string, TechnicalChoice>>;
};

type LocalizedChallenge = Omit<ResolvedChallenge, "id" | "order" | "hotspot" | "choices"> & {
  readonly choices: Readonly<Partial<Record<string, LocalizedChoice>>>;
};

function isScenarioId(value: string): value is ScenarioId {
  return Object.hasOwn(scenarioDataById, value);
}

function resolveScenarioData(data: ScenarioData, locale: string): ResolvedScenario {
  const { definition, locales } = data;

  const localizedContent = locales[locale as keyof typeof locales];

  const content: ScenarioLocaleContent = localizedContent
    ? applyEnglishFallback(locales.en, localizedContent)
    : locales.en;

  const technicalChallenges = Object.values(definition.challenges) as TechnicalChallenge[];

  const localizedChallenges = content.challenges as unknown as Readonly<
    Partial<Record<string, LocalizedChallenge>>
  >;

  const challenges = technicalChallenges
    .map((technicalChallenge) => {
      const localizedChallenge = localizedChallenges[technicalChallenge.id];

      if (!localizedChallenge) {
        throw new Error(`Missing localized content for challenge ${technicalChallenge.id}.`);
      }

      const choices = Object.values(technicalChallenge.choices)
        .map((technicalChoice) => {
          const localizedChoice = localizedChallenge.choices[technicalChoice.id];

          if (!localizedChoice) {
            throw new Error(`Missing localized content for choice ${technicalChoice.id}.`);
          }

          return {
            ...technicalChoice,
            ...localizedChoice,
          } satisfies ResolvedChoice;
        })
        .sort((first, second) => first.order - second.order);

      return {
        ...technicalChallenge,
        ...localizedChallenge,
        choices,
      } satisfies ResolvedChallenge;
    })
    .sort((first, second) => first.order - second.order);

  return {
    id: definition.id,
    slug: definition.slug,
    order: definition.order,
    curriculumModuleSlug: definition.curriculumModuleSlug,
    sourcePartner: definition.sourcePartner,
    version: definition.version,
    estimatedDurationMinutes: definition.estimatedDurationMinutes,
    assets: definition.assets,
    pathwayPosition: definition.pathwayPosition,

    locale: content.locale,
    title: content.title,
    shortTitle: content.shortTitle,
    subtitle: content.subtitle,
    introduction: content.introduction,
    organisation: content.organisation,
    role: content.role,
    objectives: content.objectives,
    boardAlt: content.boardAlt,
    challenges,
    summary: content.summary,
  };
}

export function resolveScenarioBySlug(slug: string, locale: string): ResolvedScenario | null {
  if (!isScenarioId(slug)) {
    return null;
  }

  return resolveScenarioData(scenarioDataById[slug] as ScenarioData, locale);
}
