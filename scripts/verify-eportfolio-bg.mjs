/**
 * Source-only verification of all published Bulgarian ePortfolio translations.
 * No database access; no writes. Markdown headings, lists, and URLs must stay
 * structurally aligned with the already approved English source documents.
 */
import assert from "node:assert/strict";
import { caseStudies } from "../content/eportfolio/index.js";
import { EPORTFOLIO_LOCALES } from "../content/eportfolio/helpers.js";

const expectedLanguages = new Set(["en", "pl", "de", "it", "el", "bg"]);
const published = caseStudies.filter((study) => study.status === "published");
assert.equal(published.length, 16, "There must be exactly 16 published case studies.");
assert.equal(caseStudies.length, 16, "Unexpected extra/unpublished case study in source.");
assert.deepEqual(new Set(EPORTFOLIO_LOCALES), expectedLanguages);

function normalize(value) {
  return value.replace(/\r\n/g, "\n").trim();
}
function structure(value) {
  return normalize(value)
    .split(/\n\n+/)
    .map((part) => {
      const heading = /^(#{2,5})\s/.exec(part);
      if (heading) return heading[1];
      return part.startsWith("- ") ? "bullet" : "paragraph";
    });
}
function urls(value) {
  return (value.match(/https?:\/\/[^\s\[\]()<>]+/g) ?? []).map((url) => url.replace(/[;,]$/, ""));
}
for (const study of published) {
  const languages = study.translations.map((translation) => translation.language);
  assert.deepEqual(
    new Set(languages),
    expectedLanguages,
    `${study.slug}: not all six languages present`,
  );
  assert.equal(languages.length, expectedLanguages.size, `${study.slug}: duplicate language`);
  const en = study.translations.find((item) => item.language === "en");
  const bg = study.translations.find((item) => item.language === "bg");
  for (const field of ["title", "summary", "organization", "industry", "content"]) {
    assert.ok(
      typeof bg[field] === "string" && bg[field].trim().length > 2,
      `${study.slug}/bg: missing ${field}`,
    );
  }
  assert.ok(bg.content.length > 2500, `${study.slug}/bg: suspiciously short Markdown`);
  assert.ok(
    (bg.content.match(/[\u0400-\u04FF]/g) ?? []).length > 150,
    `${study.slug}/bg: expected Bulgarian Cyrillic translation, not English fallback`,
  );
  assert.ok(
    (bg.summary.match(/[\u0400-\u04FF]/g) ?? []).length > 35,
    `${study.slug}/bg: summary is not Bulgarian`,
  );
  assert.equal(bg.keyTakeaways.length, 4, `${study.slug}/bg: four translated takeaways required`);
  assert.ok(
    bg.keyTakeaways.every((value) => typeof value === "string" && value.length > 20),
    `${study.slug}/bg: incomplete takeaway`,
  );
  assert.notEqual(bg.content, en.content, `${study.slug}/bg: English fallback copied`);
  assert.deepEqual(
    structure(bg.content),
    structure(en.content),
    `${study.slug}/bg: Markdown structure differs from approved English version`,
  );
  assert.deepEqual(
    urls(bg.content),
    urls(en.content),
    `${study.slug}/bg: original reference URLs were changed`,
  );
  console.log(
    `PASS ${study.slug}: BG full text + metadata; ${urls(bg.content).length} source URLs preserved`,
  );
}
console.log(
  `\nBG ePortfolio source validation passed: ${published.length}/16 published case studies, six locales each.`,
);
console.log("Source-only check; no Supabase connection or writes.");
