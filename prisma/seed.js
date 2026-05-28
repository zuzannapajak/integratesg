import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { courses } from "./seed-data/curriculum/index.js";

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

const scenarios = [
  {
    slug: "environmental-impact-decision-path",
    status: "published",
    area: "environmental",
    sortOrder: 1,
    isFeatured: true,
    variants: [
      {
        language: "en",
        title: "Environmental impact decision path",
        description:
          "A scenario focused on environmental trade-offs, operational choices, and resource efficiency.",
        instruction:
          "Review the context, make staged decisions, and reflect on how each choice affects environmental outcomes.",
        launchUrl: "/storyline/environmental-impact-decision-path/en/index_lms.html",
        packagePath: "storyline/environmental-impact-decision-path/en.zip",
        entryPoint: "index_lms.html",
        thumbnailUrl: "/scenario-thumbnails/environmental-impact-decision-path.jpg",
        estimatedDurationMinutes: 15,
        availabilityStatus: "available",
      },
      {
        language: "pl",
        title: "Ścieżka decyzji o wpływie środowiskowym",
        description:
          "Scenariusz dotyczący kompromisów środowiskowych, wyborów operacyjnych i efektywności zasobów.",
        instruction:
          "Przeanalizuj kontekst, podejmuj decyzje etapami i sprawdź, jak każdy wybór wpływa na wyniki środowiskowe.",
        launchUrl: "/storyline/environmental-impact-decision-path/pl/index_lms.html",
        packagePath: "storyline/environmental-impact-decision-path/pl.zip",
        entryPoint: "index_lms.html",
        thumbnailUrl: "/scenario-thumbnails/environmental-impact-decision-path.jpg",
        estimatedDurationMinutes: 15,
        availabilityStatus: "available",
      },
    ],
  },
  {
    slug: "social-inclusion-under-pressure",
    status: "published",
    area: "social",
    sortOrder: 2,
    isFeatured: true,
    variants: [
      {
        language: "en",
        title: "Social inclusion under pressure",
        description:
          "A scenario about inclusion, stakeholder sensitivity, and people-focused ESG decisions.",
        instruction:
          "Move through the scenario step by step and decide how the organisation should respond to competing social priorities.",
        launchUrl: "/storyline/social-inclusion-under-pressure/en/index_lms.html",
        packagePath: "storyline/social-inclusion-under-pressure/en.zip",
        entryPoint: "index_lms.html",
        thumbnailUrl: "/scenario-thumbnails/social-inclusion-under-pressure.jpg",
        estimatedDurationMinutes: 18,
        availabilityStatus: "available",
      },
      {
        language: "pl",
        title: "Inkluzywność społeczna pod presją",
        description:
          "Scenariusz o inkluzywności, wrażliwości na interesariuszy i decyzjach ESG skoncentrowanych na ludziach.",
        instruction:
          "Przechodź scenariusz krok po kroku i zdecyduj, jak organizacja powinna odpowiedzieć na konkurujące priorytety społeczne.",
        launchUrl: "/storyline/social-inclusion-under-pressure/pl/index_lms.html",
        packagePath: "storyline/social-inclusion-under-pressure/pl.zip",
        entryPoint: "index_lms.html",
        thumbnailUrl: "/scenario-thumbnails/social-inclusion-under-pressure.jpg",
        estimatedDurationMinutes: 18,
        availabilityStatus: "available",
      },
    ],
  },
  {
    slug: "governance-and-reporting-escalation",
    status: "published",
    area: "governance",
    sortOrder: 3,
    isFeatured: false,
    variants: [
      {
        language: "en",
        title: "Governance and reporting escalation",
        description:
          "A scenario focused on accountability, escalation rules, and transparent governance processes.",
        instruction:
          "Assess the reporting situation, choose escalation paths, and evaluate how governance structures affect outcomes.",
        launchUrl: "/storyline/governance-and-reporting-escalation/en/index_lms.html",
        packagePath: "storyline/governance-and-reporting-escalation/en.zip",
        entryPoint: "index_lms.html",
        thumbnailUrl: "/scenario-thumbnails/governance-and-reporting-escalation.jpg",
        estimatedDurationMinutes: 20,
        availabilityStatus: "available",
      },
      {
        language: "pl",
        title: "Governance i eskalacja raportowania",
        description:
          "Scenariusz skupiony na odpowiedzialności, zasadach eskalacji i przejrzystych procesach governance.",
        instruction:
          "Oceń sytuację raportową, wybierz ścieżki eskalacji i sprawdź, jak struktury governance wpływają na rezultaty.",
        launchUrl: "/storyline/governance-and-reporting-escalation/pl/index_lms.html",
        packagePath: "storyline/governance-and-reporting-escalation/pl.zip",
        entryPoint: "index_lms.html",
        thumbnailUrl: "/scenario-thumbnails/governance-and-reporting-escalation.jpg",
        estimatedDurationMinutes: 20,
        availabilityStatus: "available",
      },
    ],
  },
];

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

async function upsertScenario(scenarioData) {
  const scenario = await prisma.scenario.upsert({
    where: { slug: scenarioData.slug },
    update: {
      status: scenarioData.status,
      area: scenarioData.area,
      sortOrder: scenarioData.sortOrder,
      isFeatured: scenarioData.isFeatured,
    },
    create: {
      slug: scenarioData.slug,
      status: scenarioData.status,
      area: scenarioData.area,
      sortOrder: scenarioData.sortOrder,
      isFeatured: scenarioData.isFeatured,
    },
  });

  for (const variant of scenarioData.variants) {
    await prisma.scenarioVariant.upsert({
      where: {
        scenarioId_language: {
          scenarioId: scenario.id,
          language: variant.language,
        },
      },
      update: {
        title: variant.title,
        description: variant.description,
        instruction: variant.instruction,
        launchUrl: variant.launchUrl,
        packagePath: variant.packagePath,
        entryPoint: variant.entryPoint,
        thumbnailUrl: variant.thumbnailUrl,
        estimatedDurationMinutes: variant.estimatedDurationMinutes,
        availabilityStatus: variant.availabilityStatus,
      },
      create: {
        scenarioId: scenario.id,
        language: variant.language,
        title: variant.title,
        description: variant.description,
        instruction: variant.instruction,
        launchUrl: variant.launchUrl,
        packagePath: variant.packagePath,
        entryPoint: variant.entryPoint,
        thumbnailUrl: variant.thumbnailUrl,
        estimatedDurationMinutes: variant.estimatedDurationMinutes,
        availabilityStatus: variant.availabilityStatus,
      },
    });
  }

  return prisma.scenario.findUnique({
    where: { id: scenario.id },
    include: {
      variants: {
        orderBy: { language: "asc" },
      },
    },
  });
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
      },
      create: {
        courseId: course.id,
        language: translation.language,
        title: translation.title,
        subtitle: translation.subtitle,
        description: translation.description,
        content: translation.content,
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
        passingScore: quizData.passingScore,
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

async function seedScenarioAttempts(scenarioMap) {
  const learners = await prisma.profile.findMany({
    where: { role: "learner" },
    orderBy: { createdAt: "asc" },
    take: 3,
  });

  if (learners.length === 0) {
    console.log("No learner profiles found. Skipping UserScenarioAttempt seed.");
    return;
  }

  const environmentalScenario = scenarioMap.get("environmental-impact-decision-path");
  const socialScenario = scenarioMap.get("social-inclusion-under-pressure");
  const governanceScenario = scenarioMap.get("governance-and-reporting-escalation");

  if (!environmentalScenario || !socialScenario || !governanceScenario) {
    throw new Error("Missing seeded scenario data required to seed attempts.");
  }

  const environmentalVariant =
    environmentalScenario.variants.find((variant) => variant.language === "en") ??
    environmentalScenario.variants[0];

  const socialVariant =
    socialScenario.variants.find((variant) => variant.language === "en") ??
    socialScenario.variants[0];

  const governanceVariant =
    governanceScenario.variants.find((variant) => variant.language === "en") ??
    governanceScenario.variants[0];

  const now = Date.now();
  const seededAttemptKeys = [];

  const buildAttemptKey = (userId, scenarioVariantId, attemptNumber) =>
    `${userId}:${scenarioVariantId}:${attemptNumber}`;

  const allAttempts = [];

  const primaryLearner = learners[0];

  allAttempts.push(
    {
      userId: primaryLearner.id,
      scenarioId: environmentalScenario.id,
      scenarioVariantId: environmentalVariant.id,
      attemptNumber: 1,
      score: 82,
      status: "completed",
      startedAt: new Date(now - 4 * 24 * 60 * 60 * 1000),
      lastOpenedAt: new Date(now - 4 * 24 * 60 * 60 * 1000 + 18 * 60 * 1000),
      completedAt: new Date(now - 4 * 24 * 60 * 60 * 1000 + 18 * 60 * 1000),
      suspendData: null,
      lessonLocation: "final-feedback",
      sessionTime: "0000:18:12.45",
      totalTime: "0000:18:12.45",
      rawTrackingData: {
        lesson_status: "completed",
        score_raw: "82",
        lesson_location: "final-feedback",
      },
    },
    {
      userId: primaryLearner.id,
      scenarioId: socialScenario.id,
      scenarioVariantId: socialVariant.id,
      attemptNumber: 1,
      score: null,
      status: "incomplete",
      startedAt: new Date(now - 24 * 60 * 60 * 1000),
      lastOpenedAt: new Date(now - 2 * 60 * 60 * 1000),
      completedAt: null,
      suspendData: '{"scene":"decision-2","state":"resume"}',
      lessonLocation: "decision-2",
      sessionTime: "0000:09:48.10",
      totalTime: "0000:09:48.10",
      rawTrackingData: {
        lesson_status: "incomplete",
        lesson_location: "decision-2",
      },
    },
    {
      userId: primaryLearner.id,
      scenarioId: governanceScenario.id,
      scenarioVariantId: governanceVariant.id,
      attemptNumber: 1,
      score: 64,
      status: "failed",
      startedAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
      lastOpenedAt: new Date(now - 2 * 24 * 60 * 60 * 1000 + 16 * 60 * 1000),
      completedAt: new Date(now - 2 * 24 * 60 * 60 * 1000 + 16 * 60 * 1000),
      suspendData: null,
      lessonLocation: "final-score",
      sessionTime: "0000:16:03.00",
      totalTime: "0000:16:03.00",
      rawTrackingData: {
        lesson_status: "failed",
        score_raw: "64",
        lesson_location: "final-score",
      },
    },
    {
      userId: primaryLearner.id,
      scenarioId: environmentalScenario.id,
      scenarioVariantId: environmentalVariant.id,
      attemptNumber: 2,
      score: 91,
      status: "passed",
      startedAt: new Date(now - 8 * 60 * 60 * 1000),
      lastOpenedAt: new Date(now - 7 * 60 * 60 * 1000),
      completedAt: new Date(now - 7 * 60 * 60 * 1000),
      suspendData: null,
      lessonLocation: "final-feedback",
      sessionTime: "0000:14:39.10",
      totalTime: "0000:14:39.10",
      rawTrackingData: {
        lesson_status: "passed",
        score_raw: "91",
        lesson_location: "final-feedback",
      },
    },
  );

  if (learners[1]) {
    const secondLearner = learners[1];

    allAttempts.push(
      {
        userId: secondLearner.id,
        scenarioId: socialScenario.id,
        scenarioVariantId: socialVariant.id,
        attemptNumber: 1,
        score: 88,
        status: "passed",
        startedAt: new Date(now - 3 * 24 * 60 * 60 * 1000),
        lastOpenedAt: new Date(now - 3 * 24 * 60 * 60 * 1000 + 21 * 60 * 1000),
        completedAt: new Date(now - 3 * 24 * 60 * 60 * 1000 + 21 * 60 * 1000),
        suspendData: null,
        lessonLocation: "final-feedback",
        sessionTime: "0000:21:02.90",
        totalTime: "0000:21:02.90",
        rawTrackingData: {
          lesson_status: "passed",
          score_raw: "88",
          lesson_location: "final-feedback",
        },
      },
      {
        userId: secondLearner.id,
        scenarioId: governanceScenario.id,
        scenarioVariantId: governanceVariant.id,
        attemptNumber: 1,
        score: null,
        status: "browsed",
        startedAt: new Date(now - 36 * 60 * 60 * 1000),
        lastOpenedAt: new Date(now - 35 * 60 * 60 * 1000),
        completedAt: null,
        suspendData: '{"scene":"intro","state":"browsed"}',
        lessonLocation: "intro",
        sessionTime: "0000:03:11.20",
        totalTime: "0000:03:11.20",
        rawTrackingData: {
          lesson_status: "browsed",
          lesson_location: "intro",
        },
      },
    );
  }

  if (learners[2]) {
    const thirdLearner = learners[2];

    allAttempts.push(
      {
        userId: thirdLearner.id,
        scenarioId: environmentalScenario.id,
        scenarioVariantId: environmentalVariant.id,
        attemptNumber: 1,
        score: 73,
        status: "completed",
        startedAt: new Date(now - 6 * 24 * 60 * 60 * 1000),
        lastOpenedAt: new Date(now - 6 * 24 * 60 * 60 * 1000 + 19 * 60 * 1000),
        completedAt: new Date(now - 6 * 24 * 60 * 60 * 1000 + 19 * 60 * 1000),
        suspendData: null,
        lessonLocation: "final-feedback",
        sessionTime: "0000:19:10.00",
        totalTime: "0000:19:10.00",
        rawTrackingData: {
          lesson_status: "completed",
          score_raw: "73",
          lesson_location: "final-feedback",
        },
      },
      {
        userId: thirdLearner.id,
        scenarioId: socialScenario.id,
        scenarioVariantId: socialVariant.id,
        attemptNumber: 1,
        score: null,
        status: "incomplete",
        startedAt: new Date(now - 10 * 60 * 60 * 1000),
        lastOpenedAt: new Date(now - 90 * 60 * 1000),
        completedAt: null,
        suspendData: '{"scene":"stakeholder-decision","state":"resume"}',
        lessonLocation: "stakeholder-decision",
        sessionTime: "0000:11:22.15",
        totalTime: "0000:11:22.15",
        rawTrackingData: {
          lesson_status: "incomplete",
          lesson_location: "stakeholder-decision",
        },
      },
    );
  }

  for (const attempt of allAttempts) {
    const uniqueKey = buildAttemptKey(
      attempt.userId,
      attempt.scenarioVariantId,
      attempt.attemptNumber,
    );

    if (seededAttemptKeys.includes(uniqueKey)) {
      continue;
    }

    seededAttemptKeys.push(uniqueKey);

    await prisma.userScenarioAttempt.upsert({
      where: {
        userId_scenarioVariantId_attemptNumber: {
          userId: attempt.userId,
          scenarioVariantId: attempt.scenarioVariantId,
          attemptNumber: attempt.attemptNumber,
        },
      },
      update: {
        scenarioId: attempt.scenarioId,
        score: attempt.score,
        status: attempt.status,
        startedAt: attempt.startedAt,
        lastOpenedAt: attempt.lastOpenedAt,
        completedAt: attempt.completedAt,
        suspendData: attempt.suspendData,
        lessonLocation: attempt.lessonLocation,
        sessionTime: attempt.sessionTime,
        totalTime: attempt.totalTime,
        rawTrackingData: attempt.rawTrackingData,
      },
      create: attempt,
    });
  }

  console.log(
    `Seeded ${seededAttemptKeys.length} scenario attempts for ${learners.length} learner profile(s).`,
  );
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
  console.log("Seeding curriculum and scenario data...");

  const scenarioMap = new Map();
  for (const scenarioData of scenarios) {
    const scenario = await upsertScenario(scenarioData);
    scenarioMap.set(scenario.slug, scenario);
  }

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

  await seedScenarioAttempts(scenarioMap);

  if (process.env.SEED_DEMO_PROGRESS === "true") {
    await seedCourseAttempts(courseMap);
  }

  console.log("Curriculum and scenario seed completed.");
}

main()
  .catch((error) => {
    console.error("Curriculum and scenario seed failed.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
