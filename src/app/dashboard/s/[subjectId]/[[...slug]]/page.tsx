import { redirect } from "next/navigation";

type Params = {
  subjectId: string;
  slug?: string[];
};

type SearchParams = Record<string, string | string[] | undefined>;

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

  const suffix = (slug ?? []).join("/");
  const destinationPath = suffix ? `/dashboard/${suffix}` : "/dashboard";

  const nextSearchParams: SearchParams = {
    ...resolvedSearch,
    subject_id: subjectId,
  };

  redirect(appendSearchParams(destinationPath, nextSearchParams));
}
