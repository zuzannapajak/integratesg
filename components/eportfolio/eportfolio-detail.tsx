"use client";

import MarkdownContent from "@/components/ui/markdown-content";
import { touchCaseStudyProgressAction } from "@/features/eportfolio/actions";
import type { EportfolioCaseStudyDetail } from "@/lib/eportfolio/detail";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  FileCheck2,
  Lightbulb,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

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

type StageKey = "overview" | "environmental" | "social" | "governance" | "evidence" | "lessons";

type StageDefinition = {
  key: StageKey;
  label: string;
};

const SURFACE =
  "rounded-[30px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

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

    const end = nextMatch?.index ?? content.length;

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

function getSection(sections: MarkdownSection[], key: SectionKey) {
  return sections.find((section) => classifySection(section) === key) ?? null;
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

function normaliseComparableText(value: string) {
  return value.replace(/\*\*/g, "").replace(/\s+/g, " ").trim().toLocaleLowerCase();
}

function splitSentences(value: string) {
  return value
    .trim()
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-Ž0-9])/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function removeSummaryOverlap(content: string, summary: string | null) {
  if (!summary) {
    return content;
  }

  const summarySentences = new Set(splitSentences(summary).map(normaliseComparableText));

  return content
    .split(/\n\s*\n/)
    .map((block) => {
      const trimmed = block.trim();

      if (!trimmed) {
        return "";
      }

      const isMarkdownStructure = /^(?:#{1,6}\s|[-*+]\s|\d+\.\s|>|```|\|)/.test(trimmed);

      const isMetadataLine = /^\*\*[^*]+:\*\*/.test(trimmed);

      if (isMarkdownStructure || isMetadataLine) {
        return block;
      }

      const remainingSentences = splitSentences(trimmed).filter(
        (sentence) => !summarySentences.has(normaliseComparableText(sentence)),
      );

      return remainingSentences.join(" ");
    })
    .filter((block) => block.trim().length > 0)
    .join("\n\n");
}

function normaliseSourcesMarkdown(content: string) {
  let itemNumber = 0;

  return content
    .split("\n")
    .map((line) => {
      if (/^\s*\d+\.\s+/.test(line)) {
        itemNumber += 1;
        return line;
      }

      if (/^\s*[-*]\s+/.test(line)) {
        itemNumber += 1;

        return line.replace(/^(\s*)[-*]\s+/, `$1${itemNumber}. `);
      }

      return line;
    })
    .join("\n");
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

  const additionalSections = sections.filter((section) => classifySection(section) === null);

  const companyOverviewContent = company
    ? removeSummaryOverlap(company.content, caseStudy.summary)
    : null;

  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const stageTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function recordOpen() {
      try {
        await touchCaseStudyProgressAction({
          locale,
          slug: caseStudy.slug,
        });
      } catch {
        // Reading must stay available even if
        // progress tracking temporarily fails.
      }
    }

    void recordOpen();
  }, [caseStudy.slug, locale]);

  const stages: StageDefinition[] = [];

  if (company || integration) {
    stages.push({
      key: "overview",
      label: "Overview",
    });
  }

  if (environmental) {
    stages.push({
      key: "environmental",
      label: "Environmental",
    });
  }

  if (social) {
    stages.push({
      key: "social",
      label: "Social",
    });
  }

  if (governance) {
    stages.push({
      key: "governance",
      label: "Governance",
    });
  }

  if (ratings || compliance || recommendations || additionalSections.length > 0) {
    stages.push({
      key: "evidence",
      label: "Evidence & compliance",
    });
  }

  if (caseStudy.keyTakeaways.length > 0 || sources) {
    stages.push({
      key: "lessons",
      label: "Lessons & sources",
    });
  }

  if (stages.length === 0) {
    stages.push({
      key: "overview",
      label: "Case study",
    });
  }

  const safeStageIndex = Math.min(activeStageIndex, stages.length - 1);

  const activeStage = stages[safeStageIndex];

  const countryName = getCountryName(caseStudy.countryCode, locale);

  const isFirstStage = safeStageIndex === 0;

  const isLastStage = safeStageIndex === stages.length - 1;

  function changeStage(nextIndex: number) {
    const clampedIndex = Math.min(Math.max(nextIndex, 0), stages.length - 1);

    setActiveStageIndex(clampedIndex);

    requestAnimationFrame(() => {
      stageTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function renderStageContent() {
    switch (activeStage.key) {
      case "overview":
        return (
          <StagePanel
            title="Overview"
            description="How the organisation approaches ESG and integrates it into its activities."
            stepIndex={safeStageIndex}
            stepTotal={stages.length}
          >
            {companyOverviewContent ? (
              <SectionBlock icon={<BookOpen />} title="Company overview">
                <MarkdownFrame>
                  <MarkdownContent content={companyOverviewContent} />
                </MarkdownFrame>
              </SectionBlock>
            ) : null}

            {integration ? (
              <SectionBlock icon={<Scale />} title="ESG integration">
                <MarkdownFrame>
                  <MarkdownContent content={integration.content} />
                </MarkdownFrame>
              </SectionBlock>
            ) : null}

            {!companyOverviewContent && !integration ? (
              <MarkdownFrame>
                <MarkdownContent content={caseStudy.content} />
              </MarkdownFrame>
            ) : null}
          </StagePanel>
        );

      case "environmental":
        return (
          <StagePanel
            title="Environmental"
            description="Environmental priorities, actions and supporting evidence."
            stepIndex={safeStageIndex}
            stepTotal={stages.length}
          >
            {environmental ? (
              <MarkdownFrame>
                <MarkdownContent content={environmental.content} />
              </MarkdownFrame>
            ) : null}
          </StagePanel>
        );

      case "social":
        return (
          <StagePanel
            title="Social"
            description="People, stakeholders, communities and the social aspects of the case."
            stepIndex={safeStageIndex}
            stepTotal={stages.length}
          >
            {social ? (
              <MarkdownFrame>
                <MarkdownContent content={social.content} />
              </MarkdownFrame>
            ) : null}
          </StagePanel>
        );

      case "governance":
        return (
          <StagePanel
            title="Governance"
            description="Governance structures, oversight and accountability."
            stepIndex={safeStageIndex}
            stepTotal={stages.length}
          >
            {governance ? (
              <MarkdownFrame>
                <MarkdownContent content={governance.content} />
              </MarkdownFrame>
            ) : null}
          </StagePanel>
        );

      case "evidence":
        return (
          <StagePanel
            title="Evidence & compliance"
            description="External evidence, regulatory context and recommendations from the source case."
            stepIndex={safeStageIndex}
            stepTotal={stages.length}
          >
            {ratings ? (
              <SectionBlock icon={<Award />} title="Ratings and external evidence">
                <MarkdownFrame>
                  <MarkdownContent content={ratings.content} />
                </MarkdownFrame>
              </SectionBlock>
            ) : null}

            {compliance ? (
              <SectionBlock icon={<FileCheck2 />} title="Regulatory compliance">
                <MarkdownFrame>
                  <MarkdownContent content={compliance.content} />
                </MarkdownFrame>
              </SectionBlock>
            ) : null}

            {additionalSections.map((section) => (
              <SectionBlock key={section.heading} icon={<BookOpen />} title={section.heading}>
                <MarkdownFrame>
                  <MarkdownContent content={section.content} />
                </MarkdownFrame>
              </SectionBlock>
            ))}

            {recommendations ? (
              <SectionBlock icon={<Lightbulb />} title="Recommendations">
                <MarkdownFrame>
                  <MarkdownContent content={recommendations.content} />
                </MarkdownFrame>
              </SectionBlock>
            ) : null}
          </StagePanel>
        );

      case "lessons":
        return (
          <StagePanel
            title="Key lessons & sources"
            description="The main lessons from the case and the references supporting it."
            stepIndex={safeStageIndex}
            stepTotal={stages.length}
          >
            {caseStudy.keyTakeaways.length > 0 ? (
              <SectionBlock icon={<BookMarked />} title="Key lessons">
                <ol className="grid gap-3">
                  {caseStudy.keyTakeaways.map((lesson, index) => (
                    <li
                      key={`${index}-${lesson}`}
                      className="flex gap-4 rounded-2xl border border-[#e8edf3] bg-[#f8fafc] p-4"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#31425a] shadow-sm">
                        {index + 1}
                      </span>

                      <p className="min-w-0 flex-1 pt-1 text-sm leading-6 text-[#536174]">
                        {lesson}
                      </p>
                    </li>
                  ))}
                </ol>
              </SectionBlock>
            ) : null}

            {sources ? (
              <details className="group overflow-hidden rounded-2xl border border-[#e8edf3] bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#31425a]">
                      Sources and references
                    </h3>

                    <p className="mt-1 text-sm text-[#7b8794]">
                      References used for this case study.
                    </p>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e8edf3] bg-[#f8fafc] text-[#536174] transition group-open:rotate-180">
                    <ChevronDown className="h-5 w-5" />
                  </span>
                </summary>

                <div className="border-t border-[#edf1f5] p-5 sm:p-6">
                  <MarkdownFrame>
                    <MarkdownContent content={normaliseSourcesMarkdown(sources.content)} />
                  </MarkdownFrame>
                </div>
              </details>
            ) : null}
          </StagePanel>
        );
    }
  }

  return (
    <div className="space-y-6">
      <div className="px-1">
        <Link
          href={`/${locale}/eportfolio`}
          className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-[#5f6977] transition hover:text-[#31425a]"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Back to ePortfolio
        </Link>
      </div>

      <div ref={stageTopRef} className="scroll-mt-24">
        {isFirstStage ? (
          <header className={`${SURFACE} p-5 sm:p-7 lg:p-8`}>
            <h1 className="text-3xl font-bold tracking-tight text-[#31425a] sm:text-4xl">
              {caseStudy.title}
            </h1>

            {caseStudy.organization && caseStudy.organization !== caseStudy.title ? (
              <p className="mt-2 text-base font-medium text-[#6b7788]">{caseStudy.organization}</p>
            ) : null}

            {caseStudy.summary ? (
              <p className="mt-5 w-full max-w-none text-[0.98rem] leading-8 text-[#556274]">
                {caseStudy.summary}
              </p>
            ) : null}

            <div className="mt-7 grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetadataItem label="Country" value={countryName} />

              <MetadataItem label="Industry" value={caseStudy.industry ?? "Not specified"} />

              <MetadataItem
                label="Reporting period"
                value={caseStudy.reportingPeriod ?? "Not specified"}
              />

              <MetadataItem
                label="Source partner"
                value={caseStudy.sourcePartner ?? "Not specified"}
              />
            </div>
          </header>
        ) : null}

        <div className={isFirstStage ? "mt-6" : ""}>{renderStageContent()}</div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          disabled={safeStageIndex === 0}
          onClick={() => {
            changeStage(safeStageIndex - 1);
          }}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#d9e2ec] bg-white px-5 py-3 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        {isLastStage ? (
          <Link
            href={`/${locale}/eportfolio/${caseStudy.slug}/complete`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              changeStage(safeStageIndex + 1);
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#e8edf3] bg-white px-4 py-4">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#98a2b3]">{label}</p>

      <p className="mt-1 wrap-break-word text-sm font-semibold leading-5 text-[#31425a]">{value}</p>
    </div>
  );
}

function StagePanel({
  title,
  description,
  stepIndex,
  stepTotal,
  children,
}: {
  title: string;
  description: string;
  stepIndex: number;
  stepTotal: number;
  children: ReactNode;
}) {
  const progress = ((stepIndex + 1) / stepTotal) * 100;

  return (
    <section className={`${SURFACE} p-5 sm:p-7 lg:p-8`}>
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight text-[#31425a] sm:text-3xl">{title}</h2>

          <p className="mt-2 w-full text-sm leading-6 text-[#667180]">{description}</p>
        </div>

        <span className="shrink-0 pt-1 text-sm font-semibold tabular-nums text-[#8a97a6]">
          {stepIndex + 1} / {stepTotal}
        </span>
      </div>

      <div
        className="mt-5 h-1 overflow-hidden rounded-full bg-[#e7ebef]"
        role="progressbar"
        aria-label="Case study reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div
          className="h-full rounded-full bg-[#0b9c72] transition-[width]"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="mt-8 space-y-7">{children}</div>
    </section>
  );
}

function SectionBlock({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-[#e8edf3] pt-6 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef4f2] text-[#0b8c69] [&_svg]:h-4.5 [&_svg]:w-4.5">
          {icon}
        </span>

        <h3 className="text-xl font-bold tracking-tight text-[#31425a]">{title}</h3>
      </div>

      <div className="mt-5 w-full">{children}</div>
    </section>
  );
}

function MarkdownFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-w-0 overflow-x-auto wrap-anywhere [&_a]:wrap-break-word [&_table]:min-w-140">
      {children}
    </div>
  );
}
