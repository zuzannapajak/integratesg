import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";

import {
  scenario01Data,
  scenario02Data,
  scenario03Data,
  scenario04Data,
  scenario05Data,
  scenario06Data,
} from "../../../content/scenarios";
import { assertSafeE2EEnvironment } from "../helpers/safe-test-environment";
import { assertE2EDatabaseReady } from "../helpers/assert-e2e-database-ready";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

type Locale = "en" | "pl" | "de" | "it" | "el" | "bg";
const LOCALES: readonly Locale[] = ["en", "pl", "de", "it", "el", "bg"];
const CASE_STUDIES = [
  "allegro",
  "bank-of-cyprus",
  "barilla",
  "davines",
  "eurobank-cyprus",
  "grupa-azoty",
  "harmonica",
  "hermes-airports",
  "kpmg-cyprus",
  "pkn-orlen",
  "pko-bank-polski",
  "pzu",
  "sofiyska-voda",
  "sonnentor",
  "vassiliko-cement-works",
  "verbund",
] as const;

const LABELS: Record<Locale, string> = {
  en: "English",
  pl: "Polski",
  de: "Deutsch",
  it: "Italiano",
  el: "Ελληνικά",
  bg: "Български",
};

type CaseMetadata = {
  title: string;
  summary: string;
  organization?: string;
  industry?: string;
};

function json(path: string): unknown {
  return JSON.parse(readFileSync(join(process.cwd(), path), "utf8")) as unknown;
}

function switcherMessages(locale: Locale) {
  const data = json(`messages/${locale}.json`) as {
    Layout: { LanguageSwitcher: { open: string; switchTo: string } };
  };
  return data.Layout.LanguageSwitcher;
}

function aboutHeroTitle(locale: Locale) {
  const data = json(`messages/public-content-shells/${locale}.json`) as {
    PublicContent: { About: { hero: { title: string } } };
  };
  return data.PublicContent.About.hero.title;
}

function curriculumPageTitle(locale: Locale) {
  const data = json(`messages/${locale}.json`) as {
    Protected: { CurriculumPage: { title: string } };
  };
  return data.Protected.CurriculumPage.title;
}

type EnglishCaseSource = CaseMetadata & { slug: string };

/**
 * Run the ePortfolio source under native Node ESM. Importing index.js into
 * Playwright directly transpiles import.meta.url to CommonJS and fails before
 * any test is discovered.
 */
function loadEnglishSources(): Map<string, CaseMetadata> {
  const sourceScript = join(process.cwd(), "tests/e2e/helpers/eportfolio-source-snapshot.mjs");
  const output = execFileSync(process.execPath, [sourceScript], {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 2 * 1024 * 1024,
  });
  const sources = JSON.parse(output) as EnglishCaseSource[];
  const bySlug = new Map(sources.map(({ slug, ...metadata }) => [slug, metadata]));
  if (sources.length !== bySlug.size) throw new Error("Duplicate EN source slugs");
  return bySlug;
}

const EN_CASE_STUDIES = loadEnglishSources();

function caseMetadata(slug: string, locale: Locale): CaseMetadata {
  if (locale === "en") {
    const source = EN_CASE_STUDIES.get(slug);
    if (!source) throw new Error(`Missing English source for ${slug}`);
    return source;
  }
  return json(`content/eportfolio/${slug}/locales/${locale}.json`) as CaseMetadata;
}

function moduleTitles(locale: Locale): string[] {
  if (locale !== "en") {
    const data = json(`content/curriculum/course-locales/${locale}.json`) as {
      modules: Array<{ title: string }>;
    };
    return data.modules.map((module) => module.title);
  }
  return [1, 2, 3, 4, 5, 6].map((index) => {
    const source = readFileSync(
      join(process.cwd(), `prisma/seed-data/curriculum/module-${index}.js`),
      "utf8",
    );
    const match = source.match(/translation\("en",\s*\{\s*title:\s*"([^"]+)"/);
    if (!match) throw new Error(`No EN source title for curriculum module ${index}`);
    return match[1];
  });
}

async function signIn(page: Page): Promise<void> {
  const email = process.env.PLAYWRIGHT_TEST_EMAIL;
  const password = process.env.PLAYWRIGHT_TEST_PASSWORD;
  if (!email || !password) throw new Error("Missing disposable PLAYWRIGHT_TEST_EMAIL/PASSWORD");
  await page.goto("/en/auth/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await Promise.all([
    page.waitForURL(/\/en\/dashboard(?:\?.*)?$/),
    page.getByRole("button", { name: "Login", exact: true }).click(),
  ]);
}

test.describe.configure({ mode: "serial" });

test.describe("Six-language end-to-end rendering (no silent EN fallback)", () => {
  let db: PrismaClient | undefined;

  test.beforeAll(async () => {
    assertSafeE2EEnvironment();
    const databaseUrl = process.env.PLAYWRIGHT_DATABASE_URL ?? process.env.TEST_DATABASE_URL;
    if (!databaseUrl) throw new Error("Missing isolated test database URL");
    db = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
    await assertE2EDatabaseReady(db);
    expect([...EN_CASE_STUDIES.keys()].sort()).toEqual([...CASE_STUDIES].sort());
  });

  test.afterAll(async () => {
    if (db) await db.$disconnect();
  });

  test("switches the public site from English to every locale", async ({ page }) => {
    test.setTimeout(180_000);
    const englishTitle = aboutHeroTitle("en");
    for (const locale of LOCALES) {
      await page.goto("/en/about");
      await page.getByRole("button", { name: switcherMessages("en").open }).click();
      const switchTo = switcherMessages("en").switchTo.replace("{language}", LABELS[locale]);
      await page.getByRole("link", { name: switchTo }).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/about(?:\\?.*)?$`));
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      const expected = aboutHeroTitle(locale);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(expected);
      if (locale !== "en") {
        expect(expected, `${locale}: untranslated public hero source`).not.toBe(englishTitle);
        await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(englishTitle);
      }
    }
  });

  test("renders all six localized Curriculum module titles, not the English catalog", async ({
    page,
  }) => {
    test.setTimeout(240_000);
    await signIn(page);
    const en = moduleTitles("en");
    for (const locale of LOCALES) {
      await page.goto(`/${locale}/curriculum?view=all-courses`);
      await expect(page).toHaveURL(new RegExp(`/${locale}/curriculum`));
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(curriculumPageTitle(locale));
      const titles = moduleTitles(locale);
      expect(titles).toHaveLength(6);
      for (const [index, title] of titles.entries()) {
        await expect(page.getByRole("heading", { name: title, exact: true }).first()).toBeVisible();
        if (locale !== "en" && title !== en[index]) {
          await expect(page.getByRole("heading", { name: en[index], exact: true })).toHaveCount(0);
        }
      }
    }
  });

  // A single test navigating 96 locale/slug pairs in one page can exhaust
  // Chromium or the Next.js dev server. Playwright closes the browser context
  // after each case study, while still checking all six locales per slug.
  for (const slug of CASE_STUDIES) {
    test(`renders localized database-backed case studies for every language: ${slug}`, async ({
      page,
    }) => {
      test.setTimeout(180_000);
      await signIn(page);
      const english = caseMetadata(slug, "en");

      for (const locale of LOCALES) {
        const expected = caseMetadata(slug, locale);
        expect(
          expected.summary.trim().length,
          `${slug}/${locale} has no source summary`,
        ).toBeGreaterThan(30);
        if (locale !== "en") {
          expect(expected.summary, `${slug}/${locale} unexpectedly duplicates EN source`).not.toBe(
            english.summary,
          );
        }

        // Keep the full navigation/load check; the new Playwright page context
        // is released after each set of six locales to prevent resource buildup.
        const response = await page.goto(`/${locale}/eportfolio/${slug}`);
        expect(response?.status(), `${locale}/${slug} route status`).toBeLessThan(400);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        const title = page.getByRole("heading", {
          name: expected.title,
          level: 1,
          exact: true,
        });
        await expect(title).toBeVisible();

        // A case study can repeat the same summary in the Markdown body.
        // Scope both positive and EN-fallback checks to its introduction.
        const introduction = page.locator("main header").filter({ has: title });
        await expect(introduction).toHaveCount(1);
        await expect(introduction.getByText(expected.summary, { exact: true })).toBeVisible();
        if (locale !== "en") {
          await expect(introduction.getByText(english.summary, { exact: true })).toHaveCount(0);
        }
      }
    });
  }

  test("shows localized titles for all six scenarios in all six locale maps", async ({ page }) => {
    test.setTimeout(180_000);
    await signIn(page);
    const scenarios = [
      scenario01Data,
      scenario02Data,
      scenario03Data,
      scenario04Data,
      scenario05Data,
      scenario06Data,
    ];
    for (const locale of LOCALES) {
      await page.goto(`/${locale}/scenarios`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      for (const [index, scenario] of scenarios.entries()) {
        const localized = scenario.locales[locale];
        if (!localized) throw new Error(`Scenario ${index + 1} missing ${locale} data`);
        const card = page.getByTestId(`scenario-pathway-card-scenario-0${index + 1}`);
        await expect(card).toContainText(localized.shortTitle);
        if (locale !== "en") {
          const english = scenario.locales.en.shortTitle;
          if (localized.shortTitle !== english) await expect(card).not.toContainText(english);
        }
      }
    }
  });

  test("renders the scenario intro from all six source locales", async ({ page }) => {
    test.setTimeout(180_000);
    await signIn(page);
    const english = scenario01Data.locales.en;
    for (const locale of LOCALES) {
      const expected = scenario01Data.locales[locale];
      if (!expected) throw new Error(`Missing ${locale} scenario 01 data`);
      if (locale !== "en") {
        expect(expected.title, `${locale}: scenario title in English`).not.toBe(english.title);
        expect(expected.introduction, `${locale}: scenario context in English`).not.toBe(
          english.introduction,
        );
      }
      const response = await page.goto(`/${locale}/scenarios/scenario-01/play`);
      expect(response?.status(), `Scenario 01: ${locale}`).toBeLessThan(400);
      await expect(page.getByTestId("scenario-intro")).toBeVisible();
      await expect(
        page.getByTestId("scenario-intro").getByRole("heading", {
          name: expected.title,
          exact: true,
        }),
      ).toBeVisible();
      // Assert real localized scenario context, not only localized headings.
      const contextLead = expected.introduction
        .replace(/[*_`]/g, "")
        .split(/\s+/u)
        .slice(0, 12)
        .join(" ");
      await expect(page.getByTestId("scenario-intro")).toContainText(contextLead);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    }
  });
});
