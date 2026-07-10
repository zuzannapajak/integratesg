"use client";

import { useRouter } from "next/navigation";

import { ScenarioPlayer } from "@/components/scenarios/simulator/scenario-player";
import type { ResolvedScenario, ScenarioPlayerMode } from "@/lib/scenarios/simulator/types";

export type ScenarioPlayClientProps = {
  readonly locale: string;
  readonly scenario: ResolvedScenario;
  readonly mode: ScenarioPlayerMode;
};

export function ScenarioPlayClient({ locale, scenario, mode }: ScenarioPlayClientProps) {
  const router = useRouter();

  return (
    <ScenarioPlayer
      scenario={scenario}
      mode={mode}
      onExit={() => {
        router.push(`/${locale}/scenarios`);
      }}
    />
  );
}
