import type { AppLocale } from "@/lib/i18n/locales";

/**
 * The platform contains exactly six scenario simulations.
 *
 * These identifiers are persisted in progress records and must remain stable.
 */
export const SCENARIO_IDS = [
  "scenario-01",
  "scenario-02",
  "scenario-03",
  "scenario-04",
  "scenario-05",
  "scenario-06",
] as const;

export type ScenarioId = (typeof SCENARIO_IDS)[number];

/**
 * The scenario slug is intentionally identical to the scenario ID.
 *
 * Example route:
 * /en/scenarios/scenario-01/play
 */
export type ScenarioSlug = ScenarioId;

/**
 * Scenario order is fixed because scenarios are completed sequentially.
 */
export const SCENARIO_ORDER_BY_ID = {
  "scenario-01": 1,
  "scenario-02": 2,
  "scenario-03": 3,
  "scenario-04": 4,
  "scenario-05": 5,
  "scenario-06": 6,
} as const satisfies Record<ScenarioId, number>;

export type ScenarioOrder = (typeof SCENARIO_ORDER_BY_ID)[ScenarioId];

export type ScenarioOrderFor<TScenarioId extends ScenarioId> =
  (typeof SCENARIO_ORDER_BY_ID)[TScenarioId];

/**
 * Every scenario is linked to the corresponding curriculum module.
 *
 * These values match the curriculum module slugs already used by the project.
 */
export const CURRICULUM_MODULE_SLUG_BY_SCENARIO_ID = {
  "scenario-01": "module-1-introduction-to-esg-and-sustainable-development",
  "scenario-02": "module-2-strategy-vision-and-organisational-alignment",
  "scenario-03": "module-3-navigating-esg-frameworks-and-eu-reporting-standards",
  "scenario-04": "module-4-integrating-esg-into-business-operations",
  "scenario-05": "module-5-implementation-data-and-cross-functional-practice",
  "scenario-06": "module-6-monitoring-reporting-and-future-trends-of-esg",
} as const satisfies Record<ScenarioId, string>;

export type CurriculumModuleSlug = (typeof CURRICULUM_MODULE_SLUG_BY_SCENARIO_ID)[ScenarioId];

export type CurriculumModuleSlugFor<TScenarioId extends ScenarioId> =
  (typeof CURRICULUM_MODULE_SLUG_BY_SCENARIO_ID)[TScenarioId];

/**
 * Partner responsible for the source material.
 *
 * This is metadata and is not used to determine the scenario logic.
 */
export const SCENARIO_PARTNER_BY_ID = {
  "scenario-01": "IoD",
  "scenario-02": "CleverMind",
  "scenario-03": "die Berater",
  "scenario-04": "TUL",
  "scenario-05": "SBC",
  "scenario-06": "EGINA",
} as const satisfies Record<ScenarioId, string>;

export type ScenarioSourcePartner = (typeof SCENARIO_PARTNER_BY_ID)[ScenarioId];

export type ScenarioSourcePartnerFor<TScenarioId extends ScenarioId> =
  (typeof SCENARIO_PARTNER_BY_ID)[TScenarioId];

/**
 * Every supplied scenario contains exactly three challenges.
 */
export const CHALLENGE_NUMBERS = ["01", "02", "03"] as const;

export type ChallengeNumber = (typeof CHALLENGE_NUMBERS)[number];

export type ChallengeOrder = 1 | 2 | 3;

/**
 * Every challenge contains exactly three decisions.
 */
export const CHOICE_NUMBERS = ["01", "02", "03"] as const;

export type ChoiceNumber = (typeof CHOICE_NUMBERS)[number];

export type ChoiceOrder = 1 | 2 | 3;

/**
 * Examples:
 *
 * scenario-01-challenge-01
 * scenario-04-challenge-03
 */
export type ChallengeIdFor<TScenarioId extends ScenarioId> =
  `${TScenarioId}-challenge-${ChallengeNumber}`;

export type ChallengeId = ChallengeIdFor<ScenarioId>;

/**
 * Examples:
 *
 * scenario-01-challenge-01-choice-01
 * scenario-06-challenge-03-choice-03
 */
export type ChoiceIdFor<TChallengeId extends ChallengeId> =
  `${TChallengeId}-choice-${ChoiceNumber}`;

export type ChoiceId = ChoiceIdFor<ChallengeId>;

/**
 * A path pointing to a file stored under the public directory.
 *
 * Example:
 * /scenarios/scenario-01/board.webp
 */
export type PublicAssetPath = `/${string}`;

/**
 * Localised content may contain Markdown-compatible formatting.
 */
export type RichText = string;

/**
 * ISO 8601 date transferred between the server and client.
 */
export type IsoDateString = string;

export type HotspotLabelSide = "top" | "right" | "bottom" | "left";

/**
 * Position of a hotspot relative to the illustration.
 *
 * Values are expressed as percentages and will be validated by Zod
 * in the next task.
 */
export type HotspotPosition = {
  /**
   * Horizontal position from 0 to 100.
   */
  readonly x: number;

  /**
   * Vertical position from 0 to 100.
   */
  readonly y: number;

  /**
   * Preferred label placement on wide screens.
   */
  readonly labelSide?: HotspotLabelSide;
};

export type ScenarioAssets = {
  /**
   * Main interactive scenario illustration.
   */
  readonly boardImage: PublicAssetPath;

  /**
   * Optional image used on the scenario introduction screen.
   */
  readonly coverImage?: PublicAssetPath;
};

/**
 * Language-independent decision configuration.
 *
 * Decision text and feedback are stored separately in locale files.
 */
export type ChoiceDefinition<TChoiceId extends ChoiceId = ChoiceId> = {
  readonly id: TChoiceId;
  readonly order: ChoiceOrder;

  /**
   * Only the optimal decision allows the learner to complete
   * the current challenge.
   */
  readonly isOptimal: boolean;
};

/**
 * Enforces the three exact decision IDs belonging to one challenge.
 */
export type ChallengeChoiceDefinitions<TChallengeId extends ChallengeId> = {
  readonly [TChoiceId in ChoiceIdFor<TChallengeId>]: ChoiceDefinition<TChoiceId>;
};

/**
 * Language-independent challenge configuration.
 */
export type ChallengeDefinition<TChallengeId extends ChallengeId = ChallengeId> = {
  readonly id: TChallengeId;
  readonly order: ChallengeOrder;
  readonly hotspot: HotspotPosition;
  readonly choices: ChallengeChoiceDefinitions<TChallengeId>;
};

/**
 * Enforces the three exact challenge IDs belonging to one scenario.
 */
export type ScenarioChallengeDefinitions<TScenarioId extends ScenarioId> = {
  readonly [TChallengeId in ChallengeIdFor<TScenarioId>]: ChallengeDefinition<TChallengeId>;
};

/**
 * Language-independent scenario configuration.
 *
 * This type will be used by:
 * content/scenarios/scenario-XX/definition.ts
 */
export type ScenarioDefinition<TScenarioId extends ScenarioId = ScenarioId> = {
  readonly id: TScenarioId;
  readonly slug: TScenarioId;

  /**
   * The type system ensures that scenario-03 has order 3,
   * scenario-05 has order 5, etc.
   */
  readonly order: ScenarioOrderFor<TScenarioId>;

  /**
   * Existing curriculum module slug associated with the scenario.
   */
  readonly curriculumModuleSlug: CurriculumModuleSlugFor<TScenarioId>;

  /**
   * Partner responsible for the original scenario material.
   */
  readonly sourcePartner: ScenarioSourcePartnerFor<TScenarioId>;

  /**
   * Increment this value when IDs, decisions or scenario logic change.
   *
   * Pure text corrections do not necessarily require a new version.
   */
  readonly version: number;

  /**
   * May remain null until the estimated duration is approved.
   */
  readonly estimatedDurationMinutes: number | null;

  readonly assets: ScenarioAssets;

  /**
   * Position of this scenario on the six-scenario pathway map.
   */
  readonly pathwayPosition: HotspotPosition;

  readonly challenges: ScenarioChallengeDefinitions<TScenarioId>;
};

/**
 * Feedback displayed after a learner confirms a decision.
 *
 * Only body is required because some supplied materials contain
 * one complete feedback paragraph without separate sections.
 */
export type ChoiceFeedbackContent = {
  readonly title?: string;
  readonly body: RichText;
  readonly consequence?: RichText;
  readonly takeaway?: RichText;
};

/**
 * Localised text of a decision.
 */
export type ChoiceLocaleContent = {
  /**
   * Optional short heading displayed above the full decision text.
   */
  readonly label?: string;

  /**
   * Full decision text supplied in the source material.
   */
  readonly text: RichText;

  readonly feedback: ChoiceFeedbackContent;
};

/**
 * Localised decision texts belonging to a specific challenge.
 */
export type ChallengeChoiceLocaleContent<TChallengeId extends ChallengeId> = {
  readonly [TChoiceId in ChoiceIdFor<TChallengeId>]: ChoiceLocaleContent;
};

/**
 * Localised challenge content.
 *
 * The challenge ID does not need to be repeated inside the object,
 * because it is already used as the object key.
 */
export type ChallengeLocaleContent<TChallengeId extends ChallengeId = ChallengeId> = {
  /**
   * Full challenge heading.
   */
  readonly title: string;

  /**
   * Short label used on boards and mobile challenge lists.
   */
  readonly shortTitle: string;

  /**
   * Situation and context provided before the decision.
   */
  readonly context: RichText;

  /**
   * Question or instruction shown above the choices.
   */
  readonly question: RichText;

  readonly choices: ChallengeChoiceLocaleContent<TChallengeId>;
};

/**
 * Enforces translated content for all three challenges.
 */
export type ScenarioChallengeLocaleContent<TScenarioId extends ScenarioId> = {
  readonly [TChallengeId in ChallengeIdFor<TScenarioId>]: ChallengeLocaleContent<TChallengeId>;
};

export type ScenarioSummaryContent = {
  readonly title: string;
  readonly body?: RichText;
  readonly takeaways: readonly string[];
};

/**
 * Localised content of a complete scenario.
 *
 * This type will be used by:
 * content/scenarios/scenario-XX/locales/en.ts
 */
export type ScenarioLocaleContent<TScenarioId extends ScenarioId = ScenarioId> = {
  readonly scenarioId: TScenarioId;
  readonly locale: AppLocale;

  /**
   * Full title used on the introduction screen.
   */
  readonly title: string;

  /**
   * Short title used on the six-scenario pathway.
   */
  readonly shortTitle: string;

  readonly subtitle?: string;
  readonly introduction: RichText;

  /**
   * Optional because not all supplied scenarios explicitly name
   * the organisation or learner role.
   */
  readonly organisation?: string;
  readonly role?: string;

  readonly objectives: readonly string[];

  /**
   * Alternative description of the scenario illustration.
   */
  readonly boardAlt: string;

  readonly challenges: ScenarioChallengeLocaleContent<TScenarioId>;
  readonly summary: ScenarioSummaryContent;
};

/**
 * Combined decision object used by React components after the
 * definition and locale content have been merged.
 */
export type ResolvedChoice = ChoiceDefinition & ChoiceLocaleContent;

/**
 * Combined challenge object used by the scenario player.
 *
 * Object maps are converted to ordered arrays by the future registry.
 */
export type ResolvedChallenge = Omit<ChallengeDefinition, "choices"> &
  Omit<ChallengeLocaleContent, "choices"> & {
    readonly choices: readonly ResolvedChoice[];
  };

/**
 * Complete scenario ready to be rendered by the scenario player.
 */
export type ResolvedScenario = Omit<ScenarioDefinition, "challenges"> &
  Omit<ScenarioLocaleContent, "scenarioId" | "challenges"> & {
    readonly challenges: readonly ResolvedChallenge[];
  };

/**
 * Status shown on the six-scenario pathway.
 */
export const SCENARIO_PROGRESS_STATUSES = [
  "locked",
  "available",
  "in_progress",
  "completed",
] as const;

export type ScenarioProgressStatus = (typeof SCENARIO_PROGRESS_STATUSES)[number];

/**
 * Status shown for an individual challenge.
 */
export const CHALLENGE_PROGRESS_STATUSES = [
  "locked",
  "available",
  "in_progress",
  "completed",
] as const;

export type ChallengeProgressStatus = (typeof CHALLENGE_PROGRESS_STATUSES)[number];

/**
 * Play mode writes progress.
 * Review mode only displays an already completed scenario.
 */
export type ScenarioPlayerMode = "play" | "review";

/**
 * Main screens controlled by the future scenario player state.
 */
export type ScenarioPlayerView =
  | "intro"
  | "board"
  | "challenge"
  | "feedback"
  | "summary"
  | "completion";

/**
 * Client-safe progress representation for one challenge.
 *
 * This is not a Prisma model. It is a serialisable view of progress
 * transferred from the server to the player.
 */
export type ChallengeProgressSnapshot<TChallengeId extends ChallengeId = ChallengeId> = {
  readonly challengeId: TChallengeId;
  readonly status: ChallengeProgressStatus;
  readonly attemptCount: number;

  /**
   * Decisions already selected during the active attempt.
   */
  readonly triedChoiceIds: readonly ChoiceIdFor<TChallengeId>[];

  readonly firstChoiceId: ChoiceIdFor<TChallengeId> | null;
  readonly optimalChoiceId: ChoiceIdFor<TChallengeId> | null;

  readonly startedAt: IsoDateString | null;
  readonly completedAt: IsoDateString | null;
};

/**
 * Progress map containing all three challenges of one scenario.
 */
export type ScenarioChallengeProgressMap<TScenarioId extends ScenarioId> = {
  readonly [TChallengeId in ChallengeIdFor<TScenarioId>]: ChallengeProgressSnapshot<TChallengeId>;
};

/**
 * Client-safe progress representation for a complete scenario.
 */
export type ScenarioProgressSnapshot<TScenarioId extends ScenarioId = ScenarioId> = {
  readonly attemptId: string | null;
  readonly scenarioId: TScenarioId;
  readonly scenarioVersion: number;
  readonly locale: AppLocale;
  readonly status: ScenarioProgressStatus;
  readonly currentChallengeId: ChallengeIdFor<TScenarioId> | null;

  readonly startedAt: IsoDateString | null;
  readonly lastActivityAt: IsoDateString | null;
  readonly completedAt: IsoDateString | null;

  readonly challenges: ScenarioChallengeProgressMap<TScenarioId>;
};

/**
 * Status of all six scenarios displayed on the start pathway.
 */
export type ScenarioPathwayStatusMap = {
  readonly [TScenarioId in ScenarioId]: ScenarioProgressStatus;
};
