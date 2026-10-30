import React, { useState, useRef, useEffect } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { 
  Search, 
  Truck, 
  Package, 
  ShieldCheck, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Zap, 
  Layers,
  Sparkles,
  Phone,
  Mail,
  Shield,
  Activity,
  SlidersHorizontal,
  Compass,
  Building2,
  Calendar,
  Globe,
  Plane,
  Thermometer,
  FileCheck,
  FileText,
  Users,
  Handshake,
  MessageSquare
} from 'lucide-react';

export const HomePage = ({ setActiveTab }) => {
  const { 
    currentUser, 
    setIsAuthModalOpen, 
    setAuthRedirectTab,
    resetShipmentScope, 
    setActiveTrackingId,
    showToast,
    websiteContent,
    managedServices
  } = useLogistics();

  const [trackingNumber, setTrackingNumber] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65;
    }
  }, []);

  const heroData = websiteContent?.hero || {};
  const heroTitle = heroData.title || 'Reliable Logistics Solutions For Every Journey';
  const heroSubtitle = heroData.subtitle || 'From Air Waybill preparation and shipment documentation to commercial road transportation, we provide reliable logistics support for businesses moving goods from one location to another.';
  const heroCtaPrimary = heroData.ctaPrimary || 'Get a Freight Quote';
  const heroCtaSecondary = heroData.ctaSecondary || '';
  const heroBadge = heroData.badge || '';

  const handleHeroTrackSubmit = (e) => {
    if (e) e.preventDefault();
    const term = trackingNumber.trim();
    if (!term) {
      if (showToast) showToast('Please enter a tracking / AWB number.', 'warning');
      return;
    }
    setActiveTrackingId(term);
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('track');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in or create an account to view live tracking details.', 'warning');
      return;
    }
    setActiveTab('track');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleTrackAction = () => {
    setActiveTab('track');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleQuoteAction = () => {
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('quote');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
      return;
    }
    setActiveTab('quote');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // Slim Trust Strip Items (Only verified Singapore operations credentials)
  const trustItems = [
    { id: 'support', label: 'Air & Road Support', icon: Layers },
    { id: 'location', label: 'Based in Singapore', icon: MapPin }
  ];

  // 3 Primary Services read directly from centralized websiteContent
  const servicesData = websiteContent?.services || {};
  const allServices = [
    {
      id: 'air-freight',
      active: managedServices?.airway?.active !== false,
      title: servicesData.airway?.title || 'Air Freight Services',
      desc: servicesData.airway?.shortDesc || 'Air Waybill preparation, billing and shipment documentation support for commercial air freight.',
      image: '/assets/air_freight_unbranded.jpg',
      tab: 'air-freight'
    },
    {
      id: 'road-transport',
      active: managedServices?.road?.active !== false,
      title: servicesData.road?.title || 'Commercial Road Transportation',
      desc: servicesData.road?.shortDesc || 'Commercial road transportation coordinated through partner carriers, based on your shipment requirements.',
      image: '/assets/road_truck_highway.jpg',
      tab: 'road-freight'
    },
    {
      id: 'customs-docs',
      active: managedServices?.documentation?.active !== false,
      title: servicesData.documentation?.title || 'Shipment Documentation Support',
      desc: servicesData.documentation?.shortDesc || 'Help preparing and organising shipment documents. Documentation support only; we do not provide customs clearance.',
      image: '/assets/shipment_documentation_desk.jpg',
      tab: 'shipment-documentation-support'
    }
  ];
  const ourServices = allServices.filter(s => s.active);

  // 4 Genuine Differentiators for "Why Choose Josan Logistics" Section
  const differentiators = [
    {
      id: 'single-contact',
      icon: Users,
      title: 'Single Point of Contact',
      desc: 'One team handling your air and road shipments.'
    },
    {
      id: 'accurate-docs',
      icon: FileCheck,
      title: 'Accurate Documentation',
      desc: 'Carefully prepared shipment paperwork.'
    },
    {
      id: 'partner-network',
      icon: Handshake,
      title: 'Trusted Partner Network',
      desc: 'Established transport partners for dependable capacity.'
    },
    {
      id: 'responsive-support',
      icon: MessageSquare,
      title: 'Responsive Support',
      desc: 'Quick replies by phone and email.'
    }
  ];

  return (
    <div className="w-full">
      
      {/* Announcement Banner (if activated in Admin > Website Content) */}
      {websiteContent?.banner?.active && websiteContent?.banner?.text && (
        <div className={`w-full py-2.5 px-4 text-center text-xs font-bold tracking-wide z-30 transition-all ${
          websiteContent.banner.type === 'warning'
            ? 'bg-amber-500 text-slate-950'
            : websiteContent.banner.type === 'alert'
            ? 'bg-rose-600 text-white'
            : 'bg-[#0B1F3A] text-white border-b border-[#1E3A5F]'
        }`}>
          <span>{websiteContent.banner.text}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-18 lg:pb-24 overflow-hidden bg-slate-100 min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] xl:min-h-[620px] flex flex-col justify-center">
        {/* Video / Photo Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="auto"
            onLoadedMetadata={(e) => { e.currentTarget.playbackRate = 0.65; }}
            onPlay={(e) => { e.currentTarget.playbackRate = 0.65; }}
            className="w-full h-full object-cover object-[70%_center] sm:object-[75%_center] lg:object-[80%_center] transform scale-105"
          >
            <source src="/assets/truck_and_airplane.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          
          {/* Left-aligned text container without any box blocking the truck */}
          <div className="max-w-xl lg:max-w-2xl space-y-6 text-left">
            {heroBadge ? (
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/30">
                {heroBadge}
              </span>
            ) : null}

            <h1 
              className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] font-black tracking-tight text-white leading-[1.1]"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 4px 24px rgba(0,0,0,0.7)' }}
            >
              {heroTitle}
            </h1>

            <p 
              className="text-white text-base sm:text-lg lg:text-xl leading-relaxed font-medium max-w-xl"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9), 0 2px 14px rgba(0,0,0,0.75)' }}
            >
              {heroSubtitle}
            </p>

            {/* Compact Tracking Box + Get a Freight Quote CTA */}
            <div className="space-y-4 pt-1 w-full max-w-xl">
              {/* Compact Tracking Box */}
              <form 
                onSubmit={handleHeroTrackSubmit}
                className="w-full bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl sm:rounded-full shadow-2xl border border-white/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                <div className="relative flex-1 flex items-center pl-3.5 sm:pl-4">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter your tracking / AWB number"
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-semibold focus:outline-none py-2.5 sm:py-2"
                  />
                </div>
                <button
                  type="submit"
                  className="px-7 py-3 sm:py-2.5 bg-[#0B1F3A] hover:bg-[#132A4A] text-white rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm active:scale-95 shrink-0"
                >
                  <span>Track</span>
                  <ArrowRight className="w-4 h-4 text-[#F26B21]" />
                </button>
              </form>

              {/* Action Buttons: Primary + Optional Secondary */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleQuoteAction}
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase transition-colors flex items-center justify-center space-x-2.5 cursor-pointer active:scale-95 shadow-lg group"
                >
                  <span>{heroCtaPrimary}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {heroCtaSecondary ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('road-freight');
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-white/20 hover:bg-white/30 text-white rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase transition-colors flex items-center justify-center space-x-2 border border-white/30 cursor-pointer"
                  >
                    <span>{heroCtaSecondary}</span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SLIM TRUST STRIP (DIRECTLY BELOW HERO)                                   */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-slate-200/80 py-3.5 sm:py-4 relative z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid ${trustItems.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 max-w-2xl mx-auto'} gap-4 sm:gap-8 items-center justify-center`}>
            {trustItems.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.id} className="flex items-center justify-center space-x-2 text-[#0B1F3A] py-1 px-3">
                  <IconComp className="w-4 h-4 text-[#0B1F3A] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-[#0B1F3A] whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OUR SERVICES (CONSOLIDATED 3-CARD SECTION)                            */}
      {/* ========================================================================= */}
      <section 
        className="bg-[#EEF2F7] bg-gradient-to-b from-[#EAF0F7] to-[#EEF2F7] py-16 sm:py-24 border-b border-[#E2E8F0]"
        style={{ background: 'linear-gradient(to bottom, #EAF0F7, #EEF2F7)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] font-heading">
              Our Services
            </h2>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Dependable logistics solutions supporting commercial cargo movement, Air Waybill documentation, and road transportation.
            </p>
          </div>

          {/* Service Cards Centered Evenly */}
          <div className={`grid grid-cols-1 ${
            ourServices.length === 1 
              ? 'max-w-md mx-auto' 
              : ourServices.length === 2 
                ? 'md:grid-cols-2 max-w-4xl mx-auto' 
                : 'md:grid-cols-3'
          } gap-6 lg:gap-8 justify-center`}>
            {ourServices.map((svc) => (
              <div 
                key={svc.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image */}
                  <div className="h-52 w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 relative">
                    <img 
                      src={svc.image} 
                      alt={svc.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-extrabold text-[#0B1F3A] font-heading mt-5">
                    {svc.title}
                  </h3>

                  {/* One short sentence (max 20 words) */}
                  <p className="text-sm text-[#475569] font-medium leading-relaxed mt-2.5">
                    {svc.desc}
                  </p>
                </div>

                {/* Learn More link */}
                <div className="pt-6 mt-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab(svc.tab);
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    }}
                    className="text-xs sm:text-sm font-bold text-[#0B1F3A] hover:text-[#F26B21] inline-flex items-center space-x-1.5 cursor-pointer group/link transition-colors"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform text-[#0B1F3A] group-hover/link:text-[#F26B21]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY CHOOSE JOSAN (WHITE SECTION: #FFFFFF)                              */}
      {/* ========================================================================= */}
      <section className="bg-white py-16 sm:py-24 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] font-heading">
              Why Choose Josan Logistics
            </h2>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Practical, dependable logistics coordination focused on clear communication, organized documentation, and trusted partner networks.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {differentiators.map((item) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={item.id}
                  className="p-5 sm:p-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0B1F3A]/5 text-[#0B1F3A] flex items-center justify-center group-hover:bg-[#F26B21] group-hover:text-white transition-colors duration-300">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0B1F3A] font-heading leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. CTA BANNER (LIGHT SECTION: #F5F7FB)                                    */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 text-slate-900 rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xs border border-slate-200">
            {/* Multimodal Logistics Hub Scene Background with Subtle Transparency */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img 
                src="/assets/homepage_logistics_hub_bg.jpg" 
                alt="Multimodal logistics operations with cargo flight and transport fleet" 
                className="w-full h-full object-cover object-center opacity-15 mix-blend-multiply scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent"></div>
            </div>
            
            <div className="max-w-3xl space-y-5 relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
                Ready to ship? Get your quote today.
              </h2>

              <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
                Get in touch with our team for a quote and support with your shipment.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleQuoteAction}
                  className="px-8 py-4 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center space-x-2 cursor-pointer active:scale-98"
                >
                  <span>Get a Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="tel:+6567890123"
                  className="px-8 py-4 bg-white hover:bg-slate-100 text-[#0B1F3A] rounded-xl font-bold text-sm border border-slate-200 transition-colors flex items-center space-x-2 shadow-2xs cursor-pointer"
                  title="Call Us (+65 6789 0123)"
                >
                  <Phone className="w-4 h-4 text-[#F26B21]" />
                  <span>Call Us</span>
                </a>

                <a
                  href="https://wa.me/6567890123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center space-x-2 shadow-2xs cursor-pointer active:scale-98"
                  title="Message on WhatsApp (+65 6789 0123)"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
