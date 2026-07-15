import { notFound, redirect } from "next/navigation";

import { requireAuthenticatedUserId } from "@/lib/auth/require-authenticated-user-id";
import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";
import { getScenarioPathwayItemForUser } from "@/lib/scenarios/simulator/server/scenario-pathway";
import { getScenarioRuntimeState } from "@/lib/scenarios/simulator/server/scenario-progress";
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
  const [{ locale, slug }, resolvedSearchParams, userId] = await Promise.all([
    params,
    searchParams,
    requireAuthenticatedUserId(),
  ]);

  const mode: ScenarioPlayerMode =
    getSearchParam(resolvedSearchParams.mode) === "review" ? "review" : "play";

  const scenario = resolveScenarioBySlug(slug, locale);

  if (!scenario) {
    notFound();
  }

  const pathwayItem = await getScenarioPathwayItemForUser(userId, scenario.id);

  const cannotOpenPlayMode = !pathwayItem || pathwayItem.status === "locked";
  const cannotOpenReviewMode = mode === "review" && pathwayItem?.status !== "completed";

  if (cannotOpenPlayMode || cannotOpenReviewMode) {
    redirect(`/${locale}/scenarios`);
  }

  const runtimeState = await getScenarioRuntimeState({
    userId,
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
