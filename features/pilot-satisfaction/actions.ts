"use server";

import { prisma } from "@/lib/prisma";
import { requireAuthenticatedUserId } from "@/lib/auth/require-authenticated-user-id";
import { isAppLocale } from "@/lib/i18n/locales";
import {
  normalizePilotSatisfactionInput,
  type PilotSatisfactionInput,
} from "@/lib/pilot-satisfaction/validation";
import { revalidatePath } from "next/cache";

export async function submitPilotSatisfactionAction(input: PilotSatisfactionInput) {
  const userId = await requireAuthenticatedUserId();
  if (!isAppLocale(input.locale)) throw new Error("INVALID_LOCALE");
  const data = normalizePilotSatisfactionInput(input);

  await prisma.$transaction(async (tx) => {
    const profile = await tx.profile.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!profile || !["learner", "educator"].includes(profile.role)) {
      throw new Error("NOT_ALLOWED");
    }
    if (data.scope === "curriculum") {
      if (profile.role !== "educator") throw new Error("NOT_ALLOWED");
      const pilot = await tx.curriculumPilot.findUnique({
        where: { userId },
        select: { postAssessmentCompletedAt: true },
      });
      if (!pilot?.postAssessmentCompletedAt) throw new Error("CURRICULUM_PILOT_NOT_FINISHED");
    } else {
      if (!data.caseStudyId) throw new Error("INVALID_CASE_STUDY");
      const completedCaseStudy = await tx.userCaseStudyProgress.findFirst({
        where: {
          userId,
          caseStudyId: data.caseStudyId,
          status: "completed",
          caseStudy: { status: "published" },
        },
        select: { id: true },
      });
      if (!completedCaseStudy) throw new Error("CASE_STUDY_NOT_COMPLETED");
    }
    // Unique constraint (userId, scope) also protects concurrent double submissions.
    await tx.pilotSatisfactionSubmission.create({
      data: { ...data, userId },
    });
  });
  revalidatePath(`/${input.locale}/pilot-satisfaction/${data.scope}`);
  revalidatePath(`/${input.locale}/curriculum`);
  revalidatePath(`/${input.locale}/eportfolio`);
  revalidatePath(`/${input.locale}/admin/pilot-satisfaction`);
  return { ok: true };
}
