import type {
  ChallengeId,
  ChallengeNumber,
  ChoiceNumber,
  ScenarioDefinition,
  ScenarioId,
  ScenarioLocaleContent,
} from "./types";

/**
 * English is the base locale for all six scenarios.
 *
 * Every scenario must provide an English version. Additional locales
 * can be added later without changing the player.
 */
export const SCENARIO_BASE_LOCALE = "en" as const;

/**
 * Locale union already used by ScenarioLocaleContent.
 */
type SupportedScenarioLocale = ScenarioLocaleContent["locale"];
/**
 * A locale entry whose object key and internal `locale` value
 * must represent the same language.
 *
 * Example:
 *
 * locales.en.locale must equal "en".
 */
export type ScenarioLocaleEntry<
  TScenarioId extends ScenarioId,
  TLocale extends SupportedScenarioLocale,
> = Omit<ScenarioLocaleContent<TScenarioId>, "locale"> & {
  readonly locale: TLocale;
};

/**
 * Collection of available translations for one scenario.
 *
 * English is required.
 * Other platform languages are optional until their translations
 * are prepared.
 */
export type ScenarioLocaleMap<TScenarioId extends ScenarioId> = {
  readonly en: ScenarioLocaleEntry<TScenarioId, "en">;
} & Partial<{
  readonly [TLocale in Exclude<SupportedScenarioLocale, "en">]: ScenarioLocaleEntry<
    TScenarioId,
    TLocale
  >;
}>;

/**
 * Complete source-data module for one scenario.
 *
 * It combines:
 *
 * - language-independent definition;
 * - one required English locale;
 * - optional additional locales.
 */
export type ScenarioData<TScenarioId extends ScenarioId = ScenarioId> = {
  readonly definition: ScenarioDefinition<TScenarioId>;
  readonly locales: ScenarioLocaleMap<TScenarioId>;
};

/**
 * Type-safe helper for language-independent scenario definitions.
 *
 * Always provide the scenario generic explicitly:
 *
 * defineScenarioDefinition<"scenario-01">(...)
 */
export function defineScenarioDefinition<TScenarioId extends ScenarioId>(
  definition: ScenarioDefinition<TScenarioId>,
): ScenarioDefinition<TScenarioId> {
  return definition;
}

/**
 * Type-safe helper for one scenario locale.
 *
 * Always provide the scenario generic explicitly:
 *
 * defineScenarioLocale<"scenario-01">(...)
 */
export function defineScenarioLocale<TScenarioId extends ScenarioId>(
  content: ScenarioLocaleContent<TScenarioId>,
): ScenarioLocaleContent<TScenarioId> {
  return content;
}

/**
 * Type-safe helper for the map of available scenario translations.
 */
export function defineScenarioLocales<TScenarioId extends ScenarioId>(
  locales: ScenarioLocaleMap<TScenarioId>,
): ScenarioLocaleMap<TScenarioId> {
  return locales;
}

/**
 * Type-safe helper combining a definition and its translations.
 *
 * It prevents accidentally connecting, for example, a Scenario 1
 * definition with Scenario 2 locale content.
 */
export function defineScenarioData<TScenarioId extends ScenarioId>(
  data: ScenarioData<TScenarioId>,
): ScenarioData<TScenarioId> {
  return data;
}

/**
 * Creates a stable challenge identifier.
 *
 * Example:
 *
 * createChallengeId("scenario-02", "03")
 * returns:
 * "scenario-02-challenge-03"
 */
export function createChallengeId<
  const TScenarioId extends ScenarioId,
  const TChallengeNumber extends ChallengeNumber,
>(
  scenarioId: TScenarioId,
  challengeNumber: TChallengeNumber,
): `${TScenarioId}-challenge-${TChallengeNumber}` {
  return `${scenarioId}-challenge-${challengeNumber}`;
}

/**
 * Creates a stable choice identifier.
 *
 * Example:
 *
 * createChoiceId("scenario-02-challenge-03", "01")
 * returns:
 * "scenario-02-challenge-03-choice-01"
 */
export function createChoiceId<
  const TChallengeId extends ChallengeId,
  const TChoiceNumber extends ChoiceNumber,
>(
  challengeId: TChallengeId,
  choiceNumber: TChoiceNumber,
): `${TChallengeId}-choice-${TChoiceNumber}` {
  return `${challengeId}-choice-${choiceNumber}`;
}
