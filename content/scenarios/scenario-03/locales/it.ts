import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario03Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario03Ids;

/** Italian content provided by WP4 partners; stable IDs remain in definition.ts. */
export const scenario03It = defineScenarioLocale<"scenario-03">({
  scenarioId,
  locale: "it",
  title: "Quadri normativi ESG e standard di rendicontazione UE",
  shortTitle: "Framework e rendicontazione",
  subtitle: "Scegliere framework ESG e produrre dati verificabili",
  introduction: "Sei il responsabile della sostenibilità e del reporting presso SONNENTOR, un'azienda austriaca produttrice di alimenti biologici con sede a Sprögnitz (Bassa Austria) che esporta tè, spezie e prodotti biologici in oltre 40 paesi. SONNENTOR effettua già il reporting attraverso il Gemeinwohl-Bilanz (Economia per il Bene Comune, GWÖ), un quadro di riferimento basato sui valori in cui l'azienda ottiene un buon punteggio (755 su 1.000) e che viene sottoposto a verifica esterna con cadenza biennale.\n\nSono pervenute contemporaneamente due richieste urgenti. Un importante acquirente dell'UE, soggetto alla Direttiva sulla rendicontazione di sostenibilità aziendale (CSRD), ha chiesto a SONNENTOR di fornire dati ESG in stile ESRS per la valutazione dei fornitori. Parallelamente, la banca dell'azienda ha richiesto una panoramica ESG concisa e comparabile per supportare una decisione di finanziamento. Entrambi gli stakeholder si aspettano informazioni comparabili, basate su dati concreti e coerenti di anno in anno.\n\nIl problema è che il framework GWÖ racconta una storia ricca di valori e relazioni con gli stakeholder, ma non è strutturato come i dati ESG richiesti dall'acquirente e dalla banca. Le informazioni ESG di SONNENTOR sono attualmente sparse tra acquisti, operations, risorse umane e finanza, per lo più in fogli di calcolo, e l'azienda ha un budget limitato per nuovi software o consulenze. L'alta dirigenza è orgogliosa dell'approccio GWÖ ed è preoccupata che la risposta possa creare un nuovo e pesante onere di reporting. È necessario decidere quale framework SONNENTOR dovrebbe utilizzare per soddisfare le aspettative dell'UE e progettare un processo pratico di raccolta dati per un piccolo insieme di indicatori prioritari, in modo che l'azienda possa rispondere rapidamente, mantenere il carico di lavoro proporzionato ed evitare rischi di greenwashing.",
  organisation: "SONNENTOR",
  role: "Responsabile sostenibilità e reporting",
  objectives: [
    "Scegliere i framework ESG appropriati che allineino la strategia interna alle aspettative delle parti interessate dell'UE.",
    "Definire un approccio alla raccolta dati per gli indicatori ESG prioritari al fine di garantirne la qualità e ridurre il greenwashing.",
  ],
  boardAlt: "Tre situazioni ESG collegate: Scegliere l'approccio quadro più adatto per le parti interessate dell'UE; Selezione e giustificazione degli indicatori ESG prioritari; Rendere operativa la raccolta dei dati per garantire la qualità e ridurre il greenwashing.",
  challenges: {
    [challenges.frameworkSelection]: {
      title: "Scegliere l'approccio quadro più adatto per le parti interessate dell'UE",
      shortTitle: "Selezionare i framework",
      context: "Il questionario dell'acquirente è redatto secondo la terminologia ESRS e la banca desidera dati standardizzati da poter confrontare con quelli di altri mutuatari. Nessuna delle due parti interessate ha familiarità con la matrice GWÖ. Il management apprezza l'identità GWÖ ed è riluttante ad adottare un secondo sistema di reporting completo. La prima decisione da prendere riguarda il modo in cui SONNENTOR dovrebbe posizionare i propri framework in risposta a questa esigenza.",
      question: "Quale approccio ai framework ESG risponde alle richieste delle parti interessate?",
      choices: {
        [choices.frameworkSelection.layeredApproach]: {
          label: "Mantieni GWÖ come quadro di riferimento interno principale per la cultura, la governance e la logica…",
          text: "Mantieni GWÖ come quadro di riferimento interno principale per la cultura, la governance e la logica degli stakeholder, e aggiungi un \"livello di mappatura\" leggero alle aspettative dell'UE. Mappa i contenuti ESG già presenti in SONNENTOR sul piccolo insieme di punti dati in stile ESRS di cui l'acquirente ha effettivamente bisogno, utilizza il GHG Protocol come metodo tecnico per le emissioni al fine di garantire la comparabilità e aggiungi elementi della tassonomia UE solo se la banca o l'acquirente li richiedono esplicitamente.",
          feedback: { body: "Esatto. Un approccio a più livelli parla il linguaggio delle parti interessate dell'UE, mantenendo al contempo la coerenza interna di SONNENTOR. Riutilizza le informazioni esistenti anziché costruire un sistema parallelo, riduce la ripetizione dei questionari, migliora la comparabilità ed è proporzionato per una PMI con risorse limitate." },
        },
        [choices.frameworkSelection.gwoOnly]: {
          label: "Rispondere che GWÖ è sufficiente e rifiutarsi di fornire punti dati in stile ESRS, in quanto SONNENTOR…",
          text: "Rispondere che GWÖ è sufficiente e rifiutarsi di fornire punti dati in stile ESRS, in quanto SONNENTOR pubblica già i dati in modo trasparente e non rientra direttamente nell'ambito di applicazione del CSRD.",
          feedback: { body: "In genere, acquirenti e banche non sono in grado di interpretare le categorie GWÖ e continueranno a richiedere dati in stile ESRS. Rifiutarsi di fornire tali dati comporta scambi di informazioni duplicati, tempi di risposta più lunghi e un rischio concreto di perdere il contratto o il finanziamento." },
        },
        [choices.frameworkSelection.allFrameworks]: {
          label: "Adottare contemporaneamente tutti i principali framework – ESRS, GRI, SASB e diverse altre…",
          text: "Adottare contemporaneamente tutti i principali framework – ESRS, GRI, SASB e diverse altre certificazioni – in modo che SONNENTOR risulti completo e pronto a soddisfare qualsiasi richiesta futura.",
          feedback: { body: "Adottare simultaneamente tutti i framework sovraccarica un piccolo team. Definizioni contrastanti e troppi punti dati causano un calo della qualità dei dati e il disimpegno del personale, il che aumenta anziché diminuire il rischio di greenwashing." },
        },
      },
    },
    [challenges.priorityIndicators]: {
      title: "Selezione e giustificazione degli indicatori ESG prioritari",
      shortTitle: "Scegliere i KPI",
      context: "Il modello richiesto dall'acquirente elenca decine di possibili punti dati. SONNENTOR non è in grado di produrli tutti in modo credibile nei tempi a disposizione, e alcuni (ad esempio le emissioni dell'intera catena del valore) non sono ancora misurati con precisione. È necessario scegliere un insieme ristretto e difendibile di indicatori prioritari ed essere in grado di giustificare tale scelta sia all'acquirente che alla banca.",
      question: "Come selezionare e giustificare gli indicatori ESG prioritari?",
      choices: {
        [choices.priorityIndicators.materialitySet]: {
          label: "Effettua un controllo preliminare di materialità e delle aspettative degli stakeholder su acquirente…",
          text: "Effettua un controllo preliminare di materialità e delle aspettative degli stakeholder su acquirente, banca, consumatori, dipendenti e fornitori chiave, e seleziona un piccolo insieme di indicatori prioritari che siano rilevanti e collegati alla strategia (ad esempio \"Mission Zero-Emission\", imballaggi, catena di fornitura), comparabili e chiaramente definibili, e per i quali siano disponibili dati empirici. Un esempio potrebbe essere: emissioni di Scope 1-2 e consumo energetico con un piano documentato per migliorare i dati di Scope 3; mix di imballaggi e metrica di riduzione della plastica con note metodologiche; quota di fornitori con verifica biologica/di sostenibilità; e metriche relative al personale come incidenti in materia di salute e sicurezza, ore di formazione e turnover.",
          feedback: { body: "Corretto. Un insieme ridotto di KPI, basato sulla materialità e corredato da una giustificazione documentata, è difendibile, soddisfa le aspettative delle parti interessate dell'UE, mantiene il carico di lavoro gestibile e contribuisce a una maggiore qualità dei dati." },
        },
        [choices.priorityIndicators.positiveOnly]: {
          label: "Riporta solo gli indicatori che SONNENTOR mette in luce nel modo migliore, ad esempio le categorie GWÖ…",
          text: "Riporta solo gli indicatori che SONNENTOR mette in luce nel modo migliore, ad esempio le categorie GWÖ che hanno già ottenuto un punteggio del 100% e l'affermazione principale di circa 400 tonnellate di plastica risparmiate, ed evita di menzionare le aree più deboli come lo Scope 3.",
          feedback: { body: "Una selezione dettata principalmente dal marketing viene rapidamente individuata dagli stakeholder informati, che notano le lacune (come la mancata inclusione delle emissioni lungo la catena del valore o del rischio dei fornitori). Il quadro appare selettivo e fa sorgere il sospetto di greenwashing." },
        },
        [choices.priorityIndicators.copyCorporate]: {
          label: "Copia l'intero catalogo KPI di una grande azienda in modo che SONNENTOR appaia completo e direttamente…",
          text: "Copia l'intero catalogo KPI di una grande azienda in modo che SONNENTOR appaia completo e direttamente confrontabile con concorrenti molto più grandi.",
          feedback: { body: "Un catalogo di KPI da grande azienda non si adatta ai sistemi delle PMI. La raccolta dei dati diventa irrealistica, i numeri risultano incoerenti di anno in anno e il personale si frustra, minando proprio la credibilità che l'esercizio dovrebbe costruire." },
        },
      },
    },
    [challenges.dataGovernance]: {
      title: "Rendere operativa la raccolta dei dati per garantire la qualità e ridurre il greenwashing",
      shortTitle: "Qualità e governance dei dati",
      context: "Ora disponete di una serie di indicatori prioritari. Il compito rimanente è quello di rendere i dati credibili e riproducibili – la stessa cifra deve essere difendibile qualora un acquirente, una banca o un revisore dei conti chiedessero come è stata ottenuta – e di farlo senza un ingente budget per il software e senza una corsa contro il tempo una volta all'anno.",
      question: "Come garantire una raccolta dei dati ESG affidabile e verificabile?",
      choices: {
        [choices.dataGovernance.governedWorkflow]: {
          label: "Costruire un semplice sistema di governance dei dati ESG che produca risultati ripetibili e…",
          text: "Costruire un semplice sistema di governance dei dati ESG che produca risultati ripetibili e verificabili: un dizionario KPI per ogni indicatore (definizione, ambito/confine, unità, metodo di calcolo, frequenza e cosa conta come prova); un responsabile dei dati per ogni KPI in tutte le aree Operazioni/Logistica, Acquisti, Risorse Umane e Finanza/Controllo di gestione; una cadenza di raccolta mensile o trimestrale anziché report annuali di emergenza; controlli di qualità minimi (fonti documentate come fatture, dati di misurazione e certificati dei fornitori, verifiche di plausibilità e di valori anomali e una fase di approvazione prima della condivisione esterna); e livelli di qualità dei dati che etichettino ogni dato come stimato, fornito dal fornitore o verificato, con un piano di aggiornamento nel tempo, soprattutto per l'ambito 3.",
          feedback: { body: "Esatto. Un dizionario KPI con responsabili, prove, controlli e livelli di qualità ben definiti crea tracciabilità, comparabilità e miglioramento continuo. Gli stakeholder possono fidarsi dei dati e il rischio di greenwashing diminuisce perché ogni cifra è riproducibile." },
        },
        [choices.dataGovernance.annualExcel]: {
          label: "Per semplicità, raccogliete i dati una volta all'anno in un foglio di calcolo ogni volta che arriva una…",
          text: "Per semplicità, raccogliete i dati una volta all'anno in un foglio di calcolo ogni volta che arriva una richiesta, senza lasciare tracce documentali, dato che SONNENTOR è una piccola azienda e il personale ha poco tempo a disposizione.",
          feedback: { body: "Un approccio annuale, basato esclusivamente su Excel e privo di documentazione a supporto, produce dati poco credibili e non riproducibili. Gli errori persistono, i risultati sono incoerenti tra un anno e l'altro e l'azienda si espone a rischi qualora un'affermazione venga contestata." },
        },
        [choices.dataGovernance.outsourceEverything]: {
          label: "Affida l'intero compito a un consulente esterno e considera i dati ESG come una sua responsabilità, in…",
          text: "Affida l'intero compito a un consulente esterno e considera i dati ESG come una sua responsabilità, in modo da non gravare sul personale interno.",
          feedback: { body: "L'esternalizzazione completa senza una governance interna crea dipendenza e tempi di risposta lenti nei confronti di acquirenti e banche. I consulenti hanno comunque bisogno di dati interni e l'azienda perde l'apprendimento e le capacità a lungo termine che il progetto dovrebbe sviluppare." },
        },
      },
    },
  },
  summary: {
    title: "Hai completato lo scenario: Quadri normativi ESG e standard di rendicontazione UE",
    takeaways: [
      "Un approccio a più livelli parla il linguaggio delle parti interessate dell'UE, mantenendo al contempo la coerenza interna di SONNENTOR.",
      "Un insieme ridotto di KPI, basato sulla materialità e corredato da una giustificazione documentata, è difendibile, soddisfa le aspettative delle parti interessate dell'UE, mantiene il carico di lavoro gestibile e contribuisce a una maggiore qualità…",
      "Un dizionario KPI con responsabili, prove, controlli e livelli di qualità ben definiti crea tracciabilità, comparabilità e miglioramento continuo.",
    ],
  },
});
