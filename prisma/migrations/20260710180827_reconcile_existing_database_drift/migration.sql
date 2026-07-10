-- CreateEnum
CREATE TYPE "public"."CurriculumPilotAssessmentType" AS ENUM ('pre', 'post');

-- CreateEnum
CREATE TYPE "public"."CurriculumPilotQuestionType" AS ENUM ('likert', 'single_choice', 'open_text');

-- CreateEnum
CREATE TYPE "public"."CurriculumPilotStatus" AS ENUM ('pre_prompt_shown', 'pre_skipped', 'pilot_active', 'pilot_completed');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."CourseArea" ADD VALUE 'strategy';
ALTER TYPE "public"."CourseArea" ADD VALUE 'reporting';

-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserRole_new" AS ENUM ('educator', 'learner', 'admin');
ALTER TABLE "public"."Profile" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."Profile"
ALTER COLUMN "role"
TYPE "public"."UserRole_new"
USING (
  CASE
    WHEN "role"::text = 'student' THEN 'learner'
    ELSE "role"::text
  END
)::"public"."UserRole_new";ALTER TYPE "public"."UserRole" RENAME TO "UserRole_old";
ALTER TYPE "public"."UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "public"."Profile" ALTER COLUMN "role" SET DEFAULT 'learner';
COMMIT;

-- DropIndex
DROP INDEX "public"."Quiz_courseId_type_key";

-- AlterTable
ALTER TABLE "public"."CourseTranslation" ADD COLUMN     "details" JSONB;

-- AlterTable
ALTER TABLE "public"."Profile" ALTER COLUMN "role" SET DEFAULT 'learner';

-- CreateTable
CREATE TABLE "public"."CurriculumPilot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."CurriculumPilotStatus" NOT NULL DEFAULT 'pre_prompt_shown',
    "preAssessmentSeenAt" TIMESTAMP(3),
    "preAssessmentSkippedAt" TIMESTAMP(3),
    "preAssessmentCompletedAt" TIMESTAMP(3),
    "postAssessmentCompletedAt" TIMESTAMP(3),
    "preAssessmentAverageScore" DOUBLE PRECISION,
    "postAssessmentAverageScore" DOUBLE PRECISION,
    "assessmentAverageScoreDelta" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumPilot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CurriculumPilotAnswer" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "valueInt" INTEGER,
    "valueText" TEXT,
    "valueJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumPilotAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CurriculumPilotQuestion" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "inputType" "public"."CurriculumPilotQuestionType" NOT NULL DEFAULT 'likert',
    "minValue" INTEGER,
    "maxValue" INTEGER,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumPilotQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CurriculumPilotQuestionTranslation" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "helpText" TEXT,
    "labels" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumPilotQuestionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CurriculumPilotSubmission" (
    "id" TEXT NOT NULL,
    "pilotId" TEXT NOT NULL,
    "type" "public"."CurriculumPilotAssessmentType" NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalScore" DOUBLE PRECISION,
    "averageScore" DOUBLE PRECISION,
    "answersSnapshot" JSONB,
    "modulesStartedBeforeSubmission" INTEGER NOT NULL DEFAULT 0,
    "modulesCompletedBeforeSubmission" INTEGER NOT NULL DEFAULT 0,
    "startedCourseIdsSnapshot" JSONB,
    "completedCourseIdsSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumPilotSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlatformFeedbackReminder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dismissedAt" TIMESTAMP(3),
    "remindLaterAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformFeedbackReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlatformFeedbackSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "suggestions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "easeOfUse" INTEGER NOT NULL,
    "moduleClarity" INTEGER NOT NULL,
    "navigation" INTEGER NOT NULL,
    "overallSatisfaction" INTEGER NOT NULL,
    "technicalNotes" TEXT,
    "technicalProblems" INTEGER NOT NULL,
    "testsExperience" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformFeedbackSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CurriculumPilot_postAssessmentCompletedAt_idx" ON "public"."CurriculumPilot"("postAssessmentCompletedAt" ASC);

-- CreateIndex
CREATE INDEX "CurriculumPilot_preAssessmentCompletedAt_idx" ON "public"."CurriculumPilot"("preAssessmentCompletedAt" ASC);

-- CreateIndex
CREATE INDEX "CurriculumPilot_preAssessmentSeenAt_idx" ON "public"."CurriculumPilot"("preAssessmentSeenAt" ASC);

-- CreateIndex
CREATE INDEX "CurriculumPilot_preAssessmentSkippedAt_idx" ON "public"."CurriculumPilot"("preAssessmentSkippedAt" ASC);

-- CreateIndex
CREATE INDEX "CurriculumPilot_status_idx" ON "public"."CurriculumPilot"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumPilot_userId_key" ON "public"."CurriculumPilot"("userId" ASC);

-- CreateIndex
CREATE INDEX "CurriculumPilotAnswer_questionId_idx" ON "public"."CurriculumPilotAnswer"("questionId" ASC);

-- CreateIndex
CREATE INDEX "CurriculumPilotAnswer_submissionId_idx" ON "public"."CurriculumPilotAnswer"("submissionId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumPilotAnswer_submissionId_questionId_key" ON "public"."CurriculumPilotAnswer"("submissionId" ASC, "questionId" ASC);

-- CreateIndex
CREATE INDEX "CurriculumPilotQuestion_isActive_idx" ON "public"."CurriculumPilotQuestion"("isActive" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumPilotQuestion_key_key" ON "public"."CurriculumPilotQuestion"("key" ASC);

-- CreateIndex
CREATE INDEX "CurriculumPilotQuestion_sortOrder_idx" ON "public"."CurriculumPilotQuestion"("sortOrder" ASC);

-- CreateIndex
CREATE INDEX "CurriculumPilotQuestionTranslation_language_idx" ON "public"."CurriculumPilotQuestionTranslation"("language" ASC);

-- CreateIndex
CREATE INDEX "CurriculumPilotQuestionTranslation_questionId_idx" ON "public"."CurriculumPilotQuestionTranslation"("questionId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumPilotQuestionTranslation_questionId_language_key" ON "public"."CurriculumPilotQuestionTranslation"("questionId" ASC, "language" ASC);

-- CreateIndex
CREATE INDEX "CurriculumPilotSubmission_pilotId_idx" ON "public"."CurriculumPilotSubmission"("pilotId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumPilotSubmission_pilotId_type_key" ON "public"."CurriculumPilotSubmission"("pilotId" ASC, "type" ASC);

-- CreateIndex
CREATE INDEX "CurriculumPilotSubmission_submittedAt_idx" ON "public"."CurriculumPilotSubmission"("submittedAt" ASC);

-- CreateIndex
CREATE INDEX "CurriculumPilotSubmission_type_idx" ON "public"."CurriculumPilotSubmission"("type" ASC);

-- CreateIndex
CREATE INDEX "PlatformFeedbackReminder_dismissedAt_idx" ON "public"."PlatformFeedbackReminder"("dismissedAt" ASC);

-- CreateIndex
CREATE INDEX "PlatformFeedbackReminder_remindLaterAt_idx" ON "public"."PlatformFeedbackReminder"("remindLaterAt" ASC);

-- CreateIndex
CREATE INDEX "PlatformFeedbackReminder_submittedAt_idx" ON "public"."PlatformFeedbackReminder"("submittedAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformFeedbackReminder_userId_key" ON "public"."PlatformFeedbackReminder"("userId" ASC);

-- CreateIndex
CREATE INDEX "PlatformFeedbackSubmission_createdAt_idx" ON "public"."PlatformFeedbackSubmission"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "PlatformFeedbackSubmission_userId_idx" ON "public"."PlatformFeedbackSubmission"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_courseId_type_sortOrder_key" ON "public"."Quiz"("courseId" ASC, "type" ASC, "sortOrder" ASC);

-- AddForeignKey
ALTER TABLE "public"."CurriculumPilot" ADD CONSTRAINT "CurriculumPilot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CurriculumPilotAnswer" ADD CONSTRAINT "CurriculumPilotAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."CurriculumPilotQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CurriculumPilotAnswer" ADD CONSTRAINT "CurriculumPilotAnswer_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."CurriculumPilotSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CurriculumPilotQuestionTranslation" ADD CONSTRAINT "CurriculumPilotQuestionTranslation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."CurriculumPilotQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CurriculumPilotSubmission" ADD CONSTRAINT "CurriculumPilotSubmission_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "public"."CurriculumPilot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlatformFeedbackReminder" ADD CONSTRAINT "PlatformFeedbackReminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlatformFeedbackSubmission" ADD CONSTRAINT "PlatformFeedbackSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
