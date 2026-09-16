import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import heroLogisticsImg from '../assets/hero_logistics_3d.jpg';
import { 
  Search, 
  Truck, 
  Plane, 
  Ship, 
  Warehouse, 
  Thermometer, 
  ShieldCheck, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Calculator,
  MapPin,
  Package,
  Zap
} from 'lucide-react';

export const HomePage = ({ setActiveTab }) => {
  const { currentUser, setIsAuthModalOpen, resetShipmentScope } = useLogistics();

  const handleAction = (tab) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else if (tab === 'book' || tab === 'domestic-shipment') {
      resetShipmentScope();
      setActiveTab('domestic-shipment');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION (JCtrans Reference Style with 3D Artwork & Electric Orange) */}
      <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden bg-white">
        {/* Subtle orange background glow */}
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-slate-900 leading-[1.15] font-sans">
                Business Opportunities with <br />
                <span className="text-slate-900">Global Freight Forwarders</span>
              </h1>

              <p className="text-slate-800 font-semibold text-sm sm:text-base leading-relaxed max-w-xl">
                Josan Logistics is a premier B2B logistics platform dedicated to serving global freight forwarders, spanning 867 cities across 181 countries. With over 20 years of brand establishment, the platform supports over 11,000 paid member companies and more than 660,000 registered users worldwide. Annually, it facilitates over 3.5 million business opportunities, positioning Josan Logistics as one of the world's leading, fastest-growing logistics platforms.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleAction('book')}
                  className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold text-sm shadow-orange-sm transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                >
                  <span>Join Us</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {currentUser && (
                  <button
                    onClick={() => handleAction('track')}
                    className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <Search className="w-4 h-4 text-orange-400" />
                    <span>Track Shipment</span>
                  </button>
                )}
              </div>

            </div>

            {/* Right Hero 3D Logistics Artwork */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 bg-white group flex flex-col">
                {/* Full Uncut 3D Artwork */}
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
                    alt="3D Global Freight Supply Chain Render"
                    className="w-full h-auto object-contain block group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
                
                {/* Integrated Telematics Bar - Cleanly docked below the artwork so it never covers or cuts into the roadway & trucks */}
                <div className="bg-slate-900 px-4 py-3 sm:px-5 sm:py-3.5 border-t border-slate-800 text-white flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold shrink-0">
                      <Truck className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-100 text-xs sm:text-sm">Multi-Modal Freight Dispatch</p>
                      <p className="text-[10px] text-slate-400">Roadways Fleet • Ocean & Air Telematics Active</p>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-orange-400 bg-slate-800 px-2.5 sm:px-3 py-1 rounded-full border border-slate-700 shrink-0">
                    Live Status: 100% Active
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM STATISTICS BAR (4 Columns Matching Reference) */}
          <div className="mt-16 pt-10 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-orange-500 font-sans tracking-tight">3,500,000+</p>
              <p className="text-xs sm:text-sm font-bold text-slate-700">Business Opportunities / Year</p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-orange-500 font-sans tracking-tight">$4,000,000,000+</p>
              <p className="text-xs sm:text-sm font-bold text-slate-700">Payment Volume / Year</p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-orange-500 font-sans tracking-tight">$150,000</p>
              <p className="text-xs sm:text-sm font-bold text-slate-700">Cooperation Risk Protection / Year</p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-orange-500 font-sans tracking-tight">60,000+</p>
              <p className="text-xs sm:text-sm font-bold text-slate-700">Total Attendances / Year</p>
            </div>

          </div>

        </div>
      </section>

      {/* 2. SERVICES OVERVIEW & VEHICLE FLEET SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-orange-600 font-bold uppercase text-xs tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Roadways Freight Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Roadways & Land Haulage Logistics
          </h2>
          <p className="text-slate-900 font-semibold text-sm sm:text-base">
            From single express parcels to full truckload (FTL) and active cold chain reefer transport, our dedicated domestic road fleet guarantees speed, safety, and GPS telematics.
          </p>
        </div>

        {/* 4-Card Roadways Solutions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Truck,
              title: 'Full Truckload (FTL)',
              desc: 'Exclusive 24ft–40ft dedicated lorries & prime movers for bulk pallet freight with direct point-to-point highway routes.',
              badge: 'FTL Dedicated',
              spec: 'Transit: 1–2 Days',
              feature: 'Point-to-Point Direct Route'
            },
            {
              icon: Package,
              title: 'Less-Than-Truckload (LTL)',
              desc: 'Cost-effective consolidated road freight for 1–10 pallets with daily scheduled runs and computerized manifests.',
              badge: 'LTL Consolidated',
              spec: 'Transit: Daily Hub Runs',
              feature: 'Consolidated Shared Capacity'
            },
            {
              icon: Thermometer,
              title: 'Cold Chain Reefer Fleet',
              desc: 'Active temperature-regulated vans (-25°C to +25°C) with continuous IoT dataloggers for pharma & perishable foods.',
              badge: 'Temp Controlled',
              spec: 'Transit: Real-Time Telematics',
              feature: 'Pharma & Food GDP Certified'
            },
            {
              icon: Zap,
              title: 'Express Road Courier',
              desc: 'Rapid city dispatch utilizing dedicated sprinter vans and light commercial vehicles for urgent domestic deliveries.',
              badge: 'Express Same-Day',
              spec: 'Transit: Under 4 Hours',
              feature: 'Direct Priority Driver Dispatch'
            }
          ].map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:shadow-orange-glow hover:border-orange-400 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <IconComponent className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-900 font-semibold text-xs sm:text-[13px] leading-relaxed mb-4">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono font-black text-slate-900">
                    <span>{service.spec}</span>
                    <span className="text-emerald-700 font-sans font-bold">● Active</span>
                  </div>
                  <button
                    onClick={() => handleAction('domestic-shipment')}
                    className="w-full inline-flex items-center justify-between text-xs font-black text-orange-600 hover:text-orange-700 pt-1 group/btn cursor-pointer"
                  >
                    <span>Book Service</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-orange-400 font-bold uppercase text-xs tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                The Josan Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Why Industry Leaders Partner With Josan Logistics
              </h2>
              <p className="text-slate-200 font-medium text-sm sm:text-base leading-relaxed">
                We combine modern telemetry hardware, automated dispatch algorithms, and a customer-first service culture to eliminate supply chain bottlenecks.
              </p>

              <div className="pt-2 flex items-center space-x-4">
                <button
                  onClick={() => handleAction('book')}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-orange-glow transition-all inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>Book Freight Today</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: Navigation,
                  title: 'Real-Time GPS Telematics',
                  desc: 'Every vehicle and cargo container is equipped with satellite tracking for minute-by-minute status visibility.'
                },
                {
                  icon: TrendingUp,
                  title: 'Automated AI Routing',
                  desc: 'Our neural dispatcher reroutes shipments around weather delays and highway traffic dynamically.'
                },
                {
                  icon: Clock,
                  title: 'Guaranteed SLA Delivery',
                  desc: '99.8% on-time performance backed by financial delivery guarantees and real-time ETA updates.'
                },
                {
                  icon: ShieldCheck,
                  title: 'End-to-End Cargo Cover',
                  desc: 'Full value insurance policies protecting your valuable goods from pickup terminal to final doorstep.'
                }
              ].map((item, i) => {
                const IconComp = item.icon;
                return (
                  <div key={i} className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl hover:border-orange-500/50 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4">
                      <IconComp className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 4. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-orange-600 font-bold uppercase text-xs tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Client Success Stories
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Trusted By Enterprise Clients Worldwide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <div key={index} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between space-y-6 hover:shadow-orange-glow transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 space-x-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {item.shipmentId}
                  </span>
                </div>
                <p className="text-slate-900 font-medium text-sm italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                <img src={item.photo} alt={item.author} className="w-11 h-11 rounded-full object-cover border-2 border-orange-500" />
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{item.author}</p>
                  <p className="text-xs text-slate-700 font-bold">{item.role}, <span className="text-orange-600">{item.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA (BOOK SHIPMENT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-orange-gradient rounded-3xl p-10 sm:p-14 text-white shadow-orange-glow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left z-10">
            <span className="bg-white/20 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full">
              Instant Online Dispatch
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready To Ship Your Cargo With Zero Delays?
            </h2>
            <p className="text-white font-medium text-sm sm:text-base">
              Get an instant rate estimate, choose your preferred speed level, and dispatch your shipment in under 2 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 z-10">
            <button
              onClick={() => handleAction('book')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-sm shadow-xl transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
            >
              <Truck className="w-5 h-5 text-orange-400" />
              <span>Book Shipment Now</span>
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-bold text-sm transition-all text-center"
            >
              Contact Sales Team
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

const SparkleIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="currentColor" />
  </svg>
);

