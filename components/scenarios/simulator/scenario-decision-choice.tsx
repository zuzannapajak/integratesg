"use client";

import { Check } from "lucide-react";

import type { ChoiceId, ResolvedChoice } from "@/lib/scenarios/simulator/types";

export type ScenarioDecisionChoiceProps = {
  readonly choice: ResolvedChoice;

  /**
   * Shared radio group name for all choices
   * belonging to the same challenge.
   */
  readonly groupName: string;

  readonly isSelected: boolean;

  readonly disabled?: boolean;

  readonly onSelect: (choiceId: ChoiceId) => void;
};

export function ScenarioDecisionChoice({
  choice,
  groupName,
  isSelected,
  disabled = false,
  onSelect,
}: ScenarioDecisionChoiceProps) {
  const textId = `${choice.id}-decision-text`;

  const labelId = choice.label ? `${choice.id}-decision-label` : undefined;

  return (
    <label
      data-testid={`scenario-decision-choice-${choice.id}`}
      data-selected={isSelected}
      data-disabled={disabled}
      className={["block rounded-2xl", disabled ? "cursor-not-allowed" : "cursor-pointer"].join(
        " ",
      )}
    >
      <input
        type="radio"
        name={groupName}
        value={choice.id}
        checked={isSelected}
        disabled={disabled}
        aria-labelledby={labelId ?? textId}
        aria-describedby={labelId ? textId : undefined}
        className="peer sr-only"
        onChange={() => {
          onSelect(choice.id);
        }}
      />

      <span
        className={[
          "flex min-h-24 items-start gap-4 rounded-2xl border p-4 transition",
          "peer-focus-visible:outline-none peer-focus-visible:ring-4 peer-focus-visible:ring-[#0d6fe8]/25",
          isSelected
            ? [
                "border-[#0d6fe8]",
                "bg-[#eef5ff]",
                "shadow-[0_10px_28px_rgba(13,111,232,0.14)]",
              ].join(" ")
            : [
                "border-[#dfe5ec]",
                "bg-white",
                disabled ? "" : "hover:border-[#b8c8d8] hover:bg-[#fbfcfd] hover:shadow-sm",
              ].join(" "),
          disabled ? "opacity-65" : "",
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className={[
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition",
            isSelected
              ? "border-[#0d6fe8] bg-[#0d6fe8] text-white"
              : "border-[#d3dbe5] bg-[#f4f6f8] text-[#596170]",
          ].join(" ")}
        >
          {isSelected ? <Check size={17} strokeWidth={3} /> : choice.order}
        </span>

        <span className="min-w-0 flex-1">
          {choice.label ? (
            <span id={labelId} className="block text-sm font-semibold leading-6 text-[#31425a]">
              {choice.label}
            </span>
          ) : null}

          <span
            id={textId}
            className={["block text-sm leading-6 text-[#596170]", choice.label ? "mt-1" : ""].join(
              " ",
            )}
          >
            {choice.text}
          </span>
        </span>

        <span
          aria-hidden="true"
          className={[
            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
            isSelected ? "border-[#0d6fe8] bg-[#0d6fe8]" : "border-[#b8c2ce] bg-white",
          ].join(" ")}
        >
          {isSelected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
        </span>
      </span>
    </label>
  );
}
