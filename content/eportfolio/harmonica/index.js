import { loadMarkdown } from "../helpers.js";

export const harmonicaCaseStudy = {
  slug: "harmonica",
  area: "cross_cutting",
  status: "published",
  sortOrder: 60,
  isFeatured: false,
  countryCode: "BG",
  reportingPeriod: "2022–2024",
  sourcePartner: "SBC",
  translations: [
    {
      language: "en",
      title: "Harmonica",
      summary:
        "Harmonica was founded in 2006 by Magdalena Maleeva (a former top-4 world tennis player turned climate activist), Lubomir Nokov (the company's current CEO) and Metodi Metodiev, beginning with organic yoghurt production on Bulgaria's first two organic cow farms. The company has since grown to a portfolio of more than 100 organic products, exported to over 20 countries, and in September 2022 became one of the first Bulgarian companies to achieve Certified B Corporation status.",
      organization: "Harmonica (brand of Bio Bulgaria AD)",
      industry: "Organic and natural food production",
      keyTakeaways: [
        "ESG integration at Harmonica is not treated as an external requirement but as the founding philosophy of the business, shaped through organic and regenerative farming practices, transparent supplier relationships, and a formal B Corp governance commitment adopted in 2022.",
        "Products are made from certified organic ingredients using regenerative farming methods, with minimal processing and clean labels free of artificial additives or preservatives",
        "Certified B Corporation since September 2022, one of the first in Bulgaria, requiring the formal integration of stakeholder considerations (workers, community, environment, customers) into governing documents",
        "B Impact Assessment overall score: 117.1 (B Lab's minimum qualifying score for certification is 80; the median for ordinary assessed businesses is 50.9)",
      ],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
