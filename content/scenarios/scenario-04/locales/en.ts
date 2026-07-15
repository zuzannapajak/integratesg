import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario04Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario04Ids;

export const scenario04En = defineScenarioLocale<"scenario-04">({
  scenarioId,
  locale: "en",

  title: "Integrating ESG into Business Operations",

  shortTitle: "ESG in Operations",

  subtitle: "Building proportionate data, supplier and improvement processes for an SME",

  introduction: `
You are the operations and compliance lead at EcoPart Manufacturing, a 120-employee SME supplying components to two large EU customers. Both customers are beginning to request ESG-related information from suppliers, including data on energy use, waste, recycled content, labour practices, supplier standards and evidence of circularity.

The company's information is fragmented across finance, HR, environment, health and safety, production and purchasing. Most records are stored in spreadsheets, and the budget for new technology or consultancy support is limited. Senior management wants a practical roadmap that meets customer expectations and improves operations rather than creating an additional reporting burden.
    `.trim(),

  organisation: "EcoPart Manufacturing",

  role: "Operations and Compliance Lead",

  objectives: [
    "Build a proportionate ESG data process that supports customer requests and operational management.",
    "Apply circular economy and ESG criteria to priority suppliers and materials.",
    "Use ESG indicators to drive focused improvements in production and working practices.",
  ],

  boardAlt:
    "Three connected operational work areas showing ESG data management, circular supplier engagement and production improvement in a manufacturing company.",

  challenges: {
    [challenges.dataSystem]: {
      title: "Building a practical ESG data system",

      shortTitle: "Build the data system",

      context: `
Your first task is to organise ESG information so the company can answer customer requests and identify opportunities for improvement.

The Managing Director wants the company to be ready for ESG reporting, but IT capacity is limited and department managers are concerned about additional administrative work. The solution must create reliable structure without exceeding the organisation's current resources.
        `.trim(),

      question: "How should EcoPart Manufacturing organise its initial ESG data system?",

      choices: {
        [choices.dataSystem.simpleRegister]: {
          label: "Create a simple ESG data register",

          text: `
Identify a limited set of high-value indicators, such as energy use per unit, waste rate, recycled content, health and safety incidents and employee turnover. Assign owners in relevant departments, define data-quality rules, collect the information monthly using existing tools and review it in regular meetings.
            `.trim(),

          feedback: {
            title: "A proportionate foundation for reliable data",

            body: `
This approach gives the SME clear indicators, responsibilities and routines without overcomplicating the process. Starting with material information makes it easier to improve quality and expand the system as organisational capability grows.
              `.trim(),

            consequence:
              "Customer requests can be answered more consistently, and the same information can support decisions about cost, waste, safety and workforce stability.",

            takeaway:
              "A useful ESG data system starts with material indicators, ownership and quality controls rather than advanced technology.",
          },
        },

        [choices.dataSystem.buyPlatform]: {
          label: "Purchase a comprehensive ESG platform immediately",

          text: `
Buy an all-in-one reporting and dashboard platform before defining the indicators, owners and internal collection process so that the system can centralise every future request from the start.
            `.trim(),

          feedback: {
            title: "Software cannot repair an undefined process",

            body: `
A platform may help once the organisation understands what it needs to collect and who is responsible. Purchased too early, it can simply centralise incomplete and inconsistent information while creating additional cost.
              `.trim(),

            consequence:
              "The company risks paying for a complex system that does not improve data reliability or reduce departmental confusion.",

            takeaway:
              "Define the process, responsibilities and data standards before selecting technology to support them.",
          },
        },

        [choices.dataSystem.requestOnly]: {
          label: "Collect data only when customers ask",

          text: `
Continue gathering ESG information on demand because the company is not required to prepare a complete sustainability report and departments need to prioritise production work.
            `.trim(),

          feedback: {
            title: "Reactive collection creates recurring pressure",

            body: `
Information gathered only when requested is often rushed, inconsistent and difficult to verify. The company also loses the ability to observe trends and use the data for its own operational decisions.
              `.trim(),

            consequence:
              "Customer confidence may weaken, and opportunities to reduce energy use, waste, risk or employee turnover remain hidden.",

            takeaway:
              "Regular collection creates more value and less disruption than repeated last-minute reporting exercises.",
          },
        },
      },
    },

    [challenges.supplierCircularity]: {
      title: "Working with suppliers on circularity and ESG evidence",

      shortTitle: "Engage priority suppliers",

      context: `
One of EcoPart Manufacturing's largest customers requests evidence that circularity is improving in the supply chain.

Purchasing currently selects suppliers mainly according to price, delivery reliability and quality. Some suppliers are small businesses with limited ESG knowledge, and the purchasing team is concerned that new requirements could increase cost or reduce flexibility.
        `.trim(),

      question:
        "How should the company engage suppliers and collect credible circularity evidence?",

      choices: {
        [choices.supplierCircularity.focusHighImpact]: {
          label: "Focus on high-impact suppliers and practical evidence",

          text: `
Prioritise the suppliers and materials with the greatest operational or ESG impact. Request a small set of information on recycled content, packaging reduction, waste handling and basic labour standards. Accept reasonable proxies or improvement plans where detailed data is unavailable, and use the results to launch one or two practical pilots.
            `.trim(),

          feedback: {
            title: "Ambition is balanced with supplier capacity",

            body: `
This approach concentrates effort where it can create the greatest effect and keeps participation realistic for smaller suppliers. Practical pilots can generate evidence while strengthening rather than damaging supplier relationships.
              `.trim(),

            consequence:
              "Response rates and data usefulness improve, and the company can demonstrate credible progress in areas such as packaging, scrap reduction or recycled materials.",

            takeaway:
              "Proportionate requirements and impact-based prioritisation often produce better supply-chain evidence than universal complexity.",
          },
        },

        [choices.supplierCircularity.fullQuestionnaire]: {
          label: "Require the same detailed questionnaire from every supplier",

          text: `
Ask all suppliers to provide a complete ESG questionnaire and full life-cycle assessment data immediately so that the company applies one consistent standard across the entire supply base.
            `.trim(),

          feedback: {
            title: "A uniform requirement may be disproportionate",

            body: `
The method appears rigorous, but smaller suppliers may lack the knowledge, systems or resources to provide complex information. Excessive requirements can reduce cooperation without producing reliable evidence.
              `.trim(),

            consequence:
              "The company may receive few complete responses and spend significant time chasing information that cannot be used consistently.",

            takeaway:
              "Consistency should come from clear minimum requirements and definitions, not necessarily from imposing the same level of complexity on every supplier.",
          },
        },

        [choices.supplierCircularity.polishedDocuments]: {
          label: "Prioritise suppliers with polished ESG documents",

          text: `
Work first with suppliers that already publish professional sustainability material, even when they are not the most important suppliers in terms of spend, materials or operational impact.
            `.trim(),

          feedback: {
            title: "Easy-to-report suppliers may not represent the main impact",

            body: `
This option can produce quick documents for customer communication, but it directs attention toward presentation rather than the parts of the supply chain that matter most.
              `.trim(),

            consequence:
              "The resulting evidence may provide a misleading picture of progress while significant circularity and ESG risks remain untouched.",

            takeaway:
              "Supplier engagement should be prioritised according to material impact and risk, not only according to reporting maturity.",
          },
        },
      },
    },

    [challenges.operationalImprovement]: {
      title: "Turning ESG reporting into operational improvement",

      shortTitle: "Use data for improvement",

      context: `
Initial data shows that scrap rates and energy use vary significantly between production lines. HR information also reveals higher employee turnover in one shift team.

The leadership team must decide whether ESG should remain primarily a compliance and reporting activity or become part of the company's continuous-improvement process.
        `.trim(),

      question: "How should EcoPart Manufacturing use the new ESG information?",

      choices: {
        [choices.operationalImprovement.focusedProjects]: {
          label: "Connect selected indicators with focused improvement projects",

          text: `
Use scrap and energy data to launch targeted Kaizen activities, and use turnover and near-miss information to improve team routines, supervision and working conditions. Keep the indicator set manageable and review progress in normal operational meetings.
            `.trim(),

          feedback: {
            title: "ESG data becomes a source of operational value",

            body: `
This approach embeds ESG in everyday management and uses evidence to address specific production and workforce issues. Focused projects create visible learning without overwhelming the organisation.
              `.trim(),

            consequence:
              "The company can reduce cost and waste, improve safety and working conditions, and show customers that ESG is integrated into operations.",

            takeaway:
              "ESG creates lasting value when indicators are linked to decisions, accountable actions and continuous improvement.",
          },
        },

        [choices.operationalImprovement.separateReporting]: {
          label: "Keep ESG reporting separate from production",

          text: `
Let compliance staff prepare ESG reports while production teams continue to focus exclusively on productivity, quality and delivery targets.
            `.trim(),

          feedback: {
            title: "Separation prevents the data from improving the business",

            body: `
Protecting operational teams from additional reporting may appear efficient, but it also keeps the people who control energy, waste, safety and working practices outside the improvement process.
              `.trim(),

            consequence:
              "Employees may see ESG as bureaucracy, while cost savings, risk reduction and engagement opportunities are missed.",

            takeaway:
              "Operational functions must use ESG information, not only supply it to a separate reporting team.",
          },
        },

        [choices.operationalImprovement.transformAllAtOnce]: {
          label: "Launch a company-wide transformation at once",

          text: `
Introduce new targets and projects for energy, waste, labour practices, supplier standards and governance across every department simultaneously to demonstrate strong leadership and rapid cultural change.
            `.trim(),

          feedback: {
            title: "Excessive scope can weaken implementation",

            body: `
The ambition is positive, but an SME with limited resources may struggle to manage many new priorities at the same time. Teams can become confused or fatigued before useful routines are established.
              `.trim(),

            consequence:
              "Implementation quality declines and early setbacks may reduce long-term support for ESG integration.",

            takeaway:
              "Focused pilots create evidence, learning and organisational confidence that can support broader transformation later.",
          },
        },
      },
    },
  },

  summary: {
    title: "You have embedded ESG in practical business operations",

    body: `
You helped EcoPart Manufacturing create a manageable data process, engage suppliers according to material impact and turn ESG information into focused improvements that support both customer credibility and operational performance.
      `.trim(),

    takeaways: [
      "A proportionate ESG data system begins with material indicators, accountable owners, regular collection and clear quality rules.",
      "Supplier requirements should focus first on high-impact areas and allow realistic evidence or improvement plans where maturity is limited.",
      "ESG indicators should be reviewed in operational management and connected with targeted projects that reduce cost, waste and social risk.",
    ],
  },
});
