"use client";

import type { PlatformFeedbackAdminStats } from "@/lib/admin/platform-feedback";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  locale: string;
  feedback: PlatformFeedbackAdminStats["generalFeedback"];
};

export default function GeneralFeedbackAdminSection({ locale, feedback }: Props) {
  const t = useTranslations("Protected.GeneralFeedbackAdmin");

  return (
    <section className="mt-8 rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_12px_34px_rgba(35,45,62,0.06)]">
      <h2 className="text-xl font-bold text-[#31425a]">{t("title")}</h2>
      <p className="mt-2 text-sm text-[#667180]">{t("description")}</p>
      <p className="mt-3 text-sm font-semibold text-[#31425a]">
        {t("recentCount", { count: feedback.totalSubmissions })}
      </p>
      <Link
        href={`/${locale}/admin/feedback`}
        className="mt-4 inline-flex rounded-xl bg-[#31425a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#253347]"
      >
        {t("viewAll")}
      </Link>
    </section>
  );
}
