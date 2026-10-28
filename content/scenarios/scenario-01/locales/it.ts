import { defineScenarioLocale } from "@/lib/scenarios/simulator/format";

import { scenario01Ids } from "../definition";

const { scenarioId, challenges, choices } = scenario01Ids;

/** Italian content provided by WP4 partners; stable IDs remain in definition.ts. */
export const scenario01It = defineScenarioLocale<"scenario-01">({
  scenarioId,
  locale: "it",
  title: "Introduzione ai criteri ESG e allo sviluppo sostenibile",
  shortTitle: "Fondamenti ESG",
  subtitle: "Il dilemma del fornitore – integrazione dei pilastri ESG",
  introduction:
    'Sei il responsabile di "GreenTech Solutions", una PMI che produce componenti ad alta efficienza. Una grande multinazionale ti ha contattato, interessata a un contratto pluriennale. Tuttavia, prima della firma, ti richiede di presentare una "Roadmap per l\'integrazione ESG" che vada oltre le tue attuali donazioni di beneficenza.',
  organisation: "GreenTech Solutions",
  role: "Responsabile aziendale",
  objectives: [
    "Definire e differenziare i tre pilastri fondamentali dell'ESG (ambientale, sociale e di governance) in un contesto aziendale.",
    "Applicare i principi ESG per ottenere un vantaggio strategico, in particolare per accedere alle catene di fornitura delle grandi aziende.",
  ],
  boardAlt:
    "Tre situazioni ESG collegate: Definire i pilastri per il cliente; Passare dalla CSR all'integrazione ESG; Collegare le azioni agli obiettivi globali di sviluppo sostenibile (SDG).",
  challenges: {
    [challenges.pillars]: {
      title: "Definire i pilastri per il cliente",
      shortTitle: "Definire i pilastri ESG",
      context:
        'Il responsabile acquisti del cliente vi chiede di spiegare come la vostra azienda gestisce i "Rischi non finanziari", in particolare nell\'ambito dei pilastri E, S e G. Dovete classificare correttamente le vostre attività attuali per dimostrare di comprendere il framework.',
      question: "Come classificare correttamente le attività nei tre pilastri ESG?",
      choices: {
        [choices.pillars.accurateCategorisation]: {
          label:
            "Classifica accuratamente le tue attività evidenziando l'efficienza energetica (E), le politiche di…",
          text: "Classifica accuratamente le tue attività evidenziando l'efficienza energetica (E), le politiche di equità salariale e diversità (S) e la trasparenza del processo decisionale del consiglio di amministrazione e le misure anticorruzione (G).",
          feedback: {
            body: "Ottimo lavoro. Identificando correttamente che l'efficienza energetica rientra nell'ambito ambientale, la retribuzione equa in quello sociale e la lotta alla corruzione in quello della governance, dimostrate che l'ESG è un \"sistema di valutazione\" per la gestione del rischio. Questa chiarezza dimostra al cliente che non state semplicemente usando delle parole d'ordine, ma che state gestendo fattori non finanziari per creare valore a lungo termine.",
          },
        },
        [choices.pillars.rulesConfusion]: {
          label:
            "Classificare la sicurezza dei dipendenti o la diversità nell'ambito della governance perché sono…",
          text: 'Classificare la sicurezza dei dipendenti o la diversità nell\'ambito della governance perché sono "regole aziendali" anziché considerarle parte del pilastro sociale.',
          feedback: {
            body: "Mentre le politiche sono \"regole\", la dimensione sociale (S) riguarda specificamente il modo in cui un'azienda tratta le persone, compresi i dipendenti e le comunità in cui opera.Classificare la DEI o la sicurezza nell'ambito della governance ignora l'approccio incentrato sulla persona del pilastro sociale.",
          },
        },
        [choices.pillars.benefitConfusion]: {
          label:
            "Classificare le iniziative di gestione dei rifiuti o di economia circolare sotto il pilastro sociale…",
          text: 'Classificare le iniziative di gestione dei rifiuti o di economia circolare sotto il pilastro sociale perché "apportano benefici alla comunità".',
          feedback: {
            body: "È un errore classificare la gestione dei rifiuti come \"sociale\" solo perché è utile alla comunità.L'ambiente (E)Il pilastro ESG è definito rigorosamente dall'impatto dell'azienda sull'ambiente e dall'efficienza nell'uso delle risorse. Per un cliente, vedere questo aspetto nella categoria sbagliata suggerisce una mancanza di competenze tecniche in materia di ESG.",
          },
        },
      },
    },
    [challenges.csrToEsg]: {
      title: "Passare dalla CSR all'integrazione ESG",
      shortTitle: "Dalla CSR ai criteri ESG",
      context:
        "Il vostro CEO suggerisce che la vostra lunga tradizione di donazione del 2% degli utili a un ospedale pediatrico locale (responsabilità sociale d'impresa) dovrebbe essere il fulcro della strategia. Dovete spiegare perché questo non sia più sufficiente per un grande partner aziendale.",
      question: "Come spiegare perché la sola CSR non basta al cliente?",
      choices: {
        [choices.csrToEsg.integrationEra]: {
          label:
            "Spiegate il passaggio all'\"Era dell'Integrazione\", in cui il cliente considera i fattori E, S e G come…",
          text: "Spiegate il passaggio all'\"Era dell'Integrazione\", in cui il cliente considera i fattori E, S e G come rischi finanziari per la propria catena di fornitura, anziché come semplice filantropia volontaria.",
          feedback: {
            body: 'Perfetto. Hai saputo gestire con successo l\'"era dell\'integrazione". Spiegando che l\'ESG significa "essere intelligenti" piuttosto che semplicemente "essere gentili", ti allinei alla realtà secondo cui investitori e grandi aziende considerano ormai questi fattori come rischi e opportunità finanziarie. Hai dimostrato che la sostenibilità è un processo aziendale, non un progetto secondario.',
          },
        },
        [choices.csrToEsg.relabelCsr]: {
          label:
            "Trattare l'ESG semplicemente come un nuovo nome per la CSR e presumere che le donazioni di beneficenza…",
          text: "Trattare l'ESG semplicemente come un nuovo nome per la CSR e presumere che le donazioni di beneficenza siano la stessa cosa della gestione integrata del rischio.",
          feedback: {
            body: 'Semplicemente rinominare il vecchio programma di responsabilità sociale d\'impresa non funzionerà, perché la CSR era spesso volontaria, filantropica e la prima cosa a essere tagliata quando i profitti diminuivano..I grandi clienti devono capire che i vostri sforzi in materia di sostenibilità sono "non negoziabili" e integrati nella vostra strategia principale..',
          },
        },
        [choices.csrToEsg.imageOnly]: {
          label:
            "Credere che la CSR sia sufficiente perché crea un'immagine \"positiva\", senza rendersi conto che l'ESG è…",
          text: "Credere che la CSR sia sufficiente perché crea un'immagine \"positiva\", senza rendersi conto che l'ESG è ormai una necessità aziendale per l'accesso alla catena di fornitura.",
          feedback: {
            body: "Concentrarsi esclusivamente su un'immagine \"positiva\" può portare al \"greenwashing\", ovvero alla pratica di un'azienda che compie buone azioni (come la beneficenza) ignorando al contempo i danni operativi fondamentali (come l'inquinamento).L'ESG moderno richiede un quadro strutturato e finanziariamente rilevante, più difficile da ignorare rispetto alla CSR tradizionale.",
          },
        },
      },
    },
    [challenges.sdgAlignment]: {
      title: "Collegare le azioni agli obiettivi globali di sviluppo sostenibile (SDG)",
      shortTitle: "Azioni aziendali e SDG",
      context:
        'Per finalizzare la roadmap, è necessario dimostrare come la vostra PMI manifatturiera contribuisca al "quadro generale". Dovete collegare la vostra specifica azione di riduzione dello spreco energetico al corretto Obiettivo Globale.',
      question: "Come collegare le azioni dell’azienda agli SDG pertinenti?",
      choices: {
        [choices.sdgAlignment.preciseMapping]: {
          label:
            "Mappare la specifica azione ESG al corrispondente Obiettivo di Sviluppo Sostenibile (SDG), collegando…",
          text: "Mappare la specifica azione ESG al corrispondente Obiettivo di Sviluppo Sostenibile (SDG), collegando in particolare l'efficienza energetica e delle risorse all'SDG 12: Consumo e produzione responsabili o all'SDG 7: Energia pulita e accessibile.",
          feedback: {
            body: 'Esecuzione impeccabile. Mappare il "Come" (il quadro di riferimento) ESG al "Cosa" (gli obiettivi globali) degli Obiettivi di Sviluppo Sostenibile (SDG) fornisce alla tua PMI un linguaggio universale. In particolare, collegare l\'efficienza delle risorse all\'SDG 12 o all\'SDG 7 dimostra una profonda comprensione di come le piccole azioni contribuiscano al progetto globale.',
          },
        },
        [choices.sdgAlignment.allClimateAction]: {
          label:
            "Sostenendo che tutte le azioni ecologiche supportino l'obiettivo di sviluppo sostenibile 13 (Azione per…",
          text: "Sostenendo che tutte le azioni ecologiche supportino l'obiettivo di sviluppo sostenibile 13 (Azione per il clima), senza distinguere tra efficienza energetica e riduzione dell'impronta di carbonio.",
          feedback: {
            body: 'Sebbene tutte le azioni ecologiche siano positive, affermare che tutto rientri nella categoria "Azione per il clima" (Obiettivo di sviluppo sostenibile 13) può sembrare vago.La precisione è fondamentale; ad esempio, dimostrare come si riducono gli ostacoli per i gruppi sottorappresentati supporta direttamente l\'Obiettivo di Sviluppo Sostenibile 10 (Riduzione delle disuguaglianze), fornendo una narrazione molto più solida per il pilastro "Sociale".',
          },
        },
        [choices.sdgAlignment.noStakeholderLink]: {
          label:
            "Non riuscire a comunicare il collegamento alle parti interessate significa perdere l'opportunità di…",
          text: "Non riuscire a comunicare il collegamento alle parti interessate significa perdere l'opportunità di utilizzare un linguaggio universale che crei fiducia con i clienti internazionali.",
          feedback: {
            body: "Non comunicare questi collegamenti significa perdere un vantaggio strategico.Per una PMI, l'utilizzo degli Obiettivi di Sviluppo Sostenibile (SDG) aiuta ad aggiudicarsi contratti perché dimostra l'allineamento con gli stessi standard globali dei grandi clienti aziendali..",
          },
        },
      },
    },
  },
  summary: {
    title: "Hai completato lo scenario: Introduzione ai criteri ESG e allo sviluppo sostenibile",
    takeaways: [
      "Identificando correttamente che l'efficienza energetica rientra nell'ambito ambientale, la retribuzione equa in quello sociale e la lotta alla corruzione in quello della governance, dimostrate che l'ESG è un \"sistema di valutazione\" per la gestione…",
      'Spiegando che l\'ESG significa "essere intelligenti" piuttosto che semplicemente "essere gentili", ti allinei alla realtà secondo cui investitori e grandi aziende considerano ormai questi fattori come rischi e opportunità finanziarie.',
      'Mappare il "Come" (il quadro di riferimento) ESG al "Cosa" (gli obiettivi globali) degli Obiettivi di Sviluppo Sostenibile (SDG) fornisce alla tua PMI un linguaggio universale.',
    ],
  },
});
