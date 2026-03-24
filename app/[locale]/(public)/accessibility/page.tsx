import PublicFooter from "@/components/layout/public-footer";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AccessibilityPage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="bg-[#ececec]">
      <section className="relative overflow-hidden bg-white px-6 pb-14 pt-18 md:px-10 md:pb-18 md:pt-24 lg:px-14">
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top_left,rgba(11,156,114,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(13,127,194,0.10),transparent_32%)]" />

        <div className="relative mx-auto max-w-[1360px]">
          <div className="max-w-[860px]">
            <p className="landing-section-eyebrow">Accessibility statement</p>

            <h1 className="mt-4 text-[2.4rem] font-black tracking-[-0.05em] text-[#31425a] sm:text-[3.1rem] lg:text-[4rem]">
              Commitment to accessible and inclusive digital learning.
            </h1>

            <p className="mt-6 max-w-[65ch] text-[1.05rem] leading-8 text-[#596170] sm:text-[1.12rem]">
              The IntegratESG platform is intended to support accessible use across devices,
              contexts, and user groups by promoting clarity, responsiveness, and inclusive
              interaction patterns.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}`} className="landing-secondary-cta">
                Back to homepage
              </Link>
              <Link href={`/${locale}/privacy`} className="landing-primary-cta">
                Privacy policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 md:py-14 lg:px-14">
        <div className="mx-auto grid max-w-[1360px] gap-8 xl:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-[28px] border border-white/60 bg-white/88 p-6 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur md:p-8">
            <p className="landing-section-eyebrow">Accessibility focus</p>
            <h2 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
              Design priorities
            </h2>

            <div className="mt-6 space-y-4">
              {[
                "Readable contrast and visual hierarchy",
                "Responsive layouts for desktop and mobile",
                "Keyboard-friendly interaction patterns",
                "Clear navigation and predictable structure",
                "Continuous improvement through review",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#0b9c72]/10 bg-[#0b9c72]/5 px-4 py-3 text-sm font-medium text-[#31425a]"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.07)] backdrop-blur md:p-8 lg:p-10">
            <div className="space-y-10">
              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  1. Accessibility approach
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  The platform is designed with the intention of supporting an inclusive learning
                  experience. This includes attention to clarity of layout, understandable content
                  structure, responsiveness, and basic accessibility principles relevant to
                  web-based educational tools.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  2. Measures supporting accessibility
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {[
                    "Consistent page structure and clear section headings",
                    "Readable typography and sufficient spacing",
                    "Responsive layouts adapting to smaller screens",
                    "Interactive elements designed to remain understandable and visible",
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
                  3. Areas for ongoing improvement
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  Accessibility is an ongoing process rather than a one-time task. Further
                  improvements may include broader testing, refinement of interaction details, and
                  adjustments based on user feedback or formal accessibility review.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  4. Feedback and support
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  If a user encounters barriers while using the platform, the issue should be
                  documented and reviewed so that future iterations of the service can improve the
                  accessibility and usability of the experience.
                </p>
              </section>

              <section>
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  5. Final note
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#596170]">
                  This statement presents a structured accessibility overview for the current stage
                  of the platform. It can later be expanded into a more formal accessibility
                  declaration if required by institutional or legal obligations.
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
