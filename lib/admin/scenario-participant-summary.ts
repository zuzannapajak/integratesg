import type { AppRole } from "@/lib/auth/roles";

type ScenarioParticipationAttempt = {
  userId: string;
  role: AppRole;
  status: "incomplete" | "completed";
  completedAt: Date | null;
};

type ParticipationBucket = {
  participants: Set<string>;
  completedParticipants: Set<string>;
  attempts: number;
  completedAttempts: number;
};

export type ScenarioParticipantSummaryRow = {
  role: "all_non_admin" | AppRole;
  unique_participants: number;
  unique_completed_participants: number;
  attempts: number;
  completed_attempts: number;
};

const summaryRoles = ["all_non_admin", "educator", "learner", "admin"] as const;
const summaryHeaders = [
  "role",
  "unique_participants",
  "unique_completed_participants",
  "attempts",
  "completed_attempts",
] as const;

function createBucket(): ParticipationBucket {
  return {
    participants: new Set<string>(),
    completedParticipants: new Set<string>(),
    attempts: 0,
    completedAttempts: 0,
  };
}

/** Counts observed platform activity, not verified WP4 pilot participants. */
export function buildScenarioParticipantSummary(
  attempts: readonly ScenarioParticipationAttempt[],
): ScenarioParticipantSummaryRow[] {
  const buckets: Record<(typeof summaryRoles)[number], ParticipationBucket> = {
    all_non_admin: createBucket(),
    educator: createBucket(),
    learner: createBucket(),
    admin: createBucket(),
  };

  for (const attempt of attempts) {
    const completed = attempt.status === "completed" && attempt.completedAt !== null;
    const roles: (typeof summaryRoles)[number][] =
      attempt.role === "admin" ? ["admin"] : [attempt.role, "all_non_admin"];

    for (const role of roles) {
      const bucket = buckets[role];
      bucket.participants.add(attempt.userId);
      bucket.attempts += 1;

      if (completed) {
        bucket.completedParticipants.add(attempt.userId);
        bucket.completedAttempts += 1;
      }
    }
  }

  return summaryRoles.map((role) => {
    const bucket = buckets[role];

    return {
      role,
      unique_participants: bucket.participants.size,
      unique_completed_participants: bucket.completedParticipants.size,
      attempts: bucket.attempts,
      completed_attempts: bucket.completedAttempts,
    };
  });
}

export function buildScenarioParticipantSummaryCsv(rows: readonly ScenarioParticipantSummaryRow[]) {
  const csvCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;

  return [
    summaryHeaders.map(csvCell).join(","),
    ...rows.map((row) => summaryHeaders.map((header) => csvCell(row[header])).join(",")),
  ].join("\n");
}
