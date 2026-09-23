import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findMany: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    caseStudy: {
      findMany: mocks.findMany,
    },
  },
}));

import { getEportfolioCaseStudyDetail } from "@/lib/eportfolio/detail";

type DetailTranslation = {
  language: string;
  title: string;
  summary: string | null;
  content: string;
  keyTakeaways: string[];
  organization: string | null;
  industry: string | null;
};

type DetailRecord = {
  slug: string;
  sortOrder: number;
  countryCode: string;
  reportingPeriod: string | null;
  sourcePartner: string | null;
  isFeatured: boolean;
  translations: DetailTranslation[];
  userProgress: Array<{
    status: "not_started" | "in_progress" | "completed";
    lastOpenedAt: Date | null;
  }>;
};

function detailRecord(overrides: Partial<DetailRecord> = {}): DetailRecord {
  return {
    slug: "barilla",
    sortOrder: 10,
    countryCode: "IT",
    reportingPeriod: "2024",
    sourcePartner: "EGInA",
    isFeatured: false,
    translations: [
      {
        language: "en",
        title: "Barilla S.p.A.",
        summary: "English summary",
        content: "## Company overview\n\nEnglish content",
        keyTakeaways: ["English takeaway"],
        organization: "Barilla G. e R. Fratelli S.p.A.",
        industry: "Food and Beverage Manufacturing",
      },
    ],
    userProgress: [],
    ...overrides,
  };
}

describe("getEportfolioCaseStudyDetail", () => {
  beforeEach(() => {
    mocks.findMany.mockReset();
  });

  it("queries only published case studies", async () => {
    mocks.findMany.mockResolvedValue([detailRecord()]);

    await getEportfolioCaseStudyDetail({
      locale: "en",
      userId: "learner-1",
      slug: "barilla",
    });

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: "published",
        },
      }),
    );
  });

  it("falls back to English for the detail page", async () => {
    mocks.findMany.mockResolvedValue([detailRecord()]);

    const result = await getEportfolioCaseStudyDetail({
      locale: "de",
      userId: "learner-1",
      slug: "barilla",
    });

    expect(result).toMatchObject({
      slug: "barilla",
      title: "Barilla S.p.A.",
      summary: "English summary",
      content: "## Company overview\n\nEnglish content",
      keyTakeaways: ["English takeaway"],
    });
  });

  it("prefers the requested translation when it exists", async () => {
    mocks.findMany.mockResolvedValue([
      detailRecord({
        translations: [
          {
            language: "en",
            title: "English title",
            summary: "English summary",
            content: "## Company overview\n\nEnglish content",
            keyTakeaways: ["English takeaway"],
            organization: "English organisation",
            industry: "English industry",
          },
          {
            language: "it",
            title: "Titolo italiano",
            summary: "Riassunto italiano",
            content: "## Company overview\n\nContenuto italiano",
            keyTakeaways: ["Punto italiano"],
            organization: "Organizzazione italiana",
            industry: "Settore italiano",
          },
        ],
      }),
    ]);

    const result = await getEportfolioCaseStudyDetail({
      locale: "it",
      userId: "learner-1",
      slug: "barilla",
    });

    expect(result).toMatchObject({
      title: "Titolo italiano",
      summary: "Riassunto italiano",
      content: "## Company overview\n\nContenuto italiano",
      keyTakeaways: ["Punto italiano"],
    });
  });

  it("returns null when the requested slug is not in the published result set", async () => {
    mocks.findMany.mockResolvedValue([detailRecord()]);

    const result = await getEportfolioCaseStudyDetail({
      locale: "en",
      userId: "learner-1",
      slug: "draft-or-missing-case",
    });

    expect(result).toBeNull();
  });
});
