/**
 * Module coverage describes an entire pilot cohort, not a per-learner quota.
 * The focus groups are recommendations; none of the other courses are locked.
 * Existing users retain their positions as later pre-assessments are recorded.
 */
export const PILOT_EXPECTED_MODULES = 6;
export const PILOT_FOCUS_MODULES = 2;

type Course = { id: string; slug: string; title: string };
type Pilot = { userId: string; preAssessmentCompletedAt: Date | string | null };
type Attempt = {
  userId: string;
  courseId: string;
  status: string;
  startedAt: Date | null;
  completedAt: Date | null;
};

export type PilotModuleCoverageRow = {
  id: string;
  slug: string;
  title: string;
  recommendedTo: number;
  startedBy: number;
  completedBy: number;
  completedByRecommended: number;
};

export type PilotModuleCoverage = {
  expectedModules: number;
  coveredModules: number;
  startedModules: number;
  activeParticipants: number;
  modules: PilotModuleCoverageRow[];
  focusCourseIdsByUser: Map<string, string[]>;
};

export function isCourseCompleted(attempt: Pick<Attempt, "status" | "completedAt">) {
  return attempt.status === "completed" || attempt.completedAt !== null;
}

export function startedAfterPreAssessment(
  attempt: Pick<Attempt, "startedAt" | "completedAt">,
  preAt: Date | string | null,
) {
  if (!preAt) return false;
  const earliestRecordedActivity = attempt.startedAt ?? attempt.completedAt;
  return (
    earliestRecordedActivity !== null &&
    new Date(earliestRecordedActivity).getTime() >= new Date(preAt).getTime()
  );
}

export function isCourseStarted(attempt: Attempt) {
  return (
    attempt.status !== "not_started" || attempt.startedAt !== null || attempt.completedAt !== null
  );
}

export function buildPilotModuleCoverage(input: {
  courses: Course[];
  pilots: Pilot[];
  attempts: Attempt[];
}): PilotModuleCoverage {
  const courses = input.courses;
  const eligiblePilots = input.pilots
    .filter(
      (pilot): pilot is Pilot & { preAssessmentCompletedAt: Date | string } =>
        pilot.preAssessmentCompletedAt !== null,
    )
    .sort((a, b) => {
      const delta =
        new Date(a.preAssessmentCompletedAt).getTime() -
        new Date(b.preAssessmentCompletedAt).getTime();

      return delta || a.userId.localeCompare(b.userId);
    });
  const eligibleUserIds = new Set(eligiblePilots.map((pilot) => pilot.userId));
  const pilotPreAt = new Map(
    eligiblePilots.map((pilot) => [pilot.userId, pilot.preAssessmentCompletedAt]),
  );
  const focusCourseIdsByUser = new Map<string, string[]>();

  // Round-robin three pairs, only for the six-module curriculum.
  // A new participant doesn't change the allocation of earlier participants.
  if (courses.length === PILOT_EXPECTED_MODULES) {
    eligiblePilots.forEach((pilot, index) => {
      const slot = index % 3;
      focusCourseIdsByUser.set(pilot.userId, [courses[slot].id, courses[slot + 3].id]);
    });
  }

  const started = new Map<string, Set<string>>();
  const completed = new Map<string, Set<string>>();
  for (const attempt of input.attempts) {
    if (
      !eligibleUserIds.has(attempt.userId) ||
      !startedAfterPreAssessment(attempt, pilotPreAt.get(attempt.userId) ?? null)
    )
      continue;
    if (isCourseStarted(attempt)) {
      const users = started.get(attempt.courseId) ?? new Set<string>();
      users.add(attempt.userId);
      started.set(attempt.courseId, users);
    }

    if (isCourseCompleted(attempt)) {
      const users = completed.get(attempt.courseId) ?? new Set<string>();
      users.add(attempt.userId);
      completed.set(attempt.courseId, users);
    }
  }

  const modules = courses.map((course): PilotModuleCoverageRow => {
    const assignedUsers = [...focusCourseIdsByUser]
      .filter(([, courseIds]) => courseIds.includes(course.id))
      .map(([userId]) => userId);
    const completedUsers = completed.get(course.id) ?? new Set<string>();
    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      recommendedTo: assignedUsers.length,
      startedBy: started.get(course.id)?.size ?? 0,
      completedBy: completedUsers.size,
      completedByRecommended: assignedUsers.filter((userId) => completedUsers.has(userId)).length,
    };
  });

  return {
    expectedModules: PILOT_EXPECTED_MODULES,
    coveredModules: modules.filter((module) => module.completedBy > 0).length,
    startedModules: modules.filter((module) => module.startedBy > 0).length,
    activeParticipants: eligiblePilots.length,
    modules,
    focusCourseIdsByUser,
  };
}
