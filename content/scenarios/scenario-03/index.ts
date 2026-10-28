import { defineScenarioData, type ScenarioData } from "@/lib/scenarios/simulator/format";
import { parseScenarioData } from "@/lib/scenarios/simulator/schema";

import { scenario03Definition, scenario03Ids } from "./definition";
import { scenario03En } from "./locales/en";
import { scenario03It } from "./locales/it";
import { scenario03Bg } from "./locales/bg";
import { scenario03El } from "./locales/el";
import { scenario03De } from "./locales/de";
import { scenario03Pl } from "./locales/pl";

const sourceScenario03Data: ScenarioData<"scenario-03"> = defineScenarioData<"scenario-03">({
  definition: scenario03Definition,

  locales: {
    it: {
      ...scenario03It,
      locale: "it" as const,
    },
    en: {
      ...scenario03En,
      locale: "en" as const,
    },
    pl: {
      ...scenario03Pl,
      locale: "pl" as const,
    },
    de: {
      ...scenario03De,
      locale: "de" as const,
    },
    el: {
      ...scenario03El,
      locale: "el" as const,
    },
    bg: {
      ...scenario03Bg,
      locale: "bg" as const,
    },
  },
});

export const scenario03Data: ScenarioData<"scenario-03"> = parseScenarioData(
  "scenario-03",
  sourceScenario03Data,
);

export { scenario03Definition, scenario03En, scenario03Ids };
