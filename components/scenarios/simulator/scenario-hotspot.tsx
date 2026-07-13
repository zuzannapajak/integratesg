"use client";

import { Check, LockKeyhole } from "lucide-react";

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
  readonly isCurrentObjective?: boolean;
  readonly tabIndex?: number;
  readonly keyboardIndex?: number;
  readonly labels?: Partial<ScenarioHotspotLabels>;

  readonly onPreviewChange?: (isPreviewed: boolean) => void;
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

function isChallengeOpenable(status: ChallengeProgressStatus): boolean {
  return status === "available" || status === "in_progress";
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

function getButtonClasses(visualState: ScenarioHotspotVisualState): string {
  switch (visualState) {
    case "completed":
      return [
        "border-white",
        "bg-[#0b9c72]",
        "text-white",
        "shadow-[0_12px_32px_rgba(11,156,114,0.34)]",
      ].join(" ");

    case "active":
      return [
        "border-white",
        "bg-[#0d6fe8]",
        "text-white",
        "shadow-[0_14px_36px_rgba(13,111,232,0.42)]",
        "ring-4",
        "ring-[#0d6fe8]/22",
      ].join(" ");

    case "available":
      return [
        "border-white",
        "bg-white",
        "text-[#0d6fe8]",
        "shadow-[0_12px_30px_rgba(23,36,58,0.24)]",
      ].join(" ");

    case "locked":
      return [
        "border-white",
        "bg-[#7e8792]",
        "text-white",
        "shadow-[0_10px_26px_rgba(23,36,58,0.22)]",
      ].join(" ");
  }
}

export function ScenarioHotspot({
  challenge,
  status,
  isCurrentObjective = false,
  tabIndex,
  keyboardIndex,
  labels: customLabels,
  onPreviewChange,
  onSelect,
}: ScenarioHotspotProps) {
  const labels = {
    ...DEFAULT_SCENARIO_HOTSPOT_LABELS,
    ...customLabels,
  };

  const statusLabel = getStatusLabel(status, labels);

  const visualState = getVisualState(status, isCurrentObjective);

  const isOpenable = isChallengeOpenable(status);

  const shouldPulse = visualState === "active" && isOpenable;

  return (
    <div
      data-testid={`scenario-hotspot-${challenge.id}`}
      data-hotspot-state={visualState}
      data-challenge-status={status}
      className="absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block"
      style={{
        left: `${challenge.hotspot.x}%`,
        top: `${challenge.hotspot.y}%`,
      }}
      onMouseEnter={() => {
        onPreviewChange?.(true);
      }}
      onMouseLeave={() => {
        onPreviewChange?.(false);
      }}
    >
      <div className="relative h-15 w-15">
        {shouldPulse ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-[#0d6fe8] opacity-35 motion-safe:animate-ping"
          />
        ) : null}

        <button
          type="button"
          data-testid={`scenario-board-hotspot-${challenge.id}`}
          disabled={!isOpenable}
          tabIndex={isOpenable ? tabIndex : undefined}
          data-scenario-hotspot-index={keyboardIndex}
          aria-current={isCurrentObjective && isOpenable ? "step" : undefined}
          aria-label={`${labels.mapPoint}: ${challenge.shortTitle}. ${statusLabel}.`}
          className={[
            "relative flex h-15 w-15 items-center justify-center rounded-full border-4 text-xl font-semibold transition",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/85 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d6fe8]",
            getButtonClasses(visualState),
            isOpenable ? "cursor-pointer hover:scale-105 active:scale-95" : "cursor-default",
          ].join(" ")}
          onFocus={() => {
            onPreviewChange?.(true);
          }}
          onBlur={() => {
            onPreviewChange?.(false);
          }}
          onClick={onSelect}
        >
          {status === "completed" ? (
            <Check aria-hidden="true" size={25} strokeWidth={3} />
          ) : (
            challenge.order
          )}
        </button>

        {status === "locked" ? (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#7e8792] text-white shadow-md"
          >
            <LockKeyhole size={14} strokeWidth={2.4} />
          </span>
        ) : null}
      </div>
    </div>
  );
}
