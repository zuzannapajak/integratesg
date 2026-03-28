import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

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

const courses = [
  {
    slug: "esg-foundations-for-vet",
    status: "published",
    area: "cross_cutting",
    difficulty: "foundation",
    estimatedDurationMinutes: 40,
    lessonsCount: 4,
    sortOrder: 1,
    isFeatured: true,
    translations: [
      {
        language: "en",
        title: "ESG foundations for VET providers",
        subtitle: "Start here",
        description:
          "Build a shared understanding of ESG integration, material topics, and practical decision-making in educational and organisational contexts.",
        content:
          "This module introduces the foundations of ESG integration for vocational education and training providers. It is designed to establish a shared understanding of environmental, social, and governance dimensions and to prepare educators for more advanced case-based and scenario-based learning.",
      },
      {
        language: "pl",
        title: "Podstawy ESG dla dostawców VET",
        subtitle: "Zacznij tutaj",
        description:
          "Zbuduj wspólne rozumienie integracji ESG, kluczowych zagadnień oraz praktycznego podejmowania decyzji w kontekście edukacyjnym i organizacyjnym.",
        content:
          "Ten moduł wprowadza podstawy integracji ESG dla dostawców kształcenia zawodowego. Jego celem jest zbudowanie wspólnego rozumienia wymiarów środowiskowych, społecznych i zarządczych oraz przygotowanie edukatorów do bardziej zaawansowanej pracy z case studies i scenariuszami.",
      },
    ],
    quizzes: [
      {
        type: "pre",
        title: "Pre-test",
        description: "Initial knowledge check before starting the module.",
        passingScore: 60,
        sortOrder: 1,
        questions: [
          {
            prompt: "What does ESG stand for?",
            explanation: "This question checks basic ESG terminology.",
            sortOrder: 1,
            answers: [
              {
                text: "Environmental, Social and Governance",
                isCorrect: true,
                feedbackText: "Correct. ESG stands for Environmental, Social and Governance.",
                sortOrder: 1,
              },
              {
                text: "Economic, Strategic and Growth",
                isCorrect: false,
                feedbackText: "Incorrect. ESG does not stand for Economic, Strategic and Growth.",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
      {
        type: "post",
        title: "Post-test",
        description: "Final knowledge check after completing the module.",
        passingScore: 70,
        sortOrder: 2,
        questions: [
          {
            prompt: "Why is ESG integration important in organisational practice?",
            explanation: "This question checks understanding of ESG relevance.",
            sortOrder: 1,
            answers: [
              {
                text: "Because it connects responsibility, strategy and long-term decision-making",
                isCorrect: true,
                feedbackText:
                  "Correct. ESG integration supports strategic and responsible decision-making.",
                sortOrder: 1,
              },
              {
                text: "Because it only applies to marketing communication",
                isCorrect: false,
                feedbackText:
                  "Incorrect. ESG is broader than communication and affects the whole organisation.",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "environmental-decision-making",
    status: "published",
    area: "environmental",
    difficulty: "foundation",
    estimatedDurationMinutes: 35,
    lessonsCount: 3,
    sortOrder: 2,
    isFeatured: false,
    translations: [
      {
        language: "en",
        title: "Environmental decision-making",
        subtitle: "Environmental pillar",
        description:
          "Explore trade-offs around environmental impact, resource efficiency, and sustainability-related decisions using realistic learning contexts.",
        content:
          "This module focuses on environmental responsibility in practical decision-making. Educators explore how operational choices influence impact, efficiency, and sustainability outcomes.",
      },
      {
        language: "pl",
        title: "Podejmowanie decyzji środowiskowych",
        subtitle: "Filar środowiskowy",
        description:
          "Poznaj kompromisy związane z wpływem środowiskowym, efektywnością zasobów oraz decyzjami dotyczącymi zrównoważonego rozwoju w realistycznych kontekstach edukacyjnych.",
        content:
          "Ten moduł koncentruje się na odpowiedzialności środowiskowej w praktycznym podejmowaniu decyzji. Edukatorzy analizują, jak wybory operacyjne wpływają na oddziaływanie, efektywność i wyniki zrównoważonego rozwoju.",
      },
    ],
    quizzes: [
      {
        type: "pre",
        title: "Pre-test",
        description: "Initial environmental knowledge check.",
        passingScore: 60,
        sortOrder: 1,
        questions: [
          {
            prompt: "Which of these is most closely related to the environmental pillar of ESG?",
            explanation: "This question checks basic pillar recognition.",
            sortOrder: 1,
            answers: [
              {
                text: "Resource efficiency",
                isCorrect: true,
                feedbackText:
                  "Correct. Resource efficiency is strongly linked to environmental performance.",
                sortOrder: 1,
              },
              {
                text: "Board transparency only",
                isCorrect: false,
                feedbackText:
                  "Incorrect. Board transparency is more directly linked to governance.",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
      {
        type: "post",
        title: "Post-test",
        description: "Final environmental knowledge check.",
        passingScore: 70,
        sortOrder: 2,
        questions: [
          {
            prompt: "Why do environmental trade-offs matter in decision-making?",
            explanation: "This question checks applied understanding.",
            sortOrder: 1,
            answers: [
              {
                text: "Because one choice may improve one metric while worsening another",
                isCorrect: true,
                feedbackText:
                  "Correct. Environmental decisions often involve balancing competing priorities.",
                sortOrder: 1,
              },
              {
                text: "Because all environmental decisions always have only one best answer",
                isCorrect: false,
                feedbackText:
                  "Incorrect. Real-world environmental decisions often require balancing trade-offs.",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "social-impact-in-practice",
    status: "published",
    area: "social",
    difficulty: "foundation",
    estimatedDurationMinutes: 30,
    lessonsCount: 3,
    sortOrder: 3,
    isFeatured: false,
    translations: [
      {
        language: "en",
        title: "Social impact in practice",
        subtitle: "Social pillar",
        description:
          "Examine inclusion, stakeholder sensitivity, wellbeing, and responsibility through applied examples aligned with the social dimension of ESG.",
        content:
          "This module explores the social dimension of ESG through inclusion, wellbeing, and stakeholder-oriented thinking. It helps educators recognise how people-centred choices shape implementation quality.",
      },
      {
        language: "pl",
        title: "Wpływ społeczny w praktyce",
        subtitle: "Filar społeczny",
        description:
          "Przeanalizuj inkluzywność, wrażliwość na interesariuszy, dobrostan oraz odpowiedzialność poprzez przykłady zgodne ze społecznym wymiarem ESG.",
        content:
          "Ten moduł omawia społeczny wymiar ESG poprzez inkluzywność, dobrostan i podejście zorientowane na interesariuszy. Pomaga edukatorom rozpoznać, jak decyzje skoncentrowane na ludziach wpływają na jakość wdrożenia.",
      },
    ],
    quizzes: [
      {
        type: "pre",
        title: "Pre-test",
        description: "Initial social knowledge check.",
        passingScore: 60,
        sortOrder: 1,
        questions: [
          {
            prompt: "Which topic belongs most directly to the social dimension of ESG?",
            explanation: "This question checks recognition of the social pillar.",
            sortOrder: 1,
            answers: [
              {
                text: "Wellbeing and inclusion",
                isCorrect: true,
                feedbackText: "Correct. Wellbeing and inclusion are core social ESG topics.",
                sortOrder: 1,
              },
              {
                text: "Carbon accounting only",
                isCorrect: false,
                feedbackText:
                  "Incorrect. Carbon accounting is more directly connected to environmental topics.",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
      {
        type: "post",
        title: "Post-test",
        description: "Final social knowledge check.",
        passingScore: 70,
        sortOrder: 2,
        questions: [
          {
            prompt: "Why is stakeholder sensitivity important in ESG?",
            explanation: "This question checks applied understanding.",
            sortOrder: 1,
            answers: [
              {
                text: "Because decisions affect different groups in different ways",
                isCorrect: true,
                feedbackText:
                  "Correct. Stakeholder-sensitive decisions consider varied impacts across groups.",
                sortOrder: 1,
              },
              {
                text: "Because social issues are unrelated to implementation quality",
                isCorrect: false,
                feedbackText:
                  "Incorrect. Social considerations can strongly influence implementation quality.",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "governance-in-practice",
    status: "published",
    area: "governance",
    difficulty: "intermediate",
    estimatedDurationMinutes: 45,
    lessonsCount: 5,
    sortOrder: 4,
    isFeatured: false,
    translations: [
      {
        language: "en",
        title: "Governance in practice",
        subtitle: "Governance pillar",
        description:
          "Focus on accountability, transparency, and decision structures that support credible ESG integration across teams and institutions.",
        content:
          "This module examines governance as the layer that gives ESG implementation credibility and structure. It addresses accountability, transparency, policies, and decision pathways.",
      },
      {
        language: "pl",
        title: "Governance w praktyce",
        subtitle: "Filar zarządczy",
        description:
          "Skup się na odpowiedzialności, przejrzystości oraz strukturach decyzyjnych, które wspierają wiarygodną integrację ESG w zespołach i instytucjach.",
        content:
          "Ten moduł analizuje governance jako warstwę nadającą wdrażaniu ESG wiarygodność i strukturę. Obejmuje odpowiedzialność, przejrzystość, polityki i ścieżki decyzyjne.",
      },
    ],
    quizzes: [
      {
        type: "pre",
        title: "Pre-test",
        description: "Initial governance knowledge check.",
        passingScore: 60,
        sortOrder: 1,
        questions: [
          {
            prompt: "Which concept is most strongly associated with governance?",
            explanation: "This question checks governance recognition.",
            sortOrder: 1,
            answers: [
              {
                text: "Accountability",
                isCorrect: true,
                feedbackText: "Correct. Accountability is a core governance concept.",
                sortOrder: 1,
              },
              {
                text: "Biodiversity protection only",
                isCorrect: false,
                feedbackText:
                  "Incorrect. Biodiversity belongs more directly to environmental issues.",
                sortOrder: 2,
              },
            ],
          },
        ],
      },
      {
        type: "post",
        title: "Post-test",
        description: "Final governance knowledge check.",
        passingScore: 70,
        sortOrder: 2,
        questions: [
          {
            prompt: "Why does governance matter for ESG credibility?",
            explanation: "This question checks applied governance understanding.",
            sortOrder: 1,
            answers: [
              {
                text: "Because it shapes oversight, transparency and responsible decision-making",
                isCorrect: true,
                feedbackText:
                  "Correct. Governance gives ESG implementation structure and credibility.",
                sortOrder: 1,
              },
              {
                text: "Because governance only concerns visual branding",
                isCorrect: false,
                feedbackText:
                  "Incorrect. Governance is about structures, roles, accountability and oversight.",
                sortOrder: 2,
              },
            ],
          },
        ],
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

  for (const quizData of courseData.quizzes) {
    const quiz = await prisma.quiz.upsert({
      where: {
        courseId_type: {
          courseId: course.id,
          type: quizData.type,
        },
      },
      update: {
        title: quizData.title,
        description: quizData.description,
        passingScore: quizData.passingScore,
        sortOrder: quizData.sortOrder,
      },
      create: {
        courseId: course.id,
        type: quizData.type,
        title: quizData.title,
        description: quizData.description,
        passingScore: quizData.passingScore,
        sortOrder: quizData.sortOrder,
      },
    });

    await prisma.answer.deleteMany({
      where: {
        question: {
          quizId: quiz.id,
        },
      },
    });

    await prisma.question.deleteMany({
      where: {
        quizId: quiz.id,
      },
    });

    for (const questionData of quizData.questions) {
      const question = await prisma.question.create({
        data: {
          quizId: quiz.id,
          prompt: questionData.prompt,
          explanation: questionData.explanation,
          sortOrder: questionData.sortOrder,
        },
      });

      await prisma.answer.createMany({
        data: questionData.answers.map((answer) => ({
          questionId: question.id,
          text: answer.text,
          isCorrect: answer.isCorrect,
          feedbackText: answer.feedbackText,
          sortOrder: answer.sortOrder,
        })),
      });
    }
  }

  const fullCourse = await prisma.course.findUnique({
    where: { id: course.id },
    include: {
      quizzes: {
        orderBy: { sortOrder: "asc" },
        include: {
          questions: {
            orderBy: { sortOrder: "asc" },
            include: {
              answers: {
                orderBy: { sortOrder: "asc" },
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
  const student =
    (await prisma.profile.findFirst({
      where: { role: "student" },
      orderBy: { createdAt: "asc" },
    })) ??
    (process.env.DEMO_STUDENT_EMAIL
      ? await prisma.profile.findUnique({
          where: { email: process.env.DEMO_STUDENT_EMAIL },
        })
      : null);

  if (!student) {
    console.log("No student profile found. Skipping UserScenarioAttempt seed.");
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

  const attempts = [
    {
      userId: student.id,
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
      userId: student.id,
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
      userId: student.id,
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
  ];

  for (const attempt of attempts) {
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

  console.log(`Seeded scenario attempts for student: ${student.email}`);
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

  const courseMap = new Map();
  for (const courseData of courses) {
    const course = await upsertCourse(courseData);
    courseMap.set(course.slug, course);
  }

  await seedScenarioAttempts(scenarioMap);
  await seedCourseAttempts(courseMap);

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
