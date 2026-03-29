-- CreateEnum
CREATE TYPE "CaseStudyProgressStatus" AS ENUM ('not_started', 'in_progress', 'completed');

-- AlterTable
ALTER TABLE "UserCaseStudyProgress" ADD COLUMN     "lastOpenedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" "CaseStudyProgressStatus" NOT NULL DEFAULT 'not_started';

-- CreateIndex
CREATE INDEX "UserCaseStudyProgress_status_idx" ON "UserCaseStudyProgress"("status");

-- CreateIndex
CREATE INDEX "UserCaseStudyProgress_lastOpenedAt_idx" ON "UserCaseStudyProgress"("lastOpenedAt");
