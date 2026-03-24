export const PRIMARY_PLATFORM_ADMIN_EMAIL = "abdelmonem@gmail.com";

type RoleAwareUser =
  | {
      email?: string | null;
      role?: string | null;
    }
  | null
  | undefined;

export const normalizePlatformRole = (value?: string | null): string =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

export const isPrimaryPlatformAdmin = (email?: string | null): boolean =>
  String(email || "").trim().toLowerCase() === PRIMARY_PLATFORM_ADMIN_EMAIL;

export const getEffectivePlatformRole = (user?: RoleAwareUser): string => {
  const normalizedRole = normalizePlatformRole(user?.role);
  if (normalizedRole === "SUPER_ADMIN") return normalizedRole;
  if (isPrimaryPlatformAdmin(user?.email)) return "SUPER_ADMIN";
  return normalizedRole;
};

export const canUseSubjectWorkspace = (user?: RoleAwareUser): boolean => {
  if (getEffectivePlatformRole(user) === "SUPER_ADMIN") return false;

  const normalizedRole = normalizePlatformRole(user?.role);
  return ["SCHOOL_ADMIN", "ADMIN", "HOD", "TEACHER", "STUDENT"].includes(normalizedRole);
};

export const getDashboardHomePath = (user?: RoleAwareUser): string =>
  canUseSubjectWorkspace(user) ? "/dashboard/subject-cards" : "/dashboard";
