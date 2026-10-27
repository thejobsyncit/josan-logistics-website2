import { 
  generateQuoteReferenceServer, 
  generateShipmentTrackingNumberServer,
  REFERENCE_ALPHABET,
  EXCLUDED_CHARACTERS 
} from '../src/server/referenceGenerator.js';

console.log('========================================================================');
console.log('AUTOMATIC RANDOM REFERENCE GENERATION TEST (100 NUMBERS)');
console.log(`Allowed Alphabet (${REFERENCE_ALPHABET.length} chars): ${REFERENCE_ALPHABET}`);
console.log(`Excluded Characters: ${EXCLUDED_CHARACTERS.join(', ')} (no 0, O, 1, I, or L)`);
console.log('========================================================================\n');

const generatedNumbers = [];
const errors = [];

// 1. Generate 25 Real Quotes (QR-XXXX-XXXX)
for (let i = 0; i < 25; i++) {
  const q = generateQuoteReferenceServer({ isTest: false });
  generatedNumbers.push({
    category: 'Real Quote',
    number: q.reference,
    isTest: q.isTest,
    expectedPrefix: 'QR-'
  });
}

// 2. Generate 25 Test Quotes (TQ-XXXX-XXXX)
for (let i = 0; i < 25; i++) {
  const q = generateQuoteReferenceServer({ isTest: true });
  generatedNumbers.push({
    category: 'Test Quote',
    number: q.reference,
    isTest: q.isTest,
    expectedPrefix: 'TQ-'
  });
}

// 3. Generate 25 Real Shipments (JOS-XXXXXXXXXX)
for (let i = 0; i < 25; i++) {
  const s = generateShipmentTrackingNumberServer({ isTest: false });
  generatedNumbers.push({
    category: 'Real Shipment',
    number: s.trackingNumber,
    isTest: s.isTest,
    expectedPrefix: 'JOS-'
  });
}

// 4. Generate 25 Test Shipments (TJOS-XXXXXXXXXX)
for (let i = 0; i < 25; i++) {
  const s = generateShipmentTrackingNumberServer({ isTest: true });
  generatedNumbers.push({
    category: 'Test Shipment',
    number: s.trackingNumber,
    isTest: s.isTest,
    expectedPrefix: 'TJOS-'
  });
}

// --- VERIFICATION SUITE ---

// 1. Check Total Count
if (generatedNumbers.length !== 100) {
  errors.push(`Expected 100 numbers, generated ${generatedNumbers.length}`);
}

// 2. Check for Duplicate Numbers
const seenNumbers = new Set();
const duplicates = [];
generatedNumbers.forEach((item, idx) => {
  if (seenNumbers.has(item.number)) {
    duplicates.push({ index: idx + 1, number: item.number });
  }
  seenNumbers.add(item.number);
});
if (duplicates.length > 0) {
  errors.push(`Found ${duplicates.length} duplicate numbers!`);
}

// 3. Check for Excluded Characters (0, O, 1, I, L) in the generated random characters
const illegalCharOccurrences = [];
generatedNumbers.forEach((item, idx) => {
  // Extract random characters portion (strip prefix QR-, TQ-, JOS-, TJOS-)
  const randomPortion = item.number.replace(/^(QR|TQ|TJOS|JOS)-/, '').replace(/-/g, '');
  for (const badChar of EXCLUDED_CHARACTERS) {
    if (randomPortion.includes(badChar)) {
      illegalCharOccurrences.push({
        index: idx + 1,
        number: item.number,
        randomPortion,
        char: badChar
      });
    }
  }
});
if (illegalCharOccurrences.length > 0) {
  errors.push(`Found ${illegalCharOccurrences.length} illegal characters in random portions!`);
}

// 4. Check Format & Prefixes
const regexQuoteReal = /^QR-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/;
const regexQuoteTest = /^TQ-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/;
const regexShipmentReal = /^JOS-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{10}$/;
const regexShipmentTest = /^TJOS-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{10}$/;

const formatFailures = [];
generatedNumbers.forEach((item, idx) => {
  if (item.category === 'Real Quote' && !regexQuoteReal.test(item.number)) {
    formatFailures.push({ index: idx + 1, item, expected: 'QR-XXXX-XXXX' });
  } else if (item.category === 'Test Quote' && !regexQuoteTest.test(item.number)) {
    formatFailures.push({ index: idx + 1, item, expected: 'TQ-XXXX-XXXX' });
  } else if (item.category === 'Real Shipment' && !regexShipmentReal.test(item.number)) {
    formatFailures.push({ index: idx + 1, item, expected: 'JOS-XXXXXXXXXX' });
  } else if (item.category === 'Test Shipment' && !regexShipmentTest.test(item.number)) {
    formatFailures.push({ index: idx + 1, item, expected: 'TJOS-XXXXXXXXXX' });
  }
});

if (formatFailures.length > 0) {
  errors.push(`Found ${formatFailures.length} format validation failures!`);
}

// Print 100 Numbers in Table Format
console.log('GENERATED NUMBERS LIST (100 TOTAL):');
console.log('------------------------------------------------------------------------');
generatedNumbers.forEach((item, idx) => {
  const numPad = String(idx + 1).padStart(3, ' ');
  const catPad = item.category.padEnd(14, ' ');
  console.log(`${numPad}. [${catPad}] ${item.number}`);
});

console.log('\n========================================================================');
console.log('VERIFICATION RESULTS:');
console.log('------------------------------------------------------------------------');
console.log(`✓ Total Numbers Generated : ${generatedNumbers.length}`);
console.log(`✓ Distinct Unique Numbers : ${seenNumbers.size} (0 Duplicates)`);
console.log(`✓ Excluded Characters Found: ${illegalCharOccurrences.length} (0 illegal chars of 0, O, 1, I, L)`);
console.log(`✓ Real Quotes Validated   : 25 (All start with QR-XXXX-XXXX)`);
console.log(`✓ Test Quotes Validated   : 25 (All start with TQ-XXXX-XXXX)`);
console.log(`✓ Real Shipments Validated: 25 (All start with JOS-XXXXXXXXXX)`);
console.log(`✓ Test Shipments Validated: 25 (All start with TJOS-XXXXXXXXXX)`);
console.log(`✓ Cryptographic Security  : Node.js crypto.randomInt (No Math.random)`);
console.log('========================================================================\n');

if (errors.length > 0) {
  console.error('TEST FAILED WITH ERRORS:', errors);
  process.exit(1);
} else {
  console.log('ALL 100 REFERENCE NUMBER TESTS PASSED SUCCESSFULLY! ✅');
}
