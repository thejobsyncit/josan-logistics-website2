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
  ChevronRight,
  Shield,
  Activity,
  SlidersHorizontal,
  Compass,
  Building2,
  Calendar,
  Globe
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

  // Track Shipment Box State
  const [trackQuery, setTrackQuery] = useState('');
  const [inlineResult, setInlineResult] = useState(null);

  const sampleShipments = [
    {
      id: 'JOS-88190-SG',
      status: 'In Transit',
      pickup: 'Jurong Central Highway Hub',
      destination: 'Woodlands Roadways Terminal',
      step: 5
    },
    {
      id: 'JOS-44021-SG',
      status: 'Near Destination',
      pickup: 'Pasir Panjang Terminal Gate',
      destination: 'Woodlands Tech Park',
      step: 6
    },
    {
      id: 'JOS-66301-SG',
      status: 'Delivered',
      pickup: 'Tuas Mega Logistics Hub',
      destination: 'Biopolis Biomedical Dock',
      step: 7
    }
  ];

  const handleTrackSubmit = (e) => {
    if (e) e.preventDefault();
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('track');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in to track road shipments.', 'warning');
      return;
    }
    const query = (trackQuery || '').trim().toUpperCase() || 'JOS-88190-SG';
    setActiveTrackingId(query);
    setActiveTab('track');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleSampleClick = (sample) => {
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('track');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in to track road shipments.', 'warning');
      return;
    }
    setTrackQuery(sample.id);
    setActiveTrackingId(sample.id);
    setInlineResult(sample);
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
    setActiveTab('quote');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // 7 Canonical Stages (100% Authentic Real-World Road Logistics Photography)
  const trackingStages = [
    { 
      step: 1, 
      name: 'Book Shipment', 
      desc: 'Manifest & LR generated',
      image: '/assets/book_shipment_desk.jpg'
    },
    { 
      step: 2, 
      name: 'Confirmed', 
      desc: 'Fleet operations approved',
      image: '/assets/booking_confirmed_mobile.png'
    },
    { 
      step: 3, 
      name: 'Pickup Scheduled', 
      desc: 'Vehicle & driver allocated',
      image: '/assets/pickup_scheduled_dispatch.png'
    },
    { 
      step: 4, 
      name: 'Picked Up', 
      desc: 'Loaded & weight verified',
      image: '/assets/picked_up_warehouse_loading.png'
    },
    { 
      step: 5, 
      name: 'In Transit', 
      desc: 'Active highway telemetry',
      image: '/assets/roadway_truck_highway.jpg'
    },
    { 
      step: 6, 
      name: 'Near Destination', 
      desc: 'Approaching recipient hub',
      image: '/assets/near_destination_arrival.jpg'
    },
    { 
      step: 7, 
      name: 'Delivered', 
      desc: 'Digital POD signature captured',
      image: '/assets/delivered_handover_signing.png'
    }
  ];

  // 4 Road Services (100% Real-World Commercial Fleet Photography)
  const roadServices = [
    {
      id: 'parcel-delivery',
      title: 'Parcel Delivery',
      tag: 'Express Road Freight',
      desc: 'Fast and secure door-to-door parcel delivery across Singapore, designed for businesses and individuals who need dependable last-mile logistics.',
      desc2: 'From documents to retail packages, every delivery is handled with care and real-time visibility.',
      specsLabel: 'Key Features:',
      specs: [
        'Same-day and scheduled delivery options',
        'Real-time tracking updates',
        'Electronic proof of delivery (POD)'
      ],
      icon: Package,
      image: '/assets/parcel_delivery_handover.png'
    },
    {
      id: 'bulk-shipment',
      title: 'Bulk Shipment',
      tag: 'Full Truckload (FTL)',
      desc: 'Efficient road-based bulk transportation within Singapore for businesses moving high-volume goods between warehouses, distribution centers, and commercial locations.',
      desc2: 'Optimized for reliability, capacity, and timely execution.',
      specsLabel: 'Key Features:',
      specs: [
        'Dedicated vehicle allocation',
        'Direct point-to-point movement',
        'High-capacity load handling'
      ],
      icon: Layers,
      image: '/assets/bulk_shipment_containers.png'
    },
    {
      id: 'intra-city',
      title: 'Intra-city Transport',
      tag: 'Metropolitan Linehaul',
      desc: 'Seamless intra-city roadway logistics across Singapore, connecting warehouses, fulfillment hubs, retail outlets, and customer destinations.',
      desc2: 'Built for high-frequency, time-sensitive urban deliveries.',
      specsLabel: 'Key Features:',
      specs: [
        'Multi-stop delivery routes',
        'Flexible scheduling',
        'Optimized urban delivery network'
      ],
      icon: Navigation,
      image: '/assets/intra_city_logistics_route.png'
    },
    {
      id: 'island-wide',
      title: 'Island-wide Delivery',
      tag: 'Singapore-wide Coverage',
      desc: 'Reliable end-to-end delivery coverage across Singapore, ensuring smooth movement of goods from pickup to final destination anywhere on the island.',
      desc2: 'Designed for consistent, scalable logistics operations.',
      specsLabel: 'Key Features:',
      specs: [
        'Coverage across major Singapore regions',
        'Scheduled delivery windows',
        'Continuous delivery monitoring'
      ],
      icon: Truck,
      image: '/assets/inter_city_highway_corridor.png'
    }
  ];

  // Service Coverage
  const coverageTiers = [
    {
      tier: 'Local Transport',
      scope: 'Within City',
      tag: 'Metropolitan Network',
      desc: 'Comprehensive urban roadway coverage connecting industrial estates, seaport gates, and airport cargo logistics zones.',
      turnaround: 'Same-day / Under 4 Hours',
      features: ['Islandwide Singapore coverage', 'Express last-mile dispatch', 'Real-time city traffic routing'],
      image: '/assets/vehicle_10ft_lorry.jpg'
    },
    {
      tier: 'Regional Transport',
      scope: 'Within State / Province',
      tag: 'Sub-Regional Corridors',
      desc: 'Inter-district highway transport linking key regional distribution hubs, manufacturing clusters, and secondary logistics centers.',
      turnaround: 'Same-Day / Next-Morning',
      features: ['Industrial park linehaul', 'Cross-dock pallet sorting', 'Scheduled daily departures'],
      image: '/assets/regional_transport_highway_trucks.png'
    },
    {
      tier: 'Inter-State Transport',
      scope: 'Inter-State Corridors',
      tag: 'Long-Haul Highways',
      desc: 'Cross-state linehaul connecting interstate checkpoints, regional expressway routes, and major economic gateways.',
      turnaround: 'Guaranteed Transit Windows',
      features: ['Heavy prime mover haulage', 'Customs clearance corridor', 'Dual-driver continuous movement'],
      image: '/assets/inter_state_container_truck.png'
    }
  ];

  return (
    <div className="w-full">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH PROMINENT TRACKING BOX                              */}
      {/* ========================================================================= */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden bg-[#0A101D] text-white">
                {/* Singapore Road Logistics Hero Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img 
            src="/assets/singapore_road_freight_hero.jpg" 
            alt="Singapore road freight container truck network" 
            className="w-full h-full object-cover object-[72%_center] scale-102 transform brightness-95 contrast-105"
          />
          {/* Elegant gradient overlay ensuring high contrast for text while keeping the truck crisp and clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A101D]/90 via-[#0A101D]/55 sm:via-[#0A101D]/40 to-[#0A101D]/20 sm:to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A101D] via-transparent to-black/25"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-[#FF6B00]/40 text-xs font-bold text-[#FF8500] shadow-xs backdrop-blur-xs">
              <span className="text-[#FF6B00]">⚡</span>
              <span className="tracking-wide uppercase font-black text-[11px]">ROAD TRANSPORTATION & LOGISTICS</span>
            </div>

            <h1 className="text-[26px] sm:text-5xl lg:text-[54px] font-black tracking-tight text-white leading-[1.2] sm:leading-[1.12] drop-shadow-md">
              <span className="block sm:inline">Reliable Road Freight</span>{' '}
              <span className="hidden sm:inline">&amp;</span> <br className="hidden sm:block" />
              <span className="text-[#FF6B00] drop-shadow-sm">
                <span className="sm:hidden">&amp;&nbsp;</span>Express Transportation
              </span>
            </h1>

            <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl font-medium drop-shadow-sm">
              Josan Logistics specializes exclusively in dependable roadway transportation. From intra-city express parcels to heavy-haul inter-state full truckloads, we move your cargo safely with reliable delivery timelines.
            </p>

            {/* Action Buttons - Clean single primary CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuoteAction}
                className="px-8 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF8500] hover:from-[#E55C00] hover:to-[#FF6B00] text-white rounded-full font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center space-x-2.5 cursor-pointer active:scale-95 group"
              >
                <span>Get a Quote</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Quick Assurance Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Real-Time Shipment Tracking</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Proof of Delivery (POD)</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cargo Insurance Available</span>
              </span>
            </div>
          </div>

          {/* PROMINENT TRACKING BOX (Dark Navy Glassmorphic Card) */}
          <div className="bg-[#10182D]/95 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl backdrop-blur-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
              <div>
                <span className="text-[#FF6B00] font-black uppercase text-[11px] tracking-wider bg-orange-950/40 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                  Live Consignment Status
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 font-heading">
                  Track Your Road Shipment
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5 font-normal">
                  Track your road shipment with real-time status and delivery updates
                </p>
              </div>

              {/* Sample Shipment IDs */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-bold text-slate-300">Sample Shipments:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {sampleShipments.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSampleClick(s)}
                      className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        trackQuery === s.id
                          ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                          : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700 hover:border-orange-500/50'
                      }`}
                    >
                      {s.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tracking Search Input */}
            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter Shipment ID (e.g. JOS-88190-SG)"
                  value={trackQuery}
                  onChange={(e) => {
                    setTrackQuery(e.target.value);
                    if (inlineResult && inlineResult.id !== e.target.value) {
                      setInlineResult(null);
                    }
                  }}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900/90 border border-slate-700 rounded-xl font-mono font-bold text-white placeholder-slate-500 text-sm sm:text-base focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8500] hover:from-[#E55C00] hover:to-[#FF6B00] text-white rounded-xl font-extrabold text-sm shadow-orange-sm transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer active:scale-98"
              >
                <Search className="w-4 h-4" />
                <span>Track Shipment</span>
              </button>
            </form>

            {/* Inline Result Card Preview */}
            {inlineResult && (
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-700/90 space-y-4 animate-fade-in text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Shipment ID</span>
                    <span className="font-mono font-extrabold text-sm text-white block mt-0.5">{inlineResult.id}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-orange-950/60 text-orange-400 border border-orange-500/40 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></span>
                      <span>{inlineResult.status}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup Location</span>
                    <span className="font-semibold text-slate-200 block mt-0.5 truncate">{inlineResult.pickup}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Destination</span>
                    <span className="font-semibold text-slate-200 block mt-0.5 truncate">{inlineResult.destination}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-medium text-[11px]">
                    Stage {inlineResult.step} of 7: <strong className="text-white">{inlineResult.status}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleTrackSubmit}
                    className="text-[#FF6B00] hover:text-[#FF8500] font-bold inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View Full Tracking Timeline</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Seamless visual blend from Dark Navy into Cool-Gray (#EEF2F6) */}
        <div 
          className="absolute bottom-0 inset-x-0 h-16 sm:h-24 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(180deg, rgba(10, 16, 29, 0) 0%, rgba(10, 16, 29, 0.35) 40%, rgba(238, 242, 246, 0.85) 85%, #EEF2F6 100%)'
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
        {/* 2. WHY CHOOSE US (Aligned with Services Capabilities)                     */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#FF6B00] font-bold uppercase text-xs tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Engineered Road Logistics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10182D] font-heading">
            Why Choose Josan Logistics
          </h2>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            Our operational infrastructure is built specifically for roadway freight reliability, driver accountability, and secure on-time delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-300 transition-all space-y-4 group">
            <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 relative">
              <img 
                src="/assets/reliable_road_transport_network.png" 
                alt="Josan reliable road transport expressway network" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-white/95 text-[#FF6B00] shadow-xs flex items-center justify-center backdrop-blur-xs">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-base font-extrabold text-[#10182D]">
              Reliable Road Transport Network
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
              A company-owned fleet of 10ft–24ft canopy lorries, prime mover trailers, and reefer box trucks providing guaranteed cargo capacity across all routes.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-300 transition-all space-y-4 group">
            <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 relative">
              <img 
                src="/assets/realtime_shipment_tracking.jpg" 
                alt="Real-time shipment GPS telematics and container trailer inspection" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-white/95 text-[#FF6B00] shadow-xs flex items-center justify-center backdrop-blur-xs">
                <Navigation className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-base font-extrabold text-[#10182D]">
              Real-Time Shipment Tracking
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
              Direct telemetry pings every 5 minutes from onboard GPS units, providing exact expressway positions, vehicle speeds, and accurate ETA calculations.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-300 transition-all space-y-4 group">
            <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 relative">
              <img 
                src="/assets/secure_verified_deliveries.png" 
                alt="Secure verified parcel handover by courier" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-white/95 text-[#FF6B00] shadow-xs flex items-center justify-center backdrop-blur-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-base font-extrabold text-[#10182D]">
              Secure & Verified Deliveries
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
              Tamper-evident seals, one-time delivery verification PINs (OTP), and immediate photographic Proof-of-Delivery (POD) signed by verified recipients.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-300 transition-all space-y-4 group">
            <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 relative">
              <img 
                src="/assets/efficient_route_optimization.png" 
                alt="Dynamic road navigation map with Point A to Point B route optimization" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-white/95 text-[#FF6B00] shadow-xs flex items-center justify-center backdrop-blur-xs">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-base font-extrabold text-[#10182D]">
              Efficient Route Optimization
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
              Dynamic highway routing engines account for traffic bottlenecks, bridge clearances, and multi-drop sequences to cut delays and minimize fuel burn.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS (Aligned with 7-Stage Tracking Timeline)                 */}
      {/* ========================================================================= */}
      <section className="bg-slate-50/80 py-12 sm:py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <span className="text-[#FF6B00] font-bold uppercase text-xs tracking-wider bg-white px-3.5 py-1 rounded-full border border-orange-200 shadow-2xs">
              7-Stage Progression Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10182D] font-heading">
              How Your Road Shipment Moves
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              From consignment booking to final electronic handover, every milestone is verified through our real-time road logistics tracking system.
            </p>
          </div>

          {/* 7-Step Horizontal Stepper with Prominent Visual Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
            {trackingStages.map((stage, idx) => (
              <div 
                key={stage.step}
                className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 relative group hover:border-[#FF6B00] hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6B00] font-black text-xs flex items-center justify-center font-mono shadow-2xs">
                      0{stage.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#FF6B00] transition-colors">
                      Step {stage.step}
                    </span>
                    {idx < trackingStages.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden lg:block" />
                    )}
                  </div>

                  {/* Contextual Real Visual - Enhanced from h-16 to h-28 */}
                  <div className="h-28 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100 relative shadow-2xs">
                    <img 
                      src={stage.image} 
                      alt={stage.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:opacity-0 transition-opacity"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-xs sm:text-sm text-[#10182D] group-hover:text-[#FF6B00] transition-colors leading-snug">
                    {stage.name}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('track');
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-[#FF6B00] rounded-xl text-xs sm:text-sm font-bold text-[#FF6B00] hover:bg-orange-50/50 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
            >
              <span>Explore full telemetry map on Tracking Page</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SERVICES OVERVIEW (Aligned with Services Page)                        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 !mt-12 sm:!mt-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-[#FF6B00] font-bold uppercase text-xs tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Core Road Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10182D] font-heading mt-2">
              Road Transportation Services
            </h2>
            <p className="text-slate-600 text-sm font-medium mt-1">
              Dedicated freight solutions designed exclusively for roadway transit and scheduled supply chains.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab('services');
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center space-x-1.5 text-sm font-extrabold text-[#FF6B00] hover:text-[#E55C00] cursor-pointer shrink-0"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Standard Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roadServices.map((svc) => {
            const IconComp = svc.icon;
            return (
              <div 
                key={svc.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-card hover:border-orange-300 transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  {/* Real-World Service Image - Full Card Coverage */}
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
                      setActiveTab('services');
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
      {/* 5. SERVICE COVERAGE (Aligned with Shipment Scope)                        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-slate-50/80 border border-slate-200/80 shadow-xs p-6 sm:p-10 lg:p-12 pb-10 sm:pb-12 lg:pb-14 space-y-10 overflow-hidden">
          {/* Subtle Map & Logistics Network Route Graphic Background */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.07]">
            <img 
              src="/assets/singapore_google_map_hd.jpg" 
              alt="Logistics road routes network map" 
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="text-center max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-[#FF6B00] font-bold uppercase text-xs tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Road Network Coverage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10182D] font-heading">
              Comprehensive Roadway Service Coverage
            </h2>
            <p className="text-slate-600 text-sm font-semibold">
              Reliable road logistics connecting cities, regions, and states efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {coverageTiers.map((tier, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-card hover:border-orange-300 transition-all space-y-4 group"
              >
                {/* Subtle Road Route Supporting Visual */}
                <div className="h-44 sm:h-48 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 relative">
                  <img 
                    src={tier.image} 
                    alt={tier.tier} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-black uppercase text-[#FF6B00] tracking-wider bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-orange-200 shadow-2xs">
                      {tier.scope}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-[#10182D]">
                    {tier.tier}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    SLA: {tier.turnaround}
                  </p>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {tier.desc}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-2 text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CTA SECTION (Aligned with Booking Flow)                               */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#10182D] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-slate-800">
          {/* High-Quality Highway Logistics Scene Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
              src="/assets/roadway_truck_highway.jpg" 
              alt="Truck on highway sunset logistics scene" 
              className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#10182D] via-[#10182D]/95 to-[#10182D]/75"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/25 rounded-full blur-3xl pointer-events-none"></div>
          </div>
          
          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="text-[#FF6B00] font-black uppercase text-xs tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
              Express Roadways Reservation
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Need a Custom Quote?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
              Plan and schedule your shipment with accurate pricing. Reserve dedicated linehaul prime movers or book same-day road parcel runs with transparent rate matrices.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleBookingAction}
                className="px-8 py-4 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-xl font-extrabold text-sm shadow-orange-sm transition-all flex items-center space-x-2 cursor-pointer active:scale-98"
              >
                <Package className="w-4 h-4" />
                <span>Book Shipment</span>
              </button>

              <button
                type="button"
                onClick={handleQuoteAction}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-extrabold text-sm border border-white/20 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Get a Quote</span>
                <ArrowRight className="w-4 h-4 text-[#FF6B00]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
};
