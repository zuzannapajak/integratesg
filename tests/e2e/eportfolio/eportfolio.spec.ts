import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";

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

function isMobileProject(testInfo: TestInfo) {
  return testInfo.project.name === "eportfolio-mobile";
}

async function expectNoDocumentOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;

    return root.scrollWidth - root.clientWidth;
  });

  expect(overflow).toBeLessThanOrEqual(1);
}

async function expectMobileSafe(page: Page, testInfo: TestInfo): Promise<void> {
  if (!isMobileProject(testInfo)) {
    return;
  }

  await expectNoDocumentOverflow(page);
}

async function goToLastReadingStage(page: Page, testInfo?: TestInfo): Promise<void> {
  for (let step = 0; step < 10; step += 1) {
    const completionLink = page.getByRole("link", {
      name: "Next",
      exact: true,
    });

    if ((await completionLink.count()) > 0) {
      await expect(completionLink).toBeVisible();

      if (testInfo) {
        await expectMobileSafe(page, testInfo);
      }

      return;
    }

    const nextButton = page.getByRole("button", {
      name: "Next",
      exact: true,
    });

    await expect(nextButton).toBeVisible();

    await nextButton.click();

    if (testInfo) {
      await expectMobileSafe(page, testInfo);
    }
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

  test("supports search and combined country, industry and progress filters", async ({
    page,
  }, testInfo) => {
    await resetEportfolioTestProgress();

    await signIn(page);

    await page.goto(libraryPath);

    await expect(
      page.getByRole("heading", {
        name: "ESG case study library",
        exact: true,
      }),
    ).toBeVisible();

    await expectMobileSafe(page, testInfo);

    for (const slug of EPORTFOLIO_SLUGS) {
      await expect(page.locator(`a[href="/en/eportfolio/${slug}"]`).first()).toBeVisible();
    }

    const search = page.getByRole("textbox", {
      name: "Search case studies",
    });

    await search.fill("   WASTEWATER   ");

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

    const countryFilter = page.getByRole("combobox", {
      name: "Filter by country",
    });

    const industryFilter = page.getByRole("combobox", {
      name: "Filter by industry",
    });

    const progressFilter = page.getByRole("combobox", {
      name: "Filter by progress",
    });

    await expect(industryFilter).toBeVisible();

    await countryFilter.selectOption("BG");

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

    const targetCard = caseStudyCard(page, testCaseTitle);

    await expect(targetCard).toBeVisible();

    const targetCardText = await targetCard.innerText();

    const industryOptions = await industryFilter.locator("option").evaluateAll((options) =>
      options.map((option) => ({
        value: (option as HTMLOptionElement).value,
        label: option.textContent.trim(),
      })),
    );

    const targetIndustry = industryOptions.find(
      (option) =>
        option.value !== "all" && option.label.length > 0 && targetCardText.includes(option.label),
    );

    if (!targetIndustry) {
      throw new Error(`Could not determine the industry for ${testCaseTitle}.`);
    }

    await industryFilter.selectOption(targetIndustry.value);

    await countryFilter.selectOption("BG");

    await progressFilter.selectOption("not_started");

    await expect(targetCard).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "PZU S.A.",
        exact: true,
      }),
    ).toHaveCount(0);

    await expectMobileSafe(page, testInfo);

    await search.fill("does-not-exist-in-eportfolio");

    await expect(
      page.getByRole("heading", {
        name: "No case studies match your filters",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByText("0 of 8 case studies", {
        exact: true,
      }),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name: "Clear filters",
      })
      .click();

    for (const slug of EPORTFOLIO_SLUGS) {
      await expect(page.locator(`a[href="/en/eportfolio/${slug}"]`).first()).toBeVisible();
    }

    await expectMobileSafe(page, testInfo);
  });

  test("opens all published case studies and exposes valid external references", async ({
    page,
  }, testInfo) => {
    test.skip(
      isMobileProject(testInfo),
      "The exhaustive published-case/source-link sweep is covered by the desktop project.",
    );

    test.setTimeout(180_000);

    await resetEportfolioTestProgress();

    await signIn(page);

    for (const slug of EPORTFOLIO_SLUGS) {
      const response = await page.goto(`/en/eportfolio/${slug}`);

      if (!response) {
        throw new Error(`No document response received for ${slug}.`);
      }

      const status = response.status();

      expect(status, `The ePortfolio route for ${slug} returned HTTP ${status}.`).toBeLessThan(400);

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

  test("completes a case study and persists progress after reload", async ({ page }, testInfo) => {
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

    await expectMobileSafe(page, testInfo);

    await expect(
      page.getByText("Country", {
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByText("Industry", {
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByText("Reporting period", {
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByText("Source partner", {
        exact: true,
      }),
    ).toBeVisible();

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

      await expectMobileSafe(page, testInfo);
    }

    const sources = await openSources(page);

    await expect(sources.locator("ol").first()).toBeVisible();

    await expectMobileSafe(page, testInfo);

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

    await expectMobileSafe(page, testInfo);

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

    await expectMobileSafe(page, testInfo);

    await page.reload();

    await expect(
      page.getByRole("heading", {
        name: `${testCaseTitle} completed`,
        exact: true,
      }),
    ).toBeVisible();

    const afterReload = await readEportfolioProgress(userId, testCaseSlug);

    expect(afterReload?.status).toBe("completed");

    expect(afterReload?.completedAt?.toISOString()).toBe(persisted?.completedAt?.toISOString());

    await expectMobileSafe(page, testInfo);

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

    await expect(
      card.getByRole("link", {
        name: "Review case study",
      }),
    ).toBeVisible();

    await expectMobileSafe(page, testInfo);

    await page.reload();

    await expect(
      caseStudyCard(page, testCaseTitle).getByText("Completed", {
        exact: true,
      }),
    ).toBeVisible();

    await expectMobileSafe(page, testInfo);
  });

  test("keeps library and long case-study content within the mobile viewport", async ({
    page,
  }, testInfo) => {
    test.skip(!isMobileProject(testInfo), "This viewport regression is specific to mobile.");

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
