/**
 * Client API for Server-Generated Secure Reference Numbers
 * Formats:
 * - Real Quotes: QR-XXXX-XXXX (e.g. QR-8K3F-92XD)
 * - Test Quotes: TQ-XXXX-XXXX (e.g. TQ-4M7P-X2RB)
 * - Real Shipments: JOS-XXXXXXXXXX (e.g. JOS-8K3F92XDW7)
 * - Test Shipments: TJOS-XXXXXXXXXX (e.g. TJOS-4M7PX2RB89)
 * Alphabet: 23456789ABCDEFGHJKMNPQRSTUVWXYZ (strictly excludes 0, O, 1, I, L)
 */

export const REFERENCE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
export const EXCLUDED_CHARACTERS = ['0', 'O', '1', 'I', 'L'];

/**
 * Fallback cryptographically secure generator using Web Crypto API in browser
 * only invoked if the server endpoint is unreachable.
 */
function secureBrowserFallback(length) {
  let result = '';
  const alphabetLen = REFERENCE_ALPHABET.length;
  const randomBuffer = new Uint32Array(length);
  window.crypto.getRandomValues(randomBuffer);
  for (let i = 0; i < length; i++) {
    result += REFERENCE_ALPHABET[randomBuffer[i] % alphabetLen];
  }
  return result;
}

/**
 * Request server to generate an automatic random Quote Reference number
 */
export async function fetchServerQuoteReference({ isTest = false, contactEmail = '', isStaff = false } = {}) {
  try {
    const isTestMode = Boolean(
      isTest || 
      localStorage.getItem('josan_test_mode') === 'true' ||
      (contactEmail && (contactEmail.includes('test') || contactEmail.endsWith('@josanlogistics.com')))
    );

    const res = await fetch('/api/reference/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isTest: isTestMode,
        contactEmail,
        isStaff,
        siteMode: localStorage.getItem('josan_test_mode') === 'true' ? 'test' : 'live'
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reference) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[ReferenceAPI] Server reference endpoint offline, utilizing secure fallback:', err.message);
  }

  // Fallback using cryptographically secure Web Crypto API with persistent registry
  const isTestFinal = Boolean(
    isTest || 
    localStorage.getItem('josan_test_mode') === 'true' ||
    (contactEmail && (contactEmail.includes('test') || contactEmail.endsWith('@josanlogistics.com')))
  );
  const prefix = isTestFinal ? 'TQ-' : 'QR-';
  const usedRegistry = JSON.parse(localStorage.getItem('josan_issued_references_registry') || '[]');
  const usedSet = new Set(usedRegistry);

  let candidate = '';
  let attempts = 0;
  do {
    attempts++;
    candidate = `${prefix}${secureBrowserFallback(4)}-${secureBrowserFallback(4)}`;
  } while (usedSet.has(candidate) && attempts < 50);

  usedRegistry.push(candidate);
  localStorage.setItem('josan_issued_references_registry', JSON.stringify(usedRegistry));

  return {
    reference: candidate,
    isTest: isTestFinal,
    type: isTestFinal ? 'TEST_QUOTE' : 'QUOTE',
    createdAt: new Date().toISOString()
  };
}

/**
 * Request server to generate an automatic random Shipment Tracking number
 */
export async function fetchServerShipmentReference({ isTest = false } = {}) {
  try {
    const isTestMode = Boolean(
      isTest || localStorage.getItem('josan_test_mode') === 'true'
    );

    const res = await fetch('/api/reference/shipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isTest: isTestMode,
        siteMode: isTestMode ? 'test' : 'live'
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.trackingNumber) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[ReferenceAPI] Server shipment tracking endpoint offline, utilizing secure fallback:', err.message);
  }

  // Fallback using cryptographically secure Web Crypto API with persistent registry
  const isTestFinal = Boolean(
    isTest || localStorage.getItem('josan_test_mode') === 'true'
  );
  const prefix = isTestFinal ? 'TJOS-' : 'JOS-';
  const usedRegistry = JSON.parse(localStorage.getItem('josan_issued_references_registry') || '[]');
  const usedSet = new Set(usedRegistry);

  let candidate = '';
  let attempts = 0;
  do {
    attempts++;
    candidate = `${prefix}${secureBrowserFallback(10)}`;
  } while (usedSet.has(candidate) && attempts < 50);

  usedRegistry.push(candidate);
  localStorage.setItem('josan_issued_references_registry', JSON.stringify(usedRegistry));

  return {
    trackingNumber: candidate,
    isTest: isTestFinal,
    type: isTestFinal ? 'TEST_SHIPMENT' : 'SHIPMENT',
    createdAt: new Date().toISOString()
  };
}
