"use client";

import { markCaseStudyCompletedAction } from "@/features/eportfolio/actions";
import { CheckCircle2 } from "lucide-react";
import { useState, useTransition } from "react";

type Props = {
  slug: string;
  initialIsCompleted: boolean;
  initialCompletedAt: string | null;
};

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export default function CaseStudyCompletionButton({
  slug,
  initialIsCompleted,
  initialCompletedAt,
}: Props) {
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [completedAt, setCompletedAt] = useState<string | null>(initialCompletedAt);
  const [isPending, startTransition] = useTransition();

  const handleComplete = () => {
    startTransition(async () => {
      try {
        const result = await markCaseStudyCompletedAction({ slug });
        setIsCompleted(true);
        setCompletedAt(result.completedAt);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-[#edf1f5] bg-white px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-2xl bg-emerald-50 p-2 text-emerald-700">
          <CheckCircle2 className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#7b8794]">
            Completion
          </p>

          <p className="mt-2 text-sm leading-6 text-[#516071]">
            {isCompleted
              ? "This case study has already been marked as completed."
              : "Mark this case study as completed when you finish reviewing it."}
          </p>

          {isCompleted && (
            <p className="mt-2 text-sm font-medium text-[#31425a]">
              Completed {formatDate(completedAt) ?? "recently"}
            </p>
          )}

          <button
            type="button"
            onClick={handleComplete}
            disabled={isPending || isCompleted}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#31425a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347] disabled:cursor-not-allowed disabled:bg-[#98a2b3]"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isCompleted ? "Completed" : isPending ? "Saving..." : "Mark as completed"}
          </button>
        </div>
      </div>
    </div>
  );
}
