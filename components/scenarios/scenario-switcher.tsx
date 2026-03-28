"use client";

import ScenarioLibraryShell from "@/components/scenarios/scenario-list-shell";
import { ScenarioListItemViewModel } from "@/lib/scenarios/types";
import { PlayCircle, Sparkles } from "lucide-react";
import { useState } from "react";

type ViewMode = "my-scenarios" | "all-scenarios";

type Props = {
  myScenarios: ScenarioListItemViewModel[];
  allScenarios: ScenarioListItemViewModel[];
};

export default function ScenarioSwitcher({ myScenarios, allScenarios }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("my-scenarios");

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-2xl border border-[#e3e9ef] bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => {
              setViewMode("my-scenarios");
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              viewMode === "my-scenarios"
                ? "bg-[#31425a] text-white shadow-sm"
                : "text-[#5f6f82] hover:bg-[#f4f7fa]"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            My scenarios
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode("all-scenarios");
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              viewMode === "all-scenarios"
                ? "bg-[#31425a] text-white shadow-sm"
                : "text-[#5f6f82] hover:bg-[#f4f7fa]"
            }`}
          >
            <PlayCircle className="h-4 w-4" />
            All scenarios
          </button>
        </div>
      </div>

      {viewMode === "my-scenarios" ? (
        <ScenarioLibraryShell
          items={myScenarios}
          showRefineControls={false}
          emptyTitle="No tracked scenarios yet"
          emptyDescription="Start a scenario to build your personal scenario library and return to it later."
        />
      ) : (
        <ScenarioLibraryShell
          items={allScenarios}
          showRefineControls
          emptyTitle="No scenarios found"
          emptyDescription="Try adjusting the ESG area filter or search phrase to explore scenario metadata."
        />
      )}
    </section>
  );
}
