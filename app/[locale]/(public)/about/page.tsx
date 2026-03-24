import PublicFooter from "@/components/layout/public-footer";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

const goals = [
  {
    title: "Capacity Building for VET Providers",
    description:
      "Support vocational education providers with practical tools, structured guidance, and ESG-focused teaching resources.",
  },
  {
    title: "Business Competence in ESG",
    description:
      "Help business managers and organisations understand ESG requirements and apply them in real decision-making processes.",
  },
  {
    title: "Collaboration and Best Practice Exchange",
    description:
      "Strengthen cooperation among partners and encourage the exchange of effective approaches across countries and sectors.",
  },
  {
    title: "Raising Public Awareness",
    description:
      "Promote broader understanding of ESG principles and their importance for education, business, and society.",
  },
];

const results = [
  {
    title: "Educational Impact",
    description:
      "VET educators and business professionals improve their ESG knowledge, ensuring alignment with modern labour market needs.",
  },
  {
    title: "Behavioural Change",
    description:
      "Businesses increasingly adopt ESG principles in decision-making, leading to improved stakeholder engagement and corporate responsibility.",
  },
  {
    title: "Systemic Impact",
    description:
      "Cooperation among participating EU countries strengthens, aligning VET training with sustainability goals and market demands.",
  },
];

const targetGroups = [
  "VET Educators",
  "Business Managers",
  "SMEs and Large Enterprises",
  "Environmental Experts / Policy Makers / NGOs",
  "VET Learners",
  "Relevant key actors",
];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="bg-[#ececec]">
      <section className="relative overflow-hidden bg-white px-6 pt-6 md:px-10 md:pt-8 lg:px-14 lg:pt-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(236,103,37,0.18),transparent_26%),radial-gradient(circle_at_86%_24%,rgba(13,127,194,0.22),transparent_30%),linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(249,250,251,0.98)_58%,rgba(255,255,255,0.96)_100%)]" />

        <div className="relative mx-auto grid max-w-340 min-h-[calc(100vh-104px)] items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div className="max-w-215 pb-4 lg:pb-0">
            <h1 className="mt-4 text-[2.2rem] font-black leading-[0.95] tracking-[-0.05em] text-[#31425a] sm:text-[3rem] lg:text-[3.65rem]">
              Bridging the gap between vocational education and{" "}
              <span className="whitespace-nowrap">real-world</span> ESG implementation.
            </h1>

            <p className="mt-5 max-w-[62ch] text-[1.02rem] leading-8 text-[#596170] sm:text-[1.08rem]">
              Our goal is to help VET providers and business managers build the knowledge, skills,
              and practical tools needed to integrate Environmental, Social, and Governance
              principles into business strategies and vocational training.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}/auth/register`} className="landing-primary-cta">
                Join the platform
              </Link>

              <a href="#about-content" className="landing-secondary-cta">
                Read more
              </a>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto h-95 w-full max-w-125">
              <div className="absolute left-0 top-8 h-55 w-55 rounded-4xl bg-[#ec6725]/18 blur-3xl" />
              <div className="absolute right-0 top-0 h-62.5 w-62.5 rounded-[40px] bg-[#0d7fc2]/24 blur-3xl" />

              <div className="absolute left-6 top-8 w-63.75 rounded-[30px] border border-white/70 bg-white/86 p-6 shadow-[0_18px_48px_rgba(35,45,62,0.08)] backdrop-blur-xl">
                <p className="inline-flex rounded-full bg-[#0d7fc2]/8 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#0d7fc2]">
                  Practical package
                </p>
                <h2 className="mt-4 text-[1.28rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                  Curriculum, eLearning, ePortfolio, and Scenario Simulator.
                </h2>
                <p className="mt-4 text-[0.95rem] leading-7 text-[#5e6776]">
                  A connected learning ecosystem designed to support ESG awareness and applied
                  competence.
                </p>
              </div>

              <div className="absolute right-6 top-18 w-48.75 rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_16px_40px_rgba(35,45,62,0.07)] backdrop-blur-xl">
                <p className="text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#ef6c23]">
                  Open access
                </p>
                <p className="mt-3 text-[0.92rem] leading-7 text-[#5e6776]">
                  Freely available resources designed for adaptation and use.
                </p>
              </div>

              <div className="absolute bottom-6 right-10 w-55 rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_16px_40px_rgba(35,45,62,0.07)] backdrop-blur-xl">
                <p className="text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#0b9c72]">
                  EU relevance
                </p>
                <p className="mt-3 text-[0.92rem] leading-7 text-[#5e6776]">
                  Supports Green Deal priorities and innovation in vocational education.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about-content"
        className="relative z-10 scroll-mt-28 px-6 py-10 md:px-10 md:py-14 lg:px-14"
      >
        <div className="mx-auto grid max-w-340 gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-4xl border border-white/60 bg-white/90 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.07)] backdrop-blur md:p-8 lg:p-10">
            <p className="landing-section-eyebrow">Project</p>
            <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.1rem]">
              Why the project matters
            </h2>

            <div className="mt-6 space-y-5 text-[1rem] leading-8 text-[#596170]">
              <p>
                The IntegratESG project bridges the gap between vocational education and real-world
                application by equipping VET providers and business managers with the knowledge and
                tools to integrate Environmental, Social, and Governance (ESG) principles into
                business strategies.
              </p>

              <p>
                With ESG regulations becoming increasingly stringent, such as the Corporate
                Sustainability Reporting Directive (CSRD), businesses must adapt to ensure
                sustainable and responsible operations.
              </p>

              <p>
                The project develops a comprehensive training package, including a Roadmap for VET
                providers, an ESG curriculum and eLearning course, a digital ePortfolio of case
                studies, and a Scenario Simulator.
              </p>

              <p>
                These resources are accessible through an interactive e-learning platform, freely
                available for adaptation and use.
              </p>
            </div>
          </article>

          <aside className="rounded-4xl border border-white/60 bg-white/80 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.05)] backdrop-blur md:p-8">
            <p className="landing-section-eyebrow">Strategic relevance</p>
            <h2 className="mt-3 text-[1.55rem] font-semibold tracking-[-0.03em] text-[#31425a]">
              Aligned with EU priorities
            </h2>

            <p className="mt-5 text-[1rem] leading-7 text-[#596170]">
              This project aligns with the EU’s Green Deal objectives and contributes to the
              adaptation and innovation of vocational education by integrating ESG awareness and
              practical implementation.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl border border-[#0d7fc2]/10 bg-[#0d7fc2]/5 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0d7fc2]">
                  Training package
                </p>
                <p className="mt-2 text-sm leading-6 text-[#596170]">
                  Roadmap, curriculum, eLearning course, ePortfolio, and Scenario Simulator.
                </p>
              </div>

              <div className="rounded-2xl border border-[#ef6c23]/10 bg-[#ef6c23]/5 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#ef6c23]">
                  Open access
                </p>
                <p className="mt-2 text-sm leading-6 text-[#596170]">
                  Freely accessible resources designed for adaptation and practical use.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-6 py-6 md:px-10 md:py-10 lg:px-14">
        <div className="mx-auto max-w-340">
          <div className="max-w-190">
            <p className="landing-section-eyebrow">Main goals</p>
            <h2 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.2rem]">
              Four pillars guiding the project.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {goals.map((goal) => (
              <article
                key={goal.title}
                className="group rounded-[28px] border border-white/60 bg-white/88 p-6 shadow-[0_12px_34px_rgba(35,45,62,0.05)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(35,45,62,0.10)]"
              >
                <div className="h-2 w-12 rounded-full bg-[#0d7fc2] transition-all duration-300 group-hover:w-18" />
                <h3 className="mt-5 text-[1.2rem] font-semibold tracking-[-0.02em] text-[#31425a]">
                  {goal.title}
                </h3>
                <p className="mt-4 text-[0.98rem] leading-7 text-[#5e6776]">{goal.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 md:py-14 lg:px-14">
        <div className="mx-auto max-w-340 rounded-4xl border border-white/60 bg-white/88 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.06)] backdrop-blur md:p-8 lg:p-10">
          <div className="max-w-195">
            <p className="landing-section-eyebrow">Expected results</p>
            <h2 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.2rem]">
              From knowledge improvement to wider systemic change.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {results.map((result, index) => (
              <article
                key={result.title}
                className="relative rounded-3xl border border-[#e7ebf0] bg-[#fcfcfd] p-6"
              >
                <div className="absolute -top-3 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-[#31425a] text-sm font-bold text-white">
                  {index + 1}
                </div>

                <h3 className="mt-5 text-[1.22rem] font-semibold tracking-[-0.02em] text-[#31425a]">
                  {result.title}
                </h3>

                <p className="mt-4 text-[0.98rem] leading-7 text-[#5e6776]">{result.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-6 md:px-10 md:py-10 lg:px-14">
        <div className="mx-auto max-w-340">
          <div className="max-w-190">
            <p className="landing-section-eyebrow">Target groups</p>
            <h2 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.2rem]">
              Designed for diverse educational and professional audiences.
            </h2>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {targetGroups.map((group) => (
              <div
                key={group}
                className="rounded-full border border-[#31425a]/10 bg-white px-5 py-3 text-[0.96rem] font-medium text-[#31425a] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#0d7fc2]/30 hover:text-[#0d7fc2]"
              >
                {group}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta-band px-6 py-12 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-340 flex-col gap-6 rounded-[28px] border border-white/50 bg-white/85 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-190">
            <p className="landing-section-eyebrow">Explore the platform</p>
            <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.1rem]">
              Learn how IntegratESG turns strategy into practical learning.
            </h2>
            <p className="mt-4 max-w-[60ch] text-[1rem] leading-7 text-[#596170]">
              Create an account to access interactive scenarios, case studies, and structured ESG
              learning resources.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={`/${locale}/auth/register`} className="landing-primary-cta">
              Create account
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
