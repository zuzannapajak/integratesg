import { APP_ROLES } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const WP3_PLATFORM_SURVEY_TYPE = "platform_wp3";
export const WP3_PLATFORM_SURVEY_VERSION = 1;

type EligibilityDb = Pick<
  Prisma.TransactionClient,
  "profile" | "pilotParticipation" | "curriculumPilot" | "surveySubmission"
>;

type PilotAssignment = { cohortCode: string; countryCode: string };

export function isWp3PlatformSurveyEligible(params: {
  role: string | null;
  assignment: PilotAssignment | null;
  postSubmitted: boolean;
  alreadySubmitted: boolean;
}) {
  return (
    params.role === APP_ROLES.educator &&
    params.assignment !== null &&
    params.postSubmitted &&
    !params.alreadySubmitted
  );
}

/** Pilot membership must come from an explicit, active assignment, never CurriculumPilot.status. */
export async function getWp3PlatformFeedbackEligibility(
  userId: string,
  db: EligibilityDb = prisma,
): Promise<{ eligible: boolean; assignment: PilotAssignment | null }> {
  const [profile, assignment, assessment] = await Promise.all([
    db.profile.findUnique({ where: { id: userId }, select: { role: true } }),
    db.pilotParticipation.findFirst({
      where: { userId, track: "wp3_curriculum", status: "active" },
      select: { cohortCode: true, countryCode: true },
    }),
    db.curriculumPilot.findUnique({
      where: { userId },
      select: { postAssessmentCompletedAt: true },
    }),
  ]);

  if (profile?.role !== APP_ROLES.educator || !assignment || !assessment?.postAssessmentCompletedAt) {
    return { eligible: false, assignment: null };
  }

  const existing = await db.surveySubmission.findUnique({
    where: {
      userId_surveyType_roundKey: {
        userId,
        surveyType: WP3_PLATFORM_SURVEY_TYPE,
        roundKey: assignment.cohortCode,
      },
    },
    select: { id: true },
  });

  return {
    eligible: isWp3PlatformSurveyEligible({
      role: profile.role,
      assignment,
      postSubmitted: true,
      alreadySubmitted: Boolean(existing),
    }),
    assignment,
  };
}
