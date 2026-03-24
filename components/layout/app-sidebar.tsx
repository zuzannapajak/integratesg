import LogoutButton from "@/components/auth/logout-button";
import Link from "next/link";

type Role = "educator" | "student" | "admin";

type Props = {
  locale: string;
  role: Role;
  email: string;
};

export default function AppSidebar({ locale, role, email }: Props) {
  const commonLinks = [{ href: `/${locale}/dashboard`, label: "Overview" }];

  const educatorLinks = [
    { href: `/${locale}/eportfolio`, label: "ePortfolio" },
    { href: `/${locale}/curriculum`, label: "Curriculum" },
  ];

  const studentLinks = [
    { href: `/${locale}/eportfolio`, label: "ePortfolio" },
    { href: `/${locale}/scenarios`, label: "Scenarios" },
  ];

  const adminLinks = [{ href: `/${locale}/admin/stats`, label: "Program statistics" }];

  const links =
    role === "educator"
      ? [...commonLinks, ...educatorLinks]
      : role === "admin"
        ? [...commonLinks, ...adminLinks]
        : [...commonLinks, ...studentLinks];

  return (
    <aside className="hidden w-72 border-r bg-white px-5 py-6 lg:block">
      <div className="mb-8">
        <Link href={`/${locale}`} className="text-xl font-semibold">
          IntegratESG
        </Link>
      </div>

      <div className="mb-8 rounded-xl border p-4">
        <p className="text-sm font-semibold capitalize">{role}</p>
        <p className="mt-1 break-all text-sm text-neutral-500">{email}</p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
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
