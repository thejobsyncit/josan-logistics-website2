import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import heroLogisticsImg from '../assets/hero_logistics_3d.jpg';
import { 
  Search, 
  Truck, 
  Package, 
  Thermometer, 
  ShieldCheck, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  ChevronRight, 
  TrendingUp, 
  Calculator, 
  MapPin, 
  Zap, 
  FileText, 
  Phone, 
  Mail, 
  Building,
  Layers,
  Send,
  HelpCircle,
  Calendar
} from 'lucide-react';

export const HomePage = ({ setActiveTab }) => {
  const { 
    currentUser, 
    setIsAuthModalOpen, 
    resetShipmentScope, 
    setActiveTrackingId,
    showToast 
  } = useLogistics();

  // Track Shipment Inline Form State
  const [trackQuery, setTrackQuery] = useState('');
  const [activeTrackingResult, setActiveTrackingResult] = useState(null);

  // Quick Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleAction = (tab) => {
    if (!currentUser && (tab === 'book' || tab === 'domestic-shipment' || tab === 'international-shipment')) {
      setIsAuthModalOpen(true);
    } else if (tab === 'book' || tab === 'domestic-shipment') {
      resetShipmentScope();
      setActiveTab('domestic-shipment');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const handleInlineTrack = (e) => {
    if (e) e.preventDefault();
    const query = (trackQuery || '').trim().toUpperCase();
    if (!query) {
      // Default demo shipment lookup
      const defaultId = 'JOS-88190-SG';
      setActiveTrackingId(defaultId);
      setActiveTrackingResult({
        id: defaultId,
        status: 'In Transit',
        pickup: 'Jurong Central Highway Freight Hub',
        currentLocation: 'PIE Expressway Telematics Gate (Exit 19)',
        destination: 'Woodlands Roadways Terminal',
        estimatedDelivery: 'Today, 4:30 PM (SGT)',
        timelineStep: 3 // 1: Booked, 2: Pickup, 3: In Transit, 4: Near Destination, 5: Delivered
      });
      return;
    }

    setActiveTrackingId(query);
    setActiveTrackingResult({
      id: query,
      status: query.includes('DEL') ? 'Delivered' : 'In Transit',
      pickup: 'Pasir Panjang Port Terminal',
      currentLocation: 'AYE Expressway Telematics Corridor',
      destination: 'Changi Logistics Park Bay 4',
      estimatedDelivery: 'Today, 5:15 PM (SGT)',
      timelineStep: query.includes('DEL') ? 5 : 3
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      if (showToast) showToast('Please complete all required fields.', 'warning');
      return;
    }
    setContactSubmitted(true);
    if (showToast) showToast('Thank you! Your message has been sent to our Singapore operations desk.', 'success');
  };

  return (
    <div className="space-y-10 sm:space-y-20 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Orange + Dark Navy + White, 56px Outfit Heading)        */}
      {/* ========================================================================= */}
      <section className="relative pt-6 pb-8 sm:pt-14 sm:pb-16 overflow-hidden bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8F2] border border-[#FF6B00]/20 text-xs font-semibold text-[#FF6B00]">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse"></span>
                <span>Singapore & Regional Freight Network</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[#10182D] leading-[1.12]">
                Smart Overland Freight & <br className="hidden sm:inline" />
                <span className="text-[#FF6B00]">Supply Chain Logistics</span>
              </h1>

              <p className="text-[#10182D] text-base sm:text-lg leading-relaxed max-w-xl font-bold">
                Josan Logistics delivers high-reliability overland trucking, express parcel linehaul, and active cold chain solutions. Equipped with live 24/7 telematics, verified Lorry Receipts, and guaranteed delivery timelines.
              </p>

              {/* Action Buttons: Get a Quote (Primary Orange) + Book Shipment (Dark Navy) */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => handleAction('quote')}
                  className="btn-primary cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Get a Quote</span>
                </button>

                <button
                  onClick={() => handleAction('book')}
                  className="btn-secondary cursor-pointer"
                >
                  <Package className="w-4 h-4 text-[#FF6B00]" />
                  <span>Book Shipment</span>
                </button>
              </div>

              {/* Fast feature highlights */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-bold text-[#10182D]">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>GPS Telematics Included</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>All-Risk Cargo Insurance</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>TradeNet Compliant</span>
                </span>
              </div>

            </div>

            {/* Right Hero 3D Logistics Artwork */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-card border border-[#E2E8F0] bg-white group flex flex-col">
                <div className="relative overflow-hidden bg-white w-full">
                  <img
                    src={heroLogisticsImg}
                    onError={(e) => {
                      if (!e.target.dataset.fallback1) {
                        e.target.dataset.fallback1 = 'true';
                        e.target.src = '/assets/hero_logistics_3d.jpg';
                      } else if (!e.target.dataset.fallback2) {
                        e.target.dataset.fallback2 = 'true';
                        e.target.src = '/hero_logistics_3d.jpg';
                      } else {
                        e.target.onerror = null;
                      }
                    }}
                    alt="Josan Logistics 3D Global Freight Fleet"
                    className="w-full h-auto object-contain block group-hover:scale-[1.01] transition-transform duration-500"
                  />
                </div>
                
                {/* Telematics Bar */}
                <div className="bg-[#10182D] px-5 py-3.5 border-t border-[#10182D] text-white flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center font-bold shrink-0">
                      <Truck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs sm:text-sm">Active Highway Linehaul Fleet</p>
                      <p className="text-[11px] text-slate-300">Singapore Islandwide • Johor & Regional Corridors</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#16A34A] bg-[#16A34A]/10 border border-[#16A34A]/30 px-3 py-1 rounded-full shrink-0">
                    Live Dispatch: 100% Active
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Key Statistics Bar */}
          <div className="mt-8 sm:mt-16 pt-6 sm:pt-10 border-t border-[#E2E8F0] grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
            <div className="space-y-1 p-2 sm:p-0 flex flex-col items-center justify-start">
              <p className="text-lg min-[390px]:text-xl min-[480px]:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FF6B00] font-heading tracking-tight whitespace-nowrap">
                3,500,000+
              </p>
              <p className="text-[11px] min-[390px]:text-xs sm:text-sm font-extrabold text-[#10182D] leading-snug">
                Business Opportunities / Year
              </p>
            </div>
            <div className="space-y-1 p-2 sm:p-0 flex flex-col items-center justify-start">
              <p className="text-lg min-[390px]:text-xl min-[480px]:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FF6B00] font-heading tracking-tight whitespace-nowrap">
                $4,000,000,000+
              </p>
              <p className="text-[11px] min-[390px]:text-xs sm:text-sm font-extrabold text-[#10182D] leading-snug">
                Payment Volume Managed
              </p>
            </div>
            <div className="space-y-1 p-2 sm:p-0 flex flex-col items-center justify-start">
              <p className="text-lg min-[390px]:text-xl min-[480px]:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FF6B00] font-heading tracking-tight whitespace-nowrap">
                $150,000
              </p>
              <p className="text-[11px] min-[390px]:text-xs sm:text-sm font-extrabold text-[#10182D] leading-snug">
                Risk Protection / Consignment
              </p>
            </div>
            <div className="space-y-1 p-2 sm:p-0 flex flex-col items-center justify-start">
              <p className="text-lg min-[390px]:text-xl min-[480px]:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FF6B00] font-heading tracking-tight whitespace-nowrap">
                60,000+
              </p>
              <p className="text-[11px] min-[390px]:text-xs sm:text-sm font-extrabold text-[#10182D] leading-snug">
                Commercial Enterprise Clients
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRACK SHIPMENT (High Visibility Section directly following Hero)     */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-premium p-5 sm:p-10 border-2 border-[#E2E8F0] shadow-card space-y-6 sm:space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-6">
            <div>
              <span className="text-[#FF6B00] font-semibold uppercase text-xs tracking-wider bg-[#FFF8F2] px-3 py-1 rounded-full border border-[#FF6B00]/20">
                Instant Tracking
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10182D] mt-2 font-heading">
                Track Your Shipment
              </h2>
              <p className="text-[#10182D] text-xs sm:text-sm mt-1 font-bold">
                Enter your consignment, container or Lorry Receipt (LR) tracking number to view real-time telematics.
              </p>
            </div>

            {/* Quick Demo Fillers */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#1E293B]">
              <span className="font-bold shrink-0">Try sample:</span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {['JOS-88190-SG', 'JOS-44021-SG', 'JOS-66301-SG'].map((sampleId) => (
                  <button
                    key={sampleId}
                    type="button"
                    onClick={() => {
                      setTrackQuery(sampleId);
                      setActiveTrackingId(sampleId);
                      setActiveTrackingResult({
                        id: sampleId,
                        status: sampleId === 'JOS-66301-SG' ? 'Delivered' : sampleId === 'JOS-44021-SG' ? 'Out for Delivery' : 'In Transit',
                        pickup: sampleId === 'JOS-66301-SG' ? 'Tuas Mega Cold Hub' : sampleId === 'JOS-44021-SG' ? 'Pasir Panjang Berth 5' : 'Jurong Central Highway Depot',
                        currentLocation: sampleId === 'JOS-66301-SG' ? 'Biopolis Medical Dock' : sampleId === 'JOS-44021-SG' ? 'AYE Expressway Corridor' : 'PIE Expressway Exit 19',
                        destination: sampleId === 'JOS-66301-SG' ? 'Biopolis Biomedical Grove' : 'Woodlands Tech Park',
                        estimatedDelivery: sampleId === 'JOS-66301-SG' ? 'Delivered Today' : 'Today, 4:30 PM (SGT)',
                        timelineStep: sampleId === 'JOS-66301-SG' ? 5 : sampleId === 'JOS-44021-SG' ? 4 : 3
                      });
                    }}
                    className="font-mono font-semibold px-2.5 py-1 rounded bg-[#F5F6F8] hover:bg-[#FFF8F2] hover:text-[#FF6B00] border border-[#E2E8F0] transition-colors cursor-pointer text-xs"
                  >
                    {sampleId}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Bar: [ Shipment ID ] [ Track ] */}
          <form onSubmit={handleInlineTrack} className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Shipment ID (e.g. JOS-88190-SG)"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="input-standard pl-11 font-mono font-semibold text-sm sm:text-base text-[#10182D]"
              />
              <Search className="w-5 h-5 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="btn-secondary h-11 sm:h-12 px-8 cursor-pointer shrink-0"
            >
              <span>Track</span>
              <ArrowRight className="w-4 h-4 text-[#FF6B00]" />
            </button>
          </form>

          {/* Real-Time Tracking Details Card */}
          {activeTrackingResult && (
            <div className="bg-[#F5F6F8] rounded-xl p-5 sm:p-7 border border-[#E2E8F0] space-y-6 animate-fade-in">
              
              {/* Header Info Grid: ID, Status, Pickup, Location, Destination, ETA */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 border-b border-[#E2E8F0] pb-6">
                <div>
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">Shipment ID</span>
                  <span className="font-mono font-bold text-sm sm:text-base text-[#10182D] block mt-0.5">
                    {activeTrackingResult.id}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">Current Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${
                    activeTrackingResult.status === 'Delivered'
                      ? 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30'
                      : 'bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>{activeTrackingResult.status}</span>
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">Pickup</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#10182D] block mt-0.5 truncate">
                    {activeTrackingResult.pickup}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">Current Location</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#10182D] block mt-0.5 truncate">
                    {activeTrackingResult.currentLocation}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">Destination</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#10182D] block mt-0.5 truncate">
                    {activeTrackingResult.destination}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">Estimated Delivery</span>
                  <span className="text-xs sm:text-sm font-bold text-[#10182D] block mt-0.5">
                    {activeTrackingResult.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* 5-Stage Milestone Timeline: Booked → Pickup → In Transit → Near Destination → Delivered */}
              <div>
                <span className="text-xs font-bold text-[#10182D] uppercase tracking-wider block mb-4">
                  Consignment Milestone Progression
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { step: 1, label: 'Booked', desc: 'Manifest created' },
                    { step: 2, label: 'Pickup', desc: 'Loaded & checked' },
                    { step: 3, label: 'In Transit', desc: 'Highway telemetry' },
                    { step: 4, label: 'Near Destination', desc: 'Last mile dispatch' },
                    { step: 5, label: 'Delivered', desc: 'Digital POD signed' }
                  ].map((milestone) => {
                    const isPassed = activeTrackingResult.timelineStep >= milestone.step;
                    const isCurrent = activeTrackingResult.timelineStep === milestone.step;
                    return (
                      <div 
                        key={milestone.step}
                        className={`p-3 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-white border-[#FF6B00] shadow-sm'
                            : isPassed
                            ? 'bg-white border-[#16A34A]/40'
                            : 'bg-white/60 border-[#E2E8F0] opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                            isCurrent
                              ? 'bg-[#FF6B00] text-white'
                              : isPassed
                              ? 'bg-[#16A34A] text-white'
                              : 'bg-[#E2E8F0] text-[#64748B]'
                          }`}>
                            {isPassed ? '✓' : milestone.step}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-[#FF6B00] uppercase">Active</span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-[#10182D]">{milestone.label}</p>
                        <p className="text-[11px] text-[#64748B] mt-0.5">{milestone.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Link to Full Tracker */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('track');
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-[#FF6B00] hover:text-[#E55C00] cursor-pointer"
                >
                  <span>Open Full Satellite Telematics Map</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SERVICES (Road, FTL, LTL, Express, Specialized, Customs, Cargo Types)  */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[#FF6B00] font-semibold uppercase text-xs tracking-wider bg-[#FFF8F2] px-3 py-1 rounded-full border border-[#FF6B00]/20">
            Logistics Solutions
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#10182D] font-heading">
            Comprehensive Freight & Overland Services
          </h2>
          <p className="text-[#1E293B] text-sm sm:text-base font-medium">
            Precision road linehaul, consolidated partial loads, temperature-controlled active fleets, and customs clearance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Truck,
              title: 'Road Transportation',
              desc: 'Dedicated overland highway network connecting all Singapore logistics clusters, ports, and cross-border customs checkpoints.',
              badge: 'Highway Network',
              tab: 'services'
            },
            {
              icon: Package,
              title: 'Full Truckload (FTL)',
              desc: 'Exclusive point-to-point dedicated 24ft box trucks and prime movers for high-volume palletized enterprise cargo.',
              badge: 'Direct Haulage',
              tab: 'domestic-shipment'
            },
            {
              icon: Layers,
              title: 'Less-Than-Truckload (LTL)',
              desc: 'Economical consolidated runs for 1 to 10 pallets with daily scheduled hub departures and computerized tracking.',
              badge: 'Consolidated Runs',
              tab: 'quote'
            },
            {
              icon: Zap,
              title: 'Express Delivery',
              desc: 'Under 4-hour urgent courier dispatch utilizing light commercial vehicles and sprinter vans across Singapore.',
              badge: 'Same-Day Priority',
              tab: 'domestic-shipment'
            },
            {
              icon: Thermometer,
              title: 'Specialized Cargo & Reefer',
              desc: 'Strict multi-temp regulation (-25°C to +25°C) with dual-probe IoT telematics for pharmaceutical and food cold chains.',
              badge: 'Cold Chain GDP',
              tab: 'services'
            },
            {
              icon: ShieldCheck,
              title: 'Customs Clearance',
              desc: 'Certified Singapore TradeNet electronic permit filing, duty processing, bond declarations, and terminal port release.',
              badge: 'TradeNet Certified',
              tab: 'customs-clearance'
            }
          ].map((service, idx) => {
            const IconComp = service.icon;
            return (
              <div
                key={idx}
                className="card-premium flex flex-col justify-between space-y-4 hover:shadow-subtle hover:border-[#FF6B00]/40 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#FFF8F2] text-[#FF6B00] flex items-center justify-center border border-[#FF6B00]/10">
                      <IconComp className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#FF6B00] bg-[#FFF8F2] px-2.5 py-0.5 rounded-full border border-[#FF6B00]/20">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#10182D] font-heading">
                    {service.title}
                  </h3>
                  <p className="text-[#10182D] text-xs sm:text-sm leading-relaxed font-bold">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => handleAction(service.tab)}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#FF6B00] hover:text-[#E55C00] cursor-pointer"
                  >
                    <span>Explore Service</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS (Structured 4-Step Lifecycle)                              */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[#FF6B00] font-semibold uppercase text-xs tracking-wider bg-[#FFF8F2] px-3 py-1 rounded-full border border-[#FF6B00]/20">
            Process Overview
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#10182D] font-heading">
            How Josan Logistics Works
          </h2>
          <p className="text-[#10182D] text-sm sm:text-base font-extrabold">
            A frictionless 4-step workflow from consignment specification to verified digital delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Specify Cargo & Route',
              desc: 'Select your freight classification, package dimensions, cargo weight, and pickup/destination terminals in Singapore.'
            },
            {
              step: '02',
              title: 'Get Transparent Quote',
              desc: 'Receive transparent rate calculations without hidden surcharges, including toll clearance and insurance options.'
            },
            {
              step: '03',
              title: 'Rapid Fleet Dispatch',
              desc: 'Dedicated driver and road-ready vehicle assigned immediately with computerized Lorry Receipt (LR) issuance.'
            },
            {
              step: '04',
              title: 'Live Telematics & POD',
              desc: 'Monitor real-time GPS coordinates, speed, and temperature telemetry right through to electronic proof-of-delivery.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="card-premium relative overflow-hidden flex flex-col justify-between space-y-3 hover:border-[#FF6B00]/30 transition-all shadow-sm"
            >
              <div>
                <span className="text-3xl font-black text-[#FF6B00] font-heading block mb-2">
                  {item.step}
                </span>
                <h3 className="text-base font-extrabold text-[#10182D] font-heading mb-1.5">
                  {item.title}
                </h3>
                <p className="text-[#10182D] text-xs sm:text-sm leading-relaxed font-bold">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. FLEET (Public Fleet Section with Real Images & Specifications)         */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[#FF6B00] font-semibold uppercase text-xs tracking-wider bg-[#FFF8F2] px-3 py-1 rounded-full border border-[#FF6B00]/20">
              Commercial Fleet
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#10182D] font-heading mt-2">
              Our Road & Highway Vehicle Fleet
            </h2>
            <p className="text-[#1E293B] text-sm sm:text-base font-medium mt-1 max-w-xl">
              From compact high-cube delivery vans to multi-axle 24T prime movers, all vehicles are inspected daily and GPS telematics equipped.
            </p>
          </div>

          <button
            onClick={() => handleAction('fleet')}
            className="btn-outline cursor-pointer shrink-0"
          >
            <span>View All Fleet Specifications</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: '1.7T Sprinter Delivery Van',
              img: '/assets/van_1_7m.jpg',
              category: 'Light Commercial (LCV)',
              payload: '1,500 kg',
              volume: '12.5 m³',
              cargo: 'Express cartons, electronics, ecommerce parcels'
            },
            {
              name: '10T Rigid Box Lorry',
              img: '/assets/vehicle_10ft_lorry.jpg',
              category: 'Medium Commercial (MCV)',
              payload: '8,500 kg',
              volume: '38.0 m³',
              cargo: 'Palletized goods, machinery parts, warehouse linehaul'
            },
            {
              name: '24T Multi-Axle Prime Mover',
              img: '/assets/lorry_24ft_heavy.jpg',
              category: 'Heavy Commercial (HCV)',
              payload: '24,000 kg',
              volume: '76.0 m³',
              cargo: 'Heavy industrial cargo, 40ft container haulage'
            },
            {
              name: 'Multi-Temp Reefer Van',
              img: '/assets/vehicle_cold_chain.jpg',
              category: 'Cold Chain (-25°C to +25°C)',
              payload: '5,000 kg',
              volume: '26.0 m³',
              cargo: 'Vaccines, pharmaceuticals, fresh meat, perishable foods'
            }
          ].map((v, idx) => (
            <div
              key={idx}
              className="card-premium overflow-hidden p-0 flex flex-col justify-between hover:shadow-subtle transition-all"
            >
              <div className="relative h-44 bg-[#F5F6F8] overflow-hidden">
                <img
                  src={v.img}
                  alt={v.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10182D]/80 text-white backdrop-blur-xs">
                  {v.category}
                </span>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#10182D] font-heading">{v.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    <div>
                      <span className="text-[11px] text-[#1E293B] block uppercase font-bold tracking-wider">Max Payload</span>
                      <span className="font-mono font-black text-[#10182D] text-sm">{v.payload}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#1E293B] block uppercase font-bold tracking-wider">Cargo Volume</span>
                      <span className="font-mono font-black text-[#10182D] text-sm">{v.volume}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#1E293B] font-medium pt-2.5 leading-relaxed">
                    <strong className="text-[#10182D] font-extrabold">Suitable for:</strong> {v.cargo}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => handleAction('book')}
                    className="w-full py-2.5 bg-[#10182D] hover:bg-[#FF6B00] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <span>Dispatch This Vehicle</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 6. COVERAGE (Singapore Strategic Hubs & Corridors)                       */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[#FF6B00] font-semibold uppercase text-xs tracking-wider bg-[#FFF8F2] px-3 py-1 rounded-full border border-[#FF6B00]/20">
            Network Coverage
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#10182D] font-heading">
            Key Terminals & Highway Corridors
          </h2>
          <p className="text-[#1E293B] text-sm sm:text-base font-medium">
            Direct daily express routes serving major aviation cargo centers, industrial clusters, and seaports.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { hub: 'Changi Airfreight', tag: 'Aviation Cargo Hub', code: 'SIN-AIR' },
            { hub: 'Tuas Mega Port', tag: 'Maritime Gateway', code: 'TUA-SEA' },
            { hub: 'Pasir Panjang', tag: 'Container Terminals', code: 'PSP-PORT' },
            { hub: 'Woodlands North', tag: 'Cross-Border Highway', code: 'WDL-BDR' },
            { hub: 'Jurong Island', tag: 'Petrochemical Depot', code: 'JUR-GATE' },
            { hub: 'Tampines LogisPark', tag: 'Eastern Distribution', code: 'TMP-LOG' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="card-premium p-4 text-center space-y-1 hover:border-[#FF6B00]/40 transition-all shadow-sm"
            >
              <span className="font-mono text-[11px] font-black text-[#FF6B00] bg-[#FFF8F2] px-2.5 py-0.5 rounded border border-[#FF6B00]/30 inline-block">
                {item.code}
              </span>
              <p className="text-sm font-extrabold text-[#10182D] pt-1">{item.hub}</p>
              <p className="text-xs font-bold text-[#10182D]">{item.tag}</p>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 7. WHY CHOOSE JOSAN LOGISTICS (Dark Navy #10182D Container)              */}
      {/* ========================================================================= */}
      <section className="bg-[#10182D] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[#FF6B00] font-semibold uppercase text-xs tracking-wider bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
                The Josan Standard
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading leading-tight text-white">
                Why Enterprise Shippers Choose Josan Logistics
              </h2>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
                We combine modern IoT hardware, automated dispatch algorithms, and a customer-first operations culture to eliminate highway freight bottlenecks.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => handleAction('quote')}
                  className="btn-primary cursor-pointer"
                >
                  <span>Request Corporate Rates</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  icon: Navigation,
                  title: 'Real-Time GPS Telematics',
                  desc: 'Every vehicle and trailer is satellite connected, broadcasting live velocity, geofence status, and location.'
                },
                {
                  icon: TrendingUp,
                  title: 'Automated AI Routing',
                  desc: 'Smart highway dispatching recalculates route corridors around congestion and checkpoint delays.'
                },
                {
                  icon: Clock,
                  title: 'Guaranteed SLA Delivery',
                  desc: '99.8% on-time delivery rate backed by transparent performance monitoring and e-manifests.'
                },
                {
                  icon: ShieldCheck,
                  title: 'End-to-End Cargo Cover',
                  desc: 'Comprehensive all-risk freight insurance protection up to $150,000 replacement value.'
                }
              ].map((item, i) => {
                const IconComp = item.icon;
                return (
                  <div key={i} className="bg-[#1A243F] border border-white/10 p-6 rounded-2xl hover:border-[#FF6B00]/40 transition-all">
                    <div className="w-11 h-11 rounded-xl bg-[#FF6B00]/15 text-[#FF6B00] flex items-center justify-center mb-4">
                      <IconComp className="w-5 h-5 stroke-[2]" />
                    </div>
                    <h3 className="text-base font-bold text-white font-heading mb-2">{item.title}</h3>
                    <p className="text-slate-300 text-xs leading-relaxed font-medium">{item.desc}</p>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. GET A QUOTE CTA BANNER                                                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF8F2] border-2 border-[#FF6B00]/30 rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-[#FF6B00] font-semibold text-xs uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10182D] font-heading">
              Ready To Calculate Instant Freight Rates?
            </h2>
            <p className="text-[#1E293B] text-sm sm:text-base font-medium">
              Get an accurate quotation based on cargo weight, route corridor, and service SLA in under 60 seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => handleAction('quote')}
              className="btn-primary h-12 px-8 cursor-pointer w-full sm:w-auto"
            >
              <Calculator className="w-4 h-4" />
              <span>Get a Quote Now</span>
            </button>
            <button
              onClick={() => handleAction('contact')}
              className="btn-secondary h-12 px-6 cursor-pointer w-full sm:w-auto"
            >
              <span>Contact Sales</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. TESTIMONIALS (Clean Card Style)                                       */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[#FF6B00] font-semibold uppercase text-xs tracking-wider bg-[#FFF8F2] px-3 py-1 rounded-full border border-[#FF6B00]/20">
            Client Success
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#10182D] font-heading">
            Trusted By Supply Chain Leaders
          </h2>
          <p className="text-[#1E293B] text-sm sm:text-base font-medium">
            Verified feedback from operations teams managing high-volume domestic distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "Josan Logistics reduced our highway transit delay rates by over 40%. The real-time telematics and digital Lorry Receipt (LR) dispatch saved our operations team hundreds of hours.",
              author: "Tan Wei Ming",
              role: "Supply Chain Director",
              company: "Razer Asia-Pacific HQ",
              shipmentId: "JOS-88190-SG",
              rating: 5,
              photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            },
            {
              quote: "When transporting temperature-sensitive pharmaceutical batches across expressways, zero margin for error exists. Josan's Reefer Road Fleet delivered 100% SLA temperature accuracy.",
              author: "Dr. Keith Tan",
              role: "Logistics Director",
              company: "Biopolis Biomedical Hub",
              shipmentId: "JOS-66301-SG",
              rating: 5,
              photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            },
            {
              quote: "The fleet driver telematics tracking and GPS geofence alerts are phenomenal. It gives us complete visibility over our Singapore port-to-warehouse container haulage.",
              author: "Muhammad Rizal",
              role: "Fleet Operations Manager",
              company: "PSA Pasir Panjang Logistics",
              shipmentId: "JOS-44021-SG",
              rating: 5,
              photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
            }
          ].map((item, index) => (
            <div key={index} className="card-premium flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#F59E0B] space-x-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#FF6B00] bg-[#FFF8F2] px-2 py-0.5 rounded border border-[#FF6B00]/20">
                    {item.shipmentId}
                  </span>
                </div>
                <p className="text-[#172033] text-sm leading-relaxed font-normal italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-[#E2E8F0]">
                <img src={item.photo} alt={item.author} className="w-10 h-10 rounded-full object-cover border-2 border-[#FF6B00]" />
                <div>
                  <p className="text-sm font-bold text-[#10182D]">{item.author}</p>
                  <p className="text-xs text-[#1E293B] font-bold">{item.role}, <span className="text-[#FF6B00]">{item.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 10. CONTACT (Standardized 44-48px inputs, clear labels, Singapore HQ)     */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-premium p-6 sm:p-10 border-2 border-[#E2E8F0] shadow-card">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[#FF6B00] font-semibold uppercase text-xs tracking-wider bg-[#FFF8F2] px-3 py-1 rounded-full border border-[#FF6B00]/20">
                Customer Support
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10182D] font-heading">
                Contact Our Singapore Freight Desk
              </h2>
              <p className="text-[#1E293B] text-sm leading-relaxed font-medium">
                Have questions about corporate freight accounts, scheduled runs, or specialized cargo requirements? Our team responds within 15 minutes during operating hours.
              </p>

              <div className="space-y-4 pt-2 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FFF8F2] text-[#FF6B00] flex items-center justify-center shrink-0 border border-[#FF6B00]/20">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#10182D] block">Singapore Logistics Operations HQ</strong>
                    <span className="text-[#1E293B] text-xs font-medium">10 Pasir Panjang Road, #08-12 Mapletree Business City, Singapore 117438</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FFF8F2] text-[#FF6B00] flex items-center justify-center shrink-0 border border-[#FF6B00]/20">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#10182D] block">24/7 Dispatch Hotline</strong>
                    <span className="text-[#1E293B] text-xs font-mono font-bold">+65 6789 0123 / +65 9123 4567</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FFF8F2] text-[#FF6B00] flex items-center justify-center shrink-0 border border-[#FF6B00]/20">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#10182D] block">Official Email Support</strong>
                    <a href="mailto:support@josanlogistics.com" className="text-[#FF6B00] hover:underline text-xs font-bold">
                      support@josanlogistics.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="lg:col-span-7 bg-[#F5F6F8] rounded-2xl p-6 sm:p-8 border border-[#E2E8F0]">
              {contactSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#10182D]">Inquiry Dispatched Successfully</h3>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                    A dedicated freight specialist from our Singapore desk will review your requirements and reach out via email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactSubject('');
                      setContactMessage('');
                    }}
                    className="btn-outline h-10 text-xs px-4 mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-[#10182D] font-heading">
                    Send Direct Inquiry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#10182D]">Full Name *</label>
                      <input
                        type="text"
                        placeholder="John Tan"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="input-standard text-xs sm:text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#10182D]">Work Email *</label>
                      <input
                        type="email"
                        placeholder="john.tan@company.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="input-standard text-xs sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#10182D]">Subject / Freight Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Daily FTL linehaul schedule inquiry"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="input-standard text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#10182D]">Message / Specific Requirements *</label>
                    <textarea
                      rows={3}
                      placeholder="Please specify estimated pallet quantities, temperature requirements, or preferred delivery terminals..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full p-3 rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white text-[#172033] placeholder:text-[#64748B] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full h-11 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Operations Desk</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
