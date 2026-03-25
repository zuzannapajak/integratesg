import PublicFooter from "@/components/layout/public-footer";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LegalNoticePage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="bg-[#ececec]">
      <section className="relative overflow-hidden bg-white px-6 pb-14 pt-18 md:px-10 md:pb-18 md:pt-24 lg:px-14">
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top_left,rgba(236,103,37,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(49,66,90,0.10),transparent_32%)]" />

        <div className="relative mx-auto max-w-340">
          <div className="max-w-215">
            <p className="landing-section-eyebrow">Legal notice</p>

            <h1 className="mt-4 text-[2.4rem] font-black tracking-[-0.05em] text-[#31425a] sm:text-[3.1rem] lg:text-[4rem]">
              Basic legal and organisational information about the platform.
            </h1>

            <p className="mt-6 max-w-[65ch] text-[1.05rem] leading-8 text-[#596170] sm:text-[1.12rem]">
              This page provides a structured legal information area that can later be extended with
              detailed institutional, administrative, and compliance-related data.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}`} className="landing-secondary-cta">
                Back to homepage
              </Link>
              <Link href={`/${locale}/terms`} className="landing-primary-cta">
                Terms of use
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 md:py-14 lg:px-14">
        <div className="mx-auto grid max-w-340 gap-8 xl:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-[28px] border border-white/60 bg-white/88 p-6 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur md:p-8">
            <p className="landing-section-eyebrow">Notice structure</p>
            <h2 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
              Typical information areas
            </h2>

            <div className="mt-6 space-y-4">
              {[
                "Project and platform identity",
                "Institutional or organisational operator",
                "General contact and communication details",
                "Intellectual property and ownership information",
                "Legal and compliance references",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#ef6c23]/10 bg-[#ef6c23]/5 px-4 py-3 text-sm font-medium text-[#31425a]"
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
                  1. Platform identity
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  The IntegratESG platform is developed in connection with the IntegratESG project
                  as a digital learning environment supporting ESG-related educational and practical
                  learning activities.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  2. Organisational responsibility
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  Depending on the final operational setup, the platform may be administered or
                  maintained by a project partner, coordinating institution, or another designated
                  entity responsible for technical operation and project delivery.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  3. Contact and communication
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  Project-related, technical, or institutional contact details may be published here
                  once the final communication model is confirmed. This section can later include
                  email addresses, institutional references, or other formal contact points.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  4. Intellectual property
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  Platform content, design elements, and educational resources may be subject to
                  specific ownership, licensing, or attribution requirements. The exact rules for
                  reuse and adaptation should be interpreted in line with the licensing model
                  applicable to each resource or project output.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  5. Informational nature of this page
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  This Legal Notice is currently presented as a structured informational page for
                  the current stage of the platform. It can later be expanded into a more formal
                  legal disclosure area with complete institutional and jurisdiction-specific
                  details.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  6. Final note
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  This page is intended to create a clear legal-information placeholder within the
                  public part of the platform and support a more complete and trustworthy user
                  experience.
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
