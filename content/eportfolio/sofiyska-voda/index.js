import { loadMarkdown } from "../helpers.js";

export const sofiyskaVodaCaseStudy = {
  slug: "sofiyska-voda",
  area: "cross_cutting",
  status: "published",
  sortOrder: 50,
  isFeatured: false,
  countryCode: "BG",
  reportingPeriod: "2023–2024",
  sourcePartner: "SBC",
  translations: [
    {
      language: "en",
      title: "Sofiyska Voda AD",
      summary:
        "Sofiyska Voda operates Bulgaria's only water public-private partnership, under a 25-year concession contract with Sofia Municipality originally awarded in 2000 and renegotiated in 2018. Since Veolia took over the majority shareholding in 2010, the company has invested approximately €225 million in network rehabilitation and modernisation (through 2019), and has proposed a further €324 million in infrastructure upgrades through 2034 contingent on concession extension.",
      organization: "Sofiyska Voda AD (Sofia Water), part of the Veolia Group",
      industry: "Water supply and wastewater services",
      keyTakeaways: [
        "ESG integration at Sofiyska Voda is embedded in its core concession obligations, infrastructure investment programme, and stakeholder governance — reflecting both Veolia Group standards and the specific accountability structure of operating a municipal concession.",
        "Total water losses reduced from 122 million m³ (2010) to 59 million m³ (2019)",
        "The Kubratovo wastewater treatment plant — one of the most energy-efficient in Europe — converts biogas from treatment into electricity and heat, saving an estimated 70,000 tonnes of CO₂ per year",
        "This case illustrates how ESG integration functions within a regulated, public-private utility concession — a governance form with limited precedent in Bulgaria.",
      ],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
