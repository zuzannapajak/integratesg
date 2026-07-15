import { Prisma } from "@prisma/client";

import { isAppLocale } from "@/lib/i18n/locales";
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
  if (!isAppLocale(input.locale)) {
    throw new Error("Unsupported scenario locale.");
  }

  const scenario = resolveScenarioBySlug(input.scenarioId, input.locale);

  if (!scenario) {
    throw new Error("Scenario not found.");
  }

  if (scenario.version !== input.scenarioVersion) {
    throw new Error("Scenario version mismatch.");
  }

  return scenario;
}

function getChallengeIndexOrThrow(scenario: ResolvedScenario, challengeId: ChallengeId): number {
  const challengeIndex = scenario.challenges.findIndex((challenge) => challenge.id === challengeId);

  if (challengeIndex < 0) {
    throw new Error("Challenge not found.");
  }

  return challengeIndex;
}

async function assertPreviousChallengesCompleted(
  attemptId: string,
  scenario: ResolvedScenario,
  challengeIndex: number,
): Promise<void> {
  const previousChallengeIds = scenario.challenges
    .slice(0, challengeIndex)
    .map((challenge) => challenge.id);

  if (previousChallengeIds.length === 0) {
    return;
  }

  const completedPreviousChallenges = await prisma.userScenarioChallengeCompletion.count({
    where: {
      attemptId,

      challengeId: {
        in: previousChallengeIds,
      },
    },
  });

  if (completedPreviousChallenges !== previousChallengeIds.length) {
    throw new Error("Previous challenges must be completed before this challenge.");
  }
}

async function assertChallengeAcceptsChoices(
  attemptId: string,
  challengeId: ChallengeId,
): Promise<void> {
  const completion = await prisma.userScenarioChallengeCompletion.findUnique({
    where: {
      attemptId_challengeId: {
        attemptId,
        challengeId,
      },
    },

    select: {
      id: true,
    },
  });

  if (completion) {
    throw new Error("A completed challenge cannot accept additional choices.");
  }
}

async function findActiveAttempt(input: ScenarioProgressIdentity) {
  return prisma.userScenarioAttempt.findFirst({
    where: {
      userId: input.userId,
      scenarioId: input.scenarioId,
      scenarioVersion: input.scenarioVersion,
      status: "incomplete",
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

        orderBy: [
          {
            attemptNumber: "desc",
          },
          {
            createdAt: "desc",
          },
        ],

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
     * Chroni przed sytuacją, w której dwa równoległe
     * żądania próbują utworzyć ten sam numer podejścia.
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

  const challengeIndex = getChallengeIndexOrThrow(scenario, input.challengeId);

  const challenge = scenario.challenges[challengeIndex];

  const choice = challenge.choices.find((item) => item.id === input.choiceId);

  if (!choice) {
    throw new Error("Choice not found.");
  }

  if (!Number.isInteger(input.attemptNumber) || input.attemptNumber < 1) {
    throw new Error("Invalid choice attempt number.");
  }

  const attempt = await getActiveAttemptOrThrow(input);

  await assertPreviousChallengesCompleted(attempt.id, scenario, challengeIndex);

  await assertChallengeAcceptsChoices(attempt.id, input.challengeId);

  /*
   * Powtórne dostarczenie już zapisanego żądania
   * jest dozwolone, ale nie może zmienić decyzji
   * ani jej poprawności.
   */
  const existingChoiceAttempt = await prisma.userScenarioChoiceAttempt.findUnique({
    where: {
      attemptId_challengeId_attemptNumber: {
        attemptId: attempt.id,
        challengeId: input.challengeId,
        attemptNumber: input.attemptNumber,
      },
    },

    select: {
      isOptimal: true,
    },
  });

  if (existingChoiceAttempt) {
    await prisma.userScenarioAttempt.update({
      where: {
        id: attempt.id,
      },

      data: {
        locale: input.locale,
        lastOpenedAt: new Date(),
      },
    });

    return {
      attemptId: attempt.id,
      isOptimal: existingChoiceAttempt.isOptimal,
    };
  }

  const latestChoiceAttempt = await prisma.userScenarioChoiceAttempt.findFirst({
    where: {
      attemptId: attempt.id,
      challengeId: input.challengeId,
    },

    orderBy: {
      attemptNumber: "desc",
    },

    select: {
      attemptNumber: true,
    },
  });

  const expectedAttemptNumber = (latestChoiceAttempt?.attemptNumber ?? 0) + 1;

  if (input.attemptNumber !== expectedAttemptNumber) {
    throw new Error("Choice attempt number must be sequential.");
  }

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

        /*
         * Poprawność jest zawsze ustalana na podstawie
         * zaufanej treści po stronie serwera.
         */
        isOptimal: choice.isOptimal,

        confirmedAt: now,
      },

      /*
       * Powtórne dostarczenie tego samego numeru
       * próby nie może nadpisać decyzji.
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

  const challengeIndex = getChallengeIndexOrThrow(scenario, input.challengeId);

  const attempt = await getActiveAttemptOrThrow(input);

  await assertPreviousChallengesCompleted(attempt.id, scenario, challengeIndex);

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
       * Ponowne dostarczenie żądania zachowuje
       * pierwotny czas ukończenia.
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
          confirmedAt: true,
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
      initialChallengeStep: "context",
      initialSelectedChoiceId: null,

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
     * odpowiedzi dla ukończonego wyzwania.
     */
    if (completedChallengeIdSet.has(challenge.id)) {
      continue;
    }

    /*
     * Poprawność ponownie sprawdzamy na aktualnej,
     * zweryfikowanej treści scenariusza.
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

  const firstIncompleteChallenge =
    scenario.challenges.find((challenge) => !completedChallengeIdSet.has(challenge.id)) ?? null;

  const initialRejectedChoiceIdsByChallenge: ScenarioRejectedChoices = mutableRejectedChoices;

  const allChallengesCompleted =
    scenario.challenges.length > 0 &&
    initialCompletedChallengeIds.length === scenario.challenges.length;

  const currentChallengeChoiceAttempts = firstIncompleteChallenge
    ? attempt.choiceAttempts.filter(
        (choiceAttempt) => choiceAttempt.challengeId === firstIncompleteChallenge.id,
      )
    : [];

  const latestChoiceAttempt = currentChallengeChoiceAttempts.at(-1) ?? null;

  const latestSelectedChoice =
    firstIncompleteChallenge && latestChoiceAttempt
      ? (firstIncompleteChallenge.choices.find(
          (choice) => choice.id === latestChoiceAttempt.choiceId,
        ) ?? null)
      : null;

  let initialView: ScenarioPlayerView;

  let initialChallengeId: ChallengeId | null = null;

  let initialChallengeStep: "context" | "decision" = "context";

  let initialSelectedChoiceId: ChoiceId | null = null;

  if (attempt.status === "completed") {
    /*
     * Ukończony scenariusz nie jest ponownie
     * modyfikowany. W review pokazujemy planszę.
     */
    initialView = input.mode === "review" ? "board" : "completion";
  } else if (allChallengesCompleted) {
    /*
     * Wszystkie wyzwania zostały ukończone,
     * ale użytkownik nie zatwierdził jeszcze
     * całego scenariusza.
     */
    initialView = "summary";
  } else if (firstIncompleteChallenge) {
    initialChallengeId = firstIncompleteChallenge.id;

    if (!latestChoiceAttempt) {
      /*
       * Użytkownik nie zatwierdził jeszcze
       * żadnej decyzji w tym wyzwaniu.
       */
      initialView = "challenge";
      initialChallengeStep = "context";
    } else if (latestSelectedChoice?.isOptimal) {
      /*
       * Poprawna decyzja została zapisana,
       * ale wyzwanie nie zostało jeszcze
       * ukończone przyciskiem Continue.
       */
      initialView = "feedback";
      initialChallengeStep = "decision";
      initialSelectedChoiceId = latestSelectedChoice.id;
    } else {
      /*
       * Ostatnia zapisana decyzja była błędna.
       * Wznawiamy bezpośrednio od kolejnej próby.
       */
      initialView = "challenge";
      initialChallengeStep = "decision";
    }
  } else {
    /*
     * Stan awaryjny dla niespójnych danych.
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
    initialChallengeId,
    initialChallengeStep,
    initialSelectedChoiceId,

    initialCompletedChallengeIds,

    initialAttemptCounts,

    initialRejectedChoiceIdsByChallenge,
  };
}
