import { expect, test } from "@playwright/test";

test.describe("IntegratESG public application", () => {
  test("loads the public home page", async ({ page }) => {
    const response = await page.goto("/");

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    await expect(page.locator("body")).toBeVisible();
  });

  test("renders the localized not-found page for an unknown route", async ({ page }) => {
    const response = await page.goto("/en/this-route-does-not-exist");

    expect(response).not.toBeNull();
    expect(response?.status()).toBe(404);

    await expect(page.locator("main").getByText("404", { exact: true }).first()).toBeVisible();
  });
});
