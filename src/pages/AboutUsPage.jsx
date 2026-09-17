import React from 'react';
import { ShieldCheck, Globe, Users, Award, Truck, CheckCircle2, ChevronRight, Navigation, MapPin } from 'lucide-react';
import roadwayTruckImg from '../assets/roadway_truck_highway.jpg';

export const AboutUsPage = ({ setActiveTab }) => {
  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="bg-[#10182D] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-[#FF6B00] font-bold uppercase text-xs tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
            About Josan Logistics
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Empowering Highway & Roadway Freight Networks
          </h1>
          <p className="text-white/90 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Operating across Singapore and cross-border road corridors, Josan Logistics delivers high-performance full truckload (FTL), container haulage, and interstate linehaul with real-time highway telematics and precision dispatching.
          </p>
        </div>
      </section>

      {/* Story & Stats Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-orange-600 text-xs font-bold uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5" />
              <span>Commercial Road Freight Leaders</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Our Focus: Singapore Roadways & Regional Highway Excellence
            </h2>
            <p className="text-slate-900 font-semibold text-sm sm:text-base leading-relaxed">
              Headquartered and operating out of Singapore, Josan Logistics specializes in rapid, dependable commercial roadway transport across Singapore's expressways and regional highway corridors. We manage dedicated linehaul fleets, heavy container prime movers, and refrigerated road trucks that keep commerce moving 24/7.
            </p>
            <p className="text-slate-900 font-semibold text-sm sm:text-base leading-relaxed">
              Today, our automated highway telematics platform monitors over 50,000 active roadway consignments and truck dispatches every month—delivering minute-by-minute GPS telemetry, axle weighbridge records, and verified electronic Proof of Delivery (E-POD) from depot bays to final destination docks.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 shadow-2xs">
                <p className="text-2xl font-extrabold text-orange-600">120+</p>
                <p className="text-xs font-black text-slate-900">Roadway & Depot Terminals</p>
              </div>
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 shadow-2xs">
                <p className="text-2xl font-extrabold text-slate-900">4,800+</p>
                <p className="text-xs font-black text-slate-900">Commercial Trucks & Trailers</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white group">
              <img
                src={roadwayTruckImg}
                alt="Josan Commercial Roadway Semi-Truck on Highway Corridor"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md rounded-xl p-3 text-white text-xs border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-bold">Live Highway Fleet GPS Active</span>
                </div>
                <span className="text-orange-400 font-mono text-[11px] font-bold">100% Road Telematics</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Core Principles */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">Our Core Roadway Operating Values</h2>
            <p className="text-slate-900 font-bold text-sm sm:text-base">Every road consignment is handled with certified safety, speed, and real-time accountability.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Zero Highway SLA Compromise', desc: '99.8% on-time road linehaul delivery backed by continuous GPS telematics and escort protocols.' },
              { title: 'Complete LR Transparency', desc: 'Upfront per-trip rates, weighbridge records, and verified digital Lorry Receipts (LR) with zero hidden fees.' },
              { title: 'Cold & Heavy Road Haulage', desc: 'Certified reefer trucks (2°C - 8°C) and heavy multi-axle low-bed trailers for oversized equipment.' },
              { title: '24/7 Roadside & Dispatch Support', desc: 'Round-the-clock highway telematics dispatch, driver safety monitoring, and instant route updates.' }
            ].map((v, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-orange-500 hover:shadow-card transition-all">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 text-base mb-2">{v.title}</h4>
                <p className="text-xs sm:text-[13px] text-slate-900 font-semibold leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
