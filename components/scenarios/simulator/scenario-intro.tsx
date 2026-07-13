"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { ScenarioScreenTransition } from "@/components/scenarios/common/scenario-screen-transition";
import type { ResolvedScenario } from "@/lib/scenarios/simulator/types";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, Clock3, Target, UserRound } from "lucide-react";

type IntroStep = 1 | 2;

export type ScenarioIntroLabels = {
  readonly scenario: string;
  readonly introduction: string;
  readonly of: string;
  readonly context: string;
  readonly organisation: string;
  readonly yourRole: string;
  readonly yourObjectives: string;
  readonly estimatedDuration: string;
  readonly minutes: string;
  readonly challenges: string;
  readonly scenarioInformation: string;
  readonly continue: string;
  readonly back: string;
  readonly startScenario: string;
  readonly backToScenarios: string;
  readonly starting: string;
};

export const DEFAULT_SCENARIO_INTRO_LABELS: ScenarioIntroLabels = {
  scenario: "Scenario",
  introduction: "Introduction",
  of: "of",
  context: "Scenario context",
  organisation: "Organisation",
  yourRole: "Your role",
  yourObjectives: "Your objectives",
  estimatedDuration: "Estimated duration",
  minutes: "minutes",
  challenges: "challenges",
  scenarioInformation: "Scenario information",
  continue: "Continue",
  back: "Back",
  startScenario: "Start scenario",
  backToScenarios: "Back to scenarios",
  starting: "Starting…",
};

export type ScenarioIntroProps = {
  readonly scenario: ResolvedScenario;
  readonly labels?: Partial<ScenarioIntroLabels>;
  readonly isStarting?: boolean;
  readonly errorMessage?: string | null;
  readonly onStart: () => void | Promise<void>;
  readonly onExit?: () => void;
};

function MarkdownContent({ children }: { readonly children: string }) {
  return (
    <div className="space-y-3 text-[0.95rem] leading-7 text-[#596170]">
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

function IntroProgress({
  step,
  labels,
}: {
  readonly step: IntroStep;
  readonly labels: ScenarioIntroLabels;
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#6f7b89]">
        {labels.introduction}
      </p>

      <div className="flex items-center gap-3">
        <div aria-hidden="true" className="flex items-center gap-1.5">
          <span className="h-2 w-7 rounded-full bg-[#0d6fe8]" />

          <span
            className={[
              "h-2 w-7 rounded-full transition-colors",
              step === 2 ? "bg-[#0d6fe8]" : "bg-[#d9e1ea]",
            ].join(" ")}
          />
        </div>

        <p aria-live="polite" className="min-w-12 text-right text-xs font-semibold text-[#596170]">
          {step} {labels.of} 2
        </p>
      </div>
    </div>
  );
}

export function ScenarioIntro(props: ScenarioIntroProps) {
  const { scenario } = props;

  return <ScenarioIntroContent key={`${scenario.id}:${scenario.version}`} {...props} />;
}

function ScenarioIntroContent({
  scenario,
  labels: customLabels,
  isStarting = false,
  errorMessage = null,
  onStart,
  onExit,
}: ScenarioIntroProps) {
  const [step, setStep] = useState<IntroStep>(1);

  const contentRef = useRef<HTMLElement>(null);

  const hasRenderedStepRef = useRef(false);

  const labels = {
    ...DEFAULT_SCENARIO_INTRO_LABELS,
    ...customLabels,
  };

  const challengeCount = scenario.challenges.length;

  useEffect(() => {
    if (!hasRenderedStepRef.current) {
      hasRenderedStepRef.current = true;
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      contentRef.current
        ?.querySelector<HTMLButtonElement>("[data-scenario-intro-primary-action]")
        ?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [step]);

  return (
    <div
      data-testid="scenario-intro"
      data-intro-step={step}
      aria-busy={isStarting}
      className="absolute inset-0 bg-linear-to-t from-[#17243a]/86 via-[#17243a]/28 to-[#17243a]/4"
    >
      <div className="flex h-full min-h-0 items-center justify-center p-3 sm:p-4 lg:p-5">
        <article
          ref={contentRef}
          className="max-h-full w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/35 bg-white/96 p-5 shadow-[0_24px_70px_rgba(23,36,58,0.3)] backdrop-blur-md sm:p-6 lg:p-7"
        >
          <AnimatePresence initial={false} mode="wait">
            <ScenarioScreenTransition
              key={step}
              direction={step === 2 ? "forward" : "backward"}
              testId="scenario-intro-step-transition"
              className="min-w-0"
            >
              {step === 1 ? (
                <>
                  <header className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0d6fe8]">
                      {labels.scenario} {scenario.order}
                    </p>

                    <h2 className="mt-2 max-w-3xl text-2xl font-semibold tracking-[-0.035em] text-[#31425a] sm:text-3xl">
                      {scenario.title}
                    </h2>

                    {scenario.subtitle ? (
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667180]">
                        {scenario.subtitle}
                      </p>
                    ) : null}
                  </header>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                    <section
                      aria-labelledby="scenario-context-heading"
                      className="rounded-[1.15rem] border border-[#e2e8ef] bg-[#f8fafc] p-4 sm:p-5"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef5ff] text-[#0d6fe8]"
                        >
                          <Target size={18} />
                        </span>

                        <h3
                          id="scenario-context-heading"
                          className="text-base font-semibold text-[#31425a]"
                        >
                          {labels.context}
                        </h3>
                      </div>

                      <div className="mt-3">
                        <MarkdownContent>{scenario.introduction}</MarkdownContent>
                      </div>
                    </section>

                    <section className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      {scenario.organisation ? (
                        <div className="rounded-[1.1rem] border border-[#e2e8ef] bg-white p-4">
                          <div className="flex items-start gap-3">
                            <span
                              aria-hidden="true"
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef3f8] text-[#31425a]"
                            >
                              <Building2 size={18} />
                            </span>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-widest text-[#7a8594]">
                                {labels.organisation}
                              </p>

                              <p className="mt-1 text-sm font-semibold leading-6 text-[#31425a]">
                                {scenario.organisation}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {scenario.role ? (
                        <div className="rounded-[1.1rem] border border-[#e2e8ef] bg-white p-4">
                          <div className="flex items-start gap-3">
                            <span
                              aria-hidden="true"
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff3ea] text-[#d85c1b]"
                            >
                              <UserRound size={18} />
                            </span>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-widest text-[#7a8594]">
                                {labels.yourRole}
                              </p>

                              <p className="mt-1 text-sm font-semibold leading-6 text-[#31425a]">
                                {scenario.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </section>
                  </div>

                  <footer className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {onExit ? (
                      <button
                        type="button"
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#d9e1ea] bg-white px-5 text-sm font-semibold text-[#31425a] transition hover:bg-[#f4f8fc] sm:w-auto"
                        onClick={onExit}
                      >
                        <ArrowLeft aria-hidden="true" size={17} />
                        {labels.backToScenarios}
                      </button>
                    ) : (
                      <span />
                    )}

                    <button
                      type="button"
                      data-scenario-context-action
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0d6fe8] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(13,111,232,0.22)] transition hover:-translate-y-0.5 hover:bg-[#095fc8] sm:w-auto"
                      onClick={() => {
                        setStep(2);
                      }}
                    >
                      {labels.continue}
                      <ArrowRight aria-hidden="true" size={17} />
                    </button>
                  </footer>
                </>
              ) : (
                <>
                  <header className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0d6fe8]">
                      {labels.scenario} {scenario.order}
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#31425a] sm:text-3xl">
                      {labels.yourObjectives}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#667180]">{scenario.shortTitle}</p>
                  </header>

                  <section aria-labelledby="scenario-objectives-heading" className="mt-5">
                    <h3 id="scenario-objectives-heading" className="sr-only">
                      {labels.yourObjectives}
                    </h3>

                    <ol className="grid gap-3 md:grid-cols-3">
                      {scenario.objectives.map((objective, index) => (
                        <li
                          key={`${index}-${objective}`}
                          className="flex min-h-30 flex-col rounded-[1.1rem] border border-[#e2e8ef] bg-[#f8fafc] p-4"
                        >
                          <span
                            aria-hidden="true"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b9c72] text-xs font-bold text-white"
                          >
                            {index + 1}
                          </span>

                          <span className="mt-4 text-sm font-medium leading-6 text-[#31425a]">
                            {objective}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section
                    aria-label={labels.scenarioInformation}
                    className="mt-5 flex flex-wrap gap-3"
                  >
                    {scenario.estimatedDurationMinutes !== null ? (
                      <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#dfe5ec] bg-white px-4 text-sm font-medium text-[#596170]">
                        <Clock3 aria-hidden="true" size={16} className="text-[#0d6fe8]" />

                        <span>
                          {labels.estimatedDuration}:{" "}
                          <strong className="font-semibold text-[#31425a]">
                            {scenario.estimatedDurationMinutes} {labels.minutes}
                          </strong>
                        </span>
                      </div>
                    ) : null}

                    <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#dfe5ec] bg-white px-4 text-sm font-medium text-[#596170]">
                      <Target aria-hidden="true" size={16} className="text-[#ef6c23]" />
                      <strong className="font-semibold text-[#31425a]">{challengeCount}</strong>
                      <span>{labels.challenges}</span>
                    </div>
                  </section>

                  {errorMessage ? (
                    <div
                      role="alert"
                      className="mt-5 rounded-2xl border border-[#f1c9c9] bg-[#fff6f6] px-4 py-3 text-sm leading-6 text-[#9f3c3c]"
                    >
                      {errorMessage}
                    </div>
                  ) : null}

                  <footer className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      disabled={isStarting}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#d9e1ea] bg-white px-5 text-sm font-semibold text-[#31425a] transition hover:bg-[#f4f8fc] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      onClick={() => {
                        setStep(1);
                      }}
                    >
                      <ArrowLeft aria-hidden="true" size={17} />
                      {labels.back}
                    </button>

                    <button
                      type="button"
                      data-scenario-intro-primary-action
                      disabled={isStarting}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0d6fe8] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(13,111,232,0.22)] transition hover:-translate-y-0.5 hover:bg-[#095fc8] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                      onClick={() => void onStart()}
                    >
                      {isStarting ? labels.starting : labels.startScenario}
                      {!isStarting ? <ArrowRight aria-hidden="true" size={17} /> : null}
                    </button>
                  </footer>
                </>
              )}
            </ScenarioScreenTransition>
          </AnimatePresence>

          <IntroProgress step={step} labels={labels} />
        </article>
      </div>
    </div>
  );
}
