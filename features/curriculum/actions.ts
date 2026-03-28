"use server";

import { getCourseLearningWorkspace } from "@/lib/curriculum/queries";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type SubmitQuizInput = {
  locale: string;
  courseSlug: string;
  quizType: "pre" | "post";
  selectedAnswers: Record<string, string>;
  flaggedQuestionIds: string[];
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
  attemptNumber: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  submittedAt: string;
  flaggedQuestionIds: string[];
  selectedAnswers: StoredSelectedAnswer[];
};

function calculateProgress(params: {
  totalLessons: number;
  completedLessons: number;
  hasFinishedPreQuiz: boolean;
  hasFinishedPostQuiz: boolean;
}) {
  const lessonWeight = 60;
  const preWeight = 20;
  const postWeight = 20;

  const lessonPart =
    params.totalLessons > 0
      ? Math.round((params.completedLessons / params.totalLessons) * lessonWeight)
      : lessonWeight;

  return Math.min(
    100,
    (params.hasFinishedPreQuiz ? preWeight : 0) +
      lessonPart +
      (params.hasFinishedPostQuiz ? postWeight : 0),
  );
}

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

export async function submitQuizAttemptAction(input: SubmitQuizInput) {
  const userId = await getAuthedUserId();

  const course = await prisma.course.findUnique({
    where: { slug: input.courseSlug },
    include: {
      quizzes: {
        where: {
          type: input.quizType,
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

  if (!quiz) {
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

  let maxAttempts: number;
  let rawAttempts: typeof courseAttempt.preQuizAttempts;

  if (input.quizType === "pre") {
    maxAttempts = 1;
    rawAttempts = courseAttempt.preQuizAttempts;
  } else {
    maxAttempts = 2;
    rawAttempts = courseAttempt.postQuizAttempts;
  }
  const attempts = parseAttemptArray(rawAttempts);

  if (attempts.length >= maxAttempts) {
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
  const attemptNumber = attempts.length + 1;
  const submittedAt = new Date().toISOString();

  const storedRecord: StoredQuizAttempt = {
    attemptNumber,
    score,
    correctCount,
    totalQuestions,
    submittedAt,
    flaggedQuestionIds: input.flaggedQuestionIds,
    selectedAnswers: selectedAnswerRecords,
  };

  const nextAttempts: StoredQuizAttempt[] = [...attempts, storedRecord];

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
          hasFinishedPreQuiz: true,
          hasFinishedPostQuiz: false,
        }),
        lastOpenedAt: new Date(),
      },
    });
  } else {
    const totalLessons = Math.max(course.lessonsCount, 1);
    const passingScore = quiz.passingScore ?? 0;
    const passed = score >= passingScore;
    const attemptsExhausted = nextAttempts.length >= maxAttempts;

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
        currentStage: passed || attemptsExhausted ? "completed" : "post_quiz",
        status: passed || attemptsExhausted ? "completed" : "in_progress",
        progressPercent:
          passed || attemptsExhausted
            ? 100
            : calculateProgress({
                totalLessons,
                completedLessons: totalLessons,
                hasFinishedPreQuiz: true,
                hasFinishedPostQuiz: false,
              }),
        completedAt: passed || attemptsExhausted ? new Date() : null,
        lastOpenedAt: new Date(),
      },
    });
  }

  const courseModule = await getCourseLearningWorkspace({
    userId,
    locale: input.locale,
    slug: input.courseSlug,
  });

  return {
    module: courseModule,
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
  const finishedAllLessons = completedLessons >= totalLessons;

  await prisma.userCourseAttempt.update({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
    data: {
      completedLessons,
      currentLessonIndex: finishedAllLessons ? totalLessons : completedLessons + 1,
      currentStage: finishedAllLessons ? "post_quiz" : "lessons",
      status: "in_progress",
      progressPercent: calculateProgress({
        totalLessons,
        completedLessons,
        hasFinishedPreQuiz: true,
        hasFinishedPostQuiz: false,
      }),
      lastOpenedAt: new Date(),
    },
  });

  const courseModule = await getCourseLearningWorkspace({
    userId,
    locale: input.locale,
    slug: input.courseSlug,
  });

  return { module: courseModule };
}

export async function retakeCourseAction(input: RetakeCourseInput) {
  const userId = await getAuthedUserId();

  const course = await prisma.course.findUnique({
    where: { slug: input.courseSlug },
    select: {
      id: true,
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

  await prisma.userCourseAttempt.update({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
    data: {
      status: "in_progress",
      currentStage: "pre_quiz",
      currentLessonIndex: 0,
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

  const courseModule = await getCourseLearningWorkspace({
    userId,
    locale: input.locale,
    slug: input.courseSlug,
  });

  return { module: courseModule };
}
