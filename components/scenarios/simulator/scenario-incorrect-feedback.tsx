"use client";

import { AlertTriangle, Lightbulb, RotateCcw, TrendingDown, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

import type { ResolvedChallenge, ResolvedChoice } from "@/lib/scenarios/simulator/types";

export type ScenarioIncorrectFeedbackLabels = {
  readonly challenge: string;
  readonly incorrectDecision: string;
  readonly yourDecision: string;
  readonly whyItFallsShort: string;
  readonly likelyConsequence: string;
  readonly keyTakeaway: string;
  readonly tryAgain: string;
  readonly loading: string;
};

export const DEFAULT_SCENARIO_INCORRECT_FEEDBACK_LABELS: ScenarioIncorrectFeedbackLabels = {
  challenge: "Challenge",
  incorrectDecision: "Try another approach",
  yourDecision: "Your decision",
  whyItFallsShort: "Why this approach falls short",
  likelyConsequence: "Likely consequence",
  keyTakeaway: "Key takeaway",
  tryAgain: "Try again",
  loading: "Loading…",
};

export type ScenarioIncorrectFeedbackProps = {
  readonly challenge: ResolvedChallenge;
  readonly choice: ResolvedChoice;

  readonly labels?: Partial<ScenarioIncorrectFeedbackLabels>;

  readonly isSubmitting?: boolean;
  readonly errorMessage?: string | null;

  readonly onTryAgain: () => void | Promise<void>;
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

export function ScenarioIncorrectFeedback({
  challenge,
  choice,
  labels: customLabels,
  isSubmitting = false,
  errorMessage = null,
  onTryAgain,
}: ScenarioIncorrectFeedbackProps) {
  const labels = {
    ...DEFAULT_SCENARIO_INCORRECT_FEEDBACK_LABELS,
    ...customLabels,
  };

  const feedback = choice.feedback;

  return (
    <div
      data-testid="scenario-incorrect-feedback"
      data-feedback-kind="incorrect"
      data-challenge-id={challenge.id}
      data-choice-id={choice.id}
      aria-busy={isSubmitting}
      className="absolute inset-0 bg-linear-to-t from-[#17243a]/82 via-[#17243a]/28 to-[#17243a]/4"
    >
      <div className="flex h-full min-h-0 items-center justify-end p-3 sm:p-4 lg:p-5">
        <article
          role="status"
          aria-live="polite"
          className="max-h-full w-full overflow-y-auto rounded-3xl border border-white/40 bg-white/97 p-5 shadow-[0_24px_70px_rgba(23,36,58,0.32)] backdrop-blur-md sm:max-w-3xl sm:p-6 lg:p-7"
        >
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e36b2c] text-white shadow-[0_10px_28px_rgba(227,107,44,0.26)]"
            >
              <AlertTriangle size={26} strokeWidth={2.4} />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#b94c18]">
                {labels.incorrectDecision}
              </p>

              <p className="mt-1 text-xs font-medium text-[#7a8594]">
                {labels.challenge} {challenge.order}
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#31425a] sm:text-2xl lg:text-3xl">
                {feedback.title ?? labels.incorrectDecision}
              </h2>
            </div>
          </div>

          <section
            aria-labelledby="incorrect-feedback-decision-heading"
            className="mt-6 rounded-2xl border border-[#efc6b2] bg-[#fff6f1] p-4 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e36b2c] text-white"
              >
                <X size={17} strokeWidth={3} />
              </span>

              <div className="min-w-0">
                <h3
                  id="incorrect-feedback-decision-heading"
                  className="text-xs font-semibold uppercase tracking-[0.11em] text-[#b94c18]"
                >
                  {labels.yourDecision}
                </h3>

                {choice.label ? (
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#31425a]">
                    {choice.label}
                  </p>
                ) : null}

                <p
                  className={[
                    "text-sm leading-6 text-[#596170]",
                    choice.label ? "mt-1" : "mt-2",
                  ].join(" ")}
                >
                  {choice.text}
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="incorrect-feedback-explanation-heading" className="mt-6">
            <h3
              id="incorrect-feedback-explanation-heading"
              className="text-sm font-semibold text-[#31425a]"
            >
              {labels.whyItFallsShort}
            </h3>

            <div className="mt-3">
              <MarkdownContent>{feedback.body}</MarkdownContent>
            </div>
          </section>

          {feedback.consequence ? (
            <section
              aria-labelledby="incorrect-feedback-consequence-heading"
              className="mt-5 rounded-2xl border border-[#eadfd8] bg-[#faf7f5] p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5e8e1] text-[#b94c18]"
                >
                  <TrendingDown size={18} />
                </span>

                <h3
                  id="incorrect-feedback-consequence-heading"
                  className="text-sm font-semibold text-[#31425a]"
                >
                  {labels.likelyConsequence}
                </h3>
              </div>

              <div className="mt-3">
                <MarkdownContent>{feedback.consequence}</MarkdownContent>
              </div>
            </section>
          ) : null}

          {feedback.takeaway ? (
            <section
              aria-labelledby="incorrect-feedback-takeaway-heading"
              className="mt-4 rounded-2xl border border-[#dbe7f5] bg-[#f4f8fd] p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e7f0ff] text-[#0d6fe8]"
                >
                  <Lightbulb size={18} />
                </span>

                <h3
                  id="incorrect-feedback-takeaway-heading"
                  className="text-sm font-semibold text-[#31425a]"
                >
                  {labels.keyTakeaway}
                </h3>
              </div>

              <div className="mt-3">
                <MarkdownContent>{feedback.takeaway}</MarkdownContent>
              </div>
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
              disabled={isSubmitting}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0d6fe8] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(13,111,232,0.22)] transition hover:-translate-y-0.5 hover:bg-[#095fc8] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
              onClick={() => void onTryAgain()}
            >
              {isSubmitting ? labels.loading : labels.tryAgain}

              {!isSubmitting ? <RotateCcw aria-hidden="true" size={17} /> : null}
            </button>
          </footer>
        </article>
      </div>
    </div>
  );
}
