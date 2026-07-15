import {
  createChallengeId,
  createChoiceId,
  defineScenarioDefinition,
} from "@/lib/scenarios/simulator/format";
import {
  CURRICULUM_MODULE_SLUG_BY_SCENARIO_ID,
  SCENARIO_ORDER_BY_ID,
  SCENARIO_PARTNER_BY_ID,
} from "@/lib/scenarios/simulator/types";

const scenarioId = "scenario-02" as const;

const challenge01Id = createChallengeId(scenarioId, "01");

const challenge02Id = createChallengeId(scenarioId, "02");

const challenge03Id = createChallengeId(scenarioId, "03");

const challenge01Choice01Id = createChoiceId(challenge01Id, "01");

const challenge01Choice02Id = createChoiceId(challenge01Id, "02");

const challenge01Choice03Id = createChoiceId(challenge01Id, "03");

const challenge02Choice01Id = createChoiceId(challenge02Id, "01");

const challenge02Choice02Id = createChoiceId(challenge02Id, "02");

const challenge02Choice03Id = createChoiceId(challenge02Id, "03");

const challenge03Choice01Id = createChoiceId(challenge03Id, "01");

const challenge03Choice02Id = createChoiceId(challenge03Id, "02");

const challenge03Choice03Id = createChoiceId(challenge03Id, "03");

/**
 * Stable identifiers shared by the technical definition,
 * translations and tests.
 *
 * These values must not be changed after progress records
 * have been stored in the database.
 */
export const scenario02Ids = {
  scenarioId,

  challenges: {
    priorities: challenge01Id,
    financialPressure: challenge02Id,
    peopleAndTeams: challenge03Id,
  },

  choices: {
    priorities: {
      shortTermActions: challenge01Choice01Id,
      materialPriorities: challenge01Choice02Id,
      broadCommitments: challenge01Choice03Id,
    },

    financialPressure: {
      pauseEsgWork: challenge02Choice01Id,
      investInEverything: challenge02Choice02Id,
      phasedBusinessCase: challenge02Choice03Id,
    },

    peopleAndTeams: {
      sharedOwnership: challenge03Choice01Id,
      sustainabilityOnly: challenge03Choice02Id,
      communicationOnly: challenge03Choice03Id,
    },
  },
} as const;

export const scenario02Definition = defineScenarioDefinition<"scenario-02">({
  id: scenarioId,
  slug: scenarioId,

  order: SCENARIO_ORDER_BY_ID[scenarioId],

  curriculumModuleSlug: CURRICULUM_MODULE_SLUG_BY_SCENARIO_ID[scenarioId],

  sourcePartner: SCENARIO_PARTNER_BY_ID[scenarioId],

  version: 1,

  estimatedDurationMinutes: 15,

  assets: {
    preStartBackground: "/scenarios/scenario-02/pre-start.png",
    inProgressBackground: "/scenarios/scenario-02/in-progress.png",
  },

  /**
   * Position of Scenario 2 on the six-scenario pathway.
   *
   * These coordinates may later be adjusted to match
   * the final pathway illustration.
   */
  pathwayPosition: {
    x: 32,
    y: 27,
    labelSide: "bottom",
  },

  challenges: {
    [challenge01Id]: {
      id: challenge01Id,
      order: 1,

      hotspot: {
        x: 18,
        y: 75,
        labelSide: "bottom",
      },

      choices: {
        [challenge01Choice01Id]: {
          id: challenge01Choice01Id,
          order: 1,
          isOptimal: false,
        },

        [challenge01Choice02Id]: {
          id: challenge01Choice02Id,
          order: 2,
          isOptimal: true,
        },

        [challenge01Choice03Id]: {
          id: challenge01Choice03Id,
          order: 3,
          isOptimal: false,
        },
      },
    },

    [challenge02Id]: {
      id: challenge02Id,
      order: 2,

      hotspot: {
        x: 50,
        y: 75,
        labelSide: "bottom",
      },

      choices: {
        [challenge02Choice01Id]: {
          id: challenge02Choice01Id,
          order: 1,
          isOptimal: false,
        },

        [challenge02Choice02Id]: {
          id: challenge02Choice02Id,
          order: 2,
          isOptimal: false,
        },

        [challenge02Choice03Id]: {
          id: challenge02Choice03Id,
          order: 3,
          isOptimal: true,
        },
      },
    },

    [challenge03Id]: {
      id: challenge03Id,
      order: 3,

      hotspot: {
        x: 82,
        y: 75,
        labelSide: "bottom",
      },

      choices: {
        [challenge03Choice01Id]: {
          id: challenge03Choice01Id,
          order: 1,
          isOptimal: true,
        },

        [challenge03Choice02Id]: {
          id: challenge03Choice02Id,
          order: 2,
          isOptimal: false,
        },

        [challenge03Choice03Id]: {
          id: challenge03Choice03Id,
          order: 3,
          isOptimal: false,
        },
      },
    },
  },
});
