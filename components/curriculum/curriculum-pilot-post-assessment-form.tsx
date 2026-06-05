"use client";

import type { CurriculumPilotPostAssessmentCalloutViewModel } from "@/lib/curriculum/pilot";
import { ArrowRight, CheckCircle2, ClipboardCheck, LockKeyhole } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  locale: string;
  state: CurriculumPilotPostAssessmentCalloutViewModel;
};

type CardState = "completed" | "available" | "locked";

function getCardState(state: CurriculumPilotPostAssessmentCalloutViewModel): CardState {
  if (state.isCompleted) {
    return "completed";
  }

  if (state.isAvailable) {
    return "available";
  }

  return "locked";
}

export default function CurriculumPilotPostAssessmentCard({ locale, state }: Props) {
  const t = useTranslations("Protected.CurriculumPilotPostAssessmentCard");

  if (!state.shouldShow) {
    return null;
  }

  const cardState = getCardState(state);
  const postAssessmentHref = `/${locale}/curriculum/pilot/post-assessment?next=${encodeURIComponent(
    `/${locale}/curriculum`,
  )}`;

  return (
    <section className="mb-6 overflow-hidden rounded-[28px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl">
      <div className="relative p-5 md:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(11,156,114,0.13),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(49,66,90,0.08),transparent_28%)]" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                state.isCompleted ? "bg-emerald-600 text-white" : "bg-[#31425a] text-white"
              }`}
            >
              {state.isCompleted ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <ClipboardCheck className="h-6 w-6" />
              )}
            </span>

            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-emerald-700">
                {t(`${cardState}.eyebrow`)}
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight text-[#31425a]">
                {t(`${cardState}.title`)}
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667180]">
                {t(`${cardState}.description`)}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {cardState === "available" ? (
              <Link
                href={postAssessmentHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347] lg:w-auto"
              >
                {t("available.action")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : cardState === "locked" ? (
              <div className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#d9e2ec] bg-white px-5 py-3 text-sm font-semibold text-[#667180] lg:w-auto">
                <LockKeyhole className="h-4 w-4" />
                {t("locked.locked")}: {state.completedModulesCount}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
