/**
 * JOSAN AI Chat Storage & Privacy Management Service
 * 
 * Rules:
 * 1. Notice: "Chats may be stored to follow up on your enquiry or quote request. Please don't share passwords, payment details or NRIC numbers. See our Privacy Policy."
 * 2. Store a conversation ONLY when:
 *    - The visitor submits a quote or contact request (attach it to that reference number), OR
 *    - The visitor chooses "Send this chat to our team".
 *    Otherwise, keep the chat strictly in the browser session (sessionStorage) and delete it when the session ends.
 * 3. Delete stored chats after 30 days, visible to admin staff only.
 * 4. Admin tool to delete a customer's chats on request.
 * 5. Trash icon asks "Delete this conversation?" and deletes it from the server too.
 */

export const CHAT_NOTICE_TEXT = "Chats may be stored to follow up on your enquiry or quote request. Please don't share passwords, payment details or NRIC numbers. See our Privacy Policy.";
export const CHAT_STORAGE_PURPOSE = "Follow up on your enquiry or quote request";
export const CHAT_RETENTION_DAYS = 30;

const STORAGE_KEY = 'josan_admin_chat_logs';
const RETENTION_MS = CHAT_RETENTION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Filter out and purge sessions older than 30 days
 */
function purgeExpiredChats(sessions) {
  if (!Array.isArray(sessions)) return [];
  const now = Date.now();
  return sessions.filter(session => {
    const sessionTime = new Date(session.updatedAt || session.createdAt || now).getTime();
    return (now - sessionTime) < RETENTION_MS;
  });
}

/**
 * Retrieve all active stored chat sessions (auto-purging any > 30 days old)
 * Visible to admin staff only.
 */
export function getAdminChatSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const validSessions = purgeExpiredChats(parsed);
    
    if (validSessions.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validSessions));
    }
    return validSessions;
  } catch (err) {
    console.warn('[ChatStorageService] Failed to load chat sessions:', err);
    return [];
  }
}

/**
 * Save or update a permanent chat session record (Admin only)
 */
export function saveAdminChatSession(sessionId, messages = [], userInfo = {}) {
  if (!sessionId || !messages || messages.length === 0) return;

  try {
    const sessions = getAdminChatSessions();
    const now = new Date().toISOString();

    const existingIndex = sessions.findIndex(s => s.sessionId === sessionId);
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    const preview = lastUserMsg?.content?.slice(0, 80) || 'Logistics inquiry';

    const sessionRecord = {
      sessionId,
      referenceNumber: userInfo.referenceNumber || null,
      customerName: userInfo.name || 'Website Visitor',
      customerEmail: userInfo.email || '',
      customerPhone: userInfo.phone || '',
      purpose: userInfo.purpose || `${CHAT_STORAGE_PURPOSE} (Visible to admin staff only)`,
      trigger: userInfo.trigger || 'submission',
      createdAt: existingIndex >= 0 ? sessions[existingIndex].createdAt : now,
      updatedAt: now,
      messageCount: messages.length,
      preview,
      messages: messages.slice(-25)
    };

    if (existingIndex >= 0) {
      sessions[existingIndex] = sessionRecord;
    } else {
      sessions.unshift(sessionRecord);
    }

    const cleaned = purgeExpiredChats(sessions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  } catch (err) {
    console.warn('[ChatStorageService] Failed to save chat session:', err);
  }
}

/**
 * Attach and store the active browser session conversation when visitor submits a quote or contact request
 */
export function attachChatToSubmission(referenceNumber, userInfo = {}) {
  try {
    const raw = sessionStorage.getItem('josan_session_chat_messages');
    const sessionId = sessionStorage.getItem('josan_session_chat_id');
    if (!raw || !sessionId) return null;
    const messages = JSON.parse(raw);
    const hasUserMessage = messages.some(m => m.role === 'user');
    if (!hasUserMessage) return null;

    saveAdminChatSession(sessionId, messages, {
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      referenceNumber,
      purpose: `Follow up on enquiry or quote request #${referenceNumber}`,
      trigger: 'quote_or_contact_submission'
    });

    // Also persist to server
    fetch('/api/chat/store-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        referenceNumber,
        customerName: userInfo.name || '',
        customerEmail: userInfo.email || '',
        customerPhone: userInfo.phone || '',
        messages
      })
    }).catch(e => console.warn('[ChatStorageService] Server store warning:', e));

    return { sessionId, referenceNumber };
  } catch (e) {
    console.warn('[ChatStorageService] Failed to attach chat to submission:', e);
    return null;
  }
}

/**
 * Explicitly send the active browser chat to team when user chooses "Send this chat to our team"
 */
export function sendChatToTeam(userInfo = {}) {
  try {
    const raw = sessionStorage.getItem('josan_session_chat_messages');
    const sessionId = sessionStorage.getItem('josan_session_chat_id') || `sess_${Date.now()}`;
    if (!raw) return { success: false, reason: 'empty' };
    const messages = JSON.parse(raw);
    const hasUserMessage = messages.some(m => m.role === 'user');
    if (!hasUserMessage) return { success: false, reason: 'no_messages' };

    const refId = `CHT-${Math.floor(10000 + Math.random() * 90000)}`;
    saveAdminChatSession(sessionId, messages, {
      name: userInfo.name || 'Website Visitor',
      email: userInfo.email || '',
      phone: userInfo.phone || '',
      referenceNumber: refId,
      purpose: `Follow up on enquiry or quote request (#${refId})`,
      trigger: 'user_sent_chat'
    });

    // Send to server
    fetch('/api/chat/store-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        referenceNumber: refId,
        customerName: userInfo.name || 'Website Visitor',
        customerEmail: userInfo.email || '',
        customerPhone: userInfo.phone || '',
        messages
      })
    }).catch(e => console.warn('[ChatStorageService] Server store warning:', e));

    return { success: true, referenceNumber: refId };
  } catch (e) {
    console.warn('[ChatStorageService] sendChatToTeam error:', e);
    return { success: false, error: e.message };
  }
}

/**
 * Admin option to delete a specific customer's chats on request
 */
export function deleteCustomerChatsOnRequest(customerIdentifier) {
  if (!customerIdentifier || typeof customerIdentifier !== 'string') return 0;
  
  const query = customerIdentifier.trim().toLowerCase();
  const sessions = getAdminChatSessions();
  
  const remaining = sessions.filter(s => {
    const matchEmail = s.customerEmail && s.customerEmail.toLowerCase().includes(query);
    const matchName = s.customerName && s.customerName.toLowerCase().includes(query);
    const matchSession = s.sessionId && s.sessionId.toLowerCase() === query;
    const matchRef = s.referenceNumber && s.referenceNumber.toLowerCase() === query;
    return !(matchEmail || matchName || matchSession || matchRef);
  });

  const deletedCount = sessions.length - remaining.length;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));

  // If active user session matches, clear local client copy as well
  try {
    const currentSessId = sessionStorage.getItem('josan_session_chat_id');
    if (currentSessId && currentSessId.toLowerCase() === query) {
      sessionStorage.removeItem('josan_session_chat_messages');
    }
  } catch (e) {}

  // Also call server endpoint to purge matching logs from server
  fetch('/api/admin/chat-logs/delete-customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: customerIdentifier })
  }).catch(e => console.warn('[ChatStorageService] Server customer delete warning:', e));

  return deletedCount;
}

/**
 * Delete a single chat session by session ID
 */
export function deleteChatSession(sessionId) {
  if (!sessionId) return false;
  const sessions = getAdminChatSessions();
  const remaining = sessions.filter(s => s.sessionId !== sessionId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));

  try {
    const currentSessId = sessionStorage.getItem('josan_session_chat_id');
    if (currentSessId === sessionId) {
      sessionStorage.removeItem('josan_session_chat_messages');
    }
  } catch (e) {}

  return true;
}
