import PlatformFeedbackForm from "@/components/platform-feedback/platform-feedback-form";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { getWp3PlatformFeedbackEligibility } from "@/lib/platform-feedback/wp3-eligibility";
import { getWp4PlatformFeedbackEligibility } from "@/lib/platform-feedback/wp4-eligibility";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{ context?: string | string[] }>;
};

export default async function PlatformFeedbackPage({ params, searchParams }: Props) {
  const { locale } = await params;

  const query = await searchParams;
  const context = query.context === "wp4" ? "wp4" : "wp3";
  const { user } = await requireRole(
    locale,
    context === "wp4" ? [APP_ROLES.educator, APP_ROLES.learner] : APP_ROLES.educator,
  );
  const { eligible } =
    context === "wp4"
      ? await getWp4PlatformFeedbackEligibility(user.id)
      : await getWp3PlatformFeedbackEligibility(user.id);
  if (!eligible) {
    redirect(`/${locale}/${context === "wp4" ? "eportfolio" : "curriculum"}`);
  }

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(11,156,114,0.07),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.07),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8">
        <PlatformFeedbackForm locale={locale} context={context} />
      </div>
    </main>
  );
}
