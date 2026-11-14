"use client";

import { submitGeneralFeedbackAction } from "@/features/platform-feedback/general-actions";
import {
  GENERAL_FEEDBACK_CATEGORIES,
  GENERAL_FEEDBACK_MAX_LENGTH,
  isGeneralFeedbackCategory,
  type GeneralFeedbackCategory,
} from "@/lib/platform-feedback/general-definition";
import type { AppLocale } from "@/lib/i18n/locales";
import { ArrowLeft, CheckCircle2, Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { type SyntheticEvent, useState, useTransition } from "react";

type Props = { locale: AppLocale };

export default function GeneralFeedbackForm({ locale }: Props) {
  const t = useTranslations("Protected.GeneralFeedbackForm");
  const [category, setCategory] = useState<GeneralFeedbackCategory>("suggestion");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const onSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    if (!message.trim() || message.trim().length > GENERAL_FEEDBACK_MAX_LENGTH) {
      setError(true);
      return;
    }
    setError(false);
    startTransition(async () => {
      try {
        await submitGeneralFeedbackAction({ locale, category, message });
        setSubmitted(true);
      } catch {
        setError(true);
      }
    });
  };

  return (
    <section className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_12px_34px_rgba(35,45,62,0.07)] md:p-8">
      {submitted ? (
        <div role="status">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          <h1 className="mt-4 text-2xl font-bold text-[#31425a]">{t("success.title")}</h1>
          <p className="mt-3 text-[#667180]">{t("success.description")}</p>
          <Link
            href={`/${locale}/dashboard`}
            className="mt-6 inline-block font-semibold text-emerald-700"
          >
            {t("back")}
          </Link>
        </div>
      ) : (
        <>
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#667180]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Link>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#31425a]">{t("title")}</h1>
          <p className="mt-3 text-sm leading-7 text-[#667180]">{t("description")}</p>
          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <label
              className="block text-sm font-semibold text-[#31425a]"
              htmlFor="general-feedback-category"
            >
              {t("category")}
            </label>
            <select
              id="general-feedback-category"
              value={category}
              onChange={(event) => {
                if (isGeneralFeedbackCategory(event.target.value)) {
                  setCategory(event.target.value);
                }
              }}
              className="w-full rounded-2xl border border-[#d9e2ec] bg-white px-4 py-3 text-sm text-[#31425a]"
            >
              {GENERAL_FEEDBACK_CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {t(`categories.${value}`)}
                </option>
              ))}
            </select>
            <label
              className="block text-sm font-semibold text-[#31425a]"
              htmlFor="general-feedback-message"
            >
              {t("message")}
            </label>
            <textarea
              id="general-feedback-message"
              rows={6}
              required
              maxLength={GENERAL_FEEDBACK_MAX_LENGTH}
              value={message}
              placeholder={t("placeholder")}
              onChange={(event) => {
                setMessage(event.target.value);
              }}
              className="w-full rounded-2xl border border-[#d9e2ec] bg-white px-4 py-3 text-sm leading-6 text-[#31425a] outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
            <p className="text-xs text-[#667180]">{t("privacyNote")}</p>
            {error && (
              <p role="alert" className="text-sm text-rose-700">
                {t("error")}
              </p>
            )}
            <button
              type="submit"
              disabled={pending || !message.trim()}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#253347] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {pending ? t("sending") : t("submit")}
            </button>
          </form>
        </>
      )}
    </section>
  );
}
