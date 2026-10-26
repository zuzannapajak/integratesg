import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario02Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario02Ids;

/** Italian content provided by WP4 partners; stable IDs remain in definition.ts. */
export const scenario02It = defineScenarioLocale<"scenario-02">({
  scenarioId,
  locale: "it",
  title: "Strategia, visione e allineamento organizzativo",
  shortTitle: "Strategia e allineamento",
  subtitle: "Priorità ESG, vincoli finanziari e cultura organizzativa",
  introduction: "Sei il Responsabile Strategia e Sviluppo di NordForm Components, una PMI manifatturiera di medie dimensioni con 140 dipendenti che fornisce componenti industriali a clienti europei di grandi dimensioni. L'azienda ha recentemente subito crescenti pressioni da parte di clienti, partner finanziari e dipendenti per dimostrare un approccio ESG più credibile e strutturato. Il consiglio di amministrazione ha concordato che l'ESG debba diventare parte integrante della strategia a lungo termine dell'azienda. Tuttavia, non c'è una visione condivisa su cosa ciò significhi in pratica. L'Amministratore Delegato vede l'ESG come un'opportunità strategica, il Direttore Finanziario è preoccupato per i margini e la capacità di investimento, il reparto Operations teme interruzioni e le Risorse Umane ritengono che il coinvolgimento del personale sia ancora troppo basso per un cambiamento radicale. Il tuo compito è aiutare l'azienda a passare da intenzioni generiche a una strategia ESG realistica, connessa alla missione aziendale, riflessa nelle decisioni quotidiane e compresa da tutti i dipartimenti. Dovrai affrontare tre sfide concrete che metteranno alla prova la tua capacità di allineare strategia, realtà operative e cultura organizzativa.",
  organisation: "NordForm Components",
  role: "Responsabile strategia e sviluppo",
  objectives: [
    "Formulare una strategia ESG coerente che allinei la missione dell'organizzazione con gli obiettivi di sostenibilità.",
    "Risolvere i compromessi operativi tra le esigenze finanziarie a breve termine e gli obiettivi ESG a lungo termine per favorire l'allineamento organizzativo e il cambiamento culturale.",
  ],
  boardAlt: "Tre situazioni ESG collegate: Definire le priorità ESG senza perdere di vista l'orientamento strategico; Rispondere alle pressioni finanziarie senza indebolire l'impegno ESG; Trasformare la strategia ESG in comportamento organizzativo.",
  challenges: {
    [challenges.priorities]: {
      title: "Definire le priorità ESG senza perdere di vista l'orientamento strategico.",
      shortTitle: "Definire le priorità ESG",
      context: "Durante la riunione strategica trimestrale, il consiglio di amministrazione vi chiede di presentare le priorità ESG dell'azienda per i prossimi tre anni. Un importante cliente ha richiesto prove dei progressi ESG nella catena di fornitura. Allo stesso tempo, i dirigenti senior hanno opinioni molto diverse su quali dovrebbero essere le priorità.\n\nIl team vendite desidera dichiarazioni pubbliche audaci per impressionare i clienti.\n\nIl reparto operativo intende concentrarsi esclusivamente sui miglioramenti di efficienza già pianificati.\n\nLe risorse umane auspicano azioni più incisive a favore del benessere e dell'inclusione dei dipendenti.\n\nIl settore finanziario vuole evitare tutto ciò che appare costoso o difficile da misurare.\n\nLa missione aziendale pone l'accento su qualità, affidabilità e partnership a lungo termine, ma nessuno ha ancora tradotto questi valori in priorità ESG.",
      question: "Come definire le priorità ESG per i prossimi tre anni?",
      choices: {
        [choices.priorities.materialPriorities]: {
          label: "Prima di definire le priorità, è necessario avviare un processo mirato di analisi della materialità e…",
          text: "Prima di definire le priorità, è necessario avviare un processo mirato di analisi della materialità e di allineamento. In pratica, ciò significa raccogliere input da stakeholder interni ed esterni, identificare i temi ESG più rilevanti per il modello di business, le aspettative dei clienti, le realtà del personale e la strategia a lungo termine, e quindi selezionare un numero limitato di priorità strategiche che siano chiaramente collegate alla missione aziendale. Queste priorità devono poi essere tradotte in obiettivi concreti, responsabilità e indicatori misurabili.",
          feedback: { body: "Questa è l'opzione più efficace perché collega la strategia ESG alla missione aziendale e al profilo effettivo di rischio/opportunità, anziché alla visibilità o alla convenienza a breve termine. Inoltre, aumenta il coinvolgimento di tutti i dipartimenti e riduce il rischio che l'ESG si trasformi in un mero esercizio di reporting scollegato dalla realtà aziendale. Nella pratica, ciò si traduce in priorità più credibili, processi decisionali migliori e una maggiore fiducia da parte degli stakeholder." },
        },
        [choices.priorities.shortTermActions]: {
          label: "Iniziate con le tematiche ESG più facili da comunicare esternamente e più visibili ai clienti, partendo…",
          text: "Iniziate con le tematiche ESG più facili da comunicare esternamente e più visibili ai clienti, partendo dal presupposto che la credibilità arriverà di conseguenza, una volta che l'azienda avrà dimostrato di aver slanciato la propria attività. L'allineamento interno e una più profonda integrazione strategica potranno essere sviluppati in seguito.",
          feedback: { body: "Questo approccio può sembrare allettante perché gli impegni visibili possono generare un rapido riconoscimento esterno. Tuttavia, se le priorità selezionate sono dettate principalmente dal valore comunicativo, l'azienda potrebbe trascurare questioni più rilevanti. Nel tempo, ciò può generare frustrazione interna, una scarsa implementazione e rischi per la reputazione, qualora le promesse fatte all'esterno non trovino riscontro nella realtà operativa." },
        },
        [choices.priorities.broadCommitments]: {
          label: "Costruisci la strategia ESG principalmente attorno alle problematiche che l'azienda può già misurare…",
          text: "Costruisci la strategia ESG principalmente attorno alle problematiche che l'azienda può già misurare con precisione, perché gli indicatori misurabili facilitano la dimostrazione dei progressi e l'ottenimento dell'approvazione del management, anche se alcune questioni più rilevanti vengono rimandate.",
          feedback: { body: "Scegliere solo ciò che è già facile da misurare può sembrare pratico, ma può distorcere la strategia. Le tematiche ESG importanti non sono sempre le più facili da quantificare all'inizio. Se la facilità di misurazione guida la definizione delle priorità, l'azienda potrebbe investire troppo poco in questioni strategicamente significative e creare una falsa percezione di progresso." },
        },
      },
    },
    [challenges.financialPressure]: {
      title: "Rispondere alle pressioni finanziarie senza indebolire l'impegno ESG",
      shortTitle: "Pressioni finanziarie",
      context: "Sei mesi dopo, i prezzi dell'energia aumentano e uno dei maggiori clienti dell'azienda ritarda i pagamenti. Il direttore finanziario chiede a tutti i reparti di ridurre le spese discrezionali. Un pacchetto di iniziative ESG pianificate include il coinvolgimento dei fornitori, la formazione interna e un miglioramento dell'efficienza delle risorse nella produzione.\n\nIl team dirigenziale concorda sull'importanza dei fattori ESG, ma emergono divergenze di opinione in merito alle tempistiche:\n\nIn ambito finanziario si sostiene che dovrebbero proseguire solo le iniziative con un ritorno sull'investimento molto rapido.\n\nIl reparto operativo appoggia l'aggiornamento per l'efficienza delle risorse, ma desidera posticipare i lavori che coinvolgono i fornitori.\n\nSales avverte che il rallentamento dei progressi in materia di ESG potrebbe avere ripercussioni sulle future gare d'appalto.\n\nIl dipartimento Risorse Umane sostiene che posticipare la formazione invierebbe un segnale sbagliato internamente.\n\nDevi suggerire all'azienda come procedere.",
      question: "Come rispondere alle pressioni finanziarie senza indebolire l’impegno ESG?",
      choices: {
        [choices.financialPressure.phasedBusinessCase]: {
          label: "Rivalutare il piano d'azione ESG attraverso un'analisi di fattibilità e una pianificazione sequenziale…",
          text: "Rivalutare il piano d'azione ESG attraverso un'analisi di fattibilità e una pianificazione sequenziale, anziché considerarlo una decisione del tipo \"tutto o niente\". Proteggere la direzione strategica, ma scaglionare l'implementazione in base alla rilevanza, all'esposizione al rischio, ai costi e al valore atteso. Proseguire con le azioni che rafforzano la resilienza o che sono importanti per la fiducia dei clienti e degli stakeholder, adeguando al contempo la tempistica delle azioni a minore priorità. Spiegare chiaramente perché l'ESG rimane parte integrante della strategia aziendale, anche se l'implementazione è scaglionata.",
          feedback: { body: "Questa è la risposta più equilibrata perché tutela gli obiettivi strategici pur tenendo conto della realtà finanziaria. Dimostra che l'integrazione dei criteri ESG è parte integrante di una sana gestione, non un progetto secondario. In pratica, questo approccio contribuisce a mantenere la credibilità, a preservare lo slancio e a consentire alla leadership di operare scelte ponderate anziché tagli reattivi." },
        },
        [choices.financialPressure.pauseEsgWork]: {
          label: "Limitare temporaneamente gli sforzi in ambito ESG alle iniziative con ritorni finanziari immediati…",
          text: "Limitare temporaneamente gli sforzi in ambito ESG alle iniziative con ritorni finanziari immediati, partendo dal presupposto che, una volta migliorata la redditività, le attività ESG più ampie possano essere ripristinate senza significative conseguenze strategiche.",
          feedback: { body: "Questo approccio può sembrare finanziariamente responsabile, ma può indebolire il valore strategico dell'ESG riducendolo a un mero risparmio a breve termine. Alcune azioni ESG creano valore attraverso la riduzione del rischio, la fiducia dei clienti, la preparazione dei fornitori o il cambiamento culturale, piuttosto che attraverso un ritorno immediato. Se queste azioni vengono interrotte troppo facilmente, l'azienda potrebbe risparmiare denaro nell'immediato, ma perdere resilienza e competitività in futuro." },
        },
        [choices.financialPressure.investInEverything]: {
          label: "Mantenere il piano d'azione ESG completo esattamente come originariamente concepito, al fine di…",
          text: "Mantenere il piano d'azione ESG completo esattamente come originariamente concepito, al fine di dimostrare coerenza ed evitare qualsiasi impressione di indebolimento dell'impegno dell'azienda in materia di sostenibilità.",
          feedback: { body: "Questa opzione appare basata su principi solidi, ma ignora i vincoli operativi. Rifiutarsi di adeguare i piani in presenza di reali pressioni finanziarie può generare resistenza da parte della dirigenza e ridurre il sostegno futuro alle iniziative ESG. Se il personale percepisce i criteri ESG come inflessibili o scollegati dalla realtà aziendale, ciò potrebbe danneggiare, anziché rafforzare, l'allineamento organizzativo a lungo termine." },
        },
      },
    },
    [challenges.peopleAndTeams]: {
      title: "Trasformare la strategia ESG in comportamento organizzativo",
      shortTitle: "Cambiare i comportamenti",
      context: "A un anno dall'approvazione della strategia ESG, l'azienda ha pubblicato le proprie priorità e introdotto diverse politiche. Tuttavia, l'attuazione è discontinua.\n\nI team leader non discutono sistematicamente di ESG durante le riunioni operative.\n\nI dipendenti descrivono l'ESG come \"principalmente per la gestione e la rendicontazione\".\n\nAlcuni reparti sono coinvolti, mentre altri vedono poca connessione con il loro lavoro quotidiano.\n\nIl consiglio si interroga sul perché il cambiamento culturale sia più lento del previsto.\n\nVi viene chiesto di suggerire il passo successivo per migliorare l'allineamento organizzativo.",
      question: "Come trasformare la strategia ESG in comportamenti quotidiani?",
      choices: {
        [choices.peopleAndTeams.sharedOwnership]: {
          label: "Passare da un'implementazione basata sulle politiche a un'integrazione basata sui comportamenti",
          text: "Passare da un'implementazione basata sulle politiche a un'integrazione basata sui comportamenti. Collegare le priorità ESG a specifiche responsabilità dipartimentali, routine di gestione, discussioni di team e aspettative di performance. Fornire una formazione pratica legata ai ruoli lavorativi, dotare i quadri intermedi degli strumenti necessari per tradurre la strategia in decisioni quotidiane e creare meccanismi di feedback affinché i dipendenti possano comprendere l'impatto dei fattori ESG sulle attività operative e l'importanza del loro contributo.",
          feedback: { body: "Questa è l'opzione più efficace perché l'allineamento organizzativo si realizza quando le persone comprendono cosa significhi la strategia per il proprio ruolo e le proprie abitudini. L'ESG diventa credibile solo quando influenza decisioni, abitudini, incentivi e conversazioni in tutta l'azienda. Nella pratica, questo approccio porta a una maggiore responsabilizzazione, a un'implementazione più solida e a un cambiamento culturale più autentico." },
        },
        [choices.peopleAndTeams.sustainabilityOnly]: {
          label: "Concentrarsi innanzitutto sul rafforzamento della governance formale, aggiungendo ulteriori politiche…",
          text: "Concentrarsi innanzitutto sul rafforzamento della governance formale, aggiungendo ulteriori politiche ESG, modelli di reporting e controlli di gestione, partendo dal presupposto che una maggiore formalizzazione produrrà gradualmente il cambiamento culturale desiderato.",
          feedback: { body: "Una migliore governance può essere d'aiuto, ma la sola espansione delle politiche raramente modifica i comportamenti. Se il personale percepisce i principi ESG principalmente attraverso moduli aggiuntivi o adempimenti burocratici, potrebbe vederli come mera burocrazia piuttosto che come una direzione strategica. Questo può generare conformità senza un effettivo impegno." },
        },
        [choices.peopleAndTeams.communicationOnly]: {
          label: "Affidatevi a campagne di comunicazione di leadership visibili per rafforzare la visione ESG, partendo…",
          text: "Affidatevi a campagne di comunicazione di leadership visibili per rafforzare la visione ESG, partendo dal presupposto che, se il messaggio viene ripetuto abbastanza spesso, i dipartimenti lo tradurranno naturalmente nella pratica quotidiana.",
          feedback: { body: "La comunicazione da parte della leadership è necessaria, ma non sufficiente. Senza una traduzione specifica per ruolo e un follow-up manageriale, i messaggi ripetuti possono rimanere astratti. I dipendenti possono sostenere l'idea ESG in linea di principio, pur non sapendo come agire diversamente nella pratica." },
        },
      },
    },
  },
  summary: {
    title: "Hai completato lo scenario: Strategia, visione e allineamento organizzativo",
    takeaways: [
      "Questa è l'opzione più efficace perché collega la strategia ESG alla missione aziendale e al profilo effettivo di rischio/opportunità, anziché alla visibilità o alla convenienza a breve termine.",
      "Questa è la risposta più equilibrata perché tutela gli obiettivi strategici pur tenendo conto della realtà finanziaria.",
      "Questa è l'opzione più efficace perché l'allineamento organizzativo si realizza quando le persone comprendono cosa significhi la strategia per il proprio ruolo e le proprie abitudini.",
    ],
  },
});
