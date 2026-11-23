/**
 * Tracking Number Formatting & Sanitization Utilities
 * Enforces strictly at most 5 characters after JOS-, AWS-, TJOS-, and TAWS-.
 */

/**
 * Sanitizes user input for tracking numbers in real-time.
 * Strictly caps the portion after the hyphen to 5 alphanumeric characters.
 * Automatically inserts a hyphen if the user types or pastes prefixes directly (e.g. JOS12345 -> JOS-12345).
 * 
 * @param {string} raw - The raw input string
 * @returns {string} - The sanitized tracking number
 */
export const sanitizeTrackingInput = (raw) => {
  if (!raw) return '';
  const val = String(raw).toUpperCase().replace(/\s+/g, '');

  // Check for prefixes with hyphen: TJOS-, TAWS-, JOS-, AWS-
  const hyphenMatch = val.match(/^(TJOS-|TAWS-|JOS-|AWS-)(.*)/);
  if (hyphenMatch) {
    const prefix = hyphenMatch[1];
    const after = hyphenMatch[2].replace(/[^A-Z0-9]/g, '').slice(0, 5);
    return `${prefix}${after}`;
  }

  // Check for prefixes without hyphen: TJOS, TAWS, JOS, AWS followed immediately by chars
  const noHyphenMatch = val.match(/^(TJOS|TAWS|JOS|AWS)([A-Z0-9].*)/);
  if (noHyphenMatch) {
    const prefix = `${noHyphenMatch[1]}-`;
    const after = noHyphenMatch[2].replace(/[^A-Z0-9]/g, '').slice(0, 5);
    return `${prefix}${after}`;
  }

  // Handle in-progress typing of prefix (e.g. "J", "JO", "JOS", "A", "AW", "AWS", "T", "TJ", "TJOS", "TA", "TAWS")
  const cleaned = val.replace(/[^A-Z0-9\-]/g, '');
  const maxLen = (cleaned.startsWith('TJOS-') || cleaned.startsWith('TAWS-') || cleaned.startsWith('TJOS') || cleaned.startsWith('TAWS')) ? 10 : 9;
  return cleaned.slice(0, maxLen);
};

/**
 * Validates whether a tracking number is in the official format:
 * JOS-XXXXX or AWS-XXXXX (or test format TJOS-XXXXX / TAWS-XXXXX), exactly 5 alphanumeric chars.
 * 
 * @param {string} term - The tracking number string to test
 * @returns {boolean}
 */
export const isValidTrackingNumber = (term) => {
  if (!term || typeof term !== 'string') return false;
  const clean = term.trim().toUpperCase();
  if (import.meta.env?.DEV && clean === 'TEST-0001') return true;
  return /^(JOS|AWS|TJOS|TAWS)-[A-Z0-9]{5}$/.test(clean);
};

/**
 * Gets the maximum allowed input length based on the current tracking prefix.
 * 
 * @param {string} val - The current input value
 * @returns {number} - 10 for test prefixes TJOS-/TAWS-, 9 for live prefixes JOS-/AWS-
 */
export const getTrackingMaxLength = (val) => {
  if (!val) return 9;
  const upper = String(val).toUpperCase();
  return (upper.startsWith('TJOS-') || upper.startsWith('TAWS-')) ? 10 : 9;
};

