import {
  CourseMappedInput,
  CourseSectionRecord,
  CurriculumLessonViewModel,
  CurriculumListItemViewModel,
  CurriculumModuleViewModel,
  CurriculumProgressViewModel,
  CurriculumQuizAttemptViewModel,
  CurriculumTextToken,
  StoredQuizAttempt,
  TranslationRecord,
} from "@/lib/curriculum/types";
import { estimateJsonBytes } from "@/lib/observability/json-size";
import {
  logMeasuredOperation,
  measureAsyncOperation,
  measureSyncOperation,
} from "@/lib/observability/performance";
import { prisma } from "@/lib/prisma";

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

function mapDifficulty(difficulty: string): CurriculumModuleViewModel["difficulty"] {
  return difficulty === "intermediate" ? "intermediate" : "foundation";
}

function formatAttemptDate(value: string): string {
  const date = new Date(value);
  return date.toISOString();
}

function buildGeneratedOutcomes(area: CurriculumModuleViewModel["area"]): CurriculumTextToken[] {
  switch (area) {
    case "environmental":
      return [
        { key: "generatedOutcomes.environmental.0" },
        { key: "generatedOutcomes.environmental.1" },
        { key: "generatedOutcomes.environmental.2" },
      ];
    case "social":
      return [
        { key: "generatedOutcomes.social.0" },
        { key: "generatedOutcomes.social.1" },
        { key: "generatedOutcomes.social.2" },
      ];
    case "governance":
      return [
        { key: "generatedOutcomes.governance.0" },
        { key: "generatedOutcomes.governance.1" },
        { key: "generatedOutcomes.governance.2" },
      ];
    default:
      return [
        { key: "generatedOutcomes.crossCutting.0" },
        { key: "generatedOutcomes.crossCutting.1" },
        { key: "generatedOutcomes.crossCutting.2" },
      ];
  }
}

function buildGeneratedStructure(quizzesCount: number): CurriculumTextToken[] {
  const steps: CurriculumTextToken[] = [
    { key: "generatedStructure.preTest" },
    { key: "generatedStructure.lessons" },
  ];

  if (quizzesCount > 1) {
    steps.push({ key: "generatedStructure.postTest" });
  }

  return steps;
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
    currentStage?: string;
    currentLessonIndex?: number;
    completedLessons?: number;
    preQuizAttempts?: unknown;
    postQuizAttempts?: unknown;
  } | null;
  lessonsCount: number;
}): CurriculumProgressViewModel {
  const attempt = params.attempt ?? null;

  const preQuizAttempts = parseAttempts(attempt?.preQuizAttempts);
  const postQuizAttempts = parseAttempts(attempt?.postQuizAttempts);

  const currentStage = attempt ? mapStage(attempt.currentStage) : "overview";
  const completedLessons = attempt?.completedLessons ?? 0;
  const currentLessonIndex = attempt?.currentLessonIndex ?? 0;
  const totalLessons = Math.max(params.lessonsCount, 1);

  const preQuizRemainingAttempts = Math.max(0, 1 - preQuizAttempts.length);
  const postQuizRemainingAttempts = Math.max(0, 2 - postQuizAttempts.length);

  let nextAction: CurriculumTextToken = { key: "progressState.nextAction.startModule" };
  let currentLocation: CurriculumTextToken = {
    key: "progressState.currentLocation.preTestNotStarted",
  };

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
      postQuizAttempts.length > 0
        ? {
            key: "progressState.currentLocation.postTestAttempt",
            values: { current: postQuizAttempts.length + 1, total: 2 },
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

  const title = translation?.title ?? course.slug;
  const subtitle = normalizeOptionalText(translation?.subtitle);
  const description = normalizeOptionalText(translation?.description);
  const content = normalizeOptionalText(translation?.content);

  const lessonsData = mapSectionsToLessons(course.sections, locale);
  const lessonsCount =
    lessonsData.length > 0 ? lessonsData.length : Math.max(course.lessonsCount, 0);

  const progressState = buildProgressState({
    attempt,
    lessonsCount,
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
    durationMinutes: course.estimatedDurationMinutes,
    lessons: lessonsCount,
    quizzes: quizzesCount,
    lastOpenedAt: attempt?.lastOpenedAt?.toISOString() ?? null,
    difficulty: mapDifficulty(course.difficulty),
    outcomes: buildGeneratedOutcomes(area),
    structure: buildGeneratedStructure(quizzesCount),
    quizItems: (() => {
      if (!course.quizzes || course.quizzes.length === 0) {
        return [];
      }

      return course.quizzes.map((quiz) => {
        const quizTranslation = pickLocalizedRecord(quiz.translations, locale);

        return {
          id: quiz.id,
          type: mapQuizType(quiz.type),
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

export async function getCurriculumModules(params: { locale: string; userId: string }) {
  return measureAsyncOperation({
    operation: "curriculum.getCurriculumModules",
    getRecords: (modules) => modules.length,
    execute: async () => {
      const requestedLanguages = getRequestedLanguages(params.locale);

      const prismaStartedAt = Date.now();
      const courses = await prisma.course.findMany({
        where: {
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
        },
      });

      const modules = measureSyncOperation({
        operation: "curriculum.getCurriculumModules.map",
        records: courses.length,
        meta: {
          nodeElements: courses.length,
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
        },
      });

      return modules;
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
