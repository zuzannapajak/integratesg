import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const accessibilityStyles = readFileSync(
  resolve(process.cwd(), "app/scenario-accessibility.css"),
  "utf8",
);

function readCssColour(variableName: string): string {
  const expression = new RegExp(`--${variableName}:\\s*(#[0-9a-fA-F]{6})`);
  const match = accessibilityStyles.match(expression);

  if (!match?.[1]) {
    throw new Error(`Missing CSS colour variable --${variableName}.`);
  }

  return match[1];
}

function hexToRgb(hex: string): readonly [number, number, number] {
  const normalised = hex.replace("#", "");

  return [
    Number.parseInt(normalised.slice(0, 2), 16),
    Number.parseInt(normalised.slice(2, 4), 16),
    Number.parseInt(normalised.slice(4, 6), 16),
  ];
}

function linearise(channel: number): number {
  const value = channel / 255;

  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const [red, green, blue] = hexToRgb(hex);

  return 0.2126 * linearise(red) + 0.7152 * linearise(green) + 0.0722 * linearise(blue);
}

function contrastRatio(first: string, second: string): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

describe("scenario contrast palette", () => {
  it.each([
    ["scenario-readable-muted", "#ffffff"],
    ["scenario-readable-blue", "#eef5ff"],
    ["scenario-readable-green", "#ecf8f4"],
    ["scenario-readable-orange", "#fff3ea"],
    ["scenario-readable-amber", "#fff1c9"],
  ])("keeps normal text %s at or above 4.5:1", (variableName, background) => {
    expect(contrastRatio(readCssColour(variableName), background)).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ["scenario-readable-green", "#ffffff"],
    ["scenario-readable-locked", "#ffffff"],
  ])("keeps white button text on %s at or above 4.5:1", (variableName, foreground) => {
    expect(contrastRatio(foreground, readCssColour(variableName))).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the unselected control border at or above 3:1", () => {
    expect(
      contrastRatio(readCssColour("scenario-readable-control-border"), "#ffffff"),
    ).toBeGreaterThanOrEqual(3);
  });
});
