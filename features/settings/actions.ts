"use server";

import { isAppLocale } from "@/lib/i18n/locales";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateCurrentUserSettings({
  fullName,
  preferredLanguage,
  locale,
}: {
  fullName: string;
  preferredLanguage: string;
  locale: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  const normalizedFullName = fullName.trim();

  await prisma.profile.update({
    where: { id: user.id },
    data: {
      fullName: normalizedFullName.length > 0 ? normalizedFullName : null,
      preferredLanguage: isAppLocale(preferredLanguage) ? preferredLanguage : "en",
    },
  });

  revalidatePath(`/${locale}/settings`);
  revalidatePath(`/${locale}/dashboard`);

  return { success: true };
}
