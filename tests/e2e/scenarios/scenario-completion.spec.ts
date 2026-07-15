import { expect, test, type Page } from "@playwright/test";

import {
  disconnectScenarioTestDatabase,
  getScenarioTestCredentials,
  readCompletedScenarioAttempt,
  resetScenarioTestProgress,
} from "./scenario-test-database";

const scenarioPath = "/en/scenarios/scenario-02/play";

const challengeIds = {
  priorities: "scenario-02-challenge-01",
  financialPressure: "scenario-02-challenge-02",
  peopleAndTeams: "scenario-02-challenge-03",
} as const;

const choiceIds = {
  priorities: {
    rejected: "scenario-02-challenge-01-choice-01",
    optimal: "scenario-02-challenge-01-choice-02",
  },

  financialPressure: {
    optimal: "scenario-02-challenge-02-choice-03",
  },

  peopleAndTeams: {
    optimal: "scenario-02-challenge-03-choice-01",
  },
} as const;

async function signIn(page: Page): Promise<void> {
  const { email, password } = getScenarioTestCredentials();

  await page.goto("/en/auth/login");

  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);

  await Promise.all([
    page.waitForURL(/\/en\/dashboard(?:\?.*)?$/),

    page
      .getByRole("button", {
        name: "Login",
      })
      .click(),
  ]);
}

async function continueToDecision(page: Page): Promise<void> {
  const continueButton = page.getByRole("button", {
    name: "Continue to decision",
  });

  await expect(continueButton).toBeVisible();
  await expect(continueButton).toBeEnabled();

  await continueButton.click();

  await expect(page.getByTestId("scenario-challenge")).toHaveAttribute(
    "data-challenge-step",
    "decision",
  );
}

async function openChallenge(page: Page, challengeId: string): Promise<void> {
  const hotspot = page.getByTestId(`scenario-board-hotspot-${challengeId}`);

  await expect(hotspot).toBeVisible();
  await expect(hotspot).toBeEnabled();

  await hotspot.click();

  await expect(page.getByTestId("scenario-player")).toHaveAttribute("data-view", "challenge");

  await expect(page.getByTestId("scenario-challenge")).toHaveAttribute(
    "data-challenge-id",
    challengeId,
  );

  await continueToDecision(page);
}

async function selectAndConfirmChoice(page: Page, choiceId: string): Promise<void> {
  const choiceCard = page.getByTestId(`scenario-decision-choice-${choiceId}`);

  const radio = choiceCard.getByRole("radio");

  await expect(choiceCard).toBeVisible();
  await expect(radio).toBeEnabled();

  /*
   * Input radio jest ukryty klasą sr-only.
   * Klikamy widoczną kartę <label>.
   */
  await choiceCard.click();

  await expect(radio).toBeChecked();

  await expect(choiceCard).toHaveAttribute("data-selected", "true");

  const confirmButton = page.getByRole("button", {
    name: "Confirm decision",
  });

  await expect(confirmButton).toBeEnabled();

  await confirmButton.click();
}

async function continueAfterCorrectFeedback(page: Page): Promise<void> {
  await expect(page.getByTestId("scenario-correct-feedback")).toBeVisible();

  const continueButton = page.getByRole("button", {
    name: "Continue",
  });

  await expect(continueButton).toBeEnabled();

  await continueButton.click();
}

async function completeOpenChallenge(page: Page, optimalChoiceId: string): Promise<void> {
  await selectAndConfirmChoice(page, optimalChoiceId);

  await continueAfterCorrectFeedback(page);
}

async function completeChallenge(
  page: Page,
  challengeId: string,
  optimalChoiceId: string,
): Promise<void> {
  await openChallenge(page, challengeId);

  await completeOpenChallenge(page, optimalChoiceId);
}

test.describe("Scenario 02 complete user journey", () => {
  let testUserId: string;

  test.beforeEach(async () => {
    testUserId = await resetScenarioTestProgress();
  });

  test.afterAll(async () => {
    await resetScenarioTestProgress();
    await disconnectScenarioTestDatabase();
  });

  test("completes all challenges, restores progress after reload and persists the result", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    await signIn(page);

    await page.goto(scenarioPath);

    const player = page.getByTestId("scenario-player");

    await expect(player).toHaveAttribute("data-view", "intro");

    await expect(player).toHaveAttribute("data-mode", "play");

    await expect(player).toHaveAttribute("data-completed-count", "0");

    await page
      .getByRole("button", {
        name: "Continue",
      })
      .click();

    await page
      .getByRole("button", {
        name: "Start scenario",
      })
      .click();

    await expect(player).toHaveAttribute("data-view", "board");

    const firstHotspot = page.getByTestId(`scenario-board-hotspot-${challengeIds.priorities}`);

    const secondHotspot = page.getByTestId(
      `scenario-board-hotspot-${challengeIds.financialPressure}`,
    );

    await expect(firstHotspot).toBeEnabled();
    await expect(secondHotspot).toBeDisabled();

    await openChallenge(page, challengeIds.priorities);

    await selectAndConfirmChoice(page, choiceIds.priorities.rejected);

    await expect(page.getByTestId("scenario-incorrect-feedback")).toBeVisible();

    await page
      .getByRole("button", {
        name: "Try again",
      })
      .click();

    const rejectedChoice = page.getByTestId(
      `scenario-decision-choice-${choiceIds.priorities.rejected}`,
    );

    await expect(rejectedChoice).toHaveAttribute("data-previously-tried", "true");

    await completeOpenChallenge(page, choiceIds.priorities.optimal);

    await expect(player).toHaveAttribute("data-view", "board");

    await expect(player).toHaveAttribute("data-completed-count", "1");

    /*
     * Po przeładowaniu player powinien odtworzyć postęp
     * z bazy i automatycznie otworzyć pierwsze nieukończone
     * wyzwanie, czyli challenge 02.
     */
    await page.reload();

    await expect(player).toHaveAttribute("data-view", "challenge");

    await expect(player).toHaveAttribute("data-completed-count", "1");

    const restoredChallenge = page.getByTestId("scenario-challenge");

    await expect(restoredChallenge).toHaveAttribute(
      "data-challenge-id",
      challengeIds.financialPressure,
    );

    await expect(restoredChallenge).toHaveAttribute("data-challenge-step", "context");

    /*
     * Drugie wyzwanie jest już otwarte po odtworzeniu stanu,
     * więc nie klikamy hotspotu ponownie.
     */
    await continueToDecision(page);

    await completeOpenChallenge(page, choiceIds.financialPressure.optimal);

    await expect(player).toHaveAttribute("data-view", "board");

    await expect(player).toHaveAttribute("data-completed-count", "2");

    await completeChallenge(page, challengeIds.peopleAndTeams, choiceIds.peopleAndTeams.optimal);

    await expect(player).toHaveAttribute("data-view", "summary");

    await expect(page.getByTestId("scenario-summary")).toHaveAttribute(
      "data-all-completed",
      "true",
    );

    await page
      .getByRole("button", {
        name: "Complete scenario",
      })
      .click();

    await expect(player).toHaveAttribute("data-view", "completion");

    await expect(
      page.getByText("Scenario completed", {
        exact: true,
      }),
    ).toBeVisible();

    const completedAttempt = await readCompletedScenarioAttempt(testUserId);

    expect(completedAttempt).not.toBeNull();

    expect(completedAttempt?.status).toBe("completed");

    expect(completedAttempt?.completedAt).not.toBeNull();

    expect(completedAttempt?.challengeCompletions).toHaveLength(3);

    expect(completedAttempt?.choiceAttempts).toHaveLength(4);

    expect(
      completedAttempt?.choiceAttempts.map((choiceAttempt) => ({
        challengeId: choiceAttempt.challengeId,

        choiceId: choiceAttempt.choiceId,

        attemptNumber: choiceAttempt.attemptNumber,

        isOptimal: choiceAttempt.isOptimal,
      })),
    ).toEqual([
      {
        challengeId: challengeIds.priorities,

        choiceId: choiceIds.priorities.rejected,

        attemptNumber: 1,

        isOptimal: false,
      },

      {
        challengeId: challengeIds.priorities,

        choiceId: choiceIds.priorities.optimal,

        attemptNumber: 2,

        isOptimal: true,
      },

      {
        challengeId: challengeIds.financialPressure,

        choiceId: choiceIds.financialPressure.optimal,

        attemptNumber: 1,

        isOptimal: true,
      },

      {
        challengeId: challengeIds.peopleAndTeams,

        choiceId: choiceIds.peopleAndTeams.optimal,

        attemptNumber: 1,

        isOptimal: true,
      },
    ]);

    await page.goto(`${scenarioPath}?mode=review`);

    await expect(player).toHaveAttribute("data-mode", "review");

    await expect(player).toHaveAttribute("data-view", "board");

    await expect(player).toHaveAttribute("data-completed-count", "3");
  });
});
