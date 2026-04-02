import {
  CurriculumArea,
  CurriculumDifficulty,
  CurriculumModuleViewModel,
  CurriculumTextToken,
} from "@/lib/curriculum/types";

export function mapArea(area: string): CurriculumArea {
  switch (area) {
    case "environmental":
      return "environmental";
    case "social":
      return "social";
    case "governance":
      return "governance";
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
    case "environmental":
      return [
        { key: "generatedOutcomes.environmental.0" },
        { key: "generatedOutcomes.environmental.1" },
        { key: "generatedOutcomes.environmental.2" },
      ];
    case "social":
      return [
        { key: "generatedOutcomes.social.0" },
        { key: "generatedOutcomes.social.1" },
        { key: "generatedOutcomes.social.2" },
      ];
    case "governance":
      return [
        { key: "generatedOutcomes.governance.0" },
        { key: "generatedOutcomes.governance.1" },
        { key: "generatedOutcomes.governance.2" },
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
