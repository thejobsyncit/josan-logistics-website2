/**
 * Server API Router for Josan RAG Chatbot & Document Management
 * Endpoint mapping: /api/chat, /api/documents/ingest, /api/documents/seed, /api/documents
 */

import { createClient } from '@supabase/supabase-js';
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
  supabaseAdmin,
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
// Rate Limiter helper: IP -> timestamp[] (Maximum attempts per minute per visitor)
function checkRateLimit(rateMap, ip, maxAttempts = 10, windowMs = 60000) {
  const now = Date.now();
  const rawTimestamps = rateMap.get(ip) || [];
  const validTimestamps = rawTimestamps.filter(t => now - t < windowMs);

  if (validTimestamps.length >= maxAttempts) {
    const oldest = validTimestamps[0];
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return { allowed: false, retryAfter };
  }

  validTimestamps.push(now);
  rateMap.set(ip, validTimestamps);
  return { allowed: true, remaining: maxAttempts - validTimestamps.length };
}

const chatIpRateLimits = new Map();
const chatSubmissionRateLimits = new Map();
const chatSessionRateLimits = new Map();

// Server-only Supabase client for chat_logs operations (reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from process.env)
let serverChatSupabaseClient = null;
let lastServerChatUrl = null;
let lastServerChatKey = null;

function getServerChatSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return null;
  }
  if (!serverChatSupabaseClient || lastServerChatUrl !== url || lastServerChatKey !== serviceKey) {
    lastServerChatUrl = url;
    lastServerChatKey = serviceKey;
    serverChatSupabaseClient = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return serverChatSupabaseClient;
}

// Active browser chat session tracker (sessionId -> timestamp)
const activeChatSessions = new Map();

function trackChatSession(sessionId) {
  if (!sessionId || typeof sessionId !== 'string') return;
  const cleanId = sessionId.trim();
  const now = Date.now();
  activeChatSessions.set(cleanId, now);

  if (activeChatSessions.size > 2000) {
    const maxAge = 24 * 60 * 60 * 1000;
    for (const [id, ts] of activeChatSessions.entries()) {
      if (now - ts > maxAge) activeChatSessions.delete(id);
    }
  }
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

  // Parse JSON Body & measure payload size
  let body = {};
  let rawBodyLength = 0;
  if (req.method === 'POST' || req.method === 'DELETE' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawBuffer = Buffer.concat(buffers);
      rawBodyLength = rawBuffer.length;
      const raw = rawBuffer.toString('utf-8');
      body = raw ? JSON.parse(raw) : {};
    } catch (e) {
      body = {};
    }
  }

  // 1. POST /api/chat
  if (path === '/api/chat' && req.method === 'POST') {
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1');

    // 10 requests per minute rate limit per visitor
    const rateCheck = checkRateLimit(chatIpRateLimits, clientIp, 10, 60000);
    if (!rateCheck.allowed) {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Retry-After', String(rateCheck.retryAfter));
      return res.end(JSON.stringify({
        error: 'Too many requests. Please try again later.'
      }));
    }

    const userMessage = body.message || body.question;
    const sessionId = (body.sessionId && typeof body.sessionId === 'string' && body.sessionId.trim())
      ? body.sessionId.trim()
      : crypto.randomUUID();
    trackChatSession(sessionId);
    const history = body.history || [];

    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Message content is required.' }));
    }

    // Reject messages longer than 1000 characters
    if (userMessage.length > 1000) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Message exceeds maximum length of 1000 characters.' }));
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
    } catch (_err) {
      console.error('[ApiMiddleware] /api/chat error');
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        answer: "I don't know enough to answer that accurately. Please check with our team on our [Contact our team](/contact) page.",
        sources: [],
        hasQuoteAction: false,
        error: 'Unable to process chat request'
      }));
    }
  }

  // POST /api/chat/store-submission
  // Store a conversation ONLY when visitor submits a quote or contact request (attached to ref) or chooses "Send this chat to our team"
  if (path === '/api/chat/store-submission' && req.method === 'POST') {
    const serverSupabase = getServerChatSupabaseClient();
    if (!serverSupabase) {
      res.statusCode = 503;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Service unavailable.' }));
    }

    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1');

    // 5 requests per minute limit per visitor
    const rateCheck = checkRateLimit(chatSubmissionRateLimits, clientIp, 5, 60000);
    if (!rateCheck.allowed) {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Retry-After', String(rateCheck.retryAfter));
      return res.end(JSON.stringify({
        error: 'Too many requests. Please try again later.'
      }));
    }

    // Maximum body size of 20 KB
    if (rawBodyLength > 20 * 1024) {
      res.statusCode = 413;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Payload too large' }));
    }

    try {
      const sessionId = (body.sessionId && typeof body.sessionId === 'string') ? body.sessionId.trim() : '';
      // Reject any request that does not carry a valid sessionId created by the chat in this browser session
      if (!sessionId || !activeChatSessions.has(sessionId)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'Invalid session' }));
      }

      const rawMessages = Array.isArray(body.messages) ? body.messages : [];
      // Maximum of 50 messages per record
      if (rawMessages.length === 0 || rawMessages.length > 50) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'Invalid request' }));
      }

      // Do not store customerName or customerPhone anywhere (Supabase chat_logs only)
      try {
        await serverSupabase.from('chat_logs').insert([{
          session_id: sessionId,
          reference_number: body.referenceNumber || null,
          customer_email: body.customerEmail || '',
          purpose: CHAT_STORAGE_PURPOSE,
          messages: rawMessages.slice(0, 50),
          created_at: new Date().toISOString()
        }]);
      } catch (_e) {
        // Generic error handling
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, referenceNumber: body.referenceNumber || null }));
    } catch (_err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Unable to process submission' }));
    }
  }

  // DELETE /api/chat/session or POST /api/chat/delete (Delete conversation from server)
  if ((path === '/api/chat/session' || path === '/api/chat/delete') && (req.method === 'DELETE' || req.method === 'POST')) {
    const serverSupabase = getServerChatSupabaseClient();
    if (!serverSupabase) {
      res.statusCode = 503;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Service unavailable.' }));
    }

    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1');

    // 5 requests per minute limit per visitor
    const rateCheck = checkRateLimit(chatSessionRateLimits, clientIp, 5, 60000);
    if (!rateCheck.allowed) {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Retry-After', String(rateCheck.retryAfter));
      return res.end(JSON.stringify({
        error: 'Too many requests. Please try again later.'
      }));
    }

    // Maximum body size of 20 KB
    if (rawBodyLength > 20 * 1024) {
      res.statusCode = 413;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Payload too large' }));
    }

    try {
      const targetSessionId = (body.sessionId || (req.url.includes('?') ? new URL(req.url, 'http://localhost').searchParams.get('sessionId') : ''))?.trim();
      // Allow deletion only when the request supplies the sessionId that created the record
      if (!targetSessionId || typeof targetSessionId !== 'string' || !activeChatSessions.has(targetSessionId)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'Invalid session' }));
      }

      // Do not allow deletion by referenceNumber alone
      try {
        await serverSupabase.from('chat_logs').delete().eq('session_id', targetSessionId);
      } catch (_e) {}
      activeChatSessions.delete(targetSessionId);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, deletedSessionId: targetSessionId }));
    } catch (_err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Unable to process session request' }));
    }
  }

  // POST /api/admin/chat-logs/delete-customer (Admin tool to delete customer chats on request)
  if (path === '/api/admin/chat-logs/delete-customer' && req.method === 'POST') {
    const identifier = (body.identifier || '').trim().toLowerCase();
    if (identifier && isSupabaseConfigured) {
      try {
        await supabase
          .from('chat_logs')
          .delete()
          .or(`session_id.eq.${identifier},reference_number.eq.${identifier},customer_email.ilike.%${identifier}%`);
      } catch (_e) {}
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: true }));
  }

  // GET /api/admin/chat-logs (Visible to admin staff only)
  if (path === '/api/admin/chat-logs' && req.method === 'GET') {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('chat_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ logs: data, purpose: CHAT_STORAGE_PURPOSE, retention: CHAT_RETENTION_DAYS }));
        }
      } catch (_e) {}
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ logs: [], purpose: CHAT_STORAGE_PURPOSE, retention: CHAT_RETENTION_DAYS }));
  }

  // 2. GET /api/documents (Return titles only)
  if (path === '/api/documents' && req.method === 'GET') {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('title')
          .order('created_at', { ascending: false });

        if (!error && data) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ documents: data.map(d => ({ title: d.title })) }));
        }
      } catch (e) {}
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ documents: inMemoryDocuments.map(d => ({ title: d.title })) }));
  }

  // 3. /api/documents/ingest (Rejected with 403)
  if (path === '/api/documents/ingest') {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Not available.' }));
  }

  // 4. /api/documents/seed (Rejected with 403)
  if (path === '/api/documents/seed') {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Not available.' }));
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
  const getAuthStaff = async () => {
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      return await verifyStaffSession(token);
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
  const requireAdminAuth = async () => {
    const authStaff = await getAuthStaff();
    if (!authStaff) {
      return { error: 'Unauthorized: Session invalid or expired.', status: 401 };
    }
    if ((authStaff.role || '').toLowerCase() !== 'admin') {
      return { error: 'Forbidden: Insufficient privileges. Admin access required.', status: 403 };
    }
    return { authStaff };
  };

  // 16. GET /api/staff/users (Admin only: view staff users list)
  if (path === '/api/staff/users' && req.method === 'GET') {
    const guard = await requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }

    const rawUsers = await getAllStaffUsers();
    const users = (rawUsers || []).map(sanitizeStaffUser);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ users }));
  }

  // 17. POST /api/staff/invite (Admin only: invite new staff member)
  if (path === '/api/staff/invite' && req.method === 'POST') {
    const guard = await requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }

    const result = await createStaffInvitation({
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
    const guard = await requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }

    const result = await toggleUserStatus({
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
    const guard = await requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }

    const result = await deleteStaffUser({
      userId: body.userId,
      actor: guard.authStaff
    });

    res.statusCode = result.status || (result.success ? 200 : 400);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 20. POST /api/staff/force-reset (Admin only: force password reset)
  if (path === '/api/staff/force-reset' && req.method === 'POST') {
    const guard = await requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }

    const result = await forcePasswordReset({
      userId: body.userId,
      actor: guard.authStaff
    });

    res.statusCode = result.status || (result.success ? 200 : 400);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 21. POST /api/staff/force-logout (Admin only: force logout / invalidate sessions)
  if (path === '/api/staff/force-logout' && req.method === 'POST') {
    const guard = await requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }

    const result = await forceLogoutStaffUser({
      userId: body.userId,
      actor: guard.authStaff
    });

    res.statusCode = result.status || (result.success ? 200 : 400);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 22. GET /api/staff/audit-log (Admin only: audit log of logins, account changes, pw resets)
  if (path === '/api/staff/audit-log' && req.method === 'GET') {
    const guard = await requireAdminAuth();
    if (guard.error) {
      res.statusCode = guard.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: guard.error }));
    }

    const result = await getAuditLogs(guard.authStaff);
    res.statusCode = result.status || 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  // 23. Server-side role guard for all generic /api/admin/* endpoints
  if (path.startsWith('/api/admin/')) {
    const guard = await requireAdminAuth();
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

