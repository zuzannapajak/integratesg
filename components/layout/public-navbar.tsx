"use client";

import LanguageSwitcher from "@/components/layout/language-switcher";
import Logo from "@/components/layout/logo";
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
  const [isScrolledCompact, setIsScrolledCompact] = useState(false);
  const tickingRef = useRef(false);
  const compactRef = useRef(false);

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

  const isCompact = forceCompact || isScrolledCompact;

  const compactClasses = forceSolid
    ? "bg-[rgba(58,58,58,0.94)] py-2.5 backdrop-blur-md border-b border-white/8 shadow-none"
    : "bg-[rgba(58,58,58,0.78)] py-2.5 backdrop-blur-xl border-b border-white/12 shadow-[0_8px_24px_rgba(0,0,0,0.10)]";

  const defaultClasses =
    "bg-[rgba(58,58,58,0.94)] py-3.5 backdrop-blur-md border-b border-white/8 shadow-none";

  return (
    <header
      className={`mock-topbar transition-all duration-500 ${isCompact ? compactClasses : defaultClasses}`}
    >
      <div className="mx-auto flex max-w-385 items-center justify-between px-6 md:px-10 lg:px-14">
        <Logo
          locale={locale}
          href={`/${locale}`}
          className={`transition-all duration-500 ${isCompact ? "w-47" : "w-57"}`}
        />

        <div className="flex items-center gap-4 text-white md:gap-6 lg:gap-8">
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

          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} align="right" />

            <div className="hidden items-center gap-3 sm:flex">
              <Link href={`/${locale}/auth/login`} className="landing-nav-secondary">
                {t("signIn")}
              </Link>
              <Link href={`/${locale}/auth/register`} className="landing-nav-primary">
                {t("register")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
