// In-memory sliding window. Good enough for a single instance; swap for a shared
// store (Redis, Upstash) when running more than one server.
const hits = new Map<string, number[]>();

export function rateLimit(key: string, {limit = 5, windowMs = 10 * 60 * 1000} = {}) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
