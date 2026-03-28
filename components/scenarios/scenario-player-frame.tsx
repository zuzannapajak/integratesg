"use client";

import { CircleAlert, CircleDashed, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Props = {
  title: string;
  src: string | null;
  backHref: string;
};

const LOAD_TIMEOUT_MS = 12000;

type FrameState = "idle" | "loading" | "ready" | "error";

export default function ScenarioPlayerFrame({ title, src, backHref }: Props) {
  const [frameKey, setFrameKey] = useState(0);
  const [readyToken, setReadyToken] = useState<string | null>(null);
  const [timedOutToken, setTimedOutToken] = useState<string | null>(null);

  const hasValidSrc = useMemo(() => {
    return typeof src === "string" && src.trim().length > 0;
  }, [src]);

  const loadToken = useMemo(() => {
    return `${frameKey}:${src ?? ""}`;
  }, [frameKey, src]);

  const state = useMemo<FrameState>(() => {
    if (!hasValidSrc) {
      return "error";
    }

    if (readyToken === loadToken) {
      return "ready";
    }

    if (timedOutToken === loadToken) {
      return "error";
    }

    return "loading";
  }, [hasValidSrc, loadToken, readyToken, timedOutToken]);

  useEffect(() => {
    if (!hasValidSrc) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setTimedOutToken((current) => (current === loadToken ? current : loadToken));
    }, LOAD_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [hasValidSrc, loadToken]);

  const handleRetry = () => {
    if (!hasValidSrc) {
      return;
    }

    setReadyToken(null);
    setTimedOutToken(null);
    setFrameKey((current) => current + 1);
  };

  return (
    <div className="relative flex-1 overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_12px_34px_rgba(35,45,62,0.06)]">
      {state === "loading" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(245,245,243,0.96)_100%)]">
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e8edf3] bg-white text-[#31425a] shadow-sm">
              <CircleDashed className="h-6 w-6 animate-spin" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#31425a]">Preparing your scenario</p>
              <p className="mt-1 text-sm text-[#667180]">The interactive experience is loading.</p>
            </div>
          </div>
        </div>
      )}

      {state === "error" ? (
        <div className="flex h-[calc(100vh-220px)] min-h-180 items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(245,245,243,1)_100%)] px-6">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#f0d5d5] bg-[#fff5f5] text-[#b42318] shadow-sm">
              <CircleAlert className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-xl font-bold tracking-tight text-[#31425a]">
              The scenario could not be opened
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#667180]">
              {hasValidSrc
                ? "The interactive content is currently unavailable or took too long to respond. Please try again."
                : "This scenario is not ready to launch yet. Please return later or choose another scenario."}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {hasValidSrc && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#31425a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Try again
                </button>
              )}

              <Link
                href={backHref}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#d9e2ec] bg-white px-4 py-3 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc]"
              >
                Back to scenarios
              </Link>
            </div>
          </div>
        </div>
      ) : hasValidSrc ? (
        <iframe
          key={frameKey}
          title={title}
          src={src ?? undefined}
          className={`h-[calc(100vh-220px)] min-h-180 w-full bg-white transition ${
            state === "ready" ? "opacity-100" : "opacity-0"
          }`}
          allow="fullscreen"
          onLoad={() => {
            setReadyToken(loadToken);
            setTimedOutToken(null);
          }}
        />
      ) : null}
    </div>
  );
}
