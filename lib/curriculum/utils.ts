import {
  CurriculumArea,
  CurriculumDifficulty,
  CurriculumModuleViewModel,
  CurriculumTextToken,
} from "@/lib/curriculum/types";

export function mapArea(area: string): CurriculumArea {
  switch (area) {
    case "strategy":
      return "strategy";
    case "reporting":
      return "reporting";
    default:
      return "cross-cutting";
  }
}

export function mapDifficulty(difficulty: string): CurriculumDifficulty {
  return difficulty === "intermediate" ? "intermediate" : "foundation";
}

export function mapAttemptStatus(status?: string | null): CurriculumModuleViewModel["status"] {
  if (status === "completed") return "completed";
  if (status === "failed") return "failed";
  if (status === "in_progress") return "in_progress";
  return "not_started";
}

export function buildGeneratedOutcomes(area: CurriculumArea): CurriculumTextToken[] {
  switch (area) {
    case "strategy":
      return [
        { key: "generatedOutcomes.strategy.0" },
        { key: "generatedOutcomes.strategy.1" },
        { key: "generatedOutcomes.strategy.2" },
      ];
    case "reporting":
      return [
        { key: "generatedOutcomes.reporting.0" },
        { key: "generatedOutcomes.reporting.1" },
        { key: "generatedOutcomes.reporting.2" },
      ];
    default:
      return [
        { key: "generatedOutcomes.crossCutting.0" },
        { key: "generatedOutcomes.crossCutting.1" },
        { key: "generatedOutcomes.crossCutting.2" },
      ];
  }
}

export function buildGeneratedStructure(quizzesCount: number): CurriculumTextToken[] {
  const steps: CurriculumTextToken[] = [{ key: "generatedStructure.introduction" }];

  if (quizzesCount >= 1) {
    steps.push({ key: "generatedStructure.preTest" });
  }

  steps.push({ key: "generatedStructure.coreContent" });

  if (quizzesCount >= 2) {
    steps.push({ key: "generatedStructure.postTest" });
  }

  return steps;
}
