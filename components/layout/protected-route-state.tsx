"use client";

import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

type RouteStateKind = "loading" | "error";
type RouteStateScope = "dashboard" | "eportfolio" | "application";

type Props = {
  scope: RouteStateScope;
  kind: RouteStateKind;
  onRetry?: () => void;
};

export default function ProtectedRouteState({ scope, kind, onRetry }: Props) {
  const t = useTranslations("Protected.RouteState");
  const isLoading = kind === "loading";

  return (
    <main
      className="relative flex min-h-[calc(100dvh-78px)] items-center justify-center overflow-hidden bg-[#f5f5f3] px-5 py-10 sm:px-6"
      role={isLoading ? "status" : "alert"}
      aria-live={isLoading ? "polite" : "assertive"}
      data-testid={`${scope}-${kind}-state`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(13,127,194,0.08),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(11,156,114,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(245,245,243,1)_100%)]" />

      <section className="relative z-10 w-full max-w-xl rounded-[30px] border border-white/70 bg-white/90 px-6 py-9 text-center shadow-[0_18px_48px_rgba(35,45,62,0.08)] backdrop-blur-xl sm:px-9">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef3f8] text-[#31425a]">
          {isLoading ? (
            <LoaderCircle className="h-7 w-7 animate-spin" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          )}
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#31425a]">
          {t(`${scope}.${kind}.title`)}
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#667180]">
          {t(`${scope}.${kind}.description`)}
        </p>

        {!isLoading && onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#31425a] px-6 text-sm font-semibold text-white transition hover:bg-[#243246] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#31425a]/20"
          >
            {t(`${scope}.error.retry`)}
          </button>
        ) : null}
      </section>
    </main>
  );
}
