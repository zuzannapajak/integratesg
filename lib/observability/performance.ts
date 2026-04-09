export type MeasuredOperationStatus = "ok" | "error";

type LogMeasuredOperationInput = {
  operation: string;
  durationMs: number;
  records?: number | null;
  status?: MeasuredOperationStatus;
};

function formatMeasuredOperationLog(input: LogMeasuredOperationInput) {
  const records = input.records ?? "n/a";
  const status = input.status ?? "ok";

  return `[perf] operation=${input.operation} durationMs=${input.durationMs} records=${records} status=${status}`;
}

export function logMeasuredOperation(input: LogMeasuredOperationInput) {
  console.info(formatMeasuredOperationLog(input));
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
