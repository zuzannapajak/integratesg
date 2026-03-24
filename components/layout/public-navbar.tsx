"use client";

import Logo from "@/components/layout/logo";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = {
  locale: string;
};

export default function PublicNavbar({ locale }: Props) {
  const [isCompact, setIsCompact] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;

      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setIsCompact(y > 96);
        tickingRef.current = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => { window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <header
      className={`mock-topbar transition-all duration-500 ${isCompact ? "py-2.5" : "py-3.5"}`}
    >
      <div className="mx-auto flex max-w-385 items-center justify-between px-6 md:px-10 lg:px-14">
        <Logo
          locale={locale}
          className={`transition-all duration-500 ${isCompact ? "w-47" : "w-57"}`}
        />

        <div className="flex items-center gap-4 text-white md:gap-6 lg:gap-8">
          <nav className="hidden items-center gap-6 lg:flex">
            <Link className="mock-topbar-link" href={`/${locale}/about`}>
              About
            </Link>
            <Link className="mock-topbar-link" href={`/${locale}/auth/login`}>
              Educators
            </Link>
            <Link className="mock-topbar-link" href={`/${locale}/auth/login`}>
              Students
            </Link>
          </nav>

          <div className="hidden h-10 w-px bg-white/25 lg:block" />

          <div className="hidden items-center gap-3 sm:flex">
            <Link href={`/${locale}/auth/login`} className="landing-nav-login">
              Sign in
            </Link>
            <Link href={`/${locale}/auth/register`} className="landing-nav-register">
              Register
            </Link>
          </div>

          <Link
            href={`/${locale}/auth/login`}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-xl sm:hidden"
            aria-label="Sign in"
          >
            ○
          </Link>
        </div>
      </div>
    </header>
  );
}
