import {
  createChallengeId,
  createChoiceId,
  type ScenarioData,
} from "@/lib/scenarios/simulator/format";
import {
  CURRICULUM_MODULE_SLUG_BY_SCENARIO_ID,
  SCENARIO_ORDER_BY_ID,
  SCENARIO_PARTNER_BY_ID,
} from "@/lib/scenarios/simulator/types";

const scenarioId = "scenario-01" as const;

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

function createChoiceContent(number: number) {
  return {
    label: `Decision ${number}`,
    text: `Full text of decision ${number}.`,

    feedback: {
      title: `Feedback ${number}`,
      body: `Full feedback for decision ${number}.`,
      consequence: `Consequence of decision ${number}.`,
      takeaway: `Educational takeaway for decision ${number}.`,
    },
  };
}

export const scenario01FixtureIds = {
  challenge01Id,
  challenge02Id,
  challenge03Id,

  challenge01Choice01Id,
  challenge01Choice02Id,
  challenge01Choice03Id,

  challenge02Choice01Id,
  challenge02Choice02Id,
  challenge02Choice03Id,

  challenge03Choice01Id,
  challenge03Choice02Id,
  challenge03Choice03Id,
} as const;

export const validScenario01Data = {
  definition: {
    id: scenarioId,
    slug: scenarioId,

    order: SCENARIO_ORDER_BY_ID[scenarioId],

    curriculumModuleSlug: CURRICULUM_MODULE_SLUG_BY_SCENARIO_ID[scenarioId],

    sourcePartner: SCENARIO_PARTNER_BY_ID[scenarioId],

    version: 1,
    estimatedDurationMinutes: 15,

    assets: {
      preStartBackground: "/scenarios/scenario-01/pre-start.png",

      inProgressBackground: "/scenarios/scenario-01/in-progress.png",
    },

    pathwayPosition: {
      x: 15,
      y: 25,
      labelSide: "bottom",
    },

    challenges: {
      [challenge01Id]: {
        id: challenge01Id,
        order: 1,

        hotspot: {
          x: 20,
          y: 55,
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
          y: 45,
          labelSide: "bottom",
        },

        choices: {
          [challenge02Choice01Id]: {
            id: challenge02Choice01Id,
            order: 1,
            isOptimal: true,
          },

          [challenge02Choice02Id]: {
            id: challenge02Choice02Id,
            order: 2,
            isOptimal: false,
          },

          [challenge02Choice03Id]: {
            id: challenge02Choice03Id,
            order: 3,
            isOptimal: false,
          },
        },
      },

      [challenge03Id]: {
        id: challenge03Id,
        order: 3,

        hotspot: {
          x: 80,
          y: 55,
          labelSide: "bottom",
        },

        choices: {
          [challenge03Choice01Id]: {
            id: challenge03Choice01Id,
            order: 1,
            isOptimal: false,
          },

          [challenge03Choice02Id]: {
            id: challenge03Choice02Id,
            order: 2,
            isOptimal: false,
          },

          [challenge03Choice03Id]: {
            id: challenge03Choice03Id,
            order: 3,
            isOptimal: true,
          },
        },
      },
    },
  },

  locales: {
    en: {
      scenarioId,
      locale: "en",

      title: "Foundations of ESG and Sustainable Development",

      shortTitle: "Foundations of ESG",

      introduction: "This is a valid scenario introduction.",

      organisation: "GreenTech Solutions",

      role: "Manager responsible for supplier readiness",

      objectives: [
        "Understand the three ESG pillars.",
        "Distinguish ESG from traditional CSR.",
        "Connect organisational actions to the SDGs.",
      ],

      boardAlt: "An organisation preparing its ESG approach across three connected work areas.",

      challenges: {
        [challenge01Id]: {
          title: "The three ESG pillars",
          shortTitle: "ESG pillars",

          context:
            "The organisation needs to classify its activities across the environmental, social and governance pillars.",

          question: "Which approach should the organisation take?",

          choices: {
            [challenge01Choice01Id]: createChoiceContent(1),

            [challenge01Choice02Id]: createChoiceContent(2),

            [challenge01Choice03Id]: createChoiceContent(3),
          },
        },

        [challenge02Id]: {
          title: "ESG and CSR",
          shortTitle: "ESG vs CSR",

          context:
            "The organisation needs to explain how ESG differs from a traditional CSR approach.",

          question: "Which explanation should be presented?",

          choices: {
            [challenge02Choice01Id]: createChoiceContent(1),

            [challenge02Choice02Id]: createChoiceContent(2),

            [challenge02Choice03Id]: createChoiceContent(3),
          },
        },

        [challenge03Id]: {
          title: "Mapping actions to the SDGs",
          shortTitle: "SDG mapping",

          context:
            "The organisation needs to connect its ESG activities with relevant Sustainable Development Goals.",

          question: "Which mapping approach should be selected?",

          choices: {
            [challenge03Choice01Id]: createChoiceContent(1),

            [challenge03Choice02Id]: createChoiceContent(2),

            [challenge03Choice03Id]: createChoiceContent(3),
          },
        },
      },

      summary: {
        title: "Scenario completed",

        body: "You have completed the foundations scenario.",

        takeaways: [
          "ESG covers environmental, social and governance considerations.",
          "ESG should be integrated into business strategy.",
          "The SDGs provide a broader sustainability reference.",
        ],
      },
    },
  },
} satisfies ScenarioData<"scenario-01">;
