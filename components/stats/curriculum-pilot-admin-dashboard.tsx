import type { CurriculumPilotAdminStats } from "@/lib/admin/curriculum-pilot";
import { BarChart3, ClipboardCheck, Users } from "lucide-react";

type Props = {
  stats: CurriculumPilotAdminStats;
};

function formatValue(value: number | null) {
  if (value === null) return "—";
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
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

export default function CurriculumPilotAdminDashboard({ stats }: Props) {
  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20">
      <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white text-[#0b9c72] shadow-sm">
            <ClipboardCheck className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#31425a]">
              Curriculum pilot progress
            </h1>
            <p className="text-[#667180]">
              Pre/post assessment statistics and per-question progress analysis.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Pilot path started" value={stats.summary.startedPilotPath} />
          <SummaryCard label="Pre completed" value={stats.summary.preCompleted} />
          <SummaryCard label="Post completed" value={stats.summary.postCompleted} />
          <SummaryCard label="Pre skipped" value={stats.summary.preSkipped} />
          <SummaryCard
            label="Average pre score"
            value={formatValue(stats.summary.averagePreScore)}
          />
          <SummaryCard
            label="Average post score"
            value={formatValue(stats.summary.averagePostScore)}
          />
          <SummaryCard label="Average delta" value={formatValue(stats.summary.averageDelta)} />
          <SummaryCard
            label="Avg. modules before post"
            value={formatValue(stats.summary.averageModulesBeforePost)}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_12px_34px_rgba(35,45,62,0.06)]">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#0b9c72]" />
            <h2 className="text-xl font-bold text-[#31425a]">Per-question analysis</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-225 border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-[0.12em] text-[#8a97a6]">
                  <th className="px-4 py-2">Question</th>
                  <th className="px-4 py-2">Pre avg.</th>
                  <th className="px-4 py-2">Post avg.</th>
                  <th className="px-4 py-2">Delta</th>
                  <th className="px-4 py-2">Pre answers</th>
                  <th className="px-4 py-2">Post answers</th>
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
            <h2 className="text-xl font-bold text-[#31425a]">Pilot users</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-275 border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-[0.12em] text-[#8a97a6]">
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Pre completed</th>
                  <th className="px-4 py-2">Post completed</th>
                  <th className="px-4 py-2">Pre avg.</th>
                  <th className="px-4 py-2">Post avg.</th>
                  <th className="px-4 py-2">Delta</th>
                  <th className="px-4 py-2">Modules before post</th>
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
                    <td className="px-4 py-3">{formatDate(row.preCompletedAt)}</td>
                    <td className="px-4 py-3">{formatDate(row.postCompletedAt)}</td>
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
