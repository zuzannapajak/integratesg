"use client";

import LogoutButton from "@/components/auth/login/logout-button";
import Logo from "@/components/layout/logo";
import { ChevronDown, Info, LayoutDashboard, LogOut, Settings, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  locale: string;
  role: "educator" | "student" | "admin";
  email: string;
  forceSolid?: boolean;
};

type MenuLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  mobileOnly?: boolean;
};

export default function ProtectedNavbar({ locale, role, email, forceSolid = false }: Props) {
  const t = useTranslations("ProtectedNavbar");
  const common = useTranslations("Common");

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tickingRef = useRef(false);
  const scrolledRef = useRef(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>(
      "[data-protected-scroll-container]",
    );

    if (!scrollContainer) return;

    const onScroll = () => {
      if (tickingRef.current) return;

      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const y = scrollContainer.scrollTop;

        if (!scrolledRef.current && y > 120) {
          scrolledRef.current = true;
          setIsScrolled(true);
        } else if (scrolledRef.current && y < 28) {
          scrolledRef.current = false;
          setIsScrolled(false);
        }

        tickingRef.current = false;
      });
    };

    onScroll();
    scrollContainer.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let rafId = 0;

    const attachScrollListener = () => {
      const scrollContainer = document.querySelector<HTMLElement>(
        "[data-protected-scroll-container]",
      );

      if (!scrollContainer) {
        rafId = window.requestAnimationFrame(attachScrollListener);
        return;
      }

      const onScroll = () => {
        if (tickingRef.current) return;

        tickingRef.current = true;

        window.requestAnimationFrame(() => {
          const y = scrollContainer.scrollTop;

          if (!scrolledRef.current && y > 120) {
            scrolledRef.current = true;
            setIsScrolled(true);
          } else if (scrolledRef.current && y < 28) {
            scrolledRef.current = false;
            setIsScrolled(false);
          }

          tickingRef.current = false;
        });
      };

      onScroll();
      scrollContainer.addEventListener("scroll", onScroll, { passive: true });

      cleanup = () => {
        scrollContainer.removeEventListener("scroll", onScroll);
      };
    };

    attachScrollListener();

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      cleanup?.();
    };
  }, []);

  const links = useMemo<MenuLink[]>(
    () => [
      {
        href: `/${locale}`,
        label: t("about"),
        icon: Info,
        mobileOnly: true,
      },
      {
        href: `/${locale}/dashboard`,
        label: t("dashboard"),
        icon: LayoutDashboard,
        mobileOnly: true,
      },
      {
        href: `/${locale}/settings`,
        label: t("settings"),
        icon: Settings,
      },
    ],
    [locale, t],
  );

  const scrolledClasses = forceSolid
    ? "bg-[rgba(58,58,58,0.94)] backdrop-blur-md border-b border-white/8 shadow-none"
    : "bg-[rgba(58,58,58,0.78)] backdrop-blur-xl border-b border-white/12 shadow-[0_8px_24px_rgba(0,0,0,0.10)]";

  const defaultClasses =
    "bg-[rgba(58,58,58,0.94)] backdrop-blur-md border-b border-white/8 shadow-none";

  const panelClasses = isScrolled
    ? "border-white/12 bg-[rgba(58,58,58,0.78)] backdrop-blur-xl shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
    : "border-white/10 bg-[rgba(58,58,58,0.94)] backdrop-blur-md shadow-[0_12px_28px_rgba(0,0,0,0.14)]";

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <header
      className={`mock-topbar h-19.5 transition-all duration-500 ${
        isScrolled ? scrolledClasses : defaultClasses
      }`}
    >
      <div className="mx-auto flex h-full max-w-385 items-center justify-between px-6 md:px-10 lg:px-14">
        <Logo locale={locale} href={`/${locale}/dashboard`} className="w-47" />

        <div className="flex items-center gap-4 text-white md:gap-6 lg:gap-8">
          <nav className="hidden items-center gap-6 lg:flex">
            <Link className="mock-topbar-link" href={`/${locale}`}>
              {t("about")}
            </Link>
            <Link className="mock-topbar-link" href={`/${locale}/dashboard`}>
              {t("dashboard")}
            </Link>
          </nav>

          <div className="hidden h-8 w-px bg-white/14 lg:block" />

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen((prev) => !prev);
              }}
              className={`group inline-flex h-12 items-center gap-2 rounded-full border px-2.5 pl-2 pr-3 text-white transition-all duration-200 ${
                isMenuOpen
                  ? "border-white/20 bg-white/10"
                  : "border-white/14 bg-white/3 hover:border-white/20 hover:bg-white/6"
              }`}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              aria-label={common("openAccountMenu")}
            >
              <span className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/14">
                <UserRound
                  aria-hidden="true"
                  className="h-4.5 w-4.5 text-white"
                  strokeWidth={2.1}
                />
              </span>

              <ChevronDown
                className={`h-4 w-4 text-white/72 transition-transform duration-200 ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute right-0 z-50 w-[min(22rem,calc(100vw-2rem))] origin-top-right transition-all duration-200 ${
                isMenuOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1.5 opacity-0"
              }`}
              style={{ top: "calc(100% + 0.85rem)" }}
            >
              <div className={`rounded-3xl border p-3 ${panelClasses}`}>
                <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/45">
                    {common("signedIn")}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-white">{email}</p>
                  <p className="mt-1 text-xs text-white/55">{roleLabel}</p>
                </div>

                <div className="mt-3 space-y-1.5">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const visibilityClass = link.mobileOnly ? "lg:hidden" : "";

                    return (
                      <Link
                        key={`${link.href}-${link.label}`}
                        href={link.href}
                        onClick={closeMenu}
                        className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[15px] text-white/90 transition hover:bg-white/[0.07] hover:text-white ${visibilityClass}`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/6 ring-1 ring-white/8">
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-3 border-t border-white/8 pt-3">
                  <LogoutButton
                    redirectTo={`/${locale}/auth/login`}
                    className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-[15px] text-white/88 transition hover:bg-red-500/10 hover:text-white"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/12 ring-1 ring-red-300/15">
                      <LogOut className="h-4.5 w-4.5" />
                    </span>
                    <span>{t("logOut")}</span>
                  </LogoutButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
