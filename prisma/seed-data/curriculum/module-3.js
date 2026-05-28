import { question, readCurriculumMarkdown, section, translation, unitQuiz } from "./helpers.js";

export const module3 = {
  slug: "module-3-navigating-esg-frameworks-and-eu-reporting-standards",
  status: "published",
  area: "reporting",
  difficulty: "intermediate",
  estimatedDurationMinutes: 90,
  lessonsCount: 4,
  sortOrder: 3,
  isFeatured: false,
  translations: [
    translation("en", {
      title: "Module 3: Navigating ESG Frameworks and EU Reporting Standards",
      subtitle: "ESG frameworks and EU reporting",
      description:
        "Understand SDGs, GRI, SASB, TCFD, ESRS and CSRD, and translate reporting rules into SME actions.",
      content: readCurriculumMarkdown("en", "module-3", "intro"),
      details: {
        practicalFocus:
          "Understand the ESG frameworks and EU reporting rules that shape credible sustainability practice.",
        learningProgression:
          "Start with global frameworks, move into EU reporting requirements, then examine ratings, audits and SME implications.",
        outcomes: [
          "Differentiate between SDGs, GRI, SASB, TCFD, ESRS and CSRD and explain their main purposes.",
          "Describe how CSRD and related EU policies affect sustainability reporting and value chains.",
          "Recognise how ESG ratings, audits and disclosures influence credibility, finance and partnerships.",
        ],
        flow: [
          {
            title: "Unit 1: ESG frameworks",
            description: "Compare key frameworks such as SDGs, GRI, SASB, TCFD and ESRS.",
          },
          {
            title: "Unit 2: CSRD and EU policies",
            description:
              "Understand CSRD requirements, double materiality and links with EU sustainable finance rules.",
          },
          {
            title: "Unit 3: Ratings, audits and disclosures",
            description:
              "Explore how ESG performance is evaluated, verified and communicated externally.",
          },
          {
            title: "Unit 4: SME implications",
            description:
              "Translate ESG frameworks and reporting expectations into realistic SME actions.",
          },
        ],
        progressTracking:
          "Track progress through frameworks, reporting requirements and self-assessments to identify which ESG reporting topics need further review.",
      },
    }),
  ],
  sections: [
    section({
      slug: "unit-1-key-frameworks-sdgs-gri-sasb-tcfd-esrs",
      sortOrder: 1,
      estimatedMinutes: 25,
      title: "Unit 1: Key Frameworks – SDGs, GRI, SASB, TCFD, ESRS",
      summary:
        "Differentiate between the main ESG frameworks, understand their purposes, and select the framework or combination of frameworks most relevant to your organisation.",
      content: readCurriculumMarkdown("en", "module-3", "unit-1"),
    }),
    section({
      slug: "unit-2-csrd-and-related-eu-policies",
      sortOrder: 2,
      estimatedMinutes: 25,
      title:
        "Unit 2: The EU Corporate Sustainability Reporting Directive (CSRD) and related EU Policies",
      summary:
        "Explain the purpose, scope and requirements of the CSRD, how it connects to other EU policies, and how to prepare for CSRD-compliant reporting.",
      content: readCurriculumMarkdown("en", "module-3", "unit-2"),
    }),
    section({
      slug: "unit-3-esg-ratings-audits-disclosures-and-their-impact",
      sortOrder: 3,
      estimatedMinutes: 20,
      title: "Unit 3: ESG Ratings, Audits, Disclosures and Their Impact",
      summary:
        "Understand how ESG ratings, audits and disclosures work, why they matter, and how to prepare for ESG evaluation and assurance.",
      content: readCurriculumMarkdown("en", "module-3", "unit-3"),
    }),
    section({
      slug: "unit-4-practical-implications-for-smes-and-sector-specific-realities",
      sortOrder: 4,
      estimatedMinutes: 20,
      title: "Unit 4: Practical Implications for SMEs and Sector-Specific Realities",
      summary:
        "Translate ESG frameworks and reporting obligations into practical, sector-appropriate actions for SMEs.",
      content: readCurriculumMarkdown("en", "module-3", "unit-4"),
    }),
  ],
  quizzes: [
    unitQuiz({
      unitSlug: "unit-1-key-frameworks-sdgs-gri-sasb-tcfd-esrs",
      sortOrder: 1,
      title: "Unit 1 Self-assessment",
      description:
        "Self-assessment quiz for Unit 1: Key Frameworks \u2013 SDGs, GRI, SASB, TCFD, ESRS.",
      passingScore: 70,
      questions: [
        question({
          sortOrder: 1,
          prompt:
            "Question 1 — Which of the following statements best captures the unique focus of the SASB compared to other ESG frameworks?",
          answers: [
            {
              label: "1",
              text: "It provides a stakeholder-centred approach for reporting an organisation’s broad impacts on people and the planet.",
              isCorrect: false,
              feedbackText:
                "Incorrect. GRI standards are stakeholder-centred, addressing anyone affected by your activities, while SASB focuses on financial materiality.",
            },
            {
              label: "2",
              text: "It concentrates on the financial materiality of ESG issues specific to each industry sector.",
              isCorrect: true,
              feedbackText:
                "Correct. SASB focuses on financial materiality and offers specific standards for 77 industries.",
            },
            {
              label: "3",
              text: "It sets the mandatory legal requirements for sustainability disclosures within the EU.",
              isCorrect: false,
              feedbackText:
                "Incorrect. While it is not mandatory in the EU to complete reports using SASB, it can help you identify ESG issues that most directly affect profitability, such as energy efficiency or waste management.",
            },
          ],
        }),

        question({
          sortOrder: 2,
          prompt:
            "Question 2 — Which of the following frameworks is the mandatory legal reporting standard for companies within or connected to the EU market?",
          answers: [
            {
              label: "1",
              text: "TCFD (Task Force on Climate-related Financial Disclosures).",
              isCorrect: false,
              feedbackText:
                "Incorrect. The TCFD are optional — they guide you to disclose how climate change might affect your business model, investments, and strategy.",
            },
            {
              label: "2",
              text: "GRI (Global Reporting Initiative).",
              isCorrect: false,
              feedbackText:
                "Incorrect. Even though the GRI standards are the most widely adopted sustainability framework, they are not mandatory for businesses in the EU.",
            },
            {
              label: "3",
              text: "ESRS (European Sustainability Reporting Standards).",
              isCorrect: true,
              feedbackText:
                "Correct. The ESRS were developed by EFRAG as part of the EU’s Corporate Sustainability Reporting Directive (CSRD) and are thus mandatory.",
            },
          ],
        }),

        question({
          sortOrder: 3,
          prompt:
            "Question 3 — A small logistics firm based in the EU wants to prepare for future sustainability reporting obligations and demonstrate how climate change could affect delivery costs. Which combination of frameworks would best meet its needs?",
          answers: [
            {
              label: "1",
              text: "TCFD for assessing climate-related risks and ESRS for aligning with EU legal disclosure requirements.",
              isCorrect: true,
              feedbackText:
                "Correct. TCFD best reflect climate-related financial changes. ESRS are the legal disclosure requirements in the EU.",
            },
            {
              label: "2",
              text: "SDGs for selecting global goals and GRI for general impact reporting.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The SDGs are broad, global ambitions rather than reporting frameworks, and the GRI focuses on wider social and environmental impacts.",
            },
            {
              label: "3",
              text: "SASB for industry-specific financial metrics and GRI for community engagement data.",
              isCorrect: false,
              feedbackText:
                "Incorrect. SASB standards do focus on financially material ESG issues, but they are primarily designed for investor communication. The combination with GRI misses the climate risk focus and the mandatory structure that the scenario requires.",
            },
          ],
        }),

        question({
          sortOrder: 4,
          prompt:
            "Question 4 — A medium-sized manufacturing company wants to show investors how its energy efficiency efforts improve profitability. Which framework would be most appropriate to use for this purpose?",
          answers: [
            {
              label: "1",
              text: "GRI – to describe social and environmental impacts for all stakeholders.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The GRI framework helps organisations report on their broader social, environmental, and economic impacts. It does not focus on financial performance or investor priorities.",
            },
            {
              label: "2",
              text: "SASB – to highlight financially material ESG issues relevant to its industry.",
              isCorrect: true,
              feedbackText: "Correct. The SASB framework focuses on financial materiality.",
            },
            {
              label: "3",
              text: "SDGs – to align operations with global social priorities.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The SDGs provide a set of global sustainability goals, but they are not a reporting framework.",
            },
          ],
        }),

        question({
          sortOrder: 5,
          prompt:
            "Question 5 — Your organisation wants to begin sustainability reporting but feels overwhelmed by the number of frameworks. What should be the first practical step to ensure alignment with recognised standards?",
          answers: [
            {
              label: "1",
              text: "Begin by mapping your current initiatives against the SDGs to create an initial sustainability narrative.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Mapping to the SDGs can be a useful communication tool later on, but the first step is to identify which reporting frameworks are most relevant for your organisation.",
            },
            {
              label: "2",
              text: "Start by identifying which frameworks best match your organisation’s goals, size, and sector, and then apply them gradually.",
              isCorrect: true,
              feedbackText:
                "Correct. You should start small and choose the frameworks that fit your organisation, rather than trying to apply everything at once. This ensures a focused, manageable, and strategic approach to alignment.",
            },
            {
              label: "3",
              text: "Conduct a materiality assessment immediately to determine which ESG topics to report, without choosing a framework first.",
              isCorrect: false,
              feedbackText:
                "Incorrect. A materiality assessment is an essential step, but you should first select the frameworks relevant to your organisation. The chosen framework determines how the materiality assessment should be conducted.",
            },
          ],
        }),

        question({
          sortOrder: 6,
          prompt:
            "Question 6 — An organisation already reports using GRI and SASB but wants to ensure its disclosures meet the new EU requirements. Which step should it take next to align with recognised standards?",
          answers: [
            {
              label: "1",
              text: "Integrate the existing GRI and SASB reports with the ESRS structure and perform a double materiality assessment.",
              isCorrect: true,
              feedbackText:
                "Correct. The ESRS require both impact and financial perspectives — known as double materiality.",
            },
            {
              label: "2",
              text: "Replace all previous frameworks with ESRS, as combining them leads to inconsistency.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The frameworks are designed to complement, not replace, one another. Combining frameworks wisely creates a coherent and credible sustainability report.",
            },
            {
              label: "3",
              text: "Focus on the SDGs, since they cover all sustainability topics globally.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The SDGs provide high-level global goals but do not specify reporting standards or metrics. They are useful for strategic alignment but insufficient for structured disclosure or regulatory compliance.",
            },
          ],
        }),
      ],
    }),

    unitQuiz({
      unitSlug: "unit-2-csrd-and-related-eu-policies",
      sortOrder: 2,
      title: "Unit 2 Self-assessment",
      description:
        "Self-assessment quiz for Unit 2: The EU Corporate Sustainability Reporting Directive (CSRD) and related EU Policies.",
      passingScore: 70,
      questions: [
        question({
          sortOrder: 1,
          prompt: "Question 7 — What is the primary purpose of the CSRD?",
          answers: [
            {
              label: "1",
              text: "To introduce a voluntary framework that allows companies to highlight sustainability achievements when they choose to do so.",
              isCorrect: false,
              feedbackText:
                "Incorrect. While voluntary initiatives exist, the CSRD is mandatory and aims to ensure companies provide structured, reliable sustainability data.",
            },
            {
              label: "2",
              text: "To make sustainability reporting as reliable and comparable as financial reporting across a wider range of companies.",
              isCorrect: true,
              feedbackText:
                "Correct. The CSRD significantly expands the number of companies required to report and aims to make ESG information consistent, reliable, and comparable, similar to financial reporting.",
            },
            {
              label: "3",
              text: "To summarise other frameworks and thus reduce the depth of information needed for reporting.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The CSRD replaced and expanded the older Non-Financial Reporting Directive (NFRD) and significantly increases the depth of information companies must provide.",
            },
          ],
        }),

        question({
          sortOrder: 2,
          prompt:
            "Question 8 — A company preparing for CSRD-aligned reporting wants to understand what is required. Which of the following actions is necessary to comply with the CSRD?",
          answers: [
            {
              label: "1",
              text: "Reporting on environmental impacts, since financial risks are covered separately under the EU Taxonomy.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The CSRD requires double materiality, meaning that companies must report both their impacts on people and planet and how sustainability issues influence their financial performance. Environmental topics alone do not meet the requirement.",
            },
            {
              label: "2",
              text: "Focusing on data already requested by major clients, since supply chain expectations are sufficient for CSRD readiness.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Supply chain expectations matter, but CSRD compliance requires your own company to assess material topics, gather ESRS-aligned data, and meet disclosure and assurance rules.",
            },
            {
              label: "3",
              text: "Conducting a double materiality assessment and preparing disclosures according to the ESRS.",
              isCorrect: true,
              feedbackText:
                "Correct. CSRD compliance includes a double materiality assessment and alignment with the ESRS.",
            },
          ],
        }),

        question({
          sortOrder: 3,
          prompt: "Question 9 — How does the CSRD connect to the EU Taxonomy Regulation?",
          answers: [
            {
              label: "1",
              text: "The CSRD requires companies to report how much of their economic activity aligns with the EU Taxonomy’s criteria for environmental sustainability.",
              isCorrect: true,
              feedbackText:
                "Correct. The EU Taxonomy defines what counts as an environmentally sustainable activity, and CSRD reports must disclose alignment.",
            },
            {
              label: "2",
              text: "The CSRD uses the EU Taxonomy to determine which sustainability topics companies must prioritise in their double materiality assessments.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The double materiality assessment is required under the CSRD, but the EU Taxonomy does not determine which topics are prioritised. Instead, it defines environmentally sustainable activities.",
            },
            {
              label: "3",
              text: "The EU Taxonomy lists criteria for financial risk and opportunity assessment, which companies can use to prepare their financial materiality report.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The EU Taxonomy defines environmentally sustainable activities, but it does not list criteria for financial materiality reporting.",
            },
          ],
        }),

        question({
          sortOrder: 4,
          prompt: "Question 10 — What is the relationship between the CSRD and the SFDR?",
          answers: [
            {
              label: "1",
              text: "The SFDR provides guidance for companies on how to structure their sustainability reports, which must be submitted under the CSRD.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The SFDR does not determine how companies structure their disclosures. It applies to financial institutions.",
            },
            {
              label: "2",
              text: "Investors use the sustainability data reported under the CSRD to meet their own disclosures required by the SFDR.",
              isCorrect: true,
              feedbackText:
                "Correct. The SFDR obliges financial institutions to disclose sustainability risks and impacts. These institutions rely on CSRD-aligned company data to complete their own reporting obligations.",
            },
            {
              label: "3",
              text: "The CSRD and the SFDR operate independently, with no direct reliance on each other’s disclosure.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Although aimed at different groups, the two frameworks are interconnected: the SFDR depends on company data generated through the CSRD. They are part of the EU’s coordinated sustainable finance system.",
            },
          ],
        }),

        question({
          sortOrder: 5,
          prompt: "Question 11 — How does the CSRD connect to the CSDDD?",
          answers: [
            {
              label: "1",
              text: "The CSRD replaces the need for due diligence by requiring companies to report on their internal ESG performance.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The CSRD does not replace due diligence. The CSDDD requires companies to identify and address human rights and environmental risks across their entire value chain.",
            },
            {
              label: "2",
              text: "Companies must use CSDDD for reporting on their value chains, while CSRD are used for internal reporting.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The CSDDD requires companies to address human rights and environmental risks across their entire value chain, and the CSRD focuses on reporting requirements.",
            },
            {
              label: "3",
              text: "The CSDDD requires companies to take action on sustainability risks, while the CSRD ensures these actions and impacts are transparently reported.",
              isCorrect: true,
              feedbackText:
                "Correct. The two frameworks are complementary; the CSDDD focuses on the identification and management of risks, the CSRD requires the disclosure of data on those risks and actions.",
            },
          ],
        }),

        question({
          sortOrder: 6,
          prompt:
            "Question 12 — Your organisation wants to begin preparing for CSRD-compliant reporting. Which of the following actions is the most appropriate first step?",
          answers: [
            {
              label: "1",
              text: "Begin by gathering all possible ESG data immediately to ensure nothing is missed.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Data collection is important, but organisations should first understand whether and when the CSRD applies to them. This avoids unnecessary or misaligned data gathering.",
            },
            {
              label: "2",
              text: "Develop a preliminary sustainability report using any of the available frameworks.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The CSRD requires reporting according to the ESRS, not any framework. Preparing a report without understanding ESRS expectations will not support CSRD compliance.",
            },
            {
              label: "3",
              text: "Check whether your organisation falls within the CSRD scope and determine your reporting timeline.",
              isCorrect: true,
              feedbackText:
                "Correct. The first preparation step is to understand your obligations, including whether and when your company must report.",
            },
          ],
        }),

        question({
          sortOrder: 7,
          prompt:
            "Question 13 — Your company has confirmed that the CSRD will apply to it within the next two years. What is the next essential step you should take to move towards CSRD-compliant reporting?",
          answers: [
            {
              label: "1",
              text: "Assign responsibility for reporting to an external consultant in order to have more objective data collection.",
              isCorrect: false,
              feedbackText:
                "Incorrect. External support can help, but the CSRD requires integrating reporting into governance with clearly assigned internal responsibilities.",
            },
            {
              label: "2",
              text: "Conduct a double materiality assessment to identify which ESG topics are most relevant to the company and its stakeholders.",
              isCorrect: true,
              feedbackText:
                "Correct. Organisations must carry out a double materiality assessment, which helps determine which ESRS topics must be reported on.",
            },
            {
              label: "3",
              text: "Focus on engaging suppliers for data collection, since value-chain reporting is the first aspect covered in the report.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Supplier engagement is important, but internal assessments are also required.",
            },
          ],
        }),
      ],
    }),

    unitQuiz({
      unitSlug: "unit-3-esg-ratings-audits-disclosures-and-their-impact",
      sortOrder: 3,
      title: "Unit 3 Self-assessment",
      description:
        "Self-assessment quiz for Unit 3: ESG Ratings, Audits, Disclosures and Their Impact.",
      passingScore: 70,
      questions: [
        question({
          sortOrder: 1,
          prompt:
            "Question 14 — Which statement best describes how ESG ratings, audits, and disclosures relate to one another?",
          answers: [
            {
              label: "1",
              text: "ESG disclosures present sustainability information, audits assess the reliability of that information, and ratings evaluate how strong the company’s performance appears.",
              isCorrect: true,
              feedbackText:
                "Correct. ESG disclosures present sustainability information, audits assess the reliability of that information, and ratings evaluate how strong the company’s performance appears.",
            },
            {
              label: "2",
              text: "ESG disclosures interpret a company’s performance, audits compare it to peers, and ratings verify whether the data is accurate.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Disclosures present your own ESG information, audits check its accuracy, and ratings evaluate your performance compared to others.",
            },
            {
              label: "3",
              text: "ESG ratings and audits only apply to large corporations, while disclosures are optional for all SMEs.",
              isCorrect: false,
              feedbackText:
                "Incorrect. SMEs also benefit from audits and ratings, and disclosures are increasingly expected in supply chains and financing processes. ESG tools matter for organisations of all sizes.",
            },
          ],
        }),

        question({
          sortOrder: 2,
          prompt:
            "Question 15 — Why do ESG ratings and audited disclosures matter for organisations, including SMEs?",
          answers: [
            {
              label: "1",
              text: "They ensure that companies receive the same ESG score across all rating agencies, creating a single standard for performance benchmarking.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Each rating agency uses different methodologies, so scores vary.",
            },
            {
              label: "2",
              text: "They influence access to finance, strengthen business partnerships, and improve trust by demonstrating transparent and verifiable sustainability performance.",
              isCorrect: true,
              feedbackText:
                "Correct. ESG ratings and verified disclosures affect financing, partnerships, reputation, and compliance. Even SMEs benefit through increased credibility and competitiveness.",
            },
            {
              label: "3",
              text: "Auditors and rating agencies collect all necessary information independently, so companies do not have to monitor and collect their own ESG data.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Companies must track, document, and update their own ESG data. Agencies use publicly available information, but internal monitoring remains essential.",
            },
          ],
        }),

        question({
          sortOrder: 3,
          prompt:
            "Question 16 — How can strong ESG performance, supported by clear disclosures, influence investor confidence?",
          answers: [
            {
              label: "1",
              text: "It reassures investors that sustainability risks are managed effectively, making the organisation appear lower-risk and more attractive for financing.",
              isCorrect: true,
              feedbackText:
                "Correct. Strong ESG performance signals good management, reduces perceived risk, and increases investor confidence.",
            },
            {
              label: "2",
              text: "It guarantees that the organisation will receive identical ratings from all agencies, simplifying investor evaluation.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Rating agencies use different methodologies, so identical scores are unlikely. Investor confidence increases through transparency and reliability, not uniform ratings.",
            },
            {
              label: "3",
              text: "It eliminates the need for investors to analyse financial performance, since ESG scores include traditional financial indicators.",
              isCorrect: false,
              feedbackText:
                "Incorrect. ESG scores complement, not replace, financial analysis. Investors still rely on financial metrics.",
            },
          ],
        }),

        question({
          sortOrder: 4,
          prompt:
            "Question 17 — Why does strong ESG performance contribute to an organisation’s long-term competitiveness?",
          answers: [
            {
              label: "1",
              text: "It reduces the need for external audits, allowing companies to save resources that can be redirected towards innovation.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Strong ESG performance does not remove the requirement for audits under frameworks like CSRD.",
            },
            {
              label: "2",
              text: "It simplifies reporting and reduces reputational risks, thus contributing to long-term competitiveness.",
              isCorrect: false,
              feedbackText: "Incorrect. Strong ESG performance does not simplify reporting.",
            },
            {
              label: "3",
              text: "It strengthens reputation, attracts reliable business partners, and helps secure better financing terms.",
              isCorrect: true,
              feedbackText:
                "Correct. ESG performance improves brand trust, financing access, and partnership opportunities. These factors directly support competitiveness, especially in markets where sustainability expectations are rising.",
            },
          ],
        }),

        question({
          sortOrder: 5,
          prompt:
            "Question 18 — Which practical step should you take first when preparing your organisation for an ESG evaluation?",
          answers: [
            {
              label: "1",
              text: "Begin by setting ESG targets.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Targets matter, but start with mapping your existing ESG data to understand what you already track.",
            },
            {
              label: "2",
              text: "Focus on collecting data that rating agencies use.",
              isCorrect: false,
              feedbackText:
                "Incorrect. ESG audits rely heavily on internal evidence, not only on data requested by rating agencies.",
            },
            {
              label: "3",
              text: "Map current ESG data to identify what information is already collected.",
              isCorrect: true,
              feedbackText:
                "Correct. The first step is to map your ESG data, so you know your baseline before you set targets or engage auditors.",
            },
          ],
        }),

        question({
          sortOrder: 6,
          prompt:
            "Question 19 — Your organisation is preparing for external ESG audit for the first time. Which step will most effectively support a smooth process?",
          answers: [
            {
              label: "1",
              text: "Centralise all ESG-related documents in a single repository so that auditors can access them easily.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Centralisation supports efficiency, but validated, accurate data are most important to the auditing process.",
            },
            {
              label: "2",
              text: "Engage an independent reviewer to check the accuracy of your ESG data.",
              isCorrect: true,
              feedbackText:
                "Correct. Document all your evidence and use a light external audit or validation before the full audit.",
            },
            {
              label: "3",
              text: "Prioritise indicators that rating agencies focus on most, as these will also be the primary focus of the auditor.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Auditors verify data according to the ESRS and your actual disclosures, not rating agency preferences.",
            },
          ],
        }),
      ],
    }),

    unitQuiz({
      unitSlug: "unit-4-practical-implications-for-smes-and-sector-specific-realities",
      sortOrder: 4,
      title: "Unit 4 Self-assessment",
      description:
        "Self-assessment quiz for Unit 4: Practical Implications for SMEs and Sector-Specific Realities.",
      passingScore: 70,
      questions: [
        question({
          sortOrder: 1,
          prompt:
            "Question 20 — An SME wants to begin integrating ESG principles into its daily operations. Which approach best reflects how frameworks and reporting obligations translate into practical, manageable actions for smaller businesses?",
          answers: [
            {
              label: "1",
              text: "Identify a few priority ESG topics, collect basic data already available, and communicate early progress transparently.",
              isCorrect: true,
              feedbackText:
                "Correct. SMEs should focus on relevant priorities, use existing data as starting point, take small steps, and communicate transparently.",
            },
            {
              label: "2",
              text: "Apply a full ESG framework to ensure complete alignment from the beginning, even if many indicators are not yet relevant.",
              isCorrect: false,
              feedbackText:
                "Incorrect. SMEs should avoid taking on full frameworks immediately. Starting with simple, relevant steps rather than attempting comprehensive compliance is a better-suited approach.",
            },
            {
              label: "3",
              text: "Prioritise long-term ESG reporting obligations and produce your report once regulatory requirements for SMEs become clearer.",
              isCorrect: false,
              feedbackText:
                "Incorrect. While understanding future obligations is important, taking early, practical action is recommended.",
            },
          ],
        }),

        question({
          sortOrder: 2,
          prompt:
            "Question 21 — An SME wants to align ESG frameworks but is concerned about complexity. Which practical steps can the SME make to integrate ESG principles?",
          answers: [
            {
              label: "1",
              text: "Consult with external auditors on how to best implement an ESG framework.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Even though consultations with external auditors can help, the first step is to understand your priorities within the SME.",
            },
            {
              label: "2",
              text: "Prepare a strategy to track all indicators under the ESG principles.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Tracking all indicators under the ESG principles is not efficient to begin with. SMEs should firstly identify their priority areas.",
            },
            {
              label: "3",
              text: "Collaborate with partners to share resources and training on ESG topics.",
              isCorrect: true,
              feedbackText:
                "Correct. Collaboration with partners to share resources and training can support SMEs with the integration of ESG principles into their business.",
            },
          ],
        }),

        question({
          sortOrder: 3,
          prompt:
            "Question 22 — A small manufacturing company wants to integrate ESG into its daily operations without overextending its resources. Which approach aligns best with realistic, sector-appropriate ESG integration?",
          answers: [
            {
              label: "1",
              text: "Reduce travel emissions and encourage digital collaboration.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Reducing travel emissions and encouraging digital collaboration can be a realistic integration of ESG into a company, but is more sector-appropriate for companies in service and tourism.",
            },
            {
              label: "2",
              text: "Manage water and soil responsibly.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Managing water and soil responsibly is especially appropriate for companies in the agriculture and food sector.",
            },
            {
              label: "3",
              text: "Focus on energy efficiency, waste reduction, and worker safety.",
              isCorrect: true,
              feedbackText:
                "Correct. A small manufacturing company should focus on energy efficiency, waste reduction, and worker safety.",
            },
          ],
        }),

        question({
          sortOrder: 4,
          prompt:
            "Question 23 — Imagine you are the manager of a tourism and hospitality SME and want to integrate ESG principles into daily decisions. Which priority areas should you choose?",
          answers: [
            {
              label: "1",
              text: "Monitoring biodiversity impacts from service delivery, as this is a universal ESG expectation across all sectors.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Biodiversity may matter in some cases, but travel emissions, staff inclusivity, ethical sourcing, and community engagement are more relevant for services and tourism.",
            },
            {
              label: "2",
              text: "Reducing travel emissions by encouraging digital collaboration and strengthen social practices through staff training and community partnerships.",
              isCorrect: true,
              feedbackText:
                "Correct. These actions are considered priorities within ESG principles in the service and tourism sector.",
            },
            {
              label: "3",
              text: "Implementing advanced data-protection systems as the primary focus.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Data protection is central for technology and ICT, but tourism and hospitality ESG priorities differ.",
            },
          ],
        }),

        question({
          sortOrder: 5,
          prompt:
            "Question 24 — Which challenge commonly affects SMEs when trying to implement sustainability initiatives?",
          answers: [
            {
              label: "1",
              text: "Difficulty choosing the correct international ESG framework because SMEs are required to report under multiple standards.",
              isCorrect: false,
              feedbackText:
                "Incorrect. SMEs are not required to comply with multiple mandatory frameworks. The challenge lies more in lack of tailored guidance.",
            },
            {
              label: "2",
              text: "Limited staff capacity and uncertainty about which ESG topics and indicators are most relevant.",
              isCorrect: true,
              feedbackText:
                "Correct. SMEs often face challenges of limited time, unclear guidance, and difficulty linking ESG goals to short-term financial priorities.",
            },
            {
              label: "3",
              text: "Overabundance of sector-specific ESG tools designed exclusively for SMEs, making it difficult to choose a single approach.",
              isCorrect: false,
              feedbackText:
                "Incorrect. SMEs often face a lack of tailored guidance, not an excess of SME-specific tools.",
            },
          ],
        }),

        question({
          sortOrder: 6,
          prompt:
            "Question 25 — Which of the following reflects a realistic opportunity for SMEs when integrating sustainability into their business model?",
          answers: [
            {
              label: "1",
              text: "Enhanced reputation and increased attractiveness to clients, partners, and banks through transparent ESG practices.",
              isCorrect: true,
              feedbackText:
                "Correct. ESG integration strengthens reputation, opens doors to new business partnerships, and improves access to finance, even for SMEs.",
            },
            {
              label: "2",
              text: "Cost savings across all operational areas, as ESG actions reduce expenses in the short term.",
              isCorrect: false,
              feedbackText:
                "Incorrect. While ESG can improve efficiency and reduce waste, it does not guarantee short-term savings across all operational areas.",
            },
            {
              label: "3",
              text: "Exemption from future regulatory requirements, since sustainability expectations are primarily aimed at large companies.",
              isCorrect: false,
              feedbackText:
                "Incorrect. SMEs will increasingly be required to report on ESG practices, especially through supply chain expectations and evolving regulations like the CSRD.",
            },
          ],
        }),
      ],
    }),
  ],
};
