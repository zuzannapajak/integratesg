import type { ChallengeId, ChoiceId, ScenarioPlayerView } from "@/lib/scenarios/simulator/types";

export type ScenarioRuntimeStatus = "not_started" | "incomplete" | "completed";

export type ScenarioAttemptCounts = Partial<Record<ChallengeId, number>>;

export type ScenarioRejectedChoices = Partial<Record<ChallengeId, readonly ChoiceId[]>>;

export type ScenarioRuntimeChallengeStep = "context" | "decision";

export type ScenarioRuntimeState = {
  readonly attemptId: string | null;
  readonly attemptNumber: number | null;
  readonly status: ScenarioRuntimeStatus;

  readonly initialView: ScenarioPlayerView;
  readonly initialChallengeId: ChallengeId | null;
  readonly initialChallengeStep: ScenarioRuntimeChallengeStep;
  readonly initialSelectedChoiceId: ChoiceId | null;

  readonly initialCompletedChallengeIds: readonly ChallengeId[];

  readonly initialAttemptCounts: ScenarioAttemptCounts;

  readonly initialRejectedChoiceIdsByChallenge: ScenarioRejectedChoices;
};
