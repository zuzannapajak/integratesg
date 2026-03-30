import PublicFooter from "@/components/layout/public-footer";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function StudentsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PublicContent.Students" });

  const studentBenefits = [1, 2, 3, 4].map((index) => ({
    title: t(`benefits.items.${index}.title`),
    description: t(`benefits.items.${index}.description`),
  }));

  const studentUseCases = [1, 2, 3].map((index) => ({
    title: t(`usage.items.${index}.title`),
    description: t(`usage.items.${index}.description`),
  }));

  const studentHighlights = [1, 2, 3, 4, 5, 6].map((index) => t(`highlights.items.${index}`));

  return (
    <main className="bg-[#ececec]">
      <section className="relative overflow-hidden bg-white px-6 pb-10 pt-8 md:px-10 md:pb-12 md:pt-10 lg:px-14 lg:pt-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(236,103,37,0.16),transparent_24%),radial-gradient(circle_at_86%_22%,rgba(13,127,194,0.20),transparent_28%),linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(249,250,251,0.98)_58%,rgba(255,255,255,0.96)_100%)]" />

        <div className="relative mx-auto grid max-w-340 min-h-[calc(100vh-104px)] items-center gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
          <div className="max-w-215 pb-4 lg:pb-0">
            <p className="landing-section-eyebrow">{t("hero.eyebrow")}</p>

            <h1 className="mt-4 text-[2.2rem] font-black leading-[0.95] tracking-[-0.05em] text-[#31425a] sm:text-[3rem] lg:text-[3.65rem]">
              {t("hero.title")}
            </h1>

            <p className="mt-5 max-w-[62ch] text-[1.02rem] leading-8 text-[#596170] sm:text-[1.08rem]">
              {t("hero.description")}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#students-content" className="landing-secondary-cta">
                {t("hero.secondaryCta")}
              </a>
              <Link href={`/${locale}/auth/register`} className="landing-primary-cta">
                {t("hero.primaryCta")}
              </Link>
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

              <div className="absolute left-10 top-20 -z-10 h-64 w-64 rounded-full bg-[#ec6725]/12 blur-3xl" />
              <div className="absolute right-10 bottom-10 -z-10 h-64 w-64 rounded-full bg-[#0d7fc2]/16 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="students-content"
        className="relative z-10 scroll-mt-28 px-6 py-10 md:px-10 md:py-14 lg:px-14"
      >
        <div className="mx-auto max-w-340 space-y-8">
          <div className="rounded-4xl border border-white/60 bg-white/90 p-6 shadow-[0_16px_44px_rgba(35,45,62,0.07)] backdrop-blur md:p-8 lg:p-10">
            <div className="max-w-210">
              <p className="landing-section-eyebrow">{t("benefits.eyebrow")}</p>
              <h2 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2.2rem]">
                {t("benefits.title")}
              </h2>
              <p className="mt-4 max-w-[64ch] text-[1rem] leading-7 text-[#596170]">
                {t("benefits.description")}
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {studentBenefits.map((item) => (
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
              <p className="landing-section-eyebrow">{t("usage.eyebrow")}</p>
              <h2 className="mt-3 text-[1.75rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[2rem]">
                {t("usage.title")}
              </h2>

              <div className="mt-8 space-y-5">
                {studentUseCases.map((item, index) => (
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
              <p className="landing-section-eyebrow">{t("highlights.eyebrow")}</p>
              <h2 className="mt-3 text-[1.55rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                {t("highlights.title")}
              </h2>

              <div className="mt-8 flex flex-wrap gap-3">
                {studentHighlights.map((item) => (
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
              {t("cta.primary")}
            </Link>
            <Link href={`/${locale}/auth/login`} className="landing-secondary-cta">
              {t("cta.secondary")}
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter locale={locale} />
    </main>
  );
}
