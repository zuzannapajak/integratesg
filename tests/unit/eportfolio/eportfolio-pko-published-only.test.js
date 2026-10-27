// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { caseStudies } from "../../../content/eportfolio/index.js";
import {
  PKO_PUBLISHED_SLUG,
  createPkoPublishedOnly,
  planPkoPublishedOnly,
  supabaseProjectRefFromPkoUrl,
} from "../../../prisma/seed-data/eportfolio/pko-published-only.js";

describe("PKO Bank Polski create-only publication", () => {
  it("plans exactly one published parent and six available languages", () => {
    const result = planPkoPublishedOnly(caseStudies, null);
    expect(result.action).toBe("CREATE");
    expect(result.source.slug).toBe(PKO_PUBLISHED_SLUG);
    expect(result.source.status).toBe("published");
    expect(result.source.translations.map((translation) => translation.language).sort()).toEqual([
      "bg",
      "de",
      "el",
      "en",
      "it",
      "pl",
    ]);
    expect(
      result.source.translations.every((translation) => translation.content.length > 100),
    ).toBe(true);
  });

  it("is idempotent when all published translations already exist", () => {
    const existing = {
      id: "pko-existing",
      slug: PKO_PUBLISHED_SLUG,
      status: "published",
      translations: ["en", "pl", "de", "it", "el"].map((language) => ({ language })),
    };
    const result = planPkoPublishedOnly(caseStudies, existing);
    expect(result.action).toBe("KEEP");
  });

  it("refuses to publish an existing draft or assume missing translations are complete", () => {
    const existing = {
      id: "existing",
      slug: PKO_PUBLISHED_SLUG,
      status: "draft",
      translations: [],
    };
    expect(() => planPkoPublishedOnly(caseStudies, existing)).toThrow(/unexpected slug\/status/);
    expect(() => planPkoPublishedOnly(caseStudies, { ...existing, status: "published" })).toThrow(
      /missing translations/,
    );
  });

  it("creates one parent and all six source translations when no parent exists", async () => {
    const tx = {
      caseStudy: { create: vi.fn(async () => ({ id: "new-pko" })) },
      caseStudyTranslation: { createMany: vi.fn(async () => ({ count: 6 })) },
    };
    const { source } = planPkoPublishedOnly(caseStudies, null);
    const result = await createPkoPublishedOnly(tx, source);
    expect(result).toEqual({ parentsCreated: 1, translationsCreated: 6 });
    expect(tx.caseStudy.create).toHaveBeenCalledTimes(1);
    expect(tx.caseStudy.create.mock.calls[0][0].data.slug).toBe("pko-bank-polski");
    expect(tx.caseStudy.create.mock.calls[0][0].data.status).toBe("published");
    expect(tx.caseStudyTranslation.createMany.mock.calls[0][0].data).toHaveLength(6);
    expect(
      tx.caseStudyTranslation.createMany.mock.calls[0][0].data.every(
        (row) => row.caseStudyId === "new-pko",
      ),
    ).toBe(true);
  });

  it("identifies Supabase project refs without treating shared pooler host as a project", () => {
    expect(
      supabaseProjectRefFromPkoUrl(
        "postgresql://postgres.abcdefghijklmnopqrst:secret@aws-1-eu-central-2.pooler.supabase.com:5432/postgres",
      ),
    ).toBe("abcdefghijklmnopqrst");
    expect(
      supabaseProjectRefFromPkoUrl(
        "postgresql://postgres:secret@aws-1-eu-central-2.pooler.supabase.com:5432/postgres",
      ),
    ).toBe(null);
  });
});
