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
];

export const caseStudies = sourceCaseStudies.map((caseStudy) =>
  addAvailableTranslations(caseStudy, new URL(`./${caseStudy.slug}/`, import.meta.url)),
);
