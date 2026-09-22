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

describe("ePortfolio responsive and accessibility contract", () => {
  it("keeps responsive breakpoints on the case-study library", () => {
    expect(library).toContain("md:grid-cols-2");

    expect(library).toContain("xl:grid-cols-3");

    expect(library).toContain("sm:flex-row");
  });

  it("keeps responsive detail layout and mobile-safe navigation", () => {
    expect(detail).toContain("xl:grid-cols-[minmax(0,1fr)_300px]");

    expect(detail).toContain("overflow-x-auto");

    expect(detail).toContain("hidden xl:block");
  });

  it("keeps accessible labels and semantic landmarks", () => {
    expect(library).toContain('aria-label="Filter by country"');

    expect(library).toContain('aria-label="Filter by industry"');

    expect(library).toContain('aria-label="Filter by progress"');

    expect(detail).toContain('aria-label="Breadcrumb"');

    expect(detail).toContain("<details");

    expect(detail).toContain("<summary");

    expect(progressActions).toContain('type="button"');
  });

  it("exposes the overall completion indicator as a progressbar", () => {
    expect(libraryPage).toContain('role="progressbar"');

    expect(libraryPage).toContain('aria-label="ePortfolio completion"');

    expect(libraryPage).toContain("aria-valuemin={0}");

    expect(libraryPage).toContain("aria-valuemax={100}");
  });
});
