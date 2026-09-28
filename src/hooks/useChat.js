import { useState, useEffect, useCallback } from 'react';
import { ragService } from '../services/ragService';

const QUICK_PROMPTS = [
  { label: "Air Freight Docs", query: "What documents are required for air freight?" },
  { label: "Air Waybill Guide", query: "What is an Air Waybill?" },
  { label: "Singapore Customs", query: "How does Singapore customs clearance work?" },
  { label: "Josan Services", query: "What services does Josan Logistics provide?" }
];

export function useChat() {
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('josan_chat_session_id') || `sess_${Date.now()}`;
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('josan_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: "Hello! 👋 I am **Josan Logistics AI Assistant**.\n\nHow can I help you with air freight, road transport, Singapore customs clearance, or required documents today?",
        sources: [],
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist session & messages
  useEffect(() => {
    localStorage.setItem('josan_chat_session_id', sessionId);
  }, [sessionId]);

  useEffect(() => {
    try {
      localStorage.setItem('josan_chat_messages', JSON.stringify(messages.slice(-20)));
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
          content: "I couldn't find enough information in the Josan Logistics knowledge base to answer that accurately. Please check your internet connection or try rephrasing your question.",
          sources: [],
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, sessionId]);

  const clearChat = useCallback(() => {
    const newSess = `sess_${Date.now()}`;
    setSessionId(newSess);
    const welcomeMsg = [
      {
        id: `msg_welcome_${Date.now()}`,
        role: 'assistant',
        content: "Hello! 👋 I am **Josan Logistics AI Assistant**.\n\nHow can I help you with air freight, road transport, Singapore customs clearance, or required documents today?",
        sources: [],
        createdAt: new Date().toISOString()
      }
    ];
    setMessages(welcomeMsg);
    localStorage.setItem('josan_chat_session_id', newSess);
    localStorage.setItem('josan_chat_messages', JSON.stringify(welcomeMsg));
  }, []);

  return {
    messages,
    isLoading,
    error,
    quickPrompts: QUICK_PROMPTS,
    sendMessage,
    clearChat
  };
}
