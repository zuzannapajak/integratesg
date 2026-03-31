-- CreateTable
CREATE TABLE "QuizTranslation" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionTranslation" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswerTranslation" (
    "id" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "feedbackText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnswerTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuizTranslation_quizId_idx" ON "QuizTranslation"("quizId");

-- CreateIndex
CREATE INDEX "QuizTranslation_language_idx" ON "QuizTranslation"("language");

-- CreateIndex
CREATE UNIQUE INDEX "QuizTranslation_quizId_language_key" ON "QuizTranslation"("quizId", "language");

-- CreateIndex
CREATE INDEX "QuestionTranslation_questionId_idx" ON "QuestionTranslation"("questionId");

-- CreateIndex
CREATE INDEX "QuestionTranslation_language_idx" ON "QuestionTranslation"("language");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionTranslation_questionId_language_key" ON "QuestionTranslation"("questionId", "language");

-- CreateIndex
CREATE INDEX "AnswerTranslation_answerId_idx" ON "AnswerTranslation"("answerId");

-- CreateIndex
CREATE INDEX "AnswerTranslation_language_idx" ON "AnswerTranslation"("language");

-- CreateIndex
CREATE UNIQUE INDEX "AnswerTranslation_answerId_language_key" ON "AnswerTranslation"("answerId", "language");

-- AddForeignKey
ALTER TABLE "QuizTranslation" ADD CONSTRAINT "QuizTranslation_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionTranslation" ADD CONSTRAINT "QuestionTranslation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerTranslation" ADD CONSTRAINT "AnswerTranslation_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
