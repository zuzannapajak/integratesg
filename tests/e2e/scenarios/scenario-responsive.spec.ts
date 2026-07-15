import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  disconnectScenarioTestDatabase,
  getScenarioTestCredentials,
  resetScenarioTestProgress,
} from "./scenario-test-database";

const scenarioPath = "/en/scenarios/scenario-02/play";

const challengeIds = {
  priorities: "scenario-02-challenge-01",
} as const;

const viewports = {
  desktop: {
    width: 1440,
    height: 900,
  },

  tablet: {
    width: 768,
    height: 1024,
  },

  mobile: {
    width: 390,
    height: 844,
  },

  mobileLandscape: {
    width: 844,
    height: 390,
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

async function openScenarioPlayer(page: Page): Promise<void> {
  const response = await page.goto(scenarioPath, {
    waitUntil: "domcontentloaded",
  });

  if (!response) {
    throw new Error("The scenario route did not return an HTTP response.");
  }

  const status = response.status();

  expect(status, `The scenario route returned HTTP ${status}.`).toBeLessThan(400);

  await expect(page.getByTestId("scenario-player")).toBeVisible();
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const dimensions = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,

    documentWidth: document.documentElement.scrollWidth,

    bodyWidth: document.body.scrollWidth,
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 2);

  expect(dimensions.bodyWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 2);
}

async function expectHorizontallyInsideViewport(locator: Locator, page: Page): Promise<void> {
  await expect(locator).toBeVisible();

  const box = await locator.boundingBox();

  const viewport = page.viewportSize();

  if (!box || !viewport) {
    throw new Error("Unable to determine element or viewport dimensions.");
  }

  expect(box.x).toBeGreaterThanOrEqual(-1);

  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
}

async function expectInsideViewport(locator: Locator, page: Page): Promise<void> {
  await expectHorizontallyInsideViewport(locator, page);

  const box = await locator.boundingBox();

  const viewport = page.viewportSize();

  if (!box || !viewport) {
    throw new Error("Unable to determine element or viewport dimensions.");
  }

  expect(box.y).toBeGreaterThanOrEqual(-1);

  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
}

async function expectButtonsInOneRow(first: Locator, second: Locator): Promise<void> {
  await expect(first).toBeVisible();
  await expect(second).toBeVisible();

  const firstBox = await first.boundingBox();

  const secondBox = await second.boundingBox();

  if (!firstBox || !secondBox) {
    throw new Error("Unable to determine action button positions.");
  }

  expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThanOrEqual(6);
}

async function expectButtonsStacked(upperButton: Locator, lowerButton: Locator): Promise<void> {
  await expect(upperButton).toBeVisible();

  await expect(lowerButton).toBeVisible();

  const upperBox = await upperButton.boundingBox();

  const lowerBox = await lowerButton.boundingBox();

  if (!upperBox || !lowerBox) {
    throw new Error("Unable to determine action button positions.");
  }

  expect(upperBox.y + upperBox.height).toBeLessThanOrEqual(lowerBox.y + 2);

  expect(Math.abs(upperBox.x - lowerBox.x)).toBeLessThanOrEqual(2);

  expect(Math.abs(upperBox.width - lowerBox.width)).toBeLessThanOrEqual(2);
}

test.describe("Scenario responsive layouts", () => {
  test.describe.configure({
    mode: "serial",
  });

  test.beforeEach(async () => {
    await resetScenarioTestProgress();
  });

  test.afterAll(async () => {
    await resetScenarioTestProgress();

    await disconnectScenarioTestDatabase();
  });

  test("adapts the scenario pathway between desktop, tablet and mobile layouts", async ({
    page,
  }) => {
    test.setTimeout(90_000);

    await page.setViewportSize(viewports.desktop);

    await signIn(page);

    await page.goto("/en/scenarios");

    const pathwayMap = page.getByTestId("scenario-pathway-map");

    const desktopPathwayNode = page.getByTestId("scenario-pathway-node-scenario-02");

    const mobilePathwayCard = page.getByTestId("scenario-pathway-card-scenario-02");

    await expect(pathwayMap).toBeVisible();

    await expect(desktopPathwayNode).toBeVisible();

    await expect(mobilePathwayCard).toBeHidden();

    await expectHorizontallyInsideViewport(pathwayMap, page);

    await expectNoHorizontalOverflow(page);

    /*
     * Mobile layout.
     */

    await page.setViewportSize(viewports.mobile);

    await expect(desktopPathwayNode).toBeHidden();

    await expect(mobilePathwayCard).toBeVisible();

    await expectHorizontallyInsideViewport(mobilePathwayCard, page);

    await expectNoHorizontalOverflow(page);

    /*
     * Tablet layout. Tailwind md begins
     * at 768 px.
     */

    await page.setViewportSize(viewports.tablet);

    await expect(desktopPathwayNode).toBeVisible();

    await expect(mobilePathwayCard).toBeHidden();

    await expectNoHorizontalOverflow(page);
  });

  test("adapts the scenario simulator between mobile, tablet, desktop and landscape layouts", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    /*
     * Player receives a fresh page and browser
     * context instead of reusing the pathway page.
     */

    await page.setViewportSize(viewports.mobile);

    await signIn(page);

    await openScenarioPlayer(page);

    const player = page.getByTestId("scenario-player");

    await expect(player).toHaveAttribute("data-view", "intro");

    /*
     * Intro — mobile.
     */

    const intro = page.getByTestId("scenario-intro");

    const introArticle = intro.locator("article");

    await expectInsideViewport(introArticle, page);

    await expectNoHorizontalOverflow(page);

    const continueButton = page.getByRole("button", {
      name: "Continue",
      exact: true,
    });

    await expectHorizontallyInsideViewport(continueButton, page);

    await continueButton.click();

    const startButton = page.getByRole("button", {
      name: "Start scenario",
    });

    await expectHorizontallyInsideViewport(startButton, page);

    await startButton.click();

    await expect(player).toHaveAttribute("data-view", "board");

    /*
     * Board — mobile.
     */

    const mobileChallengeCard = page.locator('button[data-scenario-mobile-card="0"]');

    const previewZone = page.getByTestId(`scenario-board-preview-zone-${challengeIds.priorities}`);

    await expect(mobileChallengeCard).toBeVisible();

    await expect(mobileChallengeCard).toBeEnabled();

    await expect(previewZone).toBeHidden();

    await expectHorizontallyInsideViewport(mobileChallengeCard, page);

    await expectNoHorizontalOverflow(page);

    /*
     * Board — tablet.
     */

    await page.setViewportSize(viewports.tablet);

    await expect(mobileChallengeCard).toBeHidden();

    await expect(previewZone).toBeVisible();

    await expectNoHorizontalOverflow(page);

    /*
     * Board — desktop.
     */

    await page.setViewportSize(viewports.desktop);

    await expect(previewZone).toBeVisible();

    await previewZone.hover();

    const visibleDesktopCard = page.locator(
      `[data-testid="scenario-board-card-${challengeIds.priorities}"]:visible`,
    );

    await expect(visibleDesktopCard).toBeVisible();

    await expectHorizontallyInsideViewport(visibleDesktopCard, page);

    await expectNoHorizontalOverflow(page);

    /*
     * Challenge — desktop.
     */

    const firstHotspot = page.getByTestId(`scenario-board-hotspot-${challengeIds.priorities}`);

    await expect(firstHotspot).toBeEnabled();

    await firstHotspot.click();

    await expect(player).toHaveAttribute("data-view", "challenge");

    const challenge = page.getByTestId("scenario-challenge");

    const challengeArticle = challenge.locator("article");

    await expectInsideViewport(challengeArticle, page);

    await page
      .getByRole("button", {
        name: "Continue to decision",
      })
      .click();

    await expect(challenge).toHaveAttribute("data-challenge-step", "decision");

    const backButton = page.getByRole("button", {
      name: "Back",
      exact: true,
    });

    const confirmButton = page.getByRole("button", {
      name: "Confirm decision",
    });

    await expectButtonsInOneRow(backButton, confirmButton);

    await expectInsideViewport(challengeArticle, page);

    await expectNoHorizontalOverflow(page);

    /*
     * Challenge — tablet.
     */

    await page.setViewportSize(viewports.tablet);

    await expectInsideViewport(challengeArticle, page);

    await expectButtonsInOneRow(backButton, confirmButton);

    await expectNoHorizontalOverflow(page);

    /*
     * Challenge — mobile.
     */

    await page.setViewportSize(viewports.mobile);

    await expectInsideViewport(challengeArticle, page);

    const decisionCards = page.locator('[data-testid^="scenario-decision-choice-"]');

    await expect(decisionCards).toHaveCount(3);

    for (let index = 0; index < 3; index += 1) {
      await expectHorizontallyInsideViewport(decisionCards.nth(index), page);
    }

    await expectButtonsStacked(confirmButton, backButton);

    await expectNoHorizontalOverflow(page);

    /*
     * Mobile landscape.
     */

    await page.setViewportSize(viewports.mobileLandscape);

    await expectInsideViewport(challengeArticle, page);

    await expect
      .poll(async () =>
        challengeArticle.evaluate((element) => window.getComputedStyle(element).overflowY),
      )
      .toBe("auto");

    await expectNoHorizontalOverflow(page);
  });
});
