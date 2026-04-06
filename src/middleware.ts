import { NextRequest, NextResponse } from "next/server";

const SUBJECT_CONTEXT_ENABLED = process.env.NEXT_PUBLIC_SUBJECT_CONTEXT_ENABLED !== "false";

const SUBJECT_SCOPED_PREFIXES = [
  "/dashboard",
  "/dashboard/manager",
  "/dashboard/view",
  "/dashboard/leaderboard",
  "/dashboard/years",
  "/dashboard/classes",
  "/dashboard/grades",
  "/dashboard/quiz",
  "/dashboard/teachers",
  "/dashboard/student_behavior",
  "/dashboard/all_assesments",
  "/dashboard/all_trackers",
  "/dashboard/viewtrackers",
  "/dashboard/student_assesments",
  "/dashboard/students/reports",
  "/dashboard/mind-upgrade",
  "/dashboard/subjects",
  "/dashboard/approvals",
  "/dashboard/lessons",
];

const SHARED_PREFIXES = [
  "/dashboard/subject-cards",
  "/dashboard/students/all-school",
  "/dashboard/students/all-students",
  "/dashboard/library",
  "/dashboard/time_table",
  "/dashboard/announcements",
  "/dashboard/tools",
  "/dashboard/school-admin/settings",
  "/dashboard/students/settings",
  "/dashboard/teachers/settings",
  "/dashboard/admins/settings",
];

const SHARED_EXACT_PATHS = [
  "/dashboard/students",
  "/dashboard/teachers",
];

const SUBJECT_ROUTE_ROOTS = new Set([
  "manager",
  "view",
  "leaderboard",
  "years",
  "classes",
  "grades",
  "quiz",
  "teachers",
  "student_behavior",
  "all_assesments",
  "all_trackers",
  "viewtrackers",
  "student_assesments",
  "students",
  "behavior",
  "mind-upgrade",
  "subjects",
  "subject-cards",
  "library",
  "time_table",
  "announcements",
  "tools",
  "school-admin",
  "admins",
  "approvals",
  "lessons",
]);

const startsWithPrefix = (path: string, prefix: string): boolean => path === prefix || path.startsWith(`${prefix}/`);

const isSharedPath = (path: string): boolean => {
  if (SHARED_EXACT_PATHS.includes(path)) return true;
  return SHARED_PREFIXES.some((prefix) => startsWithPrefix(path, prefix));
};

const isSubjectScopedLegacyPath = (path: string): boolean => {
  if (path === "/dashboard") return false;
  if (path.startsWith("/dashboard/s/")) return false;
  if (isSharedPath(path)) return false;
  return SUBJECT_SCOPED_PREFIXES.some((prefix) => startsWithPrefix(path, prefix));
};

const stripReadableSubjectSegment = (suffix: string): string => {
  const trimmed = String(suffix ?? "").replace(/^\/+/, "");
  if (!trimmed) return "";

  const segments = trimmed.split("/").filter(Boolean);
  if (segments.length === 0) return "";
  if (SUBJECT_ROUTE_ROOTS.has(String(segments[0] ?? "").toLowerCase())) {
    return `/${segments.join("/")}`;
  }

  const remaining = segments.slice(1);
  return remaining.length > 0 ? `/${remaining.join("/")}` : "";
};

const isGlobalStudentsPath = (path: string): boolean => {
  return (
    path === "/dashboard/students/all" ||
    path === "/dashboard/students/all-school" ||
    path === "/dashboard/students/all-students"
  );
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Keep explicit all-school routes strictly outside subject-scoped routes,
  // but allow subject-scoped /students/all for subject-only lists.
  if (pathname.startsWith("/dashboard/s/")) {
    const canonicalScopedMatch = pathname.match(/^\/dashboard\/s\/(\d+)\/([^/]+)(\/.*)?$/);
    if (
      canonicalScopedMatch &&
      !SUBJECT_ROUTE_ROOTS.has(String(canonicalScopedMatch[2] ?? "").toLowerCase()) &&
      canonicalScopedMatch[3]
    ) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = `/dashboard/s/${canonicalScopedMatch[1]}${canonicalScopedMatch[3]}`;
      return NextResponse.redirect(redirectUrl);
    }

    const scopedSharedStudentsMatch = pathname.match(
      /^\/dashboard\/s\/\d+(?:\/[^/]+)?\/(students\/(?:all-school|all-students)(?:\/.*)?)$/
    );
    if (scopedSharedStudentsMatch) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = `/dashboard/${scopedSharedStudentsMatch[1]}`;
      redirectUrl.searchParams.delete("subject_id");
      redirectUrl.searchParams.delete("subject_name");
      return NextResponse.redirect(redirectUrl);
    }

    const scopedStudentsAllMatch = pathname.match(
      /^\/dashboard\/s\/\d+(?:\/[^/]+)?\/students\/(all-school|all-students)$/
    );
    if (scopedStudentsAllMatch) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/dashboard/students/all-students";
      redirectUrl.searchParams.delete("subject_id");
      redirectUrl.searchParams.delete("subject_name");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Canonicalize school-wide students list aliases.
  if (
    pathname === "/dashboard/students/all" ||
    pathname === "/dashboard/students/all-school"
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/dashboard/students/all-students";
    redirectUrl.searchParams.delete("subject_id");
    redirectUrl.searchParams.delete("subject_name");
    return NextResponse.redirect(redirectUrl);
  }

  if (!SUBJECT_CONTEXT_ENABLED) {
    if (pathname.startsWith("/dashboard/s/")) {
      const rawSuffix = pathname.replace(/^\/dashboard\/s\/\d+/, "") || "";
      const suffix = stripReadableSubjectSegment(rawSuffix);
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = `/dashboard${suffix}`;
      redirectUrl.searchParams.delete("subject_id");
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard/s/")) {
    const match = pathname.match(/^\/dashboard\/s\/(\d+)(\/.*)?$/);
    if (!match) return NextResponse.next();

    const subjectId = match[1];
    const suffix = stripReadableSubjectSegment(match[2] ?? "");
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = `/dashboard${suffix}`;
    rewriteUrl.searchParams.set("subject_id", subjectId);
    return NextResponse.rewrite(rewriteUrl);
  }

  if (isSubjectScopedLegacyPath(pathname)) {
    if (isGlobalStudentsPath(pathname)) {
      return NextResponse.next();
    }

    const querySubject = url.searchParams.get("subject_id");
    const cookieSubject = req.cookies.get("osteps_subject_id")?.value;
    const resolvedSubject = querySubject ?? cookieSubject ?? null;
    if (resolvedSubject && /^\d+$/.test(resolvedSubject)) {
      const suffix = pathname.replace("/dashboard", "") || "";
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = `/dashboard/s/${resolvedSubject}${suffix}`;
      redirectUrl.searchParams.delete("subject_id");
      redirectUrl.searchParams.delete("subject_name");
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}  

export const config = {
  matcher: ["/dashboard/:path*"],
};
