// @vitest-environment node

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { courses } from "../../../prisma/seed-data/curriculum/index.js";
import { CURRICULUM_TRANSLATION_LANGUAGES } from "../../../prisma/seed-data/curriculum/localizations.js";

const supportedLanguages = ["en", ...CURRICULUM_TRANSLATION_LANGUAGES];

function expectAllLanguages(records) {
  expect(records.map((record) => record.language).sort()).toEqual([...supportedLanguages].sort());
}

describe("Curriculum and quiz localizations", () => {
  it("contains all six modules, 24 units, 24 quizzes and exactly 108 questions", () => {
    expect(courses).toHaveLength(6);
    expect(courses.flatMap((course) => course.sections)).toHaveLength(24);
    expect(courses.flatMap((course) => course.quizzes)).toHaveLength(24);
    expect(
      courses.flatMap((course) => course.quizzes.flatMap((quiz) => quiz.questions)),
    ).toHaveLength(108);
  });

  it("provides source-based curriculum material for every supported language", () => {
    for (const course of courses) {
      expectAllLanguages(course.translations);
      for (const record of course.translations) {
        expect(record.title.trim()).not.toHaveLength(0);
        expect(record.content.trim().length).toBeGreaterThan(150);
        expect(record.content).not.toContain("/mnt/data/");
        expect(record.content).not.toContain("@@INTEGRATESG_");
        if (record.language !== "en") {
          expect(record.content).not.toBe(course.translations[0].content);
        }
      }
      for (const section of course.sections) {
        expectAllLanguages(section.translations);
        for (const record of section.translations) {
          expect(record.title.trim()).not.toHaveLength(0);
          expect(record.summary?.trim()).not.toHaveLength(0);
          expect(record.content.trim().length).toBeGreaterThan(150);
          expect(record.content).not.toContain("/mnt/data/");
          expect(record.content).not.toContain("<img");
        }
      }
    }
  });

  it("preserves the original quiz and scoring structure while localizing prompts, answers and feedback", () => {
    let answerCount = 0;
    for (const course of courses) {
      for (const quiz of course.quizzes) {
        expectAllLanguages(quiz.translations);
        for (const question of quiz.questions) {
          expectAllLanguages(question.translations);
          expect(question.answers.filter((answer) => answer.isCorrect)).toHaveLength(1);
          for (const record of question.translations) {
            expect(record.prompt.trim().length).toBeGreaterThan(12);
          }
          for (const answer of question.answers) {
            answerCount++;
            expectAllLanguages(answer.translations);
            for (const record of answer.translations) {
              expect(record.text.trim()).not.toBe("");
              expect(record.feedbackText?.trim()).not.toBe("");
            }
          }
        }
      }
    }
    expect(answerCount).toBe(332);
  });

  it("does not include local temporary image paths or missing media", () => {
    for (const course of courses) {
      for (const translation of [
        ...course.translations,
        ...course.sections.flatMap((section) => section.translations),
      ]) {
        const matches = translation.content?.matchAll(
          /!\[[^\]]*\]\((\/curriculum\/media\/[^)]+)\)/g,
        );
        for (const match of matches ?? []) {
          const relative = match[1].replace(/^\//, "");
          expect(fs.existsSync(path.join(process.cwd(), "public", relative)), match[1]).toBe(true);
        }
      }
    }
  });
});
