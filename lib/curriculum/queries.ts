import { supportedLanguages } from "@/lib/constants";
import {
  CourseMappedInput,
  CourseSectionRecord,
  CurriculumLessonViewModel,
  CurriculumModuleViewModel,
  CurriculumProgressViewModel,
  CurriculumQuizAttemptViewModel,
  CurriculumTextToken,
  StoredQuizAttempt,
  TranslationRecord,
} from "@/lib/curriculum/types";
import { logMeasuredOperation, measureAsyncOperation } from "@/lib/observability/performance";
import { prisma } from "@/lib/prisma";

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

  return translations[0] ?? null;
}

function pickLocalizedRecord<T extends { language: string }>(
  records: T[],
  locale: string,
): T | null {
  const localeRecord = records.find((record) => record.language === locale);
  if (localeRecord) {
    return localeRecord;
  }

  const englishRecord = records.find((record) => record.language === "en");
  if (englishRecord) {
    return englishRecord;
  }

  return records[0] ?? null;
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

  return [...sections]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section, index) => {
      const translation = pickLocalizedRecord(section.translations, locale);

      return {
        index: index + 1,
        slug: section.slug,
        title: translation?.title ?? section.slug,
        summary: normalizeOptionalText(translation?.summary),
        content: normalizeOptionalText(translation?.content),
        estimatedMinutes: section.estimatedMinutes ?? 8,
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
    quizItems:
      course.quizzes?.map((quiz) => {
        const quizTranslation = pickLocalizedRecord(quiz.translations, locale);

        return {
          id: quiz.id,
          type: mapQuizType(quiz.type),
          title: quizTranslation?.title ?? quiz.title ?? null,
          description: normalizeOptionalText(quizTranslation?.description ?? quiz.description),
          passingScore: quiz.passingScore,
          questions: [...quiz.questions]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((question) => {
              const questionTranslation = pickLocalizedRecord(question.translations, locale);

              return {
                id: question.id,
                prompt: questionTranslation?.prompt ?? question.prompt,
                explanation: normalizeOptionalText(
                  questionTranslation?.explanation ?? question.explanation,
                ),
                answers: [...question.answers]
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((answer) => {
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
      }) ?? [],
    lessonsData,
    progressState,
  };
}

function countCourseTranslations(
  courses: Array<{
    translations: Array<{ language: string }>;
    sections?: Array<{ translations: Array<{ language: string }> }>;
  }>,
) {
  return courses.reduce((sum, course) => {
    const sectionTranslations = (course.sections ?? []).reduce(
      (sectionSum, section) => sectionSum + section.translations.length,
      0,
    );

    return sum + course.translations.length + sectionTranslations;
  }, 0);
}

function countCourseRelations(
  courses: Array<{
    sections?: Array<unknown>;
    userCourseAttempts: Array<unknown>;
  }>,
) {
  return courses.reduce(
    (sum, course) => sum + (course.sections?.length ?? 0) + course.userCourseAttempts.length,
    0,
  );
}

function countQuizQuestionRelations(course: {
  quizzes?: Array<{ questions: Array<{ answers: unknown[] }> }>;
}) {
  return (course.quizzes ?? []).reduce((sum, quiz) => {
    const answersCount = quiz.questions.reduce(
      (answersSum, question) => answersSum + question.answers.length,
      0,
    );

    return sum + quiz.questions.length + answersCount;
  }, 0);
}

function countQuizTranslations(course: {
  quizzes?: Array<{
    translations: Array<{ language: string }>;
    questions: Array<{
      translations: Array<{ language: string }>;
      answers: Array<{
        translations: Array<{ language: string }>;
      }>;
    }>;
  }>;
}) {
  return (course.quizzes ?? []).reduce((sum, quiz) => {
    const questionTranslations = quiz.questions.reduce((questionSum, question) => {
      const answerTranslations = question.answers.reduce(
        (answerSum, answer) => answerSum + answer.translations.length,
        0,
      );

      return questionSum + question.translations.length + answerTranslations;
    }, 0);

    return sum + quiz.translations.length + questionTranslations;
  }, 0);
}

export async function getAllCurriculumModules(params: { userId: string; locale: string }) {
  return measureAsyncOperation({
    operation: "curriculum.getAllCurriculumModules",
    getRecords: (modules) => modules.length,
    execute: async () => {
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
                in: supportedLanguages,
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
              translations: {
                where: {
                  language: {
                    in: [params.locale, "en"],
                  },
                },
                select: {
                  language: true,
                  title: true,
                  description: true,
                },
              },
              questions: {
                orderBy: {
                  sortOrder: "asc",
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
                      prompt: true,
                      explanation: true,
                    },
                  },
                  answers: {
                    orderBy: {
                      sortOrder: "asc",
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
                          text: true,
                          feedbackText: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });

      logMeasuredOperation({
        operation: "curriculum.getAllCurriculumModules.prisma",
        durationMs: Date.now() - prismaStartedAt,
        records: courses.length,
        meta: {
          translations: countCourseTranslations(courses),
          relations: countCourseRelations(courses),
          quizzes: courses.reduce(
            (sum: number, course: { _count: { quizzes: number } }) => sum + course._count.quizzes,
            0,
          ),
        },
      });

      return courses.map((course: CourseMappedInput) =>
        mapCourseToViewModel(course, params.locale),
      );
    },
  });
}

export async function getMyCurriculumModules(params: { userId: string; locale: string }) {
  return measureAsyncOperation({
    operation: "curriculum.getMyCurriculumModules",
    getRecords: (modules) => modules.length,
    execute: async () => {
      const prismaStartedAt = Date.now();
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
        select: {
          slug: true,
          area: true,
          difficulty: true,
          estimatedDurationMinutes: true,
          lessonsCount: true,
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

      logMeasuredOperation({
        operation: "curriculum.getMyCurriculumModules.prisma",
        durationMs: Date.now() - prismaStartedAt,
        records: courses.length,
        meta: {
          translations: countCourseTranslations(courses),
          relations: countCourseRelations(courses),
          quizzes: courses.reduce(
            (sum: number, course: { _count: { quizzes: number } }) => sum + course._count.quizzes,
            0,
          ),
        },
      });

      return courses.map((course: CourseMappedInput) =>
        mapCourseToViewModel(course, params.locale),
      );
    },
  });
}

export async function getCourseDetail(params: { userId: string; locale: string; slug: string }) {
  return measureAsyncOperation({
    operation: "curriculum.getCourseDetail",
    getRecords: (course) => (course ? 1 : 0),
    execute: async () => {
      const coursePrismaStartedAt = Date.now();
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
          sections: {
            orderBy: {
              sortOrder: "asc",
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
                  summary: true,
                  content: true,
                },
              },
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
              translations: {
                where: {
                  language: {
                    in: [params.locale, "en"],
                  },
                },
                select: {
                  language: true,
                  title: true,
                  description: true,
                },
              },
              questions: {
                orderBy: {
                  sortOrder: "asc",
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
                      prompt: true,
                      explanation: true,
                    },
                  },
                  answers: {
                    orderBy: {
                      sortOrder: "asc",
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
                          text: true,
                          feedbackText: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      logMeasuredOperation({
        operation: "curriculum.getCourseDetail.prisma",
        durationMs: Date.now() - coursePrismaStartedAt,
        records: course ? 1 : 0,
        meta: {
          translations: course ? countCourseTranslations([course]) : 0,
          relations: course ? countCourseRelations([course]) : 0,
          quizzes: course?._count.quizzes ?? 0,
          quizQuestionRelations: course ? countQuizQuestionRelations(course) : 0,
          quizTranslations: course ? countQuizTranslations(course) : 0,
        },
      });

      if (course?.status !== "published") {
        return null;
      }

      const courseModule = mapCourseToViewModel(course, params.locale);

      const relatedPrismaStartedAt = Date.now();
      const relatedCourses = await prisma.course.findMany({
        where: {
          status: "published",
          slug: {
            not: params.slug,
          },
          area: course.area,
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
                in: [params.locale, "en"],
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

      logMeasuredOperation({
        operation: "curriculum.getCourseDetail.related.prisma",
        durationMs: Date.now() - relatedPrismaStartedAt,
        records: relatedCourses.length,
        meta: {
          translations: countCourseTranslations(relatedCourses),
          relations: countCourseRelations(relatedCourses),
          quizzes: relatedCourses.reduce(
            (sum: number, item: { _count: { quizzes: number } }) => sum + item._count.quizzes,
            0,
          ),
        },
      });

      const relatedModules = relatedCourses.map((item: CourseMappedInput) =>
        mapCourseToViewModel(item, params.locale),
      );

      return {
        module: courseModule,
        relatedModules,
      };
    },
  });
}

export async function getCourseLearningWorkspace(params: {
  userId: string;
  locale: string;
  slug: string;
}) {
  return measureAsyncOperation({
    operation: "curriculum.getCourseLearningWorkspace",
    getRecords: (workspace) => (workspace ? 1 : 0),
    execute: async () => {
      const course = await prisma.course.findUnique({
        where: { slug: params.slug },
        select: {
          id: true,
          status: true,
          sections: {
            select: {
              id: true,
            },
          },
        },
      });

      if (course?.status !== "published") {
        return null;
      }

      const lessonCount = course.sections.length;

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

      if (!detail) {
        return null;
      }

      return {
        ...detail.module,
        lessons: lessonCount > 0 ? lessonCount : detail.module.lessons,
      };
    },
  });
}
