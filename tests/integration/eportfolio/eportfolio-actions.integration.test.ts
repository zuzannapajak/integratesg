import { randomUUID } from "node:crypto";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const authMocks = vi.hoisted(() => ({
  requireAuthenticatedUserId: vi.fn(),
}));

const cacheMocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth/require-authenticated-user-id", () => ({
  requireAuthenticatedUserId: authMocks.requireAuthenticatedUserId,
}));

vi.mock("next/cache", () => ({
  revalidatePath: cacheMocks.revalidatePath,
}));

import {
  completeCaseStudyAction,
  touchCaseStudyProgressAction,
} from "@/features/eportfolio/actions";
import { prisma } from "@/lib/prisma";

const createdCaseStudyIds = new Set<string>();
const createdProfileIds = new Set<string>();

function unique(prefix: string) {
  return `${prefix}-${randomUUID()}`;
}

async function createProfile(label: string) {
  const id = unique(`eportfolio-action-${label}`);

  const profile = await prisma.profile.create({
    data: {
      id,
      email: `${id}@example.test`,
      fullName: `ePortfolio action ${label}`,
      preferredLanguage: "en",
      role: "learner",
    },
  });

  createdProfileIds.add(profile.id);

  return profile;
}

async function createCaseStudy(params: { label: string; status?: "draft" | "published" }) {
  const slug = unique(`p1-eportfolio-action-${params.label}`);

  const caseStudy = await prisma.caseStudy.create({
    data: {
      slug,
      area: "social",
      status: params.status ?? "published",
      sortOrder: 30_000,
      isFeatured: false,
      countryCode: "PL",
      reportingPeriod: "2026",
      sourcePartner: "P1 integration test",
      translations: {
        create: {
          language: "en",
          title: `Action case ${params.label}`,
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

beforeEach(() => {
  authMocks.requireAuthenticatedUserId.mockReset();
  cacheMocks.revalidatePath.mockReset();
});

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

describe("ePortfolio progress actions", () => {
  it("requires authentication before writing progress", async () => {
    const caseStudy = await createCaseStudy({
      label: "unauthenticated",
    });

    authMocks.requireAuthenticatedUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    await expect(
      touchCaseStudyProgressAction({
        locale: "en",
        slug: caseStudy.slug,
      }),
    ).rejects.toThrow("Unauthorized");

    expect(
      await prisma.userCaseStudyProgress.count({
        where: {
          caseStudyId: caseStudy.id,
        },
      }),
    ).toBe(0);
  });

  it("binds mutations to the authenticated user and ignores a forged userId", async () => {
    const userA = await createProfile("security-a");
    const userB = await createProfile("security-b");
    const caseStudy = await createCaseStudy({
      label: "security",
    });

    authMocks.requireAuthenticatedUserId.mockResolvedValue(userA.id);

    const result = await completeCaseStudyAction({
      locale: "en",
      slug: caseStudy.slug,
      userId: userB.id,
    } as never);

    expect(result.status).toBe("completed");

    expect(
      await prisma.userCaseStudyProgress.findUnique({
        where: {
          userId_caseStudyId: {
            userId: userA.id,
            caseStudyId: caseStudy.id,
          },
        },
      }),
    ).toMatchObject({
      status: "completed",
    });

    expect(
      await prisma.userCaseStudyProgress.findUnique({
        where: {
          userId_caseStudyId: {
            userId: userB.id,
            caseStudyId: caseStudy.id,
          },
        },
      }),
    ).toBeNull();

    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith("/en/eportfolio");

    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith(`/en/eportfolio/${caseStudy.slug}`);
  });

  it("rejects invalid slug and locale input before creating progress", async () => {
    const user = await createProfile("validation");

    authMocks.requireAuthenticatedUserId.mockResolvedValue(user.id);

    await expect(
      touchCaseStudyProgressAction({
        locale: "en",
        slug: "../another-case",
      }),
    ).rejects.toThrow("Invalid case study slug.");

    await expect(
      completeCaseStudyAction({
        locale: "english",
        slug: "valid-case-study",
      }),
    ).rejects.toThrow("Invalid locale.");

    expect(authMocks.requireAuthenticatedUserId).not.toHaveBeenCalled();

    expect(
      await prisma.userCaseStudyProgress.count({
        where: {
          userId: user.id,
        },
      }),
    ).toBe(0);
  });

  it("does not allow a draft case study to receive progress", async () => {
    const user = await createProfile("draft");
    const draft = await createCaseStudy({
      label: "draft",
      status: "draft",
    });

    authMocks.requireAuthenticatedUserId.mockResolvedValue(user.id);

    await expect(
      completeCaseStudyAction({
        locale: "en",
        slug: draft.slug,
      }),
    ).rejects.toThrow("Case study not found.");

    expect(
      await prisma.userCaseStudyProgress.count({
        where: {
          userId: user.id,
          caseStudyId: draft.id,
        },
      }),
    ).toBe(0);
  });
});
