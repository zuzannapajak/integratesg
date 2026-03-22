import Logo from "@/components/layout/logo";
import Link from "next/link";

type Props = {
  locale: string;
  role: "educator" | "student";
  email: string;
};

export default function ProtectedNavbar({ locale, role }: Props) {
  const label = role === "educator" ? "Educator1" : "Student1";

  const educatorLinks = [
    { href: `/${locale}/eportfolio`, label: "Courses" },
    { href: `/${locale}/dashboard`, label: "Students" },
    { href: `/${locale}/scenarios`, label: "Work Packages" },
    { href: `/${locale}/dashboard`, label: "Messages" },
    { href: `/${locale}/dashboard`, label: "Settings" },
  ];

  const studentLinks = [
    { href: `/${locale}/dashboard`, label: "Overview" },
    { href: `/${locale}/eportfolio`, label: "Courses" },
    { href: `/${locale}/dashboard`, label: "Messages" },
    { href: `/${locale}/dashboard`, label: "Settings" },
  ];

  const links = role === "educator" ? educatorLinks : studentLinks;

  return (
    <header className="mock-topbar">
      <div className="mx-auto flex h-19.5 max-w-295 items-center justify-between px-6">
        <Logo locale={locale} />

        <div className="flex items-center gap-8 text-[17px] text-white">
          <nav className="flex items-center gap-8">
            <Link href={`/${locale}`}>About</Link>
            <Link href={`/${locale}/dashboard`}>Educators</Link>
            <Link href={`/${locale}/dashboard`}>Students</Link>
          </nav>

          <div className="h-12 w-px bg-white/70" />

          <div className="group relative">
            <button className="flex items-center gap-2 text-white">
              <span>▼</span>
              <span>{label}</span>
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
