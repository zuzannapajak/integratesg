"use client";

import ScenarioPlayerFrame from "@/components/scenarios/scenario-player-frame";
import { markScenarioCompletedAction } from "@/features/scenarios/actions";
import { ScenarioArea, ScenarioLaunchViewModel } from "@/lib/scenarios/types";
import {
  CheckCircle2,
  CircleDashed,
  Leaf,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

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

function getStatusMeta(status: ScenarioLaunchViewModel["status"]) {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        description: "This scenario has already been marked as completed.",
        badgeClass: "border-emerald-100 bg-emerald-50 text-emerald-700",
        icon: <CheckCircle2 className="h-4 w-4" />,
      };
    case "in_progress":
      return {
        label: "In progress",
        description: "You can continue the scenario and mark it as completed when finished.",
        badgeClass: "border-sky-100 bg-sky-50 text-sky-700",
        icon: <CircleDashed className="h-4 w-4" />,
      };
    default:
      return {
        label: "Not started",
        description: "Launch the scenario to begin your tracked learning attempt.",
        badgeClass: "border-slate-200 bg-slate-50 text-slate-700",
        icon: <CircleDashed className="h-4 w-4" />,
      };
  }
}

function formatDate(value: string | null) {
  if (!value) return "Not available";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

export default function ScenarioLaunchShell({ locale, scenario: initialScenario }: Props) {
  const [scenario, setScenario] = useState(initialScenario);
  const [isPending, startTransition] = useTransition();

  const areaMeta = useMemo(() => getAreaMeta(scenario.area), [scenario.area]);
  const statusMeta = useMemo(() => getStatusMeta(scenario.status), [scenario.status]);

  const handleMarkCompleted = () => {
    startTransition(async () => {
      try {
        const result = await markScenarioCompletedAction({
          locale,
          scenarioSlug: scenario.slug,
        });

        setScenario(result.scenario);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-450 flex-col px-4 py-4 sm:px-6 lg:px-8">
      <header className="mb-4 rounded-[28px] border border-white/70 bg-white/88 px-5 py-5 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] ${areaMeta.badgeClass}`}
                >
                  {areaMeta.icon}
                  {areaMeta.label}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] ${statusMeta.badgeClass}`}
                >
                  {statusMeta.icon}
                  {statusMeta.label}
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#31425a] md:text-[2rem]">
                  {scenario.title}
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667180]">
                  {scenario.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 xl:min-w-65">
              <button
                type="button"
                onClick={handleMarkCompleted}
                disabled={isPending || scenario.status === "completed"}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347] disabled:cursor-not-allowed disabled:bg-[#98a2b3]"
              >
                <Trophy className="h-4 w-4" />
                {scenario.status === "completed"
                  ? "Completed"
                  : isPending
                    ? "Saving completion..."
                    : "Mark as completed"}
              </button>

              <p className="text-xs leading-6 text-[#7b8794]">
                Use this after finishing the interactive experience to save a basic completion
                record.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-3xl border border-[#e8edf3] bg-white/76 p-4">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                Completion status
              </p>
              <p className="mt-3 text-lg font-semibold text-[#31425a]">{statusMeta.label}</p>
              <p className="mt-1 text-sm leading-6 text-[#667180]">{statusMeta.description}</p>
            </div>

            <div className="rounded-3xl border border-[#e8edf3] bg-white/76 p-4">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                Score
              </p>
              <p className="mt-3 text-lg font-semibold text-[#31425a]">
                {scenario.score !== null ? `${scenario.score}%` : "—"}
              </p>
              <p className="mt-1 text-sm leading-6 text-[#667180]">
                A score will appear when the scenario sends measurable results.
              </p>
            </div>

            <div className="rounded-3xl border border-[#e8edf3] bg-white/76 p-4">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                Last completion
              </p>
              <p className="mt-3 text-lg font-semibold text-[#31425a]">
                {formatDate(scenario.completedAt)}
              </p>
              <p className="mt-1 text-sm leading-6 text-[#667180]">
                The most recent tracked completion timestamp for this scenario.
              </p>
            </div>
          </div>

          <ScenarioPlayerFrame
            title={scenario.title}
            src={scenario.launchUrl}
            backHref={`/${locale}/scenarios`}
          />
        </div>
      </header>
    </div>
  );
}
