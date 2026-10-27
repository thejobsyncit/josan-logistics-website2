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
    <div className="p-3 bg-white border-t border-slate-200/90 rounded-b-none sm:rounded-b-2xl space-y-2.5">
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
                className="px-2.5 py-1 bg-slate-100 hover:bg-orange-50 hover:border-orange-300 text-slate-800 hover:text-[#FF6B00] rounded-lg text-[11px] font-sans font-medium border border-slate-200 transition-all cursor-pointer shadow-2xs active:scale-95 leading-tight"
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
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#FF6B00] focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all resize-none max-h-32 font-sans"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md ${
            input.trim() && !isLoading
              ? 'bg-[#FF6B00] hover:bg-orange-600 text-white shadow-orange-500/20 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans font-medium px-1">
        <span>Press <kbd className="px-1 bg-slate-100 border rounded text-[9px] font-sans font-semibold">Enter</kbd> to send</span>
      </div>
    </div>
  );
};
