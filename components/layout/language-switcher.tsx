"use client";

import { APP_LOCALES, AppLocale, LOCALE_META, isAppLocale } from "@/lib/i18n/locales";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  locale: string;
  align?: "left" | "right";
};

function buildLocaleHref(
  pathname: string,
  currentLocale: AppLocale,
  nextLocale: AppLocale,
  searchParams: ReadonlyURLSearchParams,
) {
  const segments = pathname.split("/");

  if (segments[1] === currentLocale) {
    segments[1] = nextLocale;
  } else {
    segments.splice(1, 0, nextLocale);
  }

  const nextPathname = segments.join("/") || `/${nextLocale}`;
  const query = searchParams.toString();

  return query ? `${nextPathname}?${query}` : nextPathname;
}

export default function LanguageSwitcher({ locale, align = "right" }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale: AppLocale = isAppLocale(locale) ? locale : "en";
  const currentMeta = LOCALE_META[currentLocale];

  const items = useMemo(() => {
    return APP_LOCALES.map((itemLocale) => ({
      locale: itemLocale,
      href: buildLocaleHref(
        pathname || `/${currentLocale}`,
        currentLocale,
        itemLocale,
        searchParams,
      ),
      ...LOCALE_META[itemLocale],
      isActive: itemLocale === currentLocale,
    }));
  }, [pathname, searchParams, currentLocale]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!wrapperRef.current) return;
      const target = event.target as Node;

      if (!wrapperRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
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

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => { setIsOpen((prev) => !prev); }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open language switcher"
        className={`group inline-flex h-12 items-center gap-2 rounded-full border px-4 text-sm text-white/92 backdrop-blur-md transition-all duration-200 ${
          isOpen
            ? "border-white/20 bg-white/10"
            : "border-white/14 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
        }`}
      >
        <span
          className={`fi fi-${currentMeta.flagCode} block rounded-[0.16rem] shadow-sm`}
          style={{ width: "1.35rem", height: "1rem" }}
          aria-hidden="true"
        />
        <ChevronDown
          className={`h-4 w-4 text-white/70 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute top-[calc(100%+0.65rem)] z-50 origin-top transition-all duration-200 ${
          align === "left" ? "left-0" : "right-0"
        } ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1.5 opacity-0"
        }`}
      >
        <div className="grid w-[10.5rem] grid-cols-3 gap-2 rounded-3xl border border-white/12 bg-[rgba(58,58,58,0.92)] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.20)] backdrop-blur-xl">
          {items.map((item) => (
            <Link
              key={item.locale}
              href={item.href}
              aria-label={item.switchLabel}
              title={item.switchLabel}
              onClick={() => { setIsOpen(false); }}
              className={`relative flex h-12 w-12 items-center justify-center overflow-visible rounded-2xl transition-colors duration-200 ${
                item.isActive ? "bg-white/14 ring-1 ring-white/20" : "hover:bg-white/10"
              }`}
            >
              <span
                className={`fi fi-${item.flagCode} block rounded-[0.16rem] shadow-sm`}
                style={{ width: "1.5rem", height: "1.08rem" }}
                aria-hidden="true"
              />

              {item.isActive ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#3a3a3a] shadow-sm">
                  <Check className="h-3 w-3" />
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
