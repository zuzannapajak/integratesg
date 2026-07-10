"use client";

import { useRouter } from "next/navigation";

import { ScenarioPathwayMap } from "@/components/scenarios/pathway/scenario-pathway-map";
import { scenarioPathwayAssets, scenarioPathwayItems } from "@/content/scenarios/pathway";

export type ScenarioMapClientProps = {
  readonly locale: string;
};

export function ScenarioMapClient({ locale }: ScenarioMapClientProps) {
  const router = useRouter();

  return (
    <ScenarioPathwayMap
      backgroundImage={scenarioPathwayAssets.backgroundImage}
      backgroundAlt="An illustrated ESG learning pathway connecting six organisational scenarios."
      items={scenarioPathwayItems}
      onOpenScenario={(scenario, mode) => {
        const baseUrl = `/${locale}/scenarios/${scenario.slug}/play`;

        router.push(mode === "review" ? `${baseUrl}?mode=review` : baseUrl);
      }}
    />
  );
}
