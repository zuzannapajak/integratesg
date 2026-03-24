"use server";

import { SelfServiceRole } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function createProfile({
  userId,
  email,
  role,
  fullName,
}: {
  userId: string;
  email: string;
  role: SelfServiceRole;
  fullName?: string | null;
}) {
  await prisma.profile.upsert({
    where: { id: userId },
    update: {
      email,
      role,
      fullName: fullName ?? null,
    },
    create: {
      id: userId,
      email,
      role,
      fullName: fullName ?? null,
    },
  });
}

export async function completeCurrentUserProfile({ role }: { role: SelfServiceRole }) {
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
    typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata.name === "string"
        ? user.user_metadata.name
        : null;

  await prisma.profile.upsert({
    where: { id: user.id },
    update: {
      email,
      role,
      fullName,
    },
    create: {
      id: user.id,
      email,
      role,
      fullName,
    },
  });
}
