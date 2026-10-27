import { loadMarkdown } from "../helpers.js";

export const GrupaAzotyCaseStudy = {
  slug: "grupa-azoty",
  area: "cross_cutting",
  status: "published",
  sortOrder: 100,
  isFeatured: false,
  countryCode: "PL",
  reportingPeriod: "2023",
  sourcePartner: "CleverMind",
  translations: [
    {
      language: "en",
      title: "Grupa Azoty S.A.",
      summary:
        "Grupa Azoty S.A. is the leader of the Polish fertilizer market and one of the largest fertilizer-chemical capital groups in Europe. Headquartered in Poland and listed on the Warsaw Stock Exchange since 2008, the company operates a conglomerate of over 50 companies both domestically and internationally. Its core business focuses on fertilizers, but it also has significant operations in chemical logistics, defence-related chemistry and advanced chemicals. Grupa Azoty produces around 5 million tonnes of fertilizers annually, manages a logistics capacity of 8.2 million tonnes and operates its own extensive railway infrastructure, solidifying its position as the second-largest fertilizer producer in the EU and a key player in the European chemical industry.",
      organization: "Grupa Azoty S.A.",
      industry: "Chemicals and Fertilizers",
      keyTakeaways: [
        "Lower carbon footprint products certified through ISCC+ (International Sustainability & Carbon Certification Plus)",
        "Signatory of the Partnership for the Implementation of UN Sustainable Development Goals (since 2020)",
        "Sustainalytics ESG Risk Rating: medium to High Risk (typical for chemical industry)",
        "Compliance with Best Available Techniques (BAT) requirements for chemical production",
      ],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
