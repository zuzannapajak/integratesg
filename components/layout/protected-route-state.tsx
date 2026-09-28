"use client";

// cspell:disable

import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useLocale } from "next-intl";

type RouteStateKind = "loading" | "error";
type RouteStateScope = "dashboard" | "eportfolio" | "application";

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

type LocaleCopy = Record<RouteStateScope, RouteStateCopy>;

const COPY: Record<string, LocaleCopy> = {
  en: {
    dashboard: {
      loading: {
        title: "Loading dashboard",
        description: "Preparing your progress, activity and learning summary.",
      },
      error: {
        title: "The dashboard could not be loaded",
        description: "Something went wrong while preparing your dashboard. Please try again.",
        retry: "Try again",
      },
    },
    eportfolio: {
      loading: {
        title: "Loading ePortfolio",
        description: "Preparing case studies and your current progress.",
      },
      error: {
        title: "The ePortfolio could not be loaded",
        description:
          "Something went wrong while preparing the case-study library. Please try again.",
        retry: "Try again",
      },
    },
    application: {
      loading: {
        title: "Loading",
        description: "Preparing this view.",
      },
      error: {
        title: "Something went wrong",
        description: "The page could not be displayed correctly. Please try again.",
        retry: "Try again",
      },
    },
  },
  pl: {
    dashboard: {
      loading: {
        title: "Ładowanie panelu",
        description: "Przygotowujemy Twój postęp, aktywność i podsumowanie nauki.",
      },
      error: {
        title: "Nie udało się załadować panelu",
        description: "Wystąpił błąd podczas przygotowywania panelu. Spróbuj ponownie.",
        retry: "Spróbuj ponownie",
      },
    },
    eportfolio: {
      loading: {
        title: "Ładowanie ePortfolio",
        description: "Przygotowujemy studia przypadków i Twój aktualny postęp.",
      },
      error: {
        title: "Nie udało się załadować ePortfolio",
        description:
          "Wystąpił błąd podczas przygotowywania biblioteki studiów przypadków. Spróbuj ponownie.",
        retry: "Spróbuj ponownie",
      },
    },
    application: {
      loading: {
        title: "Ładowanie",
        description: "Przygotowujemy ten widok.",
      },
      error: {
        title: "Coś poszło nie tak",
        description: "Nie udało się poprawnie wyświetlić strony. Spróbuj ponownie.",
        retry: "Spróbuj ponownie",
      },
    },
  },
  de: {
    dashboard: {
      loading: {
        title: "Dashboard wird geladen",
        description: "Fortschritt, Aktivität und Lernübersicht werden vorbereitet.",
      },
      error: {
        title: "Das Dashboard konnte nicht geladen werden",
        description:
          "Beim Vorbereiten des Dashboards ist ein Fehler aufgetreten. Bitte versuche es erneut.",
        retry: "Erneut versuchen",
      },
    },
    eportfolio: {
      loading: {
        title: "ePortfolio wird geladen",
        description: "Fallstudien und aktueller Fortschritt werden vorbereitet.",
      },
      error: {
        title: "Das ePortfolio konnte nicht geladen werden",
        description:
          "Beim Vorbereiten der Fallstudienbibliothek ist ein Fehler aufgetreten. Bitte versuche es erneut.",
        retry: "Erneut versuchen",
      },
    },
    application: {
      loading: {
        title: "Wird geladen",
        description: "Diese Ansicht wird vorbereitet.",
      },
      error: {
        title: "Etwas ist schiefgelaufen",
        description: "Die Seite konnte nicht korrekt angezeigt werden. Bitte versuche es erneut.",
        retry: "Erneut versuchen",
      },
    },
  },
  it: {
    dashboard: {
      loading: {
        title: "Caricamento della dashboard",
        description: "Stiamo preparando progressi, attività e riepilogo dell'apprendimento.",
      },
      error: {
        title: "Impossibile caricare la dashboard",
        description: "Si è verificato un errore durante la preparazione della dashboard. Riprova.",
        retry: "Riprova",
      },
    },
    eportfolio: {
      loading: {
        title: "Caricamento dell'ePortfolio",
        description: "Stiamo preparando i casi di studio e i tuoi progressi attuali.",
      },
      error: {
        title: "Impossibile caricare l'ePortfolio",
        description:
          "Si è verificato un errore durante la preparazione della libreria dei casi di studio. Riprova.",
        retry: "Riprova",
      },
    },
    application: {
      loading: {
        title: "Caricamento",
        description: "Stiamo preparando questa vista.",
      },
      error: {
        title: "Qualcosa è andato storto",
        description: "La pagina non può essere visualizzata correttamente. Riprova.",
        retry: "Riprova",
      },
    },
  },
  el: {
    dashboard: {
      loading: {
        title: "Φόρτωση πίνακα ελέγχου",
        description: "Προετοιμάζουμε την πρόοδο, τη δραστηριότητα και τη σύνοψη μάθησης.",
      },
      error: {
        title: "Δεν ήταν δυνατή η φόρτωση του πίνακα ελέγχου",
        description:
          "Παρουσιάστηκε σφάλμα κατά την προετοιμασία του πίνακα ελέγχου. Δοκιμάστε ξανά.",
        retry: "Δοκιμάστε ξανά",
      },
    },
    eportfolio: {
      loading: {
        title: "Φόρτωση ePortfolio",
        description: "Προετοιμάζουμε τις μελέτες περίπτωσης και την τρέχουσα πρόοδό σας.",
      },
      error: {
        title: "Δεν ήταν δυνατή η φόρτωση του ePortfolio",
        description:
          "Παρουσιάστηκε σφάλμα κατά την προετοιμασία της βιβλιοθήκης μελετών περίπτωσης. Δοκιμάστε ξανά.",
        retry: "Δοκιμάστε ξανά",
      },
    },
    application: {
      loading: {
        title: "Φόρτωση",
        description: "Προετοιμάζουμε αυτήν την προβολή.",
      },
      error: {
        title: "Κάτι πήγε στραβά",
        description: "Η σελίδα δεν μπόρεσε να εμφανιστεί σωστά. Δοκιμάστε ξανά.",
        retry: "Δοκιμάστε ξανά",
      },
    },
  },
  bg: {
    dashboard: {
      loading: {
        title: "Зареждане на таблото",
        description: "Подготвяме напредъка, активността и обобщението на обучението.",
      },
      error: {
        title: "Таблото не можа да се зареди",
        description: "Възникна грешка при подготовката на таблото. Опитайте отново.",
        retry: "Опитайте отново",
      },
    },
    eportfolio: {
      loading: {
        title: "Зареждане на ePortfolio",
        description: "Подготвяме казусите и текущия ви напредък.",
      },
      error: {
        title: "ePortfolio не можа да се зареди",
        description: "Възникна грешка при подготовката на библиотеката с казуси. Опитайте отново.",
        retry: "Опитайте отново",
      },
    },
    application: {
      loading: {
        title: "Зареждане",
        description: "Подготвяме този изглед.",
      },
      error: {
        title: "Нещо се обърка",
        description: "Страницата не можа да се покаже правилно. Опитайте отново.",
        retry: "Опитайте отново",
      },
    },
  },
};

type Props = {
  scope: RouteStateScope;
  kind: RouteStateKind;
  onRetry?: () => void;
};

export default function ProtectedRouteState({ scope, kind, onRetry }: Props) {
  const locale = useLocale();
  const localeCopy = COPY[locale] ?? COPY.en;
  const scopeCopy = localeCopy[scope];
  const copy = scopeCopy[kind];
  const isLoading = kind === "loading";

  return (
    <main
      className="relative flex min-h-[calc(100dvh-78px)] items-center justify-center overflow-hidden bg-[#f5f5f3] px-5 py-10 sm:px-6"
      role={isLoading ? "status" : "alert"}
      aria-live={isLoading ? "polite" : "assertive"}
      data-testid={`${scope}-${kind}-state`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(13,127,194,0.08),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(11,156,114,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(245,245,243,1)_100%)]" />

      <section className="relative z-10 w-full max-w-xl rounded-[30px] border border-white/70 bg-white/90 px-6 py-9 text-center shadow-[0_18px_48px_rgba(35,45,62,0.08)] backdrop-blur-xl sm:px-9">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef3f8] text-[#31425a]">
          {isLoading ? (
            <LoaderCircle className="h-7 w-7 animate-spin" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          )}
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#31425a]">{copy.title}</h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#667180]">{copy.description}</p>

        {!isLoading && onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#31425a] px-6 text-sm font-semibold text-white transition hover:bg-[#243246] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#31425a]/20"
          >
            {scopeCopy.error.retry}
          </button>
        ) : null}
      </section>
    </main>
  );
}
