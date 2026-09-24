import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Search, 
  Truck, 
  Package, 
  ShieldCheck, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Zap, 
  Layers,
  Sparkles,
  Phone,
  Mail,
  Shield,
  Activity,
  SlidersHorizontal,
  Compass,
  Building2,
  Calendar,
  Globe,
  Plane,
  Thermometer,
  FileCheck,
  FileText
} from 'lucide-react';

export const HomePage = ({ setActiveTab }) => {
  const { 
    currentUser, 
    setIsAuthModalOpen, 
    setAuthRedirectTab,
    resetShipmentScope, 
    setActiveTrackingId,
    showToast 
  } = useLogistics();

  const handleTrackAction = () => {
    setActiveTab('track');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleBookingAction = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('book');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in or create an account to book a shipment.', 'warning');
      return;
    }
    if (resetShipmentScope) resetShipmentScope();
    setActiveTab('book');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleQuoteAction = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('quote');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
      return;
    }
    setActiveTab('quote');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // 4 Airway Services (Accurate Business Model: AWB Preparation, AWB Billing, Documentation, Transportation)
  const airServices = [
    {
      id: 'awb-prep',
      title: 'AWB Preparation',
      tag: 'AWB Details',
      desc: 'Preparation of Air Waybill details based on shipment information.',
      specs: [
        'Air Waybill detail preparation',
        'Consignment and cargo data organization',
        'Accurate airway paperwork verification'
      ],
      icon: FileText,
      image: '/assets/air_cargo_documentation_awb.jpg'
    },
    {
      id: 'awb-billing',
      title: 'AWB Billing',
      tag: 'Billing Support',
      desc: 'Billing support associated with Air Waybill and air shipment documentation.',
      specs: [
        'Air shipment billing documentation',
        'Clear documentation charge records',
        'Commercial invoicing coordination'
      ],
      icon: Layers,
      image: '/assets/air_cargo_billing_invoice.jpg'
    },
    {
      id: 'shipment-doc',
      title: 'Shipment Documentation',
      tag: 'Documentation Support',
      desc: 'Preparation and organization of essential air shipment information and documentation.',
      specs: [
        'Essential air shipment paperwork',
        'Commercial data organization',
        'Cargo information verification'
      ],
      icon: FileCheck,
      image: '/assets/air_shipment_documentation_desk.jpg'
    },
    {
      id: 'air-transport',
      title: 'Air Transportation',
      tag: 'Logistics Network',
      desc: 'Transportation support for moving goods through the required logistics network.',
      specs: [
        'Cargo movement coordination',
        'Logistics network support',
        'Origin-to-destination freight assistance'
      ],
      icon: Plane,
      image: '/assets/export_air_freight_cargo.jpg'
    }
  ];

  // 4 Commercial Road Transportation Services
  const roadServices = [
    {
      id: 'parcel-delivery',
      title: 'Commercial Parcel Delivery',
      tag: 'Commercial Goods',
      desc: 'Dependable transportation of commercial packages and boxed goods between business locations and commercial facilities.',
      desc2: 'Designed for commercial shippers requiring reliable point-to-point movement of products.',
      specsLabel: 'Key Features:',
      specs: [
        'Commercial point-to-point delivery',
        'Scheduled dispatch options',
        'Delivery documentation and confirmation'
      ],
      icon: Package,
      image: '/assets/parcel_delivery_handover.png'
    },
    {
      id: 'bulk-shipment',
      title: 'Bulk Goods Transportation',
      tag: 'High-Volume Goods',
      desc: 'Road-based transportation for businesses moving commercial products, palletized cargo, and high-volume goods between commercial facilities.',
      desc2: 'Coordinated through transportation partners for dependable capacity.',
      specsLabel: 'Key Features:',
      specs: [
        'Commercial vehicle coordination',
        'Direct facility-to-facility movement',
        'High-capacity load handling'
      ],
      icon: Layers,
      image: '/assets/bulk_shipment_containers.png'
    },
    {
      id: 'intra-city',
      title: 'Intra-City Commercial Transport',
      tag: 'Urban Distribution',
      desc: 'Commercial road transportation connecting warehouses, distribution facilities, commercial centers, and delivery destinations.',
      desc2: 'Built for scheduled, recurring commercial deliveries.',
      specsLabel: 'Key Features:',
      specs: [
        'Multi-point commercial distribution',
        'Scheduled delivery coordination',
        'Dependable urban route planning'
      ],
      icon: Navigation,
      image: '/assets/intra_city_logistics_route.png'
    },
    {
      id: 'island-wide',
      title: 'Regional Road Transportation',
      tag: 'Corridor Movement',
      desc: 'Reliable commercial transportation support ensuring smooth movement of products from pickup to destination across key regional routes.',
      desc2: 'Designed to support consistent commercial supply chain requirements.',
      specsLabel: 'Key Features:',
      specs: [
        'Coverage across key commercial corridors',
        'Scheduled transport windows',
        'Coordinated partner dispatch'
      ],
      icon: Truck,
      image: '/assets/inter_city_highway_corridor.png'
    }
  ];

  return (
    <div className="w-full">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH PROMINENT TEXT & PRECISE CROPPED VISUAL BOUNDARY     */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-18 lg:pb-24 overflow-hidden bg-[#0A101D] text-white min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] xl:min-h-[620px] flex flex-col justify-center">
        {/* Full-View Multimodal Logistics Hub Hero Visual (Cropped up to marked line) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img 
            src="/assets/homepage_hero_sunset_hub.jpg" 
            alt="Commercial logistics hub with cargo aircraft, freight trucks and distribution terminal" 
            className="w-full h-full object-cover object-bottom transform brightness-100 contrast-100"
          />
          {/* Subtle natural overlays - provides contrast for large bold text while keeping background aircraft and trucks crisp */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          
          {/* Bold, prominent text directly on the background */}
          <div className="max-w-2xl lg:max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs sm:text-sm font-bold text-amber-400 backdrop-blur-xs shadow-md">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" />
              <span className="tracking-wider uppercase font-black text-xs">LOGISTICS &amp; TRANSPORTATION SUPPORT</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[62px] font-black tracking-tight text-white leading-[1.08] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              <span className="block">Reliable Logistics Solutions</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8500] to-amber-300 drop-shadow-[0_4px_12px_rgba(255,107,0,0.45)]">
                For Every Journey
              </span>
            </h1>

            <p className="text-slate-100 text-base sm:text-lg lg:text-xl leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] max-w-2xl">
              From Air Waybill preparation and shipment documentation to commercial road transportation, we provide reliable logistics support for businesses moving goods from one location to another.
            </p>

            {/* Action Buttons: General Logistics CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleQuoteAction}
                className="px-8 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF8500] hover:from-[#E55C00] hover:to-[#FF6B00] text-white rounded-full font-black text-sm sm:text-base tracking-wider uppercase shadow-xl shadow-orange-500/35 hover:shadow-orange-500/50 transition-all flex items-center space-x-2.5 cursor-pointer active:scale-95 group"
              >
                <span>Get a Freight Quote</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleTrackAction}
                className="px-7 py-4 bg-slate-900/70 hover:bg-slate-900/90 text-white rounded-full font-extrabold text-sm sm:text-base tracking-wider uppercase border border-white/25 transition-all flex items-center space-x-2.5 cursor-pointer backdrop-blur-xs shadow-lg"
              >
                <Search className="w-5 h-5 text-sky-400" />
                <span>Track Shipment</span>
              </button>
            </div>

            {/* Quick Service Highlights */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-100">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 border border-white/15 backdrop-blur-xs shadow-xs">
                <Plane className="w-4 h-4 text-sky-400" />
                <span>Airway Services: AWB &bull; Billing &bull; Docs</span>
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 border border-white/15 backdrop-blur-xs shadow-xs">
                <Truck className="w-4 h-4 text-orange-400" />
                <span>Road Transportation: Commercial Goods</span>
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 border border-white/15 backdrop-blur-xs shadow-xs">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Documentation Support</span>
              </span>
            </div>
          </div>

        </div>

        {/* Slim bottom blend transition */}
        <div 
          className="absolute bottom-0 inset-x-0 h-6 sm:h-8 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(180deg, rgba(10, 16, 29, 0) 0%, rgba(238, 242, 246, 0.5) 60%, #EEF2F6 100%)'
          }}
        />
      </section>

      {/* ========================================================================= */}
      {/* SECTIONS 2-6 (LIGHT COOL-GRAY GRADIENT BACKGROUND)                       */}
      {/* ========================================================================= */}
      <div 
        className="space-y-16 sm:space-y-24 pt-12 sm:pt-16 pb-20 relative"
        style={{
          background: 'linear-gradient(180deg, #EEF2F6 0%, #F4F6F8 50%, #F7F8FA 100%)'
        }}
      >
        {/* ========================================================================= */}
        {/* 2. AIRWAY SERVICES                                                        */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-[#FF6B00] font-bold uppercase text-xs tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Airway Services</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10182D] font-heading mt-2">
                Airway Services
              </h2>
              <p className="text-slate-600 text-sm font-medium mt-1 max-w-2xl">
                Airway services focused on Air Waybill preparation, billing, shipment documentation and transportation support.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('air-freight');
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs"
              >
                <span>Airway Services Page</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
              </button>
              <button
                type="button"
                onClick={handleQuoteAction}
                className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 shadow-orange-xs"
              >
                <span>Get Air Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4 Airway Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {airServices.map((svc) => {
              const IconComp = svc.icon;
              return (
                <div 
                  key={svc.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-card hover:border-[#FF6B00] hover:shadow-orange-500/10 transition-all flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-4">
                    <div className="h-48 w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900 relative">
                      <img 
                        src={svc.image} 
                        alt={svc.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95" 
                      />
                      <div className="absolute top-3 left-3 z-20 w-10 h-10 rounded-xl bg-white/95 text-[#FF6B00] shadow-xs flex items-center justify-center backdrop-blur-xs">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="absolute top-3 right-3 z-20">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                          {svc.tag}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-[#10182D] group-hover:text-[#FF6B00] transition-colors">
                        {svc.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {svc.desc}
                      </p>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-800 mb-1.5">
                        Key Details:
                      </div>
                      <ul className="space-y-1.5">
                        {svc.specs.map((spec, i) => (
                          <li key={i} className="text-[11px] text-slate-700 font-medium flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('air-freight');
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-[#FF6B00] hover:text-[#E55C00] inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Service Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleQuoteAction}
                      className="text-xs font-bold text-[#FF6B00] hover:text-[#E55C00] inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Quote</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. COMMERCIAL ROAD TRANSPORTATION                                         */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-[#FF6B00] font-bold uppercase text-xs tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Commercial Road Transportation</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10182D] font-heading mt-2">
                Commercial Road Transportation
              </h2>
              <p className="text-slate-600 text-sm font-medium mt-1 max-w-2xl">
                Reliable transportation support for businesses moving commercial goods and products from one location to another through a network of transportation partners.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('road-freight');
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs"
              >
                <span>Road Transportation Page</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
              </button>
              <button
                type="button"
                onClick={handleQuoteAction}
                className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 shadow-orange-xs"
              >
                <span>Get Road Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4 Standard Road Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadServices.map((svc) => {
              const IconComp = svc.icon;
              return (
                <div 
                  key={svc.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-card hover:border-orange-300 transition-all flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-4">
                    <div className="h-56 sm:h-60 w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 relative">
                      <img 
                        src={svc.image} 
                        alt={svc.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3 z-20 w-10 h-10 rounded-xl bg-white/95 text-[#FF6B00] shadow-xs flex items-center justify-center backdrop-blur-xs">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="absolute top-3 right-3 z-20">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                          {svc.tag}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-extrabold text-[#10182D] group-hover:text-[#FF6B00] transition-colors">
                        {svc.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {svc.desc}
                      </p>
                      {svc.desc2 && (
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          {svc.desc2}
                        </p>
                      )}
                    </div>

                    <div>
                      {svc.specsLabel && (
                        <div className="text-[11px] font-bold text-slate-800 mb-1.5">
                          {svc.specsLabel}
                        </div>
                      )}
                      <ul className="space-y-1.5">
                        {svc.specs.map((spec, i) => (
                          <li key={i} className="text-[11px] text-slate-700 font-bold flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('road-freight');
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-[#FF6B00] hover:text-[#E55C00] inline-flex items-center space-x-1.5 cursor-pointer group/cta"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. WHY CHOOSE JOSAN                                                       */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#FF6B00] font-bold uppercase text-xs tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Reliable Logistics Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10182D] font-heading">
              Why Choose Josan Logistics
            </h2>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              We provide dependable logistics support, focused on Air Waybill preparation, shipment documentation, and commercial road transportation through trusted partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-300 transition-all space-y-4 group">
              <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 relative">
                <img 
                  src="/assets/inter_city_highway_corridor.png" 
                  alt="Reliable Transportation Support" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-white/95 text-[#FF6B00] shadow-xs flex items-center justify-center backdrop-blur-xs">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-base font-extrabold text-[#10182D]">
                Reliable Transportation Support
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                Transportation solutions coordinated to support the movement of commercial goods.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-300 transition-all space-y-4 group">
              <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-900 relative">
                <img 
                  src="/assets/air_shipment_documentation_desk.jpg" 
                  alt="Airway Documentation Support" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95" 
                />
                <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-white/95 text-[#FF6B00] shadow-xs flex items-center justify-center backdrop-blur-xs">
                  <Plane className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-base font-extrabold text-[#10182D] group-hover:text-[#FF6B00] transition-colors">
                Airway Documentation Support
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                AWB preparation, billing and shipment documentation support for air transportation.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-300 transition-all space-y-4 group">
              <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 relative">
                <img 
                  src="/assets/bulk_shipment_containers.png" 
                  alt="Commercial Cargo Movement" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-white/95 text-[#FF6B00] shadow-xs flex items-center justify-center backdrop-blur-xs">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-base font-extrabold text-[#10182D] group-hover:text-[#FF6B00] transition-colors">
                Commercial Cargo Movement
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                Transportation support designed for businesses moving products and goods between locations.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-300 transition-all space-y-4 group">
              <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 relative">
                <img 
                  src="/assets/customs_clearance_inspection.jpg" 
                  alt="Documentation Support" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-white/95 text-emerald-600 shadow-xs flex items-center justify-center backdrop-blur-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-base font-extrabold text-[#10182D] group-hover:text-[#FF6B00] transition-colors">
                Documentation Support
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                Organized shipment and customs-related documentation support.
              </p>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CUSTOMS & SHIPMENT DOCUMENTATION                                       */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#10182D] text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-sky-400 font-bold uppercase text-xs tracking-widest bg-slate-800/90 px-3.5 py-1 rounded-full border border-slate-700 inline-flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Documentation Support &bull; Shipment Paperwork</span>
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Customs &amp; Shipment Documentation
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-xl font-medium">
                  We provide documentation support for shipments, helping organize the information and documents required for transportation and applicable customs processes.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('customs-clearance');
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-[#FF6B00] hover:bg-[#E55C00] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center space-x-2 cursor-pointer active:scale-95"
                  >
                    <span>Documentation Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleQuoteAction}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all cursor-pointer"
                  >
                    <span>Request Documentation Support</span>
                  </button>
                </div>
              </div>

              {/* 6 Key Required Documents UI Cards */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-left">
                {[
                  { name: 'Commercial Invoice', desc: 'Valuation & seller details' },
                  { name: 'Packing List', desc: 'Itemized weight & cargo breakdown' },
                  { name: 'Air Waybill (AWB)', desc: 'Air consignment document details' },
                  { name: 'Certificate of Origin', desc: 'Origin country verification' },
                  { name: 'Customs Documentation', desc: 'Required border documentation support' },
                  { name: 'Insurance Certificate', desc: 'Cargo coverage documentation' }
                ].map((doc, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-[#FF6B00]/60 transition-colors">
                    <div className="flex items-center gap-1.5 text-[#FF6B00] text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{doc.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium block leading-tight">
                      {doc.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-medium flex items-center gap-2">
              <span className="text-[#FF6B00] font-bold">&bull; Notice:</span>
              <span>Required documents may vary depending on the shipment, cargo, origin, destination and applicable regulations.</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. CTA SECTION                                                            */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#10182D] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-slate-800">
            {/* Multimodal Logistics Hub Scene Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src="/assets/homepage_logistics_hub_bg.jpg" 
                alt="Multimodal logistics operations with cargo flight and transport fleet" 
                className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#10182D] via-[#10182D]/95 to-[#10182D]/75"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/20 rounded-full blur-3xl pointer-events-none"></div>
            </div>
            
            <div className="max-w-3xl space-y-6 relative z-10">
              <span className="text-amber-400 font-black uppercase text-xs tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Logistics &amp; Documentation Support</span>
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
                Moving Your Goods with Reliable Logistics Support
              </h2>

              <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
                From Air Waybill services and shipment documentation to commercial road transportation, we support businesses with practical logistics solutions for moving goods between locations.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleQuoteAction}
                  className="px-8 py-4 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-xl font-extrabold text-sm shadow-orange-sm transition-all flex items-center space-x-2 cursor-pointer active:scale-98"
                >
                  <span>Get an Instant Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleBookingAction}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-extrabold text-sm border border-white/20 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Package className="w-4 h-4 text-sky-400" />
                  <span>Book Shipment</span>
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
