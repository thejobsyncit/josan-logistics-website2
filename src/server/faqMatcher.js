/**
 * Josan Logistics Manual Rule-Based FAQ Matching Engine
 * 100% deterministic, rule-based matching with zero external AI dependencies.
 *
 * Capabilities:
 * 1. Greetings & General conversation handling (hi, hello, thanks, bye, help)
 * 2. Exact question matching
 * 3. Alternative question matching
 * 4. Keyword-based matching
 * 5. Synonym expansion
 * 6. Spelling-error tolerance (Damerau-Levenshtein distance)
 * 7. Text normalization
 * 8. Confidence scoring [0.0 - 1.0]
 * 9. Safe fallback responses
 * 10. Privacy-conscious sanitization
 */

import { getActiveFaqs, logUnansweredQuestion } from './faqData.js';

export const MIN_CONFIDENCE_THRESHOLD = 0.70;

// Common English stop words that do not carry logistics intent
export const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'arent', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but',
  'by', 'can', 'cant', 'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing',
  'dont', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt',
  'have', 'havent', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'isnt', 'it', 'its', 'itself', 'just', 'me', 'might', 'more',
  'most', 'must', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only',
  'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 's', 'same', 'she', 'should',
  'shouldnt', 'so', 'some', 'such', 't', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'wasnt', 'we', 'were', 'werent', 'what', 'when', 'where', 'which', 'while', 'who',
  'whom', 'why', 'will', 'with', 'won', 'wont', 'would', 'wouldnt', 'you', 'your', 'yours', 'yourself',
  'yourselves', 'tell', 'please', 'ur', 'urs', 'u', 'r', 'abt', 'wat', 'wut', 'pls', 'plz',
  'im', 'ive', 'id', 'show', 'give', 'share', 'explain', 'know', 'want', 'need', 'like'
]);

// Logistics Domain Synonym Dictionary
export const SYNONYM_GROUPS = [
  // Services & Capabilities
  ['service', 'services', 'offering', 'offerings', 'capability', 'capabilities', 'solution', 'solutions'],
  // Payment methods
  ['payment', 'payments', 'pay', 'paying', 'paynow', 'bank transfer', 'cheque', 'credit card', 'remittance', 'payment method', 'payment methods', 'payment option', 'payment options', 'mode of payment', 'modes of payment'],
  // Booking / sending / pickup
  ['book', 'booking', 'send', 'sending', 'transport', 'transporting', 'ship', 'shipping', 'arrange', 'arranging', 'order', 'dispatch', 'deliver', 'delivery', 'deliveries', 'move', 'moving', 'forward', 'carriage', 'haul', 'haulage', 'scheduling', 'schedule', 'pickup', 'pickups'],
  // Cargo / goods / items
  ['goods', 'products', 'cargo', 'freight', 'consignment', 'parcel', 'package', 'packages', 'items', 'load', 'materials', 'merchandise', 'carton', 'cartons', 'box', 'boxes'],
  // Quotes / pricing / rates
  ['quote', 'quotes', 'quotation', 'quotations', 'cost', 'costs', 'price', 'prices', 'pricing', 'rate', 'rates', 'charge', 'charges', 'fee', 'fees', 'estimate', 'how much', 'per kg', 'bill', 'billing', 'invoice', 'invoicing'],
  // Tracking & Status
  ['track', 'tracking', 'trace', 'status', 'where', 'location', 'progress', 'milestone', 'milestones', 'check', 'updates', 'follow', 'find', 'pod', 'proof of delivery', 'delivery order'],
  // Documentation / AWB
  ['awb', 'airway', 'airwaybill', 'air waybill', 'consignment note', 'bill of lading', 'waybill'],
  ['document', 'documents', 'documentation', 'paperwork', 'papers', 'invoice', 'commercial invoice', 'packing list', 'forms', 'checklist', 'certificate of origin'],
  // Road / Vehicles / Lorries
  ['truck', 'trucks', 'lorry', 'lorries', 'vehicle', 'vehicles', 'fleet', 'prime mover', 'prime movers', 'box truck', 'van', 'trailers', 'flatbed', 'hiab'],
  ['14ft', '14-foot', '14 foot', '14 feet'],
  ['24ft', '24-foot', '24 foot', '24 feet'],
  ['tailgate', 'tailgates', 'hydraulic tailgate', 'tail-lift', 'tail lift', 'ramp'],
  ['container', 'containers', '20ft', '40ft'],
  ['chiller', 'refrigerated', 'reefer', 'cold chain'],
  // Manpower & Handling
  ['manpower', 'driver', 'labor', 'helper', 'worker', 'lifting', 'heavy lifting', 'porter'],
  ['pallet', 'pallets', 'wooden pallet', 'pallet jack', 'trolley', 'crating', 'shrink wrap'],
  ['warehouse', 'factory', 'storage', 'depot', 'yard', 'facility'],
  // Prohibited / Regulated
  ['tobacco', 'cigarettes', 'cigarette', 'cigar', 'cigars', 'vape', 'vapes', 'smoking', 'nicotine', 'vaping'],
  ['alcohol', 'wine', 'wines', 'liquor', 'spirits', 'beer', 'beers', 'liquors'],
  ['chemical', 'chemicals', 'hazardous', 'hazmat', 'toxic', 'dangerous goods', 'corrosive', 'flammable', 'msds', 'sds'],
  ['frozen', 'fresh', 'food', 'perishable', 'meat', 'seafood', 'produce', 'cold chain'],
  ['live animal', 'live animals', 'pets', 'pet', 'dog', 'cat', 'plants'],
  // Customs / GST
  ['customs', 'clearance', 'gst', 'tax', 'taxes', 'duty', 'duties', 'tariff', 'tariffs', 'broker', 'brokerage', 'tradenet', 'permit', 'permits', 'hs code'],
  // Office / Contact
  ['office', 'address', 'location', 'hq', 'headquarters', 'place', 'where are you', 'located', 'visit', 'building', 'sim lim', 'tower'],
  ['hours', 'opening', 'operating', 'business hours', 'timings', 'time', 'open', 'close', 'working hours', '24/7', '247'],
  ['weekend', 'saturday', 'sunday', 'holiday', 'holidays', 'after-hours', 'night'],
  ['contact', 'call', 'phone', 'hotline', 'email', 'touch', 'reach', 'telephone', 'support', 'speak', 'talk', 'inquire', 'enquire', 'whatsapp'],
  // Locations / Cross-border
  ['malaysia', 'cross-border', 'jb', 'johor', 'causeway'],
  ['mall', 'shopping mall', 'shopping centre', 'commercial building'],
  ['hdb', 'condo', 'condominium', 'residential', 'house', 'home', 'apartment', 'flat', 'private property'],
  // Insurance, Loss & Damage
  ['insurance', 'insured', 'damage', 'damaged', 'broken', 'loss', 'compensation', 'claim', 'coverage', 'liability', 'dent', 'crushed'],
  // Rescheduling & Cancellation
  ['reschedule', 'rescheduling', 'change time', 'change date', 'postpone', 'delay pickup'],
  ['cancel', 'cancellation', 'cancelling', 'abort', 'drop booking'],
  // Corporate / Billing
  ['credit terms', '30 days', '30-day', 'monthly billing', 'corporate account'],
  // Account Management & Portal
  ['account', 'accounts', 'profile', 'signup', 'sign up', 'register', 'registration', 'portal', 'login', 'log in', 'signin', 'sign in', 'user account', 'corporate account', 'client portal']
];

// Pre-build synonym lookup map
const SYNONYM_MAP = new Map();
SYNONYM_GROUPS.forEach(group => {
  group.forEach(word => {
    SYNONYM_MAP.set(word.toLowerCase(), new Set(group.map(w => w.toLowerCase())));
  });
});

// Common chat slang and abbreviation expansions
const SLANG_EXPANSIONS = new Map([
  ['ur', 'your'],
  ['urs', 'yours'],
  ['u', 'you'],
  ['r', 'are'],
  ['pls', 'please'],
  ['plz', 'please'],
  ['abt', 'about'],
  ['wat', 'what'],
  ['wut', 'what'],
  ['svc', 'service'],
  ['svcs', 'services'],
  ['info', 'information'],
  ['trans', 'transport'],
  ['trnspt', 'transport'],
  ['chg', 'charge'],
  ['chgs', 'charges'],
  ['doc', 'document'],
  ['docs', 'documents'],
  ['pkg', 'package'],
  ['pkgs', 'packages'],
  ['delv', 'delivery'],
  ['dlv', 'delivery'],
  ['loc', 'location'],
  ['cgo', 'cargo'],
  ['cust', 'customs'],
  ['sg', 'singapore'],
  ['jb', 'johor bahru'],
  ['kl', 'kuala lumpur'],
  ['calc', 'calculate'],
  ['approx', 'approximately'],
  ['hr', 'hour'],
  ['hrs', 'hours'],
  ['min', 'minute'],
  ['mins', 'minutes'],
  ['sec', 'second'],
  ['secs', 'seconds'],
  ['co', 'company'],
  ['thx', 'thanks'],
  ['ty', 'thanks'],
  ['tks', 'thanks'],
  ['acct', 'account'],
  ['accts', 'accounts'],
  ['acc', 'account'],
  ['reg', 'register'],
  ['pwd', 'password'],
  ['pw', 'password']
]);

/**
 * Text Normalization
 * Expands contractions, normalizes punctuation, and standardizes chat shorthand
 */
export function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  let cleaned = text
    .toLowerCase()
    .replace(/\bcan['’]t\b/g, 'cannot')
    .replace(/\bwon['’]t\b/g, 'will not')
    .replace(/\bdon['’]t\b/g, 'do not')
    .replace(/\bdoesn['’]t\b/g, 'does not')
    .replace(/\bdidn['’]t\b/g, 'did not')
    .replace(/\bi['’]m\b/g, 'i am')
    .replace(/\bi['’]ve\b/g, 'i have')
    .replace(/\bi['’]d\b/g, 'i would')
    .replace(/\bit['’]s\b/g, 'it is')
    .replace(/\bwhat['’]s\b/g, 'what is')
    .replace(/\bwhere['’]s\b/g, 'where is')
    .replace(/\bhow['’]s\b/g, 'how is')
    .replace(/\bthere['’]s\b/g, 'there is')
    .replace(/\bthat['’]s\b/g, 'that is')
    .replace(/\byou['’]re\b/g, 'you are')
    .replace(/\bwe['’]re\b/g, 'we are')
    .replace(/\bthey['’]re\b/g, 'they are')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Word-by-word slang expansion
  if (cleaned.length > 0) {
    const words = cleaned.split(' ');
    const expanded = words.map(w => SLANG_EXPANSIONS.get(w) || w);
    return expanded.join(' ');
  }
  return cleaned;
}

/**
 * Extract word tokens from text
 */
export function tokenize(text) {
  const norm = normalizeText(text);
  if (!norm) return [];
  return norm.split(' ').filter(token => token.length > 0);
}

/**
 * Extract meaningful keywords (tokens minus stopwords)
 * Special rule: Do NOT strip 'josan' if the remaining query has 1 or fewer meaningful words
 * (e.g., "how josan works" or "about josan")
 */
export function extractKeywords(text) {
  const tokens = tokenize(text);
  const nonBrandKeywords = tokens.filter(t => t !== 'josan' && !STOP_WORDS.has(t) && t.length > 1);
  if (nonBrandKeywords.length <= 1 && tokens.includes('josan')) {
    return tokens.filter(token => (token === 'josan' || !STOP_WORDS.has(token)) && token.length > 1);
  }
  return tokens.filter(token => !STOP_WORDS.has(token) && token.length > 1);
}

/**
 * Calculate Damerau-Levenshtein distance
 */
export function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const la = a.length;
  const lb = b.length;
  const d = [];

  for (let i = 0; i <= la; i++) d[i] = [i];
  for (let j = 0; j <= lb; j++) d[0][j] = j;

  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
      }
    }
  }

  return d[la][lb];
}

/**
 * Normalized Levenshtein similarity: [0.0 - 1.0]
 */
export function levenshteinSimilarity(a, b) {
  if (a === b) return 1.0;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(a, b);
  return Math.max(0, 1 - (dist / maxLen));
}

/**
 * Check if two tokens match with basic spelling-error tolerance
 */
export function isFuzzyTokenMatch(tokenA, tokenB) {
  if (tokenA === tokenB) return true;
  const maxLen = Math.max(tokenA.length, tokenB.length);
  if (maxLen <= 3) return false;

  const dist = levenshteinDistance(tokenA, tokenB);
  if (maxLen <= 5) return dist <= 1;
  return dist <= 2;
}

/**
 * Check if tokenA matches tokenB either directly, by synonym group, or by fuzzy typo
 */
export function areTokensEquivalent(tokenA, tokenB) {
  if (tokenA === tokenB) return true;
  if (isFuzzyTokenMatch(tokenA, tokenB)) return true;

  const synonyms = SYNONYM_MAP.get(tokenA);
  if (synonyms && synonyms.has(tokenB)) {
    return true;
  }

  return false;
}

/**
 * Token-based Dice similarity between two token arrays
 */
export function tokenDiceSimilarity(tokensA, tokensB) {
  if (!tokensA.length || !tokensB.length) return 0;
  let matches = 0;
  const usedB = new Set();

  for (const tA of tokensA) {
    for (let j = 0; j < tokensB.length; j++) {
      if (!usedB.has(j) && areTokensEquivalent(tA, tokensB[j])) {
        matches++;
        usedB.add(j);
        break;
      }
    }
  }

  return (2 * matches) / (tokensA.length + tokensB.length);
}

/**
 * Redact sensitive PII from user text before logging
 */
export function sanitizeLogText(text) {
  if (!text || typeof text !== 'string') return '';
  let sanitized = text;
  sanitized = sanitized.replace(/\b[SFTGM]\d{7}[A-Z]\b/gi, '[NRIC/FIN]');
  sanitized = sanitized.replace(/\b(?:\d{4}[ -]?){3}\d{4}\b|\b\d{15,16}\b/g, '[CARD]');
  sanitized = sanitized.replace(/\b(?:\+?65\s*)?[689]\d{3}[-\s]?\d{4}\b/g, '[PHONE]');
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
  return sanitized.trim();
}

/**
 * Pure JavaScript string hash for privacy-conscious IP logging
 */
function hashString(str) {
  if (!str) return 'anon';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Strips common leading polite / conversational filler phrases
 * (e.g. "hi can you please tell me how to book" -> "how to book")
 */
function stripConversationalPrefixes(text) {
  if (!text) return '';
  let cleaned = text.trim();
  const prefixes = [
    /^(hi|hello|hey|good morning|good afternoon|good evening|greetings|dear josan|dear team|dear bot|excuse me)[,\s]+/i,
    /^(can you please tell me about|could you please tell me about|please tell me about|tell me about|can you tell me|could you tell me|please tell me|tell me)[,\s]+/i,
    /^(i want to know about|i would like to know about|i need to know about|i want to know|i would like to know|i need to know)[,\s]+/i,
    /^(can you please explain|could you please explain|please explain to me|please explain|can you explain|could you explain|explain to me|explain)[,\s]+/i,
    /^(can you check|do you know|can i ask|may i ask|may i know|can i know)[,\s]+/i,
    /^(i have a question on|i have a question about|i have an inquiry about|query about|inquiry about|question about)[,\s]+/i,
    /^(give me details on|give me details about|give me info on|give me info about|give me information on|give me information about|share info on|share information on|share details on)[,\s]+/i,
    /^(details on|details about|info on|info about|information on|information about)[,\s]+/i,
    /^(what about|how about|about|regarding|concerning)[,\s]+/i,
    /^(can you show me|could you show me|please show me|show me|show)[,\s]+/i,
    /^(i am looking for|i'm looking for|looking for|searching for)[,\s]+/i,
    /^(can you|could you|please)[,\s]+/i
  ];
  let changed = true;
  let iterations = 0;
  while (changed && iterations < 5) {
    changed = false;
    iterations++;
    for (const regex of prefixes) {
      if (regex.test(cleaned)) {
        cleaned = cleaned.replace(regex, '').trim();
        changed = true;
      }
    }
  }
  return cleaned;
}

/**
 * Whitelist of valid short inputs that bypass the 3-character minimum length check.
 */
const VALID_SHORT_INPUTS = new Set(['hi', 'hey', 'ok', 'no', 'yes', 'ty', 'bye']);

/**
 * Logistics acronyms allowed even if they lack vowels or have consonant clusters.
 */
const KNOWN_ACRONYMS = new Set([
  'awb', 'ftl', 'ptl', 'gst', 'pod', 'uen', 'msds', 'hdb', 'psa', 'erp'
]);

const KNOWN_VALID_WORDS = new Set([
  'length', 'lengths', 'strength', 'strengths', 'weight', 'weights', 'freight', 'flight', 'flights', 'straight', 'bright', 'night'
]);

/**
 * Pre-Validation & Gibberish Filter: Rejects invalid, repeated-character, and nonsense inputs.
 */
export function validateUserInput(rawInput) {
  const trimmed = (rawInput || '').trim();
  const INVALID_MSG = "That doesn't look like a valid question. Please enter a clear question (at least 3 characters) about Josan Logistics—such as booking a shipment, requesting a quote, tracking, or our services.";

  if (!trimmed) {
    return {
      isValid: false,
      reason: 'invalid_input',
      message: INVALID_MSG
    };
  }

  const cleanForShort = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Minimum Length Check (less than 3 characters, unless in whitelist)
  if (trimmed.length < 3) {
    if (VALID_SHORT_INPUTS.has(cleanForShort)) {
      return { isValid: true };
    }
    return {
      isValid: false,
      reason: 'invalid_input',
      message: INVALID_MSG
    };
  }

  // 2. Numbers / Symbols Only: Reject if input contains no letters at all (e.g. 12345, ..., @@@, ???)
  if (!/[a-zA-Z]/.test(trimmed)) {
    return {
      isValid: false,
      reason: 'invalid_input',
      message: INVALID_MSG
    };
  }

  // 3. Repeated Characters: Reject strings made of repeated identical characters (e.g., ooo, fff, aaaa, 1111, ????)
  if (cleanForShort.length >= 2 && /^(.)\1+$/.test(cleanForShort) && !VALID_SHORT_INPUTS.has(cleanForShort)) {
    return {
      isValid: false,
      reason: 'invalid_input',
      message: INVALID_MSG
    };
  }

  // 4. Keyboard Mash & Random Gibberish Check
  const words = trimmed.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z]/g, '')).filter(Boolean);

  for (const word of words) {
    if (KNOWN_ACRONYMS.has(word)) continue;
    if (KNOWN_VALID_WORDS.has(word)) continue;

    // Reject 3+ identical consecutive letters inside a single nonsense word (e.g., fff, ooo)
    if (/(.)\1{2,}/.test(word)) {
      const reduced = word.replace(/(.)\1+/g, '$1');
      if (!VALID_SHORT_INPUTS.has(reduced)) {
        return {
          isValid: false,
          reason: 'invalid_input',
          message: INVALID_MSG
        };
      }
    }

    // Reject words of 4+ letters with zero vowels (e.g. 'dnfsdnfh', 'zxcv', 'dfgh')
    if (word.length >= 4 && !/[aeiouy]/.test(word)) {
      return {
        isValid: false,
        reason: 'invalid_input',
        message: INVALID_MSG
      };
    }

    // Reject words with 4+ consecutive consonants (e.g. 'ijdsjd', 'djfnidnfdn', 'dnfsdnfh', 'asdfghjkl')
    if (/[^aeiouy]{4,}/.test(word)) {
      return {
        isValid: false,
        reason: 'invalid_input',
        message: INVALID_MSG
      };
    }

    // Reject words with very low character diversity (e.g. 'ababab', 'tototo')
    if (word.length >= 6) {
      const uniqueChars = new Set(word.split('')).size;
      if (uniqueChars <= 2) {
        return {
          isValid: false,
          reason: 'invalid_input',
          message: INVALID_MSG
        };
      }
    }
  }

  return { isValid: true };
}

/**
 * Core Rule-Based Matcher: Match a user query against a knowledge base
 */
function _matchQuestionInternal(userQuery, faqs = []) {
  // Pre-Validation / Gibberish Filter
  const validation = validateUserInput(userQuery);
  if (!validation.isValid) {
    return {
      matched: false,
      reason: validation.reason || 'invalid_input',
      isFallback: true,
      confidence: 0,
      matchLayer: 'INVALID_INPUT',
      matchedFaqId: null,
      matchedQuestion: null,
      category: 'General',
      hasQuoteAction: false,
      answer: validation.message
    };
  }

  const rawQuery = (userQuery || '').trim();
  const normalizedQuery = normalizeText(rawQuery);
  const queryTokens = tokenize(rawQuery);
  const queryKeywords = extractKeywords(rawQuery);

  const fallbackResult = {
    matched: false,
    reason: 'unrelated',
    isFallback: true,
    confidence: 0,
    matchLayer: 'NONE',
    matchedFaqId: null,
    matchedQuestion: null,
    category: 'General',
    hasQuoteAction: false,
    answer: "I don't have an approved answer for that specific question. I can help with:\n- **Services & How Josan Works**\n- **Booking a Shipment & Quotes**\n- **Road Transport & Air Freight Documents**\n- **Shipment Tracking, Customs Policy & Prohibited Items**\n\nFor anything else, please reach out on our [Contact our team](/contact) page."
  };

  if (!normalizedQuery || queryTokens.length === 0) {
    return {
      ...fallbackResult,
      answer: "I didn't catch that. Could you please type your question about our freight coordination, air freight documents, road transport, or tracking?"
    };
  }

  // ---------------------------------------------------------------------------
  // 10 CONVERSATIONAL INTENTS & GENERAL CHAT HANDLERS
  // ---------------------------------------------------------------------------

  // 1. Greetings & Openers
  const GREETING_WORDS = new Set([
    'hi', 'hello', 'hey', 'hii', 'hiii', 'helo', 'howdy', 'greetings', 'namaste',
    'yo', 'sup', 'hola', 'bonjour', 'morning', 'afternoon', 'evening'
  ]);
  const GREETING_TARGET_WORDS = new Set([
    'there', 'josan', 'logistics', 'assistant', 'bot', 'team', 'mate', 'friend',
    'all', 'everyone', 'guys', 'sir', 'madam', 'admin', 'support', 'help'
  ]);

  const greetingPhrases = [
    'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'good day',
    'anyone there', 'anyone online', 'are you there', 'is anyone there', 'anyone here',
    'hii', 'hiii', 'helo', 'namaste', 'yo', 'sup', 'start', 'howdy', 'greetings',
    'hi there', 'hello there', 'hey there', 'hey hi', 'hi hello', 'hello hi', 'hey hey',
    'hey there hi', 'oh hi', 'oh hello', 'hi josan', 'hello josan', 'hey josan',
    'hello bot', 'hi bot', 'hey bot', 'hello team', 'hi team', 'morning', 'afternoon', 'evening'
  ];

  const isGreetingMatch = (() => {
    if (greetingPhrases.some(g => normalizedQuery === g || normalizedQuery === `${g} josan` || normalizedQuery === `${g} assistant` || normalizedQuery === `${g} bot`)) {
      return true;
    }
    // Check if query is short (<= 4 tokens) and composed entirely of greeting/target words
    if (queryTokens.length <= 4) {
      const hasGreetingWord = queryTokens.some(tok => GREETING_WORDS.has(tok));
      const allAreGreetingOrTarget = queryTokens.every(tok => GREETING_WORDS.has(tok) || GREETING_TARGET_WORDS.has(tok));
      if (hasGreetingWord && allAreGreetingOrTarget) {
        return true;
      }
    }
    return false;
  })();

  if (isGreetingMatch) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'GREETING',
      matchedFaqId: 'sys_greeting',
      matchedQuestion: 'Greetings & Openers',
      category: 'General',
      hasQuoteAction: false,
      answer: "Hello! Welcome to Josan Logistics. How can I help you today? You can ask me about booking a shipment, road transport, air freight documentation, tracking, or our office hours."
    };
  }

  // 2. Thanks & Appreciation
  const gratitudePhrases = [
    'thanks', 'thank you', 'thx', 'ty', 'thanks a lot', 'appreciate it',
    'that helps', 'great', 'awesome', 'perfect', 'thank you so much',
    'many thanks', 'tq', 'thks', 'ok thanks', 'okay thanks', 'oh thanks',
    'oh thank you', 'alright thanks', 'great thanks', 'thanks for the info',
    'thanks for helping', 'thanks for help', 'thank you for your help', 'thanks for your help'
  ];
  const isGratitudeMatch = gratitudePhrases.some(g => normalizedQuery === g || normalizedQuery.startsWith(g)) ||
    ((normalizedQuery.endsWith('thanks') || normalizedQuery.endsWith('thank you')) && queryTokens.length <= 4);

  if (isGratitudeMatch) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'GRATITUDE',
      matchedFaqId: 'sys_gratitude',
      matchedQuestion: 'Thanks & Appreciation',
      category: 'General',
      hasQuoteAction: false,
      answer: "You're welcome! Let me know if you have any other questions about shipping with Josan Logistics."
    };
  }

  // 3. Goodbyes & Closing
  const farewellPhrases = [
    'bye', 'goodbye', 'see you', 'take care', 'done', 'that s all', 'thats all',
    'nothing else', 'exit', 'close', 'have a nice day', 'have a good day',
    'cya', 'bye bye', 'ok bye', 'okay bye', 'alright bye', 'thanks bye',
    'bye for now', 'goodbye for now', 'talk to you later', 'ttyl'
  ];
  const isFarewellMatch = farewellPhrases.some(f => normalizedQuery === f || normalizedQuery.startsWith(f) || normalizedQuery.endsWith(f));

  if (isFarewellMatch) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'FAREWELL',
      matchedFaqId: 'sys_farewell',
      matchedQuestion: 'Goodbyes & Closing',
      category: 'General',
      hasQuoteAction: false,
      answer: "Thank you for visiting Josan Logistics. Have a great day, and feel free to reach out anytime you need freight support!"
    };
  }

  // 4. Asking for a Human / Live Agent
  const humanAgentPhrases = [
    'talk to a human', 'talk to human', 'real person', 'live agent', 'customer service',
    'speak to someone', 'connect me to staff', 'operator', 'can i call someone',
    'representative', 'human agent', 'speak to a person', 'human support',
    'talk to person', 'speak with someone', 'agent', 'talk to agent', 'speak to human',
    'talk to someone', 'speak to staff', 'connect to human', 'connect with human',
    'human please', 'transfer to human', 'speak with an agent', 'speak with a person'
  ];
  if (humanAgentPhrases.some(h => normalizedQuery === h || normalizedQuery.includes(h))) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'HUMAN_AGENT_REQUEST',
      matchedFaqId: 'sys_human_agent',
      matchedQuestion: 'Asking for a Human / Live Agent',
      category: 'General',
      hasQuoteAction: false,
      answer: "I'm an automated assistant, so I can't connect you to a live chat agent here. You can reach our operations team directly through our [Contact our team](/contact) page during business hours."
    };
  }

  // 5. Bot Identity & Capabilities
  const identityPhrases = [
    'are you a bot', 'are you a robot', 'are you human', 'are you ai',
    'who are you', 'what can you do', 'what do you do',
    'how can you help', 'what are your capabilities'
  ];
  if (identityPhrases.some(id => normalizedQuery === id || normalizedQuery === `${id} me`)) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'HELP_CAPABILITIES',
      matchedFaqId: 'sys_capabilities',
      matchedQuestion: 'Bot Identity & Capabilities',
      category: 'General',
      hasQuoteAction: false,
      answer: "I'm the Josan Logistics virtual assistant. I can answer common questions about our freight coordination services, booking process, air freight documents, tracking, and company policies."
    };
  }

  // 6. Vague / One-Word Help Requests
  const vagueHelpPhrases = [
    'help', 'info', 'information', 'menu', 'options', 'support', 'urgent',
    'i have a question', 'need help', 'inquiry', 'enquiry', 'assist', 'assistance'
  ];
  if (vagueHelpPhrases.some(v => normalizedQuery === v || (queryTokens.length <= 4 && normalizedQuery.startsWith(v)))) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'VAGUE_HELP_REQUEST',
      matchedFaqId: 'sys_vague_help',
      matchedQuestion: 'Vague / One-Word Help Requests',
      category: 'General',
      hasQuoteAction: false,
      answer: "I'd be happy to help! Please tell me what you're looking for—for example: booking a shipment, requesting a quote, tracking cargo, air freight documents, or prohibited items."
    };
  }

  // 7. Acknowledgments & Short Replies
  const acknowledgmentPhrases = [
    'ok', 'okay', 'got it', 'understood', 'alright', 'fine', 'cool',
    'noted', 'sure', 'yes', 'no', 'k', 'alrite', 'yep', 'nope',
    'oh ok', 'oh okay', 'oh got it', 'oh understood', 'oh i see', 'i see',
    'ah ok', 'ah okay', 'ah got it', 'ok got it', 'okay got it', 'alright got it',
    'all good', 'sounds good', 'gotcha', 'sure thing', 'no worries',
    'ok noted', 'okay noted', 'noted with thanks', 'noted thanks', 'okie', 'okies'
  ];
  const isAckMatch = acknowledgmentPhrases.some(a => normalizedQuery === a || normalizedQuery === `${a} then`) ||
    (queryTokens.length <= 3 && queryTokens.every(t => ['oh', 'ah', 'well', 'so', 'then', 'ok', 'okay', 'got', 'it', 'understood', 'noted', 'sure', 'fine', 'cool', 'see', 'yes', 'yeah', 'yep', 'alright'].includes(t)) && queryTokens.some(t => ['ok', 'okay', 'got', 'understood', 'noted', 'sure', 'fine', 'cool', 'see'].includes(t)));

  if (isAckMatch) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'ACKNOWLEDGMENT',
      matchedFaqId: 'sys_acknowledgment',
      matchedQuestion: 'Acknowledgments & Short Replies',
      category: 'General',
      hasQuoteAction: false,
      answer: "Got it! If you need anything else—like submitting a quote request or checking our services—just type your question here."
    };
  }

  // 8. Frustration, Delays & Complaints
  const frustrationPhrases = [
    'this is useless', 'you re not helping', 'you are not helping', 'bad service',
    'i m angry', 'im angry', 'worst bot', 'still waiting', 'nobody replied to my email',
    'complaint', 'terrible', 'horrible service', 'waste of time', 'frustrated', 'unhelpful'
  ];
  if (frustrationPhrases.some(fr => normalizedQuery.includes(fr))) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'FRUSTRATION_COMPLAINT',
      matchedFaqId: 'sys_complaint',
      matchedQuestion: 'Frustration, Delays & Complaints',
      category: 'General',
      hasQuoteAction: false,
      answer: "I'm sorry for the frustration. For urgent issues or complaints, please reach out directly to our team on the [Contact our team](/contact) page so a staff member can assist you promptly."
    };
  }

  // 9. Small Talk & Politeness
  const smallTalkPhrases = [
    'how are you', 'how s it going', 'whats up', 'what s up',
    'how are you doing', 'how r u', 'how is it going', 'how do you do'
  ];
  if (smallTalkPhrases.some(st => normalizedQuery === st || normalizedQuery.startsWith(st))) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'SMALL_TALK',
      matchedFaqId: 'sys_small_talk',
      matchedQuestion: 'Small Talk & Politeness',
      category: 'General',
      hasQuoteAction: false,
      answer: "I'm doing well, thank you! How can I assist you with your logistics or freight needs today?"
    };
  }

  // 10. Off-Topic, Testing & Out-of-Scope Queries (Hits Safe Fallback)
  const isExplicitOffTopic = (
    normalizedQuery === 'test' ||
    normalizedQuery === 'testing' ||
    normalizedQuery === 'asdf' ||
    normalizedQuery === 'qwerty' ||
    normalizedQuery === '123' ||
    normalizedQuery === '???' ||
    normalizedQuery.includes('joke') ||
    normalizedQuery.includes('weather') ||
    normalizedQuery.includes('poem') ||
    normalizedQuery.includes('song') ||
    normalizedQuery.includes('recipe') ||
    normalizedQuery.includes('capital of') ||
    normalizedQuery.includes('movie') ||
    normalizedQuery.includes('cinema') ||
    normalizedQuery.includes('horoscope') ||
    normalizedQuery.includes('crypto') ||
    normalizedQuery.includes('bitcoin')
  );
  if (isExplicitOffTopic) {
    return fallbackResult;
  }

  // ---------------------------------------------------------------------------
  // LAYER 1: EXACT QUESTION & ALTERNATIVE QUESTION MATCHING (WITH PREFIX STRIPPING)
  // ---------------------------------------------------------------------------
  const cleanedRawQuery = stripConversationalPrefixes(rawQuery);
  const normalizedCleaned = normalizeText(cleanedRawQuery);
  const candidateQueries = [normalizedQuery];
  if (normalizedCleaned && normalizedCleaned !== normalizedQuery && normalizedCleaned.length >= 3) {
    candidateQueries.push(normalizedCleaned);
  }

  for (const cQuery of candidateQueries) {
    for (const faq of faqs) {
      const normMain = normalizeText(faq.mainQuestion);
      if (cQuery === normMain) {
        return {
          isFallback: false,
          confidence: 1.0,
          matchLayer: 'EXACT_QUESTION_MATCH',
          matchedFaqId: faq.id,
          matchedQuestion: faq.mainQuestion,
          category: faq.category,
          hasQuoteAction: faq.hasQuoteAction,
          answer: faq.approvedAnswer
        };
      }

      const alts = Array.isArray(faq.alternativeQuestions) ? faq.alternativeQuestions : [];
      for (const alt of alts) {
        const normAlt = normalizeText(alt);
        if (cQuery === normAlt) {
          return {
            isFallback: false,
            confidence: 0.99,
            matchLayer: 'EXACT_ALTERNATIVE_MATCH',
            matchedFaqId: faq.id,
            matchedQuestion: alt,
            category: faq.category,
            hasQuoteAction: faq.hasQuoteAction,
            answer: faq.approvedAnswer
          };
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // CRITICAL INTENT / DOMAIN DISAMBIGUATION RULES
  // ---------------------------------------------------------------------------

  // 1. Company Services Overview & General Capabilities
  const checkServicesOverview = (q) => {
    if (!q) return false;
    const directMatches = [
      'services', 'service', 'services provided', 'services offered', 'services list',
      'list of services', 'available services', 'all services', 'our services', 'your services',
      'what services', 'logistics services', 'company services', 'freight services',
      'what do you do', 'what do you offer', 'what do you guys do', 'what does josan do',
      'what does josan logistics do', 'what can you do', 'what can you do for me',
      'what can you guys do', 'scope of services', 'overview of services', 'services overview',
      'services info', 'services information', 'services details', 'about services',
      'about your services', 'tell me about services', 'tell me about your services',
      'tell me your services', 'show me your services', 'explain your services'
    ];
    if (directMatches.includes(q)) return true;

    const hasServiceWord = q.includes('service') || q.includes('services');
    if (hasServiceWord) {
      const isQualified = q.includes('road') || q.includes('air') || q.includes('sea') ||
        q.includes('ocean') || q.includes('customs') || q.includes('truck') || q.includes('lorry') ||
        q.includes('customer') || q.includes('tailgate') || q.includes('pallet') || q.includes('charge') ||
        q.includes('cost') || q.includes('price') || q.includes('rate');
      if (!isQualified) {
        const triggers = ['what', 'provide', 'offer', 'list', 'available', 'all', 'overview', 'scope', 'our', 'your', 'company', 'josan', 'tell', 'about', 'show', 'explain', 'info', 'information', 'details', 'type', 'types', 'kind', 'kinds', 'give'];
        if (triggers.some(t => q.includes(t))) return true;
        const tokens = tokenize(q);
        if (tokens.length <= 3 && tokens.every(t => ['the', 'our', 'your', 'all', 'any', 'josan', 'logistics', 'freight', 'service', 'services'].includes(t))) {
          return true;
        }
      }
    }

    if ((q.includes('what do you') || q.includes('what can you') || q.includes('what does josan')) &&
        (q.includes('offer') || q.includes('do') || q.includes('provide') || q.includes('handle')) &&
        !q.includes('charge') && !q.includes('cost') && !q.includes('price') && !q.includes('truck') &&
        !q.includes('road') && !q.includes('air') && !q.includes('sea') && !q.includes('customs')) {
      return true;
    }
    return false;
  };

  // 1a. About Josan Logistics & How It Works
  const isHowJosanWorksIntent = (
    normalizedQuery === 'how josan works' ||
    normalizedQuery === 'how does josan work' ||
    normalizedQuery === 'how does josan logistics work' ||
    normalizedQuery === 'about josan' ||
    normalizedQuery === 'about josan logistics' ||
    normalizedQuery === 'tell me about josan' ||
    normalizedQuery === 'tell me about josan logistics' ||
    normalizedQuery === 'what is josan' ||
    normalizedQuery === 'what is josan logistics' ||
    normalizedQuery === 'who is josan' ||
    normalizedQuery === 'who is josan logistics' ||
    normalizedQuery === 'how do you operate' ||
    normalizedQuery === 'how do you guys operate' ||
    normalizedQuery === 'how does shipping with you work' ||
    normalizedQuery === 'how does this work' ||
    ((normalizedQuery.includes('josan') || normalizedQuery.includes('company')) &&
     (normalizedQuery.includes('how') || normalizedQuery.includes('about') || normalizedQuery.includes('operate') || normalizedQuery.includes('work') || normalizedQuery.includes('who is') || normalizedQuery.includes('what is')) &&
     !normalizedQuery.includes('road') && !normalizedQuery.includes('air') && !normalizedQuery.includes('truck') && !normalizedQuery.includes('price') && !normalizedQuery.includes('cost') && !normalizedQuery.includes('rate') && !normalizedQuery.includes('address') && !normalizedQuery.includes('contact'))
  );

  if (isHowJosanWorksIntent) {
    const howFaq = faqs.find(f => f.id === 'faq_cp214_how_josan_works') || faqs.find(f => f.id.includes('how_josan_works'));
    if (howFaq) {
      return {
        isFallback: false,
        confidence: 1.0,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: howFaq.id,
        matchedQuestion: howFaq.mainQuestion,
        category: howFaq.category,
        hasQuoteAction: true,
        answer: howFaq.approvedAnswer
      };
    }
  }

  const isServicesOverviewIntent = checkServicesOverview(normalizedQuery) || checkServicesOverview(normalizedCleaned);

  if (isServicesOverviewIntent) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'SERVICES_OVERVIEW',
      matchedFaqId: 'sys_capabilities',
      matchedQuestion: 'What services does Josan Logistics offer?',
      category: 'General',
      hasQuoteAction: true,
      answer: "Josan Logistics provides end-to-end commercial freight and logistics support across Singapore and Malaysia:\n\n- **Commercial Road Transportation:** Coordinated transport via 14ft covered box trucks (with hydraulic tailgates), 24ft heavy lorries (box, open-sided, curtain-side), flatbed trailers, and prime movers for 20ft/40ft container haulage. Available for Full Truck Load (FTL) and Part Truck Load (PTL) across Singapore and cross-border trucking to Peninsular Malaysia.\n- **Air Freight & AWB Documentation Support:** Professional preparation of Master and House Air Waybills (MAWB/HAWB), chargeable weight calculations, document checking (Commercial Invoices, Packing Lists, Certificates of Origin, MSDS), and cargo drop-off coordination at Changi Airfreight Centre.\n- **Real-Time Tracking & Proof of Delivery:** Active milestone tracking with digital Proof of Delivery (e-POD) available via our [Track Shipment](/track) portal.\n\nExplore our full service lineup on the [Services](/services) page, or submit your cargo details on our [Request a Quote](/quote) page!"
    };
  }

  // 2. Sea Freight / Ocean Cargo Inquiries
  const isSeaFreightIntent = ['sea freight', 'ocean freight', 'ocean cargo', 'sea cargo', 'shipping vessel', 'ship by sea', 'by sea', 'ocean shipping'].some(s => normalizedQuery.includes(s));
  if (isSeaFreightIntent) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'DIRECT_POLICY_RULE',
      matchedFaqId: 'sys_sea_freight',
      matchedQuestion: 'Do you offer sea freight or ocean container shipping?',
      category: 'Road Transport, Fleet & Vehicles',
      hasQuoteAction: true,
      answer: "Josan Logistics specializes in commercial road transport (14ft & 24ft box trucks, prime movers) across Singapore and cross-border trucking to Malaysia, as well as international air freight documentation coordination. We do not operate ocean container lines or direct sea freight vessels. For road trucking and air cargo, please request a quote on our [Request a Quote](/quote) page."
    };
  }

  // 3. Malaysia & Cross-Border Trucking Inquiries
  const isMalaysiaIntent = ['malaysia', 'cross border', 'cross-border', 'jb', 'johor', 'causeway', 'kuala lumpur'].some(m => normalizedQuery.includes(m));
  if (isMalaysiaIntent) {
    const myFaq = faqs.find(f => f.id === 'faq_r73_cross_border_malaysia') || faqs.find(f => f.id.includes('malaysia'));
    if (myFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: myFaq.id,
        matchedQuestion: myFaq.mainQuestion,
        category: myFaq.category,
        hasQuoteAction: true,
        answer: myFaq.approvedAnswer
      };
    }
  }

  // 4. Hydraulic Tailgate Truck Inquiries
  const isTailgateIntent = (normalizedQuery.includes('tailgate') || normalizedQuery.includes('tail gate') || normalizedQuery.includes('hydraulic lift')) &&
    !normalizedQuery.includes('charge') && !normalizedQuery.includes('fee') && !normalizedQuery.includes('cost');
  if (isTailgateIntent) {
    const tgFaq = faqs.find(f => f.id === 'faq_r54_14ft_trucks_tailgate') || faqs.find(f => f.id.includes('tailgate'));
    if (tgFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: tgFaq.id,
        matchedQuestion: tgFaq.mainQuestion,
        category: tgFaq.category,
        hasQuoteAction: true,
        answer: tgFaq.approvedAnswer
      };
    }
  }

  // 4a-0. Direct 14ft Covered Box Truck Availability Check
  if ((normalizedQuery.includes('14ft') || normalizedQuery.includes('14 foot') || normalizedQuery.includes('14-foot')) &&
      !normalizedQuery.includes('pallet') && !normalizedQuery.includes('payload') && !normalizedQuery.includes('weight') &&
      !normalizedQuery.includes('dimension') && !normalizedQuery.includes('tailgate') && !normalizedQuery.includes('rate') && !normalizedQuery.includes('price')) {
    const truckFaq = faqs.find(f => f.id === 'faq_r53_14ft_box_trucks');
    if (truckFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: truckFaq.id,
        matchedQuestion: truckFaq.mainQuestion,
        category: truckFaq.category,
        hasQuoteAction: true,
        answer: truckFaq.approvedAnswer
      };
    }
  }

  // 4a. Commercial Road Transportation Details & Road Pricing
  const isRoadPricingQuery = (
    normalizedQuery.includes('pricing') ||
    normalizedQuery.includes('price') ||
    normalizedQuery.includes('rate') ||
    normalizedQuery.includes('rates') ||
    normalizedQuery.includes('cost') ||
    normalizedQuery.includes('how much')
  );

  const isRoadSpecificIntent = (
    normalizedQuery === 'road' ||
    normalizedQuery === 'road transport' ||
    normalizedQuery === 'road transportation' ||
    normalizedQuery === 'road transport details' ||
    normalizedQuery === 'road transportation details' ||
    normalizedQuery === 'road details' ||
    normalizedQuery === 'road freight' ||
    normalizedQuery === 'road freight details' ||
    normalizedQuery === 'road services' ||
    normalizedQuery === 'road service' ||
    normalizedQuery === 'road shipping' ||
    normalizedQuery === 'road delivery' ||
    normalizedQuery === 'road transport service' ||
    normalizedQuery === 'road pricing' ||
    normalizedQuery === 'road freight pricing' ||
    normalizedQuery === 'road transport pricing' ||
    normalizedQuery === 'road transport cost' ||
    normalizedQuery === 'lorry' ||
    normalizedQuery === 'lorries' ||
    normalizedQuery === 'truck' ||
    normalizedQuery === 'trucks' ||
    normalizedQuery === 'trucking' ||
    normalizedQuery === 'trucking services' ||
    normalizedQuery === 'trucking details' ||
    normalizedQuery === 'trucking rates' ||
    normalizedQuery === 'truck pricing' ||
    normalizedQuery === 'lorry transport' ||
    normalizedQuery === 'commercial road transport' ||
    normalizedQuery === 'commercial road transportation' ||
    (
      (normalizedQuery.includes('road transport') ||
       normalizedQuery.includes('road transportation') ||
       normalizedQuery.includes('road freight') ||
       normalizedQuery.includes('commercial road') ||
       normalizedQuery.includes('trucking') ||
       (normalizedQuery.includes('road') && (
         normalizedQuery.includes('pricing') ||
         normalizedQuery.includes('price') ||
         normalizedQuery.includes('rate') ||
         normalizedQuery.includes('rates') ||
         normalizedQuery.includes('cost') ||
         normalizedQuery.includes('detail') ||
         normalizedQuery.includes('service') ||
         normalizedQuery.includes('fleet') ||
         normalizedQuery.includes('truck') ||
         normalizedQuery.includes('lorry') ||
         normalizedQuery.includes('delivery') ||
         normalizedQuery.includes('move') ||
         normalizedQuery.includes('info')
       ))) &&
      !normalizedQuery.includes('sea') &&
      !normalizedQuery.includes('air') &&
      !normalizedQuery.includes('changi') &&
      !normalizedQuery.includes('address') &&
      !normalizedQuery.includes('jalan besar') &&
      !normalizedQuery.includes('weekend') &&
      !normalizedQuery.includes('saturday') &&
      !normalizedQuery.includes('sunday') &&
      !normalizedQuery.includes('waiting')
    )
  );

  if (isRoadSpecificIntent) {
    if (isRoadPricingQuery) {
      return {
        isFallback: false,
        confidence: 0.99,
        matchLayer: 'ROAD_TRANSPORT_DETAILS',
        matchedFaqId: 'sys_road_transport_pricing',
        matchedQuestion: 'What are your road transportation details and pricing?',
        category: 'Road Transport, Fleet & Vehicles',
        hasQuoteAction: true,
        answer: "Josan Logistics coordinates commercial road transportation across Singapore and cross-border trucking to Malaysia. Road freight pricing is customized based on your specific transport requirements:\n\n- **Vehicle Fleet Options:**\n  • **14ft Covered Box Trucks:** Equipped with hydraulic tailgates; payloads up to 2.5–3 tonnes (holds 4–6 standard pallets).\n  • **24ft Heavy Lorries:** Payloads up to 7–10 tonnes (holds 12–14 standard pallets; box, open-sided, or curtain-side).\n  • **Container Haulage:** Prime movers for 20ft and 40ft shipping containers.\n- **Pricing Factors:** Vehicle type required, gross cargo weight & pallet count, pickup & delivery locations (islandwide Singapore, industrial zones like Tuas/Jurong, or cross-border to Malaysia), and special requirements (hydraulic tailgate loading, driver assistance, or after-hours dispatch).\n\nFor a transparent, customized quote, submit your shipment requirements on our [Request a Quote](/quote) page or explore our full fleet on the [Road Transportation](/road-freight) page."
      };
    }

    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'ROAD_TRANSPORT_DETAILS',
      matchedFaqId: 'sys_road_transport_details',
      matchedQuestion: 'What are Josan Logistics\' commercial road transportation details?',
      category: 'Road Transport, Fleet & Vehicles',
      hasQuoteAction: true,
      answer: "Josan Logistics provides reliable commercial road transportation coordinated through our vetted network of partner carriers:\n\n- **Fleet Options:**\n  • **14ft Covered Box Trucks:** With hydraulic tailgates; max payload 2.5–3 tonnes (fits 4–6 standard pallets).\n  • **24ft Heavy Lorries:** Max payload 7–10 tonnes (fits 12–14 standard pallets; box, open-sided, or curtain-side).\n  • **Prime Movers:** For 20ft and 40ft container haulage and flatbed transport.\n- **Service Capabilities:** Full Truck Load (FTL) and Part Truck Load (PTL), warehouse dock-to-dock transport, and recurring daily/weekly delivery schedules.\n- **Coverage:** Islandwide Singapore (commercial hubs, Tuas, Jurong, Changi, shopping malls) and cross-border road trucking between Singapore and Malaysia.\n- **Value-Added Support:** Tailgate loading/unloading, pallet jacks on-board, licensed PSA port entry, active shipment tracking, and signed electronic Proof of Delivery (e-POD).\n\nLearn more on our [Road Transportation](/road-freight) page or submit your cargo details on our [Request a Quote](/quote) page to get started!"
    };
  }

  // 4b. Air Freight & Documentation Details
  const isAirSpecificIntent = (
    normalizedQuery === 'air' ||
    normalizedQuery === 'air freight' ||
    normalizedQuery === 'air freight details' ||
    normalizedQuery === 'air transportation' ||
    normalizedQuery === 'air freight documentation' ||
    normalizedQuery === 'air cargo' ||
    normalizedQuery === 'air shipping' ||
    normalizedQuery === 'air services' ||
    normalizedQuery === 'air freight service' ||
    normalizedQuery === 'air freight services' ||
    (
      (normalizedQuery.includes('air freight') ||
       normalizedQuery.includes('air cargo') ||
       (normalizedQuery.includes('air') && (
         normalizedQuery.includes('detail') ||
         normalizedQuery.includes('service') ||
         normalizedQuery.includes('documentation') ||
         normalizedQuery.includes('document') ||
         normalizedQuery.includes('awb') ||
         normalizedQuery.includes('airport') ||
         normalizedQuery.includes('changi')
       ))) &&
      !normalizedQuery.includes('sea') &&
      !normalizedQuery.includes('road') &&
      !normalizedQuery.includes('rate') &&
      !normalizedQuery.includes('pricing') &&
      !normalizedQuery.includes('price') &&
      !normalizedQuery.includes('cost') &&
      !normalizedQuery.includes('aircon') &&
      !normalizedQuery.includes('condition')
    )
  );

  if (isAirSpecificIntent) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'AIR_FREIGHT_DETAILS',
      matchedFaqId: 'sys_air_freight_details',
      matchedQuestion: 'What are Josan Logistics\' air freight and documentation details?',
      category: 'Air Freight & AWB Documentation',
      hasQuoteAction: true,
      answer: "Josan Logistics provides professional air freight documentation and cargo coordination services:\n\n- **Air Waybill (AWB) Preparation:** Issuance of Master Air Waybills (MAWB) and House Air Waybills (HAWB) strictly compliant with IATA and airline standards.\n- **Airline Billing Coordination:** Chargeable weight calculations (comparing actual gross weight vs. volumetric weight at 1:6000 ratio).\n- **Document Verification:** Thorough cross-checking of Commercial Invoices, Packing Lists, Certificates of Origin, and MSDS/SDS for chemical commodities.\n- **Cargo Coordination:** Warehouse collection via road transport and scheduled drop-off at Changi Airfreight Centre (ALPS / Free Trade Zone).\n\n*Note: Josan Logistics prepares and manages all billing and shipment documentation; airline flight space booking is handled by you or your nominated freight forwarder.*\n\nExplore our [Air Freight](/air-freight) page or submit your shipment details on our [Request a Quote](/quote) page."
    };
  }

  // 4b. Direct MSDS / Safety Data Sheet Check
  if (normalizedQuery.includes('msds') || normalizedQuery.includes('sds') || normalizedQuery.includes('safety data sheet')) {
    const msdsFaq = faqs.find(f => f.id === 'faq_c138_msds_sds_requirement');
    if (msdsFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: msdsFaq.id,
        matchedQuestion: msdsFaq.mainQuestion,
        category: msdsFaq.category,
        hasQuoteAction: false,
        answer: msdsFaq.approvedAnswer
      };
    }
  }

  // 5. Direct Prohibited Goods Check
  const prohibitedTriggers = [
    { keys: ['tobacco', 'cigarette', 'cigarettes', 'cigar', 'vape', 'vapes', 'smoking', 'nicotine'], id: 'faq_c122_tobacco_cigarettes' },
    { keys: ['alcohol', 'wine', 'wines', 'liquor', 'liquors', 'spirits', 'beer', 'beers'], id: 'faq_c123_alcohol_wine_liquor' },
    { keys: ['chemical', 'chemicals', 'hazardous', 'hazmat', 'toxic', 'dangerous goods', 'flammable'], id: 'faq_c124_hazardous_chemicals_flammable' },
    { keys: ['frozen', 'fresh', 'meat', 'seafood', 'produce', 'perishable'], id: 'faq_c127_fresh_frozen_food' },
    { keys: ['live animal', 'live animals', 'pets', 'pet', 'dog', 'cat', 'plants'], id: 'faq_c129_live_animals_plants' },
    { keys: ['prohibited', 'contraband', 'banned', 'forbidden', 'restricted'], id: 'faq_c121_prohibited_items_list' }
  ];

  for (const group of prohibitedTriggers) {
    const matched = group.keys.some(k => {
      if (k.includes(' ')) return normalizedQuery.includes(k);
      return queryTokens.includes(k);
    });
    if (matched) {
      const matchedFaq = faqs.find(f => f.id === group.id) || faqs.find(f => f.id.includes('prohibited'));
      if (matchedFaq) {
        return {
          isFallback: false,
          confidence: 0.98,
          matchLayer: 'DIRECT_POLICY_RULE',
          matchedFaqId: matchedFaq.id,
          matchedQuestion: matchedFaq.mainQuestion,
          category: matchedFaq.category,
          hasQuoteAction: false,
          answer: matchedFaq.approvedAnswer
        };
      }
    }
  }

  // 5a. Payment Methods & Accepted Payment Options
  const isPaymentMethodIntent = (
    normalizedQuery === 'payment methods' ||
    normalizedQuery === 'payment options' ||
    normalizedQuery === 'modes of payment' ||
    normalizedQuery === 'mode of payment' ||
    normalizedQuery === 'how to pay' ||
    normalizedQuery === 'how do i pay' ||
    normalizedQuery === 'how can i pay' ||
    normalizedQuery === 'how should i pay' ||
    normalizedQuery === 'ways to pay' ||
    normalizedQuery === 'accepted payment' ||
    normalizedQuery === 'accepted payment methods' ||
    normalizedQuery === 'payment channels' ||
    ((normalizedQuery.includes('payment') || normalizedQuery.includes('pay')) &&
     (normalizedQuery.includes('method') || normalizedQuery.includes('option') || normalizedQuery.includes('mode') || normalizedQuery.includes('channel') || normalizedQuery.includes('accept') || normalizedQuery.includes('how do i') || normalizedQuery.includes('how can i')) &&
     !normalizedQuery.includes('waiting') && !normalizedQuery.includes('delay') && !normalizedQuery.includes('tailgate') && !normalizedQuery.includes('duty') && !normalizedQuery.includes('tax'))
  );
  if (isPaymentMethodIntent) {
    const payFaq = faqs.find(f => f.id === 'faq_p42_payment_methods');
    if (payFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: payFaq.id,
        matchedQuestion: payFaq.mainQuestion,
        category: payFaq.category,
        hasQuoteAction: false,
        answer: payFaq.approvedAnswer
      };
    }
  }

  // 5b. Business UEN & ACRA Registration
  const isUenIntent = (
    normalizedQuery === 'uen' ||
    normalizedQuery === 'uen number' ||
    normalizedQuery === 'what is your uen' ||
    normalizedQuery === 'company uen' ||
    normalizedQuery === 'business uen' ||
    normalizedQuery === 'registration number' ||
    normalizedQuery === 'business registration' ||
    normalizedQuery === 'acra' ||
    normalizedQuery === 'acra registration' ||
    (normalizedQuery.includes('uen') && !normalizedQuery.includes('pay') && !normalizedQuery.includes('bank') && !normalizedQuery.includes('paynow'))
  );
  if (isUenIntent) {
    const uenFaq = faqs.find(f => f.id === 'faq_co202_business_uen');
    if (uenFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: uenFaq.id,
        matchedQuestion: uenFaq.mainQuestion,
        category: uenFaq.category,
        hasQuoteAction: false,
        answer: uenFaq.approvedAnswer
      };
    }
  }

  // 6. Direct Price / Rate Request Check
  const quoteTriggers = ['how much', 'cost', 'costs', 'price', 'prices', 'rate', 'rates', 'fee', 'fees', 'per kg', 'quote', 'quotes', 'quotation', 'quotations', 'pricing', 'charge', 'charges'];
  const hasQuoteWord = quoteTriggers.some(qt => {
    if (qt.includes(' ')) return normalizedQuery.includes(qt);
    return queryTokens.includes(qt);
  });

  // Disqualify specific surcharge / fee topics that have their own dedicated FAQs:
  const isSpecificPricingQuery = [
    'tailgate', 'waiting', 'driver waiting', 'erp', 'parking', 'weekend', 'saturday', 'sunday',
    'after hours', 'after-hours', 'night', 'jurong', 'psa', 'airport', 'restricted zone',
    'cancel', 'cancellation', 'credit', 'terms', 'invoice', 'gst', 'tax', 'discount',
    'volume discount', 'advance', 'booking'
  ].some(sp => normalizedQuery.includes(sp));

  const isDirectQuoteQuery = hasQuoteWord && !isSpecificPricingQuery && !normalizedQuery.includes('track') && !normalizedQuery.includes('where');

  if (isDirectQuoteQuery) {
    const isHowToRequestQuote = normalizedQuery.includes('how do i request') ||
      normalizedQuery.includes('how to request') ||
      normalizedQuery.includes('how do i get a quote') ||
      normalizedQuery.includes('how to get a quote') ||
      normalizedQuery.includes('how can i get a quote') ||
      normalizedQuery.includes('can i get a quote') ||
      normalizedQuery.includes('need a quote') ||
      normalizedQuery.includes('need a quotation') ||
      normalizedQuery.includes('get a quote') ||
      normalizedQuery.includes('get a quotation') ||
      normalizedQuery.includes('give me a quote') ||
      normalizedQuery.includes('give me a quotation') ||
      normalizedQuery.includes('request a quote') ||
      normalizedQuery.includes('request a quotation') ||
      normalizedQuery.includes('request quote') ||
      normalizedQuery.includes('request quotation') ||
      normalizedQuery.includes('quote request');

    const isRatePerKg = normalizedQuery.includes('per kg') || normalizedQuery.includes('per kilogram');

    const targetFaq = isHowToRequestQuote
      ? (faqs.find(f => f.id === 'faq_p30_request_quote') || faqs.find(f => f.id === 'faq_p26_freight_cost'))
      : isRatePerKg
        ? (faqs.find(f => f.id === 'faq_p29_rate_per_kg') || faqs.find(f => f.id === 'faq_p26_freight_cost'))
        : (faqs.find(f => f.id === 'faq_p26_freight_cost') || faqs.find(f => f.id === 'faq_p27_shipping_rates') || faqs.find(f => f.id === 'faq_p30_request_quote'));

    if (targetFaq) {
      return {
        isFallback: false,
        confidence: 0.95,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: targetFaq.id,
        matchedQuestion: targetFaq.mainQuestion,
        category: targetFaq.category,
        hasQuoteAction: true,
        answer: targetFaq.approvedAnswer
      };
    }
  }

  // 7. Direct Tracking Intent Check
  // Disqualify specific tracking subtopics that have their own dedicated FAQs:
  const isSpecificTrackingQuery = [
    'gps', 'pod', 'proof of delivery', 'signed do', 'delivery order', 'not working',
    'invalid', 'dispatched', 'in transit', 'delivered but', 'multiple', 'stuck',
    'customer track', 'history', 'retention', 'lost'
  ].some(st => normalizedQuery.includes(st));

  const isTrackingIntent = (
    normalizedQuery.includes('track') ||
    normalizedQuery.includes('tracking') ||
    normalizedQuery.includes('check status') ||
    (normalizedQuery.includes('where') && (
      normalizedQuery.includes('cargo') ||
      normalizedQuery.includes('shipment') ||
      normalizedQuery.includes('goods') ||
      normalizedQuery.includes('package') ||
      normalizedQuery.includes('delivery') ||
      normalizedQuery.includes('awb') ||
      normalizedQuery.includes('parcel')
    ))
  ) && !isSpecificTrackingQuery && !normalizedQuery.includes('office') && !normalizedQuery.includes('quote');

  if (isTrackingIntent) {
    const isWhereIsCargo = normalizedQuery.includes('where is my') || normalizedQuery.includes('where is cargo') || normalizedQuery.includes('where is the');
    const trackFaq = isWhereIsCargo
      ? (faqs.find(f => f.id === 'faq_t102_where_is_cargo_now') || faqs.find(f => f.id === 'faq_t101_track_shipment'))
      : (faqs.find(f => f.id === 'faq_t101_track_shipment') || faqs.find(f => f.id === 'faq_t102_where_is_cargo_now'));

    if (trackFaq) {
      return {
        isFallback: false,
        confidence: 0.95,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: trackFaq.id,
        matchedQuestion: trackFaq.mainQuestion,
        category: trackFaq.category,
        hasQuoteAction: false,
        answer: trackFaq.approvedAnswer
      };
    }
  }

  // 7b. Account Creation, Registration, Login & Password Management
  const isAccountCreationIntent = (
    normalizedQuery === 'create account' ||
    normalizedQuery === 'create an account' ||
    normalizedQuery === 'how to create account' ||
    normalizedQuery === 'how to create an account' ||
    normalizedQuery === 'how do i create an account' ||
    normalizedQuery === 'how can i create an account' ||
    normalizedQuery === 'how to sign up' ||
    normalizedQuery === 'how do i sign up' ||
    normalizedQuery === 'how can i sign up' ||
    normalizedQuery === 'sign up' ||
    normalizedQuery === 'signup' ||
    normalizedQuery === 'how to register' ||
    normalizedQuery === 'how do i register' ||
    normalizedQuery === 'how can i register' ||
    normalizedQuery === 'register' ||
    normalizedQuery === 'registration' ||
    normalizedQuery === 'register account' ||
    normalizedQuery === 'register an account' ||
    normalizedQuery === 'account registration' ||
    normalizedQuery === 'open an account' ||
    normalizedQuery === 'open account' ||
    normalizedQuery === 'how to open an account' ||
    normalizedQuery === 'how to open account' ||
    normalizedQuery === 'new account' ||
    normalizedQuery === 'setup account' ||
    normalizedQuery === 'set up an account' ||
    normalizedQuery === 'how to set up an account' ||
    normalizedQuery === 'account details needed' ||
    normalizedQuery === 'account requirements' ||
    normalizedQuery === 'details to create account' ||
    normalizedQuery === 'details needed for account' ||
    normalizedQuery === 'what details are needed to create an account' ||
    ((normalizedQuery.includes('account') || normalizedQuery.includes('profile')) &&
     (normalizedQuery.includes('create') || normalizedQuery.includes('register') || normalizedQuery.includes('sign up') || normalizedQuery.includes('signup') || normalizedQuery.includes('open') || normalizedQuery.includes('make') || normalizedQuery.includes('new') || normalizedQuery.includes('setup') || normalizedQuery.includes('set up') || normalizedQuery.includes('start') || normalizedQuery.includes('details needed') || normalizedQuery.includes('requirements')) &&
     !normalizedQuery.includes('delete') && !normalizedQuery.includes('close') && !normalizedQuery.includes('cancel')) ||
    ((normalizedQuery.includes('how to') || normalizedQuery.includes('how do i') || normalizedQuery.includes('how can i')) &&
     (normalizedQuery.includes('sign up') || normalizedQuery.includes('signup') || normalizedQuery.includes('register')))
  );

  if (isAccountCreationIntent) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'ACCOUNT_MANAGEMENT',
      matchedFaqId: 'sys_account_creation',
      matchedQuestion: 'How to create an account and details needed',
      category: 'Corporate Accounts & Partnerships',
      hasQuoteAction: true,
      answer: "Creating an account with Josan Logistics is fast, free, and gives you instant access to freight coordination tools:\n\n- **1. Standard Customer Portal Account (Instant):**\n  • **How to Create:** Click **Sign In / Register** in the top navigation bar (or visit our [Request a Quote](/quote) page) and select **Create Account**.\n  • **Details Needed:** Full Name, Company Name, Work Email Address, Contact Phone Number, and a secure password.\n  • **Benefits:** Calculate instant freight quotes, save recurring pickup/delivery locations, confirm vehicle bookings, and view your complete shipment history.\n\n- **2. Corporate Credit Account (30-Day Terms):**\n  • **How to Apply:** Registered Singapore businesses can open a corporate account with 30-day payment credit and consolidated monthly e-invoicing.\n  • **Details Needed:** ACRA BizFile (company registration), registered business address, billing contact, and projected monthly shipping volume.\n  • **How to Submit:** Email your details to **contact@josanlogistics.com.sg** or reach out via our [Contact our team](/contact) page.\n\n- **Do I Need an Account to Track Cargo?**\n  No account is required! You can track any shipment 24/7 on our public [Track Shipment](/track) page using your tracking reference number."
    };
  }

  const isAccountLoginIntent = (
    normalizedQuery === 'login' ||
    normalizedQuery === 'log in' ||
    normalizedQuery === 'how to login' ||
    normalizedQuery === 'how to log in' ||
    normalizedQuery === 'how do i login' ||
    normalizedQuery === 'how do i log in' ||
    normalizedQuery === 'sign in' ||
    normalizedQuery === 'signin' ||
    normalizedQuery === 'how to sign in' ||
    normalizedQuery === 'how do i sign in' ||
    normalizedQuery === 'customer login' ||
    normalizedQuery === 'client login' ||
    normalizedQuery === 'customer portal' ||
    normalizedQuery === 'client portal' ||
    normalizedQuery === 'access account' ||
    normalizedQuery === 'access my account' ||
    ((normalizedQuery.includes('how to') || normalizedQuery.includes('how do i') || normalizedQuery.includes('how can i')) &&
     (normalizedQuery.includes('login') || normalizedQuery.includes('log in') || normalizedQuery.includes('sign in') || normalizedQuery.includes('signin')))
  );

  if (isAccountLoginIntent) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'ACCOUNT_MANAGEMENT',
      matchedFaqId: 'sys_account_login',
      matchedQuestion: 'How to log in to your account',
      category: 'Corporate Accounts & Partnerships',
      hasQuoteAction: false,
      answer: "To log in to your Josan Logistics customer account:\n\n1. Click the **Sign In** button located in the top navigation bar.\n2. Enter your registered email address and password.\n3. Click **Sign In** to view your dashboard, saved quotes, and booking records.\n\n*Looking for Driver or Staff portals?* Authorized drivers and staff members can access dedicated portals using their assigned credentials via the links in the footer."
    };
  }

  const isPasswordResetIntent = (
    normalizedQuery === 'forgot password' ||
    normalizedQuery === 'forgot my password' ||
    normalizedQuery === 'reset password' ||
    normalizedQuery === 'how to reset password' ||
    normalizedQuery === 'change password' ||
    normalizedQuery === 'lost password' ||
    normalizedQuery === 'cannot login' ||
    normalizedQuery === 'cannot sign in' ||
    normalizedQuery === 'cant login' ||
    normalizedQuery === 'cant sign in' ||
    normalizedQuery.includes('forgot password') ||
    normalizedQuery.includes('reset password') ||
    normalizedQuery.includes('change password') ||
    normalizedQuery.includes('forgot my password')
  );

  if (isPasswordResetIntent) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'ACCOUNT_MANAGEMENT',
      matchedFaqId: 'sys_account_password',
      matchedQuestion: 'How to reset your account password',
      category: 'Corporate Accounts & Partnerships',
      hasQuoteAction: false,
      answer: "If you forgot your password or cannot access your account:\n\n1. Click **Sign In** in the top navigation bar to open the login window.\n2. Click the **Forgot Password?** link located directly below the password input.\n3. Enter your registered email address and submit to receive a password reset link.\n4. If you do not receive the email or need urgent account recovery, please contact our support team directly on the [Contact our team](/contact) page."
    };
  }

  const isAccountRequirementIntent = (
    normalizedQuery === 'do i need an account' ||
    normalizedQuery === 'do i need account' ||
    normalizedQuery === 'is account required' ||
    normalizedQuery === 'is an account required' ||
    normalizedQuery === 'must i have an account' ||
    normalizedQuery === 'can i track without an account' ||
    normalizedQuery === 'can i book without an account' ||
    (normalizedQuery.includes('account') && (normalizedQuery.includes('need') || normalizedQuery.includes('require') || normalizedQuery.includes('must') || normalizedQuery.includes('mandatory')))
  );

  if (isAccountRequirementIntent) {
    return {
      isFallback: false,
      confidence: 1.0,
      matchLayer: 'ACCOUNT_MANAGEMENT',
      matchedFaqId: 'sys_account_requirement',
      matchedQuestion: 'Do I need an account to use Josan Logistics?',
      category: 'Corporate Accounts & Partnerships',
      hasQuoteAction: true,
      answer: "Here is how account requirements work at Josan Logistics:\n\n- **Tracking Cargo (No Account Needed):** Anyone can track consignments 24/7 on our public [Track Shipment](/track) page simply by entering their tracking number or consignment reference.\n- **Instant Quotes & Bookings:** Having a free customer account is recommended so your calculated quotes, saved addresses, and active booking history remain securely accessible in your dashboard.\n- **Corporate Credit Accounts:** Available for businesses requiring 30-day payment terms. You can apply by submitting your ACRA BizFile to **contact@josanlogistics.com.sg**."
    };
  }

  // 8. Direct Contact / Phone / Email / WhatsApp Channels Check
  const isContactChannelsIntent = (
    normalizedQuery === 'contact' ||
    normalizedQuery === 'contact us' ||
    normalizedQuery === 'contact details' ||
    normalizedQuery === 'customer service' ||
    normalizedQuery.includes('phone') ||
    normalizedQuery.includes('telephone') ||
    normalizedQuery.includes('hotline') ||
    normalizedQuery.includes('call you') ||
    normalizedQuery.includes('email') ||
    normalizedQuery.includes('whatsapp') ||
    normalizedQuery.includes('contact number') ||
    normalizedQuery.includes('how to contact') ||
    normalizedQuery.includes('get in touch') ||
    normalizedQuery.includes('reach you')
  ) && !normalizedQuery.includes('driver') && !normalizedQuery.includes('booking confirmation');

  if (isContactChannelsIntent) {
    const isWhatsApp = normalizedQuery.includes('whatsapp');
    const isPhone = normalizedQuery.includes('phone') || normalizedQuery.includes('telephone') || normalizedQuery.includes('hotline') || normalizedQuery.includes('call you');
    const isEmail = normalizedQuery.includes('email');
    const contactFaq = isWhatsApp
      ? (faqs.find(f => f.id === 'faq_co197_whatsapp_number'))
      : isPhone
        ? (faqs.find(f => f.id === 'faq_co196_phone_number'))
        : isEmail
          ? (faqs.find(f => f.id === 'faq_co198_customer_support_email'))
          : (faqs.find(f => f.id === 'faq_co196_phone_number') || faqs.find(f => f.category === 'Company Info, Location & Contact'));

    if (contactFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: contactFaq.id,
        matchedQuestion: contactFaq.mainQuestion,
        category: contactFaq.category,
        hasQuoteAction: false,
        answer: contactFaq.approvedAnswer
      };
    }
  }

  // 9. Direct Office Location vs Business Hours Check
  const isOfficeOrHoursIntent = (
    normalizedQuery === 'hours' ||
    normalizedQuery === 'timing' ||
    normalizedQuery === 'timings' ||
    normalizedQuery === 'address' ||
    normalizedQuery === 'location' ||
    normalizedQuery.includes('office') ||
    normalizedQuery.includes('sim lim') ||
    normalizedQuery.includes('opening hours') ||
    normalizedQuery.includes('operating hours') ||
    normalizedQuery.includes('business hours') ||
    normalizedQuery.includes('office hours') ||
    normalizedQuery.includes('are you open') ||
    normalizedQuery.includes('timing') ||
    normalizedQuery.includes('timings') ||
    normalizedQuery.includes('address') ||
    (normalizedQuery.includes('where') && (
      normalizedQuery.includes('located') ||
      normalizedQuery.includes('office') ||
      normalizedQuery.includes('you located') ||
      normalizedQuery.includes('are you') ||
      normalizedQuery.includes('find you')
    ))
  ) && !normalizedQuery.includes('track') && !normalizedQuery.includes('delivery address') && !normalizedQuery.includes('advance');

  if (isOfficeOrHoursIntent) {
    const isHours = normalizedQuery.includes('hours') || normalizedQuery.includes('are you open') || normalizedQuery.includes('timings') || normalizedQuery.includes('opening') || normalizedQuery.includes('timing');
    const isWalkIn = normalizedQuery.includes('walk in') || normalizedQuery.includes('appointment') || normalizedQuery.includes('visit') || normalizedQuery.includes('can i visit');
    const contactFaq = isHours
      ? (faqs.find(f => f.id === 'faq_co193_operating_hours') || faqs.find(f => f.id.includes('hours')))
      : isWalkIn
        ? (faqs.find(f => f.id === 'faq_co199_walk_in_sim_lim_office') || faqs.find(f => f.id === 'faq_co191_where_located'))
        : (faqs.find(f => f.id === 'faq_co191_where_located') || faqs.find(f => f.id === 'faq_co192_exact_office_address') || faqs.find(f => f.id.includes('located')));

    if (contactFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: contactFaq.id,
        matchedQuestion: contactFaq.mainQuestion,
        category: contactFaq.category,
        hasQuoteAction: false,
        answer: contactFaq.approvedAnswer
      };
    }
  }

  // 10. Direct Damaged Cargo & Claims Check
  const isDamageClaimIntent = normalizedQuery === 'damage' ||
    normalizedQuery === 'damaged' ||
    normalizedQuery === 'broken' ||
    normalizedQuery === 'claim' ||
    normalizedQuery === 'damaged cargo' ||
    normalizedQuery === 'cargo damage' ||
    normalizedQuery.includes('damaged') ||
    normalizedQuery.includes('broken cargo') ||
    normalizedQuery.includes('cargo damage') ||
    normalizedQuery.includes('damaged cargo') ||
    (
      (normalizedQuery.includes('damage') ||
       normalizedQuery.includes('broken') ||
       normalizedQuery.includes('claim') ||
       normalizedQuery.includes('compensation') ||
       normalizedQuery.includes('loss')) &&
      (normalizedQuery.includes('cargo') ||
       normalizedQuery.includes('goods') ||
       normalizedQuery.includes('shipment') ||
       normalizedQuery.includes('package') ||
       normalizedQuery.includes('arrived') ||
       normalizedQuery.includes('report') ||
       normalizedQuery.includes('what should i do') ||
       normalizedQuery.includes('how do i'))
    );

  if (isDamageClaimIntent) {
    const damageFaq = faqs.find(f => f.id === 'faq_i180_report_damaged_cargo') ||
      faqs.find(f => f.id === 'faq_i176_automatic_cargo_insurance') ||
      faqs.find(f => f.category === 'Insurance, Claims & Delays');
    if (damageFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: damageFaq.id,
        matchedQuestion: damageFaq.mainQuestion,
        category: damageFaq.category,
        hasQuoteAction: false,
        answer: damageFaq.approvedAnswer
      };
    }
  }

  // 10b. Direct Cargo Insurance Check
  const isInsuranceIntent = normalizedQuery === 'insurance' ||
    normalizedQuery === 'cargo insurance' ||
    normalizedQuery.includes('insurance') ||
    normalizedQuery.includes('is cargo insured') ||
    normalizedQuery.includes('are goods insured');

  if (isInsuranceIntent) {
    const insFaq = faqs.find(f => f.id === 'faq_i176_automatic_cargo_insurance') ||
      faqs.find(f => f.category === 'Insurance, Claims & Delays');
    if (insFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: insFaq.id,
        matchedQuestion: insFaq.mainQuestion,
        category: insFaq.category,
        hasQuoteAction: false,
        answer: insFaq.approvedAnswer
      };
    }
  }

  // 11. Direct Reschedule / Cancel Intent Check
  const isRescheduleIntent = normalizedQuery.includes('reschedule') ||
    (normalizedQuery.includes('change') && (normalizedQuery.includes('time') || normalizedQuery.includes('date') || normalizedQuery.includes('pickup')));

  if (isRescheduleIntent && !normalizedQuery.includes('address')) {
    const reschedFaq = faqs.find(f => f.id === 'faq_b15_reschedule_pickup');
    if (reschedFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: reschedFaq.id,
        matchedQuestion: reschedFaq.mainQuestion,
        category: reschedFaq.category,
        hasQuoteAction: false,
        answer: reschedFaq.approvedAnswer
      };
    }
  }

  const isCancelIntent = normalizedQuery.includes('cancel') || normalizedQuery.includes('cancellation');
  if (isCancelIntent) {
    const cancelFaq = normalizedQuery.includes('fee')
      ? (faqs.find(f => f.id === 'faq_b17_cancellation_fee') || faqs.find(f => f.id === 'faq_b16_cancel_booking'))
      : (faqs.find(f => f.id === 'faq_b16_cancel_booking'));
    if (cancelFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: cancelFaq.id,
        matchedQuestion: cancelFaq.mainQuestion,
        category: cancelFaq.category,
        hasQuoteAction: false,
        answer: cancelFaq.approvedAnswer
      };
    }
  }

  // 12. Direct Residential / House / Condo Deliveries Check
  const isResidentialIntent = ['house', 'home', 'residential', 'hdb', 'condo', 'apartment'].some(r => normalizedQuery.includes(r));
  if (isResidentialIntent && (normalizedQuery.includes('pick up') || normalizedQuery.includes('pickup') || normalizedQuery.includes('deliver') || normalizedQuery.includes('delivery'))) {
    const resFaq = faqs.find(f => f.id === 'faq_r66_residential_hdb_condo_pickups');
    if (resFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: resFaq.id,
        matchedQuestion: resFaq.mainQuestion,
        category: resFaq.category,
        hasQuoteAction: true,
        answer: resFaq.approvedAnswer
      };
    }
  }

  // 13. Direct 24ft Heavy Lorry Check
  if ((normalizedQuery.includes('24ft') || normalizedQuery.includes('24 foot') || normalizedQuery.includes('24-foot')) && !normalizedQuery.includes('pallet')) {
    const lorryFaq = faqs.find(f => f.id === 'faq_r55_24ft_heavy_lorry');
    if (lorryFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: lorryFaq.id,
        matchedQuestion: lorryFaq.mainQuestion,
        category: lorryFaq.category,
        hasQuoteAction: true,
        answer: lorryFaq.approvedAnswer
      };
    }
  }

  // 14. Direct Air Waybill (AWB) Inquiries Check
  if (normalizedQuery === 'awb' || normalizedQuery === 'air waybill' || normalizedQuery === 'airway bill' ||
      normalizedQuery.includes('air waybill') || normalizedQuery.includes('airway bill') || normalizedQuery.includes('awb')) {
    const isWhatIs = normalizedQuery === 'awb' || normalizedQuery === 'air waybill' || normalizedQuery === 'airway bill' ||
      normalizedQuery.includes('what is') || normalizedQuery.includes('meaning') || normalizedQuery.includes('stand for');
    const isDiff = normalizedQuery.includes('difference') || normalizedQuery.includes('master') || normalizedQuery.includes('house');

    const awbFaq = isDiff
      ? (faqs.find(f => f.id === 'faq_a80_master_vs_house_awb') || faqs.find(f => f.id === 'faq_a78_prepare_awb'))
      : isWhatIs
        ? (faqs.find(f => f.id === 'faq_a76_what_is_an_air_waybill') || faqs.find(f => f.id === 'faq_a78_prepare_awb'))
        : (faqs.find(f => f.id === 'faq_a78_prepare_awb') || faqs.find(f => f.id === 'faq_a77_documents_required_air_freight'));

    if (awbFaq) {
      return {
        isFallback: false,
        confidence: 0.98,
        matchLayer: 'DIRECT_POLICY_RULE',
        matchedFaqId: awbFaq.id,
        matchedQuestion: awbFaq.mainQuestion,
        category: awbFaq.category,
        hasQuoteAction: false,
        answer: awbFaq.approvedAnswer
      };
    }
  }

  // ---------------------------------------------------------------------------
  // MULTI-TIER FAQ MATCHING LOOP (Fuzzy Alternatives & Keyword/Synonym Scoring)
  // ---------------------------------------------------------------------------
  let bestMatch = null;
  let highestScore = 0;
  let matchedLayer = 'NONE';
  let matchedQuestion = null;
  const candidateFaqs = [];

  for (const faq of faqs) {
    const alts = Array.isArray(faq.alternativeQuestions) ? faq.alternativeQuestions : [];
    const faqKeywords = Array.isArray(faq.keywords) ? faq.keywords : [];
    const faqMainKeywords = extractKeywords(faq.mainQuestion);
    const individualFaqKeywords = faqKeywords.flatMap(k => extractKeywords(k));
    const altKeywords = alts.flatMap(alt => extractKeywords(alt));
    const targetKeywordsSet = new Set([
      ...faqKeywords.map(k => normalizeText(k)),
      ...individualFaqKeywords,
      ...faqMainKeywords,
      ...altKeywords
    ]);

    const hasSharedKeyword = queryKeywords.length === 0 || queryKeywords.some(qk => {
      for (const tk of targetKeywordsSet) {
        if (areTokensEquivalent(qk, tk)) return true;
      }
      return false;
    });

    // LAYER 2: ALTERNATIVE QUESTION FUZZY SIMILARITY
    let topAltScore = 0;
    let topAltQuestion = null;

    const allQuestions = [faq.mainQuestion, ...alts];
    for (const q of allQuestions) {
      const normQ = normalizeText(q);

      // Prevent cross-matching distinct vehicle sizes (14ft vs 24ft)
      const has14 = normalizedQuery.includes('14');
      const has24 = normalizedQuery.includes('24');
      const qHas14 = normQ.includes('14');
      const qHas24 = normQ.includes('24');
      if ((has14 && qHas24 && !has24) || (has24 && qHas14 && !has14)) {
        continue;
      }

      // Prevent cross-matching distinct days (Saturday vs Sunday)
      const hasSat = normalizedQuery.includes('saturday');
      const hasSun = normalizedQuery.includes('sunday');
      const qHasSat = normQ.includes('saturday');
      const qHasSun = normQ.includes('sunday');
      if ((hasSat && qHasSun && !hasSun) || (hasSun && qHasSat && !hasSat)) {
        continue;
      }

      const levSim = levenshteinSimilarity(normalizedQuery, normQ);
      if (!hasSharedKeyword && levSim < 0.70) {
        continue;
      }

      const tokensQ = tokenize(q);
      const diceSim = tokenDiceSimilarity(queryTokens, tokensQ);

      const phraseScore = (levSim * 0.45) + (diceSim * 0.55);
      if (phraseScore > topAltScore) {
        topAltScore = phraseScore;
        topAltQuestion = q;
      }
    }

    let layer2Confidence = 0;
    if (topAltScore >= 0.75) {
      layer2Confidence = Math.min(0.98, 0.85 + ((topAltScore - 0.75) / 0.25) * 0.13);
      if (layer2Confidence > highestScore) {
        highestScore = layer2Confidence;
        bestMatch = faq;
        matchedLayer = 'ALTERNATIVE_FUZZY_MATCH';
        matchedQuestion = topAltQuestion;
      }
      if (layer2Confidence >= 0.95) {
        candidateFaqs.push({ faq, score: layer2Confidence, matchedQuestion: topAltQuestion });
        continue;
      }
    } else if (topAltScore >= 0.35) {
      layer2Confidence = topAltScore * 0.88;
    }

    // 3. LAYER 3: WEIGHTED KEYWORD & SYNONYM MATCHING
    const normFaqText = normalizeText(faq.mainQuestion) + ' ' + faqKeywords.join(' ');

    // Vehicle size & weekend guards in Layer 3
    const qHas14 = normalizedQuery.includes('14ft') || normalizedQuery.includes('14-foot') || normalizedQuery.includes('14 ft') || (normalizedQuery.includes('14') && !normalizedQuery.includes('24'));
    const qHas24 = normalizedQuery.includes('24ft') || normalizedQuery.includes('24-foot') || normalizedQuery.includes('24 ft') || (normalizedQuery.includes('24') && !normalizedQuery.includes('14'));
    const faqHas14 = normFaqText.includes('14ft') || normFaqText.includes('14-foot') || normFaqText.includes('14 ft') || (normFaqText.includes('14') && !normFaqText.includes('24'));
    const faqHas24 = normFaqText.includes('24ft') || normFaqText.includes('24-foot') || normFaqText.includes('24 ft') || (normFaqText.includes('24') && !normFaqText.includes('14'));
    if ((qHas14 && faqHas24 && !faqHas14) || (qHas24 && faqHas14 && !faqHas24)) {
      continue;
    }

    const qHasSat = normalizedQuery.includes('saturday');
    const qHasSun = normalizedQuery.includes('sunday');
    const faqHasSat = normFaqText.includes('saturday');
    const faqHasSun = normFaqText.includes('sunday');
    if ((qHasSat && faqHasSun && !faqHasSat) || (qHasSun && faqHasSat && !faqHasSun)) {
      continue;
    }

    let layer3Score = 0;
    if (queryKeywords.length > 0 && targetKeywordsSet.size > 0) {
      const matchedUserKeys = new Set();
      const matchedTargetKeys = new Set();
      let exactMatches = 0;

      for (const qKey of queryKeywords) {
        let matched = false;
        // Direct exact match check first
        for (const tKey of targetKeywordsSet) {
          if (qKey === tKey) {
            matchedUserKeys.add(qKey);
            matchedTargetKeys.add(tKey);
            exactMatches++;
            matched = true;
            break;
          }
        }
        if (!matched) {
          for (const tKey of targetKeywordsSet) {
            if (areTokensEquivalent(qKey, tKey)) {
              matchedUserKeys.add(qKey);
              matchedTargetKeys.add(tKey);
              break;
            }
          }
        }
      }

      const matchedCount = matchedUserKeys.size;
      const userRecall = matchedCount / queryKeywords.length;
      const faqCoverage = matchedTargetKeys.size / Math.min(targetKeywordsSet.size, 4);
      const overlapRatio = matchedCount / Math.min(queryKeywords.length, 3);

      // Exact multi-word phrase matching bonus
      let phraseBonus = 0;
      for (const k of faqKeywords) {
        const normK = normalizeText(k);
        if (normK.includes(' ') && normalizedQuery.includes(normK)) {
          phraseBonus = Math.max(phraseBonus, 0.15);
        }
      }
      for (const alt of (faq.alternativeQuestions || [])) {
        const normAlt = normalizeText(alt);
        if (normAlt.length > 5 && normalizedQuery.includes(normAlt)) {
          phraseBonus = Math.max(phraseBonus, 0.20);
        }
      }

      if (matchedCount >= 1) {
        const exactRatio = queryKeywords.length > 0 ? (exactMatches / queryKeywords.length) : 0;
        const compositeScore = (overlapRatio * 0.35) + (userRecall * 0.25) + (faqCoverage * 0.25) + (exactRatio * 0.10) + (phraseBonus * 1.0);
        const isStrongMultiKey = matchedCount >= 2 && (overlapRatio >= 0.50 || userRecall >= 0.35);
        const isSingleKeyMatch = queryKeywords.length === 1 && matchedCount === 1 && (faqCoverage >= 0.25 || faqKeywords.some(k => areTokensEquivalent(queryKeywords[0], normalizeText(k))));

        if (isStrongMultiKey || isSingleKeyMatch || phraseBonus > 0) {
          layer3Score = Math.min(0.96, 0.72 + (compositeScore * 0.22));
        } else {
          // Partial keyword overlap score
          layer3Score = Math.min(0.68, 0.35 + (compositeScore * 0.32));
        }

        if (layer3Score > highestScore) {
          highestScore = layer3Score;
          bestMatch = faq;
          matchedLayer = 'KEYWORD_SYNONYM_MATCH';
          matchedQuestion = faq.mainQuestion;
        }
      }
    }

    const currentFaqScore = Math.max(layer2Confidence, layer3Score);
    if (currentFaqScore >= 0.35) {
      candidateFaqs.push({ faq, score: currentFaqScore, matchedQuestion: topAltQuestion || faq.mainQuestion });
    }
  }

  // ---------------------------------------------------------------------------
  // DECISION THRESHOLD & 3-TIER CONFIDENCE SYSTEM
  // ---------------------------------------------------------------------------

  // Tier 1: High Confidence (>= 0.70)
  if (bestMatch && highestScore >= MIN_CONFIDENCE_THRESHOLD) {
    return {
      matched: true,
      reason: null,
      isFallback: false,
      confidence: parseFloat(highestScore.toFixed(2)),
      matchLayer: matchedLayer,
      matchedFaqId: bestMatch.id,
      matchedQuestion,
      category: bestMatch.category,
      hasQuoteAction: bestMatch.hasQuoteAction,
      answer: bestMatch.approvedAnswer
    };
  }

  // Tier 2: Medium / Partial Match (0.35 to 0.69)
  if (highestScore >= 0.35 && candidateFaqs.length > 0) {
    candidateFaqs.sort((a, b) => b.score - a.score);
    const uniqueQuestions = [];
    for (const item of candidateFaqs) {
      if (!uniqueQuestions.includes(item.faq.mainQuestion)) {
        uniqueQuestions.push(item.faq.mainQuestion);
      }
      if (uniqueQuestions.length === 3) break;
    }

    if (uniqueQuestions.length > 0) {
      const suggestions = uniqueQuestions.map(q => `- ${q}`).join('\n');
      const clarificationAnswer = `I want to make sure I give you the right information. Did you mean one of these?\n${suggestions}\n\nOr you can reach our team directly on our [Contact our team](/contact) page.`;

      return {
        matched: false,
        reason: 'partial_match',
        isFallback: true,
        confidence: parseFloat(highestScore.toFixed(2)),
        matchLayer: 'PARTIAL_MATCH_SUGGESTION',
        matchedFaqId: bestMatch ? bestMatch.id : candidateFaqs[0].faq.id,
        matchedQuestion: bestMatch ? bestMatch.mainQuestion : candidateFaqs[0].faq.mainQuestion,
        category: bestMatch ? bestMatch.category : candidateFaqs[0].faq.category,
        hasQuoteAction: false,
        answer: clarificationAnswer
      };
    }
  }

  // Tier 3: Low / Out-of-Scope (< 0.35)
  return {
    ...fallbackResult,
    confidence: parseFloat(highestScore.toFixed(2)),
    matchedFaqId: bestMatch ? bestMatch.id : null,
    matchedQuestion: matchedQuestion || null
  };
}

/**
 * Public Match Question API with standardized matched and reason fields
 */
export function matchQuestion(userQuery, faqs = []) {
  const result = _matchQuestionInternal(userQuery, faqs);
  return {
    ...result,
    matched: result.matched !== undefined ? result.matched : !result.isFallback,
    reason: result.reason !== undefined ? result.reason : (result.isFallback ? 'unrelated' : null)
  };
}

/**
 * Handle incoming chat question with automatic unanswered question logging
 */
export async function processChatQuery(userQuery, { sessionId = null, ip = null } = {}) {
  // Pre-validate input. Reject gibberish / invalid input immediately without logging!
  const validation = validateUserInput(userQuery);
  if (!validation.isValid) {
    return {
      matched: false,
      reason: validation.reason || 'invalid_input',
      isFallback: true,
      confidence: 0,
      matchLayer: 'INVALID_INPUT',
      matchedFaqId: null,
      matchedQuestion: null,
      category: 'General',
      hasQuoteAction: false,
      answer: validation.message
    };
  }

  const activeFaqs = await getActiveFaqs();
  const result = matchQuestion(userQuery, activeFaqs);

  // If question is unrelated / fallback, log it to chatbot_unanswered_logs
  // (Gibberish and invalid inputs were ALREADY rejected above and are strictly NOT logged!)
  if (result.matched === false || result.isFallback || result.confidence < MIN_CONFIDENCE_THRESHOLD) {
    if (result.reason !== 'invalid_input') {
      const raw = (userQuery || '').trim();
      const sanitized = sanitizeLogText(raw);
      const normalized = normalizeText(sanitized);

      try {
        const ipHash = hashString(ip);
        await logUnansweredQuestion({
          question: sanitized,
          normalizedQuestion: normalized,
          confidenceScore: result.confidence || 0,
          closestFaqId: result.matchedFaqId,
          sessionId,
          ipHash
        });
      } catch (_err) {
        // Non-blocking logging failure
      }
    }
  }

  return result;
}
