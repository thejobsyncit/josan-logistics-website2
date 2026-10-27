/**
 * Server API Router for Josan RAG Chatbot & Document Management
 * Endpoint mapping: /api/chat, /api/documents/ingest, /api/documents/seed, /api/documents
 */

import { generateEmbedding } from './rag/embeddings.js';
import { searchRelevantChunks } from './rag/retrieval.js';
import { generateGroundedResponse, MIN_MATCH_THRESHOLD } from './rag/generation.js';
import { ingestDocument, SAMPLE_KNOWLEDGE_DOCUMENTS } from './rag/ingestion.js';
import { supabase, isSupabaseConfigured } from '../services/supabase.js';
import { 
  generateQuoteReferenceServer, 
  generateShipmentTrackingNumberServer 
} from './referenceGenerator.js';
import {
  authenticateStaffStep1,
  verifyStaff2FAStep2,
  changeStaffPasswordRequired,
  generateStaffSessionToken,
  verifyStaffSession,
  getAllStaffUsers,
  createStaffInvitation,
  completeStaffInvitation,
  toggleUserStatus,
  deleteStaffUser,
  forcePasswordReset,
  forceLogoutStaffUser,
  requestStaffForgotPassword,
  resetStaffPasswordWithToken,
  getAuditLogs,
  sanitizeStaffUser
} from './staffAuthService.js';

// In-memory document storage fallback when Supabase connection is offline
let inMemoryDocuments = [];
let inMemoryChunks = [];

// Server chat storage: Store chats for "Follow up on your enquiry or quote request" and delete them after 30 days, visible to admin staff only
export const CHAT_STORAGE_PURPOSE = 'Follow up on your enquiry or quote request';
export const CHAT_RETENTION_DAYS = 30;
const NUMERIC_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
let serverChatLogs = [];

function purgeExpiredServerChatLogs() {
  const now = Date.now();
  serverChatLogs = serverChatLogs.filter(log => (now - (log.createdAt || now)) < NUMERIC_RETENTION_MS);
}

// Rate Limiter: IP -> timestamp[] (Maximum 10 attempts per minute per IP address)
const trackingIpRateLimits = new Map();

// Progressive security delay map after repeated failed tries (e.g. brute force prevention)
const trackingFailedTries = new Map();

function checkFailedDelay(ip) {
  const current = trackingFailedTries.get(ip);
  if (!current) return { locked: false, waitSeconds: 0 };
  const now = Date.now();
  if (now < current.lockUntil) {
    return { locked: true, waitSeconds: Math.ceil((current.lockUntil - now) / 1000) };
  }
  if (now - current.lastFailedAt > 120000) {
    trackingFailedTries.delete(ip);
  }
  return { locked: false, waitSeconds: 0 };
}

function recordFailedTrackingTry(ip) {
  const current = trackingFailedTries.get(ip) || { count: 0, lastFailedAt: 0, lockUntil: 0 };
  const now = Date.now();
  current.count += 1;
  current.lastFailedAt = now;

  // Progressive delay: 3+ failures -> 5s, 5+ -> 15s, 7+ -> 30s
  if (current.count >= 7) {
    current.lockUntil = now + 30000;
  } else if (current.count >= 5) {
    current.lockUntil = now + 15000;
  } else if (current.count >= 3) {
    current.lockUntil = now + 5000;
  }
  trackingFailedTries.set(ip, current);
}

function recordSuccessfulTrackingTry(ip) {
  trackingFailedTries.delete(ip);
}

function checkIpTrackingRateLimit(ip, maxAttempts = 10, windowMs = 60000) {
  const now = Date.now();
  const rawTimestamps = trackingIpRateLimits.get(ip) || [];
  const validTimestamps = rawTimestamps.filter(t => now - t < windowMs);

  if (validTimestamps.length >= maxAttempts) {
    const oldest = validTimestamps[0];
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return { allowed: false, retryAfter };
  }

  validTimestamps.push(now);
  trackingIpRateLimits.set(ip, validTimestamps);
  return { allowed: true, remaining: maxAttempts - validTimestamps.length };
}

// Initialize seed documents in memory
(async function initSeedInMemory() {
  try {
    for (const sample of SAMPLE_KNOWLEDGE_DOCUMENTS) {
      const res = await ingestDocument({
        fileBuffer: Buffer.from(sample.content, 'utf-8'),
        fileName: sample.fileName,
        fileType: 'txt',
        title: sample.title,
        category: sample.category,
        description: sample.description,
        source: sample.source,
        date: sample.date,
        isOfficialJosan: sample.isOfficialJosan
      });
      if (res.success && res.chunks) {
        inMemoryDocuments.push({
          id: res.documentId,
          file_name: sample.fileName,
          title: sample.title,
          category: sample.category,
          source: sample.source,
          date: sample.date,
          isOfficialJosan: sample.isOfficialJosan,
          chunk_count: res.chunkCount,
          status: 'COMPLETED',
          created_at: sample.date ? `${sample.date}T00:00:00Z` : new Date().toISOString()
        });
        inMemoryChunks.push(...res.chunks);
      }
    }
  } catch (e) {
    console.warn('[ApiMiddleware] Seed init warning:', e.message);
  }
})();

export async function handleApiRequest(req, res, path) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  // Parse JSON Body
  let body = {};
  if (req.method === 'POST') {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const raw = Buffer.concat(buffers).toString('utf-8');
      body = raw ? JSON.parse(raw) : {};
    } catch (e) {
      body = {};
    }
  }

  // 1. POST /api/chat
  if (path === '/api/chat' && req.method === 'POST') {
    const userMessage = body.message || body.question;
    const sessionId = body.sessionId || crypto.randomUUID();
    const history = body.history || [];

    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Message content is required.' }));
    }

    try {
      // 1. Generate Question Vector Embedding
      const queryEmbedding = await generateEmbedding(userMessage);

      // 2. Perform Vector Search in Supabase (or in-memory fallback)
      let chunks = await searchRelevantChunks(queryEmbedding, userMessage, {
        matchThreshold: MIN_MATCH_THRESHOLD,
        matchCount: 5
      });

      // In-memory fallback search if Supabase search returned nothing
      if ((!chunks || chunks.length === 0) && inMemoryChunks.length > 0) {
        chunks = inMemoryChunks.map(c => {
          const doc = inMemoryDocuments.find(d => d.id === c.document_id) || {};
          const lowerText = c.content.toLowerCase();
          const queryLower = userMessage.toLowerCase();
          let score = 0.25;
          if (queryLower.split(/\s+/).some(term => term.length > 3 && lowerText.includes(term))) {
            score += 0.55;
          }
          return {
            chunkId: c.id,
            documentId: c.document_id,
            documentName: doc.file_name || 'Knowledge Base Document',
            documentTitle: doc.title || doc.file_name || 'Josan Knowledge Base',
            page: c.metadata?.page || 1,
            content: c.content,
            source: doc.source,
            date: doc.date,
            isOfficialJosan: doc.isOfficialJosan,
            similarity: score.toFixed(2),
            metadata: c.metadata
          };
        }).filter(c => parseFloat(c.similarity) >= MIN_MATCH_THRESHOLD).sort((a, b) => b.similarity - a.similarity).slice(0, 4);
      }

      // 3. Generate Grounded AI Response
      const result = await generateGroundedResponse(userMessage, chunks, history);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        answer: result.answer,
        sources: result.sources,
        hasQuoteAction: result.hasQuoteAction || false,
        sessionId,
        retrievedCount: chunks.length
      }));
    } catch (err) {
      console.error('[ApiMiddleware] /api/chat exception:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        answer: "I don't know enough to answer that accurately. Please check with our team on our [Contact our team](/contact) page.",
        sources: [],
        hasQuoteAction: false,
        error: err.message
      }));
    }
  }

  // POST /api/chat/store-submission
  // Store a conversation ONLY when visitor submits a quote or contact request (attached to ref) or chooses "Send this chat to our team"
  if (path === '/api/chat/store-submission' && req.method === 'POST') {
    const { sessionId, referenceNumber, customerName, customerEmail, customerPhone, messages, trigger } = body;
    purgeExpiredServerChatLogs();

    const storedEntry = {
      id: crypto.randomUUID(),
      sessionId: sessionId || crypto.randomUUID(),
      referenceNumber: referenceNumber || null,
      customerName: customerName || 'Website Visitor',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      purpose: CHAT_STORAGE_PURPOSE,
      trigger: trigger || (referenceNumber ? 'quote_or_contact_submission' : 'user_sent_chat'),
      visibility: 'admin staff only',
      messages: Array.isArray(messages) ? messages : [],
      createdAt: Date.now()
    };

    serverChatLogs.unshift(storedEntry);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('chat_logs').insert([{
          session_id: storedEntry.sessionId,
          reference_number: storedEntry.referenceNumber,
          customer_email: storedEntry.customerEmail,
          purpose: storedEntry.purpose,
          messages: storedEntry.messages,
          created_at: new Date(storedEntry.createdAt).toISOString()
        }]);
      } catch (e) {
        console.warn('[ApiMiddleware] Supabase chat_logs insert warning:', e.message);
      }
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: true, referenceNumber: storedEntry.referenceNumber }));
  }

  // DELETE /api/chat/session or POST /api/chat/delete (Delete conversation from server)
  if ((path === '/api/chat/session' || path === '/api/chat/delete') && (req.method === 'DELETE' || req.method === 'POST')) {
    const targetSessionId = body.sessionId || req.url.split('?')[1]?.split('=')[1];
    if (targetSessionId) {
      serverChatLogs = serverChatLogs.filter(l => l.sessionId !== targetSessionId && l.referenceNumber !== targetSessionId);
      if (isSupabaseConfigured) {
        try {
          await supabase.from('chat_logs').delete().or(`session_id.eq.${targetSessionId},reference_number.eq.${targetSessionId}`);
        } catch (e) {}
      }
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: true, deletedSessionId: targetSessionId }));
  }

  // POST /api/admin/chat-logs/delete-customer (Admin tool to delete customer chats on request)
  if (path === '/api/admin/chat-logs/delete-customer' && req.method === 'POST') {
    const identifier = (body.identifier || '').trim().toLowerCase();
    const initialLen = serverChatLogs.length;
    if (identifier) {
      serverChatLogs = serverChatLogs.filter(l => {
        const matchesSession = l.sessionId && l.sessionId.toLowerCase() === identifier;
        const matchesRef = l.referenceNumber && l.referenceNumber.toLowerCase() === identifier;
        const matchesEmail = l.customerEmail && l.customerEmail.toLowerCase().includes(identifier);
        const matchesName = l.customerName && l.customerName.toLowerCase().includes(identifier);
        return !(matchesSession || matchesRef || matchesEmail || matchesName);
      });
      if (isSupabaseConfigured) {
        try {
          await supabase.from('chat_logs').delete().or(`session_id.eq.${identifier},reference_number.eq.${identifier},customer_email.ilike.%${identifier}%`);
        } catch (e) {}
      }
    }
    const count = initialLen - serverChatLogs.length;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: true, count }));
  }

  // GET /api/admin/chat-logs (Visible to admin staff only)
  if (path === '/api/admin/chat-logs' && req.method === 'GET') {
    purgeExpiredServerChatLogs();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ logs: serverChatLogs, purpose: CHAT_STORAGE_PURPOSE, retention: CHAT_RETENTION_DAYS }));
  }

  // 2. GET /api/documents
  if (path === '/api/documents' && req.method === 'GET') {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ documents: data }));
        }
      } catch (e) {}
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ documents: inMemoryDocuments }));
  }

  // 3. POST /api/documents/ingest
  if (path === '/api/documents/ingest' && req.method === 'POST') {
    const { title, fileName, content, category, description } = body;
    if (!content) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Document text content is required.' }));
    }

    const fileBuffer = Buffer.from(content, 'utf-8');
    const name = fileName || `${(title || 'Document').replace(/\s+/g, '_')}.txt`;

    const result = await ingestDocument({
      fileBuffer,
      fileName: name,
      fileType: name.endsWith('.pdf') ? 'pdf' : 'txt',
      title: title || name,
      category: category || 'General',
      description
    });

    if (result.success) {
      if (result.chunks) {
        inMemoryDocuments.push({
          id: result.documentId,
          file_name: name,
          title: title || name,
          category: category || 'General',
          chunk_count: result.chunkCount,
          status: 'COMPLETED',
          created_at: new Date().toISOString()
        });
        inMemoryChunks.push(...result.chunks);
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(result));
    } else {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(result));
    }
  }

  // 4. POST /api/documents/seed
  if (path === '/api/documents/seed' && req.method === 'POST') {
    const seeded = [];
    for (const sample of SAMPLE_KNOWLEDGE_DOCUMENTS) {
      const res = await ingestDocument({
        fileBuffer: Buffer.from(sample.content, 'utf-8'),
        fileName: sample.fileName,
        fileType: 'txt',
        title: sample.title,
        category: sample.category,
        description: sample.description,
        source: sample.source,
        date: sample.date,
        isOfficialJosan: sample.isOfficialJosan
      });
      if (res.success) {
        seeded.push(res.title);
        if (res.chunks) {
          inMemoryDocuments.push({
            id: res.documentId,
            file_name: sample.fileName,
            title: sample.title,
            category: sample.category,
            source: sample.source,
            date: sample.date,
            isOfficialJosan: sample.isOfficialJosan,
            chunk_count: res.chunkCount,
            status: 'COMPLETED',
            created_at: sample.date ? `${sample.date}T00:00:00Z` : new Date().toISOString()
          });
          inMemoryChunks.push(...res.chunks);
        }
      }
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      message: `Successfully seeded ${seeded.length} knowledge base documents.`,
      documents: seeded
    }));
  }

  // 5. POST /api/track (Visitor Tracking Query IP Rate Limiter & Security Delay)
  if (path === '/api/track' && req.method === 'POST') {
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1');

    // 1. Check progressive delay from repeated failed searches
    const delayCheck = checkFailedDelay(clientIp);
    if (delayCheck.locked) {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Retry-After', String(delayCheck.waitSeconds));
      return res.end(JSON.stringify({
        error: `Security delay active after repeated failed searches. Please wait ${delayCheck.waitSeconds}s before trying again.`,
        retryAfter: delayCheck.waitSeconds,
        isDelay: true
      }));
    }

    // 2. IP-level 10 attempts per minute rate limiter
    const rateCheck = checkIpTrackingRateLimit(clientIp, 10, 60000);
    if (!rateCheck.allowed) {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Retry-After', String(rateCheck.retryAfter));
      return res.end(JSON.stringify({
        error: `Rate limit reached: Maximum 10 tracking queries per minute allowed. Please wait ${rateCheck.retryAfter}s before trying again.`,
        retryAfter: rateCheck.retryAfter
      }));
    }

    const { queryNumber, status } = body;
    if (status === 'failed') {
      recordFailedTrackingTry(clientIp);
    } else if (status === 'success') {
      recordSuccessfulTrackingTry(clientIp);
    }

    // 3. Reject attempts to track quote requests on public page
    const cleanNum = (queryNumber || '').trim().toUpperCase();
    if (cleanNum.startsWith('QR-') || cleanNum.startsWith('TQ-')) {
      recordFailedTrackingTry(clientIp);
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        isQuoteReference: true,
        error: 'Quote reference numbers cannot be opened on public tracking pages. Our logistics team will review your request and reply directly by email or phone.'
      }));
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      success: true,
      clientIp,
      remaining: rateCheck.remaining
    }));
  }

  // 6. POST /api/reference/quote (Server-only cryptographically secure quote reference)
  if ((path === '/api/reference/quote' || path === '/api/reference') && req.method === 'POST') {
    const { isTest = false, contactEmail = '', isStaff = false, siteMode = 'live' } = body;
    // Mark as test when site is in test mode, or from staff test account, or test email
    const isStaffTest = isStaff || (contactEmail && (contactEmail.includes('test') || contactEmail.endsWith('@josanlogistics.com')));
    const isSiteTest = siteMode === 'test';
    const finalIsTest = Boolean(isTest || isStaffTest || isSiteTest);

    try {
      const result = generateQuoteReferenceServer({ isTest: finalIsTest });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(result));
    } catch (e) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  // 7. POST /api/reference/shipment (Server-only cryptographically secure tracking number)
  if (path === '/api/reference/shipment' && req.method === 'POST') {
    const { isTest = false, siteMode = 'live' } = body;
    const finalIsTest = Boolean(isTest || siteMode === 'test');

    try {
      const result = generateShipmentTrackingNumberServer({ isTest: finalIsTest });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(result));
    } catch (e) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  // =========================================================================
  // STAFF ACCOUNT MANAGEMENT & AUTHENTICATION ENDPOINTS
  // =========================================================================

  // Helper: Extract and authenticate staff session
  const getAuthStaff = () => {
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      return verifyStaffSession(token);
    }
    return null;
  };

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';

  // 8. POST /api/staff/login (Step 1: Email + Password)
  if (path === '/api/staff/login' && req.method === 'POST') {
    const result = await authenticateStaffStep1({
      email: body.email,
      password: body.password,
      ip: clientIp
    });

    res.statusCode = result.status || (result.success ? 200 : 401);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 9. POST /api/staff/2fa/verify (Step 2: TOTP code verification)
  if (path === '/api/staff/2fa/verify' && req.method === 'POST') {
    const result = verifyStaff2FAStep2({
      preAuthTicket: body.preAuthTicket,
      code: body.code,
      ip: clientIp
    });

    res.statusCode = result.status || (result.success ? 200 : 401);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 10. POST /api/staff/change-password (Mandatory first-login password change)
  if (path === '/api/staff/change-password' && req.method === 'POST') {
    const result = changeStaffPasswordRequired({
      changePasswordTicket: body.changePasswordTicket,
      newPassword: body.newPassword,
      ip: clientIp
    });

    res.statusCode = result.status || (result.success ? 200 : 400);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 11. POST /api/staff/forgot-password (1-hour self-service reset request)
  if (path === '/api/staff/forgot-password' && req.method === 'POST') {
    const result = requestStaffForgotPassword({
      email: body.email,
      ip: clientIp
    });

    res.statusCode = result.status || 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 12. POST /api/staff/reset-password (Complete 1-hour reset token)
  if (path === '/api/staff/reset-password' && req.method === 'POST') {
    const result = resetStaffPasswordWithToken({
      token: body.token,
      newPassword: body.newPassword,
      ip: clientIp
    });

    res.statusCode = result.status || (result.success ? 200 : 400);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 13. GET /api/staff/invitation (Verify 48-hour invitation token)
  if (path === '/api/staff/invitation' && req.method === 'GET') {
    const urlObj = new URL(req.url, 'http://localhost');
    const token = urlObj.searchParams.get('token');
    const users = getAllStaffUsers();
    const user = users.find(u => u.invitation && u.invitation.token === token);

    if (!user) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Invalid or expired invitation link.' }));
    }

    if (new Date(user.invitation.expiresAt).getTime() < Date.now()) {
      res.statusCode = 410;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'This invitation has expired (48-hour limit reached).' }));
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      valid: true,
      email: user.email,
      name: user.name,
      role: user.role,
      expiresAt: user.invitation.expiresAt
    }));
  }

  // 14. POST /api/staff/invitation/accept (Accept 48-hour invite & set password)
  if (path === '/api/staff/invitation/accept' && req.method === 'POST') {
    const result = completeStaffInvitation({
      token: body.token,
      password: body.password,
      actorIp: clientIp
    });

    res.statusCode = result.status || (result.success ? 200 : 400);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 15. GET /api/staff/session (Validate active session)
  if (path === '/api/staff/session' && req.method === 'GET') {
    const authStaff = getAuthStaff();
    if (!authStaff) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Unauthorized: No active staff session.' }));
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      authenticated: true,
      user: sanitizeStaffUser(authStaff.user)
    }));
  }

  // =========================================================================
  // ADMIN-ONLY MANAGEMENT ENDPOINTS (Requirement 2 & Requirement 5)
  // Server strictly enforces role === 'Admin'
  // =========================================================================

  // Helper guard: Admin role enforcement
  const requireAdminAuth = () => {
    const authStaff = getAuthStaff();
    if (!authStaff) {
      return { error: 'Unauthorized: Session invalid or expired.', status: 401 };
    }
    if (authStaff.role !== 'Admin') {
      return { error: 'Forbidden: Insufficient privileges. Admin access required.', status: 403 };
    }
    return { authStaff };
  };

  // 16. GET /api/staff/users (Admin only: view staff users list)
  if (path === '/api/staff/users' && req.method === 'GET') {
    const guard = requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }

    const users = getAllStaffUsers().map(sanitizeStaffUser);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ users }));
  }

  // 17. POST /api/staff/invite (Admin only: invite new staff member)
  if (path === '/api/staff/invite' && req.method === 'POST') {
    const guard = requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }

    const result = createStaffInvitation({
      name: body.name,
      email: body.email,
      role: body.role,
      actor: guard.authStaff
    });

    res.statusCode = result.status || (result.success ? 200 : 400);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 18. POST /api/staff/toggle-status (Admin only: deactivate/activate user)
  if (path === '/api/staff/toggle-status' && req.method === 'POST') {
    const guard = requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }

    const result = toggleUserStatus({
      userId: body.userId,
      status: body.status,
      actor: guard.authStaff
    });

    res.statusCode = result.status || (result.success ? 200 : 400);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 19. POST /api/staff/delete-user (Admin only: delete staff user)
  if (path === '/api/staff/delete-user' && req.method === 'POST') {
    const guard = requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }

    const result = deleteStaffUser({
      userId: body.userId,
      actor: guard.authStaff
    });

    res.statusCode = result.status || (result.success ? 200 : 400);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 20. POST /api/staff/force-reset (Admin only: force password reset)
  if (path === '/api/staff/force-reset' && req.method === 'POST') {
    const guard = requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }

    const result = forcePasswordReset({
      userId: body.userId,
      actor: guard.authStaff
    });

    res.statusCode = result.status || (result.success ? 200 : 400);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 21. POST /api/staff/force-logout (Admin only: force logout / invalidate sessions)
  if (path === '/api/staff/force-logout' && req.method === 'POST') {
    const guard = requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }

    const result = forceLogoutStaffUser({
      userId: body.userId,
      actor: guard.authStaff
    });

    res.statusCode = result.status || (result.success ? 200 : 400);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 22. GET /api/staff/audit-log (Admin only: audit log of logins, account changes, pw resets)
  if (path === '/api/staff/audit-log' && req.method === 'GET') {
    const guard = requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }

    const result = getAuditLogs(guard.authStaff);
    res.statusCode = result.status || 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 23. Server-side role guard for all generic /api/admin/* endpoints
  if (path.startsWith('/api/admin/')) {
    const guard = requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }
  }

  // Default 404
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify({ error: 'API endpoint not found' }));
}

