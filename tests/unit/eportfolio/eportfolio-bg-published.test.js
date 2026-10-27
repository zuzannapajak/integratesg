// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { caseStudies } from "../../../content/eportfolio/index.js";
import {
  createOnlyMissingTranslations,
  planMissingTranslations,
  validatePublishedSources,
} from "../../../prisma/seed-data/eportfolio/missing-translation-sync.js";

const languages = ["en", "pl", "de", "it", "el", "bg"];
const otherLanguages = languages.filter((locale) => locale !== "bg");
const parents = caseStudies.map((source) => ({
  id: `case-${source.slug}`,
  slug: source.slug,
  status: "published",
}));
const existing = parents.flatMap((parent) =>
  otherLanguages.map((language) => ({
    caseStudyId: parent.id,
    language,
  })),
);

describe("Bulgarian ePortfolio translation completion", () => {
  it("has 16 published case studies with six unique languages and full BG metadata", () => {
    expect(caseStudies).toHaveLength(16);
    expect(validatePublishedSources(caseStudies).publishedCount).toBe(16);
    for (const source of caseStudies) {
      expect(source.status).toBe("published");
      expect(source.translations.map((item) => item.language).sort()).toEqual(
        [...languages].sort(),
      );
      const english = source.translations.find((item) => item.language === "en");
      const bulgarian = source.translations.find((item) => item.language === "bg");
      expect(bulgarian.content).not.toBe(english.content);
      expect(bulgarian.summary).not.toBe(english.summary);
      expect(bulgarian.content).toMatch(/[\u0400-\u04FF]/u);
      expect(bulgarian.summary).toMatch(/[\u0400-\u04FF]/u);
      expect(bulgarian.keyTakeaways).toHaveLength(4);
    }
  });

  it("plans ONLY the 16 BG translations when the five earlier languages exist", () => {
    const plan = planMissingTranslations(caseStudies, parents, existing);
    expect(plan.missingPublishedParents).toEqual([]);
    expect(plan.publishedDbCount).toBe(16);
    expect(plan.missing).toHaveLength(16);
    expect(plan.missing.map((entry) => entry.language)).toEqual(Array(16).fill("bg"));
    for (const language of otherLanguages) expect(plan.covered[language]).toBe(16);
  });

  it("never modifies parents or existing translations", async () => {
    const plan = planMissingTranslations(caseStudies, parents, existing);
    const tx = {
      caseStudyTranslation: {
        createMany: vi.fn(async ({ data }) => ({ count: data.length })),
      },
    };
    const result = await createOnlyMissingTranslations(tx, plan.missing);
    expect(result.count).toBe(16);
    expect(tx.caseStudyTranslation.createMany).toHaveBeenCalledOnce();
    const options = tx.caseStudyTranslation.createMany.mock.calls[0][0];
    expect(options.skipDuplicates).toBe(true);
    expect(options.data).toHaveLength(16);
    expect(options.data.every((row) => row.language === "bg")).toBe(true);
  });

  it("is idempotent after all six language rows are present", () => {
    const all = parents.flatMap((parent) =>
      languages.map((language) => ({
        caseStudyId: parent.id,
        language,
      })),
    );
    const plan = planMissingTranslations(caseStudies, parents, all);
    expect(plan.missing).toEqual([]);
    expect(plan.missingPublishedParents).toEqual([]);
  });
});
