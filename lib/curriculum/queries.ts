import { CurriculumModuleViewModel } from "@/lib/curriculum/types";
import {
  buildGeneratedOutcomes,
  buildGeneratedStructure,
  formatDuration,
  formatLastOpened,
  mapArea,
  mapAttemptStatus,
  mapDifficulty,
} from "@/lib/curriculum/utils";
import { prisma } from "@/lib/prisma";

type TranslationRecord = {
  language: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  content: string | null;
};

type CourseAttemptRecord = {
  status: string;
  progressPercent: number;
  lastOpenedAt: Date | null;
};

type CourseRecord = {
  slug: string;
  area: string;
  difficulty: string;
  estimatedDurationMinutes: number | null;
  lessonsCount: number;
  translations: TranslationRecord[];
  _count: { quizzes: number };
  userCourseAttempts: CourseAttemptRecord[];
};

function pickTranslation(translations: TranslationRecord[], locale: string) {
  return (
    translations.find((translation) => translation.language === locale) ??
    translations.find((translation) => translation.language === "en") ??
    translations.at(0) ??
    null
  );
}

function mapCourseToViewModel(course: CourseRecord, locale: string): CurriculumModuleViewModel {
  const translation = pickTranslation(course.translations, locale);
  const attempt = course.userCourseAttempts.at(0);

  const area = mapArea(course.area);
  const quizzesCount = course._count.quizzes;

  return {
    slug: course.slug,
    title: translation ? translation.title : "Untitled course",
    subtitle: translation?.subtitle ?? "Curriculum module",
    description: translation?.description ?? "No description available yet.",
    content: translation?.content ?? undefined,
    area,
    status: mapAttemptStatus(attempt?.status),
    progress: attempt?.progressPercent ?? 0,
    duration: formatDuration(course.estimatedDurationMinutes),
    durationMinutes: course.estimatedDurationMinutes,
    lessons: course.lessonsCount,
    quizzes: quizzesCount,
    lastOpened: formatLastOpened(attempt?.lastOpenedAt ?? null),
    difficulty: mapDifficulty(course.difficulty),
    outcomes: buildGeneratedOutcomes(area),
    structure: buildGeneratedStructure(quizzesCount),
  };
}

export async function getAllCurriculumModules(params: { userId: string; locale: string }) {
  const courses = await prisma.course.findMany({
    where: {
      status: "published",
    },
    include: {
      translations: {
        where: {
          language: {
            in: [params.locale, "en"],
          },
        },
        select: {
          language: true,
          title: true,
          subtitle: true,
          description: true,
          content: true,
        },
      },
      _count: {
        select: {
          quizzes: true,
        },
      },
      userCourseAttempts: {
        where: {
          userId: params.userId,
        },
        select: {
          status: true,
          progressPercent: true,
          lastOpenedAt: true,
        },
        take: 1,
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return courses.map((course) => mapCourseToViewModel(course, params.locale));
}

export async function getMyCurriculumModules(params: { userId: string; locale: string }) {
  const courses = await prisma.course.findMany({
    where: {
      status: "published",
      userCourseAttempts: {
        some: {
          userId: params.userId,
          status: "in_progress",
        },
      },
    },
    include: {
      translations: {
        where: {
          language: {
            in: [params.locale, "en"],
          },
        },
        select: {
          language: true,
          title: true,
          subtitle: true,
          description: true,
          content: true,
        },
      },
      _count: {
        select: {
          quizzes: true,
        },
      },
      userCourseAttempts: {
        where: {
          userId: params.userId,
        },
        select: {
          status: true,
          progressPercent: true,
          lastOpenedAt: true,
        },
        take: 1,
      },
    },
    orderBy: [{ userCourseAttempts: { _count: "desc" } }, { sortOrder: "asc" }],
  });

  return courses.map((course) => mapCourseToViewModel(course, params.locale));
}

export async function getCourseDetail(params: { userId: string; locale: string; slug: string }) {
  const course = await prisma.course.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      translations: {
        where: {
          language: {
            in: [params.locale, "en"],
          },
        },
        select: {
          language: true,
          title: true,
          subtitle: true,
          description: true,
          content: true,
        },
      },
      _count: {
        select: {
          quizzes: true,
        },
      },
      userCourseAttempts: {
        where: {
          userId: params.userId,
        },
        select: {
          status: true,
          progressPercent: true,
          lastOpenedAt: true,
        },
        take: 1,
      },
    },
  });

  if (course?.status !== "published") {
    return null;
  }

  const courseModule = mapCourseToViewModel(course, params.locale);

  const relatedCourses = await prisma.course.findMany({
    where: {
      status: "published",
      slug: {
        not: params.slug,
      },
      area: course.area,
    },
    include: {
      translations: {
        where: {
          language: {
            in: [params.locale, "en"],
          },
        },
        select: {
          language: true,
          title: true,
          subtitle: true,
          description: true,
          content: true,
        },
      },
      _count: {
        select: {
          quizzes: true,
        },
      },
      userCourseAttempts: {
        where: {
          userId: params.userId,
        },
        select: {
          status: true,
          progressPercent: true,
          lastOpenedAt: true,
        },
        take: 1,
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: 3,
  });

  const relatedModules = relatedCourses.map((item) => mapCourseToViewModel(item, params.locale));

  return {
    module: courseModule,
    relatedModules,
  };
}
