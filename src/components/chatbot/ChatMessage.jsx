import React from 'react';
import { SourceReferences } from './SourceReferences';
import { Bot, User, Loader2 } from 'lucide-react';

export const ChatMessage = ({ message, isLoadingMessage }) => {
  const isUser = message?.role === 'user';

  // Basic Markdown Formatter (Bold, Bullet lists, Code tags)
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
    // Replace **bold** with <strong>
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  if (isLoadingMessage) {
    return (
      <div className="flex items-start space-x-3 text-sm animate-fade-in my-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6B00] to-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
          <Bot className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm max-w-[85%] rounded-tl-xs flex items-center space-x-2 text-slate-600">
          <Loader2 className="w-4 h-4 animate-spin text-[#FF6B00]" />
          <span className="text-xs font-semibold text-slate-500">Consulting Josan Knowledge Base...</span>
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

        {/* Sources References */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <SourceReferences sources={message.sources} />
        )}

        {/* Timestamp */}
        <div className={`text-[10px] mt-1.5 text-right font-mono ${isUser ? 'text-orange-200' : 'text-slate-400'}`}>
          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </div>
      </div>
    </div>
  );
};
