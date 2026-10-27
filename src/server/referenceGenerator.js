import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * 31-character alphabet strictly omitting confusing characters:
 * Excluded: 0 (zero), O (capital o), 1 (one), I (capital i), L (capital l)
 */
export const REFERENCE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
export const EXCLUDED_CHARACTERS = ['0', 'O', '1', 'I', 'L'];

// In-memory set of all issued references (persisted so deleted records never allow reuse)
const issuedReferenceRegistry = new Set();

// Determine storage path for persistent reference archive
let storageFilePath = null;
try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dataDir = path.resolve(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    try { fs.mkdirSync(dataDir, { recursive: true }); } catch (e) {}
  }
  storageFilePath = path.join(dataDir, 'issued_references_registry.json');
  if (fs.existsSync(storageFilePath)) {
    const raw = fs.readFileSync(storageFilePath, 'utf-8');
    const list = JSON.parse(raw);
    if (Array.isArray(list)) {
      list.forEach(ref => issuedReferenceRegistry.add(ref));
    }
  }
} catch (e) {
  // Running in environment without local fs write access (e.g. serverless)
}

function persistIssuedRegistry() {
  if (!storageFilePath) return;
  try {
    const list = Array.from(issuedReferenceRegistry);
    fs.writeFileSync(storageFilePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e) {
    // Non-fatal if filesystem is read-only
  }
}

/**
 * Generates cryptographically secure random characters from the allowed alphabet
 */
export function generateSecureRandomChars(length) {
  let result = '';
  const alphabetLength = REFERENCE_ALPHABET.length;
  for (let i = 0; i < length; i++) {
    const randIndex = crypto.randomInt(0, alphabetLength);
    result += REFERENCE_ALPHABET[randIndex];
  }
  return result;
}

/**
 * Validates whether a reference string complies with the alphabet and excluded characters rules
 */
export function validateReferenceString(str) {
  if (!str || typeof str !== 'string') return false;
  const upper = str.toUpperCase();
  for (const char of EXCLUDED_CHARACTERS) {
    if (upper.includes(char)) return false;
  }
  return true;
}

/**
 * Generates a server-side quote reference number:
 * - Real quote format: QR-XXXX-XXXX (for example QR-8K3F-92XD)
 * - Test quote format: TQ-XXXX-XXXX (for example TQ-4M7P-X2RB)
 * Guaranteed unique, never reused even if records are deleted.
 */
export function generateQuoteReferenceServer({ isTest = false } = {}) {
  const prefix = isTest ? 'TQ-' : 'QR-';
  let candidate = '';
  let attempts = 0;
  const MAX_ATTEMPTS = 50;

  do {
    attempts++;
    const part1 = generateSecureRandomChars(4);
    const part2 = generateSecureRandomChars(4);
    candidate = `${prefix}${part1}-${part2}`;
  } while (issuedReferenceRegistry.has(candidate) && attempts < MAX_ATTEMPTS);

  if (issuedReferenceRegistry.has(candidate)) {
    throw new Error('Collision resolution failed after maximum attempts.');
  }

  issuedReferenceRegistry.add(candidate);
  persistIssuedRegistry();

  return {
    reference: candidate,
    isTest: Boolean(isTest),
    type: isTest ? 'TEST_QUOTE' : 'QUOTE',
    createdAt: new Date().toISOString()
  };
}

/**
 * Generates a server-side shipment tracking number:
 * - Real shipment format: JOS-XXXXXXXXXX (10 random chars from alphabet, e.g. JOS-8K3F92XDW7)
 * - Test shipment format: TJOS-XXXXXXXXXX (10 random chars from alphabet, e.g. TJOS-4M7PX2RB89)
 * Guaranteed unique, never based on date or counter, never reused.
 */
export function generateShipmentTrackingNumberServer({ isTest = false } = {}) {
  const prefix = isTest ? 'TJOS-' : 'JOS-';
  let candidate = '';
  let attempts = 0;
  const MAX_ATTEMPTS = 50;

  do {
    attempts++;
    const chars = generateSecureRandomChars(10);
    candidate = `${prefix}${chars}`;
  } while (issuedReferenceRegistry.has(candidate) && attempts < MAX_ATTEMPTS);

  if (issuedReferenceRegistry.has(candidate)) {
    throw new Error('Collision resolution failed after maximum attempts.');
  }

  issuedReferenceRegistry.add(candidate);
  persistIssuedRegistry();

  return {
    trackingNumber: candidate,
    isTest: Boolean(isTest),
    type: isTest ? 'TEST_SHIPMENT' : 'SHIPMENT',
    createdAt: new Date().toISOString()
  };
}

/**
 * Checks whether a reference was ever issued
 */
export function isReferencePreviouslyIssued(ref) {
  if (!ref) return false;
  return issuedReferenceRegistry.has(ref.trim().toUpperCase());
}

/**
 * Returns current count of issued references in the server registry
 */
export function getIssuedReferencesCount() {
  return issuedReferenceRegistry.size;
}
