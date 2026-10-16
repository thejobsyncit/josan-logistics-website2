/**
 * Retrieval Service for RAG Pipeline
 * Performs vector similarity search against Supabase pgvector database with fallback hybrid search.
 */

import { supabase, isSupabaseConfigured } from '../../services/supabase.js';

export async function searchRelevantChunks(queryEmbedding, queryText, options = {}) {
  const {
    matchThreshold = 0.25,
    matchCount = 5
  } = options;

  let results = [];

  // 1. Try Supabase RPC match_document_chunks if Supabase is configured
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.rpc('match_document_chunks', {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount
      });

      if (!error && data && data.length > 0) {
        return data.map(item => ({
          chunkId: item.id,
          documentId: item.document_id,
          documentName: item.document_name || 'Knowledge Document',
          documentTitle: item.document_title || item.document_name || 'Josan Logistics Document',
          page: item.page_number || 1,
          content: item.content,
          similarity: parseFloat(item.similarity || 0.85).toFixed(2),
          metadata: item.metadata || {}
        }));
      }
    } catch (e) {
      console.warn('[RetrievalService] Supabase RPC search error:', e.message);
    }

    // Direct table fallback search on document_chunks table
    try {
      const { data: chunks, error: chunksErr } = await supabase
        .from('document_chunks')
        .select(`
          id,
          document_id,
          chunk_index,
          content,
          metadata,
          documents ( file_name, title )
        `)
        .limit(30);

      if (!chunksErr && chunks && chunks.length > 0) {
        // Calculate similarity locally
        const scored = chunks.map(chunk => {
          const docName = chunk.documents?.file_name || 'Logistics Document';
          const docTitle = chunk.documents?.title || docName;
          const score = calculateKeywordSimilarity(queryText, chunk.content);
          return {
            chunkId: chunk.id,
            documentId: chunk.document_id,
            documentName: docName,
            documentTitle: docTitle,
            page: chunk.metadata?.page || 1,
            content: chunk.content,
            similarity: score.toFixed(2),
            metadata: chunk.metadata || {}
          };
        });

        scored.sort((a, b) => b.similarity - a.similarity);
        results = scored.filter(item => item.similarity >= matchThreshold).slice(0, matchCount);
        if (results.length > 0) return results;
      }
    } catch (e) {
      console.warn('[RetrievalService] Direct table query error:', e.message);
    }
  }

  return results;
}

/**
 * Keyword & Semantic Cosine Fallback Scorer
 */
function calculateKeywordSimilarity(query, text) {
  if (!query || !text) return 0;
  
  const qTokens = query.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(t => t.length > 2);
  const textLower = text.toLowerCase();

  if (qTokens.length === 0) return 0;

  let matchCount = 0;
  for (const token of qTokens) {
    if (textLower.includes(token)) {
      matchCount++;
    }
  }

  const tokenRatio = matchCount / qTokens.length;
  // Boost score for exact phrase match
  const phraseMatch = textLower.includes(query.toLowerCase().trim()) ? 0.3 : 0;
  
  return Math.min(0.98, tokenRatio * 0.7 + phraseMatch + 0.15);
}
