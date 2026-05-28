"use server";

import { getCurriculumModule } from "@/lib/curriculum/queries";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

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

function getCompletedUnitQuizCount(attempts: StoredQuizAttempt[], totalLessons: number) {
  const groupedAttempts = new Map<string, StoredQuizAttempt[]>();

  for (const attempt of attempts) {
    if (attempt.quizType !== "post" || !attempt.quizId) continue;

    const currentAttempts = groupedAttempts.get(attempt.quizId) ?? [];
    currentAttempts.push(attempt);
    groupedAttempts.set(attempt.quizId, currentAttempts);
  }

  let completed = 0;

  for (const attemptsForQuiz of groupedAttempts.values()) {
    const hasPassedAttempt = attemptsForQuiz.some((attempt) => attempt.passed === true);
    const attemptsExhausted = attemptsForQuiz.length >= 2;

    if (hasPassedAttempt || attemptsExhausted) {
      completed += 1;
    }
  }

  return Math.min(completed, totalLessons);
}

function calculateProgress(params: {
  totalLessons: number;
  completedLessons: number;
  completedUnitQuizzes: number;
  hasPreQuiz: boolean;
  hasFinishedPreQuiz: boolean;
}) {
  const totalCheckpoints = params.totalLessons * 2 + (params.hasPreQuiz ? 1 : 0);

  if (totalCheckpoints <= 0) {
    return 0;
  }

  const completedCheckpoints =
    params.completedLessons +
    params.completedUnitQuizzes +
    (params.hasPreQuiz && params.hasFinishedPreQuiz ? 1 : 0);

  return Math.min(100, Math.round((completedCheckpoints / totalCheckpoints) * 100));
}

async function getAuthedUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user.id;
}

export async function startCourseAction(input: StartCourseInput) {
  const userId = await getAuthedUserId();

  const course = await prisma.course.findUnique({
    where: { slug: input.courseSlug },
    include: {
      quizzes: {
        select: {
          id: true,
          type: true,
        },
      },
    },
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  const hasPreQuiz = course.quizzes.some((quiz) => quiz.type === "pre");
  const startedAt = new Date();

  const existingAttempt = await prisma.userCourseAttempt.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  if (!existingAttempt) {
    await prisma.userCourseAttempt.create({
      data: {
        userId,
        courseId: course.id,
        status: "in_progress",
        currentStage: hasPreQuiz ? "pre_quiz" : "lessons",
        currentLessonIndex: hasPreQuiz ? 0 : 1,
        completedLessons: 0,
        progressPercent: 0,
        preQuizAttempts: [],
        postQuizAttempts: [],
        startedAt,
        lastOpenedAt: startedAt,
      },
    });
  } else if (
    existingAttempt.status === "not_started" ||
    existingAttempt.currentStage === "overview"
  ) {
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
        currentLessonIndex: hasPreQuiz ? 0 : 1,
        completedLessons: 0,
        progressPercent: 0,
        startedAt: existingAttempt.startedAt ?? startedAt,
        lastOpenedAt: startedAt,
      },
    });
  } else {
    await prisma.userCourseAttempt.update({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
      data: {
        lastOpenedAt: startedAt,
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

  const course = await prisma.course.findUnique({
    where: { slug: input.courseSlug },
    include: {
      quizzes: {
        where: {
          id: input.quizId,
        },
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
    },
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  const quiz = course.quizzes.at(0);

  if (quiz?.type !== input.quizType) {
    throw new Error("Quiz not found.");
  }

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

  const questions = quiz.questions;
  const totalQuestions = questions.length;

  if (totalQuestions === 0) {
    throw new Error("This quiz has no questions.");
  }

  const allAnswered = questions.every((question) => Boolean(input.selectedAnswers[question.id]));
  if (!allAnswered) {
    throw new Error("All questions must be answered before finishing the quiz.");
  }

  const maxAttempts = input.quizType === "pre" ? 1 : 2;
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
  const passingScore = quiz.passingScore ?? 0;
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

  if (input.quizType === "pre") {
    const totalLessons = Math.max(course.lessonsCount, 1);

    await prisma.userCourseAttempt.update({
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
        currentLessonIndex: 1,
        completedLessons: 0,
        status: "in_progress",
        progressPercent: calculateProgress({
          totalLessons,
          completedLessons: 0,
          completedUnitQuizzes: getCompletedUnitQuizCount(
            parseAttemptArray(courseAttempt.postQuizAttempts),
            totalLessons,
          ),
          hasPreQuiz: true,
          hasFinishedPreQuiz: true,
        }),
        lastOpenedAt: new Date(),
      },
    });
  } else {
    const totalLessons = Math.max(course.lessonsCount, 1);
    const attemptsExhausted = attemptNumber >= maxAttempts;
    const quizFinished = passed || attemptsExhausted;
    const completedLessonIndex = Math.max(
      courseAttempt.completedLessons,
      quiz.sortOrder,
      courseAttempt.currentLessonIndex ?? 0,
    );
    const isFinalUnit = completedLessonIndex >= totalLessons;
    const nextStage = quizFinished ? (isFinalUnit ? "completed" : "lessons") : "post_quiz";
    const completedUnitQuizzes = getCompletedUnitQuizCount(nextAttempts, totalLessons);

    await prisma.userCourseAttempt.update({
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
        status: nextStage === "completed" ? "completed" : "in_progress",
        progressPercent:
          nextStage === "completed"
            ? 100
            : calculateProgress({
                totalLessons,
                completedLessons: completedLessonIndex,
                completedUnitQuizzes,
                hasPreQuiz: false,
                hasFinishedPreQuiz: parseAttemptArray(courseAttempt.preQuizAttempts).length > 0,
              }),
        completedAt: nextStage === "completed" ? new Date() : null,
        lastOpenedAt: new Date(),
      },
    });
  }

  const courseModuleResult = await getCurriculumModule({
    userId,
    locale: input.locale,
    slug: input.courseSlug,
  });

  return {
    module: courseModuleResult?.module ?? null,
    meta: {
      score,
      correctCount,
      totalQuestions,
      attemptNumber,
      maxAttempts,
      quizType: input.quizType,
    },
  };
}

export async function completeLessonAction(input: CompleteLessonInput) {
  const userId = await getAuthedUserId();

  const course = await prisma.course.findUnique({
    where: { slug: input.courseSlug },
    select: {
      id: true,
      lessonsCount: true,
      quizzes: {
        select: {
          id: true,
          type: true,
          sortOrder: true,
        },
      },
    },
  });

  if (!course) {
    throw new Error("Course not found.");
  }

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

  const totalLessons = Math.max(course.lessonsCount, 1);
  const completedLessons = Math.max(courseAttempt.completedLessons, input.lessonIndex);
  const unitQuiz = course.quizzes.find(
    (quiz) => quiz.type === "post" && quiz.sortOrder === input.lessonIndex,
  );
  const finishedAllLessons = completedLessons >= totalLessons;
  const currentPostAttempts = parseAttemptArray(courseAttempt.postQuizAttempts);
  const completedUnitQuizzes = getCompletedUnitQuizCount(currentPostAttempts, totalLessons);

  await prisma.userCourseAttempt.update({
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
      currentStage: unitQuiz ? "post_quiz" : finishedAllLessons ? "completed" : "lessons",
      status: finishedAllLessons && !unitQuiz ? "completed" : "in_progress",
      progressPercent:
        finishedAllLessons && !unitQuiz
          ? 100
          : calculateProgress({
              totalLessons,
              completedLessons,
              completedUnitQuizzes,
              hasPreQuiz: false,
              hasFinishedPreQuiz: parseAttemptArray(courseAttempt.preQuizAttempts).length > 0,
            }),
      completedAt: finishedAllLessons && !unitQuiz ? new Date() : null,
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

export async function retakeCourseAction(input: RetakeCourseInput) {
  const userId = await getAuthedUserId();

  const course = await prisma.course.findUnique({
    where: { slug: input.courseSlug },
    select: {
      id: true,
      quizzes: {
        select: {
          type: true,
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
      currentLessonIndex: hasPreQuiz ? 0 : 1,
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
