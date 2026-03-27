"use client";

import { completeLessonAction, submitQuizAttemptAction } from "@/features/curriculum/actions";
import { CurriculumModuleViewModel } from "@/lib/curriculum/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Circle,
  Flag,
  PlayCircle,
  Sparkles,
  Trophy,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

type Props = {
  locale: string;
  module: CurriculumModuleViewModel;
};

type ReviewState = {
  quizId: string;
  quizType: "pre" | "post";
  selectedAnswers: Record<string, string>;
  flaggedQuestionIds: string[];
  score: number;
  correctCount: number;
  totalQuestions: number;
  nextStage: CurriculumModuleViewModel["progressState"]["currentStage"];
  attemptNumber: number;
  maxAttempts: number;
};

const SURFACE =
  "rounded-[28px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

export default function ModulePlayerShell({ locale, module: initialModule }: Props) {
  const [module, setModule] = useState(initialModule);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<string[]>([]);
  const [reviewState, setReviewState] = useState<ReviewState | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const stage = module.progressState.currentStage;

  const activeQuiz = useMemo(() => {
    if (stage === "pre_quiz") {
      return module.quizItems.find((quiz) => quiz.type === "pre") ?? null;
    }
    if (stage === "post_quiz") {
      return module.quizItems.find((quiz) => quiz.type === "post") ?? null;
    }
    return null;
  }, [module, stage]);

  const reviewQuiz = useMemo(() => {
    if (!reviewState) return null;
    return module.quizItems.find((quiz) => quiz.id === reviewState.quizId) ?? null;
  }, [module.quizItems, reviewState]);

  const currentQuiz = reviewState ? reviewQuiz : activeQuiz;

  const currentLesson =
    stage === "lessons" && module.progressState.currentLessonIndex > 0
      ? module.lessonsData[module.progressState.currentLessonIndex - 1]
      : null;

  const answeredCount = activeQuiz
    ? activeQuiz.questions.filter((question) => Boolean(selectedAnswers[question.id])).length
    : 0;

  const allAnswered = activeQuiz ? answeredCount === activeQuiz.questions.length : false;

  const currentAttemptsUsed =
    activeQuiz?.type === "pre"
      ? module.progressState.preQuizAttempts.length
      : activeQuiz?.type === "post"
        ? module.progressState.postQuizAttempts.length
        : 0;

  const totalAttemptsAllowed = activeQuiz?.type === "pre" ? 1 : activeQuiz?.type === "post" ? 2 : 0;

  const currentAttemptNumber = activeQuiz ? currentAttemptsUsed + 1 : 0;

  const checkpointMeta = (() => {
    if (!activeQuiz) {
      return {
        eyebrow: "Learning checkpoint",
        title: "Knowledge check",
        intro: "Answer all questions and submit the checkpoint when you are ready.",
        note: "",
      };
    }

    if (activeQuiz.type === "pre") {
      return {
        eyebrow: "Learning checkpoint",
        title: "Check your readiness before the lessons",
        intro:
          "Start with a short entry checkpoint to unlock the learning flow and set your baseline before moving into the lesson sequence.",
        note:
          totalAttemptsAllowed > 0
            ? `You have ${totalAttemptsAllowed} attempt${totalAttemptsAllowed === 1 ? "" : "s"} for this checkpoint.`
            : "",
      };
    }

    return {
      eyebrow: "Final checkpoint",
      title: "Complete the module with a final knowledge check",
      intro:
        "This closing checkpoint verifies understanding after the lessons and determines whether the module can be marked as completed.",
      note:
        totalAttemptsAllowed > 0
          ? `You have ${totalAttemptsAllowed} attempts for this checkpoint.`
          : "",
    };
  })();

  const handleToggleFlag = (questionId: string) => {
    setFlaggedQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((item) => item !== questionId)
        : [...prev, questionId],
    );
  };

  const handleFinishQuiz = () => {
    if (!activeQuiz || !allAnswered) return;
    setConfirmOpen(true);
  };

  const handleConfirmFinishQuiz = () => {
    if (!activeQuiz) return;

    startTransition(async () => {
      try {
        const result = await submitQuizAttemptAction({
          locale,
          courseSlug: module.slug,
          quizType: activeQuiz.type,
          selectedAnswers,
          flaggedQuestionIds,
        });

        if (!result.module) return;

        setReviewState({
          quizId: activeQuiz.id,
          quizType: activeQuiz.type,
          selectedAnswers,
          flaggedQuestionIds,
          score: result.meta.score,
          correctCount: result.meta.correctCount,
          totalQuestions: result.meta.totalQuestions,
          nextStage: result.module.progressState.currentStage,
          attemptNumber: result.meta.attemptNumber,
          maxAttempts: result.meta.maxAttempts,
        });

        setModule(result.module);
        setConfirmOpen(false);
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleContinueAfterReview = () => {
    setSelectedAnswers({});
    setFlaggedQuestionIds([]);
    setReviewState(null);
  };

  const handleCompleteLesson = () => {
    if (!currentLesson) return;

    startTransition(async () => {
      try {
        const result = await completeLessonAction({
          locale,
          courseSlug: module.slug,
          lessonIndex: currentLesson.index,
        });

        if (result.module) {
          setModule(result.module);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="space-y-6">
      {stage === "lessons" && currentLesson && !reviewState ? (
        <section className={`${SURFACE} p-5 md:p-7`}>
          <div className="flex flex-col gap-6 xl:grid xl:grid-cols-[260px_minmax(0,1fr)] xl:items-start">
            <aside className="rounded-3xl border border-[#e8edf3] bg-white/76 p-4">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                Lesson navigator
              </p>

              <div className="mt-4 space-y-2">
                {module.lessonsData.map((lesson) => {
                  const isCurrent = lesson.index === currentLesson.index;
                  const isCompleted = lesson.index <= module.progressState.completedLessons;

                  return (
                    <div
                      key={lesson.slug}
                      className={`rounded-2xl border px-4 py-3 ${
                        isCurrent
                          ? "border-[#31425a] bg-[#f8fafc]"
                          : isCompleted
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-[#e8edf3] bg-white"
                      }`}
                    >
                      <div className="text-sm font-semibold text-[#31425a]">{lesson.title}</div>
                      <div className="mt-1 text-sm text-[#667180]">{lesson.summary}</div>
                    </div>
                  );
                })}
              </div>
            </aside>

            <div className="min-w-0">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                Lesson {currentLesson.index}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#31425a]">
                {currentLesson.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#667180]">{currentLesson.summary}</p>

              <div className="mt-6 rounded-3xl border border-[#e8edf3] bg-white/76 p-5">
                <p className="text-[0.98rem] leading-8 text-[#556274]">{currentLesson.content}</p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCompleteLesson}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347] disabled:opacity-60"
                >
                  <PlayCircle className="h-4.5 w-4.5" />
                  {currentLesson.index === module.lessonsData.length
                    ? "Finish lessons"
                    : "Complete lesson and continue"}
                </button>

                <span className="text-sm text-[#667180]">
                  Estimated time: {currentLesson.estimatedMinutes} min
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {currentQuiz ? (
        <section className={`${SURFACE} overflow-hidden p-5 md:p-7`}>
          {!reviewState ? (
            <>
              <div className="relative overflow-hidden rounded-[28px] border border-[#e8edf3] bg-white/78 p-5 md:p-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(11,156,114,0.10),transparent_34%),radial-gradient(circle_at_top_right,rgba(49,66,90,0.06),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.96)_100%)]" />

                <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#dce7f2] bg-white/90 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#5f6f82]">
                        <Sparkles className="h-3.5 w-3.5" />
                        {checkpointMeta.eyebrow}
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-emerald-700">
                        <Trophy className="h-3.5 w-3.5" />
                        Attempt {currentAttemptNumber}
                        {totalAttemptsAllowed > 0 ? ` of ${totalAttemptsAllowed}` : ""}
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#31425a] md:text-[2rem]">
                      {checkpointMeta.title}
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667180] md:text-[0.98rem]">
                      {checkpointMeta.intro}
                    </p>

                    {checkpointMeta.note ? (
                      <div className="mt-4 inline-flex items-start gap-2 rounded-2xl border border-[#e8edf3] bg-white/92 px-4 py-3 text-sm text-[#556274] shadow-[0_8px_22px_rgba(35,45,62,0.04)]">
                        <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#0b9c72]" />
                        <span>
                          {checkpointMeta.note} Answer every question, then submit when you are
                          ready.
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3 xl:min-w-90">
                    <StatPill
                      label="Answered"
                      value={`${answeredCount}/${currentQuiz.questions.length}`}
                    />
                    <StatPill label="Flagged" value={`${flaggedQuestionIds.length}`} />
                    <StatPill
                      label="Passing score"
                      value={
                        currentQuiz.passingScore !== null ? `${currentQuiz.passingScore}%` : "—"
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {currentQuiz.questions.map((question, index) => {
                  const selectedId = selectedAnswers[question.id];
                  const isFlagged = flaggedQuestionIds.includes(question.id);

                  return (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.16 }}
                      className="rounded-3xl border border-[#e8edf3] bg-white/76 p-5 shadow-[0_8px_24px_rgba(35,45,62,0.04)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                            Question {index + 1}
                          </p>
                          <h3 className="mt-2 text-lg font-bold tracking-tight text-[#31425a]">
                            {question.prompt}
                          </h3>
                          {question.explanation ? (
                            <p className="mt-2 text-sm leading-6 text-[#667180]">
                              {question.explanation}
                            </p>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            handleToggleFlag(question.id);
                          }}
                          className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                            isFlagged
                              ? "bg-amber-50 text-amber-700"
                              : "border border-[#d9e2ec] bg-white text-[#5f6f82] hover:bg-[#f8fafc]"
                          }`}
                        >
                          <Flag className="h-4 w-4" />
                          {isFlagged ? "Flagged" : "Flag"}
                        </button>
                      </div>

                      <div className="mt-5 grid gap-3">
                        {question.answers.map((answer) => {
                          const isSelected = selectedId === answer.id;

                          return (
                            <button
                              key={answer.id}
                              type="button"
                              onClick={() => {
                                setSelectedAnswers((prev) => ({
                                  ...prev,
                                  [question.id]: answer.id,
                                }));
                              }}
                              className={`flex items-start gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                                isSelected
                                  ? "border-[#31425a] bg-[#f8fafc] shadow-[0_6px_16px_rgba(49,66,90,0.06)]"
                                  : "border-[#e8edf3] bg-white hover:-translate-y-px hover:bg-[#fcfdff]"
                              }`}
                            >
                              <span className="mt-0.5 shrink-0 text-[#31425a]">
                                {isSelected ? (
                                  <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                  <Circle className="h-5 w-5" />
                                )}
                              </span>
                              <span className="text-sm leading-6 text-[#31425a]">
                                {answer.text}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-[#e8edf3] bg-white/74 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#31425a]">
                    {answeredCount}/{currentQuiz.questions.length} questions answered
                  </p>
                  <p className="mt-1 text-sm text-[#667180]">
                    {allAnswered
                      ? "Everything is ready. You can submit this checkpoint now."
                      : "Answer all questions to unlock submission."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleFinishQuiz}
                  disabled={!allAnswered}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Review and submit
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-[28px] border border-[#e8edf3] bg-white/78 p-5 md:p-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(11,156,114,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(255,255,255,0.96)_100%)]" />

                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                      Checkpoint result
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#31425a]">
                      Your answers have been reviewed
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[#667180]">
                      Review the result below. Each question includes clear feedback and the correct
                      answer is highlighted.
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3">
                    <StatPill label="Score" value={`${reviewState.score}%`} />
                    <StatPill
                      label="Correct"
                      value={`${reviewState.correctCount}/${reviewState.totalQuestions}`}
                    />
                    <StatPill label="Attempt" value={`${reviewState.attemptNumber}`} />
                  </div>
                </div>
              </div>

              {currentQuiz.questions.map((question, index) => {
                const selectedId = reviewState.selectedAnswers[question.id];
                const selectedAnswer = question.answers.find((answer) => answer.id === selectedId);
                const correctAnswer = question.answers.find((answer) => answer.isCorrect);
                const isCorrect = selectedAnswer?.isCorrect === true;
                const wasFlagged = reviewState.flaggedQuestionIds.includes(question.id);

                return (
                  <div
                    key={question.id}
                    className="rounded-3xl border border-[#e8edf3] bg-white/76 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                          Question {index + 1}
                        </p>
                        <h3 className="mt-2 text-lg font-bold tracking-tight text-[#31425a]">
                          {question.prompt}
                        </h3>
                        {question.explanation ? (
                          <p className="mt-2 text-sm leading-6 text-[#667180]">
                            {question.explanation}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {wasFlagged ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-amber-700">
                            <Flag className="h-4 w-4" />
                            Flagged
                          </span>
                        ) : null}

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] ${
                            isCorrect
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {question.answers.map((answer) => {
                        const isSelected = selectedId === answer.id;
                        const showCorrect = answer.isCorrect;
                        const showWrongSelected = isSelected && !answer.isCorrect;

                        return (
                          <div
                            key={answer.id}
                            className={`rounded-2xl border px-4 py-4 ${
                              showCorrect
                                ? "border-emerald-200 bg-emerald-50"
                                : showWrongSelected
                                  ? "border-rose-200 bg-rose-50"
                                  : "border-[#e8edf3] bg-white"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 shrink-0 text-[#31425a]">
                                {showCorrect ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                                ) : showWrongSelected ? (
                                  <XCircle className="h-5 w-5 text-rose-700" />
                                ) : (
                                  <Circle className="h-5 w-5 text-[#98a2b3]" />
                                )}
                              </span>

                              <div>
                                <p className="text-sm leading-6 text-[#31425a]">{answer.text}</p>

                                {showCorrect ? (
                                  <p className="mt-1 text-sm leading-6 text-[#556274]">
                                    {answer.feedbackText ?? "This is the correct answer."}
                                  </p>
                                ) : null}

                                {showWrongSelected ? (
                                  <p className="mt-1 text-sm leading-6 text-[#556274]">
                                    {answer.feedbackText ??
                                      "This answer is not correct for this question."}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 rounded-2xl border border-[#e8edf3] bg-[#f8fafc] px-4 py-4">
                      <p className="text-sm font-semibold text-[#31425a]">
                        {isCorrect ? "Why this answer is correct" : "Correction and rationale"}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#556274]">
                        The correct answer is:{" "}
                        <span className="font-semibold">{correctAnswer?.text ?? "—"}</span>
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleContinueAfterReview}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
                >
                  {reviewState.nextStage === "lessons"
                    ? "Continue to lessons"
                    : reviewState.nextStage === "post_quiz"
                      ? "Continue to final checkpoint"
                      : reviewState.nextStage === "completed"
                        ? "Finish module"
                        : "Continue"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      ) : null}

      {stage === "completed" && !reviewState ? (
        <section className={`${SURFACE} overflow-hidden p-6 md:p-7`}>
          <div className="relative overflow-hidden rounded-[30px] border border-[#e8edf3] bg-white/82 p-6 md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(11,156,114,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(49,66,90,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.98)_100%)]" />

            <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_320px] xl:items-end">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Module completed
                </div>

                <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[#31425a] md:text-[2.35rem]">
                  You’ve completed this learning module
                </h2>

                <p className="mt-4 max-w-2xl text-[0.98rem] leading-8 text-[#667180]">
                  Your lesson progression and checkpoint history have been saved. You can now return
                  to the module overview, or continue exploring the rest of the curriculum.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/${locale}/curriculum/${module.slug}`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
                  >
                    Review module overview
                  </Link>

                  <Link
                    href={`/${locale}/curriculum`}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[#d9e2ec] bg-white px-5 py-3 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc]"
                  >
                    Explore more modules
                  </Link>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-3xl border border-[#e8edf3] bg-white/90 p-5 shadow-[0_10px_28px_rgba(35,45,62,0.05)]">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                    Final progress
                  </p>
                  <div className="mt-2 text-3xl font-bold tracking-tight text-[#31425a]">100%</div>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#edf2f7]">
                    <div className="h-full w-full rounded-full bg-[#0b9c72]" />
                  </div>
                </div>

                <div className="rounded-3xl border border-[#e8edf3] bg-white/90 p-5 shadow-[0_10px_28px_rgba(35,45,62,0.05)]">
                  <p className="text-sm font-semibold text-[#31425a]">What’s next</p>
                  <p className="mt-2 text-sm leading-6 text-[#667180]">
                    Revisit the module detail page for your learning history, or move on to another
                    related topic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <AnimatePresence>
        {confirmOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.42)] px-4 backdrop-blur-[6px]"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="w-full max-w-xl overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_24px_70px_rgba(35,45,62,0.22)]"
            >
              <div className="relative px-6 pb-6 pt-6 md:px-7">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,1)_100%)]" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                        <AlertTriangle className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                          Ready to submit
                        </p>
                        <h3 className="mt-1 text-xl font-bold tracking-tight text-[#31425a] md:text-[1.35rem]">
                          Submit this checkpoint now?
                        </h3>
                        <p className="mt-2 max-w-lg text-sm leading-7 text-[#667180]">
                          This will save your current answers and open the full feedback review for
                          this attempt.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmOpen(false);
                      }}
                      className="rounded-xl p-2 text-[#7b8794] transition hover:bg-[#f4f7fa]"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <ConfirmMetric
                      label="Questions"
                      value={activeQuiz ? `${activeQuiz.questions.length}` : "—"}
                    />
                    <ConfirmMetric label="Answered" value={`${answeredCount}`} />
                    <ConfirmMetric label="Flagged" value={`${flaggedQuestionIds.length}`} />
                  </div>

                  <div className="mt-6 rounded-2xl border border-[#e8edf3] bg-[#f8fafc] px-4 py-4">
                    <p className="text-sm leading-6 text-[#556274]">
                      After submission you’ll see which answers were correct, along with feedback
                      and explanation for the reviewed questions.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmOpen(false);
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl border border-[#d9e2ec] bg-white px-4 py-3 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc]"
                    >
                      Go back
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmFinishQuiz}
                      disabled={isPending}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#31425a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347] disabled:opacity-60"
                    >
                      Submit checkpoint
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e8edf3] bg-white/86 px-4 py-3 shadow-[0_8px_20px_rgba(35,45,62,0.04)]">
      <div className="text-lg font-bold tracking-tight text-[#31425a]">{value}</div>
      <div className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
        {label}
      </div>
    </div>
  );
}

function ConfirmMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e8edf3] bg-white px-4 py-3">
      <div className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
        {label}
      </div>
      <div className="mt-1 text-lg font-bold text-[#31425a]">{value}</div>
    </div>
  );
}
