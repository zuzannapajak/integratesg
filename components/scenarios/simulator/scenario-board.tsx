"use client";

import Image from "next/image";
import { useState } from "react";

import { ScenarioHotspot } from "@/components/scenarios/simulator/scenario-hotspot";
import type { ChallengeProgressStatus, ResolvedChallenge } from "@/lib/scenarios/simulator/types";
import { Check } from "lucide-react";

export type ScenarioBoardItem = {
  readonly challenge: ResolvedChallenge;
  readonly status: ChallengeProgressStatus;
};

export type ScenarioBoardLabels = {
  readonly title: string;
  readonly description: string;
  readonly currentObjective: string;
  readonly allCompleted: string;
  readonly openChallenge: string;
  readonly mapPoint: string;
  readonly completed: string;
  readonly available: string;
  readonly inProgress: string;
  readonly locked: string;
};

export const DEFAULT_SCENARIO_BOARD_LABELS: ScenarioBoardLabels = {
  title: "Choose a challenge",
  description: "Complete the three challenges in order.",
  currentObjective: "Current objective",
  allCompleted: "All challenges completed",
  openChallenge: "Open challenge",
  mapPoint: "Challenge point",
  completed: "Completed",
  available: "Available",
  inProgress: "In progress",
  locked: "Locked",
};

export type ScenarioBoardProps = {
  readonly backgroundImage: string;
  readonly boardAlt: string;
  readonly scenarioTitle: string;
  readonly items: readonly ScenarioBoardItem[];
  readonly labels?: Partial<ScenarioBoardLabels>;

  readonly onSelectChallenge: (challenge: ResolvedChallenge, challengeIndex: number) => void;
};

function getStatusLabel(status: ChallengeProgressStatus, labels: ScenarioBoardLabels): string {
  switch (status) {
    case "completed":
      return labels.completed;

    case "available":
      return labels.available;

    case "in_progress":
      return labels.inProgress;

    case "locked":
      return labels.locked;
  }
}

function isChallengeOpenable(status: ChallengeProgressStatus): boolean {
  return status === "available" || status === "in_progress";
}

function getCardClasses(status: ChallengeProgressStatus, isCurrentObjective: boolean): string {
  if (status === "completed") {
    return [
      "border-[#0b9c72]/30",
      "bg-white/97",
      "text-[#31425a]",
      "shadow-[0_16px_40px_rgba(23,36,58,0.16)]",
    ].join(" ");
  }

  if (isCurrentObjective || status === "in_progress") {
    return [
      "border-[#0d6fe8]/40",
      "bg-white/98",
      "text-[#31425a]",
      "shadow-[0_18px_44px_rgba(13,111,232,0.22)]",
    ].join(" ");
  }

  if (status === "available") {
    return [
      "border-[#d8e0ea]",
      "bg-white/97",
      "text-[#31425a]",
      "shadow-[0_16px_40px_rgba(23,36,58,0.16)]",
    ].join(" ");
  }

  return [
    "border-[#dfe5ec]",
    "bg-white/95",
    "text-[#7a8594]",
    "shadow-[0_14px_36px_rgba(23,36,58,0.14)]",
  ].join(" ");
}

function getNumberClasses(status: ChallengeProgressStatus, isCurrentObjective: boolean): string {
  if (status === "completed") {
    return "border-[#0b9c72] bg-[#0b9c72] text-white";
  }

  if (isCurrentObjective || status === "in_progress") {
    return "border-[#0d6fe8] bg-[#0d6fe8] text-white";
  }

  if (status === "locked") {
    return "border-[#8b949e] bg-[#7e8792] text-white";
  }

  return "border-[#d3dbe5] bg-[#eef2f6] text-[#596170]";
}

export function ScenarioBoard({
  backgroundImage,
  boardAlt,
  scenarioTitle,
  items,
  labels: customLabels,
  onSelectChallenge,
}: ScenarioBoardProps) {
  const [previewedChallengeIndex, setPreviewedChallengeIndex] = useState<number | null>(null);

  const labels = {
    ...DEFAULT_SCENARIO_BOARD_LABELS,
    ...customLabels,
  };

  const inProgressIndex = items.findIndex(({ status }) => status === "in_progress");

  const firstAvailableIndex = items.findIndex(({ status }) => status === "available");

  const effectiveCurrentObjectiveIndex =
    inProgressIndex >= 0 ? inProgressIndex : firstAvailableIndex;

  const mobileChallengeIndex =
    effectiveCurrentObjectiveIndex >= 0
      ? effectiveCurrentObjectiveIndex
      : items.findIndex(({ status }) => status === "completed");

  function openChallenge(
    challenge: ResolvedChallenge,
    challengeIndex: number,
    status: ChallengeProgressStatus,
  ) {
    if (!isChallengeOpenable(status)) {
      return;
    }

    onSelectChallenge(challenge, challengeIndex);
  }

  function renderChallengeCard(item: ScenarioBoardItem, challengeIndex: number, mobile = false) {
    const { challenge, status } = item;

    const isOpenable = isChallengeOpenable(status);

    const isCurrentObjective =
      effectiveCurrentObjectiveIndex === challengeIndex && status !== "completed";

    const statusLabel = getStatusLabel(status, labels);

    return (
      <button
        type="button"
        data-testid={`scenario-board-card-${challenge.id}`}
        data-challenge-status={status}
        data-completed={status === "completed"}
        disabled={!isOpenable}
        aria-current={isCurrentObjective ? "step" : undefined}
        className={[
          "flex w-full items-start gap-3 rounded-[1.15rem] border px-4 py-3 text-left backdrop-blur-md transition",
          mobile ? "min-h-18" : "min-h-20",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0d6fe8]/25",
          getCardClasses(status, isCurrentObjective),
          isOpenable
            ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            : "cursor-default",
        ].join(" ")}
        onFocus={() => {
          setPreviewedChallengeIndex(challengeIndex);
        }}
        onClick={() => {
          openChallenge(challenge, challengeIndex, status);
        }}
      >
        <span
          aria-hidden="true"
          className={[
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
            getNumberClasses(status, isCurrentObjective),
          ].join(" ")}
        >
          {status === "completed" ? (
            <Check
              data-testid={`scenario-board-completed-icon-${challenge.id}`}
              size={15}
              strokeWidth={3}
            />
          ) : (
            challenge.order
          )}
        </span>

        <span className="min-w-0">
          <span className="block text-sm font-semibold leading-5">{challenge.shortTitle}</span>

          <span
            className={[
              "mt-1 block text-xs leading-5",
              isCurrentObjective
                ? "font-medium text-[#0d6fe8]"
                : status === "completed"
                  ? "font-medium text-[#087658]"
                  : "text-[#7a8594]",
            ].join(" ")}
          >
            {statusLabel}
          </span>
        </span>
      </button>
    );
  }

  return (
    <section
      data-testid="scenario-board"
      data-background-image={backgroundImage}
      aria-label={labels.title}
      className="h-full min-h-0 bg-[#eef2f6]"
    >
      <div className="relative h-full min-h-0 overflow-hidden">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1400px"
          className="object-cover"
        />

        <p className="sr-only">{boardAlt}</p>
        <h2 className="sr-only">{scenarioTitle}</h2>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#17243a]/18 via-transparent to-white/5"
        />

        {/*
         * Niewidoczne strefy podglądu.
         * Każdy challenge zajmuje równą część szerokości planszy.
         * Najechanie pokazuje kartę, ale nie otwiera challenge'u.
         */}
        <div
          className="absolute inset-0 z-10 hidden md:grid"
          style={{
            gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))`,
          }}
          onMouseLeave={() => {
            setPreviewedChallengeIndex(null);
          }}
        >
          {items.map((item, challengeIndex) => {
            const isPreviewed = previewedChallengeIndex === challengeIndex;

            const zoneWidth = 100 / Math.max(items.length, 1);
            const zoneStart = challengeIndex * zoneWidth;

            const cardPositionInZone = ((item.challenge.hotspot.x - zoneStart) / zoneWidth) * 100;

            return (
              <div
                key={item.challenge.id}
                data-testid={`scenario-board-preview-zone-${item.challenge.id}`}
                className="relative min-w-0"
                onMouseEnter={() => {
                  setPreviewedChallengeIndex(challengeIndex);
                }}
              >
                <div
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute inset-0 transition-colors duration-200",
                    isPreviewed ? "bg-white/2.5" : "bg-transparent",
                  ].join(" ")}
                />

                <div
                  className={[
                    "pointer-events-none absolute bottom-10 z-30 w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 transition-all duration-200 ease-out",
                    isPreviewed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                  ].join(" ")}
                  style={{
                    left: `${cardPositionInZone}%`,
                  }}
                >
                  <div className="pointer-events-auto w-full">
                    {renderChallengeCard(item, challengeIndex)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {items.map(({ challenge, status }, challengeIndex) => (
          <ScenarioHotspot
            key={challenge.id}
            challenge={challenge}
            status={status}
            isCurrentObjective={
              effectiveCurrentObjectiveIndex === challengeIndex && status !== "completed"
            }
            labels={{
              mapPoint: labels.mapPoint,
              completed: labels.completed,
              available: labels.available,
              inProgress: labels.inProgress,
              locked: labels.locked,
            }}
            onPreviewChange={(isPreviewed) => {
              setPreviewedChallengeIndex(isPreviewed ? challengeIndex : null);
            }}
            onSelect={() => {
              openChallenge(challenge, challengeIndex, status);
            }}
          />
        ))}

        {/*
         * Na urządzeniach dotykowych nie ma hovera.
         * Pokazujemy więc wyłącznie kartę aktualnego challenge'u.
         */}
        {mobileChallengeIndex >= 0 && items[mobileChallengeIndex] ? (
          <div className="absolute inset-x-4 bottom-4 z-30 md:hidden">
            {renderChallengeCard(items[mobileChallengeIndex], mobileChallengeIndex, true)}
          </div>
        ) : null}
      </div>
    </section>
  );
}
