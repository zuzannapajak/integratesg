"use client";

import { Sprout } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

import { ScenarioProgress } from "@/components/scenarios/common/scenario-progress";
import { ScenarioPathwayCard } from "@/components/scenarios/pathway/scenario-pathway-card";
import { ScenarioPathwayNode } from "@/components/scenarios/pathway/scenario-pathway-node";
import type {
  ScenarioPathwayItem,
  ScenarioPathwayMapLabels,
  ScenarioPathwayOpenMode,
} from "@/components/scenarios/pathway/scenario-pathway-types";

export type {
  ScenarioPathwayItem,
  ScenarioPathwayLabelSide,
  ScenarioPathwayMapLabels,
  ScenarioPathwayOpenMode,
  ScenarioPathwayStatus,
} from "@/components/scenarios/pathway/scenario-pathway-types";

const SCENARIO_PATHWAY_IMAGE_SIZES = [
  "(max-width: 639px) calc(100vw - 24px)",
  "(max-width: 1023px) calc(100vw - 40px)",
  "(min-width: 1648px) 1600px",
  "calc(100vw - 48px)",
].join(", ");

export const DEFAULT_SCENARIO_PATHWAY_MAP_LABELS: ScenarioPathwayMapLabels = {
  title: "Scenarios",
  subtitle: "Explore the full learning pathway across your organisation.",
  progress: "Progress",
  completed: "Completed",
  available: "Available",
  inProgress: "In progress",
  locked: "Locked",
  openScenario: "Open scenario",
  reviewScenario: "Review scenario",
};

export type ScenarioPathwayMapProps = {
  readonly backgroundImage: string;
  readonly backgroundAlt: string;
  readonly items: readonly ScenarioPathwayItem[];
  readonly labels?: Partial<ScenarioPathwayMapLabels>;
  readonly backgroundWidth?: number;
  readonly backgroundHeight?: number;

  readonly onOpenScenario: (item: ScenarioPathwayItem, mode: ScenarioPathwayOpenMode) => void;
};

export function ScenarioPathwayMap({
  backgroundImage,
  backgroundAlt,
  items,
  labels: customLabels,
  backgroundWidth = 1672,
  backgroundHeight = 941,
  onOpenScenario,
}: ScenarioPathwayMapProps) {
  const labels = {
    ...DEFAULT_SCENARIO_PATHWAY_MAP_LABELS,
    ...customLabels,
  };

  const orderedItems = useMemo(
    () => [...items].sort((first, second) => first.order - second.order),
    [items],
  );

  const completedCount = orderedItems.filter(({ status }) => status === "completed").length;

  const explicitRecommendedIndex = orderedItems.findIndex(
    ({ isRecommended }) => isRecommended === true,
  );

  const inProgressIndex = orderedItems.findIndex(({ status }) => status === "in_progress");

  const firstAvailableIndex = orderedItems.findIndex(({ status }) => status === "available");

  const currentIndex =
    explicitRecommendedIndex >= 0
      ? explicitRecommendedIndex
      : inProgressIndex >= 0
        ? inProgressIndex
        : firstAvailableIndex;

  return (
    <section
      data-testid="scenario-pathway-map"
      className="overflow-hidden rounded-[1.65rem] border border-[#dfe5ec] bg-white shadow-[0_18px_55px_rgba(49,66,90,0.12)]"
    >
      <header className="flex items-center justify-between gap-5 border-b border-[#e7ebf0] px-5 py-4 sm:px-7 sm:py-5">
        <div className="flex min-w-0 items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#eef5ff] text-[#0d6fe8] sm:h-16 sm:w-16"
          >
            <Sprout size={31} strokeWidth={2} />
          </span>

          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-[-0.035em] text-[#17243a] sm:text-3xl">
              {labels.title}
            </h1>

            <p className="mt-1 hidden text-sm leading-6 text-[#596170] sm:block">
              {labels.subtitle}
            </p>
          </div>
        </div>

        <ScenarioProgress
          completedCount={completedCount}
          totalCount={orderedItems.length}
          labels={{
            progress: labels.progress,
            completed: labels.completed,
          }}
        />
      </header>

      <p className="sr-only">{backgroundAlt}</p>

      <div
        className="relative hidden w-full overflow-hidden bg-[#eef2f6] md:block"
        style={{
          aspectRatio: `${backgroundWidth} / ${backgroundHeight}`,
        }}
      >
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          sizes={SCENARIO_PATHWAY_IMAGE_SIZES}
          className="object-contain object-center"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-white/12 via-transparent to-white/5"
        />

        {orderedItems.map((item, index) => (
          <ScenarioPathwayNode
            key={item.id}
            item={item}
            labels={labels}
            isCurrent={index === currentIndex}
            onOpenScenario={onOpenScenario}
          />
        ))}
      </div>

      <div className="md:hidden">
        <div
          className="relative w-full overflow-hidden bg-[#eef2f6]"
          style={{
            aspectRatio: `${backgroundWidth} / ${backgroundHeight}`,
          }}
        >
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            sizes={SCENARIO_PATHWAY_IMAGE_SIZES}
            className="object-contain object-center"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-white/30 via-transparent to-white/5"
          />
        </div>

        <div className="grid gap-3 border-t border-[#e7ebf0] bg-[#f8fafc] p-4 sm:grid-cols-2">
          {orderedItems.map((item, index) => (
            <ScenarioPathwayCard
              key={item.id}
              item={item}
              labels={labels}
              isCurrent={index === currentIndex && item.status !== "locked"}
              onOpenScenario={onOpenScenario}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
