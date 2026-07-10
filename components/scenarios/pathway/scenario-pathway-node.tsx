"use client";

import { Check, LockKeyhole } from "lucide-react";

import type {
  ScenarioPathwayItem,
  ScenarioPathwayLabelSide,
  ScenarioPathwayMapLabels,
  ScenarioPathwayOpenMode,
  ScenarioPathwayStatus,
} from "@/components/scenarios/pathway/scenario-pathway-types";

export type ScenarioPathwayNodeProps = {
  readonly item: ScenarioPathwayItem;
  readonly labels: ScenarioPathwayMapLabels;
  readonly isCurrent: boolean;

  readonly onOpenScenario: (item: ScenarioPathwayItem, mode: ScenarioPathwayOpenMode) => void;
};

function getStatusLabel(status: ScenarioPathwayStatus, labels: ScenarioPathwayMapLabels): string {
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

function isScenarioOpenable(status: ScenarioPathwayStatus): boolean {
  return status !== "locked";
}

function getOpenMode(status: ScenarioPathwayStatus): ScenarioPathwayOpenMode {
  return status === "completed" ? "review" : "play";
}

function getNodeClasses(status: ScenarioPathwayStatus, isCurrent: boolean): string {
  if (status === "completed") {
    return [
      "border-white",
      "bg-[#0b9c72]",
      "text-white",
      "shadow-[0_14px_36px_rgba(11,156,114,0.36)]",
    ].join(" ");
  }

  if (status === "in_progress" || isCurrent) {
    return [
      "border-white",
      "bg-[#0d6fe8]",
      "text-white",
      "shadow-[0_16px_42px_rgba(13,111,232,0.42)]",
      "ring-4",
      "ring-[#0d6fe8]/22",
    ].join(" ");
  }

  if (status === "available") {
    return [
      "border-white",
      "bg-[#0d6fe8]",
      "text-white",
      "shadow-[0_14px_36px_rgba(13,111,232,0.34)]",
    ].join(" ");
  }

  return [
    "border-white",
    "bg-[#7e8792]",
    "text-white",
    "shadow-[0_12px_30px_rgba(23,36,58,0.24)]",
  ].join(" ");
}

function getLabelClasses(status: ScenarioPathwayStatus, isCurrent: boolean): string {
  if (status === "completed") {
    return [
      "border-[#0b9c72]/25",
      "bg-white/97",
      "text-[#31425a]",
      "shadow-[0_12px_30px_rgba(11,156,114,0.16)]",
    ].join(" ");
  }

  if (status === "in_progress" || isCurrent) {
    return [
      "border-[#0d6fe8]/35",
      "bg-white/98",
      "text-[#17345f]",
      "shadow-[0_14px_34px_rgba(13,111,232,0.2)]",
    ].join(" ");
  }

  if (status === "available") {
    return [
      "border-[#0d6fe8]/20",
      "bg-white/97",
      "text-[#31425a]",
      "shadow-[0_12px_30px_rgba(23,36,58,0.14)]",
    ].join(" ");
  }

  return [
    "border-[#d5dce5]",
    "bg-white/94",
    "text-[#667180]",
    "shadow-[0_10px_26px_rgba(23,36,58,0.12)]",
  ].join(" ");
}

function getLabelPositionClasses(side: ScenarioPathwayLabelSide | undefined): string {
  switch (side) {
    case "top":
      return ["bottom-full", "left-1/2", "mb-2", "-translate-x-1/2"].join(" ");

    case "right":
      return ["left-full", "top-1/2", "ml-2", "-translate-y-1/2"].join(" ");

    case "left":
      return ["right-full", "top-1/2", "mr-2", "-translate-y-1/2"].join(" ");

    case "bottom":
    default:
      return ["left-1/2", "top-full", "mt-2", "-translate-x-1/2"].join(" ");
  }
}

export function ScenarioPathwayNode({
  item,
  labels,
  isCurrent,
  onOpenScenario,
}: ScenarioPathwayNodeProps) {
  const isOpenable = isScenarioOpenable(item.status);

  const statusLabel = getStatusLabel(item.status, labels);

  const actionLabel = item.status === "completed" ? labels.reviewScenario : labels.openScenario;

  const shouldPulse = isCurrent && item.status !== "completed" && item.status !== "locked";

  return (
    <div
      data-testid={`scenario-pathway-node-${item.id}`}
      data-scenario-status={item.status}
      data-current={isCurrent}
      className="absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block"
      style={{
        left: `${item.position.x}%`,
        top: `${item.position.y}%`,
      }}
    >
      <button
        type="button"
        disabled={!isOpenable}
        aria-current={isCurrent ? "step" : undefined}
        aria-label={`${actionLabel}: ${item.shortTitle}. ${statusLabel}.`}
        className={[
          "group relative flex flex-col items-center",
          "focus-visible:outline-none",
          isOpenable ? "cursor-pointer" : "cursor-default",
        ].join(" ")}
        onClick={() => {
          if (!isOpenable) {
            return;
          }

          onOpenScenario(item, getOpenMode(item.status));
        }}
      >
        <span className="relative block h-[4.65rem] w-[4.65rem]">
          {shouldPulse ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full bg-[#0d6fe8] opacity-30 motion-safe:animate-ping"
            />
          ) : null}

          <span
            className={[
              "relative flex h-full w-full items-center justify-center rounded-full border-[5px] text-[2rem] font-semibold transition",
              "group-focus-visible:ring-4 group-focus-visible:ring-white/90 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#0d6fe8]",
              getNodeClasses(item.status, isCurrent),
              isOpenable ? "group-hover:scale-105 group-active:scale-95" : "",
            ].join(" ")}
          >
            {item.status === "completed" ? (
              <Check aria-hidden="true" size={31} strokeWidth={3} />
            ) : (
              item.order
            )}
          </span>

          {item.status === "locked" ? (
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-[#7e8792] text-white shadow-md"
            >
              <LockKeyhole size={15} strokeWidth={2.5} />
            </span>
          ) : null}
        </span>

        <span
          aria-hidden="true"
          className={[
            "pointer-events-none invisible absolute z-30 w-max max-w-56 scale-95 rounded-xl border px-4 py-2 text-center opacity-0 backdrop-blur-md",
            "transition-[opacity,visibility,transform] duration-150",
            "group-hover:visible group-hover:scale-100 group-hover:opacity-100",
            "group-focus-visible:visible group-focus-visible:scale-100 group-focus-visible:opacity-100",
            getLabelClasses(item.status, isCurrent),
            getLabelPositionClasses(item.position.labelSide),
          ].join(" ")}
        >
          <span className="block text-sm font-semibold leading-5">{item.shortTitle}</span>
        </span>
      </button>
    </div>
  );
}
