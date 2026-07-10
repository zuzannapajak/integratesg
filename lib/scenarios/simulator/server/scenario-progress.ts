import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";
import {
  ScenarioAttemptCounts,
  ScenarioRejectedChoices,
  ScenarioRuntimeState,
} from "@/lib/scenarios/simulator/runtime-state";
import type {
  ChallengeId,
  ChoiceId,
  ResolvedScenario,
  ScenarioId,
  ScenarioPlayerMode,
  ScenarioPlayerView,
} from "@/lib/scenarios/simulator/types";

type ScenarioProgressIdentity = {
  readonly userId: string;
  readonly scenarioId: ScenarioId;
  readonly scenarioVersion: number;
  readonly locale: string;
};

type RecordScenarioChoiceInput = ScenarioProgressIdentity & {
  readonly challengeId: ChallengeId;
  readonly choiceId: ChoiceId;
  readonly attemptNumber: number;
};

type CompleteScenarioChallengeInput = ScenarioProgressIdentity & {
  readonly challengeId: ChallengeId;
};

type GetScenarioRuntimeStateInput = ScenarioProgressIdentity & {
  readonly mode: ScenarioPlayerMode;
};

function resolveValidatedScenario(
  input: Pick<ScenarioProgressIdentity, "scenarioId" | "scenarioVersion" | "locale">,
): ResolvedScenario {
  const scenario = resolveScenarioBySlug(input.scenarioId, input.locale);

  if (!scenario) {
    throw new Error("Scenario not found.");
  }

  if (scenario.version !== input.scenarioVersion) {
    throw new Error("Scenario version mismatch.");
  }

  return scenario;
}

async function findActiveAttempt(input: ScenarioProgressIdentity) {
  return prisma.userScenarioAttempt.findFirst({
    where: {
      userId: input.userId,
      scenarioId: input.scenarioId,
      scenarioVersion: input.scenarioVersion,
      status: "incomplete",
    },
    orderBy: [{ attemptNumber: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      attemptNumber: true,
    },
  });
}

async function getActiveAttemptOrThrow(input: ScenarioProgressIdentity) {
  const attempt = await findActiveAttempt(input);

  if (!attempt) {
    throw new Error("Active scenario attempt not found.");
  }

  return attempt;
}

export async function startScenarioProgress(input: ScenarioProgressIdentity) {
  resolveValidatedScenario(input);

  const now = new Date();

  try {
    return await prisma.$transaction(async (transaction) => {
      const activeAttempt = await transaction.userScenarioAttempt.findFirst({
        where: {
          userId: input.userId,
          scenarioId: input.scenarioId,
          scenarioVersion: input.scenarioVersion,
          status: "incomplete",
        },
        orderBy: [{ attemptNumber: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          attemptNumber: true,
        },
      });

      if (activeAttempt) {
        await transaction.userScenarioAttempt.update({
          where: {
            id: activeAttempt.id,
          },
          data: {
            locale: input.locale,
            lastOpenedAt: now,
          },
        });

        return {
          attemptId: activeAttempt.id,
          attemptNumber: activeAttempt.attemptNumber,
        };
      }

      const latestAttempt = await transaction.userScenarioAttempt.findFirst({
        where: {
          userId: input.userId,
          scenarioId: input.scenarioId,
          scenarioVersion: input.scenarioVersion,
        },
        orderBy: [{ attemptNumber: "desc" }, { createdAt: "desc" }],
        select: {
          attemptNumber: true,
        },
      });

      const attemptNumber = (latestAttempt?.attemptNumber ?? 0) + 1;

      const attempt = await transaction.userScenarioAttempt.create({
        data: {
          userId: input.userId,
          scenarioId: input.scenarioId,
          scenarioVersion: input.scenarioVersion,
          locale: input.locale,
          attemptNumber,
          status: "incomplete",
          startedAt: now,
          lastOpenedAt: now,
        },
        select: {
          id: true,
          attemptNumber: true,
        },
      });

      return {
        attemptId: attempt.id,
        attemptNumber: attempt.attemptNumber,
      };
    });
  } catch (error) {
    /*
     * Chroni przed sytuacją, w której dwa równoległe żądania
     * próbują utworzyć ten sam numer podejścia.
     */
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existingAttempt = await findActiveAttempt(input);

      if (existingAttempt) {
        return {
          attemptId: existingAttempt.id,
          attemptNumber: existingAttempt.attemptNumber,
        };
      }
    }

    throw error;
  }
}

export async function recordScenarioChoiceProgress(input: RecordScenarioChoiceInput) {
  const scenario = resolveValidatedScenario(input);

  const challenge = scenario.challenges.find((item) => item.id === input.challengeId);

  if (!challenge) {
    throw new Error("Challenge not found.");
  }

  const choice = challenge.choices.find((item) => item.id === input.choiceId);

  if (!choice) {
    throw new Error("Choice not found.");
  }

  if (!Number.isInteger(input.attemptNumber) || input.attemptNumber < 1) {
    throw new Error("Invalid choice attempt number.");
  }

  const attempt = await getActiveAttemptOrThrow(input);
  const now = new Date();

  const [recordedChoiceAttempt] = await prisma.$transaction([
    prisma.userScenarioChoiceAttempt.upsert({
      where: {
        attemptId_challengeId_attemptNumber: {
          attemptId: attempt.id,
          challengeId: input.challengeId,
          attemptNumber: input.attemptNumber,
        },
      },
      create: {
        attemptId: attempt.id,
        challengeId: input.challengeId,
        choiceId: input.choiceId,
        attemptNumber: input.attemptNumber,

        // Optimality is always resolved from trusted server-side content.
        isOptimal: choice.isOptimal,

        confirmedAt: now,
      },

      /*
       * Repeated delivery of the same request must not modify
       * an already recorded decision.
       */
      update: {},

      select: {
        isOptimal: true,
      },
    }),

    prisma.userScenarioAttempt.update({
      where: {
        id: attempt.id,
      },
      data: {
        locale: input.locale,
        lastOpenedAt: now,
      },
    }),
  ]);

  return {
    attemptId: attempt.id,
    isOptimal: recordedChoiceAttempt.isOptimal,
  };
}

export async function completeScenarioChallengeProgress(input: CompleteScenarioChallengeInput) {
  const scenario = resolveValidatedScenario(input);

  const challengeExists = scenario.challenges.some(
    (challenge) => challenge.id === input.challengeId,
  );

  if (!challengeExists) {
    throw new Error("Challenge not found.");
  }

  const attempt = await getActiveAttemptOrThrow(input);

  const optimalChoiceAttempt = await prisma.userScenarioChoiceAttempt.findFirst({
    where: {
      attemptId: attempt.id,
      challengeId: input.challengeId,
      isOptimal: true,
    },
    select: {
      id: true,
    },
  });

  if (!optimalChoiceAttempt) {
    throw new Error("The challenge cannot be completed before an optimal choice is confirmed.");
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.userScenarioChallengeCompletion.upsert({
      where: {
        attemptId_challengeId: {
          attemptId: attempt.id,
          challengeId: input.challengeId,
        },
      },
      create: {
        attemptId: attempt.id,
        challengeId: input.challengeId,
        completedAt: now,
      },

      /*
       * Preserve the original completion timestamp when
       * the same request is delivered again.
       */
      update: {},
    }),

    prisma.userScenarioAttempt.update({
      where: {
        id: attempt.id,
      },
      data: {
        locale: input.locale,
        lastOpenedAt: now,
      },
    }),
  ]);

  return {
    attemptId: attempt.id,
  };
}

export async function completeScenarioProgress(input: ScenarioProgressIdentity) {
  const scenario = resolveValidatedScenario(input);
  const attempt = await getActiveAttemptOrThrow(input);

  const expectedChallengeIds = scenario.challenges.map((challenge) => challenge.id);

  const completedChallenges = await prisma.userScenarioChallengeCompletion.count({
    where: {
      attemptId: attempt.id,
      challengeId: {
        in: expectedChallengeIds,
      },
    },
  });

  if (completedChallenges !== expectedChallengeIds.length) {
    throw new Error("All challenges must be completed before completing the scenario.");
  }

  const now = new Date();

  await prisma.userScenarioAttempt.update({
    where: {
      id: attempt.id,
    },
    data: {
      locale: input.locale,
      status: "completed",
      completedAt: now,
      lastOpenedAt: now,
    },
  });

  return {
    attemptId: attempt.id,
  };
}

export async function getScenarioRuntimeState(
  input: GetScenarioRuntimeStateInput,
): Promise<ScenarioRuntimeState> {
  const scenario = resolveValidatedScenario(input);

  const attempt = await prisma.userScenarioAttempt.findFirst({
    where: {
      userId: input.userId,
      scenarioId: input.scenarioId,
      scenarioVersion: input.scenarioVersion,

      status: input.mode === "review" ? "completed" : "incomplete",
    },

    orderBy: [
      {
        attemptNumber: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    select: {
      id: true,
      attemptNumber: true,
      status: true,

      challengeCompletions: {
        orderBy: {
          completedAt: "asc",
        },

        select: {
          challengeId: true,
        },
      },

      choiceAttempts: {
        orderBy: [
          {
            confirmedAt: "asc",
          },
          {
            attemptNumber: "asc",
          },
        ],

        select: {
          challengeId: true,
          choiceId: true,
          attemptNumber: true,
          isOptimal: true,
        },
      },
    },
  });

  if (!attempt) {
    return {
      attemptId: null,
      attemptNumber: null,
      status: "not_started",

      initialView: "intro",
      initialChallengeId: null,

      initialCompletedChallengeIds: [],

      initialAttemptCounts: {},

      initialRejectedChoiceIdsByChallenge: {},
    };
  }

  const challengeById = new Map(scenario.challenges.map((challenge) => [challenge.id, challenge]));

  const completedChallengeIdSet = new Set<ChallengeId>();

  for (const completion of attempt.challengeCompletions) {
    const challenge = challengeById.get(completion.challengeId as ChallengeId);

    if (!challenge) {
      continue;
    }

    completedChallengeIdSet.add(challenge.id);
  }

  const initialAttemptCounts: ScenarioAttemptCounts = {};

  const mutableRejectedChoices: Partial<Record<ChallengeId, ChoiceId[]>> = {};

  for (const choiceAttempt of attempt.choiceAttempts) {
    const challenge = challengeById.get(choiceAttempt.challengeId as ChallengeId);

    if (!challenge) {
      continue;
    }

    const choice = challenge.choices.find((item) => item.id === choiceAttempt.choiceId);

    if (!choice) {
      continue;
    }

    const previousAttemptCount = initialAttemptCounts[challenge.id] ?? 0;

    initialAttemptCounts[challenge.id] = Math.max(
      previousAttemptCount,
      choiceAttempt.attemptNumber,
    );

    /*
     * Nie pokazujemy historii odrzuconych
     * odpowiedzi dla ukończonego challenge’u.
     */
    if (completedChallengeIdSet.has(challenge.id)) {
      continue;
    }

    /*
     * Poprawność ponownie sprawdzamy na
     * aktualnej, zweryfikowanej treści
     * scenariusza.
     */
    if (choice.isOptimal) {
      continue;
    }

    const rejectedChoices = mutableRejectedChoices[challenge.id] ?? [];

    if (!rejectedChoices.includes(choice.id)) {
      rejectedChoices.push(choice.id);
    }

    mutableRejectedChoices[challenge.id] = rejectedChoices;
  }

  const initialCompletedChallengeIds = scenario.challenges
    .filter((challenge) => completedChallengeIdSet.has(challenge.id))
    .map((challenge) => challenge.id);

  const initialRejectedChoiceIdsByChallenge: ScenarioRejectedChoices = mutableRejectedChoices;

  const allChallengesCompleted =
    scenario.challenges.length > 0 &&
    initialCompletedChallengeIds.length === scenario.challenges.length;

  let initialView: ScenarioPlayerView;

  if (attempt.status === "completed") {
    initialView = input.mode === "review" ? "board" : "completion";
  } else if (allChallengesCompleted) {
    /*
     * Użytkownik ukończył wszystkie
     * challenge’e, ale nie kliknął jeszcze
     * Complete scenario.
     */
    initialView = "summary";
  } else {
    /*
     * Nie zgadujemy, czy użytkownik opuścił
     * kontekst, decyzję albo feedback.
     * Wznawiamy bezpiecznie od planszy.
     */
    initialView = "board";
  }

  if (attempt.status === "incomplete") {
    await prisma.userScenarioAttempt.update({
      where: {
        id: attempt.id,
      },

      data: {
        locale: input.locale,
        lastOpenedAt: new Date(),
      },
    });
  }

  return {
    attemptId: attempt.id,
    attemptNumber: attempt.attemptNumber,
    status: attempt.status,

    initialView,
    initialChallengeId: null,

    initialCompletedChallengeIds,

    initialAttemptCounts,

    initialRejectedChoiceIdsByChallenge,
  };
}
