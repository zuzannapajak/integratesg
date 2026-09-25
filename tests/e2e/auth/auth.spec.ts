import { expect, test, type Locator, type Page } from "@playwright/test";

const loginPath = "/en/auth/login";
const dashboardPath = "/en/dashboard";
const protectedPath = "/en/eportfolio";

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

async function fillLoginForm(page: Page, email: string, password: string) {
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
}

async function signIn(page: Page) {
  const { email, password } = getCredentials();

  await page.goto(loginPath);
  await fillLoginForm(page, email, password);

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

function getLogoutButton(page: Page): Locator {
  return page
    .getByRole("button", {
      name: /(?:log\s*out|logout|sign\s*out)/i,
    })
    .first();
}

async function revealLogoutButton(page: Page) {
  const accountMenuButton = page.locator('button[aria-haspopup="menu"]').first();

  await expect(accountMenuButton).toBeVisible();

  if ((await accountMenuButton.getAttribute("aria-expanded")) !== "true") {
    await accountMenuButton.click();
  }

  await expect(accountMenuButton).toHaveAttribute("aria-expanded", "true");

  const logoutButton = getLogoutButton(page);

  await expect(logoutButton).toBeVisible();
  await expect(logoutButton).toBeEnabled();

  return logoutButton;
}

test.describe.configure({
  mode: "serial",
});

test.describe("authentication", () => {
  test("redirects an unauthenticated protected request to the locale-specific login page", async ({
    page,
  }) => {
    await page.goto(protectedPath);

    await expect(page).toHaveURL(/\/en\/auth\/login(?:\?.*)?$/);

    await expect(
      page.getByRole("button", {
        name: "Login",
        exact: true,
      }),
    ).toBeVisible();
  });

  test("does not create a session for invalid credentials", async ({ page }) => {
    const { email, password } = getCredentials();

    await page.goto(loginPath);

    await fillLoginForm(page, email, `${password}-definitely-invalid`);

    const loginButton = page.getByRole("button", {
      name: "Login",
      exact: true,
    });

    await loginButton.click();

    await expect(page).toHaveURL(/\/en\/auth\/login(?:\?.*)?$/);

    await expect(loginButton).toBeEnabled();

    await page.goto(protectedPath);

    await expect(page).toHaveURL(/\/en\/auth\/login(?:\?.*)?$/);
  });

  test("logs in with the configured test account and establishes a protected session", async ({
    page,
  }) => {
    await signIn(page);

    await expect(page).toHaveURL(/\/en\/dashboard(?:\?.*)?$/);

    await page.goto(protectedPath);

    await expect(page).toHaveURL(/\/en\/eportfolio$/);

    await expect(
      page.getByRole("heading", {
        name: "ESG case study library",
        exact: true,
      }),
    ).toBeVisible();
  });

  test("logout removes the session and prevents returning to protected content", async ({
    page,
  }) => {
    await signIn(page);

    await expect(page).toHaveURL(/\/en\/dashboard(?:\?.*)?$/);

    const logoutButton = await revealLogoutButton(page);

    await logoutButton.click();

    await expect
      .poll(() => new URL(page.url()).pathname, {
        message: "Expected logout to leave the authenticated dashboard.",
      })
      .not.toBe(dashboardPath);

    await page.goto(protectedPath);

    await expect(page).toHaveURL(/\/en\/auth\/login(?:\?.*)?$/);
  });
});
