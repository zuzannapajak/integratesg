import fs from "node:fs";
import path from "node:path";

import { readCurriculumMarkdown, translation } from "./helpers.js";

export const CURRICULUM_TRANSLATION_LANGUAGES = ["pl", "de", "it", "el", "bg"];

const localeQuizLabels = {
  pl: "Test samooceny",
  de: "Selbsteinschätzung",
  it: "Test di autovalutazione",
  el: "Τεστ αυτοαξιολόγησης",
  bg: "Тест за самооценка",
};

function readLocaleJson(folder, language) {
  const file = path.join(process.cwd(), "content", "curriculum", folder, `${language}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function addQuestionTranslations(question, localized, language) {
  if (localized.answers.length !== question.answers.length) {
    throw new Error(`Answer count mismatch for language ${language} and question ${question.sortOrder}.`);
  }

  return {
    ...question,
    translations: [
      ...question.translations,
      translation(language, { prompt: localized.prompt, explanation: null }),
    ],
    answers: question.answers.map((answer, index) => {
      const content = localized.answers[index];
      const prefix = /^(?:([A-D])\)|\b(True|False)\))\s+/u.exec(answer.text);
      let localizedText = content.text;
      if (prefix?.[1]) {
        localizedText = `${prefix[1]}) ${content.text}`;
      } else if (prefix?.[2]) {
        // The localized source provides the complete True/False label.
        localizedText = content.text;
      }
      return {
        ...answer,
        translations: [
          ...answer.translations,
          translation(language, {
            text: localizedText,
            feedbackText: content.feedbackText,
          }),
        ],
      };
    }),
  };
}

/**
 * Adds language-specific curriculum/quiz content to the original English seed objects.
 * Keeps canonical slugs, quiz/question/answer ordering and isCorrect flags unchanged.
 */
export function withCurriculumLocalizations(englishCourses) {
  const localized = CURRICULUM_TRANSLATION_LANGUAGES.map((language) => ({
    language,
    modules: readLocaleJson("course-locales", language).modules,
    quizModules: readLocaleJson("quiz-locales", language),
  }));

  if (englishCourses.length !== 6) {
    throw new Error("Curriculum source is expected to contain 6 modules.");
  }

  for (const { language, modules, quizModules } of localized) {
    if (modules.length !== 6 || quizModules.length !== 6) {
      throw new Error(`Locale ${language} must contain 6 translated modules and quiz sets.`);
    }
  }

  return englishCourses.map((course, moduleIndex) => {
    const moduleSlug = `module-${moduleIndex + 1}`;
    return {
      ...course,
      translations: [
        ...course.translations,
        ...localized.map(({ language, modules }) => {
          const { title, overview, units } = modules[moduleIndex];
          if (!title || !overview || units.length !== 4) {
            throw new Error(`Incomplete module metadata ${moduleSlug}/${language}.`);
          }
          return translation(language, {
            title,
            subtitle: null,
            description: overview,
            content: readCurriculumMarkdown(language, moduleSlug, "intro"),
            details: {
              overview,
              outcomes: units.map((unit) => unit.summary),
              flow: units.map((unit) => ({ title: unit.title, description: unit.summary })),
            },
          });
        }),
      ],
      sections: course.sections.map((sectionData, unitIndex) => ({
        ...sectionData,
        translations: [
          ...sectionData.translations,
          ...localized.map(({ language, modules }) => {
            const unit = modules[moduleIndex].units[unitIndex];
            return translation(language, {
              title: unit.title,
              summary: unit.summary,
              content: readCurriculumMarkdown(language, moduleSlug, `unit-${unitIndex + 1}`),
            });
          }),
        ],
      })),
      quizzes: course.quizzes.map((quiz, unitIndex) => ({
        ...quiz,
        translations: [
          ...quiz.translations,
          ...localized.map(({ language, modules, quizModules }) => {
            const unit = modules[moduleIndex].units[unitIndex];
            const translatedQuiz = quizModules[moduleIndex].quizzes[unitIndex];
            if (translatedQuiz.questions.length !== quiz.questions.length) {
              throw new Error(`Question count mismatch at ${moduleSlug}/quiz-${unitIndex + 1}/${language}.`);
            }
            return translation(language, {
              title: `${unit.title} — ${localeQuizLabels[language]}`,
              description: unit.summary,
            });
          }),
        ],
        questions: quiz.questions.map((question, questionIndex) => {
          const translations = localized.map(({ language, quizModules }) => {
            const quizData = quizModules[moduleIndex].quizzes[unitIndex];
            if (quizData.sortOrder !== quiz.sortOrder || quizData.questions.length !== quiz.questions.length) {
              throw new Error(`Quiz structure mismatch at ${moduleSlug}/${language}.`);
            }
            const questionData = quizData.questions[questionIndex];
            if (questionData.sortOrder !== question.sortOrder) {
              throw new Error(`Question order mismatch at ${moduleSlug}/${language}.`);
            }
            return { language, questionData };
          });
          return translations.reduce(
            (current, { language, questionData }) => addQuestionTranslations(current, questionData, language),
            question,
          );
        }),
      })),
    };
  });
}
