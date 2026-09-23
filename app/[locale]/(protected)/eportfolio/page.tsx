import EportfolioLibrary from "@/components/eportfolio/eportfolio-library";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { getEportfolioLibrary } from "@/lib/eportfolio/library";
import { CheckCircle2, LibraryBig } from "lucide-react";

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

  const completedCount = caseStudies.filter(
    (caseStudy) => caseStudy.progress === "completed",
  ).length;

  const progressPercent =
    caseStudies.length > 0 ? Math.round((completedCount / caseStudies.length) * 100) : 0;

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_8%,rgba(11,156,114,0.08),transparent_24%),radial-gradient(circle_at_86%_10%,rgba(13,127,194,0.05),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-360 px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <section className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/88 px-5 py-6 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl sm:px-7 sm:py-8 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_42%)]" />

          <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1.45fr)_340px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#0b8c69]">
                <LibraryBig className="h-4 w-4" />
                ePortfolio
              </div>

              <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-[#31425a] sm:text-4xl">
                ESG case study library
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#667180] sm:text-base">
                Explore real organisations and see how ESG principles are applied through
                environmental action, people practices, governance, reporting and value-chain
                decisions.
              </p>
            </div>

            <div className="rounded-3xl border border-[#e5ece9] bg-white/82 p-5 shadow-[0_8px_24px_rgba(35,45,62,0.04)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[#0b8c69]">
                    <CheckCircle2 className="h-4 w-4" />

                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em]">
                      Your progress
                    </span>
                  </div>

                  <p className="mt-2 text-lg font-bold text-[#31425a]">
                    {completedCount} of {caseStudies.length} completed
                  </p>
                </div>

                <span className="text-2xl font-bold text-[#31425a]">{progressPercent}%</span>
              </div>

              <div
                className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#e8eef1]"
                role="progressbar"
                aria-label="ePortfolio completion"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
              >
                <div
                  className="h-full rounded-full bg-[#0b9c72] transition-[width]"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
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
