"use client";

import SocialLoginButtons from "@/components/auth/login/social-login-buttons";
import { createProfile } from "@/features/auth/actions";
import { APP_ROLES, SelfServiceRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

type Props = {
  locale: string;
  role: SelfServiceRole;
  fullName: string;
  email: string;
  password: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onBack: () => void;
};

function getEmailConfirmationRedirectUrl(locale: string) {
  return `${window.location.origin.replace(/\/$/, "")}/${locale}/auth/login`;
}

export default function RegisterDetailsStep({
  locale,
  role,
  fullName,
  email,
  password,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onBack,
}: Props) {
  const t = useTranslations("Register.DetailsStep");
  const roles = useTranslations("Roles");
  const supabase = createClient();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleLabel = role === APP_ROLES.educator ? roles("educator") : roles("learner");

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    setErrorMessage(null);
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: getEmailConfirmationRedirectUrl(locale),
        data: {
          role,
          full_name: fullName,
          preferred_language: locale,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    if (data.user?.id && data.user.email) {
      try {
        await createProfile({
          userId: data.user.id,
          email: data.user.email,
          role,
          fullName: fullName || null,
          preferredLanguage: locale,
        });
      } catch {
        setErrorMessage(t("profileSaveError"));
        setIsSubmitting(false);
        return;
      }
    }

    setConfirmationEmail(data.user?.email ?? normalizedEmail);
    onPasswordChange("");
    setIsSubmitting(false);
  };

  if (confirmationEmail) {
    return (
      <div className="mx-auto w-full max-w-165">
        <div className="rounded-4xl border border-[#bfe8cc] bg-[linear-gradient(180deg,rgba(247,255,249,0.96)_0%,rgba(255,255,255,0.94)_100%)] px-6 py-9 text-center shadow-[0_18px_48px_rgba(35,45,62,0.09)] md:px-10 md:py-11">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f8ec] text-[2rem] font-bold text-[#008b5e] shadow-[0_10px_28px_rgba(0,139,94,0.14)]">
            <span aria-hidden="true">✓</span>
          </div>

          <p className="mt-6 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#008b5e]">
            {t("confirmationEyebrow")}
          </p>

          <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.035em] text-[#31425a]">
            {t("confirmationTitle")}
          </h1>

          <p className="mx-auto mt-3 max-w-[52ch] text-[1rem] leading-7 text-[#5f6977]">
            {t("confirmationDescription")}
          </p>

          <div className="mx-auto mt-6 max-w-115 rounded-3xl border border-[#e1eadf] bg-white px-5 py-4 text-left shadow-[0_12px_30px_rgba(49,66,90,0.06)]">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#7a8594]">
              {t("confirmationEmailLabel")}
            </p>
            <p className="mt-1 break-all text-[1rem] font-semibold text-[#31425a]">
              {confirmationEmail}
            </p>
          </div>

          <p className="mx-auto mt-5 max-w-[52ch] text-[0.92rem] leading-6 text-[#6b7480]">
            {t("confirmationHint")}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/${locale}/auth/login`}
              className="inline-flex min-h-[3.15rem] items-center justify-center rounded-full bg-[#31425a] px-7 font-semibold text-white shadow-[0_10px_26px_rgba(49,66,90,0.18)] transition hover:-translate-y-0.5 hover:bg-[#243246]"
            >
              {t("goToLogin")}
            </Link>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-[3.15rem] items-center justify-center rounded-full px-6 font-semibold text-[#5f6977] transition hover:bg-[#eef3f8] hover:text-[#31425a]"
            >
              {t("backToRole")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-220">
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-2 text-[0.92rem] font-medium text-[#5f6977] transition hover:text-[#31425a]"
      >
        <ArrowLeft className="h-[1.15rem] w-[1.15rem]" />
      </button>

      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a]">
            {t("title")}
          </h1>
          <p className="mt-1 max-w-[40ch] text-[0.98rem] leading-7 text-[#5f6977]">
            {t("subtitle")}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-[#eef3f8] px-3 py-1.5 text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-[#31425a]">
          {roleLabel}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="order-2 min-w-0 lg:order-1">
          <div className="flex h-full min-h-90 flex-col rounded-3xl border border-[#e7edf3] bg-white px-6 py-6">
            <div className="mb-4">
              <p className="text-[1rem] font-semibold text-[#31425a]">{t("continueWithEmail")}</p>
              <p className="mt-2 text-[0.9rem] leading-6 text-[#667180]">
                {t("continueWithEmailDescription")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-[0.93rem] font-medium text-[#31425a]">
                    {t("fullName")}
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder={t("fullNamePlaceholder")}
                    className="min-h-[3.15rem] w-full rounded-2xl border border-[#d7dee8] bg-white px-4 text-[#31425a] outline-none transition focus:border-[#9fb4ca] focus:ring-4 focus:ring-[#dfeaf5]"
                    value={fullName}
                    onChange={(event) => {
                      onFullNameChange(event.target.value);
                    }}
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-[0.93rem] font-medium text-[#31425a]">
                    {t("email")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    className="min-h-[3.15rem] w-full rounded-2xl border border-[#d7dee8] bg-white px-4 text-[#31425a] outline-none transition focus:border-[#9fb4ca] focus:ring-4 focus:ring-[#dfeaf5]"
                    value={email}
                    onChange={(event) => {
                      onEmailChange(event.target.value);
                    }}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-[0.93rem] font-medium text-[#31425a]">
                    {t("password")}
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    className="min-h-[3.15rem] w-full rounded-2xl border border-[#d7dee8] bg-white px-4 text-[#31425a] outline-none transition focus:border-[#9fb4ca] focus:ring-4 focus:ring-[#dfeaf5]"
                    value={password}
                    onChange={(event) => {
                      onPasswordChange(event.target.value);
                    }}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="mt-auto pt-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-[3.15rem] w-full items-center justify-center rounded-full bg-[#31425a] px-6 font-semibold text-white transition hover:bg-[#243246] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? t("submitting") : t("submit")}
                </button>

                {errorMessage ? (
                  <div className="mt-4 rounded-2xl border border-[#ef6c23]/20 bg-[#ef6c23]/8 px-4 py-3 text-sm leading-6 text-[#8a4a25]">
                    {errorMessage}
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          <div className="flex h-full min-h-90 flex-col rounded-3xl border border-[#e7edf3] bg-[linear-gradient(180deg,rgba(247,249,252,0.92)_0%,rgba(255,255,255,0.88)_100%)] px-6 py-8">
            <div className="mx-auto flex h-full w-full max-w-[320px] flex-col justify-center text-center">
              <div className="space-y-2">
                <p className="text-[1rem] font-semibold text-[#31425a]">
                  {t("continueWithGoogleDescription")}
                </p>
                <p className="text-[0.92rem] leading-6 text-[#667180]">{t("googleHint")}</p>
              </div>

              <div className="mt-8">
                <SocialLoginButtons locale={locale} nextPath={`/${locale}/auth/complete-profile`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-left text-[0.92rem] text-[#5e6776]">
        {t("alreadyHaveAccount")}{" "}
        <Link
          href={`/${locale}/auth/login`}
          className="font-semibold text-[#31425a] transition hover:text-[#0d7fc2]"
        >
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}
