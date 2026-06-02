"use server";

import { isAppLocale } from "@/lib/i18n/locales";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type PublicRole = "learner" | "educator";
type AppRole = "learner" | "educator" | "admin";

function resolveRole(email: string, requestedRole: PublicRole): AppRole {
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

function resolvePreferredLanguage(preferredLanguage?: string) {
  return preferredLanguage && isAppLocale(preferredLanguage) ? preferredLanguage : "en";
}

function getFullNameFromMetadata(metadata: Record<string, unknown>) {
  if (typeof metadata.full_name === "string") {
    return metadata.full_name;
  }

  if (typeof metadata.name === "string") {
    return metadata.name;
  }

  return null;
}

async function upsertProfileByUserOrEmail({
  userId,
  email,
  role,
  fullName,
  preferredLanguage,
}: {
  userId: string;
  email: string;
  role: AppRole;
  fullName?: string | null;
  preferredLanguage: string;
}) {
  const existingById = await prisma.profile.findUnique({
    where: { id: userId },
  });

  if (existingById) {
    const existingByEmail = await prisma.profile.findUnique({
      where: { email },
    });

    if (existingByEmail && existingByEmail.id !== userId) {
      console.warn("[auth/profile] Email already belongs to another profile", {
        currentUserId: userId,
        existingProfileId: existingByEmail.id,
        email,
      });

      throw new Error("A profile with this email already exists.");
    }

    await prisma.profile.update({
      where: { id: userId },
      data: {
        email,
        role,
        fullName: fullName ?? null,
        preferredLanguage,
      },
    });

    return;
  }

  const existingByEmail = await prisma.profile.findUnique({
    where: { email },
  });

  if (existingByEmail) {
    console.warn("[auth/profile] Re-attaching existing profile to current Supabase user", {
      previousProfileId: existingByEmail.id,
      currentUserId: userId,
      email,
    });

    await prisma.profile.update({
      where: { email },
      data: {
        id: userId,
        role,
        fullName: fullName ?? null,
        preferredLanguage,
      },
    });

    return;
  }

  await prisma.profile.create({
    data: {
      id: userId,
      email,
      role,
      fullName: fullName ?? null,
      preferredLanguage,
    },
  });
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
  const normalizedLanguage = resolvePreferredLanguage(preferredLanguage);

  try {
    await upsertProfileByUserOrEmail({
      userId,
      email,
      role: finalRole,
      fullName,
      preferredLanguage: normalizedLanguage,
    });
  } catch (error) {
    console.error("[auth/createProfile] Profile write failed", {
      userId,
      email,
      role: finalRole,
      preferredLanguage: normalizedLanguage,
      error,
    });

    throw error;
  }
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
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("[complete-profile] Supabase getUser failed", {
      name: userError.name,
      message: userError.message,
      status: "status" in userError ? userError.status : undefined,
    });

    throw new Error("Could not verify current user.");
  }

  if (!user) {
    console.error("[complete-profile] Unauthorized: no Supabase user");
    throw new Error("Unauthorized.");
  }

  const email = user.email;

  if (!email) {
    console.error("[complete-profile] Missing user email", {
      userId: user.id,
    });

    throw new Error("Missing user email.");
  }

  const metadata = user.user_metadata;
  const fullName = getFullNameFromMetadata(metadata);
  const finalRole = resolveRole(email, role);
  const normalizedLanguage = resolvePreferredLanguage(preferredLanguage);

  try {
    await upsertProfileByUserOrEmail({
      userId: user.id,
      email,
      role: finalRole,
      fullName,
      preferredLanguage: normalizedLanguage,
    });
  } catch (error) {
    console.error("[complete-profile] Profile write failed", {
      userId: user.id,
      email,
      role: finalRole,
      preferredLanguage: normalizedLanguage,
      error,
    });

    throw new Error("Could not complete user profile.");
  }
}
