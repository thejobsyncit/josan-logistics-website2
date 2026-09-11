import React, { useState } from 'react';
import { ExternalLink, Check, Clock, ShieldCheck, ChevronRight, ArrowLeft } from 'lucide-react';
import { SampleCertificateModal } from '../components/SampleCertificateModal';

export const ClearanceDocumentationPage = ({ setActiveTab }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const clearanceData = [
    {
      id: 'air-freight',
      serviceName: 'Air Freight',
      timeline: '24–48 hours',
      documents: [
        'Invoice Copy',
        'Packing List',
        'KYC / ID Proof',
        'Customs Declaration'
      ]
    },
    {
      id: 'ocean-freight',
      serviceName: 'Ocean Freight',
      timeline: '2–5 days',
      documents: [
        'Invoice Copy',
        'Packing List',
        'Bill of Lading',
        'Customs Declaration'
      ]
    },
    {
      id: 'land-transport',
      serviceName: 'Land Transport',
      timeline: '2–4 hours',
      documents: [
        'Invoice Copy',
        'E-Way Bill',
        'ID Proof'
      ]
    },
    {
      id: 'cold-pharma',
      serviceName: 'Cold Pharma Logistics',
      timeline: '12–24 hours (priority)',
      documents: [
        'Invoice Copy',
        'Packing List',
        'Pharma Compliance Certificate',
        'Temperature Declaration'
      ]
    }
  ];

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-orange-400 font-bold uppercase text-xs tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Customs & Trade Compliance
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-sans">
            Clearance & Documentation
          </h1>
          <p className="text-slate-200 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Timelines, required document checklists, and customs compliance per shipment mode.
          </p>
        </div>
      </section>

      {/* Main Documentation Card Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-card overflow-hidden">
          
          {/* Card Header Bar */}
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Clearance & Documentation
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Timelines, required document checklists, and customs compliance per shipment mode.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                Ready to Book
              </span>
            </div>
          </div>

          {/* Inner Content Area */}
          <div className="p-6 sm:p-8 bg-slate-50/40 space-y-6">
            
            {/* Top Controls: Status Badge + Certificate Link */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  CUSTOMS STATUS:
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  Ready to Book
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <span>View Sample Clearance Certificate</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grouped Service Sections Grid (2x2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clearanceData.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-base font-bold text-slate-900">
                      {item.serviceName}
                    </h4>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full inline-flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Timeline: {item.timeline}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      REQUIRED DOCUMENTS
                    </span>
                    <ul className="space-y-2">
                      {item.documents.map((doc, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Footer Note / Link */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
              <span className="font-medium text-slate-500">
                All clearance timelines are calculated upon verified receipt of mandatory documentation.
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>View Sample Clearance Certificate</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Certificate Modal */}
      <SampleCertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceTitle="Multimodal Cargo Customs Clearance"
        timeline="Standard & Priority Fast-Track"
        documents={[
          'Invoice Copy',
          'Packing List',
          'Customs Declaration',
          'KYC / ID Proof',
          'Pharma / Transit Certificate'
        ]}
      />

    </div>
  );
};
