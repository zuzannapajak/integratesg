// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import {
  createOnlyMissingTranslations,
  planMissingTranslations,
  supabaseProjectRefFromUrl,
  validatePublishedSources,
} from "../../../prisma/seed-data/eportfolio/missing-translation-sync.js";

const source = [
  {
    slug: "alpha", status: "published", translations: [
      { language: "en", title: "A", content: "English" },
      { language: "pl", title: "A PL", content: "Polski" },
      { language: "de", title: "A DE", content: "Deutsch" },
    ],
  },
  { slug: "beta", status: "published", translations: [{ language: "en", title: "B", content: "English B" }] },
  { slug: "draft", status: "draft", translations: [{ language: "en", title: "D", content: "English D" }] },
];

describe("WP4 create-only ePortfolio translation synchronizer", () => {
  it("selects exactly missing translations of published parents", () => {
    const plan = planMissingTranslations(
      source,
      [{ id: "1", slug: "alpha", status: "published" }, { id: "3", slug: "draft", status: "draft" }],
      [{ caseStudyId: "1", language: "en" }],
    );
    expect(plan.missing.map((entry) => `${entry.slug}/${entry.language}`)).toEqual(["alpha/de", "alpha/pl"]);
    expect(plan.missingPublishedParents).toEqual(["beta"]);
    expect(plan.publishedDbCount).toBe(1);
    expect(plan.covered.en).toBe(1);
  });

  it("keeps all already-present translations untouched", () => {
    const plan = planMissingTranslations(source, [{ id: "1", slug: "alpha", status: "published" }],
      ["en", "pl", "de"].map((language) => ({ caseStudyId: "1", language })));
    expect(plan.missing).toEqual([]);
  });

  it("rejects invalid/duplicate source translations", () => {
    expect(() => validatePublishedSources([{slug: "x", status: "published", translations: [
      { language: "en", title: "Title", content: "ok" },
      { language: "en", title: "Other", content: "duplicate" },
    ]}])).toThrow(/duplicate/);
  });

  it("only calls createMany, never update or upsert", async () => {
    const tx = { caseStudyTranslation: { createMany: vi.fn(async ({ data }) => ({ count: data.length })) } };
    const plan = planMissingTranslations(source, [{ id: "1", slug: "alpha", status: "published" }],
      [{ caseStudyId: "1", language: "en" }]);
    const result = await createOnlyMissingTranslations(tx, plan.missing);
    expect(result.count).toBe(2);
    expect(tx.caseStudyTranslation.createMany).toHaveBeenCalledTimes(1);
    expect(tx.caseStudyTranslation.createMany.mock.calls[0][0].skipDuplicates).toBe(true);
  });

  it("requires a unique Supabase project reference, not a shared pooler host", () => {
    expect(supabaseProjectRefFromUrl("postgresql://postgres.abcdefghijklmnopqrst:pw@aws-1-eu-central-2.pooler.supabase.com:5432/postgres"))
      .toBe("abcdefghijklmnopqrst");
    expect(supabaseProjectRefFromUrl("postgresql://postgres:pw@aws-1-eu-central-2.pooler.supabase.com:5432/postgres"))
      .toBe(null);
  });
});
