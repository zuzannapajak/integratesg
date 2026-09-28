import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousAccessibilityViolations } from "../helpers/accessibility";

const loginPath = "/en/auth/login";

function requireEnvironmentVariable(name: string) {
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

async function signIn(page: Page) {
  const { email, password } = getCredentials();

  await page.goto(loginPath);

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

test.describe.configure({
  mode: "serial",
});

test.describe("accessibility smoke", () => {
  test("declares the active page language on the html element", async ({ page }) => {
    await page.goto("/pl");

    await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  });

  test("login form exposes labels, an accessible submit button and an alert for invalid credentials", async ({
    page,
  }) => {
    const { email, password } = getCredentials();

    await page.goto(loginPath);

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByLabel("Email address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    const loginButton = page.getByRole("button", {
      name: "Login",
      exact: true,
    });

    await expect(loginButton).toBeVisible();

    await expectNoSeriousAccessibilityViolations(page);

    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Password").fill(`${password}-invalid-for-a11y`);

    await loginButton.click();

    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("learner-accessible protected surfaces have no serious or critical axe violations", async ({
    page,
  }) => {
    await signIn(page);

    const protectedPaths = ["/en/dashboard", "/en/eportfolio", "/en/scenarios"] as const;

    for (const path of protectedPaths) {
      await page.goto(path);

      await expect(page).toHaveURL(new RegExp(`${path.replaceAll("/", "\\/")}(?:\\?.*)?$`));
      await expect(page.locator("main").first()).toBeVisible();

      await expectNoSeriousAccessibilityViolations(page);
    }
  });
});
