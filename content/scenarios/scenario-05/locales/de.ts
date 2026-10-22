import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";
import { scenario05Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario05Ids;

export const scenario05De = defineScenarioLocale<"scenario-05">({
  scenarioId: scenarioId,
  locale: "de",
  title: "ESG in Organisationsstrukturen und Partnerschaften verankern",
  shortTitle: "ESG in Organisationsstrukturen und…",
  subtitle: "ESG in Organisationsstrukturen und Partnerschaften verankern",
  introduction: "Sie sind die neu ernannte Person für die ESG- bzw. Nachhaltigkeitskoordination bei BalkanUtil EAD, einem mittelgroßen bulgarischen Versorgungsunternehmen, das kommunale und industrielle Kund:innen in drei Regionen mit Wasser- und energiebezogenen Dienstleistungen versorgt. Zunehmender regulatorischer Druck und steigende Erwartungen der Stakeholder haben ESG auf die Agenda der Geschäftsleitung gebracht. Einige nachhaltigkeitsbezogene Praktiken gibt es bereits – etwa Maßnahmen zur Energieeffizienz und Verfahren für Gesundheit und Sicherheit –, doch sie sind nicht koordiniert, und verschiedene Abteilungen gehen davon aus, dass ESG „Aufgabe von jemand anderem“ ist. Daten zur ökologischen, sozialen und Governance-Leistung sind über verschiedene Systeme verstreut, und das Unternehmen hat nur ein begrenztes Budget für neue Technologien oder externe Beratung. Die Geschäftsleitung wünscht sich einen praktischen Weg, ESG intern zu organisieren, eine glaubwürdige Datengrundlage aufzubauen und neue Partnerschaftsmöglichkeiten zu bewerten – ohne ESG zu einer zusätzlichen Berichtslast zu machen, die vom Betriebsalltag losgelöst ist.",
  objectives: ["System- und Prozessdenken anzuwenden, um ESG in verschiedenen Unternehmensfunktionen zu verankern.", "fundierte ESG-bezogene Entscheidungen auf Grundlage von Daten, Rückmeldungen der Stakeholder und Überlegungen zur langfristigen Wirkung zu treffen."],
  boardAlt: "Drei zusammenhängende ESG-Herausforderungen mit Entscheidungsmöglichkeiten.",
  challenges: {
    [challenges.crossFunctionalOwnership]: {
      title: "Die ESG-Verantwortung intern organisieren",
      shortTitle: "Die ESG-Verantwortung intern organisieren",
      context: "ESG wird in Gesprächen der Geschäftsleitung immer häufiger thematisiert, angetrieben durch regulatorischen Druck und die Erwartungen der Stakeholder. Einige nachhaltigkeitsbezogene Maßnahmen gibt es bereits, etwa zur Energieeffizienz sowie Verfahren für Gesundheit und Sicherheit, doch sie sind nicht koordiniert, und verschiedene Abteilungen gehen davon aus, dass ESG Aufgabe von jemand anderem ist. Die Geschäftsleitung fragt, wie ESG intern organisiert werden sollte, um Verwirrung und Doppelarbeit zu vermeiden.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.crossFunctionalOwnership.workingGroup]: {
          label: "Eine funktionsübergreifende ESG-Arbeitsgruppe einrichten, die auf Managementebene…",
          text: "Eine funktionsübergreifende ESG-Arbeitsgruppe einrichten, die auf Managementebene koordiniert wird und Vertreter:innen wichtiger Funktionen wie Betrieb, Personal und Finanzen umfasst. Jede Funktion bringt eine andere Perspektive ein: Der Betrieb versteht die Umweltauswirkungen, die Personalabteilung steuert soziale Aspekte, und die Finanzabteilung verknüpft ESG mit Budgetierung und Berichterstattung. Eine solche Koordination stellt sicher, dass Nachhaltigkeitsaspekte in alltägliche Entscheidungen eingebettet und an der Unternehmensstrategie ausgerichtet sind, statt als isolierte Initiativen behandelt zu werden.",
          feedback: {
            body: "Richtig. Dieser Ansatz schafft gemeinsame Verantwortung und wahrt zugleich Koordination und strategische Ausrichtung. ESG erfordert eine betriebliche Integration über Abteilungen hinweg, nicht nur Fachwissen in der Finanzberichterstattung.",
          },
        },
        [choices.crossFunctionalOwnership.financeOnly]: {
          label: "Die ESG-Koordination der Finanzabteilung übertragen, weil ESG-Berichterstattung…",
          text: "Die ESG-Koordination der Finanzabteilung übertragen, weil ESG-Berichterstattung voraussichtlich zu einer regulatorischen Anforderung und einer Anforderung von Investor:innen wird und die Finanzabteilung bereits Compliance- und Berichtssysteme verwaltet.",
          feedback: {
            body: "Die Finanzabteilung spielt bei der ESG-Offenlegung zwar eine wichtige Rolle, doch wenn die ESG-Führung auf Compliance beschränkt wird, droht Nachhaltigkeit zu einer Berichtsübung statt zu einem Prozess der Unternehmenstransformation zu werden.",
          },
        },
        [choices.crossFunctionalOwnership.independentDepartments]: {
          label: "Festlegen, dass jede Abteilung ihre eigenen ESG-Aktivitäten unabhängig steuert, um…",
          text: "Festlegen, dass jede Abteilung ihre eigenen ESG-Aktivitäten unabhängig steuert, um Flexibilität zu fördern und Bürokratie zu verringern.\n\nFeedback",
          feedback: {
            body: "Ein vollständig dezentrales ESG-Management mag flexibel wirken, doch ohne Koordination fällt es Organisationen schwer, Ziele abzustimmen, Wirkung einheitlich zu messen und Fortschritte glaubwürdig zu kommunizieren.",
          },
        },
      },
    },
    [challenges.dataFoundation]: {
      title: "Eine praktikable ESG-Datengrundlage aufbauen",
      shortTitle: "Eine praktikable ESG-Datengrundlage aufbauen",
      context: "Nachdem die ESG-Zuständigkeiten geklärt sind, stellt das Unternehmen fest, dass seine ESG-Daten inkonsistent und unvollständig sind. Der Energieverbrauch wird recht gut erfasst, doch soziale und Governance-Daten sind über verschiedene Systeme verstreut. Die Geschäftsleitung diskutiert, ob sofort mit der ESG-Datenerhebung auf Basis vorhandener Quellen begonnen oder bis zur Anschaffung einer speziellen ESG-Softwarelösung gewartet werden soll.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.dataFoundation.existingSources]: {
          label: "Mit der Erhebung von ESG-Daten aus vorhandenen Quellen wie Energierechnungen,…",
          text: "Mit der Erhebung von ESG-Daten aus vorhandenen Quellen wie Energierechnungen, Personalunterlagen, Sicherheitsberichten und Finanzdaten beginnen. Eine kleine Zahl klarer Indikatoren festlegen und regelmäßig überprüfen. Das stärkt die interne Datenkompetenz und hilft den Beschäftigten zu verstehen, wie ESG-Leistung gemessen wird, bevor in fortschrittlichere digitale Tools investiert wird.",
          feedback: {
            body: "Richtig. Dieser Ansatz setzt auf Relevanz, Beständigkeit und Lernen statt auf Menge. Wer mit einer überschaubaren Auswahl an Indikatoren beginnt, kann im Lauf der Zeit internes Verständnis und verlässliche Daten aufbauen.",
          },
        },
        [choices.dataFoundation.multinationalBenchmark]: {
          label: "Das Unternehmen mit großen multinationalen ESG-Vorreitern vergleichen und sofort…",
          text: "Das Unternehmen mit großen multinationalen ESG-Vorreitern vergleichen und sofort versuchen, Dutzende Indikatoren in allen ESG-Kategorien zu erfassen.",
          feedback: {
            body: "Wer zu früh versucht, komplexe ESG-Systeme multinationaler Konzerne nachzubilden, überfordert oft die Teams und verringert die Datenqualität.",
          },
        },
        [choices.dataFoundation.communicationFirst]: {
          label: "Vorrangig ESG-Daten erheben, die sich am leichtesten nach außen kommunizieren…",
          text: "Vorrangig ESG-Daten erheben, die sich am leichtesten nach außen kommunizieren lassen, statt Daten, die für betriebliche Auswirkungen und Entscheidungen am relevantesten sind.\n\nFeedback",
          feedback: {
            body: "Eine Konzentration auf vor allem nach außen attraktive Indikatoren birgt das Risiko eines kommunikationsgetriebenen ESG-Ansatzes, bei dem die Sichtbarkeit der Berichterstattung wichtiger wird als betriebliche Verbesserung und langfristige Wirkung.",
          },
        },
      },
    },
    [challenges.partnershipGovernance]: {
      title: "Eine ESG-Partnerschaft mit einer Gemeinde strukturieren",
      shortTitle: "Eine ESG-Partnerschaft mit einer Gemeinde…",
      context: "Eine Gemeinde tritt an das Unternehmen heran und schlägt ein gemeinsames Energieeffizienzprojekt für öffentliche Gebäude vor. Die Initiative passt gut zu den ESG-Zielen des Unternehmens, doch die Geschäftsleitung sorgt sich um unklare Zuständigkeiten, finanzielle Risiken und Reputationsrisiken, falls die Ergebnisse nicht erreicht werden.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.partnershipGovernance.pppCanvas]: {
          label: "Ein Public-Private-Partnership-Canvas (PPP-Canvas) nutzen, um die Zusammenarbeit…",
          text: "Ein Public-Private-Partnership-Canvas (PPP-Canvas) nutzen, um die Zusammenarbeit zu strukturieren. Dieses Instrument hilft, vor einer Verpflichtung Rollen, Zuständigkeiten, Risiken, Anreize, Governance-Mechanismen und erwartete ESG-Ergebnisse für beide Seiten zu klären. Ein strukturierter Ansatz verringert Unsicherheit und schafft Vertrauen.",
          feedback: {
            body: "Richtig. Wirksame ESG-Zusammenarbeit beruht auf gemeinsamer Governance, Transparenz und klar definierten Ergebnissen.",
          },
        },
        [choices.partnershipGovernance.technologyOnly]: {
          label: "Der Partnerschaft nur als Technologieanbieter beitreten und sich nicht an…",
          text: "Der Partnerschaft nur als Technologieanbieter beitreten und sich nicht an Governance oder der Koordination der Stakeholder beteiligen, um Reputationsrisiken zu minimieren.",
          feedback: {
            body: "Eine Beteiligung nur auf operativer Ebene mag das kurzfristige Risiko verringern, begrenzt aber Einfluss, Lernmöglichkeiten und das Vertrauen der Stakeholder.",
          },
        },
        [choices.partnershipGovernance.visibilityFirst]: {
          label: "Kurzfristige Sichtbarkeit und Branding-Möglichkeiten der Partnerschaft vor die…",
          text: "Kurzfristige Sichtbarkeit und Branding-Möglichkeiten der Partnerschaft vor die Festlegung messbarer ESG-Ziele und Mechanismen der Rechenschaftspflicht stellen.\n\nFeedback",
          feedback: {
            body: "Wer vor allem auf Sichtbarkeit statt auf messbare Ergebnisse setzt, erhöht das Risiko oberflächlicher ESG-Partnerschaften, die zwar Aufmerksamkeit erzeugen, aber keine nennenswerte ökologische oder soziale Wirkung erzielen.",
          },
        },
      },
    },
  },
  summary: {
    title: "Szenario abgeschlossen",
    takeaways: ["System- und Prozessdenken anzuwenden, um ESG in verschiedenen Unternehmensfunktionen zu verankern.", "fundierte ESG-bezogene Entscheidungen auf Grundlage von Daten, Rückmeldungen der Stakeholder und Überlegungen zur langfristigen Wirkung zu treffen."],
  },
});
