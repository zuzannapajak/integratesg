import { defineScenarioData, type ScenarioData } from "@/lib/scenarios/simulator/format";
import { parseScenarioData } from "@/lib/scenarios/simulator/schema";

import { scenario03Definition, scenario03Ids } from "./definition";
import { scenario03En } from "./locales/en";

const sourceScenario03Data: ScenarioData<"scenario-03"> = defineScenarioData<"scenario-03">({
  definition: scenario03Definition,

  locales: {
    en: {
      ...scenario03En,
      locale: "en" as const,
    },
  },
});

export const scenario03Data: ScenarioData<"scenario-03"> = parseScenarioData(
  "scenario-03",
  sourceScenario03Data,
);

export { scenario03Definition, scenario03En, scenario03Ids };
