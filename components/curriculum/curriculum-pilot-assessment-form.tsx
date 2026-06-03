"use client";

import { submitCurriculumPilotPreAssessmentAction } from "@/features/curriculum/pilot-actions";
import type { CurriculumPilotLikertQuestionViewModel } from "@/lib/curriculum/pilot";
import { ArrowRight, ClipboardCheck, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SyntheticEvent } from "react";
import { useMemo, useState, useTransition } from "react";

type Props = {
  locale: string;
  nextPath: string;
  questions: CurriculumPilotLikertQuestionViewModel[];
};

type PreAssessmentCopy = {
  eyebrow: string;
  title: string;
  description: string;
  scaleTitle: string;
  submit: string;
  submitting: string;
  answered: string;
  validationError: string;
  submitError: string;
};

const SURFACE =
  "rounded-[30px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

function getPreAssessmentCopy(locale: string): PreAssessmentCopy {
  if (locale === "pl") {
    return {
      eyebrow: "Pre-assessment pilotażowy",
      title: "Samoocena przed rozpoczęciem modułów IntegratESG",
      description:
        "Przed rozpoczęciem modułów IntegratESG wskaż, jak pewnie czujesz się w poniższych zadaniach związanych z ESG. Nie ma dobrych ani złych odpowiedzi. Twoje odpowiedzi pomogą zmierzyć postęp w nauce.",
      scaleTitle: "Skala odpowiedzi",
      submit: "Zapisz pre-assessment i przejdź dalej",
      submitting: "Zapisywanie odpowiedzi...",
      answered: "Udzielono odpowiedzi",
      validationError: "Odpowiedz na wszystkie pytania przed przejściem dalej.",
      submitError: "Nie udało się zapisać pre-assessmentu. Spróbuj ponownie.",
    };
  }

  return {
    eyebrow: "Pilot pre-assessment",
    title: "Self-assessment before starting the IntegratESG modules",
    description:
      "Before starting the IntegratESG modules, please indicate how confident you currently feel about the following ESG-related tasks. There are no right or wrong answers. Your responses will help us measure learning progress.",
    scaleTitle: "Response scale",
    submit: "Save pre-assessment and continue",
    submitting: "Saving answers...",
    answered: "Answered",
    validationError: "Please answer all questions before continuing.",
    submitError: "We could not save your pre-assessment. Please try again.",
  };
}

export default function CurriculumPilotAssessmentForm({ locale, nextPath, questions }: Props) {
  const router = useRouter();
  const copy = getPreAssessmentCopy(locale);
  const [selectedAnswers, setSelectedAnswers] = useState<Partial<Record<string, number>>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const answeredCount = useMemo(
    () => questions.filter((question) => selectedAnswers[question.id] !== undefined).length,
    [questions, selectedAnswers],
  );

  const allAnswered = answeredCount === questions.length;

  const responseScale = questions.at(0)?.scaleOptions ?? [];

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!allAnswered) {
      setError(copy.validationError);
      return;
    }

    startTransition(async () => {
      try {
        const answers = questions.map((question) => {
          const value = selectedAnswers[question.id];

          if (value === undefined) {
            throw new Error(`Missing answer for question ${question.id}.`);
          }

          return {
            questionId: question.id,
            value,
          };
        });

        const result = await submitCurriculumPilotPreAssessmentAction({
          locale,
          nextPath,
          answers,
        });

        router.replace(result.nextPath);
        router.refresh();
      } catch (caughtError) {
        console.error(caughtError);
        setError(copy.submitError);
      }
    });
  };

  return (
    <section className={`${SURFACE} overflow-hidden`}>
      <div className="relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(11,156,114,0.13),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(49,66,90,0.10),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.90)_0%,rgba(255,255,255,0.97)_100%)]" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-emerald-700">
            <ClipboardCheck className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </span>

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div>
              <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-[#31425a] md:text-[2.5rem]">
                {copy.title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#667180] md:text-base md:leading-8">
                {copy.description}
              </p>
            </div>

            <aside className="rounded-3xl border border-[#e8edf3] bg-white/82 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-[#31425a]">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                {copy.scaleTitle}
              </div>

              <div className="mt-4 grid gap-2">
                {responseScale.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center gap-3 rounded-2xl border border-[#edf1f5] bg-white px-3 py-2 text-sm text-[#667180]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f1f5f8] text-xs font-bold text-[#31425a]">
                      {option.value}
                    </span>
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {questions.map((question, questionIndex) => (
              <fieldset
                key={question.id}
                className="rounded-[26px] border border-[#e8edf3] bg-white/82 p-5 shadow-[0_8px_24px_rgba(35,45,62,0.04)]"
              >
                <legend className="text-base font-bold leading-7 text-[#31425a]">
                  <span className="mr-2 text-emerald-700">{questionIndex + 1}.</span>
                  {question.prompt}
                </legend>

                {question.helpText ? (
                  <p className="mt-2 text-sm leading-6 text-[#667180]">{question.helpText}</p>
                ) : null}

                <div className="mt-5 grid gap-2 md:grid-cols-5">
                  {question.scaleOptions.map((option) => {
                    const selected = selectedAnswers[question.id] === option.value;

                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer flex-col gap-2 rounded-2xl border px-3 py-3 text-sm transition ${
                          selected
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                            : "border-[#e8edf3] bg-white text-[#667180] hover:border-emerald-200 hover:bg-emerald-50/40"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={question.id}
                            value={option.value}
                            checked={selected}
                            onChange={() => {
                              setSelectedAnswers((previousAnswers) => ({
                                ...previousAnswers,
                                [question.id]: option.value,
                              }));
                            }}
                            className="h-4 w-4 accent-emerald-600"
                          />
                          <span className="font-bold">{option.value}</span>
                        </span>
                        <span className="text-xs leading-5">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <div className="sticky bottom-4 z-10 rounded-3xl border border-white/70 bg-white/92 p-4 shadow-[0_16px_40px_rgba(35,45,62,0.12)] backdrop-blur-xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm font-semibold text-[#667180]">
                  {copy.answered}:{" "}
                  <span className="text-[#31425a]">
                    {answeredCount}/{questions.length}
                  </span>
                </p>

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347] disabled:opacity-60"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isPending ? copy.submitting : copy.submit}
                  {!isPending ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </div>

              {error ? (
                <p className="mt-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                  {error}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
