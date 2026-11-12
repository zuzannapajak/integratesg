import { scenarioPathwayDefinitions } from "@/content/scenarios/pathway";
import { prisma } from "@/lib/prisma";
import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";
import type { Prisma } from "@prisma/client";

type CaseProgress = {
  caseStudyId: string;
  status: "not_started" | "in_progress" | "completed";
  startedAt: Date | null;
  lastOpenedAt: Date | null;
  completedAt: Date | null;
};

type ScenarioAttempt = {
  scenarioId: string;
  status: "incomplete" | "completed";
};

/** This is a snapshot, not a live count of attempts: repeated attempts count only once. */
export function buildWp4ActivitySnapshot(
  caseStudies: readonly CaseProgress[],
  scenarios: readonly ScenarioAttempt[],
) {
  const startedCaseStudyIds = new Set<string>();
  const completedCaseStudyIds = new Set<string>();
  const startedScenarioIds = new Set<string>();
  const completedScenarioIds = new Set<string>();

  for (const row of caseStudies) {
    if (row.status !== "not_started" || row.startedAt || row.lastOpenedAt || row.completedAt) {
      startedCaseStudyIds.add(row.caseStudyId);
    }
    if (row.status === "completed" || row.completedAt) {
      completedCaseStudyIds.add(row.caseStudyId);
      startedCaseStudyIds.add(row.caseStudyId);
    }
  }

  for (const row of scenarios) {
    startedScenarioIds.add(row.scenarioId);
    if (row.status === "completed") completedScenarioIds.add(row.scenarioId);
  }

  const ordered = (ids: Set<string>) => [...ids].sort();
  return {
    caseStudiesStarted: startedCaseStudyIds.size,
    caseStudiesCompleted: completedCaseStudyIds.size,
    scenariosStarted: startedScenarioIds.size,
    scenariosCompleted: completedScenarioIds.size,
    startedCaseStudyIds: ordered(startedCaseStudyIds),
    completedCaseStudyIds: ordered(completedCaseStudyIds),
    startedScenarioIds: ordered(startedScenarioIds),
    completedScenarioIds: ordered(completedScenarioIds),
    countingRule: "unique_published_case_studies_and_current_scenarios_v1",
  };
}

export function currentScenarioFilters() {
  return scenarioPathwayDefinitions.map((definition) => {
    const scenario = resolveScenarioBySlug(definition.slug, "en");
    if (!scenario) throw new Error(`Missing current scenario ${definition.id}`);
    return { scenarioId: definition.id, scenarioVersion: scenario.version };
  });
}

type ActivityDb = Pick<Prisma.TransactionClient, "userCaseStudyProgress" | "userScenarioAttempt">;

export async function getWp4ActivitySnapshot(userId: string, db: ActivityDb = prisma) {
  const [caseStudies, scenarios] = await Promise.all([
    db.userCaseStudyProgress.findMany({
      where: { userId, caseStudy: { status: "published" } },
      select: {
        caseStudyId: true,
        status: true,
        startedAt: true,
        lastOpenedAt: true,
        completedAt: true,
      },
    }),
    db.userScenarioAttempt.findMany({
      where: { userId, OR: currentScenarioFilters() },
      select: { scenarioId: true, status: true },
    }),
  ]);
  return buildWp4ActivitySnapshot(caseStudies, scenarios);
}
