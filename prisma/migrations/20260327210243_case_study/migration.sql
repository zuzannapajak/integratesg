-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "area" "CourseArea" NOT NULL,
    "status" "PublicationStatus" NOT NULL DEFAULT 'draft',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudyTranslation" (
    "id" TEXT NOT NULL,
    "caseStudyId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "keyTakeaways" JSONB,
    "organization" TEXT,
    "industry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStudyTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");

-- CreateIndex
CREATE INDEX "CaseStudy_status_idx" ON "CaseStudy"("status");

-- CreateIndex
CREATE INDEX "CaseStudy_area_idx" ON "CaseStudy"("area");

-- CreateIndex
CREATE INDEX "CaseStudy_sortOrder_idx" ON "CaseStudy"("sortOrder");

-- CreateIndex
CREATE INDEX "CaseStudy_isFeatured_idx" ON "CaseStudy"("isFeatured");

-- CreateIndex
CREATE INDEX "CaseStudyTranslation_language_idx" ON "CaseStudyTranslation"("language");

-- CreateIndex
CREATE INDEX "CaseStudyTranslation_caseStudyId_idx" ON "CaseStudyTranslation"("caseStudyId");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudyTranslation_caseStudyId_language_key" ON "CaseStudyTranslation"("caseStudyId", "language");

-- AddForeignKey
ALTER TABLE "CaseStudyTranslation" ADD CONSTRAINT "CaseStudyTranslation_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
