-- CreateEnum
CREATE TYPE "CourseAttemptStatus" AS ENUM ('not_started', 'in_progress', 'completed', 'failed');

-- CreateTable
CREATE TABLE "UserCourseAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" "CourseAttemptStatus" NOT NULL DEFAULT 'not_started',
    "preQuizScore" INTEGER,
    "postQuizScore" INTEGER,
    "startedAt" TIMESTAMP(3),
    "lastOpenedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCourseAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserCourseAttempt_userId_idx" ON "UserCourseAttempt"("userId");

-- CreateIndex
CREATE INDEX "UserCourseAttempt_courseId_idx" ON "UserCourseAttempt"("courseId");

-- CreateIndex
CREATE INDEX "UserCourseAttempt_status_idx" ON "UserCourseAttempt"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UserCourseAttempt_userId_courseId_key" ON "UserCourseAttempt"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "UserCourseAttempt" ADD CONSTRAINT "UserCourseAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourseAttempt" ADD CONSTRAINT "UserCourseAttempt_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
