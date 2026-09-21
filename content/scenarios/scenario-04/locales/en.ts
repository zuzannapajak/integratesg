import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario04Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario04Ids;

export const scenario04En = defineScenarioLocale<"scenario-04">({
  scenarioId,
  locale: "en",

  title: "Integrating ESG into Business Operations",

  shortTitle: "ESG in Operations",

  subtitle: "Turning ESG data, supplier evidence and reporting into operational improvement",

  introduction: `
You are the operations and compliance lead at EcoPart Manufacturing, a 120-employee SME supplying components to two large EU customers. Both customers are beginning to request ESG-related information from suppliers, including data on energy use, waste, recycled content, basic labour practices, supplier standards and evidence of circularity. The company’s ESG data is currently fragmented across finance, HR, environment/health/safety, production and purchasing. Most information is stored in spreadsheets and the company has limited budget for new technology or consultancy support.

Senior management wants a practical roadmap that meets customer expectations while also improving operations. You must decide how to integrate ESG into daily business processes in a way that is credible, proportionate and useful for the company – not simply an additional reporting burden.
    `.trim(),

  organisation: "EcoPart Manufacturing",

  role: "Operations and Compliance Lead",

  objectives: [
    "Reconstruct supply chain and operational workflows using circular economy criteria to minimize waste.",
    "Implement ethical social practices within daily services to align operational governance with values.",
  ],

  boardAlt:
    "Three connected operational situations showing ESG data management, supplier circularity and continuous improvement at EcoPart Manufacturing.",

  challenges: {
    [challenges.dataSystem]: {
      title: "Building a practical ESG data system",

      shortTitle: "Build the ESG data system",

      context: `
Your first task is to organise ESG information so the company can respond to customer requests and identify operational improvements. The Managing Director wants the company to be “ready for ESG reporting” but IT capacity is limited and department managers are worried about extra administrative work.
        `.trim(),

      question: "How should EcoPart Manufacturing organise its initial ESG data system?",

      choices: {
        [choices.dataSystem.simpleRegister]: {
          label: "Create a simple ESG data register with clear ownership",

          text: `
Create a simple ESG data register that identifies the most relevant operational indicators, assigns data owners in each department and establishes a monthly data collection rhythm. Begin with a limited set of high-value indicators such as energy use per unit, waste rate, recycled content, health and safety incidents, and employee turnover. Use existing tools at first, but define clear data quality rules, responsibilities and review meetings.
            `.trim(),

          feedback: {
            body: `
Correct. This approach is proportionate for an SME because it creates structure without overcomplicating the process. By starting with material indicators, assigning ownership, and improving data quality step by step, the company can answer customer requests more reliably and use the same information to improve operations.
              `.trim(),
          },
        },

        [choices.dataSystem.buyPlatform]: {
          label: "Purchase a comprehensive ESG platform immediately",

          text: `
Purchase a comprehensive ESG software platform immediately so that all reporting, dashboards and customer requests can be managed in one central system from the start. This should reduce manual work and show customers that the company is taking ESG seriously.
            `.trim(),

          feedback: {
            body: `
This may sound professional, but software alone does not solve poor data ownership or unclear processes. If the company buys a platform before defining indicators, responsibilities and quality rules, it may create cost without improving reliability. The result can be an expensive system filled with incomplete or inconsistent data.
              `.trim(),
          },
        },

        [choices.dataSystem.requestOnly]: {
          label: "Collect ESG data only when customers request it",

          text: `
Continue collecting ESG data only when customers request it, because the company is not legally required to produce full sustainability reports. This avoids unnecessary internal workload and allows teams to focus on production priorities.
            `.trim(),

          feedback: {
            body: `
This seems efficient in the short term, but it keeps the company reactive. Data collected only when requested is often rushed, inconsistent and hard to verify. Over time, this can damage customer confidence and prevent the company from seeing trends that could reduce cost, waste or risk.
              `.trim(),
          },
        },
      },
    },

    [challenges.supplierCircularity]: {
      title: "Working with suppliers on circularity and ESG evidence",

      shortTitle: "Engage suppliers on circularity",

      context: `
One of your largest customers asks for evidence that your company is improving circularity in the supply chain. Purchasing currently selects suppliers mainly by price, delivery reliability and quality. Some suppliers are small businesses with limited ESG knowledge and your purchasing team is concerned that additional requirements could increase costs or reduce flexibility.
        `.trim(),

      question:
        "How should the company collect credible circularity and ESG evidence from its suppliers?",

      choices: {
        [choices.supplierCircularity.focusHighImpact]: {
          label: "Focus first on the highest-impact suppliers and materials",

          text: `
Focus first on the highest-impact suppliers and materials. Ask for a small, practical set of ESG and circularity information, such as recycled content, packaging reduction, waste handling and basic labour standards. Where suppliers lack detailed data, allow reasonable proxies or improvement plans. Use the results to identify one or two pilot opportunities, such as switching packaging, reducing scrap or increasing recycled material content.
            `.trim(),

          feedback: {
            body: `
Correct. This option balances ambition and practicality. It focuses effort where the greatest operational and ESG impact is likely to occur, while keeping supplier engagement realistic. This improves response rates, protects supplier relationships and creates credible circularity evidence.
              `.trim(),
          },
        },

        [choices.supplierCircularity.fullQuestionnaire]: {
          label: "Require the same detailed ESG questionnaire from every supplier",

          text: `
Ask all suppliers to complete the same detailed ESG questionnaire and provide full life-cycle assessment data immediately. This creates a consistent standard and ensures the company does not overlook risks in smaller or lower-spend suppliers.
            `.trim(),

          feedback: {
            body: `
This approach appears rigorous, but it can overwhelm smaller suppliers and reduce cooperation. If suppliers cannot provide complex data, the company may end up with low response rates and little usable information. A proportionate approach usually delivers better evidence than an excessive one.
              `.trim(),
          },
        },

        [choices.supplierCircularity.polishedDocuments]: {
          label: "Prioritise suppliers that already have polished ESG documents",

          text: `
Prioritise suppliers that can already provide polished ESG documents, even if they are not the most important suppliers operationally. This allows the company to show quick evidence to customers while gradually improving the rest of the supplier base later.
            `.trim(),

          feedback: {
            body: `
This option may produce quick documents for customer communication, but it risks focusing on the suppliers that are easiest to report on rather than those that matter most. This can create a misleading picture of progress and leave major ESG impacts untouched.
              `.trim(),
          },
        },
      },
    },

    [challenges.operationalImprovement]: {
      title: "Turning ESG reporting into operational improvement",

      shortTitle: "Use ESG data for improvement",

      context: `
After collecting initial ESG data, you notice that scrap rates and energy use vary significantly between production lines. HR data also shows higher turnover in one shift team. The leadership team asks whether ESG should remain mainly a reporting activity or become part of continuous improvement.
        `.trim(),

      question: "How should EcoPart Manufacturing use its ESG data in daily operations?",

      choices: {
        [choices.operationalImprovement.focusedProjects]: {
          label: "Link selected ESG indicators to focused improvement projects",

          text: `
Link selected ESG indicators to practical operational improvement projects. For example, use scrap and energy data to launch targeted Kaizen activities and use turnover and near-miss data to improve team routines, supervision and working conditions. Keep the number of indicators manageable and review them in regular operational meetings so ESG becomes part of daily management.
            `.trim(),

          feedback: {
            body: `
Correct. This approach turns ESG into a source of operational value. By connecting indicators to improvement projects, the company can reduce costs, improve safety and working conditions and show customers that ESG is embedded in daily operations rather than treated as paperwork.
              `.trim(),
          },
        },

        [choices.operationalImprovement.separateReporting]: {
          label: "Keep ESG reporting separate from production improvement",

          text: `
Keep ESG reporting separate from production improvement activities so that operational teams are not distracted. ESG data can be prepared by compliance staff, while production teams focus on productivity, quality and delivery targets.
            `.trim(),

          feedback: {
            body: `
This may seem efficient because it protects production teams from extra tasks. However, it prevents ESG data from being used to solve real operational problems. Staff may begin to see ESG as bureaucracy and the company may miss cost savings, safety improvements and engagement benefits.
              `.trim(),
          },
        },

        [choices.operationalImprovement.transformAllAtOnce]: {
          label: "Launch a company-wide ESG transformation across every area at once",

          text: `
Launch a company-wide ESG transformation programme covering all departments at once, with new targets for energy, waste, labour practices, supplier standards and governance. This demonstrates strong leadership and accelerates cultural change.
            `.trim(),

          feedback: {
            body: `
This option shows ambition, but it may overload the organisation. For an SME with limited resources, too many simultaneous ESG actions can create confusion, fatigue and weak implementation. Focused pilots often create faster learning and stronger long-term commitment.
              `.trim(),
          },
        },
      },
    },
  },

  summary: {
    title: "You have integrated ESG into business operations",

    takeaways: [
      "A practical SME data system begins with a limited set of relevant indicators, clear owners, quality rules and regular review.",
      "Supplier ESG and circularity requirements should be proportionate and focused first on the materials and suppliers with the greatest impact.",
      "ESG data creates operational value when it is linked to focused improvement projects and reviewed as part of normal management routines.",
    ],
  },
});
