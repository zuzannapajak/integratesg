import MarkdownContent from "@/components/ui/markdown-content";
import type { EportfolioCaseStudyDetail } from "@/lib/eportfolio/detail";
import {
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  Globe2,
  Leaf,
  Lightbulb,
  List,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import EportfolioProgressActions from "./eportfolio-progress-actions";

type Props = {
  locale: string;
  caseStudy: EportfolioCaseStudyDetail;
};

type MarkdownSection = {
  heading: string;
  content: string;
};

type SectionKey =
  | "company"
  | "integration"
  | "environmental"
  | "social"
  | "governance"
  | "ratings"
  | "compliance"
  | "recommendations"
  | "sources";

const SURFACE =
  "rounded-[28px] border border-white/70 bg-white/90 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

const NAV_ITEMS: Array<{
  key: SectionKey | "lessons";
  label: string;
  id: string;
}> = [
  {
    key: "company",
    label: "Company overview",
    id: "company-overview",
  },
  {
    key: "integration",
    label: "ESG integration",
    id: "esg-integration",
  },
  {
    key: "environmental",
    label: "Environmental",
    id: "environmental",
  },
  {
    key: "social",
    label: "Social",
    id: "social",
  },
  {
    key: "governance",
    label: "Governance",
    id: "governance",
  },
  {
    key: "ratings",
    label: "Ratings / evidence",
    id: "ratings-evidence",
  },
  {
    key: "compliance",
    label: "Regulatory compliance",
    id: "regulatory-compliance",
  },
  {
    key: "recommendations",
    label: "Recommendations",
    id: "recommendations",
  },
  {
    key: "lessons",
    label: "Key lessons",
    id: "key-lessons",
  },
  {
    key: "sources",
    label: "Sources",
    id: "sources",
  },
];

function parseMarkdownSections(content: string): MarkdownSection[] {
  const matches = Array.from(content.matchAll(/^##\s+(.+?)\s*$/gm));

  if (matches.length === 0) {
    return [
      {
        heading: "Case study",
        content,
      },
    ];
  }

  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const nextMatch = matches.at(index + 1);
    const end = nextMatch ? nextMatch.index : content.length;

    return {
      heading: match[1].trim(),
      content: content.slice(start, end).trim(),
    };
  });
}

function normaliseHeading(heading: string) {
  return heading
    .trim()
    .toLocaleLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function classifySection(section: MarkdownSection): SectionKey | null {
  const heading = normaliseHeading(section.heading);

  if (heading.startsWith("company overview")) {
    return "company";
  }

  if (heading.startsWith("esg integration")) {
    return "integration";
  }

  if (heading.startsWith("environmental")) {
    return "environmental";
  }

  if (heading.startsWith("social")) {
    return "social";
  }

  if (heading.startsWith("governance")) {
    return "governance";
  }

  if (
    heading.startsWith("ratings") ||
    heading.startsWith("indices scoring") ||
    heading.startsWith("external evidence")
  ) {
    return "ratings";
  }

  if (heading.startsWith("regulatory compliance")) {
    return "compliance";
  }

  if (heading.startsWith("recommendations")) {
    return "recommendations";
  }

  if (heading.startsWith("sources") || heading.startsWith("references")) {
    return "sources";
  }

  return null;
}

function getCountryName(countryCode: string, locale: string) {
  try {
    return (
      new Intl.DisplayNames([locale], {
        type: "region",
      }).of(countryCode) ?? countryCode
    );
  } catch {
    return countryCode;
  }
}

function getSection(sections: MarkdownSection[], key: SectionKey): MarkdownSection | null {
  return sections.find((section) => classifySection(section) === key) ?? null;
}

export default function EportfolioDetail({ locale, caseStudy }: Props) {
  const sections = parseMarkdownSections(caseStudy.content);

  const company = getSection(sections, "company");
  const integration = getSection(sections, "integration");
  const environmental = getSection(sections, "environmental");
  const social = getSection(sections, "social");
  const governance = getSection(sections, "governance");
  const ratings = getSection(sections, "ratings");
  const compliance = getSection(sections, "compliance");
  const recommendations = getSection(sections, "recommendations");
  const sources = getSection(sections, "sources");

  const classifiedSections = new Set(
    sections
      .map((section) => classifySection(section))
      .filter((key): key is SectionKey => key !== null),
  );

  const additionalSections = sections.filter((section) => classifySection(section) === null);

  const countryName = getCountryName(caseStudy.countryCode, locale);

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (item.key === "lessons") {
      return caseStudy.keyTakeaways.length > 0;
    }

    return classifiedSections.has(item.key);
  });

  return (
    <div className="space-y-7">
      <nav aria-label="Breadcrumb" className="text-sm text-[#6b7788]">
        <Link
          href={`/${locale}/eportfolio`}
          className="font-medium transition hover:text-[#0b7f61]"
        >
          ePortfolio
        </Link>

        <span className="mx-2 text-[#a1aab5]">/</span>

        <span className="text-[#31425a]">{caseStudy.title}</span>
      </nav>

      <header className="overflow-hidden rounded-[32px] border border-white/70 bg-[#243346] text-white shadow-[0_18px_50px_rgba(35,45,62,0.13)]">
        <div className="relative px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(52,211,153,0.15),transparent_30%),radial-gradient(circle_at_92%_15%,rgba(56,189,248,0.12),transparent_28%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.13em] text-white/75">
                  <BookOpen className="h-4 w-4 text-emerald-300" />
                  ESG case study
                </span>

                {caseStudy.isFeatured ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.13em] text-amber-200">
                    <Sparkles className="h-4 w-4" />
                    Featured
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
                {caseStudy.title}
              </h1>

              {caseStudy.organization && caseStudy.organization !== caseStudy.title ? (
                <p className="mt-2 text-base font-medium text-white/72">{caseStudy.organization}</p>
              ) : null}

              {caseStudy.summary ? (
                <p className="mt-5 max-w-3xl text-sm leading-7 text-white/68 sm:text-base">
                  {caseStudy.summary}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ProfileMetric icon={<Globe2 />} label="Country" value={countryName} />

              <ProfileMetric
                icon={<Building2 />}
                label="Industry"
                value={caseStudy.industry ?? "Not specified"}
              />

              <ProfileMetric
                icon={<FileCheck2 />}
                label="Reporting period"
                value={caseStudy.reportingPeriod ?? "Not specified"}
              />

              <ProfileMetric
                icon={<Users />}
                label="Source partner"
                value={caseStudy.sourcePartner ?? "Not specified"}
              />
            </div>
          </div>
        </div>
      </header>

      {visibleNavItems.length > 0 ? (
        <div className={`${SURFACE} sticky top-3 z-20 p-2 sm:p-3`}>
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="hidden shrink-0 items-center gap-2 px-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#8a97a6] sm:inline-flex">
              <List className="h-4 w-4" />
              On this page
            </span>

            {visibleNavItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-[#536174] transition hover:bg-[#eef7f4] hover:text-[#0b7f61]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
        <div className="space-y-7">
          {company ? (
            <ContentSection
              id="company-overview"
              eyebrow="Profile"
              title="Company overview"
              icon={<Building2 />}
            >
              <MarkdownContent content={company.content} />
            </ContentSection>
          ) : null}

          {integration ? (
            <ContentSection
              id="esg-integration"
              eyebrow="Approach"
              title="ESG integration"
              icon={<Scale />}
            >
              <MarkdownContent content={integration.content} />
            </ContentSection>
          ) : null}

          <div className="grid gap-5">
            {environmental ? (
              <EsgSection
                id="environmental"
                letter="E"
                label="Environmental"
                icon={<Leaf />}
                accentClass="border-emerald-200 bg-emerald-50/55"
                badgeClass="bg-emerald-100 text-emerald-700"
                content={environmental.content}
              />
            ) : null}

            {social ? (
              <EsgSection
                id="social"
                letter="S"
                label="Social"
                icon={<Users />}
                accentClass="border-sky-200 bg-sky-50/55"
                badgeClass="bg-sky-100 text-sky-700"
                content={social.content}
              />
            ) : null}

            {governance ? (
              <EsgSection
                id="governance"
                letter="G"
                label="Governance"
                icon={<ShieldCheck />}
                accentClass="border-violet-200 bg-violet-50/55"
                badgeClass="bg-violet-100 text-violet-700"
                content={governance.content}
              />
            ) : null}
          </div>

          {additionalSections.map((section) => (
            <ContentSection
              key={section.heading}
              id={`additional-${normaliseHeading(section.heading).replace(/\s+/g, "-")}`}
              eyebrow="Case study"
              title={section.heading}
              icon={<BookOpen />}
            >
              <MarkdownContent content={section.content} />
            </ContentSection>
          ))}

          {ratings ? (
            <SpecialSection
              id="ratings-evidence"
              eyebrow="Evidence"
              title="Ratings and external evidence"
              icon={<Award />}
              className="border-violet-100 bg-[linear-gradient(145deg,#ffffff_0%,#faf7ff_100%)]"
              iconClassName="bg-violet-100 text-violet-700"
            >
              <MarkdownContent content={ratings.content} />
            </SpecialSection>
          ) : null}

          {compliance ? (
            <SpecialSection
              id="regulatory-compliance"
              eyebrow="Compliance"
              title="Regulatory compliance"
              icon={<FileCheck2 />}
              className="border-blue-100 bg-[linear-gradient(145deg,#ffffff_0%,#f5faff_100%)]"
              iconClassName="bg-blue-100 text-blue-700"
            >
              <MarkdownContent content={compliance.content} />
            </SpecialSection>
          ) : null}

          {recommendations ? (
            <SpecialSection
              id="recommendations"
              eyebrow="Next steps"
              title="Recommendations"
              icon={<Lightbulb />}
              className="border-amber-100 bg-[linear-gradient(145deg,#ffffff_0%,#fffbeb_100%)]"
              iconClassName="bg-amber-100 text-amber-700"
            >
              <MarkdownContent content={recommendations.content} />
            </SpecialSection>
          ) : null}

          {caseStudy.keyTakeaways.length > 0 ? (
            <section id="key-lessons" className={`${SURFACE} scroll-mt-28 p-5 sm:p-7`}>
              <SectionHeading eyebrow="Takeaways" title="Key lessons" icon={<CheckCircle2 />} />

              <ol className="mt-6 grid gap-3">
                {caseStudy.keyTakeaways.map((lesson, index) => (
                  <li
                    key={`${index}-${lesson}`}
                    className="flex gap-4 rounded-2xl border border-[#e8edf3] bg-[#f8fafb] p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dff3ec] text-sm font-bold text-[#0b7f61]">
                      {index + 1}
                    </span>

                    <p className="pt-1 text-sm leading-6 text-[#536174]">{lesson}</p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {sources ? (
            <section id="sources" className="scroll-mt-28">
              <details className={`${SURFACE} group overflow-hidden`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-7 [&::-webkit-details-marker]:hidden">
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#0b8c69]">
                      References
                    </p>

                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#273548]">
                      Sources and references
                    </h2>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef3f7] text-[#536174] transition group-open:rotate-180">
                    <ChevronDown className="h-5 w-5" />
                  </span>
                </summary>

                <div className="border-t border-[#edf1f5] px-5 py-6 sm:px-7">
                  <MarkdownContent content={sources.content} />
                </div>
              </details>
            </section>
          ) : null}

          <EportfolioProgressActions
            locale={locale}
            slug={caseStudy.slug}
            initialProgress={caseStudy.progress}
            nextCaseStudy={caseStudy.nextCaseStudy}
          />
        </div>

        <aside className="hidden xl:block">
          <div className={`${SURFACE} sticky top-24 p-5`}>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
              Company profile
            </p>

            <div className="mt-4 space-y-4">
              <ProfileRow label="Company" value={caseStudy.organization ?? caseStudy.title} />

              <ProfileRow label="Country" value={countryName} />

              <ProfileRow label="Industry" value={caseStudy.industry ?? "Not specified"} />

              <ProfileRow
                label="Reporting period"
                value={caseStudy.reportingPeriod ?? "Not specified"}
              />

              <ProfileRow
                label="Source partner"
                value={caseStudy.sourcePartner ?? "Not specified"}
              />

              <ProfileRow
                label="Progress"
                value={
                  caseStudy.progress === "completed"
                    ? "Completed"
                    : caseStudy.progress === "in_progress"
                      ? "In progress"
                      : "Not started"
                }
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ProfileMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-emerald-300 [&_svg]:h-4 [&_svg]:w-4">
        {icon}

        <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/52">
          {label}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-white/88">{value}</p>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[#edf1f5] pb-3 last:border-b-0 last:pb-0">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#98a2b3]">{label}</p>

      <p className="mt-1 text-sm font-medium leading-5 text-[#31425a]">{value}</p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  icon,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e9f5f1] text-[#0b8c69] [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </span>

      <div>
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#0b8c69]">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#273548] sm:text-2xl">
          {title}
        </h2>
      </div>
    </div>
  );
}

function ContentSection({
  id,
  eyebrow,
  title,
  icon,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${SURFACE} scroll-mt-28 p-5 sm:p-7`}>
      <SectionHeading eyebrow={eyebrow} title={title} icon={icon} />

      <div className="mt-6">{children}</div>
    </section>
  );
}

function EsgSection({
  id,
  letter,
  label,
  icon,
  accentClass,
  badgeClass,
  content,
}: {
  id: string;
  letter: string;
  label: string;
  icon: ReactNode;
  accentClass: string;
  badgeClass: string;
  content: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 rounded-[28px] border p-5 shadow-[0_12px_34px_rgba(35,45,62,0.05)] sm:p-7 ${accentClass}`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${badgeClass}`}
        >
          {letter}
        </span>

        <div>
          <div className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#7b8794] [&_svg]:h-4 [&_svg]:w-4">
            {icon}
            ESG pillar
          </div>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#273548]">{label}</h2>
        </div>
      </div>

      <div className="mt-6">
        <MarkdownContent content={content} />
      </div>
    </section>
  );
}

function SpecialSection({
  id,
  eyebrow,
  title,
  icon,
  className,
  iconClassName,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  icon: ReactNode;
  className: string;
  iconClassName: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 rounded-[28px] border p-5 shadow-[0_12px_34px_rgba(35,45,62,0.05)] sm:p-7 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl [&_svg]:h-5 [&_svg]:w-5 ${iconClassName}`}
        >
          {icon}
        </span>

        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7b8794]">
            {eyebrow}
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#273548] sm:text-2xl">
            {title}
          </h2>
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}
