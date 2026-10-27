// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { caseStudies } from "../../../content/eportfolio/index.js";
import {
  WP4_MISSING_PUBLISHED_SLUGS,
  insertMissingPublishedParents,
  prepareMissingPublishedParents,
  supabaseProjectRefFromUrl,
} from "../../../prisma/seed-data/eportfolio/restore-missing-published.js";

const expectedLocales = ["bg", "de", "el", "en", "it", "pl"];

describe("targeted WP4 parent catalogue repair", () => {
  it("selects only the six reported missing published studies", () => {
    const result = prepareMissingPublishedParents(caseStudies, []);
    expect(result.missing.map((item) => item.slug)).toEqual([...WP4_MISSING_PUBLISHED_SLUGS]);
    expect(result.missing.every((item) => item.status === "published")).toBe(true);
    for (const source of result.missing) {
      expect(source.translations.map((item) => item.language).sort()).toEqual(expectedLocales);
    }
    expect(result.missing.flatMap((item) => item.translations)).toHaveLength(
      WP4_MISSING_PUBLISHED_SLUGS.length * expectedLocales.length,
    );
  });

  it("skips existing case studies without rewriting them, and never includes Allegro", () => {
    const result = prepareMissingPublishedParents(caseStudies, [
      { id: "existing", slug: "bank-of-cyprus", status: "published" },
    ]);
    expect(result.present).toEqual([{ slug: "bank-of-cyprus", parentId: "existing" }]);
    expect(result.missing).toHaveLength(5);
    expect(result.missing.map((item) => item.slug)).not.toContain("allegro");
  });

  it("refuses to change publication status of existing drafts", () => {
    expect(() =>
      prepareMissingPublishedParents(caseStudies, [
        { id: "draft", slug: "bank-of-cyprus", status: "draft" },
      ]),
    ).toThrow(/will not change publication status/);
  });

  it("uses only CREATE, never destructive operations or UPDATE", async () => {
    let counter = 0;
    const tx = {
      caseStudy: {
        create: vi.fn(async () => ({ id: `new-${++counter}` })),
      },
      caseStudyTranslation: {
        createMany: vi.fn(async ({ data }) => ({ count: data.length })),
      },
    };
    const cases = prepareMissingPublishedParents(caseStudies, []).missing.slice(0, 2);
    const result = await insertMissingPublishedParents(tx, cases);
    expect(result).toEqual({ parentsCreated: 2, translationsCreated: 2 * expectedLocales.length });
    expect(tx.caseStudy.create).toHaveBeenCalledTimes(2);
    expect(tx.caseStudyTranslation.createMany).toHaveBeenCalledTimes(2);
    expect(tx.caseStudy.create.mock.calls[0][0].data.status).toBe("published");
    expect(tx.caseStudyTranslation.createMany.mock.calls[0][0].data).toHaveLength(
      expectedLocales.length,
    );
    expect(tx.caseStudyTranslation.createMany.mock.calls[0][0].data[0].caseStudyId).toBe("new-1");
  });

  it("extracts the Supabase project ID from the actual user/host, not the shared pooler hostname", () => {
    expect(
      supabaseProjectRefFromUrl(
        "postgresql://postgres.abcdefghijklmnopqrst:secret@aws-1-eu-central-2.pooler.supabase.com:6543/postgres",
      ),
    ).toBe("abcdefghijklmnopqrst");
    expect(
      supabaseProjectRefFromUrl(
        "postgresql://postgres:secret@db.abcdefghijklmnopqrst.supabase.co:5432/postgres",
      ),
    ).toBe("abcdefghijklmnopqrst");
    expect(
      supabaseProjectRefFromUrl(
        "postgresql://postgres:secret@aws-1-eu-central-2.pooler.supabase.com:6543/postgres",
      ),
    ).toBe(null);
  });
});
