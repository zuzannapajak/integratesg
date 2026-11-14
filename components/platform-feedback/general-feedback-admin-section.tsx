"use client";

import type { PlatformFeedbackAdminStats } from "@/lib/admin/platform-feedback";
import { useTranslations } from "next-intl";

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
      {feedback.rows.length === 0 ? (
        <p className="mt-5 text-sm text-[#667180]">{t("empty")}</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-[#8a97a6]">
                <th className="px-4 py-2">{t("columns.user")}</th>
                <th className="px-4 py-2">{t("columns.date")}</th>
                <th className="px-4 py-2">{t("columns.category")}</th>
                <th className="px-4 py-2">{t("columns.message")}</th>
              </tr>
            </thead>
            <tbody>
              {feedback.rows.map((row) => (
                <tr key={row.id} className="bg-[#f8fafc] text-[#31425a]">
                  <td className="rounded-l-2xl px-4 py-3 align-top">
                    <p className="font-semibold">{row.userName}</p>
                    <p className="text-xs text-[#667180]">{row.userEmail}</p>
                    <p className="text-xs text-[#667180]">
                      {row.role} · {row.locale}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top">
                    {new Intl.DateTimeFormat(locale, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(row.submittedAt))}
                  </td>
                  <td className="px-4 py-3 align-top">{t(`categories.${row.category}`)}</td>
                  <td className="max-w-sm whitespace-pre-wrap break-words rounded-r-2xl px-4 py-3 align-top">
                    {row.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
