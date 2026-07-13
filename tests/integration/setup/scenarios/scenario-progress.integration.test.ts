import { randomUUID } from "node:crypto";

import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";
import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";
import {
  completeScenarioChallengeProgress,
  completeScenarioProgress,
  getScenarioRuntimeState,
  recordScenarioChoiceProgress,
  startScenarioProgress,
} from "@/lib/scenarios/simulator/server/scenario-progress";
import type {
  ResolvedChallenge,
  ResolvedChoice,
  ResolvedScenario,
} from "@/lib/scenarios/simulator/types";

function getScenarioFixture(): ResolvedScenario {
  const resolvedScenario = resolveScenarioBySlug("scenario-02", "en");

  if (!resolvedScenario) {
    throw new Error("Scenario 02 is unavailable for integration tests.");
  }

  return resolvedScenario;
}

const scenario = getScenarioFixture();

const testUserId = `scenario-integration-${randomUUID()}`;
const testUserEmail = `${testUserId}@example.test`;

const progressIdentity = {
  userId: testUserId,
  scenarioId: scenario.id,
  scenarioVersion: scenario.version,
  locale: scenario.locale,
} as const;

function getChallenge(index: number): ResolvedChallenge {
  const challenge = scenario.challenges.at(index);

  if (!challenge) {
    throw new Error(`Scenario 02 does not contain challenge at index ${index}.`);
  }

  return challenge;
}

function getOptimalChoice(challenge: ResolvedChallenge): ResolvedChoice {
  const choice = challenge.choices.find((item) => item.isOptimal);

  if (!choice) {
    throw new Error(`Challenge ${challenge.id} has no optimal choice.`);
  }

  return choice;
}

function getRejectedChoice(challenge: ResolvedChallenge): ResolvedChoice {
  const choice = challenge.choices.find((item) => !item.isOptimal);

  if (!choice) {
    throw new Error(`Challenge ${challenge.id} has no rejected choice.`);
  }

  return choice;
}

async function recordOptimalChoiceAndCompleteChallenge(
  challenge: ResolvedChallenge,
  attemptNumber = 1,
) {
  const choice = getOptimalChoice(challenge);

  await recordScenarioChoiceProgress({
    ...progressIdentity,
    challengeId: challenge.id,
    choiceId: choice.id,
    attemptNumber,
  });

  await completeScenarioChallengeProgress({
    ...progressIdentity,
    challengeId: challenge.id,
  });
}

beforeAll(async () => {
  await prisma.profile.create({
    data: {
      id: testUserId,
      email: testUserEmail,
      fullName: "Scenario integration test user",
      preferredLanguage: "en",
    },
  });
});

afterEach(async () => {
  await prisma.userScenarioAttempt.deleteMany({
    where: {
      userId: testUserId,
    },
  });
});

afterAll(async () => {
  await prisma.profile.deleteMany({
    where: {
      id: testUserId,
    },
  });
});

describe("scenario progress persistence", () => {
  it("creates one active attempt and reuses it when start is delivered again", async () => {
    const firstStart = await startScenarioProgress(progressIdentity);

    const repeatedStart = await startScenarioProgress({
      ...progressIdentity,
      locale: "pl",
    });

    expect(repeatedStart).toEqual(firstStart);

    const attempts = await prisma.userScenarioAttempt.findMany({
      where: {
        userId: testUserId,
        scenarioId: scenario.id,
        scenarioVersion: scenario.version,
      },
    });

    expect(attempts).toHaveLength(1);

    expect(attempts[0]).toMatchObject({
      id: firstStart.attemptId,
      attemptNumber: 1,
      status: "incomplete",
      locale: "pl",
    });

    expect(attempts[0]?.startedAt).toBeInstanceOf(Date);
    expect(attempts[0]?.completedAt).toBeNull();
  });

  it("stores server-validated choice correctness and keeps repeated delivery idempotent", async () => {
    const challenge = getChallenge(0);
    const rejectedChoice = getRejectedChoice(challenge);
    const optimalChoice = getOptimalChoice(challenge);

    const attempt = await startScenarioProgress(progressIdentity);

    const firstResult = await recordScenarioChoiceProgress({
      ...progressIdentity,
      challengeId: challenge.id,
      choiceId: rejectedChoice.id,
      attemptNumber: 1,
    });

    /*
     * The second request uses another choice for the same attempt number.
     * The already persisted decision must not be overwritten.
     */
    const repeatedResult = await recordScenarioChoiceProgress({
      ...progressIdentity,
      challengeId: challenge.id,
      choiceId: optimalChoice.id,
      attemptNumber: 1,
    });

    expect(firstResult).toEqual({
      attemptId: attempt.attemptId,
      isOptimal: false,
    });

    expect(repeatedResult).toEqual(firstResult);

    const persistedChoices = await prisma.userScenarioChoiceAttempt.findMany({
      where: {
        attemptId: attempt.attemptId,
        challengeId: challenge.id,
      },
    });

    expect(persistedChoices).toHaveLength(1);

    expect(persistedChoices[0]).toMatchObject({
      choiceId: rejectedChoice.id,
      attemptNumber: 1,
      isOptimal: false,
    });

    const runtimeState = await getScenarioRuntimeState({
      ...progressIdentity,
      mode: "play",
    });

    expect(runtimeState.status).toBe("incomplete");
    expect(runtimeState.initialView).toBe("challenge");
    expect(runtimeState.initialChallengeId).toBe(challenge.id);
    expect(runtimeState.initialChallengeStep).toBe("decision");
    expect(runtimeState.initialAttemptCounts[challenge.id]).toBe(1);

    expect(runtimeState.initialRejectedChoiceIdsByChallenge[challenge.id]).toEqual([
      rejectedChoice.id,
    ]);
  });

  it("requires an optimal decision before completing a challenge and stores completion once", async () => {
    const challenge = getChallenge(0);
    const rejectedChoice = getRejectedChoice(challenge);
    const optimalChoice = getOptimalChoice(challenge);

    const attempt = await startScenarioProgress(progressIdentity);

    await recordScenarioChoiceProgress({
      ...progressIdentity,
      challengeId: challenge.id,
      choiceId: rejectedChoice.id,
      attemptNumber: 1,
    });

    await expect(
      completeScenarioChallengeProgress({
        ...progressIdentity,
        challengeId: challenge.id,
      }),
    ).rejects.toThrow("The challenge cannot be completed before an optimal choice is confirmed.");

    await recordScenarioChoiceProgress({
      ...progressIdentity,
      challengeId: challenge.id,
      choiceId: optimalChoice.id,
      attemptNumber: 2,
    });

    await completeScenarioChallengeProgress({
      ...progressIdentity,
      challengeId: challenge.id,
    });

    /*
     * Repeated delivery must not create another completion record.
     */
    await completeScenarioChallengeProgress({
      ...progressIdentity,
      challengeId: challenge.id,
    });

    const completions = await prisma.userScenarioChallengeCompletion.findMany({
      where: {
        attemptId: attempt.attemptId,
        challengeId: challenge.id,
      },
    });

    expect(completions).toHaveLength(1);

    const runtimeState = await getScenarioRuntimeState({
      ...progressIdentity,
      mode: "play",
    });

    expect(runtimeState.initialCompletedChallengeIds).toEqual([challenge.id]);

    expect(runtimeState.initialAttemptCounts[challenge.id]).toBe(2);

    expect(runtimeState.initialRejectedChoiceIdsByChallenge[challenge.id]).toBeUndefined();

    expect(runtimeState.initialChallengeId).toBe(getChallenge(1).id);
  });

  it("does not complete a scenario until every challenge is persisted as completed", async () => {
    await startScenarioProgress(progressIdentity);

    await recordOptimalChoiceAndCompleteChallenge(getChallenge(0));

    await expect(completeScenarioProgress(progressIdentity)).rejects.toThrow(
      "All challenges must be completed before completing the scenario.",
    );

    const persistedAttempt = await prisma.userScenarioAttempt.findFirstOrThrow({
      where: {
        userId: testUserId,
        scenarioId: scenario.id,
        scenarioVersion: scenario.version,
      },
    });

    expect(persistedAttempt.status).toBe("incomplete");
    expect(persistedAttempt.completedAt).toBeNull();
  });

  it("persists the full flow, restores review state and starts the next attempt with number two", async () => {
    const firstAttempt = await startScenarioProgress(progressIdentity);

    for (const challenge of scenario.challenges) {
      await recordOptimalChoiceAndCompleteChallenge(challenge);
    }

    await completeScenarioProgress(progressIdentity);

    const completedAttempt = await prisma.userScenarioAttempt.findUniqueOrThrow({
      where: {
        id: firstAttempt.attemptId,
      },

      include: {
        choiceAttempts: true,
        challengeCompletions: true,
      },
    });

    expect(completedAttempt.status).toBe("completed");
    expect(completedAttempt.completedAt).toBeInstanceOf(Date);

    expect(completedAttempt.choiceAttempts).toHaveLength(scenario.challenges.length);

    expect(completedAttempt.challengeCompletions).toHaveLength(scenario.challenges.length);

    const reviewState = await getScenarioRuntimeState({
      ...progressIdentity,
      mode: "review",
    });

    expect(reviewState).toMatchObject({
      attemptId: firstAttempt.attemptId,
      attemptNumber: 1,
      status: "completed",
      initialView: "board",
      initialChallengeId: null,
      initialSelectedChoiceId: null,
    });

    expect(reviewState.initialCompletedChallengeIds).toEqual(
      scenario.challenges.map((challenge) => challenge.id),
    );

    const secondAttempt = await startScenarioProgress(progressIdentity);

    expect(secondAttempt.attemptNumber).toBe(2);
    expect(secondAttempt.attemptId).not.toBe(firstAttempt.attemptId);

    const attempts = await prisma.userScenarioAttempt.findMany({
      where: {
        userId: testUserId,
        scenarioId: scenario.id,
        scenarioVersion: scenario.version,
      },

      orderBy: {
        attemptNumber: "asc",
      },
    });

    expect(attempts.map((attempt) => attempt.status)).toEqual(["completed", "incomplete"]);

    expect(attempts.map((attempt) => attempt.attemptNumber)).toEqual([1, 2]);
  });
});
