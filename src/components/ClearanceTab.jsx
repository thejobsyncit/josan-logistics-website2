import React, { useState } from 'react';
import { 
  Clock, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  Download, 
  Lock, 
  ArrowRight,
  FileCheck,
  Award,
  Sparkles
} from 'lucide-react';
import { SampleCertificateModal } from './SampleCertificateModal';

export const ClearanceTab = ({ service }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!service) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 lg:p-10 space-y-8 animate-fade-in">
      
      {/* Header Row inside Dashboard Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black shadow-orange-glow shrink-0">
            {service.icon && <service.icon className="w-7 h-7 stroke-[2.2]" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {service.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
              Customs pre-clearance protocol & verified document manifest
            </p>
          </div>
        </div>

        {/* 🔐 Clearance Status Badge Alert Box */}
        <div className="w-full md:w-auto bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3.5 flex items-center space-x-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
              <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                🔐 Clearance Status:
              </span>
              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide">
                {service.clearanceStatus || 'Ready to Book'}
              </span>
            </div>
            <p className="text-[11px] font-bold text-emerald-700 mt-0.5">
              Verified & pre-approved for express booking clearance
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Timeline & Sample Certificate Callout */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ⏱️ Clearance Timeline Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-orange-glow space-y-3 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Clock className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-orange-100">
                ⏱️ Clearance Timeline
              </span>
            </div>

            <div className="pt-1">
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white drop-shadow-xs">
                {service.clearanceTimeline}
              </div>
              <p className="text-xs font-medium text-orange-100 mt-1 leading-relaxed">
                Estimated average customs release duration upon document submission.
              </p>
            </div>

            <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] font-bold text-orange-100">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fast-Track Clearance SLA</span>
              </span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-white text-[10px]">
                Active SLA
              </span>
            </div>
          </div>

          {/* 📥 Sample Clearance Certificate Action Card */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4 border border-slate-800 shadow-md">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">Sample Clearance Certificate</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5 leading-relaxed">
                  Preview an official sample of the authenticated customs clearance certificate for this shipment type.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              type="button"
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-orange-sm transition-all duration-200 inline-flex items-center justify-center space-x-2 cursor-pointer group"
            >
              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>View Sample Certificate</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Right Column: 📄 Required Documents Checklist UI */}
        <div className="lg:col-span-7 bg-slate-50/90 rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide">
                  📄 Required Documents Checklist
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Ensure all files are ready prior to dispatch
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
              {service.clearanceDocuments?.length || 0} Files Needed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {service.clearanceDocuments && service.clearanceDocuments.map((doc, idx) => (
              <div 
                key={idx} 
                className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center space-x-3 hover:border-orange-300 transition-colors group"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-snug">
                  {doc}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-orange-50 border border-orange-200/70 p-3 rounded-xl flex items-center space-x-2.5 text-xs text-orange-800 font-semibold mt-2">
            <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
            <span>All submitted documents are encrypted with 256-bit SSL prior to customs portal transmission.</span>
          </div>
        </div>

      </div>

      {/* Certificate Modal */}
      <SampleCertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceTitle={service.title}
        timeline={service.clearanceTimeline}
        documents={service.clearanceDocuments}
      />

    </div>
  );
};
