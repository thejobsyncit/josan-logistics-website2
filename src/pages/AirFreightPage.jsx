import React from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { airFreightCargoTypes } from '../components/CargoTypeSelector';
import { 
  Plane, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Package, 
  Layers, 
  Truck,
  FileCheck
} from 'lucide-react';

export const AirFreightPage = ({ setActiveTab }) => {
  const { 
    currentUser, 
    setIsAuthModalOpen, 
    setAuthRedirectTab, 
    showToast 
  } = useLogistics();

  const handleAirwayRequestClick = () => {
    setActiveTab('airway-request');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleQuoteClick = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('quote');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in to request airway services.', 'warning');
      return;
    }
    setActiveTab('quote');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleBookClick = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('book');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in or create an account to book a shipment.', 'warning');
      return;
    }
    setActiveTab('book');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // 4 Primary Airway Services
  const airServices = [
    {
      id: 'awb-prep',
      title: 'AWB Preparation',
      badge: 'Air Waybill Details',
      desc: 'Preparation of Air Waybill details based on shipment information.',
      features: [
        'Accurate consignment data entry',
        'Shipper and consignee verification',
        'Standardized airway paperwork'
      ],
      icon: FileText
    },
    {
      id: 'awb-billing',
      title: 'AWB Billing',
      badge: 'Billing Support',
      desc: 'Billing support associated with Air Waybill and air shipment documentation.',
      features: [
        'Air shipment fee breakdown',
        'Clear documentation billing',
        'Commercial charge coordination'
      ],
      icon: Layers
    },
    {
      id: 'shipment-doc',
      title: 'Shipment Documentation',
      badge: 'Shipment Paperwork',
      desc: 'Preparation and organization of required air shipment information and documents.',
      features: [
        'Commercial invoice & packing record alignment',
        'Cargo specification documentation',
        'Organized shipment file maintenance'
      ],
      icon: FileCheck
    },
    {
      id: 'air-transport',
      title: 'Air Transportation Support',
      badge: 'Logistics Coordination',
      desc: 'Transportation coordination for moving goods through the required logistics network.',
      features: [
        'Commercial freight movement coordination',
        'Logistics network support',
        'Origin-to-destination transport alignment'
      ],
      icon: Plane
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Shipment Detail Intake',
      desc: 'Collection and review of essential cargo details, shipper, and consignee information.',
      icon: FileCheck
    },
    {
      step: '02',
      title: 'AWB Preparation',
      desc: 'Accurate preparation of Air Waybill details and consignment documentation.',
      icon: FileText
    },
    {
      step: '03',
      title: 'Billing & Charge Verification',
      desc: 'Calculation and coordination of billing details associated with airway documentation.',
      icon: Layers
    },
    {
      step: '04',
      title: 'Documentation Review',
      desc: 'Thorough check of shipment records, packing information, and required paperwork.',
      icon: ShieldCheck
    },
    {
      step: '05',
      title: 'Transportation Coordination',
      desc: 'Coordination of transportation support for moving goods through the logistics network.',
      icon: Plane
    },
    {
      step: '06',
      title: 'Handover & Delivery Record',
      desc: 'Final delivery record confirmation and documentation completion.',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 space-y-16 sm:space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0A101D] text-white pt-12 pb-16 sm:pt-14 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Full-Color Front-View Cargo Aircraft Background (Styled like Roadways Hero) */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src="/assets/air_service_front_hero.jpg" 
            alt="Commercial Air Cargo Operations - Cargo Aircraft" 
            className="w-full h-full object-cover object-[70%_center] sm:object-[78%_center] lg:object-[82%_center]"
          />
        </div>
        {/* Directional gradient on left end only to keep cargo aircraft completely visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A101D] via-[#0A101D]/85 via-35% to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A101D]/85 via-transparent to-[#0A101D]/20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-7">
          <div className="max-w-xl lg:max-w-2xl space-y-4 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Plane className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>AIRWAY SERVICES</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl font-black font-heading text-white tracking-tight leading-[1.15]">
              AWB, BILLING &amp; <br />
              <span className="text-[#FF6B00]">Shipment Documentation</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
              Josan Logistics provides airway logistics support including Air Waybill preparation, billing, shipment documentation and transportation coordination for commercial goods.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleAirwayRequestClick}
                className="px-7 py-3.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8500] hover:from-[#E55C00] hover:to-[#FF6B00] text-white rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center space-x-2.5 cursor-pointer active:scale-95"
              >
                <span>REQUEST AIRWAY SERVICE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleBookClick}
                className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 text-white rounded-xl font-bold text-xs sm:text-sm border border-slate-700 hover:border-slate-600 transition-all cursor-pointer flex items-center space-x-2"
              >
                <Package className="w-4 h-4 text-orange-400" />
                <span>BOOK SHIPMENT</span>
              </button>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-3 flex flex-wrap items-center gap-5 text-xs text-slate-300 font-semibold border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AWB Preparation</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AWB Billing</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Shipment Documentation</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Transportation Support</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-left">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-md transition-all group">
            <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider block">Air Waybill</span>
            <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">AWB Preparation</span>
            <span className="text-[10px] text-slate-500 font-medium">Consignment details</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-md transition-all group">
            <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider block">Billing</span>
            <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">AWB Billing</span>
            <span className="text-[10px] text-slate-500 font-medium">Charge coordination</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-md transition-all group">
            <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider block">Records</span>
            <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Shipment Docs</span>
            <span className="text-[10px] text-slate-500 font-medium">Paperwork management</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-md transition-all group">
            <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider block">Logistics</span>
            <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Transportation</span>
            <span className="text-[10px] text-slate-500 font-medium">Network coordination</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-md transition-all group">
            <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider block">Compliance</span>
            <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Customs Docs</span>
            <span className="text-[10px] text-slate-500 font-medium">Regulatory support</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-md transition-all group">
            <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider block">Commercial</span>
            <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Business Goods</span>
            <span className="text-[10px] text-slate-500 font-medium">Diverse commodities</span>
          </div>
        </div>
      </section>

      {/* 2. AIRWAY OVERVIEW & HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#FF6B00] uppercase tracking-wider">
              <span>Airway Logistics Support</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
              Structured Airway Documentation &amp; Transportation Coordination
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Josan Logistics assists businesses with essential airway processes, focusing on Air Waybill preparation, billing, and accurate shipment documentation.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              We coordinate transportation support to move commercial goods through established logistics networks while ensuring paperwork and records are properly organized.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-lg sm:text-xl font-black text-slate-900 block">AWB Support</span>
                <span className="text-xs text-slate-500 font-bold">Preparation &amp; Billing</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-lg sm:text-xl font-black text-[#FF6B00] block">Shipment Documents</span>
                <span className="text-xs text-slate-500 font-bold">Organized Documentation</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-lg sm:text-xl font-black text-slate-900 block">Commercial Cargo</span>
                <span className="text-xs text-slate-500 font-bold">Business Goods Transportation</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-lg sm:text-xl font-black text-slate-900 block">Transportation Support</span>
                <span className="text-xs text-slate-500 font-bold">Coordinated Logistics Movement</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-slate-950 relative group">
            <img 
              src="/assets/export_air_freight_cargo.jpg" 
              alt="Airway Shipment Documentation" 
              className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-6 flex flex-col justify-end text-left text-white">
              <span className="text-xs font-mono font-bold text-orange-400">Airway Documentation</span>
              <p className="text-sm font-extrabold mt-1">Accurate AWB Preparation &amp; Cargo Records</p>
              <p className="text-[11px] text-slate-300 mt-0.5">Structured paperwork, billing details, and commercial shipment coordination.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR AIRWAY SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Service Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Our Airway Services
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Airway services focused on Air Waybill preparation, billing, shipment documentation and transportation support for commercial shipments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {airServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <div 
                key={svc.id} 
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-orange-500/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white transition-colors flex items-center justify-center shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {svc.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#FF6B00] transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium mt-1.5">
                      {svc.desc}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    {svc.features.map((feat, i) => (
                      <div key={i} className="flex items-start space-x-2 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-semibold text-[11px]">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={handleAirwayRequestClick}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-[#FF6B00] text-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-200 group-hover:border-transparent flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Request {svc.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SUPPORTED CARGO TYPES */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block mb-1">
                Commodity Support
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
                Commercial Cargo Classifications
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md font-medium">
              We provide airway documentation and transportation support for diverse commercial products and business goods.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {airFreightCargoTypes.map((cargo) => (
              <div 
                key={cargo.id} 
                className="bg-slate-800/80 hover:bg-slate-800 rounded-2xl p-5 border border-slate-700/80 hover:border-orange-500/50 transition-all text-left space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-orange-400 uppercase">
                    Code: {cargo.id.toUpperCase()}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <h4 className="text-base font-bold text-white">{cargo.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {cargo.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SHIPMENT WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            End-to-End Progression
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Airway Documentation &amp; Transport Process
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            From initial shipment details and AWB preparation to documentation verification and transportation coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((ws) => {
            const Icon = ws.icon;
            return (
              <div 
                key={ws.step} 
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-card transition-all text-left space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#FF6B00]/40 font-mono group-hover:text-[#FF6B00] transition-colors">
                    {ws.step}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {ws.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {ws.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. CUSTOMS & ROAD CONNECTIONS (Callouts) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customs Clearance Connection Card */}
          <div className="bg-gradient-to-br from-blue-900 to-[#0B132B] text-white p-7 sm:p-8 rounded-3xl border border-blue-800 shadow-card flex flex-col justify-between text-left space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Customs &amp; Shipment Documentation Support</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Documentation support for shipments, helping organize the information and documents required for transportation and applicable customs processes.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('customs-clearance');
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-2"
              >
                <span>Explore Documentation Guide</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Road Feeder Network Connection Card */}
          <div className="bg-gradient-to-br from-slate-900 to-[#10182D] text-white p-7 sm:p-8 rounded-3xl border border-slate-700 shadow-card flex flex-col justify-between text-left space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Commercial Road Transportation Support</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Reliable transportation support for moving commercial goods and products between business facilities through a network of transportation partners.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('road-freight');
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-2"
              >
                <span>View Road Transportation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM QUOTE CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#FF6B00] to-orange-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden space-y-6">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
              Ready to Coordinate Your Airway Services?
            </h2>
            <p className="text-white/90 text-sm sm:text-base font-medium">
              Obtain documentation support, prepare your Air Waybill details, and coordinate transportation support for your commercial goods.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              type="button"
              onClick={handleAirwayRequestClick}
              className="px-8 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all cursor-pointer active:scale-95"
            >
              REQUEST AIRWAY SERVICE
            </button>
            <button
              type="button"
              onClick={handleBookClick}
              className="px-8 py-3.5 bg-slate-900/40 hover:bg-slate-900/60 text-white rounded-xl font-bold text-xs sm:text-sm border border-white/40 transition-all cursor-pointer"
            >
              BOOK SHIPMENT
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
