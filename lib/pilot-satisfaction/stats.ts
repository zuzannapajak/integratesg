import "server-only";
import { prisma } from "@/lib/prisma";
import { summarizePilotSatisfaction } from "@/lib/pilot-satisfaction/metrics";

export async function getPilotSatisfactionStats() {
  const rows = await prisma.pilotSatisfactionSubmission.findMany({
    select: { userId: true, scope: true, countryCode: true, overallSatisfaction: true },
  });
  return summarizePilotSatisfaction(rows);
}

