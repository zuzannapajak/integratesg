import { randomUUID } from "node:crypto";

import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { completeEportfolioProgress, touchEportfolioProgress } from "@/lib/eportfolio/progress";
import { prisma } from "@/lib/prisma";

const createdCaseStudyIds = new Set<string>();
const createdProfileIds = new Set<string>();

function unique(prefix: string) {
  return `${prefix}-${randomUUID()}`;
}

async function createProfile(label: string) {
  const id = unique(`eportfolio-progress-${label}`);

  const profile = await prisma.profile.create({
    data: {
      id,
      email: `${id}@example.test`,
      fullName: `ePortfolio progress ${label}`,
      preferredLanguage: "en",
      role: "learner",
    },
  });

  createdProfileIds.add(profile.id);

  return profile;
}

async function createCaseStudy(params: { label: string; status?: "draft" | "published" }) {
  const slug = unique(`p1-eportfolio-progress-${params.label}`);

  const caseStudy = await prisma.caseStudy.create({
    data: {
      slug,
      area: "social",
      status: params.status ?? "published",
      sortOrder: 20_000,
      isFeatured: false,
      countryCode: "PL",
      reportingPeriod: "2026",
      sourcePartner: "P1 integration test",
      translations: {
        create: {
          language: "en",
          title: `Progress case ${params.label}`,
          summary: `Summary ${params.label}`,
          content: `Content ${params.label}`,
          organization: `Organisation ${params.label}`,
          industry: "Technology",
          keyTakeaways: [`Takeaway ${params.label}`],
        },
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

describe("ePortfolio progress persistence", () => {
  it("starts progress on first open and never regresses a completed case study", async () => {
    const user = await createProfile("touch");
    const caseStudy = await createCaseStudy({
      label: "touch",
    });

    const opened = await touchEportfolioProgress({
      userId: user.id,
      slug: caseStudy.slug,
    });

    expect(opened.status).toBe("in_progress");
    expect(opened.startedAt).not.toBeNull();
    expect(opened.lastOpenedAt).not.toBeNull();
    expect(opened.completedAt).toBeNull();

    const completed = await completeEportfolioProgress({
      userId: user.id,
      slug: caseStudy.slug,
    });

    const completedAt = completed.completedAt?.toISOString();

    expect(completed.status).toBe("completed");
    expect(completedAt).toBeDefined();

    const reopened = await touchEportfolioProgress({
      userId: user.id,
      slug: caseStudy.slug,
    });

    expect(reopened.status).toBe("completed");
    expect(reopened.completedAt?.toISOString()).toBe(completedAt);
  });

  it("keeps repeated completion idempotent and stores only one progress row", async () => {
    const user = await createProfile("idempotent");
    const caseStudy = await createCaseStudy({
      label: "idempotent",
    });

    const first = await completeEportfolioProgress({
      userId: user.id,
      slug: caseStudy.slug,
    });

    const second = await completeEportfolioProgress({
      userId: user.id,
      slug: caseStudy.slug,
    });

    expect(first.status).toBe("completed");
    expect(second.status).toBe("completed");

    expect(second.completedAt?.toISOString()).toBe(first.completedAt?.toISOString());

    expect(
      await prisma.userCaseStudyProgress.count({
        where: {
          userId: user.id,
          caseStudyId: caseStudy.id,
        },
      }),
    ).toBe(1);
  });

  it("isolates progress between users", async () => {
    const userA = await createProfile("isolation-a");
    const userB = await createProfile("isolation-b");
    const caseStudy = await createCaseStudy({
      label: "isolation",
    });

    await touchEportfolioProgress({
      userId: userA.id,
      slug: caseStudy.slug,
    });

    await completeEportfolioProgress({
      userId: userB.id,
      slug: caseStudy.slug,
    });

    const progressA = await prisma.userCaseStudyProgress.findUniqueOrThrow({
      where: {
        userId_caseStudyId: {
          userId: userA.id,
          caseStudyId: caseStudy.id,
        },
      },
    });

    const progressB = await prisma.userCaseStudyProgress.findUniqueOrThrow({
      where: {
        userId_caseStudyId: {
          userId: userB.id,
          caseStudyId: caseStudy.id,
        },
      },
    });

    expect(progressA.status).toBe("in_progress");
    expect(progressA.completedAt).toBeNull();

    expect(progressB.status).toBe("completed");
    expect(progressB.completedAt).not.toBeNull();
  });

  it("handles concurrent completion requests without duplicate rows or state regression", async () => {
    const user = await createProfile("concurrent");
    const caseStudy = await createCaseStudy({
      label: "concurrent",
    });

    await touchEportfolioProgress({
      userId: user.id,
      slug: caseStudy.slug,
    });

    const results = await Promise.all(
      Array.from({ length: 5 }, () =>
        completeEportfolioProgress({
          userId: user.id,
          slug: caseStudy.slug,
        }),
      ),
    );

    expect(results.every((result) => result.status === "completed")).toBe(true);

    const rows = await prisma.userCaseStudyProgress.findMany({
      where: {
        userId: user.id,
        caseStudyId: caseStudy.id,
      },
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]?.status).toBe("completed");
    expect(rows[0]?.startedAt).not.toBeNull();
    expect(rows[0]?.lastOpenedAt).not.toBeNull();
    expect(rows[0]?.completedAt).not.toBeNull();
  });

  it("refuses progress mutations for draft and missing case studies", async () => {
    const user = await createProfile("unavailable");
    const draft = await createCaseStudy({
      label: "draft",
      status: "draft",
    });

    await expect(
      touchEportfolioProgress({
        userId: user.id,
        slug: draft.slug,
      }),
    ).rejects.toThrow("Case study not found.");

    await expect(
      completeEportfolioProgress({
        userId: user.id,
        slug: unique("missing-case-study"),
      }),
    ).rejects.toThrow("Case study not found.");

    expect(
      await prisma.userCaseStudyProgress.count({
        where: {
          userId: user.id,
        },
      }),
    ).toBe(0);
  });
});
