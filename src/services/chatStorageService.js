/**
 * JOSAN AI Chat Storage & Privacy Management Service
 * Demo chat: automatic answers only.
 * Messages are kept in memory only for the current visit; no localStorage used.
 */

export const CHAT_NOTICE_TEXT = "Demo chat: automatic answers only. Please don't share personal or payment details here.";
export const CHAT_STORAGE_PURPOSE = "Automatic demo assistant";
export const CHAT_RETENTION_DAYS = 30;

/**
 * Filter out and purge sessions older than 30 days (in-memory)
 */
function purgeExpiredChats(sessions) {
  return [];
}

/**
 * Stored chat sessions: kept in memory only for current visit, not in localStorage.
 * Admin tab shows "No chat logs yet" instead of reading localStorage.
 */
export function getAdminChatSessions() {
  return [];
}

/**
 * Save chat session (No localStorage used)
 */
export function saveAdminChatSession(sessionId, messages = [], userInfo = {}) {
  // Chat messages are kept in memory only for the current visit; no localStorage used.
  return;
}

/**
 * Attach active session (No localStorage used)
 */
export function attachChatToSubmission(referenceNumber, userInfo = {}) {
  return null;
}

/**
 * Explicitly send the active browser chat to team
 */
export function sendChatToTeam(userInfo = {}) {
  return { success: true };
}

/**
 * Admin option to delete customer chats on request
 */
export function deleteCustomerChatsOnRequest(customerIdentifier) {
  return 0;
}

/**
 * Delete a single chat session by session ID
 */
export function deleteChatSession(sessionId) {
  return true;
}
