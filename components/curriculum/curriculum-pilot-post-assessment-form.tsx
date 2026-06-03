import type { CurriculumPilotPostAssessmentCalloutViewModel } from "@/lib/curriculum/pilot";
import { ArrowRight, CheckCircle2, ClipboardCheck, LockKeyhole } from "lucide-react";
import Link from "next/link";

type Props = {
  locale: string;
  state: CurriculumPilotPostAssessmentCalloutViewModel;
};

function getCopy(locale: string, state: CurriculumPilotPostAssessmentCalloutViewModel) {
  if (locale === "pl") {
    if (state.isCompleted) {
      return {
        eyebrow: "Pilotaż zakończony",
        title: "Post-assessment został zapisany",
        description:
          "Dziękujemy za zakończenie części pilotażowej. Nadal możesz korzystać z modułów, wykonywać testy modułowe i dążyć do certyfikatu.",
        action: null,
        locked: null,
      };
    }

    if (state.isAvailable) {
      return {
        eyebrow: "Ścieżka pilotażowa",
        title: "Możesz zakończyć udział w pilotażu",
        description:
          "Ukończono już przynajmniej jeden moduł, więc możesz wypełnić post-assessment. Po jego zapisaniu nadal będziesz mieć dostęp do kursu i modułów.",
        action: "Zakończ udział w pilotażu",
        locked: null,
      };
    }

    return {
      eyebrow: "Ścieżka pilotażowa",
      title: "Post-assessment będzie dostępny po ukończeniu minimum jednego modułu",
      description:
        "Najpierw ukończ przynajmniej jeden moduł curriculum. Dzięki temu porównanie pre/post będzie miało sens.",
      action: null,
      locked: "Ukończone moduły",
    };
  }

  if (state.isCompleted) {
    return {
      eyebrow: "Pilot completed",
      title: "Post-assessment has been saved",
      description:
        "Thank you for completing the pilot part. You can still use the modules, complete module tests and work towards the certificate.",
      action: null,
      locked: null,
    };
  }

  if (state.isAvailable) {
    return {
      eyebrow: "Pilot path",
      title: "You can finish your pilot participation",
      description:
        "You have completed at least one module, so the post-assessment is now available. After submitting it, you will still have access to the course and modules.",
      action: "Finish pilot participation",
      locked: null,
    };
  }

  return {
    eyebrow: "Pilot path",
    title: "Post-assessment will be available after completing at least one module",
    description:
      "Please complete at least one curriculum module first. This makes the pre/post comparison meaningful.",
    action: null,
    locked: "Completed modules",
  };
}

export default function CurriculumPilotPostAssessmentCard({ locale, state }: Props) {
  if (!state.shouldShow) {
    return null;
  }

  const copy = getCopy(locale, state);
  const postAssessmentHref = `/${locale}/curriculum/pilot/post-assessment?next=${encodeURIComponent(
    `/${locale}/curriculum`,
  )}`;

  return (
    <section className="mb-6 overflow-hidden rounded-[28px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl">
      <div className="relative p-5 md:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(11,156,114,0.13),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(49,66,90,0.08),transparent_28%)]" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                state.isCompleted ? "bg-emerald-600 text-white" : "bg-[#31425a] text-white"
              }`}
            >
              {state.isCompleted ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <ClipboardCheck className="h-6 w-6" />
              )}
            </span>

            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-emerald-700">
                {copy.eyebrow}
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-[#31425a]">{copy.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667180]">{copy.description}</p>
            </div>
          </div>

          <div className="shrink-0">
            {copy.action ? (
              <Link
                href={postAssessmentHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347] lg:w-auto"
              >
                {copy.action}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : copy.locked ? (
              <div className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#d9e2ec] bg-white px-5 py-3 text-sm font-semibold text-[#667180] lg:w-auto">
                <LockKeyhole className="h-4 w-4" />
                {copy.locked}: {state.completedModulesCount}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
