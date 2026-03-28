import {
  CurriculumLessonViewModel,
  CurriculumModuleViewModel,
  CurriculumProgressViewModel,
  CurriculumQuizAttemptViewModel,
} from "@/lib/curriculum/types";
import { prisma } from "@/lib/prisma";

type TranslationRecord = {
  language: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  content: string | null;
};

type StoredQuizAttempt = {
  attemptNumber: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  submittedAt: string;
  flaggedQuestionIds?: string[];
  selectedAnswers?: Array<{
    questionId: string;
    answerId: string;
    isCorrect: boolean;
  }>;
};

type CourseAttemptRecord = {
  status: string;
  progressPercent: number;
  lastOpenedAt: Date | null;
  currentStage: string;
  currentLessonIndex: number;
  completedLessons: number;
  preQuizAttempts: unknown;
  postQuizAttempts: unknown;
};

type QuizRecord = {
  id: string;
  type: string;
  title: string | null;
  description: string | null;
  passingScore: number | null;
  sortOrder: number;
  questions: Array<{
    id: string;
    prompt: string;
    explanation: string | null;
    sortOrder: number;
    answers: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
      feedbackText: string | null;
      sortOrder: number;
    }>;
  }>;
};

type CourseMappedInput = {
  slug: string;
  area: string;
  difficulty: string;
  estimatedDurationMinutes: number | null;
  lessonsCount: number;
  translations: TranslationRecord[];
  _count: { quizzes: number };
  userCourseAttempts: CourseAttemptRecord[];
  quizzes?: QuizRecord[];
};

function pickTranslation(
  translations: TranslationRecord[],
  locale: string,
): TranslationRecord | null {
  const localeTranslation = translations.find((translation) => translation.language === locale);
  if (localeTranslation) {
    return localeTranslation;
  }

  const englishTranslation = translations.find((translation) => translation.language === "en");
  if (englishTranslation) {
    return englishTranslation;
  }

  return translations.length > 0 ? translations[0] : null;
}

function mapArea(area: string): CurriculumModuleViewModel["area"] {
  switch (area) {
    case "environmental":
      return "environmental";
    case "social":
      return "social";
    case "governance":
      return "governance";
    default:
      return "cross-cutting";
  }
}

function mapDifficulty(difficulty: string): CurriculumModuleViewModel["difficulty"] {
  return difficulty === "intermediate" ? "Intermediate" : "Foundation";
}

function mapStatus(status?: string | null): CurriculumModuleViewModel["status"] {
  if (status === "completed") return "completed";
  if (status === "failed") return "failed";
  if (status === "in_progress") return "in_progress";
  return "not_started";
}

function mapStage(stage?: string | null): CurriculumProgressViewModel["currentStage"] {
  switch (stage) {
    case "pre_quiz":
      return "pre_quiz";
    case "lessons":
      return "lessons";
    case "post_quiz":
      return "post_quiz";
    case "completed":
      return "completed";
    default:
      return "overview";
  }
}

function mapQuizType(type: string): "pre" | "post" {
  return type === "post" ? "post" : "pre";
}

function formatDuration(minutes?: number | null): string {
  if (!minutes || minutes <= 0) return "Self-paced";
  return `${minutes} min`;
}

function formatLastOpened(date?: Date | null): string {
  if (!date) return "Not started yet";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatAttemptDate(value: string): string {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildGeneratedOutcomes(area: CurriculumModuleViewModel["area"]): string[] {
  switch (area) {
    case "environmental":
      return [
        "Identify environmental decision points in practice",
        "Interpret sustainability-related consequences of choices",
        "Strengthen confidence before scenario-based learning",
      ];
    case "social":
      return [
        "Recognise people-related ESG risks and opportunities",
        "Apply stakeholder-sensitive thinking in decision-making",
        "Understand social responsibility in implementation quality",
      ];
    case "governance":
      return [
        "Understand how governance shapes ESG credibility",
        "Relate accountability and policies to implementation",
        "Translate governance concepts into everyday practice",
      ];
    default:
      return [
        "Build a shared understanding of ESG integration",
        "Recognise how environmental, social, and governance topics interact",
        "Prepare for practical case-based and scenario-based learning",
      ];
  }
}

function buildGeneratedStructure(quizzesCount: number): string[] {
  const steps = ["Pre-test", "Lessons"];

  if (quizzesCount > 1) {
    steps.push("Post-test");
  }

  return steps;
}

function buildVirtualLessons(params: {
  title: string;
  content?: string;
  area: CurriculumModuleViewModel["area"];
  lessonsCount: number;
}): CurriculumLessonViewModel[] {
  return Array.from({ length: Math.max(params.lessonsCount, 1) }, (_, index) => {
    const trimmedContent = params.content?.trim();

    return {
      index: index + 1,
      slug: `lesson-${index + 1}`,
      title: `Lesson ${index + 1}`,
      summary:
        index === 0
          ? `Introduction to ${params.title}`
          : `Applied learning block ${index + 1} for ${params.title}`,
      content:
        trimmedContent && trimmedContent.length > 0
          ? trimmedContent
          : `${params.title} — lesson ${index + 1}. This lesson extends the curriculum module through guided content, practice-oriented framing, and structured progression in the ${params.area} context.`,
      estimatedMinutes: 8,
    };
  });
}

function parseAttempts(raw: unknown): CurriculumQuizAttemptViewModel[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item): item is StoredQuizAttempt => {
      if (typeof item !== "object" || item === null) return false;

      const candidate = item as Partial<StoredQuizAttempt>;

      return (
        typeof candidate.attemptNumber === "number" &&
        typeof candidate.score === "number" &&
        typeof candidate.correctCount === "number" &&
        typeof candidate.totalQuestions === "number" &&
        typeof candidate.submittedAt === "string"
      );
    })
    .map((item) => ({
      attemptNumber: item.attemptNumber,
      score: item.score,
      correctCount: item.correctCount,
      totalQuestions: item.totalQuestions,
      submittedAt: formatAttemptDate(item.submittedAt),
      flaggedQuestionIds: Array.isArray(item.flaggedQuestionIds) ? item.flaggedQuestionIds : [],
    }));
}

function buildProgressState(params: {
  attempt?: {
    status: string;
    currentStage: string;
    currentLessonIndex: number;
    completedLessons: number;
    preQuizAttempts: unknown;
    postQuizAttempts: unknown;
  } | null;
  lessonsCount: number;
}): CurriculumProgressViewModel {
  const attempt = params.attempt ?? null;

  const preQuizAttempts = parseAttempts(attempt?.preQuizAttempts);
  const postQuizAttempts = parseAttempts(attempt?.postQuizAttempts);

  const currentStage = attempt ? mapStage(attempt.currentStage) : "overview";
  const completedLessons = attempt ? attempt.completedLessons : 0;
  const currentLessonIndex = attempt ? attempt.currentLessonIndex : 0;

  const preQuizRemainingAttempts = Math.max(0, 1 - preQuizAttempts.length);
  const postQuizRemainingAttempts = Math.max(0, 2 - postQuizAttempts.length);

  let nextActionLabel = "Start the module";
  let currentLocationLabel = "Pre-test not started";

  if (currentStage === "pre_quiz") {
    nextActionLabel = preQuizAttempts.length === 0 ? "Start the module" : "Continue module";
    currentLocationLabel = "Pre-test";
  } else if (currentStage === "lessons") {
    nextActionLabel = "Continue module";
    currentLocationLabel =
      currentLessonIndex > 0
        ? `Lesson ${currentLessonIndex} of ${Math.max(params.lessonsCount, 1)}`
        : "Lessons";
  } else if (currentStage === "post_quiz") {
    nextActionLabel = "Continue module";
    currentLocationLabel = `Post-test${
      postQuizAttempts.length > 0 ? ` · attempt ${postQuizAttempts.length + 1} of 2` : ""
    }`;
  } else if (currentStage === "completed") {
    nextActionLabel = "Review module";
    currentLocationLabel = "Module completed";
  }

  return {
    currentStage,
    currentLessonIndex,
    completedLessons,
    totalLessons: Math.max(params.lessonsCount, 1),
    preQuizAttempts,
    postQuizAttempts,
    preQuizRemainingAttempts,
    postQuizRemainingAttempts,
    nextActionLabel,
    currentLocationLabel,
  };
}

function mapCourseToViewModel(
  course: CourseMappedInput,
  locale: string,
): CurriculumModuleViewModel {
  const translation = pickTranslation(course.translations, locale);
  const attempt = course.userCourseAttempts.at(0) ?? null;
  const area = mapArea(course.area);
  const quizzesCount = course._count.quizzes;

  const title = translation?.title ?? "Untitled course";
  const subtitle = translation?.subtitle ?? "Curriculum module";
  const description = translation?.description ?? "No description available yet.";
  const content = translation?.content ?? undefined;

  const lessonsData = buildVirtualLessons({
    title,
    content,
    area,
    lessonsCount: course.lessonsCount,
  });

  const progressState = buildProgressState({
    attempt,
    lessonsCount: lessonsData.length,
  });

  return {
    slug: course.slug,
    title,
    subtitle,
    description,
    content,
    area,
    status: mapStatus(attempt?.status),
    progress: attempt?.progressPercent ?? 0,
    duration: formatDuration(course.estimatedDurationMinutes),
    durationMinutes: course.estimatedDurationMinutes,
    lessons: lessonsData.length,
    quizzes: quizzesCount,
    lastOpened: formatLastOpened(attempt?.lastOpenedAt),
    difficulty: mapDifficulty(course.difficulty),
    outcomes: buildGeneratedOutcomes(area),
    structure: buildGeneratedStructure(quizzesCount),
    quizItems:
      course.quizzes?.map((quiz) => ({
        id: quiz.id,
        type: mapQuizType(quiz.type),
        title: quiz.title ?? (quiz.type === "post" ? "Post-test" : "Pre-test"),
        description: quiz.description,
        passingScore: quiz.passingScore,
        questions: quiz.questions
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((question) => ({
            id: question.id,
            prompt: question.prompt,
            explanation: question.explanation,
            answers: question.answers
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((answer) => ({
                id: answer.id,
                text: answer.text,
                isCorrect: answer.isCorrect,
                feedbackText: answer.feedbackText,
              })),
          })),
      })) ?? [],
    lessonsData,
    progressState,
  };
}

const supportedLanguages: string[] = ["en", "pl", "es"];

export async function getAllCurriculumModules(params: { userId: string; locale: string }) {
  const courses = await prisma.course.findMany({
    where: {
      status: "published",
    },
    include: {
      translations: {
        where: {
          language: {
            in: supportedLanguages,
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
          currentStage: true,
          currentLessonIndex: true,
          completedLessons: true,
          preQuizAttempts: true,
          postQuizAttempts: true,
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
          status: {
            in: ["in_progress", "completed"],
          },
        },
      },
    },
    include: {
      translations: {
        where: {
          language: {
            in: supportedLanguages,
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
          currentStage: true,
          currentLessonIndex: true,
          completedLessons: true,
          preQuizAttempts: true,
          postQuizAttempts: true,
        },
        take: 1,
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
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
          currentStage: true,
          currentLessonIndex: true,
          completedLessons: true,
          preQuizAttempts: true,
          postQuizAttempts: true,
        },
        take: 1,
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
          currentStage: true,
          currentLessonIndex: true,
          completedLessons: true,
          preQuizAttempts: true,
          postQuizAttempts: true,
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

export async function getCourseLearningWorkspace(params: {
  userId: string;
  locale: string;
  slug: string;
}) {
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      status: true,
    },
  });

  if (course?.status !== "published") {
    return null;
  }

  const existing = await prisma.userCourseAttempt.findUnique({
    where: {
      userId_courseId: {
        userId: params.userId,
        courseId: course.id,
      },
    },
  });

  if (!existing) {
    await prisma.userCourseAttempt.create({
      data: {
        userId: params.userId,
        courseId: course.id,
        status: "in_progress",
        currentStage: "pre_quiz",
        currentLessonIndex: 0,
        completedLessons: 0,
        progressPercent: 0,
        startedAt: new Date(),
        lastOpenedAt: new Date(),
      },
    });
  } else if (existing.status === "not_started" || existing.currentStage === "overview") {
    await prisma.userCourseAttempt.update({
      where: {
        userId_courseId: {
          userId: params.userId,
          courseId: course.id,
        },
      },
      data: {
        status: "in_progress",
        currentStage: "pre_quiz",
        startedAt: existing.startedAt ?? new Date(),
        lastOpenedAt: new Date(),
      },
    });
  } else {
    await prisma.userCourseAttempt.update({
      where: {
        userId_courseId: {
          userId: params.userId,
          courseId: course.id,
        },
      },
      data: {
        lastOpenedAt: new Date(),
      },
    });
  }

  const detail = await getCourseDetail(params);
  return detail?.module ?? null;
}
