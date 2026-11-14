/** Approved platform evaluation: shared unchanged by WP3 and WP4. */
export const PLATFORM_RATING_KEYS = [
  "easeOfUse",
  "moduleClarity",
  "navigation",
  "testsExperience",
  "technicalProblems",
  "overallSatisfaction",
] as const;
export type PlatformRatingKey = (typeof PLATFORM_RATING_KEYS)[number];
export const PLATFORM_TEXT_KEYS = ["suggestions", "technicalNotes"] as const;
export const PLATFORM_SURVEY_VERSION = 1;
