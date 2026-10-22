import { CERTIFICATE_COPY, formatCertificateDate } from "@/lib/curriculum/certificate-copy";
import { registerCertificateFonts } from "@/lib/curriculum/certificate-fonts";
import {
  certificateFontFamily,
  segmentCertificateText,
} from "@/lib/curriculum/certificate-unicode";
import type { AppLocale } from "@/lib/i18n/locales";
import {
  Document,
  Image,
  Line,
  Page,
  Rect,
  StyleSheet,
  Svg,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { ComponentProps } from "react";

const PAGE_WIDTH = 842;
const PAGE_HEIGHT = 595;
const NAVY = "#00143F";
const NAVY_SOFT = "#3E4963";
const GREEN = "#138A4E";
const TEXT = "#121722";
const LINE = "#D7DEE8";

export type CurriculumCertificatePdfInput = {
  learnerName: string;
  moduleTitle: string;
  issuedAt: Date;
  durationMinutes: number | null;
  certificateId: string;
  locale: AppLocale;
};

const styles = StyleSheet.create({
  page: { backgroundColor: "#FFFFFF", position: "relative" },
  backdrop: { position: "absolute", top: 0, left: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT },
  logo: { position: "absolute", left: 56, top: 72, width: 155, height: 47.9 },
  brandFallback: { position: "absolute", left: 56, top: 82, width: 350 },
  title: {
    position: "absolute",
    top: 137,
    left: 56,
    width: 560,
    fontSize: 48,
    lineHeight: 54,
    color: NAVY,
    fontWeight: 700,
  },
  subtitle: {
    position: "absolute",
    top: 197,
    left: 56,
    width: 550,
    fontSize: 21,
    lineHeight: 26,
    letterSpacing: 1.45,
    color: NAVY_SOFT,
  },
  accentLine: {
    position: "absolute",
    top: 240,
    left: 56,
    width: 48,
    height: 2.2,
    backgroundColor: GREEN,
  },
  intro: {
    position: "absolute",
    top: 271,
    left: 56,
    width: 525,
    fontSize: 15,
    lineHeight: 19,
    color: NAVY_SOFT,
  },
  name: { position: "absolute", top: 301, left: 56, width: 525, color: TEXT, fontWeight: 700 },
  moduleIntro: {
    position: "absolute",
    top: 381,
    left: 56,
    width: 520,
    fontSize: 14,
    lineHeight: 17,
    color: NAVY,
  },
  moduleTitle: {
    position: "absolute",
    top: 418,
    left: 56,
    width: 530,
    color: GREEN,
    fontWeight: 700,
  },
  dateRow: {
    position: "absolute",
    top: 498,
    left: 56,
    width: 535,
    height: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabel: { marginLeft: 11, fontSize: 14, lineHeight: 18, color: TEXT, width: 470 },
  divider: {
    position: "absolute",
    top: 534,
    left: 56,
    width: 438,
    height: 1,
    backgroundColor: LINE,
  },
  idLabel: {
    position: "absolute",
    left: 56,
    top: 544,
    width: 166,
    fontSize: 9.1,
    lineHeight: 12,
    color: NAVY_SOFT,
  },
  idValue: {
    position: "absolute",
    left: 56,
    top: 559,
    width: 166,
    fontSize: 11,
    lineHeight: 15,
    color: NAVY_SOFT,
  },
  footerDivider: {
    position: "absolute",
    left: 221,
    top: 543,
    height: 40,
    width: 1,
    backgroundColor: LINE,
  },
  issuedBy: {
    position: "absolute",
    left: 244,
    top: 542,
    width: 312,
    fontSize: 10,
    lineHeight: 13,
    color: NAVY_SOFT,
    fontWeight: 700,
  },
  footerOne: {
    position: "absolute",
    left: 244,
    top: 558,
    width: 312,
    fontSize: 9,
    lineHeight: 12,
    color: NAVY_SOFT,
  },
  footerTwo: {
    position: "absolute",
    left: 244,
    top: 571,
    width: 312,
    fontSize: 9,
    lineHeight: 12,
    color: NAVY_SOFT,
  },
});

function UnicodeText({
  value,
  style,
}: {
  value: string;
  style: ComponentProps<typeof View>["style"];
}) {
  return (
    <Text style={style}>
      {segmentCertificateText(value).map((run, index) => (
        <Text
          key={`${index}-${run.subset}`}
          style={{ fontFamily: certificateFontFamily(run.subset) }}
        >
          {run.text}
        </Text>
      ))}
    </Text>
  );
}

function suggestedNameFontSize(name: string): number {
  const length = Array.from(name).length;
  if (length > 72) return 19;
  if (length > 55) return 23;
  if (length > 42) return 27;
  if (length > 29) return 32;
  if (length > 23) return 35;
  return 39;
}

function suggestedModuleFontSize(title: string): number {
  const length = Array.from(title).length;
  if (length > 130) return 16;
  if (length > 100) return 17;
  if (length > 80) return 19;
  if (length > 57) return 22;
  return 26;
}

async function optionalPngDataUri(fileName: string): Promise<string | null> {
  try {
    const buffer = await fs.readFile(path.join(process.cwd(), "public", "branding", fileName));
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error(`Certificate branding file missing: ${fileName}`, error);
    return null;
  }
}

function CalendarIcon() {
  return (
    <Svg width="19" height="21" viewBox="0 0 24 24">
      <Rect
        x="2"
        y="4"
        width="20"
        height="18"
        rx="3"
        fill="none"
        stroke={GREEN}
        strokeWidth="1.8"
      />
      <Line x1="2" y1="10" x2="22" y2="10" stroke={GREEN} strokeWidth="1.6" />
      <Line x1="7" y1="2" x2="7" y2="6" stroke={GREEN} strokeWidth="1.8" />
      <Line x1="17" y1="2" x2="17" y2="6" stroke={GREEN} strokeWidth="1.8" />
    </Svg>
  );
}

export async function buildCurriculumCertificatePdf(
  input: CurriculumCertificatePdfInput,
): Promise<Buffer> {
  registerCertificateFonts();

  const copy = CERTIFICATE_COPY[input.locale];
  const name = input.learnerName.trim();
  const moduleTitle = input.moduleTitle.trim();
  const completionDate = `${copy.dateLabel}: ${formatCertificateDate(input.issuedAt, input.locale)}`;
  const nameSize = suggestedNameFontSize(name);
  const moduleSize = suggestedModuleFontSize(moduleTitle);

  // Validate every dynamic field first: unsupported scripts must not silently
  // become blank squares, question marks, or ASCII transliterations.
  for (const label of [
    ...Object.values(copy),
    name,
    moduleTitle,
    completionDate,
    input.certificateId,
  ]) {
    segmentCertificateText(label);
  }

  const [backdrop, logo] = await Promise.all([
    optionalPngDataUri("certificate-right-artwork.png"),
    optionalPngDataUri("logo.png"),
  ]);

  return renderToBuffer(
    <Document title={`IntegratESG - ${copy.title}`} author="IntegratESG">
      <Page size={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }} style={styles.page} wrap={false}>
        {backdrop ? <Image src={backdrop} style={styles.backdrop} /> : null}
        {logo ? (
          <Image src={logo} style={styles.logo} />
        ) : (
          <UnicodeText
            value="IntegratESG"
            style={[styles.brandFallback, { fontSize: 24, fontWeight: 700, color: TEXT }]}
          />
        )}

        <UnicodeText value={copy.title} style={styles.title} />
        <UnicodeText value={copy.subtitle} style={styles.subtitle} />
        <View style={styles.accentLine} />
        <UnicodeText value={copy.recipientLead} style={styles.intro} />

        <UnicodeText
          value={name}
          style={[styles.name, { fontSize: nameSize, lineHeight: nameSize * 1.12 }]}
        />
        <UnicodeText value={copy.moduleLead} style={styles.moduleIntro} />
        <UnicodeText
          value={moduleTitle}
          style={[styles.moduleTitle, { fontSize: moduleSize, lineHeight: moduleSize * 1.12 }]}
        />

        <View style={styles.dateRow}>
          <CalendarIcon />
          <UnicodeText value={completionDate} style={styles.dateLabel} />
        </View>

        <View style={styles.divider} />
        <UnicodeText value={copy.certificateIdLabel} style={styles.idLabel} />
        <UnicodeText value={input.certificateId} style={styles.idValue} />
        <View style={styles.footerDivider} />
        <UnicodeText value={copy.issuedBy} style={styles.issuedBy} />
        <UnicodeText value={copy.footerFirstLine} style={styles.footerOne} />
        <UnicodeText value={copy.footerSecondLine} style={styles.footerTwo} />
      </Page>
    </Document>,
  );
}
