import { APP_ROLES } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";
import { WP4_SURVEY_ROUND, WP4_SURVEY_TYPES } from "@/lib/wp4-surveys/definition";
import type { Prisma } from "@prisma/client";

export const WP4_PLATFORM_SURVEY_TYPE = "platform_wp4";
export const WP4_PLATFORM_SURVEY_VERSION = 1;

type Wp4PlatformDb = Pick<
  Prisma.TransactionClient,
  "profile" | "pilotParticipation" | "surveySubmission"
>;
type Assignment = { cohortCode: string; countryCode: string };

/** One platform survey per WP4 pilot cohort, after all assigned WP4 content questionnaires. */
export async function getWp4PlatformFeedbackEligibility(
  userId: string,
  db: Wp4PlatformDb = prisma,
): Promise<{ eligible: boolean; assignment: Assignment | null }> {
  const [profile, participations] = await Promise.all([
    db.profile.findUnique({ where: { id: userId }, select: { role: true } }),
    db.pilotParticipation.findMany({
      where: {
        userId,
        status: "active",
        track: { in: ["wp4_case_studies", "wp4_scenarios"] },
      },
      select: { track: true, cohortCode: true, countryCode: true },
    }),
  ]);

  if (!profile || profile.role === APP_ROLES.admin || participations.length === 0) {
    return { eligible: false, assignment: null };
  }
  // A joint WP4 pilot must use one cohort and country for both tracks.
  if (
    new Set(participations.map((item) => item.cohortCode)).size !== 1 ||
    new Set(participations.map((item) => item.countryCode)).size !== 1 ||
    (profile.role !== APP_ROLES.educator &&
      participations.some((item) => item.track === "wp4_scenarios"))
  ) {
    return { eligible: false, assignment: null };
  }

  const assignment = {
    cohortCode: participations[0].cohortCode,
    countryCode: participations[0].countryCode,
  };
  const requiredSurveys = participations.map((item) =>
    item.track === "wp4_case_studies"
      ? WP4_SURVEY_TYPES["case-studies"]
      : WP4_SURVEY_TYPES.scenarios,
  );
  const [completedSurveys, platformSurvey] = await Promise.all([
    db.surveySubmission.findMany({
      where: {
        userId,
        roundKey: WP4_SURVEY_ROUND,
        surveyType: { in: requiredSurveys },
      },
      select: { surveyType: true },
    }),
    db.surveySubmission.findUnique({
      where: {
        userId_surveyType_roundKey: {
          userId,
          surveyType: WP4_PLATFORM_SURVEY_TYPE,
          roundKey: assignment.cohortCode,
        },
      },
      select: { id: true },
    }),
  ]);

  const completedTypes = new Set(completedSurveys.map((item) => item.surveyType));
  return {
    eligible: requiredSurveys.every((survey) => completedTypes.has(survey)) && !platformSurvey,
    assignment,
  };
}
