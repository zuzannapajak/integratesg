import { notFound } from "next/navigation";

import { getScenarioRuntimeStateAction } from "@/features/scenarios/actions";
import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";
import type { ScenarioPlayerMode } from "@/lib/scenarios/simulator/types";
import { ScenarioPlayClient } from "./scenario-play-client";

export type ScenarioPlayPageProps = {
  readonly params: Promise<{
    readonly locale: string;
    readonly slug: string;
  }>;

  readonly searchParams: Promise<{
    readonly mode?: string | readonly string[];
  }>;
};

function getSearchParam(value: string | readonly string[] | undefined): string | undefined {
  return typeof value === "string" ? value : value?.[0];
}

export default async function ScenarioPlayPage({ params, searchParams }: ScenarioPlayPageProps) {
  const { locale, slug } = await params;
  const resolvedSearchParams = await searchParams;

  const mode: ScenarioPlayerMode =
    getSearchParam(resolvedSearchParams.mode) === "review" ? "review" : "play";

  const scenario = resolveScenarioBySlug(slug, locale);

  if (!scenario) {
    notFound();
  }

  const runtimeState = await getScenarioRuntimeStateAction({
    scenarioId: scenario.id,
    scenarioVersion: scenario.version,
    locale: scenario.locale,
    mode,
  });

  return (
    <ScenarioPlayClient
      locale={locale}
      scenario={scenario}
      mode={mode}
      runtimeState={runtimeState}
    />
  );
}
