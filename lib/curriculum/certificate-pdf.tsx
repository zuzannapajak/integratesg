import { promises as fs } from "node:fs";
import path from "node:path";
import { deflateSync, inflateSync } from "node:zlib";

const PAGE_WIDTH = 842;
const PAGE_HEIGHT = 595;

const BRAND_COLORS = {
  background: "#FFFFFF",
  navy: "#00143F",
  navySoft: "#3E4963",
  green: "#138A4E",
  line: "#D7DEE8",
  midGray: "#C9D3E0",
  text: "#121722",
  white: "#FFFFFF",
} as const;

type CurriculumCertificatePdfInput = {
  learnerName: string;
  moduleTitle: string;
  issuedAt: Date;
  durationMinutes: number | null;
  certificateId: string;
};

type FontKey = "F1" | "F2" | "F3";

type PdfImage = {
  name: string;
  width: number;
  height: number;
  compressedRgbData: Buffer;
};

function formatIssueDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(value);
}

function hexToRgb(color: string) {
  const normalized = color.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}

function escapePdfText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r/g, " ")
    .replace(/\n/g, " ");
}

function estimateCharWidth(char: string, fontSize: number, font: FontKey) {
  if (char === " ") {
    return fontSize * 0.3;
  }

  if ("ilIjtfr".includes(char)) {
    return fontSize * 0.28;
  }

  if ("mwMWQGOD@#%&".includes(char)) {
    return fontSize * 0.84;
  }

  if (font === "F2") {
    return fontSize * 0.6;
  }

  if (font === "F3") {
    return fontSize * 0.57;
  }

  return fontSize * 0.54;
}

function estimateTextWidth(text: string, fontSize: number, font: FontKey, charSpacing = 0) {
  let width = 0;

  for (let index = 0; index < text.length; index += 1) {
    width += estimateCharWidth(text[index] ?? "", fontSize, font);

    if (index < text.length - 1) {
      width += charSpacing;
    }
  }

  return width;
}

function splitWrappedText(
  value: string,
  maxWidth: number,
  fontSize: number,
  font: FontKey,
  charSpacing = 0,
) {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [""];
  }

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (estimateTextWidth(next, fontSize, font, charSpacing) <= maxWidth || current === "") {
      current = next;
      continue;
    }

    lines.push(current);
    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function ellipsizeText(
  value: string,
  maxWidth: number,
  fontSize: number,
  font: FontKey,
  charSpacing = 0,
) {
  const ellipsis = "…";

  if (estimateTextWidth(value, fontSize, font, charSpacing) <= maxWidth) {
    return value;
  }

  let output = value.trim();

  while (output.length > 1) {
    const candidate = `${output}${ellipsis}`;

    if (estimateTextWidth(candidate, fontSize, font, charSpacing) <= maxWidth) {
      return candidate;
    }

    output = output.slice(0, -1).trimEnd();
  }

  return ellipsis;
}

function fitWrappedText(params: {
  value: string;
  maxWidth: number;
  preferredSize: number;
  minSize: number;
  font: FontKey;
  maxLines: number;
  charSpacing?: number;
  lineHeightMultiplier?: number;
}) {
  const {
    value,
    maxWidth,
    preferredSize,
    minSize,
    font,
    maxLines,
    charSpacing = 0,
    lineHeightMultiplier = 1.15,
  } = params;

  for (let size = preferredSize; size >= minSize; size -= 1) {
    const lines = splitWrappedText(value, maxWidth, size, font, charSpacing);

    if (lines.length <= maxLines) {
      return {
        size,
        lines,
        lineHeight: size * lineHeightMultiplier,
        charSpacing,
      };
    }
  }

  const size = minSize;
  const rawLines = splitWrappedText(value, maxWidth, size, font, charSpacing);
  const lines = rawLines.slice(0, Math.max(maxLines - 1, 0));
  const remainingText = rawLines.slice(Math.max(maxLines - 1, 0)).join(" ");
  const lastLine = ellipsizeText(remainingText, maxWidth, size, font, charSpacing);

  if (maxLines > 0) {
    lines.push(lastLine);
  }

  return {
    size,
    lines,
    lineHeight: size * lineHeightMultiplier,
    charSpacing,
  };
}

function roundedRectPath(x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  const right = x + width;
  const top = y + height;
  const c = 0.5522847498;

  return [
    `${(x + r).toFixed(2)} ${y.toFixed(2)} m`,
    `${(right - r).toFixed(2)} ${y.toFixed(2)} l`,
    `${(right - r + r * c).toFixed(2)} ${y.toFixed(2)} ${right.toFixed(2)} ${(y + r - r * c).toFixed(2)} ${right.toFixed(2)} ${(y + r).toFixed(2)} c`,
    `${right.toFixed(2)} ${(top - r).toFixed(2)} l`,
    `${right.toFixed(2)} ${(top - r + r * c).toFixed(2)} ${(right - r + r * c).toFixed(2)} ${top.toFixed(2)} ${(right - r).toFixed(2)} ${top.toFixed(2)} c`,
    `${(x + r).toFixed(2)} ${top.toFixed(2)} l`,
    `${(x + r - r * c).toFixed(2)} ${top.toFixed(2)} ${x.toFixed(2)} ${(top - r + r * c).toFixed(2)} ${x.toFixed(2)} ${(top - r).toFixed(2)} c`,
    `${x.toFixed(2)} ${(y + r).toFixed(2)} l`,
    `${x.toFixed(2)} ${(y + r - r * c).toFixed(2)} ${(x + r - r * c).toFixed(2)} ${y.toFixed(2)} ${(x + r).toFixed(2)} ${y.toFixed(2)} c`,
    "h",
  ].join("\n");
}

function rectPath(x: number, y: number, width: number, height: number) {
  return [
    `${x.toFixed(2)} ${y.toFixed(2)} m`,
    `${(x + width).toFixed(2)} ${y.toFixed(2)} l`,
    `${(x + width).toFixed(2)} ${(y + height).toFixed(2)} l`,
    `${x.toFixed(2)} ${(y + height).toFixed(2)} l`,
    "h",
  ].join("\n");
}

function drawFilledRect(x: number, y: number, width: number, height: number, fill: string) {
  return ["q", `${hexToRgb(fill)} rg`, rectPath(x, y, width, height), "f", "Q"].join("\n");
}

function drawRoundedRectStroke(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  stroke: string,
  lineWidth = 1,
) {
  return [
    "q",
    `${hexToRgb(stroke)} RG`,
    `${lineWidth.toFixed(2)} w`,
    roundedRectPath(x, y, width, height, radius),
    "S",
    "Q",
  ].join("\n");
}

function drawLine(x1: number, y1: number, x2: number, y2: number, color: string, width = 1) {
  return [
    "q",
    `${hexToRgb(color)} RG`,
    `${width.toFixed(2)} w`,
    `${x1.toFixed(2)} ${y1.toFixed(2)} m`,
    `${x2.toFixed(2)} ${y2.toFixed(2)} l`,
    "S",
    "Q",
  ].join("\n");
}

function drawText(params: {
  text: string;
  x: number;
  y: number;
  size: number;
  font: FontKey;
  color: string;
  align?: "left" | "center" | "right";
  charSpacing?: number;
}) {
  const safeText = escapePdfText(params.text);
  const charSpacing = params.charSpacing ?? 0;
  const width = estimateTextWidth(params.text, params.size, params.font, charSpacing);

  let x = params.x;

  if (params.align === "center") {
    x = params.x - width / 2;
  } else if (params.align === "right") {
    x = params.x - width;
  }

  return [
    "BT",
    `/${params.font} ${params.size.toFixed(2)} Tf`,
    `${hexToRgb(params.color)} rg`,
    `${charSpacing.toFixed(2)} Tc`,
    `1 0 0 1 ${x.toFixed(2)} ${params.y.toFixed(2)} Tm`,
    `(${safeText}) Tj`,
    "ET",
  ].join("\n");
}

function drawImage(name: string, x: number, y: number, width: number, height: number) {
  return [
    "q",
    `${width.toFixed(2)} 0 0 ${height.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm`,
    `/${name} Do`,
    "Q",
  ].join("\n");
}

function createPdf(objects: ReadonlyArray<string | Buffer>) {
  const header = Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "binary");
  const chunks: Buffer[] = [header];
  const offsets: number[] = [0];

  let currentOffset = header.length;

  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(currentOffset);

    const prefix = Buffer.from(`${index + 1} 0 obj\n`, "ascii");
    const rawObject = objects[index];
    const body: Buffer =
      typeof rawObject === "string" ? Buffer.from(rawObject, "binary") : rawObject;
    const suffix = Buffer.from("\nendobj\n", "ascii");

    chunks.push(prefix, body, suffix);
    currentOffset += prefix.length + body.length + suffix.length;
  }

  const xrefStart = currentOffset;

  let xref = `xref\n0 ${objects.length + 1}\n`;
  xref += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    xref += `${offsets[index].toString().padStart(10, "0")} 00000 n \n`;
  }

  const trailer = [
    xref,
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`,
    `startxref\n${xrefStart}\n%%EOF`,
  ].join("");

  chunks.push(Buffer.from(trailer, "ascii"));

  return Buffer.concat(chunks);
}

function paethPredictor(a: number, b: number, c: number) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);

  if (pa <= pb && pa <= pc) {
    return a;
  }

  if (pb <= pc) {
    return b;
  }

  return c;
}

function parsePngToRgb(buffer: Buffer) {
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  if (!buffer.subarray(0, 8).equals(pngSignature)) {
    throw new Error("Unsupported image format. Expected PNG.");
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlaceMethod = 0;
  const idatParts: Buffer[] = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    offset += 4;

    const type = buffer.toString("ascii", offset, offset + 4);
    offset += 4;

    const data = buffer.subarray(offset, offset + length);
    offset += length;

    offset += 4;

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8] ?? 0;
      colorType = data[9] ?? 0;
      interlaceMethod = data[12] ?? 0;
    } else if (type === "IDAT") {
      idatParts.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (!width || !height) {
    throw new Error("PNG dimensions could not be read.");
  }

  if (bitDepth !== 8) {
    throw new Error("Only 8-bit PNG images are supported.");
  }

  if (interlaceMethod !== 0) {
    throw new Error("Interlaced PNG images are not supported.");
  }

  if (colorType !== 6 && colorType !== 2) {
    throw new Error("Only RGB and RGBA PNG images are supported.");
  }

  const channels = colorType === 6 ? 4 : 3;
  const bytesPerPixel = channels;
  const stride = width * channels;
  const inflated = inflateSync(Buffer.concat(idatParts));
  const reconstructed = Buffer.alloc(width * height * channels);

  let inputOffset = 0;
  let outputOffset = 0;

  for (let row = 0; row < height; row += 1) {
    const filterType = inflated[inputOffset] ?? 0;
    inputOffset += 1;

    for (let col = 0; col < stride; col += 1) {
      const raw = inflated[inputOffset] ?? 0;
      inputOffset += 1;

      const left =
        col >= bytesPerPixel ? (reconstructed[outputOffset + col - bytesPerPixel] ?? 0) : 0;
      const up = row > 0 ? (reconstructed[outputOffset - stride + col] ?? 0) : 0;
      const upLeft =
        row > 0 && col >= bytesPerPixel
          ? (reconstructed[outputOffset - stride + col - bytesPerPixel] ?? 0)
          : 0;

      let value = raw;

      if (filterType === 1) {
        value = (raw + left) & 0xff;
      } else if (filterType === 2) {
        value = (raw + up) & 0xff;
      } else if (filterType === 3) {
        value = (raw + Math.floor((left + up) / 2)) & 0xff;
      } else if (filterType === 4) {
        value = (raw + paethPredictor(left, up, upLeft)) & 0xff;
      }

      reconstructed[outputOffset + col] = value;
    }

    outputOffset += stride;
  }

  const rgb = Buffer.alloc(width * height * 3);

  if (colorType === 2) {
    for (let i = 0, j = 0; i < reconstructed.length; i += 3, j += 3) {
      rgb[j] = reconstructed[i] ?? 255;
      rgb[j + 1] = reconstructed[i + 1] ?? 255;
      rgb[j + 2] = reconstructed[i + 2] ?? 255;
    }
  } else {
    for (let i = 0, j = 0; i < reconstructed.length; i += 4, j += 3) {
      const r = reconstructed[i] ?? 255;
      const g = reconstructed[i + 1] ?? 255;
      const b = reconstructed[i + 2] ?? 255;
      const a = (reconstructed[i + 3] ?? 255) / 255;

      rgb[j] = Math.round(r * a + 255 * (1 - a));
      rgb[j + 1] = Math.round(g * a + 255 * (1 - a));
      rgb[j + 2] = Math.round(b * a + 255 * (1 - a));
    }
  }

  return {
    width,
    height,
    rgb,
  };
}

async function loadPngImage(params: {
  name: string;
  filePath: string;
  label: string;
}): Promise<PdfImage | null> {
  try {
    const file = await fs.readFile(params.filePath);
    const parsed = parsePngToRgb(file);

    return {
      name: params.name,
      width: parsed.width,
      height: parsed.height,
      compressedRgbData: deflateSync(parsed.rgb),
    };
  } catch (error) {
    console.error(`Unable to load ${params.label} for certificate PDF.`, error);
    return null;
  }
}

async function loadIntegratesgLogo() {
  return loadPngImage({
    name: "Im1",
    filePath: path.join(process.cwd(), "public", "branding", "logo.png"),
    label: "IntegratESG logo",
  });
}

async function loadCertificateRightArtwork() {
  return loadPngImage({
    name: "Im2",
    filePath: path.join(process.cwd(), "public", "branding", "certificate-right-artwork.png"),
    label: "certificate right artwork",
  });
}

function drawCalendarIcon(x: number, y: number, size: number, color: string) {
  const commands: string[] = [];
  const bodyWidth = size;
  const bodyHeight = size * 0.86;
  const radius = 3.5;

  commands.push(drawRoundedRectStroke(x, y, bodyWidth, bodyHeight, radius, color, 1.65));

  commands.push(
    drawLine(
      x,
      y + bodyHeight - size * 0.22,
      x + bodyWidth,
      y + bodyHeight - size * 0.22,
      color,
      1.4,
    ),
  );

  commands.push(
    drawLine(
      x + size * 0.22,
      y + bodyHeight,
      x + size * 0.22,
      y + bodyHeight + size * 0.12,
      color,
      1.65,
    ),
  );

  commands.push(
    drawLine(
      x + size * 0.78,
      y + bodyHeight,
      x + size * 0.78,
      y + bodyHeight + size * 0.12,
      color,
      1.65,
    ),
  );

  return commands.join("\n");
}

function makeImageObject(image: PdfImage) {
  return Buffer.concat([
    Buffer.from(
      `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${image.compressedRgbData.length} >>\nstream\n`,
      "ascii",
    ),
    image.compressedRgbData,
    Buffer.from("\nendstream", "ascii"),
  ]);
}

export async function buildCurriculumCertificatePdf(input: CurriculumCertificatePdfInput) {
  const issueDate = formatIssueDate(input.issuedAt);
  const logo = await loadIntegratesgLogo();
  const rightArtwork = await loadCertificateRightArtwork();

  const commands: string[] = [];

  const nameBlock = fitWrappedText({
    value: input.learnerName,
    maxWidth: 500,
    preferredSize: 39,
    minSize: 26,
    font: "F2",
    maxLines: 2,
    lineHeightMultiplier: 1.12,
  });

  const moduleBlock = fitWrappedText({
    value: input.moduleTitle,
    maxWidth: 520,
    preferredSize: 27,
    minSize: 18,
    font: "F2",
    maxLines: 2,
    lineHeightMultiplier: 1.12,
  });

  const certificateIdBlock = fitWrappedText({
    value: input.certificateId,
    maxWidth: 170,
    preferredSize: 12,
    minSize: 9,
    font: "F1",
    maxLines: 2,
    lineHeightMultiplier: 1.2,
  });

  commands.push(drawFilledRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, BRAND_COLORS.background));

  if (rightArtwork) {
    const artworkHeight = PAGE_HEIGHT;
    const artworkWidth = (rightArtwork.width / rightArtwork.height) * artworkHeight;
    const artworkX = PAGE_WIDTH - artworkWidth;

    commands.push(drawImage(rightArtwork.name, artworkX, 0, artworkWidth, artworkHeight));
  }

  if (logo) {
    const logoWidth = 155;
    const logoHeight = (logo.height / logo.width) * logoWidth;
    commands.push(drawImage(logo.name, 56, 515 - logoHeight, logoWidth, logoHeight));
  } else {
    commands.push(
      drawText({
        text: "IntegratESG",
        x: 56,
        y: 506,
        size: 24,
        font: "F2",
        color: BRAND_COLORS.text,
      }),
    );
  }

  commands.push(
    drawText({
      text: "CERTIFICATE",
      x: 56,
      y: 416,
      size: 56,
      font: "F2",
      color: BRAND_COLORS.navy,
    }),
  );

  commands.push(
    drawText({
      text: "OF COMPLETION",
      x: 56,
      y: 378,
      size: 22.5,
      font: "F1",
      color: BRAND_COLORS.navySoft,
      charSpacing: 2.7,
    }),
  );

  commands.push(drawLine(56, 356, 104, 356, BRAND_COLORS.green, 2.2));

  commands.push(
    drawText({
      text: "This is to certify that",
      x: 56,
      y: 314,
      size: 16,
      font: "F1",
      color: BRAND_COLORS.navySoft,
    }),
  );

  let nameBaseline = 263;
  for (const line of nameBlock.lines) {
    commands.push(
      drawText({
        text: line,
        x: 56,
        y: nameBaseline,
        size: nameBlock.size,
        font: "F2",
        color: BRAND_COLORS.text,
      }),
    );
    nameBaseline -= nameBlock.lineHeight;
  }

  const afterNameY = nameBaseline + nameBlock.lineHeight - 43;

  commands.push(
    drawText({
      text: "has successfully completed the curriculum module",
      x: 56,
      y: afterNameY,
      size: 16,
      font: "F1",
      color: BRAND_COLORS.navy,
    }),
  );

  let moduleBaseline = afterNameY - 47;
  for (const line of moduleBlock.lines) {
    commands.push(
      drawText({
        text: line,
        x: 56,
        y: moduleBaseline,
        size: moduleBlock.size,
        font: "F2",
        color: BRAND_COLORS.green,
      }),
    );
    moduleBaseline -= moduleBlock.lineHeight;
  }

  const afterModuleY = moduleBaseline + moduleBlock.lineHeight;
  const completedBaseline = Math.max(98, Math.min(129, afterModuleY - 43));

  const completedIconSize = 18;
  const completedIconX = 56;
  const completedIconY = completedBaseline - 3;

  commands.push(
    drawCalendarIcon(completedIconX, completedIconY, completedIconSize, BRAND_COLORS.green),
  );

  commands.push(
    drawText({
      text: `Completed on: ${issueDate}`,
      x: 86,
      y: completedBaseline,
      size: 16,
      font: "F1",
      color: BRAND_COLORS.text,
    }),
  );

  const separatorY = Math.max(62, completedBaseline - 34);
  const footerY = Math.max(22, separatorY - 68);

  commands.push(drawLine(56, separatorY, 492, separatorY, BRAND_COLORS.line, 1));

  const footerSeparatorX = 218;
  const issuedByX = footerSeparatorX + 24;

  commands.push(
    drawText({
      text: "Certificate ID",
      x: 56,
      y: footerY + 40,
      size: 10,
      font: "F1",
      color: BRAND_COLORS.navySoft,
    }),
  );

  let certificateIdBaseline = footerY + 18;
  for (const line of certificateIdBlock.lines) {
    commands.push(
      drawText({
        text: line,
        x: 56,
        y: certificateIdBaseline,
        size: certificateIdBlock.size,
        font: "F1",
        color: BRAND_COLORS.navySoft,
      }),
    );
    certificateIdBaseline -= certificateIdBlock.lineHeight;
  }

  commands.push(
    drawLine(footerSeparatorX, footerY - 2, footerSeparatorX, footerY + 54, BRAND_COLORS.line, 1),
  );

  commands.push(
    drawText({
      text: "Issued by IntegratESG",
      x: issuedByX,
      y: footerY + 42,
      size: 11.5,
      font: "F2",
      color: BRAND_COLORS.navySoft,
    }),
  );

  commands.push(
    drawText({
      text: "Empowering educators and learners",
      x: issuedByX,
      y: footerY + 23,
      size: 10.5,
      font: "F1",
      color: BRAND_COLORS.navySoft,
    }),
  );

  commands.push(
    drawText({
      text: "with practical ESG knowledge for a sustainable future.",
      x: issuedByX,
      y: footerY + 7,
      size: 10.2,
      font: "F1",
      color: BRAND_COLORS.navySoft,
    }),
  );

  const contentStream = commands.join("\n");
  const contentLength = Buffer.byteLength(contentStream, "binary");

  const images = [logo, rightArtwork].filter((image): image is PdfImage => Boolean(image));

  const imageResourceEntries = images
    .map((image, index) => `/${image.name} ${8 + index} 0 R`)
    .join(" ");

  const fontResources = "/Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >>";
  const xObjectResources = imageResourceEntries ? ` /XObject << ${imageResourceEntries} >>` : "";
  const pageResources = `<< ${fontResources}${xObjectResources} >>`;

  const objects: Array<string | Buffer> = [
    `<< /Type /Catalog /Pages 2 0 R >>`,
    `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources ${pageResources} /Contents 4 0 R >>`,
    `<< /Length ${contentLength} >>\nstream\n${contentStream}\nendstream`,
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`,
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`,
    `<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>`,
  ];

  for (const image of images) {
    objects.push(makeImageObject(image));
  }

  return createPdf(objects);
}
