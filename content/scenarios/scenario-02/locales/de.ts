import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";
import { scenario02Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario02Ids;

export const scenario02De = defineScenarioLocale<"scenario-02">({
  scenarioId: scenarioId,
  locale: "de",
  title: "Strategie, Vision und organisatorische Ausrichtung",
  shortTitle: "Strategie, Vision und organisatorische Ausrichtung",
  subtitle: "Strategie, Vision und organisatorische Ausrichtung",
  introduction:
    "Sie sind Strategie- und Entwicklungsmanager:in eines mittelgroßen produzierenden KMU, NordForm Components, das 140 Personen beschäftigt und Industrieteile an größere europäische Kund:innen liefert. Das Unternehmen steht seit Kurzem unter wachsendem Druck von Kund:innen, Finanzpartner:innen und Beschäftigten, einen glaubwürdigeren und strukturierteren ESG-Ansatz nachzuweisen. Der Vorstand hat beschlossen, dass ESG Teil der langfristigen Ausrichtung des Unternehmens werden soll. Es gibt jedoch kein gemeinsames Verständnis davon, was das in der Praxis bedeutet. Die Geschäftsführung sieht ESG als strategische Chance, die Finanzleitung sorgt sich um Margen und Investitionsspielraum, der Betrieb befürchtet Störungen, und die Personalabteilung hält das Engagement der Belegschaft für noch zu gering für einen größeren Wandel. Ihre Aufgabe ist es, dem Unternehmen zu helfen, von allgemeinen Absichten zu einer realistischen ESG-Strategie zu gelangen, die mit der Mission des Unternehmens verknüpft ist, sich in täglichen Entscheidungen widerspiegelt und in allen Abteilungen verstanden wird. Sie stehen vor drei realistischen Herausforderungen, die prüfen, ob Sie Strategie, betriebliche Realität und Organisationskultur in Einklang bringen können.",
  objectives: [
    "eine kohärente ESG-Strategie zu formulieren, die die Mission einer Organisation mit Nachhaltigkeitszielen in Einklang bringt.",
    "betriebliche Zielkonflikte zwischen kurzfristigen finanziellen und langfristigen ESG-Zielen zu lösen, um organisatorische Ausrichtung und Kulturwandel zu unterstützen.",
  ],
  boardAlt: "Drei zusammenhängende ESG-Herausforderungen mit Entscheidungsmöglichkeiten.",
  challenges: {
    [challenges.priorities]: {
      title: "ESG-Prioritäten festlegen, ohne den strategischen Fokus zu verlieren",
      shortTitle: "ESG-Prioritäten festlegen, ohne den…",
      context:
        "In der vierteljährlichen Strategiesitzung bittet Sie der Vorstand, die ESG-Prioritäten des Unternehmens für die nächsten drei Jahre vorzustellen. Eine wichtige Kundin hat Nachweise über ESG-Fortschritte in der Lieferkette angefordert. Gleichzeitig haben die Führungskräfte sehr unterschiedliche Vorstellungen davon, was priorisiert werden sollte.\n\n- Der Vertrieb möchte mutige öffentliche Zusagen, um Kund:innen zu beeindrucken.\n\n- Der Betrieb möchte sich nur auf bereits geplante Effizienzverbesserungen konzentrieren.\n\n- Die Personalabteilung möchte stärkere Maßnahmen für das Wohlbefinden der Beschäftigten und Inklusion.\n\n- Die Finanzabteilung möchte alles vermeiden, was teuer oder schwer messbar erscheint.\n\nDie Unternehmensmission betont Qualität, Zuverlässigkeit und langfristige Partnerschaften, doch bisher hat niemand diese Werte in ESG-Prioritäten übersetzt.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.priorities.shortTermActions]: {
          label: "Mit den ESG-Themen beginnen, die sich am leichtesten nach außen kommunizieren…",
          text: "Mit den ESG-Themen beginnen, die sich am leichtesten nach außen kommunizieren lassen und für Kund:innen am sichtbarsten sind, in der Annahme, dass Glaubwürdigkeit folgt, sobald das Unternehmen Dynamik zeigt. Interne Abstimmung und tiefere strategische Integration können später entwickelt werden.",
          feedback: {
            body: "Diese Option wirkt attraktiv, weil sichtbare Zusagen schnell externe Anerkennung bringen können. Werden die Prioritäten jedoch vor allem nach ihrem Kommunikationswert ausgewählt, übersieht das Unternehmen möglicherweise wesentlichere Themen. Mit der Zeit kann dies zu interner Frustration, schwacher Umsetzung und Reputationsrisiken führen, wenn externe Versprechen nicht durch die betriebliche Realität gedeckt sind.",
          },
        },
        [choices.priorities.materialPriorities]: {
          label: "Vor der Festlegung der Prioritäten einen fokussierten Wesentlichkeits- und…",
          text: "Vor der Festlegung der Prioritäten einen fokussierten Wesentlichkeits- und Abstimmungsprozess durchführen. In der Praxis bedeutet das, Rückmeldungen interner und externer Stakeholder einzuholen, die ESG-Themen zu ermitteln, die für das Geschäftsmodell, die Erwartungen der Kund:innen, die Situation der Belegschaft und die langfristige Strategie am relevantesten sind, und dann eine begrenzte Zahl strategischer Prioritäten auszuwählen, die klar mit der Mission des Unternehmens verknüpft sind. Diese Prioritäten in konkrete Ziele, Zuständigkeiten und messbare Indikatoren übersetzen.",
          feedback: {
            body: "Dies ist die stärkste Option, weil sie die ESG-Strategie mit der Mission des Unternehmens und seinem tatsächlichen Risiko- und Chancenprofil verknüpft statt mit kurzfristiger Sichtbarkeit oder Bequemlichkeit. Sie stärkt zudem die Eigenverantwortung in den Abteilungen und verringert das Risiko, dass ESG zu einer losgelösten Berichtsübung wird. In der Praxis führt dies zu glaubwürdigeren Prioritäten, besseren Entscheidungen und mehr Vertrauen der Stakeholder.",
          },
        },
        [choices.priorities.broadCommitments]: {
          label: "Die ESG-Strategie vor allem um die Themen herum aufbauen, die das Unternehmen…",
          text: "Die ESG-Strategie vor allem um die Themen herum aufbauen, die das Unternehmen bereits gut messen kann, weil messbare Indikatoren es erleichtern, Fortschritte zu zeigen und die Zustimmung der Geschäftsleitung zu gewinnen – auch wenn einige wesentlichere Themen zurückgestellt werden.",
          feedback: {
            body: "Nur das auszuwählen, was bereits leicht messbar ist, klingt praktisch, kann aber die Strategie verzerren. Wichtige ESG-Themen sind anfangs nicht immer am einfachsten zu quantifizieren. Wenn die Bequemlichkeit der Messung die Priorisierung bestimmt, investiert das Unternehmen möglicherweise zu wenig in strategisch bedeutsame Themen und erzeugt ein trügerisches Gefühl von Fortschritt.",
          },
        },
      },
    },
    [challenges.financialPressure]: {
      title: "Auf finanziellen Druck reagieren, ohne das ESG-Engagement zu schwächen",
      shortTitle: "Auf finanziellen Druck reagieren, ohne das…",
      context:
        "Sechs Monate später steigen die Energiepreise, und einer der größten Kunden des Unternehmens zahlt verspätet. Die Finanzleitung bittet alle Abteilungen, nicht zwingend notwendige Ausgaben zu kürzen. Ein geplantes ESG-Maßnahmenpaket umfasst die Einbindung von Lieferant:innen, interne Schulungen und eine Modernisierung der Produktion zur Steigerung der Ressourceneffizienz.\n\nDas Führungsteam ist sich einig, dass ESG wichtig ist, doch beim Zeitplan kommt es zu Meinungsverschiedenheiten:\n\n- Die Finanzabteilung argumentiert, dass nur Initiativen mit sehr schneller Amortisation fortgesetzt werden sollten.\n\n- Der Betrieb unterstützt die Modernisierung zur Ressourceneffizienz, möchte aber die Arbeit mit Lieferant:innen verschieben.\n\n- Der Vertrieb warnt, dass verlangsamte ESG-Fortschritte künftige Ausschreibungen beeinträchtigen könnten.\n\n- Die Personalabteilung argumentiert, dass eine Verschiebung der Schulungen intern das falsche Signal sendet.\n\nSie müssen eine Empfehlung abgeben, wie das Unternehmen vorgehen soll.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.financialPressure.pauseEsgWork]: {
          label: "Die ESG-Bemühungen vorübergehend auf Initiativen mit unmittelbarer finanzieller…",
          text: "Die ESG-Bemühungen vorübergehend auf Initiativen mit unmittelbarer finanzieller Rendite beschränken, in der Annahme, dass umfassendere ESG-Aktivitäten ohne nennenswerte strategische Folgen wieder aufgenommen werden können, sobald sich die Rentabilität verbessert.",
          feedback: {
            body: "Das wirkt finanziell verantwortungsvoll, kann aber den strategischen Wert von ESG schwächen, indem es auf kurzfristige Kosteneinsparungen reduziert wird. Manche ESG-Maßnahmen schaffen Wert durch Risikominderung, das Vertrauen von Kund:innen, die Bereitschaft der Lieferant:innen oder Kulturwandel statt durch sofortige Amortisation. Werden sie zu leichtfertig ausgesetzt, spart das Unternehmen jetzt vielleicht Geld, verliert aber später an Widerstandsfähigkeit und Wettbewerbsfähigkeit.",
          },
        },
        [choices.financialPressure.investInEverything]: {
          label: "Den gesamten ESG-Aktionsplan genau wie ursprünglich vorgesehen beibehalten, um…",
          text: "Den gesamten ESG-Aktionsplan genau wie ursprünglich vorgesehen beibehalten, um Konsequenz zu zeigen und jeden Eindruck zu vermeiden, dass das Nachhaltigkeitsengagement des Unternehmens nachlässt.",
          feedback: {
            body: "Diese Option wirkt prinzipientreu, ignoriert aber betriebliche Einschränkungen. Wer sich weigert, Pläne unter echtem finanziellem Druck anzupassen, kann Widerstand in der Führung erzeugen und die künftige Unterstützung für ESG verringern. Wenn die Beschäftigten ESG als unflexibel oder losgelöst von der geschäftlichen Realität wahrnehmen, kann dies die langfristige organisatorische Ausrichtung eher beschädigen als stärken.",
          },
        },
        [choices.financialPressure.phasedBusinessCase]: {
          label: "Den ESG-Aktionsplan unter dem Gesichtspunkt von Business Case und zeitlicher…",
          text: "Den ESG-Aktionsplan unter dem Gesichtspunkt von Business Case und zeitlicher Abfolge neu bewerten, statt ihn als Alles-oder-nichts-Entscheidung zu behandeln. Die strategische Ausrichtung schützen, die Umsetzung aber nach Wesentlichkeit, Risikoexposition, Kosten und erwartetem Nutzen staffeln. Maßnahmen fortsetzen, die die Widerstandsfähigkeit stärken oder für das Vertrauen von Kund:innen und Stakeholdern wichtig sind, und gleichzeitig den Zeitplan für weniger vorrangige Maßnahmen anpassen. Klar erklären, warum ESG Teil der Unternehmensstrategie bleibt, auch wenn die Umsetzung schrittweise erfolgt.",
          feedback: {
            body: "Dies ist die ausgewogenste Reaktion, weil sie die strategische Absicht schützt und zugleich die finanzielle Realität anerkennt. Sie zeigt, dass ESG-Integration Teil einer soliden Unternehmensführung ist und kein Nebenprojekt. In der Praxis hilft dieser Ansatz, Glaubwürdigkeit zu erhalten, Schwung zu bewahren und der Führung disziplinierte Abwägungen statt reaktiver Kürzungen zu ermöglichen.",
          },
        },
      },
    },
    [challenges.peopleAndTeams]: {
      title: "Die ESG-Strategie in organisatorisches Verhalten umsetzen",
      shortTitle: "Die ESG-Strategie in organisatorisches Verhalten…",
      context:
        "Ein Jahr nach der Verabschiedung der ESG-Strategie hat das Unternehmen seine Prioritäten veröffentlicht und mehrere Richtlinien eingeführt. Die Umsetzung ist jedoch uneinheitlich.\n\n- Teamleitungen besprechen ESG nicht regelmäßig in betrieblichen Besprechungen.\n\n- Beschäftigte beschreiben ESG als „hauptsächlich etwas für das Management und die Berichterstattung“.\n\n- Einige Abteilungen sind engagiert, andere sehen kaum einen Bezug zu ihrer täglichen Arbeit.\n\n- Der Vorstand fragt, warum der Kulturwandel langsamer verläuft als erwartet.\n\nSie werden gebeten, den nächsten Schritt zur Verbesserung der organisatorischen Ausrichtung zu empfehlen.",
      question: "Welche Entscheidung ist in dieser Situation sinnvoll?",
      choices: {
        [choices.peopleAndTeams.sharedOwnership]: {
          label:
            "Von einer richtlinienbasierten Umsetzung zu einer verhaltensbasierten Integration…",
          text: "Von einer richtlinienbasierten Umsetzung zu einer verhaltensbasierten Integration übergehen. ESG-Prioritäten mit konkreten Zuständigkeiten der Abteilungen, Führungsroutinen, Teamgesprächen und Leistungserwartungen verknüpfen. Praxisnahe, auf die jeweiligen Rollen zugeschnittene Schulungen anbieten, das mittlere Management befähigen, die Strategie in alltägliche Entscheidungen zu übersetzen, und Feedbackmechanismen schaffen, damit Beschäftigte sehen, wie ESG den Betrieb beeinflusst und dass ihre Beiträge zählen.",
          feedback: {
            body: "Dies ist die stärkste Option, weil organisatorische Ausrichtung entsteht, wenn Menschen verstehen, was die Strategie für ihre eigene Rolle und ihre Routinen bedeutet. ESG wird erst glaubwürdig, wenn es Entscheidungen, Gewohnheiten, Anreize und Gespräche im gesamten Unternehmen beeinflusst. In der Praxis führt dieser Ansatz zu mehr Eigenverantwortung, einer stärkeren Umsetzung und einem authentischeren Kulturwandel.",
          },
        },
        [choices.peopleAndTeams.sustainabilityOnly]: {
          label: "Sich zunächst darauf konzentrieren, die formale Governance durch zusätzliche…",
          text: "Sich zunächst darauf konzentrieren, die formale Governance durch zusätzliche ESG-Richtlinien, Berichtsvorlagen und Managementkontrollen zu stärken, in der Annahme, dass eine klarere Formalisierung nach und nach den gewünschten Kulturwandel bewirkt.",
          feedback: {
            body: "Bessere Governance kann helfen, doch mehr Richtlinien allein verändern selten das Verhalten. Wenn Beschäftigte ESG vor allem durch zusätzliche Formulare oder Berichtsaufgaben erleben, sehen sie darin womöglich Bürokratie statt strategischer Ausrichtung. Das kann zu Pflichterfüllung ohne echtes Engagement führen.",
          },
        },
        [choices.peopleAndTeams.communicationOnly]: {
          label: "Auf sichtbare Kommunikationskampagnen der Führung setzen, um die ESG-Vision zu…",
          text: "Auf sichtbare Kommunikationskampagnen der Führung setzen, um die ESG-Vision zu bekräftigen, in der Annahme, dass die Abteilungen die Botschaft ganz von selbst in die tägliche Praxis übertragen, wenn sie nur oft genug wiederholt wird.",
          feedback: {
            body: "Kommunikation durch die Führung ist notwendig, aber nicht ausreichend. Ohne rollenspezifische Übersetzung und konsequente Begleitung durch die Führungskräfte bleiben wiederholte Botschaften abstrakt. Beschäftigte unterstützen die Idee von ESG dann zwar grundsätzlich, wissen aber trotzdem nicht, wie sie in der Praxis anders handeln sollen.",
          },
        },
      },
    },
  },
  summary: {
    title: "Szenario abgeschlossen",
    takeaways: [
      "eine kohärente ESG-Strategie zu formulieren, die die Mission einer Organisation mit Nachhaltigkeitszielen in Einklang bringt.",
      "betriebliche Zielkonflikte zwischen kurzfristigen finanziellen und langfristigen ESG-Zielen zu lösen, um organisatorische Ausrichtung und Kulturwandel zu unterstützen.",
    ],
  },
});
