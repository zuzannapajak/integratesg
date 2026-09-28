import { describe, expect, it, vi } from "vitest";

vi.mock("@/content/scenarios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/scenarios")>();
  const english = actual.scenario01Data.locales.en;

  const [firstChallengeId, firstChallenge] = Object.entries(english.challenges)[0];

  const polish = {
    ...english,
    locale: "pl" as const,
    title: "Polski tytuł scenariusza",
    challenges: {
      ...english.challenges,
      [firstChallengeId]: {
        ...firstChallenge,
        question: "Polskie pytanie scenariusza",
      },
    },
  };

  return {
    ...actual,
    scenario01Data: {
      ...actual.scenario01Data,
      locales: {
        ...actual.scenario01Data.locales,
        pl: polish,
      },
    },
  };
});

import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";

describe("scenario locale selection", () => {
  it("uses the requested scenario translation when that locale exists", () => {
    const scenario = resolveScenarioBySlug("scenario-01", "pl");

    expect(scenario).not.toBeNull();
    expect(scenario?.locale).toBe("pl");
    expect(scenario?.title).toBe("Polski tytuł scenariusza");
    expect(scenario?.challenges[0]?.question).toBe("Polskie pytanie scenariusza");
  });

  it("falls back to English when the requested scenario translation is unavailable", () => {
    const english = resolveScenarioBySlug("scenario-01", "en");
    const german = resolveScenarioBySlug("scenario-01", "de");

    expect(english).not.toBeNull();
    expect(german).not.toBeNull();
    expect(german?.locale).toBe("en");
    expect(german?.title).toBe(english?.title);
    expect(german?.challenges[0]?.question).toBe(english?.challenges[0]?.question);
  });
});
