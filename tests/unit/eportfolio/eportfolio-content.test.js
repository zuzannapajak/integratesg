// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  EPORTFOLIO_FALLBACK_LOCALE,
  EPORTFOLIO_LOCALES,
} from "../../../content/eportfolio/helpers.js";
import { caseStudies } from "../../../content/eportfolio/index.js";

const REQUIRED_READY_SLUGS = [
  "barilla",
  "davines",
  "pzu",
  "pkn-orlen",
  "sofiyska-voda",
  "harmonica",
  "sonnentor",
  "verbund",
];

function getEnglishTranslation(caseStudy) {
  return caseStudy.translations.find(
    (translation) => translation.language === EPORTFOLIO_FALLBACK_LOCALE,
  );
}

describe("ePortfolio content catalogue", () => {
  it("contains the currently approved ready case studies", () => {
    const slugs = caseStudies.map((caseStudy) => caseStudy.slug);

    expect(slugs).toEqual(expect.arrayContaining(REQUIRED_READY_SLUGS));
  });

  it("uses unique slugs", () => {
    const slugs = caseStudies.map((caseStudy) => caseStudy.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("provides an English translation for every published case study", () => {
    for (const caseStudy of caseStudies.filter((item) => item.status === "published")) {
      expect(
        getEnglishTranslation(caseStudy),
        `Missing English translation for ${caseStudy.slug}`,
      ).toBeDefined();
    }
  });

  it("provides organization, industry and content for every published case study", () => {
    for (const caseStudy of caseStudies.filter((item) => item.status === "published")) {
      const english = getEnglishTranslation(caseStudy);

      if (!english) {
        throw new Error(`Missing English translation for ${caseStudy.slug}`);
      }

      expect(english.organization.trim().length).toBeGreaterThan(0);

      expect(english.industry.trim().length).toBeGreaterThan(0);

      expect(english.content.trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps translation metadata complete", () => {
    for (const caseStudy of caseStudies) {
      for (const translation of caseStudy.translations) {
        expect(translation.title.trim().length).toBeGreaterThan(0);

        expect(translation.summary.trim().length).toBeGreaterThan(0);

        expect(translation.organization.trim().length).toBeGreaterThan(0);

        expect(translation.industry.trim().length).toBeGreaterThan(0);

        expect(translation.content.trim().length).toBeGreaterThan(0);

        expect(Array.isArray(translation.keyTakeaways)).toBe(true);

        expect(translation.keyTakeaways.length).toBeGreaterThan(0);

        for (const takeaway of translation.keyTakeaways) {
          expect(typeof takeaway).toBe("string");

          expect(takeaway.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("uses only supported ePortfolio locales", () => {
    for (const caseStudy of caseStudies) {
      for (const translation of caseStudy.translations) {
        expect(EPORTFOLIO_LOCALES).toContain(translation.language);
      }
    }
  });

  it("does not seed English copies as non-English translations", () => {
    for (const caseStudy of caseStudies) {
      const english = getEnglishTranslation(caseStudy);

      if (!english) {
        continue;
      }

      for (const translation of caseStudy.translations) {
        if (translation.language === EPORTFOLIO_FALLBACK_LOCALE) {
          continue;
        }

        const sameSummary = translation.summary === english.summary;

        const sameContent = translation.content === english.content;

        const sameTakeaways =
          JSON.stringify(translation.keyTakeaways) === JSON.stringify(english.keyTakeaways);

        expect(
          sameSummary && sameContent && sameTakeaways,
          `${caseStudy.slug}/${translation.language} is an English placeholder copy`,
        ).toBe(false);
      }
    }
  });

  it("does not contain obvious unfinished placeholders in published English content", () => {
    const placeholderPattern = /\b(?:TODO|TBD|PLACEHOLDER)\b|<insert|\[insert/iu;

    for (const caseStudy of caseStudies.filter((item) => item.status === "published")) {
      const english = getEnglishTranslation(caseStudy);

      if (!english) {
        throw new Error(`Missing English translation for ${caseStudy.slug}`);
      }

      expect(placeholderPattern.test(english.content)).toBe(false);

      expect(placeholderPattern.test(english.summary)).toBe(false);
    }
  });
});
