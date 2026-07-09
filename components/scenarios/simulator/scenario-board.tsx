"use client";

import { Check, LockKeyhole, Play } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { ScenarioHotspot } from "@/components/scenarios/simulator/scenario-hotspot";
import type { ChallengeProgressStatus, ResolvedChallenge } from "@/lib/scenarios/simulator/types";

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

function getCardClasses(status: ChallengeProgressStatus): string {
  switch (status) {
    case "completed":
      return ["border-[#0b9c72]/25", "bg-[#ecf8f4]", "text-[#087658]"].join(" ");

    case "in_progress":
      return [
        "border-[#0d7fc2]/30",
        "bg-[#eef7fd]",
        "text-[#0d6fa7]",
        "shadow-[0_10px_28px_rgba(13,127,194,0.14)]",
      ].join(" ");

    case "available":
      return ["border-[#ef6c23]/30", "bg-[#fff5ed]", "text-[#c95417]"].join(" ");

    case "locked":
      return ["border-[#d9e1ea]", "bg-[#f4f6f8]", "text-[#7a8594]"].join(" ");
  }
}

function getStatusIcon(status: ChallengeProgressStatus, order: number): ReactNode {
  switch (status) {
    case "completed":
      return <Check aria-hidden="true" size={22} strokeWidth={3} />;

    case "in_progress":
      return <Play aria-hidden="true" size={20} fill="currentColor" />;

    case "locked":
      return <LockKeyhole aria-hidden="true" size={19} />;

    case "available":
      return order;
  }
}

export function ScenarioBoard({
  backgroundImage,
  boardAlt,
  scenarioTitle,
  items,
  labels: customLabels,
  onSelectChallenge,
}: ScenarioBoardProps) {
  const labels = {
    ...DEFAULT_SCENARIO_BOARD_LABELS,
    ...customLabels,
  };

  const currentObjective =
    items.find(({ status }) => status === "in_progress") ??
    items.find(({ status }) => status === "available") ??
    null;

  const allCompleted = items.length > 0 && items.every(({ status }) => status === "completed");

  return (
    <section
      data-testid="scenario-board"
      data-background-image={backgroundImage}
      aria-label={labels.title}
    >
      <div className="relative aspect-video min-h-90 overflow-hidden bg-[#eef2f6] sm:min-h-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1400px"
          className="object-cover"
        />

        <p className="sr-only">{boardAlt}</p>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#17243a]/35 via-transparent to-[#17243a]/10"
        />

        <div className="absolute left-4 top-4 z-10 max-w-sm rounded-2xl border border-white/40 bg-white/92 px-4 py-3 shadow-[0_12px_32px_rgba(23,36,58,0.18)] backdrop-blur-md sm:left-6 sm:top-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0d7fc2]">
            {labels.title}
          </p>

          <h2 className="mt-1 text-base font-semibold leading-6 text-[#31425a] sm:text-lg">
            {scenarioTitle}
          </h2>

          <p className="mt-1 hidden text-xs leading-5 text-[#667180] sm:block">
            {labels.description}
          </p>
        </div>

        {items.map(({ challenge, status }, challengeIndex) => (
          <ScenarioHotspot
            key={challenge.id}
            challenge={challenge}
            status={status}
            isCurrentObjective={
              currentObjective?.challenge.id === challenge.id && status !== "completed"
            }
            labels={{
              mapPoint: labels.mapPoint,
              completed: labels.completed,
              available: labels.available,
              inProgress: labels.inProgress,
              locked: labels.locked,
            }}
            onSelect={() => {
              onSelectChallenge(challenge, challengeIndex);
            }}
          />
        ))}

        <div className="absolute bottom-4 left-4 right-4 z-10 hidden justify-end md:flex">
          <div className="rounded-full border border-white/35 bg-[#17243a]/80 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md">
            {allCompleted
              ? labels.allCompleted
              : currentObjective
                ? `${labels.currentObjective}: ${currentObjective.challenge.shortTitle}`
                : labels.description}
          </div>
        </div>
      </div>

      <div className="border-t border-[#e7ebf0] bg-white p-4 sm:p-6">
        <div className="mb-4 md:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0d7fc2]">
            {labels.title}
          </p>

          <p className="mt-1 text-sm leading-6 text-[#667180]">
            {allCompleted
              ? labels.allCompleted
              : currentObjective
                ? `${labels.currentObjective}: ${currentObjective.challenge.shortTitle}`
                : labels.description}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {items.map(({ challenge, status }, challengeIndex) => {
            const isLocked = status === "locked";

            const statusLabel = getStatusLabel(status, labels);

            return (
              <button
                key={challenge.id}
                type="button"
                data-testid={`scenario-board-card-${challenge.id}`}
                disabled={isLocked}
                aria-label={`${labels.openChallenge}: ${challenge.shortTitle}. ${statusLabel}.`}
                className={[
                  "flex min-h-24 items-center gap-4 rounded-[1.15rem] border p-4 text-left transition",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0d7fc2]/25",
                  getCardClasses(status),
                  isLocked
                    ? "cursor-not-allowed opacity-90"
                    : "hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
                ].join(" ")}
                onClick={() => {
                  onSelectChallenge(challenge, challengeIndex);
                }}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-current/20 bg-white/75 text-sm font-bold">
                  {getStatusIcon(status, challenge.order)}
                </span>

                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-5">
                    {challenge.shortTitle}
                  </span>

                  <span className="mt-1 block text-xs font-medium uppercase tracking-[0.08em] opacity-75">
                    {statusLabel}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
