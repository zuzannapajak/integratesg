BEGIN;

-- Remove the old demo ePortfolio content.
-- Related translations and user progress belong only to these demo cases.
DELETE FROM "UserCaseStudyProgress"
WHERE "caseStudyId" IN (
  SELECT "id"
  FROM "CaseStudy"
  WHERE "slug" IN (
    'green-campus-procurement',
    'inclusive-recruitment-and-wellbeing',
    'board-oversight-and-transparency',
    'energy-efficiency-retrofit',
    'community-engagement-in-training-programmes',
    'ethics-and-reporting-controls'
  )
);

DELETE FROM "CaseStudyTranslation"
WHERE "caseStudyId" IN (
  SELECT "id"
  FROM "CaseStudy"
  WHERE "slug" IN (
    'green-campus-procurement',
    'inclusive-recruitment-and-wellbeing',
    'board-oversight-and-transparency',
    'energy-efficiency-retrofit',
    'community-engagement-in-training-programmes',
    'ethics-and-reporting-controls'
  )
);

DELETE FROM "CaseStudy"
WHERE "slug" IN (
  'green-campus-procurement',
  'inclusive-recruitment-and-wellbeing',
  'board-oversight-and-transparency',
  'energy-efficiency-retrofit',
  'community-engagement-in-training-programmes',
  'ethics-and-reporting-controls'
);

-- Do not silently migrate unexpected case studies without country metadata.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "CaseStudy") THEN
    RAISE EXCEPTION
      'Unexpected CaseStudy records remain. countryCode cannot be added safely.';
  END IF;
END
$$;

ALTER TABLE "CaseStudy"
ADD COLUMN "countryCode" TEXT NOT NULL,
ADD COLUMN "reportingPeriod" TEXT,
ADD COLUMN "sourcePartner" TEXT;

CREATE INDEX "CaseStudy_countryCode_idx"
ON "CaseStudy"("countryCode");

COMMIT;
