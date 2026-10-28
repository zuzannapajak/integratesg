import { defineScenarioData, type ScenarioData } from "@/lib/scenarios/simulator/format";
import { parseScenarioData } from "@/lib/scenarios/simulator/schema";

import { scenario01Definition, scenario01Ids } from "./definition";
import { scenario01En } from "./locales/en";
import { scenario01It } from "./locales/it";
import { scenario01Bg } from "./locales/bg";
import { scenario01El } from "./locales/el";
import { scenario01De } from "./locales/de";
import { scenario01Pl } from "./locales/pl";

const sourceScenario01Data: ScenarioData<"scenario-01"> = defineScenarioData<"scenario-01">({
  definition: scenario01Definition,

  locales: {
    it: {
      ...scenario01It,
      locale: "it" as const,
    },
    en: {
      ...scenario01En,
      locale: "en" as const,
    },
    pl: {
      ...scenario01Pl,
      locale: "pl" as const,
    },
    de: {
      ...scenario01De,
      locale: "de" as const,
    },
    el: {
      ...scenario01El,
      locale: "el" as const,
    },
    bg: {
      ...scenario01Bg,
      locale: "bg" as const,
    },
  },
});

export const scenario01Data: ScenarioData<"scenario-01"> = parseScenarioData(
  "scenario-01",
  sourceScenario01Data,
);

export { scenario01Definition, scenario01En, scenario01Ids };
