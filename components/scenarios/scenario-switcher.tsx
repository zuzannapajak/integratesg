"use client";

import ScenarioListShell from "@/components/scenarios/scenario-list-shell";
import { ScenarioListItemViewModel } from "@/lib/scenarios/types";
import { PlayCircle, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

type ViewMode = "my-scenarios" | "all-scenarios";

type Props = {
  locale: string;
  activeView: ViewMode;
  myScenarios: ScenarioListItemViewModel[];
  allScenarios: ScenarioListItemViewModel[];
};

export default function ScenarioSwitcher({ locale, activeView, myScenarios, allScenarios }: Props) {
  const t = useTranslations("Protected.ScenarioSwitcher");

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="inline-flex w-fit min-w-max rounded-2xl border border-[#e3e9ef] bg-white p-1 shadow-sm">
            <Link
              href={`/${locale}/scenarios?view=my-scenarios`}
              scroll={false}
              className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
                activeView === "my-scenarios"
                  ? "bg-[#31425a] text-white shadow-sm"
                  : "text-[#5f6f82] hover:bg-[#f4f7fa]"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              {t("tabs.mine")}
            </Link>

            <Link
              href={`/${locale}/scenarios?view=all-scenarios`}
              scroll={false}
              className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
                activeView === "all-scenarios"
                  ? "bg-[#31425a] text-white shadow-sm"
                  : "text-[#5f6f82] hover:bg-[#f4f7fa]"
              }`}
            >
              <PlayCircle className="h-4 w-4" />
              {t("tabs.all")}
            </Link>
          </div>
        </div>
      </div>

      {activeView === "my-scenarios" ? (
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
