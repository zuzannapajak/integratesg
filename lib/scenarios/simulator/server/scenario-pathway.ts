import type {
  ScenarioPathwayDefinition,
  ScenarioPathwayItem,
  ScenarioPathwayStatus,
} from "@/components/scenarios/pathway/scenario-pathway-types";
import { scenarioPathwayDefinitions } from "@/content/scenarios/pathway";
import { prisma } from "@/lib/prisma";
import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";
import type { ScenarioId } from "@/lib/scenarios/simulator/types";

type ScenarioAttemptSummary = {
  readonly scenarioId: string;
  readonly scenarioVersion: number;
  readonly status: "incomplete" | "completed";
};

function getCurrentScenarioVersions(): ReadonlyMap<string, number> {
  const versions = new Map<string, number>();

  for (const definition of scenarioPathwayDefinitions) {
    const scenario = resolveScenarioBySlug(definition.slug, "en");

    if (!scenario) {
      throw new Error(`Scenario ${definition.id} is missing from the scenario catalog.`);
    }

    versions.set(definition.id, scenario.version);
  }

  return versions;
}

function resolveStoredStatus(
  attempts: readonly ScenarioAttemptSummary[],
  currentVersion: number,
): Extract<ScenarioPathwayStatus, "completed" | "in_progress"> | null {
  let hasIncompleteAttempt = false;

  for (const attempt of attempts) {
    if (attempt.scenarioVersion !== currentVersion) {
      continue;
    }

    if (attempt.status === "completed") {
      return "completed";
    }

    hasIncompleteAttempt = true;
  }

  return hasIncompleteAttempt ? "in_progress" : null;
}

export function buildScenarioPathwayItems(
  definitions: readonly ScenarioPathwayDefinition[],
  currentVersions: ReadonlyMap<string, number>,
  attempts: readonly ScenarioAttemptSummary[],
): readonly ScenarioPathwayItem[] {
  const attemptsByScenarioId = new Map<string, ScenarioAttemptSummary[]>();

  for (const attempt of attempts) {
    const scenarioAttempts = attemptsByScenarioId.get(attempt.scenarioId);

    if (scenarioAttempts) {
      scenarioAttempts.push(attempt);
    } else {
      attemptsByScenarioId.set(attempt.scenarioId, [attempt]);
    }
  }

  let allPreviousScenariosCompleted = true;

  const items = [...definitions]
    .sort((first, second) => first.order - second.order)
    .map((definition): ScenarioPathwayItem => {
      const currentVersion = currentVersions.get(definition.id);

      if (currentVersion === undefined) {
        throw new Error(`Current version for ${definition.id} is unavailable.`);
      }

      const storedStatus = resolveStoredStatus(
        attemptsByScenarioId.get(definition.id) ?? [],
        currentVersion,
      );

      const status: ScenarioPathwayStatus =
        storedStatus ?? (allPreviousScenariosCompleted ? "available" : "locked");

      allPreviousScenariosCompleted = allPreviousScenariosCompleted && status === "completed";

      return {
        ...definition,
        status,
      };
    });

  const recommendedIndex = items.findIndex(
    ({ status }) => status === "in_progress" || status === "available",
  );

  if (recommendedIndex < 0) {
    return items;
  }

  return items.map((item, index) =>
    index === recommendedIndex
      ? {
          ...item,
          isRecommended: true,
        }
      : item,
  );
}

export async function getScenarioPathwayItemsForUser(
  userId: string,
): Promise<readonly ScenarioPathwayItem[]> {
  const currentVersions = getCurrentScenarioVersions();

  const currentScenarioFilters = scenarioPathwayDefinitions.map((definition) => {
    const scenarioVersion = currentVersions.get(definition.id);

    if (scenarioVersion === undefined) {
      throw new Error(`Current version for ${definition.id} is unavailable.`);
    }

    return {
      scenarioId: definition.id,
      scenarioVersion,
    };
  });

  const attempts = await prisma.userScenarioAttempt.findMany({
    where: {
      userId,
      OR: currentScenarioFilters,
    },
    select: {
      scenarioId: true,
      scenarioVersion: true,
      status: true,
    },
  });

  return buildScenarioPathwayItems(scenarioPathwayDefinitions, currentVersions, attempts);
}

export async function getScenarioPathwayItemForUser(
  userId: string,
  scenarioId: ScenarioId,
): Promise<ScenarioPathwayItem | null> {
  const items = await getScenarioPathwayItemsForUser(userId);

  return items.find((item) => item.id === scenarioId) ?? null;
}

export async function assertScenarioCanStartForUser(
  userId: string,
  scenarioId: ScenarioId,
): Promise<void> {
  const item = await getScenarioPathwayItemForUser(userId, scenarioId);

  if (!item || item.status === "locked") {
    throw new Error("Scenario is locked.");
  }
}
