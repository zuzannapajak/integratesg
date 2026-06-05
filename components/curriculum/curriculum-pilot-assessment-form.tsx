"use client";

import {
  submitCurriculumPilotPostAssessmentAction,
  submitCurriculumPilotPreAssessmentAction,
} from "@/features/curriculum/pilot-actions";
import type { CurriculumPilotAssessmentQuestionViewModel } from "@/lib/curriculum/pilot";
import { ArrowRight, ClipboardCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SyntheticEvent } from "react";
import { useMemo, useState, useTransition } from "react";

type Props = {
  locale: string;
  nextPath: string;
  assessmentType: "pre" | "post";
  questions: CurriculumPilotAssessmentQuestionViewModel[];
};

type AssessmentCopy = {
  eyebrow: string;
  title: string;
  description: string;
  scaleTitle: string;
  submit: string;
  submitting: string;
  answered: string;
  required: string;
  validationError: string;
  submitError: string;
};

const SURFACE =
  "rounded-[30px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

function getAssessmentCopy(locale: string, assessmentType: "pre" | "post"): AssessmentCopy {
  if (locale === "pl") {
    if (assessmentType === "post") {
      return {
        eyebrow: "Post-assessment pilotażowy",
        title: "Samoocena po korzystaniu z modułów IntegratESG",
        description:
          "Po ukończeniu wybranych modułów IntegratESG wskaż, jak pewnie czujesz się teraz w poniższych zadaniach związanych z ESG. Odpowiedz ponownie na te same pytania, aby można było zmierzyć postęp w nauce.",
        scaleTitle: "Skala odpowiedzi",
        submit: "Zapisz post-assessment i zakończ udział w pilotażu",
        submitting: "Zapisywanie odpowiedzi...",
        answered: "Udzielono odpowiedzi",
        required: "Wymagane",
        validationError: "Odpowiedz na wszystkie pytania przed przejściem dalej.",
        submitError: "Nie udało się zapisać post-assessmentu. Spróbuj ponownie.",
      };
    }

    return {
      eyebrow: "Pre-assessment pilotażowy",
      title: "Samoocena przed rozpoczęciem modułów IntegratESG",
      description:
        "Przed rozpoczęciem modułów IntegratESG wskaż, jak pewnie czujesz się w poniższych zadaniach związanych z ESG. Nie ma dobrych ani złych odpowiedzi. Twoje odpowiedzi pomogą zmierzyć postęp w nauce.",
      scaleTitle: "Skala odpowiedzi",
      submit: "Zapisz pre-assessment i przejdź dalej",
      submitting: "Zapisywanie odpowiedzi...",
      answered: "Udzielono odpowiedzi",
      required: "Wymagane",
      validationError: "Odpowiedz na wszystkie pytania przed przejściem dalej.",
      submitError: "Nie udało się zapisać pre-assessmentu. Spróbuj ponownie.",
    };
  }

  if (assessmentType === "post") {
    return {
      eyebrow: "Pilot post-assessment",
      title: "Self-assessment after using the IntegratESG modules",
      description:
        "After completing the IntegratESG modules, please indicate how confident you now feel about the following ESG-related tasks. Please answer the same questions again so that learning progress can be measured.",
      scaleTitle: "Response scale",
      submit: "Save post-assessment and finish pilot participation",
      submitting: "Saving answers...",
      answered: "Answered",
      required: "Required",
      validationError: "Please answer all questions before continuing.",
      submitError: "We could not save your post-assessment. Please try again.",
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
    required: "Required",
    validationError: "Please answer all questions before continuing.",
    submitError: "We could not save your pre-assessment. Please try again.",
  };
}

export default function CurriculumPilotAssessmentForm({
  locale,
  nextPath,
  assessmentType,
  questions,
}: Props) {
  const router = useRouter();
  const copy = getAssessmentCopy(locale, assessmentType);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const answeredRequiredCount = useMemo(
    () =>
      questions.filter((question) => {
        const answer = selectedAnswers[question.id];

        if (question.inputType === "likert") {
          return typeof answer === "number";
        }

        return typeof answer === "string" && answer.trim().length > 0;
      }).length,
    [questions, selectedAnswers],
  );

  const allRequiredAnswered = answeredRequiredCount === questions.length;

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!allRequiredAnswered) {
      setError(copy.validationError);
      return;
    }

    startTransition(async () => {
      try {
        const answers = Object.entries(selectedAnswers).map(([questionId, value]) => {
          if (typeof value === "number") {
            return {
              questionId,
              value,
            };
          }

          return {
            questionId,
            valueText: value,
          };
        });

        const result =
          assessmentType === "pre"
            ? await submitCurriculumPilotPreAssessmentAction({
                locale,
                nextPath,
                answers: answers.map((answer) => {
                  if (!("value" in answer) || typeof answer.value !== "number") {
                    throw new Error("Invalid pre-assessment answer.");
                  }

                  return {
                    questionId: answer.questionId,
                    value: answer.value,
                  };
                }),
              })
            : await submitCurriculumPilotPostAssessmentAction({
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

          <div className="mt-5 grid gap-6">
            <div>
              <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-[#31425a] md:text-[2.5rem]">
                {copy.title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#667180] md:text-base md:leading-8">
                {copy.description}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {questions.map((question, questionIndex) => (
              <fieldset
                key={question.id}
                className="rounded-[28px] border border-[#e8edf3] bg-white/82 p-4 shadow-[0_8px_24px_rgba(35,45,62,0.04)] md:p-5"
              >
                <legend className="sr-only">
                  {questionIndex + 1}. {question.prompt}
                </legend>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-base font-bold leading-7 text-emerald-700">
                    {questionIndex + 1}.
                  </span>

                  <div className="min-w-0">
                    <p className="text-base font-bold leading-7 text-[#31425a]">
                      {question.prompt}
                      <span
                        aria-label={copy.required}
                        title={copy.required}
                        className="ml-1 text-rose-500"
                      >
                        *
                      </span>
                    </p>

                    {question.helpText ? (
                      <p className="mt-2 text-sm leading-6 text-[#667180]">{question.helpText}</p>
                    ) : null}
                  </div>
                </div>

                {question.inputType === "likert" ? (
                  <div className="mt-5 grid gap-3 md:grid-cols-5">
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
                              required
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
                ) : (
                  <textarea
                    value={
                      typeof selectedAnswers[question.id] === "string"
                        ? selectedAnswers[question.id]
                        : ""
                    }
                    required
                    onChange={(event) => {
                      setSelectedAnswers((previousAnswers) => ({
                        ...previousAnswers,
                        [question.id]: event.target.value,
                      }));
                    }}
                    rows={5}
                    className="mt-5 w-full rounded-2xl border border-[#d9e2ec] bg-white px-4 py-3 text-sm leading-6 text-[#31425a] outline-none transition placeholder:text-[#a8b3bf] focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  />
                )}
              </fieldset>
            ))}

            <div className="sticky bottom-4 z-10 rounded-3xl border border-white/70 bg-white/92 p-4 shadow-[0_16px_40px_rgba(35,45,62,0.12)] backdrop-blur-xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm font-semibold text-[#667180]">
                  {copy.answered}:{" "}
                  <span className="text-[#31425a]">
                    {answeredRequiredCount}/{questions.length}
                  </span>
                </p>

                <button
                  type="submit"
                  disabled={isPending || !allRequiredAnswered}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347] disabled:cursor-not-allowed disabled:opacity-50"
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
