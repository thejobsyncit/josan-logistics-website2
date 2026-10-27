import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatWindow } from './ChatWindow';
import { Bot, X } from 'lucide-react';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, quickPrompts, sendMessage, clearChat, sendToTeam } = useChat();

  const toggleOpen = () => setIsOpen(prev => !prev);

  return (
    <div className="z-[110] pointer-events-auto">
      {/* Floating Chat Panel: Fullscreen on mobile, ~400px on desktop */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[400px] sm:h-[600px] z-[110] animate-fade-in transition-all duration-300">
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

      {/* Round Icon Button: Toggles open & closed (X when open, Bot when closed) */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={isOpen ? "Close Josan AI Assistant" : "Open Josan AI Assistant"}
        className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer z-[120] ${
          isOpen
            ? 'hidden sm:flex bg-slate-900 text-white hover:bg-slate-800 ring-2 ring-slate-700'
            : 'flex bg-gradient-to-r from-[#FF6B00] via-orange-500 to-amber-500 text-white hover:scale-105 shadow-orange-500/30 shadow-lg active:scale-95'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform duration-200" />
        ) : (
          <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-200" />
        )}
      </button>
    </div>
  );
};
