export type CaseStudyArea = "environmental" | "social" | "governance" | "cross-cutting";
export type CaseStudyProgressStatus = "not_started" | "in_progress" | "completed";

export type CaseStudyListItemViewModel = {
  slug: string;
  title: string;
  summary: string;
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
  summary: string;
  content: string;
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
