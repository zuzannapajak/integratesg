"use client";

import { CircleAlert, CircleDashed, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  title: string;
  src: string | null;
  backHref: string;
  locale: string;
  scenarioSlug: string;
  initialLessonLocation?: string | null;
  initialSuspendData?: string | null;
  initialLessonStatus?: string | null;
  initialScoreRaw?: number | null;
  initialSessionTime?: string | null;
};

const LOAD_TIMEOUT_MS = 12000;
const SCORM_WRITE_MODE: "eager" | "batched" = "batched";
const SCORM_FLUSH_INTERVAL_MS = 15000;
const SCORM_EAGER_DEBOUNCE_MS = 800;
const SCORM_COMMIT_DEBOUNCE_MS = 1200;
const IMPORTANT_RUNTIME_KEYS = new Set<string>([
  "cmi.core.lesson_status",
  "cmi.core.score.raw",
  "cmi.core.session_time",
  "cmi.suspend_data",
  "cmi.core.lesson_location",
]);
const PERSISTED_RUNTIME_TRACKING_KEYS = new Set<string>([
  "cmi.core.entry",
  "cmi.core.exit",
  "cmi.core.lesson_mode",
]);

type FrameState = "idle" | "loading" | "ready" | "error";

type FlushReason = "set_value" | "interval" | "commit" | "finish" | "pagehide" | "beforeunload";

type ScormApi = {
  LMSInitialize: (value: string) => string;
  LMSFinish: (value: string) => string;
  LMSGetValue: (element: string) => string;
  LMSSetValue: (element: string, value: string) => string;
  LMSCommit: (value: string) => string;
  LMSGetLastError: () => string;
  LMSGetErrorString: (code: string) => string;
  LMSGetDiagnostic: (code: string) => string;
};

type RuntimeStore = Record<string, string>;

declare global {
  interface Window {
    API?: ScormApi;
  }
}

function createInitialRuntimeStore(params: {
  lessonLocation?: string | null;
  suspendData?: string | null;
  lessonStatus?: string | null;
  scoreRaw?: number | null;
  sessionTime?: string | null;
}): RuntimeStore {
  return {
    "cmi.core.lesson_location": params.lessonLocation ?? "",
    "cmi.suspend_data": params.suspendData ?? "",
    "cmi.core.lesson_status": params.lessonStatus ?? "incomplete",
    "cmi.core.score.raw":
      params.scoreRaw !== null && params.scoreRaw !== undefined ? String(params.scoreRaw) : "",
    "cmi.core.session_time": params.sessionTime ?? "",
  };
}

function pickRuntimePayload(params: {
  runtimeStore: RuntimeStore;
  changedKeys: string[];
  forceWrite: boolean;
}) {
  const keysToSend =
    params.forceWrite || params.changedKeys.length === 0
      ? [...IMPORTANT_RUNTIME_KEYS, ...PERSISTED_RUNTIME_TRACKING_KEYS]
      : params.changedKeys;

  const payload: {
    lessonStatus?: string | null;
    scoreRaw?: string | null;
    sessionTime?: string | null;
    suspendData?: string | null;
    lessonLocation?: string | null;
    rawTrackingData?: Record<string, string>;
  } = {};

  const rawTrackingData: Record<string, string> = {};

  for (const key of keysToSend) {
    const value = params.runtimeStore[key] ?? "";

    switch (key) {
      case "cmi.core.lesson_status":
        payload.lessonStatus = value || null;
        break;
      case "cmi.core.score.raw":
        payload.scoreRaw = value || null;
        break;
      case "cmi.core.session_time":
        payload.sessionTime = value || null;
        break;
      case "cmi.suspend_data":
        payload.suspendData = value || null;
        break;
      case "cmi.core.lesson_location":
        payload.lessonLocation = value || null;
        break;
      default:
        if (PERSISTED_RUNTIME_TRACKING_KEYS.has(key) && value.trim().length > 0) {
          rawTrackingData[key] = value;
        }
        break;
    }
  }

  if (Object.keys(rawTrackingData).length > 0) {
    payload.rawTrackingData = rawTrackingData;
  }

  return payload;
}

export default function ScenarioPlayerFrame({
  title,
  src,
  backHref,
  locale,
  scenarioSlug,
  initialLessonLocation = null,
  initialSuspendData = null,
  initialLessonStatus = null,
  initialScoreRaw = null,
  initialSessionTime = null,
}: Props) {
  const t = useTranslations("Protected.ScenarioPlayerFrame");
  const [frameKey, setFrameKey] = useState(0);
  const [readyToken, setReadyToken] = useState<string | null>(null);
  const [timedOutToken, setTimedOutToken] = useState<string | null>(null);

  const runtimeStoreRef = useRef<RuntimeStore>(
    createInitialRuntimeStore({
      lessonLocation: initialLessonLocation,
      suspendData: initialSuspendData,
      lessonStatus: initialLessonStatus,
      scoreRaw: initialScoreRaw,
      sessionTime: initialSessionTime,
    }),
  );

  const initializedRef = useRef(false);
  const lastErrorRef = useRef("0");
  const dirtyRef = useRef(false);
  const changedKeysRef = useRef<Set<string>>(new Set());
  const setValueCountRef = useRef(0);
  const commitCountRef = useRef(0);
  const requestCountRef = useRef(0);
  const lastFlushAtRef = useRef<number | null>(null);
  const flushInFlightRef = useRef(false);
  const eagerDebounceTimerRef = useRef<number | null>(null);
  const commitDebounceTimerRef = useRef<number | null>(null);

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

  const flushRuntimeProgress = useCallback(
    async (
      reason: FlushReason,
      options?: {
        forceWrite?: boolean;
        keepalive?: boolean;
      },
    ) => {
      if (!hasValidSrc || flushInFlightRef.current) {
        return;
      }

      if (!dirtyRef.current && !options?.forceWrite) {
        return;
      }

      const runtimeStore = runtimeStoreRef.current;
      const changedKeys = Array.from(changedKeysRef.current);
      const forceWrite = options?.forceWrite ?? false;
      const nextRequestCount = requestCountRef.current + 1;

      const payload = {
        locale,
        scenarioSlug,
        ...pickRuntimePayload({
          runtimeStore,
          changedKeys,
          forceWrite,
        }),
        forceWrite,
        commitReason: reason,
        changedKeys,
        clientSetValueCount: setValueCountRef.current,
        clientCommitCount: commitCountRef.current,
        clientRequestCount: nextRequestCount,
        clientWriteMode: SCORM_WRITE_MODE,
        lastFlushAgeMs:
          lastFlushAtRef.current === null ? null : Date.now() - lastFlushAtRef.current,
      };

      flushInFlightRef.current = true;

      try {
        requestCountRef.current = nextRequestCount;

        const response = await fetch("/api/scorm/runtime", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          keepalive: options?.keepalive ?? false,
        });

        if (response.ok) {
          dirtyRef.current = false;
          changedKeysRef.current.clear();
          lastFlushAtRef.current = Date.now();
        }
      } catch (error) {
        console.error(error);
      } finally {
        flushInFlightRef.current = false;
      }
    },
    [hasValidSrc, locale, scenarioSlug],
  );

  const scheduleEagerFlush = useCallback(() => {
    if (SCORM_WRITE_MODE !== "eager") {
      return;
    }

    if (eagerDebounceTimerRef.current !== null) {
      window.clearTimeout(eagerDebounceTimerRef.current);
    }

    eagerDebounceTimerRef.current = window.setTimeout(() => {
      void flushRuntimeProgress("set_value");
    }, SCORM_EAGER_DEBOUNCE_MS);
  }, [flushRuntimeProgress]);

  const scheduleCommitFlush = useCallback(() => {
    if (SCORM_WRITE_MODE !== "batched") {
      void flushRuntimeProgress("commit");
      return;
    }

    if (commitDebounceTimerRef.current !== null) {
      window.clearTimeout(commitDebounceTimerRef.current);
    }

    commitDebounceTimerRef.current = window.setTimeout(() => {
      commitDebounceTimerRef.current = null;
      void flushRuntimeProgress("commit");
    }, SCORM_COMMIT_DEBOUNCE_MS);
  }, [flushRuntimeProgress]);

  useEffect(() => {
    runtimeStoreRef.current = createInitialRuntimeStore({
      lessonLocation: initialLessonLocation,
      suspendData: initialSuspendData,
      lessonStatus: initialLessonStatus,
      scoreRaw: initialScoreRaw,
      sessionTime: initialSessionTime,
    });
    dirtyRef.current = false;
    changedKeysRef.current.clear();
    setValueCountRef.current = 0;
    commitCountRef.current = 0;
    requestCountRef.current = 0;
    lastFlushAtRef.current = null;
  }, [
    initialLessonLocation,
    initialSuspendData,
    initialLessonStatus,
    initialScoreRaw,
    initialSessionTime,
  ]);

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

  useEffect(() => {
    if (!hasValidSrc || SCORM_WRITE_MODE !== "batched") {
      return;
    }

    const interval = window.setInterval(() => {
      void flushRuntimeProgress("interval");
    }, SCORM_FLUSH_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [flushRuntimeProgress, hasValidSrc]);

  useEffect(() => {
    if (!hasValidSrc) {
      return;
    }

    const handlePageHide = () => {
      void flushRuntimeProgress("pagehide", { forceWrite: true, keepalive: true });
    };

    const handleBeforeUnload = () => {
      void flushRuntimeProgress("beforeunload", { forceWrite: true, keepalive: true });
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (eagerDebounceTimerRef.current !== null) {
        window.clearTimeout(eagerDebounceTimerRef.current);
      }

      if (commitDebounceTimerRef.current !== null) {
        window.clearTimeout(commitDebounceTimerRef.current);
      }
    };
  }, [flushRuntimeProgress, hasValidSrc]);

  useEffect(() => {
    const api: ScormApi = {
      LMSInitialize: () => {
        initializedRef.current = true;
        lastErrorRef.current = "0";
        return "true";
      },

      LMSFinish: () => {
        if (!initializedRef.current) {
          lastErrorRef.current = "301";
          return "false";
        }

        commitCountRef.current += 1;
        void flushRuntimeProgress("finish", { forceWrite: true, keepalive: true });

        lastErrorRef.current = "0";
        initializedRef.current = false;
        return "true";
      },

      LMSGetValue: (element) => {
        if (!initializedRef.current) {
          lastErrorRef.current = "301";
          return "";
        }

        lastErrorRef.current = "0";
        return runtimeStoreRef.current[element] ?? "";
      },

      LMSSetValue: (element, value) => {
        if (!initializedRef.current) {
          lastErrorRef.current = "301";
          return "false";
        }

        const previousValue = runtimeStoreRef.current[element] ?? "";
        runtimeStoreRef.current[element] = value;
        setValueCountRef.current += 1;

        if (previousValue !== value && IMPORTANT_RUNTIME_KEYS.has(element)) {
          dirtyRef.current = true;
          changedKeysRef.current.add(element);
          scheduleEagerFlush();
        }

        if (previousValue !== value && PERSISTED_RUNTIME_TRACKING_KEYS.has(element)) {
          dirtyRef.current = true;
          changedKeysRef.current.add(element);
          scheduleEagerFlush();
        }

        lastErrorRef.current = "0";
        return "true";
      },

      LMSCommit: () => {
        if (!initializedRef.current) {
          lastErrorRef.current = "301";
          return "false";
        }

        commitCountRef.current += 1;
        scheduleCommitFlush();
        lastErrorRef.current = "0";
        return "true";
      },

      LMSGetLastError: () => {
        return lastErrorRef.current;
      },

      LMSGetErrorString: (code) => {
        switch (code) {
          case "0":
            return t("scormErrors.noError");
          case "301":
            return t("scormErrors.notInitialized");
          default:
            return t("scormErrors.generalError");
        }
      },

      LMSGetDiagnostic: (code) => {
        switch (code) {
          case "0":
            return t("scormErrors.noError");
          case "301":
            return t("scormErrors.runtimeNotInitialized");
          default:
            return t("scormErrors.noDiagnostics");
        }
      },
    };

    window.API = api;

    return () => {
      if (window.API === api) {
        delete window.API;
      }
    };
  }, [flushRuntimeProgress, scheduleCommitFlush, scheduleEagerFlush, t]);

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
              <p className="text-sm font-semibold text-[#31425a]">{t("loadingTitle")}</p>
              <p className="mt-1 text-sm text-[#667180]">{t("loadingDescription")}</p>
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
              {t("errorTitle")}
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#667180]">
              {hasValidSrc ? t("errorDescription") : t("notReadyDescription")}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {hasValidSrc && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#31425a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
                >
                  <RefreshCcw className="h-4 w-4" />
                  {t("retry")}
                </button>
              )}

              <Link
                href={backHref}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#d9e2ec] bg-white px-4 py-3 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc]"
              >
                {t("backToScenarios")}
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
