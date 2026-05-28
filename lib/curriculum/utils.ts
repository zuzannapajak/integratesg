import {
  CurriculumArea,
  CurriculumDifficulty,
  CurriculumModuleViewModel,
} from "@/lib/curriculum/types";

export function mapArea(area: string): CurriculumArea {
  switch (area) {
    case "environmental":
      return "environmental";
    case "social":
      return "social";
    case "governance":
      return "governance";
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
