"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

import { ScenarioBoard } from "@/components/scenarios/simulator/scenario-board";
import { ScenarioIntro } from "@/components/scenarios/simulator/scenario-intro";
import type {
  ChallengeId,
  ChallengeProgressStatus,
  ChoiceId,
  ResolvedChallenge,
  ResolvedScenario,
  ScenarioId,
  ScenarioPlayerMode,
  ScenarioPlayerView,
} from "@/lib/scenarios/simulator/types";

export type ScenarioStartedEvent = {
  readonly scenarioId: ScenarioId;
  readonly scenarioVersion: number;
  readonly locale: ResolvedScenario["locale"];
};

export type ScenarioChoiceConfirmedEvent = {
  readonly scenarioId: ScenarioId;
  readonly scenarioVersion: number;
  readonly challengeId: ChallengeId;
  readonly choiceId: ChoiceId;
  readonly isOptimal: boolean;
  readonly attemptNumber: number;
};

export type ScenarioChallengeCompletedEvent = {
  readonly scenarioId: ScenarioId;
  readonly scenarioVersion: number;
  readonly challengeId: ChallengeId;
};

export type ScenarioCompletedEvent = {
  readonly scenarioId: ScenarioId;
  readonly scenarioVersion: number;
};

export type ScenarioPlayerLabels = {
  readonly startScenario: string;
  readonly viewChallenges: string;
  readonly backToBoard: string;
  readonly confirmDecision: string;
  readonly tryAgain: string;
  readonly continue: string;
  readonly completeScenario: string;
  readonly leaveScenario: string;
  readonly currentObjective: string;
  readonly completed: string;
  readonly available: string;
  readonly inProgress: string;
  readonly locked: string;
  readonly scenarioCompleted: string;
  readonly scenarioCompletedDescription: string;
  readonly progress: string;
  readonly loading: string;
};

const DEFAULT_LABELS: ScenarioPlayerLabels = {
  startScenario: "Start scenario",
  viewChallenges: "View challenges",
  backToBoard: "Back to challenges",
  confirmDecision: "Confirm decision",
  tryAgain: "Try again",
  continue: "Continue",
  completeScenario: "Complete scenario",
  leaveScenario: "Back to scenarios",
  currentObjective: "Current objective",
  completed: "Completed",
  available: "Available",
  inProgress: "In progress",
  locked: "Locked",
  scenarioCompleted: "Scenario completed",
  scenarioCompletedDescription: "Your progress has been completed successfully.",
  progress: "Progress",
  loading: "Saving…",
};

export type ScenarioPlayerProps = {
  readonly scenario: ResolvedScenario;

  readonly mode?: ScenarioPlayerMode;

  readonly initialView?: ScenarioPlayerView;

  readonly initialChallengeId?: ChallengeId | null;

  readonly initialCompletedChallengeIds?: readonly ChallengeId[];

  readonly labels?: Partial<ScenarioPlayerLabels>;

  readonly onScenarioStarted?: (event: ScenarioStartedEvent) => void | Promise<void>;

  readonly onChoiceConfirmed?: (event: ScenarioChoiceConfirmedEvent) => void | Promise<void>;

  readonly onChallengeCompleted?: (event: ScenarioChallengeCompletedEvent) => void | Promise<void>;

  readonly onScenarioCompleted?: (event: ScenarioCompletedEvent) => void | Promise<void>;

  readonly onExit?: () => void;
};

type ChallengeAttemptCountMap = Partial<Record<ChallengeId, number>>;

function MarkdownContent({
  children,
  className = "",
}: {
  readonly children: string;
  readonly className?: string;
}) {
  return (
    <div className={["space-y-3 text-[0.96rem] leading-7 text-[#596170]", className].join(" ")}>
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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export function ScenarioPlayer({
  scenario,
  mode = "play",
  initialView = "intro",
  initialChallengeId = null,
  initialCompletedChallengeIds = [],
  labels: customLabels,
  onScenarioStarted,
  onChoiceConfirmed,
  onChallengeCompleted,
  onScenarioCompleted,
  onExit,
}: ScenarioPlayerProps) {
  const labels = {
    ...DEFAULT_LABELS,
    ...customLabels,
  };

  const orderedChallenges = useMemo(
    () => [...scenario.challenges].sort((first, second) => first.order - second.order),
    [scenario.challenges],
  );

  const validChallengeIds = useMemo(
    () => new Set(orderedChallenges.map((challenge) => challenge.id)),
    [orderedChallenges],
  );

  const [completedChallengeIds, setCompletedChallengeIds] = useState<Set<ChallengeId>>(
    () =>
      new Set(
        initialCompletedChallengeIds.filter((challengeId) => validChallengeIds.has(challengeId)),
      ),
  );

  const [view, setView] = useState<ScenarioPlayerView>(initialView);

  const [currentChallengeId, setCurrentChallengeId] = useState<ChallengeId | null>(
    initialChallengeId && validChallengeIds.has(initialChallengeId) ? initialChallengeId : null,
  );

  const [selectedChoiceId, setSelectedChoiceId] = useState<ChoiceId | null>(null);

  const [attemptCounts, setAttemptCounts] = useState<ChallengeAttemptCountMap>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentChallenge =
    orderedChallenges.find((challenge) => challenge.id === currentChallengeId) ?? null;

  const selectedChoice =
    currentChallenge?.choices.find((choice) => choice.id === selectedChoiceId) ?? null;

  const usesPreStartBackground = view === "intro" || view === "board";

  const backgroundImage = usesPreStartBackground
    ? scenario.assets.preStartBackground
    : scenario.assets.inProgressBackground;

  const completedCount = completedChallengeIds.size;

  const totalChallenges = orderedChallenges.length;

  function getChallengeStatus(
    challenge: ResolvedChallenge,
    challengeIndex: number,
  ): ChallengeProgressStatus {
    if (completedChallengeIds.has(challenge.id)) {
      return "completed";
    }

    if (currentChallengeId === challenge.id && (view === "challenge" || view === "feedback")) {
      return "in_progress";
    }

    if (mode === "review") {
      return "available";
    }

    if (challengeIndex === 0) {
      return "available";
    }

    const previousChallenge = orderedChallenges[challengeIndex - 1];

    if (completedChallengeIds.has(previousChallenge.id)) {
      return "available";
    }

    return "locked";
  }

  async function startScenario() {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (mode === "play") {
        await onScenarioStarted?.({
          scenarioId: scenario.id,
          scenarioVersion: scenario.version,
          locale: scenario.locale,
        });
      }

      setCurrentChallengeId(null);
      setSelectedChoiceId(null);
      setView("board");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function openChallenge(challenge: ResolvedChallenge, challengeIndex: number) {
    const status = getChallengeStatus(challenge, challengeIndex);

    if (status === "locked") {
      return;
    }

    setErrorMessage(null);
    setCurrentChallengeId(challenge.id);
    setSelectedChoiceId(null);
    setView("challenge");
  }

  function returnToBoard() {
    setErrorMessage(null);
    setSelectedChoiceId(null);
    setCurrentChallengeId(null);
    setView("board");
  }

  async function confirmDecision() {
    if (!currentChallenge || !selectedChoice || isSubmitting) {
      return;
    }

    const attemptNumber = (attemptCounts[currentChallenge.id] ?? 0) + 1;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (mode === "play") {
        await onChoiceConfirmed?.({
          scenarioId: scenario.id,
          scenarioVersion: scenario.version,
          challengeId: currentChallenge.id,
          choiceId: selectedChoice.id,
          isOptimal: selectedChoice.isOptimal,
          attemptNumber,
        });
      }

      setAttemptCounts((currentCounts) => ({
        ...currentCounts,
        [currentChallenge.id]: attemptNumber,
      }));

      setView("feedback");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function tryAgain() {
    setErrorMessage(null);
    setSelectedChoiceId(null);
    setView("challenge");
  }

  async function continueAfterFeedback() {
    if (!currentChallenge || !selectedChoice || isSubmitting) {
      return;
    }

    if (!selectedChoice.isOptimal) {
      tryAgain();
      return;
    }

    const nextCompletedChallengeIds = new Set(completedChallengeIds);

    nextCompletedChallengeIds.add(currentChallenge.id);

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (mode === "play" && !completedChallengeIds.has(currentChallenge.id)) {
        await onChallengeCompleted?.({
          scenarioId: scenario.id,
          scenarioVersion: scenario.version,
          challengeId: currentChallenge.id,
        });
      }

      setCompletedChallengeIds(nextCompletedChallengeIds);

      setSelectedChoiceId(null);
      setCurrentChallengeId(null);

      if (nextCompletedChallengeIds.size >= totalChallenges) {
        setView("summary");
      } else {
        setView("board");
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function completeScenario() {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (mode === "play") {
        await onScenarioCompleted?.({
          scenarioId: scenario.id,
          scenarioVersion: scenario.version,
        });
      }

      setView("completion");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderChallenge() {
    if (!currentChallenge) {
      return null;
    }

    return (
      <div className="absolute inset-0 flex items-end justify-end bg-[#17243a]/35 p-3 sm:p-5 lg:p-8">
        <div className="max-h-[92%] w-full overflow-y-auto rounded-3xl border border-white/40 bg-white/97 p-5 shadow-[0_24px_70px_rgba(23,36,58,0.28)] backdrop-blur-md sm:max-w-2xl sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0d7fc2]">
                Challenge {currentChallenge.order}
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#31425a] sm:text-2xl">
                {currentChallenge.title}
              </h2>
            </div>

            <button
              type="button"
              className="shrink-0 rounded-full border border-[#d9e1ea] bg-white px-4 py-2 text-sm font-semibold text-[#31425a] transition hover:bg-[#f4f8fc]"
              onClick={returnToBoard}
            >
              {labels.backToBoard}
            </button>
          </div>

          <MarkdownContent className="mt-5">{currentChallenge.context}</MarkdownContent>

          <h3 className="mt-6 text-base font-semibold leading-7 text-[#31425a]">
            {currentChallenge.question}
          </h3>

          <fieldset className="mt-4 space-y-3">
            <legend className="sr-only">{currentChallenge.question}</legend>

            {currentChallenge.choices.map((choice) => {
              const isSelected = selectedChoiceId === choice.id;

              return (
                <label
                  key={choice.id}
                  className={[
                    "block cursor-pointer rounded-[1.1rem] border p-4 transition",
                    isSelected
                      ? "border-[#0d7fc2] bg-[#eef7fd] shadow-[0_8px_24px_rgba(13,127,194,0.12)]"
                      : "border-[#dfe5ec] bg-white hover:border-[#b8c8d8] hover:bg-[#fbfcfd]",
                  ].join(" ")}
                >
                  <span className="flex items-start gap-3">
                    <input
                      type="radio"
                      name={`${currentChallenge.id}-choice`}
                      value={choice.id}
                      checked={isSelected}
                      className="mt-1 h-4 w-4 accent-[#0d7fc2]"
                      onChange={() => {
                        setSelectedChoiceId(choice.id);
                      }}
                    />

                    <span>
                      {choice.label ? (
                        <span className="block text-sm font-semibold text-[#31425a]">
                          {choice.label}
                        </span>
                      ) : null}

                      <span className="mt-1 block text-sm leading-6 text-[#596170]">
                        {choice.text}
                      </span>
                    </span>
                  </span>
                </label>
              );
            })}
          </fieldset>

          {errorMessage ? (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-[#f1c9c9] bg-[#fff6f6] px-4 py-3 text-sm leading-6 text-[#9f3c3c]"
            >
              {errorMessage}
            </div>
          ) : null}

          <button
            type="button"
            disabled={!selectedChoice || isSubmitting}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#31425a] px-6 text-sm font-semibold text-white transition hover:bg-[#243246] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => void confirmDecision()}
          >
            {isSubmitting ? labels.loading : labels.confirmDecision}
          </button>
        </div>
      </div>
    );
  }

  function renderFeedback() {
    if (!currentChallenge || !selectedChoice) {
      return null;
    }

    const feedback = selectedChoice.feedback;

    return (
      <div className="absolute inset-0 flex items-end justify-end bg-[#17243a]/45 p-3 sm:p-5 lg:p-8">
        <div className="max-h-[92%] w-full overflow-y-auto rounded-3xl border border-white/40 bg-white/97 p-5 shadow-[0_24px_70px_rgba(23,36,58,0.3)] backdrop-blur-md sm:max-w-2xl sm:p-7">
          <div
            className={[
              "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
              selectedChoice.isOptimal
                ? "bg-[#ecf8f4] text-[#087658]"
                : "bg-[#fff5ed] text-[#c95417]",
            ].join(" ")}
          >
            {selectedChoice.isOptimal ? labels.completed : labels.tryAgain}
          </div>

          <h2 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[#31425a] sm:text-2xl">
            {feedback.title ?? currentChallenge.title}
          </h2>

          <MarkdownContent className="mt-4">{feedback.body}</MarkdownContent>

          {feedback.consequence ? (
            <div className="mt-5 rounded-2xlrder border-[#dfe5ec] bg-[#f8fafc] p-4">
              <h3 className="text-sm font-semibold text-[#31425a]">Consequence</h3>

              <MarkdownContent className="mt-2">{feedback.consequence}</MarkdownContent>
            </div>
          ) : null}

          {feedback.takeaway ? (
            <div className="mt-4 rounded-2xl border border-[#0d7fc2]/15 bg-[#eef7fd] p-4">
              <h3 className="text-sm font-semibold text-[#0d6fa7]">Key takeaway</h3>

              <MarkdownContent className="mt-2">{feedback.takeaway}</MarkdownContent>
            </div>
          ) : null}

          {errorMessage ? (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-[#f1c9c9] bg-[#fff6f6] px-4 py-3 text-sm leading-6 text-[#9f3c3c]"
            >
              {errorMessage}
            </div>
          ) : null}

          <button
            type="button"
            disabled={isSubmitting}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#31425a] px-6 text-sm font-semibold text-white transition hover:bg-[#243246] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => void continueAfterFeedback()}
          >
            {isSubmitting
              ? labels.loading
              : selectedChoice.isOptimal
                ? labels.continue
                : labels.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  function renderSummary() {
    return (
      <div className="absolute inset-0 flex items-end justify-center bg-[#17243a]/45 p-3 sm:p-5 lg:p-8">
        <div className="max-h-[92%] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/40 bg-white/97 p-5 shadow-[0_24px_70px_rgba(23,36,58,0.3)] backdrop-blur-md sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0b9c72]">
            {completedCount} / {totalChallenges} {labels.completed}
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#31425a]">
            {scenario.summary.title}
          </h2>

          {scenario.summary.body ? (
            <MarkdownContent className="mt-4">{scenario.summary.body}</MarkdownContent>
          ) : null}

          <ul className="mt-6 space-y-3">
            {scenario.summary.takeaways.map((takeaway) => (
              <li
                key={takeaway}
                className="flex gap-3 rounded-2xl border border-[#dfe5ec] bg-[#f8fafc] p-4 text-sm leading-6 text-[#596170]"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0b9c72] text-xs font-bold text-white"
                >
                  ✓
                </span>

                <span>{takeaway}</span>
              </li>
            ))}
          </ul>

          {errorMessage ? (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-[#f1c9c9] bg-[#fff6f6] px-4 py-3 text-sm leading-6 text-[#9f3c3c]"
            >
              {errorMessage}
            </div>
          ) : null}

          <button
            type="button"
            disabled={isSubmitting}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#0b9c72] px-6 text-sm font-semibold text-white transition hover:bg-[#087658] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => void completeScenario()}
          >
            {isSubmitting ? labels.loading : labels.completeScenario}
          </button>
        </div>
      </div>
    );
  }

  function renderCompletion() {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#17243a]/50 p-4">
        <div className="w-full max-w-xl rounded-[1.75rem] border border-white/40 bg-white/97 p-7 text-center shadow-[0_24px_70px_rgba(23,36,58,0.32)] backdrop-blur-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0b9c72] text-2xl font-bold text-white">
            ✓
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[#31425a]">
            {labels.scenarioCompleted}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#596170]">
            {labels.scenarioCompletedDescription}
          </p>

          {onExit ? (
            <button
              type="button"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#31425a] px-6 text-sm font-semibold text-white transition hover:bg-[#243246]"
              onClick={onExit}
            >
              {labels.leaveScenario}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <section
      data-testid="scenario-player"
      data-scenario-player
      data-scenario-id={scenario.id}
      data-view={view}
      data-mode={mode}
      data-background-image={backgroundImage}
      className="overflow-hidden rounded-[1.75rem] border border-[#dfe5ec] bg-white shadow-[0_18px_50px_rgba(49,66,90,0.1)]"
    >
      <header className="flex flex-col gap-4 border-b border-[#e7ebf0] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0d7fc2]">
            Scenario {scenario.order}
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#31425a] sm:text-2xl">
            {scenario.title}
          </h1>
        </div>

        <div className="min-w-48">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-medium text-[#667180]">{labels.progress}</span>

            <span className="font-semibold text-[#31425a]">
              {completedCount} / {totalChallenges}
            </span>
          </div>

          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-[#e7ebf0]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalChallenges}
            aria-valuenow={completedCount}
            aria-label={`${labels.progress}: ${completedCount} / ${totalChallenges}`}
          >
            <div
              className="h-full rounded-full bg-[#0b9c72] transition-[width] duration-300"
              style={{
                width: totalChallenges > 0 ? `${(completedCount / totalChallenges) * 100}%` : "0%",
              }}
            />
          </div>
        </div>
      </header>

      {view === "board" ? (
        <ScenarioBoard
          backgroundImage={scenario.assets.preStartBackground}
          boardAlt={scenario.boardAlt}
          scenarioTitle={scenario.title}
          items={orderedChallenges.map((challenge, challengeIndex) => ({
            challenge,
            status: getChallengeStatus(challenge, challengeIndex),
          }))}
          labels={{
            title: labels.viewChallenges,

            currentObjective: labels.currentObjective,

            completed: labels.completed,

            available: labels.available,

            inProgress: labels.inProgress,

            locked: labels.locked,
          }}
          onSelectChallenge={openChallenge}
        />
      ) : (
        <div className="relative min-h-170 overflow-hidden bg-[#eef2f6] sm:min-h-155 lg:aspect-video lg:min-h-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1400px"
            className="object-cover"
          />

          <p className="sr-only">{scenario.boardAlt}</p>

          {view === "intro" ? (
            <ScenarioIntro
              scenario={scenario}
              isStarting={isSubmitting}
              errorMessage={errorMessage}
              labels={{
                startScenario: labels.startScenario,

                backToScenarios: labels.leaveScenario,

                starting: labels.loading,
              }}
              onStart={() => void startScenario()}
              onExit={onExit}
            />
          ) : null}

          {view === "challenge" ? renderChallenge() : null}

          {view === "feedback" ? renderFeedback() : null}

          {view === "summary" ? renderSummary() : null}

          {view === "completion" ? renderCompletion() : null}
        </div>
      )}
    </section>
  );
}
