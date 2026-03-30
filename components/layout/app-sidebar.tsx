"use client";

import {
  BarChart3,
  BookOpen,
  ChevronRight,
  FolderOpen,
  LayoutDashboard,
  PlayCircle,
  Settings,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Role = "educator" | "student" | "admin";

type Props = {
  locale: string;
  role: Role;
};

type NavLink = {
  href: string;
  label: string;
  match?: "exact" | "prefix";
  icon: React.ComponentType<{ className?: string }>;
};

export default function AppSidebar({ locale, role }: Props) {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const storageKey = `integratESG:sidebar:${role}:collapsed`;

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    const saved = window.localStorage.getItem(storageKey);
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, String(collapsed));
  }, [storageKey, collapsed]);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      setCollapsed(true);
    }
  };

  const theme = useMemo(() => {
    if (role === "educator") {
      return {
        active:
          "bg-[linear-gradient(135deg,rgba(11,156,114,0.12),rgba(11,156,114,0.06))] text-[#0b9c72] border-[rgba(11,156,114,0.18)]",
        icon: "text-[#0b9c72]",
        hoverGlow: "hover:shadow-[0_14px_30px_rgba(11,156,114,0.10)]",
      };
    }

    if (role === "admin") {
      return {
        active:
          "bg-[linear-gradient(135deg,rgba(49,66,90,0.12),rgba(49,66,90,0.06))] text-[#31425a] border-[rgba(49,66,90,0.18)]",
        icon: "text-[#31425a]",
        hoverGlow: "hover:shadow-[0_14px_30px_rgba(49,66,90,0.10)]",
      };
    }

    return {
      active:
        "bg-[linear-gradient(135deg,rgba(239,108,35,0.12),rgba(239,108,35,0.06))] text-[#ef6c23] border-[rgba(239,108,35,0.18)]",
      icon: "text-[#ef6c23]",
      hoverGlow: "hover:shadow-[0_14px_30px_rgba(239,108,35,0.10)]",
    };
  }, [role]);

  const educatorLinks: NavLink[] = [
    { href: `/${locale}/dashboard`, label: t("dashboard"), match: "exact", icon: LayoutDashboard },
    { href: `/${locale}/curriculum`, label: t("curriculum"), match: "prefix", icon: BookOpen },
    { href: `/${locale}/eportfolio`, label: t("eportfolio"), match: "prefix", icon: FolderOpen },
    { href: `/${locale}/settings`, label: t("settings"), match: "prefix", icon: Settings },
  ];

  const studentLinks: NavLink[] = [
    { href: `/${locale}/dashboard`, label: t("dashboard"), match: "exact", icon: LayoutDashboard },
    { href: `/${locale}/scenarios`, label: t("scenario"), match: "prefix", icon: PlayCircle },
    { href: `/${locale}/eportfolio`, label: t("eportfolio"), match: "prefix", icon: FolderOpen },
    { href: `/${locale}/settings`, label: t("settings"), match: "prefix", icon: Settings },
  ];

  const adminLinks: NavLink[] = [
    { href: `/${locale}/dashboard`, label: t("dashboard"), match: "exact", icon: LayoutDashboard },
    {
      href: `/${locale}/admin/stats`,
      label: t("statistics"),
      match: "prefix",
      icon: BarChart3,
    },
    { href: `/${locale}/settings`, label: t("settings"), match: "prefix", icon: Settings },
  ];

  const links = role === "educator" ? educatorLinks : role === "admin" ? adminLinks : studentLinks;

  const isActiveLink = (link: NavLink) => {
    if (!pathname) {
      return false;
    }

    if (link.match === "exact") {
      return pathname === link.href;
    }

    return pathname === link.href || pathname.startsWith(`${link.href}/`);
  };

  return (
    <aside
      className={`group hidden h-full border-r border-[#e6ebf1] bg-white/88 backdrop-blur-xl transition-[width] duration-300 md:flex md:flex-col ${
        collapsed ? "md:w-[88px]" : "md:w-[272px]"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={collapsed ? t("expand") : t("collapse")}
    >
      <div className="flex h-20 items-center justify-between px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f3f6f9]">
            <LayoutDashboard className={`h-5 w-5 ${theme.icon}`} />
          </div>

          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-[0.82rem] font-medium uppercase tracking-[0.14em] text-[#94a0af]">
                IntegratESG
              </p>
              <p className="truncate text-[1rem] font-semibold text-[#31425a]">{t("dashboard")}</p>
            </div>
          ) : null}
        </div>

        {!collapsed ? <ChevronRight className="h-4 w-4 text-[#9aa5b4]" /> : null}
      </div>

      <nav className="flex-1 space-y-1 px-4 pb-5">
        {links.map((link) => {
          const isActive = isActiveLink(link);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex min-h-13 items-center gap-3 rounded-2xl border px-3 transition-all duration-200 ${
                isActive
                  ? `${theme.active} ${theme.hoverGlow} border`
                  : "border-transparent text-[#617084] hover:border-[#e5ebf1] hover:bg-[#f8fafc] hover:text-[#31425a]"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isActive ? "bg-white/80" : "bg-[#f3f6f9]"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? theme.icon : "text-[#7f8b99]"}`} />
              </span>

              {!collapsed ? (
                <span className="truncate text-[0.96rem] font-medium">{link.label}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
