const textEncoder = new TextEncoder();
const ARRAY_SAMPLE_LIMIT = 5;
const MAX_DEPTH = 5;

function getSerializedScalarBytes(value: unknown) {
  return textEncoder.encode(JSON.stringify(value ?? null)).length;
}

export function estimateJsonBytes(value: unknown, depth = 0): number {
  if (depth >= MAX_DEPTH) {
    return getSerializedScalarBytes(value);
  }

  if (value === null || value === undefined) {
    return 4;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return getSerializedScalarBytes(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 2;
    }

    const sampleCount = Math.min(value.length, ARRAY_SAMPLE_LIMIT);
    let sampledItemsBytes = 0;

    for (let index = 0; index < sampleCount; index += 1) {
      sampledItemsBytes += estimateJsonBytes(value[index], depth + 1);
    }

    const averageItemBytes = sampledItemsBytes / sampleCount;
    return 2 + Math.round(averageItemBytes * value.length) + Math.max(0, value.length - 1);
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);

    if (entries.length === 0) {
      return 2;
    }

    let total = 2;

    for (let index = 0; index < entries.length; index += 1) {
      const [key, entryValue] = entries[index];
      total += getSerializedScalarBytes(key);
      total += 1;
      total += estimateJsonBytes(entryValue, depth + 1);
      if (index < entries.length - 1) {
        total += 1;
      }
    }

    return total;
  }

  return getSerializedScalarBytes(null);
}
