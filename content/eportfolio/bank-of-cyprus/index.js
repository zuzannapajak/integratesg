import { loadMarkdown } from "../helpers.js";

export const BankOfCyprusCaseStudy = {
  slug: "bank-of-cyprus",
  area: "cross_cutting",
  status: "published",
  sortOrder: 110,
  isFeatured: false,
  countryCode: "CY",
  reportingPeriod: "2025 (Annual Financial Report for the year ended 31 December 2025)",
  sourcePartner: "IoD",
  translations: [
    {
      language: "en",
      title: "Bank of Cyprus",
      summary:
        "Founded in 1899, Bank of Cyprus Public Company Limited is the leading financial services group in Cyprus, offering a comprehensive suite of products across retail and commercial banking, wealth management, insurance, and corporate finance. It operates as the country's primary financial institution, holding a dominant market share and supporting local consumer and business economic activity. The bank is actively driving digital banking innovation and leading Cyprus's transition toward a sustainable, net-zero economy.",
      organization: "Bank of Cyprus Holdings Public Limited Company",
      industry: "Financials (Financial Services)",
      keyTakeaways: [
        'The "Our Environment" strategy of Bank of Cyprus centers on leading the green transition in Cyprus by serving as a role model through its own operations while actively assisting its customers in achieving their net-zero ambitions. To support the broader shift toward a Net Zero Economy, the bank has committed to aligning its portfolio\'s financed emissions with net-zero goals by 2050. As part of this effort, it joined the Partnership for Carbon Accounting Financials (PCAF) to measure Scope 3 greenhouse gas emissions linked to its loans and investments, while setting sector-specific decarbonization targets aligned with global climate scenarios.',
        "In its internal management, Bank of Cyprus focuses on achieving carbon neutrality across its own operations. The institution has evaluated its direct greenhouse gas emissions and implemented an energy-efficiency strategy targeting full operational carbon neutrality by 2050. As an interim milestone toward this goal, the bank has committed to reducing its absolute Scope 1 and Scope 2 greenhouse gas emissions by 42% by 2030, using 2021 as its baseline year.",
        "Beyond corporate and financial operations, environmental stewardship is integrated into the bank's broader Corporate Social Responsibility (CSR) framework as one of its five core pillars. Bank of Cyprus actively establishes strategic partnerships to address climate change by prioritizing four main action areas: raising public awareness and environmental education, promoting disaster prevention and response, mitigating climate change consequences, and actively supporting the protection of local biodiversity.",
        'The Corporate Social Responsibility (CSR) strategy at Bank of Cyprus is grounded in the overarching philosophy of the "Common of Cypriots," positioning the institution as an active, long-term partner dedicated to strengthening public welfare and empowering society. The bank structures its social initiatives across core strategic focus areas: Health, Education, Environment, Culture, Entrepreneurship, and community-wide emergency response. Through targeted funding, strategic alliances, and volunteer engagements, the framework aims to address fundamental social challenges, promote sustainable development, and reduce inequalities across Cyprus.',
      ],
      content: loadMarkdown(new URL("./locales/en.md", import.meta.url)),
    },
  ],
};
