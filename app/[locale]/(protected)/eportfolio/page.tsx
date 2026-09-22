import EportfolioLibrary from "@/components/eportfolio/eportfolio-library";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { getEportfolioLibrary } from "@/lib/eportfolio/library";
import { Building2, CheckCircle2, Globe2, LibraryBig } from "lucide-react";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function EportfolioPage({ params }: Props) {
  const { locale } = await params;

  const { user } = await requireRole(locale, [APP_ROLES.learner, APP_ROLES.educator]);

  const caseStudies = await getEportfolioLibrary({
    locale,
    userId: user.id,
  });

  const countryCount = new Set(caseStudies.map((caseStudy) => caseStudy.countryCode)).size;

  const industryCount = new Set(
    caseStudies
      .map((caseStudy) => caseStudy.industry)
      .filter((industry): industry is string => Boolean(industry)),
  ).size;

  const completedCount = caseStudies.filter(
    (caseStudy) => caseStudy.progress === "completed",
  ).length;

  const progressPercent =
    caseStudies.length > 0 ? Math.round((completedCount / caseStudies.length) * 100) : 0;

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_8%,rgba(11,156,114,0.08),transparent_24%),radial-gradient(circle_at_86%_10%,rgba(13,127,194,0.06),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-360 px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-white/70 bg-[#243346] px-5 py-7 text-white shadow-[0_18px_50px_rgba(35,45,62,0.13)] sm:px-8 sm:py-9 lg:px-10">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.8fr)] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white/78">
                <LibraryBig className="h-4 w-4 text-emerald-300" />
                ePortfolio
              </div>

              <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.7rem] lg:leading-[1.08]">
                ESG case study library
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
                Explore real organisations and see how ESG principles are applied through
                environmental action, people practices, governance, reporting and value-chain
                decisions.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />

                      <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/55">
                        Your progress
                      </span>
                    </div>

                    <p className="mt-2 text-lg font-semibold text-white">
                      {completedCount} of {caseStudies.length} completed
                    </p>
                  </div>

                  <span className="text-2xl font-semibold text-white">{progressPercent}%</span>
                </div>

                <div
                  className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-label="ePortfolio completion"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progressPercent}
                >
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-[width]"
                    style={{
                      width: `${progressPercent}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <HeroMetric icon={<LibraryBig />} value={caseStudies.length} label="Case studies" />

                <HeroMetric icon={<Globe2 />} value={countryCount} label="Countries" />

                <HeroMetric icon={<Building2 />} value={industryCount} label="Industries" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7">
          {caseStudies.length > 0 ? (
            <EportfolioLibrary locale={locale} items={caseStudies} />
          ) : (
            <div className="rounded-[28px] border border-white/70 bg-white/88 px-6 py-12 text-center shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-[#31425a]">
                No case studies are available yet
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#667180]">
                Published case studies will appear here once they are added to the ePortfolio
                library.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function HeroMetric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-4 backdrop-blur-sm sm:px-4">
      <div className="flex items-center gap-2 text-emerald-300 [&_svg]:h-4 [&_svg]:w-4">
        {icon}

        <span className="text-xl font-semibold text-white sm:text-2xl">{value}</span>
      </div>

      <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-white/55 sm:text-[0.72rem]">
        {label}
      </p>
    </div>
  );
}
