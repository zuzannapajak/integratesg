"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = "educator" | "student" | "admin";

type Props = {
  locale: string;
  role: Role;
};

type NavLink = {
  href: string;
  label: string;
  match?: "exact" | "prefix";
};

export default function AppSidebar({ locale, role }: Props) {
  const pathname = usePathname();

  const badge =
    role === "educator"
      ? "bg-[rgba(11,156,114,0.12)] text-[#0b9c72]"
      : role === "admin"
        ? "bg-[rgba(49,66,90,0.12)] text-[#31425a]"
        : "bg-[rgba(239,108,35,0.12)] text-[#ef6c23]";

  const activeAccent =
    role === "educator"
      ? "bg-[rgba(11,156,114,0.10)] text-[#0b9c72] border-[rgba(11,156,114,0.18)]"
      : role === "admin"
        ? "bg-[rgba(49,66,90,0.10)] text-[#31425a] border-[rgba(49,66,90,0.18)]"
        : "bg-[rgba(239,108,35,0.10)] text-[#ef6c23] border-[rgba(239,108,35,0.18)]";

  const activeArrow =
    role === "educator" ? "text-[#0b9c72]" : role === "admin" ? "text-[#31425a]" : "text-[#ef6c23]";

  const roleLabel = role === "educator" ? "Educator" : role === "admin" ? "Admin" : "Student";

  const commonLinks: NavLink[] = [
    { href: `/${locale}/dashboard`, label: "Overview", match: "exact" },
  ];

  const educatorLinks: NavLink[] = [
    { href: `/${locale}/eportfolio`, label: "Courses", match: "prefix" },
    { href: `/${locale}/dashboard/students`, label: "Students", match: "prefix" },
    { href: `/${locale}/scenarios`, label: "Work Packages", match: "prefix" },
    { href: `/${locale}/messages`, label: "Messages", match: "prefix" },
    { href: `/${locale}/settings`, label: "Settings", match: "prefix" },
  ];

  const studentLinks: NavLink[] = [
    { href: `/${locale}/dashboard`, label: "Overview", match: "exact" },
    { href: `/${locale}/eportfolio`, label: "Courses", match: "prefix" },
    { href: `/${locale}/messages`, label: "Messages", match: "prefix" },
    { href: `/${locale}/settings`, label: "Settings", match: "prefix" },
  ];

  const adminLinks: NavLink[] = [
    { href: `/${locale}/dashboard`, label: "Overview", match: "exact" },
    { href: `/${locale}/admin/stats`, label: "Program statistics", match: "prefix" },
    { href: `/${locale}/settings`, label: "Settings", match: "prefix" },
  ];

  const links: NavLink[] =
    role === "educator"
      ? [...commonLinks, ...educatorLinks]
      : role === "admin"
        ? adminLinks
        : studentLinks;

  const isActiveLink = (link: NavLink) => {
    if (!pathname) return false;

    if (link.match === "exact") {
      return pathname === link.href;
    }

    return pathname === link.href || pathname.startsWith(`${link.href}/`);
  };

  return (
    <aside className="h-full border-r border-[#e6ebf1] bg-white/72 px-5 py-6 backdrop-blur-xl">
      <div className="sticky top-24">
        <div className="mb-6">
          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.14em] ${badge}`}
          >
            {roleLabel}
          </span>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const isActive = isActiveLink(link);

            return (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center justify-between rounded-2xl border px-3 py-3 text-[0.96rem] font-medium transition-all duration-200 ${
                  isActive
                    ? `${activeAccent} shadow-[0_10px_24px_rgba(35,45,62,0.05)]`
                    : "border-transparent text-[#31425a] hover:bg-[#f4f7fa]"
                }`}
              >
                <span>{link.label}</span>

                <span
                  className={`transition-all duration-200 ${
                    isActive
                      ? `${activeArrow} opacity-100`
                      : "text-[#b3bcc8] opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
                  }`}
                >
                  →
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
