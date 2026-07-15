import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedUserId: vi.fn(),

  getScenarioRuntimeState: vi.fn(),

  startScenarioProgress: vi.fn(),

  recordScenarioChoiceProgress: vi.fn(),

  completeScenarioChallengeProgress: vi.fn(),

  completeScenarioProgress: vi.fn(),

  assertScenarioCanStartForUser: vi.fn(),
}));

vi.mock("@/lib/auth/require-authenticated-user-id", () => ({
  requireAuthenticatedUserId: mocks.requireAuthenticatedUserId,
}));

vi.mock("@/lib/scenarios/simulator/server/scenario-progress", () => ({
  getScenarioRuntimeState: mocks.getScenarioRuntimeState,

  startScenarioProgress: mocks.startScenarioProgress,

  recordScenarioChoiceProgress: mocks.recordScenarioChoiceProgress,

  completeScenarioChallengeProgress: mocks.completeScenarioChallengeProgress,

  completeScenarioProgress: mocks.completeScenarioProgress,
}));

vi.mock("@/lib/scenarios/simulator/server/scenario-pathway", () => ({
  assertScenarioCanStartForUser: mocks.assertScenarioCanStartForUser,
}));

import {
  completeScenarioAction,
  completeScenarioChallengeAction,
  recordScenarioChoiceAction,
  startScenarioAction,
} from "@/features/scenarios/actions";

const authenticatedUserId = "authenticated-user-id";

const identity = {
  scenarioId: "scenario-02" as const,
  scenarioVersion: 1,
  locale: "en",
};

beforeEach(() => {
  mocks.requireAuthenticatedUserId.mockResolvedValue(authenticatedUserId);

  mocks.assertScenarioCanStartForUser.mockResolvedValue(undefined);

  mocks.startScenarioProgress.mockResolvedValue({
    attemptId: "attempt-id",
    attemptNumber: 1,
  });

  mocks.recordScenarioChoiceProgress.mockResolvedValue({
    attemptId: "attempt-id",
    isOptimal: false,
  });

  mocks.completeScenarioChallengeProgress.mockResolvedValue({
    attemptId: "attempt-id",
  });

  mocks.completeScenarioProgress.mockResolvedValue({
    attemptId: "attempt-id",
  });
});

describe("scenario action security boundary", () => {
  it("rejects writes when the session is unauthenticated", async () => {
    mocks.requireAuthenticatedUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    await expect(startScenarioAction(identity)).rejects.toThrow("Unauthorized");

    expect(mocks.assertScenarioCanStartForUser).not.toHaveBeenCalled();
    expect(mocks.startScenarioProgress).not.toHaveBeenCalled();
  });

  it("uses the authenticated session user instead of a forged userId", async () => {
    const maliciousInput = {
      ...identity,

      challengeId: "scenario-02-challenge-01" as const,

      choiceId: "scenario-02-challenge-01-choice-01" as const,

      attemptNumber: 1,

      /*
       * Pola nie należą do kontraktu akcji,
       * ale zmanipulowany klient może je przesłać
       * w surowym żądaniu.
       */
      userId: "victim-user-id",

      isOptimal: true,

      status: "completed",
    } as unknown as Parameters<typeof recordScenarioChoiceAction>[0];

    await recordScenarioChoiceAction(maliciousInput);

    expect(mocks.recordScenarioChoiceProgress).toHaveBeenCalledTimes(1);

    /*
     * Matcher porównuje cały przekazany obiekt.
     * Test zakończy się błędem także wtedy, gdy akcja
     * przekaże dalej userId, isOptimal lub status klienta.
     */
    expect(mocks.recordScenarioChoiceProgress).toHaveBeenCalledWith({
      userId: authenticatedUserId,

      scenarioId: "scenario-02",

      scenarioVersion: 1,

      locale: "en",

      challengeId: "scenario-02-challenge-01",

      choiceId: "scenario-02-challenge-01-choice-01",

      attemptNumber: 1,
    });
  });

  it("does not start a scenario rejected by the server-side pathway guard", async () => {
    mocks.assertScenarioCanStartForUser.mockRejectedValueOnce(new Error("Scenario is locked."));

    await expect(startScenarioAction(identity)).rejects.toThrow("Scenario is locked.");

    expect(mocks.startScenarioProgress).not.toHaveBeenCalled();
  });

  it("derives the session user for every write operation", async () => {
    await startScenarioAction(identity);

    await completeScenarioChallengeAction({
      ...identity,

      challengeId: "scenario-02-challenge-01",
    });

    await completeScenarioAction(identity);

    expect(mocks.assertScenarioCanStartForUser).toHaveBeenCalledWith(
      authenticatedUserId,
      identity.scenarioId,
    );

    expect(mocks.startScenarioProgress).toHaveBeenCalledWith({
      userId: authenticatedUserId,

      ...identity,
    });

    expect(mocks.completeScenarioChallengeProgress).toHaveBeenCalledWith({
      userId: authenticatedUserId,

      ...identity,

      challengeId: "scenario-02-challenge-01",
    });

    expect(mocks.completeScenarioProgress).toHaveBeenCalledWith({
      userId: authenticatedUserId,

      ...identity,
    });
  });
});
