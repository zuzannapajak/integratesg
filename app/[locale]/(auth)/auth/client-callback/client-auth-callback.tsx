"use client";

import { createClient } from "@/lib/supabase/client";
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
  const [message, setMessage] = useState(t("signingYouIn"));
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
        setMessage(t("signInFailed"));
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
        setMessage(t("signInFailed"));
        window.location.replace(`/${locale}/auth/login`);
        return;
      }

      window.location.replace(next);
    };

    void finishLogin();
  }, [locale, t]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      </div>
    </main>
  );
}
