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

  return course;
}

async function seedAttempts(courseMap) {
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

  const attempts = [
    {
      courseSlug: "esg-foundations-for-vet",
      status: "in_progress",
      progressPercent: 58,
      preQuizScore: 80,
      postQuizScore: null,
      startedAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
      lastOpenedAt: new Date(now),
      completedAt: null,
    },
    {
      courseSlug: "governance-in-practice",
      status: "in_progress",
      progressPercent: 26,
      preQuizScore: 60,
      postQuizScore: null,
      startedAt: new Date(now - 3 * 24 * 60 * 60 * 1000),
      lastOpenedAt: new Date(now - 24 * 60 * 60 * 1000),
      completedAt: null,
    },
    {
      courseSlug: "social-impact-in-practice",
      status: "completed",
      progressPercent: 100,
      preQuizScore: 70,
      postQuizScore: 90,
      startedAt: new Date(now - 5 * 24 * 60 * 60 * 1000),
      lastOpenedAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const attempt of attempts) {
    const courseId = courseMap.get(attempt.courseSlug);
    if (!courseId) continue;

    await prisma.userCourseAttempt.upsert({
      where: {
        userId_courseId: {
          userId: educator.id,
          courseId,
        },
      },
      update: {
        status: attempt.status,
        progressPercent: attempt.progressPercent,
        preQuizScore: attempt.preQuizScore,
        postQuizScore: attempt.postQuizScore,
        startedAt: attempt.startedAt,
        lastOpenedAt: attempt.lastOpenedAt,
        completedAt: attempt.completedAt,
      },
      create: {
        userId: educator.id,
        courseId,
        status: attempt.status,
        progressPercent: attempt.progressPercent,
        preQuizScore: attempt.preQuizScore,
        postQuizScore: attempt.postQuizScore,
        startedAt: attempt.startedAt,
        lastOpenedAt: attempt.lastOpenedAt,
        completedAt: attempt.completedAt,
      },
    });
  }

  console.log(`Seeded course attempts for educator: ${educator.email}`);
}

async function main() {
  console.log("Seeding curriculum data...");

  const courseMap = new Map();

  for (const courseData of courses) {
    const course = await upsertCourse(courseData);
    courseMap.set(course.slug, course.id);
  }

  await seedAttempts(courseMap);

  console.log("Curriculum seed completed.");
}

main()
  .catch((error) => {
    console.error("Curriculum seed failed.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
