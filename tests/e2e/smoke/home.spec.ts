import { expect, test } from "@playwright/test";

test.describe("IntegratESG public application", () => {
  test("loads the public home page", async ({ page }) => {
    const response = await page.goto("/");

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    await expect(page.locator("body")).toBeVisible();
  });
});
