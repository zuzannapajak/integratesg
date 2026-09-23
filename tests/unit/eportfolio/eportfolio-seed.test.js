// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { caseStudies } from "../../../content/eportfolio/index.js";
import { seedEportfolio } from "../../../prisma/seed-data/eportfolio/seed.js";

function createPrismaDouble() {
  const caseStudyUpsert = vi.fn(async ({ where }) => ({
    id: `case-${where.slug}`,
    slug: where.slug,
  }));

  const caseStudyTranslationUpsert = vi.fn(async ({ where }) => ({
    id: `${where.caseStudyId_language.caseStudyId}-${where.caseStudyId_language.language}`,
  }));

  const caseStudyDeleteMany = vi.fn();
  const translationDeleteMany = vi.fn();
  const progressDeleteMany = vi.fn();

  return {
    prisma: {
      caseStudy: {
        upsert: caseStudyUpsert,
        deleteMany: caseStudyDeleteMany,
      },
      caseStudyTranslation: {
        upsert: caseStudyTranslationUpsert,
        deleteMany: translationDeleteMany,
      },
      userCaseStudyProgress: {
        deleteMany: progressDeleteMany,
      },
    },
    caseStudyUpsert,
    caseStudyTranslationUpsert,
    caseStudyDeleteMany,
    translationDeleteMany,
    progressDeleteMany,
  };
}

describe("ePortfolio seed", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  it("upserts every case study by stable slug", async () => {
    const double = createPrismaDouble();

    await seedEportfolio(double.prisma);

    expect(double.caseStudyUpsert).toHaveBeenCalledTimes(caseStudies.length);

    for (const caseStudy of caseStudies) {
      expect(double.caseStudyUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            slug: caseStudy.slug,
          },
          update: expect.objectContaining({
            status: caseStudy.status,
            countryCode: caseStudy.countryCode,
            sourcePartner: caseStudy.sourcePartner ?? null,
          }),
          create: expect.objectContaining({
            slug: caseStudy.slug,
            status: caseStudy.status,
            countryCode: caseStudy.countryCode,
          }),
        }),
      );
    }
  });

  it("upserts every available translation with the compound case/language key", async () => {
    const double = createPrismaDouble();

    const expectedTranslationCount = caseStudies.reduce(
      (total, caseStudy) => total + caseStudy.translations.length,
      0,
    );

    await seedEportfolio(double.prisma);

    expect(double.caseStudyTranslationUpsert).toHaveBeenCalledTimes(expectedTranslationCount);

    for (const caseStudy of caseStudies) {
      for (const translation of caseStudy.translations) {
        expect(double.caseStudyTranslationUpsert).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              caseStudyId_language: {
                caseStudyId: `case-${caseStudy.slug}`,
                language: translation.language,
              },
            },
            update: expect.objectContaining({
              title: translation.title,
              content: translation.content,
              organization: translation.organization ?? null,
              industry: translation.industry ?? null,
            }),
          }),
        );
      }
    }
  });

  it("is non-destructive and can be run repeatedly without deleting progress", async () => {
    const double = createPrismaDouble();

    await seedEportfolio(double.prisma);

    await seedEportfolio(double.prisma);

    expect(double.caseStudyDeleteMany).not.toHaveBeenCalled();

    expect(double.translationDeleteMany).not.toHaveBeenCalled();

    expect(double.progressDeleteMany).not.toHaveBeenCalled();

    expect(double.caseStudyUpsert).toHaveBeenCalledTimes(caseStudies.length * 2);
  });
});
