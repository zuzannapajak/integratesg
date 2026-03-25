import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../lib/supabase/server";
import CompleteProfileForm from "./complete-profile-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CompleteProfilePage({ params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (existingProfile) {
    redirect(`/${locale}/dashboard`);
  }

  const email = user.email ?? "";

  return <CompleteProfileForm locale={locale} email={email} />;
}
