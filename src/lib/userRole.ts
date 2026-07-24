export const normalizeUserRole = (value?: string | null) => {
  const normalizedRole = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  return normalizedRole === "ADMIN" ? "SUPER_ADMIN" : normalizedRole;
};
