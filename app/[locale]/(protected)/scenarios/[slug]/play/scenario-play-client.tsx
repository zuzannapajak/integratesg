"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ScenarioAsyncOverlay } from "@/components/scenarios/simulator/scenario-async-overlay";
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
  const t = useTranslations("Protected.ScenarioSimulator");

  const [savingMessage, setSavingMessage] = useState<string | null>(null);

  async function runProgressAction<T>(
    pendingMessage: string,
    errorMessage: string,
    action: () => Promise<T>,
  ): Promise<T> {
    setSavingMessage(pendingMessage);

    try {
      return await action();
    } catch {
      throw new Error(errorMessage);
    } finally {
      setSavingMessage(null);
    }
  }

  return (
    <div className="relative" aria-busy={savingMessage !== null}>
      <ScenarioPlayer
        scenario={scenario}
        mode={mode}
        initialView={runtimeState.initialView}
        initialChallengeId={runtimeState.initialChallengeId}
        initialChallengeStep={runtimeState.initialChallengeStep}
        initialSelectedChoiceId={runtimeState.initialSelectedChoiceId}
        initialCompletedChallengeIds={runtimeState.initialCompletedChallengeIds}
        initialAttemptCounts={runtimeState.initialAttemptCounts}
        initialRejectedChoiceIdsByChallenge={runtimeState.initialRejectedChoiceIdsByChallenge}
        labels={{
          scenario: t("common.scenario"),
          challenge: t("common.challenge"),
          of: t("common.of"),
          back: t("common.back"),
          continue: t("common.continue"),
          loading: t("common.loading"),
          starting: t("intro.starting"),
          progress: t("common.progress"),
          completed: t("common.completed"),

          introduction: t("intro.introduction"),
          scenarioContext: t("intro.context"),
          organisation: t("intro.organisation"),
          yourRole: t("intro.yourRole"),
          yourObjectives: t("intro.yourObjectives"),
          estimatedDuration: t("intro.estimatedDuration"),
          minutes: t("intro.minutes"),
          challenges: t("intro.challenges"),
          scenarioInformation: t("intro.scenarioInformation"),
          startScenario: t("intro.startScenario"),
          backToScenarios: t("intro.backToScenarios"),
          leaveScenario: t("completion.leaveScenario"),

          viewChallenges: t("board.title"),
          boardDescription: t("board.description"),
          boardAllCompleted: t("board.allCompleted"),
          currentObjective: t("board.currentObjective"),
          allChallengesCompleted: t("summary.allChallengesCompleted"),
          openChallenge: t("board.openChallenge"),
          mapPoint: t("board.mapPoint"),
          available: t("board.available"),
          inProgress: t("board.inProgress"),
          locked: t("board.locked"),

          challengeContext: t("challenge.context"),
          decision: t("challenge.decision"),
          attempt: t("challenge.attempt"),
          previouslyTried: t("challenge.previouslyTried"),
          backToBoard: t("challenge.backToBoard"),
          continueToDecision: t("challenge.continueToDecision"),
          selectOneOption: t("challenge.selectOneOption"),
          confirmDecision: t("challenge.confirmDecision"),

          correctDecision: t("feedback.correctDecision"),
          incorrectDecision: t("feedback.incorrectDecision"),
          yourDecision: t("feedback.yourDecision"),
          whyItFallsShort: t("feedback.whyItFallsShort"),
          expectedImpact: t("feedback.expectedImpact"),
          likelyConsequence: t("feedback.likelyConsequence"),
          keyTakeaway: t("feedback.keyTakeaway"),
          tryAgain: t("feedback.tryAgain"),

          summary: t("summary.title"),
          completedChallenges: t("summary.completedChallenges"),
          keyTakeaways: t("summary.keyTakeaways"),
          completeScenario: t("summary.completeScenario"),

          scenarioCompleted: t("completion.title"),
          scenarioCompletedDescription: t("completion.description"),
          unexpectedError: t("errors.unexpected"),
        }}
        onScenarioStarted={async (event) => {
          await runProgressAction(t("saving.start"), t("errors.progress.start"), () =>
            startScenarioAction(event),
          );
        }}
        onChoiceConfirmed={async (event) => {
          await runProgressAction(t("saving.choice"), t("errors.progress.choice"), () =>
            recordScenarioChoiceAction({
              scenarioId: event.scenarioId,
              scenarioVersion: event.scenarioVersion,
              locale: scenario.locale,
              challengeId: event.challengeId,
              choiceId: event.choiceId,
              attemptNumber: event.attemptNumber,
            }),
          );
        }}
        onChallengeCompleted={async (event) => {
          await runProgressAction(t("saving.challenge"), t("errors.progress.challenge"), () =>
            completeScenarioChallengeAction({
              ...event,
              locale: scenario.locale,
            }),
          );
        }}
        onScenarioCompleted={async (event) => {
          await runProgressAction(t("saving.scenario"), t("errors.progress.scenario"), () =>
            completeScenarioAction({
              ...event,
              locale: scenario.locale,
            }),
          );

          router.refresh();
        }}
        onExit={() => {
          router.push(`/${locale}/scenarios`);
          router.refresh();
        }}
      />

      <ScenarioAsyncOverlay
        visible={savingMessage !== null}
        message={savingMessage ?? t("saving.default")}
      />
    </div>
  );
}
