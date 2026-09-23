import { loadMarkdown } from "../helpers.js";

export const barillaCaseStudy = {
  slug: "barilla",
  area: "cross_cutting",
  status: "published",
  sortOrder: 10,
  isFeatured: false,
  countryCode: "IT",
  reportingPeriod: "2024",
  sourcePartner: "EGInA",
  translations: [
    {
      language: "en",
      title: "Barilla S.p.A.",
      summary: "Barilla’s 2024 sustainability strategy connects climate, water and packaging targets with employee policies, product responsibility, agricultural sourcing and corporate risk management. The company is also adapting its governance and reporting processes to the CSRD and ESRS framework.",
      organization: "Barilla G. e R. Fratelli S.p.A.",
      industry: "Food and Beverage Manufacturing",
      keyTakeaways: [
      "A large part of Barilla’s ESG impact sits in its value chain, especially agricultural sourcing, so the company’s climate and sourcing strategy extends beyond its own factories.",
      "Sustainability is linked to operational programmes, measurable targets, Enterprise Risk Management and double materiality rather than managed as a separate corporate activity.",
      "Barilla combines environmental targets with workforce, safety, nutrition and community initiatives, reflecting the broad ESG responsibilities of a global food company.",
      "The company is moving towards more structured reporting, due diligence and assurance as European sustainability requirements develop."
],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
