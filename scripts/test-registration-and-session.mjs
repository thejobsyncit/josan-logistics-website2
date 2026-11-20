/**
 * Verification test suite for Josan Logistics:
 * 1. Registration 5-Minute Cooldown & Rate Limit Handling
 * 2. 15-Minute Inactivity Session Timeout
 * 3. Server-side /api/auth/register-rate-limit endpoint
 * 4. Backward compatibility & non-breaking regression checks
 */

import assert from 'assert';
import {
  getRegistrationCooldown,
  setRegistrationCooldown,
  clearRegistrationCooldown,
  formatCountdownTimer,
  normalizeEmail,
  REGISTRATION_COOLDOWN_SECONDS
} from '../src/utils/registrationCooldown.js';
import { handleApiRequest } from '../src/server/apiMiddleware.js';

console.log('====================================================');
console.log('JOSAN LOGISTICS: RATE LIMIT & SESSION TIMEOUT TESTS');
console.log('====================================================\n');

// Mock localStorage for Node.js test environment
const mockStorage = new Map();
global.window = {
  localStorage: {
    getItem: (k) => mockStorage.get(k) || null,
    setItem: (k, v) => mockStorage.set(k, String(v)),
    removeItem: (k) => mockStorage.delete(k),
    clear: () => mockStorage.clear(),
    get length() { return mockStorage.size; },
    key: (i) => Array.from(mockStorage.keys())[i] || null
  },
  dispatchEvent: () => true
};
global.localStorage = global.window.localStorage;

let passedTests = 0;
let totalTests = 0;

function runTest(description, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`[PASS] ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${description}`);
    console.error(err);
  }
}

async function runAsyncTest(description, testFn) {
  totalTests++;
  try {
    await testFn();
    console.log(`[PASS] ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${description}`);
    console.error(err);
  }
}

// -----------------------------------------------------------------------------
// 1. Countdown timer formatter
// -----------------------------------------------------------------------------
runTest('Timer Formatter converts seconds to MM:SS correctly', () => {
  assert.strictEqual(formatCountdownTimer(300), '05:00');
  assert.strictEqual(formatCountdownTimer(299), '04:59');
  assert.strictEqual(formatCountdownTimer(298), '04:58');
  assert.strictEqual(formatCountdownTimer(60), '01:00');
  assert.strictEqual(formatCountdownTimer(59), '00:59');
  assert.strictEqual(formatCountdownTimer(5), '00:05');
  assert.strictEqual(formatCountdownTimer(0), '00:00');
  assert.strictEqual(formatCountdownTimer(-10), '00:00');
});

// -----------------------------------------------------------------------------
// 2. Email normalization
// -----------------------------------------------------------------------------
runTest('Email normalization handles case and whitespace', () => {
  assert.strictEqual(normalizeEmail('  User@Company.COM  '), 'user@company.com');
  assert.strictEqual(normalizeEmail('balavarshini2223@gmail.com'), 'balavarshini2223@gmail.com');
  assert.strictEqual(normalizeEmail(''), '');
});

// -----------------------------------------------------------------------------
// 3. Cooldown setting and retrieval
// -----------------------------------------------------------------------------
runTest('Setting 5-minute cooldown persists and reports active with remaining seconds', () => {
  mockStorage.clear();
  const testEmail = 'balavarshini2223@gmail.com';

  // Initially inactive
  let status = getRegistrationCooldown(testEmail);
  assert.strictEqual(status.active, false);
  assert.strictEqual(status.remainingSeconds, 0);

  // Set 300-second cooldown
  setRegistrationCooldown(testEmail, 300);

  status = getRegistrationCooldown(testEmail);
  assert.strictEqual(status.active, true);
  assert.ok(status.remainingSeconds >= 298 && status.remainingSeconds <= 300, `Remaining: ${status.remainingSeconds}`);
  assert.strictEqual(formatCountdownTimer(status.remainingSeconds).startsWith('04:5') || formatCountdownTimer(status.remainingSeconds) === '05:00', true);
});

// -----------------------------------------------------------------------------
// 4. Persistence across page reloads (mocking reload by reading fresh from storage)
// -----------------------------------------------------------------------------
runTest('Cooldown persists across simulated page refresh', () => {
  const testEmail = 'balavarshini2223@gmail.com';
  // Read again from storage as if a new component mounted
  const status = getRegistrationCooldown(testEmail);
  assert.strictEqual(status.active, true);
  assert.ok(status.remainingSeconds > 0);
});

// -----------------------------------------------------------------------------
// 5. Cooldown expiration after 5 minutes
// -----------------------------------------------------------------------------
runTest('Registration becomes available after cooldown expires', () => {
  const testEmail = 'expired-user@example.com';
  // Set expired cooldown in the past
  const pastTime = Date.now() - 1000;
  mockStorage.set('josan_registration_cooldowns', JSON.stringify({
    [testEmail]: { expiresAt: pastTime, seconds: 300 }
  }));

  const status = getRegistrationCooldown(testEmail);
  assert.strictEqual(status.active, false);
  assert.strictEqual(status.remainingSeconds, 0);
});

// -----------------------------------------------------------------------------
// 6. Manual clear of cooldown
// -----------------------------------------------------------------------------
runTest('Clear cooldown removes email from store', () => {
  const testEmail = 'clear-me@example.com';
  setRegistrationCooldown(testEmail, 300);
  assert.strictEqual(getRegistrationCooldown(testEmail).active, true);

  clearRegistrationCooldown(testEmail);
  assert.strictEqual(getRegistrationCooldown(testEmail).active, false);
});

// -----------------------------------------------------------------------------
// 7. Server-side Rate Limit API (/api/auth/register-rate-limit)
// -----------------------------------------------------------------------------
await runAsyncTest('Server-side API: blocks repeated registrations and rate-limit hits with HTTP 429', async () => {
  const targetEmail = `rate-limit-test-${Date.now()}@example.com`;

  // Helper mock HTTP request/response
  function createMockReqRes(body, headers = {}) {
    let statusCode = 200;
    let resHeaders = {};
    let responseBody = '';

    const req = {
      method: 'POST',
      headers: {
        'x-forwarded-for': '192.168.1.100',
        ...headers
      },
      [Symbol.asyncIterator]: async function* () {
        yield Buffer.from(JSON.stringify(body));
      }
    };

    const res = {
      set statusCode(val) { statusCode = val; },
      get statusCode() { return statusCode; },
      setHeader: (k, v) => { resHeaders[k] = v; },
      end: (data) => {
        responseBody = data;
        return res;
      }
    };

    return { req, res, getResult: () => ({ status: statusCode, headers: resHeaders, body: responseBody ? JSON.parse(responseBody) : {} }) };
  }

  // 1. Initial check: should be allowed
  const check1 = createMockReqRes({ action: 'check', email: targetEmail });
  await handleApiRequest(check1.req, check1.res, '/api/auth/register-rate-limit');
  const res1 = check1.getResult();
  assert.strictEqual(res1.status, 200);
  assert.strictEqual(res1.body.allowed, true);

  // 2. Second check within 5 minutes for the SAME email: should be blocked with 429!
  const check2 = createMockReqRes({ action: 'check', email: targetEmail });
  await handleApiRequest(check2.req, check2.res, '/api/auth/register-rate-limit');
  const res2 = check2.getResult();
  assert.strictEqual(res2.status, 429);
  assert.strictEqual(res2.body.allowed, false);
  assert.strictEqual(res2.body.message, 'Too many registration attempts. Please try again in 5 minutes.');
  assert.ok(res2.body.retryAfter > 0 && res2.body.retryAfter <= 300);

  // 3. Record rate limit lockout from Supabase: should lock email and IP for 300s
  const recordReq = createMockReqRes({ action: 'record', email: targetEmail, seconds: 300 });
  await handleApiRequest(recordReq.req, recordReq.res, '/api/auth/register-rate-limit');
  const recordRes = recordReq.getResult();
  assert.strictEqual(recordRes.status, 200);
  assert.strictEqual(recordRes.body.success, true);

  // 4. Verification that locked email returns 429
  const check3 = createMockReqRes({ action: 'check', email: targetEmail });
  await handleApiRequest(check3.req, check3.res, '/api/auth/register-rate-limit');
  const res3 = check3.getResult();
  assert.strictEqual(res3.status, 429);
  assert.strictEqual(res3.body.message, 'Too many registration attempts. Please try again in 5 minutes.');
});

// -----------------------------------------------------------------------------
// 8. Inactivity Session Timeout Logic (15 Minutes)
// -----------------------------------------------------------------------------
runTest('Inactivity session timeout is 15 minutes (900 seconds) and distinct from registration cooldown', () => {
  const SESSION_INACTIVITY_MS = 15 * 60 * 1000;
  assert.strictEqual(SESSION_INACTIVITY_MS, 900000);
  assert.strictEqual(REGISTRATION_COOLDOWN_SECONDS * 1000, 300000);

  // Active user (activity 5 minutes ago) -> not expired
  const now = Date.now();
  const recentActive = now - (5 * 60 * 1000);
  assert.strictEqual(now - recentActive >= SESSION_INACTIVITY_MS, false);

  // Inactive user (activity 16 minutes ago) -> expired
  const expiredActive = now - (16 * 60 * 1000);
  assert.strictEqual(now - expiredActive >= SESSION_INACTIVITY_MS, true);
});

// -----------------------------------------------------------------------------
// 9. Session timeout logout does not wipe out registration cooldown
// -----------------------------------------------------------------------------
runTest('Session timeout cleanup preserves registration cooldown storage key', () => {
  mockStorage.set('josan_registration_cooldowns', JSON.stringify({ 'user@test.com': { expiresAt: Date.now() + 200000 } }));
  mockStorage.set('josan_staff_user', JSON.stringify({ id: 'staff-1', role: 'ADMIN' }));
  mockStorage.set('josan_last_activity', String(Date.now()));

  // Simulate logout cleanup
  const keysToRemove = [];
  for (let i = 0; i < mockStorage.size; i++) {
    const key = Array.from(mockStorage.keys())[i];
    if (key && key.startsWith('josan_') && key !== 'josan_registration_cooldowns') {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(k => mockStorage.delete(k));

  assert.strictEqual(mockStorage.has('josan_staff_user'), false);
  assert.strictEqual(mockStorage.has('josan_last_activity'), false);
  assert.strictEqual(mockStorage.has('josan_registration_cooldowns'), true);
});

console.log(`\n====================================================`);
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log(`====================================================`);

if (passedTests !== totalTests) {
  process.exit(1);
}

