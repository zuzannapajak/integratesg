"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ALLOWED_LANGUAGES = ["en", "pl"] as const;
type AllowedLanguage = (typeof ALLOWED_LANGUAGES)[number];

function isAllowedLanguage(value: string): value is AllowedLanguage {
  return ALLOWED_LANGUAGES.includes(value as AllowedLanguage);
}

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
      preferredLanguage: isAllowedLanguage(preferredLanguage) ? preferredLanguage : "en",
    },
  });

  revalidatePath(`/${locale}/settings`);
  revalidatePath(`/${locale}/dashboard`);

  return { success: true };
}
