import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario06Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario06Ids;

/** Italian content provided by WP4 partners; stable IDs remain in definition.ts. */
export const scenario06It = defineScenarioLocale<"scenario-06">({
  scenarioId,
  locale: "it",
  title: "Monitoraggio, reporting e tendenze future dell’ESG",
  shortTitle: "Monitoraggio e reporting",
  subtitle: "KPI utili, dati affidabili e comunicazione agli stakeholder",
  introduction: "Una piccola azienda desidera monitorare le prestazioni ESG, migliorare la comparabilità dei dati e comunicare i risultati alle diverse parti interessate.",
  objectives: [
    "Seleziona indicatori ESG e KPI specifici per monitorare le prestazioni nelle principali attività aziendali.",
    "Categorizzare i dati ESG per generare report chiari e personalizzati in base alle esigenze dei diversi stakeholder.",
  ],
  boardAlt: "Tre situazioni ESG collegate: Troppi KPI, troppo poco valore; Dati non corrispondenti; Un unico report per tutti.",
  challenges: {
    [challenges.kpiSelection]: {
      title: "Troppi KPI, troppo poco valore",
      shortTitle: "Selezionare i KPI",
      context: "Una piccola azienda desidera iniziare a monitorare le proprie performance ESG. Ciascun dipartimento propone i propri indicatori, e il risultato è un elenco di 40 diversi KPI. L'azienda si rende presto conto che monitorare tutti questi individui è irrealistico e fonte di confusione.",
      question: "Come scegliere gli indicatori ESG più utili?",
      choices: {
        [choices.kpiSelection.coreKpis]: {
          label: "Selezionare 6–10 KPI essenziali",
          text: "Seleziona da 6 a 10 KPI fondamentali collegati alle principali attività dell'azienda e ai principali rischi o opportunità ESG (ambientali, sociali, di governance).\n\nPer ciascun KPI definire chiaramente:\n\ncosa misura\n\nil metodo di calcolo\n\ncon quale frequenza viene misurato\n\nchi è responsabile\n\nda dove provengono i dati\n\nl'obiettivo o la soglia.\n\nCollega ogni KPI a una decisione aziendale (ad esempio, investimenti, formazione, selezione dei fornitori, manutenzione).\n\nIniziate con un periodo di misurazione di base (3-6 mesi) e aggiungete KPI più avanzati solo quando il processo di raccolta dati si sarà stabilizzato.",
          feedback: { body: "Un numero limitato di KPI solidi si traduce in report coerenti, monitoraggio continuo e processi decisionali più rapidi." },
        },
        [choices.kpiSelection.measureEverything]: {
          label: "Misurare tutto immediatamente",
          text: "\"Misuriamo tutto immediatamente per sembrare più credibili.\"\n\nCiò spesso comporta dati incompleti o incoerenti, costi più elevati e scarsa fiducia all'interno dell'organizzazione.",
          feedback: { body: "Elevato rischio di errori e di dati incontrollati. Si perde tempo e l'azienda potrebbe essere accusata di greenwashing se i dati non possono essere verificati." },
        },
        [choices.kpiSelection.copyCorporate]: {
          label: "Copiare i KPI delle grandi aziende",
          text: "\"Copiamo gli indicatori chiave di prestazione (KPI) utilizzati dalle grandi aziende.\"\n\nLe grandi aziende dispongono di maggiori risorse e sistemi più complessi. I loro indicatori potrebbero essere troppo difficili da raccogliere o gestire per una PMI, rendendo la rendicontazione inefficace.",
          feedback: { body: "Crea burocrazia inutile. I dipartimenti smettono di utilizzare gli indicatori dopo pochi mesi." },
        },
      },
    },
    [challenges.dataQuality]: {
      title: "Dati non corrispondenti",
      shortTitle: "Qualità dei dati",
      context: "I dati relativi all'energia e ai rifiuti provengono da diversi fornitori e presentano formati differenti. I reparti Risorse Umane e Acquisti utilizzano fogli di calcolo separati e non esiste un'unica fonte di informazioni affidabile.\n\nDi conseguenza, l'azienda ha difficoltà a confrontare o combinare i dati.",
      question: "Come rendere i dati ESG comparabili e affidabili?",
      choices: {
        [choices.dataQuality.dataModelAndGovernance]: {
          label: "Definire un modello dati e verificare la qualità",
          text: "Definire un semplice modello di dati ESG, che includa:\n\ncategorie di dati (ambientali, sociali, di governance)\n\nunità di misura\n\nlivello di dettaglio (sede, reparto, fornitore)\n\nregole di convalida.\n\nIntroduci un processo di controllo della qualità dei dati:\n\nverifiche di completezza e coerenza\n\nidentificazione di valori anomali (outlier)\n\nControllo delle versioni e tracciabilità.\n\nStabilire:\n\nun programma di raccolta dati\n\nresponsabili dei dati per ciascuna area\n\nun dizionario di dati condiviso che spiega ciascun indicatore.",
          feedback: { body: "Dati comparabili e affidabili migliorano la credibilità dei report e riducono le correzioni dell'ultimo minuto." },
        },
        [choices.dataQuality.singleExcel]: {
          label: "Raccogliere tutto in un unico file Excel",
          text: "\"Mettiamo tutto in un unico file Excel.\"\n\nIn assenza di definizioni e controlli chiari, le incongruenze permangono e spesso aumentano. Lo stesso parametro può assumere valori diversi in luoghi diversi.",
          feedback: { body: "Incongruenze ricorrenti. I report vengono messi in discussione e si perde molto tempo a far quadrare i conti." },
        },
        [choices.dataQuality.waitForSoftware]: {
          label: "Aspettare il software ESG perfetto",
          text: "\"Aspettiamo di acquistare il software ESG perfetto.\"\n\nL'attesa ritarda il monitoraggio e impedisce all'azienda di costruire una base di riferimento utile e una cultura dei dati.",
          feedback: { body: "Ritardo nel monitoraggio ESG. L'azienda non è in grado di dimostrare progressi o di aver appreso la lezione." },
        },
      },
    },
    [challenges.stakeholderReporting]: {
      title: "Un unico report per tutti?",
      shortTitle: "Comunicazione ESG",
      context: "I diversi stakeholder desiderano diversi tipi di informazioni ESG:\n\nLa direzione desidera una breve relazione a supporto delle decisioni.\n\nLe banche e i partner richiedono informazioni e dati dettagliati.\n\nLa comunità locale desidera spiegazioni chiare e semplici.\n\nIl marketing predilige messaggi forti e positivi.",
      question: "Come comunicare i risultati ESG a stakeholder diversi?",
      choices: {
        [choices.stakeholderReporting.tailoredReporting]: {
          label: "Creare tre livelli di comunicazione",
          text: "Creare tre livelli di comunicazione:\n\n1. Cruscotto interno (per il processo decisionale)\n\ncirca 10 KPI\n\nandamento nel tempo\n\navvisi e azioni correttive\n\n2. Relazione tecnica delle parti interessate\n\nmetodologia e ambito dei dati\n\ndefinizioni degli indicatori\n\nfonti di dati e limitazioni\n\nprove a sostegno\n\n3. Sintesi pubblica\n\nmessaggi chiari sui risultati\n\ntrasparenza su ciò che è ancora sconosciuto\n\npiani di miglioramento.\n\nIncludi sempre:\n\nDefinizioni degli indicatori chiave di prestazione (KPI)\n\nconfini di segnalazione\n\nfrequenza dei dati\n\nsquadre responsabili.\n\nQuesta trasparenza contribuisce a ridurre il rischio di accuse di greenwashing.",
          feedback: { body: "Una comunicazione personalizzata aumenta la fiducia e l'utilità sia per gli stakeholder interni che per quelli esterni." },
        },
        [choices.stakeholderReporting.singleReport]: {
          label: "Creare un unico report per tutti",
          text: "\"Creiamo un unico report per tutti.\"\n\nIl rapporto risulta o troppo tecnico per i lettori non specialisti o troppo superficiale per gli esperti.",
          feedback: { body: "Le parti interessate restano insoddisfatte e richiedono ulteriori chiarimenti." },
        },
        [choices.stakeholderReporting.positiveOnly]: {
          label: "Comunicare solo i risultati positivi",
          text: "“Comunichiamo solo i risultati positivi.”\n\nNascondere i problemi può danneggiare la credibilità se in seguito questi dovessero emergere.",
          feedback: { body: "Alto rischio di ripercussioni negative sulla reputazione e di accuse di greenwashing." },
        },
      },
    },
  },
  summary: {
    title: "Hai completato lo scenario: Monitoraggio, reporting e tendenze future dell’ESG",
    takeaways: [
      "Un numero limitato di KPI solidi si traduce in report coerenti, monitoraggio continuo e processi decisionali più rapidi.",
      "Dati comparabili e affidabili migliorano la credibilità dei report e riducono le correzioni dell'ultimo minuto.",
      "Una comunicazione personalizzata aumenta la fiducia e l'utilità sia per gli stakeholder interni che per quelli esterni.",
    ],
  },
});
