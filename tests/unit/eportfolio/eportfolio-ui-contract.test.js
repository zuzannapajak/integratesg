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

describe("ePortfolio responsive and accessibility contract", () => {
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

    expect(detail).toContain('aria-label="Case study reading progress"');

    expect(detail).not.toContain("hidden xl:block");

    expect(detail).not.toContain("On this page");

    expect(detail).not.toContain("Final step");
  });

  it("keeps accessible labels and completion navigation semantics", () => {
    expect(library).toContain('aria-label="Filter by country"');

    expect(library).toContain('aria-label="Filter by industry"');

    expect(library).toContain('aria-label="Filter by progress"');

    expect(detail).toContain("Back to ePortfolio");

    expect(detail).toContain("<details");

    expect(detail).toContain("<summary");

    expect(detail).toContain("/complete");

    expect(progressActions).toContain('type="button"');

    expect(completionPage).toContain("Back to ePortfolio");

    expect(completionPage).not.toContain("Back to case study");

    expect(completionPage).toContain("<EportfolioProgressActions");

    expect(completionPage).toContain("caseStudyTitle={caseStudy.title}");
  });

  it("exposes the overall completion indicator as a progressbar", () => {
    expect(libraryPage).toContain('role="progressbar"');

    expect(libraryPage).toContain('aria-label="ePortfolio completion"');

    expect(libraryPage).toContain("aria-valuemin={0}");

    expect(libraryPage).toContain("aria-valuemax={100}");
  });
});
