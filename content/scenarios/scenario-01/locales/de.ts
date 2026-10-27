import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";
import { scenario01Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario01Ids;

export const scenario01De = defineScenarioLocale<"scenario-01">({
  scenarioId: scenarioId,
  locale: "de",
  title: "Grundlagen von ESG und nachhaltiger Entwicklung",
  shortTitle: "Grundlagen von ESG und nachhaltiger Entwicklung",
  subtitle: "Grundlagen von ESG und nachhaltiger Entwicklung",
  introduction:
    "Sie leiten „GreenTech Solutions“, ein KMU, das hocheffiziente Komponenten herstellt. Ein großer internationaler Konzern hat Kontakt aufgenommen und interessiert sich für einen mehrjährigen Vertrag. Vor der Unterzeichnung verlangt er jedoch, dass Sie einen „ESG-Integrationsfahrplan“ vorlegen, der über Ihre derzeitigen Spenden hinausgeht.",
  objectives: [
    "Die drei Kernsäulen von ESG (Umwelt, Soziales, Governance) im unternehmerischen Kontext zu definieren und voneinander abzugrenzen.",
    "ESG-Grundsätze anzuwenden, um einen strategischen Vorteil zu sichern, insbesondere für den Zugang zu den Lieferketten von Großunternehmen.",
  ],
  boardAlt: "Drei zusammenhängende ESG-Herausforderungen mit Entscheidungsmöglichkeiten.",
  challenges: {
    [challenges.pillars]: {
      title: "Die Säulen für Kund:innen definieren",
      shortTitle: "Die Säulen für Kund:innen definieren",
      context:
        "Die zuständige Person im Einkauf des Kunden bittet Sie zu erläutern, wie Ihr Unternehmen „nichtfinanzielle Risiken“ konkret in den Säulen E, S und G steuert. Sie müssen Ihre derzeitigen Aktivitäten korrekt zuordnen, um zu zeigen, dass Sie den Rahmen verstehen.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.pillars.accurateCategorisation]: {
          label: "Die Tätigkeiten korrekt zuordnen, indem Sie Ihre Energieeffizienz (E), Ihre…",
          text: "Die Tätigkeiten korrekt zuordnen, indem Sie Ihre Energieeffizienz (E), Ihre Richtlinien zu fairer Bezahlung und Diversität (S) sowie Ihre transparente Entscheidungsfindung im Leitungsgremium und Ihre Maßnahmen zur Korruptionsbekämpfung (G) hervorheben.",
          feedback: {
            body: "Ausgezeichnet. Indem Sie Energieeffizienz korrekt der Säule Umwelt, faire Bezahlung der Säule Soziales und Korruptionsbekämpfung der Säule Governance zuordnen, zeigen Sie, dass ESG eine „Bewertungskarte“ für das Risikomanagement ist. Diese Klarheit beweist dem Kunden, dass Sie nicht nur Schlagworte verwenden, sondern nichtfinanzielle Faktoren steuern, um langfristigen Wert zu schaffen.",
          },
        },
        [choices.pillars.rulesConfusion]: {
          label: "Arbeitssicherheit oder Diversität der Governance zuordnen, weil es sich um…",
          text: "Arbeitssicherheit oder Diversität der Governance zuordnen, weil es sich um „Unternehmensregeln“ handelt, statt sie als Teil der Säule Soziales zu sehen.",
          feedback: {
            body: "Richtlinien sind zwar „Regeln“, doch bei Soziales (S) geht es gezielt darum, wie ein Unternehmen mit Menschen umgeht – einschließlich der Beschäftigten und der Gemeinschaften, in denen es tätig ist. Wer DEI oder Sicherheit der Governance zuordnet, übersieht den Fokus der Säule Soziales auf den Menschen.",
          },
        },
        [choices.pillars.benefitConfusion]: {
          label: "Maßnahmen zum Abfallmanagement oder zur Kreislaufwirtschaft der Säule Soziales…",
          text: "Maßnahmen zum Abfallmanagement oder zur Kreislaufwirtschaft der Säule Soziales zuordnen, weil sie „der Gemeinschaft nützen“.",
          feedback: {
            body: "Es ist ein Fehler, Abfallmanagement der Säule „Soziales“ zuzuordnen, nur weil es der Gemeinschaft hilft. Die Säule Umwelt (E) wird eindeutig durch die Auswirkungen des Unternehmens auf die natürliche Umwelt und die Ressourceneffizienz bestimmt. Wenn ein Kunde dies in der falschen Kategorie sieht, deutet das auf mangelndes technisches ESG-Verständnis hin.",
          },
        },
      },
    },
    [challenges.csrToEsg]: {
      title: "Von CSR zur ESG-Integration",
      shortTitle: "Von CSR zur ESG-Integration",
      context:
        "Ihre Geschäftsführung schlägt vor, die langjährige Tradition, 2 % des Gewinns an ein örtliches Kinderkrankenhaus zu spenden (CSR), in den Mittelpunkt des Fahrplans zu stellen. Sie müssen erklären, warum dies für einen großen Unternehmenspartner nicht mehr ausreicht.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.csrToEsg.integrationEra]: {
          label: "Den Wandel zur „Ära der Integration“ erklären, in der der Kunde E-, S- und…",
          text: "Den Wandel zur „Ära der Integration“ erklären, in der der Kunde E-, S- und G-Faktoren als finanzielle Risiken für seine eigene Lieferkette betrachtet und nicht nur als freiwillige Philanthropie.",
          feedback: {
            body: "Genau richtig. Sie haben die „Ära der Integration“ erfolgreich erfasst. Indem Sie erklären, dass es bei ESG um „klug sein“ statt nur um „nett sein“ geht, entsprechen Sie der Realität, dass Investor:innen und Großunternehmen diese Faktoren heute als finanzielle Risiken und Chancen behandeln. Sie haben gezeigt, dass Nachhaltigkeit ein Geschäftsprozess ist und kein Nebenprojekt.",
          },
        },
        [choices.csrToEsg.relabelCsr]: {
          label: "ESG als bloß neuen Namen für CSR behandeln und annehmen, dass Spenden dasselbe…",
          text: "ESG als bloß neuen Namen für CSR behandeln und annehmen, dass Spenden dasselbe sind wie integriertes Risikomanagement.",
          feedback: {
            body: "Ihr altes CSR-Programm einfach umzubenennen, funktioniert nicht, weil CSR oft freiwillig und philanthropisch war und als Erstes gekürzt wurde, wenn die Gewinne sanken. Große Kund:innen müssen sehen, dass Ihre Nachhaltigkeitsbemühungen „unverhandelbar“ und in Ihrer Kernstrategie verankert sind.",
          },
        },
        [choices.csrToEsg.imageOnly]: {
          label: "Glauben, dass CSR ausreicht, weil sie ein „schönes“ Image schafft, und dabei…",
          text: "Glauben, dass CSR ausreicht, weil sie ein „schönes“ Image schafft, und dabei übersehen, dass ESG heute eine geschäftliche Notwendigkeit für den Zugang zu Lieferketten ist.",
          feedback: {
            body: "Wer sich nur auf ein „schönes“ Image konzentriert, riskiert „Greenwashing“ – also dass ein Unternehmen Gutes tut (etwa durch Spenden), während es zentrale betriebliche Schäden (etwa Umweltverschmutzung) ignoriert. Modernes ESG erfordert einen strukturierten, finanziell relevanten Rahmen, der sich schwerer ignorieren lässt als traditionelle CSR.",
          },
        },
      },
    },
    [challenges.sdgAlignment]: {
      title: "Maßnahmen mit globalen Zielen (SDGs) verknüpfen",
      shortTitle: "Maßnahmen mit globalen Zielen (SDGs) verknüpfen",
      context:
        "Zum Abschluss des Fahrplans möchten Sie zeigen, wie Ihr produzierendes KMU zum „großen Ganzen“ beiträgt. Sie müssen Ihre konkrete Maßnahme der Reduzierung von Energieverschwendung mit dem richtigen globalen Ziel verknüpfen.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.sdgAlignment.preciseMapping]: {
          label:
            "Die konkrete ESG-Maßnahme dem entsprechenden SDG zuordnen, insbesondere Energie-…",
          text: "Die konkrete ESG-Maßnahme dem entsprechenden SDG zuordnen, insbesondere Energie- und Ressourceneffizienz mit SDG 12: Nachhaltige/r Konsum und Produktion oder SDG 7: Bezahlbare und saubere Energie verknüpfen.",
          feedback: {
            body: "Perfekt umgesetzt. Wenn Sie Ihren ESG-Rahmen (das „Wie“) den SDGs (dem „Was“) zuordnen, erhält Ihr KMU eine universelle Sprache. Insbesondere die Verknüpfung von Ressourceneffizienz mit SDG 12 oder SDG 7 zeigt ein fundiertes Verständnis dafür, wie kleine Maßnahmen zum globalen Bauplan beitragen.",
          },
        },
        [choices.sdgAlignment.allClimateAction]: {
          label: "Behaupten, dass alle grünen Maßnahmen SDG 13 (Maßnahmen zum Klimaschutz)…",
          text: "Behaupten, dass alle grünen Maßnahmen SDG 13 (Maßnahmen zum Klimaschutz) unterstützen, ohne zwischen Energieeffizienz und der Reduzierung des CO₂-Fußabdrucks zu unterscheiden.",
          feedback: {
            body: "Alle grünen Maßnahmen sind zwar gut, doch wenn alles als „Klimaschutz“ (SDG 13) bezeichnet wird, kann das vage wirken. Präzision ist wichtig; wenn Sie zum Beispiel zeigen, wie Sie Barrieren für unterrepräsentierte Gruppen abbauen, unterstützt das direkt SDG 10 (Weniger Ungleichheiten), was eine deutlich stärkere Erzählung für Ihre Säule „Soziales“ liefert.",
          },
        },
        [choices.sdgAlignment.noStakeholderLink]: {
          label:
            "Es versäumen, die Verknüpfung gegenüber Stakeholdern zu kommunizieren, und damit…",
          text: "Es versäumen, die Verknüpfung gegenüber Stakeholdern zu kommunizieren, und damit die Chance verpassen, eine universelle Sprache zu nutzen, die Vertrauen bei internationalen Kund:innen schafft.",
          feedback: {
            body: "Diese Verknüpfungen nicht zu kommunizieren, bedeutet einen verpassten strategischen Vorteil. Für ein KMU hilft die Nutzung der SDGs, Aufträge zu gewinnen, weil sie belegt, dass Sie sich an denselben globalen Standards orientieren wie Ihre großen Unternehmenskund:innen.",
          },
        },
      },
    },
  },
  summary: {
    title: "Szenario abgeschlossen",
    takeaways: [
      "Die drei Kernsäulen von ESG (Umwelt, Soziales, Governance) im unternehmerischen Kontext zu definieren und voneinander abzugrenzen.",
      "ESG-Grundsätze anzuwenden, um einen strategischen Vorteil zu sichern, insbesondere für den Zugang zu den Lieferketten von Großunternehmen.",
    ],
  },
});
