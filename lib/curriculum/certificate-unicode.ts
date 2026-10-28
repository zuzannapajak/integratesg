/**
 * Fontsource Noto Sans ships language subsets as separate font files.
 * React-pdf does not apply browser CSS unicode-range fallback, so we explicitly
 * segment text into runs and render each run with its matching embedded font.
 *
 * Scope: Latin / Latin Extended (including Polish and Vietnamese), Greek,
 * Greek Extended, Cyrillic and Cyrillic Extended. Other writing systems must
 * be added deliberately with a suitable font and rendering tests.
 */
export type CertificateFontSubset =
  | "latin"
  | "latin-ext"
  | "greek"
  | "greek-ext"
  | "cyrillic"
  | "cyrillic-ext"
  | "vietnamese";

export type CertificateTextRun = {
  text: string;
  subset: CertificateFontSubset;
};

export const CERTIFICATE_FONT_SUBSETS: readonly CertificateFontSubset[] = [
  "latin",
  "latin-ext",
  "greek",
  "greek-ext",
  "cyrillic",
  "cyrillic-ext",
  "vietnamese",
] as const;

export function certificateFontFamily(subset: CertificateFontSubset) {
  return `IntegratESG-Noto-${subset}`;
}

function getFontSubset(codePoint: number): CertificateFontSubset | null {
  if (codePoint >= 0x1f00 && codePoint <= 0x1fff) return "greek-ext";
  if (codePoint >= 0x0370 && codePoint <= 0x03ff) return "greek";
  if (
    (codePoint >= 0x0460 && codePoint <= 0x052f) ||
    (codePoint >= 0x1c80 && codePoint <= 0x1c8a) ||
    (codePoint >= 0x2de0 && codePoint <= 0x2dff) ||
    (codePoint >= 0xa640 && codePoint <= 0xa69f) ||
    (codePoint >= 0xfe2e && codePoint <= 0xfe2f)
  )
    return "cyrillic-ext";
  if (
    (codePoint >= 0x0400 && codePoint <= 0x045f) ||
    [0x0490, 0x0491, 0x04b0, 0x04b1].includes(codePoint)
  ) {
    return "cyrillic";
  }
  if (
    (codePoint >= 0x1ea0 && codePoint <= 0x1ef9) ||
    [
      0x0102, 0x0103, 0x0110, 0x0111, 0x0128, 0x0129, 0x0168, 0x0169, 0x01a0, 0x01a1, 0x01af,
      0x01b0, 0x20ab,
    ].includes(codePoint)
  )
    return "vietnamese";
  if (
    (codePoint >= 0x0100 && codePoint <= 0x02ff) ||
    (codePoint >= 0x1d00 && codePoint <= 0x1dbf) ||
    (codePoint >= 0x1e00 && codePoint <= 0x1eff) ||
    (codePoint >= 0x2c60 && codePoint <= 0x2c7f) ||
    (codePoint >= 0xa720 && codePoint <= 0xa7ff) ||
    (codePoint >= 0x20a0 && codePoint <= 0x20ab) ||
    (codePoint >= 0x20ad && codePoint <= 0x20c0) ||
    [0x0304, 0x0308, 0x0329, 0x2113].includes(codePoint)
  )
    return "latin-ext";
  if (
    codePoint <= 0x00ff ||
    (codePoint >= 0x2000 && codePoint <= 0x206f) ||
    [0x0131, 0x0152, 0x0153, 0x20ac, 0x2122, 0x2191, 0x2193, 0x2212, 0x2215].includes(codePoint)
  )
    return "latin";
  return null;
}

export function segmentCertificateText(value: string): CertificateTextRun[] {
  const normalized = value.normalize("NFC").replace(/[\r\n\t]+/g, " ");
  const runs: CertificateTextRun[] = [];

  for (const character of normalized) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) {
      throw new Error("Unable to read certificate character code point");
    }
    // A single PDF font cannot render every Unicode script. Do not silently
    // replace unsupported names with '?' or remove their characters.
    const subset = getFontSubset(codePoint);
    if (subset === null || codePoint < 0x20 || codePoint === 0x7f) {
      throw new Error(
        `Unsupported certificate character: U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`,
      );
    }

    const last = runs.at(-1);
    if (last?.subset === subset) {
      last.text += character;
    } else {
      runs.push({ text: character, subset });
    }
  }
  return runs;
}
