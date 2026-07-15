import { defineScenarioData, type ScenarioData } from "@/lib/scenarios/simulator/format";
import { parseScenarioData } from "@/lib/scenarios/simulator/schema";

import { scenario06Definition, scenario06Ids } from "./definition";
import { scenario06En } from "./locales/en";

const sourceScenario06Data: ScenarioData<"scenario-06"> = defineScenarioData<"scenario-06">({
  definition: scenario06Definition,

  locales: {
    en: {
      ...scenario06En,
      locale: "en" as const,
    },
  },
});

export const scenario06Data: ScenarioData<"scenario-06"> = parseScenarioData(
  "scenario-06",
  sourceScenario06Data,
);

export { scenario06Definition, scenario06En, scenario06Ids };
