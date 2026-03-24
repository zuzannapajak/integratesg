import Logo from "@/components/layout/logo";
import Link from "next/link";

type Role = "educator" | "student" | "admin";

type Props = {
  locale: string;
  role: Role;
  email: string;
};

export default function ProtectedNavbar({ locale, role, email }: Props) {
  const label = role === "educator" ? "Educator" : role === "admin" ? "Admin" : "Student";

  const roleLinks =
    role === "educator"
      ? [
          { href: `/${locale}/eportfolio`, label: "ePortfolio" },
          { href: `/${locale}/scenarios`, label: "Scenarios" },
          { href: `/${locale}/curriculum`, label: "Curriculum" },
        ]
      : role === "admin"
        ? [{ href: `/${locale}/admin/stats`, label: "Statistics" }]
        : [
            { href: `/${locale}/eportfolio`, label: "ePortfolio" },
            { href: `/${locale}/scenarios`, label: "Scenarios" },
          ];

  return (
    <header className="mock-topbar">
      <div className="mx-auto flex h-19.5 max-w-295 items-center justify-between px-6">
        <Logo locale={locale} />

        <div className="flex items-center gap-8 text-[17px] text-white">
          <nav className="hidden items-center gap-8 md:flex">
            <Link href={`/${locale}`} className="mock-topbar-link">
              About
            </Link>
            <Link href={`/${locale}/dashboard`} className="mock-topbar-link">
              Dashboard
            </Link>
          </nav>

          <div className="hidden h-12 w-px bg-white/70 md:block" />

          <div className="group relative">
            <button className="flex items-center gap-2 text-white">
              <span>▼</span>
              <span>{label}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-2xl">
                ○
              </span>
            </button>

            <div className="absolute right-0 top-14 hidden min-w-56 group-hover:block">
              <div className="mock-menu-panel p-3">
                <p className="border-b border-white/25 px-3 pb-2 text-sm text-white/80">{email}</p>

                {roleLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="mock-menu-link text-[16px]">
                    {link.label}
                  </Link>
                ))}

                <Link href={`/${locale}/dashboard`} className="mock-menu-link text-[16px]">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
