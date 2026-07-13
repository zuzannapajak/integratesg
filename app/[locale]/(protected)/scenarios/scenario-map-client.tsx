"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("Protected.ScenarioPathway");

  return (
    <ScenarioPathwayMap
      backgroundImage={scenarioPathwayAssets.backgroundImage}
      backgroundAlt={t("backgroundAlt")}
      items={scenarioPathwayItems}
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
