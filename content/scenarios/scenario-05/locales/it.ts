import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario05Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario05Ids;

/** Italian content provided by WP4 partners; stable IDs remain in definition.ts. */
export const scenario05It = defineScenarioLocale<"scenario-05">({
  scenarioId,
  locale: "it",
  title: "Strutture organizzative e partnership ESG",
  shortTitle: "Organizzazione e partnership",
  subtitle: "Responsabilità ESG, dati e collaborazione pubblico-privata",
  introduction: "Sei il nuovo Coordinatore ESG/Sostenibilità di BalkanUtil EAD, un'azienda di servizi pubblici bulgara di medie dimensioni che fornisce servizi idrici ed energetici a clienti municipali e industriali in tre regioni. La crescente pressione normativa e le aspettative degli stakeholder hanno spinto l'ESG all'ordine del giorno del management. Alcune pratiche legate alla sostenibilità esistono già, come le misure di efficienza energetica e le procedure di salute e sicurezza, ma non sono coordinate e i diversi dipartimenti ritengono che l'ESG sia \"responsabilità di qualcun altro\". I dati sulle performance ambientali, sociali e di governance sono sparsi in diversi sistemi e l'azienda ha un budget limitato per nuove tecnologie o consulenze esterne. Il management desidera un modo pratico per organizzare l'ESG internamente, costruire una solida base di dati e valutare le opportunità di partnership emergenti, senza trasformare l'ESG in un ulteriore onere di reporting scollegato dalle operazioni quotidiane.",
  organisation: "BalkanUtil EAD",
  role: "Coordinatore ESG / sostenibilità",
  objectives: [
    "Applicare il pensiero sistemico e processuale per integrare i criteri ESG nelle diverse funzioni aziendali.",
    "Prendere decisioni informate in materia di ESG basandosi su dati, contributi delle parti interessate e considerazioni sull'impatto a lungo termine.",
  ],
  boardAlt: "Tre situazioni ESG collegate: Organizzare internamente la responsabilità ESG; Costruire una solida base di dati ESG; Strutturare una partnership ESG con un comune.",
  challenges: {
    [challenges.crossFunctionalOwnership]: {
      title: "Organizzare internamente la responsabilità ESG",
      shortTitle: "Responsabilità ESG",
      context: "I temi ESG hanno iniziato a comparire con maggiore frequenza nelle discussioni del management di alto livello, spinti dalle pressioni normative e dalle aspettative degli stakeholder. Alcune azioni legate alla sostenibilità esistono già, come le misure di efficienza energetica e le procedure in materia di salute e sicurezza, ma non sono coordinate e i diversi dipartimenti attribuiscono la responsabilità ESG ad altri. Il management si interroga su come organizzare internamente le attività ESG per evitare confusione e duplicazione degli sforzi.",
      question: "Come organizzare le responsabilità ESG tra i reparti?",
      choices: {
        [choices.crossFunctionalOwnership.workingGroup]: {
          label: "Istituire un gruppo di lavoro ESG interfunzionale coordinato a livello dirigenziale, che includa…",
          text: "Istituire un gruppo di lavoro ESG interfunzionale coordinato a livello dirigenziale, che includa rappresentanti di funzioni chiave come operations, risorse umane e finanza. Ogni funzione apporta una prospettiva diversa: le operazioni comprendono l'impatto ambientale, le risorse umane gestiscono gli aspetti sociali e la finanza collega l'ESG alla definizione del budget e alla rendicontazione. Coordinare l'ESG in questo modo garantisce che le considerazioni di sostenibilità siano integrate nelle decisioni quotidiane e allineate alla strategia aziendale, anziché essere trattate come iniziative isolate.",
          feedback: { body: "Esatto. Questo approccio crea una responsabilità condivisa, mantenendo al contempo coordinamento e allineamento strategico. L'ESG richiede integrazione operativa tra i vari dipartimenti, non solo competenze in materia di rendicontazione finanziaria." },
        },
        [choices.crossFunctionalOwnership.financeOnly]: {
          label: "Il coordinamento delle attività ESG dovrebbe essere affidato al dipartimento finanziario, poiché si…",
          text: "Il coordinamento delle attività ESG dovrebbe essere affidato al dipartimento finanziario, poiché si prevede che la rendicontazione ESG diventi un requisito normativo e per gli investitori, e il dipartimento finanziario gestisce già i sistemi di conformità e di rendicontazione.",
          feedback: { body: "Sebbene la finanza svolga un ruolo importante nella divulgazione delle informazioni ESG, limitare la leadership ESG alla mera conformità rischia di trasformare la sostenibilità in un mero esercizio di reporting anziché in un processo di trasformazione aziendale." },
        },
        [choices.crossFunctionalOwnership.independentDepartments]: {
          label: "Decidere che ciascun dipartimento gestisca autonomamente le proprie attività ESG, al fine di promuovere…",
          text: "Decidere che ciascun dipartimento gestisca autonomamente le proprie attività ESG, al fine di promuovere la flessibilità e ridurre la burocrazia.",
          feedback: { body: "Una gestione ESG completamente decentralizzata può sembrare flessibile, ma senza coordinamento le organizzazioni faticano ad allineare gli obiettivi, a misurare l'impatto in modo coerente e a comunicare i progressi in modo credibile." },
        },
      },
    },
    [challenges.dataFoundation]: {
      title: "Costruire una solida base di dati ESG",
      shortTitle: "Base di dati ESG",
      context: "Una volta chiarite le responsabilità in materia di ESG, l'azienda si rende conto che i suoi dati ESG sono incoerenti e incompleti. Il consumo energetico viene monitorato in modo abbastanza accurato, ma i dati relativi agli aspetti sociali e di governance sono sparsi in diversi sistemi. Il management valuta se iniziare immediatamente la raccolta dei dati ESG utilizzando le fonti esistenti o attendere l'acquisto di un software dedicato all'ESG.",
      question: "Come costruire una base affidabile di dati ESG?",
      choices: {
        [choices.dataFoundation.existingSources]: {
          label: "Iniziate a raccogliere dati ESG utilizzando fonti esistenti come bollette energetiche, registri delle…",
          text: "Iniziate a raccogliere dati ESG utilizzando fonti esistenti come bollette energetiche, registri delle risorse umane, rapporti sulla sicurezza e dati finanziari. Definite un numero limitato di indicatori chiari e rivedeteli regolarmente. Questo favorisce la conoscenza interna dei dati e aiuta i dipendenti a comprendere come vengono misurate le performance ESG prima di investire in strumenti digitali più avanzati.",
          feedback: { body: "Esatto. Questo approccio si concentra su rilevanza, coerenza e apprendimento piuttosto che sul volume. Iniziare con un insieme gestibile di indicatori aiuta le organizzazioni a costruire nel tempo una comprensione interna e un'affidabilità dei dati." },
        },
        [choices.dataFoundation.multinationalBenchmark]: {
          label: "Confronta l'azienda con i principali leader ESG multinazionali e cerca immediatamente di monitorare…",
          text: "Confronta l'azienda con i principali leader ESG multinazionali e cerca immediatamente di monitorare decine di indicatori in tutte le categorie ESG.",
          feedback: { body: "Il tentativo di replicare sistemi ESG multinazionali complessi troppo presto spesso sovraccarica i team e riduce la qualità dei dati." },
        },
        [choices.dataFoundation.communicationFirst]: {
          label: "Dare priorità alla raccolta di dati ESG più facili da comunicare esternamente, piuttosto che a quelli…",
          text: "Dare priorità alla raccolta di dati ESG più facili da comunicare esternamente, piuttosto che a quelli più rilevanti per l'impatto operativo e il processo decisionale.",
          feedback: { body: "Feedbak per la risposta C – Errore comune 2: Concentrarsi principalmente su indicatori esternamente attraenti rischia di creare un approccio ESG guidato dalla comunicazione, in cui la visibilità dei report diventa più importante del miglioramento operativo e dell'impatto a lungo termine." },
        },
      },
    },
    [challenges.partnershipGovernance]: {
      title: "Strutturare una partnership ESG con un comune",
      shortTitle: "Partnership con il comune",
      context: "L'azienda viene contattata da un comune che propone un progetto congiunto di efficienza energetica per gli edifici pubblici. L'iniziativa è in linea con le ambizioni ESG dell'azienda, ma il management è preoccupato per la mancanza di chiarezza sulle responsabilità, i rischi finanziari e le ripercussioni sulla reputazione in caso di mancato raggiungimento dei risultati.",
      question: "Come strutturare una partnership ESG con un comune?",
      choices: {
        [choices.partnershipGovernance.pppCanvas]: {
          label: "Utilizzate un quadro di riferimento per le partnership pubblico-private (PPP) per strutturare la…",
          text: "Utilizzate un quadro di riferimento per le partnership pubblico-private (PPP) per strutturare la collaborazione. Questo strumento aiuta a chiarire ruoli, responsabilità, rischi, incentivi, meccanismi di governance e risultati ESG attesi per entrambe le parti prima di impegnarsi. Un approccio strutturato riduce l'incertezza e rafforza la fiducia.",
          feedback: { body: "Esatto. Una collaborazione ESG efficace si basa su una governance condivisa, trasparenza e risultati chiaramente definiti." },
        },
        [choices.partnershipGovernance.technologyOnly]: {
          label: "Accettare di partecipare alla partnership esclusivamente in qualità di fornitore di tecnologia…",
          text: "Accettare di partecipare alla partnership esclusivamente in qualità di fornitore di tecnologia, evitando il coinvolgimento nella governance o nel coordinamento delle parti interessate al fine di minimizzare i rischi per la reputazione.",
          feedback: { body: "Partecipare solo a livello operativo può ridurre il rischio a breve termine, ma limita l'influenza, le opportunità di apprendimento e la fiducia delle parti interessate." },
        },
        [choices.partnershipGovernance.visibilityFirst]: {
          label: "Dare priorità alla visibilità a breve termine e alle opportunità di branding derivanti dalla…",
          text: "Dare priorità alla visibilità a breve termine e alle opportunità di branding derivanti dalla partnership, piuttosto che stabilire obiettivi ESG misurabili e meccanismi di responsabilità.",
          feedback: { body: "Concentrarsi principalmente sulla visibilità piuttosto che sui risultati misurabili aumenta il rischio di partnership ESG superficiali che generano pubblicità senza produrre un impatto ambientale o sociale significativo." },
        },
      },
    },
  },
  summary: {
    title: "Hai completato lo scenario: Strutture organizzative e partnership ESG",
    takeaways: [
      "Questo approccio crea una responsabilità condivisa, mantenendo al contempo coordinamento e allineamento strategico.",
      "Questo approccio si concentra su rilevanza, coerenza e apprendimento piuttosto che sul volume.",
      "Una collaborazione ESG efficace si basa su una governance condivisa, trasparenza e risultati chiaramente definiti.",
    ],
  },
});
