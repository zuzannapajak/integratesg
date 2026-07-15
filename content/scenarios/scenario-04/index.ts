import { defineScenarioData, type ScenarioData } from "@/lib/scenarios/simulator/format";
import { parseScenarioData } from "@/lib/scenarios/simulator/schema";

import { scenario04Definition, scenario04Ids } from "./definition";
import { scenario04En } from "./locales/en";

const sourceScenario04Data: ScenarioData<"scenario-04"> = defineScenarioData<"scenario-04">({
  definition: scenario04Definition,

  locales: {
    en: {
      ...scenario04En,
      locale: "en" as const,
    },
  },
});

export const scenario04Data: ScenarioData<"scenario-04"> = parseScenarioData(
  "scenario-04",
  sourceScenario04Data,
);

export { scenario04Definition, scenario04En, scenario04Ids };
