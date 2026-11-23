/**
 * Josan Logistics - Registration Rate Limit & Cooldown Manager
 *
 * Implements a strict 5-minute (300-second) cooldown for repeated registration attempts
 * for the same email address, with cross-tab and page-refresh persistence via localStorage.
 */

const STORAGE_KEY = 'josan_registration_cooldowns';
export const REGISTRATION_COOLDOWN_SECONDS = 300; // 5 minutes

/**
 * Normalizes email address for consistent lookup.
 */
export function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

/**
 * Reads all active cooldown records from localStorage.
 */
function readCooldownStore() {
  if (typeof window === 'undefined' || !window.localStorage) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

/**
 * Writes cooldown records to localStorage and cleans up expired ones.
 */
function writeCooldownStore(store) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const now = Date.now();
    const cleaned = {};
    for (const [email, entry] of Object.entries(store)) {
      if (entry && entry.expiresAt > now) {
        cleaned[email] = entry;
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  } catch (e) {
    // Ignore quota or private browsing storage errors
  }
}

/**
 * Checks if a cooldown is currently active for the given email address.
 *
 * @param {string} email
 * @returns {{ active: boolean, remainingSeconds: number, expiresAt: number }}
 */
export function getRegistrationCooldown(email) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) return { active: false, remainingSeconds: 0, expiresAt: 0 };

  const store = readCooldownStore();
  const entry = store[cleanEmail];
  if (!entry || !entry.expiresAt) {
    return { active: false, remainingSeconds: 0, expiresAt: 0 };
  }

  const now = Date.now();
  if (entry.expiresAt <= now) {
    clearRegistrationCooldown(cleanEmail);
    return { active: false, remainingSeconds: 0, expiresAt: 0 };
  }

  const remainingSeconds = Math.max(0, Math.ceil((entry.expiresAt - now) / 1000));
  return {
    active: remainingSeconds > 0,
    remainingSeconds,
    expiresAt: entry.expiresAt
  };
}

/**
 * Sets a 5-minute cooldown for the given email address.
 * Dispatches a storage notification to sync across open tabs and alerts the server.
 *
 * @param {string} email
 * @param {number} [seconds=300]
 */
export function setRegistrationCooldown(email, seconds = REGISTRATION_COOLDOWN_SECONDS) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) return;

  const store = readCooldownStore();
  const now = Date.now();
  const expiresAt = now + seconds * 1000;

  store[cleanEmail] = {
    startedAt: now,
    expiresAt,
    seconds
  };

  writeCooldownStore(store);

  // Cross-tab notification
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(
        new CustomEvent('josan-registration-cooldown', {
          detail: { email: cleanEmail, remainingSeconds: seconds, expiresAt }
        })
      );
    } catch (e) {}

    // Report rate limit lockout to backend server in background
    try {
      fetch('/api/auth/register-rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'record', email: cleanEmail, seconds })
      }).catch(() => {});
    } catch (e) {}
  }
}

/**
 * Clears the cooldown for an email address (e.g. when timer reaches 0).
 */
export function clearRegistrationCooldown(email) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) return;

  const store = readCooldownStore();
  if (store[cleanEmail]) {
    delete store[cleanEmail];
    writeCooldownStore(store);

    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(
          new CustomEvent('josan-registration-cooldown', {
            detail: { email: cleanEmail, remainingSeconds: 0, expiresAt: 0 }
          })
        );
      } catch (e) {}
    }
  }
}

/**
 * Formats a duration in seconds to "MM:SS" (e.g. 300 -> "05:00", 299 -> "04:59").
 */
export function formatCountdownTimer(totalSeconds) {
  const clamped = Math.max(0, Math.floor(totalSeconds || 0));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Subscribes to cooldown changes across tabs and local timer updates.
 */
export function subscribeToRegistrationCooldown(email, callback) {
  if (typeof window === 'undefined') return () => {};

  const cleanEmail = normalizeEmail(email);

  const handleCustomEvent = (e) => {
    if (!cleanEmail || normalizeEmail(e?.detail?.email) === cleanEmail) {
      const cd = getRegistrationCooldown(cleanEmail);
      callback(cd);
    }
  };

  const handleStorageEvent = (e) => {
    if (e.key === STORAGE_KEY) {
      const cd = getRegistrationCooldown(cleanEmail);
      callback(cd);
    }
  };

  window.addEventListener('josan-registration-cooldown', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener('josan-registration-cooldown', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

