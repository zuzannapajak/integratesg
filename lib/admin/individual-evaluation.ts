import {
  getParticipationSegments,
  surveyArea,
  type EvaluationData,
  type EvaluationRole,
} from "@/lib/admin/evaluation";
import { csvCell } from "@/lib/admin/evaluation-export";

export const INDIVIDUAL_SURVEY_TYPES = [
  "wp3_pre",
  "wp3_post",
  "wp4_case_studies",
  "wp4_scenarios",
  "platform_wp3",
  "platform_wp4",
] as const;
export type IndividualSurveyType = (typeof INDIVIDUAL_SURVEY_TYPES)[number];
export const INDIVIDUAL_PAGE_SIZE = 20;
export type EvaluationResponseData = Pick<
  EvaluationData,
  "roles" | "participations" | "curriculum" | "surveys"
>;

export type IndividualResponse = {
  key: string;
  surveyType: IndividualSurveyType;
  surveyVersion: number;
  submittedAt: string;
  countryCode: string | null;
  cohortCode: string | null;
  group: "pilot" | "standard";
  role: "learner" | "educator";
  locale: string | null;
  answers: Record<string, number | string | string[]>;
  activity: Record<string, number>;
  qualitative: Record<string, string>;
};

export type IndividualFilters = {
  country: string;
  survey: IndividualSurveyType | "all";
  group: "pilot" | "standard" | "all";
  role: "learner" | "educator" | "all";
  page: number;
};

const CONTENT_RATINGS = [
  "engagementEase",
  "greenTransitionUnderstanding",
  "esgEcosystemUnderstanding",
  "incorporationEase",
  "participantEngagement",
] as const;
const PLATFORM_RATINGS = [
  "easeOfUse",
  "moduleClarity",
  "navigation",
  "testsExperience",
  "technicalProblems",
  "overallSatisfaction",
] as const;
const QUALITATIVE_KEYS = [
  "challenges",
  "implementationChallenges",
  "improvements",
  "suggestions",
  "technicalNotes",
] as const;
const SNAPSHOT_COUNTS = [
  "modulesStarted",
  "modulesCompleted",
  "caseStudiesStarted",
  "caseStudiesCompleted",
  "scenariosStarted",
  "scenariosCompleted",
] as const;

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function validatedAnswers(value: unknown) {
  const source = asRecord(value);
  const answers: IndividualResponse["answers"] = {};
  const qualitative: IndividualResponse["qualitative"] = {};
  for (const key of [...CONTENT_RATINGS, ...PLATFORM_RATINGS]) {
    const raw = source[key];
    if (typeof raw === "number" && Number.isInteger(raw) && raw >= 1 && raw <= 5) {
      answers[key] = raw;
    }
  }
  if (Array.isArray(source.skills) && source.skills.every((skill) => typeof skill === "string")) {
    answers.skills = source.skills.slice(0, 25).map((skill: string) => skill.slice(0, 60));
  }
  for (const key of QUALITATIVE_KEYS) {
    if (typeof source[key] === "string") qualitative[key] = source[key].slice(0, 4000);
  }
  return { answers, qualitative };
}

function validatedActivity(value: unknown) {
  const source = asRecord(value);
  const activity: Record<string, number> = {};
  for (const key of SNAPSHOT_COUNTS) {
    const raw = source[key];
    if (typeof raw === "number" && Number.isInteger(raw) && raw >= 0) activity[key] = raw;
  }
  return activity;
}

/** WP3 legacy PRE/POST have no historical country snapshot; use country only when unambiguous. */
function legacyContext(userId: string, role: EvaluationRole, data: EvaluationResponseData) {
  const segments = getParticipationSegments(userId, "wp3", role, data.participations);
  if (segments.length === 1) return segments[0];
  return { countryCode: null, cohortCode: null, group: "pilot" as const };
}

/** Normalize old WP3 submissions and current WP4/platform submissions without exposing user identity. */
export function buildIndividualResponses(data: EvaluationResponseData): IndividualResponse[] {
  const rows: IndividualResponse[] = [];
  const roleById = new Map(data.roles.map(({ id, role }) => [id, role]));
  data.surveys.forEach((item, index) => {
    if (item.roleAtSubmission === "admin" || surveyArea(item.surveyType) === null) return;
    const parsed = validatedAnswers(item.answers);
    rows.push({
      key: `survey-${index}`,
      surveyType: item.surveyType as IndividualSurveyType,
      surveyVersion: item.surveyVersion,
      submittedAt: item.submittedAt.toISOString(),
      countryCode: item.countryCode,
      cohortCode: item.isPilotAtSubmission ? item.pilotCohortCode : null,
      group: item.isPilotAtSubmission ? "pilot" : "standard",
      role: item.roleAtSubmission,
      locale: item.locale,
      answers: parsed.answers,
      activity: validatedActivity(item.activitySnapshot),
      qualitative: parsed.qualitative,
    });
  });
  data.curriculum.forEach((item, userIndex) => {
    const role = roleById.get(item.userId);
    if (!role || role === "admin") return;
    const context = legacyContext(item.userId, role, data);
    item.submissions.forEach((submission, index) => {
      const answers: IndividualResponse["answers"] = {};
      const qualitative: IndividualResponse["qualitative"] = {};
      for (const answer of submission.answers) {
        const key = answer.question.key;
        if (typeof answer.valueInt === "number" && Number.isInteger(answer.valueInt)) {
          answers[key] = answer.valueInt;
        }
        if (typeof answer.valueText === "string" && answer.valueText.length > 0) {
          qualitative[key] = answer.valueText.slice(0, 4000);
        }
      }
      rows.push({
        key: `curriculum-${userIndex}-${index}`,
        surveyType: submission.type === "pre" ? "wp3_pre" : "wp3_post",
        surveyVersion: 1,
        submittedAt: submission.submittedAt.toISOString(),
        countryCode: context.countryCode,
        cohortCode: context.cohortCode,
        group: context.group,
        role,
        locale: null, // no reliable locale snapshot in historical WP3 submissions
        answers,
        qualitative,
        activity: { modulesCompleted: submission.modulesCompletedBeforeSubmission },
      });
    });
  });
  return rows.sort(
    (a, b) => b.submittedAt.localeCompare(a.submittedAt) || a.key.localeCompare(b.key),
  );
}

export function parseIndividualFilters(params: URLSearchParams): IndividualFilters {
  const type = params.get("survey");
  const country = params.get("country") ?? "all";
  const group = params.get("group");
  const role = params.get("role");
  const rawPage = params.get("page") ?? "1";
  return {
    country: country === "unknown" || /^[A-Z]{2}$/.test(country) ? country : "all",
    survey: INDIVIDUAL_SURVEY_TYPES.find((item) => item === type) ?? "all",
    group: group === "pilot" || group === "standard" ? group : "all",
    role: role === "learner" || role === "educator" ? role : "all",
    page: /^\d{1,6}$/.test(rawPage) ? Math.min(100_000, Math.max(1, Number(rawPage))) : 1,
  };
}

export function filteredIndividualResponses(
  rows: readonly IndividualResponse[],
  filters: IndividualFilters,
): IndividualResponse[] {
  return rows.filter(
    (row) =>
      (filters.country === "all" || (row.countryCode ?? "unknown") === filters.country) &&
      (filters.survey === "all" || row.surveyType === filters.survey) &&
      (filters.group === "all" || row.group === filters.group) &&
      (filters.role === "all" || row.role === filters.role),
  );
}

/** CSV exports all and only filtered rows; default excludes free text / personal identifiers. */
export function buildIndividualResponsesCsv(
  rows: readonly IndividualResponse[],
  includeText = false,
): string {
  const headers = [
    "survey_type",
    "version",
    "submitted_at",
    "country_code",
    "cohort",
    "group",
    "role",
    "locale",
    "answers_json",
    "activity_json",
    ...(includeText ? ["qualitative_answers_json"] : []),
  ];
  const csvRows = rows.map((row) => [
    row.surveyType,
    row.surveyVersion,
    row.submittedAt,
    row.countryCode,
    row.cohortCode,
    row.group,
    row.role,
    row.locale,
    JSON.stringify(row.answers),
    JSON.stringify(row.activity),
    ...(includeText ? [JSON.stringify(row.qualitative)] : []),
  ]);
  return `\uFEFF${[headers, ...csvRows].map((line) => line.map(csvCell).join(",")).join("\r\n")}\r\n`;
}
