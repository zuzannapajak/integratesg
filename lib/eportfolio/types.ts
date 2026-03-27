export type CaseStudyArea = "environmental" | "social" | "governance" | "cross-cutting";

export type CaseStudyListItemViewModel = {
  slug: string;
  title: string;
  summary: string;
  area: CaseStudyArea;
  organization: string | null;
  industry: string | null;
  isFeatured: boolean;
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
};
