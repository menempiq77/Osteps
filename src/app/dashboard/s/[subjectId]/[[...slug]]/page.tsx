import { redirect } from "next/navigation";

type Params = {
  subjectId: string;
  slug?: string[];
};

type SearchParams = Record<string, string | string[] | undefined>;

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
  "timetable-builder",   "timetable-generator",  "announcements",
  "approvals",
  "lessons",
  "tools",
  "school-admin",
  "admins",
]);

const appendSearchParams = (path: string, searchParams: SearchParams): string => {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
      return;
    }
    params.set(key, value);
  });

  const query = params.toString();
  return query ? `${path}?${query}` : path;
};

export default async function SubjectScopedAliasPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { subjectId, slug } = await params;
  const resolvedSearch = await searchParams;

  if (!/^\d+$/.test(subjectId)) {
    redirect("/dashboard");
  }

  const segments = slug ?? [];
  const effectiveSegments =
    segments.length > 0 && !SUBJECT_ROUTE_ROOTS.has(String(segments[0] ?? "").toLowerCase())
      ? segments.slice(1)
      : segments;
  const suffix = effectiveSegments.join("/");
  const destinationPath = suffix ? `/dashboard/${suffix}` : "/dashboard";

  const nextSearchParams: SearchParams = {
    ...resolvedSearch,
    subject_id: subjectId,
  };

  redirect(appendSearchParams(destinationPath, nextSearchParams));
}
