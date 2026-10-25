"use client";

import { submitPilotSatisfactionAction } from "@/features/pilot-satisfaction/actions";
import { PILOT_COUNTRIES, type PilotCountry, type PilotRatings, type PilotSurveyScope } from "@/lib/pilot-satisfaction/validation";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type SyntheticEvent } from "react";

type CaseOption = { id: string; title: string };

type Props = { locale: string; scope: PilotSurveyScope; caseStudies: CaseOption[] };
const RATING_KEYS = ["contentClarity", "practicalRelevance", "usability", "overallSatisfaction"] as const;
const OFFICIAL_WP3_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSd7HkZOE4-U2N8GkCSE_4rzUIUW7WqrQ4MT2h1cUG7Cd8cjuQ/viewform";

export default function PilotSatisfactionForm({ locale, scope, caseStudies }: Props) {
  const t = useTranslations("Protected.PilotSatisfaction");
  const router = useRouter();
  const [countryCode, setCountryCode] = useState<PilotCountry | "">("");
  const [caseStudyId, setCaseStudyId] = useState(caseStudies.length === 1 ? caseStudies[0].id : "");
  const [ratings, setRatings] = useState<Partial<PilotRatings>>({});
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const backHref = `/${locale}/${scope === "curriculum" ? "curriculum" : "eportfolio"}`;

  const submit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);
    const { contentClarity, practicalRelevance, usability, overallSatisfaction } = ratings;
    if (!countryCode || (scope === "eportfolio" && !caseStudyId) ||
        contentClarity === undefined || practicalRelevance === undefined ||
        usability === undefined || overallSatisfaction === undefined) {
      setError(true);
      return;
    }
    startTransition(async () => {
      try {
        await submitPilotSatisfactionAction({
          scope, locale, countryCode,
          caseStudyId: scope === "eportfolio" ? caseStudyId : undefined,
          contentClarity,
          practicalRelevance,
          usability,
          overallSatisfaction,
          strengths, improvements,
        });
        setDone(true);
        router.refresh();
      } catch {
        setError(true);
      }
    });
  };

  return (
    <section className="rounded-[30px] border border-white/80 bg-white px-6 py-8 shadow-[0_12px_34px_rgba(35,45,62,0.06)] md:px-10">
      <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-[#536174] hover:underline">
        <ArrowLeft className="h-4 w-4" />{t("back")}
      </Link>
      {done ? (
        <div role="status" className="mt-8">
          <CheckCircle2 className="h-11 w-11 text-emerald-600" />
          <h1 className="mt-4 text-2xl font-bold text-[#31425a]">{t("success")}</h1>
          <p className="mt-3 text-[#536174]">{t("saved")}</p>
        </div>
      ) : (
        <>
          <h1 className="mt-6 text-3xl font-bold text-[#31425a]">{t(`scope.${scope}.title`)}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#536174]">{t(`scope.${scope}.description`)}</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#536174]">{t("privacy")}</p>
          {scope === "curriculum" ? (
            <p className="mt-4 rounded-xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-[#31425a]">
              {t("officialNotice")}{" "}
              <a className="font-semibold underline" href={OFFICIAL_WP3_FORM} target="_blank" rel="noopener noreferrer">
                {t("officialLink")}
              </a>
            </p>
          ) : null}
          <form onSubmit={submit} className="mt-7 space-y-6">
            <label className="block text-sm font-semibold text-[#31425a]">
              {t("country")} *
              <select required value={countryCode} onChange={(e) => { setCountryCode(e.target.value as PilotCountry | ""); }}
                className="mt-2 block w-full rounded-xl border border-[#d9e2ec] bg-white px-4 py-3 text-[#31425a]">
                <option value="">{t("choose")}</option>
                {PILOT_COUNTRIES.map((code) => <option key={code} value={code}>{t(`countries.${code}`)}</option>)}
              </select>
            </label>
            {scope === "eportfolio" ? (
              <label className="block text-sm font-semibold text-[#31425a]">
                {t("caseStudy")} *
                <select required value={caseStudyId} onChange={(e) => { setCaseStudyId(e.target.value); }}
                  className="mt-2 block w-full rounded-xl border border-[#d9e2ec] bg-white px-4 py-3 text-[#31425a]">
                  <option value="">{t("choose")}</option>
                  {caseStudies.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                </select>
              </label>
            ) : null}
            {RATING_KEYS.map((key) => (
              <fieldset key={key} className="rounded-2xl border border-[#e5eaf0] p-4">
                <legend className="px-2 text-sm font-semibold text-[#31425a]">{t(`questions.${key}`)} *</legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <label key={score} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#d9e2ec] px-4 py-2 text-sm">
                      <input type="radio" name={key} value={score} required checked={ratings[key] === score}
                        onChange={() => { setRatings((previous) => ({ ...previous, [key]: score })); }}
                        className="accent-emerald-600" />
                      {score}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <p className="text-xs text-[#667180]">{t("scale")}</p>
            <label className="block text-sm font-semibold text-[#31425a]">{t("strengths")}
              <textarea maxLength={2000} rows={3} value={strengths} onChange={(e) => { setStrengths(e.target.value); }}
                className="mt-2 block w-full rounded-xl border border-[#d9e2ec] p-3 text-[#31425a]" />
            </label>
            <label className="block text-sm font-semibold text-[#31425a]">{t("improvements")}
              <textarea maxLength={2000} rows={3} value={improvements} onChange={(e) => { setImprovements(e.target.value); }}
                className="mt-2 block w-full rounded-xl border border-[#d9e2ec] p-3 text-[#31425a]" />
            </label>
            {error ? <p role="alert" className="text-sm text-red-700">{t("error")}</p> : null}
            <button type="submit" disabled={pending}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#31425a] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{t("submit")}
            </button>
          </form>
        </>
      )}
    </section>
  );
}
