import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  disconnectEportfolioTestDatabase,
  EPORTFOLIO_SLUGS,
  getEportfolioTestCredentials,
  readEportfolioProgress,
  resetEportfolioTestProgress,
} from "./eportfolio-test-database";

const libraryPath = "/en/eportfolio";
const testCaseSlug = "sofiyska-voda";
const testCaseTitle = "Sofiyska Voda AD";

async function signIn(page: Page): Promise<void> {
  const { email, password } = getEportfolioTestCredentials();

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

function caseStudyCard(page: Page, title: string): Locator {
  return page.locator("article").filter({
    has: page.getByRole("heading", {
      name: title,
      exact: true,
    }),
  });
}

async function expectNoDocumentOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;

    return root.scrollWidth - root.clientWidth;
  });

  expect(overflow).toBeLessThanOrEqual(1);
}

async function goToLastReadingStage(page: Page): Promise<void> {
  for (let step = 0; step < 10; step += 1) {
    const completionLink = page.getByRole("link", {
      name: "Next",
      exact: true,
    });

    if ((await completionLink.count()) > 0) {
      await expect(completionLink).toBeVisible();
      return;
    }

    const nextButton = page.getByRole("button", {
      name: "Next",
      exact: true,
    });

    await expect(nextButton).toBeVisible();
    await nextButton.click();
  }

  throw new Error("The ePortfolio case study did not reach its final reading stage.");
}

async function openSources(page: Page): Promise<Locator> {
  const sources = page.locator("details").filter({
    hasText: "Sources and references",
  });

  await expect(sources).toBeVisible();

  await sources.locator("summary").click();

  await expect(sources).toHaveAttribute("open", "");

  return sources;
}

test.describe.configure({
  mode: "serial",
});

test.describe("ePortfolio", () => {
  test.afterAll(async () => {
    try {
      await resetEportfolioTestProgress();
    } finally {
      await disconnectEportfolioTestDatabase();
    }
  });

  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto(libraryPath);

    await expect(page).toHaveURL(/\/en\/auth\/login(?:\?.*)?$/);
  });

  test("supports library search and the simplified filters", async ({ page }) => {
    await resetEportfolioTestProgress();
    await signIn(page);

    await page.goto(libraryPath);

    await expect(
      page.getByRole("heading", {
        name: "ESG case study library",
        exact: true,
      }),
    ).toBeVisible();

    for (const slug of EPORTFOLIO_SLUGS) {
      await expect(page.locator(`a[href="/en/eportfolio/${slug}"]`).first()).toBeVisible();
    }

    const search = page.getByRole("textbox", {
      name: "Search case studies",
    });

    await search.fill("wastewater");

    await expect(
      page.getByRole("heading", {
        name: testCaseTitle,
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByText("1 of 8 case studies", {
        exact: true,
      }),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name: "Clear filters",
      })
      .click();

    await page
      .getByRole("combobox", {
        name: "Filter by country",
      })
      .selectOption("BG");

    await expect(
      page.getByRole("heading", {
        name: testCaseTitle,
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "PZU S.A.",
        exact: true,
      }),
    ).toHaveCount(0);

    await page
      .getByRole("button", {
        name: "Clear filters",
      })
      .click();

    await page
      .getByRole("combobox", {
        name: "Filter by progress",
      })
      .selectOption("not_started");

    await expect(
      page.getByRole("heading", {
        name: testCaseTitle,
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("combobox", {
        name: "Filter by industry",
      }),
    ).toHaveCount(0);
  });

  test("opens all published case studies and exposes valid external references", async ({ page }) => {
    test.setTimeout(180_000);

    await resetEportfolioTestProgress();
    await signIn(page);

    for (const slug of EPORTFOLIO_SLUGS) {
      const response = await page.goto(`/en/eportfolio/${slug}`);

      expect(response, `No document response received for ${slug}.`).not.toBeNull();

      expect(
        response?.status(),
        `The ePortfolio route for ${slug} returned HTTP ${response?.status()}.`,
      ).toBeLessThan(400);

      await expect(
        page.getByRole("link", {
          name: "Back to ePortfolio",
          exact: true,
        }),
      ).toBeVisible();

      await expect(
        page.getByRole("progressbar", {
          name: "Case study reading progress",
        }),
      ).toBeVisible();

      const bodyText = await page.locator("body").innerText();

      expect(bodyText).not.toMatch(/\b(?:TBD|TODO|FIXME|PLACEHOLDER|undefined)\b/i);

      await goToLastReadingStage(page);

      const sources = await openSources(page);

      const sourceLinks = sources.locator('a[href^="http://"], a[href^="https://"]');

      expect(
        await sourceLinks.count(),
        `Expected at least one external source link for ${slug}.`,
      ).toBeGreaterThan(0);

      const hrefs = await sourceLinks.evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).href),
      );

      for (const href of hrefs) {
        const url = new URL(href);

        expect(["http:", "https:"]).toContain(url.protocol);
        expect(url.hostname).not.toBe("localhost");
        expect(url.hostname).not.toBe("127.0.0.1");
      }
    }
  });

  test("completes a case study and persists progress", async ({ page }) => {
    test.setTimeout(120_000);

    const userId = await resetEportfolioTestProgress();

    await signIn(page);

    await page.goto(`${libraryPath}/${testCaseSlug}`);

    await expect(
      page.getByRole("heading", {
        name: testCaseTitle,
        exact: true,
        level: 1,
      }),
    ).toBeVisible();

    await expect(page.getByText("Country", { exact: true })).toBeVisible();
    await expect(page.getByText("Industry", { exact: true })).toBeVisible();
    await expect(page.getByText("Reporting period", { exact: true })).toBeVisible();
    await expect(page.getByText("Source partner", { exact: true })).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Company overview",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "ESG integration",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByText(/Sofiyska Voda operates Bulgaria's only water public-private partnership/i),
    ).toHaveCount(1);

    const stages = [
      "Environmental",
      "Social",
      "Governance",
      "Evidence & compliance",
      "Key lessons & sources",
    ];

    for (const stage of stages) {
      await page
        .getByRole("button", {
          name: "Next",
          exact: true,
        })
        .click();

      await expect(
        page.getByRole("heading", {
          name: stage,
          exact: true,
          level: 2,
        }),
      ).toBeVisible();
    }

    const sources = await openSources(page);

    await expect(sources.locator("ol").first()).toBeVisible();

    await page
      .getByRole("link", {
        name: "Next",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL(new RegExp(`/en/eportfolio/${testCaseSlug}/complete$`));

    await expect(
      page.getByRole("heading", {
        name: "Complete case study",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", {
        name: "Back to ePortfolio",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Mark as completed",
        exact: true,
      }),
    ).toBeVisible();

    await expect(page.getByText(/^Finish /i)).toHaveCount(0);

    await page
      .getByRole("button", {
        name: "Mark as completed",
        exact: true,
      })
      .click();

    await expect(
      page.getByRole("heading", {
        name: `${testCaseTitle} completed`,
        exact: true,
      }),
    ).toBeVisible();

    const persisted = await readEportfolioProgress(userId, testCaseSlug);

    expect(persisted).not.toBeNull();
    expect(persisted?.status).toBe("completed");
    expect(persisted?.startedAt).not.toBeNull();
    expect(persisted?.lastOpenedAt).not.toBeNull();
    expect(persisted?.completedAt).not.toBeNull();

    await page.reload();

    await expect(
      page.getByRole("heading", {
        name: `${testCaseTitle} completed`,
        exact: true,
      }),
    ).toBeVisible();

    await page
      .getByRole("link", {
        name: "Back to ePortfolio",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL(/\/en\/eportfolio$/);

    const card = caseStudyCard(page, testCaseTitle);

    await expect(card).toBeVisible();

    await expect(
      card.getByText("Completed", {
        exact: true,
      }),
    ).toBeVisible();

    await page.reload();

    await expect(
      caseStudyCard(page, testCaseTitle).getByText("Completed", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("keeps library and long case-study content within the mobile viewport", async ({ page }) => {
    test.setTimeout(120_000);

    await resetEportfolioTestProgress();

    await page.setViewportSize({
      width: 375,
      height: 812,
    });

    await signIn(page);

    await page.goto(libraryPath);

    await expectNoDocumentOverflow(page);

    await page.locator(`a[href="/en/eportfolio/${testCaseSlug}"]`).first().click();

    await expect(
      page.getByRole("heading", {
        name: testCaseTitle,
        exact: true,
        level: 1,
      }),
    ).toBeVisible();

    await expectNoDocumentOverflow(page);

    await page.setViewportSize({
      width: 320,
      height: 812,
    });

    await expectNoDocumentOverflow(page);

    for (let step = 0; step < 5; step += 1) {
      await page
        .getByRole("button", {
          name: "Next",
          exact: true,
        })
        .click();

      await expectNoDocumentOverflow(page);
    }

    const sources = await openSources(page);

    await expect(sources.locator("ol").first()).toBeVisible();

    await expectNoDocumentOverflow(page);
  });
});
