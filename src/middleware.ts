import { NextRequest, NextResponse } from "next/server";

const SUBJECT_CONTEXT_ENABLED = process.env.NEXT_PUBLIC_SUBJECT_CONTEXT_ENABLED === "true";

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
  "/dashboard/students/reports",
  "/dashboard/mind-upgrade",
  "/dashboard/subjects",
  "/dashboard/subject-classes",
  "/dashboard/subject-staff",
];

const SHARED_PREFIXES = [
  "/dashboard/library",
  "/dashboard/time_table",
  "/dashboard/announcements",
  "/dashboard/tools",
  "/dashboard/school-admin/settings",
  "/dashboard/students/settings",
  "/dashboard/teachers/settings",
  "/dashboard/admins/settings",
];

const startsWithPrefix = (path: string, prefix: string): boolean => path === prefix || path.startsWith(`${prefix}/`);

const isSharedPath = (path: string): boolean => SHARED_PREFIXES.some((prefix) => startsWithPrefix(path, prefix));

const isSubjectScopedLegacyPath = (path: string): boolean => {
  if (path.startsWith("/dashboard/s/")) return false;
  if (isSharedPath(path)) return false;
  return SUBJECT_SCOPED_PREFIXES.some((prefix) => startsWithPrefix(path, prefix));
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  if (!SUBJECT_CONTEXT_ENABLED) {
    if (pathname.startsWith("/dashboard/s/")) {
      const suffix = pathname.replace(/^\/dashboard\/s\/\d+/, "") || "";
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
    const suffix = match[2] ?? "";
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = `/dashboard${suffix}`;
    rewriteUrl.searchParams.set("subject_id", subjectId);
    return NextResponse.rewrite(rewriteUrl);
  }

  if (isSubjectScopedLegacyPath(pathname)) {
    const querySubject = url.searchParams.get("subject_id");
    const cookieSubject = req.cookies.get("osteps_subject_id")?.value;
    const resolvedSubject = querySubject ?? cookieSubject ?? null;

    if (resolvedSubject && /^\d+$/.test(resolvedSubject)) {
      const suffix = pathname.replace("/dashboard", "") || "";
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = `/dashboard/s/${resolvedSubject}${suffix}`;
      redirectUrl.searchParams.delete("subject_id");
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
