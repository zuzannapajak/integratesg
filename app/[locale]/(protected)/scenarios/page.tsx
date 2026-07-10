import { ScenarioMapClient } from "./scenario-map-client";

export type ScenariosPageProps = {
  readonly params: Promise<{
    readonly locale: string;
  }>;
};

export default async function ScenariosPage({ params }: ScenariosPageProps) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-[#f3f6f9] p-3 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-400">
        <ScenarioMapClient locale={locale} />
      </div>
    </main>
  );
}
