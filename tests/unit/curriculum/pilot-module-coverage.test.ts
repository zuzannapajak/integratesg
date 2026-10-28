import { describe, expect, it } from "vitest";
import { buildPilotModuleCoverage } from "@/lib/curriculum/pilot-coverage";

const courses = Array.from({ length: 6 }, (_, index) => ({
  id: `c${index + 1}`,
  slug: `module-${index + 1}`,
  title: `Module ${index + 1}`,
}));
const pilots = Array.from({ length: 9 }, (_, index) => ({
  userId: `u${index + 1}`,
  preAssessmentCompletedAt: new Date(Date.UTC(2026, 9, 22, 10, index)),
}));
const attempt = (
  userId: string,
  courseId: string,
  status: string,
  completedAt: Date | null = null,
) => ({
  userId,
  courseId,
  status,
  startedAt: status === "not_started" ? null : new Date(Date.UTC(2026, 9, 22, 11)),
  completedAt,
});

describe("six-module pilot coverage", () => {
  it("balances focus recommendations across six modules, independently of input order", () => {
    const result = buildPilotModuleCoverage({
      courses,
      pilots: [...pilots].reverse(),
      attempts: [],
    });
    expect(result.modules.map((module) => module.recommendedTo)).toEqual([3, 3, 3, 3, 3, 3]);
    expect(result.focusCourseIdsByUser.get("u1")).toEqual(["c1", "c4"]);
    expect(result.focusCourseIdsByUser.get("u2")).toEqual(["c2", "c5"]);
    expect(result.focusCourseIdsByUser.get("u3")).toEqual(["c3", "c6"]);
  });

  it("retains focus assignments after later participants join", () => {
    const initial = buildPilotModuleCoverage({ courses, pilots: pilots.slice(0, 3), attempts: [] });
    const later = buildPilotModuleCoverage({ courses, pilots: pilots.slice(0, 8), attempts: [] });
    for (const user of pilots.slice(0, 3))
      expect(later.focusCourseIdsByUser.get(user.userId)).toEqual(
        initial.focusCourseIdsByUser.get(user.userId),
      );
  });

  it("does not count skipped pre-assessments or unrelated activity", () => {
    const result = buildPilotModuleCoverage({
      courses,
      pilots: [...pilots.slice(0, 1), { userId: "skipped", preAssessmentCompletedAt: null }],
      attempts: [
        attempt("skipped", "c2", "completed", new Date()),
        attempt("u1", "c1", "in_progress"),
      ],
    });
    expect(result.activeParticipants).toBe(1);
    expect(result.startedModules).toBe(1);
    expect(result.coveredModules).toBe(0);
  });

  it("deduplicates attempts per user and counts actual completions", () => {
    const result = buildPilotModuleCoverage({
      courses,
      pilots,
      attempts: [
        attempt("u1", "c1", "completed", new Date()),
        attempt("u1", "c1", "completed", new Date()),
        attempt("u2", "c2", "in_progress"),
        attempt("u1", "c4", "completed", new Date()),
      ],
    });
    expect(result.startedModules).toBe(3);
    expect(result.coveredModules).toBe(2);
    expect(result.modules[0].completedBy).toBe(1);
    expect(result.modules[3].completedByRecommended).toBe(1);
    expect(result.modules[1].startedBy).toBe(1);
  });

  it("excludes course activity recorded before the participant completed pre-assessment", () => {
    const result = buildPilotModuleCoverage({
      courses,
      pilots: pilots.slice(0, 1),
      attempts: [
        {
          userId: "u1",
          courseId: "c1",
          status: "completed",
          startedAt: new Date(Date.UTC(2026, 9, 22, 9)),
          completedAt: new Date(Date.UTC(2026, 9, 22, 10, 30)),
        },
        {
          userId: "u1",
          courseId: "c4",
          status: "completed",
          startedAt: new Date(Date.UTC(2026, 9, 22, 11)),
          completedAt: new Date(Date.UTC(2026, 9, 22, 12)),
        },
      ],
    });
    expect(result.coveredModules).toBe(1);
    expect(result.modules[0].completedBy).toBe(0);
    expect(result.modules[3].completedBy).toBe(1);
  });

  it("does not invent recommendations when curriculum does not have exactly six published modules", () => {
    const result = buildPilotModuleCoverage({ courses: courses.slice(0, 5), pilots, attempts: [] });
    expect(result.focusCourseIdsByUser.size).toBe(0);
    expect(result.expectedModules).toBe(6);
    expect(result.coveredModules).toBe(0);
  });
});
