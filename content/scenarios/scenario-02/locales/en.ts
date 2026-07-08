import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario02Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario02Ids;

export const scenario02En = defineScenarioLocale<"scenario-02">({
  scenarioId,
  locale: "en",

  title: "Strategy, Vision and Organisational Alignment",

  shortTitle: "Strategy & Alignment",

  subtitle: "Embedding ESG priorities in business strategy and organisational practice",

  introduction: `
NordForm Components is a medium-sized manufacturing company facing growing expectations from customers, employees and business partners.

The organisation has already undertaken several sustainability-related activities, but they remain fragmented and are not yet connected to one coherent ESG strategy.

You have been asked to support the management team in defining priorities, responding to financial pressure and creating organisational ownership for ESG.
    `.trim(),

  organisation: "NordForm Components",

  role: "Strategy and Sustainability Manager",

  objectives: [
    "Identify ESG priorities that are material to the organisation and its stakeholders.",
    "Connect ESG investments with business risks, opportunities and financial performance.",
    "Build shared organisational responsibility for implementing the ESG strategy.",
  ],

  boardAlt:
    "Three connected work areas in a manufacturing company: a strategic management meeting, a financial review and a cross-functional employee workshop.",

  challenges: {
    [challenges.priorities]: {
      title: "Defining strategic ESG priorities",

      shortTitle: "Define ESG priorities",

      context: `
The management board agrees that ESG should become part of the company strategy. However, different managers are proposing different priorities.

Some want to focus only on activities that are easy to communicate. Others want to include every possible ESG topic, even though the company does not yet have sufficient resources or data.

The board needs a clear method for deciding what should be addressed first.
        `.trim(),

      question:
        "Which approach should NordForm Components use to define its initial ESG priorities?",

      choices: {
        [choices.priorities.shortTermActions]: {
          label: "Choose highly visible short-term actions",

          text: `
Select several initiatives that can be implemented quickly and communicated publicly, such as volunteering activities and a small environmental campaign.
            `.trim(),

          feedback: {
            title: "Visible actions are not enough",

            body: `
Quick initiatives may support communication, but they do not provide a reliable basis for an ESG strategy. They may also direct attention away from the organisation's most significant risks and impacts.
              `.trim(),

            consequence:
              "Resources could be spent on activities that are not material to the company or its stakeholders.",

            takeaway:
              "Strategic ESG priorities should result from materiality, stakeholder expectations and business relevance.",
          },
        },

        [choices.priorities.materialPriorities]: {
          label: "Assess material impacts, risks and opportunities",

          text: `
Identify the company's main environmental, social and governance impacts, review stakeholder expectations and connect the results with business risks and opportunities.
            `.trim(),

          feedback: {
            title: "A strong strategic starting point",

            body: `
This approach creates a focused and evidence-based foundation for the ESG strategy. It allows the organisation to direct resources toward topics that are significant for both the business and its stakeholders.
              `.trim(),

            consequence:
              "The board can approve a manageable set of priorities linked with measurable business objectives.",

            takeaway:
              "Materiality helps an organisation determine which ESG topics require strategic attention.",
          },
        },

        [choices.priorities.broadCommitments]: {
          label: "Include every ESG topic immediately",

          text: `
Create an extensive strategy covering all environmental, social and governance topics so that no potential issue is omitted.
            `.trim(),

          feedback: {
            title: "The scope is too broad",

            body: `
A comprehensive ambition may appear positive, but attempting to address every topic at the same time can make the strategy unrealistic and difficult to implement.
              `.trim(),

            consequence:
              "The company may create commitments that it cannot resource, measure or deliver.",

            takeaway:
              "A credible strategy requires prioritisation rather than an unlimited list of commitments.",
          },
        },
      },
    },

    [challenges.financialPressure]: {
      title: "Managing ESG under financial pressure",

      shortTitle: "Manage financial pressure",

      context: `
The company is experiencing rising operating costs and uncertainty in several important markets.

The finance director is concerned that ESG investments will place additional pressure on the annual budget. At the same time, some customers are beginning to request environmental and social information from suppliers.

The management team must decide how to continue the ESG programme without ignoring the company's financial position.
        `.trim(),

      question: "How should the company respond to the financial pressure?",

      choices: {
        [choices.financialPressure.pauseEsgWork]: {
          label: "Pause the ESG programme",

          text: `
Suspend most ESG activities until the company's financial performance improves and customers make reporting a formal contractual requirement.
            `.trim(),

          feedback: {
            title: "Delaying action creates additional risk",

            body: `
Pausing all work may reduce immediate costs, but it also leaves the company unprepared for customer requirements, regulatory developments and operational risks.
              `.trim(),

            consequence:
              "The company may later face higher implementation costs and lose business opportunities.",

            takeaway:
              "Financial pressure should influence prioritisation, but it should not eliminate strategic preparation.",
          },
        },

        [choices.financialPressure.investInEverything]: {
          label: "Approve all proposed ESG investments",

          text: `
Proceed with every proposed sustainability project to demonstrate that ESG remains a strategic priority despite the current budget constraints.
            `.trim(),

          feedback: {
            title: "Commitment must remain financially credible",

            body: `
Approving every initiative without assessing cost, impact and feasibility may weaken management support and create financial strain.
              `.trim(),

            consequence:
              "Low-value projects may compete with investments that provide greater ESG and business benefits.",

            takeaway:
              "ESG investment decisions should be based on expected impact, risk reduction and business value.",
          },
        },

        [choices.financialPressure.phasedBusinessCase]: {
          label: "Create a phased ESG business case",

          text: `
Prioritise actions that reduce significant risks, meet customer expectations or generate operational benefits, and implement them through a phased investment plan.
            `.trim(),

          feedback: {
            title: "A balanced and implementable approach",

            body: `
A phased business case allows the organisation to continue its ESG transformation while respecting financial constraints. It also gives management a clear explanation of the expected costs and benefits.
              `.trim(),

            consequence:
              "The company can begin with high-priority actions and expand the programme as resources and data maturity improve.",

            takeaway:
              "ESG initiatives are more likely to gain support when they are connected with risk, efficiency and long-term value.",
          },
        },
      },
    },

    [challenges.peopleAndTeams]: {
      title: "Creating organisational ownership",

      shortTitle: "Engage people and teams",

      context: `
The board has approved the initial ESG priorities and investment plan.

The next challenge is implementation. Employees currently see ESG as the responsibility of a small sustainability team. Operational managers are unsure which actions and data belong to their departments.

The company needs an approach that turns the strategy into normal organisational practice.
        `.trim(),

      question: "How should NordForm Components organise responsibility for ESG implementation?",

      choices: {
        [choices.peopleAndTeams.sharedOwnership]: {
          label: "Assign cross-functional ownership",

          text: `
Define clear responsibilities for relevant departments, appoint accountable owners, provide employees with guidance and include ESG objectives in normal management processes.
            `.trim(),

          feedback: {
            title: "ESG becomes part of the organisation",

            body: `
Cross-functional ownership connects the strategy with operational decisions, data collection and employee responsibilities. A central ESG function can coordinate the work without becoming the sole owner.
              `.trim(),

            consequence:
              "Departments understand their roles and ESG implementation becomes integrated with existing processes.",

            takeaway:
              "Successful ESG implementation requires distributed responsibility supported by coordination and leadership.",
          },
        },

        [choices.peopleAndTeams.sustainabilityOnly]: {
          label: "Leave implementation to the ESG team",

          text: `
Give the sustainability team full responsibility for targets, data collection, reporting and communication so that other departments can focus on their existing duties.
            `.trim(),

          feedback: {
            title: "A central team cannot implement ESG alone",

            body: `
The ESG team can coordinate the programme, but it does not control all operational activities, employee practices, financial decisions or data sources.
              `.trim(),

            consequence:
              "The strategy may remain disconnected from everyday decisions and reliable data collection.",

            takeaway:
              "ESG coordination can be centralised, but implementation responsibilities must be shared.",
          },
        },

        [choices.peopleAndTeams.communicationOnly]: {
          label: "Run an internal awareness campaign",

          text: `
Launch a company-wide communication campaign explaining the ESG strategy and encourage employees to support it voluntarily.
            `.trim(),

          feedback: {
            title: "Awareness does not replace accountability",

            body: `
Communication is important, but employees also need clear responsibilities, practical procedures, resources and measurable objectives.
              `.trim(),

            consequence:
              "Employees may understand the strategy without knowing what they are expected to change in their work.",

            takeaway:
              "Engagement is strongest when awareness is combined with defined roles and operational support.",
          },
        },
      },
    },
  },

  summary: {
    title: "Scenario 2 completed",

    body: `
You helped NordForm Components move from a general ESG ambition to a focused and implementable organisational strategy.
      `.trim(),

    takeaways: [
      "ESG priorities should be based on material impacts, risks, opportunities and stakeholder expectations.",
      "Financial constraints should lead to prioritisation and phased implementation rather than complete inaction.",
      "A central ESG function should coordinate the strategy, while operational responsibility remains cross-functional.",
    ],
  },
});
