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
    default:
      return "cross-cutting";
  }
}

export function mapDifficulty(difficulty: string): CurriculumDifficulty {
  return difficulty === "intermediate" ? "Intermediate" : "Foundation";
}

export function mapAttemptStatus(status?: string | null): CurriculumModuleViewModel["status"] {
  if (status === "completed") return "completed";
  if (status === "in_progress") return "in_progress";
  return "not_started";
}

export function formatDuration(minutes?: number | null): string {
  if (!minutes || minutes <= 0) return "Self-paced";
  return `${minutes} min`;
}

export function formatLastOpened(date?: Date | null): string {
  if (!date) return "Not started yet";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function buildGeneratedOutcomes(area: CurriculumArea): string[] {
  switch (area) {
    case "environmental":
      return [
        "Identify environmental decision points in practice",
        "Interpret sustainability-related consequences of choices",
        "Strengthen confidence before scenario-based learning",
      ];
    case "social":
      return [
        "Recognise people-related ESG risks and opportunities",
        "Apply stakeholder-sensitive thinking in decision-making",
        "Understand social responsibility in implementation quality",
      ];
    case "governance":
      return [
        "Understand how governance shapes ESG credibility",
        "Relate accountability and policies to implementation",
        "Translate governance concepts into everyday practice",
      ];
    default:
      return [
        "Build a shared understanding of ESG integration",
        "Recognise how environmental, social, and governance topics interact",
        "Prepare for practical case-based and scenario-based learning",
      ];
  }
}

export function buildGeneratedStructure(quizzesCount: number): string[] {
  const steps = ["Introduction"];

  if (quizzesCount >= 1) {
    steps.push("Pre-test");
  }

  steps.push("Core content");

  if (quizzesCount >= 2) {
    steps.push("Post-test");
  }

  return steps;
}
