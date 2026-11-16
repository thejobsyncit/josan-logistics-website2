import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

export const ChatInput = ({ onSendMessage, quickPrompts = [], isLoading = false }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickClick = (prompt) => {
    const textToSend = typeof prompt === 'object' ? (prompt.query || prompt.label) : prompt;
    onSendMessage(textToSend);
  };

  return (
    <div className="p-3 bg-[var(--color-surface)] border-t border-[var(--color-border)] rounded-b-none sm:rounded-b-2xl space-y-2.5">
      {/* Quick Prompts Chips: 3 chips that fit without sideways scrolling */}
      {quickPrompts && quickPrompts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 text-xs">
          {quickPrompts.slice(0, 3).map((prompt, idx) => {
            const labelText = typeof prompt === 'object' ? prompt.label : prompt;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickClick(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 bg-[var(--color-bg)] hover:bg-[var(--color-bg-alt)] text-[var(--color-text)] hover:text-[var(--color-navy)] rounded-lg text-[11px] font-sans font-medium border border-[var(--color-border)] hover:border-[var(--color-navy)] transition-colors cursor-pointer leading-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-navy)]"
              >
                {labelText}
              </button>
            );
          })}
        </div>
      )}

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="relative flex items-center space-x-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about our services or documents..."
          rows={1}
          disabled={isLoading}
          className="w-full px-3.5 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-navy)] focus:bg-[var(--color-surface)] rounded-xl text-xs sm:text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none transition-colors resize-none max-h-32 font-sans"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`p-2.5 rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)] ${
            input.trim() && !isLoading
              ? 'bg-[var(--color-navy)] hover:bg-[var(--color-navy-hover)] text-[var(--color-on-navy)]'
              : 'bg-[var(--color-bg-alt)] text-[var(--color-text-muted)] cursor-not-allowed'
          }`}
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <div className="flex items-center justify-between text-[10px] text-[var(--color-text-muted)] font-sans font-medium px-1">
        <span>Press <kbd className="px-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-[9px] font-sans font-semibold text-[var(--color-text)]">Enter</kbd> to send</span>
      </div>
    </div>
  );
};
