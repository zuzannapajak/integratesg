"use client";

import LanguageSwitcher from "@/components/layout/language-switcher";
import Logo from "@/components/layout/logo";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = {
  locale: string;
  forceCompact?: boolean;
  forceSolid?: boolean;
};

export default function PublicNavbar({ locale, forceCompact = false, forceSolid = false }: Props) {
  const t = useTranslations("PublicNavbar");
  const common = useTranslations("Common");
  const [isScrolledCompact, setIsScrolledCompact] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tickingRef = useRef(false);
  const compactRef = useRef(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (forceCompact) {
      return;
    }

    const onScroll = () => {
      if (tickingRef.current) return;

      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const y = window.scrollY;

        if (!compactRef.current && y > 120) {
          compactRef.current = true;
          setIsScrolledCompact(true);
        } else if (compactRef.current && y < 28) {
          compactRef.current = false;
          setIsScrolledCompact(false);
        }

        tickingRef.current = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [forceCompact]);

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

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const isCompact = forceCompact || isScrolledCompact;

  const compactClasses = forceSolid
    ? "bg-[rgba(58,58,58,0.94)] py-2.5 backdrop-blur-md border-b border-white/8 shadow-none"
    : "bg-[rgba(58,58,58,0.78)] py-2.5 backdrop-blur-xl border-b border-white/12 shadow-[0_8px_24px_rgba(0,0,0,0.10)]";

  const defaultClasses =
    "bg-[rgba(58,58,58,0.94)] py-3.5 backdrop-blur-md border-b border-white/8 shadow-none";

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const mobileLinks = [
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/educators`, label: t("educators") },
    { href: `/${locale}/students`, label: t("students") },
  ];

  return (
    <header
      className={`mock-topbar relative z-60 transition-all duration-500 ${isCompact ? compactClasses : defaultClasses}`}
    >
      <div className="mx-auto flex max-w-385 items-center justify-between gap-3 px-4 sm:px-6 md:px-10 lg:px-14">
        <Logo
          locale={locale}
          href={`/${locale}`}
          className={`min-w-0 max-w-46 transition-all duration-500 sm:max-w-none ${isCompact ? "w-40 sm:w-47" : "w-44 sm:w-57"}`}
        />

        <div className="flex items-center gap-2 text-white sm:gap-3 md:gap-6 lg:gap-8">
          <nav className="hidden items-center gap-6 lg:flex">
            <Link className="mock-topbar-link" href={`/${locale}/about`}>
              {t("about")}
            </Link>
            <Link className="mock-topbar-link" href={`/${locale}/educators`}>
              {t("educators")}
            </Link>
            <Link className="mock-topbar-link" href={`/${locale}/students`}>
              {t("students")}
            </Link>
          </nav>

          <div className="hidden h-8 w-px bg-white/14 lg:block" />

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher locale={locale} align="right" />

            <div className="hidden items-center gap-3 sm:flex">
              <Link href={`/${locale}/auth/login`} className="landing-nav-secondary">
                {t("signIn")}
              </Link>
              <Link href={`/${locale}/auth/register`} className="landing-nav-primary">
                {t("register")}
              </Link>
            </div>

            <div ref={menuRef} className="relative sm:hidden">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen((prev) => !prev);
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/5 text-white transition hover:border-white/24 hover:bg-white/10"
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
                aria-label={common("openAccountMenu")}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <div
                className={`absolute right-0 top-[calc(100%+0.75rem)] z-70 w-[min(22rem,calc(100vw-2rem))] origin-top-right transition-all duration-200 ${
                  isMenuOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1.5 opacity-0"
                }`}
              >
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[rgba(58,58,58,0.96)] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                  <div className="space-y-1.5">
                    {mobileLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMenu}
                        className="flex items-center rounded-2xl px-3.5 py-3 text-[15px] font-medium text-white/90 transition hover:bg-white/[0.07] hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-3 border-t border-white/8 pt-3">
                    <div className="grid gap-2">
                      <Link
                        href={`/${locale}/auth/login`}
                        onClick={closeMenu}
                        className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/14 bg-white/3 px-4 text-sm font-semibold text-white transition hover:border-white/22 hover:bg-white/8"
                      >
                        {t("signIn")}
                      </Link>
                      <Link
                        href={`/${locale}/auth/register`}
                        onClick={closeMenu}
                        className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-white px-4 text-sm font-semibold text-[#31425a] transition hover:bg-white/90"
                      >
                        {t("register")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
