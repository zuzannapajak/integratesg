import { prisma } from "@/lib/prisma";

export type CurriculumPilotEntryGateState = {
  shouldShowGate: boolean;
  status: "pre_prompt_shown" | "pre_skipped" | "pilot_active" | "pilot_completed";
  preAssessmentSeenAt: string | null;
  preAssessmentSkippedAt: string | null;
  preAssessmentCompletedAt: string | null;
  postAssessmentCompletedAt: string | null;
};

function mapGateState(pilot: {
  status: "pre_prompt_shown" | "pre_skipped" | "pilot_active" | "pilot_completed";
  preAssessmentSeenAt: Date | null;
  preAssessmentSkippedAt: Date | null;
  preAssessmentCompletedAt: Date | null;
  postAssessmentCompletedAt: Date | null;
}): CurriculumPilotEntryGateState {
  const preDecisionMade = Boolean(pilot.preAssessmentSkippedAt ?? pilot.preAssessmentCompletedAt);

  return {
    shouldShowGate: pilot.status === "pre_prompt_shown" && !preDecisionMade,
    status: pilot.status,
    preAssessmentSeenAt: pilot.preAssessmentSeenAt?.toISOString() ?? null,
    preAssessmentSkippedAt: pilot.preAssessmentSkippedAt?.toISOString() ?? null,
    preAssessmentCompletedAt: pilot.preAssessmentCompletedAt?.toISOString() ?? null,
    postAssessmentCompletedAt: pilot.postAssessmentCompletedAt?.toISOString() ?? null,
  };
}

export async function getCurriculumPilotEntryGateState(params: {
  userId: string;
}): Promise<CurriculumPilotEntryGateState> {
  const existingPilot = await prisma.curriculumPilot.findUnique({
    where: {
      userId: params.userId,
    },
    select: {
      status: true,
      preAssessmentSeenAt: true,
      preAssessmentSkippedAt: true,
      preAssessmentCompletedAt: true,
      postAssessmentCompletedAt: true,
    },
  });

  if (!existingPilot) {
    const now = new Date();

    const createdPilot = await prisma.curriculumPilot.create({
      data: {
        userId: params.userId,
        status: "pre_prompt_shown",
        preAssessmentSeenAt: now,
      },
      select: {
        status: true,
        preAssessmentSeenAt: true,
        preAssessmentSkippedAt: true,
        preAssessmentCompletedAt: true,
        postAssessmentCompletedAt: true,
      },
    });

    return mapGateState(createdPilot);
  }

  if (existingPilot.status === "pre_prompt_shown" && !existingPilot.preAssessmentSeenAt) {
    const updatedPilot = await prisma.curriculumPilot.update({
      where: {
        userId: params.userId,
      },
      data: {
        preAssessmentSeenAt: new Date(),
      },
      select: {
        status: true,
        preAssessmentSeenAt: true,
        preAssessmentSkippedAt: true,
        preAssessmentCompletedAt: true,
        postAssessmentCompletedAt: true,
      },
    });

    return mapGateState(updatedPilot);
  }

  return mapGateState(existingPilot);
}
