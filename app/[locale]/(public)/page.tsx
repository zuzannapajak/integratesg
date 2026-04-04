import PublicFooter from "@/components/layout/public-footer";
import AnimatedStat from "@/components/public/animated-stat";
import { PARTNERS } from "@/lib/constants";
import { getPlatformStats } from "@/lib/platform/get-platform-stats";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });
  const stats = await getPlatformStats();

  const focusCards = [
    {
      eyebrow: t("cards.students.eyebrow"),
      title: t("cards.students.title"),
      description: t("cards.students.description"),
    },
    {
      eyebrow: t("cards.educators.eyebrow"),
      title: t("cards.educators.title"),
      description: t("cards.educators.description"),
    },
    {
      eyebrow: t("cards.allUsers.eyebrow"),
      title: t("cards.allUsers.title"),
      description: t("cards.allUsers.description"),
    },
  ];

  return (
    <main className="bg-[#ececec]">
      <section className="mock-hero-bg">
        <div className="mock-hero-orange" aria-hidden="true" />
        <div className="mock-hero-blue" aria-hidden="true" />
        <div className="landing-hero-orange-glow" aria-hidden="true" />
        <div className="landing-hero-blue-glow" aria-hidden="true" />
        <div className="hero-bottom-fade" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="home-hero-mobile">
            <div className="home-hero-mobile__content">
              <p className="home-hero-mobile__eyebrow">{t("hero.eyebrow")}</p>

              <h1 className="home-hero-mobile__title">{t("hero.title")}</h1>

              <p className="home-hero-mobile__description">{t("hero.description")}</p>

              <div className="home-hero-mobile__actions">
                <Link
                  href={`/${locale}/auth/register`}
                  className="landing-primary-cta home-hero-mobile__primary"
                >
                  {t("hero.join")}
                </Link>

                <a href="#platform-overview" className="home-hero-mobile__text-link">
                  {t("hero.readMore")}
                </a>
              </div>
            </div>

            <div className="home-hero-mobile__art" aria-hidden="true">
              <div className="home-hero-mobile__orb home-hero-mobile__orb--orange" />
              <div className="home-hero-mobile__orb home-hero-mobile__orb--blue" />

              <div className="home-hero-mobile__blob">
                <div className="home-hero-mobile__blob-inner">
                  <Image
                    src="/images/writer_flat_composition.jpg"
                    alt=""
                    fill
                    className="home-hero-mobile__blob-image object-cover"
                    priority
                    sizes="(max-width: 1023px) 72vw, 420px"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="home-hero-desktop">
            <div className="home-hero-desktop__grid">
              <div className="home-hero-desktop__media">
                <div className="home-hero-desktop__blob-motion">
                  <div className="image-blob-container">
                    <div className="home-hero-desktop__image-motion">
                      <Image
                        src="/images/writer_flat_composition.jpg"
                        alt={t("hero.imageAlt")}
                        fill
                        className="object-cover"
                        priority
                        sizes="420px"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="home-hero-desktop__copy">
                <p className="home-hero-desktop__eyebrow">{t("hero.eyebrow")}</p>

                <h1 className="hero-title home-hero-desktop__title">{t("hero.title")}</h1>

                <div className="home-hero-desktop__actions">
                  <Link href={`/${locale}/auth/register`} className="landing-primary-cta">
                    {t("hero.join")}
                  </Link>

                  <a href="#platform-overview" className="landing-secondary-cta">
                    {t("hero.readMore")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="platform-overview"
        className="landing-intro-section relative z-20 mt-0 bg-[#ececec] px-6 pb-10 pt-16 md:px-10 lg:px-14"
      >
        <div className="mx-auto max-w-340 space-y-8">
          <div className="rounded-4xl border border-white/40 bg-white/72 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.05)] backdrop-blur md:p-8 lg:p-10">
            <div className="max-w-215">
              <p className="landing-section-eyebrow">{t("overview.eyebrow")}</p>

              <h2 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.2rem]">
                {t("overview.title")}
              </h2>

              <p className="mt-4 max-w-[64ch] text-[1rem] leading-7 text-[#596170]">
                {t("overview.description")}
              </p>
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
              <p className="landing-section-eyebrow">{t("stats.eyebrow")}</p>
              <h2 className="mt-3 text-[1.65rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[1.9rem]">
                {t("stats.title")}
              </h2>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <AnimatedStat value={stats.caseStudies} label={t("stats.caseStudies")} />
              <AnimatedStat value={stats.scenarioAreas} label={t("stats.scenarioAreas")} />
              <AnimatedStat value={stats.partnerLanguages} label={t("stats.partnerLanguages")} />
            </div>
          </div>
        </div>
      </section>

      <section className="partners-band py-14">
        <div className="relative z-10 mx-auto max-w-295 px-5 md:px-8">
          <h2 className="text-center text-[1.9rem] font-semibold tracking-[-0.03em] text-white">
            {t("partners.title")}
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {PARTNERS.map((partner) => (
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
        <div className="mx-auto flex max-w-340 flex-col gap-6 rounded-[28px] border border-white/50 bg-white/85 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.08)] backdrop-blur md:p-8 lg:flex-row lg:items-center lg:justify-between">
          {" "}
          <div className="max-w-190">
            <p className="landing-section-eyebrow">{t("cta.eyebrow")}</p>
            <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.1rem]">
              {t("cta.title")}
            </h2>
            <p className="mt-4 max-w-[60ch] text-[1rem] leading-7 text-[#596170]">
              {t("cta.description")}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={`/${locale}/auth/register`} className="landing-primary-cta">
              {t("cta.register")}
            </Link>
            <Link href={`/${locale}/auth/login`} className="landing-secondary-cta">
              {t("cta.signIn")}
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter locale={locale} />
    </main>
  );
}
