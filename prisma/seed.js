import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { courses, curriculumPilotQuestions } from "./seed-data/curriculum/index.js";
import { seedEportfolio } from "./seed-data/eportfolio/seed.js";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DIRECT_URL or DATABASE_URL environment variable.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

function buildStoredAttempt({
  question,
  selectedAnswer,
  attemptNumber,
  submittedAt,
  flaggedQuestionIds = [],
}) {
  const correctAnswer = question.answers.find((answer) => answer.isCorrect);

  if (!correctAnswer) {
    throw new Error(`Question "${question.prompt}" does not have a correct answer.`);
  }

  const isCorrect = selectedAnswer.id === correctAnswer.id;
  const correctCount = isCorrect ? 1 : 0;
  const totalQuestions = 1;
  const score = Math.round((correctCount / totalQuestions) * 100);

  return {
    attemptNumber,
    score,
    correctCount,
    totalQuestions,
    submittedAt: submittedAt.toISOString(),
    flaggedQuestionIds,
    selectedAnswers: [
      {
        questionId: question.id,
        answerId: selectedAnswer.id,
        isCorrect,
      },
    ],
  };
}

function pickAnswer(question, kind = "correct") {
  const answer =
    kind === "correct"
      ? question.answers.find((item) => item.isCorrect)
      : question.answers.find((item) => !item.isCorrect);

  if (!answer) {
    throw new Error(`Unable to find "${kind}" answer for question "${question.prompt}".`);
  }

  return answer;
}

async function upsertCurriculumPilotQuestions() {
  for (const questionData of curriculumPilotQuestions) {
    const question = await prisma.curriculumPilotQuestion.upsert({
      where: {
        key: questionData.key,
      },
      update: {
        sortOrder: questionData.sortOrder,
        inputType: questionData.inputType,
        minValue: questionData.minValue,
        maxValue: questionData.maxValue,
        isRequired: questionData.isRequired,
        isActive: questionData.isActive,
      },
      create: {
        id: questionData.id,
        key: questionData.key,
        sortOrder: questionData.sortOrder,
        inputType: questionData.inputType,
        minValue: questionData.minValue,
        maxValue: questionData.maxValue,
        isRequired: questionData.isRequired,
        isActive: questionData.isActive,
      },
    });

    for (const translation of questionData.translations) {
      await prisma.curriculumPilotQuestionTranslation.upsert({
        where: {
          questionId_language: {
            questionId: question.id,
            language: translation.language,
          },
        },
        update: {
          prompt: translation.prompt,
          helpText: translation.helpText ?? null,
          labels: translation.labels ?? undefined,
        },
        create: {
          questionId: question.id,
          language: translation.language,
          prompt: translation.prompt,
          helpText: translation.helpText ?? null,
          labels: translation.labels ?? undefined,
        },
      });
    }
  }

  console.log(`Seeded curriculum pilot questions: ${curriculumPilotQuestions.length}`);
}

async function upsertCourse(courseData) {
  const course = await prisma.course.upsert({
    where: { slug: courseData.slug },
    update: {
      status: courseData.status,
      area: courseData.area,
      difficulty: courseData.difficulty,
      estimatedDurationMinutes: courseData.estimatedDurationMinutes,
      lessonsCount: courseData.lessonsCount,
      sortOrder: courseData.sortOrder,
      isFeatured: courseData.isFeatured,
    },
    create: {
      slug: courseData.slug,
      status: courseData.status,
      area: courseData.area,
      difficulty: courseData.difficulty,
      estimatedDurationMinutes: courseData.estimatedDurationMinutes,
      lessonsCount: courseData.lessonsCount,
      sortOrder: courseData.sortOrder,
      isFeatured: courseData.isFeatured,
    },
  });

  for (const translation of courseData.translations) {
    await prisma.courseTranslation.upsert({
      where: {
        courseId_language: {
          courseId: course.id,
          language: translation.language,
        },
      },
      update: {
        title: translation.title,
        subtitle: translation.subtitle,
        description: translation.description,
        content: translation.content,
        details: translation.details ?? undefined,
      },
      create: {
        courseId: course.id,
        language: translation.language,
        title: translation.title,
        subtitle: translation.subtitle,
        description: translation.description,
        content: translation.content,
        details: translation.details ?? undefined,
      },
    });
  }

  await prisma.courseSection.deleteMany({
    where: {
      courseId: course.id,
    },
  });

  for (const sectionData of courseData.sections) {
    const section = await prisma.courseSection.create({
      data: {
        courseId: course.id,
        slug: sectionData.slug,
        sortOrder: sectionData.sortOrder,
        estimatedMinutes: sectionData.estimatedMinutes,
      },
    });

    for (const translation of sectionData.translations) {
      await prisma.courseSectionTranslation.create({
        data: {
          courseSectionId: section.id,
          language: translation.language,
          title: translation.title,
          summary: translation.summary,
          content: translation.content,
        },
      });
    }
  }

  await prisma.quiz.deleteMany({
    where: {
      courseId: course.id,
    },
  });

  for (const quizData of courseData.quizzes) {
    const quiz = await prisma.quiz.create({
      data: {
        courseId: course.id,
        type: quizData.type,
        title: quizData.title,
        description: quizData.description,
        passingScore: quizData.type === "post" ? 75 : quizData.passingScore,
        sortOrder: quizData.sortOrder,
      },
    });

    for (const translation of quizData.translations) {
      await prisma.quizTranslation.create({
        data: {
          quizId: quiz.id,
          language: translation.language,
          title: translation.title,
          description: translation.description,
        },
      });
    }

    for (const questionData of quizData.questions) {
      const question = await prisma.question.create({
        data: {
          quizId: quiz.id,
          prompt: questionData.prompt,
          explanation: questionData.explanation,
          sortOrder: questionData.sortOrder,
        },
      });

      for (const translation of questionData.translations) {
        await prisma.questionTranslation.create({
          data: {
            questionId: question.id,
            language: translation.language,
            prompt: translation.prompt,
            explanation: translation.explanation,
          },
        });
      }

      for (const answerData of questionData.answers) {
        const answer = await prisma.answer.create({
          data: {
            questionId: question.id,
            text: answerData.text,
            isCorrect: answerData.isCorrect,
            feedbackText: answerData.feedbackText,
            sortOrder: answerData.sortOrder,
          },
        });

        for (const translation of answerData.translations) {
          await prisma.answerTranslation.create({
            data: {
              answerId: answer.id,
              language: translation.language,
              text: translation.text,
              feedbackText: translation.feedbackText,
            },
          });
        }
      }
    }
  }

  const fullCourse = await prisma.course.findUnique({
    where: { id: course.id },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
        include: {
          translations: {
            orderBy: { language: "asc" },
          },
        },
      },
      quizzes: {
        orderBy: { sortOrder: "asc" },
        include: {
          translations: {
            orderBy: { language: "asc" },
          },
          questions: {
            orderBy: { sortOrder: "asc" },
            include: {
              translations: {
                orderBy: { language: "asc" },
              },
              answers: {
                orderBy: { sortOrder: "asc" },
                include: {
                  translations: {
                    orderBy: { language: "asc" },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return fullCourse;
}

async function seedCourseAttempts(courseMap) {
  const educator =
    (await prisma.profile.findFirst({
      where: { role: "educator" },
      orderBy: { createdAt: "asc" },
    })) ??
    (process.env.DEMO_EDUCATOR_EMAIL
      ? await prisma.profile.findUnique({
          where: { email: process.env.DEMO_EDUCATOR_EMAIL },
        })
      : null);

  if (!educator) {
    console.log("No educator profile found. Skipping UserCourseAttempt seed.");
    return;
  }

  const now = Date.now();

  const foundationsCourse = courseMap.get("esg-foundations-for-vet");
  const environmentalCourse = courseMap.get("environmental-decision-making");
  const socialCourse = courseMap.get("social-impact-in-practice");
  const governanceCourse = courseMap.get("governance-in-practice");

  if (!foundationsCourse || !environmentalCourse || !socialCourse || !governanceCourse) {
    throw new Error("Missing seeded course data required to seed attempts.");
  }

  const foundationsPreQuiz = foundationsCourse.quizzes.find((quiz) => quiz.type === "pre");
  const socialPreQuiz = socialCourse.quizzes.find((quiz) => quiz.type === "pre");
  const socialPostQuiz = socialCourse.quizzes.find((quiz) => quiz.type === "post");
  const governancePreQuiz = governanceCourse.quizzes.find((quiz) => quiz.type === "pre");

  if (!foundationsPreQuiz || !socialPreQuiz || !socialPostQuiz || !governancePreQuiz) {
    throw new Error("Missing seeded quizzes required to seed attempts.");
  }

  const foundationsPreQuestion = foundationsPreQuiz.questions[0];
  const socialPreQuestion = socialPreQuiz.questions[0];
  const socialPostQuestion = socialPostQuiz.questions[0];
  const governancePreQuestion = governancePreQuiz.questions[0];

  if (
    !foundationsPreQuestion ||
    !socialPreQuestion ||
    !socialPostQuestion ||
    !governancePreQuestion
  ) {
    throw new Error("Missing seeded questions required to seed attempts.");
  }

  const attempts = [
    {
      courseId: foundationsCourse.id,
      status: "in_progress",
      currentStage: "lessons",
      currentLessonIndex: 3,
      completedLessons: 2,
      progressPercent: 50,
      preQuizScore: 100,
      postQuizScore: null,
      preQuizAttempts: [
        buildStoredAttempt({
          question: foundationsPreQuestion,
          selectedAnswer: pickAnswer(foundationsPreQuestion, "correct"),
          attemptNumber: 1,
          submittedAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
        }),
      ],
      postQuizAttempts: [],
      startedAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
      lastOpenedAt: new Date(now),
      completedAt: null,
    },
    {
      courseId: governanceCourse.id,
      status: "in_progress",
      currentStage: "lessons",
      currentLessonIndex: 2,
      completedLessons: 1,
      progressPercent: 32,
      preQuizScore: 100,
      postQuizScore: null,
      preQuizAttempts: [
        buildStoredAttempt({
          question: governancePreQuestion,
          selectedAnswer: pickAnswer(governancePreQuestion, "correct"),
          attemptNumber: 1,
          submittedAt: new Date(now - 3 * 24 * 60 * 60 * 1000),
        }),
      ],
      postQuizAttempts: [],
      startedAt: new Date(now - 3 * 24 * 60 * 60 * 1000),
      lastOpenedAt: new Date(now - 24 * 60 * 60 * 1000),
      completedAt: null,
    },
    {
      courseId: socialCourse.id,
      status: "completed",
      currentStage: "completed",
      currentLessonIndex: 3,
      completedLessons: 3,
      progressPercent: 100,
      preQuizScore: 100,
      postQuizScore: 100,
      preQuizAttempts: [
        buildStoredAttempt({
          question: socialPreQuestion,
          selectedAnswer: pickAnswer(socialPreQuestion, "correct"),
          attemptNumber: 1,
          submittedAt: new Date(now - 5 * 24 * 60 * 60 * 1000),
        }),
      ],
      postQuizAttempts: [
        buildStoredAttempt({
          question: socialPostQuestion,
          selectedAnswer: pickAnswer(socialPostQuestion, "correct"),
          attemptNumber: 1,
          submittedAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
        }),
      ],
      startedAt: new Date(now - 5 * 24 * 60 * 60 * 1000),
      lastOpenedAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
    },
    {
      courseId: environmentalCourse.id,
      status: "in_progress",
      currentStage: "pre_quiz",
      currentLessonIndex: 0,
      completedLessons: 0,
      progressPercent: 0,
      preQuizScore: null,
      postQuizScore: null,
      preQuizAttempts: [],
      postQuizAttempts: [],
      startedAt: new Date(now - 12 * 60 * 60 * 1000),
      lastOpenedAt: new Date(now - 6 * 60 * 60 * 1000),
      completedAt: null,
    },
  ];

  for (const attempt of attempts) {
    await prisma.userCourseAttempt.upsert({
      where: {
        userId_courseId: {
          userId: educator.id,
          courseId: attempt.courseId,
        },
      },
      update: {
        status: attempt.status,
        currentStage: attempt.currentStage,
        currentLessonIndex: attempt.currentLessonIndex,
        completedLessons: attempt.completedLessons,
        progressPercent: attempt.progressPercent,
        preQuizScore: attempt.preQuizScore,
        postQuizScore: attempt.postQuizScore,
        preQuizAttempts: attempt.preQuizAttempts,
        postQuizAttempts: attempt.postQuizAttempts,
        startedAt: attempt.startedAt,
        lastOpenedAt: attempt.lastOpenedAt,
        completedAt: attempt.completedAt,
      },
      create: {
        userId: educator.id,
        courseId: attempt.courseId,
        status: attempt.status,
        currentStage: attempt.currentStage,
        currentLessonIndex: attempt.currentLessonIndex,
        completedLessons: attempt.completedLessons,
        progressPercent: attempt.progressPercent,
        preQuizScore: attempt.preQuizScore,
        postQuizScore: attempt.postQuizScore,
        preQuizAttempts: attempt.preQuizAttempts,
        postQuizAttempts: attempt.postQuizAttempts,
        startedAt: attempt.startedAt,
        lastOpenedAt: attempt.lastOpenedAt,
        completedAt: attempt.completedAt,
      },
    });
  }

  console.log(`Seeded course attempts for educator: ${educator.email}`);
}

async function main() {
  console.log("Seeding curriculum and ePortfolio data...");
  await upsertCurriculumPilotQuestions();

  await prisma.course.deleteMany({
    where: {
      slug: {
        in: [
          "esg-foundations-for-vet",
          "environmental-decision-making",
          "social-impact-in-practice",
          "governance-in-practice",
        ],
      },
    },
  });

  const courseMap = new Map();
  for (const courseData of courses) {
    const course = await upsertCourse(courseData);
    courseMap.set(course.slug, course);
  }

  await seedEportfolio(prisma);

  if (process.env.SEED_DEMO_PROGRESS === "true") {
    await seedCourseAttempts(courseMap);
  }

  console.log("Curriculum and ePortfolio seed completed.");
}

main()
  .catch((error) => {
    console.error("Curriculum and ePortfolio seed failed.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
