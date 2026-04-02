"use client";

import CurriculumListShell from "@/components/curriculum/curriculum-list-shell";
import { CurriculumModuleViewModel } from "@/lib/curriculum/types";
import { BookOpen, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type ViewMode = "my-courses" | "all-courses";

type Props = {
  locale: string;
  myCourses: CurriculumModuleViewModel[];
  allCourses: CurriculumModuleViewModel[];
};

export default function CurriculumSwitcher({ locale, myCourses, allCourses }: Props) {
  const t = useTranslations("Protected.CurriculumSwitcher");
  const [viewMode, setViewMode] = useState<ViewMode>("my-courses");

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-2xl border border-[#e3e9ef] bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => {
              setViewMode("my-courses");
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              viewMode === "my-courses"
                ? "bg-[#31425a] text-white shadow-sm"
                : "text-[#5f6f82] hover:bg-[#f4f7fa]"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            {t("tabs.myCourses")}
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode("all-courses");
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              viewMode === "all-courses"
                ? "bg-[#31425a] text-white shadow-sm"
                : "text-[#5f6f82] hover:bg-[#f4f7fa]"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            {t("tabs.allCourses")}
          </button>
        </div>
      </div>

      {viewMode === "my-courses" ? (
        <CurriculumListShell
          locale={locale}
          items={myCourses}
          showRefineControls={false}
          emptyTitle={t("empty.noModulesTitle")}
          emptyDescription={t("empty.noModulesDescription")}
        />
      ) : (
        <CurriculumListShell
          locale={locale}
          items={allCourses}
          showRefineControls
          emptyTitle={t("empty.noResultsTitle")}
          emptyDescription={t("empty.noResultsDescription")}
        />
      )}
    </section>
  );
}
