import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";
import { scenario04Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario04Ids;

export const scenario04Pl = defineScenarioLocale<"scenario-04">({
  scenarioId: scenarioId,
  locale: "pl",
  title: "Integracja ESG w Działalności Operacyjnej Przedsiębiorstwa",
  shortTitle: "Integracja ESG w Działalności Operacyjnej…",
  subtitle: "Integracja ESG w Działalności Operacyjnej Przedsiębiorstwa",
  introduction: "Jesteś liderem ds. operacyjnych i zgodności (compliance) w firmie EcoPart Manufacturing – MŚP zatrudniającym 120 pracowników, dostarczającym komponenty do dwóch dużych klientów z UE. Obaj klienci zaczynają wymagać od dostawców informacji związanych z ESG, w tym danych dotyczących zużycia energii, odpadów, zawartości materiałów z recyklingu, podstawowych praktyk pracowniczych, standardów dla dostawców oraz dowodów na stosowanie gospodarki obiegu zamkniętego. Dane ESG w firmie są obecnie rozproszone pomiędzy działy finansów, HR, ochrony środowiska/BHP, produkcji i zakupów. Większość informacji jest przechowywana w arkuszach kalkulacyjnych, a firma ma ograniczony budżet na nowe technologie lub wsparcie doradcze. Kadra kierownicza wyższego szczebla oczekuje praktycznego planu działania (mapy drogowej), który spełni oczekiwania klientów, a jednocześnie usprawni działalność operacyjną. Musisz zdecydować, jak zintegrować ESG z codziennymi procesami biznesowymi w sposób wiarygodny, proporcjonalny i użyteczny dla firmy – a nie tylko jako dodatkowe obciążenie sprawozdawcze.",
  objectives: ["Zrekonstruować łańcuch dostaw i przepływy operacyjne przy użyciu kryteriów gospodarki o obiegu zamkniętym w celu minimalizacji odpadów.", "Wdrożyć etyczne praktyki społeczne w codziennych usługach, aby dostosować zarządzanie operacyjne do wartości."],
  boardAlt: "Trzy powiązane wyzwania ESG i dostępne decyzje.",
  challenges: {
    [challenges.dataSystem]: {
      title: "Budowa praktycznego systemu danych ESG",
      shortTitle: "Budowa praktycznego systemu danych ESG",
      context: "Twoim pierwszym zadaniem jest uporządkowanie informacji ESG, aby firma mogła odpowiadać na zapytania klientów i identyfikować obszary do poprawy operacyjnej. Dyrektor Zarządzający chce, aby firma była „gotowa na raportowanie ESG”, ale możliwości IT są ograniczone, a kierownicy działów obawiają się dodatkowej pracy administracyjnej.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.dataSystem.simpleRegister]: {
          label: "Stwórz prosty rejestr danych ESG, który zidentyfikuje najbardziej istotne…",
          text: "Stwórz prosty rejestr danych ESG, który zidentyfikuje najbardziej istotne wskaźniki operacyjne, przypisze właścicieli danych w każdym dziale i ustali miesięczny rytm zbierania danych. Zacznij od ograniczonego zestawu wskaźników o wysokiej wartości, takich jak zużycie energii na jednostkę, wskaźnik odpadów, zawartość materiałów z recyklingu, incydenty BHP oraz rotacja pracowników. Na początku korzystaj z istniejących narzędzi, ale zdefiniuj jasne zasady jakości danych, zakres odpowiedzialności i harmonogram spotkań przeglądowych.",
          feedback: {
            body: "Prawidłowo. To podejście jest proporcjonalne dla MŚP, ponieważ tworzy strukturę bez nadmiernego komplikowania procesu. Zaczynając od kluczowych wskaźników, przypisując odpowiedzialność i krok po kroku poprawiając jakość danych, firma może bardziej niezawodnie odpowiadać na zapytania klientów i wykorzystywać te same informacje do doskonalenia operacji.",
          },
        },
        [choices.dataSystem.buyPlatform]: {
          label: "Kup natychmiast kompleksową platformę oprogramowania ESG, aby od samego początku…",
          text: "Kup natychmiast kompleksową platformę oprogramowania ESG, aby od samego początku zarządzać wszystkimi raportami, pulpitami nawigacyjnymi (dashboards) i zapytaniami klientów w jednym centralnym systemie. Powinno to zmniejszyć ilość pracy ręcznej i pokazać klientom, że firma traktuje ESG poważnie.",
          feedback: {
            body: "Może to brzmieć profesjonalnie, ale samo oprogramowanie nie rozwiąże problemu braku odpowiedzialności za dane czy niejasnych procesów. Jeśli firma kupi platformę przed zdefiniowaniem wskaźników, zakresu odpowiedzialności i zasad jakości, może wygenerować koszty bez poprawy niezawodności. Rezultatem może być drogi system wypełniony niepełnymi lub niespójnymi danymi.",
          },
        },
        [choices.dataSystem.requestOnly]: {
          label: "Kontynuuj zbieranie danych ESG tylko wtedy, gdy wymagają tego klienci, ponieważ…",
          text: "Kontynuuj zbieranie danych ESG tylko wtedy, gdy wymagają tego klienci, ponieważ firma nie jest prawnie zobowiązana do sporządzania pełnych raportów zrównoważonego rozwoju. Pozwala to uniknąć niepotrzebnego obciążenia wewnętrznego i umożliwia zespołom skupienie się na priorytetach produkcyjnych.",
          feedback: {
            body: "Wydaje się to efektywne na krótką metę, ale utrzymuje firmę w postawie reaktywnej. Dane zbierane tylko na żądanie są często przygotowywane w pośpiechu, niespójne i trudne do weryfikacji. Z czasem może to osłabić zaufanie klientów i uniemożliwić firmie dostrzeżenie trendów, które mogłyby obniżyć koszty, ilość odpadów lub ryzyko.",
          },
        },
      },
    },
    [challenges.supplierCircularity]: {
      title: "Współpraca z dostawcami w zakresie gospodarki obiegu zamkniętego i dowodów ESG",
      shortTitle: "Współpraca z dostawcami w zakresie gospodarki…",
      context: "Jeden z Twoich największych klientów prosi o dowody na to, że Twoja firma wdraża zasady gospodarki obiegu zamkniętego w łańcuchu dostaw. Dział zakupów wybiera obecnie dostawców głównie na podstawie ceny, niezawodności dostaw i jakości. Niektórzy dostawcy to małe firmy o ograniczonej wiedzy na temat ESG, a Twój zespół ds. zakupów obawia się, że dodatkowe wymagania mogą zwiększyć koszty lub ograniczyć elastyczność.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.supplierCircularity.focusHighImpact]: {
          label: "Skup się najpierw na dostawcach i materiałach o największym wpływie.",
          text: "Skup się najpierw na dostawcach i materiałach o największym wpływie. Poproś o niewielki, praktyczny zestaw informacji dotyczących ESG i gospodarki obiegu zamkniętego, takich jak zawartość materiałów z recyklingu, redukcja opakowań, gospodarka odpadami i podstawowe standardy pracy. Tam, gdzie dostawcom brakuje szczegółowych danych, zezwól na uzasadnione szacunki (proxy) lub plany naprawcze. Wykorzystaj wyniki do zidentyfikowania jednej lub dwóch możliwości pilotażowych, takich jak zmiana opakowań, redukcja odpadów produkcyjnych lub zwiększenie zawartości materiałów pochodzących z recyklingu.",
          feedback: {
            body: "Prawidłowo. Ta opcja łączy ambitne cele z praktycznym podejściem. Koncentruje wysiłki tam, gdzie prawdopodobnie wystąpi największy wpływ operacyjny i ESG, zachowując jednocześnie realistyczny poziom zaangażowania dostawców. Zwiększa to wskaźnik odpowiedzi, chroni relacje z dostawcami i tworzy wiarygodne dowody na stosowanie gospodarki obiegu zamkniętego.",
          },
        },
        [choices.supplierCircularity.fullQuestionnaire]: {
          label: "Poproś wszystkich dostawców o natychmiastowe wypełnienie tej samej szczegółowej…",
          text: "Poproś wszystkich dostawców o natychmiastowe wypełnienie tej samej szczegółowej ankiety ESG i dostarczenie pełnych danych dotyczących oceny cyklu życia (LCA). Tworzy to spójny standard i gwarantuje, że firma nie przeoczy ryzyka u mniejszych dostawców lub takich, u których generuje mniejsze wydatki.",
          feedback: {
            body: "To podejście wydaje się rygorystyczne, ale może przytłoczyć mniejszych dostawców i zmniejszyć chęć do współpracy. Jeśli dostawcy nie będą w stanie dostarczyć złożonych danych, firma może uzyskać niski wskaźnik odpowiedzi i niewiele przydatnych informacji. Proporcjonalne podejście zazwyczaj przynosi lepsze dowody niż podejście nadmierne.",
          },
        },
        [choices.supplierCircularity.polishedDocuments]: {
          label: "Priorytetowo traktuj dostawców, którzy potrafią już dostarczyć dopracowane…",
          text: "Priorytetowo traktuj dostawców, którzy potrafią już dostarczyć dopracowane dokumenty ESG, nawet jeśli nie są to najważniejsi dostawcy z punktu widzenia operacyjnego. Pozwala to firmie na szybkie przedstawienie dowodów klientom, przy jednoczesnej stopniowej poprawie u pozostałej bazy dostawców w późniejszym czasie.",
          feedback: {
            body: "Ta opcja może przynieść szybkie dokumenty do komunikacji z klientami, ale niesie ze sobą ryzyko skupienia się na dostawcach, o których najłatwiej raportować, a nie na tych, którzy mają największe znaczenie. Może to stworzyć mylący obraz postępów i pozostawić kluczowe kwestie wpływu ESG bez zmian.",
          },
        },
      },
    },
    [challenges.operationalImprovement]: {
      title: "Przekształcenie raportowania ESG w usprawnienia operacyjne",
      shortTitle: "Przekształcenie raportowania ESG w usprawnienia…",
      context: "Po zebraniu wstępnych danych ESG zauważasz, że poziom odpadów produkcyjnych (złomu) i zużycie energii różnią się znacząco pomiędzy liniami produkcyjnymi. Dane HR wskazują również na wyższą rotację pracowników w jednym ze zespołów zmianowych. Zespół kierowniczy pyta, czy ESG powinno pozostać głównie działaniem sprawozdawczym, czy też stać się częścią procesu ciągłego doskonalenia.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.operationalImprovement.focusedProjects]: {
          label: "Powiąż wybrane wskaźniki ESG z praktycznymi projektami usprawnień operacyjnych.",
          text: "Powiąż wybrane wskaźniki ESG z praktycznymi projektami usprawnień operacyjnych. Na przykład wykorzystaj dane dotyczące odpadów i energii do uruchomienia ukierunkowanych działań Kaizen, a dane dotyczące rotacji i zdarzeń potencjalnie wypadkowych (near-miss) do poprawy rutyny zespołowej, nadzoru i warunków pracy. Utrzymuj liczbę wskaźników na poziomie możliwym do opanowania i przeglądaj je na regularnych spotkaniach operacyjnych, aby ESG stało się częścią codziennego zarządzania.",
          feedback: {
            body: "Prawidłowo. To podejście przekształca ESG w źródło wartości operacyjnej. Łącząc wskaźniki z projektami usprawnień, firma może obniżyć koszty, poprawić bezpieczeństwo i warunki pracy oraz pokazać klientom, że ESG jest zakorzenione w codziennych operacjach, a nie traktowane wyłącznie jako praca z dokumentami.",
          },
        },
        [choices.operationalImprovement.separateReporting]: {
          label: "Oddziel raportowanie ESG od działań usprawniających produkcję, aby nie odciągać…",
          text: "Oddziel raportowanie ESG od działań usprawniających produkcję, aby nie odciągać uwagi zespołów operacyjnych. Dane ESG mogą być przygotowywane przez personel ds. zgodności (compliance), podczas gdy zespoły produkcyjne skupiają się na celach dotyczących wydajności, jakości i dostaw.",
          feedback: {
            body: "Może się to wydawać efektywne, ponieważ chroni zespoły produkcyjne przed dodatkowymi zadaniami. Jednak uniemożliwia to wykorzystanie danych ESG do rozwiązywania realnych problemów operacyjnych. Pracownicy mogą zacząć postrzegać ESG jako biurokrację, a firma może przeoczyć oszczędności finansowe, poprawę bezpieczeństwa i korzyści płynące z zaangażowania zespołu.",
          },
        },
        [choices.operationalImprovement.transformAllAtOnce]: {
          label: "Uruchom ogólnofirmowy program transformacji ESG obejmujący wszystkie działy…",
          text: "Uruchom ogólnofirmowy program transformacji ESG obejmujący wszystkie działy jednocześnie, z nowymi celami w zakresie energii, odpadów, praktyk pracowniczych, standardów dla dostawców i ładu korporacyjnego. Świadczy to o silnym przywództwie i przyspiesza zmianę kulturową.",
          feedback: {
            body: "Ta opcja wykazuje duże ambicje, ale może przeciążyć organizację. W przypadku MŚP o ograniczonych zasobach zbyt wiele jednoczesnych działań ESG może wywołać zamieszanie, zmęczenie i słabe wykonanie. Skoncentrowane projekty pilotażowe często prowadzą do szybszego uczenia się i silniejszego, długoterminowego zaangażowania.",
          },
        },
      },
    },
  },
  summary: {
    title: "Scenariusz ukończony",
    takeaways: ["Zrekonstruować łańcuch dostaw i przepływy operacyjne przy użyciu kryteriów gospodarki o obiegu zamkniętym w celu minimalizacji odpadów.", "Wdrożyć etyczne praktyki społeczne w codziennych usługach, aby dostosować zarządzanie operacyjne do wartości."],
  },
});
