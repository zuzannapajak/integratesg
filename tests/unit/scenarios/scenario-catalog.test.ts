import {
  scenario01Data,
  scenario02Data,
  scenario03Data,
  scenario04Data,
  scenario05Data,
  scenario06Data,
} from "@/content/scenarios";
import { scenarioPathwayItems } from "@/content/scenarios/pathway";
import type { ScenarioData } from "@/lib/scenarios/simulator/format";
import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";
import { safeParseScenarioData } from "@/lib/scenarios/simulator/schema";
import {
  formatScenarioTranslationCompletenessReport,
  validateScenarioTranslationCompleteness,
} from "@/lib/scenarios/simulator/translation-completeness";
import { SCENARIO_IDS, type ScenarioId } from "@/lib/scenarios/simulator/types";
import { describe, expect, it } from "vitest";

const scenarioDataById = {
  "scenario-01": scenario01Data,
  "scenario-02": scenario02Data,
  "scenario-03": scenario03Data,
  "scenario-04": scenario04Data,
  "scenario-05": scenario05Data,
  "scenario-06": scenario06Data,
} as const;

function getScenarioData(scenarioId: ScenarioId): ScenarioData {
  return scenarioDataById[scenarioId] as ScenarioData;
}

describe("complete scenario catalog", () => {
  it("registers source data for all six fixed scenarios", () => {
    expect(Object.keys(scenarioDataById)).toEqual(SCENARIO_IDS);
  });

  it.each(SCENARIO_IDS)("validates %s against its runtime schema", (scenarioId) => {
    const result = safeParseScenarioData(scenarioId, getScenarioData(scenarioId));

    expect(result.success).toBe(true);
  });

  it.each(SCENARIO_IDS)("contains complete English content for %s", (scenarioId) => {
    const data = getScenarioData(scenarioId);
    const report = validateScenarioTranslationCompleteness(data.definition, "en", data.locales.en);

    expect(report.isComplete, formatScenarioTranslationCompletenessReport(report)).toBe(true);
    expect(report.counts).toEqual({
      questions: {
        required: 3,
        missing: 0,
      },
      answers: {
        required: 9,
        missing: 0,
      },
      feedbacks: {
        required: 9,
        missing: 0,
      },
    });
  });

  it.each(SCENARIO_IDS)("resolves %s into three ordered challenges", (scenarioId) => {
    const scenario = resolveScenarioBySlug(scenarioId, "en");

    expect(scenario).not.toBeNull();
    expect(scenario?.id).toBe(scenarioId);
    expect(scenario?.challenges).toHaveLength(3);
    expect(scenario?.challenges.map((challenge) => challenge.order)).toEqual([1, 2, 3]);

    for (const challenge of scenario?.challenges ?? []) {
      expect(challenge.choices).toHaveLength(3);
      expect(challenge.choices.map((choice) => choice.order)).toEqual([1, 2, 3]);
      expect(challenge.choices.filter((choice) => choice.isOptimal)).toHaveLength(1);
    }
  });

  it.each(SCENARIO_IDS)("uses the English fallback for %s", (scenarioId) => {
    const englishScenario = resolveScenarioBySlug(scenarioId, "en");
    const unsupportedLocaleScenario = resolveScenarioBySlug(scenarioId, "fr");

    expect(unsupportedLocaleScenario).toEqual(englishScenario);
  });

  it("keeps pathway labels aligned with the registered scenario content", () => {
    for (const pathwayItem of scenarioPathwayItems) {
      const scenario = resolveScenarioBySlug(pathwayItem.slug, "en");

      expect(scenario).not.toBeNull();
      expect(pathwayItem.title).toBe(scenario?.title);
      expect(pathwayItem.shortTitle).toBe(scenario?.shortTitle);
    }
  });

  it("returns null for an unknown scenario slug", () => {
    expect(resolveScenarioBySlug("scenario-99", "en")).toBeNull();
  });
});
