import { prisma } from "@/lib/prisma";

type EnsureCourseAttemptStartedInput = {
  userId: string;
  courseSlug: string;
};

export async function ensureCourseAttemptStarted({
  userId,
  courseSlug,
}: EnsureCourseAttemptStartedInput) {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
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
    return null;
  }

  const hasPreQuiz = course.quizzes.some((quiz) => quiz.type === "pre");
  const initialStage = hasPreQuiz ? "pre_quiz" : "lessons";
  const initialLessonIndex = hasPreQuiz ? 0 : 1;

  return prisma.userCourseAttempt.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
    update: {
      lastOpenedAt: new Date(),
    },
    create: {
      userId,
      courseId: course.id,
      status: "in_progress",
      currentStage: initialStage,
      currentLessonIndex: initialLessonIndex,
      completedLessons: 0,
      progressPercent: 0,
      preQuizAttempts: [],
      postQuizAttempts: [],
      startedAt: new Date(),
      lastOpenedAt: new Date(),
    },
  });
}
