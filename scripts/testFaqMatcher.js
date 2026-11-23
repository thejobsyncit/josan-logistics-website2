/**
 * Comprehensive FAQ Matcher & Input Validation Test Suite
 * Tests input validation, gibberish detection, short-word whitelists,
 * acronym allowances, unrelated questions, 3-tier confidence system,
 * brand queries ("How josan works", "about josan"), and core FAQ matching.
 */

import { matchQuestion, validateUserInput, processChatQuery } from '../src/server/faqMatcher.js';
import { INITIAL_FAQS } from '../src/server/faqData.js';

const INVALID_EXPECTED_MSG = "That doesn't look like a valid question. Please enter a clear question (at least 3 characters) about Josan Logistics—such as booking a shipment, requesting a quote, tracking, or our services.";
const UNRELATED_EXPECTED_MSG = "I don't have an approved answer for that specific question. I can help with:\n- **Services & How Josan Works**\n- **Booking a Shipment & Quotes**\n- **Road Transport & Air Freight Documents**\n- **Shipment Tracking, Customs Policy & Prohibited Items**\n\nFor anything else, please reach out on our [Contact our team](/contact) page.";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('================================================================');
console.log('JOSAN LOGISTICS FAQ MATCHER & INPUT VALIDATION TEST SUITE');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// 1. INVALID / GIBBERISH / TOO-SHORT INPUTS
// -----------------------------------------------------------------------------
console.log('--- 1. Testing Invalid / Gibberish / Too-Short Inputs ---');
const invalidInputs = [
  { q: 'a', desc: 'Single character below min length' },
  { q: 'ab', desc: 'Two characters below min length' },
  { q: 'ooo', desc: 'Repeated identical characters (ooo)' },
  { q: 'fff', desc: 'Repeated identical characters (fff)' },
  { q: 'ijdsjd', desc: 'Keyboard mash with 5 consecutive consonants (jdsjd)' },
  { q: 'djfnidnfdn', desc: 'Random consonants sequence (djfn)' },
  { q: 'dnfsdnfh', desc: 'Zero vowels and 8 consecutive consonants' },
  { q: '12345', desc: 'Pure numbers without letters' },
  { q: '???', desc: 'Pure symbols without letters' }
];

for (const item of invalidInputs) {
  // Test validateUserInput directly
  const val = validateUserInput(item.q);
  assert(!val.isValid && val.reason === 'invalid_input', `validateUserInput("${item.q}") rejected (${item.desc})`);

  // Test matchQuestion
  const res = matchQuestion(item.q, INITIAL_FAQS);
  assert(
    res.matched === false &&
    res.reason === 'invalid_input' &&
    res.answer === INVALID_EXPECTED_MSG,
    `matchQuestion("${item.q}") returned matched:false, reason:invalid_input`
  );
}

// -----------------------------------------------------------------------------
// 2. WHITELISTED SHORT INPUTS (Must STILL work normally)
// -----------------------------------------------------------------------------
console.log('\n--- 2. Testing Whitelisted Short Inputs (hi, ok, bye) ---');
const whitelistedShortInputs = ['hi', 'ok', 'bye'];

for (const q of whitelistedShortInputs) {
  const val = validateUserInput(q);
  assert(val.isValid === true, `validateUserInput("${q}") passes whitelist`);

  const res = matchQuestion(q, INITIAL_FAQS);
  assert(
    res.matched === true &&
    res.reason === null &&
    res.isFallback === false &&
    typeof res.answer === 'string' &&
    res.answer.length > 10,
    `matchQuestion("${q}") matched successfully: [${res.matchLayer}]`
  );
}

// -----------------------------------------------------------------------------
// 3. LOGISTICS ACRONYMS (Must STILL work normally, not blocked by vowel check)
// -----------------------------------------------------------------------------
console.log('\n--- 3. Testing Logistics Acronyms (awb, gst, ftl) ---');
const acronymInputs = [
  { q: 'awb', expectedCategory: 'Air Freight & AWB Documentation' },
  { q: 'gst', expectedCategory: 'Pricing, Quotes & Billing' },
  { q: 'ftl', expectedCategory: 'Road Transport, Fleet & Vehicles' }
];

for (const item of acronymInputs) {
  const val = validateUserInput(item.q);
  assert(val.isValid === true, `validateUserInput("${item.q}") passes acronym check`);

  const res = matchQuestion(item.q, INITIAL_FAQS);
  assert(
    res.matched === true &&
    res.reason === null &&
    res.isFallback === false &&
    res.category === item.expectedCategory,
    `matchQuestion("${item.q}") matched -> ${res.matchedFaqId} in [${res.category}]`
  );
}

// -----------------------------------------------------------------------------
// 4. VALID ENGLISH BUT UNRELATED / OUT-OF-SCOPE QUESTIONS (< 0.35)
// -----------------------------------------------------------------------------
console.log('\n--- 4. Testing Valid English but Out-of-Scope Questions (< 0.35) ---');
const unrelatedInputs = [
  'What is the weather today?',
  'What is the weather in Tokyo?',
  'Tell me a joke',
  'Write me a poem'
];

for (const q of unrelatedInputs) {
  const val = validateUserInput(q);
  assert(val.isValid === true, `validateUserInput("${q}") is valid English syntax`);

  const res = matchQuestion(q, INITIAL_FAQS);
  assert(
    res.matched === false &&
    res.reason === 'unrelated' &&
    res.confidence < 0.35 &&
    res.answer === UNRELATED_EXPECTED_MSG,
    `matchQuestion("${q}") returns matched:false, reason:unrelated (< 0.35)`
  );
}

// -----------------------------------------------------------------------------
// 5. CORE BUSINESS QUESTIONS (Regression Check)
// -----------------------------------------------------------------------------
console.log('\n--- 5. Regression Check on Core Josan Inquiries ---');
const coreTests = [
  { q: 'services provided', expectedId: 'sys_capabilities' },
  { q: 'Road Pricing', expectedId: 'sys_road_transport_pricing' },
  { q: 'road transport details', expectedId: 'faq_r52_vehicle_types' },
  { q: 'how many pallets in 14ft truck', expectedId: 'faq_r62_pallet_capacity_14ft' },
  { q: 'tailgate charge', expectedId: 'faq_p36_tailgate_charges' },
  { q: 'driver waiting time', expectedId: 'faq_p37_driver_waiting_time_charge' },
  { q: 'singapore to jb trucking', expectedId: 'faq_r73_cross_border_malaysia' },
  { q: 'where is your office', expectedId: 'faq_co191_where_located' }
];

for (const item of coreTests) {
  const res = matchQuestion(item.q, INITIAL_FAQS);
  assert(
    res.matched === true &&
    (res.matchedFaqId === item.expectedId || (item.q.includes('road') && res.category === 'Road Transport, Fleet & Vehicles')),
    `matchQuestion("${item.q}") -> ${res.matchedFaqId} [${res.confidence}]`
  );
}

// -----------------------------------------------------------------------------
// 6. CONVERSATIONAL SHORTHAND, SLANG & INTENT DISAMBIGUATION
// -----------------------------------------------------------------------------
console.log('\n--- 6. Testing Conversational Shorthand, Slang & Intent Disambiguation ---');
const conversationalTests = [
  { q: 'tell me about ur services', expectedId: 'sys_capabilities' },
  { q: 'ur services', expectedId: 'sys_capabilities' },
  { q: 'tell me ur services', expectedId: 'sys_capabilities' },
  { q: 'about ur services', expectedId: 'sys_capabilities' },
  { q: 'services info', expectedId: 'sys_capabilities' },
  { q: 'tell me about services', expectedId: 'sys_capabilities' },
  { q: 'what services do you offer', expectedId: 'sys_capabilities' },
  { q: 'what are ur rates', expectedId: 'faq_p26_freight_cost' },
  { q: 'payment options', expectedId: 'faq_p42_payment_methods' },
  { q: 'modes of payment', expectedId: 'faq_p42_payment_methods' },
  { q: 'how do i pay', expectedId: 'faq_p42_payment_methods' },
  { q: 'give me a quotation', expectedId: 'faq_p30_request_quote' },
  { q: 'i need a quotation', expectedId: 'faq_p30_request_quote' },
  { q: 'what is your uen', expectedId: 'faq_co202_business_uen' },
  { q: 'what is ur uen', expectedId: 'faq_co202_business_uen' }
];

for (const item of conversationalTests) {
  const res = matchQuestion(item.q, INITIAL_FAQS);
  assert(
    res.matched === true && res.matchedFaqId === item.expectedId,
    `matchQuestion("${item.q}") -> ${res.matchedFaqId} [${res.confidence}]`
  );
}

// -----------------------------------------------------------------------------
// 7. ACCOUNT CREATION, REGISTRATION & PORTAL INTENTS
// -----------------------------------------------------------------------------
console.log('\n--- 7. Testing Account Creation, Registration & Portal Intents ---');
const accountTests = [
  { q: 'How to create an account', expectedIds: ['faq_cp211_create_customer_account', 'sys_account_creation'] },
  { q: 'how do i create an account', expectedIds: ['faq_cp211_create_customer_account', 'sys_account_creation'] },
  { q: 'create account', expectedIds: ['faq_cp211_create_customer_account', 'sys_account_creation'] },
  { q: 'create an account', expectedIds: ['faq_cp211_create_customer_account', 'sys_account_creation'] },
  { q: 'how to sign up', expectedIds: ['faq_cp211_create_customer_account', 'sys_account_creation'] },
  { q: 'how to register', expectedIds: ['faq_cp211_create_customer_account', 'sys_account_creation'] },
  { q: 'account registration', expectedIds: ['faq_cp211_create_customer_account', 'sys_account_creation'] },
  { q: 'account details needed', expectedIds: ['faq_cp211_create_customer_account', 'sys_account_creation'] },
  { q: 'do i need an account', expectedIds: ['faq_cp212_do_i_need_an_account', 'sys_account_requirement'] },
  { q: 'how to login', expectedIds: ['sys_account_login'] },
  { q: 'how to sign in', expectedIds: ['sys_account_login'] },
  { q: 'forgot password', expectedIds: ['faq_cp213_forgot_reset_password', 'sys_account_password'] },
  { q: 'reset password', expectedIds: ['faq_cp213_forgot_reset_password', 'sys_account_password'] }
];

for (const item of accountTests) {
  const res = matchQuestion(item.q, INITIAL_FAQS);
  assert(
    res.matched === true && item.expectedIds.includes(res.matchedFaqId),
    `matchQuestion("${item.q}") -> ${res.matchedFaqId} [${res.confidence}]`
  );
}

// -----------------------------------------------------------------------------
// 8. BRAND & "HOW JOSAN WORKS" INQUIRIES (High Confidence >= 0.70)
// -----------------------------------------------------------------------------
console.log('\n--- 8. Testing Brand & "How Josan Works" Inquiries (High Confidence >= 0.70) ---');
const howJosanWorksTests = [
  'How does Josan Logistics work?',
  'How josan works',
  'about josan',
  'Tell me about Josan Logistics',
  'What is Josan Logistics?',
  'How do you operate?',
  'how does this work?'
];

for (const q of howJosanWorksTests) {
  const res = matchQuestion(q, INITIAL_FAQS);
  assert(
    res.matched === true &&
    res.reason === null &&
    res.confidence >= 0.70 &&
    res.matchedFaqId === 'faq_cp214_how_josan_works',
    `matchQuestion("${q}") -> ${res.matchedFaqId} [confidence: ${res.confidence}]`
  );
}

// -----------------------------------------------------------------------------
// 9. 3-TIER CONFIDENCE SYSTEM: MEDIUM / PARTIAL MATCHES (0.35 to 0.69)
// -----------------------------------------------------------------------------
console.log('\n--- 9. Testing 3-Tier Confidence System: Medium / Partial Matches (0.35 to 0.69) ---');
const partialMatchTests = [
  'pallet specifications',
  'chiller temperature monitoring',
  'forklift driver requirements'
];

for (const q of partialMatchTests) {
  const res = matchQuestion(q, INITIAL_FAQS);
  assert(
    res.matched === false &&
    res.reason === 'partial_match' &&
    res.confidence >= 0.35 &&
    res.confidence < 0.70 &&
    typeof res.answer === 'string' &&
    res.answer.includes('Did you mean one of these?'),
    `matchQuestion("${q}") returns partial_match [confidence: ${res.confidence}] with suggestions`
  );
}

// -----------------------------------------------------------------------------
// 10. ASYNC PROCESS CHAT QUERY (Verify logging distinction across all tiers)
// -----------------------------------------------------------------------------
console.log('\n--- 10. Testing Async processChatQuery Logging Distinction Across Tiers ---');

async function testAsyncLogging() {
  // 1. Invalid input: matched: false, reason: 'invalid_input' (NOT logged)
  const invRes = await processChatQuery('ijdsjd', { sessionId: 'test-sess', ip: '127.0.0.1' });
  assert(
    invRes.matched === false && invRes.reason === 'invalid_input',
    'processChatQuery("ijdsjd") returns invalid_input without logging error'
  );

  // 2. Out-of-scope question: matched: false, reason: 'unrelated' (Logged)
  const unrelRes = await processChatQuery('What is the weather today?', { sessionId: 'test-sess', ip: '127.0.0.1' });
  assert(
    unrelRes.matched === false && unrelRes.reason === 'unrelated',
    'processChatQuery("What is the weather today?") returns unrelated (logged to unanswered)'
  );

  // 3. Partial match question: matched: false, reason: 'partial_match' (Logged)
  const partRes = await processChatQuery('pallet specifications', { sessionId: 'test-sess', ip: '127.0.0.1' });
  assert(
    partRes.matched === false && partRes.reason === 'partial_match',
    'processChatQuery("pallet specifications") returns partial_match (logged to unanswered)'
  );

  // 4. Core FAQ question: matched: true (Not logged)
  const validRes = await processChatQuery('How can I book a shipment?', { sessionId: 'test-sess', ip: '127.0.0.1' });
  assert(
    validRes.matched === true && validRes.reason === null,
    'processChatQuery("How can I book a shipment?") returns matched: true'
  );

  // 5. Brand question "How josan works": matched: true (Not logged)
  const howRes = await processChatQuery('How josan works', { sessionId: 'test-sess', ip: '127.0.0.1' });
  assert(
    howRes.matched === true &&
    howRes.reason === null &&
    howRes.matchedFaqId === 'faq_cp214_how_josan_works',
    'processChatQuery("How josan works") returns matched: true -> faq_cp214_how_josan_works'
  );

  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
  console.log('================================================================');

  process.exit(failedTests > 0 ? 1 : 0);
}

testAsyncLogging();
