"use client";

import { useRouter } from "next/navigation";

import { ScenarioPathwayMap } from "@/components/scenarios/pathway/scenario-pathway-map";
import { scenarioPathwayAssets } from "@/content/scenarios";
import { scenarioPathwayItems } from "@/content/scenarios/pathway";

export type ScenarioMapClientProps = {
  readonly locale: string;
  readonly preview?: boolean;
};

export function ScenarioMapClient({ locale, preview = false }: ScenarioMapClientProps) {
  const router = useRouter();

  return (
    <ScenarioPathwayMap
      backgroundImage={scenarioPathwayAssets.backgroundImage}
      backgroundAlt="An illustrated ESG learning pathway connecting six organisational scenarios."
      items={scenarioPathwayItems}
      onOpenScenario={(scenario, mode) => {
        const baseUrl = preview
          ? `/${locale}/scenario-preview/${scenario.slug}`
          : `/${locale}/scenarios/${scenario.slug}/play`;

        router.push(mode === "review" ? `${baseUrl}?mode=review` : baseUrl);
      }}
    />
  );
}
