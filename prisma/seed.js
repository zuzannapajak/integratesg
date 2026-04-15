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
          "This module introduces the foundations of ESG integration for vocational education and training providers. It prepares educators for case-based and scenario-based learning.",
      },
      {
        language: "pl",
        title: "Podstawy ESG dla dostawców VET",
        subtitle: "Zacznij tutaj",
        description:
          "Zbuduj wspólne rozumienie integracji ESG, kluczowych zagadnień oraz praktycznego podejmowania decyzji w kontekście edukacyjnym i organizacyjnym.",
        content:
          "Ten moduł wprowadza podstawy integracji ESG dla dostawców kształcenia zawodowego. Przygotowuje edukatorów do pracy z case studies i scenariuszami.",
      },
    ],
    sections: [
      {
        slug: "esg-introduction",
        sortOrder: 1,
        estimatedMinutes: 10,
        translations: [
          {
            language: "en",
            title: "Introduction to ESG",
            summary: "Understand the three ESG pillars and why they matter.",
            content:
              "This section introduces the environmental, social and governance dimensions and explains why ESG is treated as an integrated organisational function rather than a separate initiative.",
          },
          {
            language: "pl",
            title: "Wprowadzenie do ESG",
            summary: "Poznaj trzy filary ESG i zrozum, dlaczego są ważne.",
            content:
              "Ta sekcja wprowadza wymiary environmental, social i governance oraz wyjaśnia, dlaczego ESG należy traktować jako zintegrowaną funkcję organizacji, a nie odrębną inicjatywę.",
          },
        ],
      },
      {
        slug: "material-topics",
        sortOrder: 2,
        estimatedMinutes: 9,
        translations: [
          {
            language: "en",
            title: "Material topics and relevance",
            summary: "Learn how to identify what matters most in ESG practice.",
            content:
              "This section explains materiality and shows how organisations prioritise ESG issues based on relevance, impact and stakeholder expectations.",
          },
          {
            language: "pl",
            title: "Tematy istotne i ich znaczenie",
            summary: "Dowiedz się, jak rozpoznawać najważniejsze zagadnienia w praktyce ESG.",
            content:
              "Ta sekcja wyjaśnia pojęcie istotności i pokazuje, jak organizacje priorytetyzują zagadnienia ESG na podstawie znaczenia, wpływu oraz oczekiwań interesariuszy.",
          },
        ],
      },
      {
        slug: "esg-in-educational-contexts",
        sortOrder: 3,
        estimatedMinutes: 11,
        translations: [
          {
            language: "en",
            title: "ESG in educational and organisational contexts",
            summary: "See how ESG influences institutions, teams and learning environments.",
            content:
              "This section connects ESG with vocational education and training practice, showing how institutional choices, culture and accountability affect implementation quality.",
          },
          {
            language: "pl",
            title: "ESG w kontekstach edukacyjnych i organizacyjnych",
            summary: "Zobacz, jak ESG wpływa na instytucje, zespoły i środowiska uczenia się.",
            content:
              "Ta sekcja łączy ESG z praktyką kształcenia zawodowego i pokazuje, jak wybory instytucjonalne, kultura organizacyjna oraz odpowiedzialność wpływają na jakość wdrożenia.",
          },
        ],
      },
      {
        slug: "preparing-for-applied-learning",
        sortOrder: 4,
        estimatedMinutes: 10,
        translations: [
          {
            language: "en",
            title: "Preparing for applied learning",
            summary: "Get ready for case studies, scenarios and reflective learning.",
            content:
              "This section prepares learners for practical engagement with ESG through structured reflection, scenario-based thinking and analysis of realistic decision paths.",
          },
          {
            language: "pl",
            title: "Przygotowanie do uczenia się przez praktykę",
            summary:
              "Przygotuj się do pracy z case studies, scenariuszami i refleksyjnym uczeniem się.",
            content:
              "Ta sekcja przygotowuje uczestników do praktycznej pracy z ESG poprzez uporządkowaną refleksję, myślenie scenariuszowe oraz analizę realistycznych ścieżek decyzyjnych.",
          },
        ],
      },
    ],
    quizzes: [
      {
        type: "pre",
        title: "Pre-test",
        description: "Initial knowledge check before starting the module.",
        passingScore: 60,
        sortOrder: 1,
        translations: [
          {
            language: "en",
            title: "Pre-test",
            description: "Initial knowledge check before starting the module.",
          },
          {
            language: "pl",
            title: "Pre-test",
            description: "Wstępne sprawdzenie wiedzy przed rozpoczęciem modułu.",
          },
        ],
        questions: [
          {
            prompt: "What does ESG stand for?",
            explanation: "This question checks basic ESG terminology.",
            sortOrder: 1,
            translations: [
              {
                language: "en",
                prompt: "What does ESG stand for?",
                explanation: "This question checks basic ESG terminology.",
              },
              {
                language: "pl",
                prompt: "Co oznacza skrót ESG?",
                explanation: "To pytanie sprawdza podstawową terminologię ESG.",
              },
            ],
            answers: [
              {
                text: "Environmental, Social and Governance",
                isCorrect: true,
                feedbackText: "Correct. ESG stands for Environmental, Social and Governance.",
                sortOrder: 1,
                translations: [
                  {
                    language: "en",
                    text: "Environmental, Social and Governance",
                    feedbackText: "Correct. ESG stands for Environmental, Social and Governance.",
                  },
                  {
                    language: "pl",
                    text: "Environmental, Social and Governance",
                    feedbackText: "Poprawnie. ESG oznacza Environmental, Social and Governance.",
                  },
                ],
              },
              {
                text: "Economic, Strategic and Growth",
                isCorrect: false,
                feedbackText: "Incorrect. ESG does not stand for Economic, Strategic and Growth.",
                sortOrder: 2,
                translations: [
                  {
                    language: "en",
                    text: "Economic, Strategic and Growth",
                    feedbackText:
                      "Incorrect. ESG does not stand for Economic, Strategic and Growth.",
                  },
                  {
                    language: "pl",
                    text: "Economic, Strategic and Growth",
                    feedbackText: "Niepoprawnie. ESG nie oznacza Economic, Strategic and Growth.",
                  },
                ],
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
        translations: [
          {
            language: "en",
            title: "Post-test",
            description: "Final knowledge check after completing the module.",
          },
          {
            language: "pl",
            title: "Post-test",
            description: "Końcowe sprawdzenie wiedzy po ukończeniu modułu.",
          },
        ],
        questions: [
          {
            prompt: "Why is ESG integration important in organisational practice?",
            explanation: "This question checks understanding of ESG relevance.",
            sortOrder: 1,
            translations: [
              {
                language: "en",
                prompt: "Why is ESG integration important in organisational practice?",
                explanation: "This question checks understanding of ESG relevance.",
              },
              {
                language: "pl",
                prompt: "Dlaczego integracja ESG jest ważna w praktyce organizacyjnej?",
                explanation: "To pytanie sprawdza rozumienie znaczenia ESG.",
              },
            ],
            answers: [
              {
                text: "Because it connects responsibility, strategy and long-term decision-making",
                isCorrect: true,
                feedbackText:
                  "Correct. ESG integration supports strategic and responsible decision-making.",
                sortOrder: 1,
                translations: [
                  {
                    language: "en",
                    text: "Because it connects responsibility, strategy and long-term decision-making",
                    feedbackText:
                      "Correct. ESG integration supports strategic and responsible decision-making.",
                  },
                  {
                    language: "pl",
                    text: "Ponieważ łączy odpowiedzialność, strategię i długoterminowe podejmowanie decyzji",
                    feedbackText:
                      "Poprawnie. Integracja ESG wspiera strategiczne i odpowiedzialne podejmowanie decyzji.",
                  },
                ],
              },
              {
                text: "Because it only applies to marketing communication",
                isCorrect: false,
                feedbackText:
                  "Incorrect. ESG is broader than communication and affects the whole organisation.",
                sortOrder: 2,
                translations: [
                  {
                    language: "en",
                    text: "Because it only applies to marketing communication",
                    feedbackText:
                      "Incorrect. ESG is broader than communication and affects the whole organisation.",
                  },
                  {
                    language: "pl",
                    text: "Ponieważ dotyczy wyłącznie komunikacji marketingowej",
                    feedbackText:
                      "Niepoprawnie. ESG jest szersze niż komunikacja i wpływa na całą organizację.",
                  },
                ],
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
          "This module focuses on environmental responsibility in practical decision-making.",
      },
      {
        language: "pl",
        title: "Podejmowanie decyzji środowiskowych",
        subtitle: "Filar środowiskowy",
        description:
          "Poznaj kompromisy związane z wpływem środowiskowym, efektywnością zasobów oraz decyzjami dotyczącymi zrównoważonego rozwoju w realistycznych kontekstach edukacyjnych.",
        content:
          "Ten moduł koncentruje się na odpowiedzialności środowiskowej w praktycznym podejmowaniu decyzji.",
      },
    ],
    sections: [
      {
        slug: "environmental-impact-basics",
        sortOrder: 1,
        estimatedMinutes: 11,
        translations: [
          {
            language: "en",
            title: "Environmental impact basics",
            summary: "Understand how organisational choices affect environmental outcomes.",
            content:
              "This section introduces key environmental concepts such as resource use, emissions, efficiency and unintended consequences of operational decisions.",
          },
          {
            language: "pl",
            title: "Podstawy wpływu środowiskowego",
            summary: "Zrozum, jak decyzje organizacyjne wpływają na wyniki środowiskowe.",
            content:
              "Ta sekcja wprowadza kluczowe pojęcia środowiskowe, takie jak zużycie zasobów, emisje, efektywność oraz niezamierzone skutki decyzji operacyjnych.",
          },
        ],
      },
      {
        slug: "trade-offs-and-priorities",
        sortOrder: 2,
        estimatedMinutes: 12,
        translations: [
          {
            language: "en",
            title: "Trade-offs and priorities",
            summary: "Learn how competing priorities shape environmental decisions.",
            content:
              "This section explains why environmental decisions often involve trade-offs and how responsible choices require balancing cost, impact and feasibility.",
          },
          {
            language: "pl",
            title: "Kompromisy i priorytety",
            summary: "Dowiedz się, jak konkurujące priorytety kształtują decyzje środowiskowe.",
            content:
              "Ta sekcja wyjaśnia, dlaczego decyzje środowiskowe często wiążą się z kompromisami oraz jak odpowiedzialne wybory wymagają równoważenia kosztu, wpływu i wykonalności.",
          },
        ],
      },
      {
        slug: "applied-environmental-judgement",
        sortOrder: 3,
        estimatedMinutes: 12,
        translations: [
          {
            language: "en",
            title: "Applied environmental judgement",
            summary: "Apply environmental thinking in realistic decision paths.",
            content:
              "This section helps educators interpret practical situations where environmental considerations must be integrated into planning, implementation and evaluation.",
          },
          {
            language: "pl",
            title: "Stosowanie oceny środowiskowej w praktyce",
            summary: "Zastosuj myślenie środowiskowe w realistycznych ścieżkach decyzyjnych.",
            content:
              "Ta sekcja pomaga edukatorom interpretować praktyczne sytuacje, w których kwestie środowiskowe muszą zostać zintegrowane z planowaniem, wdrożeniem i oceną.",
          },
        ],
      },
    ],
    quizzes: [
      {
        type: "pre",
        title: "Pre-test",
        description: "Initial environmental knowledge check.",
        passingScore: 60,
        sortOrder: 1,
        translations: [
          {
            language: "en",
            title: "Pre-test",
            description: "Initial environmental knowledge check.",
          },
          {
            language: "pl",
            title: "Pre-test",
            description: "Wstępne sprawdzenie wiedzy środowiskowej.",
          },
        ],
        questions: [
          {
            prompt: "Which of these is most closely related to the environmental pillar of ESG?",
            explanation: "This question checks basic pillar recognition.",
            sortOrder: 1,
            translations: [
              {
                language: "en",
                prompt:
                  "Which of these is most closely related to the environmental pillar of ESG?",
                explanation: "This question checks basic pillar recognition.",
              },
              {
                language: "pl",
                prompt:
                  "Które z poniższych zagadnień jest najbardziej związane z filarem środowiskowym ESG?",
                explanation: "To pytanie sprawdza podstawowe rozpoznanie filaru.",
              },
            ],
            answers: [
              {
                text: "Resource efficiency",
                isCorrect: true,
                feedbackText:
                  "Correct. Resource efficiency is strongly linked to environmental performance.",
                sortOrder: 1,
                translations: [
                  {
                    language: "en",
                    text: "Resource efficiency",
                    feedbackText:
                      "Correct. Resource efficiency is strongly linked to environmental performance.",
                  },
                  {
                    language: "pl",
                    text: "Efektywność zasobów",
                    feedbackText:
                      "Poprawnie. Efektywność zasobów jest silnie powiązana z wynikami środowiskowymi.",
                  },
                ],
              },
              {
                text: "Board transparency only",
                isCorrect: false,
                feedbackText:
                  "Incorrect. Board transparency is more directly linked to governance.",
                sortOrder: 2,
                translations: [
                  {
                    language: "en",
                    text: "Board transparency only",
                    feedbackText:
                      "Incorrect. Board transparency is more directly linked to governance.",
                  },
                  {
                    language: "pl",
                    text: "Wyłącznie przejrzystość rady",
                    feedbackText:
                      "Niepoprawnie. Przejrzystość rady jest bardziej bezpośrednio związana z governance.",
                  },
                ],
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
        translations: [
          {
            language: "en",
            title: "Post-test",
            description: "Final environmental knowledge check.",
          },
          {
            language: "pl",
            title: "Post-test",
            description: "Końcowe sprawdzenie wiedzy środowiskowej.",
          },
        ],
        questions: [
          {
            prompt: "Why do environmental trade-offs matter in decision-making?",
            explanation: "This question checks applied understanding.",
            sortOrder: 1,
            translations: [
              {
                language: "en",
                prompt: "Why do environmental trade-offs matter in decision-making?",
                explanation: "This question checks applied understanding.",
              },
              {
                language: "pl",
                prompt: "Dlaczego kompromisy środowiskowe są ważne w podejmowaniu decyzji?",
                explanation: "To pytanie sprawdza rozumienie praktycznego zastosowania.",
              },
            ],
            answers: [
              {
                text: "Because one choice may improve one metric while worsening another",
                isCorrect: true,
                feedbackText:
                  "Correct. Environmental decisions often involve balancing competing priorities.",
                sortOrder: 1,
                translations: [
                  {
                    language: "en",
                    text: "Because one choice may improve one metric while worsening another",
                    feedbackText:
                      "Correct. Environmental decisions often involve balancing competing priorities.",
                  },
                  {
                    language: "pl",
                    text: "Ponieważ jeden wybór może poprawić jeden wskaźnik, a pogorszyć inny",
                    feedbackText:
                      "Poprawnie. Decyzje środowiskowe często wymagają równoważenia konkurujących priorytetów.",
                  },
                ],
              },
              {
                text: "Because all environmental decisions always have only one best answer",
                isCorrect: false,
                feedbackText:
                  "Incorrect. Real-world environmental decisions often require balancing trade-offs.",
                sortOrder: 2,
                translations: [
                  {
                    language: "en",
                    text: "Because all environmental decisions always have only one best answer",
                    feedbackText:
                      "Incorrect. Real-world environmental decisions often require balancing trade-offs.",
                  },
                  {
                    language: "pl",
                    text: "Ponieważ wszystkie decyzje środowiskowe zawsze mają tylko jedną najlepszą odpowiedź",
                    feedbackText:
                      "Niepoprawnie. Rzeczywiste decyzje środowiskowe często wymagają równoważenia kompromisów.",
                  },
                ],
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
          "This module explores the social dimension of ESG through inclusion, wellbeing, and stakeholder-oriented thinking.",
      },
      {
        language: "pl",
        title: "Wpływ społeczny w praktyce",
        subtitle: "Filar społeczny",
        description:
          "Przeanalizuj inkluzywność, wrażliwość na interesariuszy, dobrostan oraz odpowiedzialność poprzez przykłady zgodne ze społecznym wymiarem ESG.",
        content:
          "Ten moduł omawia społeczny wymiar ESG poprzez inkluzywność, dobrostan i podejście zorientowane na interesariuszy.",
      },
    ],
    sections: [
      {
        slug: "inclusion-and-access",
        sortOrder: 1,
        estimatedMinutes: 10,
        translations: [
          {
            language: "en",
            title: "Inclusion and access",
            summary: "Understand inclusion as a practical design and decision principle.",
            content:
              "This section focuses on inclusion, accessibility and equal participation, showing how social ESG themes influence the quality and fairness of implementation.",
          },
          {
            language: "pl",
            title: "Inkluzywność i dostęp",
            summary:
              "Zrozum inkluzywność jako praktyczną zasadę projektowania i podejmowania decyzji.",
            content:
              "Ta sekcja koncentruje się na inkluzywności, dostępności i równym uczestnictwie, pokazując, jak społeczne tematy ESG wpływają na jakość i sprawiedliwość wdrożenia.",
          },
        ],
      },
      {
        slug: "stakeholder-perspectives",
        sortOrder: 2,
        estimatedMinutes: 10,
        translations: [
          {
            language: "en",
            title: "Stakeholder perspectives",
            summary: "See how different groups experience the effects of decisions.",
            content:
              "This section explains stakeholder sensitivity and helps learners recognise how the same organisational decision can affect different groups in different ways.",
          },
          {
            language: "pl",
            title: "Perspektywy interesariuszy",
            summary: "Zobacz, jak różne grupy odczuwają skutki podejmowanych decyzji.",
            content:
              "Ta sekcja wyjaśnia wrażliwość na interesariuszy i pomaga uczestnikom rozpoznać, jak ta sama decyzja organizacyjna może wpływać na różne grupy w odmienny sposób.",
          },
        ],
      },
      {
        slug: "social-responsibility-in-action",
        sortOrder: 3,
        estimatedMinutes: 10,
        translations: [
          {
            language: "en",
            title: "Social responsibility in action",
            summary: "Apply social ESG thinking in practice-oriented examples.",
            content:
              "This section connects responsibility, wellbeing and implementation quality through practical examples that require empathy, analysis and balanced judgement.",
          },
          {
            language: "pl",
            title: "Społeczna odpowiedzialność w działaniu",
            summary: "Zastosuj społeczne myślenie ESG w przykładach zorientowanych na praktykę.",
            content:
              "Ta sekcja łączy odpowiedzialność, dobrostan i jakość wdrożenia poprzez praktyczne przykłady wymagające empatii, analizy i wyważonej oceny.",
          },
        ],
      },
    ],
    quizzes: [
      {
        type: "pre",
        title: "Pre-test",
        description: "Initial social knowledge check.",
        passingScore: 60,
        sortOrder: 1,
        translations: [
          {
            language: "en",
            title: "Pre-test",
            description: "Initial social knowledge check.",
          },
          {
            language: "pl",
            title: "Pre-test",
            description: "Wstępne sprawdzenie wiedzy społecznej.",
          },
        ],
        questions: [
          {
            prompt: "Which topic belongs most directly to the social dimension of ESG?",
            explanation: "This question checks recognition of the social pillar.",
            sortOrder: 1,
            translations: [
              {
                language: "en",
                prompt: "Which topic belongs most directly to the social dimension of ESG?",
                explanation: "This question checks recognition of the social pillar.",
              },
              {
                language: "pl",
                prompt: "Który temat należy najbardziej bezpośrednio do społecznego wymiaru ESG?",
                explanation: "To pytanie sprawdza rozpoznanie filaru społecznego.",
              },
            ],
            answers: [
              {
                text: "Wellbeing and inclusion",
                isCorrect: true,
                feedbackText: "Correct. Wellbeing and inclusion are core social ESG topics.",
                sortOrder: 1,
                translations: [
                  {
                    language: "en",
                    text: "Wellbeing and inclusion",
                    feedbackText: "Correct. Wellbeing and inclusion are core social ESG topics.",
                  },
                  {
                    language: "pl",
                    text: "Dobrostan i inkluzywność",
                    feedbackText:
                      "Poprawnie. Dobrostan i inkluzywność to kluczowe społeczne tematy ESG.",
                  },
                ],
              },
              {
                text: "Carbon accounting only",
                isCorrect: false,
                feedbackText:
                  "Incorrect. Carbon accounting is more directly connected to environmental topics.",
                sortOrder: 2,
                translations: [
                  {
                    language: "en",
                    text: "Carbon accounting only",
                    feedbackText:
                      "Incorrect. Carbon accounting is more directly connected to environmental topics.",
                  },
                  {
                    language: "pl",
                    text: "Wyłącznie rachunkowość emisji",
                    feedbackText:
                      "Niepoprawnie. Rachunkowość emisji jest bardziej bezpośrednio związana z tematami środowiskowymi.",
                  },
                ],
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
        translations: [
          {
            language: "en",
            title: "Post-test",
            description: "Final social knowledge check.",
          },
          {
            language: "pl",
            title: "Post-test",
            description: "Końcowe sprawdzenie wiedzy społecznej.",
          },
        ],
        questions: [
          {
            prompt: "Why is stakeholder sensitivity important in ESG?",
            explanation: "This question checks applied understanding.",
            sortOrder: 1,
            translations: [
              {
                language: "en",
                prompt: "Why is stakeholder sensitivity important in ESG?",
                explanation: "This question checks applied understanding.",
              },
              {
                language: "pl",
                prompt: "Dlaczego wrażliwość na interesariuszy jest ważna w ESG?",
                explanation: "To pytanie sprawdza praktyczne rozumienie zagadnienia.",
              },
            ],
            answers: [
              {
                text: "Because decisions affect different groups in different ways",
                isCorrect: true,
                feedbackText:
                  "Correct. Stakeholder-sensitive decisions consider varied impacts across groups.",
                sortOrder: 1,
                translations: [
                  {
                    language: "en",
                    text: "Because decisions affect different groups in different ways",
                    feedbackText:
                      "Correct. Stakeholder-sensitive decisions consider varied impacts across groups.",
                  },
                  {
                    language: "pl",
                    text: "Ponieważ decyzje wpływają na różne grupy w różny sposób",
                    feedbackText:
                      "Poprawnie. Decyzje uwzględniające interesariuszy biorą pod uwagę zróżnicowane skutki dla różnych grup.",
                  },
                ],
              },
              {
                text: "Because social issues are unrelated to implementation quality",
                isCorrect: false,
                feedbackText:
                  "Incorrect. Social considerations can strongly influence implementation quality.",
                sortOrder: 2,
                translations: [
                  {
                    language: "en",
                    text: "Because social issues are unrelated to implementation quality",
                    feedbackText:
                      "Incorrect. Social considerations can strongly influence implementation quality.",
                  },
                  {
                    language: "pl",
                    text: "Ponieważ kwestie społeczne nie są związane z jakością wdrożenia",
                    feedbackText:
                      "Niepoprawnie. Czynniki społeczne mogą silnie wpływać na jakość wdrożenia.",
                  },
                ],
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
          "This module examines governance as the layer that gives ESG implementation credibility and structure.",
      },
      {
        language: "pl",
        title: "Governance w praktyce",
        subtitle: "Filar zarządczy",
        description:
          "Skup się na odpowiedzialności, przejrzystości oraz strukturach decyzyjnych, które wspierają wiarygodną integrację ESG w zespołach i instytucjach.",
        content:
          "Ten moduł analizuje governance jako warstwę nadającą wdrażaniu ESG wiarygodność i strukturę.",
      },
    ],
    sections: [
      {
        slug: "governance-foundations",
        sortOrder: 1,
        estimatedMinutes: 9,
        translations: [
          {
            language: "en",
            title: "Governance foundations",
            summary: "Understand governance as the structure behind credible ESG action.",
            content:
              "This section introduces governance as the layer that defines roles, accountability, oversight and decision pathways in ESG implementation.",
          },
          {
            language: "pl",
            title: "Podstawy governance",
            summary: "Zrozum governance jako strukturę stojącą za wiarygodnym działaniem ESG.",
            content:
              "Ta sekcja przedstawia governance jako warstwę określającą role, odpowiedzialność, nadzór i ścieżki decyzyjne we wdrażaniu ESG.",
          },
        ],
      },
      {
        slug: "accountability-and-roles",
        sortOrder: 2,
        estimatedMinutes: 9,
        translations: [
          {
            language: "en",
            title: "Accountability and roles",
            summary: "See how roles and responsibilities shape implementation quality.",
            content:
              "This section explains accountability and shows why clear ownership is necessary for consistent ESG decisions and follow-through.",
          },
          {
            language: "pl",
            title: "Odpowiedzialność i role",
            summary: "Zobacz, jak role i odpowiedzialność kształtują jakość wdrożenia.",
            content:
              "Ta sekcja wyjaśnia odpowiedzialność i pokazuje, dlaczego jasne przypisanie właścicieli działań jest konieczne dla spójnych decyzji ESG i ich realizacji.",
          },
        ],
      },
      {
        slug: "transparency-and-reporting",
        sortOrder: 3,
        estimatedMinutes: 9,
        translations: [
          {
            language: "en",
            title: "Transparency and reporting",
            summary: "Learn why visibility and reporting support trust and control.",
            content:
              "This section connects transparency, reporting and traceability with organisational trust, learning and stronger governance maturity.",
          },
          {
            language: "pl",
            title: "Przejrzystość i raportowanie",
            summary:
              "Dowiedz się, dlaczego widoczność działań i raportowanie wspierają zaufanie i kontrolę.",
            content:
              "Ta sekcja łączy przejrzystość, raportowanie i śledzalność z zaufaniem organizacyjnym, uczeniem się i wyższą dojrzałością governance.",
          },
        ],
      },
      {
        slug: "escalation-and-decision-paths",
        sortOrder: 4,
        estimatedMinutes: 9,
        translations: [
          {
            language: "en",
            title: "Escalation and decision paths",
            summary: "Understand when and how issues should be escalated.",
            content:
              "This section shows how escalation mechanisms and decision pathways help organisations respond to risk, ambiguity and governance breakdowns.",
          },
          {
            language: "pl",
            title: "Eskalacja i ścieżki decyzyjne",
            summary: "Zrozum, kiedy i w jaki sposób problemy powinny być eskalowane.",
            content:
              "Ta sekcja pokazuje, jak mechanizmy eskalacji i ścieżki decyzyjne pomagają organizacjom reagować na ryzyko, niejednoznaczność i zaburzenia governance.",
          },
        ],
      },
      {
        slug: "governance-in-application",
        sortOrder: 5,
        estimatedMinutes: 9,
        translations: [
          {
            language: "en",
            title: "Governance in application",
            summary: "Apply governance thinking to realistic organisational situations.",
            content:
              "This section brings governance concepts into practice through applied examples that involve coordination, policy interpretation and responsible judgement.",
          },
          {
            language: "pl",
            title: "Governance w zastosowaniu",
            summary: "Zastosuj myślenie governance do realistycznych sytuacji organizacyjnych.",
            content:
              "Ta sekcja przenosi pojęcia governance do praktyki poprzez przykłady wymagające koordynacji, interpretacji polityk i odpowiedzialnej oceny.",
          },
        ],
      },
    ],
    quizzes: [
      {
        type: "pre",
        title: "Pre-test",
        description: "Initial governance knowledge check.",
        passingScore: 60,
        sortOrder: 1,
        translations: [
          {
            language: "en",
            title: "Pre-test",
            description: "Initial governance knowledge check.",
          },
          {
            language: "pl",
            title: "Pre-test",
            description: "Wstępne sprawdzenie wiedzy z zakresu governance.",
          },
        ],
        questions: [
          {
            prompt: "Which concept is most strongly associated with governance?",
            explanation: "This question checks governance recognition.",
            sortOrder: 1,
            translations: [
              {
                language: "en",
                prompt: "Which concept is most strongly associated with governance?",
                explanation: "This question checks governance recognition.",
              },
              {
                language: "pl",
                prompt: "Które pojęcie jest najsilniej związane z governance?",
                explanation: "To pytanie sprawdza rozpoznanie obszaru governance.",
              },
            ],
            answers: [
              {
                text: "Accountability",
                isCorrect: true,
                feedbackText: "Correct. Accountability is a core governance concept.",
                sortOrder: 1,
                translations: [
                  {
                    language: "en",
                    text: "Accountability",
                    feedbackText: "Correct. Accountability is a core governance concept.",
                  },
                  {
                    language: "pl",
                    text: "Odpowiedzialność",
                    feedbackText:
                      "Poprawnie. Odpowiedzialność jest jednym z podstawowych pojęć governance.",
                  },
                ],
              },
              {
                text: "Biodiversity protection only",
                isCorrect: false,
                feedbackText:
                  "Incorrect. Biodiversity belongs more directly to environmental issues.",
                sortOrder: 2,
                translations: [
                  {
                    language: "en",
                    text: "Biodiversity protection only",
                    feedbackText:
                      "Incorrect. Biodiversity belongs more directly to environmental issues.",
                  },
                  {
                    language: "pl",
                    text: "Wyłącznie ochrona bioróżnorodności",
                    feedbackText:
                      "Niepoprawnie. Bioróżnorodność należy bardziej bezpośrednio do zagadnień środowiskowych.",
                  },
                ],
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
        translations: [
          {
            language: "en",
            title: "Post-test",
            description: "Final governance knowledge check.",
          },
          {
            language: "pl",
            title: "Post-test",
            description: "Końcowe sprawdzenie wiedzy z zakresu governance.",
          },
        ],
        questions: [
          {
            prompt: "Why does governance matter for ESG credibility?",
            explanation: "This question checks applied governance understanding.",
            sortOrder: 1,
            translations: [
              {
                language: "en",
                prompt: "Why does governance matter for ESG credibility?",
                explanation: "This question checks applied governance understanding.",
              },
              {
                language: "pl",
                prompt: "Dlaczego governance ma znaczenie dla wiarygodności ESG?",
                explanation: "To pytanie sprawdza praktyczne rozumienie governance.",
              },
            ],
            answers: [
              {
                text: "Because it shapes oversight, transparency and responsible decision-making",
                isCorrect: true,
                feedbackText:
                  "Correct. Governance gives ESG implementation structure and credibility.",
                sortOrder: 1,
                translations: [
                  {
                    language: "en",
                    text: "Because it shapes oversight, transparency and responsible decision-making",
                    feedbackText:
                      "Correct. Governance gives ESG implementation structure and credibility.",
                  },
                  {
                    language: "pl",
                    text: "Ponieważ kształtuje nadzór, przejrzystość i odpowiedzialne podejmowanie decyzji",
                    feedbackText:
                      "Poprawnie. Governance nadaje wdrażaniu ESG strukturę i wiarygodność.",
                  },
                ],
              },
              {
                text: "Because governance only concerns visual branding",
                isCorrect: false,
                feedbackText:
                  "Incorrect. Governance is about structures, roles, accountability and oversight.",
                sortOrder: 2,
                translations: [
                  {
                    language: "en",
                    text: "Because governance only concerns visual branding",
                    feedbackText:
                      "Incorrect. Governance is about structures, roles, accountability and oversight.",
                  },
                  {
                    language: "pl",
                    text: "Ponieważ governance dotyczy wyłącznie identyfikacji wizualnej",
                    feedbackText:
                      "Niepoprawnie. Governance dotyczy struktur, ról, odpowiedzialności i nadzoru.",
                  },
                ],
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
