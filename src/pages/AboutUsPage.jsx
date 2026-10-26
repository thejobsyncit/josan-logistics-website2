import React from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Handshake, 
  Target, 
  Compass,
  Users,
  FileCheck,
  Headphones,
  ArrowRight
} from 'lucide-react';
import roadwayTruckImg from '../assets/Local CDL Training in Minden.jpg';

export const AboutUsPage = ({ setActiveTab }) => {
  const { currentUser, setIsAuthModalOpen, setAuthRedirectTab, showToast } = useLogistics();

  const handleQuoteClick = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('quote');
      if (setIsAuthModalOpen) setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
      return;
    }
    if (setActiveTab) setActiveTab('quote');
    else window.location.hash = '#quote';
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleContactClick = () => {
    if (setActiveTab) setActiveTab('contact');
    else window.location.hash = '#contact';
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };
  const whyChoosePoints = [
    {
      title: 'Single Point of Contact',
      desc: 'One team handling your air and road shipments.',
      icon: Users
    },
    {
      title: 'Accurate Documentation',
      desc: 'Carefully prepared shipment paperwork.',
      icon: FileCheck
    },
    {
      title: 'Trusted Partner Network',
      desc: 'Established transport partners for dependable capacity.',
      icon: Handshake
    },
    {
      title: 'Responsive Support',
      desc: 'Quick replies by phone and email.',
      icon: Headphones
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
            Moving Goods with Reliable Logistics Support
          </h1>
          <p className="text-[#B6C2D1] font-normal max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
            Josan Logistics provides logistics and transportation support for businesses that need to move commercial goods efficiently between locations. Our services cover air freight documentation and transportation support as well as commercial road transportation through trusted transportation partners.
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

      {/* 2. Our Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] font-heading tracking-tight">
              Dedicated Freight Coordination &amp; Documentation Support
            </h2>
            <div className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
              <p>
                Josan Logistics was established to provide reliable logistics coordination and specialized freight documentation for businesses moving commercial cargo in Singapore.
              </p>
              <p>
                We focus on simplifying shipping workflows—from Air Waybill preparation and billing verification to commercial road transportation coordination through trusted partners.
              </p>
              <p>
                We serve commercial enterprises, importers, exporters, and local businesses that value organized paperwork, compliance, and responsive communication.
              </p>
            </div>
          </div>

          {/* Right Column: Facts Panel */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Company Facts
                </h3>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Verified
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                <div className="py-3 flex items-start justify-between gap-4">
                  <span className="text-slate-500 font-medium shrink-0">Headquarters</span>
                  <span className="font-extrabold text-[#0B1F3A] text-right">Singapore</span>
                </div>
                <div className="py-3 flex items-start justify-between gap-4">
                  <span className="text-slate-500 font-medium shrink-0">Services</span>
                  <span className="font-bold text-[#0B1F3A] text-right">Air freight documentation, road transportation</span>
                </div>
                <div className="py-3 flex items-start justify-between gap-4">
                  <span className="text-slate-500 font-medium shrink-0">Registered as</span>
                  <span className="font-extrabold text-[#0B1F3A] text-right">Josan Logistics Pte. Ltd.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Company Overview Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
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
                <p className="text-base font-extrabold text-[#0B1F3A]">Air Freight &amp; Documentation</p>
                <p className="text-xs text-slate-600 font-medium mt-1">AWB preparation, billing and air shipment paperwork coordination.</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <p className="text-base font-extrabold text-[#0B1F3A]">Road Transportation</p>
                <p className="text-xs text-slate-600 font-medium mt-1">Commercial goods movement via trusted transportation partners.</p>
              </div>
            </div>

            {/* View all services text link */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (setActiveTab) setActiveTab('services');
                  else window.location.hash = '#services';
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
                className="text-sm font-bold text-[#FF6B00] hover:text-[#D95A13] hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                View all services →
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white group">
              <img
                src={roadwayTruckImg}
                alt="Josan Logistics Commercial Road Transportation Support"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Why Choose Josan Logistics */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading">Why Choose Josan Logistics</h2>
            <p className="text-slate-600 font-medium text-sm sm:text-base">
              Practical logistics and documentation solutions designed around your commercial shipment requirements.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {whyChoosePoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#FF6B00] hover:shadow-card transition-all flex flex-col justify-start"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold mb-3 sm:mb-4 shrink-0">
                    <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 font-heading leading-snug">{point.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{point.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="bg-[#0B1F3A] text-white p-8 sm:p-10 rounded-3xl border border-[#1E3A5F] shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-extrabold text-white font-heading">Our Mission</h3>
            <p className="text-[#B6C2D1] text-sm sm:text-base leading-relaxed font-normal">
              To provide dependable logistics and documentation support that simplifies commercial cargo movement.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-[#0B1F3A] text-white p-8 sm:p-10 rounded-3xl border border-[#1E3A5F] shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-extrabold text-white font-heading">Our Vision</h3>
            <p className="text-[#B6C2D1] text-sm sm:text-base leading-relaxed font-normal">
              To be a trusted logistics partner known for reliable transport coordination, accurate documentation, and responsive service.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B1F3A] text-white rounded-3xl p-8 sm:p-12 lg:p-14 border border-[#1E3A5F] shadow-xl relative overflow-hidden text-center space-y-6">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#F26B21]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Let's move your goods together
            </h2>
            <p className="text-[#B6C2D1] text-sm sm:text-base font-normal leading-relaxed">
              Connect with our team for reliable transport coordination and accurate freight documentation in Singapore.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            <button
              type="button"
              onClick={handleQuoteClick}
              className="px-8 py-3.5 sm:py-4 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center space-x-2 cursor-pointer active:scale-98"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleContactClick}
              className="px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl font-bold text-sm transition-colors flex items-center space-x-2 cursor-pointer active:scale-98"
            >
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
