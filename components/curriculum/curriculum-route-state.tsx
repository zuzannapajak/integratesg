"use client";

import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function CurriculumLoadingState() {
  const t = useTranslations("Protected.CurriculumRouteState");

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(11,156,114,0.07),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.07),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8">
        <section
          role="status"
          aria-live="polite"
          className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl md:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#0b9c72]">
              <LoaderCircle className="h-6 w-6 animate-spin" aria-hidden="true" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#31425a]">
                {t("loading.title")}
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#667180]">{t("loading.description")}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-[26px] border border-[#e8edf3] bg-white/72"
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export function CurriculumErrorState({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("Protected.CurriculumRouteState");

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(244,63,94,0.06),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-3xl px-4 pt-10 sm:px-6 lg:px-8">
        <section
          role="alert"
          className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl md:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold tracking-tight text-[#31425a]">
                {t("error.title")}
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#667180]">{t("error.description")}</p>

              <button
                type="button"
                onClick={onRetry}
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#253347]"
              >
                {t("error.retry")}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
