import { AllegroCaseStudy } from "./allegro/index.js";
import { GrupaAzotyCaseStudy } from "./grupa-azoty/index.js";
import { BankOfCyprusCaseStudy } from "./bank-of-cyprus/index.js";
import { EurobankCyprusCaseStudy } from "./eurobank-cyprus/index.js";
import { HermesAirportsCaseStudy } from "./hermes-airports/index.js";
import { VassilikoCementWorksCaseStudy } from "./vassiliko-cement-works/index.js";
import { KpmgCyprusCaseStudy } from "./kpmg-cyprus/index.js";
import { PkoBankPolskiCaseStudy } from "./pko-bank-polski/index.js";
import { barillaCaseStudy } from "./barilla/index.js";
import { davinesCaseStudy } from "./davines/index.js";
import { harmonicaCaseStudy } from "./harmonica/index.js";
import { addAvailableTranslations } from "./helpers.js";
import { pknOrlenCaseStudy } from "./pkn-orlen/index.js";
import { pzuCaseStudy } from "./pzu/index.js";
import { sofiyskaVodaCaseStudy } from "./sofiyska-voda/index.js";
import { sonnentorCaseStudy } from "./sonnentor/index.js";
import { verbundCaseStudy } from "./verbund/index.js";

const sourceCaseStudies = [
  barillaCaseStudy,
  davinesCaseStudy,
  pzuCaseStudy,
  pknOrlenCaseStudy,
  sofiyskaVodaCaseStudy,
  harmonicaCaseStudy,
  sonnentorCaseStudy,
  verbundCaseStudy,
  AllegroCaseStudy,
  GrupaAzotyCaseStudy,
  BankOfCyprusCaseStudy,
  EurobankCyprusCaseStudy,
  HermesAirportsCaseStudy,
  VassilikoCementWorksCaseStudy,
  KpmgCyprusCaseStudy,
  PkoBankPolskiCaseStudy,
];

export const caseStudies = sourceCaseStudies.map((caseStudy) =>
  addAvailableTranslations(caseStudy, new URL(`./${caseStudy.slug}/`, import.meta.url)),
);
