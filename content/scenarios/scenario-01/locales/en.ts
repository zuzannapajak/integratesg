import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario01Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario01Ids;

export const scenario01En = defineScenarioLocale<"scenario-01">({
  scenarioId,
  locale: "en",

  title: "Introduction to ESG and Sustainable Development",

  shortTitle: "Foundations of ESG",

  subtitle: "The Supplier's Dilemma: integrating ESG pillars into a credible business roadmap",

  introduction: `
You are the manager of GreenTech Solutions, an SME that manufactures high-efficiency components. A major international corporation is interested in signing a multi-year supply contract, but first requires an ESG Integration Roadmap that goes beyond the company's existing charitable donations.

To secure the opportunity, you must demonstrate a practical understanding of the Environmental, Social and Governance pillars, explain the difference between traditional CSR and integrated ESG management, and connect the company's actions with relevant Sustainable Development Goals.
    `.trim(),

  organisation: "GreenTech Solutions",

  role: "Company Manager",

  objectives: [
    "Define and differentiate the Environmental, Social and Governance pillars in a business context.",
    "Apply ESG principles to strengthen risk management and gain access to corporate supply chains.",
    "Connect specific business actions with relevant Sustainable Development Goals.",
  ],

  boardAlt:
    "Three connected business discussions about ESG pillars, the difference between CSR and ESG integration, and links between company actions and the Sustainable Development Goals.",

  challenges: {
    [challenges.pillars]: {
      title: "Defining the ESG pillars for the client",

      shortTitle: "Define the ESG pillars",

      context: `
The client's procurement officer asks how GreenTech Solutions manages non-financial risks across the Environmental, Social and Governance pillars.

You need to categorise the company's current activities correctly. The examples include energy efficiency, fair pay and diversity policies, transparent board decision-making, anti-corruption measures, employee safety and waste management.
        `.trim(),

      question: "How should the company classify its activities across the three ESG pillars?",

      choices: {
        [choices.pillars.accurateCategorisation]: {
          label: "Categorise each activity by its actual ESG impact",

          text: `
Present energy efficiency and waste management as Environmental matters, fair pay, diversity and employee safety as Social matters, and transparent decision-making and anti-corruption controls as Governance matters.
            `.trim(),

          feedback: {
            title: "A clear and technically accurate ESG structure",

            body: `
This classification demonstrates that the company understands ESG as a structured framework for managing non-financial risks rather than as a collection of buzzwords. It shows the client how different activities contribute to long-term business value.
              `.trim(),

            consequence:
              "The procurement team receives a credible overview that can be evaluated against the client's supplier requirements.",

            takeaway:
              "Environmental concerns relate to impacts on the natural world, Social concerns focus on people, and Governance concerns address how the organisation is directed and controlled.",
          },
        },

        [choices.pillars.rulesConfusion]: {
          label: "Treat employee policies as Governance",

          text: `
Place employee safety, fair pay and diversity under Governance because they are controlled through company policies and internal rules.
            `.trim(),

          feedback: {
            title: "Company rules do not automatically belong to Governance",

            body: `
Although these topics are managed through policies, they concern how the company treats employees and other people. Their primary impact is therefore Social rather than Governance.
              `.trim(),

            consequence:
              "The roadmap understates the human-centred purpose of the Social pillar and may suggest weak ESG literacy.",

            takeaway:
              "Classify an issue by the impact it addresses, not only by the internal mechanism used to manage it.",
          },
        },

        [choices.pillars.benefitConfusion]: {
          label: "Treat environmental actions as Social",

          text: `
Place waste reduction and circular economy activities under the Social pillar because cleaner operations also benefit the local community.
            `.trim(),

          feedback: {
            title: "Community benefits do not change the primary category",

            body: `
Waste management and resource efficiency directly concern the company's impact on the natural environment. They remain Environmental topics even when they also create benefits for people and communities.
              `.trim(),

            consequence:
              "The client may question whether the company can report ESG risks and actions consistently.",

            takeaway:
              "Some actions have effects across several pillars, but their primary ESG category should reflect the main impact being managed.",
          },
        },
      },
    },

    [challenges.csrToEsg]: {
      title: "Moving from CSR to ESG integration",

      shortTitle: "Move beyond CSR",

      context: `
GreenTech Solutions has donated two percent of its profits to a local children's hospital for many years. The CEO proposes making this charitable programme the centrepiece of the ESG roadmap.

You need to explain why philanthropy alone is not sufficient for a large corporate customer that assesses environmental, social and governance risks throughout its supply chain.
        `.trim(),

      question: "How should the roadmap explain the move from traditional CSR to ESG integration?",

      choices: {
        [choices.csrToEsg.integrationEra]: {
          label: "Embed ESG in business risk and strategy",

          text: `
Explain that charitable activity can remain valuable, but the roadmap must also show how Environmental, Social and Governance factors are integrated into operations, decision-making and supply-chain risk management.
            `.trim(),

          feedback: {
            title: "ESG becomes a core business process",

            body: `
This approach reflects the shift from voluntary philanthropy toward integrated management of risks and opportunities. It shows that sustainability is connected with how the company operates and creates long-term value.
              `.trim(),

            consequence:
              "The client can see that ESG commitments will continue even when financial pressure makes optional activities harder to maintain.",

            takeaway:
              "CSR may focus on voluntary good deeds, while ESG requires environmental, social and governance considerations to be embedded in core business decisions.",
          },
        },

        [choices.csrToEsg.relabelCsr]: {
          label: "Rename the existing CSR programme",

          text: `
Present the hospital donations as the company's ESG programme and update the terminology without changing how sustainability is managed internally.
            `.trim(),

          feedback: {
            title: "A new label does not create ESG integration",

            body: `
Traditional CSR initiatives are often voluntary and separate from operational management. Renaming them does not demonstrate how the company controls material environmental, social or governance risks.
              `.trim(),

            consequence:
              "The roadmap remains disconnected from the evidence and processes required by the corporate buyer.",

            takeaway:
              "ESG integration requires changes to strategy, responsibilities and operations, not only updated communication.",
          },
        },

        [choices.csrToEsg.imageOnly]: {
          label: "Focus on the positive company image",

          text: `
Use the charitable programme to demonstrate that GreenTech Solutions is a responsible company and avoid adding more complex operational ESG commitments.
            `.trim(),

          feedback: {
            title: "A positive image cannot replace operational evidence",

            body: `
Charitable giving may support reputation, but it does not address possible harms or risks in the company's own activities. Emphasising good deeds while ignoring operational impacts can create greenwashing concerns.
              `.trim(),

            consequence:
              "The customer may conclude that the company is not prepared for modern supply-chain ESG requirements.",

            takeaway:
              "Credible ESG claims must be supported by structured actions and evidence from the core business.",
          },
        },
      },
    },

    [challenges.sdgAlignment]: {
      title: "Linking company actions to global goals",

      shortTitle: "Connect actions with SDGs",

      context: `
To complete the roadmap, you want to show how the company's operational improvements contribute to the wider sustainable development agenda.

GreenTech Solutions is reducing energy waste and improving resource efficiency. The challenge is to connect these specific actions with the most relevant Sustainable Development Goals and communicate the link accurately.
        `.trim(),

      question:
        "How should the company connect its ESG actions with the Sustainable Development Goals?",

      choices: {
        [choices.sdgAlignment.preciseMapping]: {
          label: "Map each action to the most relevant SDG",

          text: `
Link energy and resource efficiency to specific goals such as SDG 7: Affordable and Clean Energy and SDG 12: Responsible Consumption and Production, and explain how the action contributes to each selected goal.
            `.trim(),

          feedback: {
            title: "A precise and credible global connection",

            body: `
Mapping the company's ESG actions to relevant SDGs provides a shared international language. It demonstrates how practical improvements by an SME contribute to wider sustainable development objectives.
              `.trim(),

            consequence:
              "The roadmap aligns with concepts already recognised by the international client and strengthens the company's strategic narrative.",

            takeaway:
              "ESG explains how the company manages sustainability, while the SDGs help communicate which wider outcomes those actions support.",
          },
        },

        [choices.sdgAlignment.allClimateAction]: {
          label: "Link every environmental action to SDG 13",

          text: `
Describe all environmentally beneficial activities as contributions to SDG 13: Climate Action without distinguishing energy, materials, waste or other specific impacts.
            `.trim(),

          feedback: {
            title: "A broad claim loses useful precision",

            body: `
Many environmental actions can contribute to climate objectives, but using the same goal for every action creates a vague account of impact. Resource efficiency and clean energy may have more direct links to other SDGs.
              `.trim(),

            consequence:
              "The roadmap provides less meaningful information and may appear designed for communication rather than accurate impact mapping.",

            takeaway:
              "Choose SDGs according to the specific outcome of an action instead of using one general label for all sustainability activity.",
          },
        },

        [choices.sdgAlignment.noStakeholderLink]: {
          label: "Keep the SDG connection internal",

          text: `
Improve energy and resource efficiency but omit the SDG links from the roadmap because the operational results should speak for themselves.
            `.trim(),

          feedback: {
            title: "A strategic communication opportunity is missed",

            body: `
The operational action remains useful, but failing to explain its connection with recognised global objectives makes it harder for international stakeholders to understand how the company aligns with their sustainability priorities.
              `.trim(),

            consequence:
              "GreenTech Solutions loses an opportunity to build trust and demonstrate alignment with the language used by larger corporate customers.",

            takeaway:
              "Clear stakeholder communication can turn well-designed ESG actions into a stronger strategic advantage.",
          },
        },
      },
    },
  },

  summary: {
    title: "You have created a credible foundation for ESG integration",

    body: `
You helped GreenTech Solutions move from isolated charitable activity toward a structured ESG roadmap that can support risk management, stakeholder trust and access to an international supply chain.
      `.trim(),

    takeaways: [
      "The three ESG pillars should be differentiated according to environmental impacts, treatment of people and organisational direction and control.",
      "ESG goes beyond traditional CSR by embedding sustainability risks and opportunities in strategy and everyday operations.",
      "Specific links between business actions and relevant SDGs provide a credible international language for communicating impact.",
    ],
  },
});
