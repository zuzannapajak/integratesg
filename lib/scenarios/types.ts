import { Prisma } from "@prisma/client";

export type ScenarioArea = "environmental" | "social" | "governance" | "cross-cutting";

export type ScenarioAvailability = "available" | "unavailable";

export type ScenarioProgressStatus = "not_started" | "in_progress" | "completed";

export type ScenarioListItemViewModel = {
  slug: string;
  language: string;
  title: string;
  description: string | null;
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
  description: string | null;
  instruction: string | null;
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
  description: string | null;
  area: ScenarioArea;
  launchUrl: string | null;
  status: ScenarioProgressStatus;
  hasAttempt: boolean;
  score: number | null;
  lessonLocation: string | null;
  suspendData: string | null;
  sessionTime: string | null;
  startedAt: string | null;
  lastOpenedAt: string | null;
  completedAt: string | null;
};

export type ScenarioVariantRecord = {
  id: string;
  language: string;
  title: string;
  description: string | null;
  instruction: string | null;
  launchUrl: string;
  packagePath: string;
  entryPoint: string;
  thumbnailUrl: string | null;
  estimatedDurationMinutes: number | null;
  availabilityStatus: string;
};

export type UserScenarioAttemptRecord = {
  status: string;
  startedAt: Date;
  lastOpenedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
};

export type ScenarioRecord = {
  slug: string;
  area: string;
  variants: ScenarioVariantRecord[];
  userAttempts: UserScenarioAttemptRecord[];
};

export type ScenarioAttemptDetailRecord = {
  status: string;
  score: number | null;
  startedAt: Date;
  lastOpenedAt: Date | null;
  completedAt: Date | null;
  lessonLocation: string | null;
  suspendData: string | null;
  sessionTime: string | null;
  totalTime: string | null;
  rawTrackingData: Prisma.JsonValue | null;
  createdAt: Date;
};

export type ScenarioDetailRecord = {
  slug: string;
  area: string;
  isFeatured: boolean;
  variants: ScenarioVariantRecord[];
  userAttempts: ScenarioAttemptDetailRecord[];
};

export type ScenarioLaunchRecord = {
  slug: string;
  area: string;
  variants: ScenarioVariantRecord[];
  userAttempts: ScenarioAttemptDetailRecord[];
};

export type RuntimeTrackingInput = {
  locale: string;
  userId: string;
  slug: string;
  lessonStatus?: string | null;
  scoreRaw?: string | null;
  sessionTime?: string | null;
  suspendData?: string | null;
  lessonLocation?: string | null;
  rawTrackingData?: Record<string, string> | null;
};

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
