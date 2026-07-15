import { defineScenarioData, type ScenarioData } from "@/lib/scenarios/simulator/format";
import { parseScenarioData } from "@/lib/scenarios/simulator/schema";

import { scenario01Definition, scenario01Ids } from "./definition";
import { scenario01En } from "./locales/en";

const sourceScenario01Data: ScenarioData<"scenario-01"> = defineScenarioData<"scenario-01">({
  definition: scenario01Definition,

  locales: {
    en: {
      ...scenario01En,
      locale: "en" as const,
    },
  },
});

export const scenario01Data: ScenarioData<"scenario-01"> = parseScenarioData(
  "scenario-01",
  sourceScenario01Data,
);

export { scenario01Definition, scenario01En, scenario01Ids };
