import React from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { ArrowRight, Phone } from 'lucide-react';

import airFreightImg from '../assets/air_freight_unbranded.jpg';
import roadFreightImg from '../assets/road_truck_highway.jpg';
import docsHeroImg from '../assets/shipment_documentation_desk.jpg';

export const ServicesPage = ({ setActiveTab }) => {
  const { currentUser, setIsAuthModalOpen, setAuthRedirectTab, showToast, websiteContent, managedServices } = useLogistics();
  const servicesContent = websiteContent?.services || {};

  const handleNavigate = (path, tabId) => {
    if (setActiveTab) {
      setActiveTab(tabId);
    }
    if (typeof window !== 'undefined') {
      window.location.hash = `#${path.replace(/^\//, '')}`;
      if (window.history && window.history.pushState) {
        window.history.pushState({ tab: tabId }, '', `#${path.replace(/^\//, '')}`);
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const handleQuoteClick = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('quote');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in or create an account to request a freight quote.', 'warning');
      return;
    }
    if (setActiveTab) setActiveTab('quote');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const allServices = [
    {
      id: 'air-freight',
      active: managedServices?.airway?.active !== false,
      title: servicesContent.airway?.title || 'Air Freight Services',
      desc: servicesContent.airway?.shortDesc || 'Air Waybill preparation, billing and shipment documentation support for commercial air freight.',
      image: airFreightImg,
      fallbackUrl: '/assets/air_freight_unbranded.jpg',
      path: '/services/air-freight',
      tabId: 'air-freight'
    },
    {
      id: 'road-transportation',
      active: managedServices?.road?.active !== false,
      title: servicesContent.road?.title || 'Commercial Road Transportation',
      desc: servicesContent.road?.shortDesc || 'Commercial road transportation coordinated through partner carriers, based on your shipment requirements.',
      image: roadFreightImg,
      fallbackUrl: '/assets/road_truck_highway.jpg',
      path: '/services/road-transportation',
      tabId: 'road-freight'
    },
    {
      id: 'documentation',
      active: managedServices?.documentation?.active !== false,
      title: servicesContent.documentation?.title || 'Shipment Documentation Support',
      desc: servicesContent.documentation?.shortDesc || 'Help preparing and organising shipment documents. Documentation support only; we do not provide customs clearance.',
      image: docsHeroImg,
      fallbackUrl: '/assets/shipment_documentation_desk.jpg',
      path: '/services/documentation',
      tabId: 'shipment-documentation-support'
    }
  ];

  const services = allServices.filter(s => s.active);

  return (
    <div className="w-full space-y-16 sm:space-y-20 pb-20">
      
      {/* 1. HERO SECTION (NO PILL LABEL) */}
      <section className="relative bg-[#0B1F3A] text-white pt-16 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#1E3A5F]">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#F26B21]/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Subtle Background Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
            Our Services
          </h1>
          <p className="text-[#B6C2D1] text-base sm:text-lg lg:text-xl font-normal max-w-2xl mx-auto leading-relaxed">
            Air freight documentation, commercial road transportation and shipment documentation support.
          </p>
        </div>
      </section>

      {/* 2. SERVICE CARDS IN ONE ROW (CENTERED EVENLY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 ${
          services.length === 1 
            ? 'max-w-md mx-auto' 
            : services.length === 2 
              ? 'md:grid-cols-2 max-w-4xl mx-auto' 
              : 'md:grid-cols-3'
        } gap-6 lg:gap-8 justify-center`}>
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-5">
                {/* Image Container with light neutral backdrop */}
                <div className="h-52 w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 relative">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    loading="eager"
                    onError={(e) => {
                      if (e.target.src !== service.fallbackUrl) {
                        e.target.src = service.fallbackUrl;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A] font-heading">
                  {service.title}
                </h2>

                {/* One Short Sentence */}
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  {service.desc}
                </p>
              </div>

              {/* Learn More Link */}
              <div className="pt-6 border-t border-slate-100 mt-6">
                <a
                  href={`#${service.path.replace(/^\//, '')}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(service.path, service.tabId);
                  }}
                  className="inline-flex items-center space-x-1.5 text-[#F26B21] hover:text-[#D95A13] font-bold text-sm transition-colors group/link cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SHORT FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B1F3A] rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl border border-[#1E3A5F] relative overflow-hidden space-y-6">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-heading text-white">
              Not sure which service you need?
            </h2>
            <p className="text-[#B6C2D1] text-sm sm:text-base font-normal">
              Tell us about your shipment and our team will get back to you with guidance and freight pricing.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              type="button"
              onClick={handleQuoteClick}
              className="px-8 py-3.5 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer active:scale-95 flex items-center space-x-2"
            >
              <span>Get a Quote</span>
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
          </div>
        </div>
      </section>

    </div>
  );
};
