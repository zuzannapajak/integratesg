import { loadMarkdown } from "../helpers.js";

export const pzuCaseStudy = {
  slug: "pzu",
  area: "cross_cutting",
  status: "published",
  sortOrder: 30,
  isFeatured: false,
  countryCode: "PL",
  reportingPeriod: "2023",
  sourcePartner: "TUL",
  translations: [
    {
      language: "en",
      title: "PZU S.A.",
      summary: "Powszechny Zakład Ubezpieczeń S.A. (PZU S.A.) is Poland’s largest and oldest insurance company, founded in 1803 and headquartered in Warsaw. As a publicly traded company listed on the Warsaw Stock Exchange (WSE: PZU), it is a key component of the WIG30 index.",
      organization: "Powszechny Zakład Ubezpieczeń S.A. (PZU S.A.)",
      industry: "Insurance and Financial Services",
      keyTakeaways: [
      "PZU's ESG integration is systematic and comprehensive, embedded across all business functions from product development and investment decisions to procurement, risk management, claims handling and operational practices, demonstrating leadership in Poland's insurance sector sustainability transition.",
      "Achieved CO2 neutrality from own emissions (Scope 1 and 2) by 2024",
      "100% ESG criteria integration in key procurement processes (2023), exceeding 70% goal for 2024",
      "46 ESG-related goals included in 2024 strategic objectives and assigned to management team"
],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
