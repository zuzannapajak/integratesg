import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";
import { scenario04Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario04Ids;

export const scenario04De = defineScenarioLocale<"scenario-04">({
  scenarioId: scenarioId,
  locale: "de",
  title: "ESG in die Geschäftsabläufe integrieren",
  shortTitle: "ESG in die Geschäftsabläufe integrieren",
  subtitle: "ESG in die Geschäftsabläufe integrieren",
  introduction: "Sie sind für Betrieb und Compliance bei EcoPart Manufacturing verantwortlich, einem KMU mit 120 Beschäftigten, das Komponenten an zwei große EU-Kund:innen liefert. Beide Kund:innen beginnen, von ihren Lieferant:innen ESG-bezogene Informationen anzufordern, darunter Daten zu Energieverbrauch, Abfall, Recyclinganteil, grundlegenden Arbeitspraktiken, Lieferantenstandards und Nachweisen zur Kreislauffähigkeit. Die ESG-Daten des Unternehmens sind derzeit über Finanzen, Personal, Umwelt/Gesundheit/Sicherheit, Produktion und Einkauf verstreut. Die meisten Informationen liegen in Tabellen vor, und das Unternehmen hat nur ein begrenztes Budget für neue Technologien oder Beratungsleistungen. Die Geschäftsleitung wünscht sich einen praktischen Fahrplan, der die Erwartungen der Kund:innen erfüllt und zugleich die Abläufe verbessert. Sie müssen entscheiden, wie ESG so in die täglichen Geschäftsprozesse integriert werden kann, dass es glaubwürdig, verhältnismäßig und für das Unternehmen nützlich ist – und nicht bloß eine zusätzliche Berichtslast.",
  objectives: ["Lieferketten und betriebliche Abläufe anhand von Kriterien der Kreislaufwirtschaft neu zu gestalten, um Abfall zu minimieren.", "ethische soziale Praktiken in alltägliche Dienstleistungen einzuführen, um die betriebliche Governance mit den Werten in Einklang zu bringen."],
  boardAlt: "Drei zusammenhängende ESG-Herausforderungen mit Entscheidungsmöglichkeiten.",
  challenges: {
    [challenges.dataSystem]: {
      title: "Ein praktikables ESG-Datensystem aufbauen",
      shortTitle: "Ein praktikables ESG-Datensystem aufbauen",
      context: "Ihre erste Aufgabe besteht darin, die ESG-Informationen so zu organisieren, dass das Unternehmen auf Anfragen von Kund:innen reagieren und betriebliche Verbesserungen erkennen kann. Die Geschäftsführung möchte, dass das Unternehmen „bereit für die ESG-Berichterstattung“ ist, doch die IT-Kapazitäten sind begrenzt, und die Abteilungsleitungen befürchten zusätzlichen Verwaltungsaufwand.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.dataSystem.simpleRegister]: {
          label: "Ein einfaches ESG-Datenregister erstellen, das die relevantesten betrieblichen…",
          text: "Ein einfaches ESG-Datenregister erstellen, das die relevantesten betrieblichen Indikatoren benennt, in jeder Abteilung Datenverantwortliche festlegt und einen monatlichen Erhebungsrhythmus etabliert. Mit einer begrenzten Auswahl aussagekräftiger Indikatoren beginnen, etwa Energieverbrauch pro Einheit, Ausschussquote, Recyclinganteil, Arbeitsunfälle und Mitarbeiterfluktuation. Zunächst vorhandene Tools nutzen, aber klare Regeln zur Datenqualität, Zuständigkeiten und Überprüfungsbesprechungen festlegen.",
          feedback: {
            body: "Richtig. Dieser Ansatz ist für ein KMU verhältnismäßig, weil er Struktur schafft, ohne den Prozess zu verkomplizieren. Indem das Unternehmen mit wesentlichen Indikatoren beginnt, Verantwortlichkeiten festlegt und die Datenqualität schrittweise verbessert, kann es Anfragen von Kund:innen verlässlicher beantworten und dieselben Informationen zur Verbesserung der Abläufe nutzen.",
          },
        },
        [choices.dataSystem.buyPlatform]: {
          label: "Sofort eine umfassende ESG-Softwareplattform kaufen, damit die gesamte…",
          text: "Sofort eine umfassende ESG-Softwareplattform kaufen, damit die gesamte Berichterstattung, Dashboards und Anfragen von Kund:innen von Anfang an in einem zentralen System verwaltet werden können. Das soll manuelle Arbeit verringern und den Kund:innen zeigen, dass das Unternehmen ESG ernst nimmt.",
          feedback: {
            body: "Das mag professionell klingen, doch Software allein löst weder fehlende Datenverantwortung noch unklare Prozesse. Kauft das Unternehmen eine Plattform, bevor Indikatoren, Zuständigkeiten und Qualitätsregeln festgelegt sind, entstehen möglicherweise Kosten, ohne dass die Verlässlichkeit steigt. Das Ergebnis kann ein teures System voller unvollständiger oder inkonsistenter Daten sein.",
          },
        },
        [choices.dataSystem.requestOnly]: {
          label: "ESG-Daten weiterhin nur dann erheben, wenn Kund:innen sie anfordern, da das…",
          text: "ESG-Daten weiterhin nur dann erheben, wenn Kund:innen sie anfordern, da das Unternehmen nicht gesetzlich verpflichtet ist, vollständige Nachhaltigkeitsberichte zu erstellen. So wird unnötiger interner Aufwand vermieden, und die Teams können sich auf die Prioritäten der Produktion konzentrieren.",
          feedback: {
            body: "Das wirkt kurzfristig effizient, hält das Unternehmen aber in einer reaktiven Rolle. Daten, die nur auf Anfrage erhoben werden, sind oft unter Zeitdruck zusammengestellt, inkonsistent und schwer überprüfbar. Mit der Zeit kann dies das Vertrauen der Kund:innen beschädigen und verhindern, dass das Unternehmen Trends erkennt, mit denen sich Kosten, Abfall oder Risiken senken ließen.",
          },
        },
      },
    },
    [challenges.supplierCircularity]: {
      title: "Mit Lieferant:innen an Kreislauffähigkeit und ESG-Nachweisen arbeiten",
      shortTitle: "Mit Lieferant:innen an Kreislauffähigkeit und…",
      context: "Einer Ihrer größten Kund:innen verlangt Nachweise dafür, dass Ihr Unternehmen die Kreislauffähigkeit in der Lieferkette verbessert. Der Einkauf wählt Lieferant:innen derzeit vor allem nach Preis, Liefertreue und Qualität aus. Einige Lieferant:innen sind kleine Unternehmen mit begrenztem ESG-Wissen, und Ihr Einkaufsteam befürchtet, dass zusätzliche Anforderungen die Kosten erhöhen oder die Flexibilität verringern könnten.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.supplierCircularity.focusHighImpact]: {
          label: "Sich zunächst auf die Lieferant:innen und Materialien mit der größten Wirkung…",
          text: "Sich zunächst auf die Lieferant:innen und Materialien mit der größten Wirkung konzentrieren. Eine kleine, praktikable Auswahl an ESG- und Kreislaufinformationen anfordern, etwa Recyclinganteil, Verpackungsreduktion, Abfallbehandlung und grundlegende Arbeitsstandards. Wo Lieferant:innen keine detaillierten Daten haben, angemessene Näherungswerte oder Verbesserungspläne zulassen. Die Ergebnisse nutzen, um ein oder zwei Pilotmöglichkeiten zu ermitteln, etwa eine Umstellung der Verpackung, weniger Ausschuss oder einen höheren Recyclinganteil.",
          feedback: {
            body: "Richtig. Diese Option bringt Ehrgeiz und Praxistauglichkeit in Einklang. Sie konzentriert die Bemühungen dort, wo voraussichtlich die größte betriebliche und ESG-Wirkung entsteht, und hält die Zusammenarbeit mit Lieferant:innen realistisch. Das verbessert die Rücklaufquote, schützt die Lieferantenbeziehungen und schafft glaubwürdige Nachweise zur Kreislauffähigkeit.",
          },
        },
        [choices.supplierCircularity.fullQuestionnaire]: {
          label: "Alle Lieferant:innen auffordern, denselben detaillierten ESG-Fragebogen…",
          text: "Alle Lieferant:innen auffordern, denselben detaillierten ESG-Fragebogen auszufüllen und sofort vollständige Daten aus Lebenszyklusanalysen bereitzustellen. Das schafft einen einheitlichen Standard und stellt sicher, dass das Unternehmen keine Risiken bei kleineren Lieferant:innen oder solchen mit geringerem Einkaufsvolumen übersieht.",
          feedback: {
            body: "Dieser Ansatz wirkt gründlich, kann aber kleinere Lieferant:innen überfordern und die Kooperationsbereitschaft verringern. Wenn Lieferant:innen keine komplexen Daten liefern können, erhält das Unternehmen am Ende möglicherweise nur wenige Rückmeldungen und kaum verwertbare Informationen. Ein verhältnismäßiger Ansatz liefert in der Regel bessere Nachweise als ein überzogener.",
          },
        },
        [choices.supplierCircularity.polishedDocuments]: {
          label: "Lieferant:innen priorisieren, die bereits ausgefeilte ESG-Dokumente vorlegen…",
          text: "Lieferant:innen priorisieren, die bereits ausgefeilte ESG-Dokumente vorlegen können, auch wenn sie betrieblich nicht die wichtigsten sind. So kann das Unternehmen den Kund:innen schnell Nachweise vorlegen und den Rest der Lieferantenbasis später schrittweise verbessern.",
          feedback: {
            body: "Diese Option liefert vielleicht schnell Dokumente für die Kommunikation mit Kund:innen, birgt aber das Risiko, sich auf die Lieferant:innen zu konzentrieren, über die sich am leichtesten berichten lässt, statt auf die wichtigsten. Das kann ein irreführendes Bild des Fortschritts erzeugen und große ESG-Auswirkungen unberührt lassen.",
          },
        },
      },
    },
    [challenges.operationalImprovement]: {
      title: "ESG-Berichterstattung in betriebliche Verbesserung umwandeln",
      shortTitle: "ESG-Berichterstattung in betriebliche…",
      context: "Nach der Erhebung erster ESG-Daten stellen Sie fest, dass Ausschussquoten und Energieverbrauch zwischen den Produktionslinien deutlich schwanken. Die Personaldaten zeigen zudem eine höhere Fluktuation in einem Schichtteam. Das Führungsteam fragt, ob ESG in erster Linie eine Berichtstätigkeit bleiben oder Teil der kontinuierlichen Verbesserung werden soll.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.operationalImprovement.focusedProjects]: {
          label: "Ausgewählte ESG-Indikatoren mit praktischen betrieblichen Verbesserungsprojekten…",
          text: "Ausgewählte ESG-Indikatoren mit praktischen betrieblichen Verbesserungsprojekten verknüpfen. Zum Beispiel Ausschuss- und Energiedaten nutzen, um gezielte Kaizen-Aktivitäten zu starten, und Fluktuations- und Beinaheunfalldaten nutzen, um Teamroutinen, Führung und Arbeitsbedingungen zu verbessern. Die Zahl der Indikatoren überschaubar halten und sie in regelmäßigen Betriebsbesprechungen überprüfen, damit ESG Teil der täglichen Unternehmensführung wird.",
          feedback: {
            body: "Richtig. Dieser Ansatz macht ESG zu einer Quelle betrieblichen Nutzens. Durch die Verknüpfung von Indikatoren mit Verbesserungsprojekten kann das Unternehmen Kosten senken, Sicherheit und Arbeitsbedingungen verbessern und den Kund:innen zeigen, dass ESG im Betriebsalltag verankert ist und nicht als Papierkram behandelt wird.",
          },
        },
        [choices.operationalImprovement.separateReporting]: {
          label: "Die ESG-Berichterstattung von den Verbesserungsaktivitäten in der Produktion…",
          text: "Die ESG-Berichterstattung von den Verbesserungsaktivitäten in der Produktion getrennt halten, damit die operativen Teams nicht abgelenkt werden. ESG-Daten können von Compliance-Mitarbeitenden aufbereitet werden, während sich die Produktionsteams auf Produktivitäts-, Qualitäts- und Lieferziele konzentrieren.",
          feedback: {
            body: "Das mag effizient wirken, weil es die Produktionsteams vor zusätzlichen Aufgaben schützt. Es verhindert jedoch, dass ESG-Daten zur Lösung echter betrieblicher Probleme genutzt werden. Die Beschäftigten sehen ESG dann womöglich als Bürokratie, und das Unternehmen verpasst Kosteneinsparungen, Sicherheitsverbesserungen und Vorteile für das Engagement.",
          },
        },
        [choices.operationalImprovement.transformAllAtOnce]: {
          label: "Ein unternehmensweites ESG-Transformationsprogramm starten, das alle Abteilungen…",
          text: "Ein unternehmensweites ESG-Transformationsprogramm starten, das alle Abteilungen gleichzeitig umfasst, mit neuen Zielen für Energie, Abfall, Arbeitspraktiken, Lieferantenstandards und Governance. Das zeigt starke Führung und beschleunigt den Kulturwandel.",
          feedback: {
            body: "Diese Option zeigt Ehrgeiz, kann die Organisation aber überlasten. Für ein KMU mit begrenzten Ressourcen können zu viele gleichzeitige ESG-Maßnahmen zu Verwirrung, Ermüdung und schwacher Umsetzung führen. Gezielte Pilotprojekte ermöglichen oft schnelleres Lernen und ein stärkeres langfristiges Engagement.",
          },
        },
      },
    },
  },
  summary: {
    title: "Szenario abgeschlossen",
    takeaways: ["Lieferketten und betriebliche Abläufe anhand von Kriterien der Kreislaufwirtschaft neu zu gestalten, um Abfall zu minimieren.", "ethische soziale Praktiken in alltägliche Dienstleistungen einzuführen, um die betriebliche Governance mit den Werten in Einklang zu bringen."],
  },
});
