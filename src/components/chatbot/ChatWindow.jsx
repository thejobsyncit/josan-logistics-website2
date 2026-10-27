import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Bot, X, Trash2, ShieldAlert, Send, CheckCircle2 } from 'lucide-react';
import { openLegalDialog } from '../LegalDialog';

export const ChatWindow = ({
  messages = [],
  isLoading = false,
  quickPrompts = [],
  onSendMessage,
  onClearChat,
  onSendToTeam,
  onClose
}) => {
  const messagesEndRef = useRef(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [teamFeedback, setTeamFeedback] = useState(null);
  const [showNotice, setShowNotice] = useState(() => {
    try {
      return !sessionStorage.getItem('josan_chat_notice_dismissed');
    } catch (e) {
      return true;
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendChatToTeam = () => {
    const hasUserMsg = messages && messages.some(m => m.role === 'user');
    if (!hasUserMsg) {
      setTeamFeedback('Please ask a question or enter your inquiry first.');
      setTimeout(() => setTeamFeedback(null), 3500);
      return;
    }
    const res = onSendToTeam ? onSendToTeam() : null;
    if (res?.success) {
      setTeamFeedback(`Chat sent to our operations team! Reference #${res.referenceNumber}`);
    } else {
      setTeamFeedback('Conversation sent to our operations team for follow-up.');
    }
    setTimeout(() => setTeamFeedback(null), 6000);
  };

  return (
    <div className="flex flex-col h-full sm:h-[600px] w-full sm:w-[400px] bg-slate-50 rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200/90 overflow-hidden animate-fade-in z-[100]">
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
              <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-bold rounded-full tracking-wider">
                AI Assistant
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium truncate max-w-[210px]">
              Ask about shipments, documentation, routes and quotes.
            </p>
          </div>
        </div>

        {/* Action Buttons & Delete Confirmation */}
        {confirmDelete ? (
          <div className="flex items-center space-x-1.5 bg-red-600/95 text-white px-2 py-1 rounded-xl text-xs font-semibold animate-fade-in shadow-sm">
            <span className="text-[10px] font-bold">Delete this conversation?</span>
            <button
              type="button"
              onClick={async () => {
                setConfirmDelete(false);
                if (onClearChat) await onClearChat();
              }}
              className="px-2 py-0.5 bg-white text-red-600 hover:bg-red-50 rounded-md text-[10px] font-black cursor-pointer transition-colors shadow-2xs"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="px-1.5 py-0.5 text-white/80 hover:text-white rounded-md text-[10px] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Delete this conversation?"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Notice only once per session: short line at top */}
      {showNotice && (
        <div className="px-3 py-1.5 bg-amber-50/95 border-b border-amber-200/90 text-[10.5px] text-amber-950 flex items-center justify-between gap-1.5 shrink-0 animate-fade-in z-10">
          <div className="flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#FF6B00] shrink-0 self-start sm:self-center mt-0.5 sm:mt-0" />
            <span className="leading-tight">
              Chats may be stored to follow up on your enquiry or quote request. Please don't share passwords, payment details or NRIC numbers. See our{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openLegalDialog('privacy', e.currentTarget);
                }}
                className="text-[#FF6B00] hover:underline font-bold inline cursor-pointer"
              >
                Privacy Policy
              </button>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowNotice(false);
              try {
                sessionStorage.setItem('josan_chat_notice_dismissed', 'true');
              } catch (e) {}
            }}
            className="text-amber-700 hover:text-amber-950 p-0.5 rounded cursor-pointer shrink-0 self-start"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && <ChatMessage isLoadingMessage={true} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Team Follow-up Banner / Trigger */}
      {teamFeedback && (
        <div className="px-3 py-1.5 bg-emerald-50 border-t border-emerald-200 text-[11px] font-bold text-emerald-800 flex items-center space-x-1.5 animate-fade-in shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{teamFeedback}</span>
        </div>
      )}

      {/* Utility Bar: Send this chat to our team */}
      <div className="px-3 py-1 bg-slate-100/80 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
        <button
          type="button"
          onClick={handleSendChatToTeam}
          className="text-[10px] font-bold text-[#FF6B00] hover:text-orange-700 flex items-center space-x-1 transition-colors cursor-pointer"
        >
          <Send className="w-2.5 h-2.5 text-[#FF6B00]" />
          <span>Send this chat to our team</span>
        </button>
        <span className="text-slate-400">Stored only upon request/quote</span>
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
