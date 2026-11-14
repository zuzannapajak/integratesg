"use server";

import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { GENERAL_FEEDBACK_SURVEY_TYPE } from "@/lib/platform-feedback/general-definition";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/** Delete only an informal report, never a WP3/WP4 pilot submission. */
export async function deleteGeneralFeedbackAction(formData: FormData): Promise<void> {
  const locale = formData.get("locale");
  const id = formData.get("id");
  if (typeof locale !== "string" || !["en", "pl", "de", "it", "bg", "el"].includes(locale)) {
    throw new Error("INVALID_LOCALE");
  }
  await requireRole(locale, APP_ROLES.admin);
  if (typeof id !== "string" || id.length < 5 || id.length > 128) {
    throw new Error("INVALID_FEEDBACK_ID");
  }
  await prisma.surveySubmission.deleteMany({
    where: { id, surveyType: GENERAL_FEEDBACK_SURVEY_TYPE },
  });
  revalidatePath(`/${locale}/admin/feedback`);
  revalidatePath(`/${locale}/admin/stats`);
  revalidatePath(`/${locale}/admin/platform-feedback`);
}
