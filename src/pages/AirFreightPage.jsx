import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Plane, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Package, 
  Layers, 
  Truck,
  FileCheck,
  Cpu,
  Thermometer,
  HeartPulse,
  GlassWater,
  Phone,
  ChevronDown
} from 'lucide-react';

export const AirFreightPage = ({ setActiveTab }) => {
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
      if (showToast) showToast('Please sign in to request air freight services.', 'warning');
      return;
    }
    setActiveTab('quote');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // 4 Primary Air Freight Services
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

  // Supported Cargo Categories
  const supportedCargoTypes = [
    {
      title: 'General Cargo',
      desc: 'Documentation and coordination support for standard commercial cargo and palletized goods.',
      icon: Package
    },
    {
      title: 'Fragile Cargo',
      desc: 'Documentation and coordination support for fragile commercial shipments requiring special care.',
      icon: GlassWater
    },
    {
      title: 'Documents & Parcels',
      desc: 'Documentation and dispatch coordination for business paperwork, contracts, and commercial parcels.',
      icon: FileText
    },
    {
      title: 'Electronics',
      desc: 'Documentation and transport coordination for commercial electronics and high-tech components.',
      icon: Cpu
    },
    {
      title: 'Perishable Cargo',
      desc: 'Documentation and coordination support for perishable shipments through our transportation partners.',
      icon: Thermometer
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
      desc: 'Calculation and coordination of billing details associated with air freight documentation.',
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
    <div className="bg-[#FFFFFF] min-h-screen text-slate-800 space-y-16 sm:space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0A101D] text-white pt-12 pb-16 sm:pt-14 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Full-Color Front-View Cargo Aircraft Background with Left Dark Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src="/assets/air_background.png" 
            alt="Commercial Air Cargo Operations - Cargo Aircraft" 
            className="w-full h-full object-cover object-[70%_center] sm:object-[78%_center] lg:object-[82%_center]"
          />
          {/* Darker gradient overlay on the left side so all text is clearly readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070D18]/95 via-[#070D18]/80 sm:via-[#070D18]/65 lg:via-[#070D18]/45 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-xl lg:max-w-2xl space-y-4 text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl font-black font-heading text-white tracking-tight leading-[1.15] drop-shadow-md">
              AWB, Billing &amp; Shipment Documentation
            </h1>

            <p className="text-white/95 text-sm sm:text-base leading-relaxed font-medium drop-shadow-md">
              Josan Logistics provides air freight logistics support including Air Waybill preparation, billing, shipment documentation and transportation coordination for commercial goods.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuoteClick}
                className="px-8 py-3.5 sm:py-4 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center space-x-2.5 cursor-pointer active:scale-95"
              >
                <span>Get an Air Freight Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* 2. AIR FREIGHT OVERVIEW & HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
              Structured Air Freight Documentation &amp; Transportation Coordination
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Josan Logistics assists businesses with essential air freight processes, focusing on Air Waybill preparation, billing, and accurate shipment documentation.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              We coordinate transportation support to move commercial goods through established logistics networks while ensuring paperwork and records are properly organized.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-white relative group">
              <img 
                src="/assets/air_freight_documentation_neutral.jpg" 
                alt="Air Freight Documentation and Cargo Logistics Workspace" 
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR AIR FREIGHT SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Our Air Freight Services
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Air freight services focused on Air Waybill preparation, billing, shipment documentation and transportation support for commercial shipments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {airServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <div 
                key={svc.id} 
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-[#FF6B00]/40 transition-all flex flex-col justify-between group h-full"
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
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#FF6B00] transition-colors leading-snug">
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
      </section>

      {/* 4. CARGO WE SUPPORT */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10 text-left">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              Cargo We Support
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              We provide air freight documentation and transport coordination support for standard commercial cargo types.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportedCargoTypes.map((cargo, idx) => {
              const IconComp = cargo.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-[#FF6B00]/40 transition-all flex flex-col justify-start group"
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white transition-colors flex items-center justify-center font-bold mb-4 shrink-0 shadow-xs">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5 font-heading leading-snug group-hover:text-[#FF6B00] transition-colors">
                    {cargo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {cargo.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Special handling note under the grid */}
          <div className="text-center pt-2">
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Special handling requirements depend on the cargo, airline and destination. Contact us to discuss your shipment.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SHIPMENT WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            How Our Air Freight Process Works
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
                  <span className="text-2xl font-black text-[#FF6B00] font-mono">
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

      {/* 5B. WHAT WE NEED FROM YOU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 text-left space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              What We Need From You
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              To prepare your documentation and coordinate transportation accurately, we usually ask for:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {[
              'Shipper and consignee details',
              'Cargo description, quantity, weight and dimensions',
              'Commercial invoice',
              'Packing list',
              'Origin and destination',
              'Any special handling instructions'
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs"
              >
                <CheckCircle2 className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-800 leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200/80">
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Required documents vary by cargo, origin and destination.
            </p>
            <button
              type="button"
              onClick={handleQuoteClick}
              className="px-6 py-3.5 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center space-x-2 cursor-pointer active:scale-95 shrink-0"
            >
              <span>Get an Air Freight Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMS & ROAD CONNECTIONS (Callouts) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Customs Clearance Connection Card */}
          <div className="bg-[#0B1F3A] text-white p-7 sm:p-8 rounded-3xl border border-[#1E3A5F] shadow-card flex flex-col justify-between text-left space-y-6 h-full">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Customs &amp; Shipment Documentation Support</h3>
              <p className="text-xs sm:text-sm text-[#B6C2D1] leading-relaxed font-normal">
                Documentation support for shipments, helping organize the information and documents required for transportation and applicable customs processes.
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

          {/* Road Feeder Network Connection Card */}
          <div className="bg-[#0B1F3A] text-white p-7 sm:p-8 rounded-3xl border border-[#1E3A5F] shadow-card flex flex-col justify-between text-left space-y-6 h-full">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Commercial Road Transportation Support</h3>
              <p className="text-xs sm:text-sm text-[#B6C2D1] leading-relaxed font-normal">
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
                className="px-6 py-3.5 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm cursor-pointer flex items-center space-x-2"
              >
                <span>View Road Transportation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6B. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Common questions regarding our Air Waybill preparation, billing verification, and transportation coordination.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'What is an Air Waybill (AWB)?',
              a: 'An Air Waybill (AWB) is the official transport document and contract of carriage for air cargo shipments. It acts as a receipt issued by or on behalf of the carrier, detailing shipment contents, shipper and consignee data, routing, and cargo specifications necessary for airline handover and documentation verification.'
            },
            {
              q: 'What information do you need to prepare an AWB?',
              a: 'To prepare your Air Waybill and accompanying shipment documentation accurately, we require shipper and consignee details, cargo description, quantity, weight and dimensions, commercial invoice, packing list, origin and destination, and any special handling instructions.'
            },
            {
              q: 'How is air freight billing calculated?',
              a: 'Air freight documentation and transportation billing is calculated based on chargeable weight (the higher of gross weight or volumetric/dimensional weight) along with applicable partner freight rates, documentation preparation, and handling fees.'
            },
            {
              q: 'Which types of cargo do you support?',
              a: 'We coordinate documentation and logistics support for General Cargo, Fragile Cargo, Documents & Parcels, Electronics, and Perishable Cargo through our logistics partner network.'
            },
            {
              q: 'How do I track my air shipment?',
              a: 'Once your shipment records are verified and assigned an Air Waybill / tracking number, you can track shipment status using our online tracking feature or by contacting our operations dispatch team for milestone updates.'
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
        <div className="bg-[#0B1F3A] rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl border border-[#1E3A5F] relative overflow-hidden space-y-6">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
              Ready to Coordinate Your Air Freight Services?
            </h2>
            <p className="text-[#B6C2D1] text-sm sm:text-base font-normal">
              Obtain documentation support, prepare your Air Waybill details, and coordinate transportation support for your commercial goods.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              type="button"
              onClick={handleQuoteClick}
              className="px-8 py-3.5 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer active:scale-95 flex items-center space-x-2"
            >
              <span>Get an Air Freight Quote</span>
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
