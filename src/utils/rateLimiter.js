/**
 * Visitor & IP Rate Limiting Utility
 * Default policy: Maximum 10 tracking attempts per minute (60s rolling window)
 */

const STORAGE_PREFIX = 'josan_rate_limit_';

export const getRateLimitStatus = (key = 'track_shipment', maxAttempts = 10, windowMs = 60000) => {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    const raw = localStorage.getItem(storageKey);
    const now = Date.now();
    let timestamps = raw ? JSON.parse(raw) : [];

    // Filter to rolling window (last 60 seconds)
    timestamps = timestamps.filter(t => typeof t === 'number' && now - t < windowMs);

    if (timestamps.length >= maxAttempts) {
      const oldest = timestamps[0];
      const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
      return {
        allowed: false,
        remaining: 0,
        retryAfter: retryAfterSeconds,
        count: timestamps.length,
        maxAttempts
      };
    }

    return {
      allowed: true,
      remaining: maxAttempts - timestamps.length,
      retryAfter: 0,
      count: timestamps.length,
      maxAttempts
    };
  } catch (e) {
    return { allowed: true, remaining: maxAttempts, retryAfter: 0, count: 0, maxAttempts };
  }
};

export const recordRateLimitAttempt = (key = 'track_shipment', windowMs = 60000) => {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    const raw = localStorage.getItem(storageKey);
    const now = Date.now();
    let timestamps = raw ? JSON.parse(raw) : [];

    // Filter and append current timestamp
    timestamps = timestamps.filter(t => typeof t === 'number' && now - t < windowMs);
    timestamps.push(now);

    localStorage.setItem(storageKey, JSON.stringify(timestamps));
  } catch (e) {}
};

/**
 * Server-side IP rate limiting verification
 * Calls /api/track to verify and log IP-level quota (10 attempts/min/IP)
 */
export const checkServerIpRateLimit = async () => {
  try {
    const res = await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: Date.now() })
    });

    if (res.status === 429) {
      const data = await res.json().catch(() => ({}));
      const retryAfter = Number(res.headers.get('Retry-After')) || data.retryAfter || 60;
      return {
        allowed: false,
        retryAfter,
        message: data.error || `Rate limit reached. Please wait ${retryAfter}s before trying again.`
      };
    }

    const data = await res.json().catch(() => ({}));
    return {
      allowed: true,
      remaining: data.remaining ?? 10
    };
  } catch (err) {
    // If backend endpoint is offline or not running, fallback to client-side storage rate limiter
    return { allowed: true };
  }
};
