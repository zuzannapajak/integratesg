// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { caseStudies } from "../../../content/eportfolio/index.js";
import {
  ALLEGRO_LOCALES,
  ALLEGRO_AVAILABLE_LOCALES,
  applyAllegroPublication,
  planAllegroPublication,
  supabaseProjectRefFromAllegroUrl,
  validateAllegroSource,
} from "../../../prisma/seed-data/eportfolio/allegro-published-only.js";

const source = validateAllegroSource(caseStudies);

function makeTx() {
  return {
    caseStudy: {
      create: vi.fn(async () => ({ id: "case-allegro" })),
      updateMany: vi.fn(async () => ({ count: 1 })),
    },
    caseStudyTranslation: {
      createMany: vi.fn(async ({ data }) => ({ count: data.length })),
    },
  };
}

describe("Publish approved Allegro without changing existing content", () => {
  it("keeps Allegro published with six source locales", () => {
    expect(source.status).toBe("published");
    expect(source.translations.map((item) => item.language).sort()).toEqual(
      [...ALLEGRO_AVAILABLE_LOCALES].sort(),
    );
    expect(caseStudies.filter((item) => item.status === "published")).toHaveLength(16);
  });

  it("creates an absent case study with all translations", async () => {
    const plan = planAllegroPublication(caseStudies, null);
    expect(plan.action).toBe("CREATE");
    const tx = makeTx();
    const result = await applyAllegroPublication(tx, plan, null);
    expect(result).toEqual({ created: 1, promoted: 0, translationsCreated: 5 });
    expect(tx.caseStudy.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ slug: "allegro", status: "published" }),
      }),
    );
    expect(tx.caseStudy.updateMany).not.toHaveBeenCalled();
    expect(tx.caseStudyTranslation.createMany).toHaveBeenCalledTimes(1);
  });

  it("publishes an existing draft and inserts only missing languages", async () => {
    const parent = {
      id: "case-allegro",
      slug: "allegro",
      status: "draft",
      translations: [{ language: "en" }, { language: "pl" }],
    };
    const plan = planAllegroPublication(caseStudies, parent);
    expect(plan.action).toBe("PUBLISH");
    expect(plan.missingLocales).toEqual(["de", "it", "el"]);
    const tx = makeTx();
    const result = await applyAllegroPublication(tx, plan, parent);
    expect(result).toEqual({ created: 0, promoted: 1, translationsCreated: 3 });
    expect(tx.caseStudy.updateMany).toHaveBeenCalledWith({
      where: { id: "case-allegro", slug: "allegro", status: "draft" },
      data: { status: "published" },
    });
    expect(tx.caseStudy.create).not.toHaveBeenCalled();
    expect(
      tx.caseStudyTranslation.createMany.mock.calls[0][0].data.map((item) => item.language),
    ).toEqual(["de", "it", "el"]);
  });

  it("is idempotent when Allegro is already published and complete", async () => {
    const parent = {
      id: "case-allegro",
      slug: "allegro",
      status: "published",
      translations: ALLEGRO_LOCALES.map((language) => ({ language })),
    };
    const tx = makeTx();
    const result = await applyAllegroPublication(
      tx,
      planAllegroPublication(caseStudies, parent),
      parent,
    );
    expect(result).toEqual({ created: 0, promoted: 0, translationsCreated: 0 });
    expect(tx.caseStudy.create).not.toHaveBeenCalled();
    expect(tx.caseStudy.updateMany).not.toHaveBeenCalled();
    expect(tx.caseStudyTranslation.createMany).not.toHaveBeenCalled();
  });

  it("never promotes another slug or unexpected status", () => {
    expect(() =>
      planAllegroPublication(caseStudies, {
        id: "x",
        slug: "different",
        status: "draft",
        translations: [],
      }),
    ).toThrow(/Unexpected Allegro/);
  });

  it("rejects unknown Supabase project references", () => {
    expect(
      supabaseProjectRefFromAllegroUrl(
        "postgresql://postgres.abcdefghijklmnopqrst:pw@aws-1-eu-central-2.pooler.supabase.com:5432/postgres",
      ),
    ).toBe("abcdefghijklmnopqrst");
    expect(
      supabaseProjectRefFromAllegroUrl(
        "postgresql://postgres:pw@aws-1-eu-central-2.pooler.supabase.com:5432/postgres",
      ),
    ).toBe(null);
  });
});
