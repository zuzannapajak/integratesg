import { describe, expect, it } from "vitest";

import {
  buildEportfolioWindowStats,
  createEportfolioWindowAggregate,
  updateEportfolioWindowAggregate,
} from "@/lib/admin/eportfolio-activity";

describe("ePortfolio admin activity aggregation", () => {
  it("counts in-progress case studies as activity, not only completions", () => {
    const aggregate = createEportfolioWindowAggregate();
    const since = new Date(2026, 8, 28, 0, 0);

    updateEportfolioWindowAggregate(
      aggregate,
      {
        userId: "learner-1",
        status: "in_progress",
        startedAt: new Date(2026, 8, 28, 8, 0),
        lastOpenedAt: new Date(2026, 8, 28, 10, 0),
        completedAt: null,
      },
      since,
      "hour",
    );

    expect(aggregate.total).toBe(1);
    expect(aggregate.completed).toBe(0);
    expect(aggregate.activeUsers).toEqual(new Set(["learner-1"]));
  });

  it("calculates completion rate across active progress records", () => {
    const aggregate = createEportfolioWindowAggregate();
    const since = new Date(2026, 8, 28, 0, 0);

    updateEportfolioWindowAggregate(
      aggregate,
      {
        userId: "learner-1",
        status: "completed",
        startedAt: new Date(2026, 8, 28, 8, 0),
        lastOpenedAt: new Date(2026, 8, 28, 9, 0),
        completedAt: new Date(2026, 8, 28, 9, 0),
      },
      since,
      "hour",
    );

    updateEportfolioWindowAggregate(
      aggregate,
      {
        userId: "learner-2",
        status: "in_progress",
        startedAt: new Date(2026, 8, 28, 11, 0),
        lastOpenedAt: new Date(2026, 8, 28, 12, 0),
        completedAt: null,
      },
      since,
      "hour",
    );

    expect(buildEportfolioWindowStats({ aggregate, published: 8 })).toEqual({
      completionRate: 50,
      published: 8,
      activeUsers: 2,
    });
  });

  it("places each active progress record in the bucket of its latest activity", () => {
    const aggregate = createEportfolioWindowAggregate();
    const since = new Date(2026, 8, 28, 0, 0);

    updateEportfolioWindowAggregate(
      aggregate,
      {
        userId: "learner-1",
        status: "completed",
        startedAt: new Date(2026, 8, 28, 8, 0),
        lastOpenedAt: new Date(2026, 8, 28, 10, 15),
        completedAt: new Date(2026, 8, 28, 9, 0),
      },
      since,
      "hour",
    );

    expect(aggregate.hourBuckets.get(new Date(2026, 8, 28, 10, 0).getTime())).toBe(1);
    expect(aggregate.hourBuckets.get(new Date(2026, 8, 28, 8, 0).getTime())).toBeUndefined();
  });

  it("ignores activity outside the selected window", () => {
    const aggregate = createEportfolioWindowAggregate();
    const since = new Date(2026, 8, 28, 0, 0);

    updateEportfolioWindowAggregate(
      aggregate,
      {
        userId: "learner-old",
        status: "completed",
        startedAt: new Date(2026, 8, 20, 8, 0),
        lastOpenedAt: new Date(2026, 8, 20, 9, 0),
        completedAt: new Date(2026, 8, 20, 9, 0),
      },
      since,
      "day",
    );

    expect(aggregate.total).toBe(0);
    expect(aggregate.activeUsers.size).toBe(0);
  });
});
