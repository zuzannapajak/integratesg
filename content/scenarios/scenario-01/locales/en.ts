import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario01Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario01Ids;

export const scenario01En = defineScenarioLocale<"scenario-01">({
  scenarioId,
  locale: "en",

  title: "Introduction to ESG and Sustainable Development",

  shortTitle: "Foundations of ESG",

  subtitle: "The Supplier's Dilemma – Integrating the Pillars",

  introduction: `
You are the manager of "GreenTech Solutions," an SME that manufactures high-efficiency components. A major international corporation has reached out, interested in a multi-year contract. However, before signing, they require you to submit an "ESG Integration Roadmap" that goes beyond your current charitable donations.
    `.trim(),

  organisation: "GreenTech Solutions",

  role: "Company Manager",

  objectives: [
    "Define and differentiate the three core pillars of ESG (Environmental, Social, Governance) within a business context.",
    "Apply ESG principles to secure a strategic advantage, specifically for gaining access to large corporate supply chains.",
  ],

  boardAlt:
    "Three connected business situations about defining ESG pillars, moving from CSR to ESG integration, and linking company actions to the Sustainable Development Goals.",

  challenges: {
    [challenges.pillars]: {
      title: "Defining the Pillars for the Client",

      shortTitle: "Define the ESG pillars",

      context: `
The client’s procurement officer asks you to explain how your company manages "Non-Financial Risks" specifically across the E, S, and G pillars. You must categorize your current activities correctly to show you understand the framework.
        `.trim(),

      question:
        "How should GreenTech Solutions categorize its current activities across the Environmental, Social and Governance pillars?",

      choices: {
        [choices.pillars.accurateCategorisation]: {
          label: "Categorize operations by their actual ESG impact",

          text: `
Categorize operations accurately by highlighting your energy efficiency (E), your fair pay and diversity policies (S), and your transparent board decision-making and anti-corruption measures (G).
            `.trim(),

          feedback: {
            body: `
Excellent work. By correctly identifying that energy efficiency belongs to Environmental, fair pay to Social, and anti-corruption to Governance, you demonstrate that ESG is a "scorecard" for risk management. This clarity proves to the client that you aren't just using buzzwords, but are managing non-financial factors to create long-term value.
              `.trim(),
          },
        },

        [choices.pillars.rulesConfusion]: {
          label: "Treat employee policies as Governance because they are rules",

          text: `
Categorizing Employee Safety or Diversity under Governance because they are "company rules" rather than seeing them as part of the Social pillar.
            `.trim(),

          feedback: {
            body: `
While policies are "rules," Social (S) is specifically about how a company treats people—including employees and the communities it operates in. Categorizing DEI or safety under Governance ignores the human-centric focus of the Social pillar.
              `.trim(),
          },
        },

        [choices.pillars.benefitConfusion]: {
          label: "Treat waste and circularity as Social because they benefit the community",

          text: `
Categorizing Waste Management or Circular Economy efforts under the Social pillar because they "benefit the community".
            `.trim(),

          feedback: {
            body: `
It is a mistake to place waste management under "Social" just because it helps the community. The Environmental (E) pillar is strictly defined by the company's impact on the natural world and resource efficiency. For a client, seeing this in the wrong category suggests a lack of technical ESG literacy.
              `.trim(),
          },
        },
      },
    },

    [challenges.csrToEsg]: {
      title: "Moving from CSR to ESG Integration",

      shortTitle: "Move from CSR to ESG",

      context: `
Your CEO suggests that your long history of donating 2% of profits to a local children's hospital (CSR) should be the centerpiece of the roadmap. You must explain why this is no longer sufficient for a large corporate partner.
        `.trim(),

      question:
        "How should the roadmap explain why traditional CSR is no longer sufficient for the corporate client?",

      choices: {
        [choices.csrToEsg.integrationEra]: {
          label: "Explain the shift from CSR to integrated ESG risk management",

          text: `
Explain the shift to the "Integration Era," where the client views E, S, and G factors as financial risks to their own supply chain rather than just voluntary philanthropy.
            `.trim(),

          feedback: {
            body: `
Spot on. You have successfully navigated the "Integration Era". By explaining that ESG is "being smart" rather than just "being nice," you align with the reality that investors and large corporations now treat these factors as financial risks and opportunities. You’ve shown that sustainability is a business process, not a side project.
              `.trim(),
          },
        },

        [choices.csrToEsg.relabelCsr]: {
          label: "Treat ESG as simply a new name for CSR",

          text: `
Treating ESG as simply a new name for CSR and assuming that charitable giving is the same as integrated risk management.
            `.trim(),

          feedback: {
            body: `
Simply renaming your old CSR program won't work because CSR was often voluntary, philanthropic, and the first thing cut when profits dropped. Large clients need to see that your sustainability efforts are "non-negotiable" and embedded in your core strategy.
              `.trim(),
          },
        },

        [choices.csrToEsg.imageOnly]: {
          label: "Rely on CSR because it creates a positive image",

          text: `
Believing that CSR is enough because it creates a "nice" image, failing to see that ESG is now a business necessity for supply chain access.
            `.trim(),

          feedback: {
            body: `
Focusing only on a "nice" image can lead to "greenwashing"—where a company does good deeds (like charity) while ignoring core operational harms (like pollution). Modern ESG requires a structured, financially relevant framework that is harder to ignore than traditional CSR.
              `.trim(),
          },
        },
      },
    },

    [challenges.sdgAlignment]: {
      title: "Linking Actions to Global Goals (SDGs)",

      shortTitle: "Link actions to the SDGs",

      context: `
To finalize the roadmap, you want to show how your manufacturing SME contributes to the "Bigger Picture." You need to link your specific action of reducing energy waste to the correct Global Goal.
        `.trim(),

      question:
        "How should GreenTech Solutions connect its energy and resource-efficiency actions with the Sustainable Development Goals?",

      choices: {
        [choices.sdgAlignment.preciseMapping]: {
          label: "Map each ESG action to the most relevant SDG",

          text: `
Map the specific ESG action to its corresponding SDG, specifically linking energy and resource efficiency to SDG 12: Responsible Consumption and Production or SDG 7: Affordable and Clean Energy.
            `.trim(),

          feedback: {
            body: `
Perfectly executed. Mapping your ESG "How" (the framework) to the SDG "What" (the global objectives) gives your SME a universal language. Specifically, linking resource efficiency to SDG 12 or SDG 7 shows a sophisticated understanding of how small actions contribute to the global blueprint.
              `.trim(),
          },
        },

        [choices.sdgAlignment.allClimateAction]: {
          label: "Treat every green action as SDG 13: Climate Action",

          text: `
Claiming that all green actions support SDG 13 (Climate Action) without distinguishing between energy efficiency and carbon footprint reduction.
            `.trim(),

          feedback: {
            body: `
While all green actions are good, claiming everything is "Climate Action" (SDG 13) can seem vague. Precision matters; for example, showing how you reduce barriers for underrepresented groups directly supports SDG 10 (Reduced Inequalities), which provides a much stronger narrative for your "Social" pillar.
              `.trim(),
          },
        },

        [choices.sdgAlignment.noStakeholderLink]: {
          label: "Do not communicate the SDG link to stakeholders",

          text: `
Failing to communicate the link to stakeholders, missing the opportunity to use a universal language that builds trust with international clients.
            `.trim(),

          feedback: {
            body: `
Failing to communicate these links is a missed strategic advantage. For an SME, using the SDGs helps you win contracts because it proves you are aligned with the same global standards as your large corporate clients.
              `.trim(),
          },
        },
      },
    },
  },

  summary: {
    title: "You have completed the Supplier's Dilemma",

    takeaways: [
      "Environmental, Social and Governance activities should be categorized according to the primary impact or risk being managed.",
      "ESG integration embeds non-financial risks and opportunities in core business strategy rather than treating sustainability as voluntary philanthropy.",
      "Specific ESG actions can be linked to relevant SDGs to communicate their contribution using a shared international language.",
    ],
  },
});
