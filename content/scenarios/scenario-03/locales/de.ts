import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";
import { scenario03Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario03Ids;

export const scenario03De = defineScenarioLocale<"scenario-03">({
  scenarioId: scenarioId,
  locale: "de",
  title: "Orientierung in ESG-Rahmenwerken und EU-Berichtsstandards",
  shortTitle: "Orientierung in ESG-Rahmenwerken und…",
  subtitle: "Orientierung in ESG-Rahmenwerken und EU-Berichtsstandards",
  introduction:
    "Sie sind für Nachhaltigkeit und Berichterstattung bei SONNENTOR verantwortlich, einem österreichischen Bio-Lebensmittelhersteller mit Sitz in Sprögnitz (Niederösterreich), der Tees, Gewürze und Bio-Produkte in mehr als 40 Länder exportiert. SONNENTOR berichtet bereits über die Gemeinwohl-Bilanz (Gemeinwohl-Ökonomie, GWÖ), einen wertebasierten Rahmen, in dem das Unternehmen gut abschneidet (755 von 1.000 Punkten) und der alle zwei Jahre extern geprüft wird.\n\nNun sind gleichzeitig zwei dringende Anfragen eingegangen. Ein wichtiger EU-Abnehmer, der selbst in den Anwendungsbereich der Richtlinie zur Nachhaltigkeitsberichterstattung von Unternehmen (CSRD) fällt, bittet SONNENTOR, für seine Lieferantenbewertung ESG-Datenpunkte im ESRS-Format bereitzustellen. Parallel dazu fordert die Bank des Unternehmens eine kompakte, vergleichbare ESG-Übersicht als Grundlage für eine Finanzierungsentscheidung an. Beide Stakeholder erwarten Informationen, die vergleichbar, belegbar und von Jahr zu Jahr konsistent sind.\n\nDas Problem: Die GWÖ erzählt eine reichhaltige Geschichte über Werte und Stakeholder-Beziehungen, ist aber nicht wie die ESRS-Datenpunkte strukturiert, die Abnehmer und Bank verlangen. Die ESG-Informationen von SONNENTOR sind derzeit über Einkauf, Betrieb, Personal und Finanzen verteilt, meist in Tabellen, und das Unternehmen hat nur ein begrenztes Budget für neue Software oder Beratung. Die Geschäftsleitung ist stolz auf den GWÖ-Ansatz und befürchtet, dass die Beantwortung der Anfragen einen schweren neuen Berichtsaufwand mit sich bringt. Sie müssen entscheiden, welchen Rahmenwerk-Ansatz SONNENTOR nutzen soll, um die Erwartungen in der EU zu erfüllen, und einen praktikablen Datenerhebungsprozess für eine kleine Auswahl vorrangiger Indikatoren entwerfen – damit das Unternehmen schnell reagieren, den Aufwand verhältnismäßig halten und Greenwashing-Risiken vermeiden kann.",
  objectives: [
    "geeignete ESG-Rahmenwerke auszuwählen, die die interne Strategie mit den Erwartungen der Stakeholder in der EU in Einklang bringen.",
    "einen Ansatz zur Datenerhebung für vorrangige ESG-Indikatoren zu entwickeln, um Qualität zu sichern und Greenwashing zu verringern.",
  ],
  boardAlt: "Drei zusammenhängende ESG-Herausforderungen mit Entscheidungsmöglichkeiten.",
  challenges: {
    [challenges.frameworkSelection]: {
      title: "Den richtigen Rahmenwerk-Ansatz für Stakeholder in der EU wählen",
      shortTitle: "Den richtigen Rahmenwerk-Ansatz für Stakeholder…",
      context:
        "Der Fragebogen des Abnehmers ist in ESRS-Terminologie verfasst, und die Bank möchte standardisierte Kennzahlen, die sie mit denen anderer Kreditnehmer:innen vergleichen kann. Keiner der beiden Stakeholder kennt die GWÖ-Matrix. Die Geschäftsleitung schätzt die GWÖ-Identität und möchte nur ungern ein zweites vollständiges Berichtssystem einführen. Ihre erste Entscheidung betrifft die Frage, wie SONNENTOR seine Rahmenwerke als Reaktion darauf positionieren soll.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.frameworkSelection.layeredApproach]: {
          label:
            "Die GWÖ als zentralen internen Rahmen für Kultur, Governance und Stakeholder-Logik…",
          text: "Die GWÖ als zentralen internen Rahmen für Kultur, Governance und Stakeholder-Logik beibehalten und eine schlanke „Zuordnungsebene“ für die Erwartungen in der EU ergänzen. Die bei SONNENTOR bereits vorhandenen ESG-Inhalte der kleinen Auswahl an ESRS-Datenpunkten zuordnen, die der Abnehmer tatsächlich benötigt, das GHG Protocol als technische Methode für Emissionen nutzen, um Vergleichbarkeit sicherzustellen, und Elemente der EU-Taxonomie nur dann ergänzen, wenn Bank oder Abnehmer sie ausdrücklich verlangen.",
          feedback: {
            body: "Richtig. Ein mehrstufiger Ansatz spricht die Sprache der Stakeholder in der EU und wahrt zugleich die interne Kohärenz von SONNENTOR. Er nutzt vorhandene Informationen, statt ein Parallelsystem aufzubauen, reduziert wiederholte Fragebögen, verbessert die Vergleichbarkeit und ist für ein KMU mit begrenzten Ressourcen verhältnismäßig.",
          },
        },
        [choices.frameworkSelection.gwoOnly]: {
          label: "Antworten, dass die GWÖ ausreicht, und die Bereitstellung von ESRS-Datenpunkten…",
          text: "Antworten, dass die GWÖ ausreicht, und die Bereitstellung von ESRS-Datenpunkten ablehnen – mit der Begründung, dass SONNENTOR bereits transparent berichtet und selbst nicht direkt in den Anwendungsbereich der CSRD fällt.",
          feedback: {
            body: "Abnehmer und Banken können GWÖ-Kategorien in der Regel nicht interpretieren und werden trotzdem weiter nach ESRS-Datenpunkten fragen. Die Weigerung, eine Zuordnung vorzunehmen, führt zu doppeltem Hin und Her, langsameren Antworten und einem realen Risiko, den Auftrag oder die Finanzierung zu verlieren.",
          },
        },
        [choices.frameworkSelection.allFrameworks]: {
          label:
            "Alle wichtigen Rahmenwerke gleichzeitig übernehmen – ESRS, GRI, SASB und mehrere…",
          text: "Alle wichtigen Rahmenwerke gleichzeitig übernehmen – ESRS, GRI, SASB und mehrere zusätzliche Ratings –, damit SONNENTOR umfassend aufgestellt wirkt und für jede mögliche Anfrage gerüstet ist.\n\nFeedback",
          feedback: {
            body: "Alle Rahmenwerke gleichzeitig zu übernehmen, überlastet ein kleines Team. Widersprüchliche Definitionen und zu viele Datenpunkte führen dazu, dass die Datenqualität sinkt und die Beschäftigten sich zurückziehen – was das Greenwashing-Risiko eher erhöht als senkt.",
          },
        },
      },
    },
    [challenges.priorityIndicators]: {
      title: "Vorrangige ESG-Indikatoren auswählen und begründen",
      shortTitle: "Vorrangige ESG-Indikatoren auswählen und begründen",
      context:
        "Die Vorlage des Abnehmers listet Dutzende möglicher Datenpunkte auf. SONNENTOR kann nicht alle davon in der verfügbaren Zeit glaubwürdig liefern, und einige (zum Beispiel die Emissionen der gesamten Wertschöpfungskette) werden noch nicht gut gemessen. Sie müssen eine kleine, vertretbare Auswahl vorrangiger Indikatoren treffen und diese Auswahl sowohl gegenüber dem Abnehmer als auch gegenüber der Bank begründen können.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.priorityIndicators.materialitySet]: {
          label: "Eine schlanke Prüfung der Wesentlichkeit und der Stakeholder-Erwartungen bei…",
          text: "Eine schlanke Prüfung der Wesentlichkeit und der Stakeholder-Erwartungen bei Abnehmer, Bank, Konsument:innen, Beschäftigten und wichtigen Lieferant:innen durchführen und eine kleine Auswahl vorrangiger Indikatoren treffen, die wesentlich und mit der Strategie verknüpft sind (z. B. „Mission Null-Emission“, Verpackung, Lieferkette), vergleichbar und klar definierbar sind und sich belegen lassen. Eine mögliche Auswahl wäre: Scope-1- und Scope-2-Emissionen sowie Energieverbrauch mit einem dokumentierten Plan zur Verbesserung der Scope-3-Daten; Verpackungsmix und eine Kennzahl zur Plastikreduktion mit Methodenhinweisen; Anteil der Lieferant:innen mit Bio- bzw. Nachhaltigkeitsnachweis; sowie Personalkennzahlen wie Arbeitsunfälle, Weiterbildungsstunden und Fluktuation.",
          feedback: {
            body: "Richtig. Eine kleine, auf Wesentlichkeit gestützte KPI-Auswahl mit dokumentierter Begründung ist vertretbar, erfüllt die Erwartungen der Stakeholder in der EU, hält den Aufwand überschaubar und unterstützt eine höhere Datenqualität.",
          },
        },
        [choices.priorityIndicators.positiveOnly]: {
          label:
            "Nur die Indikatoren berichten, die SONNENTOR im besten Licht zeigen – zum Beispiel…",
          text: "Nur die Indikatoren berichten, die SONNENTOR im besten Licht zeigen – zum Beispiel die GWÖ-Kategorien, die bereits 100 % erreichen, und die Schlagzeile von rund 400 Tonnen eingespartem Plastik – und schwächere Bereiche wie Scope 3 weglassen.",
          feedback: {
            body: "Eine Auswahl, bei der das Marketing im Vordergrund steht, wird von informierten Stakeholdern schnell durchschaut, da sie die Lücken bemerken (etwa fehlende Emissionen der Wertschöpfungskette oder Lieferantenrisiken). Das Bild wirkt selektiv und weckt Greenwashing-Verdacht.",
          },
        },
        [choices.priorityIndicators.copyCorporate]: {
          label: "Den vollständigen KPI-Katalog eines Großkonzerns übernehmen, damit SONNENTOR…",
          text: "Den vollständigen KPI-Katalog eines Großkonzerns übernehmen, damit SONNENTOR gründlich wirkt und direkt mit viel größeren Unternehmen vergleichbar ist.\n\nFeedback",
          feedback: {
            body: "Der KPI-Katalog eines Großunternehmens passt nicht zu den Systemen eines KMU. Die Datenerhebung wird unrealistisch, die Zahlen sind von Jahr zu Jahr inkonsistent, und die Beschäftigten werden frustriert – was genau die Glaubwürdigkeit untergräbt, die mit der Übung aufgebaut werden soll.",
          },
        },
      },
    },
    [challenges.dataGovernance]: {
      title:
        "Die Datenerhebung operativ umsetzen, um Qualität zu sichern und Greenwashing zu verringern",
      shortTitle: "Die Datenerhebung operativ umsetzen, um Qualität…",
      context:
        "Sie haben nun eine Auswahl vorrangiger Indikatoren. Die verbleibende Aufgabe besteht darin, die Zahlen glaubwürdig und reproduzierbar zu machen – dieselbe Zahl sollte vertretbar sein, wenn ein Abnehmer, eine Bank oder eine Prüfstelle fragt, wie sie zustande gekommen ist – und das ohne großes Softwarebudget und ohne hektisches Zusammentragen einmal im Jahr.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.dataGovernance.governedWorkflow]: {
          label: "Ein einfaches ESG-Daten-Governance-System aufbauen, das wiederholbare, prüfbare…",
          text: "Ein einfaches ESG-Daten-Governance-System aufbauen, das wiederholbare, prüfbare Ergebnisse liefert: ein KPI-Glossar für jeden Indikator (Definition, Umfang/Berichtsgrenze, Einheit, Berechnungsmethode, Häufigkeit und was als Nachweis gilt); eine datenverantwortliche Person pro KPI in Betrieb/Logistik, Einkauf, Personal und Finanzen/Controlling; ein monatlicher oder vierteljährlicher Erhebungsrhythmus statt hektischer Jahresberichterstattung; minimale Qualitätskontrollen (dokumentierte Quellen wie Rechnungen, Zählerdaten und Lieferantenzertifikate, Plausibilitäts- und Ausreißerprüfungen sowie ein Freigabeschritt vor der Weitergabe nach außen); und Datenqualitätsstufen, die jeden Datenpunkt als geschätzt, von Lieferant:innen bereitgestellt oder geprüft kennzeichnen, mit einem Plan zur schrittweisen Verbesserung – insbesondere für Scope 3.",
          feedback: {
            body: "Richtig. Ein KPI-Glossar mit klaren Verantwortlichen, Nachweisen, Kontrollen und Qualitätsstufen schafft Nachvollziehbarkeit, Vergleichbarkeit und kontinuierliche Verbesserung. Stakeholder können den Zahlen vertrauen, und das Greenwashing-Risiko sinkt, weil jede Zahl reproduzierbar ist.",
          },
        },
        [choices.dataGovernance.annualExcel]: {
          label:
            "Es einfach halten und die Zahlen einmal im Jahr, wann immer eine Anfrage eingeht,…",
          text: "Es einfach halten und die Zahlen einmal im Jahr, wann immer eine Anfrage eingeht, in einer Tabelle zusammentragen, ohne Nachweiskette, da SONNENTOR ein kleines Unternehmen ist und die Zeit der Beschäftigten knapp ist.",
          feedback: {
            body: "Ein jährlicher, rein Excel-basierter Ansatz ohne Nachweiskette liefert wenig glaubwürdige Zahlen, die sich nicht reproduzieren lassen. Fehler bleiben bestehen, die Ergebnisse sind zwischen den Jahren inkonsistent, und das Unternehmen ist angreifbar, wenn eine Aussage infrage gestellt wird.",
          },
        },
        [choices.dataGovernance.outsourceEverything]: {
          label: "Die gesamte Aufgabe an eine externe Beratung auslagern und ESG-Daten als deren…",
          text: "Die gesamte Aufgabe an eine externe Beratung auslagern und ESG-Daten als deren Verantwortung betrachten, damit die eigenen Beschäftigten nicht damit belastet werden.\n\nFeedback",
          feedback: {
            body: "Eine vollständige Auslagerung ohne interne Governance schafft Abhängigkeit und verlangsamt die Reaktion gegenüber Abnehmern und Banken. Auch eine Beratung braucht interne Daten, und das Unternehmen verliert das Lernen und die langfristige Kompetenz, die mit dem Projekt aufgebaut werden sollen.",
          },
        },
      },
    },
  },
  summary: {
    title: "Szenario abgeschlossen",
    takeaways: [
      "geeignete ESG-Rahmenwerke auszuwählen, die die interne Strategie mit den Erwartungen der Stakeholder in der EU in Einklang bringen.",
      "einen Ansatz zur Datenerhebung für vorrangige ESG-Indikatoren zu entwickeln, um Qualität zu sichern und Greenwashing zu verringern.",
    ],
  },
});
