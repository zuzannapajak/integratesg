"use client";

import { ArrowRight, Check, CircleCheckBig, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";

import type { ResolvedScenario } from "@/lib/scenarios/simulator/types";

export type ScenarioSummaryLabels = {
  readonly summary: string;
  readonly allChallengesCompleted: string;
  readonly completedChallenges: string;
  readonly keyTakeaways: string;
  readonly completeScenario: string;
  readonly loading: string;
};

export const DEFAULT_SCENARIO_SUMMARY_LABELS: ScenarioSummaryLabels = {
  summary: "Scenario summary",
  allChallengesCompleted: "All challenges completed",
  completedChallenges: "Challenges completed",
  keyTakeaways: "Key takeaways",
  completeScenario: "Complete scenario",
  loading: "Saving…",
};

export type ScenarioSummaryProps = {
  readonly scenarioTitle: string;

  readonly summary: ResolvedScenario["summary"];

  readonly completedCount: number;

  readonly totalCount: number;

  readonly labels?: Partial<ScenarioSummaryLabels>;

  readonly isSubmitting?: boolean;

  readonly errorMessage?: string | null;

  readonly onComplete: () => void | Promise<void>;
};

function MarkdownContent({ children }: { readonly children: string }) {
  return (
    <div className="space-y-3 text-[0.96rem] leading-7 text-[#596170]">
      <ReactMarkdown
        components={{
          p: ({ children: paragraphChildren }) => <p>{paragraphChildren}</p>,

          ul: ({ children: listChildren }) => (
            <ul className="list-disc space-y-2 pl-5">{listChildren}</ul>
          ),

          ol: ({ children: listChildren }) => (
            <ol className="list-decimal space-y-2 pl-5">{listChildren}</ol>
          ),

          strong: ({ children: strongChildren }) => (
            <strong className="font-semibold text-[#31425a]">{strongChildren}</strong>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export function ScenarioSummary({
  scenarioTitle,
  summary,
  completedCount,
  totalCount,
  labels: customLabels,
  isSubmitting = false,
  errorMessage = null,
  onComplete,
}: ScenarioSummaryProps) {
  const labels = {
    ...DEFAULT_SCENARIO_SUMMARY_LABELS,
    ...customLabels,
  };

  const allChallengesCompleted = totalCount > 0 && completedCount >= totalCount;

  return (
    <div
      data-testid="scenario-summary"
      data-completed-count={completedCount}
      data-total-count={totalCount}
      data-all-completed={allChallengesCompleted}
      aria-busy={isSubmitting}
      className="absolute inset-0 bg-linear-to-t from-[#17243a]/84 via-[#17243a]/30 to-[#17243a]/5"
    >
      <div className="flex h-full min-h-0 items-center justify-center p-3 sm:p-4 lg:p-5">
        <article
          aria-labelledby="scenario-summary-heading"
          className="max-h-full w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/40 bg-white/97 p-5 shadow-[0_24px_70px_rgba(23,36,58,0.32)] backdrop-blur-md sm:p-6 lg:p-7"
        >
          <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0b9c72] text-white shadow-[0_12px_30px_rgba(11,156,114,0.28)]"
              >
                <CircleCheckBig size={30} strokeWidth={2.4} />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#087658]">
                  {labels.summary}
                </p>

                <p aria-live="polite" className="mt-1 text-sm font-semibold text-[#0b9c72]">
                  {labels.allChallengesCompleted}
                </p>

                <h2
                  id="scenario-summary-heading"
                  className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#31425a] sm:text-3xl"
                >
                  {summary.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#7a8594]">{scenarioTitle}</p>
              </div>
            </div>

            <div
              className="inline-flex shrink-0 items-center gap-3 self-start rounded-full border border-[#0b9c72]/25 bg-[#ecf8f4] px-4 py-2.5"
              aria-label={`${completedCount} / ${totalCount} ${labels.completedChallenges}`}
            >
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b9c72] text-white"
              >
                <Check size={15} strokeWidth={3} />
              </span>

              <span className="text-sm font-semibold text-[#087658]">
                {completedCount} / {totalCount}
              </span>

              <span className="text-sm font-medium text-[#387966]">
                {labels.completedChallenges}
              </span>
            </div>
          </header>

          {summary.body ? (
            <section
              aria-label={labels.summary}
              className="mt-6 rounded-2xl border border-[#dfe5ec] bg-[#f8fafc] p-4 sm:p-5"
            >
              <MarkdownContent>{summary.body}</MarkdownContent>
            </section>
          ) : null}

          {summary.takeaways.length > 0 ? (
            <section aria-labelledby="scenario-summary-takeaways-heading" className="mt-6">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1c9] text-[#a76500]"
                >
                  <Lightbulb size={19} />
                </span>

                <h3
                  id="scenario-summary-takeaways-heading"
                  className="text-lg font-semibold text-[#31425a]"
                >
                  {labels.keyTakeaways}
                </h3>
              </div>

              <ol className="mt-4 grid gap-3 md:grid-cols-3">
                {summary.takeaways.map((takeaway, index) => (
                  <li
                    key={`${index}-${takeaway}`}
                    className="flex min-h-32 flex-col rounded-2xl border border-[#dfe5ec] bg-white p-4 shadow-[0_8px_24px_rgba(49,66,90,0.06)]"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0d6fe8] text-xs font-bold text-white"
                    >
                      {index + 1}
                    </span>

                    <p className="mt-4 text-sm font-medium leading-6 text-[#31425a]">{takeaway}</p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {errorMessage ? (
            <div
              role="alert"
              className="mt-5 rounded-2xl border border-[#f1c9c9] bg-[#fff6f6] px-4 py-3 text-sm leading-6 text-[#9f3c3c]"
            >
              {errorMessage}
            </div>
          ) : null}

          <footer className="mt-6 flex justify-end">
            <button
              type="button"
              disabled={isSubmitting || !allChallengesCompleted}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0b9c72] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(11,156,114,0.24)] transition hover:-translate-y-0.5 hover:bg-[#087658] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
              onClick={() => void onComplete()}
            >
              {isSubmitting ? labels.loading : labels.completeScenario}

              {!isSubmitting ? <ArrowRight aria-hidden="true" size={17} /> : null}
            </button>
          </footer>
        </article>
      </div>
    </div>
  );
}
