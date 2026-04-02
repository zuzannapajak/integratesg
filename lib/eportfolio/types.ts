export type CaseStudyArea = "environmental" | "social" | "governance" | "cross-cutting";
export type CaseStudyProgressStatus = "not_started" | "in_progress" | "completed";

export type CaseStudyListItemViewModel = {
  slug: string;
  title: string;
  summary: string | null;
  area: CaseStudyArea;
  organization: string | null;
  industry: string | null;
  isFeatured: boolean;
  status: CaseStudyProgressStatus;
  isCompleted: boolean;
  startedAt: string | null;
  lastOpenedAt: string | null;
  completedAt: string | null;
};

export type CaseStudyDetailViewModel = {
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  area: CaseStudyArea;
  organization: string | null;
  industry: string | null;
  isFeatured: boolean;
  keyTakeaways: string[];
  status: CaseStudyProgressStatus;
  isCompleted: boolean;
  startedAt: string | null;
  lastOpenedAt: string | null;
  completedAt: string | null;
};

export type CaseStudyTranslationRecord = {
  language: string;
  title: string;
  summary: string | null;
  content: string;
  keyTakeaways: unknown;
  organization: string | null;
  industry: string | null;
};

export type CaseStudyProgressRecord = {
  status: string;
  startedAt: Date | null;
  lastOpenedAt: Date | null;
  completedAt: Date | null;
};

export type CaseStudyRecord = {
  id: string;
  slug: string;
  area: string;
  isFeatured: boolean;
  translations: CaseStudyTranslationRecord[];
  userProgress: CaseStudyProgressRecord[];
};
