import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";

import {
  cleanupCurriculumTestState,
  disconnectCurriculumTestDatabase,
  getCurriculumTestCredentials,
  readCurriculumTestProgress,
  resetCurriculumTestProgress,
  type CurriculumE2EFixture,
} from "./curriculum-test-database";

const curriculumPath = "/en/curriculum";

async function signIn(page: Page): Promise<void> {
  const { email, password } = getCurriculumTestCredentials();

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

function curriculumCard(page: Page, title: string): Locator {
  return page.locator("article").filter({
    has: page.getByRole("heading", {
      name: title,
      exact: true,
    }),
  });
}

function isMobileProject(testInfo: TestInfo) {
  return testInfo.project.name === "curriculum-mobile";
}

async function expectNoDocumentOverflow(page: Page, testInfo: TestInfo): Promise<void> {
  if (!isMobileProject(testInfo)) {
    return;
  }

  const overflow = await page.evaluate(() => {
    const root = document.documentElement;

    return root.scrollWidth - root.clientWidth;
  });

  expect(overflow).toBeLessThanOrEqual(1);
}

async function expectAttempt(
  fixture: CurriculumE2EFixture,
  expected: {
    status: "not_started" | "in_progress" | "completed" | "failed";
    currentStage: "overview" | "pre_quiz" | "lessons" | "post_quiz" | "completed";
    currentLessonIndex: number;
    completedLessons: number;
    progressPercent: number;
  },
) {
  const attempt = await readCurriculumTestProgress(fixture.userId, fixture.courseId);

  if (!attempt) {
    throw new Error(
      `Expected a curriculum attempt for user ${fixture.userId} and course ${fixture.courseId}.`,
    );
  }

  expect(attempt).toMatchObject(expected);
  expect(attempt.startedAt).not.toBeNull();
  expect(attempt.lastOpenedAt).not.toBeNull();

  return attempt;
}

test.describe.configure({
  mode: "serial",
});

test.describe("Curriculum persisted user journey", () => {
  test.afterAll(async () => {
    await disconnectCurriculumTestDatabase();
  });

  test("logs in, completes both lessons and keeps progress after returning and reloading", async ({
    page,
  }, testInfo) => {
    test.setTimeout(120_000);

    let fixture: CurriculumE2EFixture | null = null;

    try {
      fixture = await resetCurriculumTestProgress(testInfo.project.name);

      await signIn(page);

      await page.goto(curriculumPath);

      await expect(
        page.getByRole("heading", {
          name: "Curriculum",
          exact: true,
        }),
      ).toBeVisible();

      await expectNoDocumentOverflow(page, testInfo);

      await page
        .getByRole("button", {
          name: "All modules",
          exact: true,
        })
        .click();

      await expect(page).toHaveURL(/\/en\/curriculum\?view=all-courses$/);

      const initialCard = curriculumCard(page, fixture.title);

      await expect(initialCard).toBeVisible();
      await expect(initialCard.getByText("Not started", { exact: true })).toBeVisible();
      await expect(initialCard.getByText("0%", { exact: true })).toBeVisible();

      await initialCard
        .getByRole("link", {
          name: "Continue",
          exact: true,
        })
        .click();

      await expect(page).toHaveURL(`/en/curriculum/${fixture.slug}`);

      await expect(
        page.getByRole("heading", {
          name: fixture.title,
          exact: true,
          level: 1,
        }),
      ).toBeVisible();

      await expect(page.getByText("0%", { exact: true })).toBeVisible();
      await expectNoDocumentOverflow(page, testInfo);

      await page
        .getByRole("link", {
          name: "Start the module",
          exact: true,
        })
        .click();

      await expect(page).toHaveURL(`/en/curriculum/${fixture.slug}/learn`);

      await expect(
        page.getByRole("button", {
          name: "Start module",
          exact: true,
        }),
      ).toBeVisible();

      await page
        .getByRole("button", {
          name: "Start module",
          exact: true,
        })
        .click();

      await expect(
        page.getByRole("heading", {
          name: fixture.firstLessonTitle,
          exact: true,
        }),
      ).toBeVisible();

      await expectNoDocumentOverflow(page, testInfo);

      await expectAttempt(fixture, {
        status: "in_progress",
        currentStage: "lessons",
        currentLessonIndex: 1,
        completedLessons: 0,
        progressPercent: 0,
      });

      await page
        .getByRole("button", {
          name: "Complete lesson and continue",
          exact: true,
        })
        .click();

      await expect(
        page.getByRole("heading", {
          name: fixture.secondLessonTitle,
          exact: true,
        }),
      ).toBeVisible();

      await expectNoDocumentOverflow(page, testInfo);

      await expectAttempt(fixture, {
        status: "in_progress",
        currentStage: "lessons",
        currentLessonIndex: 2,
        completedLessons: 1,
        progressPercent: 50,
      });

      await page.goto(curriculumPath);

      await expect(page).toHaveURL(/\/en\/curriculum$/);

      const persistedCard = curriculumCard(page, fixture.title);

      await expect(persistedCard).toBeVisible();
      await expect(persistedCard.getByText("In progress", { exact: true })).toBeVisible();
      await expect(persistedCard.getByText("50%", { exact: true })).toBeVisible();

      await expectNoDocumentOverflow(page, testInfo);

      await persistedCard
        .getByRole("link", {
          name: "Continue",
          exact: true,
        })
        .click();

      await expect(page).toHaveURL(`/en/curriculum/${fixture.slug}`);
      await expect(page.getByText("50%", { exact: true })).toBeVisible();

      await page
        .getByRole("link", {
          name: "Continue module",
          exact: true,
        })
        .click();

      await expect(page).toHaveURL(`/en/curriculum/${fixture.slug}/learn`);

      await expect(
        page.getByRole("heading", {
          name: fixture.secondLessonTitle,
          exact: true,
        }),
      ).toBeVisible();

      await page.reload();

      await expect(
        page.getByRole("heading", {
          name: fixture.secondLessonTitle,
          exact: true,
        }),
      ).toBeVisible();

      await expectNoDocumentOverflow(page, testInfo);

      await expectAttempt(fixture, {
        status: "in_progress",
        currentStage: "lessons",
        currentLessonIndex: 2,
        completedLessons: 1,
        progressPercent: 50,
      });

      await page
        .getByRole("button", {
          name: "Complete lesson and continue",
          exact: true,
        })
        .click();

      await expect(
        page.getByRole("heading", {
          name: "You’ve completed this learning module",
          exact: true,
        }),
      ).toBeVisible();

      await expect(page.getByText("100%", { exact: true })).toBeVisible();

      const completedAttempt = await expectAttempt(fixture, {
        status: "completed",
        currentStage: "completed",
        currentLessonIndex: 2,
        completedLessons: 2,
        progressPercent: 100,
      });

      expect(completedAttempt.completedAt).not.toBeNull();

      await page
        .getByRole("link", {
          name: "Explore more modules",
          exact: true,
        })
        .click();

      await expect(page).toHaveURL(/\/en\/curriculum$/);

      const completedCard = curriculumCard(page, fixture.title);

      await expect(completedCard).toBeVisible();
      await expect(completedCard.getByText("Completed", { exact: true })).toBeVisible();
      await expect(completedCard.getByText("100%", { exact: true })).toBeVisible();

      await expect(
        completedCard.getByRole("link", {
          name: "Review module",
          exact: true,
        }),
      ).toBeVisible();

      await page.reload();

      const reloadedCompletedCard = curriculumCard(page, fixture.title);

      await expect(reloadedCompletedCard.getByText("Completed", { exact: true })).toBeVisible();
      await expect(reloadedCompletedCard.getByText("100%", { exact: true })).toBeVisible();

      await expectNoDocumentOverflow(page, testInfo);
    } finally {
      if (fixture) {
        await cleanupCurriculumTestState(fixture);
      }
    }
  });
});
