import ScenarioLibraryShell from "@/components/scenarios/scenario-library-shell";
import { prisma } from "@/lib/prisma";
import { getScenarioLibrary } from "@/lib/scenarios/queries";
import { createClient } from "@/lib/supabase/server";
import { PlayCircle } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ScenariosPage({ params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    redirect(`/${locale}/auth/login`);
  }

  const items = await getScenarioLibrary({ locale });

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] px-4 pb-20 pt-8 text-[#31425a] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(236,103,37,0.05),transparent_22%),radial-gradient(circle_at_84%_12%,rgba(13,127,194,0.05),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8 transition-all duration-300">
        <header className="mb-8 flex items-center gap-4 px-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white text-[#0b9c72] shadow-sm">
            <PlayCircle className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#31425a]">Scenario simulator</h1>
            <p className="text-[#667180]">Practice decision-making in realistic contexts.</p>
          </div>
        </header>

        <ScenarioLibraryShell items={items} />
      </div>
    </main>
  );
}
