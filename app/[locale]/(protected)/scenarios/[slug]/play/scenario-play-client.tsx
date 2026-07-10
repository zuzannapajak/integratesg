"use client";

import { useRouter } from "next/navigation";

import { ScenarioPlayer } from "@/components/scenarios/simulator/scenario-player";
import {
  completeScenarioAction,
  completeScenarioChallengeAction,
  recordScenarioChoiceAction,
  startScenarioAction,
} from "@/features/scenarios/actions";
import type { ScenarioRuntimeState } from "@/lib/scenarios/simulator/runtime-state";
import type { ResolvedScenario, ScenarioPlayerMode } from "@/lib/scenarios/simulator/types";

export type ScenarioPlayClientProps = {
  readonly locale: string;

  readonly scenario: ResolvedScenario;

  readonly mode: ScenarioPlayerMode;

  readonly runtimeState: ScenarioRuntimeState;
};

export function ScenarioPlayClient({
  locale,
  scenario,
  mode,
  runtimeState,
}: ScenarioPlayClientProps) {
  const router = useRouter();

  return (
    <ScenarioPlayer
      scenario={scenario}
      mode={mode}
      initialView={runtimeState.initialView}
      initialChallengeId={runtimeState.initialChallengeId}
      initialCompletedChallengeIds={runtimeState.initialCompletedChallengeIds}
      initialAttemptCounts={runtimeState.initialAttemptCounts}
      initialRejectedChoiceIdsByChallenge={runtimeState.initialRejectedChoiceIdsByChallenge}
      onScenarioStarted={async (event) => {
        await startScenarioAction(event);
      }}
      onChoiceConfirmed={async (event) => {
        await recordScenarioChoiceAction({
          scenarioId: event.scenarioId,

          scenarioVersion: event.scenarioVersion,

          locale: scenario.locale,

          challengeId: event.challengeId,

          choiceId: event.choiceId,

          attemptNumber: event.attemptNumber,
        });
      }}
      onChallengeCompleted={async (event) => {
        await completeScenarioChallengeAction({
          ...event,
          locale: scenario.locale,
        });
      }}
      onScenarioCompleted={async (event) => {
        await completeScenarioAction({
          ...event,
          locale: scenario.locale,
        });

        router.refresh();
      }}
      onExit={() => {
        router.push(`/${locale}/scenarios`);

        router.refresh();
      }}
    />
  );
}
