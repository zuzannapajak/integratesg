-- CreateTable
CREATE TABLE "CourseSection" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "estimatedMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseSectionTranslation" (
    "id" TEXT NOT NULL,
    "courseSectionId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseSectionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseSection_courseId_idx" ON "CourseSection"("courseId");

-- CreateIndex
CREATE INDEX "CourseSection_courseId_sortOrder_idx" ON "CourseSection"("courseId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CourseSection_courseId_slug_key" ON "CourseSection"("courseId", "slug");

-- CreateIndex
CREATE INDEX "CourseSectionTranslation_courseSectionId_idx" ON "CourseSectionTranslation"("courseSectionId");

-- CreateIndex
CREATE INDEX "CourseSectionTranslation_language_idx" ON "CourseSectionTranslation"("language");

-- CreateIndex
CREATE UNIQUE INDEX "CourseSectionTranslation_courseSectionId_language_key" ON "CourseSectionTranslation"("courseSectionId", "language");

-- AddForeignKey
ALTER TABLE "CourseSection" ADD CONSTRAINT "CourseSection_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSectionTranslation" ADD CONSTRAINT "CourseSectionTranslation_courseSectionId_fkey" FOREIGN KEY ("courseSectionId") REFERENCES "CourseSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
