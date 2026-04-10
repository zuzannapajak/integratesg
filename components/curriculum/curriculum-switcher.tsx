"use client";

import CurriculumListShell from "@/components/curriculum/curriculum-list-shell";
import { CurriculumModuleViewModel } from "@/lib/curriculum/types";
import { BookOpen, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ViewMode = "my-courses" | "all-courses";

type Props = {
  locale: string;
  activeView: ViewMode;
  myCourses: CurriculumModuleViewModel[];
  allCourses: CurriculumModuleViewModel[];
};

export default function CurriculumSwitcher({ locale, activeView, myCourses, allCourses }: Props) {
  const t = useTranslations("Protected.CurriculumSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setViewMode(viewMode: ViewMode) {
    const params = new URLSearchParams(searchParams.toString());

    if (viewMode === "my-courses") {
      params.delete("view");
    } else {
      params.set("view", viewMode);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="inline-flex w-fit min-w-max rounded-2xl border border-[#e3e9ef] bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setViewMode("my-courses");
              }}
              className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
                activeView === "my-courses"
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
              className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
                activeView === "all-courses"
                  ? "bg-[#31425a] text-white shadow-sm"
                  : "text-[#5f6f82] hover:bg-[#f4f7fa]"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              {t("tabs.allCourses")}
            </button>
          </div>
        </div>
      </div>

      {activeView === "my-courses" ? (
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
