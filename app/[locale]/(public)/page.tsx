import PublicFooter from "@/components/layout/public-footer";
import AnimatedStat from "@/components/public/animated-stat";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

const focusCards = [
  {
    eyebrow: "For students",
    title: "Scenario Simulator",
    description:
      "Explore ESG topics through interactive decision-making scenarios and practical learning paths.",
  },
  {
    eyebrow: "For educators",
    title: "Curriculum and self-assessment",
    description:
      "Access structured learning modules, pre- and post-quizzes, and feedback-driven teaching resources.",
  },
  {
    eyebrow: "For all users",
    title: "ePortfolio of case studies",
    description:
      "Review standardized ESG case studies prepared across partner languages and contexts.",
  },
];

const partners = [
  { name: "Lodz University of Technology", src: "/images/partners/lodz_logo.png" },
  { name: "SBC", src: "/images/partners/sbc_logo.png" },
  { name: "Egina", src: "/images/partners/egina_logo.png" },
  { name: "Institute of Development N. Charalambous", src: "/images/partners/iod_logo.png" },
  { name: "dieBerater", src: "/images/partners/dieberater_logo.png" },
  { name: "CleverMind", src: "/images/partners/clever_mind_logo.png" },
];

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const languageCount = 6;

  return (
    <main className="bg-[#ececec]">
      <section className="mock-hero-bg">
        <div className="mock-hero-orange" />
        <div className="mock-hero-blue" />

        <div className="relative z-30 mx-auto grid max-w-7xl w-full grid-cols-1 items-center gap-4 px-8 md:grid-cols-2">
          <div className="flex items-center justify-center md:justify-end">
            <div className="image-blob-container">
              <Image
                src="/images/writer_flat_composition.jpg"
                alt="IntegratESG learning platform illustration"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 280px, 400px"
              />
            </div>
          </div>

          <div className="z-40 text-center md:-ml-20 md:-mt-47.5 md:pl-12 md:text-left">
            <h1 className="hero-title text-[38px] sm:text-[46px] md:text-[52px]">
              Practical ESG learning <br className="hidden md:block" />
              for students and educators.
            </h1>
          </div>
        </div>
      </section>

      <section className="landing-intro-section relative z-20 bg-[#ececec] px-6 pb-10 pt-10 md:px-10 lg:px-14">
        <div className="mx-auto max-w-340 space-y-8">
          <div className="rounded-4xl border border-white/60 bg-white/88 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.07)] backdrop-blur md:p-8 lg:p-10">
            <div className="max-w-215">
              <p className="landing-section-eyebrow">Platform overview</p>

              <h2 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.2rem]">
                Discover case studies, interactive scenarios, and structured learning resources in a
                single multilingual environment designed around the WP4 experience.
              </h2>

              <p className="mt-4 max-w-[64ch] text-[1rem] leading-7 text-[#596170]">
                The platform combines experiential learning resources, interactive simulation, and
                structured educational pathways in a form that stays clear, accessible, and easy to
                navigate.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}/auth/register`} className="landing-primary-cta">
                Create account
              </Link>
              <Link href={`/${locale}/auth/login`} className="landing-secondary-cta">
                Sign in
              </Link>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {focusCards.map((card) => (
                <article key={card.title} className="landing-focus-card">
                  <p className="landing-card-eyebrow">{card.eyebrow}</p>
                  <h3 className="mt-3 text-[1.35rem] font-semibold tracking-[-0.02em] text-[#31425a]">
                    {card.title}
                  </h3>
                  <p className="mt-4 text-[0.98rem] leading-7 text-[#5e6776]">{card.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-white/60 bg-white/78 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.05)] backdrop-blur md:p-8">
            <div className="max-w-175">
              <p className="landing-section-eyebrow">At a glance</p>
              <h2 className="mt-3 text-[1.65rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[1.9rem]">
                Key numbers behind the learning experience.
              </h2>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <AnimatedStat value={6} label="Case studies" />
              <AnimatedStat value={3} label="Scenario areas" />
              <AnimatedStat value={languageCount} label="Partner languages" />
            </div>
          </div>
        </div>
      </section>

      <section className="partners-band py-14">
        <div className="relative z-10 mx-auto max-w-295 px-5 md:px-8">
          <h2 className="text-center text-[1.9rem] font-semibold tracking-[-0.03em] text-white">
            Partners
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner) => (
              <div key={partner.name} className="partner-logo-card">
                <div className="partner-logo-inner">
                  <Image
                    src={partner.src}
                    alt={partner.name}
                    fill
                    className="partner-logo-image"
                    sizes="(max-width: 1024px) 33vw, 160px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta-band px-6 py-12 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-340 flex-col gap-6 rounded-[28px] border border-white/50 bg-white/85 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-190">
            <p className="landing-section-eyebrow">Get started</p>
            <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.1rem]">
              Access the platform and continue your ESG learning journey.
            </h2>
            <p className="mt-4 max-w-[60ch] text-[1rem] leading-7 text-[#596170]">
              Register to explore scenarios, ePortfolio resources, and learning materials designed
              for students, educators, and project stakeholders.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={`/${locale}/auth/register`} className="landing-primary-cta">
              Register
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
