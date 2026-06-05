"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function getAuthedUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user.id;
}

export async function remindPlatformFeedbackLaterAction() {
  const userId = await getAuthedUserId();

  await prisma.platformFeedbackReminder.upsert({
    where: {
      userId,
    },
    update: {
      remindLaterAt: new Date(),
      dismissedAt: null,
    },
    create: {
      userId,
      remindLaterAt: new Date(),
      dismissedAt: null,
    },
  });

  return {
    ok: true,
  };
}

export async function dismissPlatformFeedbackReminderAction() {
  const userId = await getAuthedUserId();

  await prisma.platformFeedbackReminder.upsert({
    where: {
      userId,
    },
    update: {
      dismissedAt: new Date(),
    },
    create: {
      userId,
      dismissedAt: new Date(),
    },
  });

  return {
    ok: true,
  };
}
