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

export default function ClientAuthCallback({ locale }: Props) {
  const [title, setTitle] = useState("Completing sign-in");
  const [message, setMessage] = useState("Please wait while we securely finish your login.");
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

      const existingSession = await supabase.auth.getSession();

      if (existingSession.data.session) {
        window.location.replace(next);
        return;
      }

      if (!code) {
        console.warn("[client-auth-callback] Missing OAuth code");

        setTitle("Sign-in could not be completed");
        setMessage("We could not verify this sign-in attempt. Redirecting you back to login...");

        window.setTimeout(() => {
          window.location.replace(`/${locale}/auth/login`);
        }, 1800);

        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("[client-auth-callback] exchangeCodeForSession failed", {
          name: error.name,
          message: error.message,
          status: "status" in error ? error.status : undefined,
        });

        const sessionAfterError = await supabase.auth.getSession();

        if (sessionAfterError.data.session) {
          window.location.replace(next);
          return;
        }

        setTitle("Sign-in failed");
        setMessage("Something went wrong while signing you in. Redirecting you back to login...");

        window.setTimeout(() => {
          window.location.replace(`/${locale}/auth/login`);
        }, 1800);

        return;
      }

      const sessionAfterExchange = await supabase.auth.getSession();

      if (!sessionAfterExchange.data.session) {
        console.warn("[client-auth-callback] No session after successful code exchange");

        setTitle("Sign-in could not be completed");
        setMessage("Your session could not be created. Redirecting you back to login...");

        window.setTimeout(() => {
          window.location.replace(`/${locale}/auth/login`);
        }, 1800);

        return;
      }

      window.location.replace(next);
    };

    void finishLogin();
  }, [locale]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section
        className="w-full max-w-md rounded-2xl border bg-background px-8 py-10 text-center shadow-sm"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-foreground" />

        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
      </section>
    </main>
  );
}
