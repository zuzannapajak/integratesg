"use client";

import { Check, LockKeyhole } from "lucide-react";

import type {
  ScenarioPathwayItem,
  ScenarioPathwayMapLabels,
  ScenarioPathwayOpenMode,
  ScenarioPathwayStatus,
} from "@/components/scenarios/pathway/scenario-pathway-types";

export type ScenarioPathwayCardProps = {
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

function getCardClasses(status: ScenarioPathwayStatus, isCurrent: boolean): string {
  if (status === "completed") {
    return ["border-[#0b9c72]/25", "bg-[#ecf8f4]", "text-[#31425a]"].join(" ");
  }

  if (status === "in_progress" || isCurrent) {
    return [
      "border-[#0d6fe8]/35",
      "bg-[#eef5ff]",
      "text-[#31425a]",
      "shadow-[0_10px_26px_rgba(13,111,232,0.14)]",
    ].join(" ");
  }

  if (status === "available") {
    return ["border-[#0d6fe8]/20", "bg-white", "text-[#31425a]"].join(" ");
  }

  return ["border-[#dfe5ec]", "bg-[#f4f6f8]", "text-[#7a8594]"].join(" ");
}

function getNumberClasses(status: ScenarioPathwayStatus): string {
  switch (status) {
    case "completed":
      return "bg-[#0b9c72] text-white";

    case "available":
    case "in_progress":
      return "bg-[#0d6fe8] text-white";

    case "locked":
      return "bg-[#7e8792] text-white";
  }
}

export function ScenarioPathwayCard({
  item,
  labels,
  isCurrent,
  onOpenScenario,
}: ScenarioPathwayCardProps) {
  const isOpenable = isScenarioOpenable(item.status);

  const statusLabel = getStatusLabel(item.status, labels);

  const actionLabel = item.status === "completed" ? labels.reviewScenario : labels.openScenario;

  return (
    <button
      type="button"
      data-testid={`scenario-pathway-card-${item.id}`}
      data-scenario-status={item.status}
      disabled={!isOpenable}
      aria-current={isCurrent ? "step" : undefined}
      aria-label={`${actionLabel}: ${item.shortTitle}. ${statusLabel}.`}
      className={[
        "flex min-h-24 items-center gap-4 rounded-2xl border p-4 text-left transition",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0d6fe8]/25",
        getCardClasses(item.status, isCurrent),
        isOpenable
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          : "cursor-default",
      ].join(" ")}
      onClick={() => {
        if (!isOpenable) {
          return;
        }

        onOpenScenario(item, getOpenMode(item.status));
      }}
    >
      <span
        aria-hidden="true"
        className={[
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold",
          getNumberClasses(item.status),
        ].join(" ")}
      >
        {item.status === "completed" ? (
          <Check size={21} strokeWidth={3} />
        ) : item.status === "locked" ? (
          <LockKeyhole size={19} />
        ) : (
          item.order
        )}
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-5">{item.shortTitle}</span>

        <span
          className={[
            "mt-1 block text-xs font-semibold uppercase tracking-[0.08em]",
            item.status === "completed"
              ? "text-[#087658]"
              : item.status === "available" || item.status === "in_progress"
                ? "text-[#0d6fe8]"
                : "text-[#7a8594]",
          ].join(" ")}
        >
          {statusLabel}
        </span>
      </span>
    </button>
  );
}
