"use client";

import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = {
  locale: string;
};

type ResetStatus = "checking" | "ready" | "success" | "error";

function getErrorDescriptionFromUrl(url: URL) {
  const searchError = url.searchParams.get("error_description") ?? url.searchParams.get("error");

  if (searchError) {
    return searchError;
  }

  if (!window.location.hash) {
    return null;
  }

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

  return hashParams.get("error_description") ?? hashParams.get("error");
}

function cleanRecoveryUrl() {
  window.history.replaceState(null, document.title, window.location.pathname);
}

export default function ResetPasswordForm({ locale }: Props) {
  const t = useTranslations("Auth.ResetPasswordForm");
  const supabase = createClient();
  const hasInitialized = useRef(false);

  const [status, setStatus] = useState<ResetStatus>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    const initializeRecoverySession = async () => {
      const url = new URL(window.location.href);
      const urlError = getErrorDescriptionFromUrl(url);

      if (urlError) {
        setMessage(urlError);
        setStatus("error");
        cleanRecoveryUrl();
        return;
      }

      const code = url.searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setMessage(error.message);
          setStatus("error");
          cleanRecoveryUrl();
          return;
        }

        setStatus("ready");
        cleanRecoveryUrl();
        return;
      }

      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setMessage(error.message);
            setStatus("error");
            cleanRecoveryUrl();
            return;
          }

          setStatus("ready");
          cleanRecoveryUrl();
          return;
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setStatus("ready");
        return;
      }

      setMessage(t("invalidLink"));
      setStatus("error");
    };

    void initializeRecoverySession();
  }, [supabase, t]);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (password.length < 8) {
      setMessage(t("passwordTooShort"));
      return;
    }

    if (password !== confirmPassword) {
      setMessage(t("passwordsDoNotMatch"));
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    await supabase.auth.signOut();
    setStatus("success");
    setIsSubmitting(false);
  };

  if (status === "checking") {
    return <p className="text-[0.95rem] leading-7 text-[#5e6776]">{t("checkingLink")}</p>;
  }

  if (status === "success") {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-[#0d7fc2]/20 bg-[#0d7fc2]/8 px-4 py-3 text-[0.92rem] leading-6 text-[#31425a]">
          {t("success")}
        </div>

        <Link
          href={`/${locale}/auth/login`}
          className="flex min-h-13.5 w-full items-center justify-center rounded-full bg-[#31425a] px-5 text-[1rem] font-semibold text-white shadow-[0_10px_26px_rgba(49,66,90,0.18)] transition hover:-translate-y-0.5 hover:bg-[#263549]"
        >
          {t("goToLogin")}
        </Link>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-[#ef6c23]/20 bg-[#ef6c23]/8 px-4 py-3 text-[0.92rem] leading-6 text-[#8a4a25]">
          {message ?? t("invalidLink")}
        </div>

        <Link
          href={`/${locale}/auth/forgot-password`}
          className="flex min-h-13.5 w-full items-center justify-center rounded-full bg-[#31425a] px-5 text-[1rem] font-semibold text-white shadow-[0_10px_26px_rgba(49,66,90,0.18)] transition hover:-translate-y-0.5 hover:bg-[#263549]"
        >
          {t("requestNewLink")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-[0.92rem] font-semibold tracking-[-0.01em] text-[#31425a]"
        >
          {t("passwordLabel")}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder={t("passwordPlaceholder")}
          className="w-full rounded-2xl border border-[#d9e1ea] bg-white px-4 py-3.5 text-[1rem] text-[#31425a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#0d7fc2] focus:ring-4 focus:ring-[#0d7fc2]/10"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-[0.92rem] font-semibold tracking-[-0.01em] text-[#31425a]"
        >
          {t("confirmPasswordLabel")}
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder={t("confirmPasswordPlaceholder")}
          className="w-full rounded-2xl border border-[#d9e1ea] bg-white px-4 py-3.5 text-[1rem] text-[#31425a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#0d7fc2] focus:ring-4 focus:ring-[#0d7fc2]/10"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
          }}
          required
        />
      </div>

      {message ? (
        <div className="rounded-2xl border border-[#ef6c23]/20 bg-[#ef6c23]/8 px-4 py-3 text-[0.92rem] leading-6 text-[#8a4a25]">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex min-h-13.5 w-full items-center justify-center rounded-full bg-[#31425a] px-5 text-[1rem] font-semibold text-white shadow-[0_10px_26px_rgba(49,66,90,0.18)] transition hover:-translate-y-0.5 hover:bg-[#263549] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
