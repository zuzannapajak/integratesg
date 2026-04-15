import ScenarioLaunchShell from "@/components/scenarios/scenario-launch-shell";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { getScenarioLaunch, logScenarioLaunch } from "@/lib/scenarios/queries";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ScenarioLaunchPage({ params }: Props) {
  const { locale, slug } = await params;
  const { profile } = await requireRole(locale, [APP_ROLES.learner, APP_ROLES.educator]);

  await logScenarioLaunch({
    locale,
    userId: profile.id,
    slug,
  });

  const scenario = await getScenarioLaunch({
    locale,
    userId: profile.id,
    slug,
  });

  if (!scenario) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3]">
      <ScenarioLaunchShell locale={locale} scenario={scenario} />
    </main>
  );
}
