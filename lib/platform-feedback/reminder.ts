import { prisma } from "@/lib/prisma";

const REMIND_LATER_DAYS = 7;

export type PlatformFeedbackReminderState = {
  shouldShow: boolean;
};

export async function getPlatformFeedbackReminderState(
  userId: string,
): Promise<PlatformFeedbackReminderState> {
  const reminder = await prisma.platformFeedbackReminder.findUnique({
    where: {
      userId,
    },
    select: {
      dismissedAt: true,
      remindLaterAt: true,
      submittedAt: true,
    },
  });

  if (!reminder) {
    return {
      shouldShow: true,
    };
  }

  if (reminder.submittedAt || reminder.dismissedAt) {
    return {
      shouldShow: false,
    };
  }

  if (reminder.remindLaterAt) {
    const remindAgainAt = new Date(reminder.remindLaterAt);
    remindAgainAt.setDate(remindAgainAt.getDate() + REMIND_LATER_DAYS);

    return {
      shouldShow: new Date() >= remindAgainAt,
    };
  }

  return {
    shouldShow: true,
  };
}
