"use client";

import { Leaf, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ScenarioPlayLoading() {
  const t = useTranslations("Protected.ScenarioSimulator.loading");

  return (
    <main className="min-h-full bg-[#f3f6f9] p-3 [--app-topbar-height:78px] [--scenario-player-gap:24px] sm:p-5 sm:[--scenario-player-gap:40px] md:h-full md:min-h-0 md:overflow-hidden lg:p-6 lg:[--scenario-player-gap:48px]">
      <section
        data-testid="scenario-route-loading"
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="mx-auto flex w-full max-w-400 flex-col overflow-hidden rounded-[1.65rem] border border-[#dfe5ec] bg-white shadow-[0_18px_50px_rgba(49,66,90,0.11)]"
        style={{
          height:
            "calc(100dvh - var(--app-topbar-height, 64px) - var(--scenario-player-gap, 40px))",
        }}
      >
        <header className="flex shrink-0 items-center justify-between gap-5 border-b border-[#e7ebf0] px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3.5">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef5ff] text-[#095fc8] sm:h-12 sm:w-12"
            >
              <Leaf size={23} strokeWidth={2} />
            </span>

            <div aria-hidden="true" className="space-y-2">
              <div className="h-5 w-32 animate-pulse rounded-full bg-[#dfe5ec]" />

              <div className="h-4 w-48 max-w-[52vw] animate-pulse rounded-full bg-[#e9edf2]" />
            </div>
          </div>

          <div
            aria-hidden="true"
            className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-[#e9edf2]"
          />
        </header>

        <div className="flex min-h-0 flex-1 items-center justify-center bg-[#eef2f6] p-4">
          <div className="w-full max-w-lg rounded-3xl border border-[#dfe5ec] bg-white p-7 text-center shadow-[0_18px_50px_rgba(49,66,90,0.14)] sm:p-9">
            <LoaderCircle
              aria-hidden="true"
              className="mx-auto h-10 w-10 animate-spin text-[#095fc8]"
            />

            <h1 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[#31425a] sm:text-2xl">
              {t("title")}
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#596170]">
              {t("description")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
