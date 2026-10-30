import React, { useState } from 'react';
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
  Route,
  Phone,
  ChevronDown,
  MapPin
} from 'lucide-react';

export const RoadFreightPage = ({ setActiveTab }) => {
  const [openFaq, setOpenFaq] = useState(null);

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

  // 4 Core Road Transportation Services based on actual business model
  const roadServices = [
    {
      id: 'commercial-goods-transport',
      title: 'Commercial Goods Transportation',
      badge: 'B2B Cargo Movement',
      desc: 'Transportation support for moving commercial products from one location to another.',
      features: [
        'Commercial goods and product movement',
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
        'Network of established third-party commercial transport operators',
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

  // 4 Commercial Goods Categories
  const goodsWeMove = [
    {
      title: 'Packaged & Palletized Goods',
      desc: 'Carton-packed merchandise, boxed inventory, and palletized commercial consignments.',
      icon: Package
    },
    {
      title: 'Retail & Wholesale Merchandise',
      desc: 'Commercial inventory moving between suppliers, distribution centres, and retail stores.',
      icon: Building2
    },
    {
      title: 'Industrial Products & Equipment',
      desc: 'Commercial machinery parts, manufacturing equipment, and industrial facility supplies.',
      icon: Boxes
    },
    {
      title: 'Raw Materials & Components',
      desc: 'Production inputs, manufacturing components, and intermediate commercial materials.',
      icon: Layers
    }
  ];

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-slate-800 space-y-16 sm:space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0A101D] text-white pt-12 pb-16 sm:pt-14 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Full-Color Road Transportation Background with Dark Left Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src="/assets/road_transportation_hero.jpg" 
            alt="Commercial Road Transportation - Goods Movement" 
            className="w-full h-full object-cover object-[65%_72%] sm:object-[75%_72%] lg:object-[82%_70%]"
          />
          {/* Darker gradient overlay on the left side so the heading and description are clearly readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070D18]/95 via-[#070D18]/80 sm:via-[#070D18]/65 lg:via-[#070D18]/45 to-transparent" />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-7">
          <div className="max-w-xl lg:max-w-2xl space-y-4 text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl font-black font-heading text-white tracking-tight leading-[1.15] drop-shadow-md">
              Commercial Road &amp; <br />
              <span>Transportation Services</span>
            </h1>

            <p className="text-white/95 text-sm sm:text-base leading-relaxed font-medium drop-shadow-md">
              Josan Logistics provides transportation support for businesses moving commercial goods and products from one location to another through a network of transportation partners.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleQuoteClick}
                className="px-7 py-3.5 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md flex items-center space-x-2 cursor-pointer active:scale-95 transition-colors"
              >
                <span>Get a Road Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* 2. INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
              Reliable Transportation for Commercial Goods
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Businesses need dependable transportation support to move products between locations. Josan Logistics coordinates commercial road transportation through trusted transportation partners based on shipment requirements.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Our road transportation support is focused on coordinating the movement of commercial goods, shipment requirements and transportation arrangements from origin to destination.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-white relative group">
              <img 
                src="/assets/road_freight_hero_truck.jpg" 
                alt="Commercial Road Freight Logistics in Singapore" 
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR ROAD TRANSPORTATION SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Our Road Transportation Services
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Commercial transportation support designed for businesses moving products and goods between locations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {roadServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <div 
                key={svc.id} 
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-[#F26B21]/40 transition-all flex flex-col justify-between group h-full"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F26B21] group-hover:bg-[#F26B21] group-hover:text-white transition-colors flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#F26B21] transition-colors leading-snug">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium mt-1.5">
                      {svc.desc}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 mt-6 border-t border-slate-100 text-xs">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Key Details
                  </span>
                  {svc.features.map((feat, i) => (
                    <div key={i} className="flex items-start space-x-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="font-semibold text-[11px] leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={handleQuoteClick}
            className="px-8 py-3.5 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center space-x-2 cursor-pointer active:scale-95"
          >
            <span>Get a Road Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. GOODS WE MOVE (Light Background) */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10 text-left">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              Goods We Move
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              We coordinate road transportation support for diverse commercial goods and business products.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {goodsWeMove.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-[#F26B21]/40 transition-all flex flex-col justify-start group"
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#F26B21] group-hover:bg-[#F26B21] group-hover:text-white transition-colors flex items-center justify-center font-bold mb-3.5 shrink-0 shadow-xs">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 font-heading leading-snug group-hover:text-[#F26B21] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Cargo specification note under the grid */}
          <div className="text-center pt-2">
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Vehicle type and capacity depend on your cargo and route. Tell us what you are moving and we will arrange a suitable option.
            </p>
          </div>
        </div>
      </section>

      {/* 5. 5-STAGE COMMERCIAL ROAD PROGRESSION WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            How Our Road Transportation Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            A structured coordination workflow ensuring seamless communication, partner dispatch, and delivery from origin to destination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-stretch">
          {roadWorkflowSteps.map((ws) => {
            const Icon = ws.icon;
            return (
              <div 
                key={ws.step} 
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-card hover:border-[#F26B21]/40 transition-all text-left flex flex-col justify-start h-full group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-[#F26B21] font-mono">
                    {ws.step}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F26B21] flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 min-h-[44px] flex items-center leading-snug mb-2">
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

      {/* 5B. WHAT WE NEED TO QUOTE YOUR SHIPMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 text-left space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              What We Need to Quote Your Shipment
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              To arrange suitable vehicle capacity and provide an accurate transportation quote, we usually ask for:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {[
              'Pickup and delivery addresses',
              'Type of goods and packaging',
              'Weight, volume and number of pieces',
              'Preferred pickup date and delivery window',
              'One-off or recurring schedule',
              'Any special handling instructions'
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs"
              >
                <CheckCircle2 className="w-5 h-5 text-[#F26B21] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-800 leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200/80">
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Have specific commercial requirements? Contact our dispatch team for tailored assistance.
            </p>
            <button
              type="button"
              onClick={handleQuoteClick}
              className="px-6 py-3.5 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center space-x-2 cursor-pointer active:scale-95 shrink-0"
            >
              <span>Get a Road Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. DOCUMENTATION & AIR FREIGHT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Documentation Support Card */}
          <div className="bg-[#0B1F3A] text-white p-7 sm:p-8 rounded-3xl border border-[#1E3A5F] shadow-card flex flex-col justify-between text-left space-y-6 h-full">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Shipment Documentation Support</h3>
              <p className="text-xs sm:text-sm text-[#B6C2D1] leading-relaxed font-medium">
                Coordinate commercial shipment documentation, consignment details, and transport paperwork required for smooth cargo transit between locations.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('shipment-documentation-support');
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm cursor-pointer flex items-center space-x-2"
              >
                <span>Shipment Documentation Support</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Air Freight Services Card */}
          <div className="bg-[#0B1F3A] text-white p-7 sm:p-8 rounded-3xl border border-[#1E3A5F] shadow-card flex flex-col justify-between text-left space-y-6 h-full">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Air Freight Services</h3>
              <p className="text-xs sm:text-sm text-[#B6C2D1] leading-relaxed font-medium">
                Connect commercial road transportation with air freight services, including Air Waybill (AWB) preparation, AWB billing, and air shipment documentation support.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('air-freight');
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm cursor-pointer flex items-center space-x-2"
              >
                <span>Explore Air Freight Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6B. WHERE WE OPERATE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-center text-center space-x-2.5 text-slate-700 text-xs sm:text-sm font-medium">
          <MapPin className="w-4 h-4 text-[#F26B21] shrink-0" />
          <span>
            <strong className="text-slate-900">Where We Operate:</strong> Singapore and selected regional routes.
          </span>
        </div>
      </section>

      {/* 6C. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Common questions about our commercial road transportation coordination, vehicle matching, and service operations.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'What types of goods can you transport?',
              a: 'We support road transportation for commercial and business goods, including Packaged & Palletized Goods, Retail & Wholesale Merchandise, Industrial Products & Equipment, and Raw Materials & Components. Vehicle type and capacity depend on cargo requirements and route.'
            },
            {
              q: 'How do I get a road transportation quote?',
              a: 'You can click the "Get a Road Quote" button on this page to submit your shipment details—including pickup and delivery addresses, type of goods, packaging, weight, volume, piece count, and preferred schedule. Our team will review your requirements and coordinate a suitable transport option.'
            },
            {
              q: 'Do you own the vehicles?',
              a: 'No. Josan Logistics coordinates commercial transportation through trusted, established third-party transport partners. We do not own or operate a proprietary fleet of vehicles; instead, we match your shipment specifications with qualified partner operators who provide the required vehicle capacity.'
            },
            {
              q: 'Can you arrange recurring or scheduled deliveries?',
              a: 'Yes. We coordinate both one-off commercial shipments and recurring or scheduled transport runs between business locations, distribution centers, and facilities according to your operational schedule.'
            },
            {
              q: 'How do I track my shipment?',
              a: 'Active coordination is maintained from pickup through final destination delivery. You can check your shipment status using our online tracking feature with your shipment reference number, or contact our dispatch team directly for milestone updates.'
            }
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className={`bg-white border rounded-2xl overflow-hidden transition-all shadow-xs ${
                  isOpen 
                    ? 'border-slate-300 border-l-4 border-l-[#FF6B00] bg-orange-50/10' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-slate-900 pr-4">{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-slate-700 text-sm leading-relaxed border-t border-slate-100 pt-3.5 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. BOTTOM QUOTE CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden space-y-6">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
              Ready to Coordinate Your Commercial Road Transportation?
            </h2>
            <p className="text-[#B6C2D1] text-sm sm:text-base font-normal">
              Tell us what you need to move and we will coordinate the right transport partner.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              type="button"
              onClick={handleQuoteClick}
              className="px-8 py-3.5 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer active:scale-95 flex items-center space-x-2"
            >
              <span>Get a Road Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="tel:+6567890123"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center space-x-2 cursor-pointer active:scale-95"
              title="Call Us (+65 6789 0123)"
            >
              <Phone className="w-4 h-4 text-[#F26B21]" />
              <span>Call Us</span>
            </a>
            <a
              href="https://wa.me/6567890123"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center space-x-2 cursor-pointer active:scale-95 shadow-sm"
              title="WhatsApp Us (+65 6789 0123)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
