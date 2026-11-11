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
    <div className="flex flex-col h-full sm:h-[600px] w-full sm:w-[400px] bg-[var(--color-bg)] rounded-none sm:rounded-[var(--radius)] border-0 sm:border border-[var(--color-border)] overflow-hidden z-[100]">
      {/* Header */}
      <div className="bg-[var(--color-navy)] text-[var(--color-on-navy)] p-3.5 sm:p-4 shrink-0 flex items-center justify-between border-b border-[var(--color-navy-border)]">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--color-navy-hover)] border border-[var(--color-navy-border)] flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-[var(--color-on-navy)]" aria-hidden="true" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h3
                className="font-bold text-sm text-[var(--color-on-navy)]"
                style={{ letterSpacing: 'normal' }}
              >
                Josan AI Assistant
              </h3>
              <span
                className="px-1.5 py-0.5 bg-[var(--color-navy-hover)] text-[var(--color-on-navy-muted)] border border-[var(--color-navy-border)] text-[10px] font-medium rounded-[2px]"
                style={{ letterSpacing: 'normal' }}
              >
                AI Assistant
              </span>
            </div>
            <p
              className="text-[11px] text-[var(--color-on-navy-muted)] font-normal truncate max-w-[210px]"
              style={{ letterSpacing: 'normal' }}
            >
              Ask about shipments, documentation, routes and quotes.
            </p>
          </div>
        </div>

        {/* Action Buttons & Delete Confirmation */}
        {confirmDelete ? (
          <div className="flex items-center space-x-1.5 bg-[var(--color-navy-hover)] border border-[var(--color-on-navy-muted)] text-[var(--color-on-navy)] px-2 py-1 rounded-[var(--radius)] text-xs font-semibold">
            <span className="text-[10px] font-bold">Delete this conversation?</span>
            <button
              type="button"
              onClick={async () => {
                setConfirmDelete(false);
                if (onClearChat) await onClearChat();
              }}
              className="px-2 py-0.5 bg-[var(--color-surface)] text-[var(--color-navy)] hover:bg-[var(--color-bg)] rounded-[2px] text-[10px] font-bold cursor-pointer transition-colors"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="px-1.5 py-0.5 text-[var(--color-on-navy-muted)] hover:text-[var(--color-on-navy)] rounded-[2px] text-[10px] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 text-[var(--color-on-navy-muted)] hover:text-[var(--color-on-navy)] hover:bg-[var(--color-navy-hover)] rounded-[var(--radius)] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-on-navy)]"
              title="Delete this conversation?"
              aria-label="Delete conversation"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[var(--color-on-navy-muted)] hover:text-[var(--color-on-navy)] hover:bg-[var(--color-navy-hover)] rounded-[var(--radius)] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-on-navy)]"
              title="Close Assistant"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Notice only once per session: short line at top */}
      {showNotice && (
        <div className="px-3 py-1.5 bg-[var(--color-bg-alt)] border-b border-[var(--color-border)] text-[10.5px] text-[var(--color-text)] flex items-center justify-between gap-1.5 shrink-0 animate-fade-in z-10">
          <div className="flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[var(--color-navy)] shrink-0 self-start sm:self-center mt-0.5 sm:mt-0" />
            <span className="leading-tight">
              Chats may be stored to follow up on your enquiry or quote request. Please don't share passwords, payment details or NRIC numbers. See our{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openLegalDialog('privacy', e.currentTarget);
                }}
                className="text-[var(--color-navy)] hover:underline font-bold inline cursor-pointer rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-navy)]"
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
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] p-0.5 rounded cursor-pointer shrink-0 self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-navy)]"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && <ChatMessage isLoadingMessage={true} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Team Follow-up Banner / Trigger */}
      {teamFeedback && (
        <div className="px-3 py-1.5 bg-[var(--color-bg-alt)] border-t border-[var(--color-border)] text-[11px] font-bold text-[var(--color-navy)] flex items-center space-x-1.5 animate-fade-in shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-navy)] shrink-0" />
          <span>{teamFeedback}</span>
        </div>
      )}

      {/* Utility Bar: Send this chat to our team */}
      <div className="px-3 py-1 bg-[var(--color-bg-alt)] border-t border-[var(--color-border)] flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
        <button
          type="button"
          onClick={handleSendChatToTeam}
          className="text-[10px] font-bold text-[var(--color-navy)] hover:underline flex items-center space-x-1 transition-colors cursor-pointer rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-navy)]"
        >
          <Send className="w-2.5 h-2.5 text-[var(--color-navy)]" />
          <span>Send this chat to our team</span>
        </button>
        <span className="text-[var(--color-text-muted)]">Stored only upon request/quote</span>
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
