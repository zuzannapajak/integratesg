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
      <section className="relative overflow-hidden bg-white px-6 pb-16 pt-18 md:px-10 md:pb-20 md:pt-24 lg:px-14">
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top_left,rgba(236,103,37,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(13,127,194,0.12),transparent_32%)]" />

        <div className="relative mx-auto max-w-340">
          <div className="max-w-215">
            <p className="landing-section-eyebrow">About the project</p>

            <h1 className="mt-4 text-[2.4rem] font-black tracking-[-0.05em] text-[#31425a] sm:text-[3.2rem] lg:text-[4.1rem]">
              IntegratESG connects vocational education with real-world ESG implementation.
            </h1>

            <p className="mt-6 max-w-[65ch] text-[1.05rem] leading-8 text-[#596170] sm:text-[1.12rem]">
              The project helps VET providers and business managers build the knowledge, skills, and
              practical tools needed to integrate Environmental, Social, and Governance principles
              into business strategies and vocational training.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}/auth/register`} className="landing-primary-cta">
                Join the platform
              </Link>
              <Link href={`/${locale}`} className="landing-secondary-cta">
                Back to homepage
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-10 md:px-10 md:py-14 lg:px-14">
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
