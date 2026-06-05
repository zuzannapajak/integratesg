"use client";

import { skipCurriculumPilotPreAssessmentAction } from "@/features/curriculum/pilot-actions";
import { ArrowLeft, ArrowRight, BookOpenCheck, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  locale: string;
  moduleSlug: string;
  moduleTitle: string;
  returnPath: string;
};

const SURFACE =
  "rounded-[30px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

export default function CurriculumPilotEntryGate({
  locale,
  moduleSlug,
  moduleTitle,
  returnPath,
}: Props) {
  const t = useTranslations("Protected.CurriculumPilotEntryGate");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);

  const preAssessmentHref = `/${locale}/curriculum/pilot/pre-assessment?next=${encodeURIComponent(
    returnPath,
  )}`;

  const handleSkip = () => {
    setError(null);

    startTransition(async () => {
      try {
        await skipCurriculumPilotPreAssessmentAction({
          courseSlug: moduleSlug,
        });

        setShowSkipConfirmation(false);
        router.refresh();
      } catch (caughtError) {
        console.error(caughtError);
        setError(t("error"));
      }
    });
  };

  return (
    <section className={`${SURFACE} overflow-hidden`}>
      <div className="relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(11,156,114,0.13),transparent_28%),radial-gradient(circle_at_88%_10%,rgba(49,66,90,0.10),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.96)_100%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:items-center">
          <div>
            <Link
              href={returnPath}
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#667180] transition hover:text-[#31425a]"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </Link>

            <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-[#31425a] md:text-[2.6rem]">
              {t("title")}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#667180] md:text-base md:leading-8">
              {t("description")}
            </p>

            <div className="mt-6 rounded-3xl border border-[#e8edf3] bg-white/76 p-4">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                {t("moduleLabel")}
              </p>
              <p className="mt-2 text-lg font-bold text-[#31425a]">{moduleTitle}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[26px] border border-[#dce7f2] bg-white/86 p-5 shadow-[0_10px_26px_rgba(35,45,62,0.05)]">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#31425a] text-white">
                  <BookOpenCheck className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-[#31425a]">{t("fillTitle")}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#667180]">{t("fillDescription")}</p>
                </div>
              </div>

              <Link
                href={preAssessmentHref}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
              >
                {t("fillAction")}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setShowSkipConfirmation(true);
                }}
                className="mt-4 w-full text-center text-sm text-[#667180] underline-offset-4 transition hover:text-[#31425a] hover:underline"
              >
                {t("skipLink")}
              </button>
            </div>

            {error ? (
              <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                {error}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {showSkipConfirmation ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-[#31425a]">{t("skipModal.title")}</h3>

            <p className="mt-3 text-sm leading-6 text-[#667180]">{t("skipModal.description")}</p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSkip}
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isPending ? t("skipPending") : t("skipModal.confirm")}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSkipConfirmation(false);
                }}
                disabled={isPending}
                className="rounded-2xl border border-[#d9e2ec] px-5 py-3 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc] disabled:opacity-60"
              >
                {t("skipModal.cancel")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
