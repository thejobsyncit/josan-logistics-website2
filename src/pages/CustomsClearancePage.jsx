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
  Shield
} from 'lucide-react';
import customsHeroImg from '../assets/customs_clearance_inspection.jpg';

export const CustomsClearancePage = ({ setActiveTab }) => {
  // Cargo Mode Tabs State - Airway Services as Primary Default
  const [activeMode, setActiveMode] = useState('air');

  // 10 Key Documentation Support Services
  const servicesList = [
    {
      id: 1,
      title: 'Commercial Invoices',
      desc: 'Preparation & valuation verification',
      icon: FileText
    },
    {
      id: 2,
      title: 'Packing Lists',
      desc: 'Package itemization, weights & volume',
      icon: Layers
    },
    {
      id: 3,
      title: 'Air Waybill (AWB)',
      desc: 'AWB details, routing & billing support',
      icon: Plane
    },
    {
      id: 4,
      title: 'Bills of Entry Support',
      desc: 'Entry document preparation & review',
      icon: FileCheck
    },
    {
      id: 5,
      title: 'Valuation & Details',
      desc: 'Accurate tariff & description alignment',
      icon: DollarSign
    },
    {
      id: 6,
      title: 'Inspection Documentation',
      desc: 'Coordination of inspection paperwork',
      icon: Search
    },
    {
      id: 7,
      title: 'Certificates of Origin',
      desc: 'Origin verification & trade documents',
      icon: Scale
    },
    {
      id: 8,
      title: 'Permits & Approvals',
      desc: 'Preparation for required agency filings',
      icon: BadgeCheck
    },
    {
      id: 9,
      title: 'Paperwork Assistance',
      desc: 'Resolution of consignment documentation',
      icon: HelpCircle
    },
    {
      id: 10,
      title: 'Handover & Records',
      desc: 'Delivery receipts & transit records',
      icon: Truck
    }
  ];

  // Cargo Modes & Documents Required (Airway Services & Commercial Road Transportation)
  const cargoModes = {
    air: {
      id: 'air',
      name: 'Airway Services',
      subtitle: 'Air Waybill (AWB) Preparation, Billing & Air Shipment Documentation Support',
      icon: Plane,
      badge: 'Airway Documentation',
      color: 'from-blue-600 to-indigo-700',
      documents: [
        { name: 'Commercial Invoice', desc: 'Itemized transaction values, goods descriptions & entity details' },
        { name: 'Packing List', desc: 'Gross/net weights, dimensions, package counts & cargo marks' },
        { name: 'Air Waybill (AWB)', desc: 'Prepared AWB details, flight routing & consignment records' },
        { name: 'Certificate of Origin', desc: 'Origin verification documentation for duty preference' },
        { name: 'Customs-Related Documentation', desc: 'Organized paperwork for applicable entry & clearance processes' },
        { name: 'Insurance Documentation', desc: 'Shipment value declaration & insurance paperwork when required' }
      ]
    },
    road: {
      id: 'road',
      name: 'Commercial Road Transportation',
      subtitle: 'Transportation Paperwork & Consignment Documentation for Partner Vehicles',
      icon: Truck,
      badge: 'Road Transportation',
      color: 'from-amber-500 to-orange-600',
      documents: [
        { name: 'Commercial Invoice', desc: 'Commercial transaction value & invoice verification' },
        { name: 'Packing List', desc: 'Weight, volume & itemized package details' },
        { name: 'Road Consignment Note (LR)', desc: 'Consignment transit receipt & dispatch acknowledgment' },
        { name: 'Cargo Manifest', desc: 'Consignment inventory & destination routing details' },
        { name: 'Transit Documentation', desc: 'Organized paperwork for highway transit checkpoints' },
        { name: 'Delivery Handover Record', desc: 'Verified receipt & proof of commercial delivery' }
      ]
    }
  };

  // 9-Step Documentation Support Workflow
  const workflowSteps = [
    {
      number: '01',
      title: 'Document Collection',
      desc: 'Invoices, packing lists & consignment details intake',
      icon: FileText
    },
    {
      number: '02',
      title: 'Document Verification',
      desc: 'Itemized descriptions, valuation & code alignment',
      icon: CheckCircle2
    },
    {
      number: '03',
      title: 'AWB & Consignment Drafting',
      desc: 'Air Waybill details and transport notes preparation',
      icon: Send
    },
    {
      number: '04',
      title: 'Customs Papers Review',
      desc: 'Review of applicable customs paperwork and permits',
      icon: DollarSign
    },
    {
      number: '05',
      title: 'Inspection Readiness',
      desc: 'Preparation of cargo specs for inspection bays',
      icon: Search
    },
    {
      number: '06',
      title: 'Client Verification',
      desc: 'Consignor review and technical verification',
      icon: ShieldCheck
    },
    {
      number: '07',
      title: 'Billing & Charges',
      desc: 'AWB billing and transportation documentation charges',
      icon: CreditCard
    },
    {
      number: '08',
      title: 'Paperwork Handover',
      desc: 'Release of prepared documents to carrier/shipper',
      icon: FileCheck
    },
    {
      number: '09',
      title: 'Delivery & Proof of Receipt',
      desc: 'Archiving consignment handover and delivery record',
      icon: Truck
    }
  ];

  // Key International Shipment & Customs Documents
  const docDetails = [
    {
      id: 'invoice',
      name: 'Commercial Invoice',
      tag: 'Financial Document',
      desc: 'Itemized product pricing, goods descriptions, declared values & trade terms',
      icon: FileText
    },
    {
      id: 'packing',
      name: 'Packing List',
      tag: 'Cargo Specification',
      desc: 'Package breakdown, net/gross weights, carton dimensions & package marks',
      icon: Layers
    },
    {
      id: 'awb',
      name: 'Air Waybill (AWB)',
      tag: 'Air Carriage Document',
      desc: 'Prepared AWB details, flight routing reference & consignment documentation',
      icon: Plane
    },
    {
      id: 'coo',
      name: 'Certificate of Origin',
      tag: 'Origin Verification',
      desc: 'Documentation for preferential tariff compliance and origin requirements',
      icon: ShieldCheck
    },
    {
      id: 'declaration',
      name: 'Customs Documentation',
      tag: 'Regulatory Paperwork',
      desc: 'Preparation of required paperwork for applicable customs entry processes',
      icon: Send
    },
    {
      id: 'insurance',
      name: 'Insurance Documentation',
      tag: 'Risk Protection',
      desc: 'Organized shipment documentation evidencing cargo value and protection policy',
      icon: Shield
    },
    {
      id: 'cmr',
      name: 'Road Consignment Note (LR)',
      tag: 'Road Transport Record',
      desc: 'Transporter acknowledgment, consignment registration & overland transit details',
      icon: Truck
    },
    {
      id: 'permits',
      name: 'Regulatory Permits & NOCs',
      tag: 'Agency Requirements',
      desc: 'Support with organizing permits required for specific commercial commodities',
      icon: BadgeCheck
    }
  ];

  return (
    <div className="space-y-16 pb-24 animate-fade-in bg-slate-50/50">

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Glow & Geometric Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-slate-800/90 border border-slate-700 px-3.5 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 font-bold uppercase text-xs tracking-wider">
                  Shipment &amp; Customs Documentation Support
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans tracking-tight text-white leading-tight">
                  Customs &amp; Shipment Documentation Support
                </h1>
                <p className="text-lg sm:text-xl font-bold text-orange-400">
                  Air Waybill (AWB) Preparation &amp; Commercial Cargo Documentation Support
                </p>
              </div>

              <p className="text-slate-300 font-medium text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                We support businesses with the preparation and organization of shipment and customs-related documentation required for commercial cargo movement. Our services focus on Air Waybill (AWB) preparation, billing, shipment paperwork and documentation coordination for commercial goods.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab && setActiveTab('book')}
                  className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg hover:shadow-orange-500/25 flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>Request Documentation Support</span>
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

              {/* Factual Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-left">
                <div>
                  <span className="block text-base sm:text-lg font-black text-white">AWB Support</span>
                  <span className="text-xs text-slate-400 font-medium">Preparation &amp; Billing</span>
                </div>
                <div>
                  <span className="block text-base sm:text-lg font-black text-orange-400">Commercial Cargo</span>
                  <span className="text-xs text-slate-400 font-medium">Invoices &amp; Packing Lists</span>
                </div>
                <div>
                  <span className="block text-base sm:text-lg font-black text-white">Customs Support</span>
                  <span className="text-xs text-slate-400 font-medium">Process Documentation</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Card */}
            <div className="lg:col-span-5 flex items-stretch">
              <div className="relative w-full rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl group bg-slate-950">
                <img
                  src={customsHeroImg}
                  alt="Customs and freight documentation review"
                  className="w-full h-80 sm:h-96 lg:h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section (10 Key Services) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-10">
          <span className="text-orange-600 font-bold uppercase text-xs tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200 inline-block">
            Comprehensive Scope
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Shipment &amp; Customs Documentation Services
          </h2>
          <p className="text-slate-700 font-semibold text-sm sm:text-base leading-relaxed">
            Organized documentation support to ensure your commercial goods are prepared for transportation and applicable customs processes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {servicesList.map((svc) => {
            const Icon = svc.icon;
            return (
              <div 
                key={svc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-orange-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex flex-col cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50/80 border border-orange-100/60 text-orange-600 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all duration-300 flex items-center justify-center shrink-0 mb-3.5 shadow-2xs">
                  <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors mb-1.5">
                  {svc.title}
                </h3>

                <p className="text-xs text-slate-500 font-normal leading-relaxed">
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
              <span className="text-orange-400 font-bold uppercase text-xs tracking-wider">
                Document Checklist By Service
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Shipment Documents by Transport Mode
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Select your service (Airway Services or Commercial Road Transportation) to review required documentation for commercial cargo movement.
              </p>
            </div>

            <span className="px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 shrink-0">
              Airway &amp; Road Documentation
            </span>
          </div>

          {/* Mode Selector Tabs (Airway & Road) */}
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
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        {currentMode.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                    {currentMode.badge}
                  </span>
                </div>

                {/* Document Items Grid */}
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">
                    Required Documents Checklist
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

                {/* Statutory Regulatory Variance Notice */}
                <div className="p-4 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-amber-950">Documentation Notice</p>
                    <p className="text-amber-800/90 mt-0.5 leading-relaxed font-medium">
                      Required trade documents and customs paperwork may vary by shipment, origin, destination, commodity classification, and governing trade regulations. Contact our team for assistance with specific documentation requirements.
                    </p>
                  </div>
                </div>

                {/* Mode Footer Helper */}
                <div className="p-4 bg-orange-50/50 border border-orange-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="font-medium">Need documentation support for your {currentMode.name} consignment?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab && setActiveTab('book')}
                    className="font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center space-x-1 cursor-pointer shrink-0"
                  >
                    <span>Request Documentation Support</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })()}

        </div>
      </section>

      {/* Documentation Support Workflow (9 Step-by-Step Modern Process) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
          <span className="text-orange-600 font-bold uppercase text-xs tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200 inline-block">
            Step-by-Step Support
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Documentation Support Workflow
          </h2>
          <p className="text-slate-700 font-semibold text-sm sm:text-base leading-relaxed">
            Our structured documentation pipeline ensures accurate preparation, verification, and organization from intake to final handover.
          </p>
        </div>

        {/* 9-Step Simple Modern Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300 group flex items-start space-x-4 cursor-pointer"
              >
                {/* Visual Step & Icon Badge */}
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Card Content */}
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black font-mono text-orange-600 uppercase tracking-wider">
                      Step {step.number}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-orange-500 transition-colors"></span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors truncate">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Shipment & Transit Documents Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="space-y-1 pb-6 border-b border-slate-100 text-center sm:text-left">
            <span className="text-orange-600 font-bold uppercase text-xs tracking-wider">
              Document Checklist
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Key Shipment &amp; Customs Documents
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Essential paperwork required for commercial goods movement and applicable customs processes.
            </p>
          </div>

          {/* Simple Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {docDetails.map((doc) => {
              const Icon = doc.icon;
              return (
                <div 
                  key={doc.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow-2xs">
                        <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-orange-50 group-hover:text-orange-700 transition-colors">
                        {doc.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors">
                      {doc.name}
                    </h3>

                    <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-relaxed">
                      {doc.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute right-0 top-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl space-y-5 relative z-10 text-center sm:text-left">
            <span className="text-orange-400 font-bold uppercase text-xs tracking-widest inline-block bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              Get Started In Minutes
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Need Help With Shipment Documentation?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Submit your shipment details and our team will guide you through the required Air Waybill, commercial documents, and customs-related paperwork.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab('book')}
                className="px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg hover:shadow-orange-500/25 flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                <span>Request Documentation Support</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab('contact')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                <span>Speak with an Advisor</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mandatory Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-start space-x-3 text-xs text-slate-500 leading-relaxed">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            Document requirements may vary depending on the commodity, origin, destination, shipment value, and applicable regulations. Josan Logistics provides documentation support to assist businesses with required paperwork. The above list provides general guidance and is not an exhaustive checklist.
          </p>
        </div>
      </section>

    </div>
  );
};
