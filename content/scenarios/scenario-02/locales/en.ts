import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario02Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario02Ids;

export const scenario02En = defineScenarioLocale<"scenario-02">({
  scenarioId,
  locale: "en",

  title: "Strategy, Vision and Organisational Alignment",

  shortTitle: "Strategy & Alignment",

  subtitle: "Aligning ESG priorities, financial realities and organisational behaviour",

  introduction: `
You are the Strategy and Development Manager of a mid-sized manufacturing SME, NordForm Components, employing 140 people and supplying industrial parts to larger European clients. The company has recently faced growing pressure from customers, financial partners and employees to demonstrate a more credible and structured ESG approach. The board has agreed that ESG should become part of the company’s long-term direction. However, there is no shared understanding of what this means in practice. The Managing Director sees ESG as a strategic opportunity, the Finance Director is worried about margins and investment capacity, Operations is concerned about disruption and HR believes staff engagement is still too low for major change.

Your task is to help the company move from general intentions to a realistic ESG strategy that is connected to the company’s mission, reflected in day-to-day decisions and understood across departments. You will face three realistic challenges that test whether you can align strategy, operational realities and organisational culture.
    `.trim(),

  organisation: "NordForm Components",

  role: "Strategy and Development Manager",

  objectives: [
    "Formulate a cohesive ESG strategy that aligns an organization’s mission with sustainability objectives.",
    "Solve operational trade-offs between short-term finance and long-term ESG goals to support organisational alignment and cultural change.",
  ],

  boardAlt:
    "Three connected strategy situations showing ESG priority setting, financial trade-offs and the integration of ESG into organisational behaviour.",

  challenges: {
    [challenges.priorities]: {
      title: "Defining ESG priorities without losing strategic focus",

      shortTitle: "Define ESG priorities",

      context: `
At the quarterly strategy meeting, the board asks you to present the company’s ESG priorities for the next three years. One major client has requested evidence of ESG progress in the supply chain. At the same time, senior managers have very different views on what should be prioritised.

Sales wants bold public commitments to impress customers.

Operations wants to focus only on efficiency improvements already planned.

HR wants stronger action on employee wellbeing and inclusion.

Finance wants to avoid anything that looks expensive or hard to measure.

The company mission emphasizes quality, reliability and long-term partnerships, but no one has yet translated these values into ESG priorities.
        `.trim(),

      question:
        "How should NordForm Components define its ESG priorities for the next three years?",

      choices: {
        [choices.priorities.shortTermActions]: {
          label: "Choose highly visible short-term actions",

          text: `
Start with the ESG topics that are easiest to communicate externally and most visible to customers, assuming that credibility will follow once the company demonstrates momentum. Internal alignment and deeper strategic integration can be developed later.
            `.trim(),

          feedback: {
            body: `
This seems attractive because visible commitments can create quick external recognition. However, if the selected priorities are driven mainly by communication value, the company may overlook more material issues. Over time, this can create internal frustration, weak implementation and reputational risk if external promises are not supported by operational reality.
              `.trim(),
          },
        },

        [choices.priorities.materialPriorities]: {
          label: "Assess material impacts, risks and opportunities",

          text: `
Run a focused materiality and alignment process before finalising priorities. In practice, this means gathering input from internal and external stakeholders, identifying the ESG topics most relevant to the business model, customer expectations, workforce realities and long-term strategy, and then selecting a limited number of strategic priorities that clearly connect to the company’s mission. Translate these priorities into concrete objectives, responsibilities and measurable indicators.
            `.trim(),

          feedback: {
            body: `
This is the strongest option because it connects ESG strategy to the company’s mission and actual risk/opportunity profile, rather than to short-term visibility or convenience. It also increases ownership across departments and reduces the risk that ESG becomes a disconnected reporting exercise. In real life, this leads to more credible priorities, better decision-making and stronger stakeholder trust.
              `.trim(),
          },
        },

        [choices.priorities.broadCommitments]: {
          label: "Prioritise only the issues that are already easy to measure",

          text: `
Build the ESG strategy mainly around the issues the company can already measure well, because measurable indicators make it easier to show progress and gain management approval, even if some more material issues are postponed.
            `.trim(),

          feedback: {
            body: `
Choosing only what is already easy to measure sounds practical, but it can distort strategy. Important ESG topics are not always the easiest to quantify at the beginning. If measurement convenience drives prioritisation, the company may underinvest in strategically significant issues and create a false sense of progress.
              `.trim(),
          },
        },
      },
    },

    [challenges.financialPressure]: {
      title: "Responding to financial pressure without weakening ESG commitment",

      shortTitle: "Balance finance and ESG",

      context: `
Six months later, energy prices rise and one of the company’s largest customers delays payments. The Finance Director asks all departments to reduce discretionary spending. A planned ESG initiative package includes supplier engagement, internal training, and a resource-efficiency upgrade in production.

The leadership team agrees that ESG is important, but disagreement emerges around timing:

Finance argues that only initiatives with very fast payback should continue.

Operations supports the resource-efficiency upgrade but wants to delay supplier-related work.

Sales warns that slowing ESG progress could affect future tenders.

HR argues that postponing training sends the wrong signal internally.

You must recommend how the company should proceed.
        `.trim(),

      question:
        "How should the company respond to the financial pressure while protecting its ESG direction?",

      choices: {
        [choices.financialPressure.pauseEsgWork]: {
          label: "Keep only ESG actions with immediate financial returns",

          text: `
Temporarily narrow ESG efforts to initiatives with immediate financial returns, on the assumption that once profitability improves, broader ESG activities can be restored without significant strategic consequences.
            `.trim(),

          feedback: {
            body: `
This seems financially responsible, but it can weaken the strategic value of ESG by reducing it to short-term cost savings. Some ESG actions create value through risk reduction, client confidence, supplier readiness, or cultural change rather than immediate payback. If these are paused too easily, the company may save money now but lose resilience and competitiveness later.
              `.trim(),
          },
        },

        [choices.financialPressure.investInEverything]: {
          label: "Keep the full original ESG plan unchanged",

          text: `
Maintain the full ESG action plan exactly as originally designed in order to show consistency and avoid any appearance that the company’s sustainability commitment is weakening.
            `.trim(),

          feedback: {
            body: `
This option appears principled, yet it ignores operational constraints. Refusing to adjust plans under real financial pressure can create leadership resistance and reduce future support for ESG. If staff perceive ESG as inflexible or detached from business realities, it may damage rather than strengthen long-term organisational alignment.
              `.trim(),
          },
        },

        [choices.financialPressure.phasedBusinessCase]: {
          label: "Reassess and phase the plan using a business-case approach",

          text: `
Reassess the ESG action plan through a business-case and sequencing lens rather than treating it as an all-or-nothing decision. Protect the strategic direction, but phase implementation based on materiality, risk exposure, cost and expected value. Continue with actions that strengthen resilience or are important for customer and stakeholder confidence, while adjusting the timeline of lower-priority actions. Clearly explain why ESG remains part of the company’s strategy even if delivery is staged.
            `.trim(),

          feedback: {
            body: `
This is the most balanced response because it protects strategic intent while acknowledging financial reality. It shows that ESG integration is part of sound management, not a side project. In practice, this approach helps maintain credibility, preserves momentum and allows leadership to make disciplined trade-offs rather than reactive cuts.
              `.trim(),
          },
        },
      },
    },

    [challenges.peopleAndTeams]: {
      title: "Turning ESG strategy into organisational behaviour",

      shortTitle: "Embed ESG in behaviour",

      context: `
One year after the ESG strategy is approved, the company has published its priorities and introduced several policies. However, implementation is uneven.

Team leaders are not consistently discussing ESG in operational meetings.

Employees describe ESG as “mainly for management and reporting.”

Some departments are engaged, while others see little connection to their daily work.

The board is asking why cultural change is slower than expected.

You are asked to recommend the next step to improve organisational alignment.
        `.trim(),

      question:
        "What should the company do next to turn its ESG strategy into everyday organisational behaviour?",

      choices: {
        [choices.peopleAndTeams.sharedOwnership]: {
          label: "Translate ESG priorities into roles, routines and behaviours",

          text: `
Shift from policy-based implementation to behaviour-based integration. Connect ESG priorities to specific departmental responsibilities, management routines, team discussions and performance expectations. Provide practical training linked to job roles, equip middle managers to translate strategy into everyday decisions, and create feedback mechanisms so employees can see how ESG affects operations and how their input matters.
            `.trim(),

          feedback: {
            body: `
This is the strongest option because organisational alignment happens when people understand what strategy means for their own role and routines. ESG becomes credible only when it influences decisions, habits, incentives and conversations across the company. In real life, this approach leads to deeper ownership, stronger implementation and a more authentic cultural shift.
              `.trim(),
          },
        },

        [choices.peopleAndTeams.sustainabilityOnly]: {
          label: "Add more ESG policies, templates and management controls",

          text: `
Focus first on strengthening formal governance by adding more ESG policies, reporting templates and management controls, assuming that clearer formalisation will gradually produce the desired cultural shift.
            `.trim(),

          feedback: {
            body: `
Better governance can help, but policy expansion alone rarely changes behaviour. If staff experience ESG mainly through extra forms or reporting tasks, they may see it as bureaucracy rather than strategic direction. This can create compliance without commitment.
              `.trim(),
          },
        },

        [choices.peopleAndTeams.communicationOnly]: {
          label: "Rely mainly on leadership communication campaigns",

          text: `
Rely on visible leadership communication campaigns to reinforce the ESG vision, assuming that if the message is repeated often enough, departments will naturally translate it into day-to-day practice.
            `.trim(),

          feedback: {
            body: `
Communication from leadership is necessary, but not sufficient. Without role-specific translation and managerial follow-through, repeated messaging can remain abstract. Employees may support the idea of ESG in principle while still not knowing how to act differently in practice.
              `.trim(),
          },
        },
      },
    },
  },

  summary: {
    title: "You have aligned ESG strategy with organisational practice",

    takeaways: [
      "ESG priorities should be selected through materiality and alignment with the organisation’s mission, stakeholders and long-term strategy.",
      "Financial pressure calls for disciplined sequencing and business-case decisions rather than abandoning ESG or protecting every action unchanged.",
      "Organisational alignment grows when ESG is translated into specific roles, routines, decisions, incentives and feedback mechanisms.",
    ],
  },
});
