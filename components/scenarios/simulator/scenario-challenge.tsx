"use client";

import { ArrowLeft, ArrowRight, BookOpen, ListChecks } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { ScenarioDecisionChoice } from "@/components/scenarios/simulator/scenario-decision-choice";
import type { ChoiceId, ResolvedChallenge } from "@/lib/scenarios/simulator/types";

export type ScenarioChallengeStep = "context" | "decision";

export type ScenarioChallengeLabels = {
  readonly challenge: string;
  readonly context: string;
  readonly decision: string;
  readonly of: string;
  readonly backToBoard: string;
  readonly continueToDecision: string;
  readonly back: string;
  readonly selectOneOption: string;
  readonly confirmDecision: string;
  readonly loading: string;
};

export const DEFAULT_SCENARIO_CHALLENGE_LABELS: ScenarioChallengeLabels = {
  challenge: "Challenge",
  context: "Challenge context",
  decision: "Decision",
  of: "of",
  backToBoard: "Back to challenges",
  continueToDecision: "Continue to decision",
  back: "Back",
  selectOneOption: "Select one option",
  confirmDecision: "Confirm decision",
  loading: "Saving…",
};

export type ScenarioChallengeProps = {
  readonly challenge: ResolvedChallenge;

  readonly selectedChoiceId: ChoiceId | null;

  readonly initialStep?: ScenarioChallengeStep;

  readonly labels?: Partial<ScenarioChallengeLabels>;

  readonly isSubmitting?: boolean;

  readonly errorMessage?: string | null;

  readonly onSelectChoice: (choiceId: ChoiceId) => void;

  readonly onConfirm: () => void | Promise<void>;

  readonly onBackToBoard: () => void;
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

function ChallengeProgress({
  step,
  labels,
}: {
  readonly step: ScenarioChallengeStep;
  readonly labels: ScenarioChallengeLabels;
}) {
  const stepNumber = step === "context" ? 1 : 2;

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#6f7b89]">
        {step === "context" ? labels.context : labels.decision}
      </p>

      <div className="flex items-center gap-3">
        <div aria-hidden="true" className="flex items-center gap-1.5">
          <span className="h-2 w-7 rounded-full bg-[#0d6fe8]" />

          <span
            className={[
              "h-2 w-7 rounded-full transition-colors",
              step === "decision" ? "bg-[#0d6fe8]" : "bg-[#d9e1ea]",
            ].join(" ")}
          />
        </div>

        <p aria-live="polite" className="min-w-12 text-right text-xs font-semibold text-[#596170]">
          {stepNumber} {labels.of} 2
        </p>
      </div>
    </div>
  );
}

/**
 * The keyed inner component resets the internal step whenever
 * another challenge or another initial step is provided.
 */
export function ScenarioChallenge(props: ScenarioChallengeProps) {
  const initialStep = props.initialStep ?? "context";

  return (
    <ScenarioChallengeContent
      key={`${props.challenge.id}:${initialStep}`}
      {...props}
      initialStep={initialStep}
    />
  );
}

function ScenarioChallengeContent({
  challenge,
  selectedChoiceId,
  initialStep = "context",
  labels: customLabels,
  isSubmitting = false,
  errorMessage = null,
  onSelectChoice,
  onConfirm,
  onBackToBoard,
}: ScenarioChallengeProps) {
  const [step, setStep] = useState<ScenarioChallengeStep>(initialStep);

  const labels = {
    ...DEFAULT_SCENARIO_CHALLENGE_LABELS,
    ...customLabels,
  };

  const selectedChoice = challenge.choices.find((choice) => choice.id === selectedChoiceId) ?? null;

  return (
    <div
      data-testid="scenario-challenge"
      data-challenge-id={challenge.id}
      data-challenge-step={step}
      aria-busy={isSubmitting}
      className="absolute inset-0 bg-linear-to-t from-[#17243a]/78 via-[#17243a]/25 to-[#17243a]/4"
    >
      <div className="flex h-full min-h-0 items-center justify-end p-3 sm:p-4 lg:p-5">
        <article className="max-h-full w-full overflow-y-auto rounded-3xl border border-white/40 bg-white/97 p-5 shadow-[0_24px_70px_rgba(23,36,58,0.3)] backdrop-blur-md sm:max-w-3xl sm:p-6 lg:p-7">
          <ChallengeProgress step={step} labels={labels} />

          <header className="mt-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0d6fe8]">
                {labels.challenge} {challenge.order}
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#31425a] sm:text-2xl lg:text-3xl">
                {challenge.title}
              </h2>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#d9e1ea] bg-white px-4 text-sm font-semibold text-[#31425a] transition hover:bg-[#f4f8fc] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onBackToBoard}
            >
              <ArrowLeft aria-hidden="true" size={16} />

              <span className="hidden sm:inline">{labels.backToBoard}</span>
            </button>
          </header>

          {step === "context" ? (
            <>
              <section
                aria-labelledby="challenge-context-heading"
                className="mt-6 rounded-2xl border border-[#dfe5ec] bg-[#f8fafc] p-4 sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef5ff] text-[#0d6fe8]"
                  >
                    <BookOpen size={19} />
                  </span>

                  <h3
                    id="challenge-context-heading"
                    className="text-base font-semibold text-[#31425a]"
                  >
                    {labels.context}
                  </h3>
                </div>

                <div className="mt-4">
                  <MarkdownContent>{challenge.context}</MarkdownContent>
                </div>
              </section>

              <footer className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0d6fe8] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(13,111,232,0.22)] transition hover:-translate-y-0.5 hover:bg-[#095fc8] sm:w-auto"
                  onClick={() => {
                    setStep("decision");
                  }}
                >
                  {labels.continueToDecision}

                  <ArrowRight aria-hidden="true" size={17} />
                </button>
              </footer>
            </>
          ) : (
            <>
              <section aria-labelledby="challenge-decision-heading" className="mt-6">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef5ff] text-[#0d6fe8]"
                  >
                    <ListChecks size={19} />
                  </span>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0d6fe8]">
                      {labels.selectOneOption}
                    </p>

                    <h3
                      id="challenge-decision-heading"
                      className="mt-1 text-base font-semibold leading-7 text-[#31425a] sm:text-lg"
                    >
                      {challenge.question}
                    </h3>
                  </div>
                </div>

                <fieldset className="mt-5 space-y-3" disabled={isSubmitting}>
                  <legend className="sr-only">{challenge.question}</legend>

                  {challenge.choices.map((choice) => (
                    <ScenarioDecisionChoice
                      key={choice.id}
                      choice={choice}
                      groupName={`${challenge.id}-choice`}
                      isSelected={selectedChoiceId === choice.id}
                      disabled={isSubmitting}
                      onSelect={onSelectChoice}
                    />
                  ))}
                </fieldset>
              </section>

              {errorMessage ? (
                <div
                  role="alert"
                  className="mt-4 rounded-2xl border border-[#f1c9c9] bg-[#fff6f6] px-4 py-3 text-sm leading-6 text-[#9f3c3c]"
                >
                  {errorMessage}
                </div>
              ) : null}

              <footer className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#d9e1ea] bg-white px-5 text-sm font-semibold text-[#31425a] transition hover:bg-[#f4f8fc] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  onClick={() => {
                    setStep("context");
                  }}
                >
                  <ArrowLeft aria-hidden="true" size={17} />

                  {labels.back}
                </button>

                <button
                  type="button"
                  disabled={!selectedChoice || isSubmitting}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0d6fe8] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(13,111,232,0.22)] transition hover:-translate-y-0.5 hover:bg-[#095fc8] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto"
                  onClick={() => void onConfirm()}
                >
                  {isSubmitting ? labels.loading : labels.confirmDecision}

                  {!isSubmitting ? <ArrowRight aria-hidden="true" size={17} /> : null}
                </button>
              </footer>
            </>
          )}
        </article>
      </div>
    </div>
  );
}
