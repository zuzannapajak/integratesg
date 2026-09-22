import { prisma } from "@/lib/prisma";

const PROGRESS_SELECT = {
  id: true,
  caseStudyId: true,
  status: true,
  startedAt: true,
  lastOpenedAt: true,
  completedAt: true,
  createdAt: true,
} as const;

async function getPublishedCaseStudyId(slug: string): Promise<string> {
  const caseStudy = await prisma.caseStudy.findFirst({
    where: {
      slug,
      status: "published",
    },
    select: {
      id: true,
    },
  });

  if (!caseStudy) {
    throw new Error("Case study not found.");
  }

  return caseStudy.id;
}

async function getProgressOrThrow(userId: string, caseStudyId: string) {
  const progress = await prisma.userCaseStudyProgress.findUnique({
    where: {
      userId_caseStudyId: {
        userId,
        caseStudyId,
      },
    },
    select: PROGRESS_SELECT,
  });

  if (!progress) {
    throw new Error("Case study progress could not be loaded.");
  }

  return progress;
}

export async function touchEportfolioProgress(params: { userId: string; slug: string }) {
  const caseStudyId = await getPublishedCaseStudyId(params.slug);

  const now = new Date();

  const progress = await prisma.userCaseStudyProgress.upsert({
    where: {
      userId_caseStudyId: {
        userId: params.userId,
        caseStudyId,
      },
    },
    create: {
      userId: params.userId,
      caseStudyId,
      status: "in_progress",
      startedAt: now,
      lastOpenedAt: now,
    },
    update: {
      lastOpenedAt: now,
    },
    select: PROGRESS_SELECT,
  });

  if (!progress.startedAt) {
    await prisma.userCaseStudyProgress.updateMany({
      where: {
        id: progress.id,
        startedAt: null,
      },
      data: {
        startedAt: progress.createdAt,
      },
    });
  }

  if (progress.status !== "completed") {
    await prisma.userCaseStudyProgress.updateMany({
      where: {
        id: progress.id,
        status: {
          not: "completed",
        },
      },
      data: {
        status: "in_progress",
        lastOpenedAt: now,
        completedAt: null,
      },
    });
  }

  return getProgressOrThrow(params.userId, caseStudyId);
}

export async function completeEportfolioProgress(params: { userId: string; slug: string }) {
  const caseStudyId = await getPublishedCaseStudyId(params.slug);

  const now = new Date();

  const progress = await prisma.userCaseStudyProgress.upsert({
    where: {
      userId_caseStudyId: {
        userId: params.userId,
        caseStudyId,
      },
    },
    create: {
      userId: params.userId,
      caseStudyId,
      status: "completed",
      startedAt: now,
      lastOpenedAt: now,
      completedAt: now,
    },
    update: {
      lastOpenedAt: now,
    },
    select: PROGRESS_SELECT,
  });

  if (!progress.startedAt) {
    await prisma.userCaseStudyProgress.updateMany({
      where: {
        id: progress.id,
        startedAt: null,
      },
      data: {
        startedAt: progress.createdAt,
      },
    });
  }

  await prisma.userCaseStudyProgress.updateMany({
    where: {
      id: progress.id,
      OR: [
        {
          status: {
            not: "completed",
          },
        },
        {
          completedAt: null,
        },
      ],
    },
    data: {
      status: "completed",
      startedAt: progress.startedAt ?? progress.createdAt,
      lastOpenedAt: now,
      completedAt: progress.completedAt ?? now,
    },
  });

  return getProgressOrThrow(params.userId, caseStudyId);
}
