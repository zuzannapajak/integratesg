import PublicFooter from "@/components/layout/public-footer";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="bg-[#ececec]">
      <section className="relative overflow-hidden bg-white px-6 pb-14 pt-18 md:px-10 md:pb-18 md:pt-24 lg:px-14">
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top_left,rgba(13,127,194,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(236,103,37,0.10),transparent_32%)]" />

        <div className="relative mx-auto max-w-340">
          <div className="max-w-215">
            <p className="landing-section-eyebrow">Privacy policy</p>

            <h1 className="mt-4 text-[2.4rem] font-black tracking-[-0.05em] text-[#31425a] sm:text-[3.1rem] lg:text-[4rem]">
              How we handle personal data on the IntegratESG platform.
            </h1>

            <p className="mt-6 max-w-[65ch] text-[1.05rem] leading-8 text-[#596170] sm:text-[1.12rem]">
              This page explains what personal data may be processed through the platform, why it is
              processed, and how users can understand and manage their privacy-related rights.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}`} className="landing-secondary-cta">
                Back to homepage
              </Link>
              <Link href={`/${locale}/accessibility`} className="landing-primary-cta">
                Accessibility statement
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 md:py-14 lg:px-14">
        <div className="mx-auto grid max-w-340 gap-8 xl:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-[28px] border border-white/60 bg-white/88 p-6 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur md:p-8">
            <p className="landing-section-eyebrow">Overview</p>
            <h2 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
              Key privacy principles
            </h2>

            <div className="mt-6 space-y-4">
              {[
                "Transparency in data processing",
                "Limited and purpose-based data collection",
                "Secure storage and access control",
                "Respect for user rights",
                "Ongoing review and improvement",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#0d7fc2]/10 bg-[#0d7fc2]/5 px-4 py-3 text-sm font-medium text-[#31425a]"
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
                  1. Purpose of this policy
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  This Privacy Policy describes how personal data may be processed in connection
                  with the IntegratESG platform. Its purpose is to provide users with clear
                  information about what data is used, why it may be used, and the general
                  safeguards applied to protect user privacy.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  2. Types of data that may be processed
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {[
                    "Account information such as name, email address, and role",
                    "Authentication-related data needed for secure sign-in",
                    "Learning progress information within platform modules",
                    "Technical data required for platform performance and security",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#e7ebf0] bg-[#fcfcfd] p-4 text-[0.98rem] leading-7 text-[#5e6776]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  3. Why data may be processed
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  Personal data may be processed to enable user authentication, provide access to
                  learning materials, save user progress, ensure platform security, and support
                  platform administration or reporting activities related to the project.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  4. User rights
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  Depending on the applicable legal framework, users may have rights related to
                  access, correction, restriction, objection, deletion, or portability of their
                  personal data. Specific implementation details may depend on the platform operator
                  and legal obligations applicable in the relevant jurisdiction.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  5. Security and confidentiality
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  The platform should apply appropriate technical and organisational measures to
                  protect user data against unauthorised access, accidental loss, or misuse. Access
                  to personal data should be limited to authorised processes and roles.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  6. Final note
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  This page provides a structured informational version of the privacy principles
                  used on the platform. It can be expanded later into a full project-level privacy
                  notice once legal, institutional, and hosting details are finalised.
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
