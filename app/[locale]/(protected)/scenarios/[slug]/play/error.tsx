"use client";

import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

export type ScenarioPlayErrorProps = {
  readonly error: Error & {
    readonly digest?: string;
  };

  readonly reset: () => void;
};

export default function ScenarioPlayError({ error, reset }: ScenarioPlayErrorProps) {
  const t = useTranslations("Protected.ScenarioSimulator.errors");

  const params = useParams();
  const localeParam = params.locale;

  const locale = Array.isArray(localeParam) ? localeParam[0] : localeParam;

  const scenariosHref = `/${locale ?? "en"}/scenarios`;

  return (
    <main className="min-h-full bg-[#f3f6f9] p-3 [--app-topbar-height:78px] [--scenario-player-gap:24px] sm:p-5 sm:[--scenario-player-gap:40px] md:h-full md:min-h-0 md:overflow-hidden lg:p-6 lg:[--scenario-player-gap:48px]">
      <section
        data-testid="scenario-route-error"
        data-error-digest={error.digest ?? "unknown"}
        role="alert"
        className="mx-auto flex w-full max-w-400 items-center justify-center rounded-[1.65rem] border border-[#dfe5ec] bg-[#eef2f6] p-4 shadow-[0_18px_50px_rgba(49,66,90,0.11)]"
        style={{
          minHeight:
            "calc(100dvh - var(--app-topbar-height, 64px) - var(--scenario-player-gap, 40px))",
        }}
      >
        <div className="w-full max-w-xl rounded-3xl border border-[#efcaca] bg-white p-7 text-center shadow-[0_18px_50px_rgba(49,66,90,0.14)] sm:p-9">
          <span
            aria-hidden="true"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#a93434]"
          >
            <AlertTriangle size={30} strokeWidth={2.2} />
          </span>

          <h1 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-[#31425a] sm:text-3xl">
            {t("contentTitle")}
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#596170]">
            {t("contentDescription")}
          </p>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <Link
              href={scenariosHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#cfd7e1] bg-white px-5 text-sm font-semibold text-[#31425a] transition hover:bg-[#f5f7fa]"
            >
              <ArrowLeft aria-hidden="true" size={17} />

              {t("backToScenarios")}
            </Link>

            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#095fc8] px-5 text-sm font-semibold text-white transition hover:bg-[#084fa6]"
              onClick={reset}
            >
              <RefreshCw aria-hidden="true" size={17} />

              {t("retry")}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
