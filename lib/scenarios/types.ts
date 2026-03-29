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

export type ScenarioDetailViewModel = {
  slug: string;
  language: string;
  title: string;
  description: string;
  instruction: string;
  area: ScenarioArea;
  estimatedDurationMinutes: number | null;
  status: ScenarioProgressStatus;
  launchUrl: string;
  thumbnailUrl: string | null;
  isFeatured: boolean;
  hasAttempt: boolean;
  score: number | null;
  startedAt: string | null;
  lastOpenedAt: string | null;
  completedAt: string | null;
  lessonLocation: string | null;
};

export type ScenarioLaunchViewModel = {
  slug: string;
  language: string;
  title: string;
  description: string;
  area: ScenarioArea;
  launchUrl: string | null;
  status: ScenarioProgressStatus;
  hasAttempt: boolean;
  score: number | null;
  lessonLocation: string | null;
  lastOpenedAt: string | null;
  completedAt: string | null;
};
