/**
 * Client-Side API Utility for Staff Authentication & Management
 * Communicates with server endpoints in /api/staff/*
 */

export const STAFF_TOKEN_KEY = 'josan_staff_token';
export const STAFF_USER_KEY = 'josan_staff_user';

export function getStoredStaffToken() {
  try {
    return localStorage.getItem(STAFF_TOKEN_KEY) || '';
  } catch (e) {
    return '';
  }
}

export function getStoredStaffUser() {
  try {
    const raw = localStorage.getItem(STAFF_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function storeStaffAuthSession(token, user) {
  try {
    if (token) localStorage.setItem(STAFF_TOKEN_KEY, token);
    if (user) localStorage.setItem(STAFF_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('[StaffApi] LocalStorage error:', e);
  }
}

export function clearStoredStaffSession() {
  try {
    localStorage.removeItem(STAFF_TOKEN_KEY);
    localStorage.removeItem(STAFF_USER_KEY);
  } catch (e) {
    // Ignore
  }
}

async function staffRequest(endpoint, options = {}) {
  const token = options.token || getStoredStaffToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(data.error || 'A network or authentication error occurred.');
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

// 1. Staff Login Step 1 (Email + Password)
export async function staffLogin({ email, password }) {
  return staffRequest('/api/staff/login', {
    method: 'POST',
    body: { email, password }
  });
}

// 2. Staff 2FA Verification Step 2
export async function staffVerify2FA({ preAuthTicket, code }) {
  return staffRequest('/api/staff/2fa/verify', {
    method: 'POST',
    body: { preAuthTicket, code }
  });
}

// 3. Staff Mandatory Password Change
export async function staffChangePassword({ changePasswordTicket, newPassword }) {
  return staffRequest('/api/staff/change-password', {
    method: 'POST',
    body: { changePasswordTicket, newPassword }
  });
}

// 4. Staff Forgot Password (1-hour link request)
export async function staffForgotPassword({ email }) {
  return staffRequest('/api/staff/forgot-password', {
    method: 'POST',
    body: { email }
  });
}

// 5. Staff Reset Password with 1-hour token
export async function staffResetPassword({ token, newPassword }) {
  return staffRequest('/api/staff/reset-password', {
    method: 'POST',
    body: { token, newPassword }
  });
}

// 6. Verify 48-hour Invitation Token
export async function checkStaffInvitation(token) {
  return staffRequest(`/api/staff/invitation?token=${encodeURIComponent(token)}`);
}

// 7. Accept 48-hour Invitation
export async function acceptStaffInvitation({ token, password }) {
  return staffRequest('/api/staff/invitation/accept', {
    method: 'POST',
    body: { token, password }
  });
}

// 8. Validate Active Session
export async function validateStaffSession(token) {
  return staffRequest('/api/staff/session', { token });
}

// =========================================================
// ADMIN ONLY OPERATIONS (Server strictly enforces Admin role)
// =========================================================

export async function fetchStaffUsers(token) {
  return staffRequest('/api/staff/users', { token });
}

export async function inviteStaffMember(token, { name, email, role }) {
  return staffRequest('/api/staff/invite', {
    method: 'POST',
    token,
    body: { name, email, role }
  });
}

export async function toggleStaffStatus(token, { userId, status }) {
  return staffRequest('/api/staff/toggle-status', {
    method: 'POST',
    token,
    body: { userId, status }
  });
}

export async function deleteStaffMember(token, userId) {
  return staffRequest('/api/staff/delete-user', {
    method: 'POST',
    token,
    body: { userId }
  });
}

export async function forceStaffPasswordReset(token, userId) {
  return staffRequest('/api/staff/force-reset', {
    method: 'POST',
    token,
    body: { userId }
  });
}

export async function forceStaffLogout(token, userId) {
  return staffRequest('/api/staff/force-logout', {
    method: 'POST',
    token,
    body: { userId }
  });
}

export async function fetchStaffAuditLogs(token) {
  return staffRequest('/api/staff/audit-log', { token });
}
