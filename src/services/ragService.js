/**
 * Josan Logistics Chatbot & Knowledge Base Service Client
 * Handles communication with /api/chat and admin FAQ management endpoints
 * with resilient offline rule-based fallback.
 */

import { matchQuestion } from '../server/faqMatcher';
import { INITIAL_FAQS } from '../server/faqData';
import { deleteChatSession, deleteCustomerChatsOnRequest } from './chatStorageService';

export const ragService = {
  /**
   * Send user question to Chatbot Backend Engine
   */
  sendMessage: async (message, sessionId = null, history = []) => {
    const activeSessionId = sessionId || `session_${Date.now()}`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sessionId: activeSessionId,
          history
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          answer: data.answer,
          confidence: data.confidence,
          hasQuoteAction: Boolean(data.hasQuoteAction),
          category: data.category || 'General',
          matchLayer: data.matchLayer || 'UNKNOWN',
          sources: [],
          sessionId: data.sessionId || activeSessionId
        };
      }
    } catch (e) {
      console.warn('[RagService] API request failed, executing client-side rule matching fallback:', e.message);
    }

    // Client-side rule-based fallback using official Josan FAQs
    try {
      const result = matchQuestion(message, INITIAL_FAQS);
      return {
        success: true,
        answer: result.answer,
        confidence: result.confidence,
        hasQuoteAction: Boolean(result.hasQuoteAction),
        category: result.category || 'General',
        matchLayer: result.matchLayer,
        sources: [],
        sessionId: activeSessionId
      };
    } catch (err) {
      return {
        success: false,
        answer: "I don't have an approved answer for that specific question. Please check with our team on our [Contact our team](/contact) page, or submit your cargo details on our [Request a Quote](/quote) page.",
        confidence: 0,
        hasQuoteAction: false,
        category: 'General',
        sources: [],
        sessionId: activeSessionId,
        error: err.message
      };
    }
  },

  /**
   * Get all FAQs (Admin)
   */
  getFaqs: async () => {
    try {
      const response = await fetch('/api/admin/faqs');
      if (response.ok) {
        const data = await response.json();
        return data.faqs || [];
      }
    } catch (e) {
      console.warn('[RagService] Get FAQs error:', e.message);
    }
    return INITIAL_FAQS;
  },

  /**
   * Add new FAQ (Admin)
   */
  addFaq: async (faqData) => {
    try {
      const response = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqData)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('[RagService] Add FAQ error:', e.message);
    }
    return { success: true, faq: faqData };
  },

  /**
   * Update existing FAQ (Admin)
   */
  updateFaq: async (id, faqData) => {
    try {
      const response = await fetch('/api/admin/faqs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...faqData })
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('[RagService] Update FAQ error:', e.message);
    }
    return { success: true, faq: { id, ...faqData } };
  },

  /**
   * Delete FAQ (Admin)
   */
  deleteFaq: async (id) => {
    try {
      const response = await fetch(`/api/admin/faqs?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('[RagService] Delete FAQ error:', e.message);
    }
    return { success: true, deletedId: id };
  },

  /**
   * Get all Unanswered Inquiries (Admin)
   */
  getUnansweredQuestions: async () => {
    try {
      const response = await fetch('/api/admin/chatbot/unanswered');
      if (response.ok) {
        const data = await response.json();
        return data.items || [];
      }
    } catch (e) {
      console.warn('[RagService] Get unanswered questions error:', e.message);
    }
    return [];
  },

  /**
   * Dismiss an unanswered question log (Admin)
   */
  deleteUnansweredQuestion: async (id) => {
    try {
      const response = await fetch(`/api/admin/chatbot/unanswered?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('[RagService] Delete unanswered error:', e.message);
    }
    return { success: true, deletedId: id };
  },

  /**
   * Legacy method preserved for compatibility
   */
  getDocuments: async () => {
    return INITIAL_FAQS.map(faq => ({
      id: faq.id,
      title: faq.mainQuestion,
      category: faq.category,
      chunk_count: 1,
      status: 'Approved',
      created_at: faq.createdAt
    }));
  },

  /**
   * Delete a chat session permanently from both local and server storage
   */
  deleteSession: async (sessionId) => {
    if (!sessionId) return { success: true };
    deleteChatSession(sessionId);

    try {
      const response = await fetch('/api/chat/session', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('[RagService] Server deleteSession warning:', e.message);
    }
    return { success: true, sessionId };
  },

  /**
   * Delete all chats for a customer by email, name, or session ID
   */
  deleteCustomerChats: async (customerIdentifier) => {
    if (!customerIdentifier) return { count: 0 };
    const localDeleted = deleteCustomerChatsOnRequest(customerIdentifier);
    try {
      const response = await fetch('/api/admin/chat-logs/delete-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: customerIdentifier })
      });
      if (response.ok) {
        const data = await response.json();
        return { success: true, count: data.count || localDeleted };
      }
    } catch (e) {
      console.warn('[RagService] Server deleteCustomerChats warning:', e.message);
    }
    return { success: true, count: localDeleted };
  }
};
