import React from 'react';
import { SourceReferences } from './SourceReferences';
import { Bot, User, Loader2 } from 'lucide-react';
import { openLegalDialog } from '../LegalDialog';

export const ChatMessage = ({ message, isLoadingMessage, isAdminView = false }) => {
  const isUser = message?.role === 'user';

  // Basic Markdown Formatter (Bold, Bullet lists, Markdown Links [text](url))
  const formatText = (text) => {
    if (!text) return null;

    const paragraphs = text.split('\n\n');
    return paragraphs.map((para, pIdx) => {
      const lines = para.split('\n');
      
      const isList = lines.every(line => line.trim().startsWith('- ') || line.trim().startsWith('* ') || /^\d+\.\s/.test(line.trim()));

      if (isList) {
        return (
          <ul key={pIdx} className="list-disc list-inside space-y-1 my-1.5 pl-1 text-slate-800">
            {lines.map((line, lIdx) => {
              const cleanLine = line.replace(/^[-*]\s+|\d+\.\s+/, '');
              return <li key={lIdx}>{renderFormattedInline(cleanLine)}</li>;
            })}
          </ul>
        );
      }

      return (
        <p key={pIdx} className="mb-2 last:mb-0 leading-relaxed text-slate-800">
          {lines.map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {renderFormattedInline(line)}
              {lIdx < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  const renderFormattedInline = (str) => {
    if (!str) return null;

    // Parse markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      parts.push({
        type: 'link',
        text: match[1],
        url: match[2]
      });
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts.map((part, pIdx) => {
      if (typeof part === 'object' && part.type === 'link') {
        const isPrivacyLink = part.url === '/privacy' || 
                              part.url.includes('privacy') || 
                              part.text.toLowerCase().includes('privacy');
        return (
          <a
            key={pIdx}
            href={part.url}
            onClick={(e) => {
              if (isPrivacyLink) {
                e.preventDefault();
                e.stopPropagation();
                openLegalDialog('privacy', e.currentTarget);
              }
            }}
            className="text-[#FF6B00] hover:text-orange-600 font-bold underline transition-colors cursor-pointer"
          >
            {part.text}
          </a>
        );
      }

      // Handle **bold** formatting within plain text
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith('**') && bPart.endsWith('**')) {
          return <strong key={`${pIdx}-${bIdx}`} className="font-extrabold text-slate-900">{bPart.slice(2, -2)}</strong>;
        }
        return bPart;
      });
    });
  };

  const isQuoteOrPricingOrShipmentAnswer = !isUser && (
    message?.hasQuoteAction ||
    /\b(quote|quotes|pricing|prices|rate|rates|cost|costs|per kg|estimate|specific shipment|shipment details|book a shipment|shipping request)\b/i.test(message?.content || '')
  ) && !message?.id?.startsWith('msg_welcome');

  if (isLoadingMessage) {
    return (
      <div className="flex items-start space-x-3 text-sm animate-fade-in my-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6B00] to-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
          <Bot className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm max-w-[85%] rounded-tl-xs flex items-center space-x-2 text-slate-600">
          <Loader2 className="w-4 h-4 animate-spin text-[#FF6B00]" />
          <span className="text-xs font-semibold text-slate-500">Searching assistance...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 text-sm my-3 animate-fade-in ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
        isUser
          ? 'bg-[#0B132B] text-white'
          : 'bg-gradient-to-tr from-[#FF6B00] to-amber-500 text-white'
      }`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      {/* Bubble Content */}
      <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
        isUser
          ? 'bg-gradient-to-r from-[#FF6B00] to-orange-600 text-white rounded-tr-xs font-medium text-xs sm:text-sm'
          : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs text-xs sm:text-sm'
      }`}>
        <div className={isUser ? 'text-white' : 'text-slate-800'}>
          {isUser ? <p className="leading-relaxed">{message.content}</p> : formatText(message.content)}
        </div>

        {/* Disclaimer under message */}
        {!isUser && message.disclaimer && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic leading-relaxed">
            {message.disclaimer}
          </div>
        )}

        {/* Quote / Pricing / Specific Shipment Actions */}
        {isQuoteOrPricingOrShipmentAnswer && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                window.location.href = '/quote';
              }}
              className="px-3.5 py-1.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-orange-500/20 active:scale-95 cursor-pointer flex items-center space-x-1"
            >
              <span>Request a Quote</span>
            </button>
            <a
              href="/contact"
              className="text-xs font-semibold text-slate-600 hover:text-[#FF6B00] underline transition-colors cursor-pointer"
            >
              Contact our team
            </a>
          </div>
        )}

        {/* Sources References (Visible in Admin View Only for Testing) */}
        {isAdminView && !isUser && message.sources && message.sources.length > 0 && (
          <SourceReferences sources={message.sources} />
        )}

        {/* Timestamp: Same font as rest of the site */}
        <div className={`text-[10px] mt-1.5 text-right font-sans font-normal ${isUser ? 'text-orange-200' : 'text-slate-400'}`}>
          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </div>
      </div>
    </div>
  );
};
