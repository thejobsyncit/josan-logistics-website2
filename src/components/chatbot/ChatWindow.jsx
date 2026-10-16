import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Bot, X, Trash2, ShieldCheck, Sparkles } from 'lucide-react';

export const ChatWindow = ({
  messages = [],
  isLoading = false,
  quickPrompts = [],
  onSendMessage,
  onClearChat,
  onClose
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[520px] sm:h-[580px] w-full max-w-[400px] bg-slate-50 rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-fade-in z-[100]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B132B] via-slate-900 to-[#0B132B] text-white p-3.5 sm:p-4 shrink-0 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B00] to-amber-500 flex items-center justify-center font-black shadow-md shadow-orange-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0B132B] rounded-full animate-pulse" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <h3 className="font-extrabold text-sm tracking-wide text-white">
                Josan AI Assistant
              </h3>
              <span className="px-1.5 py-0.2 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-bold rounded-full uppercase tracking-wider">
                Official AI
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium truncate max-w-[210px]">
              Ask about shipments, documents, customs and logistics.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onClearChat}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* RAG Status Bar */}
      <div className="bg-amber-500/10 px-3 py-1.5 border-b border-amber-500/20 flex items-center justify-between text-[10px] text-amber-900 font-bold shrink-0">
        <div className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span>Grounded in Josan Knowledge Base</span>
        </div>
        <span className="text-[9px] text-amber-700 font-mono">Verified</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && <ChatMessage isLoadingMessage={true} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <ChatInput
        onSendMessage={onSendMessage}
        quickPrompts={quickPrompts}
        isLoading={isLoading}
      />
    </div>
  );
};
