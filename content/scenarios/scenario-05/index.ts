import { defineScenarioData, type ScenarioData } from "@/lib/scenarios/simulator/format";
import { parseScenarioData } from "@/lib/scenarios/simulator/schema";

import { scenario05Definition, scenario05Ids } from "./definition";
import { scenario05En } from "./locales/en";
import { scenario05Bg } from "./locales/bg";
import { scenario05El } from "./locales/el";
import { scenario05De } from "./locales/de";
import { scenario05Pl } from "./locales/pl";

const sourceScenario05Data: ScenarioData<"scenario-05"> = defineScenarioData<"scenario-05">({
  definition: scenario05Definition,

  locales: {
    en: {
      ...scenario05En,
      locale: "en" as const,
    },
    pl: {
      ...scenario05Pl,
      locale: "pl" as const,
    },
    de: {
      ...scenario05De,
      locale: "de" as const,
    },
    el: {
      ...scenario05El,
      locale: "el" as const,
    },
    bg: {
      ...scenario05Bg,
      locale: "bg" as const,
    },
  },
});

export const scenario05Data: ScenarioData<"scenario-05"> = parseScenarioData(
  "scenario-05",
  sourceScenario05Data,
);

export { scenario05Definition, scenario05En, scenario05Ids };
