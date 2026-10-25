"use client";

import { completeCaseStudyAction } from "@/features/eportfolio/actions";
import type { EportfolioProgress } from "@/lib/eportfolio/library";
import { ArrowRight, BookOpen, Check, CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  locale: string;
  slug: string;
  caseStudyTitle: string;
  initialProgress: EportfolioProgress;
  nextCaseStudy: {
    slug: string;
    title: string;
  } | null;
};

export default function EportfolioProgressActions({
  locale,
  slug,
  caseStudyTitle,
  initialProgress,
  nextCaseStudy,
}: Props) {
  const t = useTranslations("Protected.EportfolioProgressActions");
  const tSurvey = useTranslations("Protected.PilotSatisfaction");
  const router = useRouter();
  const [progress, setProgress] = useState<EportfolioProgress>(initialProgress);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isCompleted = progress === "completed";
  const surveyHref = `/${locale}/pilot-satisfaction/eportfolio`;

  function handleComplete() {
    setErrorMessage(null);

    startTransition(async () => {
      try {
        const result = await completeCaseStudyAction({
          locale,
          slug,
        });

        setProgress(result.status);
        router.refresh();
      } catch {
        setErrorMessage(t("error"));
      }
    });
  }

  return (
    <section className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/88 px-5 py-8 shadow-[0_16px_40px_rgba(35,45,62,0.08)] backdrop-blur-xl sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(11,156,114,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(49,66,90,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.98)_100%)]" />

      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          {isCompleted ? (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#0b8c69] shadow-[0_10px_30px_rgba(11,140,105,0.15)]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          ) : (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-[#31425a]">
              <BookOpen className="h-8 w-8" />
            </div>
          )}

          <h1
            className={`text-2xl font-bold tracking-tight text-[#31425a] sm:text-3xl ${
              isCompleted ? "mt-5" : "mt-5"
            }`}
          >
            {isCompleted ? t("completedTitle", { title: caseStudyTitle }) : t("title")}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#667180] sm:text-[0.98rem]">
            {isCompleted ? t("completedDescription") : t("description")}
          </p>

          {errorMessage ? (
            <p
              className="mt-4 text-sm font-medium text-rose-600"
              role="alert"
              aria-live="assertive"
            >
              {errorMessage}
            </p>
          ) : null}
        </div>

        {!isCompleted ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleComplete}
              disabled={isPending}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {isPending ? t("saving") : t("markCompleted")}
            </button>

            <p className="text-sm text-[#8a97a6]">{tSurvey("scope.eportfolio.eligibility")}</p>
          </div>
        ) : (
          <div
            className={`mt-8 grid gap-4 ${
              nextCaseStudy ? "lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.9fr)]" : ""
            }`}
          >
            <div className="rounded-[28px] border border-[#d6eee7] bg-linear-to-br from-emerald-50 via-white to-white p-6 text-left shadow-[0_18px_40px_rgba(11,156,114,0.08)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-2xl bg-white/90 p-3 text-[#21624f] shadow-sm ring-1 ring-emerald-100">
                  <MessageSquare className="h-5 w-5" />
                </div>

                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#21624f]">
                  {tSurvey("open")}
                </span>
              </div>

              <h2 className="mt-5 text-xl font-bold tracking-tight text-[#31425a] sm:text-[1.35rem]">
                {tSurvey("scope.eportfolio.title")}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[#5f6e7c]">{tSurvey("callout")}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={surveyHref}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#21624f] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#184b3d]"
                >
                  {tSurvey("open")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <span className="inline-flex items-center rounded-full border border-[#d9e2ec] bg-white px-3 py-2 text-xs font-medium text-[#667180]">
                  {t("completedDescription")}
                </span>
              </div>
            </div>

            {nextCaseStudy ? (
              <Link
                href={`/${locale}/eportfolio/${nextCaseStudy.slug}`}
                className="group rounded-[28px] border border-[#e8edf3] bg-white/92 p-6 text-left shadow-[0_12px_32px_rgba(35,45,62,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(35,45,62,0.08)]"
              >
                <div className="rounded-2xl bg-[#eef2f6] p-3 text-[#31425a] w-fit">
                  <BookOpen className="h-5 w-5" />
                </div>

                <p className="mt-5 text-lg font-semibold text-[#31425a]">{t("nextCaseStudy")}</p>

                <p className="mt-2 text-sm leading-6 text-[#667180]">{nextCaseStudy.title}</p>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#31425a]">
                  {t("nextCaseStudy")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
