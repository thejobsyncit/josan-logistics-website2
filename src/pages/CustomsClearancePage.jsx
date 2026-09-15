import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Plane, 
  Ship, 
  Truck, 
  Train, 
  PackageCheck, 
  ChevronDown, 
  ChevronUp, 
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
  ArrowUpRight
} from 'lucide-react';
import customsHeroImg from '../assets/customs_clearance_inspection.jpg';

export const CustomsClearancePage = ({ setActiveTab }) => {
  // Cargo Mode Tabs State
  const [activeMode, setActiveMode] = useState('air');

  // Expandable Document Details State (tracks which document card is expanded)
  const [expandedDocs, setExpandedDocs] = useState({
    invoice: true,
    packing: false,
    awb: false,
    bol: false,
    boe: false,
    shippingBill: false,
    coo: false,
    permits: false
  });

  const toggleDoc = (id) => {
    setExpandedDocs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAllDocs = () => {
    setExpandedDocs({
      invoice: true,
      packing: true,
      awb: true,
      bol: true,
      boe: true,
      shippingBill: true,
      coo: true,
      permits: true
    });
  };

  const collapseAllDocs = () => {
    setExpandedDocs({
      invoice: false,
      packing: false,
      awb: false,
      bol: false,
      boe: false,
      shippingBill: false,
      coo: false,
      permits: false
    });
  };

  // 10 Key Customs Clearance Services
  const servicesList = [
    {
      id: 1,
      title: 'Import Customs Clearance',
      desc: 'Complete electronic import declarations, classification, customs bond filing, and port gate clearance.',
      icon: ArrowRight,
      badge: 'Inbound'
    },
    {
      id: 2,
      title: 'Export Customs Clearance',
      desc: 'Outbound export document lodgement, EXS filing, origin certification, and customs border exit processing.',
      icon: Send,
      badge: 'Outbound'
    },
    {
      id: 3,
      title: 'Documentation & Declaration Support',
      desc: 'Expert preparation of commercial invoices, packing lists, transport bills, and electronic regulatory filings.',
      icon: FileText,
      badge: 'Compliance'
    },
    {
      id: 4,
      title: 'Bill of Entry / Shipping Bill Support',
      desc: 'Filing, tracking, amendment handling, and automated validation for formal customs legal entries.',
      icon: FileCheck,
      badge: 'Statutory'
    },
    {
      id: 5,
      title: 'Customs Duty & Tax Coordination',
      desc: 'Accurate HS code assessment, tariff calculations, duty deferment accounts, and VAT/GST reconciliation.',
      icon: DollarSign,
      badge: 'Fiscal'
    },
    {
      id: 6,
      title: 'Cargo Examination Coordination',
      desc: 'On-site liaison with customs inspectors, physical container destuffing, X-ray scanning, and non-intrusive checks.',
      icon: Search,
      badge: 'On-Site'
    },
    {
      id: 7,
      title: 'Regulatory & Compliance Support',
      desc: 'Guidance on trade sanctions, dual-use export controls, preferential trade agreements, and valuation audits.',
      icon: Scale,
      badge: 'Advisory'
    },
    {
      id: 8,
      title: 'Certificate & Permit Coordination',
      desc: 'Acquiring phytosanitary, veterinary, fumigation, BIS, FDA, and designated ministry non-objection certificates.',
      icon: BadgeCheck,
      badge: 'Permits'
    },
    {
      id: 9,
      title: 'Customs Query Resolution',
      desc: 'Prompt technical response and legal documentation representation to address customs holds or audit queries.',
      icon: HelpCircle,
      badge: 'Fast-Track'
    },
    {
      id: 10,
      title: 'Final Clearance & Cargo Release',
      desc: 'Official out-of-charge order receipt, delivery order generation, and direct handover for final-mile dispatch.',
      icon: CheckCircle2,
      badge: 'Delivery'
    }
  ];

  // Cargo Modes & Documents Required
  const cargoModes = {
    air: {
      id: 'air',
      name: 'Air Cargo',
      subtitle: 'Express International Air Waybill (AWB) Clearances',
      icon: Plane,
      badge: 'Fastest Transit: 12-24h',
      color: 'from-sky-500 to-blue-600',
      documents: [
        'Commercial Invoice',
        'Packing List',
        'Airway Bill (AWB)',
        'Bill of Entry / Shipping Bill',
        'Certificate of Origin',
        'Insurance Documents',
        'Required Permits / NOCs',
        'Product Certificates, where applicable'
      ]
    },
    sea: {
      id: 'sea',
      name: 'Sea Cargo',
      subtitle: 'Full Container (FCL) & Consolidated (LCL) Port Clearance',
      icon: Ship,
      badge: 'High Volume Freight',
      color: 'from-blue-600 to-indigo-700',
      documents: [
        'Commercial Invoice',
        'Packing List',
        'Bill of Lading (B/L)',
        'Bill of Entry / Shipping Bill',
        'Certificate of Origin',
        'Insurance Documents',
        'Required Permits / NOCs',
        'Container / Cargo Documents'
      ]
    },
    road: {
      id: 'road',
      name: 'Road Cargo',
      subtitle: 'Cross-Border Trucking & Overland Haulage Entry',
      icon: Truck,
      badge: 'Regional Intermodal',
      color: 'from-amber-500 to-orange-600',
      documents: [
        'Commercial Invoice',
        'Packing List',
        'Road Consignment / Transport Document',
        'Customs Declaration',
        'Certificate of Origin',
        'Insurance Documents',
        'Required Permits',
        'Transit Documents, where applicable'
      ]
    },
    rail: {
      id: 'rail',
      name: 'Rail Cargo',
      subtitle: 'Inland Container Depot (ICD) & Rail Corridors',
      icon: Train,
      badge: 'Heavy Intermodal',
      color: 'from-emerald-600 to-teal-700',
      documents: [
        'Commercial Invoice',
        'Packing List',
        'Rail Consignment Document',
        'Customs Declaration',
        'Certificate of Origin',
        'Insurance Documents',
        'Required Permits / NOCs',
        'Transit Documents, where applicable'
      ]
    },
    courier: {
      id: 'courier',
      name: 'Courier',
      subtitle: 'Small Parcel, Commercial Samples & Express Consignments',
      icon: PackageCheck,
      badge: 'Express Clearance',
      color: 'from-rose-500 to-pink-600',
      documents: [
        'Commercial Invoice',
        'Courier / Airway Bill',
        'Customs Declaration',
        'Importer/Exporter Information',
        'Required KYC Information',
        'Required Permits / NOCs, where applicable'
      ]
    }
  };

  // 9-Step Customs Clearance Workflow
  const workflowSteps = [
    {
      number: '01',
      title: 'Document Collection',
      desc: 'Collection of commercial invoices, transport bills, packing lists, and consignment paperwork from the shipper.',
      tag: 'Initial Stage'
    },
    {
      number: '02',
      title: 'Document Verification',
      desc: 'Cross-verification of HS codes, declared values, weights, invoice parity, and regulatory compliance requirements.',
      tag: 'Quality Audit'
    },
    {
      number: '03',
      title: 'Customs Declaration',
      desc: 'Electronic lodgement of Bill of Entry (import) or Shipping Bill (export) into the customs trade portal.',
      tag: 'Portal Filing'
    },
    {
      number: '04',
      title: 'Duty & Tax Assessment',
      desc: 'Calculation and official appraisal of customs tariffs, antidumping duties, and local goods and services taxes.',
      tag: 'Duty Appraisal'
    },
    {
      number: '05',
      title: 'Customs Examination',
      desc: 'Coordination of container scanning, physical cargo sampling, or dock inspection where required by risk criteria.',
      tag: 'Inspection (if applicable)'
    },
    {
      number: '06',
      title: 'Customs Approval / Query Resolution',
      desc: 'Direct liaison with customs appraisers to resolve any technical queries, valuation checks, or permit verifications.',
      tag: 'Appraiser Sign-Off'
    },
    {
      number: '07',
      title: 'Duty Payment',
      desc: 'Remittance of assessed duties and taxes via corporate deferred credit account or instant electronic treasury transfer.',
      tag: 'Treasury Settlement'
    },
    {
      number: '08',
      title: 'Cargo Release',
      desc: 'Granting of official Out-of-Charge (OOC) order and electronic delivery order issuance from carrier or terminal.',
      tag: 'Gate Pass Order'
    },
    {
      number: '09',
      title: 'Final Delivery',
      desc: 'Prompt terminal pick-up and secure bonded/unbonded transport for final-mile delivery to consignee doorstep.',
      tag: 'Doorstep Handover'
    }
  ];

  // Document Details Accordion Data
  const docDetails = [
    {
      id: 'invoice',
      name: 'Commercial Invoice',
      tag: 'Primary Financial Document',
      desc: 'Exporter/importer details, product description, quantity, value, currency, country of origin and applicable trade terms.',
      keyFields: [
        'Full legal names and addresses of exporter and buyer',
        'Itemized product descriptions, HS codes & quantities',
        'Unit price, currency & total declared invoice value',
        'Incoterms (e.g. FOB, CIF, DDP) and country of manufacture'
      ]
    },
    {
      id: 'packing',
      name: 'Packing List',
      tag: 'Physical Cargo Details',
      desc: 'Number of packages, package type, gross/net weight, dimensions and package contents.',
      keyFields: [
        'Total package count and packaging type (crates, cartons, drums)',
        'Net weight and gross weight breakdown per package',
        'Dimensional metrics (length, width, height) and total volume',
        'Markings, container seal numbers and hazardous markings'
      ]
    },
    {
      id: 'awb',
      name: 'Airway Bill (AWB)',
      tag: 'Air Cargo Transport Contract',
      desc: 'Transport document for air cargo containing shipper, consignee, routing and cargo information.',
      keyFields: [
        'Master AWB (MAWB) and House AWB (HAWB) references',
        'Departure airport, transit hubs and final destination airport',
        'Flight numbers, scheduled arrival times and airline code',
        'Chargeable weight, handling instructions and declared value'
      ]
    },
    {
      id: 'bol',
      name: 'Bill of Lading (B/L)',
      tag: 'Ocean Freight Title of Goods',
      desc: 'Transport document for sea cargo containing shipper, consignee, vessel and cargo information.',
      keyFields: [
        'Ocean carrier name, vessel name, and voyage number',
        'Port of loading, port of discharge, and container numbers',
        'Negotiable (Original) or non-negotiable (Sea Waybill) status',
        'Freight prepaid or freight collect terms notation'
      ]
    },
    {
      id: 'boe',
      name: 'Bill of Entry (BOE)',
      tag: 'Import Customs Declaration',
      desc: 'Import customs declaration and supporting documentation.',
      keyFields: [
        'Official electronic entry number assigned by customs authority',
        'Detailed HS Code classifications and applicable tariff schedules',
        'Calculated Basic Customs Duty (BCD), IGST, and cess breakdown',
        'Authorized Economic Operator (AEO) or bonded status notation'
      ]
    },
    {
      id: 'shippingBill',
      name: 'Shipping Bill',
      tag: 'Export Customs Declaration',
      desc: 'Export customs declaration and supporting documentation.',
      keyFields: [
        'Electronic export entry lodgement reference number',
        'Declaration of export scheme (e.g. Drawback, EPCG, Free)',
        'FOB value, currency, and Port of Exit verification',
        'Proof of export registration for tax credit/refund purposes'
      ]
    },
    {
      id: 'coo',
      name: 'Certificate of Origin (COO)',
      tag: 'Origin Verification Document',
      desc: 'Document confirming the country of origin of the goods.',
      keyFields: [
        'Verification of manufacturer and territorial processing criteria',
        'Chamber of Commerce or designated authority official stamp/seal',
        'Preferential Trade Agreement (PTA/FTA) eligibility claim',
        'Non-preferential origin declaration for trade remedy compliance'
      ]
    },
    {
      id: 'permits',
      name: 'Permits & NOCs',
      tag: 'Regulatory Approvals & Licences',
      desc: 'Additional approvals, licences, certificates or NOCs required for specific commodities.',
      keyFields: [
        'Phytosanitary & Plant Quarantine certificates for agricultural goods',
        'Drug Controller, FDA, or BIS conformity certificates',
        'Wireless Planning (WPC) / TEC approvals for telecom electronics',
        'Ministry of Environment NOC for hazardous or battery consignments'
      ]
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
                  Customs Clearance
                </h1>
                <p className="text-lg sm:text-xl font-bold text-orange-400">
                  Smooth Customs Clearance, From Documentation to Delivery
                </p>
              </div>

              <p className="text-slate-300 font-medium text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Simplify customs clearance with documentation support, customs declarations, duty assessment, inspection coordination, compliance support, and cargo release for import and export shipments.
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
                  <span className="text-xs text-slate-400 font-medium">Average Port Release</span>
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
            Our Customs Clearance Services
          </h2>
          <p className="text-slate-700 font-semibold text-sm sm:text-base leading-relaxed">
            Full-spectrum customs brokerage to ensure seamless cross-border freight compliance without unexpected delays or penalty charges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {servicesList.map((svc) => {
            const Icon = svc.icon;
            return (
              <div 
                key={svc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group space-y-3"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold group-hover:bg-orange-600 group-hover:text-white transition-colors shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-orange-50 group-hover:text-orange-700 transition-colors">
                      {svc.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors">
                    {svc.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-relaxed group-hover:text-slate-950 transition-colors">
                    {svc.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] font-bold text-orange-600 space-x-1">
                  <span>Included</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
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
                Documents Required by Cargo Mode
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Select your freight transportation mode to review standard mandatory customs documentation.
              </p>
            </div>

            <span className="px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 shrink-0">
              5 Freight Modes
            </span>
          </div>

          {/* Mode Selector Tabs (5 Modes) */}
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
                    Mandatory & Regulatory Documents Checklist
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {currentMode.documents.map((doc, idx) => (
                      <div 
                        key={idx}
                        className="bg-slate-50 hover:bg-orange-50/50 p-3.5 rounded-xl border border-slate-200/80 hover:border-orange-300 transition-colors flex items-start space-x-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mt-0.5 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-snug">
                            {doc}
                          </span>
                          <span className="text-[11px] text-slate-600 font-semibold">
                            Required for regulatory customs clearance verification
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mode Footer Helper */}
                <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Need immediate pre-assessment for your {currentMode.name} consignment?</span>
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

        {/* 9-Step Grid Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflowSteps.map((step, idx) => (
            <div 
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 relative group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-orange-600">
                    {step.number}
                  </span>
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-200/90 text-slate-800 group-hover:bg-orange-100 group-hover:text-orange-800 transition-colors">
                    {step.tag}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Phase {idx + 1} of 9</span>
                <span className="text-emerald-700 font-black">Standard SLA Guaranteed</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Document Details Section (Expandable Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-orange-600 font-bold uppercase text-xs tracking-wider">
                In-Depth Explanation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Document Details
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold">
                Click any document card below to expand regulatory contents, critical fields, and compliance specifics.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={expandAllDocs}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAllDocs}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Expandable Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docDetails.map((doc) => {
              const isExpanded = !!expandedDocs[doc.id];
              return (
                <div 
                  key={doc.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded 
                      ? 'border-orange-300 bg-orange-50/25 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Card Trigger Button */}
                  <button
                    type="button"
                    onClick={() => toggleDoc(doc.id)}
                    className="w-full p-4 sm:p-5 flex items-start justify-between text-left cursor-pointer group"
                  >
                    <div className="space-y-1 pr-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                          {doc.name}
                        </h3>
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-200/90 text-slate-800">
                          {doc.tag}
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-slate-900 font-bold leading-relaxed">
                        {doc.desc}
                      </p>
                    </div>

                    <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-orange-100 text-slate-600 group-hover:text-orange-600 transition-colors shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Expanded Content Drawer */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-orange-100/80 space-y-3 animate-fade-in">
                      <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                        Critical Regulatory Fields & Details:
                      </span>
                      <ul className="space-y-1.5">
                        {doc.keyFields.map((field, fIdx) => (
                          <li key={fIdx} className="flex items-start space-x-2 text-xs font-bold text-slate-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
                            <span>{field}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
