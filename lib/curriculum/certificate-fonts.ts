import { existsSync } from "node:fs";
import path from "node:path";
import { Font } from "@react-pdf/renderer";
import {
  CERTIFICATE_FONT_SUBSETS,
  certificateFontFamily,
} from "@/lib/curriculum/certificate-unicode";

let registered = false;

export function registerCertificateFonts() {
  if (registered) return;

  for (const subset of CERTIFICATE_FONT_SUBSETS) {
    const filename = (weight: 400 | 700) =>
      path.join(
        process.cwd(),
        "node_modules",
        "@fontsource",
        "noto-sans",
        "files",
        `noto-sans-${subset}-${weight}-normal.woff`,
      );

    const regular = filename(400);
    const bold = filename(700);

    if (!existsSync(regular) || !existsSync(bold)) {
      throw new Error(`Missing Noto Sans ${subset} certificate font. Run npm ci.`);
    }

    Font.register({
      family: certificateFontFamily(subset),
      fonts: [
        { src: regular, fontWeight: 400 },
        { src: bold, fontWeight: 700 },
      ],
    });
  }

  registered = true;
}
