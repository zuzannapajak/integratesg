import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario05Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario05Ids;

export const scenario05En = defineScenarioLocale<"scenario-05">({
  scenarioId,
  locale: "en",

  title: "Implementation, Data and Cross-Functional Practice",

  shortTitle: "Cross-Functional Practice",

  subtitle: "Embedding ESG into organisational structures, data practice and partnerships",

  introduction: `
You are the newly appointed ESG/Sustainability Coordinator at BalkanUtil EAD, a medium-sized Bulgarian utility company providing water and energy-related services to municipal and industrial clients across three regions. Increasing regulatory pressure and stakeholder expectations have pushed ESG onto senior management's agenda. Some sustainability-related practices already exist – such as energy efficiency measures and health and safety procedures – but they are uncoordinated, and different departments assume ESG is “someone else's responsibility.”

Data on environmental, social and governance performance is scattered across systems, and the company has limited budget for new technology or external consultancy. Senior management wants a practical way to organise ESG internally, build a credible data foundation, and evaluate emerging partnership opportunities – without turning ESG into an additional reporting burden disconnected from daily operations.
    `.trim(),

  organisation: "BalkanUtil EAD",

  role: "ESG/Sustainability Coordinator",

  objectives: [
    "Apply systems and process thinking to embed ESG across different business functions.",
    "Make informed ESG-related decisions using data, stakeholder input, and long-term impact considerations.",
  ],

  boardAlt:
    "Three connected situations showing cross-functional ESG responsibility, practical ESG data collection and a public-private energy-efficiency partnership.",

  challenges: {
    [challenges.crossFunctionalOwnership]: {
      title: "Organising ESG responsibility internally",

      shortTitle: "Organise ESG responsibility",

      context: `
ESG has started appearing more frequently in senior management discussions, driven by regulatory pressure and stakeholder expectations. Some sustainability-related actions already exist, such as energy efficiency measures and health and safety procedures, but they are not coordinated, and different departments assume ESG is someone else's responsibility. Senior management asks how ESG should be organised internally to avoid confusion and duplication of effort.
        `.trim(),

      question: "How should BalkanUtil EAD organise ESG responsibility internally?",

      choices: {
        [choices.crossFunctionalOwnership.workingGroup]: {
          label: "Create a management-coordinated cross-functional ESG working group",

          text: `
Establish a cross-functional ESG working group coordinated at management level, including representatives from key functions such as operations, human resources and finance. Each function brings a different perspective: operations understand environmental impacts, HR manages social aspects, and finance links ESG to budgeting and reporting. Coordinating ESG in this way ensures that sustainability considerations are embedded into everyday decisions and aligned with business strategy rather than treated as isolated initiatives.
            `.trim(),

          feedback: {
            body: `
Correct. This approach creates shared ownership while maintaining coordination and strategic alignment. ESG requires operational integration across departments, not only financial reporting expertise.
              `.trim(),
          },
        },

        [choices.crossFunctionalOwnership.financeOnly]: {
          label: "Assign ESG coordination to the finance department",

          text: `
Assign ESG coordination to the finance department, because ESG reporting is expected to become a regulatory and investor requirement, and finance already manages compliance and reporting systems.
            `.trim(),

          feedback: {
            body: `
While finance plays an important role in ESG disclosure, limiting ESG leadership to compliance risks turning sustainability into a reporting exercise rather than a business transformation process.
              `.trim(),
          },
        },

        [choices.crossFunctionalOwnership.independentDepartments]: {
          label: "Let each department manage ESG independently",

          text: `
Decide that each department should manage its own ESG activities independently, in order to encourage flexibility and reduce bureaucracy.
            `.trim(),

          feedback: {
            body: `
Fully decentralised ESG management may appear flexible, but without coordination organisations struggle to align goals, measure impact consistently, and communicate progress credibly.
              `.trim(),
          },
        },
      },
    },

    [challenges.dataFoundation]: {
      title: "Building a practical ESG data foundation",

      shortTitle: "Build the ESG data foundation",

      context: `
Once ESG responsibilities are clarified, the company realises that its ESG data is inconsistent and incomplete. Energy consumption is tracked reasonably well, but social and governance data are scattered across different systems. Management debates whether to begin ESG data collection immediately using existing sources, or wait until a dedicated ESG software solution is purchased.
        `.trim(),

      question: "How should BalkanUtil EAD begin building its ESG data foundation?",

      choices: {
        [choices.dataFoundation.existingSources]: {
          label: "Start with existing sources and a focused indicator set",

          text: `
Start collecting ESG data using existing sources such as energy bills, HR records, safety reports, and financial data. Define a small number of clear indicators and review them regularly. This builds internal data literacy and helps employees understand how ESG performance is measured before investing in more advanced digital tools.
            `.trim(),

          feedback: {
            body: `
Correct. This approach focuses on relevance, consistency, and learning rather than volume. Beginning with a manageable set of indicators helps organisations build internal understanding and data reliability over time.
              `.trim(),
          },
        },

        [choices.dataFoundation.multinationalBenchmark]: {
          label: "Immediately copy the indicator systems of multinational ESG leaders",

          text: `
Benchmark the company against large multinational ESG leaders and immediately attempt to track dozens of indicators across all ESG categories.
            `.trim(),

          feedback: {
            body: `
Attempting to replicate complex multinational ESG systems too early often overwhelms teams and reduces data quality.
              `.trim(),
          },
        },

        [choices.dataFoundation.communicationFirst]: {
          label: "Collect first the ESG data that is easiest to communicate externally",

          text: `
Prioritise collecting ESG data that is easiest to communicate externally, rather than data that is most relevant to operational impact and decision-making.
            `.trim(),

          feedback: {
            body: `
Focusing mainly on externally attractive indicators risks creating a communication-driven ESG approach, where reporting visibility becomes more important than operational improvement and long-term impact.
              `.trim(),
          },
        },
      },
    },

    [challenges.partnershipGovernance]: {
      title: "Structuring an ESG partnership with a municipality",

      shortTitle: "Structure the partnership",

      context: `
The company is approached by a municipality proposing a joint energy-efficiency project for public buildings. The initiative aligns well with the company's ESG ambitions, but management is concerned about unclear responsibilities, financial risks, and reputational exposure if results are not achieved.
        `.trim(),

      question: "How should the company structure the proposed partnership with the municipality?",

      choices: {
        [choices.partnershipGovernance.pppCanvas]: {
          label: "Use a Public–Private Partnership Canvas",

          text: `
Use a Public–Private Partnership (PPP) Canvas to structure the collaboration. This tool helps clarify roles, responsibilities, risks, incentives, governance mechanisms, and expected ESG outcomes for both parties before committing. A structured approach reduces uncertainty and builds trust.
            `.trim(),

          feedback: {
            body: `
Correct. Effective ESG collaboration depends on shared governance, transparency, and clearly defined outcomes.
              `.trim(),
          },
        },

        [choices.partnershipGovernance.technologyOnly]: {
          label: "Participate only as a technology provider",

          text: `
Agree to participate in the partnership only as a technology provider, avoiding involvement in governance or stakeholder coordination in order to minimise reputational exposure.
            `.trim(),

          feedback: {
            body: `
Participating only at operational level may reduce short-term risk, but it limits influence, learning opportunities, and stakeholder trust.
              `.trim(),
          },
        },

        [choices.partnershipGovernance.visibilityFirst]: {
          label: "Prioritise short-term visibility and branding",

          text: `
Prioritise short-term visibility and branding opportunities from the partnership over establishing measurable ESG objectives and accountability mechanisms.
            `.trim(),

          feedback: {
            body: `
Focusing primarily on visibility rather than measurable outcomes increases the risk of superficial ESG partnerships that generate publicity without delivering meaningful environmental or social impact.
              `.trim(),
          },
        },
      },
    },
  },

  summary: {
    title: "You have embedded ESG into organisational practice and collaboration",

    takeaways: [
      "Cross-functional ESG ownership combines operational knowledge with management-level coordination and strategic alignment.",
      "A small set of relevant indicators built from existing data sources creates a stronger foundation than an oversized measurement system.",
      "ESG partnerships need clear roles, shared governance, transparent risk allocation and measurable outcomes before public visibility.",
    ],
  },
});
