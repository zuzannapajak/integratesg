import { randomUUID } from "node:crypto";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => ({
  requireAuthenticatedUserId: vi.fn(),
}));

vi.mock("@/lib/auth/require-authenticated-user-id", () => ({
  requireAuthenticatedUserId: authMocks.requireAuthenticatedUserId,
}));

import {
  completeLessonAction,
  retakeCourseAction,
  startCourseAction,
  submitQuizAttemptAction,
} from "@/features/curriculum/actions";
import { prisma } from "@/lib/prisma";

const createdCourseIds = new Set<string>();
const createdProfileIds = new Set<string>();

function unique(prefix: string) {
  return `${prefix}-${randomUUID()}`;
}

async function createProfile(label: string) {
  const id = unique(`curriculum-action-${label}`);
  const profile = await prisma.profile.create({
    data: {
      id,
      email: `${id}@example.test`,
      fullName: `Curriculum action ${label}`,
      preferredLanguage: "en",
      role: "educator",
    },
  });

  createdProfileIds.add(profile.id);
  return profile;
}

type QuizFixture = {
  id: string;
  questionId: string;
  correctAnswerId: string;
  wrongAnswerId: string;
};

async function createQuizFixture(params: {
  courseId: string;
  type: "pre" | "post";
  sortOrder: number;
}): Promise<QuizFixture> {
  const quiz = await prisma.quiz.create({
    data: {
      courseId: params.courseId,
      type: params.type,
      sortOrder: params.sortOrder,
      title: `${params.type} quiz`,
      passingScore: 75,
      questions: {
        create: {
          prompt: `${params.type} question`,
          sortOrder: 1,
          answers: {
            create: [
              {
                text: "Correct answer",
                isCorrect: true,
                sortOrder: 1,
              },
              {
                text: "Wrong answer",
                isCorrect: false,
                sortOrder: 2,
              },
            ],
          },
        },
      },
    },
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  const question = quiz.questions.at(0);
  const correctAnswer = question?.answers.find((answer) => answer.isCorrect);
  const wrongAnswer = question?.answers.find((answer) => !answer.isCorrect);

  if (!question || !correctAnswer || !wrongAnswer) {
    throw new Error("Quiz fixture is incomplete.");
  }

  return {
    id: quiz.id,
    questionId: question.id,
    correctAnswerId: correctAnswer.id,
    wrongAnswerId: wrongAnswer.id,
  };
}

async function createCourseFixture(params: {
  label: string;
  lessons?: number;
  status?: "draft" | "published";
  withPreQuiz?: boolean;
  withPostQuiz?: boolean;
}) {
  const lessons = params.lessons ?? 2;
  const slug = unique(`p1-curriculum-action-${params.label}`);

  const course = await prisma.course.create({
    data: {
      slug,
      status: params.status ?? "published",
      area: "social",
      difficulty: "foundation",
      sortOrder: 10_000,
      lessonsCount: lessons,
      translations: {
        create: {
          language: "en",
          title: `Action course ${params.label}`,
          description: `Action course ${params.label} description`,
        },
      },
    },
  });

  createdCourseIds.add(course.id);

  for (let index = 1; index <= lessons; index += 1) {
    await prisma.courseSection.create({
      data: {
        courseId: course.id,
        slug: `lesson-${index}`,
        sortOrder: index,
        translations: {
          create: {
            language: "en",
            title: `Lesson ${index}`,
            summary: `Lesson ${index} summary`,
            content: `Lesson ${index} content`,
          },
        },
      },
    });
  }

  const preQuiz = params.withPreQuiz
    ? await createQuizFixture({
        courseId: course.id,
        type: "pre",
        sortOrder: 0,
      })
    : null;

  const postQuiz = params.withPostQuiz
    ? await createQuizFixture({
        courseId: course.id,
        type: "post",
        sortOrder: 1,
      })
    : null;

  return {
    ...course,
    preQuiz,
    postQuiz,
  };
}

async function readAttempt(userId: string, courseId: string) {
  return prisma.userCourseAttempt.findUniqueOrThrow({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });
}

beforeEach(() => {
  authMocks.requireAuthenticatedUserId.mockReset();
});

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

describe("curriculum progress actions", () => {
  it("requires authentication, ignores a forged userId and refuses draft courses", async () => {
    const userA = await createProfile("security-a");
    const userB = await createProfile("security-b");
    const published = await createCourseFixture({
      label: "security-published",
      lessons: 1,
    });
    const draft = await createCourseFixture({
      label: "security-draft",
      lessons: 1,
      status: "draft",
    });

    authMocks.requireAuthenticatedUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    await expect(
      startCourseAction({
        locale: "en",
        courseSlug: published.slug,
      }),
    ).rejects.toThrow("Unauthorized");

    expect(
      await prisma.userCourseAttempt.count({
        where: {
          courseId: published.id,
        },
      }),
    ).toBe(0);

    authMocks.requireAuthenticatedUserId.mockResolvedValue(userA.id);

    await startCourseAction({
      locale: "en",
      courseSlug: published.slug,
      userId: userB.id,
    } as never);

    expect(
      await prisma.userCourseAttempt.findUnique({
        where: {
          userId_courseId: {
            userId: userA.id,
            courseId: published.id,
          },
        },
      }),
    ).not.toBeNull();

    expect(
      await prisma.userCourseAttempt.findUnique({
        where: {
          userId_courseId: {
            userId: userB.id,
            courseId: published.id,
          },
        },
      }),
    ).toBeNull();

    await expect(
      startCourseAction({
        locale: "en",
        courseSlug: draft.slug,
      }),
    ).rejects.toThrow("Course not found.");
  });

  it("calculates 0%, intermediate and 100% progress and keeps lesson completion idempotent", async () => {
    const user = await createProfile("progress");
    const course = await createCourseFixture({
      label: "progress",
      lessons: 2,
    });

    authMocks.requireAuthenticatedUserId.mockResolvedValue(user.id);

    await startCourseAction({
      locale: "en",
      courseSlug: course.slug,
    });

    let attempt = await readAttempt(user.id, course.id);

    expect(attempt.progressPercent).toBe(0);
    expect(attempt.currentLessonIndex).toBe(1);
    expect(attempt.completedLessons).toBe(0);

    await completeLessonAction({
      locale: "en",
      courseSlug: course.slug,
      lessonIndex: 1,
    });

    attempt = await readAttempt(user.id, course.id);

    expect(attempt.progressPercent).toBe(50);
    expect(attempt.currentLessonIndex).toBe(2);
    expect(attempt.completedLessons).toBe(1);
    expect(attempt.status).toBe("in_progress");

    await completeLessonAction({
      locale: "en",
      courseSlug: course.slug,
      lessonIndex: 1,
    });

    expect(await readAttempt(user.id, course.id)).toMatchObject({
      progressPercent: 50,
      currentLessonIndex: 2,
      completedLessons: 1,
      status: "in_progress",
    });

    await Promise.all([
      completeLessonAction({
        locale: "en",
        courseSlug: course.slug,
        lessonIndex: 2,
      }),
      completeLessonAction({
        locale: "en",
        courseSlug: course.slug,
        lessonIndex: 2,
      }),
    ]);

    attempt = await readAttempt(user.id, course.id);

    expect(attempt.progressPercent).toBe(100);
    expect(attempt.completedLessons).toBe(2);
    expect(attempt.status).toBe("completed");
    expect(attempt.currentStage).toBe("completed");
    expect(attempt.completedAt).not.toBeNull();

    const completedAt = attempt.completedAt?.toISOString();

    await completeLessonAction({
      locale: "en",
      courseSlug: course.slug,
      lessonIndex: 2,
    });

    expect((await readAttempt(user.id, course.id)).completedAt?.toISOString()).toBe(completedAt);

    await expect(
      completeLessonAction({
        locale: "en",
        courseSlug: course.slug,
        lessonIndex: 3,
      }),
    ).rejects.toThrow("Lesson not found.");
  });

  it("isolates progress between two users", async () => {
    const userA = await createProfile("isolation-a");
    const userB = await createProfile("isolation-b");
    const course = await createCourseFixture({
      label: "isolation",
      lessons: 2,
    });

    authMocks.requireAuthenticatedUserId.mockResolvedValue(userA.id);
    await startCourseAction({ locale: "en", courseSlug: course.slug });

    authMocks.requireAuthenticatedUserId.mockResolvedValue(userB.id);
    await startCourseAction({ locale: "en", courseSlug: course.slug });

    authMocks.requireAuthenticatedUserId.mockResolvedValue(userA.id);
    await completeLessonAction({
      locale: "en",
      courseSlug: course.slug,
      lessonIndex: 1,
    });

    expect(await readAttempt(userA.id, course.id)).toMatchObject({
      completedLessons: 1,
      progressPercent: 50,
    });

    expect(await readAttempt(userB.id, course.id)).toMatchObject({
      completedLessons: 0,
      progressPercent: 0,
    });
  });

  it("scores quizzes on the server, requires every answer, supports retry and persists the result", async () => {
    const user = await createProfile("quiz");
    const course = await createCourseFixture({
      label: "quiz",
      lessons: 1,
      withPreQuiz: true,
      withPostQuiz: true,
    });

    if (!course.preQuiz || !course.postQuiz) {
      throw new Error("Expected pre and post quiz fixtures.");
    }

    authMocks.requireAuthenticatedUserId.mockResolvedValue(user.id);

    const started = await startCourseAction({
      locale: "en",
      courseSlug: course.slug,
    });

    expect(started.module?.progressState.currentStage).toBe("pre_quiz");
    expect(started.module?.progress).toBe(0);

    await expect(
      submitQuizAttemptAction({
        locale: "en",
        courseSlug: course.slug,
        quizId: course.preQuiz.id,
        quizType: "pre",
        selectedAnswers: {},
        flaggedQuestionIds: [],
      }),
    ).rejects.toThrow("All questions must be answered before finishing the quiz.");

    await expect(
      submitQuizAttemptAction({
        locale: "en",
        courseSlug: course.slug,
        quizId: course.preQuiz.id,
        quizType: "pre",
        selectedAnswers: {
          [course.preQuiz.questionId]: "forged-answer-id",
        },
        flaggedQuestionIds: [],
      }),
    ).rejects.toThrow("Invalid answer selection.");

    const preResult = await submitQuizAttemptAction({
      locale: "en",
      courseSlug: course.slug,
      quizId: course.preQuiz.id,
      quizType: "pre",
      selectedAnswers: {
        [course.preQuiz.questionId]: course.preQuiz.correctAnswerId,
      },
      flaggedQuestionIds: [course.preQuiz.questionId],
    });

    expect(preResult.meta).toMatchObject({
      score: 100,
      correctCount: 1,
      totalQuestions: 1,
      attemptNumber: 1,
      maxAttempts: 1,
      quizType: "pre",
    });
    expect(preResult.module?.progress).toBe(33);
    expect(preResult.module?.progressState.currentStage).toBe("lessons");

    const afterLesson = await completeLessonAction({
      locale: "en",
      courseSlug: course.slug,
      lessonIndex: 1,
    });

    expect(afterLesson.module?.progress).toBe(67);
    expect(afterLesson.module?.progressState.currentStage).toBe("post_quiz");

    const wrongPostResult = await submitQuizAttemptAction({
      locale: "en",
      courseSlug: course.slug,
      quizId: course.postQuiz.id,
      quizType: "post",
      selectedAnswers: {
        [course.postQuiz.questionId]: course.postQuiz.wrongAnswerId,
      },
      flaggedQuestionIds: [],
    });

    expect(wrongPostResult.meta).toMatchObject({
      score: 0,
      correctCount: 0,
      attemptNumber: 1,
      maxAttempts: 2,
    });
    expect(wrongPostResult.module?.status).toBe("in_progress");
    expect(wrongPostResult.module?.progress).toBe(67);

    const correctPostResult = await submitQuizAttemptAction({
      locale: "en",
      courseSlug: course.slug,
      quizId: course.postQuiz.id,
      quizType: "post",
      selectedAnswers: {
        [course.postQuiz.questionId]: course.postQuiz.correctAnswerId,
      },
      flaggedQuestionIds: [],
    });

    expect(correctPostResult.meta).toMatchObject({
      score: 100,
      correctCount: 1,
      attemptNumber: 2,
      maxAttempts: 2,
    });
    expect(correctPostResult.module?.status).toBe("completed");
    expect(correctPostResult.module?.progress).toBe(100);
    expect(correctPostResult.module?.progressState.currentStage).toBe("completed");

    const persisted = await readAttempt(user.id, course.id);
    const preAttempts = Array.isArray(persisted.preQuizAttempts) ? persisted.preQuizAttempts : [];
    const postAttempts = Array.isArray(persisted.postQuizAttempts)
      ? persisted.postQuizAttempts
      : [];

    expect(preAttempts).toHaveLength(1);
    expect(postAttempts).toHaveLength(2);

    await retakeCourseAction({
      locale: "en",
      courseSlug: course.slug,
    });

    await submitQuizAttemptAction({
      locale: "en",
      courseSlug: course.slug,
      quizId: course.preQuiz.id,
      quizType: "pre",
      selectedAnswers: {
        [course.preQuiz.questionId]: course.preQuiz.correctAnswerId,
      },
      flaggedQuestionIds: [],
    });

    await completeLessonAction({
      locale: "en",
      courseSlug: course.slug,
      lessonIndex: 1,
    });

    for (let attemptNumber = 1; attemptNumber <= 2; attemptNumber += 1) {
      const result = await submitQuizAttemptAction({
        locale: "en",
        courseSlug: course.slug,
        quizId: course.postQuiz.id,
        quizType: "post",
        selectedAnswers: {
          [course.postQuiz.questionId]: course.postQuiz.wrongAnswerId,
        },
        flaggedQuestionIds: [],
      });

      expect(result.meta.attemptNumber).toBe(attemptNumber);
    }

    await expect(
      submitQuizAttemptAction({
        locale: "en",
        courseSlug: course.slug,
        quizId: course.postQuiz.id,
        quizType: "post",
        selectedAnswers: {
          [course.postQuiz.questionId]: course.postQuiz.correctAnswerId,
        },
        flaggedQuestionIds: [],
      }),
    ).rejects.toThrow("No attempts remaining for this quiz.");
  });
});
