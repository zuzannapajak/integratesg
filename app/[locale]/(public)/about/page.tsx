import PublicFooter from "@/components/layout/public-footer";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PublicContent.About" });

  const goals = [1, 2, 3, 4].map((index) => ({
    title: t(`goals.items.${index}.title`),
    description: t(`goals.items.${index}.description`),
  }));

  const results = [1, 2, 3].map((index) => ({
    title: t(`results.items.${index}.title`),
    description: t(`results.items.${index}.description`),
  }));

  const targetGroups = [1, 2, 3, 4, 5, 6].map((index) => t(`groups.items.${index}`));

  return (
    <main className="bg-[#ececec]">
      <section className="relative overflow-hidden bg-white px-6 pt-6 md:px-10 md:pt-8 lg:px-14 lg:pt-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(236,103,37,0.18),transparent_26%),radial-gradient(circle_at_86%_24%,rgba(13,127,194,0.22),transparent_30%),linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(249,250,251,0.98)_58%,rgba(255,255,255,0.96)_100%)]" />

        <div className="relative mx-auto grid max-w-340 min-h-[calc(100vh-104px)] items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div className="max-w-215 pb-4 lg:pb-0">
            <p className="landing-section-eyebrow">{t("hero.eyebrow")}</p>

            <h1 className="mt-4 text-[2.2rem] font-black leading-[0.95] tracking-[-0.05em] text-[#31425a] sm:text-[3rem] lg:text-[3.65rem]">
              {t("hero.title")}
            </h1>

            <p className="mt-5 max-w-[62ch] text-[1.02rem] leading-8 text-[#596170] sm:text-[1.08rem]">
              {t("hero.description")}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}/auth/register`} className="landing-primary-cta">
                {t("hero.primaryCta")}
              </Link>

              <a href="#about-content" className="landing-secondary-cta">
                {t("hero.secondaryCta")}
              </a>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto h-125 w-full max-w-145">
              <div className="absolute right-10 top-0 z-30 w-60 rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-[0_20px_50px_rgba(35,45,62,0.1)] backdrop-blur-xl">
                <p className="text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#ef6c23]">
                  {t("heroCards.card1Title")}
                </p>
                <p className="mt-3 text-[0.92rem] leading-7 text-[#5e6776]">
                  {t("heroCards.card1Description")}
                </p>
              </div>

              <div className="absolute left-10 top-25 z-20 w-85 rounded-[30px] border border-white/70 bg-white/86 p-6 shadow-[0_18px_48px_rgba(35,45,62,0.08)] backdrop-blur-xl">
                <p className="inline-flex rounded-full bg-[#0d7fc2]/8 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#0d7fc2]">
                  {t("heroCards.card2Badge")}
                </p>
                <h2 className="mt-4 text-[1.2rem] font-semibold tracking-[-0.03em] text-[#31425a] lg:max-w-55">
                  {t("heroCards.card2Title")}
                </h2>
                <p className="mt-4 text-[0.92rem] leading-6 text-[#5e6776] lg:max-w-60">
                  {t("heroCards.card2Description")}
                </p>
              </div>

              <div className="absolute right-10 top-72.5 z-30 w-62.5 rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_50px_rgba(35,45,62,0.1)] backdrop-blur-xl">
                <p className="text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#0b9c72]">
                  {t("heroCards.card3Title")}
                </p>
                <p className="mt-3 text-[0.92rem] leading-7 text-[#5e6776]">
                  {t("heroCards.card3Description")}
                </p>
              </div>

              <div className="absolute left-10 top-20 -z-10 h-64 w-64 rounded-full bg-[#ec6725]/10 blur-3xl" />
              <div className="absolute right-10 bottom-10 -z-10 h-64 w-64 rounded-full bg-[#0d7fc2]/15 blur-3xl" />
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
            <p className="landing-section-eyebrow">{t("project.eyebrow")}</p>
            <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.1rem]">
              {t("project.title")}
            </h2>

            <div className="mt-6 space-y-5 text-[1rem] leading-8 text-[#596170]">
              <p>{t("project.paragraph1")}</p>
              <p>{t("project.paragraph2")}</p>
              <p>{t("project.paragraph3")}</p>
              <p>{t("project.paragraph4")}</p>
            </div>
          </article>

          <aside className="rounded-4xl border border-white/60 bg-white/80 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.05)] backdrop-blur md:p-8">
            <p className="landing-section-eyebrow">{t("strategic.eyebrow")}</p>
            <h2 className="mt-3 text-[1.55rem] font-semibold tracking-[-0.03em] text-[#31425a]">
              {t("strategic.title")}
            </h2>

            <p className="mt-5 text-[1rem] leading-7 text-[#596170]">
              {t("strategic.description")}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl border border-[#0d7fc2]/10 bg-[#0d7fc2]/5 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0d7fc2]">
                  {t("strategic.card1Title")}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#596170]">
                  {t("strategic.card1Description")}
                </p>
              </div>

              <div className="rounded-2xl border border-[#ef6c23]/10 bg-[#ef6c23]/5 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#ef6c23]">
                  {t("strategic.card2Title")}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#596170]">
                  {t("strategic.card2Description")}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-6 py-6 md:px-10 md:py-10 lg:px-14">
        <div className="mx-auto max-w-340">
          <div className="max-w-190">
            <p className="landing-section-eyebrow">{t("goals.eyebrow")}</p>
            <h2 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.2rem]">
              {t("goals.title")}
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
            <p className="landing-section-eyebrow">{t("results.eyebrow")}</p>
            <h2 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.2rem]">
              {t("results.title")}
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
            <p className="landing-section-eyebrow">{t("groups.eyebrow")}</p>
            <h2 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.2rem]">
              {t("groups.title")}
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
            <p className="landing-section-eyebrow">{t("cta.eyebrow")}</p>
            <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.1rem]">
              {t("cta.title")}
            </h2>
            <p className="mt-4 max-w-[60ch] text-[1rem] leading-7 text-[#596170]">
              {t("cta.description")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={`/${locale}/auth/register`} className="landing-primary-cta">
              {t("cta.primaryCta")}
            </Link>
            <Link href={`/${locale}/auth/login`} className="landing-secondary-cta">
              {t("cta.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter locale={locale} />
    </main>
  );
}
