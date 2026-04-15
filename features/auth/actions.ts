"use server";

import { isAppLocale } from "@/lib/i18n/locales";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type PublicRole = "learner" | "educator";

function resolveRole(email: string, requestedRole: PublicRole): "learner" | "educator" | "admin" {
  const allowlistRaw = process.env.ADMIN_EMAIL_ALLOWLIST ?? "";
  const allowlist = allowlistRaw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (allowlist.includes(email.toLowerCase())) {
    return "admin";
  }

  return requestedRole;
}

export async function createProfile({
  userId,
  email,
  role,
  fullName,
  preferredLanguage,
}: {
  userId: string;
  email: string;
  role: PublicRole;
  fullName?: string | null;
  preferredLanguage?: string;
}) {
  const finalRole = resolveRole(email, role);
  const normalizedLanguage =
    preferredLanguage && isAppLocale(preferredLanguage) ? preferredLanguage : "en";

  await prisma.profile.upsert({
    where: { id: userId },
    update: {
      email,
      role: finalRole,
      fullName: fullName ?? null,
      preferredLanguage: normalizedLanguage,
    },
    create: {
      id: userId,
      email,
      role: finalRole,
      fullName: fullName ?? null,
      preferredLanguage: normalizedLanguage,
    },
  });
}

export async function completeCurrentUserProfile({
  role,
  preferredLanguage,
}: {
  role: PublicRole;
  preferredLanguage?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  const email = user.email;
  if (!email) {
    throw new Error("Missing user email.");
  }

  const metadata = user.user_metadata;

  const fullName =
    typeof metadata.full_name === "string"
      ? metadata.full_name
      : typeof metadata.name === "string"
        ? metadata.name
        : null;

  const finalRole = resolveRole(email, role);
  const normalizedLanguage =
    preferredLanguage && isAppLocale(preferredLanguage) ? preferredLanguage : "en";

  await prisma.profile.upsert({
    where: { id: user.id },
    update: {
      email,
      role: finalRole,
      fullName,
      preferredLanguage: normalizedLanguage,
    },
    create: {
      id: user.id,
      email,
      role: finalRole,
      fullName,
      preferredLanguage: normalizedLanguage,
    },
  });
}
