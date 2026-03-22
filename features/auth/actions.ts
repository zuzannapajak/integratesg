"use server";

import { prisma } from "@/lib/prisma";

export async function createProfile({
  userId,
  email,
  role,
}: {
  userId: string;
  email: string;
  role: "educator" | "student";
}) {
  await prisma.profile.create({
    data: {
      id: userId,
      email,
      role,
    },
  });
}
