export const GENERAL_FEEDBACK_COOLDOWN_MS = 60_000;
export const GENERAL_FEEDBACK_HOURLY_LIMIT = 10;

/** Checks an authenticated user's recent submissions; run inside a serializable DB transaction. */
export function feedbackIsRateLimited(recent: readonly Date[], now: Date): boolean {
  if (recent.length >= GENERAL_FEEDBACK_HOURLY_LIMIT) return true;
  return recent.some(
    (submittedAt) => now.getTime() - submittedAt.getTime() < GENERAL_FEEDBACK_COOLDOWN_MS,
  );
}
