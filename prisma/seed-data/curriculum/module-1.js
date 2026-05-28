import { question, readMarkdown, section, selfAssessmentQuiz, translation } from "./helpers.js";

export const module1 = {
  slug: "module-1-introduction-to-esg-and-sustainable-development",
  status: "published",
  area: "cross_cutting",
  difficulty: "foundation",
  estimatedDurationMinutes: 45,
  lessonsCount: 4,
  sortOrder: 1,
  isFeatured: true,
  translations: [
    translation("en", {
      title:
        "Module 1: Introduction to ESG (Environmental, Social, Governance) and sustainable development",
      subtitle: "Foundation module",
      description:
        "A foundational module introducing ESG pillars, the historical evolution of ESG, its strategic relevance for SMEs and large enterprises, and the connection between ESG and the Sustainable Development Goals.",
      content:
        "This module equips learners with a fundamental understanding of ESG and its evolution. The full module content is divided into four Markdown-based units.",
    }),
  ],
  sections: [
    section({
      slug: "unit-1-the-three-pillars-of-esg",
      sortOrder: 1,
      estimatedMinutes: 12,
      title: "Unit 1: The Three Pillars of ESG (Environmental, Social, Governance)",
      summary: "Define the three core components of ESG: Environmental, Social, and Governance.",
      content: readMarkdown("content/curriculum/module-1/unit-1.md"),
    }),
    section({
      slug: "unit-2-from-corporate-philanthropy-to-business-necessity",
      sortOrder: 2,
      estimatedMinutes: 10,
      title: "Unit 2: From Corporate Philanthropy to Business Necessity",
      summary: "Describe the historical evolution of ESG in the business landscape.",
      content: readMarkdown("content/curriculum/module-1/unit-2.md"),
    }),
    section({
      slug: "unit-3-why-esg-is-your-strategic-advantage",
      sortOrder: 3,
      estimatedMinutes: 10,
      title: "Unit 3: Why ESG is Your Strategic Advantage",
      summary: "Identify the strategic relevance of ESG for both SMEs and large enterprises.",
      content: readMarkdown("content/curriculum/module-1/unit-3.md"),
    }),
    section({
      slug: "unit-4-linking-your-business-actions-to-global-goals",
      sortOrder: 4,
      estimatedMinutes: 13,
      title: "Unit 4: Linking Your Business Actions to Global Goals",
      summary:
        "Explain the connections between the ESG framework and the Sustainable Development Goals.",
      content: readMarkdown("content/curriculum/module-1/unit-4.md"),
    }),
  ],
  quizzes: [
    selfAssessmentQuiz({
      title: "Module 1 Self-assessment",
      description:
        "Self-assessment quiz for Module 1: Introduction to ESG and sustainable development.",
      passingScore: 70,
      questions: [
        question({
          sortOrder: 1,
          prompt:
            "Question 1.1 — Which core element is categorized under the Governance (G) pillar of ESG?",
          answers: [
            {
              label: "A",
              text: "Reducing manufacturing waste.",
              isCorrect: false,
              feedbackText:
                "Incorrect (A): Reducing manufacturing waste is a key component of the Environmental (E) pillar, as it deals with a company's direct impact on the planet.",
            },
            {
              label: "B",
              text: "Implementing strong anti-corruption policies.",
              isCorrect: true,
              feedbackText:
                "Correct (B): Implementing strong anti-corruption policies falls under the Governance (G) pillar, as it relates to the internal rules, ethical conduct, and accountability of the company's leadership.",
            },
            {
              label: "C",
              text: "Promoting employee health and safety.",
              isCorrect: false,
              feedbackText:
                "Incorrect (C): Promoting employee health and safety is a focus of the Social (S) pillar, concerning the treatment and wellbeing of the workforce.",
            },
          ],
        }),

        question({
          sortOrder: 2,
          prompt:
            "Question 1.2 — A company’s commitment to achieving a circular economy is primarily an activity within which ESG pillar?",
          answers: [
            {
              label: "A",
              text: "The Social pillar.",
              isCorrect: false,
              feedbackText:
                "Incorrect (A): The Social pillar focuses on people and relationships, for example employee wellbeing and diversity. The circular economy is about material use and waste.",
            },
            {
              label: "B",
              text: "The Governance pillar.",
              isCorrect: false,
              feedbackText:
                "Incorrect (B): The Governance pillar deals with leadership, transparency, and accountability, not material flows or waste reduction processes.",
            },
            {
              label: "C",
              text: "The Environmental pillar.",
              isCorrect: true,
              feedbackText:
                "Correct (C): The commitment to a circular economy — keeping materials in use for as long as possible — is a primary focus of the Environmental (E) pillar, as it relates to resource management and pollution avoidance.",
            },
          ],
        }),

        question({
          sortOrder: 3,
          prompt:
            "Question 1.3 — Which of the following is considered a component of the Social (S) pillar regarding workplace culture?",
          answers: [
            {
              label: "A",
              text: "Resource efficiency and water management.",
              isCorrect: false,
              feedbackText:
                "Incorrect (A): Managing water and resource efficiency is part of the Environmental (E) pillar's focus on the operation's footprint.",
            },
            {
              label: "B",
              text: "Diversity, Equality, and Inclusion (DEI).",
              isCorrect: true,
              feedbackText:
                "Correct (B): DEI is a core Social (S) component because it ensures the workplace is fair and accessible to people from all backgrounds.",
            },
            {
              label: "C",
              text: "Transparency and accountability in decision-making.",
              isCorrect: false,
              feedbackText:
                "Incorrect (C): Transparency and accountability are the internal engine of the Governance (G) pillar.",
            },
          ],
        }),

        question({
          sortOrder: 4,
          prompt:
            "Question 1.4 — What is the primary role of the Governance (G) pillar in relation to the other two pillars?",
          answers: [
            {
              label: "A",
              text: "It serves as the foundation that ensures E and S commitments are followed.",
              isCorrect: true,
              feedbackText:
                "Correct (A): Governance provides the rules and controls that give ESG efforts credibility and ensure E and S commitments are actually followed through.",
            },
            {
              label: "B",
              text: "It focuses exclusively on reducing the carbon footprint of the company.",
              isCorrect: false,
              feedbackText:
                "Incorrect (B): Carbon footprint management and tracking greenhouse gases are Environmental (E) tasks.",
            },
            {
              label: "C",
              text: "It handles charitable donations and community engagement.",
              isCorrect: false,
              feedbackText:
                "Incorrect (C): Community engagement and charity are activities within the Social (S) pillar.",
            },
          ],
        }),

        question({
          sortOrder: 5,
          prompt:
            "Question 2.1 — What was the key characteristic of the historical Socially Responsible Investing (SRI) era?",
          answers: [
            {
              label: "A",
              text: "Actively integrating ESG into core financial strategy.",
              isCorrect: false,
              feedbackText:
                "Incorrect (A): Actively integrating ESG into core strategy is the characteristic of the current Integration Era, not the early SRI era.",
            },
            {
              label: "B",
              text: "Focusing on excluding unethical companies from portfolios.",
              isCorrect: true,
              feedbackText:
                "Correct (B): Early SRI primarily involved a passive approach of excluding companies involved in certain sectors, such as tobacco or weapons, based on ethical beliefs.",
            },
            {
              label: "C",
              text: "Managing social projects separate from business operations.",
              isCorrect: false,
              feedbackText:
                "Incorrect (C): Managing social projects separate from core business operations was the distinguishing characteristic of the subsequent Corporate Social Responsibility (CSR) era.",
            },
          ],
        }),

        question({
          sortOrder: 6,
          prompt:
            "Question 2.2 — The shift from Corporate Social Responsibility (CSR) to the current ESG framework was primarily driven by:",
          answers: [
            {
              label: "A",
              text: "Investor demands to treat E, S, and G as financial risks.",
              isCorrect: true,
              feedbackText:
                "Correct (A): The term ESG gained traction because investors and global bodies realized that E, S, and G issues are financial risks and opportunities that impact a company’s long-term value.",
            },
            {
              label: "B",
              text: "The need for more charitable giving.",
              isCorrect: false,
              feedbackText:
                "Incorrect (B): CSR already covered charitable giving. The shift to ESG was driven by a need for more structure and financial relevance.",
            },
            {
              label: "C",
              text: "A focus on avoiding legal compliance issues.",
              isCorrect: false,
              feedbackText:
                "Incorrect (C): While compliance is a factor, the primary driver for the shift was the investment community's demand for integrated, non-financial factors, moving beyond simple legal compliance.",
            },
          ],
        }),

        question({
          sortOrder: 7,
          prompt:
            "Question 2.3 — Why was the traditional Corporate Social Responsibility (CSR) model often considered insufficient?",
          answers: [
            {
              label: "A",
              text: "It was too focused on investor financial returns.",
              isCorrect: false,
              feedbackText:
                "Incorrect (A): CSR often struggled because it wasn't always linked to the business or financial decision-making.",
            },
            {
              label: "B",
              text: "It was often voluntary and separate from core business strategy.",
              isCorrect: true,
              feedbackText:
                "Correct (B): CSR was often seen as philanthropy or an add-on; if profits dropped, CSR budgets were often the first to be cut.",
            },
            {
              label: "C",
              text: "It was too integrated into the company's daily operations.",
              isCorrect: false,
              feedbackText:
                "Incorrect (C): This is incorrect because CSR was historically separate from core operations, which is why the Integration Era was needed.",
            },
          ],
        }),

        question({
          sortOrder: 8,
          prompt:
            "Question 3.1 — For an SME, which factor demonstrates the most immediate strategic relevance of strong ESG performance?",
          answers: [
            {
              label: "A",
              text: "Receiving mandatory EU regulatory compliance reports.",
              isCorrect: false,
              feedbackText:
                "Incorrect (A): Mandatory EU regulatory compliance, like CSRD, is primarily a strategic concern for large enterprises, not typically for SMEs with limited resources.",
            },
            {
              label: "B",
              text: "Gaining access to large corporate supply chains and contracts.",
              isCorrect: true,
              feedbackText:
                "Correct (B): For SMEs, strong ESG performance is a critical strategic advantage for gaining access to large corporate supply chains, as large clients increasingly vet their suppliers for ESG credentials.",
            },
            {
              label: "C",
              text: "Maintaining a strong global brand reputation in the media.",
              isCorrect: false,
              feedbackText:
                "Incorrect (C): While important, maintaining a global brand reputation is usually a higher-level concern for large enterprises, not the most immediate relevance for an SME.",
            },
          ],
        }),

        question({
          sortOrder: 9,
          prompt:
            "Question 3.2 — Viewing ESG as a framework for long-term resilience and value creation rather than short-term gains is an example of which strategic process?",
          answers: [
            {
              label: "A",
              text: "Treating ESG as a cost to be minimized.",
              isCorrect: false,
              feedbackText:
                "Incorrect (A): Viewing ESG as a cost is counter to the strategic shift, which seeks to integrate it for value creation.",
            },
            {
              label: "B",
              text: "Prioritizing ESG objectives over financial performance.",
              isCorrect: false,
              feedbackText:
                "Incorrect (B): Strategic ESG aims to balance ESG with financial performance, not prioritize one over the other in isolation.",
            },
            {
              label: "C",
              text: "Linking ESG to core business strategy and risk management.",
              isCorrect: true,
              feedbackText:
                "Correct (C): The shift to long-term resilience is achieved by linking ESG to core business strategy, treating E, S, and G factors as essential elements of risk and opportunity management.",
            },
          ],
        }),

        question({
          sortOrder: 10,
          prompt:
            "Question 3.3 — How does focusing on the Environmental (E) pillar support the financial success of an SME?",
          answers: [
            {
              label: "A",
              text: "It increases the cost of materials and labor.",
              isCorrect: false,
              feedbackText:
                "Incorrect (A): While there is an initial focus on tracking, the ultimate goal of the E pillar is to reduce waste and inefficiency.",
            },
            {
              label: "B",
              text: "It leads to cost reduction through energy and resource efficiency.",
              isCorrect: true,
              feedbackText:
                "Correct (B): Focusing on energy and resource efficiency directly reduces operational costs, boosting competitiveness and providing a direct financial win.",
            },
            {
              label: "C",
              text: "It requires the SME to stop all transportation services to save fuel.",
              isCorrect: false,
              feedbackText:
                "Incorrect (C): ESG focuses on the efficiency of transportation, such as tracking carbon footprints, rather than stopping essential business operations.",
            },
          ],
        }),

        question({
          sortOrder: 11,
          prompt:
            "Question 3.4 — What is a critical first step for an organization to embed ESG into its strategic operations?",
          answers: [
            {
              label: "A",
              text: "Link ESG objectives to the core business mission.",
              isCorrect: true,
              feedbackText:
                "Correct (A): To make ESG strategically relevant, businesses must ensure ESG objectives align with their core business mission and organizational structure.",
            },
            {
              label: "B",
              text: "Focus only on the S pillar to avoid environmental costs.",
              isCorrect: false,
              feedbackText:
                "Incorrect (B): Organizations should prioritize the factors most critical to their specific sector, which often requires a balance of all three pillars.",
            },
            {
              label: "C",
              text: "Outsource all ESG decisions to an external social media agency.",
              isCorrect: false,
              feedbackText:
                "Incorrect (C): Internal leadership buy-in and commitment are critical for making sure ESG is taken seriously across all departments.",
            },
          ],
        }),

        question({
          sortOrder: 12,
          prompt:
            "Question 4.1 — Which statement best explains the relationship between ESG and the SDGs?",
          answers: [
            {
              label: "A",
              text: "SDGs are the What, global goals, and ESG is the How, business framework.",
              isCorrect: true,
              feedbackText:
                "Correct (A): The SDGs are the global objectives, the What the world is trying to achieve, and ESG is the practical business framework, the How, used at the company level to contribute to those goals.",
            },
            {
              label: "B",
              text: "ESG represents the global objectives, while the SDGs are the business framework.",
              isCorrect: false,
              feedbackText:
                "Incorrect (B): This statement reverses the roles. The SDGs are the global objectives, and ESG is the business framework.",
            },
            {
              label: "C",
              text: "ESG focuses on all 17 goals, while the SDGs focus only on environment and society.",
              isCorrect: false,
              feedbackText:
                "Incorrect (C): The SDGs cover all 17 areas of sustainability, which is broader than just environment and society.",
            },
          ],
        }),

        question({
          sortOrder: 13,
          prompt:
            "Question 4.2 — A company’s strong commitment to internal Diversity, Equality, and Inclusion (DEI) efforts primarily aligns with which pair of Sustainable Development Goals (SDGs)?",
          answers: [
            {
              label: "A",
              text: "SDG 13 (Climate Action) and SDG 7 (Clean Energy).",
              isCorrect: false,
              feedbackText:
                "Incorrect (A): Climate Action and Clean Energy are aligned with the Environmental (E) pillar, not internal DEI efforts.",
            },
            {
              label: "B",
              text: "SDG 16 (Strong Institutions) and SDG 12 (Responsible Consumption).",
              isCorrect: false,
              feedbackText:
                "Incorrect (B): Strong Institutions relates to Governance (G), and Responsible Consumption relates to the Environmental (E) pillar.",
            },
            {
              label: "C",
              text: "SDG 5 (Gender Equality) and SDG 10 (Reduced Inequalities).",
              isCorrect: true,
              feedbackText:
                "Correct (C): Internal DEI efforts within the Social (S) pillar, such as ensuring fair opportunities for all backgrounds, directly contribute to SDG 5, Gender Equality, and SDG 10, Reduced Inequalities.",
            },
          ],
        }),

        question({
          sortOrder: 14,
          prompt:
            "Question 4.3 — Measuring and reducing a company’s carbon footprint is a business action that directly supports which SDG?",
          answers: [
            {
              label: "A",
              text: "SDG 13: Climate Action.",
              isCorrect: true,
              feedbackText:
                "Correct (A): By measuring and reducing your carbon footprint under the Environmental (E) pillar, you are directly helping to combat climate change, SDG 13.",
            },
            {
              label: "B",
              text: "SDG 16: Peace, Justice, and Strong Institutions.",
              isCorrect: false,
              feedbackText:
                "Incorrect (B): SDG 16 is linked to the Governance (G) pillar's focus on transparency, accountability, and anti-corruption.",
            },
            {
              label: "C",
              text: "SDG 3: Good Health and Wellbeing.",
              isCorrect: false,
              feedbackText:
                "Incorrect (C): SDG 3 is linked to the Social (S) pillar's focus on employee health, safety, and wellbeing.",
            },
          ],
        }),

        question({
          sortOrder: 15,
          prompt:
            "Question 4.4 — Why is it beneficial for an SME to communicate its ESG achievements using the language of the SDGs?",
          answers: [
            {
              label: "A",
              text: "It is a mandatory requirement to avoid heavy financial penalties.",
              isCorrect: false,
              feedbackText:
                "Incorrect (A): While reporting is becoming mandatory for large firms under CSRD, for SMEs, the link to SDGs is currently a strategic communication tool.",
            },
            {
              label: "B",
              text: "It gives customers and partners a clear view of how day-to-day actions contribute to a global vision.",
              isCorrect: true,
              feedbackText:
                "Correct (B): Framing achievements through the SDGs shows how local, day-to-day actions contribute to realizing a global vision for sustainable development.",
            },
            {
              label: "C",
              text: "It allows the business to stop reporting on its financial performance.",
              isCorrect: false,
              feedbackText:
                "Incorrect (C): ESG factors are non-financial factors that supplement rather than replace financial performance reporting.",
            },
          ],
        }),
      ],
    }),
  ],
};
