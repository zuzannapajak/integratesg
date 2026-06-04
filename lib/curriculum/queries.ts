import {
  CourseMappedInput,
  CourseSectionRecord,
  CurriculumCertificateViewModel,
  CurriculumLessonViewModel,
  CurriculumListItemViewModel,
  CurriculumModuleViewModel,
  CurriculumProgressViewModel,
  CurriculumQuizAttemptViewModel,
  CurriculumTextToken,
  StoredQuizAttempt,
  TranslationRecord,
} from "@/lib/curriculum/types";
import { mapArea, mapDifficulty } from "@/lib/curriculum/utils";
import { estimateJsonBytes } from "@/lib/observability/json-size";
import {
  logMeasuredOperation,
  measureAsyncOperation,
  measureSyncOperation,
} from "@/lib/observability/performance";
import { prisma } from "@/lib/prisma";

type CurriculumModuleDetails = {
  overview: string | null;
  practicalFocus: string;
  learningProgression: string;
  outcomes: string[];
  flow: Array<{
    title: string;
    description: string;
  }>;
  progressTracking: string;
};

type CurriculumModuleViewModelWithDetails = CurriculumModuleViewModel & {
  details: CurriculumModuleDetails | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function parseDetailsFlow(value: unknown): CurriculumModuleDetails["flow"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const title = typeof item.title === "string" ? item.title.trim() : "";
    const description = typeof item.description === "string" ? item.description.trim() : "";

    if (!title || !description) {
      return [];
    }

    return [{ title, description }];
  });
}

function parseModuleDetails(raw: unknown): CurriculumModuleDetails | null {
  if (!isRecord(raw)) {
    return null;
  }

  const practicalFocus = typeof raw.practicalFocus === "string" ? raw.practicalFocus.trim() : "";
  const learningProgression =
    typeof raw.learningProgression === "string" ? raw.learningProgression.trim() : "";
  const progressTracking =
    typeof raw.progressTracking === "string" ? raw.progressTracking.trim() : "";
  const outcomes = parseStringArray(raw.outcomes);
  const flow = parseDetailsFlow(raw.flow);
  const overview = typeof raw.overview === "string" ? raw.overview.trim() : "";

  if (
    !overview &&
    !practicalFocus &&
    !learningProgression &&
    outcomes.length === 0 &&
    flow.length === 0
  ) {
    return null;
  }

  return {
    overview: overview.length > 0 ? overview : null,
    practicalFocus,
    learningProgression,
    outcomes,
    flow,
    progressTracking,
  };
}

function getTranslationDetails(
  translation: TranslationRecord | null,
): CurriculumModuleDetails | null {
  return parseModuleDetails(translation?.details);
}

function pickLocalizedRecord<T extends { language: string }>(
  records: T[],
  locale: string,
): T | null {
  let englishRecord: T | null = null;
  let firstRecord: T | null = null;

  for (const record of records) {
    firstRecord ??= record;

    if (record.language === locale) {
      return record;
    }

    if (englishRecord === null && record.language === "en") {
      englishRecord = record;
    }
  }

  return englishRecord ?? firstRecord;
}

function pickTranslation(
  translations: TranslationRecord[],
  locale: string,
): TranslationRecord | null {
  return pickLocalizedRecord(translations, locale);
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

function normalizeOptionalText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function getRequestedLanguages(locale: string) {
  return locale === "en" ? ["en"] : [locale, "en"];
}

function formatAttemptDate(value: string): string {
  const date = new Date(value);
  return date.toISOString();
}

function mapSectionsToLessons(
  sections: CourseSectionRecord[] | undefined,
  locale: string,
): CurriculumLessonViewModel[] {
  if (!sections || sections.length === 0) {
    return [];
  }

  const lessons: CurriculumLessonViewModel[] = [];

  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index];
    const translation = pickLocalizedRecord(section.translations, locale);

    lessons.push({
      index: index + 1,
      slug: section.slug,
      title: translation?.title ?? section.slug,
      summary: normalizeOptionalText(translation?.summary),
      content: normalizeOptionalText(translation?.content),
      estimatedMinutes: section.estimatedMinutes ?? 8,
    });
  }

  return lessons;
}

function parseAttempts(raw: unknown): CurriculumQuizAttemptViewModel[] {
  if (!Array.isArray(raw)) return [];

  const attempts: CurriculumQuizAttemptViewModel[] = [];

  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;

    const candidate = item as Partial<StoredQuizAttempt>;

    if (
      typeof candidate.attemptNumber !== "number" ||
      typeof candidate.score !== "number" ||
      typeof candidate.correctCount !== "number" ||
      typeof candidate.totalQuestions !== "number" ||
      typeof candidate.submittedAt !== "string"
    ) {
      continue;
    }

    attempts.push({
      quizId: typeof candidate.quizId === "string" ? candidate.quizId : null,
      quizType:
        candidate.quizType === "pre" || candidate.quizType === "post" ? candidate.quizType : null,
      quizSortOrder: typeof candidate.quizSortOrder === "number" ? candidate.quizSortOrder : null,
      passed: typeof candidate.passed === "boolean" ? candidate.passed : null,
      attemptNumber: candidate.attemptNumber,
      score: candidate.score,
      correctCount: candidate.correctCount,
      totalQuestions: candidate.totalQuestions,
      submittedAt: formatAttemptDate(candidate.submittedAt),
      flaggedQuestionIds: Array.isArray(candidate.flaggedQuestionIds)
        ? candidate.flaggedQuestionIds
        : [],
    });
  }

  return attempts;
}

function buildProgressState(params: {
  attempt?: {
    status: string;
    completedAt?: Date | null;
    currentStage?: string;
    currentLessonIndex?: number;
    completedLessons?: number;
    preQuizAttempts?: unknown;
    postQuizAttempts?: unknown;
  } | null;
  lessonsCount: number;
  hasPreQuiz: boolean;
}): CurriculumProgressViewModel {
  const attempt = params.attempt ?? null;

  const preQuizAttempts = parseAttempts(attempt?.preQuizAttempts);
  const postQuizAttempts = parseAttempts(attempt?.postQuizAttempts);

  const currentStage = attempt ? mapStage(attempt.currentStage) : "overview";
  const completedLessons = attempt?.completedLessons ?? 0;
  const currentLessonIndex = attempt?.currentLessonIndex ?? 0;
  const totalLessons = Math.max(params.lessonsCount, 1);
  const currentPostQuizAttempts = postQuizAttempts.filter(
    (quizAttempt) => quizAttempt.quizSortOrder === currentLessonIndex,
  );

  const preQuizRemainingAttempts = params.hasPreQuiz ? Math.max(0, 1 - preQuizAttempts.length) : 0;
  const postQuizRemainingAttempts = Math.max(0, 2 - currentPostQuizAttempts.length);

  let nextAction: CurriculumTextToken = { key: "progressState.nextAction.startModule" };
  let currentLocation: CurriculumTextToken = params.hasPreQuiz
    ? { key: "progressState.currentLocation.preTestNotStarted" }
    : { key: "progressState.currentLocation.lessons" };

  if (currentStage === "pre_quiz") {
    nextAction =
      preQuizAttempts.length === 0
        ? { key: "progressState.nextAction.startModule" }
        : { key: "progressState.nextAction.continueModule" };

    currentLocation = { key: "progressState.currentLocation.preTest" };
  } else if (currentStage === "lessons") {
    nextAction = { key: "progressState.nextAction.continueModule" };
    currentLocation =
      currentLessonIndex > 0
        ? {
            key: "progressState.currentLocation.lessonProgress",
            values: { current: currentLessonIndex, total: totalLessons },
          }
        : { key: "progressState.currentLocation.lessons" };
  } else if (currentStage === "post_quiz") {
    nextAction = { key: "progressState.nextAction.continueModule" };
    currentLocation =
      currentPostQuizAttempts.length > 0
        ? {
            key: "progressState.currentLocation.postTestAttempt",
            values: { current: currentPostQuizAttempts.length + 1, total: 2 },
          }
        : { key: "progressState.currentLocation.postTest" };
  } else if (currentStage === "completed") {
    nextAction = { key: "progressState.nextAction.reviewModule" };
    currentLocation = { key: "progressState.currentLocation.moduleCompleted" };
  }

  return {
    currentStage,
    currentLessonIndex,
    completedLessons,
    totalLessons,
    preQuizAttempts,
    postQuizAttempts,
    preQuizRemainingAttempts,
    postQuizRemainingAttempts,
    nextAction,
    currentLocation,
    completedAt: attempt?.completedAt?.toISOString() ?? null,
  };
}

function buildCertificateState(params: {
  attempt: CourseMappedInput["userCourseAttempts"][number] | null;
  slug: string;
}): CurriculumCertificateViewModel {
  const attempt = params.attempt;
  const isAvailable =
    attempt?.status === "completed" &&
    mapStage(attempt.currentStage) === "completed" &&
    Boolean(attempt.completedAt);

  return {
    isAvailable,
    downloadUrl: isAvailable ? `/api/curriculum/${params.slug}/certificate` : null,
  };
}

function mapCourseToViewModel(
  course: CourseMappedInput,
  locale: string,
): CurriculumModuleViewModelWithDetails {
  const translation = pickTranslation(course.translations, locale);
  const attempt = course.userCourseAttempts.at(0) ?? null;
  const area = mapArea(course.area);
  const quizzesCount = course._count.quizzes;

  const title = translation?.title ?? course.slug;
  const subtitle = normalizeOptionalText(translation?.subtitle);
  const description = normalizeOptionalText(translation?.description);
  const content = normalizeOptionalText(translation?.content);
  const details = getTranslationDetails(translation);
  const hasPreQuiz = course.quizzes?.some((quiz) => quiz.type === "pre") ?? false;

  const lessonsData = mapSectionsToLessons(course.sections, locale);
  const lessonsCount =
    lessonsData.length > 0 ? lessonsData.length : Math.max(course.lessonsCount, 0);

  const progressState = buildProgressState({
    attempt,
    lessonsCount,
    hasPreQuiz,
  });
  const certificate = buildCertificateState({
    attempt,
    slug: course.slug,
  });

  return {
    slug: course.slug,
    title,
    subtitle,
    description,
    content,
    details,
    area,
    status: mapStatus(attempt?.status),
    progress: attempt?.progressPercent ?? 0,
    durationMinutes: course.estimatedDurationMinutes,
    lessons: lessonsCount,
    quizzes: quizzesCount,
    lastOpenedAt: attempt?.lastOpenedAt?.toISOString() ?? null,
    difficulty: mapDifficulty(course.difficulty),
    outcomes: [],
    structure: [],
    quizItems: (() => {
      if (!course.quizzes || course.quizzes.length === 0) {
        return [];
      }

      return course.quizzes.map((quiz) => {
        const quizTranslation = pickLocalizedRecord(quiz.translations, locale);

        return {
          id: quiz.id,
          type: mapQuizType(quiz.type),
          sortOrder: quiz.sortOrder,
          title: quizTranslation?.title ?? quiz.title,
          description: normalizeOptionalText(quizTranslation?.description ?? quiz.description),
          passingScore: quiz.passingScore,
          questions: quiz.questions.map((question) => {
            const questionTranslation = pickLocalizedRecord(question.translations, locale);

            return {
              id: question.id,
              prompt: questionTranslation?.prompt ?? question.prompt,
              explanation: normalizeOptionalText(
                questionTranslation?.explanation ?? question.explanation,
              ),
              answers: question.answers.map((answer) => {
                const answerTranslation = pickLocalizedRecord(answer.translations, locale);

                return {
                  id: answer.id,
                  text: answerTranslation?.text ?? answer.text,
                  isCorrect: answer.isCorrect,
                  feedbackText: normalizeOptionalText(
                    answerTranslation?.feedbackText ?? answer.feedbackText,
                  ),
                };
              }),
            };
          }),
        };
      });
    })(),
    lessonsData,
    progressState,
    certificate,
  };
}

function mapCourseToListItem(
  course: CourseMappedInput,
  locale: string,
): CurriculumListItemViewModel {
  const translation = pickTranslation(course.translations, locale);
  const attempt = course.userCourseAttempts.at(0) ?? null;

  return {
    slug: course.slug,
    title: translation?.title ?? course.slug,
    subtitle: normalizeOptionalText(translation?.subtitle),
    description: normalizeOptionalText(translation?.description),
    area: mapArea(course.area),
    status: mapStatus(attempt?.status),
    progress: attempt?.progressPercent ?? 0,
    durationMinutes: course.estimatedDurationMinutes,
    lessons: Math.max(course.lessonsCount, 0),
    quizzes: course._count.quizzes,
    lastOpenedAt: attempt?.lastOpenedAt?.toISOString() ?? null,
    difficulty: mapDifficulty(course.difficulty),
  };
}

type CurriculumListViewMode = "my-courses" | "all-courses";

export async function getCurriculumModules(params: {
  locale: string;
  userId: string;
  viewMode?: CurriculumListViewMode;
}) {
  return measureAsyncOperation({
    operation: "curriculum.getCurriculumModules",
    getRecords: (modules) => modules.length,
    execute: async () => {
      const requestedLanguages = getRequestedLanguages(params.locale);
      const isMyCoursesView = params.viewMode === "my-courses";

      const prismaStartedAt = Date.now();
      const courses = await prisma.course.findMany({
        where: {
          status: "published",
          ...(isMyCoursesView
            ? {
                userCourseAttempts: {
                  some: {
                    userId: params.userId,
                    status: {
                      not: "not_started",
                    },
                  },
                },
              }
            : {}),
        },
        select: {
          slug: true,
          area: true,
          difficulty: true,
          estimatedDurationMinutes: true,
          lessonsCount: true,
          translations: {
            where: {
              language: {
                in: requestedLanguages,
              },
            },
            select: {
              language: true,
              title: true,
              subtitle: true,
              description: true,
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
              ...(isMyCoursesView
                ? {
                    status: {
                      not: "not_started",
                    },
                  }
                : {}),
            },
            select: {
              status: true,
              progressPercent: true,
              lastOpenedAt: true,
            },
            orderBy: [{ lastOpenedAt: "desc" }, { createdAt: "desc" }],
            take: 1,
          },
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });

      logMeasuredOperation({
        operation: "curriculum.getCurriculumModules.prisma",
        durationMs: Date.now() - prismaStartedAt,
        records: courses.length,
        meta: {
          translations: courses.reduce((sum, course) => sum + course.translations.length, 0),
          responseBytes: estimateJsonBytes(courses),
          viewMode: params.viewMode ?? "all-courses",
        },
      });

      const modules = measureSyncOperation({
        operation: "curriculum.getCurriculumModules.map",
        records: courses.length,
        meta: {
          nodeElements: courses.length,
          viewMode: params.viewMode ?? "all-courses",
        },
        execute: () =>
          courses.map((course) => mapCourseToListItem(course as CourseMappedInput, params.locale)),
      });

      logMeasuredOperation({
        operation: "curriculum.getCurriculumModules.payload",
        durationMs: 0,
        records: modules.length,
        meta: {
          responseBytes: estimateJsonBytes(modules),
          viewMode: params.viewMode ?? "all-courses",
        },
      });

      return modules;
    },
  });
}

export async function getCurriculumRecommendedModuleSlug(params: { userId: string }) {
  return measureAsyncOperation({
    operation: "curriculum.getCurriculumRecommendedModuleSlug",
    getRecords: (recommendedSlug) => (recommendedSlug ? 1 : 0),
    execute: async () => {
      const courses = await prisma.course.findMany({
        where: {
          status: "published",
        },
        select: {
          slug: true,
          userCourseAttempts: {
            where: {
              userId: params.userId,
            },
            select: {
              status: true,
              completedAt: true,
            },
            orderBy: [{ lastOpenedAt: "desc" }, { createdAt: "desc" }],
            take: 1,
          },
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });

      const recommendedCourse = courses.find((course) => {
        const attempt = course.userCourseAttempts.at(0);

        return attempt?.status !== "completed" && !attempt?.completedAt;
      });

      return recommendedCourse?.slug ?? null;
    },
  });
}

export async function getCurriculumModule(params: {
  locale: string;
  userId: string;
  slug: string;
}) {
  return measureAsyncOperation({
    operation: "curriculum.getCurriculumModule",
    getRecords: (module) => (module ? 1 : 0),
    execute: async () => {
      const requestedLanguages = getRequestedLanguages(params.locale);

      const prismaStartedAt = Date.now();
      const course = await prisma.course.findFirst({
        where: {
          slug: params.slug,
          status: "published",
        },
        select: {
          slug: true,
          area: true,
          difficulty: true,
          estimatedDurationMinutes: true,
          lessonsCount: true,
          translations: {
            where: {
              language: {
                in: requestedLanguages,
              },
            },
            select: {
              language: true,
              title: true,
              subtitle: true,
              description: true,
              content: true,
              details: true,
            },
          },
          sections: {
            select: {
              id: true,
              slug: true,
              sortOrder: true,
              estimatedMinutes: true,
              translations: {
                where: {
                  language: {
                    in: requestedLanguages,
                  },
                },
                select: {
                  language: true,
                  title: true,
                  summary: true,
                  content: true,
                },
              },
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
          quizzes: {
            select: {
              id: true,
              type: true,
              title: true,
              description: true,
              passingScore: true,
              sortOrder: true,
              translations: {
                where: {
                  language: {
                    in: requestedLanguages,
                  },
                },
                select: {
                  language: true,
                  title: true,
                  description: true,
                },
              },
              questions: {
                select: {
                  id: true,
                  prompt: true,
                  explanation: true,
                  sortOrder: true,
                  translations: {
                    where: {
                      language: {
                        in: requestedLanguages,
                      },
                    },
                    select: {
                      language: true,
                      prompt: true,
                      explanation: true,
                    },
                  },
                  answers: {
                    select: {
                      id: true,
                      text: true,
                      isCorrect: true,
                      feedbackText: true,
                      sortOrder: true,
                      translations: {
                        where: {
                          language: {
                            in: requestedLanguages,
                          },
                        },
                        select: {
                          language: true,
                          text: true,
                          feedbackText: true,
                        },
                      },
                    },
                    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                  },
                },
                orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
              },
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
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
              completedAt: true,
              postQuizScore: true,
              currentStage: true,
              currentLessonIndex: true,
              completedLessons: true,
              preQuizAttempts: true,
              postQuizAttempts: true,
            },
            orderBy: [{ lastOpenedAt: "desc" }, { createdAt: "desc" }],
            take: 1,
          },
        },
      });

      logMeasuredOperation({
        operation: "curriculum.getCurriculumModule.prisma",
        durationMs: Date.now() - prismaStartedAt,
        records: course ? 1 : 0,
        meta: {
          translations: course ? course.translations.length : 0,
          sections: course ? course.sections.length : 0,
          quizzes: course ? course.quizzes.length : 0,
          responseBytes: estimateJsonBytes(course),
        },
      });

      if (!course) {
        return null;
      }

      const mappedModule = measureSyncOperation({
        operation: "curriculum.getCurriculumModule.map",
        records: 1,
        meta: {
          nodeElements: 1,
          sections: course.sections.length,
          quizzes: course.quizzes.length,
        },
        execute: () => mapCourseToViewModel(course as CourseMappedInput, params.locale),
      });

      logMeasuredOperation({
        operation: "curriculum.getCurriculumModule.payload",
        durationMs: 0,
        records: 1,
        meta: {
          responseBytes: estimateJsonBytes(mappedModule),
        },
      });

      return {
        module: mappedModule,
      };
    },
  });
}
