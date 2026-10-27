import { useState, useEffect, useCallback } from 'react';
import { ragService } from '../services/ragService';
import { sendChatToTeam } from '../services/chatStorageService';

const QUICK_PROMPTS = [
  { label: "How do I get a quote?", query: "How do I get a quote?" },
  { label: "What documents do I need?", query: "What documents do I need?" },
  { label: "How do I track my shipment?", query: "How do I track my shipment?" }
];

export function useChat() {
  // Use sessionStorage so the chat is kept ONLY in the browser session and deleted when session ends
  const [sessionId, setSessionId] = useState(() => {
    try {
      return sessionStorage.getItem('josan_session_chat_id') || `sess_${Date.now()}`;
    } catch (e) {
      return `sess_${Date.now()}`;
    }
  });

  const [messages, setMessages] = useState(() => {
    const defaultWelcome = [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: "Hello! I'm the Josan Logistics assistant. I can help with questions about our air freight documentation support, road transportation coordination and shipment documents. For quotes, please use our Request a Quote page.",
        disclaimer: "This assistant gives general information only and may make mistakes. It does not replace advice from our team.",
        sources: [],
        createdAt: new Date().toISOString()
      }
    ];

    try {
      const saved = sessionStorage.getItem('josan_session_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (parsed[0].id?.startsWith('msg_welcome')) {
            parsed[0].content = defaultWelcome[0].content;
            parsed[0].disclaimer = defaultWelcome[0].disclaimer;
          }
          return parsed;
        }
      }
    } catch (e) {}

    return defaultWelcome;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist session only in browser session (sessionStorage)
  useEffect(() => {
    try {
      sessionStorage.setItem('josan_session_chat_id', sessionId);
    } catch (e) {}
  }, [sessionId]);

  useEffect(() => {
    try {
      sessionStorage.setItem('josan_session_chat_messages', JSON.stringify(messages.slice(-25)));
    } catch (e) {}
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    if (!text || !text.trim() || isLoading) return;

    const userText = text.trim();
    const userMsgId = `user_${Date.now()}`;

    const userMessageObj = {
      id: userMsgId,
      role: 'user',
      content: userText,
      sources: [],
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessageObj]);
    setIsLoading(true);
    setError(null);

    // Prepare history
    const history = messages
      .filter(m => m.id !== 'msg_welcome')
      .slice(-6)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await ragService.sendMessage(userText, sessionId, history);

      const aiMsgObj = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        sources: res.sources || [],
        hasQuoteAction: res.hasQuoteAction || false,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsgObj]);
      if (res.sessionId) setSessionId(res.sessionId);
    } catch (err) {
      console.error('[useChat] Error sending message:', err);
      setError('Unable to fetch response. Please try again.');
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: "I don't know enough to answer that accurately. Please check with our team on our [Contact our team](/contact) page.",
          sources: [],
          hasQuoteAction: false,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, sessionId]);

  const clearChat = useCallback(async () => {
    const oldSessionId = sessionId;
    const newSess = `sess_${Date.now()}`;
    setSessionId(newSess);
    const welcomeMsg = [
      {
        id: `msg_welcome_${Date.now()}`,
        role: 'assistant',
        content: "Hello! I'm the Josan Logistics assistant. I can help with questions about our air freight documentation support, road transportation coordination and shipment documents. For quotes, please use our Request a Quote page.",
        disclaimer: "This assistant gives general information only and may make mistakes. It does not replace advice from our team.",
        sources: [],
        createdAt: new Date().toISOString()
      }
    ];
    setMessages(welcomeMsg);
    try {
      sessionStorage.setItem('josan_session_chat_id', newSess);
      sessionStorage.setItem('josan_session_chat_messages', JSON.stringify(welcomeMsg));
    } catch (e) {}

    // Delete conversation from server and local admin logs
    try {
      await ragService.deleteSession(oldSessionId);
    } catch (err) {
      console.warn('[useChat] Failed to delete conversation on server:', err);
    }
  }, [sessionId]);

  const sendToTeam = useCallback((userInfo = {}) => {
    return sendChatToTeam(userInfo);
  }, []);

  return {
    messages,
    isLoading,
    error,
    quickPrompts: QUICK_PROMPTS,
    sendMessage,
    clearChat,
    sendToTeam
  };
}
