"use client";

import type { CurriculumPilotAdminStats } from "@/lib/admin/curriculum-pilot";
import { BarChart3, ClipboardCheck, Users } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  locale: string;
  stats: CurriculumPilotAdminStats;
};

function formatValue(value: number | null) {
  if (value === null) return "—";
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function formatDate(value: string | null, locale: string) {
  if (!value) return "—";

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_12px_34px_rgba(35,45,62,0.06)]">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a97a6]">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[#31425a]">{value}</p>
    </div>
  );
}

export default function CurriculumPilotAdminDashboard({ locale, stats }: Props) {
  const t = useTranslations("Protected.CurriculumPilotAdminDashboard");

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20">
      <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/60 bg-white text-[#0b9c72] shadow-sm">
              <ClipboardCheck className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#31425a]">{t("title")}</h1>
              <p className="mt-1 text-[#667180]">{t("description")}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`/${locale}/admin/curriculum-pilot/export?format=csv`}
              className="rounded-2xl bg-[#31425a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#253347]"
            >
              {t("actions.exportCsv")}
            </a>

            <a
              href={`/${locale}/admin/curriculum-pilot/export?format=xls`}
              className="rounded-2xl border border-[#d9e2ec] bg-white px-4 py-2.5 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc]"
            >
              {t("actions.exportExcel")}
            </a>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label={t("summary.startedPilotPath")}
            value={stats.summary.startedPilotPath}
          />
          <SummaryCard label={t("summary.preCompleted")} value={stats.summary.preCompleted} />
          <SummaryCard label={t("summary.postCompleted")} value={stats.summary.postCompleted} />
          <SummaryCard label={t("summary.preSkipped")} value={stats.summary.preSkipped} />
          <SummaryCard
            label={t("summary.averagePreScore")}
            value={formatValue(stats.summary.averagePreScore)}
          />
          <SummaryCard
            label={t("summary.averagePostScore")}
            value={formatValue(stats.summary.averagePostScore)}
          />
          <SummaryCard
            label={t("summary.averageDelta")}
            value={formatValue(stats.summary.averageDelta)}
          />
          <SummaryCard
            label={t("summary.averageModulesBeforePost")}
            value={formatValue(stats.summary.averageModulesBeforePost)}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_12px_34px_rgba(35,45,62,0.06)]">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#0b9c72]" />
            <h2 className="text-xl font-bold text-[#31425a]">{t("questionAnalysis.title")}</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-225 border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-[0.12em] text-[#8a97a6]">
                  <th className="px-4 py-2">{t("questionAnalysis.columns.question")}</th>
                  <th className="px-4 py-2">{t("questionAnalysis.columns.preAverage")}</th>
                  <th className="px-4 py-2">{t("questionAnalysis.columns.postAverage")}</th>
                  <th className="px-4 py-2">{t("questionAnalysis.columns.delta")}</th>
                  <th className="px-4 py-2">{t("questionAnalysis.columns.preAnswers")}</th>
                  <th className="px-4 py-2">{t("questionAnalysis.columns.postAnswers")}</th>
                </tr>
              </thead>

              <tbody>
                {stats.questionStats.map((question) => (
                  <tr key={question.questionId} className="bg-[#f8fafc] text-[#31425a]">
                    <td className="rounded-l-2xl px-4 py-3 font-medium">{question.prompt}</td>
                    <td className="px-4 py-3">{formatValue(question.preAverage)}</td>
                    <td className="px-4 py-3">{formatValue(question.postAverage)}</td>
                    <td className="px-4 py-3">{formatValue(question.delta)}</td>
                    <td className="px-4 py-3">{question.preAnswers}</td>
                    <td className="rounded-r-2xl px-4 py-3">{question.postAnswers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_12px_34px_rgba(35,45,62,0.06)]">
          <div className="mb-5 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#0b9c72]" />
            <h2 className="text-xl font-bold text-[#31425a]">{t("users.title")}</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-275 border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-[0.12em] text-[#8a97a6]">
                  <th className="px-4 py-2">{t("users.columns.user")}</th>
                  <th className="px-4 py-2">{t("users.columns.status")}</th>
                  <th className="px-4 py-2">{t("users.columns.preCompleted")}</th>
                  <th className="px-4 py-2">{t("users.columns.postCompleted")}</th>
                  <th className="px-4 py-2">{t("users.columns.preAverage")}</th>
                  <th className="px-4 py-2">{t("users.columns.postAverage")}</th>
                  <th className="px-4 py-2">{t("users.columns.delta")}</th>
                  <th className="px-4 py-2">{t("users.columns.modulesBeforePost")}</th>
                </tr>
              </thead>

              <tbody>
                {stats.userRows.map((row) => (
                  <tr key={row.userId} className="bg-[#f8fafc] text-[#31425a]">
                    <td className="rounded-l-2xl px-4 py-3">
                      <p className="font-semibold">{row.learnerName}</p>
                      <p className="text-xs text-[#667180]">{row.learnerEmail}</p>
                    </td>
                    <td className="px-4 py-3">{row.status}</td>
                    <td className="px-4 py-3">{formatDate(row.preCompletedAt, locale)}</td>
                    <td className="px-4 py-3">{formatDate(row.postCompletedAt, locale)}</td>
                    <td className="px-4 py-3">{formatValue(row.preAverage)}</td>
                    <td className="px-4 py-3">{formatValue(row.postAverage)}</td>
                    <td className="px-4 py-3">{formatValue(row.delta)}</td>
                    <td className="rounded-r-2xl px-4 py-3">{row.modulesBeforePost ?? "—"}</td>
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
