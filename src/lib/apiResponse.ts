// src/lib/apiResponse.ts
//
// Helpers for the backend's quirk of returning HTTP 200 while signalling a
// real failure inside the response body (via status_code / success / status /
// ok fields). These were previously re-implemented inline across several
// service modules.

/** Extract the backend's numeric status code from a response body. */
export const getEmbeddedStatusCode = (payload: unknown, fallback = 200): number => {
  const body = payload as Record<string, unknown> | null | undefined;
  return Number(body?.status_code ?? body?.statusCode ?? body?.code ?? fallback);
};

/** True when a (possibly HTTP-200) response body signals a failure. */
export const isEmbeddedFailure = (payload: unknown, fallbackStatus = 200): boolean => {
  const body = payload as Record<string, unknown> | null | undefined;
  const statusCode = getEmbeddedStatusCode(payload, fallbackStatus);
  return (
    body?.success === false ||
    body?.status === false ||
    body?.ok === false ||
    (Number.isFinite(statusCode) && statusCode >= 400)
  );
};

/** Pull a human-readable message out of a response body, else `fallback`. */
export const getPayloadMessage = (payload: unknown, fallback: string): string => {
  const body = payload as Record<string, any> | null | undefined;
  return (
    body?.msg ||
    body?.message ||
    body?.data?.message ||
    fallback
  );
};

/**
 * If the payload signals an embedded failure, throw an Error whose `response`
 * mirrors an axios error (`{ data, status }`) so callers can inspect it the
 * same way they would a real transport error.
 */
export const throwOnEmbeddedFailure = (
  payload: unknown,
  options: { fallbackStatus?: number; fallbackMessage?: string } = {}
): void => {
  const { fallbackStatus = 200, fallbackMessage = "Request failed" } = options;
  if (!isEmbeddedFailure(payload, fallbackStatus)) return;

  const statusCode = getEmbeddedStatusCode(payload, fallbackStatus);
  const error = new Error(getPayloadMessage(payload, fallbackMessage)) as Error & {
    response?: { data: unknown; status: number };
  };
  error.response = { data: payload, status: statusCode };
  throw error;
};

/** Extract the best available error message from a caught axios-style error. */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const data = (error as { response?: { data?: Record<string, any> } })?.response?.data;
  const candidate =
    data?.msg ||
    data?.message ||
    data?.data?.message ||
    (Array.isArray(data?.errors) ? data.errors[0] : undefined) ||
    (data?.errors && typeof data.errors === "object"
      ? Object.values(data.errors)[0]
      : undefined) ||
    (error as { message?: string })?.message ||
    fallback;
  return String(Array.isArray(candidate) ? candidate[0] : candidate);
};
