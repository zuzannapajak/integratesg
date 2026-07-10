import { scenario02Data } from "@/content/scenarios/scenario-02";
import type { ResolvedScenario } from "@/lib/scenarios/simulator/types";

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

function resolveScenario02(locale: string): ResolvedScenario {
  const { definition, locales } = scenario02Data;

  const localeKey = locale as keyof typeof locales;
  const content = locales[localeKey] ?? locales.en;

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
  switch (slug) {
    case "scenario-02":
      return resolveScenario02(locale);

    default:
      return null;
  }
}
