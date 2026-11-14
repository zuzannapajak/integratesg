/** Informal suggestions and bug reports are not WP3/WP4 pilot evaluation surveys. */
export const GENERAL_FEEDBACK_SURVEY_TYPE = "general_platform_feedback";
export const GENERAL_FEEDBACK_SURVEY_VERSION = 1;

export const GENERAL_FEEDBACK_CATEGORIES = ["bug", "suggestion", "content", "other"] as const;
export type GeneralFeedbackCategory = (typeof GENERAL_FEEDBACK_CATEGORIES)[number];

export const GENERAL_FEEDBACK_MAX_LENGTH = 4000;

export type GeneralFeedbackInput = {
  locale: string;
  category: GeneralFeedbackCategory;
  message: string;
};

export function isGeneralFeedbackCategory(value: unknown): value is GeneralFeedbackCategory {
  return (
    typeof value === "string" &&
    GENERAL_FEEDBACK_CATEGORIES.some((candidate) => candidate === value)
  );
}

/** Validated server-side, regardless of the values posted by the browser. */
export function validateGeneralFeedback(input: unknown): {
  locale: string;
  category: GeneralFeedbackCategory;
  message: string;
} {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("INVALID_FEEDBACK");
  }
  const data = input as Record<string, unknown>;
  const { locale, category, message } = data;
  if (typeof locale !== "string") throw new Error("INVALID_LOCALE");
  if (!isGeneralFeedbackCategory(category)) throw new Error("INVALID_CATEGORY");
  if (typeof message !== "string") throw new Error("INVALID_MESSAGE");
  const trimmed = message.trim();
  if (trimmed.length === 0 || trimmed.length > GENERAL_FEEDBACK_MAX_LENGTH) {
    throw new Error("INVALID_MESSAGE");
  }
  return { locale, category, message: trimmed };
}
