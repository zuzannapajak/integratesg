import type { CurriculumPilotFocus } from "@/lib/curriculum/pilot-focus";
import { BookOpen, CheckCircle2, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Props = { locale: string; focus: CurriculumPilotFocus | null };

export default async function CurriculumPilotFocusModules({ locale, focus }: Props) {
  if (!focus?.modules.length) return null;
  const t = await getTranslations({ locale, namespace: "Protected.CurriculumPilotFocusModules" });

  return (
    <section
      aria-labelledby="pilot-focus-title"
      className="mb-6 rounded-[28px] border border-[#dce7f2] bg-white p-5 shadow-[0_12px_34px_rgba(35,45,62,0.06)] md:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eaf5fc] text-[#0d7fc2]">
          <BookOpen className="h-5 w-5" />
        </span>
        <div>
          <h2 id="pilot-focus-title" className="text-lg font-bold text-[#31425a]">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#667180]">{t("description")}</p>
          <p className="mt-2 text-xs font-semibold text-[#0b9c72]">
            {t("progress", { completed: focus.completedFocusCount, total: focus.modules.length })}
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {focus.modules.map((module) => (
          <Link
            key={module.slug}
            href={`/${locale}/curriculum/${module.slug}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-[#e2eaf2] bg-[#f8fafc] px-4 py-3 text-sm text-[#31425a] transition hover:border-[#9cb7ce] hover:bg-white"
          >
            <span className="flex items-center gap-2 font-semibold">
              {module.completed ? (
                <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0 text-[#0b9c72]" />
              ) : (
                <BookOpen aria-hidden="true" className="h-5 w-5 shrink-0 text-[#0d7fc2]" />
              )}
              {module.title}
            </span>
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </Link>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-[#667180]">{t("openAccess")}</p>
    </section>
  );
}
