"use client";

import type {
  EvaluationArea,
  EvaluationGroup,
  EvaluationReport,
  EvaluationRole,
} from "@/lib/admin/evaluation";
import { useTranslations } from "next-intl";
import { useMemo, useState, type ChangeEvent } from "react";

type Props = { locale: string; report: EvaluationReport };

type FilterName = "area" | "countryCode" | "cohortCode" | "group" | "role";
const FILTERS: FilterName[] = ["area", "countryCode", "cohortCode", "group", "role"];

function valueOrDash(value: string | number | null) {
  return value === null || value === "" ? "—" : String(value);
}

function Score({ score }: { score: number | null }) {
  return <span>{score === null ? "—" : score.toFixed(2)}</span>;
}

export default function WpEvaluationAdminDashboard({ locale, report }: Props) {
  const t = useTranslations("Protected.EvaluationAdmin");
  const [filters, setFilters] = useState<Record<FilterName, string>>({
    area: "",
    countryCode: "",
    cohortCode: "",
    group: "",
    role: "",
  });
  const filtered = useMemo(
    () =>
      report.rows.filter((row) =>
        FILTERS.every((field) => {
          const selected = filters[field];
          return selected === "" || (row[field] ?? "unknown") === selected;
        }),
      ),
    [filters, report.rows],
  );
  const filterOptions = (field: FilterName) =>
    [...new Set(report.rows.map((row) => row[field] ?? "unknown"))].sort();

  const labelFor = (field: FilterName, value: string) => {
    if (value === "unknown") return t("unknown");
    if (field === "area") return t(`area.${value as EvaluationArea}`);
    if (field === "group") return t(`group.${value as EvaluationGroup}`);
    if (field === "role") return t(`role.${value as EvaluationRole}`);
    return value;
  };

  const totals = [
    ["participants", report.summary.participants],
    ["pilotParticipants", report.summary.pilotParticipants],
    ["responses", report.summary.totalResponses],
    ["contentResponses", report.summary.contentResponses],
    ["platformResponses", report.summary.platformResponses],
    ["materialsCompleted", report.summary.materialsCompleted],
  ] as const;

  return (
    <section className="space-y-6" aria-label={t("title")}>
      <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <h2 className="text-xl font-bold text-[#31425a]">{t("title")}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667180]">{t("description")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              className="rounded-xl bg-[#31425a] px-4 py-2 text-sm font-semibold text-white"
              href={`/${locale}/admin/evaluation/export?kind=summary`}
            >
              {t("export.summary")}
            </a>
            <a
              className="rounded-xl border border-[#d9e2ec] bg-white px-4 py-2 text-sm font-semibold text-[#31425a]"
              href={`/${locale}/admin/evaluation/export?kind=responses`}
            >
              {t("export.responses")}
            </a>
            <a
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800"
              href={`/${locale}/admin/evaluation/export?kind=responses&includeText=1`}
            >
              {t("export.qualitative")}
            </a>
          </div>
        </div>
        <p className="mt-4 text-xs leading-5 text-[#667180]">{t("privacyNotice")}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {totals.map(([key, value]) => (
            <div key={key} className="rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#667180]">
                {t(`summary.${key}`)}
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-[#31425a]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-[#31425a]">{t("breakdownTitle")}</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {FILTERS.map((field) => (
            <label key={field} className="flex flex-col gap-1 text-sm font-medium text-[#536174]">
              {t(`filters.${field}`)}
              <select
                value={filters[field]}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  setFilters((current) => ({
                    ...current,
                    [field]: event.target.value,
                  }));
                }}
                className="w-full rounded-xl border border-[#d9e2ec] bg-white px-3 py-2 text-[#31425a]"
              >
                <option value="">{t("all")}</option>
                {filterOptions(field).map((value) => (
                  <option key={value} value={value}>
                    {labelFor(field, value)}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#667180]">{t("filterNote")}</p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-320 text-left text-sm">
            <thead className="border-b border-[#d9e2ec] text-xs uppercase text-[#536174]">
              <tr>
                {(
                  [
                    "area",
                    "country",
                    "cohort",
                    "group",
                    "role",
                    "participants",
                    "respondents",
                    "pre",
                    "post",
                    "content",
                    "platform",
                    "started",
                    "completed",
                    "averagePre",
                    "averagePost",
                    "averageContent",
                    "averagePlatform",
                  ] as const
                ).map((key) => (
                  <th key={key} scope="col" className="px-3 py-3 whitespace-nowrap">
                    {t(`columns.${key}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, index) => (
                <tr
                  key={`${row.area}:${String(row.countryCode)}:${String(row.cohortCode)}:${row.group}:${row.role}:${index}`}
                  className="border-b border-[#edf1f5] text-[#31425a]"
                >
                  <td className="px-3 py-3 font-medium">{t(`area.${row.area}`)}</td>
                  <td className="px-3 py-3">{valueOrDash(row.countryCode)}</td>
                  <td className="px-3 py-3">{valueOrDash(row.cohortCode)}</td>
                  <td className="px-3 py-3">{t(`group.${row.group}`)}</td>
                  <td className="px-3 py-3">{t(`role.${row.role}`)}</td>
                  <td className="px-3 py-3 tabular-nums">{row.participants}</td>
                  <td className="px-3 py-3 tabular-nums">{row.respondents}</td>
                  <td className="px-3 py-3 tabular-nums">{row.preResponses}</td>
                  <td className="px-3 py-3 tabular-nums">{row.postResponses}</td>
                  <td className="px-3 py-3 tabular-nums">{row.contentResponses}</td>
                  <td className="px-3 py-3 tabular-nums">{row.platformResponses}</td>
                  <td className="px-3 py-3 tabular-nums">{row.materialsStarted}</td>
                  <td className="px-3 py-3 tabular-nums">{row.materialsCompleted}</td>
                  <td className="px-3 py-3">
                    <Score score={row.averagePre} />
                  </td>
                  <td className="px-3 py-3">
                    <Score score={row.averagePost} />
                  </td>
                  <td className="px-3 py-3">
                    <Score score={row.averageContent} />
                  </td>
                  <td className="px-3 py-3">
                    <Score score={row.averagePlatform} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 ? (
            <p className="p-5 text-sm text-[#667180]">{t("empty")}</p>
          ) : null}
        </div>
        <p className="mt-4 text-xs leading-5 text-[#667180]">{t("methodology")}</p>
      </div>
    </section>
  );
}
