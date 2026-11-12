import { prisma } from "@/lib/prisma";
import { currentScenarioFilters } from "@/lib/wp4-surveys/activity";
import type { Prisma } from "@prisma/client";

export const EVALUATION_AREAS = [
  "wp3",
  "wp4_case_studies",
  "wp4_scenarios",
  "wp4_platform",
] as const;
export type EvaluationArea = (typeof EVALUATION_AREAS)[number];
export type EvaluationGroup = "pilot" | "standard";
export type EvaluationRole = "educator" | "learner" | "admin";

export type EvaluationData = {
  roles: Array<{ id: string; role: EvaluationRole }>;
  participations: Array<{
    userId: string;
    track: "wp3_curriculum" | "wp4_case_studies" | "wp4_scenarios";
    countryCode: string;
    cohortCode: string;
    status: "active" | "completed" | "withdrawn";
  }>;
  curriculum: Array<{
    userId: string;
    preAssessmentCompletedAt: Date | null;
    postAssessmentCompletedAt: Date | null;
    preAssessmentAverageScore: number | null;
    postAssessmentAverageScore: number | null;
    submissions: Array<{
      type: "pre" | "post";
      submittedAt: Date;
      modulesCompletedBeforeSubmission: number;
      answers: Array<{
        valueInt: number | null;
        valueText: string | null;
        question: { key: string };
      }>;
    }>;
  }>;
  courses: Array<{
    userId: string;
    courseId: string;
    status: string;
    startedAt: Date | null;
    completedAt: Date | null;
  }>;
  cases: Array<{
    userId: string;
    caseStudyId: string;
    status: string;
    startedAt: Date | null;
    lastOpenedAt: Date | null;
    completedAt: Date | null;
  }>;
  scenarios: Array<{ userId: string; scenarioId: string; status: string }>;
  surveys: Array<{
    surveyType: string;
    surveyVersion: number;
    roundKey: string;
    userId: string;
    locale: string;
    countryCode: string | null;
    roleAtSubmission: EvaluationRole;
    isPilotAtSubmission: boolean;
    pilotCohortCode: string | null;
    answers: Prisma.JsonValue;
    activitySnapshot: Prisma.JsonValue;
    submittedAt: Date;
  }>;
};

export type EvaluationRow = {
  area: EvaluationArea;
  countryCode: string | null;
  cohortCode: string | null;
  group: EvaluationGroup;
  role: EvaluationRole;
  participants: number;
  respondents: number;
  preResponses: number;
  postResponses: number;
  contentResponses: number;
  platformResponses: number;
  materialsStarted: number;
  materialsCompleted: number;
  averagePre: number | null;
  averagePost: number | null;
  averageContent: number | null;
  averagePlatform: number | null;
};

export type EvaluationReport = {
  summary: {
    participants: number;
    pilotParticipants: number;
    totalResponses: number;
    preResponses: number;
    postResponses: number;
    contentResponses: number;
    platformResponses: number;
    materialsStarted: number;
    materialsCompleted: number;
  };
  rows: EvaluationRow[];
};

type Segment = Pick<EvaluationRow, "area" | "countryCode" | "cohortCode" | "group" | "role">;
type Bucket = {
  segment: Segment;
  participants: Set<string>;
  respondents: Set<string>;
  preResponses: number;
  postResponses: number;
  contentResponses: number;
  platformResponses: number;
  startedIds: Set<string>;
  completedIds: Set<string>;
  preScores: number[];
  postScores: number[];
  contentScores: number[];
  platformScores: number[];
};

function average(values: number[]) {
  if (values.length === 0) return null;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function asRecord(value: Prisma.JsonValue): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value
    : null;
}

function validRating(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

export function surveyArea(type: string): EvaluationArea | null {
  switch (type) {
    case "platform_wp3":
      return "wp3";
    case "wp4_case_studies":
      return "wp4_case_studies";
    case "wp4_scenarios":
      return "wp4_scenarios";
    case "platform_wp4":
      return "wp4_platform";
    default:
      return null;
  }
}

function participationArea(
  track: EvaluationData["participations"][number]["track"],
): EvaluationArea {
  return track === "wp3_curriculum" ? "wp3" : track;
}

function segmentKey(segment: Segment) {
  return JSON.stringify([
    segment.area,
    segment.countryCode,
    segment.cohortCode,
    segment.group,
    segment.role,
  ]);
}

/** Country and cohort are taken from explicit participation, never inferred from locale. */
export function getParticipationSegments(
  userId: string,
  area: EvaluationArea,
  role: EvaluationRole,
  participations: EvaluationData["participations"],
): Segment[] {
  const eligibleTracks =
    area === "wp3"
      ? ["wp3_curriculum"]
      : area === "wp4_platform"
        ? ["wp4_case_studies", "wp4_scenarios"]
        : [area];
  const pilotSegments = participations
    .filter(
      (p) => p.userId === userId && p.status !== "withdrawn" && eligibleTracks.includes(p.track),
    )
    .map((p) => ({
      area,
      countryCode: p.countryCode,
      cohortCode: p.cohortCode,
      group: "pilot" as const,
      role,
    }));
  if (pilotSegments.length === 0) {
    return [{ area, countryCode: null, cohortCode: null, group: "standard", role }];
  }
  return [...new Map(pilotSegments.map((item) => [segmentKey(item), item])).values()];
}

/** Aggregate without returning profile identifiers, email addresses or open answers to the client. */
export function buildEvaluationReport(data: EvaluationData): EvaluationReport {
  const roleByUser = new Map(data.roles.map((item) => [item.id, item.role]));
  const buckets = new Map<string, Bucket>();
  const allParticipants = new Set<string>();
  const pilots = new Set<string>();
  const allStarted = new Set<string>();
  const allCompleted = new Set<string>();

  const bucketFor = (segment: Segment): Bucket => {
    const key = segmentKey(segment);
    let found = buckets.get(key);
    if (!found) {
      found = {
        segment,
        participants: new Set(),
        respondents: new Set(),
        preResponses: 0,
        postResponses: 0,
        contentResponses: 0,
        platformResponses: 0,
        startedIds: new Set(),
        completedIds: new Set(),
        preScores: [],
        postScores: [],
        contentScores: [],
        platformScores: [],
      };
      buckets.set(key, found);
    }
    return found;
  };
  const forUser = (userId: string, area: EvaluationArea, action: (bucket: Bucket) => void) => {
    const role = roleByUser.get(userId);
    if (!role || role === "admin") return;
    allParticipants.add(userId);
    const segments = getParticipationSegments(userId, area, role, data.participations);
    for (const segment of segments) {
      const bucket = bucketFor(segment);
      bucket.participants.add(userId);
      action(bucket);
    }
  };

  for (const participation of data.participations) {
    if (participation.status === "withdrawn" || roleByUser.get(participation.userId) === "admin")
      continue;
    pilots.add(participation.userId);
    forUser(participation.userId, participationArea(participation.track), () => {});
    if (participation.track !== "wp3_curriculum") {
      forUser(participation.userId, "wp4_platform", () => {});
    }
  }

  for (const attempt of data.courses) {
    if (roleByUser.get(attempt.userId) === "admin") continue;
    const globalKey = `wp3:${attempt.userId}:${attempt.courseId}`;
    if (attempt.status !== "not_started" || attempt.startedAt || attempt.completedAt)
      allStarted.add(globalKey);
    if (attempt.status === "completed" || attempt.completedAt) {
      allCompleted.add(globalKey);
      allStarted.add(globalKey);
    }
    forUser(attempt.userId, "wp3", (bucket) => {
      const key = `${attempt.userId}:${attempt.courseId}`;
      if (attempt.status !== "not_started" || attempt.startedAt || attempt.completedAt) {
        bucket.startedIds.add(key);
      }
      if (attempt.status === "completed" || attempt.completedAt) {
        bucket.completedIds.add(key);
        bucket.startedIds.add(key);
      }
    });
  }
  for (const progress of data.cases) {
    if (roleByUser.get(progress.userId) === "admin") continue;
    const globalKey = `wp4_case_studies:${progress.userId}:${progress.caseStudyId}`;
    if (
      progress.status !== "not_started" ||
      progress.startedAt ||
      progress.lastOpenedAt ||
      progress.completedAt
    )
      allStarted.add(globalKey);
    if (progress.status === "completed" || progress.completedAt) {
      allCompleted.add(globalKey);
      allStarted.add(globalKey);
    }
    forUser(progress.userId, "wp4_case_studies", (bucket) => {
      const key = `${progress.userId}:${progress.caseStudyId}`;
      if (
        progress.status !== "not_started" ||
        progress.startedAt ||
        progress.lastOpenedAt ||
        progress.completedAt
      ) {
        bucket.startedIds.add(key);
      }
      if (progress.status === "completed" || progress.completedAt) {
        bucket.completedIds.add(key);
        bucket.startedIds.add(key);
      }
    });
  }
  for (const attempt of data.scenarios) {
    if (roleByUser.get(attempt.userId) === "admin") continue;
    const globalKey = `wp4_scenarios:${attempt.userId}:${attempt.scenarioId}`;
    allStarted.add(globalKey);
    if (attempt.status === "completed") allCompleted.add(globalKey);
    forUser(attempt.userId, "wp4_scenarios", (bucket) => {
      const key = `${attempt.userId}:${attempt.scenarioId}`;
      bucket.startedIds.add(key);
      if (attempt.status === "completed") bucket.completedIds.add(key);
    });
  }

  for (const pilot of data.curriculum) {
    forUser(pilot.userId, "wp3", (bucket) => {
      for (const submission of pilot.submissions) {
        bucket.respondents.add(pilot.userId);
        if (submission.type === "pre") {
          bucket.preResponses += 1;
          if (pilot.preAssessmentAverageScore !== null) {
            bucket.preScores.push(pilot.preAssessmentAverageScore);
          }
        } else {
          bucket.postResponses += 1;
          if (pilot.postAssessmentAverageScore !== null) {
            bucket.postScores.push(pilot.postAssessmentAverageScore);
          }
        }
      }
    });
  }

  for (const submission of data.surveys) {
    const area = surveyArea(submission.surveyType);
    if (!area || submission.roleAtSubmission === "admin") continue;
    const answers = asRecord(submission.answers);
    const role = submission.roleAtSubmission;
    const snapshotSegment: Segment = {
      area,
      group: submission.isPilotAtSubmission ? "pilot" : "standard",
      countryCode: submission.countryCode,
      cohortCode: submission.isPilotAtSubmission ? submission.pilotCohortCode : null,
      role,
    };
    allParticipants.add(submission.userId);
    const bucket = bucketFor(snapshotSegment);
    bucket.participants.add(submission.userId);
    bucket.respondents.add(submission.userId);
    if (submission.surveyType.startsWith("platform_")) {
      bucket.platformResponses += 1;
      const score = answers?.overallSatisfaction;
      if (validRating(score)) bucket.platformScores.push(score);
    } else {
      bucket.contentResponses += 1;
      const keys =
        submission.surveyType === "wp4_case_studies"
          ? ["engagementEase", "greenTransitionUnderstanding", "esgEcosystemUnderstanding"]
          : ["incorporationEase", "participantEngagement"];
      for (const key of keys) {
        const score = answers?.[key];
        if (validRating(score)) bucket.contentScores.push(score);
      }
    }
  }

  const relevantCurriculum = data.curriculum.filter(
    (row) => roleByUser.get(row.userId) !== "admin",
  );
  const rows: EvaluationRow[] = [...buckets.values()]
    .map((bucket) => ({
      ...bucket.segment,
      participants: bucket.participants.size,
      respondents: bucket.respondents.size,
      preResponses: bucket.preResponses,
      postResponses: bucket.postResponses,
      contentResponses: bucket.contentResponses,
      platformResponses: bucket.platformResponses,
      materialsStarted: bucket.startedIds.size,
      materialsCompleted: bucket.completedIds.size,
      averagePre: average(bucket.preScores),
      averagePost: average(bucket.postScores),
      averageContent: average(bucket.contentScores),
      averagePlatform: average(bucket.platformScores),
    }))
    .sort((a, b) =>
      [a.area, a.countryCode ?? "", a.group, a.cohortCode ?? "", a.role]
        .join(":")
        .localeCompare(
          [b.area, b.countryCode ?? "", b.group, b.cohortCode ?? "", b.role].join(":"),
        ),
    );

  return {
    summary: {
      participants: allParticipants.size,
      pilotParticipants: pilots.size,
      totalResponses: relevantCurriculum.reduce(
        (total, row) => total + row.submissions.length,
        data.surveys.filter(
          (row) => surveyArea(row.surveyType) !== null && row.roleAtSubmission !== "admin",
        ).length,
      ),
      preResponses: relevantCurriculum.reduce(
        (sum, row) => sum + row.submissions.filter((item) => item.type === "pre").length,
        0,
      ),
      postResponses: relevantCurriculum.reduce(
        (sum, row) => sum + row.submissions.filter((item) => item.type === "post").length,
        0,
      ),
      contentResponses: data.surveys.filter(
        (row) =>
          row.roleAtSubmission !== "admin" &&
          (row.surveyType === "wp4_case_studies" || row.surveyType === "wp4_scenarios"),
      ).length,
      platformResponses: data.surveys.filter(
        (row) =>
          row.roleAtSubmission !== "admin" &&
          (row.surveyType === "platform_wp3" || row.surveyType === "platform_wp4"),
      ).length,
      materialsStarted: allStarted.size,
      materialsCompleted: allCompleted.size,
    },
    rows,
  };
}

/** Database read is isolated from aggregation to keep evaluation metrics unit-testable. */
export async function loadEvaluationData(): Promise<EvaluationData> {
  const [roles, participations, curriculum, courses, cases, scenarios, surveys] = await Promise.all(
    [
      prisma.profile.findMany({ select: { id: true, role: true } }),
      prisma.pilotParticipation.findMany({
        select: { userId: true, track: true, countryCode: true, cohortCode: true, status: true },
      }),
      prisma.curriculumPilot.findMany({
        select: {
          userId: true,
          preAssessmentCompletedAt: true,
          postAssessmentCompletedAt: true,
          preAssessmentAverageScore: true,
          postAssessmentAverageScore: true,
          submissions: {
            select: {
              type: true,
              submittedAt: true,
              modulesCompletedBeforeSubmission: true,
              answers: {
                select: { valueInt: true, valueText: true, question: { select: { key: true } } },
              },
            },
          },
        },
      }),
      prisma.userCourseAttempt.findMany({
        where: { course: { status: "published" } },
        select: { userId: true, courseId: true, status: true, startedAt: true, completedAt: true },
      }),
      prisma.userCaseStudyProgress.findMany({
        where: { caseStudy: { status: "published" } },
        select: {
          userId: true,
          caseStudyId: true,
          status: true,
          startedAt: true,
          lastOpenedAt: true,
          completedAt: true,
        },
      }),
      prisma.userScenarioAttempt.findMany({
        where: { OR: currentScenarioFilters() },
        select: { userId: true, scenarioId: true, status: true },
      }),
      prisma.surveySubmission.findMany({
        where: {
          surveyType: { in: ["wp4_case_studies", "wp4_scenarios", "platform_wp3", "platform_wp4"] },
        },
        select: {
          surveyType: true,
          surveyVersion: true,
          roundKey: true,
          userId: true,
          locale: true,
          countryCode: true,
          roleAtSubmission: true,
          isPilotAtSubmission: true,
          pilotCohortCode: true,
          answers: true,
          activitySnapshot: true,
          submittedAt: true,
        },
      }),
    ],
  );
  return { roles, participations, curriculum, courses, cases, scenarios, surveys };
}

export async function getEvaluationReport(): Promise<EvaluationReport> {
  return buildEvaluationReport(await loadEvaluationData());
}
