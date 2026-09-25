"use server";

import { requireAuthenticatedUserId } from "@/lib/auth/require-authenticated-user-id";
import { calculateCurriculumProgress } from "@/lib/curriculum/progress-calculation";
import { getCurriculumModule } from "@/lib/curriculum/queries";
import {
  CURRICULUM_MODULE_QUIZ_PASSING_SCORE,
  CURRICULUM_POST_QUIZ_MAX_ATTEMPTS,
  CURRICULUM_PRE_QUIZ_MAX_ATTEMPTS,
} from "@/lib/curriculum/quiz-rules";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type SubmitQuizInput = {
  locale: string;
  courseSlug: string;
  quizId: string;
  quizType: "pre" | "post";
  selectedAnswers: Record<string, string>;
  flaggedQuestionIds: string[];
};

type StartCourseInput = {
  locale: string;
  courseSlug: string;
};

type CompleteLessonInput = {
  locale: string;
  courseSlug: string;
  lessonIndex: number;
};

type RetakeCourseInput = {
  locale: string;
  courseSlug: string;
};

type StoredSelectedAnswer = {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
};

type StoredQuizAttempt = {
  quizId?: string;
  quizType?: "pre" | "post";
  quizSortOrder?: number;
  passed?: boolean;
  attemptNumber: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  submittedAt: string;
  flaggedQuestionIds: string[];
  selectedAnswers: StoredSelectedAnswer[];
};

function parseAttemptArray(raw: unknown): StoredQuizAttempt[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.filter((item): item is StoredQuizAttempt => {
    if (typeof item !== "object" || item === null) return false;

    const candidate = item as Partial<StoredQuizAttempt>;

    return (
      typeof candidate.attemptNumber === "number" &&
      typeof candidate.score === "number" &&
      typeof candidate.correctCount === "number" &&
      typeof candidate.totalQuestions === "number" &&
      typeof candidate.submittedAt === "string" &&
      Array.isArray(candidate.flaggedQuestionIds) &&
      Array.isArray(candidate.selectedAnswers)
    );
  });
}

function getCompletedUnitQuizCount(attempts: StoredQuizAttempt[], totalPostQuizzes: number) {
  const passedQuizIds = new Set<string>();

  for (const attempt of attempts) {
    if (attempt.quizType !== "post" || !attempt.quizId) continue;

    if (attempt.passed === true && attempt.score >= CURRICULUM_MODULE_QUIZ_PASSING_SCORE) {
      passedQuizIds.add(attempt.quizId);
    }
  }

  return Math.min(passedQuizIds.size, Math.max(totalPostQuizzes, 0));
}

function getAllRequiredPostQuizzesPassed(params: {
  attempts: StoredQuizAttempt[];
  postQuizzes: Array<{ id: string; type: string }>;
}) {
  const requiredPostQuizIds = params.postQuizzes
    .filter((quiz) => quiz.type === "post")
    .map((quiz) => quiz.id);

  if (requiredPostQuizIds.length === 0) {
    return true;
  }

  return requiredPostQuizIds.every((quizId) =>
    params.attempts.some(
      (attempt) =>
        attempt.quizId === quizId &&
        attempt.quizType === "post" &&
        attempt.passed === true &&
        attempt.score >= CURRICULUM_MODULE_QUIZ_PASSING_SCORE,
    ),
  );
}

async function getAuthedUserId() {
  return requireAuthenticatedUserId();
}

async function runSerializableTransaction<T>(
  execute: (transaction: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await prisma.$transaction(execute, {
        isolationLevel: "Serializable",
      });
    } catch (error) {
      const retryable =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2034";

      if (!retryable || attempt === maxAttempts) {
        throw error;
      }
    }
  }

  throw new Error("Serializable curriculum transaction retry limit exceeded.");
}

export async function startCourseAction(input: StartCourseInput) {
  const userId = await getAuthedUserId();

  const course = await prisma.course.findFirst({
    where: {
      slug: input.courseSlug,
      status: "published",
    },
    select: {
      id: true,
      quizzes: {
        select: {
          type: true,
        },
      },
      _count: {
        select: {
          sections: true,
        },
      },
    },
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  const hasPreQuiz = course.quizzes.some((quiz) => quiz.type === "pre");
  const now = new Date();
  const initialLessonIndex = hasPreQuiz ? 0 : course._count.sections > 0 ? 1 : 0;

  const attempt = await prisma.userCourseAttempt.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
    update: {
      lastOpenedAt: now,
    },
    create: {
      userId,
      courseId: course.id,
      status: "in_progress",
      currentStage: hasPreQuiz ? "pre_quiz" : "lessons",
      currentLessonIndex: initialLessonIndex,
      completedLessons: 0,
      progressPercent: 0,
      preQuizAttempts: [],
      postQuizAttempts: [],
      startedAt: now,
      lastOpenedAt: now,
    },
  });

  if (attempt.status === "not_started" || attempt.currentStage === "overview") {
    await prisma.userCourseAttempt.update({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
      data: {
        status: "in_progress",
        currentStage: hasPreQuiz ? "pre_quiz" : "lessons",
        currentLessonIndex: initialLessonIndex,
        completedLessons: 0,
        progressPercent: 0,
        preQuizAttempts: [],
        postQuizAttempts: [],
        preQuizScore: null,
        postQuizScore: null,
        completedAt: null,
        startedAt: attempt.startedAt ?? now,
        lastOpenedAt: now,
      },
    });
  }

  const courseModuleResult = await getCurriculumModule({
    userId,
    locale: input.locale,
    slug: input.courseSlug,
  });

  return { module: courseModuleResult?.module ?? null };
}

export async function submitQuizAttemptAction(input: SubmitQuizInput) {
  const userId = await getAuthedUserId();

  const meta = await runSerializableTransaction(async (transaction) => {
    const course = await transaction.course.findFirst({
      where: {
        slug: input.courseSlug,
        status: "published",
      },
      include: {
        quizzes: {
          include: {
            questions: {
              include: {
                answers: true,
              },
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        },
        _count: {
          select: {
            sections: true,
          },
        },
      },
    });

    if (!course) {
      throw new Error("Course not found.");
    }

    const quiz = course.quizzes.find((item) => item.id === input.quizId);

    if (quiz?.type !== input.quizType) {
      throw new Error("Quiz not found.");
    }

    const courseAttempt = await transaction.userCourseAttempt.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
    });

    if (!courseAttempt) {
      throw new Error("Course attempt not found.");
    }

    const quizAvailable =
      input.quizType === "pre"
        ? courseAttempt.currentStage === "pre_quiz"
        : courseAttempt.currentStage === "post_quiz" &&
          courseAttempt.currentLessonIndex === quiz.sortOrder;

    if (!quizAvailable) {
      throw new Error("Quiz is not available at the current course stage.");
    }

    const questions = quiz.questions;
    const totalQuestions = questions.length;

    if (totalQuestions === 0) {
      throw new Error("This quiz has no questions.");
    }

    const allAnswered = questions.every((question) => Boolean(input.selectedAnswers[question.id]));

    if (!allAnswered) {
      throw new Error("All questions must be answered before finishing the quiz.");
    }

    const maxAttempts =
      input.quizType === "pre"
        ? CURRICULUM_PRE_QUIZ_MAX_ATTEMPTS
        : CURRICULUM_POST_QUIZ_MAX_ATTEMPTS;
    const rawAttempts =
      input.quizType === "pre" ? courseAttempt.preQuizAttempts : courseAttempt.postQuizAttempts;
    const allAttempts = parseAttemptArray(rawAttempts);
    const attemptsForCurrentQuiz =
      input.quizType === "pre"
        ? allAttempts
        : allAttempts.filter((attempt) => attempt.quizId === quiz.id);

    if (attemptsForCurrentQuiz.length >= maxAttempts) {
      throw new Error("No attempts remaining for this quiz.");
    }

    let correctCount = 0;

    const selectedAnswerRecords: StoredSelectedAnswer[] = questions.map((question) => {
      const answerId = input.selectedAnswers[question.id];
      const answer = question.answers.find((item) => item.id === answerId);

      if (!answer) {
        throw new Error("Invalid answer selection.");
      }

      if (answer.isCorrect) {
        correctCount += 1;
      }

      return {
        questionId: question.id,
        answerId: answer.id,
        isCorrect: answer.isCorrect,
      };
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const attemptNumber = attemptsForCurrentQuiz.length + 1;
    const submittedAt = new Date().toISOString();
    const passingScore =
      input.quizType === "post" ? CURRICULUM_MODULE_QUIZ_PASSING_SCORE : (quiz.passingScore ?? 0);
    const passed = score >= passingScore;

    const storedRecord: StoredQuizAttempt = {
      quizId: quiz.id,
      quizType: input.quizType,
      quizSortOrder: quiz.sortOrder,
      passed,
      attemptNumber,
      score,
      correctCount,
      totalQuestions,
      submittedAt,
      flaggedQuestionIds: input.flaggedQuestionIds,
      selectedAnswers: selectedAnswerRecords,
    };

    const nextAttempts: StoredQuizAttempt[] = [...allAttempts, storedRecord];
    const totalLessons = course._count.sections;
    const postQuizzes = course.quizzes.filter((item) => item.type === "post");
    const totalPostQuizzes = postQuizzes.length;
    const hasPreQuiz = course.quizzes.some((item) => item.type === "pre");

    if (input.quizType === "pre") {
      const completedPostQuizzes = getCompletedUnitQuizCount(
        parseAttemptArray(courseAttempt.postQuizAttempts),
        totalPostQuizzes,
      );

      await transaction.userCourseAttempt.update({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
        data: {
          preQuizAttempts: nextAttempts,
          preQuizScore: score,
          currentStage: "lessons",
          currentLessonIndex: totalLessons > 0 ? 1 : 0,
          completedLessons: 0,
          status: "in_progress",
          progressPercent: calculateCurriculumProgress({
            totalLessons,
            completedLessons: 0,
            totalPostQuizzes,
            completedPostQuizzes,
            hasPreQuiz,
            hasFinishedPreQuiz: true,
          }),
          lastOpenedAt: new Date(),
        },
      });
    } else {
      const attemptsExhausted = attemptNumber >= maxAttempts;
      const quizFinished = passed || attemptsExhausted;
      const completedLessonIndex = passed
        ? Math.max(courseAttempt.completedLessons, quiz.sortOrder)
        : courseAttempt.completedLessons;
      const completedPostQuizzes = getCompletedUnitQuizCount(nextAttempts, totalPostQuizzes);
      const allRequiredPostQuizzesPassed = getAllRequiredPostQuizzesPassed({
        attempts: nextAttempts,
        postQuizzes,
      });
      const isFinalUnit = totalLessons > 0 && completedLessonIndex >= totalLessons;
      const moduleCompleted = isFinalUnit && allRequiredPostQuizzesPassed;
      const moduleFailed = attemptsExhausted && !passed;
      const nextStage = moduleCompleted
        ? "completed"
        : quizFinished && passed
          ? "lessons"
          : "post_quiz";

      await transaction.userCourseAttempt.update({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
        data: {
          postQuizAttempts: nextAttempts,
          postQuizScore: score,
          currentStage: nextStage,
          currentLessonIndex: quizFinished
            ? isFinalUnit
              ? totalLessons
              : completedLessonIndex + 1
            : completedLessonIndex,
          completedLessons: completedLessonIndex,
          status: moduleCompleted ? "completed" : moduleFailed ? "failed" : "in_progress",
          progressPercent: moduleCompleted
            ? 100
            : calculateCurriculumProgress({
                totalLessons,
                completedLessons: completedLessonIndex,
                totalPostQuizzes,
                completedPostQuizzes,
                hasPreQuiz,
                hasFinishedPreQuiz: parseAttemptArray(courseAttempt.preQuizAttempts).length > 0,
              }),
          completedAt: moduleCompleted ? new Date() : null,
          lastOpenedAt: new Date(),
        },
      });
    }

    return {
      score,
      correctCount,
      totalQuestions,
      attemptNumber,
      maxAttempts,
      quizType: input.quizType,
    };
  });

  const courseModuleResult = await getCurriculumModule({
    userId,
    locale: input.locale,
    slug: input.courseSlug,
  });

  return {
    module: courseModuleResult?.module ?? null,
    meta,
  };
}

export async function completeLessonAction(input: CompleteLessonInput) {
  const userId = await getAuthedUserId();

  await runSerializableTransaction(async (transaction) => {
    const course = await transaction.course.findFirst({
      where: {
        slug: input.courseSlug,
        status: "published",
      },
      select: {
        id: true,
        quizzes: {
          select: {
            id: true,
            type: true,
            sortOrder: true,
          },
        },
        _count: {
          select: {
            sections: true,
          },
        },
      },
    });

    if (!course) {
      throw new Error("Course not found.");
    }

    const totalLessons = course._count.sections;

    if (
      !Number.isInteger(input.lessonIndex) ||
      input.lessonIndex < 1 ||
      input.lessonIndex > totalLessons
    ) {
      throw new Error("Lesson not found.");
    }

    const courseAttempt = await transaction.userCourseAttempt.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
    });

    if (!courseAttempt) {
      throw new Error("Course attempt not found.");
    }

    if (input.lessonIndex <= courseAttempt.completedLessons) {
      return;
    }

    if (
      courseAttempt.currentStage !== "lessons" ||
      courseAttempt.currentLessonIndex !== input.lessonIndex
    ) {
      throw new Error("Lesson is not available at the current course stage.");
    }

    const completedLessons = input.lessonIndex;
    const unitQuiz = course.quizzes.find(
      (quiz) => quiz.type === "post" && quiz.sortOrder === input.lessonIndex,
    );
    const finishedAllLessons = completedLessons >= totalLessons;
    const currentPostAttempts = parseAttemptArray(courseAttempt.postQuizAttempts);
    const postQuizzes = course.quizzes.filter((quiz) => quiz.type === "post");
    const completedPostQuizzes = getCompletedUnitQuizCount(currentPostAttempts, postQuizzes.length);
    const allRequiredPostQuizzesPassed = getAllRequiredPostQuizzesPassed({
      attempts: currentPostAttempts,
      postQuizzes,
    });
    const moduleCompleted = finishedAllLessons && !unitQuiz && allRequiredPostQuizzesPassed;
    const hasPreQuiz = course.quizzes.some((quiz) => quiz.type === "pre");

    await transaction.userCourseAttempt.update({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
      data: {
        completedLessons,
        currentLessonIndex: unitQuiz
          ? input.lessonIndex
          : finishedAllLessons
            ? totalLessons
            : completedLessons + 1,
        currentStage: unitQuiz ? "post_quiz" : moduleCompleted ? "completed" : "lessons",
        status: moduleCompleted ? "completed" : "in_progress",
        progressPercent: moduleCompleted
          ? 100
          : calculateCurriculumProgress({
              totalLessons,
              completedLessons,
              totalPostQuizzes: postQuizzes.length,
              completedPostQuizzes,
              hasPreQuiz,
              hasFinishedPreQuiz: parseAttemptArray(courseAttempt.preQuizAttempts).length > 0,
            }),
        completedAt: moduleCompleted ? (courseAttempt.completedAt ?? new Date()) : null,
        lastOpenedAt: new Date(),
      },
    });
  });

  const courseModuleResult = await getCurriculumModule({
    userId,
    locale: input.locale,
    slug: input.courseSlug,
  });

  return { module: courseModuleResult?.module ?? null };
}

export async function retakeCourseAction(input: RetakeCourseInput) {
  const userId = await getAuthedUserId();

  const course = await prisma.course.findFirst({
    where: {
      slug: input.courseSlug,
      status: "published",
    },
    select: {
      id: true,
      quizzes: {
        select: {
          type: true,
        },
      },
      _count: {
        select: {
          sections: true,
        },
      },
    },
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  const hasPreQuiz = course.quizzes.some((quiz) => quiz.type === "pre");

  const courseAttempt = await prisma.userCourseAttempt.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  if (!courseAttempt) {
    throw new Error("Course attempt not found.");
  }

  await prisma.userCourseAttempt.update({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
    data: {
      status: "in_progress",
      currentStage: hasPreQuiz ? "pre_quiz" : "lessons",
      currentLessonIndex: hasPreQuiz ? 0 : course._count.sections > 0 ? 1 : 0,
      completedLessons: 0,
      progressPercent: 0,
      preQuizAttempts: [],
      postQuizAttempts: [],
      preQuizScore: null,
      postQuizScore: null,
      completedAt: null,
      startedAt: new Date(),
      lastOpenedAt: new Date(),
    },
  });

  const courseModuleResult = await getCurriculumModule({
    userId,
    locale: input.locale,
    slug: input.courseSlug,
  });

  return { module: courseModuleResult?.module ?? null };
}
