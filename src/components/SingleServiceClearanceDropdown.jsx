import React, { useState } from 'react';
import { ChevronDown, ExternalLink, Check, Clock } from 'lucide-react';
import { SampleCertificateModal } from './SampleCertificateModal';

export const SingleServiceClearanceDropdown = ({ 
  serviceName = "Cargo Service", 
  timeline = "24–48 hours", 
  documents = [], 
  status = "Ready to Book" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mt-4 border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs transition-all">
      
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left cursor-pointer group"
      >
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
            Clearance & Documentation
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            {status}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-medium text-slate-500 hidden md:inline">
            {timeline}
          </span>
          <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-orange-50 text-slate-500 group-hover:text-orange-600 flex items-center justify-center transition-all">
            <ChevronDown 
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isExpanded ? 'rotate-180 text-orange-600' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {/* Accordion Content */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 border-t border-slate-100 bg-slate-50/60 space-y-3">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                {serviceName}
              </span>
              <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 inline-flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Timeline: {timeline}</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                REQUIRED DOCUMENTS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-xs font-medium text-slate-700 bg-white p-1.5 rounded border border-slate-200/80">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                Status: {status}
              </span>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>View Sample Clearance Certificate</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <SampleCertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceTitle={serviceName}
        timeline={timeline}
        documents={documents}
      />

    </div>
  );
};
