import { describe, expect, it } from "vitest";

import {
  buildScenarioParticipantSummary,
  buildScenarioParticipantSummaryCsv,
} from "@/lib/admin/scenario-participant-summary";

const completedAt = new Date("2026-10-20T10:00:00.000Z");

describe("Scenario Simulator participant activity summary", () => {
  it("deduplicates users across scenarios and repeat attempts, but counts every attempt", () => {
    const rows = buildScenarioParticipantSummary([
      { userId: "educator-a", role: "educator", status: "incomplete", completedAt: null },
      { userId: "educator-a", role: "educator", status: "completed", completedAt },
      { userId: "educator-a", role: "educator", status: "completed", completedAt },
      { userId: "learner-a", role: "learner", status: "completed", completedAt },
      { userId: "learner-b", role: "learner", status: "incomplete", completedAt: null },
      { userId: "admin-a", role: "admin", status: "completed", completedAt },
    ]);

    expect(rows).toEqual([
      {
        role: "all_non_admin",
        unique_participants: 3,
        unique_completed_participants: 2,
        attempts: 5,
        completed_attempts: 3,
      },
      {
        role: "educator",
        unique_participants: 1,
        unique_completed_participants: 1,
        attempts: 3,
        completed_attempts: 2,
      },
      {
        role: "learner",
        unique_participants: 2,
        unique_completed_participants: 1,
        attempts: 2,
        completed_attempts: 1,
      },
      {
        role: "admin",
        unique_participants: 1,
        unique_completed_participants: 1,
        attempts: 1,
        completed_attempts: 1,
      },
    ]);
  });

  it("only counts completion when both the status and completion timestamp are recorded", () => {
    const rows = buildScenarioParticipantSummary([
      { userId: "a", role: "learner", status: "completed", completedAt: null },
      { userId: "b", role: "learner", status: "incomplete", completedAt },
    ]);

    expect(rows[0].unique_participants).toBe(2);
    expect(rows[0].unique_completed_participants).toBe(0);
    expect(rows[0].completed_attempts).toBe(0);
  });

  it("returns zero counts for all roles without scenario activity", () => {
    const rows = buildScenarioParticipantSummary([]);

    expect(rows).toHaveLength(4);
    expect(rows.every((row) => row.unique_participants === 0 && row.attempts === 0)).toBe(true);
  });

  it("exports aggregated counts without personally identifiable information", () => {
    const csv = buildScenarioParticipantSummaryCsv(
      buildScenarioParticipantSummary([
        { userId: "private-user-id", role: "educator", status: "completed", completedAt },
      ]),
    );

    expect(csv).toContain('"role","unique_participants","unique_completed_participants"');
    expect(csv).toContain('"all_non_admin","1","1","1","1"');
    expect(csv).not.toContain("private-user-id");
  });
});
