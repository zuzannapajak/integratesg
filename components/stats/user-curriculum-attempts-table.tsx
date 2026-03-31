"use client";

import { DashboardCurriculumAttemptRow } from "@/lib/admin/types";
import {
  CheckCircle2,
  CircleDashed,
  Leaf,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  rows: DashboardCurriculumAttemptRow[];
};

function getAreaMeta(
  area: DashboardCurriculumAttemptRow["area"],
  t: ReturnType<typeof useTranslations>,
) {
  switch (area) {
    case "environmental":
      return {
        label: t("area.environmental"),
        icon: <Leaf className="h-3.5 w-3.5" />,
        className: "border-emerald-100 bg-emerald-50 text-emerald-700",
      };
    case "social":
      return {
        label: t("area.social"),
        icon: <Users className="h-3.5 w-3.5" />,
        className: "border-sky-100 bg-sky-50 text-sky-700",
      };
    case "governance":
      return {
        label: t("area.governance"),
        icon: <ShieldCheck className="h-3.5 w-3.5" />,
        className: "border-violet-100 bg-violet-50 text-violet-700",
      };
    default:
      return {
        label: t("area.crossCutting"),
        icon: <Sparkles className="h-3.5 w-3.5" />,
        className: "border-amber-100 bg-amber-50 text-amber-700",
      };
  }
}

function getStatusMeta(
  status: DashboardCurriculumAttemptRow["status"],
  t: ReturnType<typeof useTranslations>,
) {
  switch (status) {
    case "completed":
      return {
        label: t("tableCurriculum.status.completed"),
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        className: "border-emerald-100 bg-emerald-50 text-emerald-700",
      };
    case "failed":
      return {
        label: t("tableCurriculum.status.failed"),
        icon: <XCircle className="h-3.5 w-3.5" />,
        className: "border-red-100 bg-red-50 text-red-700",
      };
    default:
      return {
        label: t("tableCurriculum.status.inProgress"),
        icon: <CircleDashed className="h-3.5 w-3.5" />,
        className: "border-orange-100 bg-orange-50 text-orange-700",
      };
  }
}

export default function UserCurriculumAttemptsTable({ rows }: Props) {
  const t = useTranslations("Protected.AdminStatsShell");

  if (rows.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#dbe3eb] bg-[#fbfcfd] px-6 py-10 text-center">
        <p className="text-sm font-semibold text-[#31425a]">{t("tableCurriculum.emptyTitle")}</p>
        <p className="mt-2 text-sm leading-6 text-[#667180]">
          {t("tableCurriculum.emptyDescription")}
        </p>
      </div>
    );
  }

  const headings = [
    t("tableCurriculum.headers.learner"),
    t("tableCurriculum.headers.course"),
    t("tableCurriculum.headers.area"),
    t("tableCurriculum.headers.status"),
    t("tableCurriculum.headers.progress"),
    t("tableCurriculum.headers.preQuiz"),
    t("tableCurriculum.headers.postQuiz"),
    t("tableCurriculum.headers.started"),
    t("tableCurriculum.headers.lastOpened"),
    t("tableCurriculum.headers.completed"),
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-[#e8edf3] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#f8fafc]">
              {headings.map((heading) => (
                <th
                  key={heading}
                  className="border-b border-[#e8edf3] px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const areaMeta = getAreaMeta(row.area, t);
              const statusMeta = getStatusMeta(row.status, t);

              return (
                <tr key={row.id} className="align-top">
                  <td className="border-b border-[#eef2f6] px-4 py-4">
                    <div className="min-w-45">
                      <div className="font-semibold text-[#31425a]">{row.learnerName}</div>
                      <div className="mt-1 text-sm text-[#667180]">{row.learnerEmail}</div>
                    </div>
                  </td>

                  <td className="border-b border-[#eef2f6] px-4 py-4">
                    <div className="min-w-55">
                      <div className="font-semibold text-[#31425a]">{row.courseTitle}</div>
                      <div className="mt-1 text-sm text-[#667180]">{row.courseSlug}</div>
                    </div>
                  </td>

                  <td className="border-b border-[#eef2f6] px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] ${areaMeta.className}`}
                    >
                      {areaMeta.icon}
                      {areaMeta.label}
                    </span>
                  </td>

                  <td className="border-b border-[#eef2f6] px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] ${statusMeta.className}`}
                    >
                      {statusMeta.icon}
                      {statusMeta.label}
                    </span>
                  </td>

                  <td className="border-b border-[#eef2f6] px-4 py-4 text-sm font-semibold text-[#31425a]">
                    {row.preQuizScoreLabel}
                  </td>

                  <td className="border-b border-[#eef2f6] px-4 py-4 text-sm font-semibold text-[#31425a]">
                    {row.postQuizScoreLabel}
                  </td>

                  <td className="border-b border-[#eef2f6] px-4 py-4 text-sm text-[#667180]">
                    {row.startedAtLabel}
                  </td>

                  <td className="border-b border-[#eef2f6] px-4 py-4 text-sm text-[#667180]">
                    {row.lastOpenedAtLabel}
                  </td>

                  <td className="border-b border-[#eef2f6] px-4 py-4 text-sm text-[#667180]">
                    {row.completedAtLabel}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
