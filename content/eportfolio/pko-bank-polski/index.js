import { loadMarkdown } from "../helpers.js";

export const PkoBankPolskiCaseStudy = {
  slug: "pko-bank-polski",
  area: "cross_cutting",
  status: "published",
  sortOrder: 160,
  isFeatured: false,
  countryCode: "PL",
  reportingPeriod: "2023-2024",
  sourcePartner: "TUL",
  translations: [
    {
      language: "en",
      title: "PKO Bank Polski S.A.",
      summary:
        "PKO Bank Polski S.A. is Poland's largest bank and a leading financial institution in Central and Eastern Europe, headquartered in Warsaw. With over 100 years of history, the bank serves millions of retail and institutional customers through an extensive distribution network of over 1,100 branches. As of 2023, PKO BP holds the largest market share in the Polish banking sector (20%), with leading positions in loans (17%), mortgage lending (20.4%) and investment funds for individuals (20.6%). The bank employs approximately 29,000 people and operates through a diversified Capital Group offering comprehensive banking, insurance, leasing, factoring and investment services. PKO Bank Polski is listed on the Warsaw Stock Exchange and reported a net profit exceeding 5.5 billion PLN in 2023.",
      organization:
        "PKO Bank Polski S.A. (Powszechna Kasa Oszczędności Bank Polski Spółka Akcyjna)",
      industry: "Banking and Financial Services",
      keyTakeaways: [
        "Expanded product offerings supporting sustainable development and transformation projects",
        "Application of ESG criteria in all purchasing procedures conducted in tender mode",
        "Member of WIG-ESG index, confirming recognition as meeting the highest social responsibility standards on the Warsaw Stock Exchange",
        "SFDR (Sustainable Finance Disclosure Regulation): compliance with transparency requirements for financial products",
      ],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
