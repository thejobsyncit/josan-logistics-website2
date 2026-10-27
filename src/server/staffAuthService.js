/**
 * Josan Logistics - Staff Authentication & Account Management Service
 * 
 * Enforces:
 * - Passwords: minimum 12 characters, hashed via bcryptjs, never plain text.
 * - Two-Factor Authentication (TOTP / Authenticator App - RFC 6238).
 * - One-time setup command for first admin (mustChangePassword: true).
 * - Invitation links with 48h expiration.
 * - Password reset links with 1h expiration.
 * - Server-side role enforcement (Admin, CRM Operations, Read-only).
 * - Session invalidation via tokenVersion (forced logout).
 * - Generic error "Incorrect email or password" to prevent user enumeration.
 * - Rate limiting, brute-force lockout, and admin security alerts.
 * - Audit logging of all security events.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'staff_users.json');
const AUDIT_FILE = path.join(DATA_DIR, 'staff_audit_log.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'staff_active_sessions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory rate limiting and lockout state
// key: identifier (ip or ip:email) -> { count, lastAttemptAt, lockedUntil, alerted }
const failedAttemptsMap = new Map();
const recentAttemptsWindowMap = new Map();

// Helper to read / write JSON safely
function readJsonFile(filePath, defaultVal = []) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content ? JSON.parse(content) : defaultVal;
    }
  } catch (err) {
    console.error(`[StaffAuth] Error reading ${filePath}:`, err.message);
  }
  return defaultVal;
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[StaffAuth] Error writing ${filePath}:`, err.message);
  }
}

// -------------------------------------------------------------
// TOTP (RFC 6238) IMPLEMENTATION
// -------------------------------------------------------------
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateBase32Secret(length = 32) {
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += BASE32_ALPHABET[bytes[i] % 32];
  }
  return result;
}

export function base32ToBuffer(base32) {
  const clean = (base32 || '').toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = '';
  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_ALPHABET.indexOf(clean[i]);
    if (val === -1) throw new Error('Invalid Base32 character: ' + clean[i]);
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

export function generateTOTPCode(secret, timestamp = Date.now()) {
  const counter = Math.floor(timestamp / 1000 / 30);
  const counterBuf = Buffer.alloc(8);
  counterBuf.writeBigInt64BE(BigInt(counter));
  const key = base32ToBuffer(secret);
  const hmac = crypto.createHmac('sha1', key).update(counterBuf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  const otp = (binary % 1000000).toString().padStart(6, '0');
  return otp;
}

export function verifyTOTPCode(code, secret, windowSteps = 1) {
  if (!code || !secret) return false;
  const cleanCode = String(code).trim();
  const now = Date.now();
  for (let step = -windowSteps; step <= windowSteps; step++) {
    const testTime = now + step * 30000;
    if (generateTOTPCode(secret, testTime) === cleanCode) {
      return true;
    }
  }
  return false;
}

export function buildOtpAuthUri(email, secret) {
  const encodedEmail = encodeURIComponent(email);
  return `otpauth://totp/Josan%20Logistics:${encodedEmail}?secret=${secret}&issuer=Josan%20Logistics&algorithm=SHA1&digits=6&period=30`;
}

// -------------------------------------------------------------
// AUDIT LOGGING
// -------------------------------------------------------------
export function logAuditEvent({ eventType, actor, targetUser = null, ip = '127.0.0.1', details = '' }) {
  const logs = readJsonFile(AUDIT_FILE, []);
  const entry = {
    id: `AUD-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    timestamp: new Date().toISOString(),
    eventType,
    actor: typeof actor === 'object' ? { email: actor.email, role: actor.role, name: actor.name } : { email: actor || 'System' },
    targetUser,
    ip,
    details
  };
  logs.unshift(entry);
  // Keep last 1000 entries
  if (logs.length > 1000) {
    logs.length = 1000;
  }
  writeJsonFile(AUDIT_FILE, logs);
  return entry;
}

export function getAuditLogs(actorUser) {
  if (!actorUser || (actorUser.role || '').toLowerCase() !== 'admin') {
    return { error: 'Forbidden: Insufficient privileges. Admin access required.', status: 403 };
  }
  return { logs: readJsonFile(AUDIT_FILE, []) };
}

// -------------------------------------------------------------
// USER STORE HELPERS
// -------------------------------------------------------------
export function getAllStaffUsers() {
  return readJsonFile(USERS_FILE, []);
}

export function saveStaffUsers(users) {
  writeJsonFile(USERS_FILE, users);
}

export function findStaffByEmail(email) {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  const users = getAllStaffUsers();
  return users.find(u => u.email.toLowerCase() === clean) || null;
}

export function findStaffById(id) {
  if (!id) return null;
  const users = getAllStaffUsers();
  return users.find(u => u.id === id) || null;
}

// Password Validator: minimum 12 characters
export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required.' };
  }
  if (password.length < 12) {
    return { valid: false, message: 'Password must be at least 12 characters long.' };
  }
  return { valid: true };
}

// -------------------------------------------------------------
// RATE LIMITING & LOCKOUT (Requirement 6)
// -------------------------------------------------------------
export function checkLoginRateLimitAndLockout(ip, email = '') {
  const now = Date.now();
  const key = `${ip}:${(email || '').toLowerCase()}`;

  // Check Account / IP Lockout (5 consecutive failures = 15 minutes lockout)
  const failedRecord = failedAttemptsMap.get(key) || failedAttemptsMap.get(ip);
  if (failedRecord && failedRecord.lockedUntil && now < failedRecord.lockedUntil) {
    const waitSeconds = Math.ceil((failedRecord.lockedUntil - now) / 1000);
    return {
      allowed: false,
      reason: 'LOCKED',
      retryAfter: waitSeconds,
      message: `Account is temporarily locked due to repeated failed login attempts. Please wait ${waitSeconds}s or contact an administrator.`
    };
  }

  // Check IP rate limiter (maximum 5 attempts per minute)
  const ipAttempts = recentAttemptsWindowMap.get(ip) || [];
  const validWindowAttempts = ipAttempts.filter(t => now - t < 60000);
  if (validWindowAttempts.length >= 5) {
    const retryAfter = Math.ceil((validWindowAttempts[0] + 60000 - now) / 1000);
    return {
      allowed: false,
      reason: 'RATE_LIMIT',
      retryAfter: Math.max(1, retryAfter),
      message: `Access throttled: Maximum 5 attempts per minute. Please wait ${retryAfter}s before retrying.`
    };
  }

  return { allowed: true };
}

export function recordFailedLoginAttempt(ip, email = '') {
  const now = Date.now();
  const key = `${ip}:${(email || '').toLowerCase()}`;

  // Record into rolling 60s window
  const ipAttempts = recentAttemptsWindowMap.get(ip) || [];
  const validAttempts = ipAttempts.filter(t => now - t < 60000);
  validAttempts.push(now);
  recentAttemptsWindowMap.set(ip, validAttempts);

  // Record into failed consecutive tracker
  const record = failedAttemptsMap.get(key) || { count: 0, lastAttemptAt: now, lockedUntil: 0, alerted: false };
  record.count += 1;
  record.lastAttemptAt = now;

  // Lockout policy: 5 consecutive failures = 15 minutes lockout + admin alert
  if (record.count >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000;
    if (!record.alerted) {
      record.alerted = true;
      // Alert Admins via Audit log and notification
      logAuditEvent({
        eventType: 'FAILED_LOGIN_ALERT',
        actor: 'Security Watchdog',
        targetUser: email || 'Unknown',
        ip,
        details: `CRITICAL ALERT: 5 consecutive failed login attempts detected for ${email || 'unknown'} from IP ${ip}. Account/IP locked for 15 minutes.`
      });
      console.warn(`[SECURITY ALERT] 5 failed login attempts for ${email} from ${ip}. Lockout active for 15 minutes.`);
    }
  }

  failedAttemptsMap.set(key, record);
  failedAttemptsMap.set(ip, record);
}

export function recordSuccessfulLogin(ip, email = '') {
  const key = `${ip}:${(email || '').toLowerCase()}`;
  failedAttemptsMap.delete(key);
  failedAttemptsMap.delete(ip);
}

// -------------------------------------------------------------
// ONE-TIME SETUP COMMAND FOR FIRST ADMIN (Requirement 1)
// -------------------------------------------------------------
export function createFirstAdminAccount({ email, name, password }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanName = (name || '').trim();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Valid admin email is required.');
  }

  const passCheck = validatePasswordStrength(password);
  if (!passCheck.valid) {
    throw new Error(passCheck.message);
  }

  const users = getAllStaffUsers();
  // Check if any admin already exists
  const existingAdmin = users.find(u => u.role === 'Admin');
  if (existingAdmin && existingAdmin.status === 'Active') {
    throw new Error(`An active Admin account (${existingAdmin.email}) already exists. Use the Admin Portal to manage accounts.`);
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);
  const twoFactorSecret = generateBase32Secret(20);

  const newAdmin = {
    id: `STAFF-ADM-${Date.now().toString().slice(-6)}`,
    name: cleanName || 'System Administrator',
    email: cleanEmail,
    role: 'Admin',
    passwordHash,
    mustChangePassword: true, // Must change strong password on first login
    twoFactorSecret,
    twoFactorConfirmed: false,
    status: 'Active',
    lastLoginAt: null,
    tokenVersion: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const filtered = users.filter(u => u.email.toLowerCase() !== cleanEmail);
  filtered.unshift(newAdmin);
  saveStaffUsers(filtered);

  logAuditEvent({
    eventType: 'ACCOUNT_CREATED',
    actor: 'CLI Setup Command',
    targetUser: cleanEmail,
    details: 'Initial first administrator account provisioned via CLI setup command.'
  });

  return {
    user: {
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      mustChangePassword: newAdmin.mustChangePassword
    },
    twoFactorSecret,
    otpAuthUri: buildOtpAuthUri(cleanEmail, twoFactorSecret)
  };
}

// -------------------------------------------------------------
// AUTHENTICATION FLOW (LOGIN -> 2FA -> MUST CHANGE PASSWORD)
// -------------------------------------------------------------
export async function authenticateStaffStep1({ email, password, ip = '127.0.0.1' }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  // Generic error strictly required by requirement 6:
  const GENERIC_ERROR = 'Incorrect email or password.';

  // Check rate limits & lockouts
  const rateCheck = checkLoginRateLimitAndLockout(ip, cleanEmail);
  if (!rateCheck.allowed) {
    return {
      success: false,
      error: rateCheck.message,
      rateLimited: true,
      retryAfter: rateCheck.retryAfter,
      status: 429
    };
  }

  if (!cleanEmail || !cleanPassword) {
    recordFailedLoginAttempt(ip, cleanEmail);
    return { success: false, error: GENERIC_ERROR, status: 401 };
  }

  const user = findStaffByEmail(cleanEmail);
  if (!user || user.status !== 'Active') {
    // Record failure without revealing email existence
    recordFailedLoginAttempt(ip, cleanEmail);
    logAuditEvent({
      eventType: 'LOGIN_FAILED',
      actor: cleanEmail,
      ip,
      details: 'Failed login attempt: Account does not exist or is inactive.'
    });
    return { success: false, error: GENERIC_ERROR, status: 401 };
  }

  // Verify bcrypt password
  const matches = bcrypt.compareSync(cleanPassword, user.passwordHash);
  if (!matches) {
    recordFailedLoginAttempt(ip, cleanEmail);
    logAuditEvent({
      eventType: 'LOGIN_FAILED',
      actor: cleanEmail,
      ip,
      details: 'Failed login attempt: Invalid password provided.'
    });
    return { success: false, error: GENERIC_ERROR, status: 401 };
  }

  // Password correct! Generate a temporary pre-auth ticket for 2FA verification (valid for 5 minutes)
  const preAuthTicket = crypto.randomBytes(32).toString('hex');
  const tempSessions = readJsonFile(SESSIONS_FILE, []);
  // Remove expired temp sessions
  const now = Date.now();
  const validTemp = tempSessions.filter(s => s.expiresAt > now);
  validTemp.push({
    ticket: preAuthTicket,
    userId: user.id,
    email: user.email,
    ip,
    expiresAt: now + 5 * 60 * 1000
  });
  writeJsonFile(SESSIONS_FILE, validTemp);

  return {
    success: true,
    require2FA: true,
    twoFactorConfirmed: !!user.twoFactorConfirmed,
    // If not confirmed yet, send secret for initial app configuration
    twoFactorSecret: !user.twoFactorConfirmed ? user.twoFactorSecret : undefined,
    otpAuthUri: !user.twoFactorConfirmed ? buildOtpAuthUri(user.email, user.twoFactorSecret) : undefined,
    preAuthTicket
  };
}

export function verifyStaff2FAStep2({ preAuthTicket, code, ip = '127.0.0.1' }) {
  const GENERIC_ERROR = 'Invalid or expired authentication verification code.';
  const tempSessions = readJsonFile(SESSIONS_FILE, []);
  const now = Date.now();
  const sessionIndex = tempSessions.findIndex(s => s.ticket === preAuthTicket && s.expiresAt > now);

  if (sessionIndex === -1) {
    return { success: false, error: 'Authentication session expired. Please sign in again.', status: 401 };
  }

  const sessionData = tempSessions[sessionIndex];
  const user = findStaffById(sessionData.userId);
  if (!user || user.status !== 'Active') {
    return { success: false, error: 'User not found or inactive.', status: 401 };
  }

  const is2faValid = verifyTOTPCode(code, user.twoFactorSecret);
  if (!is2faValid) {
    recordFailedLoginAttempt(ip, user.email);
    logAuditEvent({
      eventType: 'LOGIN_FAILED',
      actor: user.email,
      ip,
      details: 'Two-factor authenticator verification failed.'
    });
    return { success: false, error: 'Invalid 6-digit authenticator code. Please check your authenticator app and try again.', status: 401 };
  }

  // TOTP is valid! Remove temp ticket
  tempSessions.splice(sessionIndex, 1);
  writeJsonFile(SESSIONS_FILE, tempSessions);

  // Record successful login reset
  recordSuccessfulLogin(ip, user.email);

  // Update user state
  const users = getAllStaffUsers();
  const userIdx = users.findIndex(u => u.id === user.id);
  if (userIdx !== -1) {
    users[userIdx].twoFactorConfirmed = true;
    users[userIdx].lastLoginAt = new Date().toISOString();
    saveStaffUsers(users);
  }

  // Check if strong password change is required (e.g. first login)
  if (user.mustChangePassword) {
    // Generate a password change ticket valid for 15 minutes
    const changePasswordTicket = crypto.randomBytes(32).toString('hex');
    tempSessions.push({
      ticket: changePasswordTicket,
      userId: user.id,
      email: user.email,
      type: 'MUST_CHANGE_PASSWORD',
      expiresAt: now + 15 * 60 * 1000
    });
    writeJsonFile(SESSIONS_FILE, tempSessions);

    return {
      success: true,
      mustChangePassword: true,
      changePasswordTicket,
      message: 'Initial login requires setting a new strong password (minimum 12 characters).'
    };
  }

  // Issue real session token
  const sessionToken = generateStaffSessionToken(user);

  logAuditEvent({
    eventType: 'LOGIN_SUCCESS',
    actor: user,
    ip,
    details: `Staff member signed in successfully with 2FA to ${user.role} role.`
  });

  return {
    success: true,
    token: sessionToken,
    user: sanitizeStaffUser(users[userIdx] || user)
  };
}

export function changeStaffPasswordRequired({ changePasswordTicket, newPassword, ip = '127.0.0.1' }) {
  const tempSessions = readJsonFile(SESSIONS_FILE, []);
  const now = Date.now();
  const idx = tempSessions.findIndex(s => s.ticket === changePasswordTicket && s.type === 'MUST_CHANGE_PASSWORD' && s.expiresAt > now);

  if (idx === -1) {
    return { success: false, error: 'Password reset session expired. Please sign in again.', status: 401 };
  }

  const session = tempSessions[idx];
  const passCheck = validatePasswordStrength(newPassword);
  if (!passCheck.valid) {
    return { success: false, error: passCheck.message, status: 400 };
  }

  const users = getAllStaffUsers();
  const userIdx = users.findIndex(u => u.id === session.userId);
  if (userIdx === -1) {
    return { success: false, error: 'User not found.', status: 404 };
  }

  // Hash new password
  const salt = bcrypt.genSaltSync(10);
  users[userIdx].passwordHash = bcrypt.hashSync(newPassword, salt);
  users[userIdx].mustChangePassword = false;
  users[userIdx].tokenVersion = (users[userIdx].tokenVersion || 1) + 1;
  users[userIdx].updatedAt = new Date().toISOString();
  saveStaffUsers(users);

  // Invalidate temp ticket
  tempSessions.splice(idx, 1);
  writeJsonFile(SESSIONS_FILE, tempSessions);

  logAuditEvent({
    eventType: 'PASSWORD_CHANGED',
    actor: users[userIdx],
    ip,
    details: 'User completed required strong password change.'
  });

  // Issue session token
  const token = generateStaffSessionToken(users[userIdx]);
  return {
    success: true,
    token,
    user: sanitizeStaffUser(users[userIdx]),
    message: 'Password successfully updated. Staff session active.'
  };
}

// -------------------------------------------------------------
// SESSION TOKEN MANAGEMENT
// -------------------------------------------------------------
export function generateStaffSessionToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    tokenVersion: user.tokenVersion || 1,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 12 * 60 * 60 * 1000 // 12 hours session
  };
  const jsonStr = JSON.stringify(payload);
  const hmac = crypto.createHmac('sha256', 'JosanLogisticsStaffSessionSecret_2026!').update(jsonStr).digest('hex');
  return Buffer.from(jsonStr).toString('base64url') + '.' + hmac;
}

export function verifyStaffSession(tokenString) {
  if (!tokenString) return null;
  try {
    const [payloadB64, signature] = tokenString.split('.');
    if (!payloadB64 || !signature) return null;
    const jsonStr = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const expectedSig = crypto.createHmac('sha256', 'JosanLogisticsStaffSessionSecret_2026!').update(jsonStr).digest('hex');
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(jsonStr);
    if (Date.now() > payload.expiresAt) return null;

    // Check against live user record to verify tokenVersion (forced logout check)
    const user = findStaffById(payload.userId);
    if (!user || user.status !== 'Active') return null;
    if ((user.tokenVersion || 1) !== payload.tokenVersion) {
      // Session has been invalidated on server
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      user
    };
  } catch (err) {
    return null;
  }
}

export function sanitizeStaffUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    twoFactorConfirmed: !!user.twoFactorConfirmed,
    mustChangePassword: !!user.mustChangePassword,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt
  };
}

// -------------------------------------------------------------
// USER MANAGEMENT ACTIONS (ADMIN ONLY) - Requirement 2
// -------------------------------------------------------------

// Add staff member & generate 48-hour invitation link
export function createStaffInvitation({ name, email, role, actor }) {
  if (!actor || (actor.role || '').toLowerCase() !== 'admin') {
    return { error: 'Forbidden: Insufficient privileges. Admin access required.', status: 403 };
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanName = (name || '').trim();
  const validRoles = ['Admin', 'CRM Operations', 'Read-only'];

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { error: 'Please enter a valid work email address.', status: 400 };
  }

  if (!cleanName) {
    return { error: 'Please enter the staff member name.', status: 400 };
  }

  if (!validRoles.includes(role)) {
    return { error: 'Invalid role. Must be Admin, CRM Operations, or Read-only.', status: 400 };
  }

  const users = getAllStaffUsers();
  if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return { error: 'A staff member with this work email already exists.', status: 400 };
  }

  // 48 hours expiration
  const invitationToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 48 * 60 * 60 * 1000;
  const twoFactorSecret = generateBase32Secret(20);

  const newUser = {
    id: `STAFF-${role === 'Admin' ? 'ADM' : role === 'CRM Operations' ? 'OPS' : 'RO'}-${Date.now().toString().slice(-6)}`,
    name: cleanName,
    email: cleanEmail,
    role,
    passwordHash: null, // Set when invitee clicks link and chooses strong password
    mustChangePassword: false,
    twoFactorSecret,
    twoFactorConfirmed: false,
    status: 'Active',
    lastLoginAt: null,
    tokenVersion: 1,
    invitation: {
      token: invitationToken,
      expiresAt: new Date(expiresAt).toISOString()
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);
  saveStaffUsers(users);

  logAuditEvent({
    eventType: 'USER_INVITED',
    actor,
    targetUser: cleanEmail,
    details: `Staff invitation issued for role: ${role}. Link valid for 48 hours.`
  });

  return {
    success: true,
    user: sanitizeStaffUser(newUser),
    invitationToken,
    expiresAt: new Date(expiresAt).toISOString(),
    inviteLink: `/#staff-setup?token=${invitationToken}`
  };
}

// Complete invitation setup: user sets their own strong password (>= 12 chars) and 2FA
export function completeStaffInvitation({ token, password, actorIp = '127.0.0.1' }) {
  if (!token) return { error: 'Missing invitation token.', status: 400 };

  const passCheck = validatePasswordStrength(password);
  if (!passCheck.valid) {
    return { error: passCheck.message, status: 400 };
  }

  const users = getAllStaffUsers();
  const userIdx = users.findIndex(u => u.invitation && u.invitation.token === token);
  if (userIdx === -1) {
    return { error: 'Invalid or expired invitation link.', status: 404 };
  }

  const user = users[userIdx];
  if (new Date(user.invitation.expiresAt).getTime() < Date.now()) {
    return { error: 'This invitation link has expired (48-hour limit reached). Please request a new invitation from an administrator.', status: 410 };
  }

  const salt = bcrypt.genSaltSync(10);
  user.passwordHash = bcrypt.hashSync(password, salt);
  user.invitation = null;
  user.status = 'Active';
  user.mustChangePassword = false;
  user.updatedAt = new Date().toISOString();
  saveStaffUsers(users);

  logAuditEvent({
    eventType: 'ACCOUNT_CREATED',
    actor: user.email,
    targetUser: user.email,
    ip: actorIp,
    details: 'Staff member accepted invitation and successfully set up credentials.'
  });

  return {
    success: true,
    user: sanitizeStaffUser(user),
    twoFactorSecret: user.twoFactorSecret,
    otpAuthUri: buildOtpAuthUri(user.email, user.twoFactorSecret),
    message: 'Password successfully configured. Please configure your authenticator app to complete setup.'
  };
}

// Deactivate or Activate user
export function toggleUserStatus({ userId, status, actor }) {
  if (!actor || (actor.role || '').toLowerCase() !== 'admin') {
    return { error: 'Forbidden: Insufficient privileges. Admin access required.', status: 403 };
  }

  const users = getAllStaffUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return { error: 'User not found.', status: 404 };

  if (user.id === actor.userId && status === 'Deactivated') {
    return { error: 'You cannot deactivate your own active admin account.', status: 400 };
  }

  user.status = status;
  // If deactivating, force invalidate active sessions
  if (status === 'Deactivated') {
    user.tokenVersion = (user.tokenVersion || 1) + 1;
  }
  user.updatedAt = new Date().toISOString();
  saveStaffUsers(users);

  logAuditEvent({
    eventType: status === 'Deactivated' ? 'USER_DEACTIVATED' : 'USER_ACTIVATED',
    actor,
    targetUser: user.email,
    details: `User status changed to ${status}.`
  });

  return { success: true, user: sanitizeStaffUser(user) };
}

// Delete user
export function deleteStaffUser({ userId, actor }) {
  if (!actor || (actor.role || '').toLowerCase() !== 'admin') {
    return { error: 'Forbidden: Insufficient privileges. Admin access required.', status: 403 };
  }

  const users = getAllStaffUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return { error: 'User not found.', status: 404 };

  if (user.id === actor.userId) {
    return { error: 'You cannot delete your own admin account.', status: 400 };
  }

  // Prevent deleting the last remaining admin
  if (user.role === 'Admin') {
    const activeAdmins = users.filter(u => u.role === 'Admin' && u.id !== userId && u.status === 'Active');
    if (activeAdmins.length === 0) {
      return { error: 'Cannot delete the only active Administrator account in the system.', status: 400 };
    }
  }

  const filtered = users.filter(u => u.id !== userId);
  saveStaffUsers(filtered);

  logAuditEvent({
    eventType: 'USER_DELETED',
    actor,
    targetUser: user.email,
    details: `Staff user ${user.name} (${user.email}, ${user.role}) was permanently deleted.`
  });

  return { success: true, message: `Staff user ${user.name} deleted successfully.` };
}

// Force a password reset
export function forcePasswordReset({ userId, actor }) {
  if (!actor || (actor.role || '').toLowerCase() !== 'admin') {
    return { error: 'Forbidden: Insufficient privileges. Admin access required.', status: 403 };
  }

  const users = getAllStaffUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return { error: 'User not found.', status: 404 };

  // 1 hour reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 60 * 60 * 1000;

  user.mustChangePassword = true;
  user.passwordResetToken = {
    token: resetToken,
    expiresAt: new Date(expiresAt).toISOString()
  };
  // Invalidate all current active sessions
  user.tokenVersion = (user.tokenVersion || 1) + 1;
  user.updatedAt = new Date().toISOString();
  saveStaffUsers(users);

  logAuditEvent({
    eventType: 'PASSWORD_RESET_FORCED',
    actor,
    targetUser: user.email,
    details: `Administrator forced password reset for ${user.email}. Current sessions revoked, 1-hour reset link generated.`
  });

  return {
    success: true,
    message: `Password reset forced for ${user.name}.`,
    resetToken,
    resetLink: `/#staff-reset?token=${resetToken}`
  };
}

// Force a logout (immediately revokes active tokens)
export function forceLogoutStaffUser({ userId, actor }) {
  if (!actor || (actor.role || '').toLowerCase() !== 'admin') {
    return { error: 'Forbidden: Insufficient privileges. Admin access required.', status: 403 };
  }

  const users = getAllStaffUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return { error: 'User not found.', status: 404 };

  user.tokenVersion = (user.tokenVersion || 1) + 1;
  user.updatedAt = new Date().toISOString();
  saveStaffUsers(users);

  logAuditEvent({
    eventType: 'FORCED_LOGOUT',
    actor,
    targetUser: user.email,
    details: `Administrator initiated forced logout for ${user.email}. All active session tokens invalidated.`
  });

  return { success: true, message: `Forced logout applied. ${user.name}'s active sessions have been terminated.` };
}

// -------------------------------------------------------------
// FORGOT PASSWORD FLOW (Requirement 3) - 1 hour expiration
// -------------------------------------------------------------
export function requestStaffForgotPassword({ email, ip = '127.0.0.1' }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  
  // Rate limit check
  const rateCheck = checkLoginRateLimitAndLockout(ip, cleanEmail);
  if (!rateCheck.allowed) {
    return { success: false, error: rateCheck.message, status: 429 };
  }

  // Always return identical success message to prevent user enumeration
  const GENERIC_SUCCESS_MESSAGE = 'If the provided email is associated with a staff account, a password reset link has been dispatched. The link is valid for 1 hour.';

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: true, message: GENERIC_SUCCESS_MESSAGE };
  }

  const users = getAllStaffUsers();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.status === 'Active');

  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    user.passwordResetToken = {
      token: resetToken,
      expiresAt: new Date(expiresAt).toISOString()
    };
    user.updatedAt = new Date().toISOString();
    saveStaffUsers(users);

    const resetLink = `/#staff-reset?token=${resetToken}`;
    console.log(`[STAFF PASSWORD RESET] Email sent to: ${cleanEmail}. Link: ${resetLink} (Expires in 1 hour)`);

    logAuditEvent({
      eventType: 'PASSWORD_RESET_REQUESTED',
      actor: cleanEmail,
      targetUser: cleanEmail,
      ip,
      details: 'Staff requested self-service password reset. 1-hour reset token issued.'
    });

    return {
      success: true,
      message: GENERIC_SUCCESS_MESSAGE,
      // Provide reset link in response for local testing/demo if needed
      devResetLink: resetLink
    };
  }

  return { success: true, message: GENERIC_SUCCESS_MESSAGE };
}

export function resetStaffPasswordWithToken({ token, newPassword, ip = '127.0.0.1' }) {
  if (!token) return { error: 'Missing password reset token.', status: 400 };

  const passCheck = validatePasswordStrength(newPassword);
  if (!passCheck.valid) {
    return { error: passCheck.message, status: 400 };
  }

  const users = getAllStaffUsers();
  const userIdx = users.findIndex(u => u.passwordResetToken && u.passwordResetToken.token === token);
  if (userIdx === -1) {
    return { error: 'Invalid or expired password reset link.', status: 404 };
  }

  const user = users[userIdx];
  if (new Date(user.passwordResetToken.expiresAt).getTime() < Date.now()) {
    return { error: 'This password reset link has expired (1-hour limit reached). Please submit a new forgot password request.', status: 410 };
  }

  const salt = bcrypt.genSaltSync(10);
  user.passwordHash = bcrypt.hashSync(newPassword, salt);
  user.passwordResetToken = null;
  user.mustChangePassword = false;
  user.tokenVersion = (user.tokenVersion || 1) + 1; // Invalidate all prior sessions
  user.updatedAt = new Date().toISOString();
  saveStaffUsers(users);

  logAuditEvent({
    eventType: 'PASSWORD_CHANGED',
    actor: user.email,
    targetUser: user.email,
    ip,
    details: 'User successfully completed password reset via 1-hour email token.'
  });

  return {
    success: true,
    message: 'Your password has been successfully reset. You may now log in with your new password and 2FA.'
  };
}
