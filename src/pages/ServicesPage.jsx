import React, { useState, useEffect, useRef } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { cargoCategories } from '../components/CargoTypeSelector';
import { 
  Plane, 
  Truck, 
  Ship, 
  Thermometer, 
  ArrowRight, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Package,
  Layers,
  ShieldCheck,
  Box,
  Compass,
  Lock,
  Sparkles,
  FileText,
  FileCheck,
  Shield
} from 'lucide-react';

const DynamicServiceGallery = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="w-full">
      <div className="relative group overflow-hidden rounded-2xl border border-slate-200 shadow-md h-80 bg-slate-950 flex items-center justify-center">
        {/* Ambient blurred backdrop for consistent edge filling */}
        <img
          key={`bg-${currentIndex}`}
          src={images[currentIndex]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-35 pointer-events-none"
        />

        {/* Shrunk, fully uncropped image displaying 100% of the graphic */}
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${title} view ${currentIndex + 1}`}
          className="relative z-1 max-h-full max-w-full object-contain p-2 transition-all duration-500 transform group-hover:scale-[1.02] animate-fade-in drop-shadow-md"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none z-2"></div>
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-orange-500 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 backdrop-blur-sm cursor-pointer z-10"
          title="Previous Image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-orange-500 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 backdrop-blur-sm cursor-pointer z-10"
          title="Next Image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'bg-orange-500 w-6'
                  : 'bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ServicesPage = ({ setActiveTab }) => {
  const { 
    setIsAuthModalOpen, 
    setAuthModalHideClose, 
    isAuthModalOpen, 
    currentUser, 
    setAuthRedirectTab,
    showToast 
  } = useLogistics();

  const [calculatorWeight, setCalculatorWeight] = useState(25);
  const [calculatorService, setCalculatorService] = useState('parcel');
  const [calculatorInsurance, setCalculatorInsurance] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(cargoCategories[0]?.id || 'beverages-food-plants');

  // Rate calculator: strict customer login and keep price as zero ($0.00)
  const estimatedTotal = "0.00";

  const requireLoginForCalculator = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('services');
      if (setAuthModalHideClose) setAuthModalHideClose(false);
      setIsAuthModalOpen(true);
      if (showToast) {
        showToast('Please sign in or create an account to use the freight rate calculator.', 'warning');
      }
      return false;
    }
    return true;
  };

  const handleBookServiceClick = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) {
        setAuthRedirectTab('book');
      }
      if (setAuthModalHideClose) {
        setAuthModalHideClose(false);
      }
      setIsAuthModalOpen(true);
      if (showToast) {
        showToast('Please sign in or create an account to book your shipment.', 'info');
      }
      return;
    }
    setActiveTab('book');
  };

  const servicesData = [
    {
      id: 'commercial-goods',
      anchorId: 'parcel-delivery',
      tabName: 'Commercial Goods',
      title: 'Commercial Goods Transportation',
      subtitle: 'Transportation support for moving commercial products from one location to another',
      icon: Package,
      images: [
        '/assets/parcel_delivery_handover.png',
        '/assets/vehicle_motorbike.jpg',
        '/assets/vehicle_mpv.jpg'
      ],
      desc: [
        'Transportation support for businesses moving commercial products and goods from one location to another through a network of transportation partners.',
        'From packaged merchandise to business inventory, every shipment is coordinated with dependable care.'
      ],
      features: [
        'Dedicated commercial cargo movement',
        'Coordinated pickup and delivery schedules',
        'Verified delivery handover records'
      ]
    },
    {
      id: 'shipment-transportation',
      anchorId: 'bulk-shipment',
      tabName: 'Shipment Transport',
      title: 'Shipment Transportation Coordination',
      subtitle: 'Coordination of transportation arrangements based on shipment requirements',
      icon: Layers,
      images: [
        '/assets/bulk_shipment_containers.png',
        '/assets/clean_domestic_truck.jpg',
        'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80'
      ],
      desc: 'Transport planning matched to consignment volume and schedule requirements. Josan organizes vehicle matching through trusted transport partners for point-to-point transit without unnecessary intermediate handling.',
      features: [
        'Arrangements matched to cargo specifications',
        'Organized vehicle matching through partner network',
        'Direct origin-to-destination transit coordination',
        'Careful dispatch management from pickup point'
      ]
    },
    {
      id: 'partner-vehicle-network',
      anchorId: 'intra-city-transport',
      tabName: 'Partner Vehicles',
      title: 'Transportation Partner Network',
      subtitle: 'Access to transportation partners to support commercial cargo movement',
      icon: Truck,
      images: [
        '/assets/intra_city_logistics_route.png',
        '/assets/lorry_14ft_tailgate.jpg',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
      ],
      desc: 'Access to a network of vetted third-party commercial transport operators to support business cargo movement between locations, fulfillment centers, and distribution points.',
      features: [
        'Network of vetted third-party transport operators',
        'Diverse vehicle support tailored to shipment needs',
        'Flexible arrangements for recurring commercial runs',
        'Scheduled delivery window coordination'
      ]
    },
    {
      id: 'road-shipment-coordination',
      anchorId: 'inter-city-logistics',
      tabName: 'Shipment Coordination',
      title: 'Road Shipment Coordination',
      subtitle: 'Support with coordinating pickup, transportation and delivery requirements',
      icon: Compass,
      images: [
        '/assets/inter_city_highway_corridor.png',
        'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
      ],
      desc: 'End-to-end coordination of road transportation requirements, connecting origins and destinations with clear documentation, dispatch oversight, and verified delivery receipt.',
      features: [
        'Coordinated pickup and destination scheduling',
        'Clear consignment details and documentation support',
        'Active communication between shipper, carrier and recipient',
        'Transit records and verified handover documentation'
      ]
    }
  ];

  const activeCategory = cargoCategories.find(c => c.id === selectedCategoryTab) || cargoCategories[0];

  // 4 Primary Airway Services for Services Page
  const airServicesList = [
    {
      id: 'awb-prep',
      title: 'AWB Preparation',
      badge: 'Air Documentation',
      desc: 'Preparation of Air Waybill details based on shipment information, flight routing, and consignor specifications.',
      specs: ['Accurate flight & cargo details', 'Standardized AWB documentation', 'Origin to destination alignment']
    },
    {
      id: 'awb-billing',
      title: 'AWB Billing',
      badge: 'Billing Support',
      desc: 'Billing support associated with Air Waybill and air shipment documentation for commercial consignments.',
      specs: ['Transparent charge breakdown', 'Consignment paperwork alignment', 'Billing verification support']
    },
    {
      id: 'shipment-docs',
      title: 'Shipment Documentation',
      badge: 'Paperwork Organization',
      desc: 'Preparation and organization of required air shipment information and documents for commercial cargo.',
      specs: ['Commercial paperwork review', 'Harmonized cargo descriptions', 'Complete package details']
    },
    {
      id: 'air-transport-support',
      title: 'Air Transportation Support',
      badge: 'Transportation Support',
      desc: 'Transportation coordination for moving goods through the required logistics network to destination airports.',
      specs: ['Commercial goods movement', 'Transport network coordination', 'Shipment handover records']
    }
  ];

  // 6 Customs & Shipment Documentation Support Services
  const customsDocServicesList = [
    {
      id: 'commercial-invoice',
      title: 'Commercial Invoice',
      badge: 'Shipment Valuation',
      desc: 'Support for organizing commercial invoice information required for shipments.',
      specs: [
        'Itemized goods descriptions & valuation support',
        'Consignor and consignee entity verification',
        'Export and import invoice formatting'
      ],
      icon: FileText
    },
    {
      id: 'packing-list',
      title: 'Packing List',
      badge: 'Cargo Details',
      desc: 'Documentation containing shipment/package details for transportation and applicable customs processes.',
      specs: [
        'Detailed piece count, dimensions & packaging specs',
        'Gross and net weight documentation',
        'Pallet and package cargo breakdown'
      ],
      icon: Layers
    },
    {
      id: 'air-waybill',
      title: 'Air Waybill (AWB)',
      badge: 'Air Cargo Records',
      desc: 'Support for preparing and organizing AWB-related shipment information.',
      specs: [
        'Master and House AWB information preparation',
        'Cargo volume & routing documentation',
        'AWB billing and consignment paperwork'
      ],
      icon: Plane
    },
    {
      id: 'certificate-of-origin',
      title: 'Certificate of Origin',
      badge: 'Origin Verification',
      desc: 'Documentation support for origin-related shipment requirements.',
      specs: [
        'Origin certificate paperwork assistance',
        'Trade agreement compliance documentation',
        'Manufacturer and production origin records'
      ],
      icon: FileCheck
    },
    {
      id: 'customs-documentation',
      title: 'Customs Documentation',
      badge: 'Customs Processes',
      desc: 'Support for preparing and organizing documents required for applicable customs processes.',
      specs: [
        'Organization of applicable customs paperwork',
        'Document coordination for export & import stages',
        'Paperwork preparation for inspection requirements'
      ],
      icon: ShieldCheck
    },
    {
      id: 'insurance-documentation',
      title: 'Insurance Documentation',
      badge: 'Risk & Protection',
      desc: 'Support for organizing insurance-related shipment documents when required.',
      specs: [
        'Declared shipment cargo value documentation',
        'Insurance certificate coordination',
        'Consignment protection paperwork records'
      ],
      icon: Shield
    }
  ];

  const airGalleryImages = [
    '/assets/air_cargo_freighter_hero.jpg',
    '/assets/export_air_freight_cargo.jpg',
    '/assets/air_freight_temperature_cargo.jpg',
    '/assets/air_cargo_documentation_awb.jpg'
  ];

  return (
    <div className="space-y-20 pb-24">
      
      {/* Header Banner */}
      <section className="bg-[#10182D] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-amber-400 font-bold uppercase text-xs tracking-widest bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-700/80 inline-flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Multimodal Freight &amp; Logistics Solutions</span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
            Comprehensive Logistics Services
          </h1>
          <p className="text-white/90 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            International air cargo solutions, dedicated overland trucking fleets, customs brokerage, and cold-chain distribution with real-time end-to-end telematics.
          </p>

          {/* 3 Clear Primary Service Option Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('air-freight');
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-black rounded-xl border border-sky-400 shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Plane className="w-4 h-4" />
              <span>AIRWAY SERVICES</span>
            </button>
            <a
              href="#road-transportation"
              className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E55C00] text-white text-xs font-black rounded-xl border border-orange-400 shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>COMMERCIAL ROAD TRANSPORTATION</span>
            </a>
            <a
              href="#customs-documentation-services"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold rounded-xl border border-slate-600 shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>CUSTOMS &amp; SHIPMENT DOCUMENTATION SUPPORT</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3 Clear Clickable Service Cards (Equal Visual Importance) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Air Freight */}
          <div 
            onClick={() => {
              setActiveTab('air-freight');
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-2xl hover:border-[#FF6B00] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-900 relative">
                <img 
                  src="/assets/air_freight_cargo_hero.jpg" 
                  alt="Air Freight" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" 
                />
                <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 text-[#FF6B00] shadow-xs flex items-center justify-center backdrop-blur-xs font-bold">
                  <Plane className="w-5 h-5" />
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-950 bg-orange-100/90 px-2.5 py-1 rounded-full border border-orange-300">
                    Dedicated Page
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#FF6B00] uppercase tracking-wider block">Service 01</span>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#FF6B00] transition-colors">
                  Air Freight
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Time-critical international air cargo flights, express consolidations, temperature-controlled pharma and airport-to-door transit.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#FF6B00] group-hover:translate-x-1 transition-transform">
              <span>Explore Air Freight (/air-freight)</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Road Freight */}
          <div 
            onClick={() => {
              setActiveTab('road-freight');
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-2xl hover:border-orange-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-900 relative">
                <img 
                  src="/assets/road_transportation_hero.jpg" 
                  alt="Road Freight" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 text-[#FF6B00] shadow-xs flex items-center justify-center backdrop-blur-xs font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-900 bg-orange-100/90 px-2.5 py-1 rounded-full border border-orange-300">
                    Fleet &amp; Haulage
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#FF6B00] uppercase tracking-wider block">Service 02</span>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#FF6B00] transition-colors">
                  Road Freight
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Dedicated road fleet including lorries, vans, and prime movers for express parcel delivery, bulk FTL linehaul and island-wide distribution.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#FF6B00] group-hover:translate-x-1 transition-transform">
              <span>Explore Road Freight Options</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Customs & Shipment Documentation Support */}
          <div 
            onClick={() => {
              setActiveTab('customs-clearance');
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-2xl hover:border-emerald-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-900 relative">
                <img 
                  src="/assets/customs_clearance_inspection.jpg" 
                  alt="Customs & Shipment Documentation Support" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 text-emerald-600 shadow-xs flex items-center justify-center backdrop-blur-xs font-bold">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300">
                    Documentation Support
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Service 03</span>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Customs &amp; Shipment Documentation Support
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  We support businesses with the preparation and organization of shipment and customs-related documentation required for commercial cargo movement.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>Explore Documentation Support</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1. AIR FREIGHT DETAILED SECTION                                           */}
      {/* ========================================================================= */}
      <section id="air-freight-services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-28">
        
        {/* Air Freight Spotlight Banner Card */}
        <div className="bg-gradient-to-br from-[#0A101D] via-[#10182D] to-slate-900 rounded-3xl p-8 sm:p-12 border border-sky-900/50 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-sky-300 font-bold uppercase text-xs tracking-widest bg-sky-950/80 px-3.5 py-1.5 rounded-full border border-sky-400/40 inline-flex items-center gap-2">
                <Plane className="w-3.5 h-3.5 text-sky-400" />
                <span>Primary Service &bull; Airway Documentation &amp; Transport</span>
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Airway Services &amp; AWB Documentation
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                Josan Logistics provides airway logistics support including Air Waybill preparation, billing, shipment documentation and transportation coordination for commercial goods.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('air-freight');
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-sky-900/30 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>Explore Dedicated Airway Page</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!currentUser) {
                      if (setAuthRedirectTab) setAuthRedirectTab('quote');
                      setIsAuthModalOpen(true);
                      if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
                      return;
                    }
                    setActiveTab('quote');
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8500] hover:from-[#E55C00] hover:to-[#FF6B00] text-white rounded-xl text-xs font-extrabold shadow-orange-xs transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>Get Airway Service Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dynamic Gallery for Air Operations */}
            <div className="lg:col-span-5">
              <DynamicServiceGallery images={airGalleryImages} title="Airway Cargo Documentation &amp; Support" />
            </div>
          </div>
        </div>

        {/* 4 Airway Capabilities Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-sky-700 font-bold uppercase text-xs tracking-wider bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200">
              Our Airway Services
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Airway Documentation Services
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Airway services focused on Air Waybill preparation, billing, shipment documentation and transportation support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {airServicesList.map((svc) => (
              <div 
                key={svc.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-card hover:border-orange-300 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-bold">
                      <Plane className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                      {svc.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 group-hover:text-[#FF6B00] transition-colors">
                      {svc.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                      {svc.desc}
                    </p>
                  </div>

                  <ul className="space-y-1.5 pt-1">
                    {svc.specs.map((spec, sIdx) => (
                      <li key={sIdx} className="text-[11px] text-slate-700 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('air-freight');
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-[#FF6B00] hover:text-[#E55C00] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentUser) {
                        if (setAuthRedirectTab) setAuthRedirectTab('quote');
                        setIsAuthModalOpen(true);
                        return;
                      }
                      setActiveTab('quote');
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-[#FF6B00] hover:text-[#E55C00] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Quote</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. ROAD FREIGHT (SECONDARY SERVICE SECTION)                                */}
      {/* ========================================================================= */}
      <div id="road-transportation" className="space-y-16 scroll-mt-28">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-slate-200 pt-16">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
              <span className="text-[#FF6B00] font-bold uppercase text-xs tracking-wider bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
                Primary Service &bull; Commercial Road Transportation
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
                Commercial Road Transportation
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Josan Logistics provides transportation support for businesses moving commercial goods and products from one location to another through a network of transportation partners.
              </p>

              {/* Road Workflow Capabilities Matrix */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 max-w-5xl mx-auto text-left">
                <a 
                  href="#parcel-delivery"
                  className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#FF6B00] hover:shadow-xs transition-all group"
                >
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Commercial Goods</span>
                  <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Business Products</span>
                  <span className="text-[10px] text-slate-500 font-medium">B2B cargo movement</span>
                </a>
                <a 
                  href="#bulk-shipment"
                  className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#FF6B00] hover:shadow-xs transition-all group"
                >
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Partner Network</span>
                  <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Transport Partners</span>
                  <span className="text-[10px] text-slate-500 font-medium">Third-party vehicles</span>
                </a>
                <a 
                  href="#intra-city-transport"
                  className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#FF6B00] hover:shadow-xs transition-all group"
                >
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Coordination</span>
                  <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Shipment Planning</span>
                  <span className="text-[10px] text-slate-500 font-medium">Origin to destination</span>
                </a>
                <a 
                  href="#inter-city-logistics"
                  className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#FF6B00] hover:shadow-xs transition-all group"
                >
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Cargo Movement</span>
                  <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Product Transfer</span>
                  <span className="text-[10px] text-slate-500 font-medium">Location to location</span>
                </a>
                <a 
                  href="#customs-documentation-services"
                  className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#FF6B00] hover:shadow-xs transition-all group cursor-pointer text-left"
                >
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Documentation</span>
                  <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Transport Records</span>
                  <span className="text-[10px] text-slate-500 font-medium">Consignment paperwork</span>
                </a>
                <a 
                  href="#cargo-types"
                  className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#FF6B00] hover:shadow-xs transition-all group"
                >
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Classifications</span>
                  <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Commercial Cargo</span>
                  <span className="text-[10px] text-slate-500 font-medium">Industrial &amp; retail</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Instant Shipping Rate Estimator Widget */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-subtle-gradient rounded-3xl p-8 sm:p-10 border-2 border-orange-200 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <span className="text-orange-600 font-bold uppercase text-xs tracking-widest bg-white px-3 py-1 rounded-full border border-orange-200">
                Interactive Estimator
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">Calculate Instant Freight Rate</h3>
              <p className="text-slate-800 font-semibold text-xs sm:text-sm">Adjust weight and service speed to get an instant estimate.</p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              
              {/* Strict Login Required Overlay when not logged in */}
              {!currentUser && (
                <div 
                  onClick={requireLoginForCalculator}
                  className="absolute inset-0 z-20 bg-slate-950/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center text-white cursor-pointer transition-all hover:bg-slate-950/75 animate-fade-in"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg mb-3">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">Customer Login Required</h4>
                  <p className="text-xs text-slate-300 max-w-xs mt-1 leading-relaxed">
                    Please sign in with your customer account to access the interactive rate estimator.
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      requireLoginForCalculator();
                    }}
                    className="mt-4 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    Sign In to Calculate
                  </button>
                </div>
              )}

              {/* Weight Slider */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Cargo Weight: <span className="text-orange-600 font-mono text-sm font-black">{calculatorWeight} kg</span>
                </label>

                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="5"
                    value={calculatorWeight}
                    disabled={!currentUser}
                    onChange={(e) => {
                      if (!requireLoginForCalculator()) return;
                      setCalculatorWeight(Number(e.target.value));
                    }}
                    className="w-full accent-orange-500 cursor-pointer disabled:opacity-40"
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0 kg</span>
                  <span>250 kg</span>
                  <span>500 kg</span>
                </div>
              </div>

              {/* Service Speed & Addons */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Service Mode</label>
                  <select
                    value={calculatorService}
                    disabled={!currentUser}
                    onChange={(e) => {
                      if (!requireLoginForCalculator()) return;
                      setCalculatorService(e.target.value);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus-orange cursor-pointer disabled:opacity-40"
                  >
                    <option value="air">Express Air Freight (Priority)</option>
                    <option value="parcel">Parcel Delivery</option>
                    <option value="bulk">Bulk Shipment &amp; FTL</option>
                    <option value="intra">Intra-city Transport</option>
                    <option value="inter">Inter-city Logistics</option>
                  </select>
                </div>

                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={calculatorInsurance}
                    disabled={!currentUser}
                    onChange={(e) => {
                      if (!requireLoginForCalculator()) return;
                      setCalculatorInsurance(e.target.checked);
                    }}
                    className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-400 accent-orange-500 cursor-pointer disabled:opacity-40"
                  />
                  <span>Add Full Cargo Insurance</span>
                </label>
              </div>

              {/* Total Estimated Box */}
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 text-center flex flex-col justify-center">
                <span className="text-[10px] font-bold uppercase text-orange-800 tracking-wider">Estimated Total Rate</span>
                <span className="text-3xl font-extrabold text-orange-600 font-mono">${estimatedTotal}</span>
                <span className="text-[10px] text-slate-500 mt-0.5 font-medium">
                  $0.00 (Custom quote provided upon booking)
                </span>
              </div>

            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleBookServiceClick}
                className="px-8 py-3.5 bg-orange-gradient hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl shadow-orange-glow transition-all inline-flex items-center space-x-2 cursor-pointer"
              >
                <span>Book Shipment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Detailed Road Services List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div id="freight-services-grid" className="sr-only" />
          {servicesData.map((service, index) => {
            const IconComp = service.icon;
            const isEven = index % 2 === 0;
            return (
              <div 
                key={service.id} 
                id={service.anchorId}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card scroll-mt-28 hover:border-orange-200 transition-all relative ${
                  !isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Direct ID Aliases for Navbar Dropdown items */}
                {service.id === 'parcel-delivery' && <div id="express-delivery" className="scroll-mt-28 -top-28 absolute" />}
                {service.id === 'bulk-shipment' && <div id="ftl-transportation" className="scroll-mt-28 -top-28 absolute" />}
                {service.id === 'inter-city-logistics' && <div id="ltl-transportation" className="scroll-mt-28 -top-28 absolute" />}

                {/* Details Column */}
              <div className={`lg:col-span-6 space-y-4 ${!isEven ? 'lg:order-2' : ''}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shadow-sm">
                    <IconComp className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                    {service.tabName}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{service.title}</h3>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{service.subtitle}</p>
                {Array.isArray(service.desc) ? (
                  <div className="space-y-2">
                    {service.desc.map((para, pIdx) => (
                      <p key={pIdx} className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {service.desc}
                  </p>
                )}
                
                <div className="pt-2 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Key Features:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs sm:text-[13px] font-bold text-slate-900">
                        <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center space-x-3">
                  <button
                    onClick={handleBookServiceClick}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all inline-flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Book Shipment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        if (setAuthRedirectTab) setAuthRedirectTab('quote');
                        setIsAuthModalOpen(true);
                        if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
                        return;
                      }
                      setActiveTab('quote');
                    }}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Get Instant Quote
                  </button>
                </div>
              </div>

              {/* Dynamic Image Gallery Column */}
              <div className={`lg:col-span-6 ${!isEven ? 'lg:order-1' : ''}`}>
                <DynamicServiceGallery images={service.images} title={service.title} />
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CUSTOMS & SHIPMENT DOCUMENTATION SUPPORT                               */}
      {/* ========================================================================= */}
      <section id="customs-documentation-services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-28 relative">
        <div id="customs-clearance-spotlight" className="scroll-mt-28 -top-28 absolute" />

        {/* Spotlight Banner Card */}
        <div className="bg-gradient-to-br from-[#0A101D] via-[#10182D] to-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4 text-left">
              <span className="text-emerald-400 font-bold uppercase text-xs tracking-widest bg-slate-800/90 px-3.5 py-1.5 rounded-full border border-emerald-500/30 inline-flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Service 03 &bull; Documentation Assistance</span>
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
                Customs &amp; Shipment Documentation Support
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                We support businesses with the preparation and organization of shipment and customs-related documentation required for commercial cargo movement.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('customs-clearance');
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-xl text-xs font-black shadow-lg shadow-orange-900/30 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>Request Documentation Support</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('customs-clearance');
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-extrabold border border-white/20 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 gap-3 text-left">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="block text-base font-black text-emerald-400">AWB &amp; Invoicing</span>
                <span className="text-[11px] text-slate-300 font-semibold block">Commercial Billing Prep</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="block text-base font-black text-white">Packing Lists</span>
                <span className="text-[11px] text-slate-300 font-semibold block">Cargo Breakdown Records</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="block text-base font-black text-white">Origin Certs</span>
                <span className="text-[11px] text-slate-300 font-semibold block">Trade Paperwork Support</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="block text-base font-black text-emerald-400">Customs Docs</span>
                <span className="text-[11px] text-slate-300 font-semibold block">Process Coordination</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Documentation Service Cards Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-emerald-700 font-bold uppercase text-xs tracking-wider bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              Shipment &amp; Customs Documentation
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Our Documentation Support Services
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Careful document preparation and verification to ensure smooth transport and regulatory compliance for commercial consignments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customsDocServicesList.map((svc) => {
              const Icon = svc.icon;
              return (
                <div 
                  key={svc.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-card hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4 group text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {svc.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {svc.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                        {svc.desc}
                      </p>
                    </div>

                    <ul className="space-y-1.5 pt-1">
                      {svc.specs.map((spec, sIdx) => (
                        <li key={sIdx} className="text-[11px] text-slate-700 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('customs-clearance');
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('customs-clearance');
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-[#FF6B00] hover:text-[#E55C00] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Request Support</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. OTHER LOGISTICS SERVICES & CARGO CLASSIFICATION                        */}
      {/* ========================================================================= */}
      <section id="cargo-types" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 relative">
        <div id="specialized-cargo" className="scroll-mt-28 -top-28 absolute" />
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-card space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-orange-600 font-bold uppercase text-xs tracking-widest bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200 inline-block">
              Commodity Classification &amp; Specialized Logistics
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Supported Cargo Types &amp; Other Logistics Services
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Josan Logistics handles over 10 major commercial cargo categories and hundreds of subcategories, with customized securing protocols, cold chain monitoring, bonded storage, and specialized freight equipment.
            </p>
          </div>

          {/* Industry Category Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-100 pb-4">
            {cargoCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryTab(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                    selectedCategoryTab === cat.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  <Icon className="w-4 h-4 text-orange-400" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Category Display Box */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-sm">
                  {React.createElement(activeCategory.icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{activeCategory.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Approved for Air Freight, Road Transport, FTL, LTL &amp; Cross-Border Delivery</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!currentUser) {
                    if (setAuthRedirectTab) setAuthRedirectTab('quote');
                    setIsAuthModalOpen(true);
                    if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
                    return;
                  }
                  setActiveTab('quote');
                }}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-sm transition-all inline-flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
              >
                <span>Quote for {activeCategory.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-6">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
                Accepted Cargo Subcategories:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeCategory.subcategories.map((sub, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center space-x-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:border-orange-300 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
