"use client";

import { Check, LockKeyhole, Play } from "lucide-react";
import type { ReactNode } from "react";

import type { ChallengeProgressStatus, ResolvedChallenge } from "@/lib/scenarios/simulator/types";

export type ScenarioHotspotVisualState = "active" | "available" | "completed" | "locked";

export type ScenarioHotspotLabels = {
  readonly mapPoint: string;
  readonly completed: string;
  readonly available: string;
  readonly inProgress: string;
  readonly locked: string;
};

export const DEFAULT_SCENARIO_HOTSPOT_LABELS: ScenarioHotspotLabels = {
  mapPoint: "Challenge point",
  completed: "Completed",
  available: "Available",
  inProgress: "In progress",
  locked: "Locked",
};

export type ScenarioHotspotProps = {
  readonly challenge: ResolvedChallenge;

  readonly status: ChallengeProgressStatus;

  /**
   * Marks the challenge that should currently receive
   * the learner's attention.
   */
  readonly isCurrentObjective?: boolean;

  readonly labels?: Partial<ScenarioHotspotLabels>;

  readonly onSelect: () => void;
};

function getStatusLabel(status: ChallengeProgressStatus, labels: ScenarioHotspotLabels): string {
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

function getVisualState(
  status: ChallengeProgressStatus,
  isCurrentObjective: boolean,
): ScenarioHotspotVisualState {
  if (status === "completed") {
    return "completed";
  }

  if (status === "locked") {
    return "locked";
  }

  if (status === "in_progress" || isCurrentObjective) {
    return "active";
  }

  return "available";
}

function getButtonClasses(
  status: ChallengeProgressStatus,
  visualState: ScenarioHotspotVisualState,
): string {
  if (visualState === "completed") {
    return [
      "border-[#0b9c72]",
      "bg-[#0b9c72]",
      "text-white",
      "shadow-[0_12px_34px_rgba(11,156,114,0.34)]",
    ].join(" ");
  }

  if (visualState === "locked") {
    return [
      "border-[#aeb8c5]",
      "bg-[#e9edf1]",
      "text-[#778391]",
      "shadow-[0_8px_22px_rgba(49,66,90,0.18)]",
    ].join(" ");
  }

  if (visualState === "active" && status === "in_progress") {
    return [
      "border-[#0d7fc2]",
      "bg-[#0d7fc2]",
      "text-white",
      "shadow-[0_14px_38px_rgba(13,127,194,0.38)]",
      "ring-4",
      "ring-[#0d7fc2]/25",
    ].join(" ");
  }

  if (visualState === "active") {
    return [
      "border-[#ef6c23]",
      "bg-[#ef6c23]",
      "text-white",
      "shadow-[0_14px_38px_rgba(239,108,35,0.36)]",
      "ring-4",
      "ring-[#ef6c23]/25",
    ].join(" ");
  }

  return [
    "border-[#0d7fc2]",
    "bg-white",
    "text-[#0d6fa7]",
    "shadow-[0_10px_28px_rgba(13,127,194,0.24)]",
  ].join(" ");
}

function getLabelClasses(visualState: ScenarioHotspotVisualState): string {
  switch (visualState) {
    case "active":
      return "border-white/45 bg-[#17243a]/94 text-white";

    case "completed":
      return "border-[#0b9c72]/25 bg-[#ecf8f4]/95 text-[#087658]";

    case "available":
      return "border-[#0d7fc2]/20 bg-white/95 text-[#31425a]";

    case "locked":
      return "border-[#cfd7e0] bg-[#eef1f4]/95 text-[#6f7b89]";
  }
}

function getLabelPositionClasses(
  labelSide: ResolvedChallenge["hotspot"]["labelSide"] | undefined,
): string {
  switch (labelSide) {
    case "top":
      return ["bottom-full", "left-1/2", "mb-3", "-translate-x-1/2"].join(" ");

    case "right":
      return ["left-full", "top-1/2", "ml-3", "-translate-y-1/2"].join(" ");

    case "left":
      return ["right-full", "top-1/2", "mr-3", "-translate-y-1/2"].join(" ");

    case "bottom":
    default:
      return ["left-1/2", "top-full", "mt-3", "-translate-x-1/2"].join(" ");
  }
}

function getStatusIcon(status: ChallengeProgressStatus, order: number): ReactNode {
  switch (status) {
    case "completed":
      return <Check aria-hidden="true" size={22} strokeWidth={3} />;

    case "in_progress":
      return <Play aria-hidden="true" size={19} fill="currentColor" />;

    case "locked":
      return <LockKeyhole aria-hidden="true" size={19} />;

    case "available":
      return order;
  }
}

export function ScenarioHotspot({
  challenge,
  status,
  isCurrentObjective = false,
  labels: customLabels,
  onSelect,
}: ScenarioHotspotProps) {
  const labels = {
    ...DEFAULT_SCENARIO_HOTSPOT_LABELS,
    ...customLabels,
  };

  const statusLabel = getStatusLabel(status, labels);

  const visualState = getVisualState(status, isCurrentObjective);

  const isLocked = status === "locked";

  const shouldPulse = visualState === "active" && status !== "completed";

  return (
    <div
      data-testid={`scenario-hotspot-${challenge.id}`}
      data-hotspot-state={visualState}
      data-challenge-status={status}
      className="group absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block"
      style={{
        left: `${challenge.hotspot.x}%`,
        top: `${challenge.hotspot.y}%`,
      }}
    >
      <div className="relative h-14 w-14">
        {shouldPulse ? (
          <span
            aria-hidden="true"
            className={[
              "pointer-events-none absolute inset-0 rounded-full opacity-40 motion-safe:animate-ping",
              status === "in_progress" ? "bg-[#0d7fc2]" : "bg-[#ef6c23]",
            ].join(" ")}
          />
        ) : null}

        <button
          type="button"
          data-testid={`scenario-board-hotspot-${challenge.id}`}
          disabled={isLocked}
          aria-current={isCurrentObjective ? "step" : undefined}
          aria-label={`${labels.mapPoint}: ${challenge.shortTitle}. ${statusLabel}.`}
          className={[
            "relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-base font-bold transition",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d7fc2]",
            getButtonClasses(status, visualState),
            isLocked ? "cursor-not-allowed" : "hover:scale-110 active:scale-95",
          ].join(" ")}
          onClick={onSelect}
        >
          {getStatusIcon(status, challenge.order)}
        </button>
      </div>

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute z-30 w-max max-w-56 rounded-[0.9rem] border px-3 py-2 shadow-[0_12px_30px_rgba(23,36,58,0.26)] backdrop-blur-md transition",
          getLabelClasses(visualState),
          getLabelPositionClasses(challenge.hotspot.labelSide),
        ].join(" ")}
      >
        <p className="text-sm font-semibold leading-5">{challenge.shortTitle}</p>

        <p className="mt-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.09em] opacity-75">
          {statusLabel}
        </p>
      </div>
    </div>
  );
}
