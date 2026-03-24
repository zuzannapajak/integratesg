import Logo from "@/components/layout/logo";
import { APP_ROLES, AppRole, ROLE_LABELS, canAccessCurriculum } from "@/lib/auth/roles";
import Link from "next/link";

type Props = {
  locale: string;
  role: AppRole;
  email: string;
};

export default function ProtectedNavbar({ locale, role }: Props) {
  const links =
    role === APP_ROLES.admin
      ? [{ href: `/${locale}/stats`, label: "Statistics" }]
      : [
          { href: `/${locale}/dashboard`, label: "Dashboard" },
          { href: `/${locale}/eportfolio`, label: "ePortfolio" },
          { href: `/${locale}/scenarios`, label: "Scenarios" },
          ...(canAccessCurriculum(role)
            ? [{ href: `/${locale}/curriculum`, label: "Curriculum" }]
            : []),
        ];

  return (
    <header className="mock-topbar">
      <div className="mx-auto flex h-19.5 max-w-295 items-center justify-between px-6">
        <Logo locale={locale} />

        <div className="flex items-center gap-8 text-[17px] text-white">
          <nav className="flex items-center gap-8">
            <Link href={`/${locale}`}>About</Link>
            <Link href={`/${locale}/dashboard`}>Platform</Link>
          </nav>

          <div className="h-12 w-px bg-white/70" />

          <div className="group relative">
            <button className="flex items-center gap-2 text-white">
              <span>▼</span>
              <span>{ROLE_LABELS[role]}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-2xl">
                ○
              </span>
            </button>

            <div className="absolute right-0 top-14 hidden min-w-45 group-hover:block">
              <div className="mock-menu-panel p-3">
                {links.map((link) => (
                  <Link key={link.label} href={link.href} className="mock-menu-link text-[16px]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
