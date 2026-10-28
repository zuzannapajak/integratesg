import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";
import { SCENARIO_IDS } from "@/lib/scenarios/simulator/types";
import { describe, expect, it } from "vitest";

const availableLocales = ["pl", "de", "el", "bg", "it"] as const;

describe("updated WP4 scenario translations", () => {
  it.each(SCENARIO_IDS)("has complete supported translations for %s", (scenarioId) => {
    for (const locale of availableLocales) {
      const scenario = resolveScenarioBySlug(scenarioId, locale);

      expect(scenario, `${scenarioId}/${locale} is missing`).not.toBeNull();
      expect(scenario?.locale).toBe(locale);
      expect(scenario?.introduction.trim().length).toBeGreaterThan(20);
      expect(scenario?.objectives).toHaveLength(2);
      expect(scenario?.challenges).toHaveLength(3);

      for (const challenge of scenario?.challenges ?? []) {
        expect(challenge.title.trim().length).toBeGreaterThan(0);
        expect(challenge.context.trim().length).toBeGreaterThan(0);
        expect(challenge.choices).toHaveLength(3);
        expect(challenge.choices.filter((choice) => choice.isOptimal)).toHaveLength(1);

        for (const choice of challenge.choices) {
          expect(choice.text.trim().length).toBeGreaterThan(0);
          expect(choice.feedback.body.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });
});
