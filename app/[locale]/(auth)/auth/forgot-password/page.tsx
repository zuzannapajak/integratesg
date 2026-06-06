import ForgotPasswordForm from "@/components/auth/password-recovery/forgot-password-form";
import { getTranslations } from "next-intl/server";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth.ForgotPasswordPage" });

  return (
    <main className="flex h-full min-h-0 overflow-hidden bg-[#ececec]">
      <section className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-white px-6 md:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(236,103,37,0.16),transparent_24%),radial-gradient(circle_at_86%_22%,rgba(13,127,194,0.20),transparent_28%),linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(249,250,251,0.98)_58%,rgba(255,255,255,0.96)_100%)]" />

        <div className="relative z-20 mx-auto flex w-full max-w-130 items-center justify-center">
          <div className="w-full rounded-4xl border border-white/70 bg-white/88 p-6 shadow-[0_20px_55px_rgba(35,45,62,0.10)] backdrop-blur-xl md:p-8">
            <div className="max-w-105">
              <h1 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                {t("title")}
              </h1>
              <p className="mt-3 text-[0.98rem] leading-7 text-[#596170]">{t("subtitle")}</p>
            </div>

            <div className="mt-8">
              <ForgotPasswordForm locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
