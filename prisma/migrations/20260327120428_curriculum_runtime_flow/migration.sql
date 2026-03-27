-- CreateEnum
CREATE TYPE "CourseStage" AS ENUM ('overview', 'pre_quiz', 'lessons', 'post_quiz', 'completed');

-- AlterTable
ALTER TABLE "UserCourseAttempt" ADD COLUMN     "completedLessons" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentLessonIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentStage" "CourseStage" NOT NULL DEFAULT 'overview',
ADD COLUMN     "postQuizAttempts" JSONB,
ADD COLUMN     "preQuizAttempts" JSONB;

-- CreateIndex
CREATE INDEX "UserCourseAttempt_currentStage_idx" ON "UserCourseAttempt"("currentStage");
