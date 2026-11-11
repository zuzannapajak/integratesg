/** Rules for the one-time WP3 closing self-assessment (regular and pilot paths). */
export function getWp3PostEligibility(
  assessment: {
    status: string;
    preAssessmentCompletedAt: Date | null;
    preAssessmentSkippedAt: Date | null;
    postAssessmentCompletedAt: Date | null;
  } | null,
  completedModulesCount: number,
): {
  eligible: boolean;
  reason: "no_pilot" | "pre_missing" | "post_completed" | "pilot_not_active" | "no_completed_module" | null;
} {
  if (!assessment) return { eligible: false, reason: "no_pilot" };
  if (!assessment.preAssessmentCompletedAt && !assessment.preAssessmentSkippedAt) {
    return { eligible: false, reason: "pre_missing" };
  }
  if (assessment.postAssessmentCompletedAt || assessment.status === "pilot_completed") {
    return { eligible: false, reason: "post_completed" };
  }
  if (assessment.status !== "pilot_active" && assessment.status !== "pre_skipped") {
    return { eligible: false, reason: "pilot_not_active" };
  }
  if (completedModulesCount < 1) {
    return { eligible: false, reason: "no_completed_module" };
  }
  return { eligible: true, reason: null };
}
