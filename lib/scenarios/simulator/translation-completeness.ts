import type { AppLocale } from "@/lib/i18n/locales";
import { createChallengeId, createChoiceId } from "@/lib/scenarios/simulator/format";
import type {
  ChallengeId,
  ChoiceId,
  ScenarioDefinition,
  ScenarioId,
} from "@/lib/scenarios/simulator/types";
import { CHALLENGE_NUMBERS, CHOICE_NUMBERS } from "@/lib/scenarios/simulator/types";

export const SCENARIO_TRANSLATION_REQUIRED_FIELDS = ["question", "answer", "feedback"] as const;

export type ScenarioTranslationRequiredField =
  (typeof SCENARIO_TRANSLATION_REQUIRED_FIELDS)[number];

export type ScenarioTranslationCompletenessIssue = {
  readonly scenarioId: ScenarioId;
  readonly locale: AppLocale;
  readonly challengeId: ChallengeId;
  readonly choiceId?: ChoiceId;
  readonly field: ScenarioTranslationRequiredField;
  readonly path: string;
  readonly message: string;
};

export type ScenarioTranslationCompletenessCounts = {
  readonly questions: {
    readonly required: number;
    readonly missing: number;
  };
  readonly answers: {
    readonly required: number;
    readonly missing: number;
  };
  readonly feedbacks: {
    readonly required: number;
    readonly missing: number;
  };
};

export type ScenarioTranslationCompletenessReport = {
  readonly scenarioId: ScenarioId;
  readonly locale: AppLocale;
  readonly isComplete: boolean;
  readonly counts: ScenarioTranslationCompletenessCounts;
  readonly issues: readonly ScenarioTranslationCompletenessIssue[];
};

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as UnknownRecord;
}

function hasNonEmptyText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function createIssue(
  scenarioId: ScenarioId,
  locale: AppLocale,
  challengeId: ChallengeId,
  field: ScenarioTranslationRequiredField,
  path: string,
  choiceId?: ChoiceId,
): ScenarioTranslationCompletenessIssue {
  const subject =
    field === "question" ? "question" : field === "answer" ? "answer text" : "decision feedback";

  return {
    scenarioId,
    locale,
    challengeId,
    choiceId,
    field,
    path,
    message: `Missing ${subject} in ${locale} translation at ${path}.`,
  };
}

/**
 * Checks raw locale content before the English fallback is applied.
 *
 * A translation is complete when every challenge has a non-empty question
 * and every defined choice has both non-empty answer text and feedback body.
 *
 * Optional feedback sections such as title, consequence and takeaway are not
 * treated as required because the scenario data model intentionally allows a
 * single complete feedback paragraph.
 */
export function validateScenarioTranslationCompleteness<const TScenarioId extends ScenarioId>(
  definition: ScenarioDefinition<TScenarioId>,
  locale: AppLocale,
  localizedContent: unknown,
): ScenarioTranslationCompletenessReport {
  const issues: ScenarioTranslationCompletenessIssue[] = [];
  const content = asRecord(localizedContent);
  const localizedChallenges = asRecord(content?.challenges);

  for (const challengeNumber of CHALLENGE_NUMBERS) {
    const challengeId = createChallengeId(definition.id, challengeNumber);
    const localizedChallenge = asRecord(localizedChallenges?.[challengeId]);
    const questionPath = `challenges.${challengeId}.question`;

    if (!hasNonEmptyText(localizedChallenge?.question)) {
      issues.push(createIssue(definition.id, locale, challengeId, "question", questionPath));
    }

    const localizedChoices = asRecord(localizedChallenge?.choices);

    for (const choiceNumber of CHOICE_NUMBERS) {
      const choiceId = createChoiceId(challengeId, choiceNumber);
      const localizedChoice = asRecord(localizedChoices?.[choiceId]);

      const answerPath = `challenges.${challengeId}.choices.${choiceId}.text`;

      const feedbackPath = `challenges.${challengeId}.choices.${choiceId}.feedback.body`;

      if (!hasNonEmptyText(localizedChoice?.text)) {
        issues.push(
          createIssue(definition.id, locale, challengeId, "answer", answerPath, choiceId),
        );
      }

      const feedback = asRecord(localizedChoice?.feedback);

      if (!hasNonEmptyText(feedback?.body)) {
        issues.push(
          createIssue(definition.id, locale, challengeId, "feedback", feedbackPath, choiceId),
        );
      }
    }
  }

  const missingQuestions = issues.filter((issue) => issue.field === "question").length;

  const missingAnswers = issues.filter((issue) => issue.field === "answer").length;

  const missingFeedbacks = issues.filter((issue) => issue.field === "feedback").length;

  return {
    scenarioId: definition.id,
    locale,
    isComplete: issues.length === 0,

    counts: {
      questions: {
        required: CHALLENGE_NUMBERS.length,
        missing: missingQuestions,
      },

      answers: {
        required: CHALLENGE_NUMBERS.length * CHOICE_NUMBERS.length,
        missing: missingAnswers,
      },

      feedbacks: {
        required: CHALLENGE_NUMBERS.length * CHOICE_NUMBERS.length,
        missing: missingFeedbacks,
      },
    },

    issues,
  };
}

export function formatScenarioTranslationCompletenessReport(
  report: ScenarioTranslationCompletenessReport,
): string {
  if (report.isComplete) {
    return `${report.scenarioId} (${report.locale}) translation is complete.`;
  }

  const summary =
    `${report.scenarioId} (${report.locale}) translation is incomplete: ` +
    `${report.counts.questions.missing} question(s), ` +
    `${report.counts.answers.missing} answer(s), ` +
    `${report.counts.feedbacks.missing} feedback(s) missing.`;

  return [summary, ...report.issues.map((issue) => `- ${issue.message}`)].join("\n");
}

export function assertScenarioTranslationComplete<const TScenarioId extends ScenarioId>(
  definition: ScenarioDefinition<TScenarioId>,
  locale: AppLocale,
  localizedContent: unknown,
): void {
  const report = validateScenarioTranslationCompleteness(definition, locale, localizedContent);

  if (!report.isComplete) {
    throw new Error(formatScenarioTranslationCompletenessReport(report));
  }
}
