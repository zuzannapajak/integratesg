import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario05Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario05Ids;

export const scenario05En = defineScenarioLocale<"scenario-05">({
  scenarioId,
  locale: "en",

  title: "Implementation, Data and Cross-Functional Practice",

  shortTitle: "Cross-Functional Practice",

  subtitle: "Coordinating people, data and partnerships to turn ESG into shared practice",

  introduction: `
A medium-sized Bulgarian utility company is facing increasing regulatory pressure and stakeholder expectations related to ESG. The organisation already has some sustainability activities, including energy-efficiency measures and health and safety procedures, but these actions are fragmented and departments often assume that ESG is someone else's responsibility.

You have been asked to help the company organise cross-functional ownership, build a realistic data foundation and assess a proposed energy-efficiency partnership with a municipality. Your decisions must balance operational knowledge, reliable evidence, shared governance and long-term impact.
    `.trim(),

  organisation: "Bulgarian Utility Company",

  role: "ESG Implementation Lead",

  objectives: [
    "Apply systems and process thinking to embed ESG across different business functions.",
    "Build data literacy through a focused and relevant ESG measurement process.",
    "Structure external collaboration around clear roles, risks, governance and measurable outcomes.",
  ],

  boardAlt:
    "Three connected work areas showing a cross-functional ESG meeting, data analysis and a public-private partnership discussion at a utility company.",

  challenges: {
    [challenges.crossFunctionalOwnership]: {
      title: "Creating cross-functional ESG ownership",

      shortTitle: "Organise ESG ownership",

      context: `
Senior management wants to avoid confusion and duplicated effort. Operations understands environmental impacts, HR manages workforce and social matters, and finance is responsible for budgeting, compliance and reporting.

The company needs an internal structure that coordinates these perspectives while ensuring that ESG becomes part of normal business decisions rather than a separate reporting exercise.
        `.trim(),

      question: "How should the company organise responsibility for ESG?",

      choices: {
        [choices.crossFunctionalOwnership.workingGroup]: {
          label: "Create a management-coordinated cross-functional working group",

          text: `
Establish an ESG working group with representatives from operations, HR, finance and other relevant functions. Give each member defined responsibilities and coordinate the group at management level so that ESG objectives, actions, data and budgets remain aligned with business strategy.
            `.trim(),

          feedback: {
            title: "Shared ownership is combined with strategic coordination",

            body: `
This structure brings together the operational, social and financial knowledge needed for ESG implementation. It distributes responsibility without allowing individual initiatives to become disconnected or inconsistent.
              `.trim(),

            consequence:
              "Departments can integrate sustainability into everyday decisions while management maintains a coherent direction and reporting process.",

            takeaway:
              "ESG requires cross-functional ownership supported by clear coordination, accountability and strategic alignment.",
          },
        },

        [choices.crossFunctionalOwnership.financeOnly]: {
          label: "Assign ESG leadership to finance",

          text: `
Place ESG coordination entirely within the finance department because future disclosures and investor requirements are closely connected with compliance, budgeting and reporting systems.
            `.trim(),

          feedback: {
            title: "Reporting expertise is only one part of ESG implementation",

            body: `
Finance plays an important role in controls, investment decisions and disclosure, but it does not manage most environmental and social impacts. Limiting ownership to finance can turn ESG into a compliance exercise disconnected from operations and employees.
              `.trim(),

            consequence:
              "Operational changes may remain fragmented, and the company may report activity without achieving meaningful business transformation.",

            takeaway:
              "A coordinating function cannot replace the knowledge and accountability held across operational departments.",
          },
        },

        [choices.crossFunctionalOwnership.independentDepartments]: {
          label: "Let every department manage ESG independently",

          text: `
Ask each function to develop and manage its own sustainability activities so that teams remain flexible and central bureaucracy is kept to a minimum.
            `.trim(),

          feedback: {
            title: "Flexibility without coordination creates fragmentation",

            body: `
Departments may develop useful initiatives, but without shared goals, definitions and governance they are likely to duplicate effort, measure results differently and communicate inconsistent progress.
              `.trim(),

            consequence:
              "The organisation struggles to compare impact, allocate resources and present a credible overall ESG direction.",

            takeaway:
              "Decentralised action needs common objectives, data standards and coordination to become an integrated ESG process.",
          },
        },
      },
    },

    [challenges.dataFoundation]: {
      title: "Building the company's ESG data foundation",

      shortTitle: "Build data capability",

      context: `
Once responsibilities are clearer, the working group discovers that ESG information is incomplete and inconsistent. Energy consumption is tracked, but social and governance data is scattered across HR, safety, operational and financial systems.

Management is considering whether to begin with the information already available or wait until a dedicated ESG software solution can be purchased.
        `.trim(),

      question: "How should the company begin collecting and using ESG data?",

      choices: {
        [choices.dataFoundation.existingSources]: {
          label: "Start with existing sources and a focused indicator set",

          text: `
Use information already available in energy bills, HR records, safety reports and financial systems. Define a small set of relevant indicators, assign owners and review the data regularly so that employees learn how ESG performance is measured before the company invests in more advanced tools.
            `.trim(),

          feedback: {
            title: "The organisation learns while improving data reliability",

            body: `
Starting with manageable indicators allows teams to understand definitions, identify gaps and establish consistent routines. Technology can later support a process that the organisation already understands.
              `.trim(),

            consequence:
              "Data literacy and confidence improve, while early information becomes available for operational and strategic decisions.",

            takeaway:
              "Relevant and consistent data collected through a clear process is more valuable than a large technology investment made before the process is understood.",
          },
        },

        [choices.dataFoundation.multinationalBenchmark]: {
          label: "Replicate the systems of multinational ESG leaders",

          text: `
Benchmark leading international companies and immediately begin tracking dozens of indicators across every environmental, social and governance category.
            `.trim(),

          feedback: {
            title: "The measurement system exceeds current capacity",

            body: `
Large organisations usually have specialist teams, mature systems and broader reporting obligations. Copying their full indicator sets can overwhelm employees and reduce the quality of the information collected.
              `.trim(),

            consequence:
              "Teams spend more time completing templates, while inconsistent data weakens decision-making and trust in the ESG process.",

            takeaway:
              "Benchmarking can inspire improvement, but indicators must remain proportionate to material impacts and organisational maturity.",
          },
        },

        [choices.dataFoundation.communicationFirst]: {
          label: "Collect the data that is easiest to communicate",

          text: `
Prioritise indicators that already produce attractive results for external communication, even when other data would be more relevant to operational impact, risk or long-term decisions.
            `.trim(),

          feedback: {
            title: "Visibility is replacing decision relevance",

            body: `
Easy-to-present information may support short-term communication, but it can divert attention from material issues. This creates a reporting-driven ESG programme in which appearance matters more than operational improvement.
              `.trim(),

            consequence:
              "Management receives an incomplete view of performance and external claims may appear selective or superficial.",

            takeaway:
              "ESG data should first support material decisions and long-term impact, with communication built on that reliable foundation.",
          },
        },
      },
    },

    [challenges.partnershipGovernance]: {
      title: "Structuring an ESG-focused public-private partnership",

      shortTitle: "Structure the partnership",

      context: `
A municipality proposes a joint energy-efficiency project for public buildings. The initiative supports the utility company's ESG ambitions, but management is concerned about unclear responsibilities, financial exposure and reputational risk if the expected results are not achieved.

Before committing, the company must decide how to define governance, risks, incentives, stakeholder roles and measurable environmental and social outcomes.
        `.trim(),

      question: "How should the company prepare the proposed partnership?",

      choices: {
        [choices.partnershipGovernance.pppCanvas]: {
          label: "Use a Public-Private Partnership Canvas",

          text: `
Work with the municipality to map the purpose, stakeholder roles, responsibilities, financial and operational risks, incentives, decision-making process, accountability mechanisms and expected ESG outcomes before the project is approved.
            `.trim(),

          feedback: {
            title: "The collaboration is built on transparent shared governance",

            body: `
A structured partnership canvas makes assumptions visible and helps both parties agree how decisions, risks and benefits will be managed. It connects the project's ESG ambition with practical accountability and measurable outcomes.
              `.trim(),

            consequence:
              "Uncertainty is reduced, trust improves and the partners can evaluate progress against responsibilities agreed from the beginning.",

            takeaway:
              "Effective ESG partnerships require shared governance, clear risk allocation and measurable outcomes, not only a common intention.",
          },
        },

        [choices.partnershipGovernance.technologyOnly]: {
          label: "Participate only as a technology provider",

          text: `
Limit the company's role to supplying technical equipment and services, and avoid involvement in partnership governance or stakeholder coordination to reduce reputational exposure.
            `.trim(),

          feedback: {
            title: "A narrow role also limits influence and learning",

            body: `
Operational delivery is important, but the company's results still depend on decisions made across the partnership. Avoiding governance may reduce direct responsibility while leaving the company unable to shape risks, standards and outcomes that affect its reputation.
              `.trim(),

            consequence:
              "The company gains less stakeholder trust and has limited ability to correct problems or learn from the collaboration.",

            takeaway:
              "Participation in an ESG partnership should include an appropriate voice in the governance of shared risks and outcomes.",
          },
        },

        [choices.partnershipGovernance.visibilityFirst]: {
          label: "Prioritise branding and public visibility",

          text: `
Approve the partnership quickly because it offers strong communication and branding opportunities, and define detailed ESG objectives and accountability arrangements after the public launch.
            `.trim(),

          feedback: {
            title: "Publicity is preceding credible project design",

            body: `
Visibility may be valuable, but without measurable objectives and clear accountability the partnership can generate attention without delivering meaningful environmental or social improvement.
              `.trim(),

            consequence:
              "Unmet expectations may create financial disputes, stakeholder disappointment and accusations that the project is superficial.",

            takeaway:
              "Communication should reflect a well-governed partnership with defined outcomes, not substitute for one.",
          },
        },
      },
    },
  },

  summary: {
    title: "You have turned ESG into coordinated organisational practice",

    body: `
You helped the utility company create shared internal ownership, develop data capability through a focused process and structure an external collaboration around transparent governance and measurable ESG outcomes.
      `.trim(),

    takeaways: [
      "Cross-functional ESG groups combine operational, people and financial knowledge while maintaining shared goals and management coordination.",
      "A manageable set of relevant indicators and existing data sources can build literacy and reliability before advanced digital tools are introduced.",
      "Public-private ESG projects need clearly defined roles, risks, incentives, decision rights and measurable outcomes before communication begins.",
    ],
  },
});
