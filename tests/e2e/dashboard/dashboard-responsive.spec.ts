import { expect, test, type Locator, type Page } from "@playwright/test";

const dashboardPath = "/en/dashboard";

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
} as const;

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name} in the Playwright test environment.`);
  }

  return value;
}

function getCredentials() {
  return {
    email: requireEnvironmentVariable("PLAYWRIGHT_TEST_EMAIL"),
    password: requireEnvironmentVariable("PLAYWRIGHT_TEST_PASSWORD"),
  };
}

async function signIn(page: Page): Promise<void> {
  const { email, password } = getCredentials();

  await page.goto("/en/auth/login");

  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);

  await Promise.all([
    page.waitForURL(/\/en\/dashboard(?:\?.*)?$/),
    page
      .getByRole("button", {
        name: "Login",
        exact: true,
      })
      .click(),
  ]);
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

test.describe.configure({
  mode: "serial",
});

test.describe("Dashboard responsive layout", () => {
  test("keeps the authenticated dashboard usable without horizontal overflow", async ({ page }) => {
    test.setTimeout(60_000);

    await signIn(page);

    for (const viewport of Object.values(viewports)) {
      await page.setViewportSize(viewport);

      const response = await page.goto(dashboardPath, {
        waitUntil: "domcontentloaded",
      });

      expect(response).not.toBeNull();
      expect(response?.status()).toBeLessThan(400);

      const main = page.locator("main").first();
      const heading = main.getByRole("heading", { level: 1 }).first();
      const eportfolioLink = main.locator('a[href="/en/eportfolio"]').first();
      const primaryLearningLink = main
        .locator('a[href="/en/scenarios"], a[href="/en/curriculum"]')
        .first();

      await expect(main).toBeVisible();
      await expect(heading).toBeVisible();
      await expect(eportfolioLink).toBeVisible();
      await expect(primaryLearningLink).toBeVisible();

      await page.waitForTimeout(450);

      await expectNoHorizontalOverflow(page);
      await expectHorizontallyInsideViewport(heading, page);
      await expectHorizontallyInsideViewport(eportfolioLink, page);
      await expectHorizontallyInsideViewport(primaryLearningLink, page);
    }
  });
});
