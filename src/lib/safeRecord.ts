/**
 * Shared helpers for working with values of unknown shape (e.g. API
 * responses, caught errors) without resorting to `any`.
 */

/** A loosely typed object whose keys/values are not statically known. */
export type SafeRecord = Record<string, unknown>;

/** Narrow an unknown value to a plain object record, or `undefined` if it isn't one. */
export function asRecord(value: unknown): SafeRecord | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as SafeRecord;
  }
  return undefined;
}

/** Cast an unknown value (e.g. a caught error) to a record for safe property access. */
export function toRecord(value: unknown): SafeRecord {
  return (value ?? {}) as SafeRecord;
}

/** Extract a human readable message from an unknown error value. */
export function errorMessage(error: unknown, fallback = "An unexpected error occurred"): string {
  if (error instanceof Error) return error.message;
  const record = asRecord(error);
  const message = record?.message ?? record?.msg;
  if (typeof message === "string") return message;
  // common Axios-style nested response message shapes
  const response = asRecord(record?.response);
  const responseLevelMessage = response?.message ?? response?.msg;
  if (typeof responseLevelMessage === "string") return responseLevelMessage;
  const data = asRecord(response?.data);
  let responseMessage = data?.message ?? data?.msg;
  if (typeof responseMessage !== "string") {
    const nestedData = asRecord(data?.data);
    responseMessage = nestedData?.message ?? nestedData?.msg;
  }
  if (typeof responseMessage === "string") return responseMessage;
  if (typeof error === "string") return error;
  return fallback;
}
