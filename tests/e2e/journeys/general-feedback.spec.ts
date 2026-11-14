import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { expect, test, type Page } from "@playwright/test";

import { assertE2EDatabaseReady } from "../helpers/assert-e2e-database-ready";
import { E2E_PG_POOL_MAX } from "../helpers/database-pool";
import { assertSafeE2EEnvironment, getE2EDatabaseUrl } from "../helpers/safe-test-environment";

function connect(): PrismaClient {
  assertSafeE2EEnvironment();
  const url = getE2EDatabaseUrl();
  if (!url) throw new Error("Missing isolated test database");
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: url, max: E2E_PG_POOL_MAX }),
    log: ["error"],
  });
}

async function signIn(page: Page) {
  const email = process.env.PLAYWRIGHT_TEST_EMAIL;
  const password = process.env.PLAYWRIGHT_TEST_PASSWORD;
  if (!email || !password) throw new Error("Missing isolated Playwright test credentials");
  await page.goto("/en/auth/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await Promise.all([
    page.waitForURL(/\/en\/dashboard(?:\?.*)?$/),
    page.getByRole("button", { name: "Login", exact: true }).click(),
  ]);
}

test.describe.configure({ mode: "serial" });
test.describe("General feedback lifecycle (isolated DB only)", () => {
  let db: PrismaClient;
  let initialized = false;

  test.beforeAll(async () => {
    db = connect();
    initialized = true;
    await assertE2EDatabaseReady(db);
  });
  test.afterAll(async () => {
    if (initialized) await db.$disconnect();
  });

  test("admin filters individual evaluations and exports precisely the filtered records", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const email = process.env.PLAYWRIGHT_TEST_EMAIL;
    if (!email) throw new Error("Missing E2E email");
    const profile = await db.profile.findUnique({ where: { email } });
    if (!profile) throw new Error("Missing E2E profile in isolated DB");
    const roundKey = `e2e-evaluation-${Date.now()}`;
    let savedId: string | null = null;
    try {
      await db.profile.update({ where: { id: profile.id }, data: { role: "admin" } });
      const saved = await db.surveySubmission.create({
        data: {
          userId: profile.id,
          surveyType: "wp4_scenarios",
          surveyVersion: 1,
          roundKey,
          locale: "el",
          countryCode: "XQ", // isolated fixture country code, impossible in real partner records
          roleAtSubmission: "learner",
          isPilotAtSubmission: true,
          pilotCohortCode: "e2e-cohort",
          answers: {
            incorporationEase: 5,
            participantEngagement: 4,
            challenges: "private E2E text",
          },
          activitySnapshot: { scenariosCompleted: 1 },
        },
      });
      savedId = saved.id;
      await signIn(page);
      await page.goto(
        "/en/admin/evaluation/responses?country=XQ&survey=wp4_scenarios&group=pilot&role=learner",
      );
      await expect(page.getByRole("status")).toContainText("1 responses");
      await expect(page.getByText("XQ").last()).toBeVisible();
      await page.getByText("View answers").click();
      await expect(page.getByText("private E2E text")).toBeVisible();
      const downloaded = await page.request.get(
        "/en/admin/evaluation/responses/export?country=XQ&survey=wp4_scenarios&group=pilot&role=learner",
      );
      expect(downloaded.status()).toBe(200);
      expect(downloaded.headers()["cache-control"]).toContain("no-store");
      const csv = await downloaded.text();
      expect(csv).toContain('"XQ"');
      expect(csv).toContain('"wp4_scenarios"');
      expect(csv).not.toContain(profile.id);
      expect(csv).not.toContain(profile.email);
      expect(csv).not.toContain("private E2E text");
      const qualitative = await page.request.get(
        "/en/admin/evaluation/responses/export?country=XQ&survey=wp4_scenarios&includeText=1",
      );
      expect(await qualitative.text()).toContain("private E2E text");
    } finally {
      if (savedId) await db.surveySubmission.deleteMany({ where: { id: savedId } });
      await db.profile.update({ where: { id: profile.id }, data: { role: profile.role } });
    }
  });

  test("learner and educator submit, admin filters and deletes without affecting pilot surveys", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const email = process.env.PLAYWRIGHT_TEST_EMAIL;
    if (!email) throw new Error("Missing E2E email");
    const profile = await db.profile.findUnique({ where: { email } });
    if (!profile) throw new Error("Missing E2E profile in isolated DB");
    const marker = `e2e-general-feedback-${Date.now()}`;
    const pilotBefore = await db.surveySubmission.count({
      where: { userId: profile.id, surveyType: { in: ["platform_wp3", "platform_wp4"] } },
    });
    try {
      await signIn(page);
      for (const role of ["learner", "educator"] as const) {
        await db.profile.update({ where: { id: profile.id }, data: { role } });
        // Clear only the tagged reports in this disposable test environment between roles.
        await db.surveySubmission.deleteMany({
          where: {
            userId: profile.id,
            surveyType: "general_platform_feedback",
            answers: { path: ["message"], string_contains: marker },
          },
        });
        await page.goto("/en/admin/feedback");
        await expect(page).toHaveURL(/\/en\/dashboard$/);
        await page.goto("/en/admin/evaluation/responses");
        await expect(page).toHaveURL(/\/en\/dashboard$/);
        const forbiddenCsv = await page.request.get("/en/admin/evaluation/responses/export", {
          maxRedirects: 0,
        });
        expect(forbiddenCsv.status()).not.toBe(200);
        await page.goto("/en/dashboard");
        await expect(page.locator('a[href="/en/feedback"]')).toBeVisible();
        await page.locator('a[href="/en/feedback"]').click();
        await page.getByLabel("Feedback topic").selectOption("bug");
        await page.getByLabel("Your message").fill(`${marker} ${role}`);
        await page.getByRole("button", { name: "Submit feedback" }).click();
        await expect(page.getByRole("status")).toContainText("Thank you");
        await expect
          .poll(() =>
            db.surveySubmission.count({
              where: {
                userId: profile.id,
                surveyType: "general_platform_feedback",
                answers: { path: ["message"], string_contains: marker },
              },
            }),
          )
          .toBe(1);
        const pilotAfter = await db.surveySubmission.count({
          where: { userId: profile.id, surveyType: { in: ["platform_wp3", "platform_wp4"] } },
        });
        expect(pilotAfter).toBe(pilotBefore);
        if (role === "learner") {
          await db.surveySubmission.deleteMany({
            where: {
              userId: profile.id,
              surveyType: "general_platform_feedback",
              answers: { path: ["message"], string_contains: marker },
            },
          });
        }
      }
      await db.profile.update({ where: { id: profile.id }, data: { role: "admin" } });
      await page.goto("/en/dashboard");
      await expect(page.locator('a[href="/en/feedback"]')).toHaveCount(0);
      await page.goto("/en/feedback");
      await expect(page).toHaveURL(/\/en\/dashboard$/);
      await page.goto("/en/admin/feedback?category=bug");
      await expect(page.getByText(`${marker} educator`)).toBeVisible();
      page.once("dialog", async (dialog) => {
        await dialog.accept();
      });
      await page
        .getByRole("row")
        .filter({ hasText: `${marker} educator` })
        .getByRole("button", { name: "Delete" })
        .click();
      await expect(page.getByText(`${marker} educator`)).toHaveCount(0);
      await page.goto("/en/admin/stats");
      await expect(page).toHaveURL(/\/en\/admin\/stats$/);
    } finally {
      await db.surveySubmission.deleteMany({
        where: {
          userId: profile.id,
          surveyType: "general_platform_feedback",
          answers: { path: ["message"], string_contains: marker },
        },
      });
      await db.profile.update({ where: { id: profile.id }, data: { role: profile.role } });
    }
  });
});
