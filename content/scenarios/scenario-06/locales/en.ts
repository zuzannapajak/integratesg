import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario06Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario06Ids;

export const scenario06En = defineScenarioLocale<"scenario-06">({
  scenarioId,
  locale: "en",

  title: "Monitoring, Reporting and Future Trends of ESG",

  shortTitle: "Monitoring & Reporting",

  subtitle: "Choosing useful KPIs, improving data quality and tailoring ESG reporting",

  introduction: `
A small-sized company is beginning to monitor and report its ESG performance. It must decide which KPIs to track, how to make fragmented data comparable and how to communicate results to stakeholders with different information needs.

Your task is to create a practical monitoring and reporting approach that gives the company useful indicators, reliable data and transparent communication without creating unnecessary complexity.
    `.trim(),

  objectives: [
    "Select specific ESG indicators and KPIs to monitor performance across primary business activities.",
    "Categorize ESG data to generate clear reports tailored to the needs of different stakeholders.",
  ],

  boardAlt:
    "Three connected ESG monitoring and reporting situations showing KPI selection, data quality and tailored stakeholder communication.",

  challenges: {
    [challenges.kpiSelection]: {
      title: "Too Many KPIs, Too Little Value",

      shortTitle: "Select useful KPIs",

      context: `
A small-sized company wants to start monitoring its ESG performance. Each department suggests its own indicators, and the result is a list of 40 different KPIs. The company quickly realizes that tracking all of them is unrealistic and confusing.
        `.trim(),

      question: "How should the company define its initial set of ESG KPIs?",

      choices: {
        [choices.kpiSelection.coreKpis]: {
          label: "Select a focused set of core KPIs",

          text: `
Select 6–10 core KPIs linked to the company’s main activities and key ESG risks or opportunities (Environmental, Social, Governance).

For each KPI clearly define:
- what it measures
- the calculation method
- how often it is measured
- who is responsible
- where the data comes from
- the target or threshold.

Link each KPI to a business decision (e.g., investments, training, supplier selection, maintenance).

Start with a baseline measurement period (3–6 months), and add more advanced KPIs only once the data collection process becomes stable.
            `.trim(),

          feedback: {
            body: `
A small number of strong KPIs leads to consistent reports, continuous monitoring, and faster decision-making.
              `.trim(),
          },
        },

        [choices.kpiSelection.measureEverything]: {
          label: "Measure everything immediately to look more credible",

          text: `
“Let’s measure everything immediately to look more credible.” This often leads to incomplete or inconsistent data, higher costs, and low trust inside the organization.
            `.trim(),

          feedback: {
            body: `
High risk of errors and uncontrolled numbers. Time is wasted and the company may face accusations of greenwashing if data cannot be verified.
              `.trim(),
          },
        },

        [choices.kpiSelection.copyCorporate]: {
          label: "Copy the KPIs used by large corporations",

          text: `
“Let’s copy the KPIs used by large corporations.” Large companies have more resources and complex systems. Their indicators may be too difficult for an SME to collect or manage, making reporting ineffective.
            `.trim(),

          feedback: {
            body: `
Creates unnecessary bureaucracy. Departments stop using the indicators after a few months.
              `.trim(),
          },
        },
      },
    },

    [challenges.dataQuality]: {
      title: "Data That Doesn’t Match",

      shortTitle: "Improve data quality",

      context: `
Energy and waste data come from different suppliers and formats. The HR and procurement departments use separate spreadsheets, and there is no single reliable source of information.

As a result, the company struggles to compare or combine the data.
        `.trim(),

      question: "How should the company make its ESG data comparable and reliable?",

      choices: {
        [choices.dataQuality.dataModelAndGovernance]: {
          label: "Define a simple ESG data model and quality process",

          text: `
Define a simple ESG data model, including:
- data categories (Environmental, Social, Governance)
- units of measurement
- level of detail (site, department, supplier)
- validation rules.

Introduce a data quality process:
- checks for completeness and consistency
- identification of unusual values (outliers)
- version control and traceability.

Establish:
- a data collection schedule
- data owners responsible for each area
- a shared data dictionary explaining each indicator.
            `.trim(),

          feedback: {
            body: `
Comparable and reliable data improves reporting credibility and reduces last-minute corrections.
              `.trim(),
          },
        },

        [choices.dataQuality.singleExcel]: {
          label: "Put everything into one Excel file",

          text: `
“Let’s just put everything into one Excel file.” Without clear definitions and controls, inconsistencies remain and often increase. The same metric may end up showing different values in different places.
            `.trim(),

          feedback: {
            body: `
Recurring inconsistencies. Reports are questioned and a lot of time is wasted reconciling numbers.
              `.trim(),
          },
        },

        [choices.dataQuality.waitForSoftware]: {
          label: "Wait until the company buys the perfect ESG software",

          text: `
“Let’s wait until we buy the perfect ESG software.” Waiting delays monitoring and prevents the company from building a useful baseline and data culture.
            `.trim(),

          feedback: {
            body: `
Delays ESG monitoring. The company cannot demonstrate progress or learning.
              `.trim(),
          },
        },
      },
    },

    [challenges.stakeholderReporting]: {
      title: "One Report for Everyone?",

      shortTitle: "Tailor ESG reporting",

      context: `
Different stakeholders want different types of ESG information:
- Management wants a short report to support decisions.
- Banks and partners request detailed information and data.
- The local community wants clear and simple explanations.
- Marketing prefers strong positive messages.
        `.trim(),

      question: "How should the company organise its ESG reporting and communication?",

      choices: {
        [choices.stakeholderReporting.tailoredReporting]: {
          label: "Create three connected levels of ESG communication",

          text: `
Create three levels of communication:

1. Internal dashboard (for decision-making)
- about 10 KPIs
- trends over time
- alerts and corrective actions

2. Technical stakeholder report
- methodology and data scope
- definitions of indicators
- data sources and limitations
- supporting evidence

3. Public summary
- clear messages about results
- transparency about what is still unknown
- improvement plans.

Always include:
- KPI definitions
- reporting boundaries
- data frequency
- responsible teams.

This transparency helps reduce the risk of greenwashing accusations.
            `.trim(),

          feedback: {
            body: `
Tailored communication increases trust and usefulness for both internal and external stakeholders.
              `.trim(),
          },
        },

        [choices.stakeholderReporting.singleReport]: {
          label: "Create one report for everyone",

          text: `
“Let’s create one report for everyone.” The report becomes either too technical for general readers or too superficial for experts.
            `.trim(),

          feedback: {
            body: `
Stakeholders remain unsatisfied and require additional explanations.
              `.trim(),
          },
        },

        [choices.stakeholderReporting.positiveOnly]: {
          label: "Communicate only positive results",

          text: `
“Let’s only communicate positive results.” Hiding problems can damage credibility if issues later become visible.
            `.trim(),

          feedback: {
            body: `
High risk of reputational backlash and accusations of greenwashing.
              `.trim(),
          },
        },
      },
    },
  },

  summary: {
    title: "You have built a practical ESG monitoring and reporting approach",

    takeaways: [
      "A focused set of well-defined KPIs is easier to monitor consistently and use in business decisions than an oversized indicator catalogue.",
      "Comparable ESG data requires shared definitions, validation rules, traceability, data owners and a regular collection process.",
      "Reporting should be tailored to stakeholder needs while keeping the underlying definitions, evidence and boundaries consistent and transparent.",
    ],
  },
});
