import { describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";

const SEEDED_CURRICULUM_SLUGS = [
  "module-1-introduction-to-esg-and-sustainable-development",
  "module-2-strategy-vision-and-organisational-alignment",
  "module-3-navigating-esg-frameworks-and-eu-reporting-standards",
  "module-4-integrating-esg-into-business-operations",
  "module-5-implementation-data-and-cross-functional-practice",
  "module-6-monitoring-reporting-and-future-trends-of-esg",
] as const;

const SEEDED_EPORTFOLIO_SLUGS = [
  "barilla",
  "davines",
  "pzu",
  "pkn-orlen",
  "sofiyska-voda",
  "harmonica",
  "sonnentor",
  "verbund",
] as const;

function expectStrictlyAscending(values: readonly number[], label: string) {
  for (let index = 1; index < values.length; index += 1) {
    expect(values[index], label).toBeGreaterThan(values[index - 1]);
  }
}

describe("seeded data contracts", () => {
  it("seeds complete published curriculum relations and content", async () => {
    const courses = await prisma.course.findMany({
      where: {
        slug: {
          in: [...SEEDED_CURRICULUM_SLUGS],
        },
        status: "published",
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        translations: true,
        sections: {
          orderBy: {
            sortOrder: "asc",
          },
          include: {
            translations: true,
          },
        },
        quizzes: {
          orderBy: {
            sortOrder: "asc",
          },
          include: {
            questions: {
              orderBy: {
                sortOrder: "asc",
              },
              include: {
                answers: {
                  orderBy: {
                    sortOrder: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });

    expect(courses).toHaveLength(SEEDED_CURRICULUM_SLUGS.length);

    expect(new Set(courses.map((course) => course.slug))).toEqual(new Set(SEEDED_CURRICULUM_SLUGS));

    expectStrictlyAscending(
      courses.map((course) => course.sortOrder),
      "published course sortOrder",
    );

    for (const course of courses) {
      const englishCourse = course.translations.find(
        (translation) => translation.language === "en",
      );

      if (!englishCourse) {
        throw new Error(`Missing English translation for curriculum course ${course.slug}.`);
      }

      expect(englishCourse.title.trim().length, `${course.slug} English title`).toBeGreaterThan(0);
      expect(course.sections.length, `${course.slug} sections`).toBeGreaterThan(0);
      expect(course.lessonsCount, `${course.slug} lessonsCount`).toBe(course.sections.length);

      expectStrictlyAscending(
        course.sections.map((section) => section.sortOrder),
        `${course.slug} section sortOrder`,
      );

      for (const section of course.sections) {
        const englishSection = section.translations.find(
          (translation) => translation.language === "en",
        );

        if (!englishSection) {
          throw new Error(`Missing English translation for ${course.slug}/${section.slug}.`);
        }

        expect(
          englishSection.title.trim().length,
          `${course.slug}/${section.slug} English title`,
        ).toBeGreaterThan(0);

        expect(
          englishSection.content.trim().length,
          `${course.slug}/${section.slug} English content`,
        ).toBeGreaterThan(0);
      }

      expect(course.quizzes.length, `${course.slug} quizzes`).toBeGreaterThan(0);

      for (const quiz of course.quizzes) {
        expect(
          quiz.questions.length,
          `${course.slug} quiz ${quiz.type}/${quiz.sortOrder} questions`,
        ).toBeGreaterThan(0);

        for (const question of quiz.questions) {
          expect(question.prompt.trim().length, `${course.slug} question prompt`).toBeGreaterThan(
            0,
          );

          expect(question.answers.length, `${course.slug} question answers`).toBeGreaterThan(1);

          expect(
            question.answers.filter((answer) => answer.isCorrect),
            `${course.slug} correct answer count`,
          ).toHaveLength(1);
        }
      }
    }
  });

  it("seeds complete published ePortfolio metadata and English content", async () => {
    const caseStudies = await prisma.caseStudy.findMany({
      where: {
        slug: {
          in: [...SEEDED_EPORTFOLIO_SLUGS],
        },
        status: "published",
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        translations: true,
      },
    });

    expect(caseStudies).toHaveLength(SEEDED_EPORTFOLIO_SLUGS.length);

    expect(new Set(caseStudies.map((caseStudy) => caseStudy.slug))).toEqual(
      new Set(SEEDED_EPORTFOLIO_SLUGS),
    );

    expectStrictlyAscending(
      caseStudies.map((caseStudy) => caseStudy.sortOrder),
      "published case-study sortOrder",
    );

    for (const caseStudy of caseStudies) {
      expect(caseStudy.slug.trim().length).toBeGreaterThan(0);
      expect(caseStudy.countryCode).toMatch(/^[A-Z]{2}$/);
      expect(caseStudy.reportingPeriod?.trim().length ?? 0).toBeGreaterThan(0);
      expect(caseStudy.sourcePartner?.trim().length ?? 0).toBeGreaterThan(0);

      const english = caseStudy.translations.find((translation) => translation.language === "en");

      if (!english) {
        throw new Error(`Missing English translation for ePortfolio case study ${caseStudy.slug}.`);
      }

      expect(english.title.trim().length, `${caseStudy.slug} title`).toBeGreaterThan(0);
      expect(english.summary?.trim().length ?? 0, `${caseStudy.slug} summary`).toBeGreaterThan(0);
      expect(english.content.trim().length, `${caseStudy.slug} content`).toBeGreaterThan(0);

      expect(
        english.organization?.trim().length ?? 0,
        `${caseStudy.slug} organization`,
      ).toBeGreaterThan(0);

      expect(english.industry?.trim().length ?? 0, `${caseStudy.slug} industry`).toBeGreaterThan(0);
      expect(Array.isArray(english.keyTakeaways), `${caseStudy.slug} keyTakeaways`).toBe(true);

      if (Array.isArray(english.keyTakeaways)) {
        expect(english.keyTakeaways.length, `${caseStudy.slug} keyTakeaways`).toBeGreaterThan(0);
      }
    }
  });
});
