import type { ScenarioId, ScenarioSlug } from "@/lib/scenarios/simulator/types";

export type ScenarioPathwayStatus = "completed" | "available" | "in_progress" | "locked";

export type ScenarioPathwayLabelSide = "top" | "right" | "bottom" | "left";

export type ScenarioPathwayDefinition = {
  readonly id: ScenarioId;
  readonly slug: ScenarioSlug;
  readonly order: number;
  readonly title: string;
  readonly shortTitle: string;

  readonly position: {
    readonly x: number;
    readonly y: number;
    readonly labelSide?: ScenarioPathwayLabelSide;
  };
};

export type ScenarioPathwayItem = ScenarioPathwayDefinition & {
  readonly status: ScenarioPathwayStatus;
  readonly isRecommended?: boolean;
};

export type ScenarioPathwayOpenMode = "play" | "review";

export type ScenarioPathwayMapLabels = {
  readonly title: string;
  readonly subtitle: string;
  readonly progress: string;
  readonly completed: string;
  readonly available: string;
  readonly inProgress: string;
  readonly locked: string;
  readonly openScenario: string;
  readonly reviewScenario: string;
};
