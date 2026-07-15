type UnknownRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isMissingPrimitive(fallback: unknown, localized: unknown) {
  if (localized === null || localized === undefined) {
    return true;
  }

  if (typeof fallback === "string") {
    return typeof localized !== "string" || localized.trim().length === 0;
  }

  if (typeof fallback === "number") {
    return typeof localized !== "number" || !Number.isFinite(localized);
  }

  if (typeof fallback === "boolean") {
    return typeof localized !== "boolean";
  }

  return false;
}

/**
 * Recursively applies localized values over a complete English source.
 *
 * Missing objects, keys, empty strings and empty arrays inherit their
 * English values. Arrays are replaced as a whole when the localized
 * version contains at least one item.
 */
export function applyEnglishFallback<T>(english: T, localized: unknown): T {
  if (Array.isArray(english)) {
    if (!Array.isArray(localized) || localized.length === 0) {
      return english;
    }

    return localized as T;
  }

  if (isPlainObject(english)) {
    const localizedObject = isPlainObject(localized) ? localized : {};
    const result: UnknownRecord = { ...localizedObject };

    for (const [key, englishValue] of Object.entries(english)) {
      result[key] = applyEnglishFallback(englishValue, localizedObject[key]);
    }

    return result as T;
  }

  if (isMissingPrimitive(english, localized)) {
    return english;
  }

  return localized as T;
}
