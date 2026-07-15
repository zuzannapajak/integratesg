import { randomUUID } from "node:crypto";

import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";
import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";
import {
  completeScenarioChallengeProgress,
  recordScenarioChoiceProgress,
  startScenarioProgress,
} from "@/lib/scenarios/simulator/server/scenario-progress";
import type {
  ChallengeId,
  ChoiceId,
  ResolvedChallenge,
  ResolvedChoice,
  ResolvedScenario,
} from "@/lib/scenarios/simulator/types";

function requireScenario(): ResolvedScenario {
  const resolvedScenario = resolveScenarioBySlug("scenario-02", "en");

  if (!resolvedScenario) {
    throw new Error("Scenario 02 is unavailable for security integration tests.");
  }

  return resolvedScenario;
}

const scenario = requireScenario();

const userAId = `scenario-security-a-${randomUUID()}`;
const userBId = `scenario-security-b-${randomUUID()}`;

const userAEmail = `${userAId}@example.test`;
const userBEmail = `${userBId}@example.test`;

const identityA = {
  userId: userAId,
  scenarioId: scenario.id,
  scenarioVersion: scenario.version,
  locale: "en",
} as const;

const identityB = {
  userId: userBId,
  scenarioId: scenario.id,
  scenarioVersion: scenario.version,
  locale: "en",
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

async function completeChallenge(challenge: ResolvedChallenge): Promise<void> {
  const optimalChoice = getOptimalChoice(challenge);

  await recordScenarioChoiceProgress({
    ...identityA,
    challengeId: challenge.id,
    choiceId: optimalChoice.id,
    attemptNumber: 1,
  });

  await completeScenarioChallengeProgress({
    ...identityA,
    challengeId: challenge.id,
  });
}

beforeAll(async () => {
  await prisma.profile.createMany({
    data: [
      {
        id: userAId,
        email: userAEmail,
        fullName: "Scenario security user A",
        preferredLanguage: "en",
      },
      {
        id: userBId,
        email: userBEmail,
        fullName: "Scenario security user B",
        preferredLanguage: "en",
      },
    ],
  });
});

afterEach(async () => {
  await prisma.userScenarioAttempt.deleteMany({
    where: {
      userId: {
        in: [userAId, userBId],
      },
    },
  });
});

afterAll(async () => {
  await prisma.profile.deleteMany({
    where: {
      id: {
        in: [userAId, userBId],
      },
    },
  });
});

describe("scenario result persistence security", () => {
  it("rejects unsupported locales and mismatched scenario versions without creating attempts", async () => {
    await expect(
      startScenarioProgress({
        ...identityA,
        locale: "unsupported-locale",
      }),
    ).rejects.toThrow("Unsupported scenario locale.");

    await expect(
      startScenarioProgress({
        ...identityA,
        scenarioVersion: scenario.version + 1,
      }),
    ).rejects.toThrow("Scenario version mismatch.");

    expect(
      await prisma.userScenarioAttempt.count({
        where: {
          userId: userAId,
        },
      }),
    ).toBe(0);
  });

  it("isolates active attempts between users", async () => {
    await startScenarioProgress(identityA);

    const firstChallenge = getChallenge(0);
    const rejectedChoice = getRejectedChoice(firstChallenge);

    await expect(
      recordScenarioChoiceProgress({
        ...identityB,
        challengeId: firstChallenge.id,
        choiceId: rejectedChoice.id,
        attemptNumber: 1,
      }),
    ).rejects.toThrow("Active scenario attempt not found.");

    const attemptA = await prisma.userScenarioAttempt.findFirstOrThrow({
      where: {
        userId: userAId,
      },
    });

    expect(
      await prisma.userScenarioChoiceAttempt.count({
        where: {
          attemptId: attemptA.id,
        },
      }),
    ).toBe(0);
  });

  it("derives answer correctness from trusted scenario content", async () => {
    const attempt = await startScenarioProgress(identityA);

    const firstChallenge = getChallenge(0);
    const rejectedChoice = getRejectedChoice(firstChallenge);

    const result = await recordScenarioChoiceProgress({
      ...identityA,
      challengeId: firstChallenge.id,
      choiceId: rejectedChoice.id,
      attemptNumber: 1,

      /*
       * Symulacja dodatkowego pola przesłanego
       * przez zmanipulowanego klienta.
       */
      isOptimal: true,
    } as Parameters<typeof recordScenarioChoiceProgress>[0] & {
      readonly isOptimal: boolean;
    });

    expect(result.isOptimal).toBe(false);

    const persistedChoice = await prisma.userScenarioChoiceAttempt.findFirstOrThrow({
      where: {
        attemptId: attempt.attemptId,
      },
    });

    expect(persistedChoice.choiceId).toBe(rejectedChoice.id);

    expect(persistedChoice.isOptimal).toBe(false);
  });

  it("rejects choices that do not belong to the selected challenge", async () => {
    const attempt = await startScenarioProgress(identityA);

    const firstChallenge = getChallenge(0);
    const secondChallenge = getChallenge(1);
    const secondChoice = getOptimalChoice(secondChallenge);

    await expect(
      recordScenarioChoiceProgress({
        ...identityA,
        challengeId: firstChallenge.id,
        choiceId: secondChoice.id,
        attemptNumber: 1,
      }),
    ).rejects.toThrow("Choice not found.");

    expect(
      await prisma.userScenarioChoiceAttempt.count({
        where: {
          attemptId: attempt.attemptId,
        },
      }),
    ).toBe(0);
  });

  it("rejects invalid and non-sequential choice attempt numbers", async () => {
    const attempt = await startScenarioProgress(identityA);

    const firstChallenge = getChallenge(0);
    const rejectedChoice = getRejectedChoice(firstChallenge);

    await expect(
      recordScenarioChoiceProgress({
        ...identityA,
        challengeId: firstChallenge.id,
        choiceId: rejectedChoice.id,
        attemptNumber: 0,
      }),
    ).rejects.toThrow("Invalid choice attempt number.");

    await expect(
      recordScenarioChoiceProgress({
        ...identityA,
        challengeId: firstChallenge.id,
        choiceId: rejectedChoice.id,
        attemptNumber: 2,
      }),
    ).rejects.toThrow("Choice attempt number must be sequential.");

    await recordScenarioChoiceProgress({
      ...identityA,
      challengeId: firstChallenge.id,
      choiceId: rejectedChoice.id,
      attemptNumber: 1,
    });

    await expect(
      recordScenarioChoiceProgress({
        ...identityA,
        challengeId: firstChallenge.id,
        choiceId: rejectedChoice.id,
        attemptNumber: 3,
      }),
    ).rejects.toThrow("Choice attempt number must be sequential.");

    expect(
      await prisma.userScenarioChoiceAttempt.count({
        where: {
          attemptId: attempt.attemptId,
        },
      }),
    ).toBe(1);
  });

  it("does not allow a learner to skip earlier challenges", async () => {
    const attempt = await startScenarioProgress(identityA);

    const firstChallenge = getChallenge(0);
    const secondChallenge = getChallenge(1);

    const secondOptimalChoice = getOptimalChoice(secondChallenge);

    await expect(
      recordScenarioChoiceProgress({
        ...identityA,
        challengeId: secondChallenge.id,
        choiceId: secondOptimalChoice.id,
        attemptNumber: 1,
      }),
    ).rejects.toThrow("Previous challenges must be completed before this challenge.");

    await completeChallenge(firstChallenge);

    await expect(
      recordScenarioChoiceProgress({
        ...identityA,
        challengeId: secondChallenge.id,
        choiceId: secondOptimalChoice.id,
        attemptNumber: 1,
      }),
    ).resolves.toMatchObject({
      attemptId: attempt.attemptId,
      isOptimal: true,
    });
  });

  it("prevents adding new decisions to an already completed challenge", async () => {
    const attempt = await startScenarioProgress(identityA);

    const firstChallenge = getChallenge(0);

    const optimalChoice = getOptimalChoice(firstChallenge);

    const rejectedChoice = getRejectedChoice(firstChallenge);

    await recordScenarioChoiceProgress({
      ...identityA,
      challengeId: firstChallenge.id,
      choiceId: optimalChoice.id,
      attemptNumber: 1,
    });

    await completeScenarioChallengeProgress({
      ...identityA,
      challengeId: firstChallenge.id,
    });

    await expect(
      recordScenarioChoiceProgress({
        ...identityA,
        challengeId: firstChallenge.id,
        choiceId: rejectedChoice.id,
        attemptNumber: 2,
      }),
    ).rejects.toThrow("A completed challenge cannot accept additional choices.");

    expect(
      await prisma.userScenarioChoiceAttempt.count({
        where: {
          attemptId: attempt.attemptId,
          challengeId: firstChallenge.id,
        },
      }),
    ).toBe(1);
  });

  it("rejects unknown challenge identifiers without writing data", async () => {
    const attempt = await startScenarioProgress(identityA);

    await expect(
      recordScenarioChoiceProgress({
        ...identityA,
        challengeId: "scenario-02-challenge-99" as ChallengeId,
        choiceId: "scenario-02-challenge-99-choice-01" as ChoiceId,
        attemptNumber: 1,
      }),
    ).rejects.toThrow("Challenge not found.");

    expect(
      await prisma.userScenarioChoiceAttempt.count({
        where: {
          attemptId: attempt.attemptId,
        },
      }),
    ).toBe(0);
  });
});
