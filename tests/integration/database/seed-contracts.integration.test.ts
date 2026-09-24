import { describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";

function expectStrictlyAscending(values: readonly number[], label: string) {
  for (let index = 1; index < values.length; index += 1) {
    expect(values[index], label).toBeGreaterThan(values[index - 1]);
  }
}

describe("seeded data contracts", () => {
  it("seeds complete published curriculum relations and content", async () => {
    const courses = await prisma.course.findMany({
      where: {
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

    expect(courses.length).toBeGreaterThan(0);
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
        status: "published",
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        translations: true,
      },
    });

    expect(caseStudies.length).toBeGreaterThan(0);
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
