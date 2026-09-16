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
  QrCode
} from 'lucide-react';
import customsHeroImg from '../assets/customs_clearance_inspection.jpg';

export const CustomsClearancePage = ({ setActiveTab }) => {
  // Roadways Cargo Mode Tabs State
  const [activeMode, setActiveMode] = useState('road');

  // 10 Key Customs Clearance Services (Roadways & Land Border Logistics)
  const servicesList = [
    {
      id: 1,
      title: 'Import Clearance',
      desc: 'Declarations, bonds & checkpoint entry',
      icon: ArrowRight
    },
    {
      id: 2,
      title: 'Export Clearance',
      desc: 'Export filings & highway border exit',
      icon: Send
    },
    {
      id: 3,
      title: 'Documentation',
      desc: 'Invoices, packing lists & CMR/LR notes',
      icon: FileText
    },
    {
      id: 4,
      title: 'Bills of Entry',
      desc: 'Customs filings & validation tracking',
      icon: FileCheck
    },
    {
      id: 5,
      title: 'Duty & Taxes',
      desc: 'Tariff valuation & highway levies',
      icon: DollarSign
    },
    {
      id: 6,
      title: 'Cargo Inspection',
      desc: 'Scanning & inspection bay liaison',
      icon: Search
    },
    {
      id: 7,
      title: 'Compliance',
      desc: 'Transit treaties & compliance audits',
      icon: Scale
    },
    {
      id: 8,
      title: 'Permits & NOCs',
      desc: 'Agency approvals & special permits',
      icon: BadgeCheck
    },
    {
      id: 9,
      title: 'Query Resolution',
      desc: 'Fast resolution for checkpoint holds',
      icon: HelpCircle
    },
    {
      id: 10,
      title: 'Clearance & Release',
      desc: 'Out-of-charge receipt & dispatch',
      icon: Truck
    }
  ];

  // Cargo Modes & Documents Required (Roadways Freight Modes)
  const cargoModes = {
    road: {
      id: 'road',
      name: 'Roadways Cargo',
      subtitle: 'Overland Highway Freight & Intercity Transit Clearances',
      icon: Truck,
      badge: 'Standard Roadways',
      color: 'from-amber-500 to-orange-600',
      documents: [
        { name: 'Commercial Invoice', desc: 'Transaction value & seller verification' },
        { name: 'Packing List', desc: 'Weight, volume & package itemization' },
        { name: 'Road Consignment Note (CMR / LR)', desc: 'Consignment transit receipt & proof' },
        { name: 'E-Way Bill & Transit Pass', desc: 'Mandatory highway movement clearance' },
        { name: 'Vehicle & Driver Manifest', desc: 'Commercial registration & trip schedule' },
        { name: 'Transit Cargo Insurance', desc: 'In-transit loss & damage protection' },
        { name: 'Customs Declaration', desc: 'Checkpoint border entry documentation' },
        { name: 'Tax & Checkpoint Slip', desc: 'State tax payment & toll verification' }
      ]
    },
    ftl: {
      id: 'ftl',
      name: 'Full Truckload (FTL)',
      subtitle: 'Dedicated Highway Heavy Trailer & Full Manifest Clearance',
      icon: Truck,
      badge: 'Dedicated Haulage',
      color: 'from-orange-500 to-amber-600',
      documents: [
        { name: 'Commercial Tax Invoice', desc: 'Tax reconciliation & load valuation' },
        { name: 'Detailed Packing List', desc: 'Full-truck pallet breakdown & weights' },
        { name: 'Dedicated FTL Lorry Receipt', desc: 'Full vehicle consignment acknowledgment' },
        { name: 'Consolidated E-Way Bill', desc: 'Full truck highway electronic pass' },
        { name: 'Vehicle Fitness & Highway Permit', desc: 'National highway transport approval' },
        { name: 'Driver License & Trip Manifest', desc: 'Commercial license & route sheet' },
        { name: 'Transit Goods Insurance', desc: 'Full trailer cargo liability coverage' },
        { name: 'Weighbridge Weight Slip', desc: 'Official gross weight certification' }
      ]
    },
    ltl: {
      id: 'ltl',
      name: 'Part Truckload (LTL)',
      subtitle: 'Consolidated Road Groupage & Multi-Drop Checkpoint Clearance',
      icon: Layers,
      badge: 'Shared Groupage',
      color: 'from-blue-600 to-indigo-700',
      documents: [
        { name: 'Consignment Invoices', desc: 'Individual shipment value breakdown' },
        { name: 'Consolidated Cargo Manifest', desc: 'Combined multi-drop cargo list' },
        { name: 'Individual LTL Receipts (LR)', desc: 'Consignee docket receipts' },
        { name: 'Multi-Consignee E-Way Bills', desc: 'Digital passes for all drop-offs' },
        { name: 'Hub Transshipment Log', desc: 'Cross-dock handling & transfer record' },
        { name: 'Goods In-Transit Insurance', desc: 'Consolidated freight coverage' },
        { name: 'Security Inspection Sign-Off', desc: 'Hub security seal verification' },
        { name: 'Final-Mile Gate Pass', desc: 'Last-mile dispatch & delivery sheet' }
      ]
    },
    crossborder: {
      id: 'crossborder',
      name: 'Cross-Border Trucking',
      subtitle: 'International Land Border Checkpoints & Highway Port Entry',
      icon: ShieldCheck,
      badge: 'Border Customs',
      color: 'from-emerald-600 to-teal-700',
      documents: [
        { name: 'Commercial Invoice', desc: 'International trade valuation & tariff codes' },
        { name: 'Certified Export Packing List', desc: 'Itemized export manifest' },
        { name: 'International CMR Note', desc: 'Cross-border transport contract' },
        { name: 'Bill of Entry / Shipping Bill', desc: 'Official land customs filing' },
        { name: 'Certificate of Origin', desc: 'Chamber certified duty preferences' },
        { name: 'Customs Transit Bond', desc: 'Cross-border duty guarantee bond' },
        { name: 'Carnet TIR & Vehicle Card', desc: 'International road transit permit' },
        { name: 'Border Station Gate Pass', desc: 'Land customs station release pass' }
      ]
    },
    express: {
      id: 'express',
      name: 'Express Road Courier & Vans',
      subtitle: 'Sprinter Vans, Time-Critical Deliveries & Direct Roadway Express',
      icon: PackageCheck,
      badge: 'Priority Road Transit',
      color: 'from-rose-500 to-pink-600',
      documents: [
        { name: 'Commercial Invoice', desc: 'Express consignment valuation' },
        { name: 'Express Road Waybill', desc: 'Priority transit docket & airway bill' },
        { name: 'Simplified E-Way Bill', desc: 'Fast-track digital clearance pass' },
        { name: 'Driver Dispatch Log', desc: 'Time-stamped handover record' },
        { name: 'Consignor & Consignee KYC', desc: 'Verified shipper & receiver identity' },
        { name: 'Highway Fast-Track Tag', desc: 'Express automated toll lane access' },
        { name: 'Express Cargo Insurance', desc: 'Time-definite loss & damage policy' },
        { name: 'Essential Goods NOC', desc: 'Priority movement certification' }
      ]
    }
  };

  // 9-Step Customs Clearance Workflow (Roadways Freight Pipeline)
  const workflowSteps = [
    {
      number: '01',
      title: 'Document Collection',
      desc: 'Invoices, packing lists & CMR consignment notes',
      icon: FileText
    },
    {
      number: '02',
      title: 'Document Verification',
      desc: 'HS code classification & road transport tariff audit',
      icon: CheckCircle2
    },
    {
      number: '03',
      title: 'Customs Declaration',
      desc: 'Electronic Bill of Entry & land portal filing',
      icon: Send
    },
    {
      number: '04',
      title: 'Duty & Tax Assessment',
      desc: 'Customs appraisal & transit tax assessment',
      icon: DollarSign
    },
    {
      number: '05',
      title: 'Customs Examination',
      desc: 'Drive-through scanner & truck bay inspection',
      icon: Search
    },
    {
      number: '06',
      title: 'Appraiser Sign-Off',
      desc: 'Officer sign-off & technical query resolution',
      icon: ShieldCheck
    },
    {
      number: '07',
      title: 'Duty Payment',
      desc: 'Corporate deferred credit or treasury transfer',
      icon: CreditCard
    },
    {
      number: '08',
      title: 'Border Cargo Release',
      desc: 'Out-of-Charge order & land depot gate pass',
      icon: FileCheck
    },
    {
      number: '09',
      title: 'Final Highway Delivery',
      desc: 'Direct overland haulage to consignee doorstep',
      icon: Truck
    }
  ];

  // Key Roadways Customs & Transit Documents
  const docDetails = [
    {
      id: 'invoice',
      name: 'Commercial Invoice',
      tag: 'Financial Document',
      desc: 'Itemized product pricing, HS codes, declared values & trade Incoterms',
      icon: FileText
    },
    {
      id: 'packing',
      name: 'Packing List',
      tag: 'Cargo Specification',
      desc: 'Package breakdown, net/gross weights, crate dimensions & truck seals',
      icon: Layers
    },
    {
      id: 'cmr',
      name: 'Road Consignment Note (CMR / LR)',
      tag: 'Carriage Contract',
      desc: 'Official transporter credentials, truck registration & highway delivery route',
      icon: Truck
    },
    {
      id: 'eway',
      name: 'E-Way Bill & Border Pass',
      tag: 'Transit Authority',
      desc: 'Digital QR-verified electronic transit document for checkpoint clearance',
      icon: QrCode
    },
    {
      id: 'boe',
      name: 'Bill of Entry (BOE)',
      tag: 'Import Declaration',
      desc: 'Official electronic import lodgement for land customs stations (LCS)',
      icon: FileCheck
    },
    {
      id: 'shippingBill',
      name: 'Shipping Bill (Overland Export)',
      tag: 'Export Declaration',
      desc: 'Overland export entry verification and tax drawback registration',
      icon: Send
    },
    {
      id: 'coo',
      name: 'Certificate of Origin (COO)',
      tag: 'Origin Verification',
      desc: 'Chamber certified origin proof for preferential road tariff exemptions',
      icon: ShieldCheck
    },
    {
      id: 'permits',
      name: 'Road Permits & Regulatory NOCs',
      tag: 'Statutory Clearance',
      desc: 'Heavy vehicle route permits, hazardous ADR & phytosanitary certificates',
      icon: BadgeCheck
    }
  ];

  return (
    <div className="space-y-16 pb-24 animate-fade-in bg-slate-50/50">

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Glow & Geometric Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-slate-800/90 border border-slate-700 px-3.5 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span className="text-orange-300 font-bold uppercase text-xs tracking-wider">
                  Customs & Trade Compliance
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans tracking-tight text-white leading-tight">
                  Roadways Customs Clearance
                </h1>
                <p className="text-lg sm:text-xl font-bold text-orange-400">
                  Smooth Overland Customs & Border Clearance, From Documentation to Highway Delivery
                </p>
              </div>

              <p className="text-slate-300 font-medium text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Simplify road freight customs clearance with documentation support, highway checkpoint declarations, tariff assessment, border inspection coordination, and seamless overland transit across state and international corridors.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab && setActiveTab('book')}
                  className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg hover:shadow-orange-500/25 flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>Request Customs Clearance</span>
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

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-left">
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-white">99.4%</span>
                  <span className="text-xs text-slate-400 font-medium">First-Time Pass Rate</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-orange-400">&lt; 24h</span>
                  <span className="text-xs text-slate-400 font-medium">Average Border Release</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-white">100%</span>
                  <span className="text-xs text-slate-400 font-medium">Regulatory Compliant</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Card */}
            <div className="lg:col-span-5 flex items-stretch">
              <div className="relative w-full rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl group bg-slate-950">
                <img
                  src={customsHeroImg}
                  alt="Customs officers and freight inspectors reviewing declarations"
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
            Our Roadways Customs Clearance Services
          </h2>
          <p className="text-slate-700 font-semibold text-sm sm:text-base leading-relaxed">
            Full-spectrum road freight customs brokerage to ensure seamless highway transit compliance without unexpected delays or border penalties.
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
                Document Checklist By Mode
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Documents Required by Roadways Mode
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Select your road freight transportation mode to review standard mandatory customs, transit permits, and highway documentation.
              </p>
            </div>

            <span className="px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 shrink-0">
              5 Roadways Modes
            </span>
          </div>

          {/* Mode Selector Tabs (5 Roadways Modes) */}
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
            const currentMode = cargoModes[activeMode] || cargoModes.road;
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
                    Mandatory & Regulatory Documents Checklist
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentMode.documents.map((doc, idx) => {
                      const docName = typeof doc === 'string' ? doc : doc.name;
                      const docDesc = typeof doc === 'string' ? 'Standard regulatory verification' : doc.desc;
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

                {/* Mode Footer Helper */}
                <div className="p-4 bg-orange-50/50 border border-orange-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="font-medium">Need immediate pre-assessment for your {currentMode.name} consignment?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab && setActiveTab('book')}
                    className="font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center space-x-1 cursor-pointer shrink-0"
                  >
                    <span>Upload Consignment for Clearance</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })()}

        </div>
      </section>

      {/* Customs Clearance Workflow (9 Step-by-Step Modern Process) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-12">
          <span className="text-orange-600 font-bold uppercase text-xs tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200 inline-block">
            Step-by-Step Transparency
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Customs Clearance Workflow
          </h2>
          <p className="text-slate-700 font-semibold text-sm sm:text-base leading-relaxed">
            Our structured 9-stage customs pipeline delivers predictability, rapid appraiser resolution, and transparent milestone tracking.
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

      {/* Key Customs & Transit Documents Section (Simple Cards Design) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="space-y-1 pb-6 border-b border-slate-100 text-center sm:text-left">
            <span className="text-orange-600 font-bold uppercase text-xs tracking-wider">
              Document Checklist
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Key Customs & Transit Documents
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Essential statutory paperwork required for compliant roadways freight and overland checkpoint crossings.
            </p>
          </div>

          {/* Simple Cards Grid (4x2 on desktop, 2x4 on tablet, 1x8 on mobile) */}
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
              Need Help With Customs Clearance?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Submit your shipment details and our team will guide you through the required documentation and clearance process.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab('book')}
                className="px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg hover:shadow-orange-500/25 flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                <span>Request Customs Clearance</span>
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
            Document requirements may vary depending on the commodity, country of origin/destination, shipment value, customs authority and applicable regulations. The above list provides general guidance and is not an exhaustive checklist.
          </p>
        </div>
      </section>

    </div>
  );
};
