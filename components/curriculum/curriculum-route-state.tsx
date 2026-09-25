"use client";

import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useLocale, useMessages } from "next-intl";

type RouteStateCopy = {
  loading: {
    title: string;
    description: string;
  };
  error: {
    title: string;
    description: string;
    retry: string;
  };
};

const fallbackMessages: Record<string, RouteStateCopy> = {
  en: {
    loading: {
      title: "Loading curriculum",
      description: "Preparing your learning modules and progress.",
    },
    error: {
      title: "The curriculum could not be loaded",
      description: "Something went wrong while preparing this view. Please try again.",
      retry: "Try again",
    },
  },
  pl: {
    loading: {
      title: "Ładowanie programu",
      description: "Przygotowujemy moduły edukacyjne i Twój postęp.",
    },
    error: {
      title: "Nie udało się załadować programu",
      description: "Wystąpił błąd podczas przygotowywania widoku. Spróbuj ponownie.",
      retry: "Spróbuj ponownie",
    },
  },
  de: {
    loading: {
      title: "Curriculum wird geladen",
      description: "Lernmodule und Lernfortschritt werden vorbereitet.",
    },
    error: {
      title: "Das Curriculum konnte nicht geladen werden",
      description:
        "Beim Vorbereiten dieser Ansicht ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      retry: "Erneut versuchen",
    },
  },
  it: {
    loading: {
      title: "Caricamento del curriculum",
      description: "Stiamo preparando i moduli didattici e i tuoi progressi.",
    },
    error: {
      title: "Impossibile caricare il curriculum",
      description: "Si è verificato un errore durante la preparazione della vista. Riprova.",
      retry: "Riprova",
    },
  },
  el: {
    loading: {
      title: "Φόρτωση προγράμματος μάθησης",
      description: "Προετοιμάζουμε τις εκπαιδευτικές ενότητες και την πρόοδό σας.",
    },
    error: {
      title: "Δεν ήταν δυνατή η φόρτωση του προγράμματος",
      description: "Παρουσιάστηκε σφάλμα κατά την προετοιμασία αυτής της προβολής. Δοκιμάστε ξανά.",
      retry: "Δοκιμάστε ξανά",
    },
  },
  bg: {
    loading: {
      title: "Зареждане на учебната програма",
      description: "Подготвяме учебните модули и напредъка ви.",
    },
    error: {
      title: "Учебната програма не можа да се зареди",
      description: "Възникна грешка при подготовката на този изглед. Опитайте отново.",
      retry: "Опитайте отново",
    },
  },
};

type ScopedMessages = {
  Protected?: {
    CurriculumRouteState?: Partial<{
      loading: Partial<RouteStateCopy["loading"]>;
      error: Partial<RouteStateCopy["error"]>;
    }>;
  };
};

function useCurriculumRouteStateMessages(): RouteStateCopy {
  const locale = useLocale();
  const messages = useMessages() as ScopedMessages;

  const fallback = fallbackMessages[locale] ?? fallbackMessages.en;
  const configured = messages.Protected?.CurriculumRouteState;

  return {
    loading: {
      ...fallback.loading,
      ...(configured?.loading ?? {}),
    },
    error: {
      ...fallback.error,
      ...(configured?.error ?? {}),
    },
  };
}

export function CurriculumLoadingState() {
  const copy = useCurriculumRouteStateMessages();

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(11,156,114,0.07),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.07),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8">
        <section
          role="status"
          aria-live="polite"
          className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl md:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#0b9c72]">
              <LoaderCircle className="h-6 w-6 animate-spin" aria-hidden="true" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#31425a]">
                {copy.loading.title}
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#667180]">{copy.loading.description}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-[26px] border border-[#e8edf3] bg-white/72"
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export function CurriculumErrorState({ onRetry }: { onRetry: () => void }) {
  const copy = useCurriculumRouteStateMessages();

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(244,63,94,0.06),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-3xl px-4 pt-10 sm:px-6 lg:px-8">
        <section
          role="alert"
          className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl md:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold tracking-tight text-[#31425a]">
                {copy.error.title}
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#667180]">{copy.error.description}</p>

              <button
                type="button"
                onClick={onRetry}
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#253347]"
              >
                {copy.error.retry}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
