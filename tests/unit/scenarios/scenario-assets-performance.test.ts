import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const SCENARIO_ASSETS_ROOT = resolve(process.cwd(), "public/scenarios");

const EXPECTED_SCENARIO_ASSETS = [
  "pathway/pathway.png",
  "scenario-01/in-progress.png",
  "scenario-01/pre-start.png",
  "scenario-02/in-progress.png",
  "scenario-02/pre-start.png",
  "scenario-03/in-progress.png",
  "scenario-03/pre-start.png",
  "scenario-04/in-progress.png",
  "scenario-04/pre-start.png",
  "scenario-05/in-progress.png",
  "scenario-05/pre-start.png",
  "scenario-06/in-progress.png",
  "scenario-06/pre-start.png",
] as const;

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/*
 * Aktualny największy plik ma około 2,49 MiB.
 * Budżet pozostawia niewielki margines,
 * ale zatrzyma istotne zwiększenie rozmiaru.
 */
const MAX_SINGLE_SOURCE_BYTES = Math.floor(2.6 * 1024 * 1024);

/*
 * Aktualny komplet 13 ilustracji zajmuje
 * około 22,27 MiB.
 */
const MAX_TOTAL_SOURCE_BYTES = 23 * 1024 * 1024;

const MIN_SOURCE_WIDTH = 1600;
const MIN_SOURCE_HEIGHT = 900;

const TARGET_ASPECT_RATIO = 1672 / 941;

function listPngFiles(directory: string): string[] {
  return readdirSync(directory, {
    withFileTypes: true,
  }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return listPngFiles(absolutePath);
    }

    if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".png")) {
      return [];
    }

    return [relative(SCENARIO_ASSETS_ROOT, absolutePath).replaceAll("\\", "/")];
  });
}

function readPngMetadata(relativePath: string) {
  const absolutePath = resolve(SCENARIO_ASSETS_ROOT, relativePath);

  const file = readFileSync(absolutePath);

  if (!file.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    throw new Error(`${relativePath} is not a valid PNG file.`);
  }

  if (file.toString("ascii", 12, 16) !== "IHDR") {
    throw new Error(`${relativePath} does not contain a valid PNG IHDR chunk.`);
  }

  return {
    relativePath,
    bytes: file.byteLength,
    width: file.readUInt32BE(16),
    height: file.readUInt32BE(20),
  };
}

describe("scenario illustration performance budgets", () => {
  it("keeps the expected set of 13 scenario illustrations", () => {
    expect(listPngFiles(SCENARIO_ASSETS_ROOT).sort()).toEqual([...EXPECTED_SCENARIO_ASSETS].sort());
  });

  it.each(EXPECTED_SCENARIO_ASSETS)(
    "keeps %s within the individual source budget",
    (relativePath) => {
      const metadata = readPngMetadata(relativePath);

      expect(metadata.bytes).toBeLessThanOrEqual(MAX_SINGLE_SOURCE_BYTES);

      expect(metadata.width).toBeGreaterThanOrEqual(MIN_SOURCE_WIDTH);

      expect(metadata.height).toBeGreaterThanOrEqual(MIN_SOURCE_HEIGHT);

      expect(metadata.width / metadata.height).toBeCloseTo(TARGET_ASPECT_RATIO, 3);
    },
  );

  it("keeps the complete illustration set within the repository budget", () => {
    const totalBytes = EXPECTED_SCENARIO_ASSETS.reduce(
      (sum, relativePath) => sum + readPngMetadata(relativePath).bytes,
      0,
    );

    expect(totalBytes).toBeLessThanOrEqual(MAX_TOTAL_SOURCE_BYTES);
  });
});
