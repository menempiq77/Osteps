export type LeaderboardRawEntry = {
  student_id: number | string;
  student_name?: string;
  total_marks?: number | null;
};

export type LeaderboardRow = {
  key: string;
  rank: number;
  name: string;
  avatar: string;
  points: number;
  badge: "gold" | "silver" | "bronze" | null;
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const toKey = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  return String(value);
};

export const mergeAndRankLeaderboards = (leaderboards: LeaderboardRawEntry[][]): LeaderboardRow[] => {
  const map = new Map<string, { name: string; points: number }>();

  for (const entries of leaderboards) {
    for (const entry of entries ?? []) {
      const key = toKey(entry?.student_id);
      if (!key) continue;

      const name = entry?.student_name ?? "";
      const points = toNumber(entry?.total_marks);

      const existing = map.get(key);
      if (!existing) {
        map.set(key, { name, points });
        continue;
      }

      // Defensive: if student appears twice (shouldn’t), keep the higher score.
      if (points > existing.points) {
        map.set(key, { name: name || existing.name, points });
      }
    }
  }

  const sorted = Array.from(map.entries())
    .map(([key, value]) => ({ key, ...value }))
    .sort((a, b) => b.points - a.points);

  return sorted.map((student, index) => ({
    key: student.key,
    rank: index + 1,
    name: student.name,
    avatar: student.name?.charAt(0).toUpperCase() || "?",
    points: student.points || 0,
    badge: index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : null,
  }));
};

export const mapWithConcurrency = async <T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>
): Promise<R[]> => {
  const limit = Math.max(1, Math.floor(concurrency));
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  const worker = async () => {
    while (true) {
      const current = nextIndex;
      nextIndex += 1;
      if (current >= items.length) return;
      results[current] = await mapper(items[current], current);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
};
