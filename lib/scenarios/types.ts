export type ScenarioArea = "environmental" | "social" | "governance" | "cross-cutting";

export type ScenarioAvailability = "available" | "unavailable";

export type ScenarioProgressStatus = "not_started" | "in_progress" | "completed";

export type ScenarioListItemViewModel = {
  slug: string;
  language: string;
  title: string;
  description: string;
  area: ScenarioArea;
  packagePath: string;
  estimatedDurationMinutes: number | null;
  status: ScenarioProgressStatus;
  hasAttempt: boolean;
};
