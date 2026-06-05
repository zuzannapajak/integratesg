import PlatformFeedbackForm from "@/components/platform-feedback/platform-feedback-form";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function PlatformFeedbackPage({ params }: Props) {
  const { locale } = await params;

  await requireRole(locale, APP_ROLES.educator);

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(11,156,114,0.07),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.07),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8">
        <PlatformFeedbackForm locale={locale} />
      </div>
    </main>
  );
}
