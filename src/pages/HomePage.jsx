import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
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
  const { setActiveTrackingId, getShipmentByTracking, showToast } = useLogistics();
  const [heroMode, setHeroMode] = useState('track'); // 'track' | 'rate'
  const [trackingInput, setTrackingInput] = useState('');
  
  // Quick Rate Estimator state inside Hero
  const [rateOrigin, setRateOrigin] = useState('San Jose, CA');
  const [rateDest, setRateDest] = useState('New York, NY');
  const [rateWeight, setRateWeight] = useState('150');
  const [rateService, setRateService] = useState('express');
  const [estimatedCost, setEstimatedCost] = useState(580);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      setActiveTrackingId(trackingInput.trim());
      setActiveTab('track');
    }
  };

  const handleDemoTrack = (id) => {
    setActiveTrackingId(id);
    setActiveTab('track');
  };

  const calculateQuickEstimate = (e) => {
    e.preventDefault();
    const weightNum = parseFloat(rateWeight) || 50;
    const mult = rateService === 'express' ? 3.5 : rateService === 'cold' ? 4.2 : 2.1;
    const total = Math.round(weightNum * mult + 120);
    setEstimatedCost(total);
    showToast(`Estimated Freight Rate: $${total}.00 USD`);
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION (TRACK SHIPMENT & QUICK RATE ESTIMATOR) */}
      <section className="relative pt-12 pb-24 lg:pt-16 lg:pb-28 overflow-hidden bg-white">
        {/* Subtle Lalamove orange background grid patterns */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#F26722_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold shadow-sm">
                <SparkleIcon />
                <span>Next-Gen Global Supply Chain & Telematics</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] font-sans">
                Smart Global Logistics <br />
                <span className="text-gradient-orange">Engineered For Speed</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                Josan Logistics powers corporate supply chains worldwide with express air cargo, heavy land haulage, automated warehousing, and real-time telemetry tracking.
              </p>

              {/* DUAL-FUNCTION HERO CARD (TRACK SHIPMENT / QUICK RATE CALCULATOR) */}
              <div className="bg-slate-900 p-3 sm:p-4 rounded-2xl shadow-orange-glow border-2 border-orange-500/40 space-y-3">
                
                {/* Hero Mode Tabs */}
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                  <button
                    onClick={() => setHeroMode('track')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
                      heroMode === 'track'
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Track Live Shipment</span>
                  </button>
                  <button
                    onClick={() => setHeroMode('rate')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
                      heroMode === 'rate'
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Instant Rate Calculator</span>
                  </button>
                </div>

                {/* TAB 1: TRACK SHIPMENT INPUT */}
                {heroMode === 'track' ? (
                  <div className="space-y-3">
                    <form onSubmit={handleTrackSubmit} className="bg-white rounded-xl p-2 flex flex-col sm:flex-row items-center gap-2">
                      <div className="relative w-full flex-1">
                        <Search className="w-5 h-5 text-orange-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={trackingInput}
                          onChange={(e) => setTrackingInput(e.target.value)}
                          placeholder="Enter Tracking ID (e.g. JOS-89421-US)..."
                          className="w-full pl-11 pr-4 py-3 text-sm font-semibold text-slate-900 bg-transparent border-none focus:outline-none placeholder:text-slate-400"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3 bg-orange-gradient hover:bg-orange-600 text-white rounded-lg font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 active:scale-95"
                      >
                        <span>Track Live</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>

                    {/* Quick Demo Pre-fill Links */}
                    <div className="px-1 flex flex-wrap items-center gap-2 text-xs text-white">
                      <span className="font-semibold text-slate-400">Try Live Demo ID:</span>
                      {['JOS-89421-US', 'JOS-33104-EU', 'JOS-77210-IN'].map((demoId) => (
                        <button
                          key={demoId}
                          onClick={() => handleDemoTrack(demoId)}
                          className="bg-slate-800 hover:bg-orange-500/20 text-orange-400 border border-slate-700 hover:border-orange-500 px-2.5 py-1 rounded font-mono font-bold text-[11px] transition-all"
                        >
                          {demoId}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* TAB 2: QUICK RATE CALCULATOR */
                  <form onSubmit={calculateQuickEstimate} className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="bg-slate-800 rounded-lg p-2 border border-slate-700">
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Origin City</label>
                        <div className="flex items-center space-x-1.5 text-white">
                          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <input
                            type="text"
                            value={rateOrigin}
                            onChange={(e) => setRateOrigin(e.target.value)}
                            className="bg-transparent text-xs font-bold w-full focus:outline-none text-white"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-2 border border-slate-700">
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Destination</label>
                        <div className="flex items-center space-x-1.5 text-white">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <input
                            type="text"
                            value={rateDest}
                            onChange={(e) => setRateDest(e.target.value)}
                            className="bg-transparent text-xs font-bold w-full focus:outline-none text-white"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-2 border border-slate-700">
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Weight (KG)</label>
                        <div className="flex items-center space-x-1.5 text-white">
                          <Package className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <input
                            type="number"
                            value={rateWeight}
                            onChange={(e) => setRateWeight(e.target.value)}
                            className="bg-transparent text-xs font-bold w-full focus:outline-none text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                      <div className="flex items-center space-x-3 text-xs text-slate-300">
                        <span className="font-bold text-slate-400">Estimated Freight Cost:</span>
                        <span className="text-xl font-extrabold text-orange-400">${estimatedCost}.00 USD</span>
                      </div>
                      <div className="flex space-x-2 w-full sm:w-auto">
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs border border-slate-700 transition-colors"
                        >
                          Calculate Rate
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('book')}
                          className="px-5 py-2.5 bg-orange-gradient hover:bg-orange-600 text-white rounded-lg font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
                        >
                          <span>Proceed To Book</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </form>
                )}

              </div>

              {/* Key Hero Metric Counters */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">99.8%</p>
                  <p className="text-xs font-semibold text-slate-500">On-Time SLA Guarantee</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-orange-600">50K+</p>
                  <p className="text-xs font-semibold text-slate-500">Monthly Cargo Shipments</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">120+</p>
                  <p className="text-xs font-semibold text-slate-500">Global Hub Centers</p>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80"
                  alt="Josan Freight Operations"
                  className="w-full h-[440px] object-cover opacity-85 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                
                {/* Floating Tracking Badge */}
                <div className="absolute bottom-6 left-6 right-6 glass-card p-4 rounded-2xl shadow-elevated border border-orange-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                        <Truck className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Active Freight Fleet</p>
                        <p className="text-sm font-extrabold text-slate-900">Truck #FL-408 In Transit</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping"></span>
                      On Schedule
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SERVICES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-orange-600 font-bold uppercase text-xs tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            End-To-End Freight Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Comprehensive Services Tailored For Modern Business
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From single express parcels to full container loads, our multimodal fleet guarantees speed, safety, and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Plane,
              title: 'Express Air Freight',
              desc: 'Priority air cargo for time-critical shipments with guaranteed next-day delivery across major global airports.',
              badge: 'Fastest Transit',
              spec: 'Transit: 12-24 Hrs | Max Weight: Unlimited'
            },
            {
              icon: Truck,
              title: 'Land Haulage & Trucking',
              desc: 'Dedicated FTL & LTL truck fleet with GPS telematics, temperature control, and route optimization.',
              badge: 'Popular Choice',
              spec: 'Transit: 1-3 Days | Real-Time Telematics'
            },
            {
              icon: Ship,
              title: 'Ocean Cargo & Containers',
              desc: 'Full Container Load (FCL) & Less Container Load (LCL) shipping across primary ocean trade lanes.',
              badge: 'Best Value',
              spec: 'Transit: 10-18 Days | FCL & LCL Options'
            },
            {
              icon: Warehouse,
              title: 'Smart Warehousing',
              desc: 'Automated inventory management, parcel storage bin tracking, and rapid cross-dock fulfillment hubs.',
              badge: '24/7 Monitored',
              spec: 'Climate Controlled | Real-Time Storage Log'
            },
            {
              icon: Thermometer,
              title: 'Cold Chain Logistics',
              desc: 'Specialized temperature-controlled transit for pharmaceuticals, vaccines, and perishable goods.',
              badge: 'Pharma SLA',
              spec: 'Temp Range: -20°C to +8°C | Sensor Telemetry'
            },
            {
              icon: ShieldCheck,
              title: 'Customs & Insurance',
              desc: 'Comprehensive customs clearance, import/export compliance documentation, and 100% cargo insurance.',
              badge: 'Fully Covered',
              spec: '100% Value Guarantee | Instant QR Waybill'
            }
          ].map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-card hover:shadow-orange-glow hover:border-orange-300 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-gradient group-hover:text-white transition-all duration-300 shadow-sm">
                      <IconComponent className="w-7 h-7 stroke-[2]" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold text-slate-400">{service.spec}</span>
                  <button
                    onClick={() => setActiveTab('services')}
                    className="inline-flex items-center text-xs font-bold text-orange-600 hover:text-orange-700 space-x-1 group/btn shrink-0"
                  >
                    <span>Rates</span>
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
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                We combine modern telemetry hardware, automated dispatch algorithms, and a customer-first service culture to eliminate supply chain bottlenecks.
              </p>

              <div className="pt-2 flex items-center space-x-4">
                <button
                  onClick={() => setActiveTab('book')}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-orange-glow transition-all inline-flex items-center space-x-2"
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
              quote: "Josan Logistics reduced our transit delay rates by over 40%. The real-time tracking timeline and automated invoice system saved our operations team hundreds of hours.",
              author: "Marcus Vance",
              role: "VP of Supply Chain",
              company: "TechCorp Solutions",
              shipmentId: "JOS-89421-US",
              rating: 5,
              photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            },
            {
              quote: "When shipping temperature-sensitive pharmaceutical vaccines, zero margin for error exists. Josan's Cold Chain Air Freight delivered 100% SLA accuracy across all batches.",
              author: "Dr. Ananya Roy",
              role: "Operations Director",
              company: "Vedic Pharma Labs",
              shipmentId: "JOS-77210-IN",
              rating: 5,
              photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            },
            {
              quote: "The admin dashboard driver assignment and warehouse bin log features are phenomenal. It gives us complete control over our transatlantic automotive cargo.",
              author: "Hans Van Berg",
              role: "Logistics Manager",
              company: "Global Auto DE",
              shipmentId: "JOS-33104-EU",
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
                <p className="text-slate-700 text-sm italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                <img src={item.photo} alt={item.author} className="w-11 h-11 rounded-full object-cover border-2 border-orange-500" />
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{item.author}</p>
                  <p className="text-xs text-slate-500 font-semibold">{item.role}, <span className="text-orange-600">{item.company}</span></p>
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
            <p className="text-orange-100 text-sm sm:text-base">
              Get an instant rate estimate, choose your preferred speed level, and dispatch your shipment in under 2 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 z-10">
            <button
              onClick={() => setActiveTab('book')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-sm shadow-xl transition-all flex items-center justify-center space-x-2 active:scale-95"
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

