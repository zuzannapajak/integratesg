import { beforeEach, describe, expect, it, vi } from "vitest";

type TranslationRecord = {
  language: string;
  title: string;
  summary: string | null;
  organization: string | null;
  industry: string | null;
};

type LibraryRecord = {
  slug: string;
  countryCode: string;
  reportingPeriod: string | null;
  isFeatured: boolean;
  translations: TranslationRecord[];
  userProgress: Array<{
    status: "not_started" | "in_progress" | "completed";
    lastOpenedAt: Date | null;
  }>;
};

type FindManyArgs = {
  where?: {
    status?: string;
  };
  select?: {
    translations?: {
      where?: {
        language?: {
          in?: string[];
        };
      };
    };
    userProgress?: {
      where?: {
        userId?: string;
      };
    };
  };
};

const mocks = vi.hoisted(() => ({
  findMany: vi.fn<(args: FindManyArgs) => Promise<LibraryRecord[]>>(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    caseStudy: {
      findMany: mocks.findMany,
    },
  },
}));

import { getEportfolioLibrary } from "@/lib/eportfolio/library";

function record(overrides: Partial<LibraryRecord> = {}): LibraryRecord {
  return {
    slug: "barilla",
    countryCode: "IT",
    reportingPeriod: "2024",
    isFeatured: false,
    translations: [
      {
        language: "en",
        title: "Barilla S.p.A.",
        summary: "English summary",
        organization: "Barilla G. e R. Fratelli S.p.A.",
        industry: "Food and Beverage Manufacturing",
      },
    ],
    userProgress: [],
    ...overrides,
  };
}

describe("getEportfolioLibrary", () => {
  beforeEach(() => {
    mocks.findMany.mockReset();
  });

  it("requests only published case studies for the learner library", async () => {
    mocks.findMany.mockResolvedValue([record()]);

    await getEportfolioLibrary({
      locale: "en",
      userId: "learner-1",
    });

    const query = mocks.findMany.mock.calls.at(0)?.at(0);

    expect(query?.where).toEqual({
      status: "published",
    });
  });

  it("requests the current locale plus English fallback", async () => {
    mocks.findMany.mockResolvedValue([record()]);

    await getEportfolioLibrary({
      locale: "pl",
      userId: "learner-1",
    });

    const query = mocks.findMany.mock.calls.at(0)?.at(0);

    expect(query?.select?.translations?.where?.language?.in).toEqual(["pl", "en"]);

    expect(query?.select?.userProgress?.where?.userId).toBe("learner-1");
  });

  it("falls back to English when the requested translation is unavailable", async () => {
    mocks.findMany.mockResolvedValue([record()]);

    const result = await getEportfolioLibrary({
      locale: "pl",
      userId: "learner-1",
    });

    expect(result).toHaveLength(1);

    expect(result.at(0)).toMatchObject({
      title: "Barilla S.p.A.",
      summary: "English summary",
      organization: "Barilla G. e R. Fratelli S.p.A.",
      progress: "not_started",
    });
  });

  it("prefers the requested language over the English fallback", async () => {
    mocks.findMany.mockResolvedValue([
      record({
        translations: [
          {
            language: "en",
            title: "English title",
            summary: "English summary",
            organization: "English organisation",
            industry: "English industry",
          },
          {
            language: "pl",
            title: "Polski tytuł",
            summary: "Polskie podsumowanie",
            organization: "Polska organizacja",
            industry: "Polska branża",
          },
        ],
      }),
    ]);

    const result = await getEportfolioLibrary({
      locale: "pl",
      userId: "learner-1",
    });

    expect(result.at(0)).toMatchObject({
      title: "Polski tytuł",
      summary: "Polskie podsumowanie",
      organization: "Polska organizacja",
      industry: "Polska branża",
    });
  });

  it("maps persisted progress status onto the library card", async () => {
    mocks.findMany.mockResolvedValue([
      record({
        userProgress: [
          {
            status: "completed",
            lastOpenedAt: new Date("2026-09-22T10:00:00.000Z"),
          },
        ],
      }),
    ]);

    const result = await getEportfolioLibrary({
      locale: "en",
      userId: "learner-1",
    });

    expect(result.at(0)?.progress).toBe("completed");
  });
});
