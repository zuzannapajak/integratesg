"use client";

import { createClient } from "@/lib/supabase/client";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
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

function getOAuthError(url: URL) {
  return url.searchParams.get("error_description") ?? url.searchParams.get("error");
}

function cleanCallbackUrl(url: URL) {
  url.searchParams.delete("code");
  url.searchParams.delete("state");
  url.searchParams.delete("error");
  url.searchParams.delete("error_description");

  const query = url.searchParams.toString();
  window.history.replaceState(null, document.title, `${url.pathname}${query ? `?${query}` : ""}`);
}

function getAuthErrorDetails(error: unknown) {
  if (!error || typeof error !== "object") {
    return { error };
  }

  return {
    name: "name" in error ? error.name : undefined,
    message: "message" in error ? error.message : undefined,
    status: "status" in error ? error.status : undefined,
    code: "code" in error ? error.code : undefined,
  };
}

export default function ClientAuthCallback({ locale }: Props) {
  const t = useTranslations("Auth.ClientCallback");
  const [hasError, setHasError] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      return;
    }

    hasRun.current = true;

    const finishLogin = async () => {
      const supabase = createClient();
      const url = new URL(window.location.href);
      const oauthError = getOAuthError(url);
      const code = url.searchParams.get("code");
      const next = getSafeNextPath(url.searchParams.get("next"), locale);

      cleanCallbackUrl(url);

      if (oauthError) {
        console.error("[client-auth-callback] OAuth provider returned an error", oauthError);
        setHasError(true);
        window.location.replace(`/${locale}/auth/login`);
        return;
      }

      if (!code) {
        window.location.replace(`/${locale}/auth/login`);
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error(
          "[client-auth-callback] exchangeCodeForSession failed",
          getAuthErrorDetails(error),
        );
        setHasError(true);
        window.location.replace(`/${locale}/auth/login`);
        return;
      }

      window.location.replace(next);
    };

    void finishLogin();
  }, [locale]);

  return (
    <main className="relative isolate flex h-full min-h-[70dvh] items-center justify-center overflow-hidden bg-white px-6 py-16 md:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(236,103,37,0.12),transparent_28%),radial-gradient(circle_at_86%_22%,rgba(13,127,194,0.15),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fafc_55%,#ffffff_100%)]" />

      <div className="relative z-10 w-full max-w-sm rounded-[2rem] border border-white/80 bg-white/90 px-8 py-12 text-center shadow-[0_20px_55px_rgba(35,45,62,0.10)] backdrop-blur-xl sm:px-10">
        <div role="status" aria-live="polite">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
              hasError ? "bg-red-50 text-red-600" : "bg-[#eaf5fc] text-[#0d7fc2]"
            }`}
          >
            {hasError ? (
              <CircleAlert className="h-8 w-8" aria-hidden="true" />
            ) : (
              <LoaderCircle
                className="h-8 w-8 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            )}
          </div>

          <h1 className="mt-6 text-[1.35rem] font-semibold leading-snug tracking-tight text-[#31425a]">
            {hasError ? t("signInFailed") : t("signingYouIn")}
          </h1>
        </div>
      </div>
    </main>
  );
}
