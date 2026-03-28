import ScenarioSwitcher from "@/components/scenarios/scenario-switcher";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { getAllScenarioLibrary, getMyScenarioLibrary } from "@/lib/scenarios/queries";
import { PlayCircle } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ScenariosPage({ params }: Props) {
  const { locale } = await params;
  const { user } = await requireRole(locale, [APP_ROLES.student, APP_ROLES.educator]);

  const [myScenarios, allScenarios] = await Promise.all([
    getMyScenarioLibrary({ userId: user.id, locale }),
    getAllScenarioLibrary({ userId: user.id, locale }),
  ]);

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20 transition-all duration-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(11,156,114,0.07),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.07),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8 transition-all duration-300">
        <header className="mb-8 flex items-center gap-4 px-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white text-[#0b9c72] shadow-sm">
            <PlayCircle className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#31425a]">Scenario simulator</h1>
            <p className="text-[#667180]">
              Practice decision-making in realistic contexts with trackable scenario progress
            </p>
          </div>
        </header>

        <ScenarioSwitcher myScenarios={myScenarios} allScenarios={allScenarios} />
      </div>
    </main>
  );
}
