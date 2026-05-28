import fs from "node:fs";
import path from "node:path";

export function readMarkdown(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

export function translation(language, fields) {
  return {
    language,
    ...fields,
  };
}

export function section({ slug, sortOrder, estimatedMinutes = 10, title, summary, content }) {
  return {
    slug,
    sortOrder,
    estimatedMinutes,
    translations: [
      translation("en", {
        title,
        summary,
        content,
      }),
    ],
  };
}

export function answer({ label, text, isCorrect, feedbackText, sortOrder }) {
  const answerText = label ? `${label}) ${text}` : text;

  return {
    text: answerText,
    isCorrect,
    feedbackText,
    sortOrder,
    translations: [
      translation("en", {
        text: answerText,
        feedbackText,
      }),
    ],
  };
}

export function question({ prompt, explanation = null, sortOrder, answers }) {
  return {
    prompt,
    explanation,
    sortOrder,
    translations: [
      translation("en", {
        prompt,
        explanation,
      }),
    ],
    answers: answers.map((item, index) =>
      answer({
        ...item,
        sortOrder: index + 1,
      }),
    ),
  };
}

export function selfAssessmentQuiz({ title, description, passingScore = 70, questions }) {
  return {
    type: "post",
    title,
    description,
    passingScore,
    sortOrder: 1,
    translations: [
      translation("en", {
        title,
        description,
      }),
    ],
    questions,
  };
}
