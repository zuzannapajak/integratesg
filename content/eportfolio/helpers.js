import { readFileSync } from "node:fs";

export function loadMarkdown(url) {
  return readFileSync(url, "utf8").trim();
}
