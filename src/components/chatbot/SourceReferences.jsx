import React from 'react';
import { FileText, ExternalLink, Sparkles } from 'lucide-react';

export const SourceReferences = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
      <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>Knowledge Base Sources</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {sources.map((source, index) => {
          const docName = source.documentName || source.documentTitle || 'Josan Document';
          const pageStr = source.page ? `Page ${source.page}` : '';
          const relevancePct = source.relevance ? Math.round(parseFloat(source.relevance) * 100) : null;

          return (
            <div
              key={index}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-slate-800 rounded-lg text-xs border border-amber-500/20 transition-all font-medium cursor-default group"
              title={`Source Document: ${docName}${pageStr ? ' • ' + pageStr : ''}`}
            >
              <FileText className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <span className="font-semibold text-slate-900 max-w-[180px] truncate">{docName}</span>
              {pageStr && <span className="text-[10px] text-slate-500 font-mono">({pageStr})</span>}
              {relevancePct && (
                <span className="text-[9px] font-mono px-1 py-0.2 bg-amber-500/20 text-amber-800 rounded font-bold">
                  {relevancePct}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
