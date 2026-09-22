"use server";

import { requireAuthenticatedUserId } from "@/lib/auth/require-authenticated-user-id";
import { markCaseStudyCompleted, touchCaseStudyProgress } from "@/lib/eportfolio/queries";
import { prisma } from "@/lib/prisma";
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

async function getPublishedCaseStudy(slug: string) {
  const caseStudy = await prisma.caseStudy.findFirst({
    where: {
      slug,
      status: "published",
    },
    select: {
      id: true,
    },
  });

  if (!caseStudy) {
    throw new Error("Case study not found.");
  }

  return caseStudy;
}

function revalidateEportfolioPaths(locale: string, slug: string) {
  revalidatePath(`/${locale}/eportfolio`);
  revalidatePath(`/${locale}/eportfolio/${slug}`);
}

export async function touchCaseStudyProgressAction(input: CaseStudyActionInput) {
  validateSlug(input.slug);
  validateLocale(input.locale);

  const userId = await requireAuthenticatedUserId();

  await getPublishedCaseStudy(input.slug);

  await touchCaseStudyProgress({
    userId,
    slug: input.slug,
  });

  revalidateEportfolioPaths(input.locale, input.slug);
}

export async function completeCaseStudyAction(input: CaseStudyActionInput) {
  validateSlug(input.slug);
  validateLocale(input.locale);

  const userId = await requireAuthenticatedUserId();

  await getPublishedCaseStudy(input.slug);

  await markCaseStudyCompleted({
    userId,
    slug: input.slug,
  });

  revalidateEportfolioPaths(input.locale, input.slug);
}

/**
 * Backwards-compatible action used by the older
 * CaseStudyCompletionButton component.
 *
 * New code should use completeCaseStudyAction().
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

  const caseStudy = await getPublishedCaseStudy(slug);

  await markCaseStudyCompleted({
    userId,
    slug,
  });

  const progress = await prisma.userCaseStudyProgress.findUnique({
    where: {
      userId_caseStudyId: {
        userId,
        caseStudyId: caseStudy.id,
      },
    },
    select: {
      completedAt: true,
    },
  });

  if (!progress?.completedAt) {
    throw new Error("Case study completion was not saved.");
  }

  if (resolvedLocale) {
    revalidateEportfolioPaths(resolvedLocale, slug);
  }

  return {
    completedAt: progress.completedAt.toISOString(),
  };
}
