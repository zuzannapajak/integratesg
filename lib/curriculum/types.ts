export type CurriculumArea = "environmental" | "social" | "governance" | "cross-cutting";
export type CurriculumStatus = "not_started" | "in_progress" | "completed";

export type CurriculumDifficulty = "Foundation" | "Intermediate";

export type CurriculumModuleViewModel = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  content?: string;
  area: CurriculumArea;
  status: CurriculumStatus;
  progress: number;
  duration: string;
  durationMinutes: number | null;
  lessons: number;
  quizzes: number;
  lastOpened: string;
  difficulty: CurriculumDifficulty;
  outcomes: string[];
  structure: string[];
};
