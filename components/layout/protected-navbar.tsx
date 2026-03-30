"use client";

import LogoutButton from "@/components/auth/login/logout-button";
import Logo from "@/components/layout/logo";
import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = {
  locale: string;
  role: "educator" | "student" | "admin";
  email: string;
  forceSolid?: boolean;
};

export default function ProtectedNavbar({ locale, forceSolid = false }: Props) {
  const t = useTranslations("ProtectedNavbar");
  const common = useTranslations("Common");

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tickingRef = useRef(false);
  const scrolledRef = useRef(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;

      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const y = window.scrollY;

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
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current) return;

      const target = event.target as Node;
      if (!menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const links = [{ href: `/${locale}/settings`, label: t("settings") }];

  const scrolledClasses = forceSolid
    ? "bg-[rgba(58,58,58,0.94)] backdrop-blur-md border-b border-white/8 shadow-none"
    : "bg-[rgba(58,58,58,0.78)] backdrop-blur-xl border-b border-white/12 shadow-[0_8px_24px_rgba(0,0,0,0.10)]";

  const defaultClasses =
    "bg-[rgba(58,58,58,0.94)] backdrop-blur-md border-b border-white/8 shadow-none";

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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

          <div className="hidden h-10 w-px bg-white/25 lg:block" />

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen((prev) => !prev);
              }}
              className="flex items-center gap-3 text-white"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              aria-label={common("openAccountMenu")}
            >
              <span className="hidden text-sm sm:inline">{isMenuOpen ? "▲" : "▼"}</span>

              <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white">
                <UserRound aria-hidden="true" className="h-6 w-6 text-white" strokeWidth={2.2} />
              </span>
            </button>

            <div
              className={`absolute right-0 z-50 w-[min(22rem,calc(100vw-2rem))] origin-top-right transition-all duration-200 ${
                isMenuOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              }`}
              style={{ top: "calc(100% + 1.0625rem)" }}
            >
              <div
                className={`border p-3 transition-all duration-300 ${
                  isScrolled
                    ? "border-white/12 bg-[rgba(58,58,58,0.78)] backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
                    : "border-white/8 bg-[rgba(58,58,58,0.94)] backdrop-blur-md shadow-none"
                } rounded-b-3xl`}
              >
                <div className="lg:hidden">
                  <Link
                    href={`/${locale}`}
                    className="mock-menu-link text-[16px]"
                    onClick={closeMenu}
                  >
                    {t("about")}
                  </Link>
                  <Link
                    href={`/${locale}/dashboard`}
                    className="mock-menu-link text-[16px]"
                    onClick={closeMenu}
                  >
                    {t("dashboard")}
                  </Link>
                </div>

                {links.map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    className="mock-menu-link text-[16px]"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="mt-3 pt-1">
                  <LogoutButton
                    redirectTo={`/${locale}/auth/login`}
                    className="flex w-full items-center justify-center rounded-2xl border border-red-400/40 bg-white/6 px-4 py-1.5 text-[16px] text-white/92 transition hover:bg-white/10"
                  >
                    {t("logOut")}
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
