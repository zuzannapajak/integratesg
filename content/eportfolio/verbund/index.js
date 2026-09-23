import { loadMarkdown } from "../helpers.js";

export const verbundCaseStudy = {
  slug: "verbund",
  area: "cross_cutting",
  status: "published",
  sortOrder: 80,
  isFeatured: false,
  countryCode: "AT",
  reportingPeriod: "2024",
  sourcePartner: "die Berater",
  translations: [
    {
      language: "en",
      title: "VERBUND AG",
      summary:
        "Founded in 1947, VERBUND is Austria’s leading energy company and one of the largest producers of electricity from hydropower in Europe. It covers around 40% of Austria’s electricity demand, and in 2024 roughly 96% of its generation came from renewable sources – predominantly hydropower, supported by wind and photovoltaics – with hydropower capacity of about 8.7 GW.",
      organization: "VERBUND AG",
      industry: "Utilities – electricity generation, transmission, trading and sales",
      keyTakeaways: [
        "For VERBUND, ESG is not a separate initiative but the core of the business model: as a renewable-energy utility, its climate performance and its commercial performance are closely linked.",
        "Around 96% of 2024 electricity generation came from hydro, wind and solar power; the remaining share stems from thermal plants still required for grid stability and district heating.",
        "Commitment to net-zero greenhouse-gas emissions by 2050 (at least a 90% reduction from a 2020 base year, with the elimination of residual emissions), and an operational Scope 1 and 2 target of a 90% reduction by 2040.",
        "Sustainability is reported within an integrated annual report under CSRD and the ESRS, based on a double-materiality assessment, with Supervisory Board and Audit Committee oversight of ESG reporting, the materiality assessment and the Climate Transition Plan.",
      ],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
