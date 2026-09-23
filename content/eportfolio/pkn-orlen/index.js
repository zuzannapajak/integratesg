import { loadMarkdown } from "../helpers.js";

export const pknOrlenCaseStudy = {
  slug: "pkn-orlen",
  area: "cross_cutting",
  status: "published",
  sortOrder: 40,
  isFeatured: false,
  countryCode: "PL",
  reportingPeriod: "2023",
  sourcePartner: "TUL",
  translations: [
    {
      language: "en",
      title: "PKN Orlen S.A.",
      summary: "Polski Koncern Naftowy Orlen S.A. (PKN Orlen) is the largest integrated energy and petrochemical company in Central Europe, headquartered in Płock, Poland. The company operates across the oil, gas, refining, petrochemical and retail fuel sectors, with a presence in over 100 countries.",
      organization: "Polski Koncern Naftowy Orlen S.A. (PKN Orlen)",
      industry: "Energy, Refining, and Petrochemicals",
      keyTakeaways: [
      "PKN Orlen demonstrates a \"triple integration\" model: (1) ESG integrated into business strategy, (2) business strategy integrated with decarbonisation roadmap and (3) all three aligned with international frameworks (Paris Agreement, UN SDGs, European Green Deal).",
      "Net zero carbon emissions target by 2050",
      "PLN 30 billion allocated to sustainability projects over the next decade",
      "ESG integrated into ORLEN2030 business strategy"
],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
