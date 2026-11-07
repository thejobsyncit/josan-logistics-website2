/**
 * Role Normalization and Access Control Helpers
 * Supported Live Roles: ADMIN, CRM, READONLY, CUSTOMER
 */

export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  CRM: 'CRM',
  READONLY: 'READONLY',
  CUSTOMER: 'CUSTOMER'
});

/**
 * Trims, uppercases, and normalizes a raw role string.
 * Maps READ-ONLY, READ_ONLY, READ ONLY, VIEWER, and READONLY to READONLY.
 * Returns ADMIN, CRM, READONLY, or CUSTOMER, or null for anything else.
 *
 * @param {string} raw
 * @returns {'ADMIN' | 'CRM' | 'READONLY' | 'CUSTOMER' | null}
 */
export function normalizeRole(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.trim().toUpperCase();

  if (s === 'ADMIN') return 'ADMIN';
  if (s === 'CRM') return 'CRM';
  if (s === 'CUSTOMER') return 'CUSTOMER';
  if (
    s === 'READONLY' ||
    s === 'READ-ONLY' ||
    s === 'READ_ONLY' ||
    s === 'READ ONLY' ||
    s === 'VIEWER'
  ) {
    return 'READONLY';
  }

  return null;
}

/**
 * Returns true only for staff roles: ADMIN, CRM, READONLY.
 *
 * @param {string} role
 * @returns {boolean}
 */
export function isStaffRole(role) {
  const normalized = normalizeRole(role);
  return normalized === 'ADMIN' || normalized === 'CRM' || normalized === 'READONLY';
}

/**
 * Returns true only for roles with edit/write permissions: ADMIN, CRM.
 *
 * @param {string} role
 * @returns {boolean}
 */
export function canEditRole(role) {
  const normalized = normalizeRole(role);
  return normalized === 'ADMIN' || normalized === 'CRM';
}

