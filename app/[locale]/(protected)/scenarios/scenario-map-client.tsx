"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { ScenarioPathwayMap } from "@/components/scenarios/pathway/scenario-pathway-map";
import type { ScenarioPathwayItem } from "@/components/scenarios/pathway/scenario-pathway-types";
import { scenarioPathwayAssets } from "@/content/scenarios";

export type ScenarioMapClientProps = {
  readonly locale: string;
  readonly items: readonly ScenarioPathwayItem[];
  readonly preview?: boolean;
};

export function ScenarioMapClient({ locale, items, preview = false }: ScenarioMapClientProps) {
  const router = useRouter();
  const t = useTranslations("Protected.ScenarioPathway");

  return (
    <ScenarioPathwayMap
      backgroundImage={scenarioPathwayAssets.backgroundImage}
      backgroundAlt={t("backgroundAlt")}
      items={items}
      labels={{
        title: t("title"),
        subtitle: t("subtitle"),
        progress: t("progress"),
        completed: t("completed"),
        available: t("available"),
        inProgress: t("inProgress"),
        locked: t("locked"),
        openScenario: t("openScenario"),
        reviewScenario: t("reviewScenario"),
      }}
      onOpenScenario={(scenario, mode) => {
        const baseUrl = preview
          ? `/${locale}/scenario-preview/${scenario.slug}`
          : `/${locale}/scenarios/${scenario.slug}/play`;

        router.push(mode === "review" ? `${baseUrl}?mode=review` : baseUrl);
      }}
    />
  );
}
