import { defineScenarioData, type ScenarioData } from "@/lib/scenarios/simulator/format";
import { parseScenarioData } from "@/lib/scenarios/simulator/schema";

import { scenario02Definition, scenario02Ids } from "./definition";
import { scenario02En } from "./locales/en";

/**
 * Scenario 2 source data before runtime validation.
 *
 * The explicit type prevents the result of the Zod parser
 * from being exposed as an unresolved or error type.
 */
const sourceScenario02Data: ScenarioData<"scenario-02"> = defineScenarioData<"scenario-02">({
  definition: scenario02Definition,

  locales: {
    en: {
      ...scenario02En,
      locale: "en" as const,
    },
  },
});

/**
 * Validated Scenario 2 data exposed to the registry,
 * tests and scenario player.
 *
 * Validation is executed immediately when this module
 * is imported.
 */
export const scenario02Data: ScenarioData<"scenario-02"> = parseScenarioData(
  "scenario-02",
  sourceScenario02Data,
);

export { scenario02Definition, scenario02En, scenario02Ids };
