import React from 'react';
import { ShieldCheck, Globe, Users, Award, Truck, CheckCircle2, ChevronRight } from 'lucide-react';

export const AboutUsPage = ({ setActiveTab }) => {
  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-orange-400 font-bold uppercase text-xs tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            About Josan Logistics
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-sans">
            Architecting Regional & Global Supply Chains
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Mainly focusing on Singapore, Josan Logistics provides seamless freight delivery within Singapore and to surrounding countries with real-time telematics and efficient dispatching.
          </p>
        </div>
      </section>

      {/* Story & Stats Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Our Focus: Singapore Hub & Regional Delivery Excellence
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Headquartered and mainly operating out of Singapore, Josan Logistics specializes in fast, reliable delivery throughout Singapore and to all surrounding countries across the region.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Today, our state-of-the-art telemetry system tracks over 50,000 active parcels every month, ensuring complete visibility from sender pickup to final delivery signature.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="text-2xl font-extrabold text-orange-600">120+</p>
                <p className="text-xs font-bold text-slate-700">Global Hub Terminals</p>
              </div>
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
                <p className="text-2xl font-extrabold text-slate-900">4,800+</p>
                <p className="text-xs font-bold text-slate-700">Active Vehicles & Containers</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80"
                alt="Josan Global Warehouse Hub"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Core Principles */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">Our Core Operating Values</h2>
            <p className="text-slate-600 text-sm">Every shipment is handled with precision and accountability.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Zero SLA Compromise', desc: '99.8% on-time delivery backed by real-time tracking transparency.' },
              { title: 'Full Transparency', desc: 'No hidden fees or surprise surcharges. Complete cost visibility.' },
              { title: 'Cold & Secure Freight', desc: 'ISO certified cold chain monitoring for sensitive pharmaceutical cargo.' },
              { title: '24/7 AI Support', desc: 'Round-the-clock dispatch assistance and instant tracking query resolution.' }
            ].map((v, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-orange-500 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">{v.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
