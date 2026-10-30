import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Truck, 
  PackageCheck, 
  ExternalLink, 
  FileCheck, 
  HelpCircle, 
  AlertCircle, 
  Sparkles, 
  Building, 
  DollarSign, 
  Search, 
  Scale, 
  BadgeCheck, 
  Send, 
  Layers, 
  ArrowUpRight,
  CreditCard,
  QrCode,
  Plane,
  Shield,
  Phone
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import docsHeroImg from '../assets/shipment_documentation_desk.jpg';

export const ShipmentDocumentationPage = ({ setActiveTab }) => {
  const { currentUser, setIsAuthModalOpen, setAuthRedirectTab, showToast } = useLogistics();
  // Cargo Mode Tabs State - Airway Services as Primary Default
  const [activeMode, setActiveMode] = useState('air');

  // 6 Documentation Support Services (What We Help With)
  const servicesList = [
    {
      id: 1,
      title: 'Commercial Invoice',
      desc: 'Help organise seller details, goods descriptions and values.',
      icon: FileText
    },
    {
      id: 2,
      title: 'Packing List',
      desc: 'Help organise weights, packages and dimensions.',
      icon: Layers
    },
    {
      id: 3,
      title: 'Air Waybill (AWB)',
      desc: 'Help prepare AWB details and billing records.',
      icon: Plane
    },
    {
      id: 4,
      title: 'Certificate of Origin',
      desc: 'Help organise origin documents supplied by the customer.',
      icon: Scale
    },
    {
      id: 5,
      title: 'Road Consignment Note',
      desc: 'Help organise road delivery documents for partner transport.',
      icon: Truck
    },
    {
      id: 6,
      title: 'Delivery Records',
      desc: 'Keep the handover and delivery records for the shipment.',
      icon: PackageCheck
    }
  ];

  // Cargo Modes & Documents Required (Air Freight Services & Commercial Road Transportation)
  const cargoModes = {
    air: {
      id: 'air',
      name: 'Air Freight Services',
      subtitle: 'Documents commonly needed for air freight shipments.',
      icon: Plane,
      color: 'from-blue-600 to-indigo-700',
      documents: [
        { name: 'Commercial Invoice', desc: 'Details of the seller, buyer, itemized goods and declared values.' },
        { name: 'Packing List', desc: 'Itemized package breakdown, piece counts, weights and dimensions.' },
        { name: 'Air Waybill (AWB)', desc: 'Air consignment details, flight routing reference and airline billing records.' },
        { name: 'Certificate of Origin', desc: 'Document confirming where the goods were manufactured, supplied by the customer.' },
        { name: 'Customs-Related Documents (preparation support only)', desc: 'We help organise customs-related paperwork supplied by the customer. We do not provide customs clearance.' },
        { name: 'Insurance Certificate (provided by the customer or insurer)', desc: 'Insurance document provided by the customer or their insurer, if cover is required.' }
      ]
    },
    road: {
      id: 'road',
      name: 'Commercial Road Transportation',
      subtitle: 'Documents commonly needed for road shipments.',
      icon: Truck,
      color: 'from-amber-500 to-orange-600',
      documents: [
        { name: 'Commercial Invoice', desc: 'Details of the commercial transaction, buyer, seller and invoice value.' },
        { name: 'Packing List', desc: 'Package counts, cargo weights and cargo dimensions.' },
        { name: 'Road Consignment Note (LR)', desc: 'Consignment transit receipt and dispatch acknowledgment for partner transport.' },
        { name: 'Delivery Record', desc: 'Delivery confirmation record for the shipment.' }
      ]
    }
  };

  // 5-Step Documentation Support Process (How It Works)
  const workflowSteps = [
    {
      number: '01',
      title: 'Share Your Details',
      desc: 'Send us your shipment information and documents.',
      icon: Send
    },
    {
      number: '02',
      title: 'Review Documents',
      desc: 'We review your documents for missing or inconsistent details.',
      icon: CheckCircle2
    },
    {
      number: '03',
      title: 'Prepare AWB',
      desc: 'We prepare the Air Waybill details.',
      icon: Plane
    },
    {
      number: '04',
      title: 'Documentation Billing',
      desc: 'We coordinate billing for the Air Waybill and documentation charges.',
      icon: CreditCard
    },
    {
      number: '05',
      title: 'Handover',
      desc: 'We release the prepared documents to you.',
      icon: FileCheck
    }
  ];

  return (
    <div className="space-y-16 pb-24 animate-fade-in bg-slate-50/50">

      {/* Hero Section */}
      <section className="bg-[#0B1F3A] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#1E3A5F] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans tracking-tight text-white leading-tight">
                Shipment Documentation Support
              </h1>

              <p className="text-slate-100 font-normal text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                We help businesses prepare and organise shipment documents, including Air Waybill details, commercial invoices, packing lists and billing documents. We provide documentation support only and do not provide customs clearance.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!currentUser) {
                      if (setAuthRedirectTab) setAuthRedirectTab('quote');
                      setIsAuthModalOpen(true);
                      if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
                      return;
                    }
                    if (setActiveTab) setActiveTab('quote');
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-[#FF6B00] hover:bg-[#E05D00] text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>Get a Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('cargo-modes');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all cursor-pointer backdrop-blur-xs active:scale-95"
                >
                  View Required Documents
                </button>
              </div>
            </div>

            {/* Right Column: Visual Card */}
            <div className="lg:col-span-5 flex items-stretch">
              <div className="relative w-full rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl group bg-slate-950">
                <img
                  src={docsHeroImg}
                  alt="Shipment documentation and commercial records review"
                  className="w-full h-80 sm:h-96 lg:h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What We Help With (6 Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            What We Help With
          </h2>
          <p className="text-slate-700 font-medium text-sm sm:text-base leading-relaxed">
            We help prepare and organise your shipment documents. We do not file customs declarations or provide customs clearance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {servicesList.map((svc) => {
            const Icon = svc.icon;
            return (
              <div 
                key={svc.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-orange-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex flex-col cursor-default"
              >
                <div className="w-11 h-11 rounded-xl bg-orange-50/80 border border-orange-100/60 text-orange-600 group-hover:bg-[#FF6B00] group-hover:text-white group-hover:border-[#FF6B00] transition-all duration-300 flex items-center justify-center shrink-0 mb-4 shadow-2xs">
                  <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors mb-1.5">
                  {svc.title}
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed">
                  {svc.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cargo Modes & Documents Required (Clean Tabbed Layout) */}
      <section id="cargo-modes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 text-white">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Shipment Documents by Transport Mode
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Select your service to see the documents commonly needed for commercial cargo movement.
              </p>
            </div>
          </div>

          {/* Mode Selector Tabs (Air Freight & Road) */}
          <div className="bg-slate-100/80 p-2 sm:p-3 border-b border-slate-200 flex flex-wrap gap-2">
            {Object.values(cargoModes).map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{mode.name}</span>
                </button>
              );
            })}
          </div>

          {/* Mode Content Panel */}
          {(() => {
            const currentMode = cargoModes[activeMode] || cargoModes.air;
            const ModeIcon = currentMode.icon;
            return (
              <div className="p-6 sm:p-10 space-y-8 animate-fade-in">
                
                {/* Active Mode Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-extrabold shrink-0">
                      <ModeIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                        <span>{currentMode.name}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                        {currentMode.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Document Items Grid */}
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-800 mb-4">
                    Commonly Needed Documents
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentMode.documents.map((doc, idx) => {
                      const docName = typeof doc === 'string' ? doc : doc.name;
                      const docDesc = typeof doc === 'string' ? 'Standard documentation' : doc.desc;
                      return (
                        <div 
                          key={idx}
                          className="bg-white hover:bg-orange-50/30 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 hover:border-orange-400 hover:shadow-xs transition-all duration-200 flex items-start space-x-3.5 group cursor-default"
                        >
                          <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-snug group-hover:text-orange-600 transition-colors">
                              {docName}
                            </span>
                            <span className="text-[11px] text-slate-500 font-normal leading-relaxed block mt-0.5">
                              {docDesc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Documentation Notice */}
                <div className="p-4 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-amber-950">Documentation Notice</p>
                    <p className="text-amber-800/90 mt-0.5 leading-relaxed font-medium">
                      Required documents vary by shipment, cargo, origin and destination. Contact our team for help with specific requirements.
                    </p>
                  </div>
                </div>

                {/* Mode Footer Helper */}
                <div className="p-4 bg-orange-50/50 border border-orange-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <FileText className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="font-medium">Need documentation support for your shipment?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentUser) {
                        if (setAuthRedirectTab) setAuthRedirectTab('quote');
                        setIsAuthModalOpen(true);
                        if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
                        return;
                      }
                      if (setActiveTab) setActiveTab('quote');
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    }}
                    className="font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center space-x-1 cursor-pointer shrink-0"
                  >
                    <span>Get a Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })()}

        </div>
      </section>

      {/* How It Works (5 Steps in a Single Row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            How It Works
          </h2>
          <p className="text-slate-700 font-medium text-sm sm:text-base leading-relaxed">
            We help you prepare and organise your shipment documents.
          </p>
        </div>

        {/* 5-Step Single Row Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-orange-500 hover:shadow-md transition-all duration-300 group flex flex-col justify-between cursor-default"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-mono text-orange-600 tracking-wider">
                      Step {step.number}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-[#FF6B00] group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow-2xs">
                      <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute right-0 top-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl space-y-5 relative z-10 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Need help with your shipment documents?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Tell us about your shipment and our team will get back to you.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    if (setAuthRedirectTab) setAuthRedirectTab('quote');
                    setIsAuthModalOpen(true);
                    if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
                    return;
                  }
                  if (setActiveTab) setActiveTab('quote');
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-[#FF6B00] hover:bg-[#E05D00] text-white font-extrabold text-sm rounded-xl transition-all shadow-lg hover:shadow-orange-500/25 flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                <span>Get a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:+6567890123"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all cursor-pointer flex items-center space-x-2 active:scale-95"
                title="Call Josan Logistics (+65 6789 0123)"
              >
                <Phone className="w-4 h-4 text-orange-400" />
                <span>Call Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mandatory Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-start space-x-3 text-xs text-slate-600 leading-relaxed">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            Document requirements vary by commodity, origin, destination and applicable regulations. This page gives general guidance and is not an exhaustive checklist. We provide documentation support only and do not provide customs clearance.
          </p>
        </div>
      </section>

    </div>
  );
};
export default ShipmentDocumentationPage;
