import fs from "node:fs";
import path from "node:path";

export function readMarkdown(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

export function readCurriculumMarkdown(language, moduleSlug, fileName) {
  return readMarkdown(`content/curriculum/${language}/${moduleSlug}/${fileName}.md`);
}

export function translation(language, fields) {
  return {
    language,
    ...fields,
  };
}

export function section({
  slug,
  sortOrder,
  estimatedMinutes = 10,
  title,
  summary,
  content,
  translations,
}) {
  return {
    slug,
    sortOrder,
    estimatedMinutes,
    translations: translations ?? [
      translation("en", {
        title,
        summary,
        content,
      }),
    ],
  };
}

export function answer({ label, text, isCorrect, feedbackText, sortOrder, translations }) {
  const answerText = label ? `${label}) ${text}` : text;

  return {
    text: answerText,
    isCorrect,
    feedbackText,
    sortOrder,
    translations: translations ?? [
      translation("en", {
        text: answerText,
        feedbackText,
      }),
    ],
  };
}

export function question({ prompt, explanation = null, sortOrder, answers, translations }) {
  return {
    prompt,
    explanation,
    sortOrder,
    translations: translations ?? [
      translation("en", {
        prompt,
        explanation,
      }),
    ],
    answers: answers.map((item, index) =>
      answer({
        ...item,
        sortOrder: item.sortOrder ?? index + 1,
      }),
    ),
  };
}

export function selfAssessmentQuiz({
  title,
  description,
  passingScore = 70,
  sortOrder = 1,
  questions,
  translations,
}) {
  return {
    type: "post",
    title,
    description,
    passingScore,
    sortOrder,
    translations: translations ?? [
      translation("en", {
        title,
        description,
      }),
    ],
    questions,
  };
}

export function unitQuiz({
  unitSlug,
  title,
  description,
  passingScore = 70,
  sortOrder,
  questions,
  translations,
}) {
  return {
    type: "post",
    unitSlug,
    title,
    description,
    passingScore,
    sortOrder,
    translations: translations ?? [
      translation("en", {
        title,
        description,
      }),
    ],
    questions,
  };
}
