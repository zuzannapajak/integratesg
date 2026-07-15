import { requireAuthenticatedUserId } from "@/lib/auth/require-authenticated-user-id";
import { getScenarioPathwayItemsForUser } from "@/lib/scenarios/simulator/server/scenario-pathway";
import { ScenarioMapClient } from "./scenario-map-client";

export type ScenariosPageProps = {
  readonly params: Promise<{
    readonly locale: string;
  }>;
};

export default async function ScenariosPage({ params }: ScenariosPageProps) {
  const [{ locale }, userId] = await Promise.all([params, requireAuthenticatedUserId()]);
  const items = await getScenarioPathwayItemsForUser(userId);

  return (
    <main className="min-h-full bg-[#f3f6f9] p-3 sm:p-5 md:h-full md:min-h-0 md:overflow-hidden lg:p-6">
      <div className="mx-auto w-full max-w-400 md:h-full md:min-h-0">
        <ScenarioMapClient locale={locale} items={items} />
      </div>
    </main>
  );
}
