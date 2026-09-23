"use client";

import { completeCaseStudyAction } from "@/features/eportfolio/actions";
import type { EportfolioProgress } from "@/lib/eportfolio/library";
import { ArrowRight, Check, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  locale: string;
  slug: string;
  caseStudyTitle: string;
  initialProgress: EportfolioProgress;
  nextCaseStudy: {
    slug: string;
    title: string;
  } | null;
};

export default function EportfolioProgressActions({
  locale,
  slug,
  caseStudyTitle,
  initialProgress,
  nextCaseStudy,
}: Props) {
  const router = useRouter();

  const [progress, setProgress] = useState<EportfolioProgress>(initialProgress);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const isCompleted = progress === "completed";

  function handleComplete() {
    setErrorMessage(null);

    startTransition(async () => {
      try {
        const result = await completeCaseStudyAction({
          locale,
          slug,
        });

        setProgress(result.status);

        router.refresh();
      } catch {
        setErrorMessage("We could not save your progress. Please try again.");
      }
    });
  }

  return (
    <section className="rounded-[30px] border border-white/70 bg-white/88 px-5 py-10 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl sm:px-8 sm:py-12">
      <div className="mx-auto max-w-2xl text-center">
        {isCompleted ? (
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-[#0b8c69]">
            <CheckCircle2 className="h-7 w-7" />
          </div>
        ) : null}

        <h1
          className={`text-2xl font-bold tracking-tight text-[#31425a] sm:text-3xl ${
            isCompleted ? "mt-5" : ""
          }`}
        >
          {isCompleted ? `${caseStudyTitle} completed` : "Complete case study"}
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#667180]">
          {isCompleted
            ? "Your progress has been saved."
            : "Mark this case study as completed to save your progress."}
        </p>

        {errorMessage ? (
          <p className="mt-4 text-sm font-medium text-rose-600">{errorMessage}</p>
        ) : null}

        <div className="mt-8 flex justify-center">
          {!isCompleted ? (
            <button
              type="button"
              onClick={handleComplete}
              disabled={isPending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Mark as completed
            </button>
          ) : nextCaseStudy ? (
            <Link
              href={`/${locale}/eportfolio/${nextCaseStudy.slug}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
            >
              Next case study
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>

        {isCompleted && nextCaseStudy ? (
          <p className="mt-5 text-sm text-[#8a97a6]">
            Up next: <span className="font-medium text-[#536174]">{nextCaseStudy.title}</span>
          </p>
        ) : null}
      </div>
    </section>
  );
}
