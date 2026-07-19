

const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
} as const;

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingMs?: number;
}

const store = new Map<string, RateLimitEntry>();

function normalizeIp(ip: string): string {
  return ip.replace(/^::ffff:/i, "").trim();
}

function purgeExpired(): void {
  const now = Date.now();
  for (const [ip, entry] of store.entries()) {
    if (now - entry.firstAttempt >= RATE_LIMIT_CONFIG.windowMs) {
      store.delete(ip);
    }
  }
}

export function checkRateLimit(rawIp: string): RateLimitResult {
  purgeExpired();

  const ip = normalizeIp(rawIp);
  const entry = store.get(ip);

  if (!entry) {
    return { allowed: true };
  }

  const elapsed = Date.now() - entry.firstAttempt;

  if (elapsed >= RATE_LIMIT_CONFIG.windowMs) {
    store.delete(ip);
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_CONFIG.maxAttempts) {
    const remainingMs = RATE_LIMIT_CONFIG.windowMs - elapsed;
    return { allowed: false, remainingMs };
  }

  return { allowed: true };
}

export function recordFailedAttempt(rawIp: string): void {
  const ip = normalizeIp(rawIp);
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry) {
    store.set(ip, { count: 1, firstAttempt: now });
    return;
  }

  if (now - entry.firstAttempt >= RATE_LIMIT_CONFIG.windowMs) {
    store.set(ip, { count: 1, firstAttempt: now });
    return;
  }

  store.set(ip, { ...entry, count: entry.count + 1 });
}

export function resetRateLimit(rawIp: string): void {
  store.delete(normalizeIp(rawIp));
}

export function formatRemainingTime(ms: number): string {
  const minutes = Math.ceil(ms / 60_000);
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}
