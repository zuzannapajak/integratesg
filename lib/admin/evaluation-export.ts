import {
  getParticipationSegments,
  surveyArea,
  type EvaluationData,
  type EvaluationReport,
} from "@/lib/admin/evaluation";
import { PLATFORM_RATING_KEYS, PLATFORM_TEXT_KEYS } from "@/lib/platform-feedback/definition";
import { WP4_SKILLS } from "@/lib/wp4-surveys/definition";
import type { Prisma } from "@prisma/client";

type CsvScalar = string | number | boolean | null | undefined;

/** Escape spreadsheet formulas, quotes, separators and line breaks. No raw profile identifiers. */
export function csvCell(value: CsvScalar): string {
  const text = value === null || value === undefined ? "" : String(value);
  // Leading whitespace and control characters can be ignored by spreadsheet formula parsers.
  const safe = /^[\s\u0000-\u001f]*[=+@\-]/u.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

function csv(headers: readonly string[], rows: CsvScalar[][]): string {
  return `\uFEFF${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
}

export function buildEvaluationSummaryCsv(report: EvaluationReport): string {
  const headers = [
    "work_package",
    "country_code",
    "cohort",
    "group",
    "role",
    "participants",
    "respondents",
    "pre_responses",
    "post_responses",
    "content_responses",
    "platform_responses",
    "unique_materials_started",
    "unique_materials_completed",
    "average_pre",
    "average_post",
    "average_content_rating",
    "average_platform_rating",
  ];
  const rows = report.rows.map((row) => [
    row.area,
    row.countryCode,
    row.cohortCode,
    row.group,
    row.role,
    row.participants,
    row.respondents,
    row.preResponses,
    row.postResponses,
    row.contentResponses,
    row.platformResponses,
    row.materialsStarted,
    row.materialsCompleted,
    row.averagePre,
    row.averagePost,
    row.averageContent,
    row.averagePlatform,
  ]);
  return csv(headers, rows);
}

function record(value: Prisma.JsonValue): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}

const CONTENT_RATINGS = [
  "engagementEase",
  "greenTransitionUnderstanding",
  "esgEcosystemUnderstanding",
  "incorporationEase",
  "participantEngagement",
] as const;
const TEXT_QUESTIONS = [
  "challenges",
  "implementationChallenges",
  "improvements",
  ...PLATFORM_TEXT_KEYS,
] as const;
const SNAPSHOT_NUMBERS = [
  "modulesStarted",
  "modulesCompleted",
  "caseStudiesStarted",
  "caseStudiesCompleted",
  "scenariosStarted",
  "scenariosCompleted",
] as const;

function safeRating(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5
    ? value
    : null;
}
function safeCount(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : null;
}
function safeText(value: unknown): string | null {
  return typeof value === "string" ? value.slice(0, 2000) : null;
}
function skills(value: unknown): string | null {
  return Array.isArray(value) && value.every((item) => WP4_SKILLS.some((skill) => skill === item))
    ? value.join(";")
    : null;
}

/**
 * Anonymous row-level export. Qualitative answers require explicit opt-in; they may themselves
 * contain names or other personal information supplied by respondents.
 */
export function buildEvaluationResponsesCsv(
  data: EvaluationData,
  options: { includeText?: boolean } = {},
): string {
  const headers = [
    "work_package",
    "survey_type",
    "version",
    "submitted_date",
    "country_code",
    "cohort",
    "group",
    "role",
    "locale",
    "round",
    "assessment_average",
    "skills",
    ...PLATFORM_RATING_KEYS,
    ...CONTENT_RATINGS,
    ...SNAPSHOT_NUMBERS,
    "answers_json",
    ...(options.includeText ? TEXT_QUESTIONS : []),
  ];
  type ExportRow = { submittedAt: string; cells: CsvScalar[] };
  const exportRows: ExportRow[] = [];

  for (const submission of data.surveys) {
    const area = surveyArea(submission.surveyType);
    if (!area || submission.roleAtSubmission === "admin") continue;
    const answers = record(submission.answers);
    const snapshot = record(submission.activitySnapshot);
    // Use only approved keys, not arbitrary JSON or material IDs from the database.
    const selectedAnswers = Object.fromEntries(
      [...PLATFORM_RATING_KEYS, ...CONTENT_RATINGS].flatMap((key) => {
        const score = safeRating(answers[key]);
        return score === null ? [] : [[key, score]];
      }),
    );
    const cells: CsvScalar[] = [
      area,
      submission.surveyType,
      submission.surveyVersion,
      submission.submittedAt.toISOString().slice(0, 10),
      submission.countryCode,
      submission.isPilotAtSubmission ? submission.pilotCohortCode : null,
      submission.isPilotAtSubmission ? "pilot" : "standard",
      submission.roleAtSubmission,
      submission.locale,
      submission.roundKey,
      null,
      skills(answers.skills),
      ...PLATFORM_RATING_KEYS.map((key) => safeRating(answers[key])),
      ...CONTENT_RATINGS.map((key) => safeRating(answers[key])),
      ...SNAPSHOT_NUMBERS.map((key) => safeCount(snapshot[key])),
      JSON.stringify(selectedAnswers),
      ...(options.includeText ? TEXT_QUESTIONS.map((key) => safeText(answers[key])) : []),
    ];
    exportRows.push({ submittedAt: submission.submittedAt.toISOString(), cells });
  }

  const roleByUser = new Map(data.roles.map((role) => [role.id, role.role]));
  for (const user of data.curriculum) {
    const role = roleByUser.get(user.userId);
    if (!role || role === "admin") continue;
    const groups = getParticipationSegments(user.userId, "wp3", role, data.participations);
    for (const submission of user.submissions) {
      // PRE/POST history has no locale snapshot. Do not infer it from preferredLanguage.
      const group = groups.length === 1 ? groups[0] : null;
      const numericAnswers: Record<string, number> = {};
      const textAnswers: Record<string, string> = {};
      for (const answer of submission.answers) {
        if (typeof answer.valueInt === "number")
          numericAnswers[answer.question.key] = answer.valueInt;
        if (options.includeText && answer.valueText) {
          textAnswers[answer.question.key] = answer.valueText.slice(0, 2000);
        }
      }
      const area = "wp3";
      const avg =
        submission.type === "pre"
          ? user.preAssessmentAverageScore
          : user.postAssessmentAverageScore;
      exportRows.push({
        submittedAt: submission.submittedAt.toISOString(),
        cells: [
          area,
          `wp3_${submission.type}`,
          1,
          submission.submittedAt.toISOString().slice(0, 10),
          group?.countryCode,
          group?.cohortCode,
          group?.group ?? "standard",
          role,
          null,
          "initial",
          avg,
          null,
          ...PLATFORM_RATING_KEYS.map(() => null),
          ...CONTENT_RATINGS.map(() => null),
          null,
          submission.modulesCompletedBeforeSubmission,
          ...SNAPSHOT_NUMBERS.slice(2).map(() => null),
          JSON.stringify(
            options.includeText ? { ...numericAnswers, ...textAnswers } : numericAnswers,
          ),
          ...(options.includeText ? TEXT_QUESTIONS.map(() => null) : []),
        ],
      });
    }
  }

  exportRows.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
  return csv(
    headers,
    exportRows.map((row) => row.cells),
  );
}
