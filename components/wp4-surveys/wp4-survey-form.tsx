"use client";

import Wp4SurveyResult from "@/components/wp4-surveys/wp4-survey-result";
import { submitWp4SurveyAction } from "@/features/wp4-surveys/actions";
import type { AppLocale } from "@/lib/i18n/locales";
import { WP4_SKILLS, type Wp4Skill, type Wp4SurveyScope } from "@/lib/wp4-surveys/definition";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useTransition, type SyntheticEvent } from "react";

const CASE_RATINGS = [
  "engagementEase",
  "greenTransitionUnderstanding",
  "esgEcosystemUnderstanding",
] as const;
const SCENARIO_RATINGS = ["incorporationEase", "participantEngagement"] as const;
type RatingKey = (typeof CASE_RATINGS)[number] | (typeof SCENARIO_RATINGS)[number];

export default function Wp4SurveyForm({
  locale,
  scope,
  completedCount,
}: {
  locale: AppLocale;
  scope: Wp4SurveyScope;
  completedCount: number;
}) {
  const t = useTranslations("Protected.Wp4Survey");
  const [ratings, setRatings] = useState<Partial<Record<RatingKey, number>>>({});
  const [skills, setSkills] = useState<Wp4Skill[]>([]);
  const [challenges, setChallenges] = useState("");
  const [implementationChallenges, setImplementationChallenges] = useState("");
  const [improvements, setImprovements] = useState("");
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [platformEligible, setPlatformEligible] = useState(false);
  const [pending, startTransition] = useTransition();
  const isCase = scope === "case-studies";
  const keys: readonly RatingKey[] = isCase ? CASE_RATINGS : SCENARIO_RATINGS;
  const backHref = `/${locale}/${isCase ? "eportfolio" : "scenarios"}`;

  const submit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);
    if (
      skills.length === 0 ||
      keys.some((key) => ratings[key] === undefined) ||
      !challenges.trim() ||
      !improvements.trim() ||
      (!isCase && !implementationChallenges.trim())
    ) {
      setError(true);
      return;
    }
    startTransition(async () => {
      try {
        const result = isCase
          ? await submitWp4SurveyAction({
              scope: "case-studies",
              locale,
              engagementEase: ratings.engagementEase ?? 0,
              greenTransitionUnderstanding: ratings.greenTransitionUnderstanding ?? 0,
              esgEcosystemUnderstanding: ratings.esgEcosystemUnderstanding ?? 0,
              skills,
              challenges,
              improvements,
            })
          : await submitWp4SurveyAction({
              scope: "scenarios",
              locale,
              incorporationEase: ratings.incorporationEase ?? 0,
              participantEngagement: ratings.participantEngagement ?? 0,
              skills,
              challenges,
              implementationChallenges,
              improvements,
            });
        setPlatformEligible(result.nextPath !== null);
        setSubmitted(true);
      } catch {
        setError(true);
      }
    });
  };

  if (submitted) {
    return (
      <Wp4SurveyResult
        locale={locale}
        scope={scope}
        state="submitted"
        platformEligible={platformEligible}
      />
    );
  }

  return (
    <section className="rounded-[30px] border border-[#e5eaf0] bg-white p-6 shadow-sm md:p-10">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#536174] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t("back")}
      </Link>
      <h1 className="mt-6 text-3xl font-bold text-[#31425a]">{t(`scope.${scope}.title`)}</h1>
      <p className="mt-3 text-sm leading-7 text-[#536174]">{t(`scope.${scope}.description`)}</p>
      <p className="mt-3 text-xs leading-6 text-[#667180]">{t("privacy")}</p>
      <form onSubmit={submit} className="mt-7 space-y-6">
        {isCase ? (
          <section
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4"
            aria-label={t("caseStudies.q1")}
          >
            <p className="text-sm font-semibold text-[#31425a]">1. {t("caseStudies.q1")}</p>
            <p
              className="mt-2 text-3xl font-bold text-emerald-800"
              data-testid="wp4-completed-count"
            >
              {completedCount}
            </p>
            <p className="mt-1 text-xs text-[#536174]">{t("autoCountNote")}</p>
          </section>
        ) : null}
        {keys.map((key, index) => (
          <fieldset key={key} className="rounded-2xl border border-[#e5eaf0] p-4">
            <legend className="px-2 text-sm font-semibold leading-6 text-[#31425a]">
              {index + (isCase ? 2 : 1)}. {t(`${isCase ? "caseStudies" : "scenarios"}.${key}`)} *
            </legend>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {[1, 2, 3, 4, 5].map((score) => (
                <label
                  key={score}
                  className="inline-flex min-h-11 min-w-12 cursor-pointer items-center gap-2 rounded-xl border border-[#d9e2ec] px-3 py-2 text-sm"
                >
                  <input
                    type="radio"
                    name={key}
                    value={score}
                    required
                    checked={ratings[key] === score}
                    onChange={() => {
                      setRatings((previous) => ({ ...previous, [key]: score }));
                    }}
                    className="accent-emerald-600"
                  />
                  {score}
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#667180]">{t("ratingScale")}</p>
          </fieldset>
        ))}
        <fieldset className="rounded-2xl border border-[#e5eaf0] p-4">
          <legend className="px-2 text-sm font-semibold leading-6 text-[#31425a]">
            {isCase ? 5 : 3}. {t(isCase ? "caseStudies.skills" : "scenarios.skills")} *
          </legend>
          <p className="mt-2 text-xs text-[#667180]">{t("multiSelect")}</p>
          <div className="mt-3 space-y-3">
            {WP4_SKILLS.map((skill) => (
              <label
                key={skill}
                className="flex min-h-10 items-center gap-3 text-sm text-[#31425a]"
              >
                <input
                  type="checkbox"
                  checked={skills.includes(skill)}
                  onChange={(event) => {
                    setSkills((current) =>
                      event.target.checked
                        ? [...current, skill]
                        : current.filter((item) => item !== skill),
                    );
                  }}
                  className="h-4 w-4 accent-emerald-600"
                />
                {t(`skills.${skill}`)}
              </label>
            ))}
          </div>
        </fieldset>
        {(
          [
            { key: "challenges", index: isCase ? 6 : 4, value: challenges, set: setChallenges },
            ...(!isCase
              ? [
                  {
                    key: "implementationChallenges",
                    index: 5,
                    value: implementationChallenges,
                    set: setImplementationChallenges,
                  },
                ]
              : []),
            {
              key: "improvements",
              index: isCase ? 7 : 6,
              value: improvements,
              set: setImprovements,
            },
          ] as const
        ).map((item) => (
          <label key={item.key} className="block text-sm font-semibold leading-6 text-[#31425a]">
            {item.index}. {t(`${isCase ? "caseStudies" : "scenarios"}.${item.key}`)} *
            <textarea
              rows={3}
              required
              maxLength={2000}
              value={item.value}
              onChange={(event) => {
                item.set(event.target.value);
              }}
              placeholder={t("noneHint")}
              className="mt-2 block w-full rounded-xl border border-[#d9e2ec] p-3 text-sm font-normal text-[#31425a]"
            />
          </label>
        ))}
        {error ? (
          <p role="alert" className="text-sm text-red-700">
            {t("error")}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#31425a] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {pending ? t("sending") : t("submit")}
        </button>
      </form>
    </section>
  );
}
