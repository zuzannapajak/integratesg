import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario06Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario06Ids;

export const scenario06En = defineScenarioLocale<"scenario-06">({
  scenarioId,
  locale: "en",

  title: "Monitoring, Reporting and Future Trends of ESG",

  shortTitle: "Monitoring & Reporting",

  subtitle: "Selecting useful KPIs, improving data quality and communicating results credibly",

  introduction: `
A small company wants to begin monitoring its ESG performance, but its first attempts reveal three common problems. Departments propose too many indicators, information is stored in incompatible formats and stakeholders expect very different levels of detail.

You have been asked to design a practical monitoring and reporting approach. Your task is to select a focused set of decision-relevant KPIs, establish consistent data definitions and controls, and prepare communication that is useful and transparent for management, technical stakeholders and the wider public.
    `.trim(),

  role: "ESG Monitoring and Reporting Coordinator",

  objectives: [
    "Select specific ESG indicators and KPIs that support monitoring across primary business activities.",
    "Create consistent definitions, ownership and quality controls for ESG data.",
    "Categorise and present ESG information according to the needs of different stakeholders.",
  ],

  boardAlt:
    "Three connected reporting work areas showing KPI selection, ESG data governance and tailored dashboards and reports for different stakeholders.",

  challenges: {
    [challenges.kpiSelection]: {
      title: "Too many KPIs, too little value",

      shortTitle: "Select useful KPIs",

      context: `
Every department proposes its own ESG indicators, creating a list of forty different KPIs. The company quickly realises that tracking all of them would be costly, confusing and difficult to maintain.

Management needs a smaller set that reflects the company's main activities and significant environmental, social and governance risks or opportunities, while still providing enough information for decisions and future improvement.
        `.trim(),

      question: "How should the company define its initial ESG KPI set?",

      choices: {
        [choices.kpiSelection.coreKpis]: {
          label: "Select a focused set of core KPIs",

          text: `
Choose approximately six to ten KPIs linked to the company's main activities and material ESG risks or opportunities. For each one define what it measures, the calculation method, frequency, owner, source, target or threshold and the business decisions it supports. Establish a three-to-six-month baseline before adding more advanced measures.
            `.trim(),

          feedback: {
            title: "The KPI set is focused and decision-relevant",

            body: `
A small number of well-defined indicators is easier to collect consistently and use in management. The baseline period allows the company to test definitions and responsibilities before increasing complexity.
              `.trim(),

            consequence:
              "Monitoring becomes continuous and reliable, reports are more consistent and decisions can be made faster.",

            takeaway:
              "A useful KPI needs a clear definition, source, owner, target and connection with an actual business decision.",
          },
        },

        [choices.kpiSelection.measureEverything]: {
          label: "Measure every proposed indicator immediately",

          text: `
Track all forty KPIs from the beginning so that the company appears comprehensive and credible to customers, partners and other stakeholders.
            `.trim(),

          feedback: {
            title: "Volume is weakening data quality",

            body: `
The organisation does not yet have stable processes for such a large indicator set. Collecting everything at once is likely to create incomplete values, inconsistent calculations and significant administrative cost.
              `.trim(),

            consequence:
              "Time is wasted, internal trust declines and unverifiable figures can expose the company to greenwashing accusations.",

            takeaway:
              "Credibility depends on the quality and relevance of data, not on the largest possible number of KPIs.",
          },
        },

        [choices.kpiSelection.copyCorporate]: {
          label: "Copy KPIs used by large corporations",

          text: `
Adopt an indicator catalogue from a major corporation because established companies are likely to have already identified the most professional ESG metrics.
            `.trim(),

          feedback: {
            title: "The indicators do not match the company's capacity",

            body: `
Large companies operate more complex systems and have greater specialist resources. Their measures may be difficult for a small organisation to calculate, maintain or connect with its own decisions.
              `.trim(),

            consequence:
              "Unnecessary bureaucracy grows and departments may stop using the indicators after only a few reporting periods.",

            takeaway:
              "KPI design must reflect the organisation's activities, material issues, resources and decision-making needs.",
          },
        },
      },
    },

    [challenges.dataQuality]: {
      title: "Data that does not match",

      shortTitle: "Create consistent ESG data",

      context: `
Energy and waste information arrives from different suppliers in different formats. HR and procurement maintain separate spreadsheets, and the company has no single reliable source for several indicators.

The same type of information is described or measured differently across departments, making it difficult to compare periods, combine results or explain how a reported number was calculated.
        `.trim(),

      question: "How should the company improve the consistency and reliability of its ESG data?",

      choices: {
        [choices.dataQuality.dataModelAndGovernance]: {
          label: "Define a simple data model and quality process",

          text: `
Create common Environmental, Social and Governance data categories, units, levels of detail and validation rules. Introduce completeness, consistency and outlier checks, version control and traceability. Set a collection schedule, assign owners and maintain a shared dictionary that explains every indicator.
            `.trim(),

          feedback: {
            title: "Comparable data is supported by shared rules",

            body: `
The combination of definitions, ownership and controls addresses the cause of inconsistency rather than merely moving information into one location. It also creates a practical basis for improving systems later.
              `.trim(),

            consequence:
              "Reports become more credible and teams spend less time reconciling conflicting figures or making last-minute corrections.",

            takeaway:
              "Reliable ESG data requires common definitions, validation, traceability and accountable owners across departments.",
          },
        },

        [choices.dataQuality.singleExcel]: {
          label: "Put all information into one spreadsheet",

          text: `
Combine every department's current files into one central Excel workbook without first agreeing common definitions, units, evidence requirements or validation rules.
            `.trim(),

          feedback: {
            title: "Central storage does not create consistent meaning",

            body: `
A shared workbook may make information easier to find, but inconsistent definitions and calculations remain. The same metric can still appear with different values in different sections or reporting periods.
              `.trim(),

            consequence:
              "Reports continue to be questioned and significant time is spent investigating and reconciling numbers.",

            takeaway:
              "Data governance is defined by rules, responsibilities and controls, not simply by using one file.",
          },
        },

        [choices.dataQuality.waitForSoftware]: {
          label: "Wait for the perfect ESG software",

          text: `
Postpone structured data collection until the company can purchase and implement a dedicated ESG platform that automatically solves the current integration problems.
            `.trim(),

          feedback: {
            title: "Waiting prevents the organisation from building capability",

            body: `
Software may support an established process, but it cannot define indicators, ownership or evidence on the company's behalf. Delaying action also prevents the creation of a baseline and shared data culture.
              `.trim(),

            consequence:
              "The company cannot demonstrate progress, learn from early data or respond confidently to stakeholder requests.",

            takeaway:
              "Begin with clear processes and available tools, then select technology according to proven needs.",
          },
        },
      },
    },

    [challenges.stakeholderReporting]: {
      title: "One report for everyone?",

      shortTitle: "Tailor ESG reporting",

      context: `
Different stakeholders need different forms of ESG information. Management wants a concise view for decisions, banks and partners request detailed data and methodology, the local community needs clear explanations, and marketing would prefer strong positive messages.

The company must communicate consistently without making every audience read the same level of technical detail or hiding limitations that could affect credibility.
        `.trim(),

      question: "How should the company organise its ESG reporting and communication?",

      choices: {
        [choices.stakeholderReporting.tailoredReporting]: {
          label: "Create connected reports for different audiences",

          text: `
Prepare an internal dashboard with about ten KPIs, trends, alerts and corrective actions; a technical stakeholder report containing methodology, scope, definitions, sources, limitations and evidence; and a clear public summary describing results, remaining uncertainties and improvement plans. Keep KPI definitions, reporting boundaries, frequency and responsible teams consistent across all levels.
            `.trim(),

          feedback: {
            title: "The same evidence is communicated at the right level",

            body: `
Tailored formats make the information useful without changing the underlying facts. Including limitations and improvement plans demonstrates transparency and reduces the risk that concise public communication becomes misleading.
              `.trim(),

            consequence:
              "Management, technical stakeholders and the public receive information suited to their needs, increasing trust and reducing repeated clarification requests.",

            takeaway:
              "Tailor the depth and presentation of ESG communication while preserving consistent definitions, evidence and transparency.",
          },
        },

        [choices.stakeholderReporting.singleReport]: {
          label: "Publish one report for every stakeholder",

          text: `
Create one standard ESG report and distribute it to management, banks, business partners, employees and the local community so that every audience receives exactly the same information.
            `.trim(),

          feedback: {
            title: "One format cannot serve every purpose well",

            body: `
A single report is likely to become too technical for general readers or too superficial for stakeholders who need methods, evidence and detailed datapoints.
              `.trim(),

            consequence:
              "Stakeholders remain dissatisfied and request additional explanations, increasing rather than reducing the communication workload.",

            takeaway:
              "Consistency of evidence does not require identical presentation for every audience.",
          },
        },

        [choices.stakeholderReporting.positiveOnly]: {
          label: "Communicate only positive performance",

          text: `
Use reports and public communication to highlight successful results, while omitting uncertain data, missed targets and areas where improvement plans are still being developed.
            `.trim(),

          feedback: {
            title: "Selective communication creates reputational risk",

            body: `
Positive achievements can be highlighted, but hiding limitations or poor performance makes claims less credible. Problems discovered later may lead stakeholders to question the entire reporting process.
              `.trim(),

            consequence:
              "The company faces reputational backlash and a higher risk of accusations that its ESG communication is misleading or greenwashing-prone.",

            takeaway:
              "Credible reporting combines achievements with honest limitations, unresolved issues and plans for improvement.",
          },
        },
      },
    },
  },

  summary: {
    title: "You have created a focused and credible ESG reporting system",

    body: `
You helped the company choose decision-relevant KPIs, establish consistent data governance and communicate the same evidence through formats tailored to management, technical stakeholders and the public.
      `.trim(),

    takeaways: [
      "Begin with a focused set of clearly defined KPIs linked to material issues, responsible owners, targets and business decisions.",
      "Comparable ESG data depends on shared definitions, units, validation rules, traceability and a regular collection process.",
      "Stakeholder reports should vary in depth and presentation while remaining consistent, evidence-based and transparent about limitations.",
    ],
  },
});
