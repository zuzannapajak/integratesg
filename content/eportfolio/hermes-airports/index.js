import { loadMarkdown } from "../helpers.js";

export const HermesAirportsCaseStudy = {
  slug: "hermes-airports",
  area: "cross_cutting",
  status: "published",
  sortOrder: 130,
  isFeatured: false,
  countryCode: "CY",
  reportingPeriod:
    "2025 (5th Annual Sustainability Report covering the period 01 January 2025 to 31 December 2025)",
  sourcePartner: "IoD",
  translations: [
    {
      language: "en",
      title: "Hermes Airports",
      summary:
        "Size: Over 13.75 million annual passengers managed across 2 international airports, supports ~25,000 direct and indirect jobs across the airport ecosystem, operates under a 25-year Build-Operate-Transfer (BOT) concession agreement",
      organization: "Hermes Airports (Operator of Larnaca and Pafos Airports)",
      industry: "Transportation & Infrastructure / Aviation (Airport Operations)",
      keyTakeaways: [
        "Reporting Year: 2025 (5th Annual Sustainability Report covering the period 01 January 2025 to 31 December 2025)",
        "Hermes Airports Ltd is an international consortium comprising nine Cypriot and foreign shareholders responsible for managing and operating Cyprus’s two commercial aviation gateways: Larnaka International Airport and Pafos International Airport. Assuming management under a Build-Operate-Transfer (BOT) concession agreement with the Republic of Cyprus, the company drives key regional connectivity, tourism infrastructure, and trade activities across the island. Hermes Airports is a pioneer in sustainable aviation management within the Mediterranean, maintaining carbon neutrality (ACI Level 4+ Transition) and running major renewable energy and decarbonization projects across its airport facilities.",
        "Hermes Airports embeds environmental stewardship into its core business strategy for both Larnaka and Pafos International Airports, adhering to structured governance and international reporting frameworks like the Global Reporting Initiative (GRI). Under its corporate Energy Policy, the operator holds the ISO 50001:2011 certification for Energy Management. The company monitors, measures, and transparently reports its environmental performance to ensure continuous alignment with global aviation standards and sustainability best practices.",
        "A central pillar of the airports' environmental strategy is carbon management and the transition toward renewable energy. Both Larnaka and Pafos International Airports achieved carbon neutrality in 2019 and have earned the prestigious ACI Level 4+ Transition accreditation. Hermes Airports has pledged to achieve net-zero carbon emissions for operations under its direct control by 2050. To drive this decarbonization trajectory, the operator constructed major solar photovoltaic plants—a 3.5 MWp installation at Larnaka and a 1.1 MWp installation at Pafos—which collectively generate enough clean electricity to supply roughly 28% of the airports' total energy demands.",
      ],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
