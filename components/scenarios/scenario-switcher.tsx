"use client";

import ScenarioListShell from "@/components/scenarios/scenario-list-shell";
import { ScenarioListItemViewModel } from "@/lib/scenarios/types";
import { PlayCircle, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type ViewMode = "my-scenarios" | "all-scenarios";

type Props = {
  locale: string;
  myScenarios: ScenarioListItemViewModel[];
  allScenarios: ScenarioListItemViewModel[];
};

export default function ScenarioSwitcher({ locale, myScenarios, allScenarios }: Props) {
  const t = useTranslations("Protected.ScenarioSwitcher");
  const [viewMode, setViewMode] = useState<ViewMode>("my-scenarios");

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="inline-flex w-fit min-w-max rounded-2xl border border-[#e3e9ef] bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setViewMode("my-scenarios");
              }}
              className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
                viewMode === "my-scenarios"
                  ? "bg-[#31425a] text-white shadow-sm"
                  : "text-[#5f6f82] hover:bg-[#f4f7fa]"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              {t("tabs.mine")}
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode("all-scenarios");
              }}
              className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
                viewMode === "all-scenarios"
                  ? "bg-[#31425a] text-white shadow-sm"
                  : "text-[#5f6f82] hover:bg-[#f4f7fa]"
              }`}
            >
              <PlayCircle className="h-4 w-4" />
              {t("tabs.all")}
            </button>
          </div>
        </div>
      </div>

      {viewMode === "my-scenarios" ? (
        <ScenarioListShell
          locale={locale}
          items={myScenarios}
          showRefineControls={false}
          emptyTitle={t("empty.mineTitle")}
          emptyDescription={t("empty.mineDescription")}
        />
      ) : (
        <ScenarioListShell
          locale={locale}
          items={allScenarios}
          showRefineControls
          emptyTitle={t("empty.allTitle")}
          emptyDescription={t("empty.allDescription")}
        />
      )}
    </section>
  );
}
