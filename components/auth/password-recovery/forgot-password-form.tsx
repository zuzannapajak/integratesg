"use client";

import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

type Props = {
  locale: string;
};

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

function getPasswordResetRedirectUrl(locale: string) {
  return `${window.location.origin.replace(/\/$/, "")}/${locale}/auth/reset-password`;
}

export default function ForgotPasswordForm({ locale }: Props) {
  const t = useTranslations("Auth.ForgotPasswordForm");
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<MessageState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getPasswordResetRedirectUrl(locale),
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      setIsSubmitting(false);
      return;
    }

    setMessage({ type: "success", text: t("success") });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-[0.92rem] font-semibold tracking-[-0.01em] text-[#31425a]"
        >
          {t("emailLabel")}
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          className="w-full rounded-2xl border border-[#d9e1ea] bg-white px-4 py-3.5 text-[1rem] text-[#31425a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#0d7fc2] focus:ring-4 focus:ring-[#0d7fc2]/10"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          required
        />
      </div>

      {message ? (
        <div
          className={
            message.type === "success"
              ? "rounded-2xl border border-[#0d7fc2]/20 bg-[#0d7fc2]/8 px-4 py-3 text-[0.92rem] leading-6 text-[#31425a]"
              : "rounded-2xl border border-[#ef6c23]/20 bg-[#ef6c23]/8 px-4 py-3 text-[0.92rem] leading-6 text-[#8a4a25]"
          }
        >
          {message.text}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex min-h-13.5 w-full items-center justify-center rounded-full bg-[#31425a] px-5 text-[1rem] font-semibold text-white shadow-[0_10px_26px_rgba(49,66,90,0.18)] transition hover:-translate-y-0.5 hover:bg-[#263549] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>

      <p className="text-center text-[0.95rem] text-[#5e6776]">
        <Link
          href={`/${locale}/auth/login`}
          className="font-semibold text-[#31425a] hover:text-[#0d7fc2]"
        >
          {t("backToLogin")}
        </Link>
      </p>
    </form>
  );
}
