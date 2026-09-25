import { randomUUID } from "node:crypto";

import { afterEach, describe, expect, it } from "vitest";

import { getEportfolioCaseStudyDetail } from "@/lib/eportfolio/detail";
import { getEportfolioLibrary } from "@/lib/eportfolio/library";
import { prisma } from "@/lib/prisma";

const createdCaseStudyIds = new Set<string>();
const createdProfileIds = new Set<string>();

function unique(prefix: string) {
  return `${prefix}-${randomUUID()}`;
}

async function createProfile(label: string) {
  const id = unique(`eportfolio-query-${label}`);

  const profile = await prisma.profile.create({
    data: {
      id,
      email: `${id}@example.test`,
      fullName: `ePortfolio query ${label}`,
      preferredLanguage: "en",
      role: "learner",
    },
  });

  createdProfileIds.add(profile.id);

  return profile;
}

type TranslationInput = {
  language: string;
  title: string;
  summary?: string | null;
  content: string;
  organization?: string | null;
  industry?: string | null;
  keyTakeaways?: string[];
};

async function createCaseStudy(params: {
  label: string;
  status?: "draft" | "published";
  sortOrder?: number;
  countryCode?: string;
  reportingPeriod?: string | null;
  sourcePartner?: string | null;
  isFeatured?: boolean;
  translations?: TranslationInput[];
}) {
  const slug = unique(`p1-eportfolio-${params.label}`);

  const caseStudy = await prisma.caseStudy.create({
    data: {
      slug,
      area: "social",
      status: params.status ?? "published",
      sortOrder: params.sortOrder ?? 0,
      isFeatured: params.isFeatured ?? false,
      countryCode: params.countryCode ?? "PL",
      reportingPeriod: params.reportingPeriod ?? "2026",
      sourcePartner: params.sourcePartner ?? "P1 integration test",
      translations: {
        create: params.translations ?? [
          {
            language: "en",
            title: `Case study ${params.label}`,
            summary: `Summary ${params.label}`,
            content: `Content ${params.label}`,
            organization: `Organisation ${params.label}`,
            industry: "Technology",
            keyTakeaways: [`Takeaway ${params.label}`],
          },
        ],
      },
    },
  });

  createdCaseStudyIds.add(caseStudy.id);

  return caseStudy;
}

afterEach(async () => {
  if (createdCaseStudyIds.size > 0) {
    await prisma.caseStudy.deleteMany({
      where: {
        id: {
          in: [...createdCaseStudyIds],
        },
      },
    });

    createdCaseStudyIds.clear();
  }

  if (createdProfileIds.size > 0) {
    await prisma.profile.deleteMany({
      where: {
        id: {
          in: [...createdProfileIds],
        },
      },
    });

    createdProfileIds.clear();
  }
});

describe("ePortfolio database queries", () => {
  it("returns published case studies in sortOrder and isolates progress by user", async () => {
    const userA = await createProfile("user-a");
    const userB = await createProfile("user-b");

    const first = await createCaseStudy({
      label: "ordered-first",
      sortOrder: -2_140_000_000,
    });

    const second = await createCaseStudy({
      label: "ordered-second",
      sortOrder: -2_139_999_999,
    });

    const draft = await createCaseStudy({
      label: "draft-hidden",
      status: "draft",
      sortOrder: -2_140_000_001,
    });

    await prisma.userCaseStudyProgress.create({
      data: {
        userId: userA.id,
        caseStudyId: first.id,
        status: "in_progress",
        startedAt: new Date(),
        lastOpenedAt: new Date(),
      },
    });

    await prisma.userCaseStudyProgress.create({
      data: {
        userId: userB.id,
        caseStudyId: second.id,
        status: "completed",
        startedAt: new Date(),
        lastOpenedAt: new Date(),
        completedAt: new Date(),
      },
    });

    const library = await getEportfolioLibrary({
      locale: "en",
      userId: userA.id,
    });

    const relevant = library.filter((item) =>
      [first.slug, second.slug, draft.slug].includes(item.slug),
    );

    expect(relevant.map((item) => item.slug)).toEqual([first.slug, second.slug]);

    expect(relevant.find((item) => item.slug === first.slug)?.progress).toBe("in_progress");

    expect(relevant.find((item) => item.slug === second.slug)?.progress).toBe("not_started");

    expect(relevant.some((item) => item.slug === draft.slug)).toBe(false);
  });

  it("uses the requested locale and falls back to English when needed", async () => {
    const user = await createProfile("locale");

    const localized = await createCaseStudy({
      label: "localized",
      sortOrder: -2_130_000_000,
      translations: [
        {
          language: "en",
          title: "English localized title",
          summary: "English localized summary",
          content: "English localized content",
          organization: "English organisation",
          industry: "Technology",
          keyTakeaways: ["English lesson"],
        },
        {
          language: "pl",
          title: "Polski tytuł",
          summary: "Polskie podsumowanie",
          content: "Polska treść",
          organization: "Polska organizacja",
          industry: "Technologia",
          keyTakeaways: ["Polska lekcja"],
        },
      ],
    });

    const fallback = await createCaseStudy({
      label: "english-fallback",
      sortOrder: -2_129_999_999,
      translations: [
        {
          language: "en",
          title: "English fallback title",
          summary: "English fallback summary",
          content: "English fallback content",
          organization: "Fallback organisation",
          industry: "Energy",
          keyTakeaways: ["Fallback lesson"],
        },
      ],
    });

    const library = await getEportfolioLibrary({
      locale: "pl",
      userId: user.id,
    });

    expect(library.find((item) => item.slug === localized.slug)).toMatchObject({
      title: "Polski tytuł",
      summary: "Polskie podsumowanie",
      organization: "Polska organizacja",
      industry: "Technologia",
    });

    expect(library.find((item) => item.slug === fallback.slug)).toMatchObject({
      title: "English fallback title",
      summary: "English fallback summary",
      organization: "Fallback organisation",
      industry: "Energy",
    });

    const localizedDetail = await getEportfolioCaseStudyDetail({
      locale: "pl",
      userId: user.id,
      slug: localized.slug,
    });

    expect(localizedDetail).toMatchObject({
      slug: localized.slug,
      title: "Polski tytuł",
      content: "Polska treść",
      organization: "Polska organizacja",
      industry: "Technologia",
      keyTakeaways: ["Polska lekcja"],
    });

    const fallbackDetail = await getEportfolioCaseStudyDetail({
      locale: "pl",
      userId: user.id,
      slug: fallback.slug,
    });

    expect(fallbackDetail).toMatchObject({
      slug: fallback.slug,
      title: "English fallback title",
      content: "English fallback content",
      organization: "Fallback organisation",
      industry: "Energy",
      keyTakeaways: ["Fallback lesson"],
    });
  });

  it("returns null for missing and draft slugs and points to the next published case study", async () => {
    const user = await createProfile("detail-order");

    const current = await createCaseStudy({
      label: "detail-current",
      sortOrder: -2_120_000_000,
      translations: [
        {
          language: "en",
          title: "Current case study",
          content: "Current content",
          industry: "Finance",
        },
      ],
    });

    const draft = await createCaseStudy({
      label: "detail-draft",
      status: "draft",
      sortOrder: -2_119_999_999,
    });

    const next = await createCaseStudy({
      label: "detail-next",
      sortOrder: -2_119_999_998,
      translations: [
        {
          language: "en",
          title: "Next case study",
          content: "Next content",
          industry: "Manufacturing",
        },
      ],
    });

    const detail = await getEportfolioCaseStudyDetail({
      locale: "en",
      userId: user.id,
      slug: current.slug,
    });

    expect(detail).not.toBeNull();

    expect(detail?.nextCaseStudy).toEqual({
      slug: next.slug,
      title: "Next case study",
    });

    await expect(
      getEportfolioCaseStudyDetail({
        locale: "en",
        userId: user.id,
        slug: draft.slug,
      }),
    ).resolves.toBeNull();

    await expect(
      getEportfolioCaseStudyDetail({
        locale: "en",
        userId: user.id,
        slug: unique("missing-case-study"),
      }),
    ).resolves.toBeNull();
  });

  it("returns persisted progress in detail without leaking another user's state", async () => {
    const userA = await createProfile("detail-user-a");
    const userB = await createProfile("detail-user-b");

    const caseStudy = await createCaseStudy({
      label: "detail-isolation",
      sortOrder: -2_110_000_000,
    });

    await prisma.userCaseStudyProgress.create({
      data: {
        userId: userB.id,
        caseStudyId: caseStudy.id,
        status: "completed",
        startedAt: new Date(),
        lastOpenedAt: new Date(),
        completedAt: new Date(),
      },
    });

    const detailForA = await getEportfolioCaseStudyDetail({
      locale: "en",
      userId: userA.id,
      slug: caseStudy.slug,
    });

    const detailForB = await getEportfolioCaseStudyDetail({
      locale: "en",
      userId: userB.id,
      slug: caseStudy.slug,
    });

    expect(detailForA?.progress).toBe("not_started");
    expect(detailForB?.progress).toBe("completed");
  });
});
