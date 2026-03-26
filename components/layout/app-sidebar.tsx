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
    { href: `/${locale}/dashboard`, label: "Dashboard", match: "exact", icon: LayoutDashboard },
    { href: `/${locale}/curriculum`, label: "Curriculum", match: "prefix", icon: BookOpen },
    { href: `/${locale}/eportfolio`, label: "ePortfolio", match: "prefix", icon: FolderOpen },
    { href: `/${locale}/settings`, label: "Settings", match: "prefix", icon: Settings },
  ];

  const studentLinks: NavLink[] = [
    { href: `/${locale}/dashboard`, label: "Dashboard", match: "exact", icon: LayoutDashboard },
    { href: `/${locale}/eportfolio`, label: "ePortfolio", match: "prefix", icon: FolderOpen },
    { href: `/${locale}/scenarios`, label: "Scenario", match: "prefix", icon: PlayCircle },
    { href: `/${locale}/settings`, label: "Settings", match: "prefix", icon: Settings },
  ];

  const adminLinks: NavLink[] = [
    { href: `/${locale}/dashboard`, label: "Dashboard", match: "exact", icon: LayoutDashboard },
    {
      href: `/${locale}/admin/stats`,
      label: "Program statistics",
      match: "prefix",
      icon: BarChart3,
    },
    { href: `/${locale}/settings`, label: "Settings", match: "prefix", icon: Settings },
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative z-40 h-full shrink-0 border-r border-[#e6ebf1] bg-[rgba(255,255,255,0.78)] backdrop-blur-2xl transition-[width] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
        collapsed ? "w-23" : "w-67"
      }`}
    >
      <div
        className={`absolute -right-4 top-1/2 z-60 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#e6ebf1] bg-white text-[#31425a] shadow-md transition-all duration-300 md:flex ${
          collapsed ? "" : "rotate-180"
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </div>

      <div className="sticky top-24 flex h-[calc(100vh-7rem)] flex-col overflow-hidden px-4 py-5">
        <nav className="mt-2 flex-1 space-y-2">
          {links.map((link) => {
            const isActive = isActiveLink(link);
            const Icon = link.icon;

            return (
              <div key={`${link.href}-${link.label}`} className="group relative">
                <Link
                  href={link.href}
                  className={`flex items-center rounded-2xl border px-3 py-3 transition-all duration-250 ${
                    collapsed ? "justify-center" : "gap-3"
                  } ${
                    isActive
                      ? `${theme.active} shadow-md`
                      : `border-transparent text-[#31425a] hover:bg-[#f4f7fa] ${theme.hoverGlow}`
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-all duration-200 ${
                      isActive ? "border-white/50 bg-white/70" : "border-[#edf1f5] bg-white"
                    }`}
                  >
                    <Icon
                      className={`h-[1.05rem] w-[1.05rem] ${isActive ? theme.icon : "text-[#607086]"}`}
                    />
                  </span>

                  <span
                    className={`truncate text-[0.96rem] font-medium transition-all duration-200 ease-in-out ${
                      collapsed
                        ? "invisible ml-0 max-w-0 overflow-hidden opacity-0"
                        : "visible ml-0 max-w-50 opacity-100"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>

                {collapsed && (
                  <div className="pointer-events-none absolute left-full top-1/2 z-30 ml-3 -translate-y-1/2 whitespace-nowrap rounded-xl border border-[#e6ebf1] bg-white px-3 py-2 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                    {link.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div
          className={`mt-auto rounded-3xl border border-[#e9eef4] bg-white p-3 transition-all duration-300 ${
            collapsed ? "invisible opacity-0" : "visible opacity-100"
          }`}
        />
      </div>
    </aside>
  );
}
