import React, { useState, useRef, useEffect } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { getPhoneLinks } from '../config/siteConfig';
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
  const phoneLinks = getPhoneLinks(websiteContent?.contact?.phone);

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
      if (showToast) showToast('Enter your tracking number to see the latest status.', 'warning');
      return;
    }
    setActiveTrackingId(term);
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
      active: Boolean(managedServices?.documentation?.active),
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
            : 'bg-[var(--color-navy)] text-[var(--color-on-navy)] border-b border-[var(--color-navy-border)]'
        }`}>
          <span>{websiteContent.banner.text}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 overflow-hidden bg-[var(--color-navy)] min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] flex flex-col justify-center">
        {/* Video / Photo Background + Flat 55% Navy Overlay */}
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
            className="w-full h-full object-cover object-[70%_center] sm:object-[75%_center] lg:object-[80%_center]"
          >
            <source src="/assets/truck_and_airplane.mp4" type="video/mp4" />
          </video>
          <div aria-hidden="true" className="absolute inset-0 hero-navy-overlay" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          
          {/* Left-aligned hero content */}
          <div className="max-w-3xl text-left">
            {heroBadge ? (
              <span className="inline-block mb-4 px-3 py-1 rounded-[var(--radius)] text-xs font-semibold bg-white/15 text-[var(--color-on-navy)] border border-white/25">
                {heroBadge}
              </span>
            ) : null}

            <h1 
              className="text-[32px] sm:text-[42px] lg:text-[48px] font-bold text-[var(--color-on-navy)] leading-[1.15]"
              style={{ letterSpacing: 'normal' }}
            >
              {heroTitle}
            </h1>

            <p className="mt-4 text-base sm:text-lg leading-relaxed font-normal text-[var(--color-on-navy-muted)] max-w-xl">
              We prepare Air Waybills and shipment documents for air freight, and arrange commercial road transport through partner carriers. Tell us what you are moving and where it is going.
            </p>

            {/* Primary Hero CTA */}
            <div className="mt-7">
              <button
                type="button"
                onClick={handleQuoteAction}
                className="w-full sm:w-auto px-7 py-3.5 bg-[var(--color-orange)] hover:bg-[var(--color-orange-hover)] text-[var(--color-on-navy)] rounded-[var(--radius)] font-semibold text-base transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-on-navy)]"
              >
                Get a freight quote
              </button>
            </div>

            {/* Secondary Tracking Bar */}
            <div className="mt-6 w-full max-w-xl">
              <label
                htmlFor="hero-tracking-input"
                className="block text-sm font-medium text-[var(--color-on-navy)] mb-2"
              >
                Already shipped? Track it:
              </label>
              <form 
                onSubmit={handleHeroTrackSubmit}
                className="w-full bg-[var(--color-surface)] p-1.5 rounded-[var(--radius)] border border-[var(--color-border)] flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5"
              >
                <input
                  id="hero-tracking-input"
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter your AWB or tracking number"
                  className="w-full flex-1 bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] font-normal rounded-[var(--radius)] focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--color-navy)]"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[var(--color-navy)] hover:bg-[var(--color-navy-hover)] text-[var(--color-on-navy)] rounded-[var(--radius)] text-sm font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                >
                  Track shipment
                </button>
              </form>
              <p className="mt-2 text-xs font-normal text-[var(--color-on-navy-muted)]">
                Tracking shows status for shipments booked with us.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SLIM TRUST STRIP (DIRECTLY BELOW HERO)                                   */}
      {/* ========================================================================= */}
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-3.5 sm:py-4 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid ${trustItems.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 max-w-2xl mx-auto'} gap-4 sm:gap-8 items-center justify-center`}>
            {trustItems.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.id} className="flex items-center justify-center space-x-2 text-[var(--color-navy)] py-1 px-3">
                  <IconComp className="w-4 h-4 text-[var(--color-navy)] shrink-0" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-bold text-[var(--color-navy)] whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OUR SERVICES                                                           */}
      {/* ========================================================================= */}
      <section className="bg-[var(--color-bg)] py-[72px] border-b border-[var(--color-divider)]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto space-y-3">
            <h2
              className="text-3xl sm:text-4xl font-bold text-[var(--color-navy)] font-heading"
              style={{ letterSpacing: 'normal' }}
            >
              Our Services
            </h2>
            <p
              className="text-[var(--color-text-muted)] text-sm sm:text-[15px] font-normal leading-relaxed md:whitespace-nowrap"
              style={{ letterSpacing: 'normal' }}
            >
              We prepare air freight documents and arrange road transport for commercial cargo.
            </p>
          </div>

          {/* Service Cards */}
          <div
            className={`grid grid-cols-1 ${
              ourServices.length === 1
                ? 'max-w-lg mx-auto'
                : ourServices.length === 3
                  ? 'md:grid-cols-3'
                  : 'md:grid-cols-2'
            } gap-4 md:gap-8 items-stretch`}
          >
            {ourServices.map((svc) => {
              const cardContent = {
                'air-freight': {
                  title: 'Air Freight Services',
                  desc: 'We prepare Air Waybills, billing and shipment documents for commercial air freight.',
                  linkLabel: 'See air freight support',
                  alt: 'Cargo airplane parked on an airport tarmac for commercial air freight operations',
                },
                'road-transport': {
                  title: 'Commercial Road Transportation',
                  desc: 'We arrange commercial road transport through our partner carriers, based on what you are shipping and where it needs to go.',
                  linkLabel: 'See how we arrange road transport',
                  alt: 'Commercial freight semi-truck hauling a cargo trailer along an open highway',
                },
              }[svc.id] || {
                title: svc.title,
                desc: svc.desc,
                linkLabel: 'See documentation support',
                alt: 'Desk setup for reviewing commercial shipment and Air Waybill documents',
              };

              return (
                <div
                  key={svc.id}
                  className="bg-[var(--color-surface)] rounded-[var(--radius)] border border-[var(--color-border)] hover:border-[var(--color-navy)] transition-colors duration-200 flex flex-col overflow-hidden group"
                >
                  {/* Flush full-width 3:2 image */}
                  <div className="w-full aspect-[3/2] bg-[var(--color-bg-alt)] overflow-hidden">
                    <img
                      src={svc.image}
                      alt={cardContent.alt}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Architectural accent bar: navy at rest, sweeps orange on card hover */}
                  <div aria-hidden="true" className="w-full h-[3px] bg-[var(--color-border)]">
                    <div className="h-full w-12 group-hover:w-full bg-[var(--color-navy)] group-hover:bg-[var(--color-orange)] transition-all duration-300 ease-out" />
                  </div>

                  {/* Text content with 24px padding and bottom-aligned action button */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className="text-xl font-bold text-[var(--color-navy)] font-heading"
                        style={{ letterSpacing: 'normal' }}
                      >
                        {cardContent.title}
                      </h3>
                      <p
                        className="mt-2.5 text-sm text-[var(--color-text-muted)] font-normal leading-relaxed"
                        style={{ letterSpacing: 'normal' }}
                      >
                        {cardContent.desc}
                      </p>
                    </div>

                    <div className="pt-5 mt-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab(svc.tab);
                          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                        }}
                        className="inline-block px-4 py-2 text-sm font-semibold text-[var(--color-navy)] bg-[var(--color-bg)] border border-[var(--color-border)] hover:bg-[var(--color-navy)] hover:border-[var(--color-navy)] hover:text-[var(--color-on-navy)] transition-colors duration-200 cursor-pointer rounded-[var(--radius)] focus-visible:bg-[var(--color-navy)] focus-visible:border-[var(--color-navy)] focus-visible:text-[var(--color-on-navy)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                        style={{ letterSpacing: 'normal' }}
                      >
                        {cardContent.linkLabel}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY CHOOSE JOSAN (WARM OFF-WHITE SECTION: --color-bg)                  */}
      {/* ========================================================================= */}
      <section className="bg-[var(--color-bg)] py-[72px] border-b border-[var(--color-divider)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2
              className="text-3xl sm:text-4xl font-bold text-[var(--color-navy)] font-heading"
              style={{ letterSpacing: 'normal' }}
            >
              Why Choose Josan Logistics
            </h2>
            <p
              className="text-[var(--color-text-muted)] text-sm sm:text-[15px] font-normal leading-relaxed"
              style={{ letterSpacing: 'normal' }}
            >
              A small team that prepares your documents correctly and answers when you call.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
            {differentiators.map((item) => {
              const IconComp = item.icon;
              const cardCopy = {
                'single-contact': {
                  title: 'One point of contact',
                  desc: 'You deal with one person at Josan for your air and road shipments, from the first quote to delivery.',
                },
                'accurate-docs': {
                  title: 'Documents prepared carefully',
                  desc: 'We prepare your Air Waybill and shipment paperwork and check it before it goes out.',
                },
                'partner-network': {
                  title: 'Partner carriers',
                  desc: 'We arrange road transport through partner carriers we already work with in Singapore.',
                },
                'responsive-support': {
                  title: 'Replies by phone and email',
                  desc: 'Call or email us and we reply the same working day.',
                },
              }[item.id] || {
                title: item.title,
                desc: item.desc,
              };

              return (
                <div
                  key={item.id}
                  className="p-6 bg-[var(--color-surface)] rounded-[var(--radius)] border border-[var(--color-border)] flex flex-col"
                >
                  <IconComp
                    className="w-6 h-6 text-[var(--color-navy)] shrink-0"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <h3
                    className="mt-4 text-lg font-bold text-[var(--color-navy)] font-heading leading-6 min-h-[3rem]"
                    style={{ letterSpacing: 'normal' }}
                  >
                    {cardCopy.title}
                  </h3>
                  <p
                    className="mt-2.5 text-sm text-[var(--color-text-muted)] font-normal leading-relaxed"
                    style={{ letterSpacing: 'normal' }}
                  >
                    {cardCopy.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. CTA SECTION (FLAT LIGHT WARM BAND)                                     */}
      {/* ========================================================================= */}
      <section className="w-full bg-[var(--color-bg)] py-[64px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <h2
              className="text-[28px] sm:text-4xl font-bold font-heading text-[var(--color-navy)] leading-[1.2] max-w-2xl"
              style={{ letterSpacing: 'normal' }}
            >
              Send us your shipment details and we will quote.
            </h2>

            <p
              className="mt-3.5 text-[var(--color-text-muted)] text-sm sm:text-base font-normal leading-relaxed max-w-xl"
              style={{ letterSpacing: 'normal' }}
            >
              Tell us what you are shipping, where from and where to.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row sm:items-center items-start gap-4 sm:gap-7">
              <button
                type="button"
                onClick={handleQuoteAction}
                className="w-full sm:w-auto px-6 py-3 bg-[var(--color-orange)] hover:bg-[var(--color-orange-hover)] text-[var(--color-on-navy)] rounded-[var(--radius)] font-semibold text-sm sm:text-base transition-colors cursor-pointer text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                style={{ letterSpacing: 'normal' }}
              >
                Get a quote
              </button>

              <a
                href={phoneLinks.telHref}
                className="inline-flex items-center space-x-2 text-sm sm:text-base font-medium text-[var(--color-navy)] hover:underline underline-offset-4 py-1 rounded-[2px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                style={{ letterSpacing: 'normal' }}
                title={`Call ${phoneLinks.display}`}
              >
                <Phone className="w-4 h-4 text-[var(--color-navy)] shrink-0" aria-hidden="true" />
                <span>{`Call ${phoneLinks.display}`}</span>
              </a>

              <a
                href={phoneLinks.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm sm:text-base font-medium text-[var(--color-navy)] hover:underline underline-offset-4 py-1 rounded-[2px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                style={{ letterSpacing: 'normal' }}
                title={`WhatsApp ${phoneLinks.display}`}
              >
                <svg className="w-4 h-4 fill-current text-[var(--color-whatsapp)] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
