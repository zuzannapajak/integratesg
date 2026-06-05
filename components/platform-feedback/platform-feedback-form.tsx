"use client";

import { submitPlatformFeedbackAction } from "@/features/platform-feedback/actions";
import { ArrowLeft, CheckCircle2, Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SyntheticEvent, useMemo, useState, useTransition } from "react";

type Props = {
  locale: string;
};

type RatingKey =
  | "easeOfUse"
  | "moduleClarity"
  | "navigation"
  | "testsExperience"
  | "technicalProblems"
  | "overallSatisfaction";

type CompleteRatings = Record<RatingKey, number>;

const ratingKeys: RatingKey[] = [
  "easeOfUse",
  "moduleClarity",
  "navigation",
  "testsExperience",
  "technicalProblems",
  "overallSatisfaction",
];

const SURFACE =
  "rounded-[30px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

function getCompleteRatings(ratings: Partial<Record<RatingKey, number>>): CompleteRatings | null {
  if (
    typeof ratings.easeOfUse !== "number" ||
    typeof ratings.moduleClarity !== "number" ||
    typeof ratings.navigation !== "number" ||
    typeof ratings.testsExperience !== "number" ||
    typeof ratings.technicalProblems !== "number" ||
    typeof ratings.overallSatisfaction !== "number"
  ) {
    return null;
  }

  return {
    easeOfUse: ratings.easeOfUse,
    moduleClarity: ratings.moduleClarity,
    navigation: ratings.navigation,
    testsExperience: ratings.testsExperience,
    technicalProblems: ratings.technicalProblems,
    overallSatisfaction: ratings.overallSatisfaction,
  };
}

export default function PlatformFeedbackForm({ locale }: Props) {
  const t = useTranslations("Protected.PlatformFeedbackForm");
  const router = useRouter();
  const [ratings, setRatings] = useState<Partial<Record<RatingKey, number>>>({});
  const [suggestions, setSuggestions] = useState("");
  const [technicalNotes, setTechnicalNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const answeredCount = useMemo(
    () => ratingKeys.filter((key) => typeof ratings[key] === "number").length,
    [ratings],
  );

  const isComplete = answeredCount === ratingKeys.length;

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    setError(null);

    const completeRatings = getCompleteRatings(ratings);

    if (completeRatings === null) {
      setError(t("validation.required"));
      return;
    }

    startTransition(async () => {
      try {
        await submitPlatformFeedbackAction({
          ...completeRatings,
          suggestions,
          technicalNotes,
        });

        setSubmitted(true);
        router.refresh();
      } catch (caughtError) {
        console.error(caughtError);
        setError(t("validation.submitError"));
      }
    });
  };

  if (submitted) {
    return (
      <section className={`${SURFACE} overflow-hidden`}>
        <div className="relative p-6 md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(11,156,114,0.13),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.90)_0%,rgba(255,255,255,0.97)_100%)]" />

          <div className="relative max-w-3xl">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <CheckCircle2 className="h-7 w-7" />
            </span>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#31425a]">
              {t("success.title")}
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#667180] md:text-base">
              {t("success.description")}
            </p>

            <Link
              href={`/${locale}/dashboard`}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#253347]"
            >
              {t("success.backToDashboard")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${SURFACE} overflow-hidden`}>
      <div className="relative p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(11,156,114,0.13),transparent_28%),radial-gradient(circle_at_88%_10%,rgba(49,66,90,0.10),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.96)_100%)]" />

        <div className="relative">
          <Link
            href={`/${locale}/dashboard`}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#667180] transition hover:text-[#31425a]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Link>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#31425a] md:text-[2.5rem]">
            {t("title")}
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#667180] md:text-base md:leading-8">
            {t("description")}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {ratingKeys.map((key, index) => (
              <fieldset
                key={key}
                className="rounded-[28px] border border-[#e8edf3] bg-white/82 p-4 shadow-[0_8px_24px_rgba(35,45,62,0.04)] md:p-5"
              >
                <legend className="sr-only">{t(`questions.${key}.label`)}</legend>

                <div className="rounded-3xl border border-[#e8edf3] bg-[#f8fafc]/90 px-4 py-4 md:px-5">
                  <p className="text-base font-bold leading-7 text-[#31425a]">
                    <span className="mr-2 text-emerald-700">{index + 1}.</span>
                    {t(`questions.${key}.label`)}
                    <span className="ml-1 text-rose-500">*</span>
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#667180]">
                    {t(`questions.${key}.hint`)}
                  </p>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-5">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const selected = ratings[key] === value;

                    return (
                      <label
                        key={value}
                        className={`flex cursor-pointer flex-col gap-2 rounded-2xl border px-3 py-3 text-sm transition ${
                          selected
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                            : "border-[#e8edf3] bg-white text-[#667180] hover:border-emerald-200 hover:bg-emerald-50/40"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={key}
                            value={value}
                            checked={selected}
                            required
                            onChange={() => {
                              setRatings((previousRatings) => ({
                                ...previousRatings,
                                [key]: value,
                              }));
                            }}
                            className="h-4 w-4 accent-emerald-600"
                          />
                          <span className="font-bold">{value}</span>
                        </span>
                        <span className="text-xs leading-5">{t(`scale.${value}`)}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <div className="rounded-[28px] border border-[#e8edf3] bg-white/82 p-4 shadow-[0_8px_24px_rgba(35,45,62,0.04)] md:p-5">
              <label className="block">
                <span className="text-base font-bold text-[#31425a]">
                  {t("openQuestions.suggestions.label")}
                </span>
                <span className="mt-1 block text-sm leading-6 text-[#667180]">
                  {t("openQuestions.suggestions.hint")}
                </span>
                <textarea
                  value={suggestions}
                  onChange={(event) => {
                    setSuggestions(event.target.value);
                  }}
                  rows={5}
                  className="mt-4 w-full rounded-2xl border border-[#d9e2ec] bg-white px-4 py-3 text-sm leading-6 text-[#31425a] outline-none transition placeholder:text-[#a8b3bf] focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                />
              </label>
            </div>

            <div className="rounded-[28px] border border-[#e8edf3] bg-white/82 p-4 shadow-[0_8px_24px_rgba(35,45,62,0.04)] md:p-5">
              <label className="block">
                <span className="text-base font-bold text-[#31425a]">
                  {t("openQuestions.technicalNotes.label")}
                </span>
                <span className="mt-1 block text-sm leading-6 text-[#667180]">
                  {t("openQuestions.technicalNotes.hint")}
                </span>
                <textarea
                  value={technicalNotes}
                  onChange={(event) => {
                    setTechnicalNotes(event.target.value);
                  }}
                  rows={5}
                  className="mt-4 w-full rounded-2xl border border-[#d9e2ec] bg-white px-4 py-3 text-sm leading-6 text-[#31425a] outline-none transition placeholder:text-[#a8b3bf] focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                />
              </label>
            </div>

            <div className="sticky bottom-4 z-10 rounded-3xl border border-white/70 bg-white/92 p-4 shadow-[0_16px_40px_rgba(35,45,62,0.12)] backdrop-blur-xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm font-semibold text-[#667180]">
                  {t("answered")}:{" "}
                  <span className="text-[#31425a]">
                    {answeredCount}/{ratingKeys.length}
                  </span>
                </p>

                <button
                  type="submit"
                  disabled={isPending || !isComplete}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {isPending ? t("submitting") : t("submit")}
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
