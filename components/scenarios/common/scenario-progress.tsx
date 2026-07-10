"use client";

export type ScenarioProgressLabels = {
  readonly progress: string;
  readonly completed: string;
};

export const DEFAULT_SCENARIO_PROGRESS_LABELS: ScenarioProgressLabels = {
  progress: "Progress",
  completed: "Completed",
};

export type ScenarioProgressProps = {
  readonly completedCount: number;
  readonly totalCount: number;
  readonly labels?: Partial<ScenarioProgressLabels>;
};

function normaliseProgressValue(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.trunc(value));
}

export function ScenarioProgress({
  completedCount,
  totalCount,
  labels: customLabels,
}: ScenarioProgressProps) {
  const labels = {
    ...DEFAULT_SCENARIO_PROGRESS_LABELS,
    ...customLabels,
  };

  const safeTotalCount = normaliseProgressValue(totalCount);

  const safeCompletedCount = Math.min(normaliseProgressValue(completedCount), safeTotalCount);

  const completionPercentage = safeTotalCount > 0 ? (safeCompletedCount / safeTotalCount) * 100 : 0;

  const roundedPercentage = Math.round(completionPercentage);

  const isComplete = safeTotalCount > 0 && safeCompletedCount === safeTotalCount;

  const progressColour = isComplete ? "#0b9c72" : "#0d6fe8";

  return (
    <div
      data-testid="scenario-progress"
      data-completed-count={safeCompletedCount}
      data-total-count={safeTotalCount}
      data-percentage={roundedPercentage}
      data-complete={isComplete}
      className="flex shrink-0 items-center gap-3"
    >
      <div
        role="progressbar"
        aria-label={`${labels.progress}: ${safeCompletedCount} / ${safeTotalCount}`}
        aria-valuemin={0}
        aria-valuemax={safeTotalCount}
        aria-valuenow={safeCompletedCount}
        aria-valuetext={`${safeCompletedCount} / ${safeTotalCount} ${labels.completed}`}
        className="relative h-12 w-12 shrink-0 rounded-full"
        style={{
          background: `conic-gradient(
            ${progressColour} ${completionPercentage}%,
            #dfe5ec ${completionPercentage}% 100%
          )`,
        }}
      >
        <span aria-hidden="true" className="absolute inset-1 rounded-full bg-white" />
      </div>

      <div className="hidden sm:block">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7a8594]">
          {labels.progress}
        </p>

        <p
          aria-hidden="true"
          className={[
            "mt-0.5 whitespace-nowrap text-sm font-medium",
            isComplete ? "text-[#087658]" : "text-[#31425a]",
          ].join(" ")}
        >
          <strong className="font-semibold">
            {safeCompletedCount} / {safeTotalCount}
          </strong>{" "}
          {labels.completed.toLowerCase()}
        </p>
      </div>
    </div>
  );
}
