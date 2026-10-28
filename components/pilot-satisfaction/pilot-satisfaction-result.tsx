"use client";

import type { PilotSurveyScope } from "@/lib/pilot-satisfaction/validation";
import { ArrowRight, CheckCircle2, Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  locale: string;
  scope: PilotSurveyScope;
  state: "submitted" | "already-submitted" | "unavailable";
};

export default function PilotSatisfactionResult({ locale, scope, state }: Props) {
  const t = useTranslations("Protected.PilotSatisfaction");
  const isUnavailable = state === "unavailable";
  const title = isUnavailable ? t("notAvailable") : t("success");
  const description = isUnavailable
    ? t(`scope.${scope}.eligibility`)
    : state === "already-submitted"
      ? t("alreadySubmitted")
      : t("saved");
  const backLabel = scope === "curriculum" ? t("returnToCurriculum") : t("returnToEportfolio");
  const backHref = `/${locale}/${scope === "curriculum" ? "curriculum" : "eportfolio"}`;

  return (
    <section
      role="status"
      aria-live="polite"
      className="overflow-hidden rounded-[30px] border border-white/80 bg-white px-5 py-10 text-center shadow-[0_16px_45px_rgba(35,45,62,0.08)] sm:px-10 sm:py-14"
    >
      <span
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] ${
          isUnavailable ? "bg-[#eef2f6] text-[#536174]" : "bg-emerald-50 text-[#0b8c69]"
        }`}
      >
        {isUnavailable ? (
          <Clock3 aria-hidden="true" className="h-8 w-8" />
        ) : (
          <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
        )}
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-[#31425a] sm:text-3xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#667180] sm:text-base">
        {description}
      </p>
      <Link
        href={backHref}
        className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#253347] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#31425a]"
      >
        {backLabel}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </section>
  );
}
