import React from 'react';
import { X, CheckCircle2, ShieldCheck, Printer, Download, FileText, QrCode, Building2 } from 'lucide-react';

export const SampleCertificateModal = ({ isOpen, onClose, serviceTitle, timeline, documents }) => {
  if (!isOpen) return null;

  const certificateNo = `SG-CL-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <span className="font-extrabold text-sm tracking-wide">Sample Customs Clearance Certificate</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Paper Content (Printable Area) */}
        <div id="printable-certificate" className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-orange-50/30 via-white to-slate-50/50">
          
          {/* Header & Watermark Badge */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-orange-500/30 pb-4 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-extrabold text-xs">
                  JL
                </div>
                <span className="text-lg font-black text-slate-900 tracking-wider">JOSAN LOGISTICS</span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">
                International Customs & Trade Compliance Division
              </p>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full flex items-center space-x-1.5 text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>STATUS: READY TO BOOK</span>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center py-2 space-y-1">
            <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest bg-orange-100 px-3 py-0.5 rounded-full">
              Official Verification Document
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
              Pre-Clearance Approval Certificate
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Certificate Ref: <span className="font-mono font-bold text-slate-900">{certificateNo}</span> | Issued: {currentDate}
            </p>
          </div>

          {/* Service Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Category</span>
              <span className="font-extrabold text-slate-800 text-sm">{serviceTitle}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Clearance Window</span>
              <span className="font-extrabold text-orange-600 text-sm">{timeline}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customs Jurisdiction</span>
              <span className="font-bold text-slate-700">Singapore & ASEAN Regional Hubs</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pre-Filing Compliance</span>
              <span className="font-bold text-emerald-700 flex items-center space-x-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Verified Fast-Track Protocol</span>
              </span>
            </div>
          </div>

          {/* Checklist of Verified Documents */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-orange-500" />
              <span>Validated Document Manifest</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {documents && documents.map((doc, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stamp & Barcode Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-200 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border-2 border-orange-500/40 flex flex-col items-center justify-center text-orange-600">
                <QrCode className="w-7 h-7" />
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                <p className="font-bold text-slate-700">SCAN TO VERIFY AUTHENTICITY</p>
                <p>AUTH-HASH: 88f9a2b1c4e5</p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="inline-block border-2 border-dashed border-orange-400 p-2 rounded-xl bg-orange-50/50">
                <p className="text-[10px] font-black text-orange-700 uppercase tracking-wider">
                  Josan Customs Seal & Approved
                </p>
                <p className="text-[9px] text-slate-500 font-bold">Authorized Brokerage Division</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Action Buttons */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Close Preview
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 font-bold text-xs rounded-xl transition-all inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-orange-sm transition-all inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
