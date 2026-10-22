import { defineScenarioData, type ScenarioData } from "@/lib/scenarios/simulator/format";
import { parseScenarioData } from "@/lib/scenarios/simulator/schema";

import { scenario04Definition, scenario04Ids } from "./definition";
import { scenario04En } from "./locales/en";
import { scenario04Bg } from "./locales/bg";
import { scenario04El } from "./locales/el";
import { scenario04De } from "./locales/de";
import { scenario04Pl } from "./locales/pl";

const sourceScenario04Data: ScenarioData<"scenario-04"> = defineScenarioData<"scenario-04">({
  definition: scenario04Definition,

  locales: {
    en: {
      ...scenario04En,
      locale: "en" as const,
    },
    pl: {
      ...scenario04Pl,
      locale: "pl" as const,
    },
    de: {
      ...scenario04De,
      locale: "de" as const,
    },
    el: {
      ...scenario04El,
      locale: "el" as const,
    },
    bg: {
      ...scenario04Bg,
      locale: "bg" as const,
    },
  },
});

export const scenario04Data: ScenarioData<"scenario-04"> = parseScenarioData(
  "scenario-04",
  sourceScenario04Data,
);

export { scenario04Definition, scenario04En, scenario04Ids };
