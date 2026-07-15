/*
  Warnings:

  - The values [passed,failed,browsed] on the enum `ScenarioAttemptStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `lessonLocation` on the `UserScenarioAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `rawTrackingData` on the `UserScenarioAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `scenarioVariantId` on the `UserScenarioAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `UserScenarioAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `sessionTime` on the `UserScenarioAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `suspendData` on the `UserScenarioAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `totalTime` on the `UserScenarioAttempt` table. All the data in the column will be lost.
  - You are about to drop the `Scenario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScenarioVariant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,scenarioId,scenarioVersion,attemptNumber]` on the table `UserScenarioAttempt` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locale` to the `UserScenarioAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scenarioVersion` to the `UserScenarioAttempt` table without a default value. This is not possible if the table is not empty.
  - Made the column `lastOpenedAt` on table `UserScenarioAttempt` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ScenarioAttemptStatus_new" AS ENUM ('incomplete', 'completed');
ALTER TABLE "public"."UserScenarioAttempt" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "UserScenarioAttempt" ALTER COLUMN "status" TYPE "ScenarioAttemptStatus_new" USING ("status"::text::"ScenarioAttemptStatus_new");
ALTER TYPE "ScenarioAttemptStatus" RENAME TO "ScenarioAttemptStatus_old";
ALTER TYPE "ScenarioAttemptStatus_new" RENAME TO "ScenarioAttemptStatus";
DROP TYPE "public"."ScenarioAttemptStatus_old";
ALTER TABLE "UserScenarioAttempt" ALTER COLUMN "status" SET DEFAULT 'incomplete';
COMMIT;

-- DropForeignKey
ALTER TABLE "ScenarioVariant" DROP CONSTRAINT "ScenarioVariant_scenarioId_fkey";

-- DropForeignKey
ALTER TABLE "UserScenarioAttempt" DROP CONSTRAINT "UserScenarioAttempt_scenarioId_fkey";

-- DropForeignKey
ALTER TABLE "UserScenarioAttempt" DROP CONSTRAINT "UserScenarioAttempt_scenarioVariantId_fkey";

-- DropIndex
DROP INDEX "UserScenarioAttempt_lastOpenedAt_startedAt_idx";

-- DropIndex
DROP INDEX "UserScenarioAttempt_scenarioVariantId_idx";

-- DropIndex
DROP INDEX "UserScenarioAttempt_startedAt_idx";

-- DropIndex
DROP INDEX "UserScenarioAttempt_userId_scenarioId_scenarioVariantId_att_idx";

-- DropIndex
DROP INDEX "UserScenarioAttempt_userId_scenarioVariantId_attemptNumber_key";

-- AlterTable
ALTER TABLE "UserScenarioAttempt" DROP COLUMN "lessonLocation",
DROP COLUMN "rawTrackingData",
DROP COLUMN "scenarioVariantId",
DROP COLUMN "score",
DROP COLUMN "sessionTime",
DROP COLUMN "suspendData",
DROP COLUMN "totalTime",
ADD COLUMN     "locale" TEXT NOT NULL,
ADD COLUMN     "scenarioVersion" INTEGER NOT NULL,
ALTER COLUMN "lastOpenedAt" SET NOT NULL,
ALTER COLUMN "lastOpenedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Scenario";

-- DropTable
DROP TABLE "ScenarioVariant";

-- DropEnum
DROP TYPE "ScenarioAvailabilityStatus";

-- CreateTable
CREATE TABLE "UserScenarioChallengeCompletion" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserScenarioChallengeCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserScenarioChoiceAttempt" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "choiceId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "isOptimal" BOOLEAN NOT NULL,
    "confirmedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserScenarioChoiceAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserScenarioChallengeCompletion_challengeId_idx" ON "UserScenarioChallengeCompletion"("challengeId");

-- CreateIndex
CREATE INDEX "UserScenarioChallengeCompletion_completedAt_idx" ON "UserScenarioChallengeCompletion"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserScenarioChallengeCompletion_attemptId_challengeId_key" ON "UserScenarioChallengeCompletion"("attemptId", "challengeId");

-- CreateIndex
CREATE INDEX "UserScenarioChoiceAttempt_challengeId_idx" ON "UserScenarioChoiceAttempt"("challengeId");

-- CreateIndex
CREATE INDEX "UserScenarioChoiceAttempt_choiceId_idx" ON "UserScenarioChoiceAttempt"("choiceId");

-- CreateIndex
CREATE INDEX "UserScenarioChoiceAttempt_isOptimal_idx" ON "UserScenarioChoiceAttempt"("isOptimal");

-- CreateIndex
CREATE INDEX "UserScenarioChoiceAttempt_confirmedAt_idx" ON "UserScenarioChoiceAttempt"("confirmedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserScenarioChoiceAttempt_attemptId_challengeId_attemptNumb_key" ON "UserScenarioChoiceAttempt"("attemptId", "challengeId", "attemptNumber");

-- CreateIndex
CREATE INDEX "UserScenarioAttempt_lastOpenedAt_idx" ON "UserScenarioAttempt"("lastOpenedAt");

-- CreateIndex
CREATE INDEX "UserScenarioAttempt_completedAt_idx" ON "UserScenarioAttempt"("completedAt");

-- CreateIndex
CREATE INDEX "UserScenarioAttempt_userId_scenarioId_status_idx" ON "UserScenarioAttempt"("userId", "scenarioId", "status");

-- CreateIndex
CREATE INDEX "UserScenarioAttempt_scenarioId_scenarioVersion_status_idx" ON "UserScenarioAttempt"("scenarioId", "scenarioVersion", "status");

-- CreateIndex
CREATE UNIQUE INDEX "UserScenarioAttempt_userId_scenarioId_scenarioVersion_attem_key" ON "UserScenarioAttempt"("userId", "scenarioId", "scenarioVersion", "attemptNumber");

-- AddForeignKey
ALTER TABLE "UserScenarioChallengeCompletion" ADD CONSTRAINT "UserScenarioChallengeCompletion_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "UserScenarioAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScenarioChoiceAttempt" ADD CONSTRAINT "UserScenarioChoiceAttempt_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "UserScenarioAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
