import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

const toFirstString = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");

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

export default async function StudentsFallbackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;

  const subjectClassId = toFirstString(resolved.subjectClassId).trim();
  const classId = toFirstString(resolved.classId).trim();
  const targetClassId = subjectClassId || classId;

  const destinationPath = targetClassId
    ? `/dashboard/students/${encodeURIComponent(targetClassId)}`
    : "/dashboard/students/all";

  redirect(appendSearchParams(destinationPath, resolved));
}
