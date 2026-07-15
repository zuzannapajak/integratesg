"use server";

import { requireAuthenticatedUserId } from "@/lib/auth/require-authenticated-user-id";
import { assertScenarioCanStartForUser } from "@/lib/scenarios/simulator/server/scenario-pathway";
import {
  completeScenarioChallengeProgress,
  completeScenarioProgress,
  getScenarioRuntimeState,
  recordScenarioChoiceProgress,
  startScenarioProgress,
} from "@/lib/scenarios/simulator/server/scenario-progress";
import type {
  ChallengeId,
  ChoiceId,
  ScenarioId,
  ScenarioPlayerMode,
} from "@/lib/scenarios/simulator/types";

type ScenarioActionIdentity = {
  readonly scenarioId: ScenarioId;
  readonly scenarioVersion: number;
  readonly locale: string;
};

type GetScenarioRuntimeStateActionInput = ScenarioActionIdentity & {
  readonly mode: ScenarioPlayerMode;
};

type RecordScenarioChoiceActionInput = ScenarioActionIdentity & {
  readonly challengeId: ChallengeId;
  readonly choiceId: ChoiceId;
  readonly attemptNumber: number;
};

type CompleteScenarioChallengeActionInput = ScenarioActionIdentity & {
  readonly challengeId: ChallengeId;
};

export async function getScenarioRuntimeStateAction(input: GetScenarioRuntimeStateActionInput) {
  const userId = await requireAuthenticatedUserId();

  return getScenarioRuntimeState({
    userId,
    scenarioId: input.scenarioId,
    scenarioVersion: input.scenarioVersion,
    locale: input.locale,
    mode: input.mode,
  });
}

export async function startScenarioAction(input: ScenarioActionIdentity) {
  const userId = await requireAuthenticatedUserId();

  await assertScenarioCanStartForUser(userId, input.scenarioId);

  return startScenarioProgress({
    userId,
    scenarioId: input.scenarioId,
    scenarioVersion: input.scenarioVersion,
    locale: input.locale,
  });
}

export async function recordScenarioChoiceAction(input: RecordScenarioChoiceActionInput) {
  const userId = await requireAuthenticatedUserId();

  return recordScenarioChoiceProgress({
    userId,
    scenarioId: input.scenarioId,
    scenarioVersion: input.scenarioVersion,
    locale: input.locale,
    challengeId: input.challengeId,
    choiceId: input.choiceId,
    attemptNumber: input.attemptNumber,
  });
}

export async function completeScenarioChallengeAction(input: CompleteScenarioChallengeActionInput) {
  const userId = await requireAuthenticatedUserId();

  return completeScenarioChallengeProgress({
    userId,
    scenarioId: input.scenarioId,
    scenarioVersion: input.scenarioVersion,
    locale: input.locale,
    challengeId: input.challengeId,
  });
}

export async function completeScenarioAction(input: ScenarioActionIdentity) {
  const userId = await requireAuthenticatedUserId();

  return completeScenarioProgress({
    userId,
    scenarioId: input.scenarioId,
    scenarioVersion: input.scenarioVersion,
    locale: input.locale,
  });
}
