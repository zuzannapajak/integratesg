import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";
import { scenario05Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario05Ids;

export const scenario05Pl = defineScenarioLocale<"scenario-05">({
  scenarioId: scenarioId,
  locale: "pl",
  title: "Wdrażanie ESG w struktury organizacyjne i partnerstwa",
  shortTitle: "Wdrażanie ESG w struktury organizacyjne i…",
  subtitle: "Wdrażanie ESG w struktury organizacyjne i partnerstwa",
  introduction:
    "Jesteś nowo mianowanym Koordynatorem ds. ESG / Zrównoważonego Rozwoju w BalkanUtil EAD, średniej wielkości bułgarskim przedsiębiorstwie użyteczności publicznej, świadczącym usługi wodne i energetyczne dla klientów komunalnych i przemysłowych w trzech regionach. Rsnąca presja regulacyjna oraz oczekiwania interesariuszy sprawiły, że kwestie ESG trafiły do programu prac wyższego kierownictwa. Istnieją już pewne praktyki związane ze zrównoważonym rozwojem – takie jak środki efektywności energetycznej czy procedury BHP – ale nie są one skoordynowane, a poszczególne działy wychodzą z założenia, że ESG to „odpowiedzialność kogoś innego”. Dane dotyczące wyników w zakresie ochrony środowiska, odpowiedzialności społecznej i ładu korporacyjnego (ESG) są rozproszone w różnych systemach, a firma dysponuje ograniczonym budżetem na nowe technologie czy doradztwo zewnętrzne. Wyższe kierownictwo oczekuje praktycznego sposobu na wewnętrzną organizację ESG, zbudowanie wiarygodnej bazy danych oraz ocenę pojawiających się możliwości partnerstwa – bez przekształcania ESG w dodatkowe obciążenie sprawozdawcze, odseparowane od codzienne działalności.",
  objectives: [
    "Stosować myślenie systemowe i procesowe w celu wdrożenia ESG w różnych funkcjach biznesowych.",
    "Podejmować świadome decyzje związane z ESG, wykorzystując dane, wkład interesariuszy oraz analizę długoterminowego wpływu.",
  ],
  boardAlt: "Trzy powiązane wyzwania ESG i dostępne decyzje.",
  challenges: {
    [challenges.crossFunctionalOwnership]: {
      title: "Wewnętrzna organizacja odpowiedzialności za ESG",
      shortTitle: "Wewnętrzna organizacja odpowiedzialności za ESG",
      context:
        "Kontekst wyzwania\n\nTematyka ESG zaczęła pojawiać się częściej w dyskusjach kadry zarządzającej, do czego przyczyniły się presja regulacyjna oraz oczekiwania interesariuszy. Istnieją już pewne działania związane ze zrównoważonym rozwojem, takie jak środki efektywności energetycznej czy procedury BHP, ale nie są one skoordynowane, a poszczególne działy zakładają, że ESG to obowiązek kogoś innego. Wyższe kierownictwo pyta, jak należy zorganizować ESG wewnątrz firmy, aby uniknąć zamieszania i powielania wysiłków.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.crossFunctionalOwnership.workingGroup]: {
          label: "Powołanie interdyscyplinarnej grupy roboczej ds.",
          text: "Powołanie interdyscyplinarnej grupy roboczej ds. ESG, koordynowanej na poziomie zarządzania, złożonej z przedstawicieli kluczowych działów, takich jak operacyjny, zasobów ludzkich (HR) i finansowy. Każdy dział wnosi inną perspektywę: dział operacyjny rozumie wpływ na środowisko, HR zarządza aspektami społecznymi, a finanse łączą ESG z budżetowaniem i sprawozdawczością. Koordynacja ESG w ten sposób gwarantuje, że kwestie zrównoważonego rozwoju zostaną włączone do codziennych decyzji i skorelowane ze strategią biznesową, zamiast być traktowane jako odizolowane inicjatywy.",
          feedback: {
            body: "Prawidłowo. Podejście to tworzy współodpowiedzialność przy jednoczesnym zachowaniu koordynacji i spójności strategicznej. ESG wymaga integracji operacyjnej we wszystkich działach, a nie tylko wiedzy z zakresu sprawozdawczości finansowej.",
          },
        },
        [choices.crossFunctionalOwnership.financeOnly]: {
          label: "Powierzenie koordynacji ESG działowi finansowemu, ponieważ oczekuje się, że…",
          text: "Powierzenie koordynacji ESG działowi finansowemu, ponieważ oczekuje się, że sprawozdawczość ESG stanie się wymogiem regulacyjnym i inwestorskim, a finanse zarządzają już systemami zgodności (compliance) i sprawozdawczości.",
          feedback: {
            body: "Choć finanse odgrywają ważną rolę w ujawnianiu informacji ESG, ograniczenie przywództwa w obszarze ESG wyłącznie do zgodności z przepisami grozi przekształceniem zrównoważonego rozwoju w ćwiczenie ze sprawozdawczości, zamiast w proces transformacji biznesowej.",
          },
        },
        [choices.crossFunctionalOwnership.independentDepartments]: {
          label:
            "Zdecyduj, że każdy dział powinien niezależnie zarządzać własnymi działaniami ESG,…",
          text: "Zdecyduj, że każdy dział powinien niezależnie zarządzać własnymi działaniami ESG, aby zachęcić do elastyczności i zmniejszyć biurokrację.\n\nInformacja zwrotna (Feedback)",
          feedback: {
            body: "W pełni zdecentralizowane zarządzanie ESG może wydawać się elastyczne, ale bez koordynacji organizacje mają trudności z ujednoliceniem celów, spójnym pomiarem wpływu i wiarygodnym komunikowaniem postępów.",
          },
        },
      },
    },
    [challenges.dataFoundation]: {
      title: "Budowa praktycznej bazy danych ESG",
      shortTitle: "Budowa praktycznej bazy danych ESG",
      context:
        "Kontekst wyzwania\n\nGdy obowiązki w zakresie ESG zostały ujaśnione, firma zdaje sobie sprawę, że jej dane dotyczące ESG są niespójne i niekompletne. Zużycie energii jest śledzone stosunkowo dobrze, ale dane społeczne i zarządcze są rozproszone w różnych systemach. Kierownictwo debatuje, czy rozpocząć zbieranie danych ESG natychmiast, przy użyciu istniejących źródeł, czy poczekać do momentu zakupu dedykowanego oprogramowania ESG.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.dataFoundation.existingSources]: {
          label:
            "Rozpoczęcie zbierania danych ESG z wykorzystaniem istniejących źródeł, takich jak…",
          text: "Rozpoczęcie zbierania danych ESG z wykorzystaniem istniejących źródeł, takich jak rachunki za energię, dokumentacja HR, raporty BHP i dane finansowe. Zdefiniowanie niewielkiej liczby jasnych wskaźników i ich regularne przeglądanie. Buduje to wewnętrzną wiedzę o danych i pomaga pracownikom zrozumieć, jak mierzona jest efektywność ESG przed zainwestowaniem w bardziej zaawansowane narzędzia cyfrowe.",
          feedback: {
            body: "Prawidłowo. Podejście to skupia się na istotności, spójności i nauce, a nie na ilości. Rozpoczęcie od możliwego do opanowania zestawu wskaźników pomaga organizacjom budować z czasem wewnętrzne zrozumienie i niezawodność danych.",
          },
        },
        [choices.dataFoundation.multinationalBenchmark]: {
          label: "Przeprowadzenie benchmarku firmy na tle dużych, międzynarodowych liderów ESG i…",
          text: "Przeprowadzenie benchmarku firmy na tle dużych, międzynarodowych liderów ESG i natychmiastowa próba śledzenia kilkudziesięciu wskaźników we wszystkich kategoriach ESG.",
          feedback: {
            body: "Próby zbyt wczesnego odwzorowania złożonych systemów ESG międzynarodowych korporacji często przeciążają zespoły i obniżają jakość danych.",
          },
        },
        [choices.dataFoundation.communicationFirst]: {
          label:
            "Priorytetowe traktowanie zbierania tych danych ESG, które najłatwiej komunikować…",
          text: "Priorytetowe traktowanie zbierania tych danych ESG, które najłatwiej komunikować na zewnątrz, zamiast danych najbardziej istotnych z punktu widzenia wpływu operacyjnego i podejmowania decyzji.\n\nInformacja zwrotna (Feedback)",
          feedback: {
            body: "Skupienie się głównie na wskaźnikach atrakcyjnych zewnętrznie grozi stworzeniem podejścia do ESG nastawionego jedynie na komunikację, w którym widoczność raportowania staje się ważniejsza niż poprawa operacyjna i długoterminowy wpływ.",
          },
        },
      },
    },
    [challenges.partnershipGovernance]: {
      title: "Strukturyzacja partnerstwa ESG z gminą",
      shortTitle: "Strukturyzacja partnerstwa ESG z gminą",
      context:
        "Kontekst wyzwania\n\nDo firmy zgłasza się gmina z propozycją wspólnego projektu w zakresie efektywności energetycznej budynków użyteczności publicznej. Inicjatywa dobrze wpisuje się w ambicje ESG firmy, ale kierownictwo obawia się niejasnego podziału obowiązków, ryzyka finansowego i ryzyka wizerunkowego w przypadku nieosiągnięcia rezultatów.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.partnershipGovernance.pppCanvas]: {
          label: "Wykorzystanie szablonu Partnerstwa Publiczno-Prywatnego (PPP Canvas) do…",
          text: "Wykorzystanie szablonu Partnerstwa Publiczno-Prywatnego (PPP Canvas) do ustrukturyzowania współpracy. Narzędzie to pomaga przed podjęciem zobowiązań doprecyzować role, obowiązki, ryzyka, zachęty, mechanizmy zarządzania oraz oczekiwane rezultaty ESG dla obu stron. Ustrukturyzowane podejście zmniejsza niepewność i buduje zaufanie.",
          feedback: {
            body: "Prawidłowo. Efektywna współpraca w obszarze ESG zależy od wspólnego zarządzania, przejrzystości i jasno określonych rezultatów.",
          },
        },
        [choices.partnershipGovernance.technologyOnly]: {
          label: "Zgoda na udział w partnerstwie wyłącznie w charakterze dostawcy technologii, z…",
          text: "Zgoda na udział w partnerstwie wyłącznie w charakterze dostawcy technologii, z unikaniem zaangażowania w zarządzanie lub koordynację interesariuszy w celu zminimalizowania ryzyka wizerunkowego.",
          feedback: {
            body: "Udział wyłącznie na poziomie operacyjnym może zmniejszyć ryzyko krótkoterminowe, ale ogranicza wpływ, możliwości nauki oraz zaufanie interesariuszy.",
          },
        },
        [choices.partnershipGovernance.visibilityFirst]: {
          label: "Przedłożenie krótkoterminowej widoczności i możliwości wizerunkowych…",
          text: "Przedłożenie krótkoterminowej widoczności i możliwości wizerunkowych (promocyjnych) wynikających z partnerstwa nad ustalenie mierzalnych celów ESG i mechanizmów rozliczalności.\n\nInformacja zwrotna (Feedback)",
          feedback: {
            body: "Skupienie się głównie na widoczności, a nie na mierzalnych rezultatach, zwiększa ryzyko powierzchownych partnerstw ESG, które generują rozgłos, nie przynosząc przy tym znaczącego wpływu środowiskowego ani społecznego.",
          },
        },
      },
    },
  },
  summary: {
    title: "Scenariusz ukończony",
    takeaways: [
      "Stosować myślenie systemowe i procesowe w celu wdrożenia ESG w różnych funkcjach biznesowych.",
      "Podejmować świadome decyzje związane z ESG, wykorzystując dane, wkład interesariuszy oraz analizę długoterminowego wpływu.",
    ],
  },
});
