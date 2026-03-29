-- CreateTable
CREATE TABLE "UserCaseStudyProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "caseStudyId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCaseStudyProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserCaseStudyProgress_userId_idx" ON "UserCaseStudyProgress"("userId");

-- CreateIndex
CREATE INDEX "UserCaseStudyProgress_caseStudyId_idx" ON "UserCaseStudyProgress"("caseStudyId");

-- CreateIndex
CREATE INDEX "UserCaseStudyProgress_completedAt_idx" ON "UserCaseStudyProgress"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserCaseStudyProgress_userId_caseStudyId_key" ON "UserCaseStudyProgress"("userId", "caseStudyId");

-- AddForeignKey
ALTER TABLE "UserCaseStudyProgress" ADD CONSTRAINT "UserCaseStudyProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCaseStudyProgress" ADD CONSTRAINT "UserCaseStudyProgress_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
