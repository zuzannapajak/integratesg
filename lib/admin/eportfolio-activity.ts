export type EportfolioActivityRecord = {
  userId: string;
  status: "not_started" | "in_progress" | "completed";
  startedAt: Date | null;
  lastOpenedAt: Date | null;
  completedAt: Date | null;
};

export type EportfolioWindowAggregate = {
  total: number;
  completed: number;
  activeUsers: Set<string>;
  hourBuckets: Map<number, number>;
  dayBuckets: Map<number, number>;
};

function toPercent(part: number, total: number) {
  if (total <= 0) return 0;

  return Math.round((part / total) * 100);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfHour(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
}

function getLatestActivityInRange(record: EportfolioActivityRecord, since: Date) {
  const candidates = [record.startedAt, record.lastOpenedAt, record.completedAt].filter(
    (date): date is Date => date !== null && date >= since,
  );

  if (candidates.length === 0) {
    return null;
  }

  return candidates.reduce((latest, current) => (current > latest ? current : latest));
}

export function createEportfolioWindowAggregate(): EportfolioWindowAggregate {
  return {
    total: 0,
    completed: 0,
    activeUsers: new Set<string>(),
    hourBuckets: new Map<number, number>(),
    dayBuckets: new Map<number, number>(),
  };
}

export function updateEportfolioWindowAggregate(
  aggregate: EportfolioWindowAggregate,
  record: EportfolioActivityRecord,
  since: Date,
  bucketMode: "day" | "hour",
) {
  const latestActivity = getLatestActivityInRange(record, since);

  if (latestActivity === null) return;

  aggregate.total += 1;
  aggregate.activeUsers.add(record.userId);

  if (record.status === "completed") {
    aggregate.completed += 1;
  }

  const bucketMap = bucketMode === "hour" ? aggregate.hourBuckets : aggregate.dayBuckets;
  const bucketStart =
    bucketMode === "hour"
      ? startOfHour(latestActivity).getTime()
      : startOfDay(latestActivity).getTime();

  bucketMap.set(bucketStart, (bucketMap.get(bucketStart) ?? 0) + 1);
}

export function buildEportfolioWindowStats(params: {
  aggregate: EportfolioWindowAggregate;
  published: number;
}) {
  return {
    completionRate: toPercent(params.aggregate.completed, params.aggregate.total),
    published: params.published,
    activeUsers: params.aggregate.activeUsers.size,
  };
}
