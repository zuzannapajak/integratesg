import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario03Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario03Ids;

export const scenario03En = defineScenarioLocale<"scenario-03">({
  scenarioId,
  locale: "en",

  title: "Navigating ESG Frameworks and EU Reporting Standards",

  shortTitle: "Reporting Standards",

  subtitle: "Selecting the right framework approach and operationalising it through credible data",

  introduction: `
You support SONNENTOR in preparing ESG information for two urgent stakeholder requests. A key EU buyer that reports under the CSRD asks for ESRS-style datapoints as part of its supplier assessment. At the same time, the company's bank requests a concise ESG overview to support financing decisions.

SONNENTOR already uses the Gemeinwohl-Bilanz, also known as the Common Good Report, and has many sustainability practices in place. The new information must nevertheless be comparable, evidence-based and consistent across years. Your task is to select a proportionate framework approach, identify priority indicators and create a practical data-governance process that reduces reporting burden and greenwashing risk.
    `.trim(),

  organisation: "SONNENTOR",

  role: "ESG Reporting Advisor",

  objectives: [
    "Choose ESG frameworks that align the organisation's internal strategy with EU stakeholder expectations.",
    "Select a manageable set of priority ESG indicators using materiality and stakeholder needs.",
    "Design a repeatable data collection and quality-control process that supports credible reporting.",
  ],

  boardAlt:
    "Three connected ESG reporting work areas showing framework selection, indicator analysis and data quality controls for an Austrian company.",

  challenges: {
    [challenges.frameworkSelection]: {
      title: "Selecting frameworks for EU stakeholder expectations",

      shortTitle: "Select the framework approach",

      context: `
A major EU buyer asks SONNENTOR for ESRS-style data to support its supplier evaluation. The company already prepares a Gemeinwohl-Bilanz that reflects its culture, governance and stakeholder approach.

The reporting team must decide whether the existing framework is sufficient, whether every major ESG framework should be adopted, or whether the company should connect its current system with the specific language and methods expected by external stakeholders.
        `.trim(),

      question: "Which framework approach should SONNENTOR use?",

      choices: {
        [choices.frameworkSelection.layeredApproach]: {
          label: "Use a layered and proportionate framework approach",

          text: `
Keep the Gemeinwohl-Bilanz as the internal core, map relevant content to the ESRS-style datapoints requested by the buyer, use a recognised technical method such as the GHG Protocol for emissions, and add EU Taxonomy information only when a customer or financier requires it.
            `.trim(),

          feedback: {
            title: "Internal coherence and external comparability are both preserved",

            body: `
This approach allows SONNENTOR to retain a framework that supports its organisational culture while translating relevant information into the language expected by EU buyers and banks. Technical methods improve the comparability of individual datapoints without creating unnecessary reporting layers.
              `.trim(),

            consequence:
              "The company can respond faster to stakeholder requests, reduce duplicated questionnaires and maintain a manageable reporting process.",

            takeaway:
              "A layered framework approach can combine an organisation's internal sustainability model with targeted external reporting requirements.",
          },
        },

        [choices.frameworkSelection.gwoOnly]: {
          label: "Use only the existing Common Good Report",

          text: `
Provide the Gemeinwohl-Bilanz as the complete response and decline to map its content to ESRS-style datapoints because the company already has a recognised sustainability framework.
            `.trim(),

          feedback: {
            title: "The existing framework may not answer the stakeholder's question",

            body: `
The Common Good Report contains valuable information, but buyers and banks may not understand its categories or be able to transfer them directly into their own reporting systems. They are likely to request the missing datapoints again.
              `.trim(),

            consequence:
              "Responses become slower and more repetitive, and the company may face higher transaction costs or lose market opportunities.",

            takeaway:
              "A strong internal framework still needs a clear mapping to the terminology and datapoints required by external stakeholders.",
          },
        },

        [choices.frameworkSelection.allFrameworks]: {
          label: "Adopt every major ESG framework",

          text: `
Implement ESRS, GRI, SASB, the EU Taxonomy and several external ESG ratings at the same time so that the company can answer every possible stakeholder request.
            `.trim(),

          feedback: {
            title: "More frameworks do not automatically create better reporting",

            body: `
Simultaneous implementation of multiple systems can overwhelm the organisation, introduce conflicting definitions and weaken data quality. The additional workload can make reporting less consistent rather than more credible.
              `.trim(),

            consequence:
              "Employees disengage, numbers become difficult to reproduce and the risk of inaccurate or greenwashing-prone claims increases.",

            takeaway:
              "Frameworks should be selected according to material stakeholder needs and organisational capacity, not accumulated without a clear purpose.",
          },
        },
      },
    },

    [challenges.priorityIndicators]: {
      title: "Selecting and justifying priority ESG indicators",

      shortTitle: "Choose priority indicators",

      context: `
The buyer and the bank both need ESG information, but SONNENTOR cannot collect every possible indicator at once.

The company must choose a small set of datapoints that reflects material impacts and risks, supports its strategy and can be defined and evidenced consistently. Relevant areas may include emissions and energy, packaging and materials, supply-chain practices, health and safety, training and employee turnover.
        `.trim(),

      question: "How should SONNENTOR select its priority ESG indicators?",

      choices: {
        [choices.priorityIndicators.materialitySet]: {
          label: "Select a material and evidence-ready indicator set",

          text: `
Run a lightweight materiality and stakeholder expectation check involving the buyer, bank, consumers, employees and key suppliers. Choose a small set of indicators that is strategically relevant, clearly defined, comparable and supported by accessible evidence, and document why each indicator was selected.
            `.trim(),

          feedback: {
            title: "The indicator set is defensible and manageable",

            body: `
This method connects reporting choices with actual impacts, risks and stakeholder needs. Clear definitions and available evidence make the selected indicators more reliable and easier to improve over time.
              `.trim(),

            consequence:
              "SONNENTOR can meet priority EU stakeholder expectations without creating reporting overload or sacrificing data quality.",

            takeaway:
              "A small, material and documented KPI set is more credible than a long catalogue of indicators with weak relevance or evidence.",
          },
        },

        [choices.priorityIndicators.positiveOnly]: {
          label: "Choose indicators that tell the best story",

          text: `
Prioritise datapoints that already show strong performance and can be communicated positively, while postponing more difficult areas such as value-chain emissions or supplier risk.
            `.trim(),

          feedback: {
            title: "Marketing value is not a materiality assessment",

            body: `
Stakeholders are likely to notice significant omissions, especially where the missing topics relate directly to supply-chain or financing risk. Selective reporting can make otherwise positive claims appear incomplete.
              `.trim(),

            consequence:
              "The company may face stakeholder pushback, failed supplier assessments and increased suspicion of greenwashing.",

            takeaway:
              "Priority indicators should reflect material impacts and risks, including areas where performance is still developing.",
          },
        },

        [choices.priorityIndicators.copyCorporate]: {
          label: "Copy a large corporation's KPI catalogue",

          text: `
Use the full indicator set published by a large multinational company so that SONNENTOR's reporting appears equally comprehensive and professional.
            `.trim(),

          feedback: {
            title: "The indicator set does not match the organisation",

            body: `
Large corporations usually have more complex operations, specialist teams and mature systems. Their KPI catalogue may include datapoints that are not relevant or realistically collectable for SONNENTOR.
              `.trim(),

            consequence:
              "Reporting effort increases, data becomes inconsistent and employees lose confidence in a process they cannot sustain.",

            takeaway:
              "Indicators must fit the organisation's material topics, operating model and current data capacity.",
          },
        },
      },
    },

    [challenges.dataGovernance]: {
      title: "Operationalising data collection and quality control",

      shortTitle: "Build credible data governance",

      context: `
After selecting priority indicators, SONNENTOR needs a collection process that produces comparable and auditable information every reporting period.

The required data comes from several functions, including operations, logistics, purchasing, HR and finance. Without common definitions, clear ownership and evidence controls, the same indicator may be calculated differently or become impossible to reproduce.
        `.trim(),

      question: "How should the company organise ESG data collection and quality control?",

      choices: {
        [choices.dataGovernance.governedWorkflow]: {
          label: "Create a simple, repeatable ESG data-governance system",

          text: `
Prepare a KPI dictionary covering definitions, boundaries, units, calculation methods, frequency and acceptable evidence. Assign one owner per indicator, establish a monthly or quarterly workflow, retain source documents and version history, perform plausibility checks and require sign-off before external disclosure. Label data quality as estimated, supplier-provided or verified and plan improvements over time.
            `.trim(),

          feedback: {
            title: "The data becomes traceable and capable of improvement",

            body: `
This system creates consistent responsibilities and a clear evidence trail without requiring an overly complex platform. Quality levels make current limitations transparent while supporting gradual upgrades, particularly for value-chain data.
              `.trim(),

            consequence:
              "Reports can be reproduced, compared across periods and shared with buyers and banks with greater confidence.",

            takeaway:
              "Credible ESG reporting depends on definitions, ownership, evidence, controls and transparent data-quality levels.",
          },
        },

        [choices.dataGovernance.annualExcel]: {
          label: "Compile one spreadsheet at year end",

          text: `
Ask each department to submit figures once a year, combine them in a central spreadsheet and rely on the final numbers without maintaining detailed source evidence or regular controls.
            `.trim(),

          feedback: {
            title: "A spreadsheet alone does not provide governance",

            body: `
Annual collection makes it difficult to identify errors early, understand changing definitions or reconstruct how a figure was produced. Without evidence and version control, the resulting datapoints may not withstand external review.
              `.trim(),

            consequence:
              "Error rates and last-minute corrections increase, while stakeholders may reject information that cannot be reproduced.",

            takeaway:
              "The tool used to store data is less important than the regular process, controls and evidence surrounding it.",
          },
        },

        [choices.dataGovernance.outsourceEverything]: {
          label: "Outsource the entire process",

          text: `
Hire an external consultant to collect, calculate and report all ESG information so that internal teams do not need to develop their own data responsibilities.
            `.trim(),

          feedback: {
            title: "External support cannot replace internal ownership",

            body: `
Consultants still depend on operational information held inside the company. Without internal data owners and routines, requests are delayed, evidence is incomplete and the organisation does not build lasting reporting capability.
              `.trim(),

            consequence:
              "SONNENTOR becomes dependent on external support and remains slow when buyers or banks request new information.",

            takeaway:
              "Specialists can support ESG reporting, but accountability and data knowledge must remain embedded in the organisation.",
          },
        },
      },
    },
  },

  summary: {
    title: "You have built a proportionate and credible reporting approach",

    body: `
You helped SONNENTOR connect its existing sustainability system with EU stakeholder expectations, select defensible priority indicators and establish a repeatable process for producing evidence-based ESG information.
      `.trim(),

    takeaways: [
      "A layered framework approach preserves internal coherence while mapping relevant information to the terminology and datapoints expected by buyers and financiers.",
      "Priority indicators should be material, clearly defined, evidence-ready and proportionate to the organisation's reporting capacity.",
      "Data dictionaries, ownership, regular workflows, evidence controls and transparent quality levels reduce errors and greenwashing risk.",
    ],
  },
});
