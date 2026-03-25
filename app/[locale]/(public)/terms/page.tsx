import PublicFooter from "@/components/layout/public-footer";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="bg-[#ececec]">
      <section className="relative overflow-hidden bg-white px-6 pb-14 pt-18 md:px-10 md:pb-18 md:pt-24 lg:px-14">
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top_left,rgba(49,66,90,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(13,127,194,0.10),transparent_32%)]" />

        <div className="relative mx-auto max-w-340">
          <div className="max-w-215">
            <p className="landing-section-eyebrow">Terms of use</p>

            <h1 className="mt-4 text-[2.4rem] font-black tracking-[-0.05em] text-[#31425a] sm:text-[3.1rem] lg:text-[4rem]">
              Rules for using the IntegratESG platform and its learning resources.
            </h1>

            <p className="mt-6 max-w-[65ch] text-[1.05rem] leading-8 text-[#596170] sm:text-[1.12rem]">
              This page outlines the general terms governing access to the platform, the use of its
              educational materials, and the expected standards of responsible use.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}`} className="landing-secondary-cta">
                Back to homepage
              </Link>
              <Link href={`/${locale}/legal-notice`} className="landing-primary-cta">
                Legal notice
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 md:py-14 lg:px-14">
        <div className="mx-auto grid max-w-340 gap-8 xl:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-[28px] border border-white/60 bg-white/88 p-6 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur md:p-8">
            <p className="landing-section-eyebrow">Quick overview</p>
            <h2 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
              Main use principles
            </h2>

            <div className="mt-6 space-y-4">
              {[
                "Access is limited to intended educational or project-related purposes",
                "Users should protect their login credentials",
                "Content should be used responsibly and lawfully",
                "Platform availability may evolve over time",
                "Specific institutional rules may also apply",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#31425a]/10 bg-[#31425a]/5 px-4 py-3 text-sm font-medium text-[#31425a]"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="rounded-4xl border border-white/60 bg-white/90 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.07)] backdrop-blur md:p-8 lg:p-10">
            <div className="space-y-10">
              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  1. Scope of use
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  The IntegratESG platform is intended to support educational, training, and
                  project-related activities connected with ESG awareness, vocational learning, and
                  practical competence development. Use of the platform should remain consistent
                  with its educational purpose.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  2. User responsibilities
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  Users are expected to use the platform responsibly, keep their credentials secure,
                  and avoid actions that could disrupt the service, compromise security, or
                  interfere with the learning experience of other users.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  3. Educational resources
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  The platform may provide access to learning modules, case studies, scenarios, and
                  supporting educational materials. These resources are provided for structured
                  learning and project-related dissemination. Their reuse, adaptation, or further
                  distribution may depend on the licensing terms applicable to each resource.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  4. Availability and changes
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  The platform may be updated, improved, reorganised, or temporarily unavailable due
                  to maintenance, development work, or technical reasons. The project team may
                  adjust features, content, or access arrangements as the platform evolves.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  5. Misuse and restrictions
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  Users must not attempt unauthorised access, interfere with the technical operation
                  of the platform, misuse learning resources, or use the service in ways contrary to
                  applicable law, institutional rules, or project purposes.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  6. Final note
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  This Terms of Use page provides a structured informational baseline for the
                  current project stage. It can later be expanded into a more detailed legal or
                  operational terms document once the final hosting, governance, and administrative
                  arrangements are fully defined.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter locale={locale} />
    </main>
  );
}
