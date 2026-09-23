import { loadMarkdown } from "../helpers.js";

export const sonnentorCaseStudy = {
  slug: "sonnentor",
  area: "cross_cutting",
  status: "published",
  sortOrder: 70,
  isFeatured: false,
  countryCode: "AT",
  reportingPeriod: "2023–2025",
  sourcePartner: "die Berater",
  translations: [
    {
      language: "en",
      title: "SONNENTOR",
      summary:
        "SONNENTOR is an Austrian organic food producer that exports teas, spices and related organic products to more than 40 countries. Since the late 1980s the company has built its brand around organic agriculture rooted in the Waldviertel, a rural region in northern Lower Austria.",
      organization: "SONNENTOR Kräuterhandelsgesellschaft mbH",
      industry: "Organic food production",
      keyTakeaways: [
        "The integration approach translates values – common good, cooperation and fairness – into operational decisions that affect the value chain, investments and reporting.",
        "Short-term anchor target: fossil-emission-free operations at the Herbquarter in Sprögnitz from 1 April 2028, with later rollout to other sites.",
        "Overall score of 755 out of 1,000 for the reporting period 2023 to 2025 (headline performance score).",
        "A structured, audited reporting approach under the Economy for the Common Good model, with a matrix-based evaluation logic and independent auditors/external experts verifying disclosures.",
      ],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
