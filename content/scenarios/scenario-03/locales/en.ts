import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario03Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario03Ids;

export const scenario03En = defineScenarioLocale<"scenario-03">({
  scenarioId,
  locale: "en",

  title: "Navigating ESG Frameworks and EU Reporting Standards",

  shortTitle: "Reporting Standards",

  subtitle: "Mapping existing sustainability practice to EU stakeholder expectations",

  introduction: `
You are the sustainability and reporting lead at SONNENTOR, an Austrian organic food producer based in Sprögnitz (Lower Austria) that exports teas, spices and organic products to more than 40 countries. SONNENTOR already reports through the Gemeinwohl-Bilanz (Economy for the Common Good, GWÖ), a values-based framework in which the company scores well (755 out of 1,000) and which is externally audited on a two-year cycle.

Two urgent requests have now arrived at the same time. A key EU buyer, which is itself in scope of the Corporate Sustainability Reporting Directive (CSRD), asks SONNENTOR to provide ESRS-style ESG datapoints for its supplier assessment. In parallel, the company’s bank requests a concise, comparable ESG overview to inform a financing decision. Both stakeholders expect information that is comparable, evidence-based and consistent from year to year.

The problem is that GWÖ tells a rich story about values and stakeholder relationships, but it is not structured like the ESRS datapoints the buyer and bank are asking for. SONNENTOR’s ESG information is currently spread across purchasing, operations, HR and finance, mostly in spreadsheets, and the company has limited budget for new software or consultancy. Senior management is proud of the GWÖ approach and is worried that responding will create a heavy new reporting burden. You must decide which framework approach SONNENTOR should use to meet EU expectations, and design a practical data-collection process for a small set of priority indicators – so the company can respond quickly, keep the workload proportionate and avoid greenwashing risks.
    `.trim(),

  organisation: "SONNENTOR",

  role: "Sustainability and Reporting Lead",

  objectives: [
    "Choose appropriate ESG frameworks that align internal strategy with EU stakeholder expectations.",
    "Produce a data collection approach for priority ESG indicators to ensure quality and reduce greenwashing.",
  ],

  boardAlt:
    "Three connected ESG reporting situations showing framework selection, priority indicator selection and data governance for SONNENTOR.",

  challenges: {
    [challenges.frameworkSelection]: {
      title: "Choosing the right framework approach for EU stakeholders",

      shortTitle: "Choose the framework approach",

      context: `
The buyer’s questionnaire is written in ESRS terminology and the bank wants standardised figures it can compare with other borrowers. Neither stakeholder is familiar with the GWÖ matrix. Management values the GWÖ identity and is reluctant to take on a second full reporting system. Your first decision is how SONNENTOR should position its frameworks in response.
        `.trim(),

      question:
        "Which framework approach should SONNENTOR use to respond to the buyer and the bank?",

      choices: {
        [choices.frameworkSelection.layeredApproach]: {
          label: "Keep GWÖ and add a lightweight mapping layer to EU expectations",

          text: `
Keep GWÖ as the core internal framework for culture, governance and stakeholder logic, and add a lightweight “mapping layer” to EU expectations. Map the ESG content SONNENTOR already has onto the small set of ESRS-style datapoints the buyer actually needs, use the GHG Protocol as the technical method for emissions to ensure comparability, and add EU Taxonomy elements only if the bank or buyer explicitly requires them.
            `.trim(),

          feedback: {
            body: `
Correct. A layered approach speaks the EU stakeholders’ language while keeping SONNENTOR’s internal coherence. It reuses existing information instead of building a parallel system, reduces repeated questionnaires, improves comparability, and is proportionate for an SME with limited resources.
              `.trim(),
          },
        },

        [choices.frameworkSelection.gwoOnly]: {
          label: "Use GWÖ alone and decline ESRS-style datapoints",

          text: `
Reply that GWÖ is sufficient and decline to provide ESRS-style datapoints, on the grounds that SONNENTOR reports transparently already and is not itself directly in scope of the CSRD.
            `.trim(),

          feedback: {
            body: `
Buyers and banks generally cannot interpret GWÖ categories and will keep asking for ESRS-style datapoints regardless. Refusing to map leads to duplicated back-and-forth, slower responses, and a real risk of losing the contract or the financing.
              `.trim(),
          },
        },

        [choices.frameworkSelection.allFrameworks]: {
          label: "Adopt every major ESG framework at once",

          text: `
Adopt every major framework at once – ESRS, GRI, SASB and several additional ratings – so that SONNENTOR looks comprehensive and is ready for any request that might come.
            `.trim(),

          feedback: {
            body: `
Adopting every framework simultaneously overloads a small team. Conflicting definitions and too many datapoints cause data quality to drop and staff to disengage, which raises rather than lowers greenwashing risk.
              `.trim(),
          },
        },
      },
    },

    [challenges.priorityIndicators]: {
      title: "Selecting and justifying priority ESG indicators",

      shortTitle: "Select priority indicators",

      context: `
The buyer’s template lists dozens of possible datapoints. SONNENTOR cannot produce all of them credibly in the time available, and some (for example full value-chain emissions) are not yet well measured. You need to choose a small, defensible set of priority indicators and be able to justify the selection to both the buyer and the bank.
        `.trim(),

      question: "How should SONNENTOR select and justify its initial set of ESG indicators?",

      choices: {
        [choices.priorityIndicators.materialitySet]: {
          label: "Use materiality and stakeholder expectations to select a focused KPI set",

          text: `
Run a lightweight materiality and stakeholder-expectation check across the buyer, bank, consumers, employees and key suppliers, and select a small set of priority indicators that are material and linked to strategy (e.g. “Mission Null-Emission”, packaging, supply chain), comparable and clearly definable, and evidence-ready. An example set could be: Scope 1–2 emissions and energy consumption with a documented plan to improve Scope 3 data; packaging mix and plastic-reduction metric with method notes; share of suppliers with organic/sustainability verification; and people metrics such as health-and-safety incidents, training hours and turnover.
            `.trim(),

          feedback: {
            body: `
Correct. A materiality-informed, small KPI set with a documented rationale is defensible, meets EU stakeholder expectations, keeps the workload manageable and supports higher data quality.
              `.trim(),
          },
        },

        [choices.priorityIndicators.positiveOnly]: {
          label: "Report only the indicators that show the company in the best light",

          text: `
Report only the indicators that show SONNENTOR in the best light – for example the GWÖ categories already scoring 100% and the headline claim of around 400 tonnes of plastic saved – and leave out weaker areas such as Scope 3.
            `.trim(),

          feedback: {
            body: `
A marketing-first selection is quickly spotted by informed stakeholders, who notice the gaps (such as missing value-chain emissions or supplier risk). The picture looks selective and invites greenwashing suspicion.
              `.trim(),
          },
        },

        [choices.priorityIndicators.copyCorporate]: {
          label: "Copy a large corporation’s full KPI catalogue",

          text: `
Copy a large corporation’s full KPI catalogue so that SONNENTOR appears thorough and directly comparable with much bigger players.
            `.trim(),

          feedback: {
            body: `
A big-company KPI catalogue does not fit SME systems. Data collection becomes unrealistic, numbers turn out inconsistent from year to year, and staff become frustrated – undermining exactly the credibility the exercise is meant to build.
              `.trim(),
          },
        },
      },
    },

    [challenges.dataGovernance]: {
      title: "Operationalising data collection to ensure quality and reduce greenwashing",

      shortTitle: "Build credible data collection",

      context: `
You now have a priority set of indicators. The remaining task is to make the numbers credible and reproducible – the same figure should be defensible if a buyer, bank or auditor asks how it was produced – and to do this without a large software budget and without a once-a-year scramble.
        `.trim(),

      question:
        "How should SONNENTOR organise ESG data collection so that the figures are credible and reproducible?",

      choices: {
        [choices.dataGovernance.governedWorkflow]: {
          label: "Create a simple, governed and auditable ESG data process",

          text: `
Build a simple ESG data-governance system that produces repeatable, auditable outputs: a KPI dictionary for each indicator (definition, scope/boundary, unit, calculation method, frequency and what counts as evidence); one data owner per KPI across Operations/Logistics, Purchasing, HR and Finance/Controlling; a monthly or quarterly collection rhythm rather than annual panic reporting; minimum quality controls (documented sources such as invoices, meter data and supplier certificates, plausibility and outlier checks, and a sign-off step before external sharing); and data-quality tiers that label each datapoint as estimated, supplier-provided or verified, with a plan to upgrade over time – especially for Scope 3.
            `.trim(),

          feedback: {
            body: `
Correct. A KPI dictionary with clear owners, evidence, controls and quality tiers creates traceability, comparability and continuous improvement. Stakeholders can trust the numbers, and greenwashing risk falls because every figure can be reproduced.
              `.trim(),
          },
        },

        [choices.dataGovernance.annualExcel]: {
          label: "Pull the figures together once a year in a spreadsheet",

          text: `
Keep it simple by pulling the figures together once a year in a spreadsheet whenever a request comes in, without an evidence trail, since SONNENTOR is a small company and staff time is scarce.
            `.trim(),

          feedback: {
            body: `
An annual, Excel-only approach with no evidence trail produces low-credibility numbers that cannot be reproduced. Errors persist, results are inconsistent between years, and the company is exposed if a claim is challenged.
              `.trim(),
          },
        },

        [choices.dataGovernance.outsourceEverything]: {
          label: "Outsource ESG data completely to an external consultant",

          text: `
Outsource the whole task to an external consultant and treat ESG data as their responsibility, so that internal staff are not burdened with it.
            `.trim(),

          feedback: {
            body: `
Fully outsourcing without internal governance creates dependency and slow responses to buyers and banks. Consultants still need internal data, and the company loses the learning and long-term capability that the project is meant to build.
              `.trim(),
          },
        },
      },
    },
  },

  summary: {
    title: "You have built a proportionate EU-facing ESG reporting approach",

    takeaways: [
      "Existing sustainability frameworks can be retained internally while relevant information is mapped to the terminology and datapoints expected by external stakeholders.",
      "A small, material and evidence-ready KPI set is more credible than selective positive reporting or an oversized corporate catalogue.",
      "Clear definitions, data owners, evidence, quality controls and regular collection make ESG figures reproducible and reduce greenwashing risk.",
    ],
  },
});
