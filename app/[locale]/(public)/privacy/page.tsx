import PublicFooter from "@/components/layout/public-footer";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PublicContent.Privacy" });

  const overviewItems = [1, 2, 3, 4, 5].map((index) => t(`overview.items.${index}`));
  const sections = [1, 2, 3, 4, 5].map((index) => ({
    title: t(`sections.${index}.title`),
    description: t(`sections.${index}.description`),
  }));

  return (
    <main className="bg-[#ececec]">
      <section className="relative overflow-hidden bg-white px-6 pb-14 pt-18 md:px-10 md:pb-18 md:pt-24 lg:px-14">
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top_left,rgba(13,127,194,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(11,156,114,0.10),transparent_32%)]" />

        <div className="relative mx-auto max-w-340">
          <div className="max-w-215">
            <p className="landing-section-eyebrow">{t("hero.eyebrow")}</p>

            <h1 className="mt-4 text-[2.4rem] font-black tracking-[-0.05em] text-[#31425a] sm:text-[3.1rem] lg:text-[4rem]">
              {t("hero.title")}
            </h1>

            <p className="mt-6 max-w-[65ch] text-[1.05rem] leading-8 text-[#596170] sm:text-[1.12rem]">
              {t("hero.description")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}`} className="landing-secondary-cta">
                {t("hero.secondaryCta")}
              </Link>
              <Link href={`/${locale}/terms`} className="landing-primary-cta">
                {t("hero.primaryCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 md:py-14 lg:px-14">
        <div className="mx-auto grid max-w-340 gap-8 xl:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-[28px] border border-white/60 bg-white/88 p-6 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur md:p-8">
            <p className="landing-section-eyebrow">{t("overview.eyebrow")}</p>
            <h2 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
              {t("overview.title")}
            </h2>

            <div className="mt-6 space-y-4">
              {overviewItems.map((item) => (
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
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                    {section.title}
                  </h2>
                  <p className="mt-4 text-[1rem] leading-8 text-[#596170]">{section.description}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PublicFooter locale={locale} />
    </main>
  );
}
