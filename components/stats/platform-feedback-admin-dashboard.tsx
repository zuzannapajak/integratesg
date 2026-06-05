"use client";

import type { PlatformFeedbackAdminStats } from "@/lib/admin/platform-feedback";
import { MessageSquareHeart } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  locale: string;
  stats: PlatformFeedbackAdminStats;
};

function formatValue(value: number | null) {
  if (value === null) return "—";
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatOptionalText(value: string | null) {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return "—";
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_12px_34px_rgba(35,45,62,0.06)]">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a97a6]">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[#31425a]">{value}</p>
    </div>
  );
}

export default function PlatformFeedbackAdminDashboard({ locale, stats }: Props) {
  const t = useTranslations("Protected.PlatformFeedbackAdminDashboard");

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20">
      <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/60 bg-white text-[#0b9c72] shadow-sm">
              <MessageSquareHeart className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#31425a]">{t("title")}</h1>
              <p className="mt-1 text-[#667180]">{t("description")}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`/${locale}/admin/platform-feedback/export?format=csv`}
              className="rounded-2xl bg-[#31425a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#253347]"
            >
              {t("actions.exportCsv")}
            </a>

            <a
              href={`/${locale}/admin/platform-feedback/export?format=xls`}
              className="rounded-2xl border border-[#d9e2ec] bg-white px-4 py-2.5 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc]"
            >
              {t("actions.exportExcel")}
            </a>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label={t("summary.totalSubmissions")}
            value={stats.summary.totalSubmissions}
          />
          <SummaryCard
            label={t("summary.easeOfUse")}
            value={formatValue(stats.summary.averageEaseOfUse)}
          />
          <SummaryCard
            label={t("summary.moduleClarity")}
            value={formatValue(stats.summary.averageModuleClarity)}
          />
          <SummaryCard
            label={t("summary.navigation")}
            value={formatValue(stats.summary.averageNavigation)}
          />
          <SummaryCard
            label={t("summary.testsExperience")}
            value={formatValue(stats.summary.averageTestsExperience)}
          />
          <SummaryCard
            label={t("summary.technicalProblems")}
            value={formatValue(stats.summary.averageTechnicalProblems)}
          />
          <SummaryCard
            label={t("summary.overallSatisfaction")}
            value={formatValue(stats.summary.averageOverallSatisfaction)}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_12px_34px_rgba(35,45,62,0.06)]">
          <h2 className="mb-5 text-xl font-bold text-[#31425a]">{t("table.title")}</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-300 border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-[0.12em] text-[#8a97a6]">
                  <th className="px-4 py-2">{t("table.columns.user")}</th>
                  <th className="px-4 py-2">{t("table.columns.createdAt")}</th>
                  <th className="px-4 py-2">{t("table.columns.easeOfUse")}</th>
                  <th className="px-4 py-2">{t("table.columns.moduleClarity")}</th>
                  <th className="px-4 py-2">{t("table.columns.navigation")}</th>
                  <th className="px-4 py-2">{t("table.columns.testsExperience")}</th>
                  <th className="px-4 py-2">{t("table.columns.technicalProblems")}</th>
                  <th className="px-4 py-2">{t("table.columns.overallSatisfaction")}</th>
                  <th className="px-4 py-2">{t("table.columns.suggestions")}</th>
                  <th className="px-4 py-2">{t("table.columns.technicalNotes")}</th>
                </tr>
              </thead>

              <tbody>
                {stats.rows.map((row) => (
                  <tr key={row.id} className="bg-[#f8fafc] text-[#31425a]">
                    <td className="rounded-l-2xl px-4 py-3">
                      <p className="font-semibold">{row.userName}</p>
                      <p className="text-xs text-[#667180]">{row.userEmail}</p>
                    </td>
                    <td className="px-4 py-3">{formatDate(row.createdAt, locale)}</td>
                    <td className="px-4 py-3">{row.easeOfUse}</td>
                    <td className="px-4 py-3">{row.moduleClarity}</td>
                    <td className="px-4 py-3">{row.navigation}</td>
                    <td className="px-4 py-3">{row.testsExperience}</td>
                    <td className="px-4 py-3">{row.technicalProblems}</td>
                    <td className="px-4 py-3">{row.overallSatisfaction}</td>
                    <td className="px-4 py-3">{formatOptionalText(row.suggestions)}</td>
                    <td className="rounded-r-2xl px-4 py-3">
                      {formatOptionalText(row.technicalNotes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
