"use client";

import { DashboardEportfolioProgressRow } from "@/lib/admin/types";
import { CheckCircle2, CircleDashed, Globe2 } from "lucide-react";

type Props = {
  rows: DashboardEportfolioProgressRow[];
};

function getStatusMeta(isCompleted: boolean) {
  if (isCompleted) {
    return {
      label: "Completed",
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      className: "border-emerald-100 bg-emerald-50 text-emerald-700",
    };
  }

  return {
    label: "In progress",
    icon: <CircleDashed className="h-3.5 w-3.5" />,
    className: "border-orange-100 bg-orange-50 text-orange-700",
  };
}

export default function UserEportfolioProgressTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#dbe3eb] bg-[#fbfcfd] px-6 py-10 text-center">
        <p className="text-sm font-semibold text-[#31425a]">No ePortfolio activity yet</p>
        <p className="mt-2 text-sm leading-6 text-[#667180]">
          Case study progress will appear here once learners start working through ePortfolio
          content.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#e8edf3] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#f8fafc]">
              {[
                "Learner",
                "Case study",
                "Language",
                "Status",
                "Started",
                "Last opened",
                "Completed",
              ].map((heading) => (
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
              const statusMeta = getStatusMeta(row.isCompleted);

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
                      <div className="font-semibold text-[#31425a]">{row.caseStudyTitle}</div>
                      <div className="mt-1 text-sm text-[#667180]">{row.caseStudySlug}</div>
                    </div>
                  </td>

                  <td className="border-b border-[#eef2f6] px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5ecf3] bg-[#f8fafc] px-2.5 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#516071]">
                      <Globe2 className="h-3.5 w-3.5" />
                      {row.language}
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
