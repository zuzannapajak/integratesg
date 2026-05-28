import { question, readMarkdown, section, selfAssessmentQuiz, translation } from "./helpers.js";

export const module5 = {
  slug: "module-5-implementation-data-and-cross-functional-practice",
  status: "published",
  area: "cross_cutting",
  difficulty: "intermediate",
  estimatedDurationMinutes: 80,
  lessonsCount: 4,
  sortOrder: 5,
  isFeatured: false,
  translations: [
    translation("en", {
      title: "Module 5: Implementation, Data, and Cross-Functional Practice",
      subtitle: "Turning ESG goals into measurable and coordinated business practice",
      description:
        "This module focuses on ESG as a practical business process. Learners explore the ESG implementation lifecycle, data gathering and digitalisation, embedding ESG into daily decision-making, and cross-functional and cross-sector collaboration.",
      content:
        "This module helps learners understand how everyday decisions, structured data, coordination between teams and partnerships shape effective ESG integration over time. The full module content is divided into four Markdown-based units.",
    }),
  ],
  sections: [
    section({
      slug: "unit-1-lifecycle-of-esg-integration",
      sortOrder: 1,
      estimatedMinutes: 20,
      title: "Unit 1: Lifecycle of ESG Integration",
      summary:
        "Identify the main stages of the ESG implementation lifecycle and apply structured planning and evaluation approaches.",
      content: readMarkdown("content/curriculum/module-5/unit-1.md"),
    }),
    section({
      slug: "unit-2-esg-data-gathering-management-and-digitalisation",
      sortOrder: 2,
      estimatedMinutes: 20,
      title: "Unit 2: ESG Data Gathering, Management, and Digitalisation",
      summary:
        "Recognise key ESG data types and apply practical methods to collect, manage and digitalise ESG information effectively.",
      content: readMarkdown("content/curriculum/module-5/unit-2.md"),
    }),
    section({
      slug: "unit-3-embedding-esg-into-daily-processes-and-decision-making",
      sortOrder: 3,
      estimatedMinutes: 20,
      title: "Unit 3: Embedding ESG into Daily Processes and Decision-Making",
      summary:
        "Integrate ESG values into daily workflows and strengthen organisational culture around responsibility, ethics and sustainability.",
      content: readMarkdown("content/curriculum/module-5/unit-3.md"),
    }),
    section({
      slug: "unit-4-cross-functional-and-cross-sector-collaboration",
      sortOrder: 4,
      estimatedMinutes: 20,
      title: "Unit 4: Cross-Functional and Cross-Sector Collaboration",
      summary:
        "Identify collaboration opportunities within and beyond the organisation and apply partnership approaches that enhance ESG outcomes.",
      content: readMarkdown("content/curriculum/module-5/unit-4.md"),
    }),
  ],
  quizzes: [
    selfAssessmentQuiz({
      title: "Module 5 Self-assessment",
      description:
        "Self-assessment quiz for Module 5: Implementation, Data, and Cross-Functional Practice.",
      passingScore: 70,
      questions: [
        question({
          sortOrder: 1,
          prompt: "Question 1 — Which of the following best describes the ESG lifecycle?",
          answers: [
            {
              label: "1",
              text: "A one-time action plan focusing on environmental improvement only.",
              isCorrect: false,
              feedbackText:
                "Incorrect. ESG is not a one-time effort or limited to the environmental pillar. It integrates social and governance aspects as well.",
            },
            {
              label: "2",
              text: "A continuous process of planning, execution, and evaluation.",
              isCorrect: true,
              feedbackText:
                "Correct. The ESG lifecycle is a continuous process of planning, execution, and evaluation, leading to ongoing improvement.",
            },
            {
              label: "3",
              text: "A compliance checklist for annual reporting.",
              isCorrect: false,
              feedbackText:
                "Incorrect. ESG goes beyond compliance; it supports long-term value creation, not just reporting.",
            },
          ],
        }),

        question({
          sortOrder: 2,
          prompt:
            "Question 2 — During the planning phase of ESG integration, which of the following is most important?",
          answers: [
            {
              label: "1",
              text: "Defining clear and measurable goals.",
              isCorrect: true,
              feedbackText:
                "Correct. Setting measurable and achievable goals is central to the planning phase and guides all subsequent actions.",
            },
            {
              label: "2",
              text: "Promoting your ESG report to stakeholders.",
              isCorrect: false,
              feedbackText: "Incorrect. Promotion comes after results are achieved and evaluated.",
            },
            {
              label: "3",
              text: "Conducting employee satisfaction interviews only.",
              isCorrect: false,
              feedbackText:
                "Incorrect. While useful, interviews alone don’t provide a full ESG baseline.",
            },
          ],
        }),

        question({
          sortOrder: 3,
          prompt:
            "Question 3 — What is the main purpose of the evaluation phase in ESG implementation?",
          answers: [
            {
              label: "1",
              text: "To identify areas for improvement and inform future planning.",
              isCorrect: true,
              feedbackText:
                "Correct. Evaluation helps organisations learn, adjust, and continuously improve their ESG approach.",
            },
            {
              label: "2",
              text: "To finalize the ESG policy for publication.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Evaluation informs but does not finalize policy — it leads to refinements.",
            },
            {
              label: "3",
              text: "To replace previous ESG goals entirely.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Past goals are not discarded; they form the basis for improvement.",
            },
          ],
        }),

        question({
          sortOrder: 4,
          prompt: "Question 4 — Which of the following is an example of environmental data?",
          answers: [
            {
              label: "1",
              text: "Employee turnover rate.",
              isCorrect: false,
              feedbackText: "Incorrect. Employee turnover is a social metric.",
            },
            {
              label: "2",
              text: "Board gender diversity.",
              isCorrect: false,
              feedbackText: "Incorrect. Board gender diversity is a governance indicator.",
            },
            {
              label: "3",
              text: "Energy consumption per facility.",
              isCorrect: true,
              feedbackText: "Correct. Energy consumption reflects environmental performance.",
            },
          ],
        }),

        question({
          sortOrder: 5,
          prompt: "Question 5 — What ensures data comparability in ESG management?",
          answers: [
            {
              label: "1",
              text: "Changing measurement units often to reflect progress.",
              isCorrect: false,
              feedbackText: "Incorrect. Changing units makes it harder to compare results.",
            },
            {
              label: "2",
              text: "Using the same indicators and units over time.",
              isCorrect: true,
              feedbackText:
                "Correct. Consistent indicators and measurement units ensure accurate comparisons across time periods.",
            },
            {
              label: "3",
              text: "Collecting data only once per year.",
              isCorrect: false,
              feedbackText: "Incorrect. Annual data alone cannot reflect ongoing improvement.",
            },
          ],
        }),

        question({
          sortOrder: 6,
          prompt: "Question 6 — Why is digitalisation important for ESG data?",
          answers: [
            {
              label: "1",
              text: "It automates data gathering, improves accuracy, and supports transparency.",
              isCorrect: true,
              feedbackText:
                "Correct. Digitalisation simplifies collection, enhances accuracy, and enables real-time tracking.",
            },
            {
              label: "2",
              text: "It eliminates the need for human oversight.",
              isCorrect: false,
              feedbackText: "Incorrect. Human judgment remains crucial in interpreting data.",
            },
            {
              label: "3",
              text: "It allows only external auditors to access reports.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Transparency benefits internal teams and external stakeholders alike.",
            },
          ],
        }),

        question({
          sortOrder: 7,
          prompt: "Question 7 — What does “embedding ESG into daily work” primarily mean?",
          answers: [
            {
              label: "1",
              text: "Applying sustainability and ethical thinking in everyday decisions.",
              isCorrect: true,
              feedbackText:
                "Correct. Embedding ESG means aligning daily actions and choices with sustainability values.",
            },
            {
              label: "2",
              text: "Assigning ESG duties only to the sustainability department.",
              isCorrect: false,
              feedbackText:
                "Incorrect. ESG integration requires shared responsibility across departments.",
            },
            {
              label: "3",
              text: "Focusing exclusively on marketing ESG achievements.",
              isCorrect: false,
              feedbackText: "Incorrect. Communication supports ESG but isn’t its foundation.",
            },
          ],
        }),

        question({
          sortOrder: 8,
          prompt:
            "Question 8 — Which factor most strongly supports embedding ESG in company culture?",
          answers: [
            {
              label: "1",
              text: "Top-down enforcement without consultation.",
              isCorrect: false,
              feedbackText: "Incorrect. Imposed ESG rarely lasts without engagement.",
            },
            {
              label: "2",
              text: "Employee participation and leadership modeling behavior.",
              isCorrect: true,
              feedbackText:
                "Correct. When leaders model ESG values and employees participate, the culture naturally aligns.",
            },
            {
              label: "3",
              text: "Restricting ESG information to management teams.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Transparency and shared learning drive true cultural change.",
            },
          ],
        }),

        question({
          sortOrder: 9,
          prompt: "Question 9 — How can performance management systems strengthen ESG integration?",
          answers: [
            {
              label: "1",
              text: "By including ESG objectives and recognizing sustainability achievements.",
              isCorrect: true,
              feedbackText:
                "Correct. Linking ESG goals to performance reviews makes sustainability a practical responsibility.",
            },
            {
              label: "2",
              text: "By measuring only sales and profit growth.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Financial-only systems ignore long-term social and environmental value.",
            },
            {
              label: "3",
              text: "By excluding non-financial metrics to simplify evaluation.",
              isCorrect: false,
              feedbackText: "Incorrect. Non-financial indicators are essential in ESG assessment.",
            },
          ],
        }),

        question({
          sortOrder: 10,
          prompt:
            "Question 10 — What is the main purpose of cross-functional collaboration in ESG?",
          answers: [
            {
              label: "1",
              text: "To align departmental efforts toward shared sustainability goals.",
              isCorrect: true,
              feedbackText:
                "Correct. Cross-functional collaboration ensures consistent, organisation-wide ESG action.",
            },
            {
              label: "2",
              text: "To separate ESG duties for efficiency.",
              isCorrect: false,
              feedbackText: "Incorrect. Segregation weakens ESG integration.",
            },
            {
              label: "3",
              text: "To reduce communication between departments.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Communication is the foundation of effective collaboration.",
            },
          ],
        }),

        question({
          sortOrder: 11,
          prompt: "Question 11 — Which of the following best defines cross-sector collaboration?",
          answers: [
            {
              label: "1",
              text: "Cooperation between departments inside one company.",
              isCorrect: false,
              feedbackText: "Incorrect. That describes internal collaboration.",
            },
            {
              label: "2",
              text: "Partnerships between businesses, public institutions, and communities.",
              isCorrect: true,
              feedbackText:
                "Correct. Cross-sector collaboration means partnering with external actors such as municipalities or NGOs to achieve shared sustainability impact.",
            },
            {
              label: "3",
              text: "Competition between different industries on ESG goals.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Collaboration, not competition, drives shared ESG progress.",
            },
          ],
        }),

        question({
          sortOrder: 12,
          prompt:
            "Question 12 — What is the most effective way to sustain successful ESG partnerships?",
          answers: [
            {
              label: "1",
              text: "Agreeing on shared goals, clear roles, and transparent communication.",
              isCorrect: true,
              feedbackText:
                "Correct. Clear alignment, defined responsibilities, and open communication are essential for lasting partnerships.",
            },
            {
              label: "2",
              text: "Allowing each partner to act independently without coordination.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Independent actions without coordination reduce collective impact.",
            },
            {
              label: "3",
              text: "Avoiding progress measurement to prevent tension.",
              isCorrect: false,
              feedbackText: "Incorrect. Regular measurement maintains accountability and trust.",
            },
          ],
        }),
      ],
    }),
  ],
};
