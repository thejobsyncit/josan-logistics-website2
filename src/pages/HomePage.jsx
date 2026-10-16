import React, { useState, useRef, useEffect } from 'react';
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

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65;
    }
  }, []);

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
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-18 lg:pb-24 overflow-hidden bg-slate-100 min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] xl:min-h-[620px] flex flex-col justify-center">
        {/* Video / Photo Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="auto"
            onLoadedMetadata={(e) => { e.currentTarget.playbackRate = 0.65; }}
            onPlay={(e) => { e.currentTarget.playbackRate = 0.65; }}
            className="w-full h-full object-cover object-[70%_25%] sm:object-[75%_25%] lg:object-[80%_20%] transform scale-[1.12] origin-top-left"
          >
            <source src="/assets/freight_truck_highway.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          
          {/* Left-aligned text container without any box blocking the truck */}
          <div className="max-w-xl lg:max-w-2xl space-y-6 text-left">
            <div 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-semibold text-white backdrop-blur-md shadow-md bg-black/50 border-white/20"
            >
              <Sparkles className="w-4 h-4 text-[#F26B21]" />
              <span className="tracking-wider uppercase font-semibold text-xs text-white">LOGISTICS &amp; TRANSPORTATION SUPPORT</span>
            </div>

            <h1 
              className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] font-black tracking-tight text-white leading-[1.1]"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 4px 24px rgba(0,0,0,0.7)' }}
            >
              <span className="block text-white">Reliable Logistics Solutions</span>
              <span className="block text-white">For Every Journey</span>
            </h1>

            <p 
              className="text-white text-base sm:text-lg lg:text-xl leading-relaxed font-medium max-w-xl"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9), 0 2px 14px rgba(0,0,0,0.75)' }}
            >
              From Air Waybill preparation and shipment documentation to commercial road transportation, we provide reliable logistics support for businesses moving goods from one location to another.
            </p>

            {/* Action Buttons: Primary Orange CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleQuoteAction}
                className="px-8 py-4 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-full font-bold text-sm sm:text-base tracking-wider uppercase transition-colors flex items-center space-x-2.5 cursor-pointer active:scale-95 group shadow-lg"
              >
                <span>Get a Freight Quote</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. AIRWAY SERVICES (LIGHT SECTION: #F5F7FA)                               */}
      {/* ========================================================================= */}
      <section className="bg-[#F5F7FA] py-16 sm:py-24 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-[#0B1F3A] font-bold uppercase text-xs tracking-wider bg-[#0B1F3A]/5 px-3 py-1 rounded-full border border-[#0B1F3A]/10 inline-flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-[#0B1F3A]" />
                <span>Airway Services</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] font-heading mt-2">
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
                className="px-5 py-2.5 bg-transparent hover:bg-slate-200/60 text-[#0B1F3A] border border-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-none"
              >
                <span>Airway Services Page</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0B1F3A]" />
              </button>
              <button
                type="button"
                onClick={handleQuoteAction}
                className="px-5 py-2.5 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-sm"
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
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-4">
                    <div className="h-48 w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900 relative">
                      <img 
                        src={svc.image} 
                        alt={svc.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95" 
                      />
                      <div className="absolute top-3 left-3 z-20 w-10 h-10 rounded-xl bg-[#0B1F3A] text-white shadow-sm flex items-center justify-center">
                        <IconComp className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute top-3 right-3 z-20">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                          {svc.tag}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-[#0B1F3A] transition-colors">
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
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0B1F3A] shrink-0" />
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
                      className="text-xs font-bold text-[#0B1F3A] hover:text-[#F26B21] inline-flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <span>Service Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleQuoteAction}
                      className="text-xs font-bold text-[#0B1F3A] hover:text-[#F26B21] inline-flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <span>Quote</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. COMMERCIAL ROAD TRANSPORTATION (WHITE SECTION: #FFFFFF)                 */}
      {/* ========================================================================= */}
      <section className="bg-white py-16 sm:py-24 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-[#0B1F3A] font-bold uppercase text-xs tracking-wider bg-[#0B1F3A]/5 px-3 py-1 rounded-full border border-[#0B1F3A]/10 inline-flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#0B1F3A]" />
                <span>Commercial Road Transportation</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] font-heading mt-2">
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
                className="px-5 py-2.5 bg-transparent hover:bg-slate-100 text-[#0B1F3A] border border-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-none"
              >
                <span>Road Transportation Page</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0B1F3A]" />
              </button>
              <button
                type="button"
                onClick={handleQuoteAction}
                className="px-5 py-2.5 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-sm"
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
                  className="bg-[#F5F7FA] rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-4">
                    <div className="h-56 sm:h-60 w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-white relative">
                      <img 
                        src={svc.image} 
                        alt={svc.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3 z-20 w-10 h-10 rounded-xl bg-[#0B1F3A] text-white shadow-sm flex items-center justify-center">
                        <IconComp className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute top-3 right-3 z-20">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                          {svc.tag}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-extrabold text-[#0B1F3A] transition-colors">
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
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('road-freight');
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-[#0B1F3A] hover:text-[#F26B21] inline-flex items-center space-x-1.5 cursor-pointer group/cta transition-colors"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHY CHOOSE JOSAN (LIGHT SECTION: #F5F7FA)                              */}
      {/* ========================================================================= */}
      <section className="bg-[#F5F7FA] py-16 sm:py-24 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#0B1F3A] font-bold uppercase text-xs tracking-wider bg-[#0B1F3A]/5 px-3 py-1 rounded-full border border-[#0B1F3A]/10">
              Reliable Logistics Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] font-heading">
              Why Choose Josan Logistics
            </h2>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              We provide dependable logistics support, focused on Air Waybill preparation, shipment documentation, and commercial road transportation through trusted partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-4 group">
              <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 relative">
                <img 
                  src="/assets/inter_city_highway_corridor.png" 
                  alt="Reliable Transportation Support" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  style={{ objectPosition: 'center 75%' }}
                />
                <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-[#0B1F3A] text-white shadow-sm flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-base font-extrabold text-[#0B1F3A]">
                Reliable Transportation Support
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                Transportation solutions coordinated to support the movement of commercial goods.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-4 group">
              <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-900 relative">
                <img 
                  src="/assets/air_shipment_documentation_desk.jpg" 
                  alt="Airway Documentation Support" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95" 
                />
                <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-[#0B1F3A] text-white shadow-sm flex items-center justify-center">
                  <Plane className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-base font-extrabold text-[#0B1F3A]">
                Airway Documentation Support
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                AWB preparation, billing and shipment documentation support for air transportation.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-4 group">
              <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 relative">
                <img 
                  src="/assets/bulk_shipment_containers.png" 
                  alt="Commercial Cargo Movement" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-[#0B1F3A] text-white shadow-sm flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-base font-extrabold text-[#0B1F3A]">
                Commercial Cargo Movement
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                Transportation support designed for businesses moving products and goods between locations.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-4 group">
              <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 relative">
                <img 
                  src="/assets/customs_clearance_inspection.jpg" 
                  alt="Documentation Support" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-[#0B1F3A] text-white shadow-sm flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-base font-extrabold text-[#0B1F3A]">
                Documentation Support
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                Organized shipment and customs-related documentation support.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CUSTOMS & SHIPMENT DOCUMENTATION                                       */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xs relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-slate-800 font-bold uppercase text-xs tracking-widest bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200 inline-flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-slate-700" />
                  <span>Documentation Support &bull; Shipment Paperwork</span>
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Customs &amp; Shipment Documentation
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed max-w-xl font-normal">
                  We provide documentation support for shipments, helping organize the information and documents required for transportation and applicable customs processes.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('customs-clearance');
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-[#F26B21] hover:bg-[#D95A13] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center space-x-2 cursor-pointer active:scale-95"
                  >
                    <span>Documentation Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleQuoteAction}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 transition-colors cursor-pointer"
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
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-1.5 text-slate-900 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{doc.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-normal block leading-tight">
                      {doc.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 text-[11px] text-slate-500 font-normal flex items-center gap-2">
              <span className="text-slate-900 font-bold">&bull; Notice:</span>
              <span>Required documents may vary depending on the shipment, cargo, origin, destination and applicable regulations.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CTA SECTION                                                            */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 text-slate-900 rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xs border border-slate-200">
            {/* Multimodal Logistics Hub Scene Background with Subtle Transparency */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img 
                src="/assets/homepage_logistics_hub_bg.jpg" 
                alt="Multimodal logistics operations with cargo flight and transport fleet" 
                className="w-full h-full object-cover object-center opacity-15 mix-blend-multiply scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent"></div>
            </div>
            
            <div className="max-w-3xl space-y-6 relative z-10">
              <span className="text-slate-800 font-semibold uppercase text-xs tracking-widest bg-white px-3.5 py-1.5 rounded-full border border-slate-200 inline-flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F26B21]" />
                <span>Logistics &amp; Documentation Support</span>
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
                Moving Your Goods with Reliable Logistics Support
              </h2>

              <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed max-w-xl">
                From Air Waybill services and shipment documentation to commercial road transportation, we support businesses with practical logistics solutions for moving goods between locations.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleQuoteAction}
                  className="px-8 py-4 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center space-x-2 cursor-pointer active:scale-98"
                >
                  <span>Get an Instant Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleBookingAction}
                  className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-bold text-sm border border-slate-200 transition-colors flex items-center space-x-2 cursor-pointer shadow-2xs"
                >
                  <Package className="w-4 h-4 text-slate-700" />
                  <span>Book Shipment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
