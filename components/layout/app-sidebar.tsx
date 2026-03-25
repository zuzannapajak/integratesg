import LogoutButton from "@/components/auth/login/logout-button";
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
    { href: `/${locale}/eportfolio`, label: "Courses" },
    { href: `/${locale}/dashboard`, label: "Students" },
    { href: `/${locale}/scenarios`, label: "Work Packages" },
    { href: `/${locale}/dashboard`, label: "Messages" },
    { href: `/${locale}/settings`, label: "Settings" },
  ];

  const studentLinks = [
    { href: `/${locale}/dashboard`, label: "Overview" },
    { href: `/${locale}/eportfolio`, label: "Courses" },
    { href: `/${locale}/dashboard`, label: "Messages" },
    { href: `/${locale}/settings`, label: "Settings" },
  ];

  const adminLinks = [
    { href: `/${locale}/admin/stats`, label: "Program statistics" },
    { href: `/${locale}/settings`, label: "Settings" },
  ];

  const links =
    role === "educator"
      ? [...commonLinks, ...educatorLinks]
      : role === "admin"
        ? [...commonLinks, ...adminLinks]
        : studentLinks;

  return (
    <aside className="border-r bg-white px-5 py-6">
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
