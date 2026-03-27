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

const caseStudies = [
  {
    slug: "green-campus-procurement",
    status: "published",
    area: "environmental",
    sortOrder: 1,
    isFeatured: true,
    translations: [
      {
        language: "en",
        title: "Green campus procurement",
        summary:
          "A case study about introducing sustainability criteria into procurement decisions for campus equipment and services.",
        content:
          "This case study examines how a vocational education provider redesigned procurement rules to include environmental criteria, lifecycle thinking, and supplier transparency. Learners can analyse trade-offs between upfront costs, long-term efficiency, and ESG accountability.",
        keyTakeaways: [
          "Environmental criteria can be embedded into procurement workflows.",
          "Lifecycle cost analysis supports more informed decisions.",
          "Supplier transparency improves ESG accountability.",
        ],
        organization: "IntegratESG Demo Institution",
        industry: "Vocational Education",
      },
      {
        language: "pl",
        title: "Zielone zamówienia kampusowe",
        summary:
          "Studium przypadku dotyczące wdrożenia kryteriów zrównoważonego rozwoju do decyzji zakupowych związanych z wyposażeniem i usługami kampusu.",
        content:
          "To studium przypadku pokazuje, w jaki sposób instytucja kształcenia zawodowego przeprojektowała zasady zakupowe, aby uwzględnić kryteria środowiskowe, podejście cyklu życia oraz przejrzystość dostawców. Użytkownicy analizują kompromisy między kosztami początkowymi, długoterminową efektywnością i odpowiedzialnością ESG.",
        keyTakeaways: [
          "Kryteria środowiskowe można osadzić w procesach zakupowych.",
          "Analiza kosztu cyklu życia wspiera trafniejsze decyzje.",
          "Przejrzystość dostawców wzmacnia odpowiedzialność ESG.",
        ],
        organization: "Instytucja demonstracyjna IntegratESG",
        industry: "Edukacja zawodowa",
      },
    ],
  },
  {
    slug: "inclusive-recruitment-and-wellbeing",
    status: "published",
    area: "social",
    sortOrder: 2,
    isFeatured: true,
    translations: [
      {
        language: "en",
        title: "Inclusive recruitment and wellbeing",
        summary:
          "A case study exploring inclusive hiring, onboarding, and wellbeing practices in an educational organisation.",
        content:
          "This case study presents an organisation that revised its recruitment and onboarding process to improve inclusion, accessibility, and employee wellbeing. It helps learners understand how social ESG commitments become operational practices.",
        keyTakeaways: [
          "Social ESG requires concrete people-focused processes.",
          "Inclusive onboarding influences retention and trust.",
          "Wellbeing policies affect implementation quality.",
        ],
        organization: "Regional Training Centre",
        industry: "Education and Training",
      },
      {
        language: "pl",
        title: "Rekrutacja inkluzywna i dobrostan",
        summary:
          "Studium przypadku analizujące inkluzywną rekrutację, onboarding oraz praktyki wspierające dobrostan w organizacji edukacyjnej.",
        content:
          "To studium przypadku przedstawia organizację, która zmieniła proces rekrutacji i wdrożenia pracowników, aby zwiększyć inkluzywność, dostępność i dobrostan zespołu. Pomaga zrozumieć, jak społeczne zobowiązania ESG przekładają się na codzienną praktykę operacyjną.",
        keyTakeaways: [
          "Społeczny wymiar ESG wymaga konkretnych procesów ukierunkowanych na ludzi.",
          "Inkluzywny onboarding wpływa na retencję i zaufanie.",
          "Polityki dobrostanu oddziałują na jakość wdrożenia.",
        ],
        organization: "Regionalne Centrum Szkoleniowe",
        industry: "Edukacja i szkolenia",
      },
    ],
  },
  {
    slug: "board-oversight-and-transparency",
    status: "published",
    area: "governance",
    sortOrder: 3,
    isFeatured: false,
    translations: [
      {
        language: "en",
        title: "Board oversight and transparency",
        summary:
          "A governance-focused case study about decision rights, reporting lines, and transparent oversight in ESG implementation.",
        content:
          "This case study focuses on governance arrangements in an institution that introduced clearer reporting responsibilities, board oversight, and decision escalation rules for ESG-related topics. Learners evaluate how structures influence trust and accountability.",
        keyTakeaways: [
          "Governance defines responsibility and escalation pathways.",
          "Transparent reporting improves institutional credibility.",
          "Oversight mechanisms strengthen ESG implementation.",
        ],
        organization: "Public Skills Institute",
        industry: "Public Education",
      },
      {
        language: "pl",
        title: "Nadzór zarządczy i przejrzystość",
        summary:
          "Studium przypadku skoncentrowane na governance: uprawnieniach decyzyjnych, liniach raportowania i przejrzystym nadzorze nad wdrażaniem ESG.",
        content:
          "To studium przypadku koncentruje się na rozwiązaniach governance w instytucji, która wprowadziła jaśniejsze odpowiedzialności raportowe, nadzór kierownictwa oraz zasady eskalacji decyzji w obszarze ESG. Użytkownicy oceniają, jak struktury wpływają na zaufanie i odpowiedzialność.",
        keyTakeaways: [
          "Governance definiuje odpowiedzialność i ścieżki eskalacji.",
          "Przejrzyste raportowanie zwiększa wiarygodność instytucji.",
          "Mechanizmy nadzoru wzmacniają wdrażanie ESG.",
        ],
        organization: "Publiczny Instytut Kompetencji",
        industry: "Edukacja publiczna",
      },
    ],
  },
  {
    slug: "energy-efficiency-retrofit",
    status: "draft",
    area: "environmental",
    sortOrder: 4,
    isFeatured: false,
    translations: [
      {
        language: "en",
        title: "Energy efficiency retrofit",
        summary:
          "A draft case study about balancing renovation cost, emissions reduction, and operational performance.",
        content:
          "This draft case study explores how an organisation assessed an energy retrofit project for its facilities. It is intended to help learners reason about environmental impact, financial constraints, and implementation sequencing.",
        keyTakeaways: [
          "Retrofit decisions require balancing environmental and financial goals.",
          "Operational continuity influences sustainability planning.",
          "Phased implementation can reduce delivery risk.",
        ],
        organization: "Demonstration Campus",
        industry: "Facilities Management",
      },
      {
        language: "pl",
        title: "Modernizacja efektywności energetycznej",
        summary:
          "Robocze studium przypadku o równoważeniu kosztów modernizacji, redukcji emisji i wydajności operacyjnej.",
        content:
          "To robocze studium przypadku pokazuje, jak organizacja analizowała projekt modernizacji energetycznej swoich obiektów. Ma pomóc użytkownikom rozumieć zależności między wpływem środowiskowym, ograniczeniami finansowymi i kolejnością wdrożenia.",
        keyTakeaways: [
          "Decyzje modernizacyjne wymagają równoważenia celów środowiskowych i finansowych.",
          "Ciągłość działania wpływa na planowanie zrównoważonych inwestycji.",
          "Wdrożenie etapowe może ograniczyć ryzyko realizacyjne.",
        ],
        organization: "Kampus demonstracyjny",
        industry: "Zarządzanie obiektami",
      },
    ],
  },
  {
    slug: "community-engagement-in-training-programmes",
    status: "draft",
    area: "social",
    sortOrder: 5,
    isFeatured: false,
    translations: [
      {
        language: "en",
        title: "Community engagement in training programmes",
        summary:
          "A draft case study about designing educational programmes with stronger community participation.",
        content:
          "This draft case study describes how a training provider involved local stakeholders in programme design to improve inclusion, relevance, and social value. Learners examine participation models and the tension between broad consultation and delivery speed.",
        keyTakeaways: [
          "Community input can improve relevance and legitimacy.",
          "Participation requires deliberate process design.",
          "Social value often depends on stakeholder engagement quality.",
        ],
        organization: "Community Skills Hub",
        industry: "Training Services",
      },
      {
        language: "pl",
        title: "Zaangażowanie społeczności w programy szkoleniowe",
        summary:
          "Robocze studium przypadku o projektowaniu programów edukacyjnych z silniejszym udziałem społeczności.",
        content:
          "To robocze studium przypadku opisuje, jak dostawca szkoleń włączył lokalnych interesariuszy w projektowanie programu, aby zwiększyć inkluzywność, trafność i wartość społeczną. Użytkownicy analizują modele partycypacji oraz napięcie między szerokimi konsultacjami a szybkością wdrożenia.",
        keyTakeaways: [
          "Głos społeczności może zwiększyć trafność i legitymację działań.",
          "Partycypacja wymaga świadomego zaprojektowania procesu.",
          "Wartość społeczna często zależy od jakości zaangażowania interesariuszy.",
        ],
        organization: "Lokalne Centrum Kompetencji",
        industry: "Usługi szkoleniowe",
      },
    ],
  },
  {
    slug: "ethics-and-reporting-controls",
    status: "draft",
    area: "governance",
    sortOrder: 6,
    isFeatured: false,
    translations: [
      {
        language: "en",
        title: "Ethics and reporting controls",
        summary:
          "A draft case study about strengthening governance through reporting controls and ethics procedures.",
        content:
          "This draft case study focuses on reporting controls, issue escalation, and ethics procedures in an organisation developing ESG governance maturity. It supports analysis of how internal rules influence trust, traceability, and accountability.",
        keyTakeaways: [
          "Controls and procedures support governance maturity.",
          "Traceable reporting improves accountability.",
          "Ethics frameworks should connect with operational practice.",
        ],
        organization: "Institutional Governance Lab",
        industry: "Organisational Development",
      },
      {
        language: "pl",
        title: "Etyka i mechanizmy raportowania",
        summary:
          "Robocze studium przypadku dotyczące wzmacniania governance przez mechanizmy raportowania i procedury etyczne.",
        content:
          "To robocze studium przypadku koncentruje się na kontrolach raportowych, eskalacji problemów i procedurach etycznych w organizacji rozwijającej dojrzałość governance w obszarze ESG. Wspiera analizę tego, jak wewnętrzne reguły wpływają na zaufanie, śledzalność i odpowiedzialność.",
        keyTakeaways: [
          "Kontrole i procedury wspierają dojrzałość governance.",
          "Śledzalne raportowanie wzmacnia odpowiedzialność.",
          "Ramowe zasady etyczne powinny łączyć się z praktyką operacyjną.",
        ],
        organization: "Laboratorium Governance",
        industry: "Rozwój organizacyjny",
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

async function upsertCaseStudy(caseStudyData) {
  const caseStudy = await prisma.caseStudy.upsert({
    where: { slug: caseStudyData.slug },
    update: {
      status: caseStudyData.status,
      area: caseStudyData.area,
      sortOrder: caseStudyData.sortOrder,
      isFeatured: caseStudyData.isFeatured,
    },
    create: {
      slug: caseStudyData.slug,
      status: caseStudyData.status,
      area: caseStudyData.area,
      sortOrder: caseStudyData.sortOrder,
      isFeatured: caseStudyData.isFeatured,
    },
  });

  for (const translation of caseStudyData.translations) {
    await prisma.caseStudyTranslation.upsert({
      where: {
        caseStudyId_language: {
          caseStudyId: caseStudy.id,
          language: translation.language,
        },
      },
      update: {
        title: translation.title,
        summary: translation.summary,
        content: translation.content,
        keyTakeaways: translation.keyTakeaways,
        organization: translation.organization,
        industry: translation.industry,
      },
      create: {
        caseStudyId: caseStudy.id,
        language: translation.language,
        title: translation.title,
        summary: translation.summary,
        content: translation.content,
        keyTakeaways: translation.keyTakeaways,
        organization: translation.organization,
        industry: translation.industry,
      },
    });
  }

  return caseStudy;
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

  for (const caseStudyData of caseStudies) {
    await upsertCaseStudy(caseStudyData);
  }

  const courseMap = new Map();

  for (const courseData of courses) {
    const course = await upsertCourse(courseData);
    courseMap.set(course.slug, course);
  }

  await seedAttempts(courseMap);

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
