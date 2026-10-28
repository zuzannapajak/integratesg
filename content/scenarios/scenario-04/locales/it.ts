import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario04Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario04Ids;

/** Italian content provided by WP4 partners; stable IDs remain in definition.ts. */
export const scenario04It = defineScenarioLocale<"scenario-04">({
  scenarioId,
  locale: "it",
  title: "Integrazione ESG nelle attività operative",
  shortTitle: "Attività operative ESG",
  subtitle: "Dati, fornitori e miglioramento operativo",
  introduction:
    "Sei il responsabile delle operazioni e della conformità presso EcoPart Manufacturing, una PMI con 120 dipendenti che fornisce componenti a due grandi clienti europei. Entrambi i clienti stanno iniziando a richiedere ai fornitori informazioni relative ai fattori ESG, tra cui dati su consumo energetico, rifiuti, contenuto riciclato, pratiche lavorative di base, standard dei fornitori e prove di economia circolare. Attualmente, i dati ESG dell'azienda sono frammentati tra finanza, risorse umane, ambiente/salute/sicurezza, produzione e acquisti. La maggior parte delle informazioni è archiviata in fogli di calcolo e l'azienda ha un budget limitato per nuove tecnologie o consulenze. Il management desidera una strategia concreta che soddisfi le aspettative dei clienti e al contempo migliori le operazioni. Devi decidere come integrare i fattori ESG nei processi aziendali quotidiani in modo credibile, proporzionato e utile per l'azienda, e non semplicemente come un ulteriore onere di reporting.",
  organisation: "EcoPart Manufacturing",
  role: "Responsabile operazioni e conformità",
  objectives: [
    "Riorganizzare la catena di approvvigionamento e i flussi di lavoro operativi secondo i principi dell'economia circolare per ridurre al minimo gli sprechi.",
    "Implementare pratiche sociali etiche nei servizi quotidiani per allineare la governance operativa ai valori.",
  ],
  boardAlt:
    "Tre situazioni ESG collegate: Costruire un sistema pratico di dati ESG; Collaborare con i fornitori su circolarità e dati ESG; Trasformare la rendicontazione ESG in miglioramento operativo.",
  challenges: {
    [challenges.dataSystem]: {
      title: "Costruire un sistema pratico di dati ESG",
      shortTitle: "Registro dei dati ESG",
      context:
        "Il tuo primo compito è organizzare le informazioni ESG in modo che l'azienda possa rispondere alle richieste dei clienti e individuare aree di miglioramento operativo. L'amministratore delegato desidera che l'azienda sia \"pronta per la rendicontazione ESG\", ma le risorse IT sono limitate e i responsabili di reparto sono preoccupati per l'eccessivo carico di lavoro amministrativo.",
      question: "Come creare un sistema pratico di dati ESG?",
      choices: {
        [choices.dataSystem.simpleRegister]: {
          label:
            "Crea un semplice registro dati ESG che identifichi gli indicatori operativi più rilevanti, assegni i…",
          text: "Crea un semplice registro dati ESG che identifichi gli indicatori operativi più rilevanti, assegni i responsabili dei dati in ciascun reparto e stabilisca una cadenza mensile di raccolta dati. Inizia con un insieme limitato di indicatori di alto valore, come il consumo energetico per unità, il tasso di spreco, il contenuto riciclato, gli incidenti in materia di salute e sicurezza e il turnover del personale. Inizialmente utilizza gli strumenti esistenti, ma definisci regole chiare per la qualità dei dati, le responsabilità e le riunioni di revisione.",
          feedback: {
            body: "Esatto. Questo approccio è proporzionato per una PMI perché crea una struttura senza complicare eccessivamente il processo. Partendo da indicatori materiali, assegnando le responsabilità e migliorando gradualmente la qualità dei dati, l'azienda può rispondere alle richieste dei clienti in modo più affidabile e utilizzare le stesse informazioni per migliorare le operazioni.",
          },
        },
        [choices.dataSystem.buyPlatform]: {
          label:
            "Acquistate subito una piattaforma software ESG completa, in modo da poter gestire fin da subito report…",
          text: "Acquistate subito una piattaforma software ESG completa, in modo da poter gestire fin da subito report, dashboard e richieste dei clienti in un unico sistema centralizzato. Questo ridurrà il lavoro manuale e dimostrerà ai clienti che l'azienda prende sul serio le tematiche ESG.",
          feedback: {
            body: "Potrebbe sembrare un approccio professionale, ma il software da solo non risolve i problemi di scarsa gestione dei dati o di processi poco chiari. Se l'azienda acquista una piattaforma prima di aver definito indicatori, responsabilità e regole di qualità, potrebbe generare costi senza migliorare l'affidabilità. Il risultato potrebbe essere un sistema costoso, pieno di dati incompleti o incoerenti.",
          },
        },
        [choices.dataSystem.requestOnly]: {
          label:
            "La raccolta dei dati ESG continuerà solo su richiesta dei clienti, poiché l'azienda non è legalmente…",
          text: "La raccolta dei dati ESG continuerà solo su richiesta dei clienti, poiché l'azienda non è legalmente obbligata a produrre report completi sulla sostenibilità. Ciò evita un carico di lavoro interno non necessario e consente ai team di concentrarsi sulle priorità di produzione.",
          feedback: {
            body: "Questo approccio può sembrare efficiente nel breve termine, ma costringe l'azienda a reagire passivamente. I dati raccolti solo su richiesta sono spesso frettolosi, incoerenti e difficili da verificare. Nel tempo, ciò può danneggiare la fiducia dei clienti e impedire all'azienda di individuare tendenze che potrebbero ridurre costi, sprechi o rischi.",
          },
        },
      },
    },
    [challenges.supplierCircularity]: {
      title: "Collaborare con i fornitori su circolarità e dati ESG",
      shortTitle: "Fornitori e circolarità",
      context:
        "Uno dei vostri maggiori clienti richiede prove del fatto che la vostra azienda stia migliorando l'economia circolare nella catena di fornitura. Attualmente, l'ufficio acquisti seleziona i fornitori principalmente in base al prezzo, all'affidabilità delle consegne e alla qualità. Alcuni fornitori sono piccole imprese con una conoscenza limitata in materia di ESG e il vostro team acquisti teme che requisiti aggiuntivi possano aumentare i costi o ridurre la flessibilità.",
      question: "Come collaborare con i fornitori per sostenere la circolarità?",
      choices: {
        [choices.supplierCircularity.focusHighImpact]: {
          label: "Concentratevi innanzitutto sui fornitori e sui materiali con il maggiore impatto",
          text: "Concentratevi innanzitutto sui fornitori e sui materiali con il maggiore impatto. Richiedete un piccolo set di informazioni pratiche su ESG e circolarità, come il contenuto di materiale riciclato, la riduzione degli imballaggi, la gestione dei rifiuti e gli standard lavorativi di base. Laddove i fornitori non dispongano di dati dettagliati, consentite l'utilizzo di indicatori plausibili o piani di miglioramento. Utilizzate i risultati per individuare una o due opportunità pilota, come la sostituzione degli imballaggi, la riduzione degli scarti o l'aumento del contenuto di materiale riciclato.",
          feedback: {
            body: "Esatto. Questa opzione bilancia ambizione e praticità. Concentra gli sforzi laddove è più probabile che si verifichi il maggiore impatto operativo e ESG, mantenendo al contempo un coinvolgimento realistico dei fornitori. Ciò migliora i tassi di risposta, protegge i rapporti con i fornitori e crea prove credibili di circolarità.",
          },
        },
        [choices.supplierCircularity.fullQuestionnaire]: {
          label:
            "Richiedi a tutti i fornitori di compilare lo stesso questionario ESG dettagliato e di fornire…",
          text: "Richiedi a tutti i fornitori di compilare lo stesso questionario ESG dettagliato e di fornire immediatamente i dati completi relativi alla valutazione del ciclo di vita. Questo crea uno standard uniforme e garantisce che l'azienda non trascuri i rischi legati a fornitori più piccoli o con budget di spesa inferiori.",
          feedback: {
            body: "Questo approccio può sembrare rigoroso, ma può sovraccaricare i fornitori più piccoli e ridurre la collaborazione. Se i fornitori non sono in grado di fornire dati complessi, l'azienda potrebbe ritrovarsi con bassi tassi di risposta e poche informazioni utilizzabili. Un approccio proporzionato di solito fornisce prove più solide rispetto a uno eccessivo.",
          },
        },
        [choices.supplierCircularity.polishedDocuments]: {
          label:
            "Dare priorità ai fornitori che sono già in grado di fornire documentazione ESG completa e ben…",
          text: "Dare priorità ai fornitori che sono già in grado di fornire documentazione ESG completa e ben strutturata, anche se non sono i più importanti dal punto di vista operativo. Questo permette all'azienda di mostrare rapidamente ai clienti prove concrete, migliorando gradualmente la qualità del resto della rete di fornitori in un secondo momento.",
          feedback: {
            body: "Questa opzione può produrre rapidamente documenti per la comunicazione con i clienti, ma rischia di concentrarsi sui fornitori più facili da monitorare piuttosto che su quelli più importanti. Ciò può creare un quadro fuorviante dei progressi e tralasciare importanti impatti ESG.",
          },
        },
      },
    },
    [challenges.operationalImprovement]: {
      title: "Trasformare la rendicontazione ESG in miglioramento operativo",
      shortTitle: "Miglioramento operativo",
      context:
        "Dopo aver raccolto i dati ESG iniziali, si nota che i tassi di scarto e il consumo energetico variano significativamente tra le linee di produzione. Anche i dati delle risorse umane mostrano un elevato turnover in un turno di lavoro. Il team dirigenziale si chiede se l'attività ESG debba rimanere principalmente un'attività di reporting o diventare parte integrante del miglioramento continuo.",
      question: "Come usare il reporting ESG per migliorare le operazioni?",
      choices: {
        [choices.operationalImprovement.focusedProjects]: {
          label:
            "Collega gli indicatori ESG selezionati a progetti concreti di miglioramento operativo",
          text: "Collega gli indicatori ESG selezionati a progetti concreti di miglioramento operativo. Ad esempio, utilizza i dati relativi agli scarti e al consumo energetico per avviare attività Kaizen mirate e i dati relativi al turnover e agli incidenti sfiorati per migliorare le routine di squadra, la supervisione e le condizioni di lavoro. Mantieni un numero gestibile di indicatori e rivedili in riunioni operative periodiche, in modo che l'ESG diventi parte integrante della gestione quotidiana.",
          feedback: {
            body: "Esatto. Questo approccio trasforma i fattori ESG in una fonte di valore operativo. Collegando gli indicatori ai progetti di miglioramento, l'azienda può ridurre i costi, migliorare la sicurezza e le condizioni di lavoro e dimostrare ai clienti che i fattori ESG sono integrati nelle operazioni quotidiane anziché essere trattati come mera burocrazia.",
          },
        },
        [choices.operationalImprovement.separateReporting]: {
          label:
            "È fondamentale tenere separati i report ESG dalle attività di miglioramento della produzione, in modo…",
          text: "È fondamentale tenere separati i report ESG dalle attività di miglioramento della produzione, in modo da non distrarre i team operativi. I dati ESG possono essere preparati dal personale addetto alla conformità, mentre i team di produzione si concentrano su produttività, qualità e obiettivi di consegna.",
          feedback: {
            body: "Questo approccio può sembrare efficiente perché protegge i team di produzione da compiti superflui. Tuttavia, impedisce che i dati ESG vengano utilizzati per risolvere problemi operativi reali. Il personale potrebbe iniziare a percepire l'ESG come burocrazia e l'azienda potrebbe perdere opportunità di risparmio sui costi, miglioramenti in termini di sicurezza e vantaggi in termini di coinvolgimento.",
          },
        },
        [choices.operationalImprovement.transformAllAtOnce]: {
          label:
            "Avviare un programma di trasformazione ESG a livello aziendale che coinvolga contemporaneamente tutti i…",
          text: "Avviare un programma di trasformazione ESG a livello aziendale che coinvolga contemporaneamente tutti i dipartimenti, con nuovi obiettivi per energia, rifiuti, pratiche lavorative, standard dei fornitori e governance. Ciò dimostra una leadership forte e accelera il cambiamento culturale.",
          feedback: {
            body: "Questa opzione denota ambizione, ma potrebbe sovraccaricare l'organizzazione. Per una PMI con risorse limitate, troppe azioni ESG simultanee possono generare confusione, affaticamento e un'implementazione debole. I progetti pilota mirati spesso consentono un apprendimento più rapido e un impegno più solido a lungo termine.",
          },
        },
      },
    },
  },
  summary: {
    title: "Hai completato lo scenario: Integrazione ESG nelle attività operative",
    takeaways: [
      "Questo approccio è proporzionato per una PMI perché crea una struttura senza complicare eccessivamente il processo.",
      "Concentra gli sforzi laddove è più probabile che si verifichi il maggiore impatto operativo e ESG, mantenendo al contempo un coinvolgimento realistico dei fornitori.",
      "Questo approccio trasforma i fattori ESG in una fonte di valore operativo.",
    ],
  },
});
