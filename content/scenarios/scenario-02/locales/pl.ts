import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";
import { scenario02Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario02Ids;

export const scenario02Pl = defineScenarioLocale<"scenario-02">({
  scenarioId: scenarioId,
  locale: "pl",
  title: "Strategia, wizja i dopasowanie organizacyjne",
  shortTitle: "Strategia, wizja i dopasowanie organizacyjne",
  subtitle: "Strategia, wizja i dopasowanie organizacyjne",
  introduction: "Jesteś Menedżerem ds. Strategii i Rozwoju w średniej wielkości przedsiębiorstwie produkcyjnym (MŚP) NordForm Components, zatrudniającym 140 osób i dostarczającym części przemysłowe dla większych europejskich klientów. Firma znalazła się ostatnio pod rosnącą presją ze strony klientów, partnerów finansowych i pracowników, aby wykazać bardziej wiarygodne i ustrukturyzowane podejście do ESG. Zarząd zgodził się, że ESG powinno stać się częścią długoterminowego kierunku rozwoju firmy. Brak jednak wspólnego rozumienia tego, co to oznacza w praktyce.",
  objectives: ["Sformułować spójną strategię ESG, która łączy misję organizacji z celami zrównoważonego rozwoju.", "Rozwiązywać kompromisy operacyjne między krótkoterminowymi finansami a długoterminowymi celami ESG, aby wspierać dopasowanie organizacyjne i zmianę kultury firmy."],
  boardAlt: "Trzy powiązane wyzwania ESG i dostępne decyzje.",
  challenges: {
    [challenges.priorities]: {
      title: "Określenie priorytetów ESG bez utraty ostrości strategicznej.",
      shortTitle: "Określenie priorytetów ESG bez utraty ostrości…",
      context: "Podczas kwartalnego spotkania strategicznego zarząd prosi Cię o przedstawienie priorytetów ESG firmy na najbliższe trzy lata. Jeden z kluczowych klientów poprosił o dowody na postępy w zakresie ESG w łańcuchu dostaw. Jednocześnie wyższa kadra kierownicza ma bardzo różne wizje co do tego, co powinno być priorytetem:\n\n- Sprzedaż chce śmiałych deklaracji publicznych, aby zaimponować klientom.\n\n- Operacje chcą skupić się wyłącznie na planowanych już usprawnieniach efektywności.\n\n- HR oczekuje silniejszych działań na rzecz dobrostanu pracowników i inkluzywności.\n\n- Finanse chcą uniknąć wszystkiego, co wygląda na drogie lub trudne do zmierzenia.\n\nMisja firmy kładzie nacisk na jakość, niezawodność i długoterminowe partnerstwo, ale nikt jeszcze nie przełożył tych wartości na konkretne priorytety ESG.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.priorities.shortTermActions]: {
          label: "Zacznij od tematów ESG, które są najłatwiejsze do skomunikowania na zewnątrz i…",
          text: "Zacznij od tematów ESG, które są najłatwiejsze do skomunikowania na zewnątrz i najbardziej widoczne dla klientów, zakładając, że wiarygodność pojawi się sama, gdy firma wykaże dynamikę działań. Wewnętrzne dopasowanie i głębszą integrację strategiczną można dopracować później.",
          feedback: {
            body: "Wydaje się to atrakcyjne, ponieważ widoczne zobowiązania mogą szybko przynieść uznanie na zewnątrz. Jeśli jednak wybrane priorytety wynikają głównie z ich wartości komunikacyjnej, firma może przeoczyć kwestie bardziej istotne. Z czasem może to prowadzić do wewnętrznej frustracji, słabego wdrożenia i ryzyka wizerunkowego, jeśli obietnice zewnętrzne nie znajdą pokrycia w realiach operacyjnych.",
          },
        },
        [choices.priorities.materialPriorities]: {
          label: "Przed ostatecznym ustaleniem priorytetów przeprowadź ukierunkowany proces oceny…",
          text: "Przed ostatecznym ustaleniem priorytetów przeprowadź ukierunkowany proces oceny istotności i dopasowania (ang. materiality and alignment process). W praktyce oznacza to zebranie opinii od interesariuszy wewnętrznych i zewnętrznych, zidentyfikowanie tematów ESG najbardziej istotnych dla modelu biznesowego, oczekiwań klientów, realiów zatrudnienia i długoterminowej strategii, a następnie wybór ograniczonej liczby priorytetów strategicznych, które wyraźnie łączą się z misją firmy. Przełóż te priorytety na konkretne cele, zakresy odpowiedzialności i mierzalne wskaźniki.",
          feedback: {
            body: "To najsilniejszy wybór, ponieważ łączy strategię ESG z misją firmy oraz rzeczywistym profilem ryzyka i szans, a nie z krótkoterminową widocznością lub wygodą. Zwiększa również poczucie odpowiedzialności we wszystkich działach i zmniejsza ryzyko, że ESG stanie się oderwanym od rzeczywistości ćwiczeniem sprawozdawczym. W rzeczywistości prowadzi to do bardziej wiarygodnych priorytetów, lepszego podejmowania decyzji i większego zaufania interesariuszy.",
          },
        },
        [choices.priorities.broadCommitments]: {
          label: "Zbuduj strategię ESG głównie wokół kwestii, które firma potrafi już dobrze…",
          text: "Zbuduj strategię ESG głównie wokół kwestii, które firma potrafi już dobrze mierzyć, ponieważ mierzalne wskaźniki ułatwiają pokazanie postępów i uzyskanie akceptacji kierownictwa – nawet jeśli niektóre bardziej istotne kwestie zostaną odłożone na później.",
          feedback: {
            body: "Wybieranie tylko tego, co już jest łatwe do zmierzenia, brzmi praktycznie, ale może zniekształcić strategię. Ważne tematy ESG nie zawsze są najłatwiejsze do oszacowania ilościowego na samym początku. Jeśli wygoda pomiaru stanie się głównym kryterium, firma może przeznaczyć zbyt mało środków na kwestie kluczowe strategicznie i stworzyć fałszywe poczucie postępu.",
          },
        },
      },
    },
    [challenges.financialPressure]: {
      title: "Reagowanie na presję finansową bez osłabiania zaangażowania w ESG",
      shortTitle: "Reagowanie na presję finansową bez osłabiania…",
      context: "Sześć miesięcy później ceny energii rosną, a jeden z największych klientów opóźnia płatności. Dyrektor Finansowy prosi wszystkie działy o ograniczenie wydatków uznaniowych. Planowany pakiet inicjatyw ESG obejmuje zaangażowanie dostawców, szkolenia wewnętrzne oraz modernizację produkcji pod kątem efektywności wykorzystania zasobów.\n\nKierownictwo zgadza się, że ESG jest ważne, ale pojawiają się rozbieżności co do harmonogramu działań:\n\n- Finanse twierdzą, że kontynuowane powinny być tylko inicjatywy o bardzo szybkim zwrocie z inwestycji.\n\n- Operacje popierają modernizację efektywności zasobów, ale chcą odłożyć prace związane z dostawcami.\n\n- Sprzedaż ostrzega, że spowolnienie postępów w obszarze ESG może wpłynąć na przyszłe przetargi.\n\n- HR argumentuje, że przełożenie szkoleń wysyła niewłaściwy sygnał wewnątrz organizacji.\n\nMusisz zarekomendować dalszy sposób postępowania.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.financialPressure.pauseEsgWork]: {
          label: "Tymczasowo zawęź działania ESG do inicjatyw przynoszących natychmiastowe zyski…",
          text: "Tymczasowo zawęź działania ESG do inicjatyw przynoszących natychmiastowe zyski finansowe, zakładając, że po poprawie rentowności będzie można przywrócić szersze działania ESG bez poważniejszych konsekwencji strategicznych.",
          feedback: {
            body: "Wygląda to na odpowiedzialne finansowo, ale może osłabić strategiczną wartość ESG poprzez sprowadzenie go wyłącznie do krótkoterminowych oszczędności kosztów. Niektóre działania ESG tworzą wartość poprzez redukcję ryzyka, budowanie zaufania klientów, gotowość dostawców czy zmianę kultury organizacyjnej, a nie poprzez natychmiastowy zwrot nakładów. Zbytnie pobłażanie w ich wstrzymywaniu może przynieść chwilowe oszczędności, ale w dłuższej perspektywie doprowadzić do utraty odporności i konkurencyjności w przyszłości.",
          },
        },
        [choices.financialPressure.investInEverything]: {
          label: "Utrzymaj pełny plan działań ESG dokładnie w takiej formie, w jakiej został…",
          text: "Utrzymaj pełny plan działań ESG dokładnie w takiej formie, w jakiej został pierwotnie zaprojektowany, aby wykazać konsekwencję i uniknąć sprawiania wrażenia, że zaangażowanie firmy w zrównoważony rozwój słabnie.",
          feedback: {
            body: "Opcja ta wydaje się pryncypialna, jednak ignoruje ograniczenia operacyjne. Odmowa dostosowania planów w warunkach realnej presji finansowej może wywołać opór kierownictwa i zmniejszyć przyszłe poparcie dla ESG. Jeśli personel uzna ESG za obszar sztywny lub oderwany od realiów biznesowych, może to zaszkodzić długoterminowemu spójnemu funkcjonowaniu organizacji, zamiast je wzmocnić.",
          },
        },
        [choices.financialPressure.phasedBusinessCase]: {
          label: "Przeanalizuj plan działań ESG przez pryzmat uzasadnienia biznesowego (business…",
          text: "Przeanalizuj plan działań ESG przez pryzmat uzasadnienia biznesowego (business case) i etapowania, zamiast traktować go w kategoriach „wszystko albo nic”. Chroń kierunek strategiczny, ale rozłóż wdrażanie na etapy w oparciu o istotność, ekspozycję na ryzyko, koszty i oczekiwaną wartość. Kontynuuj działania, które wzmacniają odporność lub są ważne dla zaufania klientów i interesariuszy, dostosowując harmonogram projektów o niższym priorytecie. Jasno wyjaśnij, dlaczego ESG pozostaje częścią strategii firmy, nawet jeśli jego realizacja jest etapowana.",
          feedback: {
            body: "Jest to najbardziej zrównoważona odpowiedź, ponieważ chroni intencję strategiczną, jednocześnie uwzględniając rzeczywistość finansową. Pokazuje, że integracja ESG jest elementem rozsądnego zarządzania, a nie pobocznym projektem. W praktyce podejście to pomaga utrzymać wiarygodność, zachować dynamikę i pozwala kierownictwu na dokonywanie przemyślanych kompromisów zamiast reaktywnych cięć.",
          },
        },
      },
    },
    [challenges.peopleAndTeams]: {
      title: "Przekształcenie strategii ESG w zachowania organizacyjne",
      shortTitle: "Przekształcenie strategii ESG w zachowania…",
      context: "Rok po zatwierdzeniu strategii ESG firma opublikowała swoje priorytety i wprowadziła szereg polityk. Wdrażanie przebiega jednak nierównomiernie:\n\n- Liderzy zespołów nie omawiają spójnie kwestii ESG podczas spotkań operacyjnych.\n\n- Pracownicy określają ESG jako coś „głównie dla zarządu i na potrzeby sprawozdawczości”.\n\n- Niektóre działy są zaangażowane, podczas gdy inne widzą niewielki związek ze swoją codzienną pracą.\n\n- Zarząd pyta, dlaczego zmiana kultury organizacyjnej następuje wolniej niż oczekiwano.\n\nProsi się Cię o zarekomendowanie kolejnego kroku w celu poprawy spójności organizacyjnej.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.peopleAndTeams.sharedOwnership]: {
          label: "Przejdź od wdrażania opartego na politykach i procedurach do integracji opartej na…",
          text: "Przejdź od wdrażania opartego na politykach i procedurach do integracji opartej na zachowaniach. Połącz priorytety ESG z konkretnymi obowiązkami poszczególnych działów, rutyną zarządczą, dyskusjami w zespołach oraz oczekiwaniami wykonawczymi. Zapewnij praktyczne szkolenia powiązane z rolami stanowiskowymi, wyposaż menedżerów średniego szczebla w narzędzia do przekładania strategii na codzienne decyzje i stwórz mechanizmy informacji zwrotnej, aby pracownicy widzieli, jak ESG wpływa na operacje i dlaczego ich wkład ma znaczenie.",
          feedback: {
            body: "To najsilniejsza opcja, ponieważ spójność organizacyjna pojawia się wtedy, gdy ludzie rozumieją, co dana strategia oznacza dla ich własnej roli i codziennych obowiązków. ESG staje się wiarygodne dopiero wtedy, gdy wpływa na decyzje, nawyki, motywatory i dyskusje w całej firmie. W praktyce podejście to prowadzi do głębszego poczucia odpowiedzialności, skuteczniejszego wdrożenia i bardziej autentycznej zmiany kulturowej.",
          },
        },
        [choices.peopleAndTeams.sustainabilityOnly]: {
          label: "Skup się najpierw na wzmocnieniu formalnego ładu zarządczego (ang.",
          text: "Skup się najpierw na wzmocnieniu formalnego ładu zarządczego (ang. governance) poprzez dodanie większej liczby polityk ESG, szablonów sprawozdawczych i kontroli zarządczych, zakładając, że wyraźniejsza formalizacja z czasem doprowadzi do pożądanej zmiany kulturowej.",
          feedback: {
            body: "Lepszy ład zarządczy może pomóc, ale samo mnożenie polityk rzadko zmienia zachowania. Jeśli pracownicy doświadczają ESG głównie poprzez dodatkowe formularze lub zadania sprawozdawcze, mogą postrzegać je jako biurokrację, a nie kierunek strategiczny. Może to prowadzić do wymuszonej zgodności (ang. compliance) bez rzeczywistego zaangażowania.",
          },
        },
        [choices.peopleAndTeams.communicationOnly]: {
          label: "Polegaj na widocznych kampaniach komunikacyjnych kierownictwa, które mają wzmocnić…",
          text: "Polegaj na widocznych kampaniach komunikacyjnych kierownictwa, które mają wzmocnić wizję ESG, zakładając, że jeśli przekaz będzie powtarzany dostatecznie często, działy w naturalny sposób przełożą go na codzienną praktykę.",
          feedback: {
            body: "Komunikacja ze strony kierownictwa jest konieczna, ale niewystarczająca. Bez przełożenia wizji na konkretne role i bez konsekwencji w działaniach menedżerskich, powtarzane komunikaty mogą pozostać czystą abstrakcją. Pracownicy mogą popierać ideę ESG w teorii, wciąż nie wiedząc, jak postępować inaczej w praktyce.",
          },
        },
      },
    },
  },
  summary: {
    title: "Scenariusz ukończony",
    takeaways: ["Sformułować spójną strategię ESG, która łączy misję organizacji z celami zrównoważonego rozwoju.", "Rozwiązywać kompromisy operacyjne między krótkoterminowymi finansami a długoterminowymi celami ESG, aby wspierać dopasowanie organizacyjne i zmianę kultury firmy."],
  },
});
