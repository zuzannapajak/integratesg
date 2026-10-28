-- Independent pilot satisfaction feedback. Does not alter progress or WP3 assessments.
CREATE TABLE "PilotSatisfactionSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "caseStudyId" TEXT,
    "contentClarity" INTEGER NOT NULL,
    "practicalRelevance" INTEGER NOT NULL,
    "usability" INTEGER NOT NULL,
    "overallSatisfaction" INTEGER NOT NULL,
    "strengths" TEXT,
    "improvements" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PilotSatisfactionSubmission_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PilotSatisfactionSubmission_country_check" CHECK ("countryCode" IN ('AT','BG','CY','IT','PL')),
    CONSTRAINT "PilotSatisfactionSubmission_scope_check" CHECK ("scope" IN ('curriculum','eportfolio')),
    CONSTRAINT "PilotSatisfactionSubmission_ratings_check" CHECK (
      "contentClarity" BETWEEN 1 AND 5 AND
      "practicalRelevance" BETWEEN 1 AND 5 AND
      "usability" BETWEEN 1 AND 5 AND
      "overallSatisfaction" BETWEEN 1 AND 5
    ),
    CONSTRAINT "PilotSatisfactionSubmission_subject_check" CHECK (
      ("scope" = 'curriculum' AND "caseStudyId" IS NULL) OR
      ("scope" = 'eportfolio' AND "caseStudyId" IS NOT NULL)
    )
);
CREATE UNIQUE INDEX "PilotSatisfactionSubmission_userId_scope_key" ON "PilotSatisfactionSubmission"("userId", "scope");
CREATE INDEX "PilotSatisfactionSubmission_scope_countryCode_idx" ON "PilotSatisfactionSubmission"("scope", "countryCode");
CREATE INDEX "PilotSatisfactionSubmission_submittedAt_idx" ON "PilotSatisfactionSubmission"("submittedAt");
CREATE INDEX "PilotSatisfactionSubmission_caseStudyId_idx" ON "PilotSatisfactionSubmission"("caseStudyId");
ALTER TABLE "PilotSatisfactionSubmission" ADD CONSTRAINT "PilotSatisfactionSubmission_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PilotSatisfactionSubmission" ADD CONSTRAINT "PilotSatisfactionSubmission_caseStudyId_fkey"
FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- No browser data API permissions: server actions use the backend's PostgreSQL connection.
REVOKE ALL ON TABLE public."PilotSatisfactionSubmission" FROM PUBLIC, anon, authenticated;
ALTER TABLE public."PilotSatisfactionSubmission" ENABLE ROW LEVEL SECURITY;
