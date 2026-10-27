import { createHash } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { expect, test, type Page } from "@playwright/test";

import { assertSafeE2EEnvironment } from "../helpers/safe-test-environment";
import { assertE2EDatabaseReady } from "../helpers/assert-e2e-database-ready";

const RATINGS = [
  "contentClarity",
  "practicalRelevance",
  "usability",
  "overallSatisfaction",
] as const;
const LOCALES = ["en", "pl", "de", "it", "el", "bg"] as const;

function connect(): PrismaClient {
  assertSafeE2EEnvironment();
  const url = process.env.PLAYWRIGHT_DATABASE_URL || process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("Missing isolated test DATABASE_URL");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }), log: ["error"] });
}

async function testProfile(db: PrismaClient) {
  const email = process.env.PLAYWRIGHT_TEST_EMAIL;
  if (!email) throw new Error("Missing PLAYWRIGHT_TEST_EMAIL");
  const profile = await db.profile.findUnique({ where: { email } });
  if (!profile) throw new Error(`No test Profile for ${email} in isolated DB`);
  return profile;
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

test.describe("Pilot integration, permissions and certificates (isolated DB only)", () => {
  let db: PrismaClient;

  test.beforeAll(async () => {
    db = connect();
    await assertE2EDatabaseReady(db);
  });

  test.afterAll(async () => {
    if (db) await db.$disconnect();
  });

  test("rejects unauthenticated access to protected areas and certificates", async ({ page }) => {
    for (const path of [
      "/en/curriculum",
      "/en/eportfolio",
      "/en/scenarios",
      "/en/pilot-satisfaction/curriculum",
      "/en/platform-feedback",
    ]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/en\/auth\/login(?:\?.*)?$/);
    }
    const response = await page.request.get(
      "/api/curriculum/module-1-introduction-to-esg-and-sustainable-development/certificate?locale=en",
    );
    expect(response.status()).toBe(401);
  });

  test("enforces learner, educator and admin role boundaries", async ({ page }) => {
    const profile = await testProfile(db);
    await signIn(page);
    try {
      await db.profile.update({ where: { id: profile.id }, data: { role: "learner" } });
      await page.goto("/en/eportfolio");
      await expect(page).toHaveURL(/\/en\/eportfolio$/);
      await page.goto("/en/curriculum");
      await expect(page).toHaveURL(/\/en\/dashboard$/);
      await page.goto("/en/admin/stats");
      await expect(page).toHaveURL(/\/en\/dashboard$/);

      await db.profile.update({ where: { id: profile.id }, data: { role: "educator" } });
      await page.goto("/en/curriculum");
      await expect(page).toHaveURL(/\/en\/curriculum$/);
      await page.goto("/en/admin/stats");
      await expect(page).toHaveURL(/\/en\/dashboard$/);

      await db.profile.update({ where: { id: profile.id }, data: { role: "admin" } });
      await page.goto("/en/admin/stats");
      await expect(page).toHaveURL(/\/en\/admin\/stats$/);
      await page.goto("/en/curriculum");
      await expect(page).toHaveURL(/\/en\/dashboard$/);
    } finally {
      await db.profile.update({ where: { id: profile.id }, data: { role: profile.role } });
    }
  });

  test("submits both satisfaction surveys, persists ratings and prevents duplicates", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const profile = await testProfile(db);
    const caseStudy = await db.caseStudy.findUnique({ where: { slug: "barilla" } });
    if (caseStudy?.status !== "published") {
      throw new Error("Test DB must contain the published Barilla case study");
    }
    const existing = await db.pilotSatisfactionSubmission.count({ where: { userId: profile.id } });
    if (existing > 0) {
      throw new Error(
        "Use a fresh disposable E2E test user without prior satisfaction submissions",
      );
    }
    const oldPilot = await db.curriculumPilot.findUnique({ where: { userId: profile.id } });
    const oldProgress = await db.userCaseStudyProgress.findUnique({
      where: { userId_caseStudyId: { userId: profile.id, caseStudyId: caseStudy.id } },
    });
    try {
      const now = new Date();
      await db.profile.update({ where: { id: profile.id }, data: { role: "educator" } });
      await db.curriculumPilot.upsert({
        where: { userId: profile.id },
        update: { status: "pilot_completed", postAssessmentCompletedAt: now },
        create: { userId: profile.id, status: "pilot_completed", postAssessmentCompletedAt: now },
      });
      await db.userCaseStudyProgress.upsert({
        where: { userId_caseStudyId: { userId: profile.id, caseStudyId: caseStudy.id } },
        update: { status: "completed", completedAt: now, startedAt: now, lastOpenedAt: now },
        create: {
          userId: profile.id,
          caseStudyId: caseStudy.id,
          status: "completed",
          completedAt: now,
          startedAt: now,
          lastOpenedAt: now,
        },
      });

      await signIn(page);
      for (const scope of ["curriculum", "eportfolio"] as const) {
        await page.goto(`/en/pilot-satisfaction/${scope}`);
        await expect(page.locator("form")).toBeVisible();
        await page.locator("select").first().selectOption("PL");
        if (scope === "eportfolio") await page.locator("select").nth(1).selectOption(caseStudy.id);
        for (const rating of RATINGS) {
          await page.locator(`input[type="radio"][name="${rating}"][value="5"]`).check();
        }
        await page.locator('form button[type="submit"]').click();
        await expect(page.getByRole("status")).toBeVisible();
        await expect
          .poll(async () =>
            db.pilotSatisfactionSubmission.count({
              where: { userId: profile.id, scope },
            }),
          )
          .toBe(1);
        const saved = await db.pilotSatisfactionSubmission.findUnique({
          where: { userId_scope: { userId: profile.id, scope } },
        });
        expect(saved).toMatchObject({ countryCode: "PL", overallSatisfaction: 5 });
        await page.reload();
        await expect(page.getByRole("status")).toBeVisible();
        await expect(page.locator("form")).toHaveCount(0);
      }
    } finally {
      await db.pilotSatisfactionSubmission.deleteMany({
        where: { userId: profile.id, scope: { in: ["curriculum", "eportfolio"] } },
      });
      if (oldProgress) {
        await db.userCaseStudyProgress.update({
          where: { id: oldProgress.id },
          data: {
            status: oldProgress.status,
            startedAt: oldProgress.startedAt,
            completedAt: oldProgress.completedAt,
            lastOpenedAt: oldProgress.lastOpenedAt,
          },
        });
      } else {
        await db.userCaseStudyProgress.deleteMany({
          where: { userId: profile.id, caseStudyId: caseStudy.id },
        });
      }
      if (oldPilot) {
        await db.curriculumPilot.update({
          where: { userId: profile.id },
          data: {
            status: oldPilot.status,
            preAssessmentSeenAt: oldPilot.preAssessmentSeenAt,
            preAssessmentSkippedAt: oldPilot.preAssessmentSkippedAt,
            preAssessmentCompletedAt: oldPilot.preAssessmentCompletedAt,
            postAssessmentCompletedAt: oldPilot.postAssessmentCompletedAt,
            preAssessmentAverageScore: oldPilot.preAssessmentAverageScore,
            postAssessmentAverageScore: oldPilot.postAssessmentAverageScore,
            assessmentAverageScoreDelta: oldPilot.assessmentAverageScoreDelta,
          },
        });
      } else {
        await db.curriculumPilot.deleteMany({ where: { userId: profile.id } });
      }
      await db.profile.update({ where: { id: profile.id }, data: { role: profile.role } });
    }
  });

  test("completes the pilot pre-/post-assessments and persists the results", async ({ page }) => {
    test.setTimeout(180_000);
    const profile = await testProfile(db);
    const previousPilot = await db.curriculumPilot.findUnique({
      where: { userId: profile.id },
      include: { submissions: true },
    });
    if (previousPilot?.submissions.length) {
      throw new Error(
        "Pre/post E2E requires a fresh disposable test account without earlier pilot submissions",
      );
    }
    const activeQuestions = await db.curriculumPilotQuestion.count({ where: { isActive: true } });
    if (activeQuestions === 0)
      throw new Error(
        "Test DB needs the official pilot assessment questions (seed only the isolated DB)",
      );
    const slug = `playwright-e2e-pilot-module-${Date.now()}`;
    let courseId: string | null = null;
    try {
      await db.profile.update({ where: { id: profile.id }, data: { role: "educator" } });
      await db.curriculumPilot.upsert({
        where: { userId: profile.id },
        update: {
          status: "pre_prompt_shown",
          preAssessmentSeenAt: new Date(),
          preAssessmentSkippedAt: null,
          preAssessmentCompletedAt: null,
          postAssessmentCompletedAt: null,
          preAssessmentAverageScore: null,
          postAssessmentAverageScore: null,
          assessmentAverageScoreDelta: null,
        },
        create: { userId: profile.id, status: "pre_prompt_shown", preAssessmentSeenAt: new Date() },
      });
      await signIn(page);
      await page.goto("/en/curriculum/pilot/pre-assessment");
      await expect(page).toHaveURL(/\/en\/curriculum\/pilot\/pre-assessment/);
      const preFields = page.locator("form fieldset");
      expect(await preFields.count()).toBeGreaterThan(0);
      for (let i = 0; i < (await preFields.count()); i += 1) {
        await preFields.nth(i).locator('input[type="radio"]').first().check();
      }
      await page.locator('form button[type="submit"]').click();
      // A POST 200 is not enough: assert that the server action committed the pilot state.
      await expect
        .poll(
          async () => {
            const pilot = await db.curriculumPilot.findUnique({ where: { userId: profile.id } });
            return { status: pilot?.status, completed: Boolean(pilot?.preAssessmentCompletedAt) };
          },
          {
            message: "Pre-assessment answers must be persisted before navigation",
            timeout: 15_000,
          },
        )
        .toEqual({ status: "pilot_active", completed: true });
      await expect(
        page,
        "Pre-assessment must navigate to Curriculum after a successful save",
      ).toHaveURL(/\/en\/curriculum(?:\?.*)?$/, { timeout: 15_000 });
      const pilotAfterPre = await db.curriculumPilot.findUnique({ where: { userId: profile.id } });
      expect(pilotAfterPre?.preAssessmentCompletedAt).not.toBeNull();
      expect(pilotAfterPre?.status).toBe("pilot_active");

      const course = await db.course.create({
        data: {
          slug,
          status: "published",
          area: "cross_cutting",
          difficulty: "foundation",
          sortOrder: -99999,
          lessonsCount: 0,
          translations: {
            create: [{ language: "en", title: "Playwright completed pilot module" }],
          },
        },
      });
      courseId = course.id;
      await db.userCourseAttempt.create({
        data: {
          userId: profile.id,
          courseId: course.id,
          status: "completed",
          currentStage: "completed",
          completedAt: new Date(),
          startedAt: new Date(),
          lastOpenedAt: new Date(),
          progressPercent: 100,
        },
      });
      await page.goto("/en/curriculum/pilot/post-assessment");
      await expect(page).toHaveURL(/\/en\/curriculum\/pilot\/post-assessment/);
      const postFields = page.locator("form fieldset");
      expect(await postFields.count()).toBeGreaterThan(0);
      for (let i = 0; i < (await postFields.count()); i += 1) {
        const field = postFields.nth(i);
        const radio = field.locator('input[type="radio"]');
        if (await radio.count()) await radio.first().check();
        else await field.locator("textarea").fill("Playwright pilot assessment test response");
      }
      await page.locator('form button[type="submit"]').click();
      await expect
        .poll(
          async () => {
            const pilot = await db.curriculumPilot.findUnique({ where: { userId: profile.id } });
            return { status: pilot?.status, completed: Boolean(pilot?.postAssessmentCompletedAt) };
          },
          {
            message: "Post-assessment answers must be persisted before navigation",
            timeout: 15_000,
          },
        )
        .toEqual({ status: "pilot_completed", completed: true });
      await expect(
        page,
        "Post-assessment must navigate to Curriculum feedback after a successful save",
      ).toHaveURL(/\/en\/pilot-satisfaction\/curriculum$/, { timeout: 15_000 });
      const pilotAfterPost = await db.curriculumPilot.findUnique({
        where: { userId: profile.id },
        include: { submissions: true },
      });
      expect(pilotAfterPost?.status).toBe("pilot_completed");
      expect(pilotAfterPost?.postAssessmentCompletedAt).not.toBeNull();
      expect(pilotAfterPost?.submissions.map((submission) => submission.type).sort()).toEqual([
        "post",
        "pre",
      ]);
    } finally {
      if (courseId) await db.course.deleteMany({ where: { id: courseId } });
      const pilot = await db.curriculumPilot.findUnique({ where: { userId: profile.id } });
      if (pilot) await db.curriculumPilotSubmission.deleteMany({ where: { pilotId: pilot.id } });
      if (previousPilot) {
        await db.curriculumPilot.update({
          where: { userId: profile.id },
          data: {
            status: previousPilot.status,
            preAssessmentSeenAt: previousPilot.preAssessmentSeenAt,
            preAssessmentSkippedAt: previousPilot.preAssessmentSkippedAt,
            preAssessmentCompletedAt: previousPilot.preAssessmentCompletedAt,
            postAssessmentCompletedAt: previousPilot.postAssessmentCompletedAt,
            preAssessmentAverageScore: previousPilot.preAssessmentAverageScore,
            postAssessmentAverageScore: previousPilot.postAssessmentAverageScore,
            assessmentAverageScoreDelta: previousPilot.assessmentAverageScoreDelta,
          },
        });
      } else {
        await db.curriculumPilot.deleteMany({ where: { userId: profile.id } });
      }
      await db.profile.update({ where: { id: profile.id }, data: { role: profile.role } });
    }
  });

  test("submits the platform-wide feedback survey and persists its answers", async ({ page }) => {
    test.setTimeout(120_000);
    const profile = await testProfile(db);
    const existingFeedback = await db.platformFeedbackSubmission.count({
      where: { userId: profile.id },
    });
    if (existingFeedback > 0) {
      throw new Error("Platform feedback E2E requires a fresh disposable test account");
    }
    const existingReminder = await db.platformFeedbackReminder.findUnique({
      where: { userId: profile.id },
    });
    const fields = [
      "easeOfUse",
      "moduleClarity",
      "navigation",
      "testsExperience",
      "technicalProblems",
      "overallSatisfaction",
    ];
    try {
      await db.profile.update({ where: { id: profile.id }, data: { role: "educator" } });
      await signIn(page);
      await page.goto("/en/platform-feedback");
      await expect(page.locator("form")).toBeVisible();
      for (const name of fields) {
        await page.locator(`input[type="radio"][name="${name}"][value="5"]`).check();
      }
      await page.locator('form button[type="submit"]').click();
      await expect
        .poll(async () =>
          db.platformFeedbackSubmission.count({
            where: { userId: profile.id },
          }),
        )
        .toBe(1);
      const saved = await db.platformFeedbackSubmission.findFirst({
        where: { userId: profile.id },
      });
      expect(saved).not.toBeNull();
      expect(saved).toMatchObject({
        easeOfUse: 5,
        moduleClarity: 5,
        navigation: 5,
        testsExperience: 5,
        technicalProblems: 5,
        overallSatisfaction: 5,
      });
      await expect(page.getByRole("heading", { level: 1 })).toContainText("Thank");
    } finally {
      await db.platformFeedbackSubmission.deleteMany({ where: { userId: profile.id } });
      if (existingReminder) {
        await db.platformFeedbackReminder.update({
          where: { userId: profile.id },
          data: {
            dismissedAt: existingReminder.dismissedAt,
            remindLaterAt: existingReminder.remindLaterAt,
            submittedAt: existingReminder.submittedAt,
          },
        });
      } else {
        await db.platformFeedbackReminder.deleteMany({ where: { userId: profile.id } });
      }
      await db.profile.update({ where: { id: profile.id }, data: { role: profile.role } });
    }
  });

  test("rejects locked certificates and downloads localized PDFs in six languages", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    const profile = await testProfile(db);
    const slug = `playwright-e2e-certificate-${Date.now()}`;
    const oldRole = profile.role;
    const names: Record<(typeof LOCALES)[number], string> = {
      en: "Certificate integration module",
      pl: "Moduł testowy certyfikatu",
      de: "Zertifikat-Testmodul",
      it: "Modulo di prova del certificato",
      el: "Δοκιμαστική ενότητα πιστοποιητικού",
      bg: "Тестов модул за сертификат",
    };
    let courseId: string | null = null;
    try {
      await db.profile.update({ where: { id: profile.id }, data: { role: "educator" } });
      const course = await db.course.create({
        data: {
          slug,
          status: "published",
          area: "cross_cutting",
          difficulty: "foundation",
          lessonsCount: 0,
          estimatedDurationMinutes: 5,
          sortOrder: -99999,
          translations: {
            create: LOCALES.map((language) => ({ language, title: names[language] })),
          },
          quizzes: {
            create: [{ type: "post", sortOrder: 1, passingScore: 75 }],
          },
        },
        include: { quizzes: true },
      });
      courseId = course.id;
      const quizId = course.quizzes[0]?.id;
      if (!quizId) throw new Error("Test post-quiz fixture was not created");
      await signIn(page);
      const endpoint = (locale: string) => `/api/curriculum/${slug}/certificate?locale=${locale}`;
      const before = await page.request.get(endpoint("en"));
      expect(before.status()).toBe(403);

      const now = new Date();
      await db.userCourseAttempt.create({
        data: {
          userId: profile.id,
          courseId: course.id,
          status: "completed",
          currentStage: "completed",
          progressPercent: 100,
          startedAt: now,
          lastOpenedAt: now,
          completedAt: now,
          postQuizAttempts: [
            {
              quizId,
              quizType: "post",
              quizSortOrder: 1,
              attemptNumber: 1,
              score: 100,
              correctCount: 1,
              totalQuestions: 1,
              passed: true,
              submittedAt: now.toISOString(),
              flaggedQuestionIds: [],
            },
          ],
        },
      });

      const hashes = new Set<string>();
      for (const locale of LOCALES) {
        const response = await page.request.get(endpoint(locale));
        expect(response.status(), `Certificate API status for ${locale}`).toBe(200);
        expect(response.headers()["content-type"]).toContain("application/pdf");
        expect(response.headers()["content-disposition"]).toContain(slug);
        const pdf = await response.body();
        expect(pdf.subarray(0, 5).toString("latin1")).toBe("%PDF-");
        expect(pdf.byteLength).toBeGreaterThan(2500);
        hashes.add(createHash("sha256").update(pdf).digest("hex"));
      }
      expect(hashes.size, "Six certificate locales should not generate identical PDFs").toBe(6);
    } finally {
      if (courseId) await db.course.deleteMany({ where: { id: courseId } });
      await db.profile.update({ where: { id: profile.id }, data: { role: oldRole } });
    }
  });
});
