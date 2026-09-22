"use server";

import { requireAuthenticatedUserId } from "@/lib/auth/require-authenticated-user-id";
import { completeEportfolioProgress, touchEportfolioProgress } from "@/lib/eportfolio/progress";
import { revalidatePath } from "next/cache";

type CaseStudyActionInput = {
  slug: string;
  locale: string;
};

type LegacyCompleteCaseStudyInput =
  | string
  | {
      slug: string;
      locale?: string;
    };

function validateSlug(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Invalid case study slug.");
  }
}

function validateLocale(locale: string) {
  if (!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(locale)) {
    throw new Error("Invalid locale.");
  }
}

function revalidateEportfolioPaths(locale: string, slug: string) {
  revalidatePath(`/${locale}/eportfolio`);
  revalidatePath(`/${locale}/eportfolio/${slug}`);
}

function serializeProgress(progress: {
  status: "not_started" | "in_progress" | "completed";
  startedAt: Date | null;
  lastOpenedAt: Date | null;
  completedAt: Date | null;
}) {
  return {
    status: progress.status,
    startedAt: progress.startedAt?.toISOString() ?? null,
    lastOpenedAt: progress.lastOpenedAt?.toISOString() ?? null,
    completedAt: progress.completedAt?.toISOString() ?? null,
  };
}

export async function touchCaseStudyProgressAction(input: CaseStudyActionInput) {
  validateSlug(input.slug);
  validateLocale(input.locale);

  const userId = await requireAuthenticatedUserId();

  const progress = await touchEportfolioProgress({
    userId,
    slug: input.slug,
  });

  revalidateEportfolioPaths(input.locale, input.slug);

  return serializeProgress(progress);
}

export async function completeCaseStudyAction(input: CaseStudyActionInput) {
  validateSlug(input.slug);
  validateLocale(input.locale);

  const userId = await requireAuthenticatedUserId();

  const progress = await completeEportfolioProgress({
    userId,
    slug: input.slug,
  });

  revalidateEportfolioPaths(input.locale, input.slug);

  return serializeProgress(progress);
}

/**
 * Compatibility with the older
 * CaseStudyCompletionButton component.
 */
export async function markCaseStudyCompletedAction(
  input: LegacyCompleteCaseStudyInput,
  locale?: string,
) {
  const slug = typeof input === "string" ? input : input.slug;

  const resolvedLocale = typeof input === "string" ? locale : input.locale;

  validateSlug(slug);

  if (resolvedLocale) {
    validateLocale(resolvedLocale);
  }

  const userId = await requireAuthenticatedUserId();

  const progress = await completeEportfolioProgress({
    userId,
    slug,
  });

  if (resolvedLocale) {
    revalidateEportfolioPaths(resolvedLocale, slug);
  }

  return serializeProgress(progress);
}
