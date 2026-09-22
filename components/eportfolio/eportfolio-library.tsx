"use client";

import type { EportfolioLibraryItem, EportfolioProgress } from "@/lib/eportfolio/library";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleDashed,
  Filter,
  Globe2,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";

type Props = {
  locale: string;
  items: EportfolioLibraryItem[];
};

type ProgressFilter = EportfolioProgress | "all";
type FeaturedFilter = "all" | "featured";

const SURFACE =
  "rounded-[28px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

function getCountryName(countryCode: string, locale: string) {
  try {
    const displayNames = new Intl.DisplayNames([locale], {
      type: "region",
    });

    return displayNames.of(countryCode) ?? countryCode;
  } catch {
    return countryCode;
  }
}

function getProgressMeta(progress: EportfolioProgress) {
  switch (progress) {
    case "completed":
      return {
        label: "Completed",
        icon: <CheckCircle2 className="h-4 w-4" />,
        className: "border-emerald-100 bg-emerald-50 text-emerald-700",
      };
    case "in_progress":
      return {
        label: "In progress",
        icon: <CircleDashed className="h-4 w-4" />,
        className: "border-amber-100 bg-amber-50 text-amber-700",
      };
    default:
      return {
        label: "Not started",
        icon: <BookOpen className="h-4 w-4" />,
        className: "border-slate-200 bg-slate-50 text-slate-600",
      };
  }
}

function normaliseSearchValue(value: string) {
  return value.trim().toLocaleLowerCase();
}

export default function EportfolioLibrary({ locale, items }: Props) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [industry, setIndustry] = useState("all");
  const [progress, setProgress] = useState<ProgressFilter>("all");
  const [featured, setFeatured] = useState<FeaturedFilter>("all");

  const countryOptions = useMemo(() => {
    return [...new Set(items.map((item) => item.countryCode))]
      .sort((a, b) => getCountryName(a, locale).localeCompare(getCountryName(b, locale), locale))
      .map((code) => ({
        code,
        label: getCountryName(code, locale),
      }));
  }, [items, locale]);

  const industryOptions = useMemo(() => {
    return [...new Set(items.map((item) => item.industry).filter(Boolean) as string[])].sort(
      (a, b) => a.localeCompare(b, locale),
    );
  }, [items, locale]);

  const hasFeaturedItems = items.some((item) => item.isFeatured);

  const filteredItems = useMemo(() => {
    const query = normaliseSearchValue(search);

    return items.filter((item) => {
      const countryName = getCountryName(item.countryCode, locale);

      const searchableValues = [
        item.title,
        item.organization,
        item.summary,
        item.industry,
        item.countryCode,
        countryName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      const matchesSearch = query.length === 0 || searchableValues.includes(query);
      const matchesCountry = country === "all" || item.countryCode === country;
      const matchesIndustry = industry === "all" || item.industry === industry;
      const matchesProgress = progress === "all" || item.progress === progress;
      const matchesFeatured = featured === "all" || item.isFeatured;

      return (
        matchesSearch && matchesCountry && matchesIndustry && matchesProgress && matchesFeatured
      );
    });
  }, [country, featured, industry, items, locale, progress, search]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    country !== "all" ||
    industry !== "all" ||
    progress !== "all" ||
    featured !== "all";

  function clearFilters() {
    setSearch("");
    setCountry("all");
    setIndustry("all");
    setProgress("all");
    setFeatured("all");
  }

  return (
    <div className="space-y-7">
      <section className={`${SURFACE} p-5 sm:p-6`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#7b8794]">
            <Filter className="h-4 w-4" />
            Refine case studies
          </div>

          <p className="text-sm text-[#667180]">
            {filteredItems.length} of {items.length} case {items.length === 1 ? "study" : "studies"}
          </p>
        </div>

        <div
          className={`mt-5 grid gap-3 ${
            hasFeaturedItems
              ? "md:grid-cols-2 xl:grid-cols-[minmax(0,1.55fr)_repeat(4,minmax(0,1fr))]"
              : "md:grid-cols-2 xl:grid-cols-[minmax(0,1.55fr)_repeat(3,minmax(0,1fr))]"
          }`}
        >
          <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 transition focus-within:border-[#0b9c72]/30 focus-within:shadow-[0_8px_24px_rgba(35,45,62,0.05)]">
            <Search className="h-4.5 w-4.5 shrink-0 text-[#98a2b3]" />
            <span className="sr-only">Search case studies</span>
            <input
              value={search}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setSearch(event.target.value);
              }}
              placeholder="Search company, industry or country..."
              className="w-full min-w-0 border-none bg-transparent text-[0.95rem] text-[#31425a] outline-none placeholder:text-[#9aa5b3]"
            />
          </label>

          <select
            aria-label="Filter by country"
            value={country}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              setCountry(event.target.value);
            }}
            className="rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 text-[0.95rem] text-[#31425a] outline-none focus:border-[#0b9c72]/30"
          >
            <option value="all">All countries</option>
            {countryOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by industry"
            value={industry}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              setIndustry(event.target.value);
            }}
            className="rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 text-[0.95rem] text-[#31425a] outline-none focus:border-[#0b9c72]/30"
          >
            <option value="all">All industries</option>
            {industryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by progress"
            value={progress}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              setProgress(event.target.value as ProgressFilter);
            }}
            className="rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 text-[0.95rem] text-[#31425a] outline-none focus:border-[#0b9c72]/30"
          >
            <option value="all">All progress</option>
            <option value="not_started">Not started</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>

          {hasFeaturedItems ? (
            <select
              aria-label="Filter featured case studies"
              value={featured}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                setFeatured(event.target.value as FeaturedFilter);
              }}
              className="rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 text-[0.95rem] text-[#31425a] outline-none focus:border-[#0b9c72]/30"
            >
              <option value="all">All case studies</option>
              <option value="featured">Featured only</option>
            </select>
          ) : null}
        </div>

        {hasActiveFilters ? (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-[#0b7f61] transition hover:text-[#096a52]"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </section>

      {filteredItems.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const progressMeta = getProgressMeta(item.progress);
            const countryName = getCountryName(item.countryCode, locale);
            const companyName = item.organization ?? item.title;
            const initials = companyName
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase();

            return (
              <article
                key={item.slug}
                className={`${SURFACE} group relative flex min-h-88 flex-col overflow-hidden p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(35,45,62,0.09)] sm:p-6`}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(11,156,114,0.10),transparent_62%)]" />

                <div className="relative flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-sm font-bold tracking-[0.08em] text-[#0b7f61]">
                      {initials || "ESG"}
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      {item.isFeatured ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-amber-700">
                          <Sparkles className="h-3.5 w-3.5" />
                          Featured
                        </span>
                      ) : null}

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] ${progressMeta.className}`}
                      >
                        {progressMeta.icon}
                        {progressMeta.label}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#8a97a6]">
                      {countryName}
                      {item.reportingPeriod ? ` · ${item.reportingPeriod}` : ""}
                    </p>

                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#1f2a37]">
                      {item.title}
                    </h2>

                    {item.organization && item.organization !== item.title ? (
                      <p className="mt-1 text-sm text-[#7b8794]">{item.organization}</p>
                    ) : null}
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-[#536174]">
                    <Globe2 className="h-4 w-4 shrink-0 text-[#0b9c72]" />
                    <span className="line-clamp-1">
                      {item.industry ?? "Industry not specified"}
                    </span>
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-6 text-[#5f6c7b] line-clamp-4">
                    {item.summary ??
                      "Open this case study to explore the organisation’s ESG approach and practical evidence."}
                  </p>

                  <div className="mt-6 flex justify-end">
                    <Link
                      href={`/${locale}/eportfolio/${item.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#31425a] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#263548]"
                    >
                      {item.progress === "completed" ? "Review case study" : "Open case study"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <section className={`${SURFACE} px-6 py-12 text-center sm:px-10`}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef7f4] text-[#0b8c69]">
            <Search className="h-5 w-5" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-[#31425a]">
            No case studies match your filters
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#667180]">
            Try another company name, country, industry or progress status.
          </p>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-full border border-[#dbe4ec] bg-white px-4 py-2.5 text-sm font-semibold text-[#31425a] transition hover:bg-[#f7fafc]"
            >
              Clear filters
            </button>
          ) : null}
        </section>
      )}
    </div>
  );
}
