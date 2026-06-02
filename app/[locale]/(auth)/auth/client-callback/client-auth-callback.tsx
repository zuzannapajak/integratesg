"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";

type Props = {
  locale: string;
};

function getSafeNextPath(next: string | null, locale: string) {
  if (!next) {
    return `/${locale}/dashboard`;
  }

  if (!next.startsWith("/") || next.startsWith("//")) {
    return `/${locale}/dashboard`;
  }

  return next;
}

function getStorageDebugInfo() {
  if (typeof window === "undefined") {
    return {
      cookieKeys: [],
      localStorageKeys: [],
      href: "",
    };
  }

  const cookieKeys = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter(Boolean);

  const localStorageKeys = Object.keys(window.localStorage);

  return {
    cookieKeys,
    localStorageKeys,
    href: window.location.href,
  };
}

type FormattedError =
  | string
  | {
      name?: unknown;
      message?: unknown;
      status?: unknown;
      code?: unknown;
    };

function formatError(error: unknown): FormattedError {
  if (!error || typeof error !== "object") {
    return String(error);
  }

  const maybeError = error as {
    name?: unknown;
    message?: unknown;
    status?: unknown;
    code?: unknown;
  };

  return {
    name: maybeError.name,
    message: maybeError.message,
    status: maybeError.status,
    code: maybeError.code,
  };
}

export default function ClientAuthCallback({ locale }: Props) {
  const [message, setMessage] = useState("Signing you in...");
  const [debugMessage, setDebugMessage] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      return;
    }

    hasRun.current = true;

    const finishLogin = async () => {
      const supabase = createClient();
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const next = getSafeNextPath(url.searchParams.get("next"), locale);
      const debugBefore = getStorageDebugInfo();

      console.warn("[client-auth-callback] Callback page loaded", {
        hasCode: Boolean(code),
        next,
        debugBefore,
      });

      const existingSession = await supabase.auth.getSession();

      console.warn("[client-auth-callback] Existing session check", {
        hasSession: Boolean(existingSession.data.session),
        error: existingSession.error,
      });

      if (existingSession.data.session) {
        console.warn("[client-auth-callback] Existing session found, redirecting", {
          next,
        });

        window.location.replace(next);
        return;
      }

      if (!code) {
        console.warn("[client-auth-callback] Missing OAuth code");

        setMessage("Missing OAuth code. Redirecting to login...");
        setDebugMessage(
          JSON.stringify(
            {
              reason: "Missing OAuth code",
              debugBefore,
            },
            null,
            2,
          ),
        );

        window.setTimeout(() => {
          window.location.replace(`/${locale}/auth/login`);
        }, 3000);

        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        const debugAfter = getStorageDebugInfo();
        const sessionAfterError = await supabase.auth.getSession();

        console.error("[client-auth-callback] exchangeCodeForSession failed", {
          exchangeError,
          debugBefore,
          debugAfter,
          hasSessionAfterError: Boolean(sessionAfterError.data.session),
          sessionAfterError: sessionAfterError.error,
        });

        if (sessionAfterError.data.session) {
          console.warn("[client-auth-callback] Session exists after exchange error, redirecting", {
            next,
          });

          window.location.replace(next);
          return;
        }

        setMessage("Sign-in failed. See diagnostic details below.");
        setDebugMessage(
          JSON.stringify(
            {
              exchangeError: formatError(exchangeError),
              hasSessionAfterError: Boolean(sessionAfterError.data.session),
              sessionAfterError: sessionAfterError.error
                ? formatError(sessionAfterError.error)
                : null,
              debugBefore,
              debugAfter,
            },
            null,
            2,
          ),
        );

        return;
      }

      const sessionAfterExchange = await supabase.auth.getSession();

      console.warn("[client-auth-callback] Login completed in browser", {
        hasSession: Boolean(sessionAfterExchange.data.session),
        next,
      });

      if (!sessionAfterExchange.data.session) {
        setMessage("Code exchange finished, but no browser session was found.");
        setDebugMessage(
          JSON.stringify(
            {
              reason: "No session after exchange",
              debugAfter: getStorageDebugInfo(),
            },
            null,
            2,
          ),
        );

        return;
      }

      window.location.replace(next);
    };

    void finishLogin();
  }, [locale]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-xl font-semibold">Signing in</h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>

        {debugMessage ? (
          <pre className="mt-6 max-h-[420px] overflow-auto rounded-md border p-4 text-left text-xs">
            {debugMessage}
          </pre>
        ) : null}
      </div>
    </main>
  );
}
