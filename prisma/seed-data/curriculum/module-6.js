import { question, readMarkdown, section, selfAssessmentQuiz, translation } from "./helpers.js";

export const module6 = {
  slug: "module-6-monitoring-reporting-and-future-trends-of-esg",
  status: "published",
  area: "reporting",
  difficulty: "intermediate",
  estimatedDurationMinutes: 80,
  lessonsCount: 4,
  sortOrder: 6,
  isFeatured: false,
  translations: [
    translation("en", {
      title: "Module 6: Monitoring, Reporting and Future Trends of ESG",
      subtitle: "Measuring ESG progress, communicating performance and preparing for future trends",
      description:
        "This module helps learners monitor ESG implementation through meaningful indicators and KPIs, report ESG performance credibly, use innovation to improve ESG outcomes, and prepare for future EU policies and global ESG trends.",
      content:
        "This module focuses on selecting meaningful ESG indicators, reporting ESG performance credibly, using innovation as a driver of ESG performance, and continuously improving ESG practices in response to future EU policies and global trends. The full module content is divided into four Markdown-based units.",
    }),
  ],
  sections: [
    section({
      slug: "unit-1-esg-indicators-and-key-performance-indicators-kpis",
      sortOrder: 1,
      estimatedMinutes: 20,
      title: "Unit 1: ESG Indicators and Key Performance Indicators (KPIs)",
      summary:
        "Define ESG indicators, understand environmental, social and governance categories, and use KPIs as a practical management tool for sustainable business.",
      content: readMarkdown("content/curriculum/module-6/unit-1.md"),
    }),
    section({
      slug: "unit-2-reporting-and-communicating-esg-performance",
      sortOrder: 2,
      estimatedMinutes: 20,
      title: "Unit 2: Reporting and Communicating ESG Performance",
      summary:
        "Apply ESG reporting principles and communicate ESG performance in a transparent, balanced and credible way.",
      content: readMarkdown("content/curriculum/module-6/unit-2.md"),
    }),
    section({
      slug: "unit-3-innovation-as-a-driver-for-esg-performance",
      sortOrder: 3,
      estimatedMinutes: 20,
      title: "Unit 3: Innovation as a Driver for ESG Performance",
      summary:
        "Understand how innovation, digital transformation, AI and sustainable finance can support ESG performance and efficiency.",
      content: readMarkdown("content/curriculum/module-6/unit-3.md"),
    }),
    section({
      slug: "unit-4-continuous-improvement-future-eu-policies-and-global-esg-trends",
      sortOrder: 4,
      estimatedMinutes: 20,
      title: "Unit 4: Continuous Improvement, Future EU Policies and Global ESG Trends",
      summary:
        "Use continuous improvement, future-trend scanning and regulatory awareness to keep ESG strategies relevant over time.",
      content: readMarkdown("content/curriculum/module-6/unit-4.md"),
    }),
  ],
  quizzes: [
    selfAssessmentQuiz({
      title: "Module 6 Self-assessment",
      description:
        "Self-assessment quiz for Module 6: Monitoring, Reporting and Future Trends of ESG.",
      passingScore: 70,
      questions: [
        question({
          sortOrder: 1,
          prompt:
            "Question 1 — You are the operations manager of a small manufacturing SME. Your CEO says: “Let’s track everything ESG-related so we look professional.” You identify 22 possible ESG indicators. What is the most strategic response?",
          answers: [
            {
              label: "A",
              text: "Approve all 22 indicators to show commitment.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Tracking too many indicators can dilute focus and reduce the effectiveness of ESG monitoring, especially in an SME context.",
            },
            {
              label: "B",
              text: "Select 4–6 KPIs linked to your biggest operational risks and costs.",
              isCorrect: true,
              feedbackText:
                "Correct. Strong ESG monitoring focuses on material and decision-relevant KPIs. Too many indicators dilute focus and reduce effectiveness.",
            },
            {
              label: "C",
              text: "Track only environmental indicators.",
              isCorrect: false,
              feedbackText:
                "Incorrect. ESG monitoring should include relevant environmental, social and governance dimensions, not only environmental data.",
            },
            {
              label: "D",
              text: "Wait until reporting becomes mandatory.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Waiting for mandatory reporting delays learning and prevents the organisation from using ESG data for better decisions now.",
            },
          ],
        }),

        question({
          sortOrder: 2,
          prompt:
            "Question 2 — Your company tracks electricity consumption monthly. After 3 months, consumption has increased by 6%, but production also increased by 15%. What is the best KPI refinement?",
          answers: [
            {
              label: "A",
              text: "Keep tracking total electricity only.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Total electricity use alone does not show whether the company is becoming more or less efficient when production levels change.",
            },
            {
              label: "B",
              text: "Introduce electricity consumption per unit produced.",
              isCorrect: true,
              feedbackText:
                "Correct. A KPI must support decision-making. Intensity metrics, such as electricity consumption per unit, improve comparability and relevance.",
            },
            {
              label: "C",
              text: "Stop measuring electricity.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Electricity remains relevant, but the KPI should be refined so it better supports decision-making.",
            },
            {
              label: "D",
              text: "Compare only annual totals.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Annual totals may hide important operational changes and do not provide enough timely insight for management.",
            },
          ],
        }),

        question({
          sortOrder: 3,
          prompt:
            "Question 3 — True or false: Selecting too many ESG KPIs can make monitoring less effective, especially for SMEs.",
          answers: [
            {
              label: "True",
              text: "Selecting too many ESG KPIs can make monitoring less effective, especially for SMEs.",
              isCorrect: true,
              feedbackText:
                "Correct. SMEs benefit from focusing on a small number of material and actionable KPIs rather than trying to measure everything.",
            },
            {
              label: "False",
              text: "Selecting many ESG KPIs always improves monitoring quality.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Too many KPIs can make monitoring confusing, reduce focus and make ESG management less effective.",
            },
          ],
        }),

        question({
          sortOrder: 4,
          prompt: "Question 4 — What is the main purpose of ESG reporting?",
          answers: [
            {
              label: "A",
              text: "Marketing the company’s sustainability image.",
              isCorrect: false,
              feedbackText:
                "Incorrect. ESG reporting should not be treated mainly as marketing. It should provide structured and reliable information.",
            },
            {
              label: "B",
              text: "Providing structured and transparent information on ESG performance.",
              isCorrect: true,
              feedbackText:
                "Correct. ESG reporting focuses on transparency and accountability through structured, reliable information, not promotion.",
            },
            {
              label: "C",
              text: "Replacing financial reporting.",
              isCorrect: false,
              feedbackText:
                "Incorrect. ESG reporting complements financial reporting but does not replace it.",
            },
            {
              label: "D",
              text: "Promoting future intentions only.",
              isCorrect: false,
              feedbackText:
                "Incorrect. ESG reporting should communicate actual performance, data, progress and limitations, not only intentions.",
            },
          ],
        }),

        question({
          sortOrder: 5,
          prompt:
            "Question 5 — Your marketing team publishes: “We are a fully sustainable company committed to protecting the planet.” No data, targets, or boundaries are provided. What is the main reporting risk?",
          answers: [
            {
              label: "A",
              text: "None, because sustainability is positive.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Positive language is not enough. ESG claims need evidence, context and boundaries.",
            },
            {
              label: "B",
              text: "Risk of greenwashing due to lack of verifiable data.",
              isCorrect: true,
              feedbackText:
                "Correct. Unsubstantiated claims without metrics or boundaries increase greenwashing risk and reduce credibility.",
            },
            {
              label: "C",
              text: "Risk of financial loss.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Financial loss may be an indirect consequence of reputational damage, but the main reporting risk here is greenwashing.",
            },
            {
              label: "D",
              text: "Regulatory breach automatically.",
              isCorrect: false,
              feedbackText:
                "Incorrect. A breach is not automatic in every situation, but the claim is clearly weak because it lacks evidence and boundaries.",
            },
          ],
        }),

        question({
          sortOrder: 6,
          prompt:
            "Question 6 — An investor asks how climate risks affect your long-term profitability. Your ESG report only describes recycling initiatives. What is missing?",
          answers: [
            {
              label: "A",
              text: "Social initiatives.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Social initiatives may be relevant, but the investor is asking specifically about climate risks and long-term profitability.",
            },
            {
              label: "B",
              text: "Governance disclosure.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Governance disclosure may be important, but the key missing element is the financial impact of sustainability issues.",
            },
            {
              label: "C",
              text: "Financial materiality perspective, also known as double materiality.",
              isCorrect: true,
              feedbackText:
                "Correct. Investors require disclosure on how sustainability issues affect financial performance.",
            },
            {
              label: "D",
              text: "Marketing strategy.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The issue is not marketing strategy, but the absence of financial materiality in ESG reporting.",
            },
          ],
        }),

        question({
          sortOrder: 7,
          prompt: "Question 7 — In the context of ESG, innovation is best described as:",
          answers: [
            {
              label: "A",
              text: "A goal that all companies must achieve.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Innovation is not an end in itself. It should support ESG performance and business improvement.",
            },
            {
              label: "B",
              text: "A high-cost technological investment.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Innovation does not always require expensive technology. It can include small pilots, process improvements or digital tools.",
            },
            {
              label: "C",
              text: "An enabler that supports ESG performance and efficiency.",
              isCorrect: true,
              feedbackText:
                "Correct. Innovation supports ESG goals by improving monitoring, efficiency and decision-making. It is a means, not an end.",
            },
            {
              label: "D",
              text: "A replacement for ESG strategy.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Innovation can support ESG strategy, but it does not replace strategic ESG planning and implementation.",
            },
          ],
        }),

        question({
          sortOrder: 8,
          prompt:
            "Question 8 — Your SME wants to reduce waste but has limited budget. You have two options: invest €80,000 in a new automated waste-sorting machine or run a 3-month pilot redesigning packaging to reduce material use. What is the most suitable SME innovation approach?",
          answers: [
            {
              label: "A",
              text: "Choose the machine immediately.",
              isCorrect: false,
              feedbackText:
                "Incorrect. A large investment may be useful later, but SMEs should usually test smaller, KPI-linked pilots before committing major capital.",
            },
            {
              label: "B",
              text: "Run the packaging pilot linked to a waste reduction KPI.",
              isCorrect: true,
              feedbackText:
                "Correct. SMEs benefit from small, KPI-linked pilots before large capital investments.",
            },
            {
              label: "C",
              text: "Postpone innovation.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Limited budget does not mean innovation should stop. Smaller pilots can create useful learning and measurable improvement.",
            },
            {
              label: "D",
              text: "Focus only on ESG communication.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Communication should reflect real operational improvements, not replace them.",
            },
          ],
        }),

        question({
          sortOrder: 9,
          prompt:
            "Question 9 — True or false: An ESG innovation should always be linked to at least one measurable KPI.",
          answers: [
            {
              label: "True",
              text: "An ESG innovation should be linked to at least one measurable KPI.",
              isCorrect: true,
              feedbackText:
                "Correct. Linking innovation to KPIs ensures that improvements can be measured and evaluated over time.",
            },
            {
              label: "False",
              text: "An ESG innovation does not need to be linked to measurable indicators.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Without measurable KPIs, it is difficult to evaluate whether innovation actually improves ESG performance.",
            },
          ],
        }),

        question({
          sortOrder: 10,
          prompt:
            "Question 10 — Your SME supplies parts to a large EU manufacturer that announces a net-zero roadmap aligned with the 2040 EU climate target. What is the most strategic action?",
          answers: [
            {
              label: "A",
              text: "Ignore it because SMEs are not directly regulated.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Even when SMEs are not directly regulated, supply chain expectations can create indirect ESG requirements.",
            },
            {
              label: "B",
              text: "Start mapping Scope 1, 2, and relevant Scope 3 emissions.",
              isCorrect: true,
              feedbackText:
                "Correct. Supply chain pressure and EU climate targets will indirectly affect SMEs. Early emissions mapping increases competitiveness.",
            },
            {
              label: "C",
              text: "Wait for legal obligation.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Waiting for a legal obligation may leave the company unprepared for customer and supply chain expectations.",
            },
            {
              label: "D",
              text: "Publish a sustainability slogan.",
              isCorrect: false,
              feedbackText:
                "Incorrect. A slogan does not create readiness. The company needs measurable data and credible action.",
            },
          ],
        }),

        question({
          sortOrder: 11,
          prompt: "Question 11 — Which of the following is a good ESG review routine for an SME?",
          answers: [
            {
              label: "A",
              text: "One ESG review every five years.",
              isCorrect: false,
              feedbackText:
                "Incorrect. ESG changes too quickly for such infrequent review. KPIs and actions may become outdated.",
            },
            {
              label: "B",
              text: "Monthly KPI updates and a short quarterly ESG review meeting.",
              isCorrect: true,
              feedbackText:
                "Correct. Regular, simple review routines help keep ESG integrated into daily management without creating excessive workload.",
            },
            {
              label: "C",
              text: "ESG review only when required by law.",
              isCorrect: false,
              feedbackText:
                "Incorrect. ESG should support ongoing management, not only legal compliance.",
            },
            {
              label: "D",
              text: "ESG review managed only by external consultants.",
              isCorrect: false,
              feedbackText:
                "Incorrect. External consultants may support the process, but ESG review should be integrated into internal management routines.",
            },
          ],
        }),

        question({
          sortOrder: 12,
          prompt:
            "Question 12 — Your ESG KPIs have remained unchanged for 2 years. No formal review meetings are held. What is the main risk?",
          answers: [
            {
              label: "A",
              text: "Overreporting.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The main risk is not overreporting, but stagnation and loss of relevance.",
            },
            {
              label: "B",
              text: "KPI stagnation and misalignment with new regulatory trends.",
              isCorrect: true,
              feedbackText:
                "Correct. ESG is dynamic. Without review routines, KPIs may become outdated and strategically irrelevant.",
            },
            {
              label: "C",
              text: "Financial audit failure.",
              isCorrect: false,
              feedbackText:
                "Incorrect. Financial audit failure is not the main risk described in this situation.",
            },
            {
              label: "D",
              text: "Too much transparency.",
              isCorrect: false,
              feedbackText:
                "Incorrect. The problem is not too much transparency, but insufficient review and adaptation.",
            },
          ],
        }),
      ],
    }),
  ],
};
