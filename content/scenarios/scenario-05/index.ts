import { defineScenarioData, type ScenarioData } from "@/lib/scenarios/simulator/format";
import { parseScenarioData } from "@/lib/scenarios/simulator/schema";

import { scenario05Definition, scenario05Ids } from "./definition";
import { scenario05En } from "./locales/en";

const sourceScenario05Data: ScenarioData<"scenario-05"> = defineScenarioData<"scenario-05">({
  definition: scenario05Definition,

  locales: {
    en: {
      ...scenario05En,
      locale: "en" as const,
    },
  },
});

export const scenario05Data: ScenarioData<"scenario-05"> = parseScenarioData(
  "scenario-05",
  sourceScenario05Data,
);

export { scenario05Definition, scenario05En, scenario05Ids };
