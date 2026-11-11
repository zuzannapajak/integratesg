import { APP_ROLES } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";
import { getWp4ActivitySnapshot } from "@/lib/wp4-surveys/activity";
import {
  WP4_SURVEY_ROUND,
  WP4_SURVEY_TYPES,
  type Wp4SurveyScope,
} from "@/lib/wp4-surveys/definition";
import type { Prisma } from "@prisma/client";

type Wp4Db = Pick<
  Prisma.TransactionClient,
  | "profile"
  | "pilotParticipation"
  | "surveySubmission"
  | "userCaseStudyProgress"
  | "userScenarioAttempt"
>;

export function isWp4SurveyEligible(params: {
  scope: Wp4SurveyScope;
  role: string | null;
  completed: number;
  submitted: boolean;
}) {
  const allowedRole =
    params.scope === "case-studies"
      ? params.role === APP_ROLES.learner || params.role === APP_ROLES.educator
      : params.role === APP_ROLES.educator;
  return allowedRole && params.completed > 0 && !params.submitted;
}

export async function getWp4SurveyAvailability(
  userId: string,
  scope: Wp4SurveyScope,
  db: Wp4Db = prisma,
) {
  const [profile, previous, activity, pilotAssignment] = await Promise.all([
    db.profile.findUnique({ where: { id: userId }, select: { role: true } }),
    db.surveySubmission.findUnique({
      where: {
        userId_surveyType_roundKey: {
          userId,
          surveyType: WP4_SURVEY_TYPES[scope],
          roundKey: WP4_SURVEY_ROUND,
        },
      },
      select: { submittedAt: true },
    }),
    getWp4ActivitySnapshot(userId, db),
    db.pilotParticipation.findFirst({
      where: { userId, track: WP4_SURVEY_TYPES[scope], status: "active" },
      select: { countryCode: true, cohortCode: true },
    }),
  ]);
  const completed =
    scope === "case-studies" ? activity.caseStudiesCompleted : activity.scenariosCompleted;
  return {
    eligible: isWp4SurveyEligible({
      scope,
      role: profile?.role ?? null,
      completed,
      submitted: Boolean(previous),
    }),
    submittedAt: previous?.submittedAt.toISOString() ?? null,
    activity,
    pilotAssignment,
  };
}
