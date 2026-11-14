-- Additive migration. Existing assessment/feedback responses remain unchanged.
CREATE TYPE "PilotTrack" AS ENUM ('wp3_curriculum', 'wp4_case_studies', 'wp4_scenarios');
CREATE TYPE "PilotParticipationStatus" AS ENUM ('active', 'completed', 'withdrawn');

CREATE TABLE "PilotParticipation" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "track" "PilotTrack" NOT NULL,
  "cohortCode" TEXT NOT NULL DEFAULT 'initial',
  "countryCode" VARCHAR(2) NOT NULL,
  "status" "PilotParticipationStatus" NOT NULL DEFAULT 'active',
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" TIMESTAMP(3),
  CONSTRAINT "PilotParticipation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PilotParticipation_countryCode_check" CHECK ("countryCode" ~ '^[A-Z]{2}$'),
  CONSTRAINT "PilotParticipation_cohortCode_check" CHECK (length(trim("cohortCode")) > 0)
);
CREATE UNIQUE INDEX "PilotParticipation_userId_track_cohortCode_key" ON "PilotParticipation"("userId", "track", "cohortCode");
-- Prevent ambiguous active cohort selection for one user and learning track.
CREATE UNIQUE INDEX "PilotParticipation_one_active_track_per_user" ON "PilotParticipation"("userId", "track") WHERE "status" = 'active';
CREATE INDEX "PilotParticipation_userId_status_idx" ON "PilotParticipation"("userId", "status");
CREATE INDEX "PilotParticipation_track_cohortCode_countryCode_idx" ON "PilotParticipation"("track", "cohortCode", "countryCode");
ALTER TABLE "PilotParticipation" ADD CONSTRAINT "PilotParticipation_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "SurveySubmission" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "surveyType" TEXT NOT NULL,
  "surveyVersion" INTEGER NOT NULL,
  "roundKey" TEXT NOT NULL,
  "locale" TEXT NOT NULL,
  "countryCode" VARCHAR(2),
  "roleAtSubmission" "UserRole" NOT NULL,
  "isPilotAtSubmission" BOOLEAN NOT NULL DEFAULT false,
  "pilotCohortCode" TEXT,
  "answers" JSONB NOT NULL,
  "activitySnapshot" JSONB NOT NULL,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SurveySubmission_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SurveySubmission_surveyVersion_check" CHECK ("surveyVersion" >= 1)
);
CREATE UNIQUE INDEX "SurveySubmission_userId_surveyType_roundKey_key" ON "SurveySubmission"("userId", "surveyType", "roundKey");
CREATE INDEX "SurveySubmission_surveyType_roundKey_submittedAt_idx" ON "SurveySubmission"("surveyType", "roundKey", "submittedAt");
ALTER TABLE "SurveySubmission" ADD CONSTRAINT "SurveySubmission_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- These sensitive tables are only accessed via trusted server-side Prisma queries.
REVOKE ALL ON TABLE public."PilotParticipation", public."SurveySubmission" FROM PUBLIC, anon, authenticated;
ALTER TABLE public."PilotParticipation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SurveySubmission" ENABLE ROW LEVEL SECURITY;
