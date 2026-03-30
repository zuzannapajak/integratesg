"use client";

import { createClient } from "@/lib/supabase/client";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const t = useTranslations("Auth.LoginForm");
  const locale = useLocale();
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    router.push(`/${locale}/dashboard`);
    router.refresh();
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
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
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="password"
            className="block text-[0.92rem] font-semibold tracking-[-0.01em] text-[#31425a]"
          >
            {t("passwordLabel")}
          </label>
        </div>

        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder={t("passwordPlaceholder")}
          className="w-full rounded-2xl border border-[#d9e1ea] bg-white px-4 py-3.5 text-[1rem] text-[#31425a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#0d7fc2] focus:ring-4 focus:ring-[#0d7fc2]/10"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />
      </div>

      {message && (
        <div className="rounded-2xl border border-[#ef6c23]/20 bg-[#ef6c23]/8 px-4 py-3 text-[0.92rem] leading-6 text-[#8a4a25]">
          {message}
        </div>
      )}

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
