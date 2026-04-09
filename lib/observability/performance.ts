export type MeasuredOperationStatus = "ok" | "error";

type MeasuredOperationMetaValue = string | number | boolean | null | undefined;

type LogMeasuredOperationInput = {
  operation: string;
  durationMs: number;
  records?: number | null;
  status?: MeasuredOperationStatus;
  meta?: Record<string, MeasuredOperationMetaValue>;
};

function formatMeta(meta: Record<string, MeasuredOperationMetaValue> | undefined) {
  if (!meta) {
    return "";
  }

  return Object.entries(meta)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${String(value ?? "null")}`)
    .join(" ");
}

function formatMeasuredOperationLog(input: LogMeasuredOperationInput) {
  const records = input.records ?? "n/a";
  const status = input.status ?? "ok";
  const meta = formatMeta(input.meta);
  const metaSuffix = meta.length > 0 ? ` ${meta}` : "";

  return `[perf] operation=${input.operation} durationMs=${input.durationMs} records=${records} status=${status}${metaSuffix}`;
}

export function logMeasuredOperation(input: LogMeasuredOperationInput) {
  console.warn(formatMeasuredOperationLog(input));
}

export function measureSyncOperation<T>(params: {
  operation: string;
  records?: number | null;
  meta?: Record<string, MeasuredOperationMetaValue>;
  execute: () => T;
}) {
  const startedAt = Date.now();

  try {
    const result = params.execute();

    logMeasuredOperation({
      operation: params.operation,
      durationMs: Date.now() - startedAt,
      records: params.records ?? null,
      status: "ok",
      meta: params.meta,
    });

    return result;
  } catch (error) {
    logMeasuredOperation({
      operation: params.operation,
      durationMs: Date.now() - startedAt,
      records: params.records ?? null,
      status: "error",
      meta: params.meta,
    });

    throw error;
  }
}

export async function measureAsyncOperation<T>(params: {
  operation: string;
  getRecords?: (result: T) => number | null | undefined;
  execute: () => Promise<T>;
}) {
  const startedAt = Date.now();

  try {
    const result = await params.execute();

    logMeasuredOperation({
      operation: params.operation,
      durationMs: Date.now() - startedAt,
      records: params.getRecords?.(result) ?? null,
      status: "ok",
    });

    return result;
  } catch (error) {
    logMeasuredOperation({
      operation: params.operation,
      durationMs: Date.now() - startedAt,
      records: null,
      status: "error",
    });

    throw error;
  }
}
