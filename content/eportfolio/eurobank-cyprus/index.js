import { loadMarkdown } from "../helpers.js";

export const EurobankCyprusCaseStudy = {
  slug: "eurobank-cyprus",
  area: "cross_cutting",
  status: "published",
  sortOrder: 120,
  isFeatured: false,
  countryCode: "CY",
  reportingPeriod: "2025 (Annual Financial Report for the year ended 31 December 2025)",
  sourcePartner: "IoD",
  translations: [
    {
      language: "en",
      title: "Eurobank Cyprus",
      summary: "Size: Employees: ~3,300+ professionals (Combined Group post-merger with Hellenic Bank), Extensive network of banking centers and local branches across Cyprus",
      organization: "Eurobank Cyprus Ltd.",
      industry: "Financials (Financial Services) / Banking",
      keyTakeaways: [
      "Eurobank Cyprus (operating under the Eurobank Group) is a leading financial institution in Cyprus, specializing in wholesale banking, corporate and investment banking, wealth management, private banking, and international business banking. Following its landmark strategic merger with Hellenic Bank, Eurobank established one of the largest combined banking forces in Cyprus, significantly expanding its footprint across retail and commercial markets. The bank is recognized for its strong capital base, high operational efficiency, and commitment to driving digital transformation and sustainable finance across the region.",
      "Eurobank Cyprus’s Sustainability Annual Reports repository serves as the central hub for the bank's non-financial disclosures, tracking its progression toward integrating Environmental, Social, and Governance (ESG) principles across all business activities. The page outlines the institution's strategic alignment with international sustainability benchmarks, most notably the United Nations Sustainable Development Goals (SDGs) and the UNEP FI Principles for Responsible Banking. By maintaining a publicly accessible archive of annual reports spanning consecutive years, Eurobank provides transparent accountability regarding its performance targets, ESG disclosures, and long-term commitment to combining sound financial performance with corporate environmental and social responsibility.",
      "The strategic framework reflected throughout the reporting suite is built upon two distinct levels of impact: operational impact and financed impact. On the operational front, the bank documents concrete milestones and action plans designed to minimize its direct carbon footprint, accelerate digital transformation towards a paperless branch network, optimize resource and water efficiency, and establish sustainable procurement protocols. Simultaneously, the financed impact pillar evaluates the environmental and social consequences of the bank’s lending and investment portfolios, detailing metrics on green loan disbursements, financed greenhouse gas emissions, and decarbonization trajectories targeting net-zero operations by 2050.",
      "In addition to environmental indicators, the reports highlight Eurobank's internal governance structure and social responsibility initiatives. The disclosures outline commitments to fostering a diverse and inclusive workplace, eliminating gender pay gaps, enhancing employee wellbeing, and promoting ESG literacy among staff and clients. By incorporating ESG and climate-related risk assessments directly into its core Risk Management Framework and offering dedicated green retail and commercial financing products, the published annual sustainability reports demonstrate how Eurobank systematically embeds responsible banking practices into its broader corporate growth strategy."
],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
