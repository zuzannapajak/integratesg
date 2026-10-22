import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";
import { scenario06Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario06Ids;

export const scenario06De = defineScenarioLocale<"scenario-06">({
  scenarioId: scenarioId,
  locale: "de",
  title: "Monitoring, Berichterstattung und Zukunftstrends von ESG",
  shortTitle: "Monitoring, Berichterstattung und Zukunftstrends…",
  subtitle: "Monitoring, Berichterstattung und Zukunftstrends von ESG",
  introduction: "In diesem Szenario treffen Sie Entscheidungen zur Auswahl von ESG-Kennzahlen, zur Datenqualität und zur Berichterstattung an unterschiedliche Interessengruppen.",
  objectives: ["konkrete ESG-Indikatoren und KPIs auszuwählen, um die Leistung in den zentralen Geschäftsaktivitäten zu überwachen.", "ESG-Daten zu kategorisieren, um klare, auf die Bedürfnisse verschiedener Stakeholder zugeschnittene Berichte zu erstellen."],
  boardAlt: "Drei zusammenhängende ESG-Herausforderungen mit Entscheidungsmöglichkeiten.",
  challenges: {
    [challenges.kpiSelection]: {
      title: "Zu viele KPIs, zu wenig Nutzen",
      shortTitle: "Zu viele KPIs, zu wenig Nutzen",
      context: "Ein kleines Unternehmen möchte beginnen, seine ESG-Leistung zu überwachen.\n Jede Abteilung schlägt eigene Indikatoren vor, und das Ergebnis ist eine Liste mit 40 verschiedenen KPIs.\n Das Unternehmen erkennt schnell, dass es unrealistisch und verwirrend ist, sie alle zu verfolgen.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.kpiSelection.coreKpis]: {
          label: "6–10 zentrale KPIs auswählen, die mit den Hauptaktivitäten des Unternehmens und…",
          text: "- 6–10 zentrale KPIs auswählen, die mit den Hauptaktivitäten des Unternehmens und den wichtigsten ESG-Risiken oder -Chancen (Umwelt, Soziales, Governance) verknüpft sind.\n\n- Für jeden KPI klar festlegen:\n\n- was er misst\n\n- die Berechnungsmethode\n\n- wie oft er gemessen wird\n\n- wer verantwortlich ist\n\n- woher die Daten stammen\n\n- den Zielwert oder Schwellenwert.\n\n- Jeden KPI mit einer geschäftlichen Entscheidung verknüpfen (z. B. Investitionen, Schulungen, Lieferantenauswahl, Wartung).\n\n- Mit einem Basismesszeitraum (3–6 Monate) beginnen und fortgeschrittenere KPIs erst ergänzen, wenn der Datenerhebungsprozess stabil ist.",
          feedback: {
            body: "Eine kleine Zahl aussagekräftiger KPIs führt zu konsistenten Berichten, kontinuierlichem Monitoring und schnelleren Entscheidungen.",
          },
        },
        [choices.kpiSelection.measureEverything]: {
          label: "„Lassen Sie uns sofort alles messen, um glaubwürdiger zu wirken.“",
          text: "„Lassen Sie uns sofort alles messen, um glaubwürdiger zu wirken.“\n\nDas führt oft zu unvollständigen oder inkonsistenten Daten, höheren Kosten und geringem Vertrauen innerhalb der Organisation.",
          feedback: {
            body: "Hohes Risiko von Fehlern und unkontrollierten Zahlen. Zeit wird verschwendet, und dem Unternehmen kann Greenwashing vorgeworfen werden, wenn die Daten nicht überprüfbar sind.",
          },
        },
        [choices.kpiSelection.copyCorporate]: {
          label: "„Lassen Sie uns die KPIs von Großkonzernen übernehmen.“",
          text: "„Lassen Sie uns die KPIs von Großkonzernen übernehmen.“\n\nGroße Unternehmen verfügen über mehr Ressourcen und komplexe Systeme.\nIhre Indikatoren sind für ein KMU möglicherweise zu schwierig zu erheben oder zu verwalten, wodurch die Berichterstattung unwirksam wird.",
          feedback: {
            body: "Schafft unnötige Bürokratie. Die Abteilungen hören nach einigen Monaten auf, die Indikatoren zu nutzen.",
          },
        },
      },
    },
    [challenges.dataQuality]: {
      title: "Daten, die nicht zusammenpassen",
      shortTitle: "Daten, die nicht zusammenpassen",
      context: "Energie- und Abfalldaten stammen von verschiedenen Anbietern und liegen in unterschiedlichen Formaten vor.\nPersonalabteilung und Einkauf nutzen getrennte Tabellen, und es gibt keine einheitliche, verlässliche Informationsquelle.\n\nInfolgedessen fällt es dem Unternehmen schwer, die Daten zu vergleichen oder zusammenzuführen.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.dataQuality.dataModelAndGovernance]: {
          label: "Ein einfaches ESG-Datenmodell festlegen, das Folgendes umfasst:",
          text: "- Ein einfaches ESG-Datenmodell festlegen, das Folgendes umfasst:\n\n- Datenkategorien (Umwelt, Soziales, Governance)\n\n- Maßeinheiten\n\n- Detaillierungsgrad (Standort, Abteilung, Lieferant:in)\n\n- Validierungsregeln.\n\n- Einen Prozess zur Datenqualität einführen:\n\n- Prüfungen auf Vollständigkeit und Konsistenz\n\n- Erkennung ungewöhnlicher Werte (Ausreißer)\n\n- Versionskontrolle und Nachvollziehbarkeit.\n\n- Festlegen:\n\n- einen Zeitplan für die Datenerhebung\n\n- Datenverantwortliche für jeden Bereich\n\n- ein gemeinsames Datenglossar, das jeden Indikator erklärt.",
          feedback: {
            body: "Vergleichbare und verlässliche Daten erhöhen die Glaubwürdigkeit der Berichterstattung und verringern Korrekturen in letzter Minute.",
          },
        },
        [choices.dataQuality.singleExcel]: {
          label: "„Lassen Sie uns einfach alles in eine Excel-Datei packen.“",
          text: "„Lassen Sie uns einfach alles in eine Excel-Datei packen.“\n\nOhne klare Definitionen und Kontrollen bleiben Inkonsistenzen bestehen und nehmen oft sogar zu.\nDieselbe Kennzahl kann an verschiedenen Stellen unterschiedliche Werte aufweisen.",
          feedback: {
            body: "Wiederkehrende Inkonsistenzen. Berichte werden infrage gestellt, und viel Zeit wird mit dem Abgleichen von Zahlen verschwendet.",
          },
        },
        [choices.dataQuality.waitForSoftware]: {
          label: "„Lassen Sie uns warten, bis wir die perfekte ESG-Software gekauft haben.“",
          text: "„Lassen Sie uns warten, bis wir die perfekte ESG-Software gekauft haben.“\n\nWarten verzögert das Monitoring und hindert das Unternehmen daran, eine nützliche Ausgangsbasis und eine Datenkultur aufzubauen.",
          feedback: {
            body: "Verzögert das ESG-Monitoring. Das Unternehmen kann weder Fortschritte noch Lernprozesse nachweisen.",
          },
        },
      },
    },
    [challenges.stakeholderReporting]: {
      title: "Ein Bericht für alle?",
      shortTitle: "Ein Bericht für alle?",
      context: "Verschiedene Stakeholder wünschen sich unterschiedliche Arten von ESG-Informationen:\n\n- Die Geschäftsleitung möchte einen kurzen Bericht als Entscheidungsgrundlage.\n\n- Banken und Partner:innen verlangen detaillierte Informationen und Daten.\n\n- Die lokale Gemeinschaft möchte klare und einfache Erklärungen.\n\n- Das Marketing bevorzugt starke positive Botschaften.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.stakeholderReporting.tailoredReporting]: {
          label: "Drei Kommunikationsebenen schaffen:",
          text: "Drei Kommunikationsebenen schaffen:\n\n1. Internes Dashboard (für Entscheidungen)\n\n- etwa 10 KPIs\n\n- Trends im Zeitverlauf\n\n- Warnhinweise und Korrekturmaßnahmen\n\n2. Technischer Bericht für Stakeholder\n\n- Methodik und Datenumfang\n\n- Definitionen der Indikatoren\n\n- Datenquellen und Einschränkungen\n\n- unterstützende Nachweise\n\n3. Öffentliche Zusammenfassung\n\n- klare Botschaften zu den Ergebnissen\n\n- Transparenz darüber, was noch unbekannt ist\n\n- Verbesserungspläne.\n\nImmer angeben:\n\n- KPI-Definitionen\n\n- Berichtsgrenzen\n\n- Häufigkeit der Daten\n\n- verantwortliche Teams.\n\nDiese Transparenz trägt dazu bei, das Risiko von Greenwashing-Vorwürfen zu verringern.",
          feedback: {
            body: "Zielgruppengerechte Kommunikation erhöht das Vertrauen und den Nutzen für interne und externe Stakeholder.",
          },
        },
        [choices.stakeholderReporting.singleReport]: {
          label: "„Lassen Sie uns einen Bericht für alle erstellen.“",
          text: "„Lassen Sie uns einen Bericht für alle erstellen.“\n\nDer Bericht wird entweder zu technisch für allgemeine Leser:innen oder zu oberflächlich für Fachleute.",
          feedback: {
            body: "Die Stakeholder bleiben unzufrieden und verlangen zusätzliche Erklärungen.",
          },
        },
        [choices.stakeholderReporting.positiveOnly]: {
          label: "„Lassen Sie uns nur positive Ergebnisse kommunizieren.“",
          text: "„Lassen Sie uns nur positive Ergebnisse kommunizieren.“\n\nDas Verschweigen von Problemen kann der Glaubwürdigkeit schaden, wenn diese später sichtbar werden.",
          feedback: {
            body: "Hohes Risiko von Reputationsschäden und Greenwashing-Vorwürfen.",
          },
        },
      },
    },
  },
  summary: {
    title: "Szenario abgeschlossen",
    takeaways: ["konkrete ESG-Indikatoren und KPIs auszuwählen, um die Leistung in den zentralen Geschäftsaktivitäten zu überwachen.", "ESG-Daten zu kategorisieren, um klare, auf die Bedürfnisse verschiedener Stakeholder zugeschnittene Berichte zu erstellen."],
  },
});
