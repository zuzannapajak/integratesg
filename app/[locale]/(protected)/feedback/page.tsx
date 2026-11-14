import GeneralFeedbackForm from "@/components/platform-feedback/general-feedback-form";
import { requireRole } from "@/features/auth/requireRole";
import { SELF_SERVICE_ROLES } from "@/lib/auth/roles";
import { isAppLocale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GeneralFeedbackPage({ params }: Props) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  await requireRole(locale, [...SELF_SERVICE_ROLES]);

  return (
    <main className="min-h-screen bg-[#f5f5f3] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <GeneralFeedbackForm locale={locale} />
      </div>
    </main>
  );
}
