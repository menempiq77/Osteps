type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();
const HOUR_MS = 60 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

const cleanup = () => {
  const cutoff = Date.now() - HOUR_MS;
  for (const [key, bucket] of buckets) {
    bucket.timestamps = bucket.timestamps.filter((timestamp) => timestamp > cutoff);
    if (bucket.timestamps.length === 0) buckets.delete(key);
  }
};

const cleanupTimer = setInterval(cleanup, CLEANUP_INTERVAL_MS);
cleanupTimer.unref?.();

export const getRateLimit = (name: string, fallback: number) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
};

export const checkRateLimit = (
  key: string,
  limit = getRateLimit("RATE_LIMIT_AI_PER_HOUR", 20),
  windowMs = HOUR_MS
) => {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((timestamp) => timestamp > now - windowMs);
  const allowed = bucket.timestamps.length < limit;
  if (allowed) bucket.timestamps.push(now);
  buckets.set(key, bucket);
  const retryAfter = allowed
    ? 0
    : Math.max(1, Math.ceil((bucket.timestamps[0] + windowMs - now) / 1000));
  return { allowed, retryAfter, remaining: Math.max(0, limit - bucket.timestamps.length) };
};

export const rateLimitKey = (request: Request, prefix: string) =>
  `${prefix}:${request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"}`;
