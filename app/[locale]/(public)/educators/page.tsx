import PublicFooter from "@/components/layout/public-footer";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

const educatorBenefits = [
  {
    title: "Structured curriculum access",
    description:
      "Use organised ESG learning modules that support teaching, guided learning, and professional development.",
  },
  {
    title: "Scenario-based learning",
    description:
      "Bring practice into the classroom with interactive scenarios that help learners apply ESG concepts in context.",
  },
  {
    title: "Case study ePortfolio",
    description:
      "Work with practical examples presented in a shared structure, making comparison and discussion easier.",
  },
  {
    title: "Multilingual learning environment",
    description:
      "Access resources in partner languages and support more inclusive, cross-context educational use.",
  },
];

const educatorUseCases = [
  {
    title: "Teaching support",
    description:
      "Educators can integrate platform resources into lectures, workshops, or guided project work.",
  },
  {
    title: "Self-assessment and reflection",
    description:
      "The platform supports pre- and post-learning reflection, helping users monitor progress and understanding.",
  },
  {
    title: "Practice-oriented explanation",
    description:
      "Abstract ESG concepts can be explained through scenarios and real or modelled examples.",
  },
];

const educatorHighlights = [
  "Roadmap-oriented learning support",
  "Scenario-based teaching resources",
  "Structured ESG case studies",
  "Content suitable for practical classroom use",
  "Clear, modern interface for guided learning",
  "Designed for vocational and applied education contexts",
];

export default async function EducatorsPage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="bg-[#ececec]">
      <section className="relative overflow-hidden bg-white px-6 pb-10 pt-8 md:px-10 md:pb-12 md:pt-10 lg:px-14 lg:pt-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(236,103,37,0.16),transparent_24%),radial-gradient(circle_at_86%_22%,rgba(13,127,194,0.20),transparent_28%),linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(249,250,251,0.98)_58%,rgba(255,255,255,0.96)_100%)]" />

        <div className="relative mx-auto grid max-w-340 min-h-[calc(100vh-104px)] items-center gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
          <div className="max-w-215 pb-4 lg:pb-0">
            <p className="landing-section-eyebrow">For educators</p>

            <h1 className="mt-4 text-[2.2rem] font-black leading-[0.95] tracking-[-0.05em] text-[#31425a] sm:text-[3rem] lg:text-[3.65rem]">
              A practical ESG teaching space designed for vocational education.
            </h1>

            <p className="mt-5 max-w-[62ch] text-[1.02rem] leading-8 text-[#596170] sm:text-[1.08rem]">
              The platform helps educators explain ESG topics through structured learning resources,
              interactive scenarios, and case-based content that supports practical, applied
              teaching.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#educators-content" className="landing-secondary-cta">
                Read more
              </a>
              <Link href={`/${locale}/auth/register`} className="landing-primary-cta">
                Create educator account
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto h-97.5 w-full max-w-130">
              <div className="absolute left-0 top-10 h-55 w-55 rounded-[32px] bg-[#ec6725]/18 blur-3xl" />
              <div className="absolute right-0 top-0 h-[250px] w-[250px] rounded-[40px] bg-[#0d7fc2]/24 blur-3xl" />

              <div className="absolute left-8 top-8 w-[260px] rounded-[30px] border border-white/70 bg-white/86 p-6 shadow-[0_18px_48px_rgba(35,45,62,0.08)] backdrop-blur-xl">
                <p className="inline-flex rounded-full bg-[#0d7fc2]/8 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#0d7fc2]">
                  Teaching toolkit
                </p>
                <h2 className="mt-4 text-[1.28rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  Curriculum, scenarios, and case studies in one environment.
                </h2>
                <p className="mt-4 text-[0.95rem] leading-7 text-[#5e6776]">
                  Designed to support explanation, discussion, guided learning, and applied ESG
                  teaching.
                </p>
              </div>

              <div className="absolute right-8 top-20 w-[195px] rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_16px_40px_rgba(35,45,62,0.07)] backdrop-blur-xl">
                <p className="text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#ef6c23]">
                  Practical use
                </p>
                <p className="mt-3 text-[0.92rem] leading-7 text-[#5e6776]">
                  Resources that can support workshops, lessons, and blended learning.
                </p>
              </div>

              <div className="absolute bottom-8 right-12 w-[220px] rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_16px_40px_rgba(35,45,62,0.07)] backdrop-blur-xl">
                <p className="text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#0b9c72]">
                  Learning design
                </p>
                <p className="mt-3 text-[0.92rem] leading-7 text-[#5e6776]">
                  Structured for clear navigation, engagement, and pedagogical clarity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="educators-content"
        className="relative z-10 scroll-mt-28 px-6 py-10 md:px-10 md:py-14 lg:px-14"
      >
        <div className="mx-auto max-w-340 space-y-8">
          <div className="rounded-4xl border border-white/60 bg-white/90 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.07)] backdrop-blur md:p-8 lg:p-10">
            <div className="max-w-210">
              <p className="landing-section-eyebrow">What educators gain</p>
              <h2 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.2rem]">
                Resources that help move from theory to applied ESG teaching.
              </h2>
              <p className="mt-4 max-w-[64ch] text-[1rem] leading-7 text-[#596170]">
                From curriculum support to case-based learning, the platform is designed to help
                educators present ESG topics in a clearer, more practice-oriented way.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {educatorBenefits.map((item) => (
                <article
                  key={item.title}
                  className="group rounded-[28px] border border-white/60 bg-white/88 p-6 shadow-[0_12px_34px_rgba(35,45,62,0.05)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(35,45,62,0.10)]"
                >
                  <div className="h-2 w-12 rounded-full bg-[#0d7fc2] transition-all duration-300 group-hover:w-18" />
                  <h3 className="mt-5 text-[1.18rem] font-semibold tracking-[-0.02em] text-[#31425a]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[0.98rem] leading-7 text-[#5e6776]">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
            <article className="rounded-4xl border border-white/60 bg-white/88 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.06)] backdrop-blur md:p-8 lg:p-10">
              <p className="landing-section-eyebrow">How it can be used</p>
              <h2 className="mt-3 text-[1.75rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2rem]">
                A platform that supports explanation, engagement, and structured learning.
              </h2>

              <div className="mt-8 space-y-5">
                {educatorUseCases.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-[#e7ebf0] bg-[#fcfcfd] p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(35,45,62,0.06)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#31425a] text-sm font-bold text-white">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="text-[1.08rem] font-semibold tracking-[-0.02em] text-[#31425a]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-[0.98rem] leading-7 text-[#5e6776]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <aside className="rounded-4xl border border-white/60 bg-white/80 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.05)] backdrop-blur md:p-8">
              <p className="landing-section-eyebrow">Key highlights</p>
              <h2 className="mt-3 text-[1.55rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                What makes the educator experience valuable
              </h2>

              <div className="mt-8 flex flex-wrap gap-3">
                {educatorHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-[#31425a]/10 bg-white px-5 py-3 text-[0.95rem] font-medium text-[#31425a] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#0d7fc2]/30 hover:text-[#0d7fc2]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="landing-cta-band px-6 py-12 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-340 flex-col gap-6 rounded-[28px] border border-white/50 bg-white/85 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-190">
            <p className="landing-section-eyebrow">Get started as an educator</p>
            <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.1rem]">
              Create your account and start exploring the platform.
            </h2>
            <p className="mt-4 max-w-[60ch] text-[1rem] leading-7 text-[#596170]">
              Access structured ESG learning resources, interactive scenarios, and case-based
              educational content designed for practical teaching.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={`/${locale}/auth/register`} className="landing-primary-cta">
              Register now
            </Link>
            <Link href={`/${locale}/auth/login`} className="landing-secondary-cta">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter locale={locale} />
    </main>
  );
}
