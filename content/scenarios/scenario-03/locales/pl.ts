import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";
import { scenario03Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario03Ids;

export const scenario03Pl = defineScenarioLocale<"scenario-03">({
  scenarioId: scenarioId,
  locale: "pl",
  title: "Poruszanie się po ramach ESG i unijnych standardach sprawozdawczości",
  shortTitle: "Poruszanie się po ramach ESG i unijnych…",
  subtitle: "Poruszanie się po ramach ESG i unijnych standardach sprawozdawczości",
  introduction: "Jesteś liderem ds. zrównoważonego rozwoju i sprawozdawczości w firmie SONNENTOR – austriackim producencie żywności ekologicznej z siedzibą w Sprögnitz (Dolna Austria), który eksportuje herbaty, przyprawy i produkty bio do ponad 40 krajów. SONNENTOR raportuje już za pomocą Bilansu Gospodarki Dobra Wspólnego (Gemeinwohl-Bilanz, GWÖ) – ramy opartej na wartościach, w której firma uzyskuje wysokie wyniki (755 na 1000 punktów) i która podlega zewnętrznemu audytowi w cyklu dwuletnim.\n\nW tym samym czasie wpłynęły dwa pilne wniosek: Kluczowy odbiorca z UE, który sam podlega dyrektywie CSRD (Corporate Sustainability Reporting Directive), zwraca się do SONNENTOR o przekazanie punktów danych ESG w stylu ESRS na potrzeby oceny dostawców. Równolegle bank firmy prosi o zwięzły, porównywalny przegląd ESG, który posłuży do podjęcia decyzji finansowej. Obaj interesariusze oczekują informacji porównywalnych, opartych na dowodach i spójnych z roku na rok.\n\nProblem polega na tym, że GWÖ opowiada bogatą historię o wartościach i relacjach z interesariuszami, ale nie jest ustrukturyzowane tak jak punkty danych ESRS, o które proszą kupujący i bank. Informacje ESG w SONNENTOR są obecnie rozproszone pomiędzy działami zakupów, operacyjnym, HR i finansów (głównie w arkuszach kalkulacyjnych), a firma ma ograniczony budżet na nowe oprogramowanie czy doradztwo. Najwyższe kierownictwo jest dumne z podejścia GWÖ i obawia się, że odpowiedź stworzy nowy, ogromny ciężar sprawozdawczy. Musisz zdecydować, które podejście ramowe SONNENTOR powinno zastosować, aby spełnić oczekiwania UE, oraz zaprojektować praktyczny proces zbierania danych dla małego zestawu priorytetowych wskaźników – tak, aby firma mogła zareagować szybko, zachować proporcjonalny nakład pracy i uniknąć ryzyka greenwashingu.",
  objectives: ["Wybrać odpowiednie ramy ESG, które alignują (zestrajają) wewnętrzną strategię z oczekiwaniami interesariuszy z UE.", "Opracować podejście do gromadzenia danych dla priorytetowych wskaźników ESG, aby zapewnić jakość i ograniczyć ryzyko greenwashingu."],
  boardAlt: "Trzy powiązane wyzwania ESG i dostępne decyzje.",
  challenges: {
    [challenges.frameworkSelection]: {
      title: "Wybór właściwego podejścia ramowego dla interesariuszy z UE",
      shortTitle: "Wybór właściwego podejścia ramowego dla…",
      context: "Kontekst wyzwania\n\nKwestionariusz kupującego jest napisany w terminologii ESRS, a bank chce standaryzowanych danych, które może porównać z innymi kredytobiorcami. Żaden z interesariuszy nie zna macierzy GWÖ. Kierownictwo ceni tożsamość GWÖ i niechętnie przyjmuje drugi, pełny system sprawozdawczy. Twoją pierwszą decyzją jest to, jak SONNENTOR powinien pozycjonować swoje ramy w odpowiedzi.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.frameworkSelection.layeredApproach]: {
          label: "Zachowaj GWÖ jako podstawowe ramy wewnętrzne dla kultury, zarządzania i logiki…",
          text: "Zachowaj GWÖ jako podstawowe ramy wewnętrzne dla kultury, zarządzania i logiki interesariuszy, i dodaj lekką „warstwę mapowania” do oczekiwań UE. Zmapuj treści ESG, które SONNENTOR już posiada, na niewielki zestaw punktów danych w stylu ESRS, których faktycznie potrzebuje kupujący. Użyj Standardu GHG (GHG Protocol) jako technicznej metody pomiaru emisji w celu zapewnienia porównywalności i dodaj elementy Taksonomii UE tylko wtedy, gdy bank lub kupujący wyraźnie tego wymagają.",
          feedback: {
            body: "Prawidłowo. Warstwowe podejście przemawia językiem interesariuszy z UE, zachowując jednocześnie wewnętrzną spójność SONNENTOR. Ponownie wykorzystuje istniejące informacje zamiast budować równoległy system, ogranicza powtarzające się kwestionariusze, poprawia porównywalność i jest proporcjonalne dla MŚP o ograniczonych zasobach.",
          },
        },
        [choices.frameworkSelection.gwoOnly]: {
          label: "Odpowiedz, że GWÖ jest wystarczające i odmów dostarczenia punktów danych w stylu…",
          text: "Odpowiedz, że GWÖ jest wystarczające i odmów dostarczenia punktów danych w stylu ESRS, argumentując, że SONNENTOR raportuje już w sposób przejrzysty i sam nie podlega bezpośrednio CSRD.",
          feedback: {
            body: "Kupujący i banki zazwyczaj nie potrafią zinterpretować kategorii GWÖ i niezależnie od wszystkiego nadal będą prosić o punkty danych w stylu ESRS. Odmowa mapowania prowadzi do powielania pytań i odpowiedzi, wolniejszych reakcji oraz realnego ryzyka utraty kontraktu lub finansowania.",
          },
        },
        [choices.frameworkSelection.allFrameworks]: {
          label: "Wdróż wszystkie główne ramy jednocześnie – ESRS, GRI, SASB i kilka dodatkowych…",
          text: "Wdróż wszystkie główne ramy jednocześnie – ESRS, GRI, SASB i kilka dodatkowych ratingów – aby SONNENTOR wyglądał na firmę działającą kompleksowo i był gotowy na każde zapytanie.\n\nInformacja zwrotna (Feedback)",
          feedback: {
            body: "Wdrażanie wszystkich ram jednocześnie przeciąża mały zespół. Sprzeczne definicje i zbyt wiele punktów danych powodują spadek jakości danych i spadek zaangażowania pracowników, co zwiększa, a nie zmniejsza ryzyko greenwashingu.",
          },
        },
      },
    },
    [challenges.priorityIndicators]: {
      title: "Wybór i uzasadnienie priorytetowych wskaźników ESG",
      shortTitle: "Wybór i uzasadnienie priorytetowych wskaźników ESG",
      context: "Kontekst wyzwania\n\nSzablon kupującego zawiera dziesiątki możliwych punktów danych. SONNENTOR nie jest w stanie wiarygodnie przygotować ich wszystkich w dostępnym czasie, a niektóre (na przykład pełne emisje w łańcuchu wartości) nie są jeszcze dobrze mierzone. Musisz wybrać mały, dający się obronić zestaw priorytetowych wskaźników i umieć uzasadnić ten wybór zarówno kupującemu, jak i bankowi.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.priorityIndicators.materialitySet]: {
          label: "Przeprowadź lekką weryfikację istotności i oczekiwań interesariuszy (kupujący,…",
          text: "Przeprowadź lekką weryfikację istotności i oczekiwań interesariuszy (kupujący, bank, konsumenci, pracownicy i kluczowi dostawcy) i wybierz mały zestaw priorytetowych wskaźników. Powinny być one istotne i powiązane ze strategią (np. misja „Mission Null-Emission”, opakowania, łańcuch dostaw), porównywalne, jednoznacznie zdefiniowane i gotowe do przedstawienia na nie dowodów. Przykładowy zestaw: Emisje z Zakresu 1 i 2 oraz zużycie energii z udokumentowanym planem poprawy danych dla Zakresu 3; struktura opakowań i wskaźnik redukcji plastiku wraz z opisem metodologii; udział dostawców posiadających certyfikaty ekologiczne/zrównoważonego rozwoju; oraz wskaźniki pracownicze, takie jak incydenty BHP, godziny szkoleń i rotacja kadr.",
          feedback: {
            body: "Prawidłowo. Oparty na istotności, niewielki zestaw KPI z udokumentowanym uzasadnieniem daje się obronić, spełnia oczekiwania interesariuszy z UE, utrzymuje nakład pracy na zarządzalnym poziomie i wspiera wyższą jakość danych.",
          },
        },
        [choices.priorityIndicators.positiveOnly]: {
          label: "Raportuj tylko te wskaźniki, które stawiają SONNENTOR w najlepszym świetle – na…",
          text: "Raportuj tylko te wskaźniki, które stawiają SONNENTOR w najlepszym świetle – na przykład kategorie GWÖ osiągające już 100% i nagłośnioną deklarację o zaoszczędzeniu około 400 ton plastiku – pomijając słabsze obszary, takie jak Zakres 3",
          feedback: {
            body: "Selekcja ukierunkowana na marketing jest szybko wyłapywana przez świadomych interesariuszy, którzy zauważają luki (takie jak brak danych o emisjach w łańcuchu wartości czy ryzyku dostawców). Obraz wygląda na wybiórczy i budzi podejrzenia o greenwashing.",
          },
        },
        [choices.priorityIndicators.copyCorporate]: {
          label: "Skopiuj pełny katalog wskaźników KPI dużej korporacji, aby SONNENTOR sprawiał…",
          text: "Skopiuj pełny katalog wskaźników KPI dużej korporacji, aby SONNENTOR sprawiał wrażenie skrupulatnego i bezpośrednio porównywalnego z znacznie większymi graczami.\n\nInformacja zwrotna (Feedback)",
          feedback: {
            body: "Katalog KPI dużej firmy nie pasuje do systemów MŚP. Zbieranie danych staje się nierealne, liczby okazują się niespójne z roku na rok, a pracownicy stają się sfrustrowani – co podważa dokładnie tę wiarygodność, którą to ćwiczenie miało zbudować.",
          },
        },
      },
    },
    [challenges.dataGovernance]: {
      title: "Operacjonalizacja gromadzenia danych w celu zapewnienia jakości i ograniczenia greenwashingu",
      shortTitle: "Operacjonalizacja gromadzenia danych w celu…",
      context: "Kontekst wyzwania\n\nMasz już priorytetowy zestaw wskaźników. Pozostałym zadaniem jest sprawienie, aby liczby były wiarygodne i powtarzalne – ta sama wartość powinna dać się obronić, jeśli kupujący, bank lub audytor zapyta, jak została wyliczona – i zrobienie tego bez dużego budżetu na oprogramowanie oraz bez corocznego gorączkowego poszukiwania danych.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.dataGovernance.governedWorkflow]: {
          label: "Zbuduj prosty system zarządzania danymi ESG (data governance), który daje…",
          text: "Zbuduj prosty system zarządzania danymi ESG (data governance), który daje powtarzalne i audytowalne wyniki. Słownik KPI dla każdego wskaźnika (definicja, zakres/granice, jednostka, metoda obliczeniowa, częstotliwość i co uznaje się za dowód). Słownik KPI dla każdego wskaźnika (definicja, zakres/granice, jednostka, metoda obliczeniowa, częstotliwość i co uznaje się za dowód). Rytm zbierania danych: miesięczny lub kwartalny zamiast corocznej paniki. Minimalna kontrola jakości: udokumentowane źródła (faktury, dane z liczników, certyfikaty dostawców), kontrole kontrolne/analiza odchyleń oraz etap zatwierdzenia przed udostępnieniem na zewnątrz. Poziomy jakości danych: oznaczenie każdego punktu danych jako szacunkowego, dostarczonego przez dostawcę lub zweryfikowanego, z planem podnoszenia jakości w czasie – zwłaszcza dla Zakresu 3.",
          feedback: {
            body: "Prawidłowo. Słownik KPI z jasnymi właścicielami, dowodami, kontrolami i poziomami jakości zapewnia identyfikowalność, porównywalność i ciągłe doskonalenie. Interesariusze mogą zaufać liczbom, a ryzyko greenwashingu spada, ponieważ każdą wartość można odtworzyć.",
          },
        },
        [choices.dataGovernance.annualExcel]: {
          label: "Zachowaj prostotę, zbierając liczby raz w roku w arkuszu kalkulacyjnym, gdy…",
          text: "Zachowaj prostotę, zbierając liczby raz w roku w arkuszu kalkulacyjnym, gdy wpłynie zapytanie, bez ścieżki audytu (dowodowej), ponieważ SONNENTOR jest małą firmą, a czas pracowników jest cenny.",
          feedback: {
            body: "Coroczne podejście oparte wyłącznie na Excelu bez ścieżki dowodowej daje dane o niskiej wiarygodności, których nie można odtworzyć. Błędy utrzymują się, wyniki są niespójne między latami, a firma jest narażona na ryzyko w przypadku zakwestionowania deklaracji.",
          },
        },
        [choices.dataGovernance.outsourceEverything]: {
          label: "Zleć całe zadanie zewnętrznemu konsultantowi i traktuj dane ESG jako jego…",
          text: "Zleć całe zadanie zewnętrznemu konsultantowi i traktuj dane ESG jako jego odpowiedzialność, aby nie obciążać nimi pracowników wewnętrznych.\n\nInformacja zwrotna (Feedback)",
          feedback: {
            body: "Całkowity outsourcing bez wewnętrznego nadzoru tworzy zależność i powolne reakcje na zapytania kupujących i banków. Konsultanci nadal potrzebują danych wewnętrznych, a firma traci szansę na naukę i budowanie długoterminowych kompetencji, do których ten projekt miał doprowadzić.",
          },
        },
      },
    },
  },
  summary: {
    title: "Scenariusz ukończony",
    takeaways: ["Wybrać odpowiednie ramy ESG, które alignują (zestrajają) wewnętrzną strategię z oczekiwaniami interesariuszy z UE.", "Opracować podejście do gromadzenia danych dla priorytetowych wskaźników ESG, aby zapewnić jakość i ograniczyć ryzyko greenwashingu."],
  },
});
