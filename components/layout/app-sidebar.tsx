import LogoutButton from "@/components/auth/logout-button";
import { APP_ROLES, AppRole, ROLE_LABELS, canAccessCurriculum } from "@/lib/auth/roles";
import Link from "next/link";

type Props = {
  locale: string;
  role: AppRole;
  email: string;
};

export default function AppSidebar({ locale, role, email }: Props) {
  const links =
    role === APP_ROLES.admin
      ? [{ href: `/${locale}/stats`, label: "Statistics" }]
      : [
          { href: `/${locale}/dashboard`, label: "Overview" },
          { href: `/${locale}/eportfolio`, label: "ePortfolio" },
          { href: `/${locale}/scenarios`, label: "Scenarios" },
          ...(canAccessCurriculum(role)
            ? [{ href: `/${locale}/curriculum`, label: "Curriculum" }]
            : []),
        ];

  return (
    <aside className="border-r bg-white px-5 py-6">
      <div className="mb-8">
        <Link href={`/${locale}`} className="text-xl font-semibold">
          IntegratESG
        </Link>
      </div>

      <div className="mb-8 rounded-xl border p-4">
        <p className="text-sm font-semibold">{ROLE_LABELS[role]}</p>
        <p className="mt-1 break-all text-sm text-neutral-500">{email}</p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="block rounded-lg px-3 py-2 text-sm transition hover:bg-neutral-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8">
        <LogoutButton />
      </div>
    </aside>
  );
}
