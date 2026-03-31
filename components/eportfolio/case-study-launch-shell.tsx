"use client";

import CaseStudyCompletionButton from "@/components/eportfolio/case-study-completion-button";
import { ArrowLeft, Building2, Leaf, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const SURFACE =
  "rounded-[28px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

type CaseStudyDetail = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  area: string;
  organization: string | null;
  industry: string | null;
  isFeatured: boolean;
  keyTakeaways: string[];
  isCompleted: boolean;
  completedAt: string | null;
};

type Props = {
  locale: string;
  caseStudy: CaseStudyDetail;
};

function getAreaMeta(area: string, t: ReturnType<typeof useTranslations>) {
  switch (area) {
    case "environmental":
      return {
        label: t("area.environmental"),
        icon: <Leaf className="h-4 w-4" />,
        badgeClass: "border-emerald-100 bg-emerald-50 text-emerald-700",
      };
    case "social":
      return {
        label: t("area.social"),
        icon: <Users className="h-4 w-4" />,
        badgeClass: "border-sky-100 bg-sky-50 text-sky-700",
      };
    case "governance":
      return {
        label: t("area.governance"),
        icon: <ShieldCheck className="h-4 w-4" />,
        badgeClass: "border-violet-100 bg-violet-50 text-violet-700",
      };
    default:
      return {
        label: t("area.crossCutting"),
        icon: <Sparkles className="h-4 w-4" />,
        badgeClass: "border-amber-100 bg-amber-50 text-amber-700",
      };
  }
}

function splitContent(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export default function CaseStudyLaunchShell({ locale, caseStudy }: Props) {
  const t = useTranslations("Protected.CaseStudyLaunchShell");
  const areaMeta = getAreaMeta(caseStudy.area, t);
  const paragraphs = splitContent(caseStudy.content);

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] px-4 pb-20 pt-8 text-[#31425a] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(236,103,37,0.05),transparent_22%),radial-gradient(circle_at_84%_12%,rgba(13,127,194,0.05),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-5xl space-y-8">
        <div>
          <Link
            href={`/${locale}/eportfolio`}
            className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-[#5f6977] transition hover:text-[#31425a]"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            {t("back")}
          </Link>
        </div>

        <section className={`${SURFACE} overflow-hidden p-6 md:p-8`}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-wider ${areaMeta.badgeClass}`}
              >
                {areaMeta.icon}
                {areaMeta.label}
              </span>

              {caseStudy.isFeatured && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b9c72] px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-white shadow-sm">
                  <Sparkles className="h-3 w-3" />
                  {t("featured")}
                </span>
              )}

              {caseStudy.isCompleted && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-emerald-700">
                  <Sparkles className="h-3 w-3" />
                  {t("completed")}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {caseStudy.title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5f6c7b] md:text-[0.98rem]">
                {caseStudy.summary}
              </p>
            </div>

            <div className="grid gap-3 text-sm text-[#516071] sm:grid-cols-2">
              {caseStudy.organization && (
                <div className="rounded-2xl border border-[#edf1f5] bg-white px-4 py-3.5">
                  <div className="flex items-center gap-2 text-[#7b8794]">
                    <Building2 className="h-4 w-4" />
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em]">
                      {t("organization")}
                    </span>
                  </div>
                  <p className="mt-2 font-medium text-[#31425a]">{caseStudy.organization}</p>
                </div>
              )}

              {caseStudy.industry && (
                <div className="rounded-2xl border border-[#edf1f5] bg-white px-4 py-3.5">
                  <div className="flex items-center gap-2 text-[#7b8794]">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em]">
                      {t("industry")}
                    </span>
                  </div>
                  <p className="mt-2 font-medium text-[#31425a]">{caseStudy.industry}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className={`${SURFACE} p-6 md:p-8`}>
            <h2 className="text-xl font-semibold text-slate-900">{t("contentTitle")}</h2>
            <div className="mt-5 space-y-5 text-[0.98rem] leading-8 text-[#475467]">
              {paragraphs.map((paragraph, index) => (
                <p key={`${caseStudy.slug}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <CaseStudyCompletionButton
              slug={caseStudy.slug}
              initialIsCompleted={caseStudy.isCompleted}
              initialCompletedAt={caseStudy.completedAt}
            />

            <section className={`${SURFACE} p-6`}>
              <h2 className="text-lg font-semibold text-slate-900">{t("takeawaysTitle")}</h2>
              {caseStudy.keyTakeaways.length > 0 ? (
                <ul className="mt-4 space-y-3 text-sm leading-6 text-[#516071]">
                  {caseStudy.keyTakeaways.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0b9c72]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-6 text-[#667180]">{t("takeawaysEmpty")}</p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
