// @vitest-environment node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function readRepoFile(relativePath) {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

const library = readRepoFile("components/eportfolio/eportfolio-library.tsx");
const detail = readRepoFile("components/eportfolio/eportfolio-detail.tsx");
const progressActions = readRepoFile("components/eportfolio/eportfolio-progress-actions.tsx");
const libraryPage = readRepoFile("app/[locale]/(protected)/eportfolio/page.tsx");
const completionPage = readRepoFile("app/[locale]/(protected)/eportfolio/[slug]/complete/page.tsx");

describe("ePortfolio responsive, accessibility and i18n contract", () => {
  it("keeps responsive breakpoints on the case-study library", () => {
    expect(library).toContain("md:grid-cols-2");
    expect(library).toContain("xl:grid-cols-3");
    expect(library).toContain("sm:flex-row");
  });

  it("keeps the staged detail layout mobile-safe", () => {
    expect(detail).toContain("sm:grid-cols-2 xl:grid-cols-4");
    expect(detail).toContain("overflow-x-auto");
    expect(detail).toContain("[&_table]:min-w-");
    expect(detail).toContain("sm:flex-row");
    expect(detail).toContain("{stepIndex + 1} / {stepTotal}");
    expect(detail).toContain("aria-label={progressLabel}");
    expect(detail).not.toContain("hidden xl:block");
    expect(detail).not.toContain("On this page");
    expect(detail).not.toContain("Final step");
  });

  it("keeps accessible labels and completion navigation semantics", () => {
    expect(library).toContain('aria-label={t("filters.country.label")}');
    expect(library).toContain('aria-label={t("filters.industry.label")}');
    expect(library).toContain('aria-label={t("filters.progress.label")}');

    expect(detail).toContain("<details");
    expect(detail).toContain("<summary");
    expect(detail).toContain("/complete");

    expect(progressActions).toContain('type="button"');
    expect(progressActions).toContain('role="alert"');

    expect(completionPage).toContain("<EportfolioProgressActions");
    expect(completionPage).toContain("caseStudyTitle={caseStudy.title}");
  });

  it("keeps current ePortfolio interface copy translation-backed", () => {
    expect(library).toContain('useTranslations("Protected.EportfolioLibrary")');
    expect(detail).toContain('useTranslations("Protected.EportfolioDetail")');
    expect(progressActions).toContain('useTranslations("Protected.EportfolioProgressActions")');
    expect(libraryPage).toContain('namespace: "Protected.EportfolioLibraryPage"');
    expect(completionPage).toContain('namespace: "Protected.EportfolioCompletionPage"');

    expect(library).not.toContain("Refine case studies");
    expect(library).not.toContain("Clear filters");
    expect(detail).not.toContain("Back to ePortfolio");
    expect(detail).not.toContain('aria-label="Case study reading progress"');
    expect(progressActions).not.toContain("Mark as completed");
    expect(completionPage).not.toContain("Back to ePortfolio");
  });

  it("exposes the overall completion indicator as a localized progressbar", () => {
    expect(libraryPage).toContain('role="progressbar"');
    expect(libraryPage).toContain('aria-label={t("progress.ariaLabel")}');
    expect(libraryPage).toContain("aria-valuemin={0}");
    expect(libraryPage).toContain("aria-valuemax={100}");
  });
});
