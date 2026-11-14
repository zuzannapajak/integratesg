"use client";

import type { Wp4SurveyScope } from "@/lib/wp4-surveys/definition";
import { ArrowLeft, CheckCircle2, Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Wp4SurveyResult({
  locale,
  scope,
  state,
  platformEligible,
}: {
  locale: string;
  scope: Wp4SurveyScope;
  state: "submitted" | "unavailable";
  platformEligible: boolean;
}) {
  const t = useTranslations("Protected.Wp4Survey");
  const returnHref = `/${locale}/${scope === "case-studies" ? "eportfolio" : "scenarios"}`;
  return (
    <section
      role="status"
      className="rounded-[30px] border border-[#e5eaf0] bg-white px-6 py-10 text-center shadow-sm"
    >
      {state === "submitted" ? (
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" aria-hidden="true" />
      ) : (
        <Clock3 className="mx-auto h-12 w-12 text-[#667180]" aria-hidden="true" />
      )}
      <h1 className="mt-4 text-2xl font-bold text-[#31425a]">
        {t(state === "submitted" ? "submitted" : "unavailable")}
      </h1>
      <p className="mt-3 text-sm leading-6 text-[#667180]">
        {t(state === "submitted" ? "saved" : "eligibility")}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href={returnHref}
          className="inline-flex items-center gap-2 rounded-xl border border-[#d9e2ec] px-5 py-3 text-sm font-semibold text-[#31425a]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t("back")}
        </Link>
        {platformEligible ? (
          <Link
            href={`/${locale}/platform-feedback?context=wp4`}
            className="rounded-xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white"
          >
            {t("platformFeedback")}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
