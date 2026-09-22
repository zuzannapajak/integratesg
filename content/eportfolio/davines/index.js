import { loadMarkdown } from "../helpers.js";

export const davinesCaseStudy = {
  slug: "davines",
  area: "cross_cutting",
  status: "published",
  sortOrder: 20,
  isFeatured: false,
  countryCode: "IT",
  reportingPeriod: "2024",
  sourcePartner: "EGInA",
  translations: [
    {
      language: "en",
      title: "Davines Group",
      summary: "Davines Group is an Italian family-owned company founded in Parma in 1983 as a research laboratory. Today, the Group operates internationally in the professional haircare and skincare markets through the Davines and [comfort zone] brands.",
      organization: "Davines Group",
      industry: "Professional Cosmetics / Personal Care Products",
      keyTakeaways: [
      "Davines Group's ESG approach is based on the principle that sustainability should be integrated into products, production processes, supply chains, corporate governance and stakeholder relationships.",
      "Reduction of absolute Scope 1 and Scope 2 emissions by 42% by 2030, compared with the 2022 baseline.",
      "Davines has been a Certified B Corporation since 2016.",
      "The combination of external certification, measurable targets, stakeholder governance and operational sustainability initiatives makes Davines a useful case for understanding how ESG can be integrated into a company beyond isolated environmental or social projects."
],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
