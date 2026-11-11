import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatWindow } from './ChatWindow';
import { Bot, X } from 'lucide-react';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, quickPrompts, sendMessage, clearChat, sendToTeam } = useChat();

  const toggleOpen = () => setIsOpen(prev => !prev);

  // Hide chatbot on all /admin and /crm routes
  const isExcludedRoute = typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/admin') ||
    window.location.pathname.startsWith('/crm') ||
    window.location.hash.includes('admin') ||
    window.location.hash.includes('crm')
  );

  if (isExcludedRoute) return null;

  return (
    <div className="z-[110] pointer-events-auto">
      {/* Floating Chat Panel: Fullscreen on mobile, ~400px on desktop */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-6 sm:w-[400px] sm:h-[600px] z-[110]">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            quickPrompts={quickPrompts}
            onSendMessage={sendMessage}
            onClearChat={clearChat}
            onSendToTeam={sendToTeam}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}

      {/* Square-cornered Navy Chat Button: 48px, 4px corners, solid navy with white icon, no glow/orange */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={isOpen ? "Close Josan AI Assistant" : "Open Josan AI Assistant"}
        className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 w-12 h-12 rounded-[var(--radius)] bg-[var(--color-navy)] hover:bg-[var(--color-navy-hover)] text-[var(--color-on-navy)] border border-[var(--color-navy-border)] hover:border-[var(--color-on-navy-muted)] items-center justify-center transition-colors cursor-pointer z-[120] focus-visible:ring-2 focus-visible:ring-[var(--color-on-navy)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)] ${
          isOpen ? 'hidden sm:flex' : 'flex'
        }`}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" aria-hidden="true" />
        ) : (
          <Bot className="w-5 h-5 text-white" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};
