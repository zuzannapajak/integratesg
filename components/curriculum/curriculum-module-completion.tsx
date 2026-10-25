"use client";

import CertificateDownloadButton from "@/components/curriculum/certificate-download-button";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  MessageSquareText,
  RotateCcw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export type CurriculumCompletionStep = "assessment" | "feedback" | "explore";

type Props = {
  locale: string;
  slug: string;
  completionStep: CurriculumCompletionStep;
  certificateAvailable: boolean;
  onRetake: () => void;
  isPending: boolean;
};

const STEP_ICONS = {
  assessment: ClipboardCheck,
  feedback: MessageSquareText,
  explore: BookOpen,
} satisfies Record<CurriculumCompletionStep, typeof BookOpen>;

export default function CurriculumModuleCompletion({
  locale,
  slug,
  completionStep,
  certificateAvailable,
  onRetake,
  isPending,
}: Props) {
  const t = useTranslations("Protected.ModulePlayerShell");
  const NextStepIcon = STEP_ICONS[completionStep];
  const mainHref =
    completionStep === "assessment"
      ? `/${locale}/curriculum/pilot/post-assessment?next=${encodeURIComponent(`/${locale}/curriculum`)}`
      : completionStep === "feedback"
        ? `/${locale}/pilot-satisfaction/curriculum`
        : `/${locale}/curriculum`;

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_16px_45px_rgba(35,45,62,0.08)]">
      <div className="relative isolate overflow-hidden px-5 py-9 sm:px-8 sm:py-12">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_10%,rgba(11,156,114,0.11),transparent_36%),radial-gradient(circle_at_86%_72%,rgba(13,127,194,0.07),transparent_36%)]" />
        <div className="mx-auto max-w-4xl">
          <div className="text-center" role="status" aria-live="polite">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-[0_12px_30px_rgba(11,156,114,0.10)]">
              <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
            </span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
              {t("completed.badge")}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#31425a] sm:text-3xl">
              {t("completed.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#667180] sm:text-base">
              {t("completed.savedSummary")}
            </p>
          </div>

          <div className="mt-9 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(250px,0.9fr)]">
            <div className="rounded-[26px] border border-emerald-100 bg-linear-to-br from-emerald-50 via-[#f7fcfa] to-white p-5 shadow-[0_12px_32px_rgba(11,156,114,0.06)] sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                <NextStepIcon aria-hidden="true" className="h-5 w-5" />
              </span>
              {completionStep !== "explore" ? (
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
                  {t("completed.nextStep.eyebrow")}
                </p>
              ) : null}
              <h3 className="mt-1 text-xl font-bold tracking-tight text-[#31425a]">
                {t(`completed.nextStep.${completionStep}.title`)}
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-7 text-[#536174]">
                {t(`completed.nextStep.${completionStep}.description`)}
              </p>
              <Link
                href={mainHref}
                className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#21624f] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(33,98,79,0.16)] transition hover:bg-[#174b3c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#21624f] sm:w-auto"
              >
                {t(`completed.nextStep.${completionStep}.action`)}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
              </Link>
            </div>

            <div className="flex flex-col justify-between gap-5 rounded-[26px] border border-[#e6ebf0] bg-white p-5 sm:p-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#667180]">
                  {t("completed.finalProgress")}
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-[#31425a]">100%</p>
                <div
                  role="progressbar"
                  aria-label={t("completed.finalProgress")}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={100}
                  className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#e9eef2]"
                >
                  <div className="h-full w-full rounded-full bg-[#0b9c72]" />
                </div>
              </div>
              <div className="border-t border-[#e8edf3] pt-5">
                <h3 className="text-sm font-semibold text-[#31425a]">
                  {certificateAvailable
                    ? t("completed.certificate.availableTitle")
                    : t("completed.certificate.lockedTitle")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#667180]">
                  {certificateAvailable
                    ? t("completed.certificate.availableDescription")
                    : t("completed.certificate.lockedDescription")}
                </p>
                {certificateAvailable ? (
                  <div className="mt-4">
                    <CertificateDownloadButton slug={slug} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-[#edf1f5] pt-6">
            <Link
              href={`/${locale}/curriculum/${slug}`}
              className="rounded-md px-1 py-2 text-sm font-medium text-[#536174] underline-offset-4 hover:text-[#31425a] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21624f]"
            >
              {t("completed.reviewOverview")}
            </Link>
            {completionStep !== "explore" ? (
              <Link
                href={`/${locale}/curriculum`}
                className="rounded-md px-1 py-2 text-sm font-medium text-[#536174] underline-offset-4 hover:text-[#31425a] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21624f]"
              >
                {t("completed.exploreMore")}
              </Link>
            ) : null}
            <button
              type="button"
              onClick={onRetake}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-md px-1 py-2 text-sm font-medium text-[#667180] underline-offset-4 hover:text-[#31425a] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21624f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              {t("completed.retake")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
