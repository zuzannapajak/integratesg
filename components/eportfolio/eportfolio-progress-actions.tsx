"use client";

import {
  completeCaseStudyAction,
  touchCaseStudyProgressAction,
} from "@/features/eportfolio/actions";
import type { EportfolioProgress } from "@/lib/eportfolio/library";
import { ArrowRight, Check, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Props = {
  locale: string;
  slug: string;
  initialProgress: EportfolioProgress;
  nextCaseStudy: {
    slug: string;
    title: string;
  } | null;
};

export default function EportfolioProgressActions({
  locale,
  slug,
  initialProgress,
  nextCaseStudy,
}: Props) {
  const router = useRouter();

  const [progress, setProgress] = useState<EportfolioProgress>(initialProgress);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isActive = true;

    async function recordOpen() {
      try {
        const result = await touchCaseStudyProgressAction({
          locale,
          slug,
        });

        if (isActive) {
          setProgress(result.status);
        }
      } catch {
        // Reading the case study must remain possible
        // even if progress tracking temporarily fails.
      }
    }

    void recordOpen();

    return () => {
      isActive = false;
    };
  }, [locale, slug]);

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
    <section className="rounded-[28px] border border-white/70 bg-[#243346] p-5 text-white shadow-[0_16px_42px_rgba(35,45,62,0.12)] sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-emerald-300">
            Case study progress
          </p>

          <div className="mt-2 flex items-center gap-2">
            {progress === "completed" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            ) : null}

            <p className="text-lg font-semibold">
              {progress === "completed"
                ? "Case study completed"
                : "Finished reading this case study?"}
            </p>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            {progress === "completed"
              ? "Your completion has been saved. You can review this case again at any time."
              : "Mark it as completed when you have reviewed the case, recommendations and key lessons."}
          </p>

          {errorMessage ? (
            <p className="mt-3 text-sm font-medium text-red-200">{errorMessage}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {progress !== "completed" ? (
            <button
              type="button"
              onClick={handleComplete}
              disabled={isPending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-[#17382f] transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Mark case study as completed
            </button>
          ) : null}

          {nextCaseStudy ? (
            <Link
              href={`/${locale}/eportfolio/${nextCaseStudy.slug}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/16 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/16"
            >
              Next case study
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href={`/${locale}/eportfolio`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/16 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/16"
            >
              Back to library
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {nextCaseStudy ? (
        <p className="mt-4 border-t border-white/10 pt-4 text-sm text-white/55">
          Up next: <span className="font-medium text-white/80">{nextCaseStudy.title}</span>
        </p>
      ) : null}
    </section>
  );
}
