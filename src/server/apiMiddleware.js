/**
 * Server API Router for Josan RAG Chatbot & Document Management
 * Endpoint mapping: /api/chat, /api/documents/ingest, /api/documents/seed, /api/documents
 */

import { generateEmbedding } from './rag/embeddings.js';
import { searchRelevantChunks } from './rag/retrieval.js';
import { generateGroundedResponse } from './rag/generation.js';
import { ingestDocument, SAMPLE_KNOWLEDGE_DOCUMENTS } from './rag/ingestion.js';
import { supabase, isSupabaseConfigured } from '../services/supabase.js';

// In-memory document storage fallback when Supabase connection is offline
let inMemoryDocuments = [];
let inMemoryChunks = [];

// Rate Limiter: IP -> timestamp[] (Maximum 10 attempts per minute per IP address)
const trackingIpRateLimits = new Map();

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
        fileType: 'pdf',
        title: sample.title,
        category: sample.category,
        description: sample.description
      });
      if (res.success && res.chunks) {
        inMemoryDocuments.push({
          id: res.documentId,
          file_name: sample.fileName,
          title: sample.title,
          category: sample.category,
          chunk_count: res.chunkCount,
          status: 'COMPLETED',
          created_at: new Date().toISOString()
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
        matchThreshold: 0.2,
        matchCount: 5
      });

      // In-memory fallback search if Supabase search returned nothing
      if ((!chunks || chunks.length === 0) && inMemoryChunks.length > 0) {
        chunks = inMemoryChunks.map(c => {
          const doc = inMemoryDocuments.find(d => d.id === c.document_id) || {};
          const lowerText = c.content.toLowerCase();
          const queryLower = userMessage.toLowerCase();
          let score = 0.3;
          if (queryLower.split(/\s+/).some(term => term.length > 2 && lowerText.includes(term))) {
            score += 0.4;
          }
          return {
            chunkId: c.id,
            documentId: c.document_id,
            documentName: doc.file_name || 'Knowledge Base Document',
            documentTitle: doc.title || doc.file_name || 'Josan Knowledge Base',
            page: c.metadata?.page || 1,
            content: c.content,
            similarity: score.toFixed(2),
            metadata: c.metadata
          };
        }).sort((a, b) => b.similarity - a.similarity).slice(0, 4);
      }

      // 3. Generate Grounded AI Response
      const result = await generateGroundedResponse(userMessage, chunks, history);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        answer: result.answer,
        sources: result.sources,
        sessionId,
        retrievedCount: chunks.length
      }));
    } catch (err) {
      console.error('[ApiMiddleware] /api/chat exception:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        answer: "I experienced an error processing your request. Please try again.",
        sources: [],
        error: err.message
      }));
    }
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
        fileType: 'pdf',
        title: sample.title,
        category: sample.category,
        description: sample.description
      });
      if (res.success) {
        seeded.push(res.title);
        if (res.chunks) {
          inMemoryDocuments.push({
            id: res.documentId,
            file_name: sample.fileName,
            title: sample.title,
            category: sample.category,
            chunk_count: res.chunkCount,
            status: 'COMPLETED',
            created_at: new Date().toISOString()
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

  // 5. POST /api/track (Visitor Tracking Query IP Rate Limiter: 10 attempts/min/IP)
  if (path === '/api/track' && req.method === 'POST') {
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1');
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

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      success: true,
      clientIp,
      remaining: rateCheck.remaining
    }));
  }

  // Default 404
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify({ error: 'API endpoint not found' }));
}
