import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Plane, 
  FileText, 
  Handshake, 
  ArrowRight, 
  Target, 
  Compass,
  Layers,
  FileCheck,
  Sparkles
} from 'lucide-react';
import roadwayTruckImg from '../assets/roadway_truck_highway.jpg';

export const AboutUsPage = ({ setActiveTab }) => {
  const whyChoosePoints = [
    {
      title: 'Reliable Logistics Support',
      desc: 'Practical logistics support for businesses moving commercial goods.',
      icon: ShieldCheck
    },
    {
      title: 'Airway Documentation',
      desc: 'Support for AWB preparation, billing and shipment documentation.',
      icon: Plane
    },
    {
      title: 'Commercial Road Transportation',
      desc: 'Transportation coordination for moving products and goods between locations.',
      icon: Truck
    },
    {
      title: 'Flexible Transportation Network',
      desc: 'Transportation arrangements coordinated through suitable logistics partners.',
      icon: Handshake
    },
    {
      title: 'Documentation Support',
      desc: 'Organized shipment and customs-related documentation assistance.',
      icon: FileText
    }
  ];

  return (
    <div className="space-y-14 sm:space-y-16 pb-20">
      
      {/* 1. Header Banner with Organic Curve Transition */}
      <section className="relative bg-[#0B1F3A] text-white pt-16 pb-28 sm:pt-20 sm:pb-36 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-12 left-1/4 w-96 h-96 bg-[#F26B21]/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Subtle Modern Grid Texture */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-[#B6C2D1] font-bold uppercase text-xs tracking-widest bg-white/10 px-4 py-1.5 rounded-full border border-white/15 inline-flex items-center gap-1.5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#F26B21]" />
            <span>About Josan Logistics</span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
            Moving Goods with Reliable Logistics Support
          </h1>
          <p className="text-[#B6C2D1] font-normal max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
            Josan Logistics provides logistics and transportation support for businesses that need to move commercial goods efficiently between locations. Our services cover airway documentation and transportation support as well as commercial road transportation through trusted transportation partners.
          </p>
        </div>

        {/* Layered Organic Wave Transition merging into the white background */}
        <div className="absolute -bottom-px left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg 
            className="relative block w-full h-12 sm:h-16 lg:h-24" 
            viewBox="0 0 1440 100" 
            fill="none" 
            preserveAspectRatio="none"
          >
            {/* Subtle translucent accent wave */}
            <path 
              d="M0,45 C380,95 720,90 1080,45 C1240,25 1360,20 1440,15 L1440,100 L0,100 Z" 
              fill="rgba(255, 255, 255, 0.15)" 
            />
            {/* Solid white wave blending directly into the page */}
            <path 
              d="M0,25 C320,85 720,95 1120,55 C1260,40 1370,25 1440,15 L1440,100 L0,100 Z" 
              fill="#FFFFFF" 
            />
          </svg>
        </div>
      </section>

      {/* 2. Story & Company Overview Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 rounded-full text-[#0B1F3A] text-xs font-bold uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5" />
              <span>Logistics &amp; Transportation Support</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#0B1F3A] font-heading">
              Practical Solutions for Business Cargo Movement
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
              Josan Logistics is a logistics and transportation support company providing practical solutions for businesses moving commercial goods between locations.
            </p>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
              From Air Waybill preparation and billing to shipment documentation and commercial road transportation, we support businesses with practical logistics solutions based on their shipment requirements.
            </p>

            {/* Factual Highlight Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <p className="text-base font-extrabold text-[#0B1F3A]">Airway &amp; Documentation</p>
                <p className="text-xs text-slate-600 font-medium mt-1">AWB preparation, billing and air shipment paperwork coordination.</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <p className="text-base font-extrabold text-[#0B1F3A]">Road Transportation</p>
                <p className="text-xs text-slate-600 font-medium mt-1">Commercial goods movement via trusted transportation partners.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white group">
              <img
                src={roadwayTruckImg}
                alt="Josan Logistics Commercial Road Transportation Support"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/85 backdrop-blur-md rounded-xl p-3 text-white text-xs border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-bold">Commercial Transportation Support</span>
                </div>
                <span className="text-orange-400 font-mono text-[11px] font-bold">Transportation Partner Network</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Service Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Our Core Services
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
            Commercial Logistics Services
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Tailored logistics and documentation assistance for businesses moving products between locations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Pillar 1: Airway Services */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-card transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-bold">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Airway Services</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Our airway services focus on Air Waybill preparation, billing, shipment documentation and transportation coordination for commercial shipments.
              </p>
            </div>
            {setActiveTab && (
              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('air-freight');
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#FF6B00] hover:text-orange-700 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Learn about Airway Services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Pillar 2: Road Transportation */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-card transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Road Transportation</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Our road transportation service supports the movement of commercial products and goods from one location to another through a network of transportation partners.
              </p>
            </div>
            {setActiveTab && (
              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('road-freight');
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#FF6B00] hover:text-orange-700 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Learn about Road Transportation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Pillar 3: Documentation Support */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-[#FF6B00] hover:shadow-card transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Documentation Support</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                We provide organized shipment and customs-related documentation support to help businesses prepare the information required for transportation and applicable customs processes.
              </p>
            </div>
            {setActiveTab && (
              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('customs-clearance');
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#FF6B00] hover:text-orange-700 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Learn about Documentation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Josan Logistics */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading">Why Choose Josan Logistics</h2>
            <p className="text-slate-600 font-medium text-sm sm:text-base">
              Practical logistics and documentation solutions designed around your commercial shipment requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoosePoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#FF6B00] hover:shadow-card transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2 font-heading">{point.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{point.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="bg-[#0B1F3A] text-white p-8 sm:p-10 rounded-3xl border border-[#1E3A5F] shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-mono font-bold text-[#B6C2D1] uppercase tracking-wider block">
                Our Purpose
              </span>
              <h3 className="text-2xl font-extrabold text-white font-heading">Our Mission</h3>
              <p className="text-[#B6C2D1] text-sm sm:text-base leading-relaxed font-normal">
                To provide dependable and practical logistics support that helps businesses move their goods through suitable transportation and documentation solutions.
              </p>
            </div>
            <div className="pt-2 flex items-center space-x-2 text-xs text-[#B6C2D1] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Dependable Logistics &bull; Practical Solutions</span>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-[#0B1F3A] text-white p-8 sm:p-10 rounded-3xl border border-[#1E3A5F] shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-mono font-bold text-[#B6C2D1] uppercase tracking-wider block">
                Our Direction
              </span>
              <h3 className="text-2xl font-extrabold text-white font-heading">Our Vision</h3>
              <p className="text-[#B6C2D1] text-sm sm:text-base leading-relaxed font-normal">
                To build a trusted logistics service focused on reliable transportation coordination, accurate documentation and professional customer support.
              </p>
            </div>
            <div className="pt-2 flex items-center space-x-2 text-xs text-[#B6C2D1] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Trusted Service &bull; Accurate Documentation</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
