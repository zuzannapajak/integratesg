import CaseStudyLaunchShell from "@/components/eportfolio/case-study-launch-shell";
import { getCaseStudyDetail } from "@/lib/eportfolio/queries";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CaseStudyDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    redirect(`/${locale}/auth/login`);
  }

  const caseStudy = await getCaseStudyDetail({ locale, slug });

  if (!caseStudy) {
    notFound();
  }

  return <CaseStudyLaunchShell locale={locale} caseStudy={caseStudy} />;
}
