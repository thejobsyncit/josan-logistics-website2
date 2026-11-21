/**
 * Role Normalization and Access Control Helpers
 * Supported staff roles: ADMIN, CRM, READONLY, OPERATIONS, FINANCE, AIRWAY_EXECUTIVE.
 */

export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  CRM: 'CRM',
  READONLY: 'READONLY',
  OPERATIONS: 'OPERATIONS',
  FINANCE: 'FINANCE',
  AIRWAY_EXECUTIVE: 'AIRWAY_EXECUTIVE',
  CUSTOMER: 'CUSTOMER'
});

/**
 * Trims, uppercases, and normalizes a raw role string.
 * Maps READ-ONLY, READ_ONLY, READ ONLY, VIEWER, and READONLY to READONLY.
 * Returns a supported staff/customer role, or null for anything else.
 *
 * @param {string} raw
 * @returns {'ADMIN' | 'CRM' | 'READONLY' | 'CUSTOMER' | null}
 */
export function normalizeRole(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.trim().toUpperCase();

  if (s === 'ADMIN') return 'ADMIN';
  if (s === 'CRM') return 'CRM';
  if (s === 'OPERATIONS') return 'OPERATIONS';
  if (s === 'FINANCE') return 'FINANCE';
  if (s === 'AIRWAY_EXECUTIVE') return 'AIRWAY_EXECUTIVE';
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
  return ['ADMIN', 'CRM', 'READONLY', 'OPERATIONS', 'FINANCE', 'AIRWAY_EXECUTIVE'].includes(normalized);
}

/**
 * Returns true only for roles with edit/write permissions: ADMIN, CRM.
 *
 * @param {string} role
 * @returns {boolean}
 */
export function canEditRole(role) {
  const normalized = normalizeRole(role);
  return ['ADMIN', 'CRM', 'OPERATIONS', 'FINANCE', 'AIRWAY_EXECUTIVE'].includes(normalized);
}

export function getRoleDisplayName(role) {
  const normalized = normalizeRole(role);
  const labels = {
    ADMIN: 'Admin',
    CRM: 'CRM Operations',
    READONLY: 'Read-only',
    OPERATIONS: 'Operations',
    FINANCE: 'Finance Executive',
    AIRWAY_EXECUTIVE: 'Airway Executive'
  };
  return labels[normalized] || 'Customer';
}
