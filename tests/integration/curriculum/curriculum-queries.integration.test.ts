import { randomUUID } from "node:crypto";

import { afterEach, describe, expect, it } from "vitest";

import { getCurriculumModule, getCurriculumModules } from "@/lib/curriculum/queries";
import { prisma } from "@/lib/prisma";

const createdCourseIds = new Set<string>();
const createdProfileIds = new Set<string>();

function unique(prefix: string) {
  return `${prefix}-${randomUUID()}`;
}

async function createProfile(label: string) {
  const id = unique(`curriculum-query-${label}`);
  const profile = await prisma.profile.create({
    data: {
      id,
      email: `${id}@example.test`,
      fullName: `Curriculum query ${label}`,
      preferredLanguage: "en",
      role: "educator",
    },
  });

  createdProfileIds.add(profile.id);
  return profile;
}

type SectionInput = {
  slug: string;
  sortOrder: number;
  translations: Array<{
    language: string;
    title: string;
    summary?: string | null;
    content: string;
  }>;
};

async function createCourse(params: {
  label: string;
  status?: "draft" | "published";
  sortOrder?: number;
  translations?: Array<{
    language: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    content?: string | null;
  }>;
  sections?: SectionInput[];
}) {
  const slug = unique(`p1-curriculum-${params.label}`);
  const sections = params.sections ?? [];

  const course = await prisma.course.create({
    data: {
      slug,
      status: params.status ?? "published",
      area: "social",
      difficulty: "foundation",
      sortOrder: params.sortOrder ?? 0,
      lessonsCount: sections.length,
      translations: {
        create: params.translations ?? [
          {
            language: "en",
            title: `Course ${params.label}`,
            description: `Description ${params.label}`,
          },
        ],
      },
      sections: {
        create: sections.map((section) => ({
          slug: section.slug,
          sortOrder: section.sortOrder,
          estimatedMinutes: 10,
          translations: {
            create: section.translations.map((translation) => ({
              language: translation.language,
              title: translation.title,
              summary: translation.summary ?? null,
              content: translation.content,
            })),
          },
        })),
      },
    },
  });

  createdCourseIds.add(course.id);
  return course;
}

afterEach(async () => {
  if (createdCourseIds.size > 0) {
    await prisma.course.deleteMany({
      where: {
        id: {
          in: [...createdCourseIds],
        },
      },
    });
    createdCourseIds.clear();
  }

  if (createdProfileIds.size > 0) {
    await prisma.profile.deleteMany({
      where: {
        id: {
          in: [...createdProfileIds],
        },
      },
    });
    createdProfileIds.clear();
  }
});

describe("curriculum database queries", () => {
  it("returns published courses in sortOrder and isolates progress by user", async () => {
    const userA = await createProfile("user-a");
    const userB = await createProfile("user-b");

    const first = await createCourse({
      label: "ordered-first",
      sortOrder: -10_002,
    });
    const second = await createCourse({
      label: "ordered-second",
      sortOrder: -10_001,
    });
    const draft = await createCourse({
      label: "draft-hidden",
      status: "draft",
      sortOrder: -10_003,
    });

    await prisma.userCourseAttempt.create({
      data: {
        userId: userA.id,
        courseId: first.id,
        status: "in_progress",
        currentStage: "lessons",
        currentLessonIndex: 1,
        completedLessons: 1,
        progressPercent: 50,
      },
    });

    await prisma.userCourseAttempt.create({
      data: {
        userId: userB.id,
        courseId: second.id,
        status: "completed",
        currentStage: "completed",
        completedLessons: 1,
        progressPercent: 100,
        completedAt: new Date(),
      },
    });

    const modules = await getCurriculumModules({
      locale: "en",
      userId: userA.id,
      viewMode: "all-courses",
    });

    const relevant = modules.filter((module) =>
      [first.slug, second.slug, draft.slug].includes(module.slug),
    );

    expect(relevant.map((module) => module.slug)).toEqual([first.slug, second.slug]);
    expect(relevant.find((module) => module.slug === first.slug)?.progress).toBe(50);
    expect(relevant.find((module) => module.slug === first.slug)?.status).toBe("in_progress");
    expect(relevant.find((module) => module.slug === second.slug)?.progress).toBe(0);
    expect(relevant.find((module) => module.slug === second.slug)?.status).toBe("not_started");

    const myModules = await getCurriculumModules({
      locale: "en",
      userId: userA.id,
      viewMode: "my-courses",
    });

    expect(myModules.filter((module) => [first.slug, second.slug].includes(module.slug))).toEqual([
      expect.objectContaining({
        slug: first.slug,
        progress: 50,
      }),
    ]);
  });

  it("uses the requested locale, falls back to English and keeps sections in sortOrder", async () => {
    const user = await createProfile("locale");
    const course = await createCourse({
      label: "locale-order",
      translations: [
        {
          language: "en",
          title: "English course title",
          description: "English description",
        },
        {
          language: "pl",
          title: "Polski tytuł kursu",
          description: "Polski opis",
        },
      ],
      sections: [
        {
          slug: "second-section",
          sortOrder: 2,
          translations: [
            {
              language: "en",
              title: "English second lesson",
              summary: "English fallback summary",
              content: "English fallback content",
            },
          ],
        },
        {
          slug: "first-section",
          sortOrder: 1,
          translations: [
            {
              language: "en",
              title: "English first lesson",
              content: "English first content",
            },
            {
              language: "pl",
              title: "Polska pierwsza lekcja",
              content: "Polska treść pierwszej lekcji",
            },
          ],
        },
      ],
    });

    const result = await getCurriculumModule({
      locale: "pl",
      userId: user.id,
      slug: course.slug,
    });

    expect(result).not.toBeNull();
    expect(result?.module.title).toBe("Polski tytuł kursu");
    expect(result?.module.lessonsData.map((lesson) => lesson.slug)).toEqual([
      "first-section",
      "second-section",
    ]);
    expect(result?.module.lessonsData[0]?.title).toBe("Polska pierwsza lekcja");
    expect(result?.module.lessonsData[1]?.title).toBe("English second lesson");
    expect(result?.module.lessonsData[1]?.content).toBe("English fallback content");
  });

  it("returns null for an unknown or draft course slug", async () => {
    const user = await createProfile("missing-slug");
    const draft = await createCourse({
      label: "draft-detail",
      status: "draft",
    });

    await expect(
      getCurriculumModule({
        locale: "en",
        userId: user.id,
        slug: unique("missing-course"),
      }),
    ).resolves.toBeNull();

    await expect(
      getCurriculumModule({
        locale: "en",
        userId: user.id,
        slug: draft.slug,
      }),
    ).resolves.toBeNull();
  });

  it("handles a course without sections and blank lesson content without crashing", async () => {
    const user = await createProfile("empty-content");
    const emptyCourse = await createCourse({
      label: "empty-course",
    });
    const blankContentCourse = await createCourse({
      label: "blank-content",
      sections: [
        {
          slug: "blank-section",
          sortOrder: 1,
          translations: [
            {
              language: "en",
              title: "Blank lesson",
              summary: "",
              content: "   ",
            },
          ],
        },
      ],
    });

    const emptyResult = await getCurriculumModule({
      locale: "en",
      userId: user.id,
      slug: emptyCourse.slug,
    });
    const blankResult = await getCurriculumModule({
      locale: "en",
      userId: user.id,
      slug: blankContentCourse.slug,
    });

    expect(emptyResult?.module.lessons).toBe(0);
    expect(emptyResult?.module.lessonsData).toEqual([]);
    expect(emptyResult?.module.progress).toBe(0);
    expect(blankResult?.module.lessonsData).toEqual([
      expect.objectContaining({
        slug: "blank-section",
        summary: null,
        content: null,
      }),
    ]);
  });
});
