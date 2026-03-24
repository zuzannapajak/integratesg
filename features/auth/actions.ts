"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type PublicRole = "student" | "educator";

function resolveRole(email: string, requestedRole: PublicRole): "student" | "educator" | "admin" {
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
}: {
  userId: string;
  email: string;
  role: PublicRole;
  fullName?: string | null;
}) {
  const finalRole = resolveRole(email, role);

  await prisma.profile.upsert({
    where: { id: userId },
    update: {
      email,
      role: finalRole,
      fullName: fullName ?? null,
    },
    create: {
      id: userId,
      email,
      role: finalRole,
      fullName: fullName ?? null,
    },
  });
}

export async function completeCurrentUserProfile({ role }: { role: PublicRole }) {
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

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null;

  const finalRole = resolveRole(email, role);

  await prisma.profile.upsert({
    where: { id: user.id },
    update: {
      email,
      role: finalRole,
      fullName,
    },
    create: {
      id: user.id,
      email,
      role: finalRole,
      fullName,
    },
  });
}
