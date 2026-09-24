import React from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Package, 
  Building2, 
  Navigation,
  FileCheck,
  Plane,
  Layers,
  Boxes,
  Handshake,
  Route
} from 'lucide-react';

export const RoadFreightPage = ({ setActiveTab }) => {
  const { 
    currentUser, 
    setIsAuthModalOpen, 
    setAuthRedirectTab, 
    showToast 
  } = useLogistics();

  const handleQuoteClick = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('quote');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in to generate a road transportation quote.', 'warning');
      return;
    }
    setActiveTab('quote');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleBookClick = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('book');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in or create an account to book a road shipment.', 'warning');
      return;
    }
    setActiveTab('book');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // 4 Core Road Transportation Services based on actual business model
  const roadServices = [
    {
      id: 'commercial-goods-transport',
      title: 'Commercial Goods Transportation',
      badge: 'B2B Cargo Movement',
      desc: 'Transportation support for moving commercial products from one location to another.',
      features: [
        'Dedicated commercial goods and product movement',
        'Direct origin-to-destination transport arrangements',
        'Organized handling tailored for business inventory'
      ],
      icon: Truck
    },
    {
      id: 'shipment-transportation',
      title: 'Shipment Transportation',
      badge: 'Consignment Logistics',
      desc: 'Coordination of transportation arrangements based on shipment requirements.',
      features: [
        'Transport planning matched to consignment volume & schedule',
        'Organized vehicle matching for varied cargo sizes',
        'Careful dispatch management from pickup point'
      ],
      icon: Layers
    },
    {
      id: 'partner-vehicle-network',
      title: 'Partner Vehicle Network',
      badge: 'Transport Partners',
      desc: 'Access to transportation partners to support commercial cargo movement.',
      features: [
        'Network of vetted third-party commercial transport operators',
        'Access to appropriate vehicles based on cargo parameters',
        'Scalable transportation support for one-off or scheduled runs'
      ],
      icon: Handshake
    },
    {
      id: 'road-shipment-coordination',
      title: 'Road Shipment Coordination',
      badge: 'End-to-End Support',
      desc: 'Support with coordinating pickup, transportation and delivery requirements.',
      features: [
        'Pickup schedule and delivery window coordination',
        'Clear consignment details and transport documentation support',
        'Active communication between consignor, driver and recipient'
      ],
      icon: Route
    }
  ];

  // 5-Stage Commercial Road Workflow Steps
  const roadWorkflowSteps = [
    {
      step: '01',
      title: 'Shipment Details & Requirements',
      desc: 'Submit cargo specifications, pickup location, delivery point, and timing requirements.',
      icon: FileCheck
    },
    {
      step: '02',
      title: 'Partner Vehicle Coordination',
      desc: 'Josan matches your shipment requirements with a trusted third-party transportation partner.',
      icon: Handshake
    },
    {
      step: '03',
      title: 'Pickup & Cargo Dispatch',
      desc: 'Transport vehicle arrives at origin to collect commercial goods according to agreed schedule.',
      icon: Package
    },
    {
      step: '04',
      title: 'Route Movement & Coordination',
      desc: 'Active coordination throughout transit to ensure timely progress along designated route.',
      icon: Navigation
    },
    {
      step: '05',
      title: 'Delivery & Handover Record',
      desc: 'Handover of commercial goods at final destination with verified receipt of shipment.',
      icon: CheckCircle2
    }
  ];

  // 6 Commercial Goods Classifications
  const roadCommodities = [
    { id: 'industrial-products', name: 'Industrial Products & Equipment', desc: 'Commercial equipment, machinery parts, manufacturing components, and industrial supplies.' },
    { id: 'packaged-goods', name: 'Packaged Commercial Goods', desc: 'Carton-packed merchandise, palletized inventory, and wholesale goods for business clients.' },
    { id: 'retail-wholesale', name: 'Retail & Wholesale Merchandise', desc: 'Commercial inventory moving between suppliers, distribution centers, and retail stores.' },
    { id: 'consumer-supplies', name: 'Consumer Products & Supplies', desc: 'Packaged consumer commodities, office inventory, and commercial stock transfers.' },
    { id: 'raw-materials', name: 'Raw Materials & Components', desc: 'Commercial production inputs, manufacturing parts, and intermediate factory materials.' },
    { id: 'project-cargo', name: 'Commercial Project Supplies', desc: 'Scheduled project consignments, commercial fixtures, and business materials.' }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 space-y-16 sm:space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0A101D] text-white pt-12 pb-16 sm:pt-14 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Full-Color Road Transportation Truck Background (Positioned for Full Truck View) */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src="/assets/road_transportation_hero.jpg" 
            alt="Commercial Road Transportation - Goods Movement" 
            className="w-full h-full object-cover object-[65%_72%] sm:object-[75%_72%] lg:object-[82%_70%]"
          />
        </div>
        {/* Directional gradient on left end only to keep truck completely visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A101D] via-[#0A101D]/85 via-35% to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A101D]/85 via-transparent to-[#0A101D]/20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-7">
          <div className="max-w-xl lg:max-w-2xl space-y-4 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>ROAD TRANSPORTATION</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl font-black font-heading text-white tracking-tight leading-[1.15]">
              Commercial Road &amp; <br />
              <span className="text-[#FF6B00]">Transportation Services</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
              Josan Logistics provides transportation support for businesses moving commercial goods and products from one location to another through a network of transportation partners.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleQuoteClick}
                className="px-7 py-3.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8500] hover:from-[#E55C00] hover:to-[#FF6B00] text-white rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center space-x-2.5 cursor-pointer active:scale-95"
              >
                <span>GET ROAD QUOTE</span>
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

            {/* Feature Badges - matching Air Freight single-row layout */}
            <div className="pt-3 flex flex-wrap items-center gap-5 text-xs text-slate-300 font-semibold border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Commercial Goods</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Transport Partners</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Shipment Coordination</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cargo Movement</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ROAD WORKFLOW CAPABILITIES MATRIX (Floating 6-Card Strip) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-left">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-md transition-all group">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Commercial Goods</span>
            <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Business Products</span>
            <span className="text-[10px] text-slate-500 font-medium">B2B cargo movement</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-md transition-all group">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Partner Network</span>
            <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Transport Partners</span>
            <span className="text-[10px] text-slate-500 font-medium">Third-party vehicles</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-md transition-all group">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Coordination</span>
            <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Shipment Planning</span>
            <span className="text-[10px] text-slate-500 font-medium">Origin to destination</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-md transition-all group">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Cargo Movement</span>
            <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Product Transfer</span>
            <span className="text-[10px] text-slate-500 font-medium">Location to location</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-md transition-all group">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Documentation</span>
            <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Transport Records</span>
            <span className="text-[10px] text-slate-500 font-medium">Consignment paperwork</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-md transition-all group">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Classifications</span>
            <span className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors block">Commercial Cargo</span>
            <span className="text-[10px] text-slate-500 font-medium">Industrial &amp; retail</span>
          </div>
        </div>
      </section>

      {/* 3. INTRODUCTION SECTION & HIGHLIGHT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#FF6B00] uppercase tracking-wider">
              <span>Commercial Transportation Coordination</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
              Reliable Transportation for Commercial Goods
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Businesses need dependable transportation support to move products between locations. Josan Logistics coordinates commercial road transportation through trusted transportation partners based on shipment requirements.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Our road transportation support is focused on coordinating the movement of commercial goods, shipment requirements and transportation arrangements from origin to destination.
            </p>

            {/* Replacement Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-orange-500/40 transition-colors">
                <span className="text-lg font-black text-slate-900 block">Commercial Cargo</span>
                <span className="text-xs text-slate-500 font-bold mt-1 block">Transportation for Business Goods</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-orange-500/40 transition-colors">
                <span className="text-lg font-black text-[#FF6B00] block">Transportation Partners</span>
                <span className="text-xs text-slate-500 font-bold mt-1 block">Coordinated Vehicle Support</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-orange-500/40 transition-colors">
                <span className="text-lg font-black text-slate-900 block">Shipment Coordination</span>
                <span className="text-xs text-slate-500 font-bold mt-1 block">Organized Movement Between Locations</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-orange-500/40 transition-colors">
                <span className="text-lg font-black text-slate-900 block">Road Logistics</span>
                <span className="text-xs text-slate-500 font-bold mt-1 block">Reliable Commercial Transportation Support</span>
              </div>
            </div>
          </div>

          {/* Image Section with Verified Project Image and Updated Overlay */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-slate-950 relative group">
            <img 
              src="/assets/reliable_road_transport_network.png" 
              alt="Reliable Goods Transportation" 
              className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent p-6 flex flex-col justify-end text-left text-white">
              <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                COMMERCIAL ROAD TRANSPORTATION
              </span>
              <p className="text-base font-extrabold mt-1">Reliable Goods Transportation</p>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Transportation support for businesses moving commercial products between locations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ROAD SERVICE PORTFOLIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Road Service Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Our Road Transportation Services
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Commercial transportation support designed for businesses moving products and goods between locations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadServices.map((svc) => {
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
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mt-1.5">
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
                    onClick={handleQuoteClick}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-[#FF6B00] text-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-200 group-hover:border-transparent flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Request Rate for {svc.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. SUPPORTED COMMODITY CLASSIFICATIONS (Dark Theme) */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block mb-1">
                Cargo Support
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
                Commercial Goods Classifications
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md font-medium">
              We coordinate road transportation for diverse commercial goods and business products across varied sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {roadCommodities.map((cargo) => (
              <div 
                key={cargo.id} 
                className="bg-slate-800/80 hover:bg-slate-800 rounded-2xl p-5 border border-slate-700/80 hover:border-orange-500/50 transition-all text-left space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-orange-400 uppercase">
                    Category: {cargo.id.toUpperCase()}
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

      {/* 6. 5-STAGE COMMERCIAL ROAD PROGRESSION WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            End-to-End Coordination
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Commercial Road Transportation Process
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            A structured coordination workflow ensuring seamless communication, partner dispatch, and delivery from origin to destination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {roadWorkflowSteps.map((ws) => {
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

                <h3 className="text-sm font-bold text-slate-900">
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

      {/* 7. DOCUMENTATION & MULTIMODAL AIRWAY CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Documentation Support Card */}
          <div className="bg-gradient-to-br from-slate-900 to-[#10182D] text-white p-7 sm:p-8 rounded-3xl border border-slate-800 shadow-card flex flex-col justify-between text-left space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Shipment Documentation Support</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Coordinate commercial shipment documentation, consignment details, and transport paperwork required for smooth cargo transit between locations.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('customs-clearance');
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-2"
              >
                <span>Explore Documentation Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Multimodal Airway Services Card */}
          <div className="bg-gradient-to-br from-sky-950 to-[#0A101D] text-white p-7 sm:p-8 rounded-3xl border border-sky-900/60 shadow-card flex flex-col justify-between text-left space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Multimodal Airway Services</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Connect commercial road transportation with airway services, including Air Waybill (AWB) preparation, AWB billing, and air shipment documentation support.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('air-freight');
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-2"
              >
                <span>Explore Airway Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BOTTOM QUOTE CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#FF6B00] to-orange-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden space-y-6">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
              Ready to Coordinate Your Commercial Road Transportation?
            </h2>
            <p className="text-white/90 text-sm sm:text-base font-medium">
              Obtain transparent road transportation quotes and coordinate reliable goods movement through our transportation partner network.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              type="button"
              onClick={handleQuoteClick}
              className="px-8 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all cursor-pointer active:scale-95"
            >
              GET A ROAD TRANSPORTATION QUOTE
            </button>
            <button
              type="button"
              onClick={handleBookClick}
              className="px-8 py-3.5 bg-slate-900/40 hover:bg-slate-900/60 text-white rounded-xl font-bold text-xs sm:text-sm border border-white/40 transition-all cursor-pointer"
            >
              BOOK ROAD SHIPMENT
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
