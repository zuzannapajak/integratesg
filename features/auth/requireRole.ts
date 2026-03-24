import { AppRole } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireRole(locale: string, allowedRoles: AppRole | AppRole[]) {
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

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!profile || !roles.includes(profile.role)) {
    redirect(`/${locale}/dashboard`);
  }

  return { user, profile };
}
