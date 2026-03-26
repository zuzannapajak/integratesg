/*
  Warnings:

  - Added the required column `area` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CourseArea" AS ENUM ('environmental', 'social', 'governance', 'cross_cutting');

-- CreateEnum
CREATE TYPE "CourseDifficulty" AS ENUM ('foundation', 'intermediate');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "area" "CourseArea" NOT NULL,
ADD COLUMN     "difficulty" "CourseDifficulty" NOT NULL DEFAULT 'foundation',
ADD COLUMN     "estimatedDurationMinutes" INTEGER,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lessonsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "CourseTranslation" ADD COLUMN     "subtitle" TEXT;

-- AlterTable
ALTER TABLE "UserCourseAttempt" ADD COLUMN     "progressPercent" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Course_status_idx" ON "Course"("status");

-- CreateIndex
CREATE INDEX "Course_area_idx" ON "Course"("area");

-- CreateIndex
CREATE INDEX "Course_difficulty_idx" ON "Course"("difficulty");

-- CreateIndex
CREATE INDEX "Course_sortOrder_idx" ON "Course"("sortOrder");

-- CreateIndex
CREATE INDEX "Course_isFeatured_idx" ON "Course"("isFeatured");
