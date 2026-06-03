const confidenceScaleLabels = {
  1: "Not confident at all",
  2: "Slightly confident",
  3: "Moderately confident",
  4: "Confident",
  5: "Very confident",
};

export const curriculumPilotQuestions = [
  {
    id: "curriculum-pilot-q-01",
    key: "esg_meaning_relevance",
    sortOrder: 1,
    inputType: "likert",
    minValue: 1,
    maxValue: 5,
    isRequired: true,
    isActive: true,
    translations: [
      {
        language: "en",
        prompt: "I can explain what ESG means and why it is relevant for organisations.",
        helpText: null,
        labels: confidenceScaleLabels,
      },
    ],
  },
  {
    id: "curriculum-pilot-q-02",
    key: "esg_sustainable_development_competitiveness",
    sortOrder: 2,
    inputType: "likert",
    minValue: 1,
    maxValue: 5,
    isRequired: true,
    isActive: true,
    translations: [
      {
        language: "en",
        prompt:
          "I can describe the connection between ESG, sustainable development and business competitiveness.",
        helpText: null,
        labels: confidenceScaleLabels,
      },
    ],
  },
  {
    id: "curriculum-pilot-q-03",
    key: "esg_mission_values_strategy",
    sortOrder: 3,
    inputType: "likert",
    minValue: 1,
    maxValue: 5,
    isRequired: true,
    isActive: true,
    translations: [
      {
        language: "en",
        prompt:
          "I can explain how ESG can be linked to an organisation’s mission, values and strategy.",
        helpText: null,
        labels: confidenceScaleLabels,
      },
    ],
  },
  {
    id: "curriculum-pilot-q-04",
    key: "esg_priorities_objectives",
    sortOrder: 4,
    inputType: "likert",
    minValue: 1,
    maxValue: 5,
    isRequired: true,
    isActive: true,
    translations: [
      {
        language: "en",
        prompt: "I can identify relevant ESG priorities and objectives for an organisation.",
        helpText: null,
        labels: confidenceScaleLabels,
      },
    ],
  },
  {
    id: "curriculum-pilot-q-05",
    key: "esg_frameworks_standards_regulations",
    sortOrder: 5,
    inputType: "likert",
    minValue: 1,
    maxValue: 5,
    isRequired: true,
    isActive: true,
    translations: [
      {
        language: "en",
        prompt:
          "I can recognise key ESG frameworks, standards and regulatory requirements relevant to organisations.",
        helpText: null,
        labels: confidenceScaleLabels,
      },
    ],
  },
  {
    id: "curriculum-pilot-q-06",
    key: "esg_integrating_operations",
    sortOrder: 6,
    inputType: "likert",
    minValue: 1,
    maxValue: 5,
    isRequired: true,
    isActive: true,
    translations: [
      {
        language: "en",
        prompt: "I can identify practical steps for integrating ESG into business operations.",
        helpText: null,
        labels: confidenceScaleLabels,
      },
    ],
  },
  {
    id: "curriculum-pilot-q-07",
    key: "esg_data_indicators_kpis",
    sortOrder: 7,
    inputType: "likert",
    minValue: 1,
    maxValue: 5,
    isRequired: true,
    isActive: true,
    translations: [
      {
        language: "en",
        prompt: "I can explain how ESG data, indicators or KPIs can be used to monitor progress.",
        helpText: null,
        labels: confidenceScaleLabels,
      },
    ],
  },
  {
    id: "curriculum-pilot-q-08",
    key: "esg_greenwashing_social_washing",
    sortOrder: 8,
    inputType: "likert",
    minValue: 1,
    maxValue: 5,
    isRequired: true,
    isActive: true,
    translations: [
      {
        language: "en",
        prompt:
          "I can recognise risks such as greenwashing or social washing and suggest ways to avoid them.",
        helpText: null,
        labels: confidenceScaleLabels,
      },
    ],
  },
  {
    id: "curriculum-pilot-q-09",
    key: "esg_realistic_sme_application",
    sortOrder: 9,
    inputType: "likert",
    minValue: 1,
    maxValue: 5,
    isRequired: true,
    isActive: true,
    translations: [
      {
        language: "en",
        prompt: "I can apply ESG knowledge to a realistic organisational or SME-related situation.",
        helpText: null,
        labels: confidenceScaleLabels,
      },
    ],
  },
  {
    id: "curriculum-pilot-q-10",
    key: "post_improved_area_reflection",
    sortOrder: 100,
    inputType: "open_text",
    minValue: null,
    maxValue: null,
    isRequired: false,
    isActive: true,
    translations: [
      {
        language: "en",
        prompt: "In which ESG-related area do you feel you improved the most, and why?",
        helpText: null,
        labels: null,
      },
    ],
  },
];
