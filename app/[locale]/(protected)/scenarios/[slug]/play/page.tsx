import { notFound } from "next/navigation";

import { ScenarioPlayClient } from "./scenario-play-client";

import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";
import type { ScenarioPlayerMode } from "@/lib/scenarios/simulator/types";

export type ScenarioPlayPageProps = {
  readonly params: Promise<{
    readonly locale: string;
    readonly slug: string;
  }>;

  readonly searchParams?: Promise<{
    readonly mode?: string | readonly string[];
  }>;
};

function getSearchParam(value: string | readonly string[] | undefined): string | undefined {
  return typeof value === "string" ? value : value?.[0];
}

function resolveMode(value: string | readonly string[] | undefined): ScenarioPlayerMode {
  return getSearchParam(value) === "review" ? "review" : "play";
}

export default async function ScenarioPlayPage({ params, searchParams }: ScenarioPlayPageProps) {
  const { locale, slug } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  const scenario = resolveScenarioBySlug(slug, locale);

  if (!scenario) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f3f6f9] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-375">
        <ScenarioPlayClient
          locale={locale}
          scenario={scenario}
          mode={resolveMode(resolvedSearchParams.mode)}
        />
      </div>
    </main>
  );
}
