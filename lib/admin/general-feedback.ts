import { prisma } from "@/lib/prisma";
import {
  GENERAL_FEEDBACK_SURVEY_TYPE,
  isGeneralFeedbackCategory,
  type GeneralFeedbackCategory,
} from "@/lib/platform-feedback/general-definition";
import type { Prisma } from "@prisma/client";

export const GENERAL_FEEDBACK_PAGE_SIZE = 20;
export type GeneralFeedbackCategoryFilter = GeneralFeedbackCategory | "all";
export type GeneralFeedbackFilters = {
  category: GeneralFeedbackCategoryFilter;
  page: number;
};

export type GeneralFeedbackAdminPage = {
  total: number;
  page: number;
  pageCount: number;
  category: GeneralFeedbackCategoryFilter;
  rows: Array<{
    id: string;
    category: GeneralFeedbackCategory;
    message: string;
    submittedAt: string;
    role: string;
    locale: string;
  }>;
};

/** Unknown query values are ignored. A page is bounded to prevent extreme offsets. */
export function parseGeneralFeedbackFilters(params: URLSearchParams): GeneralFeedbackFilters {
  const category = params.get("category");
  const rawPage = params.get("page") ?? "1";
  const page = /^\d{1,6}$/.test(rawPage) ? Number(rawPage) : 1;
  return {
    category: isGeneralFeedbackCategory(category) ? category : "all",
    page: Math.min(100_000, Math.max(1, page)),
  };
}

export function generalFeedbackWhere(
  category: GeneralFeedbackCategoryFilter,
): Prisma.SurveySubmissionWhereInput {
  return {
    surveyType: GENERAL_FEEDBACK_SURVEY_TYPE,
    ...(category !== "all" ? { answers: { path: ["category"], equals: category } } : {}),
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

/** Only administrators may call this: enforce role in every page/route before invoking. */
export async function getGeneralFeedbackAdminPage(
  filters: GeneralFeedbackFilters,
): Promise<GeneralFeedbackAdminPage> {
  const where = generalFeedbackWhere(filters.category);
  const total = await prisma.surveySubmission.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / GENERAL_FEEDBACK_PAGE_SIZE));
  const page = Math.min(filters.page, pageCount);
  const submissions = await prisma.surveySubmission.findMany({
    where,
    orderBy: [{ submittedAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * GENERAL_FEEDBACK_PAGE_SIZE,
    take: GENERAL_FEEDBACK_PAGE_SIZE,
    select: {
      id: true,
      answers: true,
      submittedAt: true,
      roleAtSubmission: true,
      locale: true,
    },
  });
  return {
    total,
    page,
    pageCount,
    category: filters.category,
    rows: submissions.map((entry) => {
      const answers = asRecord(entry.answers);
      return {
        id: entry.id,
        category: isGeneralFeedbackCategory(answers.category) ? answers.category : "other",
        message: typeof answers.message === "string" ? answers.message : "",
        submittedAt: entry.submittedAt.toISOString(),
        role: entry.roleAtSubmission,
        locale: entry.locale,
      };
    }),
  };
}
