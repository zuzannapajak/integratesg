import { loadMarkdown } from "../helpers.js";

export const KpmgCyprusCaseStudy = {
  slug: "kpmg-cyprus",
  area: "cross_cutting",
  status: "published",
  sortOrder: 150,
  isFeatured: false,
  countryCode: "CY",
  reportingPeriod: "2025 (Transparency Report 2025 for the financial year ended 31 December 2025)",
  sourcePartner: "IoD",
  translations: [
    {
      language: "en",
      title: "KPMG Cyprus",
      summary:
        "Operating in Cyprus since 1948, KPMG Cyprus is one of the leading professional services firms on the island, providing a full suite of audit, tax, legal, and advisory solutions to domestic and international clients. As a member firm of the global KPMG organization, it combines deep local market expertise with international methodologies to serve corporations, financial institutions, and public sector bodies. The firm actively drives digital transformation, audit quality enhancement, and sustainability advisory, assisting organizations in implementing ESG strategies, CSRD compliance, and robust risk governance structures.",
      organization: "KPMG Limited (Cyprus)",
      industry: "Professional Services / Accounting, Audit, Tax & Advisory",
      keyTakeaways: [
        'Operates two certified "Green Offices" in Cyprus and utilizes the Synesgy platform (as of February 2025) to track and minimize the environmental footprint of its consultancy operations. The Synesgy Cyprus portal serves as a dedicated digital entryway for local businesses, financial institutions, and supply chain partners to access CRIF’s global Environmental, Social, and Governance (ESG) assessment platform. Operating in compliance with local regulations and international reporting frameworks—such as the Global Reporting Initiative (GRI), the UN Sustainable Development Goals (SDGs), and European Taxonomy standards—the localized platform enables Cypriot companies to complete tailored ESG self-assessments, benchmark their operational performance, and manage sustainability disclosures within a unified ecosystem. Through the platform, organizations can measure their ESG impact, upload supporting evidence for automated and manual data quality checks, and receive an official ESG score alongside a downloadable 12-month certificate and detailed action plan. For supply chain managers, commercial buyers, and financial institutions operating in Cyprus, the service provides specialized analytics dashboards to monitor supplier sustainability performance, streamline regulatory compliance, mitigate reputational risks, and foster sustainable business practices across regional and global value chains.',
        'KPMG Cyprus outlines its commitment to environmental stewardship and internal sustainability in its Transparency Report 2025 through the global framework of Our Impact Plan (specifically focusing on the "Planet" pillar). The report highlights the firm\'s strategic initiatives to reduce its direct operational carbon footprint, aiming for net-zero carbon emissions by 2030. To achieve this, the firm focuses on minimizing energy consumption across its office premises, implementing energy-efficiency solutions, transitioning to renewable energy sources, and reducing business travel and paper waste across its operations.',
        "Beyond direct operations, the report emphasizes embedding environmental considerations across KPMG's broader value chain and client engagement activities. KPMG Cyprus actively evaluates Scope 1, Scope 2, and material Scope 3 emissions while engaging with local and international suppliers to encourage sustainable procurement practices. Furthermore, the firm integrates environmental risk assessments into its audit methodologies, assurance services, and corporate advisory offerings, ensuring that climate-related risks and reporting standards (such as CSRD and EU Taxonomy) are transparently disclosed and aligned with global public interest responsibilities.",
        'Prioritizes lifelong learning, with an average of 500 people trained annually in ethics, anti-bribery, and data privacy to ensure a highly skilled and socially responsible workforce. In its Transparency Report 2025, KPMG Cyprus highlights its internal social practices through the "People" pillar of its global Our Impact Plan, placing workforce well-being, inclusion, and continuous professional development at the center of its operating model. Across its six offices in Cyprus, the firm focuses on creating an inclusive, purpose-led culture where diversity is respected and equal growth opportunities are provided to its 730 professionals. The report underscores ongoing investments in employee health and well-being programs, structured learning paths, and specialized upskilling initiatives – particularly around responsible AI usage, digital analytics, and ESG frameworks – to foster talent retention and support career progression.',
      ],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
