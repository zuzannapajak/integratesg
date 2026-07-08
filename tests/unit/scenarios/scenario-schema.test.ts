import {
  formatScenarioValidationError,
  parseScenarioData,
  safeParseScenarioData,
} from "@/lib/scenarios/simulator/schema";
import { describe, expect, it } from "vitest";

import { scenario01FixtureIds, validScenario01Data } from "./fixtures/scenario-01-data.fixture";

describe("scenario data schema", () => {
  it("accepts a complete valid scenario", () => {
    const result = safeParseScenarioData("scenario-01", validScenario01Data);

    expect(result.success).toBe(true);
  });

  it("rejects unknown properties", () => {
    const invalidData = {
      ...validScenario01Data,

      definition: {
        ...validScenario01Data.definition,
        unexpectedProperty: true,
      },
    };

    const result = safeParseScenarioData("scenario-01", invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(formatScenarioValidationError(result.error)).toContain("unexpectedProperty");
    }
  });

  it("rejects hotspot coordinates outside 0-100", () => {
    const invalidData = {
      ...validScenario01Data,

      definition: {
        ...validScenario01Data.definition,

        pathwayPosition: {
          ...validScenario01Data.definition.pathwayPosition,

          x: 101,
        },
      },
    };

    const result = safeParseScenarioData("scenario-01", invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      const message = formatScenarioValidationError(result.error);

      expect(message).toContain("Hotspot x must not exceed 100");
    }
  });

  it("requires exactly one optimal choice per challenge", () => {
    const { challenge01Id, challenge01Choice01Id, challenge01Choice02Id } = scenario01FixtureIds;

    const originalChallenge = validScenario01Data.definition.challenges[challenge01Id];

    const invalidData = {
      ...validScenario01Data,

      definition: {
        ...validScenario01Data.definition,

        challenges: {
          ...validScenario01Data.definition.challenges,

          [challenge01Id]: {
            ...originalChallenge,

            choices: {
              ...originalChallenge.choices,

              [challenge01Choice01Id]: {
                ...originalChallenge.choices[challenge01Choice01Id],

                isOptimal: true,
              },

              [challenge01Choice02Id]: {
                ...originalChallenge.choices[challenge01Choice02Id],

                isOptimal: true,
              },
            },
          },
        },
      },
    };

    const result = safeParseScenarioData("scenario-01", invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(formatScenarioValidationError(result.error)).toContain(
        "must contain exactly one optimal choice",
      );
    }
  });

  it("requires the locale value to match its locale key", () => {
    const invalidData = {
      ...validScenario01Data,

      locales: {
        ...validScenario01Data.locales,

        pl: {
          ...validScenario01Data.locales.en,
          locale: "de",
        },
      },
    };

    const result = safeParseScenarioData("scenario-01", invalidData);

    expect(result.success).toBe(false);
  });

  it("rejects empty decision feedback", () => {
    const { challenge01Id, challenge01Choice01Id } = scenario01FixtureIds;

    const originalChallenge = validScenario01Data.locales.en.challenges[challenge01Id];

    const originalChoice = originalChallenge.choices[challenge01Choice01Id];

    const invalidData = {
      ...validScenario01Data,

      locales: {
        ...validScenario01Data.locales,

        en: {
          ...validScenario01Data.locales.en,

          challenges: {
            ...validScenario01Data.locales.en.challenges,

            [challenge01Id]: {
              ...originalChallenge,

              choices: {
                ...originalChallenge.choices,

                [challenge01Choice01Id]: {
                  ...originalChoice,

                  feedback: {
                    ...originalChoice.feedback,
                    body: "   ",
                  },
                },
              },
            },
          },
        },
      },
    };

    const result = safeParseScenarioData("scenario-01", invalidData);

    expect(result.success).toBe(false);
  });

  it("rejects a scenario using the wrong fixed order", () => {
    const invalidData = {
      ...validScenario01Data,

      definition: {
        ...validScenario01Data.definition,
        order: 2,
      },
    };

    const result = safeParseScenarioData("scenario-01", invalidData);

    expect(result.success).toBe(false);
  });

  it("throws a readable error when parsing invalid data", () => {
    const invalidData = {
      ...validScenario01Data,

      definition: {
        ...validScenario01Data.definition,

        assets: {
          boardImage: "https://example.com/board.webp",
        },
      },
    };

    expect(() => {
      parseScenarioData("scenario-01", invalidData);
    }).toThrow("Invalid scenario data for scenario-01");
  });
});
