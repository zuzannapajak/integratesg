export const WP4_SURVEY_SCOPES = ["case-studies", "scenarios"] as const;
export type Wp4SurveyScope = (typeof WP4_SURVEY_SCOPES)[number];

export const WP4_SURVEY_ROUND = "initial";
export const WP4_SURVEY_VERSION = 1;

export const WP4_SURVEY_TYPES = {
  "case-studies": "wp4_case_studies",
  scenarios: "wp4_scenarios",
} as const;

export const WP4_SKILLS = ["systems_thinking", "decision_making", "data_literacy"] as const;
export type Wp4Skill = (typeof WP4_SKILLS)[number];

export function isWp4SurveyScope(value: unknown): value is Wp4SurveyScope {
  return value === "case-studies" || value === "scenarios";
}

export function wp4SurveyHref(locale: string, scope: Wp4SurveyScope) {
  return `/${locale}/wp4-surveys/${scope}`;
}
