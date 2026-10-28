import {
  PILOT_COUNTRIES,
  PILOT_SURVEY_SCOPES,
  type PilotSurveyScope,
} from "@/lib/pilot-satisfaction/validation";

const TARGET_PER_COUNTRY = 15; // National operational planning target; official WP3 results require Google Forms reconciliation.

export function summarizePilotSatisfaction(
  rows: Array<{
    userId: string;
    scope: string;
    countryCode: string;
    overallSatisfaction: number;
  }>,
) {
  return PILOT_SURVEY_SCOPES.map((scope) => ({
    scope,
    byCountry: PILOT_COUNTRIES.map((countryCode) => {
      const group = rows.filter((row) => row.scope === scope && row.countryCode === countryCode);
      const uniqueCount = new Set(group.map((row) => row.userId)).size;
      return {
        countryCode,
        respondents: uniqueCount,
        target: TARGET_PER_COUNTRY,
        remaining: Math.max(0, TARGET_PER_COUNTRY - uniqueCount),
        averageSatisfaction: group.length
          ? Number(
              (
                group.reduce((total, row) => total + row.overallSatisfaction, 0) / group.length
              ).toFixed(2),
            )
          : null,
      };
    }),
  }));
}

export type PilotSurveySummary = ReturnType<typeof summarizePilotSatisfaction>;

export function getPolishPilotCounts(
  summary: PilotSurveySummary,
): Record<PilotSurveyScope, number> {
  return Object.fromEntries(
    PILOT_SURVEY_SCOPES.map((scope) => [
      scope,
      summary
        .find((item) => item.scope === scope)
        ?.byCountry.find((row) => row.countryCode === "PL")?.respondents ?? 0,
    ]),
  ) as Record<PilotSurveyScope, number>;
}
