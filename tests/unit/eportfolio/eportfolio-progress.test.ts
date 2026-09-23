import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  caseStudyFindFirst: vi.fn(),
  progressUpsert: vi.fn(),
  progressUpdateMany: vi.fn(),
  progressFindUnique: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    caseStudy: {
      findFirst: mocks.caseStudyFindFirst,
    },
    userCaseStudyProgress: {
      upsert: mocks.progressUpsert,
      updateMany: mocks.progressUpdateMany,
      findUnique: mocks.progressFindUnique,
    },
  },
}));

import { completeEportfolioProgress, touchEportfolioProgress } from "@/lib/eportfolio/progress";

type ProgressStatus = "not_started" | "in_progress" | "completed";

type ProgressRow = {
  id: string;
  userId: string;
  caseStudyId: string;
  status: ProgressStatus;
  startedAt: Date | null;
  lastOpenedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
};

type UpsertArgs = {
  where: {
    userId_caseStudyId: {
      userId: string;
      caseStudyId: string;
    };
  };
  create: Omit<ProgressRow, "id" | "createdAt">;
  update: Partial<ProgressRow>;
};

type UpdateCondition = {
  id?: string;
  startedAt?: null;
  completedAt?: null;
  status?: {
    not?: ProgressStatus;
  };
  OR?: UpdateCondition[];
};

type UpdateManyArgs = {
  where: UpdateCondition;
  data: Partial<ProgressRow>;
};

type FindUniqueArgs = {
  where: {
    userId_caseStudyId: {
      userId: string;
      caseStudyId: string;
    };
  };
};

const cases = new Map([
  [
    "barilla",
    {
      id: "case-barilla",
      status: "published",
    },
  ],
  [
    "draft-case",
    {
      id: "case-draft",
      status: "draft",
    },
  ],
]);

let rows = new Map<string, ProgressRow>();

let sequence = 0;

function key(userId: string, caseStudyId: string) {
  return `${userId}:${caseStudyId}`;
}

function matchesCondition(row: ProgressRow, condition: UpdateCondition): boolean {
  if (condition.id !== undefined && row.id !== condition.id) {
    return false;
  }

  if (condition.startedAt === null && row.startedAt !== null) {
    return false;
  }

  if (condition.completedAt === null && row.completedAt !== null) {
    return false;
  }

  if (condition.status?.not !== undefined && row.status === condition.status.not) {
    return false;
  }

  if (condition.OR !== undefined && !condition.OR.some((nested) => matchesCondition(row, nested))) {
    return false;
  }

  return true;
}

function configurePrismaDouble() {
  mocks.caseStudyFindFirst.mockImplementation(
    (args: {
      where: {
        slug: string;
        status: string;
      };
    }) => {
      const value = cases.get(args.where.slug);

      if (value?.status !== args.where.status) {
        return Promise.resolve(null);
      }

      return Promise.resolve({
        id: value.id,
      });
    },
  );

  mocks.progressUpsert.mockImplementation((args: UpsertArgs) => {
    const identity = args.where.userId_caseStudyId;

    const rowKey = key(identity.userId, identity.caseStudyId);

    const existing = rows.get(rowKey);

    if (existing) {
      const updated: ProgressRow = {
        ...existing,
        ...args.update,
      };

      rows.set(rowKey, updated);

      return Promise.resolve({
        ...updated,
      });
    }

    const created: ProgressRow = {
      id: `progress-${++sequence}`,
      createdAt: new Date(),
      ...args.create,
    };

    rows.set(rowKey, created);

    return Promise.resolve({
      ...created,
    });
  });

  mocks.progressUpdateMany.mockImplementation((args: UpdateManyArgs) => {
    let count = 0;

    for (const [rowKey, row] of rows.entries()) {
      if (!matchesCondition(row, args.where)) {
        continue;
      }

      rows.set(rowKey, {
        ...row,
        ...args.data,
      });

      count += 1;
    }

    return Promise.resolve({
      count,
    });
  });

  mocks.progressFindUnique.mockImplementation((args: FindUniqueArgs) => {
    const identity = args.where.userId_caseStudyId;

    return Promise.resolve(rows.get(key(identity.userId, identity.caseStudyId)) ?? null);
  });
}

describe("ePortfolio progress", () => {
  beforeEach(() => {
    rows = new Map();
    sequence = 0;

    for (const mock of Object.values(mocks)) {
      mock.mockReset();
    }

    configurePrismaDouble();

    vi.useFakeTimers();

    vi.setSystemTime(new Date("2026-09-22T08:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("moves not_started to in_progress and then completed with stable timestamps", async () => {
    const firstOpen = await touchEportfolioProgress({
      userId: "user-a",
      slug: "barilla",
    });

    expect(firstOpen.status).toBe("in_progress");

    expect(firstOpen.startedAt).toEqual(new Date("2026-09-22T08:00:00.000Z"));

    expect(firstOpen.lastOpenedAt).toEqual(new Date("2026-09-22T08:00:00.000Z"));

    expect(firstOpen.completedAt).toBeNull();

    const originalStartedAt = firstOpen.startedAt;

    vi.setSystemTime(new Date("2026-09-22T09:00:00.000Z"));

    const secondOpen = await touchEportfolioProgress({
      userId: "user-a",
      slug: "barilla",
    });

    expect(secondOpen.status).toBe("in_progress");

    expect(secondOpen.startedAt).toEqual(originalStartedAt);

    expect(secondOpen.lastOpenedAt).toEqual(new Date("2026-09-22T09:00:00.000Z"));

    vi.setSystemTime(new Date("2026-09-22T10:00:00.000Z"));

    const completed = await completeEportfolioProgress({
      userId: "user-a",
      slug: "barilla",
    });

    expect(completed.status).toBe("completed");

    expect(completed.startedAt).toEqual(originalStartedAt);

    expect(completed.completedAt).toEqual(new Date("2026-09-22T10:00:00.000Z"));

    const originalCompletedAt = completed.completedAt;

    vi.setSystemTime(new Date("2026-09-22T11:00:00.000Z"));

    const reopened = await touchEportfolioProgress({
      userId: "user-a",
      slug: "barilla",
    });

    expect(reopened.status).toBe("completed");

    expect(reopened.startedAt).toEqual(originalStartedAt);

    expect(reopened.completedAt).toEqual(originalCompletedAt);

    expect(reopened.lastOpenedAt).toEqual(new Date("2026-09-22T11:00:00.000Z"));
  });

  it("keeps progress isolated between users", async () => {
    await touchEportfolioProgress({
      userId: "user-a",
      slug: "barilla",
    });

    await touchEportfolioProgress({
      userId: "user-b",
      slug: "barilla",
    });

    vi.setSystemTime(new Date("2026-09-22T09:00:00.000Z"));

    await completeEportfolioProgress({
      userId: "user-a",
      slug: "barilla",
    });

    const userA = rows.get(key("user-a", "case-barilla"));

    const userB = rows.get(key("user-b", "case-barilla"));

    expect(userA?.status).toBe("completed");

    expect(userA?.completedAt).toEqual(new Date("2026-09-22T09:00:00.000Z"));

    expect(userB?.status).toBe("in_progress");

    expect(userB?.completedAt).toBeNull();
  });

  it("refuses to create progress for a draft case study", async () => {
    await expect(
      touchEportfolioProgress({
        userId: "user-a",
        slug: "draft-case",
      }),
    ).rejects.toThrow("Case study not found.");

    expect(rows.size).toBe(0);
  });
});
