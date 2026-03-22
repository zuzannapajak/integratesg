"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function createProfile({
  userId,
  email,
  role,
}: {
  userId: string;
  email: string;
  role: "student" | "educator";
}) {
  await prisma.profile.upsert({
    where: { id: userId },
    update: {
      email,
      role,
    },
    create: {
      id: userId,
      email,
      role,
    },
  });
}

export async function completeCurrentUserProfile({ role }: { role: "student" | "educator" }) {
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

  await prisma.profile.upsert({
    where: { id: user.id },
    update: {
      email,
      role,
    },
    create: {
      id: user.id,
      email,
      role,
    },
  });
}
