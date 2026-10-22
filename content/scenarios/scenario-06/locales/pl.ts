import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";
import { scenario06Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario06Ids;

export const scenario06Pl = defineScenarioLocale<"scenario-06">({
  scenarioId: scenarioId,
  locale: "pl",
  title: "Monitorowanie, raportowanie i przyszłe trendy w ESG",
  shortTitle: "Monitorowanie, raportowanie i przyszłe trendy w…",
  subtitle: "Monitorowanie, raportowanie i przyszłe trendy w ESG",
  introduction: "W tym scenariuszu podejmiesz decyzje dotyczące wyboru wskaźników ESG, jakości danych oraz raportowania wyników różnym grupom interesariuszy.",
  objectives: ["Wybierać konkretne wskaźniki i KPI ESG w celu monitorowania wyników w ramach podstawowej działalności przedsiębiorstwa.", "Kategoryzować dane ESG, aby generować przejrzyste raporty dostosowane do potrzeb różnych grup interesariuszy."],
  boardAlt: "Trzy powiązane wyzwania ESG i dostępne decyzje.",
  challenges: {
    [challenges.kpiSelection]: {
      title: "Zbyt wiele wskaźników KPI, zbyt mała wartość",
      shortTitle: "Zbyt wiele wskaźników KPI, zbyt mała wartość",
      context: "Mała firma chce rozpocząć monitorowanie swoich wyników ESG. Każdy dział proponuje własne wskaźniki, co daje listę 40 różnych KPI. Firma szybko zdaje sobie sprawę, że śledzenie ich wszystkich jest nierealistyczne i wprowadza zamieszanie.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.kpiSelection.coreKpis]: {
          label: "Wybierz 6–10 kluczowych wskaźników KPI powiązanych z główną działalnością firmy…",
          text: "- Wybierz 6–10 kluczowych wskaźników KPI powiązanych z główną działalnością firmy oraz kluczowymi ryzykami lub szansami w obszarze ESG (Środowisko, Społeczność, Ład Korporacyjny).\n\n- Dla każdego KPI jasno zdefiniuj:\n\n- co mierzy,\n\n- metodę obliczania,\n\n- częstotliwość pomiaru,\n\n- osobę odpowiedzialną,\n\n- źródło pochodzenia danych,\n\n- cel lub wartość progową.\n\n- Powiąż każdy wskaźnik KPI z decyzją biznesową (np. inwestycje, szkolenia, wybór dostawców, konserwacja).\n\n- Rozpocznij od bazowego okresu pomiarowego (3–6 miesięcy) i dodawaj bardziej zaawansowane KPI dopiero wtedy, gdy proces zbierania danych się ustabilizuje.",
          feedback: {
            body: "Niewielka liczba silnych wskaźników KPI prowadzi do spójnych raportów, ciągłego monitorowania i szybszego podejmowania decyzji.",
          },
        },
        [choices.kpiSelection.measureEverything]: {
          label: "„Zmierzmy wszystko natychmiast, aby wyglądać bardziej wiarygodnie.”",
          text: "„Zmierzmy wszystko natychmiast, aby wyglądać bardziej wiarygodnie.”\n\nCzęsto prowadzi to do niepełnych lub niespójnych danych, wyższych kosztów i niskiego poziomu zaufania wewnątrz organizacji.",
          feedback: {
            body: "Wysokie ryzyko błędów i niekontrolowanych liczb. Czas jest marnowany, a firma może spotkać się z zarzutami o greenwashing, jeśli danych nie da się ze zweryfikować.",
          },
        },
        [choices.kpiSelection.copyCorporate]: {
          label: "„Skopiujmy wskaźniki KPI stosowane przez duże korporacje.”",
          text: "„Skopiujmy wskaźniki KPI stosowane przez duże korporacje.”\n\nDuże firmy dysponują większymi zasobami i złożonymi systemami. Ich wskaźniki mogą być zbyt trudne do zebrania lub zarządzania dla MŚP, co czyni raportowanie nieskutecznym.",
          feedback: {
            body: "Tworzy niepotrzebną biurokrację. Działy przestają używać wskaźników po kilku miesiącach.",
          },
        },
      },
    },
    [challenges.dataQuality]: {
      title: "Niespójne dane",
      shortTitle: "Niespójne dane",
      context: "Dane dotyczące energii i odpadów pochodzą od różnych dostawców i są dostarczane w różnych formatach. Działy HR i zakupów używają oddzielnych arkuszy kalkulacyjnych, przez co brakuje jednego wiarygodnego źródła informacji.\n\nW rezultacie firma ma trudności z porównywaniem i łączeniem danych.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.dataQuality.dataModelAndGovernance]: {
          label: "Zdefiniuj prosty model danych ESG, obejmujący:",
          text: "- Zdefiniuj prosty model danych ESG, obejmujący:\n\n- kategorie danych (Środowisko, Społeczność, Ład Korporacyjny),\n\n- jednostki miary,\n\n- poziom szczegółowości (zakład, dział, dostawca),\n\n- zasady walidacji.\n\n- Wdróż proces kontroli jakości danych:\n\n- weryfikację pod kątem kompletności i spójności\n\n- identyfikację wartości nietypowych (odchyleń),\n\n- kontrolę wersji i śledzenie zmian.\n\n- Ustal:\n\n- harmonogram zbierania danych,\n\n- właścicieli danych odpowiedzialnych za każdy obszar,\n\n- wspólny słownik danych wyjaśniający każdy wskaźnik.",
          feedback: {
            body: "Porównywalne i wiarygodne dane podnoszą wiarygodność raportowania i redukują poprawki robione na ostatnią chwilę.",
          },
        },
        [choices.dataQuality.singleExcel]: {
          label: "„Umieśćmy po prostu wszystko w jednym pliku Excela.”",
          text: "„Umieśćmy po prostu wszystko w jednym pliku Excela.”\n\nBez jasnych definicji i kontroli niespójności pozostają, a często wręcz narastają. Ten sam wskaźnik może ostatecznie pokazywać różne wartości w różnych miejscach.",
          feedback: {
            body: "Powracające niespójności. Raporty są kwestionowane, a mnóstwo czasu marnuje się na uzgadnianie liczb.",
          },
        },
        [choices.dataQuality.waitForSoftware]: {
          label: "„Poczekajmy, aż kupimy idealne oprogramowanie ESG.”",
          text: "„Poczekajmy, aż kupimy idealne oprogramowanie ESG.”\n\nOczekiwanie opóźnia monitorowanie i uniemożliwia firmie budowanie przydatnej bazy odniesienia oraz kultury pracy z danymi.",
          feedback: {
            body: "Opóźnia monitorowanie ESG. Firma nie może wykazać postępów ani procesu uczenia się.",
          },
        },
      },
    },
    [challenges.stakeholderReporting]: {
      title: "Jeden raport dla wszystkich?",
      shortTitle: "Jeden raport dla wszystkich?",
      context: "Różni interesariusze oczekują różnych rodzajów informacji ESG:\n\n- Zarząd chce krótkiego raportu wspierającego podejmowanie decyzji.\n\n- Banki i partnerzy wymagają szczegółowych informacji oraz twardych danych.\n\n- Lokalna społeczność oczekuje jasnych i prostych wyjaśnień.\n\n- Dział marketingu preferuje silny, pozytywny przekaz.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.stakeholderReporting.tailoredReporting]: {
          label: "Stwórz trzy poziomy komunikacji:",
          text: "Stwórz trzy poziomy komunikacji:\n\n1. Wewnętrzny pulpit nawigacyjny / dashboard (do podejmowania decyzji):\n\n- około 10 wskaźników KPI,\n\n- trendy w czasie,\n\n- alerty i działania korygujące.\n\n2. Techniczny raport dla interesariuszy:\n\n- metodologia i zakres danych,\n\n- definicje wskaźników,\n\n- źródła danych i ograniczenia,\n\n- dowody potwierdzające.\n\n3. Podsumowanie publiczne:\n\n- jasne komunikaty o wynikach,\n\n- przejrzystość w zakresie kwestii wciąż nieustalonych/nieznanych,\n\n- plany naprawcze i rozwojowe.\n\nZawsze uwzględniaj:\n\n- definicje KPI,\n\n- granice raportowania,\n\n- częstotliwość zbierania danych,\n\n- odpowiedzialne zespoły.\n\nTaka przejrzystość pomaga zredukować ryzyko oskarżeń o greenwashing.",
          feedback: {
            body: "Dedykowana, dostosowana komunikacja zwiększa zaufanie i użyteczność zarówno dla interesariuszy wewnętrznych, jak i zewnętrznych.",
          },
        },
        [choices.stakeholderReporting.singleReport]: {
          label: "„Stwórzmy jeden raport dla wszystkich.”",
          text: "„Stwórzmy jeden raport dla wszystkich.”\n\nRaport staje się albo zbyt techniczny dla zwykłych czytelników, albo zbyt powierzchowny dla ekspertów.",
          feedback: {
            body: "Interesariusze pozostają niezadowoleni i wymagają dodatkowych wyjaśnień.",
          },
        },
        [choices.stakeholderReporting.positiveOnly]: {
          label: "„Komunikujmy tylko pozytywne wyniki.”",
          text: "„Komunikujmy tylko pozytywne wyniki.”\n\nUkrywanie problemów może zaszkodzić wiarygodności, jeśli kwestie te wyjdą później na jaw.",
          feedback: {
            body: "Wysokie ryzyko wizerunkowego kryzysu i oskarżeń o greenwashing.",
          },
        },
      },
    },
  },
  summary: {
    title: "Scenariusz ukończony",
    takeaways: ["Wybierać konkretne wskaźniki i KPI ESG w celu monitorowania wyników w ramach podstawowej działalności przedsiębiorstwa.", "Kategoryzować dane ESG, aby generować przejrzyste raporty dostosowane do potrzeb różnych grup interesariuszy."],
  },
});
