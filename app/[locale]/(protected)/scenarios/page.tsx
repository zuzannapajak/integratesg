import { requireAuthenticatedUserId } from "@/lib/auth/require-authenticated-user-id";
import { getScenarioPathwayItemsForUser } from "@/lib/scenarios/simulator/server/scenario-pathway";
import { ScenarioMapClient } from "./scenario-map-client";
import Wp4SurveyCallout from "@/components/wp4-surveys/wp4-survey-callout";
import { getWp4SurveyAvailability } from "@/lib/wp4-surveys/queries";
import { getWp4PlatformFeedbackEligibility } from "@/lib/platform-feedback/wp4-eligibility";

export type ScenariosPageProps = {
  readonly params: Promise<{
    readonly locale: string;
  }>;
};

export default async function ScenariosPage({ params }: ScenariosPageProps) {
  const [{ locale }, userId] = await Promise.all([params, requireAuthenticatedUserId()]);
  const [items, survey, platform] = await Promise.all([
    getScenarioPathwayItemsForUser(userId, locale),
    getWp4SurveyAvailability(userId, "scenarios"),
    getWp4PlatformFeedbackEligibility(userId),
  ]);

  return (
    <main className="min-h-full bg-[#f3f6f9] p-3 sm:p-5 md:h-full md:min-h-0 md:overflow-hidden lg:p-6">
      <div className="mx-auto flex w-full max-w-400 flex-col md:h-full md:min-h-0">
        <Wp4SurveyCallout
          locale={locale}
          scope="scenarios"
          canCompleteSurvey={survey.eligible}
          canGivePlatformFeedback={platform.eligible}
        />
        <div className="min-h-0 flex-1">
          <ScenarioMapClient locale={locale} items={items} />
        </div>
      </div>
    </main>
  );
}
