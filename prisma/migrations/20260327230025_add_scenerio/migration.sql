-- CreateEnum
CREATE TYPE "ScenarioAvailabilityStatus" AS ENUM ('available', 'unavailable');

-- CreateEnum
CREATE TYPE "ScenarioAttemptStatus" AS ENUM ('passed', 'completed', 'failed', 'incomplete', 'browsed');

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "area" "CourseArea" NOT NULL,
    "status" "PublicationStatus" NOT NULL DEFAULT 'draft',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioVariant" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instruction" TEXT,
    "launchUrl" TEXT NOT NULL,
    "packagePath" TEXT NOT NULL,
    "entryPoint" TEXT NOT NULL DEFAULT 'index_lms.html',
    "thumbnailUrl" TEXT,
    "estimatedDurationMinutes" INTEGER,
    "availabilityStatus" "ScenarioAvailabilityStatus" NOT NULL DEFAULT 'available',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScenarioVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserScenarioAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "scenarioVariantId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "score" INTEGER,
    "status" "ScenarioAttemptStatus" NOT NULL DEFAULT 'incomplete',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastOpenedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "suspendData" TEXT,
    "lessonLocation" TEXT,
    "sessionTime" TEXT,
    "totalTime" TEXT,
    "rawTrackingData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserScenarioAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scenario_slug_key" ON "Scenario"("slug");

-- CreateIndex
CREATE INDEX "Scenario_status_idx" ON "Scenario"("status");

-- CreateIndex
CREATE INDEX "Scenario_area_idx" ON "Scenario"("area");

-- CreateIndex
CREATE INDEX "Scenario_sortOrder_idx" ON "Scenario"("sortOrder");

-- CreateIndex
CREATE INDEX "Scenario_isFeatured_idx" ON "Scenario"("isFeatured");

-- CreateIndex
CREATE INDEX "ScenarioVariant_scenarioId_idx" ON "ScenarioVariant"("scenarioId");

-- CreateIndex
CREATE INDEX "ScenarioVariant_language_idx" ON "ScenarioVariant"("language");

-- CreateIndex
CREATE INDEX "ScenarioVariant_availabilityStatus_idx" ON "ScenarioVariant"("availabilityStatus");

-- CreateIndex
CREATE UNIQUE INDEX "ScenarioVariant_scenarioId_language_key" ON "ScenarioVariant"("scenarioId", "language");

-- CreateIndex
CREATE INDEX "UserScenarioAttempt_userId_idx" ON "UserScenarioAttempt"("userId");

-- CreateIndex
CREATE INDEX "UserScenarioAttempt_scenarioId_idx" ON "UserScenarioAttempt"("scenarioId");

-- CreateIndex
CREATE INDEX "UserScenarioAttempt_scenarioVariantId_idx" ON "UserScenarioAttempt"("scenarioVariantId");

-- CreateIndex
CREATE INDEX "UserScenarioAttempt_status_idx" ON "UserScenarioAttempt"("status");

-- CreateIndex
CREATE INDEX "UserScenarioAttempt_startedAt_idx" ON "UserScenarioAttempt"("startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserScenarioAttempt_userId_scenarioVariantId_attemptNumber_key" ON "UserScenarioAttempt"("userId", "scenarioVariantId", "attemptNumber");

-- AddForeignKey
ALTER TABLE "ScenarioVariant" ADD CONSTRAINT "ScenarioVariant_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScenarioAttempt" ADD CONSTRAINT "UserScenarioAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScenarioAttempt" ADD CONSTRAINT "UserScenarioAttempt_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScenarioAttempt" ADD CONSTRAINT "UserScenarioAttempt_scenarioVariantId_fkey" FOREIGN KEY ("scenarioVariantId") REFERENCES "ScenarioVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
