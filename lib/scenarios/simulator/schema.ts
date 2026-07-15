import type { AppLocale } from "@/lib/i18n/locales";
import { z } from "zod";

import { createChallengeId, createChoiceId, type ScenarioData } from "./format";
import {
  CURRICULUM_MODULE_SLUG_BY_SCENARIO_ID,
  SCENARIO_ORDER_BY_ID,
  SCENARIO_PARTNER_BY_ID,
  type ChallengeId,
  type ChallengeNumber,
  type ChallengeOrder,
  type ChoiceNumber,
  type ChoiceOrder,
  type ScenarioDefinition,
  type ScenarioId,
  type ScenarioLocaleContent,
} from "./types";

const CHALLENGE_ORDER_BY_NUMBER = {
  "01": 1,
  "02": 2,
  "03": 3,
} as const satisfies Record<ChallengeNumber, ChallengeOrder>;

const CHOICE_ORDER_BY_NUMBER = {
  "01": 1,
  "02": 2,
  "03": 3,
} as const satisfies Record<ChoiceNumber, ChoiceOrder>;

const HOTSPOT_LABEL_SIDES = ["top", "right", "bottom", "left"] as const;

type ScenarioAssetPath = `/${string}`;

type ZodObjectEntries = readonly (readonly [string, z.ZodType])[];

type ZodObjectShapeFromEntries<TEntries extends ZodObjectEntries> = {
  [TEntry in TEntries[number] as TEntry[0]]: TEntry[1];
};

/**
 * Builds a strict Zod object while preserving literal keys from
 * dynamically created entry tuples.
 *
 * Without this helper, computed generic keys may be widened to
 * Record<string, ...>.
 */
function strictObjectFromEntries<const TEntries extends ZodObjectEntries>(entries: TEntries) {
  const shape = Object.fromEntries(entries) as ZodObjectShapeFromEntries<TEntries>;

  return z.strictObject(shape);
}

/**
 * Texts may use Markdown, but they cannot be empty.
 *
 * trim() removes only unnecessary whitespace at the beginning
 * and end of the value.
 */
export const nonEmptyScenarioTextSchema = z
  .string()
  .trim()
  .min(1, "Scenario text cannot be empty.");

/**
 * Public asset paths must:
 *
 * - start with one slash;
 * - not use a protocol-relative path;
 * - not contain path traversal;
 * - point to an accepted image format.
 *
 * The transform narrows the validated string to `/${string}`.
 */
export const scenarioAssetPathSchema = z
  .string()
  .trim()
  .regex(
    /^\/(?!\/)(?!.*\.\.)[^?#]+\.png$/i,
    "Scenario asset must be a PNG image stored under the public directory.",
  )
  .transform((path) => path as ScenarioAssetPath);

export const hotspotPositionSchema = z.strictObject({
  x: z.number().min(0, "Hotspot x must be at least 0.").max(100, "Hotspot x must not exceed 100."),

  y: z.number().min(0, "Hotspot y must be at least 0.").max(100, "Hotspot y must not exceed 100."),

  labelSide: z.enum(HOTSPOT_LABEL_SIDES).optional(),
});

export const scenarioAssetsSchema = z.strictObject({
  preStartBackground: scenarioAssetPathSchema,
  inProgressBackground: scenarioAssetPathSchema,
});

export const scenarioPathwayAssetsSchema = z.strictObject({
  backgroundImage: scenarioAssetPathSchema,
});

function createChoiceDefinitionSchema<const TChoiceId extends string>(
  choiceId: TChoiceId,
  order: ChoiceOrder,
) {
  return z.strictObject({
    id: z.literal(choiceId),
    order: z.literal(order),
    isOptimal: z.boolean(),
  });
}

function createChallengeChoicesSchema<const TChallengeId extends ChallengeId>(
  challengeId: TChallengeId,
) {
  const choice01Id = createChoiceId(challengeId, "01");
  const choice02Id = createChoiceId(challengeId, "02");
  const choice03Id = createChoiceId(challengeId, "03");

  return strictObjectFromEntries([
    [choice01Id, createChoiceDefinitionSchema(choice01Id, CHOICE_ORDER_BY_NUMBER["01"])],
    [choice02Id, createChoiceDefinitionSchema(choice02Id, CHOICE_ORDER_BY_NUMBER["02"])],
    [choice03Id, createChoiceDefinitionSchema(choice03Id, CHOICE_ORDER_BY_NUMBER["03"])],
  ] as const);
}

function createChallengeDefinitionSchema<
  const TScenarioId extends ScenarioId,
  const TChallengeNumber extends ChallengeNumber,
>(scenarioId: TScenarioId, challengeNumber: TChallengeNumber) {
  const challengeId = createChallengeId(scenarioId, challengeNumber);

  return z
    .strictObject({
      id: z.literal(challengeId),

      order: z.literal(CHALLENGE_ORDER_BY_NUMBER[challengeNumber]),

      hotspot: hotspotPositionSchema,

      choices: createChallengeChoicesSchema(challengeId),
    })
    .superRefine((challenge, context) => {
      const choices = Object.values(challenge.choices) as Array<{
        isOptimal: boolean;
      }>;

      const optimalChoicesCount = choices.filter((choice) => choice.isOptimal).length;

      if (optimalChoicesCount !== 1) {
        context.addIssue({
          code: "custom",
          path: ["choices"],
          message:
            `${challenge.id} must contain exactly one ` +
            `optimal choice. Found ${optimalChoicesCount}.`,
        });
      }
    });
}

function createScenarioChallengesSchema<const TScenarioId extends ScenarioId>(
  scenarioId: TScenarioId,
) {
  const challenge01Id = createChallengeId(scenarioId, "01");
  const challenge02Id = createChallengeId(scenarioId, "02");
  const challenge03Id = createChallengeId(scenarioId, "03");

  return strictObjectFromEntries([
    [challenge01Id, createChallengeDefinitionSchema(scenarioId, "01")],
    [challenge02Id, createChallengeDefinitionSchema(scenarioId, "02")],
    [challenge03Id, createChallengeDefinitionSchema(scenarioId, "03")],
  ] as const);
}

/**
 * Creates a runtime schema for the language-independent
 * definition of a selected scenario.
 */
export function createScenarioDefinitionSchema<const TScenarioId extends ScenarioId>(
  scenarioId: TScenarioId,
): z.ZodType<ScenarioDefinition<TScenarioId>> {
  const schema = z.strictObject({
    id: z.literal(scenarioId),
    slug: z.literal(scenarioId),

    order: z.literal(SCENARIO_ORDER_BY_ID[scenarioId]),

    curriculumModuleSlug: z.literal(CURRICULUM_MODULE_SLUG_BY_SCENARIO_ID[scenarioId]),

    sourcePartner: z.literal(SCENARIO_PARTNER_BY_ID[scenarioId]),

    version: z
      .number()
      .int("Scenario version must be an integer.")
      .positive("Scenario version must be positive."),

    estimatedDurationMinutes: z
      .number()
      .int("Estimated duration must be an integer.")
      .positive("Estimated duration must be greater than zero.")
      .nullable(),

    assets: scenarioAssetsSchema,

    pathwayPosition: hotspotPositionSchema,

    challenges: createScenarioChallengesSchema(scenarioId),
  });

  /*
   * Runtime validation is fully defined above. This assertion only
   * supplies the generic output relationship that TypeScript cannot
   * derive through the computed challenge keys.
   */
  return schema as unknown as z.ZodType<ScenarioDefinition<TScenarioId>>;
}

export const choiceFeedbackContentSchema = z.strictObject({
  title: nonEmptyScenarioTextSchema.optional(),

  body: nonEmptyScenarioTextSchema,

  consequence: nonEmptyScenarioTextSchema.optional(),

  takeaway: nonEmptyScenarioTextSchema.optional(),
});

export const choiceLocaleContentSchema = z.strictObject({
  label: nonEmptyScenarioTextSchema.optional(),
  text: nonEmptyScenarioTextSchema,
  feedback: choiceFeedbackContentSchema,
});

function createChallengeChoiceLocaleSchema<const TChallengeId extends ChallengeId>(
  challengeId: TChallengeId,
) {
  const choice01Id = createChoiceId(challengeId, "01");
  const choice02Id = createChoiceId(challengeId, "02");
  const choice03Id = createChoiceId(challengeId, "03");

  return strictObjectFromEntries([
    [choice01Id, choiceLocaleContentSchema],
    [choice02Id, choiceLocaleContentSchema],
    [choice03Id, choiceLocaleContentSchema],
  ] as const);
}

function createChallengeLocaleSchema<const TChallengeId extends ChallengeId>(
  challengeId: TChallengeId,
) {
  return z.strictObject({
    title: nonEmptyScenarioTextSchema,
    shortTitle: nonEmptyScenarioTextSchema,
    context: nonEmptyScenarioTextSchema,
    question: nonEmptyScenarioTextSchema,

    choices: createChallengeChoiceLocaleSchema(challengeId),
  });
}

function createScenarioChallengeLocaleSchema<const TScenarioId extends ScenarioId>(
  scenarioId: TScenarioId,
) {
  const challenge01Id = createChallengeId(scenarioId, "01");
  const challenge02Id = createChallengeId(scenarioId, "02");
  const challenge03Id = createChallengeId(scenarioId, "03");

  return strictObjectFromEntries([
    [challenge01Id, createChallengeLocaleSchema(challenge01Id)],
    [challenge02Id, createChallengeLocaleSchema(challenge02Id)],
    [challenge03Id, createChallengeLocaleSchema(challenge03Id)],
  ] as const);
}

export const scenarioSummaryContentSchema = z.strictObject({
  title: nonEmptyScenarioTextSchema,

  body: nonEmptyScenarioTextSchema.optional(),

  takeaways: z
    .array(nonEmptyScenarioTextSchema)
    .min(1, "Scenario summary must contain at least one takeaway."),
});

/**
 * Creates a schema for one specific scenario translation.
 *
 * Both the scenario ID and locale are validated as literals.
 */
export function createScenarioLocaleSchema<const TScenarioId extends ScenarioId>(
  scenarioId: TScenarioId,
  locale: AppLocale,
) {
  return z.strictObject({
    scenarioId: z.literal(scenarioId),
    locale: z.literal(locale),

    title: nonEmptyScenarioTextSchema,
    shortTitle: nonEmptyScenarioTextSchema,
    subtitle: nonEmptyScenarioTextSchema.optional(),

    introduction: nonEmptyScenarioTextSchema,

    organisation: nonEmptyScenarioTextSchema.optional(),

    role: nonEmptyScenarioTextSchema.optional(),

    objectives: z
      .array(nonEmptyScenarioTextSchema)
      .min(1, "Scenario must contain at least one learning objective."),

    boardAlt: nonEmptyScenarioTextSchema,

    challenges: createScenarioChallengeLocaleSchema(scenarioId),

    summary: scenarioSummaryContentSchema,
  });
}

/**
 * Creates the complete schema for one scenario module.
 *
 * English is required. Other platform languages remain optional
 * until the translations are prepared.
 */
export function createScenarioDataSchema<const TScenarioId extends ScenarioId>(
  scenarioId: TScenarioId,
): z.ZodType<ScenarioData<TScenarioId>> {
  const schema = z.strictObject({
    definition: createScenarioDefinitionSchema(scenarioId),

    locales: z.strictObject({
      en: createScenarioLocaleSchema(scenarioId, "en"),

      it: createScenarioLocaleSchema(scenarioId, "it").optional(),

      de: createScenarioLocaleSchema(scenarioId, "de").optional(),

      el: createScenarioLocaleSchema(scenarioId, "el").optional(),

      pl: createScenarioLocaleSchema(scenarioId, "pl").optional(),

      bg: createScenarioLocaleSchema(scenarioId, "bg").optional(),
    }),
  });

  return schema as unknown as z.ZodType<ScenarioData<TScenarioId>>;
}

/**
 * Prebuilt schemas for all six scenarios.
 */
export const SCENARIO_DATA_SCHEMAS = {
  "scenario-01": createScenarioDataSchema("scenario-01"),

  "scenario-02": createScenarioDataSchema("scenario-02"),

  "scenario-03": createScenarioDataSchema("scenario-03"),

  "scenario-04": createScenarioDataSchema("scenario-04"),

  "scenario-05": createScenarioDataSchema("scenario-05"),

  "scenario-06": createScenarioDataSchema("scenario-06"),
} as const;

export function getScenarioDataSchema<const TScenarioId extends ScenarioId>(
  scenarioId: TScenarioId,
): (typeof SCENARIO_DATA_SCHEMAS)[TScenarioId] {
  return SCENARIO_DATA_SCHEMAS[scenarioId];
}

/**
 * Non-throwing validation intended mainly for tests and
 * controlled error handling.
 *
 * The factory is called directly to preserve the relationship
 * between TScenarioId and the parsed output.
 */
export function safeParseScenarioData<const TScenarioId extends ScenarioId>(
  scenarioId: TScenarioId,
  input: unknown,
) {
  return createScenarioDataSchema(scenarioId).safeParse(input);
}

/**
 * Formats a Zod error as a readable multiline message.
 */
export function formatScenarioValidationError(error: z.ZodError): string {
  return z.prettifyError(error);
}

/**
 * Validates scenario data and returns it using the existing
 * TypeScript domain type.
 *
 * Invalid source content causes an immediate descriptive error.
 */
export function parseScenarioData<const TScenarioId extends ScenarioId>(
  scenarioId: TScenarioId,
  input: unknown,
): ScenarioData<TScenarioId> {
  const result = safeParseScenarioData(scenarioId, input);

  if (!result.success) {
    throw new Error(
      [
        `Invalid scenario data for ${scenarioId}.`,
        formatScenarioValidationError(result.error),
      ].join("\n"),
    );
  }

  return result.data;
}

/**
 * Optional helpers for validating individual parts of the data.
 */
export function parseScenarioDefinition<const TScenarioId extends ScenarioId>(
  scenarioId: TScenarioId,
  input: unknown,
): ScenarioDefinition<TScenarioId> {
  const result = createScenarioDefinitionSchema(scenarioId).safeParse(input);

  if (!result.success) {
    throw new Error(
      [`Invalid definition for ${scenarioId}.`, formatScenarioValidationError(result.error)].join(
        "\n",
      ),
    );
  }

  return result.data;
}

export function parseScenarioLocale<const TScenarioId extends ScenarioId>(
  scenarioId: TScenarioId,
  locale: AppLocale,
  input: unknown,
): ScenarioLocaleContent<TScenarioId> {
  const result = createScenarioLocaleSchema(scenarioId, locale).safeParse(input);

  if (!result.success) {
    throw new Error(
      [
        `Invalid ${locale} content for ${scenarioId}.`,
        formatScenarioValidationError(result.error),
      ].join("\n"),
    );
  }

  return result.data as ScenarioLocaleContent<TScenarioId>;
}
