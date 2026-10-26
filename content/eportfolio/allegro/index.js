import { loadMarkdown } from "../helpers.js";

export const AllegroCaseStudy = {
  slug: "allegro",
  area: "cross_cutting",
  status: "published",
  sortOrder: 90,
  isFeatured: false,
  countryCode: "PL",
  reportingPeriod: "2023",
  sourcePartner: "CleverMind",
  translations: [
    {
      language: "en",
      title: "Allegro S.A.",
      summary: "Allegro S.A. is the undisputed leader of the Polish e-commerce market and one of the largest online marketplaces in Europe. Operating primarily as a third-party platform, it connects millions of active buyers with over a hundred thousand merchants offering a vast array of products across multiple retail categories. Beyond its core marketplace, Allegro has built a comprehensive digital ecosystem featuring the highly successful \"Allegro Smart!\" subscription model, proprietary logistics networks including parcel lockers and integrated fintech solutions like Allegro Pay. Headquartered in Poznań and listed on the Warsaw Stock Exchange, the company is actively expanding its footprint across Central and Eastern Europe to solidify its regional dominance.",
      organization: "Allegro S.A.",
      industry: "E-commerce and Technology",
      keyTakeaways: [
      "Comprehensive GHG emissions tracking - Scope 1 and Scope 2 emissions reported since FY18 through Carbon Disclosure Project (CDP)",
      "Continuous energy efficiency initiatives to reduce consumption and minimize carbon footprint",
      "Member of WIG-ESG index, Warsaw Stock Exchange's ESG index, which highlights companies with the highest environmental, social and governance standards based on Sustainalytics scoring",
      "Compliance with transparency requirements for platform algorithms and content moderation"
],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
