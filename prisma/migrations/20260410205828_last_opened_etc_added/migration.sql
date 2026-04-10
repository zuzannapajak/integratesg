-- CreateIndex
CREATE INDEX "ScenarioVariant_scenarioId_availabilityStatus_language_idx" ON "ScenarioVariant"("scenarioId", "availabilityStatus", "language");

-- CreateIndex
CREATE INDEX "UserCaseStudyProgress_lastOpenedAt_startedAt_completedAt_idx" ON "UserCaseStudyProgress"("lastOpenedAt", "startedAt", "completedAt");

-- CreateIndex
CREATE INDEX "UserCourseAttempt_userId_lastOpenedAt_idx" ON "UserCourseAttempt"("userId", "lastOpenedAt");

-- CreateIndex
CREATE INDEX "UserCourseAttempt_lastOpenedAt_startedAt_idx" ON "UserCourseAttempt"("lastOpenedAt", "startedAt");

-- CreateIndex
CREATE INDEX "UserScenarioAttempt_userId_scenarioId_scenarioVariantId_att_idx" ON "UserScenarioAttempt"("userId", "scenarioId", "scenarioVariantId", "attemptNumber");

-- CreateIndex
CREATE INDEX "UserScenarioAttempt_lastOpenedAt_startedAt_idx" ON "UserScenarioAttempt"("lastOpenedAt", "startedAt");
