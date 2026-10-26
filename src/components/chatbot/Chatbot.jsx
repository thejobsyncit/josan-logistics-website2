import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatWindow } from './ChatWindow';
import { Bot, MessageSquare, X, Sparkles } from 'lucide-react';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, quickPrompts, sendMessage, clearChat } = useChat();

  const toggleOpen = () => setIsOpen(prev => !prev);

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[95] flex flex-col items-end pointer-events-auto">
      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[390px] shadow-2xl rounded-2xl animate-fade-in transition-all duration-300">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            quickPrompts={quickPrompts}
            onSendMessage={sendMessage}
            onClearChat={clearChat}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={toggleOpen}
        aria-label="Toggle Josan AI Assistant"
        className={`relative group px-4 py-3.5 rounded-full shadow-2xl flex items-center space-x-2.5 transition-all duration-300 cursor-pointer ${
          isOpen
            ? 'bg-slate-900 text-white hover:bg-slate-800 ring-2 ring-slate-700'
            : 'bg-gradient-to-r from-[#FF6B00] via-orange-500 to-amber-500 text-white hover:scale-105 shadow-orange-500/30 shadow-lg active:scale-95'
        }`}
      >

        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform duration-200 rotate-0" />
          ) : (
            <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-200" />
          )}
        </div>

        <div className="flex flex-col text-left pr-1">
          <span className="font-extrabold text-xs tracking-wider uppercase leading-none">
            {isOpen ? 'Close AI' : 'Josan AI'}
          </span>
        </div>
      </button>
    </div>
  );
};
