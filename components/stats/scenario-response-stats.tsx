"use client";

import type { AdminScenarioResponseStat } from "@/lib/admin/types";
import { CheckCircle2, MousePointerClick, RotateCcw, Target } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

type Props = {
  rows: readonly AdminScenarioResponseStat[];
  query?: string;
};

type ScenarioGroup = {
  scenarioId: string;
  scenarioTitle: string;
  challenges: AdminScenarioResponseStat[];
};

function toPercent(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

function formatPercent(value: number): string {
  return `${Number.isInteger(value) ? value : Math.round(value * 10) / 10}%`;
}

function formatDecimal(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function groupRows(rows: readonly AdminScenarioResponseStat[]): ScenarioGroup[] {
  const groups = new Map<string, ScenarioGroup>();

  for (const row of rows) {
    const existing = groups.get(row.scenarioId);

    if (existing) {
      existing.challenges.push(row);
      continue;
    }

    groups.set(row.scenarioId, {
      scenarioId: row.scenarioId,
      scenarioTitle: row.scenarioTitle,
      challenges: [row],
    });
  }

  return [...groups.values()];
}

export default function ScenarioResponseStats({ rows, query = "" }: Props) {
  const t = useTranslations("Protected.AdminStatsShell.scenarioResponses");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    if (!normalizedQuery) return rows;

    return rows.filter((row) => {
      return (
        row.scenarioTitle.toLowerCase().includes(normalizedQuery) ||
        row.scenarioId.toLowerCase().includes(normalizedQuery) ||
        row.challengeTitle.toLowerCase().includes(normalizedQuery) ||
        row.challengeId.toLowerCase().includes(normalizedQuery) ||
        row.choices.some(
          (choice) =>
            choice.choiceLabel.toLowerCase().includes(normalizedQuery) ||
            choice.choiceId.toLowerCase().includes(normalizedQuery),
        )
      );
    });
  }, [normalizedQuery, rows]);

  const groups = useMemo(() => groupRows(filteredRows), [filteredRows]);

  const summary = useMemo(() => {
    let challengeRuns = 0;
    let totalDecisions = 0;
    let runsWithRetry = 0;
    let retryDecisions = 0;

    for (const row of filteredRows) {
      challengeRuns += row.challengeRuns;
      totalDecisions += row.totalDecisions;
      runsWithRetry += row.runsWithRetry;
      retryDecisions += row.retryDecisions;
    }

    return {
      challengeRuns,
      totalDecisions,
      runsWithRetry,
      retryDecisions,
      retryRate: toPercent(runsWithRetry, challengeRuns),
      averageRetriesPerRun:
        challengeRuns === 0 ? 0 : Math.round((retryDecisions / challengeRuns) * 10) / 10,
    };
  }, [filteredRows]);

  if (filteredRows.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
        <p className="text-sm font-semibold text-slate-700">{t("empty.title")}</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">{t("empty.subtitle")}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
            {t("summary.challengeRuns")}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{summary.challengeRuns}</p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-700">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-80">
            {t("summary.decisions")}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{summary.totalDecisions}</p>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-orange-700">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-80">
            {t("summary.retryRate")}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight">
            {formatPercent(summary.retryRate)}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-80">
            {t("summary.averageRetries")}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight">
            {formatDecimal(summary.averageRetriesPerRun)}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {groups.map((group) => (
          <section
            key={group.scenarioId}
            className="overflow-hidden rounded-[26px] border border-slate-200 bg-white"
          >
            <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {group.scenarioId}
              </p>
              <h3 className="mt-1 text-base font-bold text-slate-900">{group.scenarioTitle}</h3>
            </div>

            <div className="divide-y divide-slate-100">
              {group.challenges.map((challenge) => (
                <article key={challenge.challengeId} className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        {challenge.challengeId}
                      </p>
                      <h4 className="mt-1 text-base font-semibold leading-6 text-slate-800">
                        {challenge.challengeTitle}
                      </h4>
                    </div>

                    <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Target className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-semibold uppercase tracking-widest">
                            {t("metrics.runs")}
                          </span>
                        </div>
                        <p className="mt-1 text-lg font-bold text-slate-800">
                          {challenge.challengeRuns}
                        </p>
                      </div>

                      <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2">
                        <div className="flex items-center gap-1.5 text-sky-600">
                          <MousePointerClick className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-semibold uppercase tracking-widest">
                            {t("metrics.decisions")}
                          </span>
                        </div>
                        <p className="mt-1 text-lg font-bold text-sky-700">
                          {challenge.totalDecisions}
                        </p>
                      </div>

                      <div className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2">
                        <div className="flex items-center gap-1.5 text-orange-600">
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-semibold uppercase tracking-widest">
                            {t("metrics.retryRate")}
                          </span>
                        </div>
                        <p className="mt-1 text-lg font-bold text-orange-700">
                          {formatPercent(challenge.retryRate)}
                        </p>
                      </div>

                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                        <div className="flex items-center gap-1.5 text-amber-600">
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-semibold uppercase tracking-widest">
                            {t("metrics.averageRetries")}
                          </span>
                        </div>
                        <p className="mt-1 text-lg font-bold text-amber-700">
                          {formatDecimal(challenge.averageRetriesPerRun)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {challenge.choices.map((choice) => (
                      <div
                        key={choice.choiceId}
                        className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold leading-5 text-slate-700">
                                {choice.choiceLabel}
                              </p>

                              {choice.isOptimal ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                                  <CheckCircle2 className="h-3 w-3" />
                                  {t("optimal")}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 text-xs text-slate-400">{choice.choiceId}</p>
                          </div>

                          <div className="shrink-0 text-left sm:text-right">
                            <p className="text-lg font-bold text-slate-800">
                              {formatPercent(choice.sharePercent)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {t("selections", { count: choice.selections })}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              choice.isOptimal ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, choice.sharePercent))}%` }}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
