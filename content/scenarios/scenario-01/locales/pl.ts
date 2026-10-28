import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";
import { scenario01Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario01Ids;

export const scenario01Pl = defineScenarioLocale<"scenario-01">({
  scenarioId: scenarioId,
  locale: "pl",
  title: "Podstawy ESG i zrównoważonego rozwoju",
  shortTitle: "Podstawy ESG i zrównoważonego rozwoju",
  subtitle: "Podstawy ESG i zrównoważonego rozwoju",
  introduction:
    "Jesteś menedżerem „GreenTech Solutions” – sektora MŚP produkującego komponenty o wysokiej wydajności. Duża międzynarodowa korporacja zgłosiła się z zainteresowaniem podpisaniem wieloletniej umowy. Jednak przed jej podpisaniem wymaga od Ciebie przedstawienia „Planu Integracji ESG” (ESG Integration Roadmap), który wykracza poza Twoje dotychczasowe darowizny na cele charytatywne.",
  objectives: [
    "Zdefiniować i rozróżnić trzy główne filary ESG (Środowiskowy, Społeczny, Ładu Korporacyjnego) w kontekście biznesowym.",
    "Zastosować zasady ESG w celu uzyskania przewagi strategicznej, w szczególności w zakresie dostępu do łańcuchów dostaw dużych korporacji.",
  ],
  boardAlt: "Trzy powiązane wyzwania ESG i dostępne decyzje.",
  challenges: {
    [challenges.pillars]: {
      title: "Definiowanie filarów dla klienta",
      shortTitle: "Definiowanie filarów dla klienta",
      context:
        "Oficer ds. zakupów klienta prosi Cię o wyjaśnienie, w jaki sposób Twoja firma zarządza „ryzykami niefinansowymi” w szczególności w ramach filarów E, S i G. Musisz poprawnie skategoryzować swoje obecne działania, aby udowodnić, że rozumiesz te ramy.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.pillars.accurateCategorisation]: {
          label:
            "Dokładnie skategoryzuj operacje, podkreślając swoją efektywność energetyczną (E),…",
          text: "Dokładnie skategoryzuj operacje, podkreślając swoją efektywność energetyczną (E), uczciwe wynagrodzenia i politykę różnorodności (S) oraz przejrzyste podejmowanie decyzji przez zarząd i środki antykorupcyjne (G).",
          feedback: {
            body: "Doskonała robota. Poprawnie identyfikując, że efektywność energetyczna należy do filaru Środowiskowego, uczciwe wynagrodzenia do Społecznego, a antykorupcja do Ładu Korporacyjnego, pokazujesz, że ESG to „karta wyników” służąca do zarządzania ryzykiem. Ta przejrzystość dowodzi klientowi, że nie używasz tylko modnych haseł, ale zarządzasz czynnikami niefinansowymi w celu budowania długoterminowej wartości.",
          },
        },
        [choices.pillars.rulesConfusion]: {
          label: "Zaliczanie bezpieczeństwa pracowników lub różnorodności do Ładu Korporacyjnego…",
          text: "Zaliczanie bezpieczeństwa pracowników lub różnorodności do Ładu Korporacyjnego (Governance), ponieważ są to „zasady firmowe”, zamiast dostrzegania ich jako części filaru Społecznego (Social).",
          feedback: {
            body: "Chociaż polityki są „zasadami”, filar Społeczny (S) dotyczy w szczególności tego, jak firma traktuje ludzi – w tym pracowników oraz społeczności, w których działa. Klasyfikowanie DEI (różnorodności, równości i włączenia) lub bezpieczeństwa pod Ładem Korporacyjnym ignoruje skupienie na człowieku, które charakteryzuje filar Społeczny.",
          },
        },
        [choices.pillars.benefitConfusion]: {
          label: "Zaliczanie gospodarki odpadami lub działań związanych z gospodarką obiegu…",
          text: "Zaliczanie gospodarki odpadami lub działań związanych z gospodarką obiegu zamkniętego do filaru Społecznego, ponieważ „przynoszą one korzyść społeczności”.",
          feedback: {
            body: "Błędem jest umieszczanie gospodarki odpadami w kategorii „Społecznej” tylko dlatego, że pomaga ona społeczności. Filar Środowiskowy (E) jest ściśle zdefiniowany przez wpływ firmy na świat przyrody oraz efektywność zasobową. Dla klienta umieszczenie tego w niewłaściwej kategorii sugeruje brak technicznej wiedzy na temat ESG.",
          },
        },
      },
    },
    [challenges.csrToEsg]: {
      title: "Przejście od CSR do integracji ESG",
      shortTitle: "Przejście od CSR do integracji ESG",
      context:
        "Twój dyrektor generalny sugeruje, aby wieloletnia tradycja przekazywania 2% zysków na rzecz lokalnego szpitala dziecięcego (CSR) była centralnym punktem planu. Musisz wyjaśnić, dlaczego to już nie wystarcza dużemu partnerowi korporacyjnemu.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.csrToEsg.integrationEra]: {
          label:
            "Wyjaśnij zwrot ku „Erze Integracji” (Integration Era), w której klient postrzega…",
          text: "Wyjaśnij zwrot ku „Erze Integracji” (Integration Era), w której klient postrzega czynniki E, S i G jako ryzyka finansowe dla własnego łańcucha dostaw, a nie tylko jako wolontariat czy filantropię.",
          feedback: {
            body: "W dziesiątkę. Pomyślnie odnalazłeś się w „Erze Integracji”. Wyjaśniając, że ESG oznacza „bycie mądrym”, a nie tylko „bycie miłym”, dopasowujesz się do rzeczywistości, w której inwestor traktuje te czynniki jako ryzyka i szanse finansowe. Pokazałeś, że zrównoważony rozwój to proces biznesowy, a nie projekt poboczny.",
          },
        },
        [choices.csrToEsg.relabelCsr]: {
          label: "Traktowanie ESG po prostu jako nowej nazwy dla CSR i zakładanie, że darowizny…",
          text: "Traktowanie ESG po prostu jako nowej nazwy dla CSR i zakładanie, że darowizny charytatywne są tym samym, co zintegrowane zarządzanie ryzykiem.",
          feedback: {
            body: "Proste przemianowanie starego programu CSR nie zadziała, ponieważ CSR często miał charakter dobrowolny, filantropijny i był pierwszym elementem, z którego rezygnowano w przypadku spadku zysków. Dużym klientom trzeba pokazać, że wysiłki na rzecz zrównoważonego rozwoju są „niedogotsowalne” (niepodlegające negocjacjom) i wbudowane w strategię core.",
          },
        },
        [choices.csrToEsg.imageOnly]: {
          label:
            "Przekonanie, że CSR wystarcza, ponieważ buduje „miły” wizerunek, przy jednoczesnym…",
          text: "Przekonanie, że CSR wystarcza, ponieważ buduje „miły” wizerunek, przy jednoczesnym braku dostrzeżenia, że ESG jest obecnie biznesową koniecznością wymaganą do uzyskania dostępu do łańcucha dostaw.",
          feedback: {
            body: "Skupianie się wyłącznie na „miłym” wizerunku może prowadzić do „greenwashingu” – sytuacji, w której firma czyni dobre uczynki (takie jak działalność charytatywna), ignorując jednocześnie podstawowe szkody operacyjne (takie jak zanieczyszczenia). Nowoczesne ESG wymaga ustrukturyzowanych, istotnych z punktu widzenia finansowego ram, które trudniej zignorować niż tradycyjny CSR.",
          },
        },
      },
    },
    [challenges.sdgAlignment]: {
      title: "Powiązanie działań z Celami Globalnymi (SDG)",
      shortTitle: "Powiązanie działań z Celami Globalnymi (SDG)",
      context:
        "Aby sfinalizować plan, chcesz pokazać, w jaki sposób Twoje MŚP produkcyjne przyczynia się do „szerszej perspektywy”. Musisz powiązać swoje konkretne działanie polegające na redukcji marnotrawstwa energii z odpowiednim Celem Globalnym.",
      question: "Jakie działanie należy podjąć w tej sytuacji?",
      choices: {
        [choices.sdgAlignment.preciseMapping]: {
          label:
            "Odwzoruj konkretne działanie ESG w odniesieniu do odpowiadającego mu celu SDG, w…",
          text: "Odwzoruj konkretne działanie ESG w odniesieniu do odpowiadającego mu celu SDG, w szczególności łącząc efektywność energetyczną i zasobową z SDG 12: Odpowiedzialna konsumpcja i produkcja lub SDG 7: Czysta i dostępna energia.",
          feedback: {
            body: "Wykonane perfekcyjnie. Dopasowanie „Jak” Twojego ESG (ram) do „Co” celów SDG (celów globalnych) daje Twojemu MŚP uniwersalny język. W szczególności powiązanie efektywności zasobowej z SDG 12 lub SDG 7 świadczy o zaawansowanym zrozumieniu tego, w jaki sposób małe działania przyczyniają się do globalnego planu.",
          },
        },
        [choices.sdgAlignment.allClimateAction]: {
          label:
            "Twierdzenie, że wszystkie działania proekologiczne wspierają SDG 13 (Działania na…",
          text: "Twierdzenie, że wszystkie działania proekologiczne wspierają SDG 13 (Działania na rzecz klimatu) bez rozróżnienia między efektywnością energetyczną a redukcją śladu węglowego.",
          feedback: {
            body: "Choć wszystkie działania proekologiczne są dobre, twierdzenie, że wszystko jest „Działaniem na rzecz klimatu” (SDG 13), może wydawać się ogólnikowe. Precyzja ma znaczenie; na przykład pokazanie, jak ograniczasz bariery dla grup niedostatecznie reprezentowanych, bezpośrednio wspiera SDG 10 (Mniej nierówności), co zapewnia znacznie silniejszą narrację dla Twojego filaru „Społecznego”.",
          },
        },
        [choices.sdgAlignment.noStakeholderLink]: {
          label:
            "Brak komunikowania tego powiązania interesariuszom, co skutkuje utratą szansy na…",
          text: "Brak komunikowania tego powiązania interesariuszom, co skutkuje utratą szansy na wykorzystanie uniwersalnego języka budującego zaufanie u międzynarodowych klientów.",
          feedback: {
            body: "Brak komunikowania tych powiązań to utracona przewaga strategiczna. Dla MŚP stosowanie celów SDG pomaga wygrywać kontrakty, ponieważ udowadnia, że jesteś dostosowany do tych samych standardów globalnych, co Twoi duzi klienci korporacyjni.",
          },
        },
      },
    },
  },
  summary: {
    title: "Scenariusz ukończony",
    takeaways: [
      "Zdefiniować i rozróżnić trzy główne filary ESG (Środowiskowy, Społeczny, Ładu Korporacyjnego) w kontekście biznesowym.",
      "Zastosować zasady ESG w celu uzyskania przewagi strategicznej, w szczególności w zakresie dostępu do łańcuchów dostaw dużych korporacji.",
    ],
  },
});
