"use client";

import ScenarioPlayerFrame from "@/components/scenarios/scenario-player-frame";
import { ScenarioArea, ScenarioLaunchViewModel } from "@/lib/scenarios/types";
import { Leaf, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useMemo } from "react";

type Props = {
  locale: string;
  scenario: ScenarioLaunchViewModel;
};

function getAreaMeta(area: ScenarioArea) {
  switch (area) {
    case "environmental":
      return {
        label: "Environmental",
        icon: <Leaf className="h-4 w-4" />,
        badgeClass: "border-emerald-100 bg-emerald-50 text-emerald-700",
      };
    case "social":
      return {
        label: "Social",
        icon: <Users className="h-4 w-4" />,
        badgeClass: "border-sky-100 bg-sky-50 text-sky-700",
      };
    case "governance":
      return {
        label: "Governance",
        icon: <ShieldCheck className="h-4 w-4" />,
        badgeClass: "border-violet-100 bg-violet-50 text-violet-700",
      };
    default:
      return {
        label: "Cross-cutting",
        icon: <Sparkles className="h-4 w-4" />,
        badgeClass: "border-amber-100 bg-amber-50 text-amber-700",
      };
  }
}

export default function ScenarioLaunchShell({ locale, scenario }: Props) {
  const areaMeta = useMemo(() => getAreaMeta(scenario.area), [scenario.area]);

  return (
    <div className="mx-auto flex min-h-screen max-w-450 flex-col px-4 py-4 sm:px-6 lg:px-8">
      <header className="mb-4 rounded-[28px] border border-white/70 bg-white/88 px-5 py-4 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] ${areaMeta.badgeClass}`}
              >
                {areaMeta.icon}
                {areaMeta.label}
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#31425a] md:text-[2rem] md:pb-6">
                {scenario.title}
              </h1>
            </div>
          </div>
        </div>

        <ScenarioPlayerFrame
          title={scenario.title}
          src={scenario.launchUrl}
          backHref={`/${locale}/scenarios`}
        />
      </header>
    </div>
  );
}
