export type SubjectClassStatusRow = {
  is_active?: number | string | null;
};

type RequestError = {
  message?: unknown;
  response?: {
    data?: {
      message?: unknown;
      msg?: unknown;
    };
  };
};

const IMPORT_REQUEST_TOKEN_KEY = "osteps_archived_content_import_tokens";

export const isArchivedSubjectClasses = (
  rows: SubjectClassStatusRow[],
): boolean =>
  rows.length > 0 &&
  rows.every((row) =>
    row.is_active === undefined ? false : Number(row.is_active) !== 1,
  );

export const resolveArchivedImportError = (
  error: unknown,
  fallback: string,
): string => {
  const requestError = error as RequestError;
  return String(
    requestError.response?.data?.msg ??
      requestError.response?.data?.message ??
      requestError.message ??
      fallback,
  );
};

const readImportRequestTokens = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(
      sessionStorage.getItem(IMPORT_REQUEST_TOKEN_KEY) || "{}",
    );
  } catch {
    return {};
  }
};

export const getArchivedImportRequestToken = (signature: string): string => {
  const tokens = readImportRequestTokens();
  if (tokens[signature]) return tokens[signature];

  const token =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  tokens[signature] = token;
  sessionStorage.setItem(IMPORT_REQUEST_TOKEN_KEY, JSON.stringify(tokens));
  return token;
};

export const clearArchivedImportRequestToken = (signature: string) => {
  if (typeof window === "undefined") return;
  const tokens = readImportRequestTokens();
  delete tokens[signature];
  sessionStorage.setItem(IMPORT_REQUEST_TOKEN_KEY, JSON.stringify(tokens));
};
