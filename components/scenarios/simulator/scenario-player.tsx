"use client";

import { ScenarioProgress } from "@/components/scenarios/common/scenario-progress";
import {
  ScenarioScreenTransition,
  ScenarioTransitionDirection,
} from "@/components/scenarios/common/scenario-screen-transition";
import { ScenarioBoard } from "@/components/scenarios/simulator/scenario-board";
import type { ScenarioChallengeStep } from "@/components/scenarios/simulator/scenario-challenge";
import { ScenarioChallenge } from "@/components/scenarios/simulator/scenario-challenge";
import { ScenarioCorrectFeedback } from "@/components/scenarios/simulator/scenario-correct-feedback";
import { ScenarioIncorrectFeedback } from "@/components/scenarios/simulator/scenario-incorrect-feedback";
import { ScenarioIntro } from "@/components/scenarios/simulator/scenario-intro";
import { ScenarioSummary } from "@/components/scenarios/simulator/scenario-summary";
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
import { AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

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
  readonly openChallenge: string;
  readonly backToBoard: string;

  readonly challengeContext: string;
  readonly decision: string;
  readonly attempt: string;
  readonly previouslyTried: string;
  readonly continueToDecision: string;
  readonly back: string;
  readonly selectOneOption: string;

  readonly correctDecision: string;
  readonly incorrectDecision: string;
  readonly yourDecision: string;
  readonly whyItFallsShort: string;
  readonly expectedImpact: string;
  readonly likelyConsequence: string;
  readonly keyTakeaway: string;

  readonly summary: string;
  readonly allChallengesCompleted: string;
  readonly completedChallenges: string;
  readonly keyTakeaways: string;

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
  openChallenge: "Open challenge",
  backToBoard: "Back to challenges",

  challengeContext: "Challenge context",
  decision: "Decision",
  attempt: "Attempt",
  previouslyTried: "Previously tried",
  continueToDecision: "Continue to decision",
  back: "Back",
  selectOneOption: "Select one option",

  correctDecision: "Correct decision",
  incorrectDecision: "Try another approach",
  yourDecision: "Your decision",
  whyItFallsShort: "Why this approach falls short",
  expectedImpact: "Expected impact",
  likelyConsequence: "Likely consequence",
  keyTakeaway: "Key takeaway",

  summary: "Scenario summary",
  allChallengesCompleted: "All challenges completed",
  completedChallenges: "Challenges completed",
  keyTakeaways: "Key takeaways",

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
  readonly initialChallengeStep?: ScenarioChallengeStep;
  readonly initialSelectedChoiceId?: ChoiceId | null;
  readonly initialCompletedChallengeIds?: readonly ChallengeId[];
  readonly initialAttemptCounts?: Readonly<Partial<Record<ChallengeId, number>>>;
  readonly initialRejectedChoiceIdsByChallenge?: Readonly<
    Partial<Record<ChallengeId, readonly ChoiceId[]>>
  >;
  readonly labels?: Partial<ScenarioPlayerLabels>;
  readonly onScenarioStarted?: (event: ScenarioStartedEvent) => void | Promise<void>;
  readonly onChoiceConfirmed?: (event: ScenarioChoiceConfirmedEvent) => void | Promise<void>;
  readonly onChallengeCompleted?: (event: ScenarioChallengeCompletedEvent) => void | Promise<void>;
  readonly onScenarioCompleted?: (event: ScenarioCompletedEvent) => void | Promise<void>;
  readonly onExit?: () => void;
};

type ChallengeAttemptCountMap = Partial<Record<ChallengeId, number>>;
type ChallengeRejectedChoiceMap = Partial<Record<ChallengeId, readonly ChoiceId[]>>;

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
  initialChallengeStep = "context",
  initialSelectedChoiceId = null,
  initialCompletedChallengeIds = [],
  initialAttemptCounts = {},
  initialRejectedChoiceIdsByChallenge = {},
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

  const validInitialChallenge = initialChallengeId
    ? (orderedChallenges.find((challenge) => challenge.id === initialChallengeId) ?? null)
    : null;

  const validInitialSelectedChoiceId =
    validInitialChallenge &&
    initialSelectedChoiceId &&
    validInitialChallenge.choices.some((choice) => choice.id === initialSelectedChoiceId)
      ? initialSelectedChoiceId
      : null;

  const [completedChallengeIds, setCompletedChallengeIds] = useState<Set<ChallengeId>>(
    () =>
      new Set(
        initialCompletedChallengeIds.filter((challengeId) => validChallengeIds.has(challengeId)),
      ),
  );

  const [view, setView] = useState<ScenarioPlayerView>(initialView);

  const [transitionDirection, setTransitionDirection] =
    useState<ScenarioTransitionDirection>("neutral");

  const [currentChallengeId, setCurrentChallengeId] = useState<ChallengeId | null>(
    validInitialChallenge?.id ?? null,
  );

  const [selectedChoiceId, setSelectedChoiceId] = useState<ChoiceId | null>(
    validInitialSelectedChoiceId,
  );

  const [challengeInitialStep, setChallengeInitialStep] =
    useState<ScenarioChallengeStep>(initialChallengeStep);

  const [attemptCounts, setAttemptCounts] = useState<ChallengeAttemptCountMap>(() => ({
    ...initialAttemptCounts,
  }));

  const [rejectedChoiceIdsByChallenge, setRejectedChoiceIdsByChallenge] =
    useState<ChallengeRejectedChoiceMap>(() => ({
      ...initialRejectedChoiceIdsByChallenge,
    }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentChallenge =
    orderedChallenges.find((challenge) => challenge.id === currentChallengeId) ?? null;

  const selectedChoice =
    currentChallenge?.choices.find((choice) => choice.id === selectedChoiceId) ?? null;

  const currentAttemptNumber = currentChallenge ? (attemptCounts[currentChallenge.id] ?? 0) + 1 : 1;

  const currentRejectedChoiceIds = currentChallenge
    ? (rejectedChoiceIdsByChallenge[currentChallenge.id] ?? [])
    : [];

  const usesPreStartBackground = view === "intro" || view === "board";

  const backgroundImage = usesPreStartBackground
    ? scenario.assets.preStartBackground
    : scenario.assets.inProgressBackground;

  const completedCount = completedChallengeIds.size;

  const totalChallenges = orderedChallenges.length;

  const activeScreenKey =
    view === "challenge" || view === "feedback" ? `${view}:${currentChallengeId ?? "none"}` : view;

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

  function navigateToView(nextView: ScenarioPlayerView, direction: ScenarioTransitionDirection) {
    setTransitionDirection(direction);
    setView(nextView);
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
      setChallengeInitialStep("context");
      navigateToView("board", "forward");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function openChallenge(challenge: ResolvedChallenge, challengeIndex: number) {
    const status = getChallengeStatus(challenge, challengeIndex);

    if (status === "locked" || status === "completed") {
      return;
    }

    setErrorMessage(null);
    setCurrentChallengeId(challenge.id);
    setSelectedChoiceId(null);
    setChallengeInitialStep("context");
    navigateToView("challenge", "forward");
  }

  function returnToBoard() {
    setErrorMessage(null);
    setSelectedChoiceId(null);
    setCurrentChallengeId(null);
    setChallengeInitialStep("context");
    navigateToView("board", "backward");
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

      if (!selectedChoice.isOptimal) {
        setRejectedChoiceIdsByChallenge((currentChoices) => {
          const rejectedChoiceIds = currentChoices[currentChallenge.id] ?? [];

          if (rejectedChoiceIds.includes(selectedChoice.id)) {
            return currentChoices;
          }

          return {
            ...currentChoices,
            [currentChallenge.id]: [...rejectedChoiceIds, selectedChoice.id],
          };
        });
      }

      navigateToView("feedback", "forward");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function tryAgain() {
    if (isSubmitting || !currentChallenge || !selectedChoice || selectedChoice.isOptimal) {
      return;
    }

    setErrorMessage(null);

    /*
     * Previous selection is cleared, but the submitted
     * incorrect choice remains recorded as previously tried.
     */
    setSelectedChoiceId(null);

    /*
     * The context has already been reviewed. Retry starts
     * directly from the decision step.
     */
    setChallengeInitialStep("decision");
    navigateToView("challenge", "forward");
  }

  async function continueAfterFeedback() {
    if (!currentChallenge || !selectedChoice || isSubmitting) {
      return;
    }

    /*
     * An incorrect response must never complete
     * the current challenge.
     */
    if (!selectedChoice.isOptimal) {
      tryAgain();
      return;
    }

    const wasAlreadyCompleted = completedChallengeIds.has(currentChallenge.id);

    const nextCompletedChallengeIds = new Set(completedChallengeIds);

    nextCompletedChallengeIds.add(currentChallenge.id);

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      /*
       * The completion event is sent only once.
       */
      if (mode === "play" && !wasAlreadyCompleted) {
        await onChallengeCompleted?.({
          scenarioId: scenario.id,
          scenarioVersion: scenario.version,
          challengeId: currentChallenge.id,
        });
      }

      /*
       * Local state is changed only after the
       * completion callback succeeds.
       */
      setCompletedChallengeIds(nextCompletedChallengeIds);

      /*
       * Retry hints are no longer needed after
       * completing this challenge.
       */
      setRejectedChoiceIdsByChallenge((currentChoices) => {
        const nextChoices = {
          ...currentChoices,
        };

        Reflect.deleteProperty(nextChoices, currentChallenge.id);

        return nextChoices;
      });

      setSelectedChoiceId(null);
      setCurrentChallengeId(null);
      setChallengeInitialStep("context");

      if (nextCompletedChallengeIds.size >= totalChallenges) {
        navigateToView("summary", "forward");
      } else {
        navigateToView("board", "forward");
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

      navigateToView("completion", "forward");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderFeedback() {
    if (!currentChallenge || !selectedChoice) {
      return null;
    }

    if (selectedChoice.isOptimal) {
      return (
        <ScenarioCorrectFeedback
          challenge={currentChallenge}
          choice={selectedChoice}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          labels={{
            correctDecision: labels.correctDecision,
            yourDecision: labels.yourDecision,
            expectedImpact: labels.expectedImpact,
            keyTakeaway: labels.keyTakeaway,
            continue: labels.continue,
            loading: labels.loading,
          }}
          onContinue={continueAfterFeedback}
        />
      );
    }

    return (
      <ScenarioIncorrectFeedback
        challenge={currentChallenge}
        choice={selectedChoice}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        labels={{
          incorrectDecision: labels.incorrectDecision,
          yourDecision: labels.yourDecision,
          whyItFallsShort: labels.whyItFallsShort,
          likelyConsequence: labels.likelyConsequence,
          keyTakeaway: labels.keyTakeaway,
          tryAgain: labels.tryAgain,
          loading: labels.loading,
        }}
        onTryAgain={tryAgain}
      />
    );
  }

  function renderCompletion() {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#17243a]/50 p-4">
        <div className="max-h-full w-full max-w-xl overflow-y-auto rounded-[1.75rem] border border-white/40 bg-white/97 p-7 text-center shadow-[0_24px_70px_rgba(23,36,58,0.32)] backdrop-blur-md">
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
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#0d6fe8] px-6 text-sm font-semibold text-white transition hover:bg-[#095fc8]"
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
      data-completed-count={completedCount}
      data-total-challenges={totalChallenges}
      className="flex min-h-0 flex-col overflow-hidden rounded-[1.65rem] border border-[#dfe5ec] bg-white shadow-[0_18px_50px_rgba(49,66,90,0.11)]"
      style={{
        height: "calc(100dvh - var(--app-topbar-height, 64px) - var(--scenario-player-gap, 16px))",
      }}
    >
      <header className="flex shrink-0 items-center justify-between gap-5 border-b border-[#e7ebf0] px-4 py-3.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3.5">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef5ff] text-[#0d6fe8] sm:h-12 sm:w-12"
          >
            <Leaf size={23} strokeWidth={2} />
          </span>

          <div className="min-w-0">
            <p className="text-lg font-semibold tracking-[-0.03em] text-[#17243a] sm:text-2xl">
              Scenario {scenario.order}
            </p>

            <h1 className="mt-0.5 truncate text-sm font-medium text-[#596170] sm:text-base">
              {scenario.title}
            </h1>
          </div>
        </div>

        <ScenarioProgress
          completedCount={completedCount}
          totalCount={totalChallenges}
          labels={{
            progress: labels.progress,
            completed: labels.completed,
          }}
        />
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#eef2f6]">
        <AnimatePresence initial={false} mode="wait">
          <ScenarioScreenTransition
            key={activeScreenKey}
            direction={transitionDirection}
            testId="scenario-view-transition"
            className="absolute inset-0 overflow-hidden"
          >
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

                  openChallenge: labels.openChallenge,

                  completed: labels.completed,

                  available: labels.available,

                  inProgress: labels.inProgress,

                  locked: labels.locked,
                }}
                onSelectChallenge={openChallenge}
              />
            ) : (
              <>
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

                {view === "challenge" && currentChallenge ? (
                  <ScenarioChallenge
                    challenge={currentChallenge}
                    selectedChoiceId={selectedChoiceId}
                    initialStep={challengeInitialStep}
                    attemptNumber={currentAttemptNumber}
                    previouslyTriedChoiceIds={currentRejectedChoiceIds}
                    isSubmitting={isSubmitting}
                    errorMessage={errorMessage}
                    labels={{
                      context: labels.challengeContext,

                      decision: labels.decision,

                      attempt: labels.attempt,

                      previouslyTried: labels.previouslyTried,

                      backToBoard: labels.backToBoard,

                      continueToDecision: labels.continueToDecision,

                      back: labels.back,

                      selectOneOption: labels.selectOneOption,

                      confirmDecision: labels.confirmDecision,

                      loading: labels.loading,
                    }}
                    onSelectChoice={setSelectedChoiceId}
                    onConfirm={() => void confirmDecision()}
                    onBackToBoard={returnToBoard}
                  />
                ) : null}

                {view === "feedback" ? renderFeedback() : null}

                {view === "summary" ? (
                  <ScenarioSummary
                    scenarioTitle={scenario.title}
                    summary={scenario.summary}
                    completedCount={completedCount}
                    totalCount={totalChallenges}
                    isSubmitting={isSubmitting}
                    errorMessage={errorMessage}
                    labels={{
                      summary: labels.summary,

                      allChallengesCompleted: labels.allChallengesCompleted,

                      completedChallenges: labels.completedChallenges,

                      keyTakeaways: labels.keyTakeaways,

                      completeScenario: labels.completeScenario,

                      loading: labels.loading,
                    }}
                    onComplete={completeScenario}
                  />
                ) : null}

                {view === "completion" ? renderCompletion() : null}
              </>
            )}
          </ScenarioScreenTransition>
        </AnimatePresence>
      </div>
    </section>
  );
}
