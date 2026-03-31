"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  CircleDashed,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export type QuizAnswerViewModel = {
  id: string;
  text: string;
  isCorrect: boolean;
  feedbackText: string | null;
};

export type QuizQuestionViewModel = {
  id: string;
  prompt: string;
  explanation: string | null;
  answers: QuizAnswerViewModel[];
};

export type QuizViewModel = {
  id: string;
  type: "pre" | "post";
  title: string;
  description: string | null;
  passingScore: number | null;
  questions: QuizQuestionViewModel[];
};

type Props = {
  quizzes: QuizViewModel[];
};

const SURFACE =
  "rounded-[28px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

export default function CourseQuizPanel({ quizzes }: Props) {
  const t = useTranslations("Protected.CourseQuizPanel");
  const [activeQuizId, setActiveQuizId] = useState<string>(quizzes[0]?.id ?? "");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  const activeQuiz = useMemo(() => {
    return quizzes.find((quiz) => quiz.id === activeQuizId) ?? null;
  }, [activeQuizId, quizzes]);

  if (quizzes.length === 0 || activeQuiz === null) {
    return (
      <div className={`${SURFACE} p-6 md:p-7`}>
        <div className="max-w-xl">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
            {t("empty.eyebrow")}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#31425a]">
            {t("empty.title")}
          </h2>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#667180]">{t("empty.description")}</p>
        </div>
      </div>
    );
  }

  const answeredCount = activeQuiz.questions.filter(
    (question) => submittedQuestions[question.id],
  ).length;

  const correctCount = activeQuiz.questions.filter((question) => {
    if (!submittedQuestions[question.id]) return false;
    const selectedId = selectedAnswers[question.id];
    const selected = question.answers.find((answer) => answer.id === selectedId);
    return selected?.isCorrect === true;
  }).length;

  const scorePercent =
    activeQuiz.questions.length > 0
      ? Math.round((correctCount / activeQuiz.questions.length) * 100)
      : 0;

  const handleSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmitQuestion = (questionId: string) => {
    if (!selectedAnswers[questionId]) return;

    setSubmittedQuestions((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuestions({});
  };

  return (
    <div className="space-y-5">
      <div className={`${SURFACE} overflow-hidden p-4 md:p-5`}>
        <div className="relative overflow-hidden rounded-[28px] border border-[#e8edf3] bg-white/78 p-5 md:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(11,156,114,0.10),transparent_34%),radial-gradient(circle_at_top_right,rgba(49,66,90,0.06),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.96)_100%)]" />

          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#dce7f2] bg-white/90 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#5f6f82]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("hero.eyebrow")}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-emerald-700">
                  <Trophy className="h-3.5 w-3.5" />
                  {activeQuiz.type === "pre"
                    ? t("hero.openingCheckpoint")
                    : t("hero.finalCheckpoint")}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#31425a] md:text-[2rem]">
                {t("hero.title")}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667180] md:text-[0.98rem]">
                {t("hero.description")}
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 xl:min-w-90">
              <StatPill
                label={t("stats.answered")}
                value={`${answeredCount}/${activeQuiz.questions.length}`}
              />
              <StatPill label={t("stats.correct")} value={`${correctCount}`} />
              <StatPill label={t("stats.score")} value={`${scorePercent}%`} />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {quizzes.map((quiz) => {
            const isActive = quiz.id === activeQuiz.id;

            return (
              <button
                key={quiz.id}
                type="button"
                onClick={() => {
                  setActiveQuizId(quiz.id);
                  setSelectedAnswers({});
                  setSubmittedQuestions({});
                }}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#31425a] text-white shadow-sm"
                    : "border border-[#d9e2ec] bg-white text-[#31425a] hover:bg-[#f8fafc]"
                }`}
              >
                <CircleDashed className="h-4 w-4" />
                {quiz.title}
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleResetQuiz}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#d9e2ec] bg-white px-4 py-2.5 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc]"
          >
            <RotateCcw className="h-4 w-4" />
            {t("reset")}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeQuiz.questions.map((question, index) => {
          const selectedId = selectedAnswers[question.id];
          const submitted = submittedQuestions[question.id];
          const selectedAnswer = question.answers.find((answer) => answer.id === selectedId);
          const isCorrect = submitted && selectedAnswer?.isCorrect === true;
          const correctAnswer = question.answers.find((answer) => answer.isCorrect);

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16 }}
              className={`${SURFACE} p-5 md:p-6`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                    {t("questionLabel", { number: index + 1 })}
                  </p>
                  <h3 className="mt-2 text-lg font-bold tracking-tight text-[#31425a]">
                    {question.prompt}
                  </h3>
                  {question.explanation ? (
                    <p className="mt-2 text-sm leading-6 text-[#667180]">{question.explanation}</p>
                  ) : null}
                </div>

                {submitted ? (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] ${
                      isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    {isCorrect ? t("result.correct") : t("result.incorrect")}
                  </span>
                ) : null}
              </div>

              <div className="mt-5 grid gap-3">
                {question.answers.map((answer) => {
                  const isSelected = selectedId === answer.id;
                  const showCorrectState = submitted && answer.isCorrect;
                  const showWrongSelected = submitted && isSelected && !answer.isCorrect;

                  return (
                    <button
                      key={answer.id}
                      type="button"
                      onClick={() => {
                        handleSelect(question.id, answer.id);
                      }}
                      disabled={submitted}
                      className={`flex items-start gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                        showCorrectState
                          ? "border-emerald-200 bg-emerald-50"
                          : showWrongSelected
                            ? "border-rose-200 bg-rose-50"
                            : isSelected
                              ? "border-[#31425a] bg-[#f8fafc]"
                              : "border-[#e8edf3] bg-white/72 hover:bg-white"
                      } ${submitted ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <span className="mt-0.5 shrink-0 text-[#31425a]">
                        {isSelected ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </span>
                      <span className="text-sm leading-6 text-[#31425a]">{answer.text}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleSubmitQuestion(question.id);
                  }}
                  disabled={!selectedId || submitted}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#31425a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition enabled:hover:bg-[#253347] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {t("actions.showFeedback")}
                </button>

                {!selectedId && !submitted ? (
                  <p className="text-sm text-[#8a97a6]">{t("actions.chooseOneAnswer")}</p>
                ) : null}
              </div>

              {submitted && selectedAnswer ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16 }}
                  className={`mt-5 rounded-2xl border px-4 py-4 ${
                    selectedAnswer.isCorrect
                      ? "border-emerald-200 bg-emerald-50/70"
                      : "border-rose-200 bg-rose-50/70"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0">
                      {selectedAnswer.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                      ) : (
                        <XCircle className="h-5 w-5 text-rose-700" />
                      )}
                    </span>

                    <div className="w-full">
                      <p className="text-sm font-semibold text-[#31425a]">
                        {selectedAnswer.isCorrect
                          ? t("feedback.title")
                          : t("feedback.correctionTitle")}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#556274]">
                        {selectedAnswer.feedbackText ??
                          (selectedAnswer.isCorrect
                            ? t("feedback.correctDefault")
                            : t("feedback.incorrectDefault"))}
                      </p>

                      <div className="mt-4 rounded-2xl border border-[#e8edf3] bg-white/80 px-4 py-4">
                        <p className="text-sm font-semibold text-[#31425a]">
                          {selectedAnswer.isCorrect
                            ? t("feedback.whyCorrect")
                            : t("feedback.correctAnswer")}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[#556274]">
                          {t("feedback.correctAnswerIs", {
                            answer: correctAnswer?.text ?? "—",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </motion.div>
          );
        })}
      </div>
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
