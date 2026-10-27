export const PILOT_SURVEY_SCOPES = ["curriculum", "eportfolio"] as const;
export const PILOT_COUNTRIES = ["AT", "BG", "CY", "IT", "PL"] as const;

export type PilotSurveyScope = (typeof PILOT_SURVEY_SCOPES)[number];
export type PilotCountry = (typeof PILOT_COUNTRIES)[number];
export type PilotRatings = {
  contentClarity: number;
  practicalRelevance: number;
  usability: number;
  overallSatisfaction: number;
};
export type PilotSatisfactionInput = {
  scope: PilotSurveyScope;
  locale: string;
  countryCode: PilotCountry;
  caseStudyId?: string;
  strengths?: string;
  improvements?: string;
} & PilotRatings;

export function isPilotSurveyScope(value: string): value is PilotSurveyScope {
  return PILOT_SURVEY_SCOPES.some((scope) => scope === value);
}

export function isPilotCountry(value: string): value is PilotCountry {
  return PILOT_COUNTRIES.some((code) => code === value);
}

export function normalizePilotSatisfactionInput(input: PilotSatisfactionInput) {
  if (!isPilotSurveyScope(input.scope) || !isPilotCountry(input.countryCode)) {
    throw new Error("INVALID_PILOT_SURVEY");
  }
  const ratings: PilotRatings = {
    contentClarity: input.contentClarity,
    practicalRelevance: input.practicalRelevance,
    usability: input.usability,
    overallSatisfaction: input.overallSatisfaction,
  };
  if (
    !Object.values(ratings).every((value) => Number.isInteger(value) && value >= 1 && value <= 5)
  ) {
    throw new Error("INVALID_PILOT_RATING");
  }
  if (input.caseStudyId !== undefined && typeof input.caseStudyId !== "string") {
    throw new Error("INVALID_CASE_STUDY");
  }
  const trimmedCaseStudyId = input.caseStudyId?.trim() ?? "";
  const caseStudyId = trimmedCaseStudyId.length > 0 ? trimmedCaseStudyId : null;
  if (
    (input.scope === "curriculum" && caseStudyId !== null) ||
    (input.scope === "eportfolio" && (!caseStudyId || caseStudyId.length > 100))
  ) {
    throw new Error("INVALID_CASE_STUDY");
  }
  const optionalText = (value: string | undefined) => {
    if (typeof value !== "string" && typeof value !== "undefined") {
      throw new Error("INVALID_TEXT");
    }
    const trimmedText = value?.trim() ?? "";
    const text = trimmedText.length > 0 ? trimmedText : null;
    if (text && text.length > 2000) throw new Error("TEXT_TOO_LONG");
    return text;
  };
  return {
    scope: input.scope,
    countryCode: input.countryCode,
    caseStudyId,
    ...ratings,
    strengths: optionalText(input.strengths),
    improvements: optionalText(input.improvements),
  };
}
