"use client";

import { skipCurriculumPilotPreAssessmentAction } from "@/features/curriculum/pilot-actions";
import { ArrowRight, BookOpenCheck, ClipboardList, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  locale: string;
  moduleSlug: string;
  moduleTitle: string;
  returnPath: string;
};

type PilotGateCopy = {
  eyebrow: string;
  title: string;
  description: string;
  moduleLabel: string;
  fillTitle: string;
  fillDescription: string;
  skipTitle: string;
  skipDescription: string;
  fillAction: string;
  skipAction: string;
  skipPending: string;
  note: string;
  error: string;
};

const SURFACE =
  "rounded-[30px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

function getPilotGateCopy(locale: string): PilotGateCopy {
  if (locale === "pl") {
    return {
      eyebrow: "Opcjonalny krok przed rozpoczęciem",
      title: "Krótka samoocena przed wejściem do modułu",
      description:
        "Przed pierwszym wejściem do materiałów możesz wypełnić krótką ankietę startową. Pomoże ona porównać poziom samooceny przed i po korzystaniu z curriculum.",
      moduleLabel: "Wybrany moduł",
      fillTitle: "Wypełnij pre-assessment",
      fillDescription:
        "Wybierz tę opcję, jeśli bierzesz udział w pilotażu i chcesz zapisać punkt startowy przed korzystaniem z modułów.",
      skipTitle: "Pomiń pre-assessment",
      skipDescription:
        "Wybierz tę opcję, jeśli chcesz przejść bezpośrednio do standardowej ścieżki korzystania z materiałów.",
      fillAction: "Wypełnij pre-assessment",
      skipAction: "Pomiń i przejdź dalej",
      skipPending: "Zapisywanie decyzji...",
      note: "Decyzję zapisujemy tylko raz. Po pominięciu pre-assessmentu nie będzie możliwości powrotu do niego w ramach tej samej ścieżki.",
      error: "Nie udało się zapisać decyzji. Spróbuj ponownie.",
    };
  }

  return {
    eyebrow: "Optional step before starting",
    title: "Short self-assessment before entering the module",
    description:
      "Before your first access to the learning materials, you can complete a short starting self-assessment. It helps compare your self-assessment before and after using the curriculum.",
    moduleLabel: "Selected module",
    fillTitle: "Complete the pre-assessment",
    fillDescription:
      "Choose this if you are taking part in the pilot and want to save your starting point before using the modules.",
    skipTitle: "Skip the pre-assessment",
    skipDescription:
      "Choose this if you want to go directly to the standard learning path and use the materials without the pilot self-assessment.",
    fillAction: "Complete pre-assessment",
    skipAction: "Skip and continue",
    skipPending: "Saving decision...",
    note: "This decision is saved only once. After skipping the pre-assessment, you will not be able to return to it within the same path.",
    error: "We could not save your decision. Please try again.",
  };
}

export default function CurriculumPilotEntryGate({
  locale,
  moduleSlug,
  moduleTitle,
  returnPath,
}: Props) {
  const router = useRouter();
  const copy = getPilotGateCopy(locale);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const preAssessmentHref = `/${locale}/curriculum/pilot/pre-assessment?next=${encodeURIComponent(
    returnPath,
  )}`;

  const handleSkip = () => {
    setError(null);

    startTransition(async () => {
      try {
        await skipCurriculumPilotPreAssessmentAction({
          courseSlug: moduleSlug,
        });

        router.refresh();
      } catch (caughtError) {
        console.error(caughtError);
        setError(copy.error);
      }
    });
  };

  return (
    <section className={`${SURFACE} overflow-hidden`}>
      <div className="relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(11,156,114,0.13),transparent_28%),radial-gradient(circle_at_88%_10%,rgba(49,66,90,0.10),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.96)_100%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-emerald-700">
              <ClipboardList className="h-3.5 w-3.5" />
              {copy.eyebrow}
            </span>

            <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-[#31425a] md:text-[2.6rem]">
              {copy.title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#667180] md:text-base md:leading-8">
              {copy.description}
            </p>

            <div className="mt-6 rounded-3xl border border-[#e8edf3] bg-white/76 p-4">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                {copy.moduleLabel}
              </p>
              <p className="mt-2 text-lg font-bold text-[#31425a]">{moduleTitle}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[26px] border border-[#dce7f2] bg-white/86 p-5 shadow-[0_10px_26px_rgba(35,45,62,0.05)]">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#31425a] text-white">
                  <BookOpenCheck className="h-5 w-5" />
                </span>

                <div>
                  <h2 className="text-base font-bold text-[#31425a]">{copy.fillTitle}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#667180]">{copy.fillDescription}</p>
                </div>
              </div>

              <Link
                href={preAssessmentHref}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
              >
                {copy.fillAction}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[26px] border border-[#e8edf3] bg-white/76 p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d9e2ec] bg-white text-[#31425a]">
                  <ShieldCheck className="h-5 w-5" />
                </span>

                <div>
                  <h2 className="text-base font-bold text-[#31425a]">{copy.skipTitle}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#667180]">{copy.skipDescription}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSkip}
                disabled={isPending}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#d9e2ec] bg-white px-5 py-3 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc] disabled:opacity-60"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isPending ? copy.skipPending : copy.skipAction}
              </button>
            </div>

            <p className="rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3 text-sm leading-6 text-amber-800">
              {copy.note}
            </p>

            {error ? (
              <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                {error}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
