import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Mail, ArrowRight, Send, FileCheck2, CreditCard, CheckCircle2 } from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import roadwayTruckImg from '../assets/Local CDL Training in Minden.jpg';
import { COMPANY_INFO, getPhoneLinks } from '../config/siteConfig';
import { initialWebsiteContent } from '../data/adminCrmData';

const HOW_WE_WORK_ICONS = [Send, FileCheck2, CreditCard];

export const AboutUsPage = ({ setActiveTab }) => {
  const { currentUser, setIsAuthModalOpen, setAuthRedirectTab, showToast, websiteContent } = useLogistics();
  const aboutContent = websiteContent?.about || {};
  const howWeWork = aboutContent.howWeWork || initialWebsiteContent.about.howWeWork;
  const missionText = aboutContent.mission || initialWebsiteContent.about.mission;
  const visionText = aboutContent.vision || initialWebsiteContent.about.vision;
  const whereToFindUs = aboutContent.whereToFindUs || initialWebsiteContent.about.whereToFindUs;
  const closingCta = aboutContent.closingCta || initialWebsiteContent.about.closingCta;

  const contactContent = websiteContent?.contact || {};
  const officeAddress = contactContent.address || COMPANY_INFO.address;
  const officeHours = contactContent.businessHours || COMPANY_INFO.businessHours;
  const officeTimezoneNote = contactContent.timezoneNote || COMPANY_INFO.timezoneNote;
  const officeEmail = contactContent.email || COMPANY_INFO.email;
  const phoneLinks = getPhoneLinks(contactContent.phone);
  const encodedOfficeAddress = encodeURIComponent(officeAddress);
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedOfficeAddress}`;
  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodedOfficeAddress}&output=embed`;

  const [mapEmbedFailed, setMapEmbedFailed] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine === false
  );

  useEffect(() => {
    const handleOnline = () => setMapEmbedFailed(false);
    const handleOffline = () => setMapEmbedFailed(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  const handleOverviewNavClick = (e, tab) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    else window.location.hash = `#${tab}`;
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const overviewCards = [
    {
      title: 'Air freight documentation',
      desc: 'We prepare Air Waybills, billing and shipment documents for commercial air freight.',
      tab: 'air-freight'
    },
    {
      title: 'Road transport',
      desc: 'We arrange commercial road transport through partner carriers.',
      tab: 'road-freight'
    }
  ];

  return (
    <div>
      
      {/* 1. Hero Banner (Flat Solid Navy with 4px Kraft Bottom Strip) */}
      <section className="w-full bg-[var(--color-navy)] text-[var(--color-on-navy)] border-b-4 border-[var(--color-kraft)] py-[64px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1
            className="text-[32px] sm:text-[42px] lg:text-[48px] font-bold font-heading text-[var(--color-on-navy)] leading-[1.15]"
            style={{ letterSpacing: 'normal' }}
          >
            About Josan Logistics
          </h1>
          <p
            className="mt-4 text-base sm:text-lg font-normal text-[var(--color-on-navy-muted)] leading-relaxed max-w-2xl mx-auto"
            style={{ letterSpacing: 'normal' }}
          >
            We prepare air freight documents and arrange commercial road transport for businesses in Singapore.
          </p>
        </div>
      </section>

      {/* 2. Who We Are Section */}
      <section className="w-full bg-[var(--color-bg)] py-[64px] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-divider)]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <h2
              className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-navy)] leading-tight"
              style={{ letterSpacing: 'normal' }}
            >
              Who we are
            </h2>
            <div
              className="space-y-4 text-[var(--color-text)] text-sm sm:text-base leading-relaxed font-normal"
              style={{ letterSpacing: 'normal' }}
            >
              <p>
                Josan Logistics is a Singapore company that prepares air freight documents and arranges commercial road transport. We were incorporated in {COMPANY_INFO.yearIncorporated}.
              </p>
              <p>
                We work with importers, exporters and local businesses that need their shipping paperwork prepared correctly and a clear contact for their shipments. We prepare Air Waybills and billing and shipment documents, and we arrange road transport through partner carriers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What We Do Section */}
      <section className="w-full bg-[var(--color-bg)] py-[64px] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-divider)]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6">
            <h2
              className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-navy)] leading-tight"
              style={{ letterSpacing: 'normal' }}
            >
              What we do
            </h2>
            <p
              className="text-sm sm:text-base font-normal text-[var(--color-text)] leading-relaxed"
              style={{ letterSpacing: 'normal' }}
            >
              We handle two things: the paperwork for air freight, and road transport for commercial cargo. You tell us what you are shipping and where it is going, and we take it from there.
            </p>

            {/* Service Highlight Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
              {overviewCards.map((card) => (
                <a
                  key={card.tab}
                  href={`#${card.tab}`}
                  onClick={(e) => handleOverviewNavClick(e, card.tab)}
                  className="group relative overflow-hidden flex flex-col justify-start h-full bg-[var(--color-surface)] border border-[var(--color-border)] border-t-0 hover:border-[var(--color-navy)] focus-visible:border-[var(--color-navy)] rounded-[var(--radius)] p-5 pt-[23px] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                  style={{ letterSpacing: 'normal' }}
                >
                  {/* 3px Kraft top border at rest with left-to-right Orange highlight sweep on hover/focus */}
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--color-kraft)]"
                  >
                    <span className="block h-full w-0 bg-[var(--color-orange)] group-hover:w-full group-focus-visible:w-full transition-all duration-300 ease-out" />
                  </span>

                  <div className="flex items-start justify-between gap-2 sm:min-h-[2.75rem]">
                    <h3
                      className="text-base font-bold font-heading text-[var(--color-navy)] group-hover:text-[var(--color-orange)] group-focus-visible:text-[var(--color-orange)] leading-snug transition-colors duration-200"
                      style={{ letterSpacing: 'normal' }}
                    >
                      {card.title}
                    </h3>
                    <ArrowRight
                      className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-orange)] opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition-all duration-200"
                      aria-hidden="true"
                    />
                  </div>
                  <p
                    className="mt-2 text-xs sm:text-sm font-normal text-[var(--color-text-muted)] leading-relaxed"
                    style={{ letterSpacing: 'normal' }}
                  >
                    {card.desc}
                  </p>
                </a>
              ))}
            </div>

            {/* See all services text link */}
            <div>
              <a
                href="#services"
                onClick={(e) => handleOverviewNavClick(e, 'services')}
                className="inline-block text-sm font-semibold text-[var(--color-navy)] hover:underline focus-visible:underline rounded-[var(--radius)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                style={{ letterSpacing: 'normal' }}
              >
                See all services
              </a>
            </div>
          </div>

          <div className="w-full aspect-[4/3] rounded-[var(--radius)] border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)]">
            <img
              src={roadwayTruckImg}
              alt="White Mercedes semi-truck hauling a grey enclosed cargo trailer along a multi-lane highway under a clear blue sky"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* 4. How We Work Section */}
      <section className="w-full bg-[var(--color-bg)] py-[64px] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-divider)]">
        <div className="max-w-[1100px] mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-navy)] leading-tight text-left"
            style={{ letterSpacing: 'normal' }}
          >
            {howWeWork.heading}
          </h2>
          <p
            className="mt-3 text-sm sm:text-base font-normal text-[var(--color-text)] leading-relaxed max-w-3xl text-left"
            style={{ letterSpacing: 'normal' }}
          >
            {howWeWork.intro}
          </p>

          {/* Part 1: Three Common Steps */}
          <ol className="mt-10 list-none grid grid-cols-1 md:grid-cols-3 md:gap-6 lg:gap-8">
            {howWeWork.steps.map((step, index) => {
              const StepIcon = HOW_WE_WORK_ICONS[index] || CheckCircle2;
              const hasNextStep = index < howWeWork.steps.length - 1;
              const hasHorizontalConnector = hasNextStep && (index + 1) % 3 !== 0;

              return (
                <li
                  key={step.number}
                  className="relative flex items-start gap-4 pb-8 last:pb-0 md:block md:pb-0"
                >
                  {/* Vertical dotted connector between steps on mobile */}
                  {hasNextStep && (
                    <span
                      aria-hidden="true"
                      className="md:hidden absolute left-[21px] top-[52px] bottom-[8px] border-l-2 border-dotted border-[var(--color-kraft)] opacity-70"
                    />
                  )}

                  {/* Step icon tile + horizontal dotted connector on desktop */}
                  <div className="relative shrink-0 md:flex md:items-center">
                    <div
                      className="w-11 h-11 rounded-[var(--radius)] bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] flex items-center justify-center text-[var(--color-navy)]"
                      style={{ borderTopColor: 'var(--color-kraft)' }}
                      aria-hidden="true"
                    >
                      <StepIcon className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    {hasHorizontalConnector && (
                      <span
                        aria-hidden="true"
                        className="hidden md:block absolute top-[21px] left-[54px] md:right-[-14px] lg:right-[-22px] border-t-2 border-dotted border-[var(--color-kraft)] opacity-70"
                      />
                    )}
                  </div>

                  {/* Step text */}
                  <div className="flex-1 min-w-0 pt-0.5 md:pt-0 md:mt-4">
                    <h3
                      className="text-base font-bold font-heading text-[var(--color-navy)] leading-snug"
                      style={{ letterSpacing: 'normal' }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="mt-2 text-sm font-normal text-[var(--color-text-muted)] leading-relaxed"
                      style={{ letterSpacing: 'normal' }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Part 2: What Happens Next */}
          <div className="mt-12">
            <h3
              className="text-lg sm:text-xl font-bold font-heading text-[var(--color-navy)] leading-snug text-left"
              style={{ letterSpacing: 'normal' }}
            >
              {howWeWork.nextHeading}
            </h3>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {howWeWork.nextOptions.map((option) => (
                <div
                  key={option.id}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] p-6 flex flex-col justify-start h-full"
                  style={{ borderTopColor: 'var(--color-kraft)', letterSpacing: 'normal' }}
                >
                  <h4
                    className="text-base sm:text-lg font-bold font-heading text-[var(--color-navy)] leading-snug"
                    style={{ letterSpacing: 'normal' }}
                  >
                    {option.title}
                  </h4>
                  <p
                    className="mt-2.5 text-sm font-normal text-[var(--color-text)] leading-relaxed"
                    style={{ letterSpacing: 'normal' }}
                  >
                    {option.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our Mission & Our Vision */}
      <section className="w-full bg-[var(--color-bg)] py-[64px] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-divider)]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {[
            { title: 'Our Mission', text: missionText },
            { title: 'Our Vision', text: visionText }
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] p-6 sm:p-7 flex flex-col justify-start h-full"
              style={{ borderTopColor: 'var(--color-kraft)', letterSpacing: 'normal' }}
            >
              <h2
                className="text-2xl font-bold font-heading text-[var(--color-navy)] leading-tight"
                style={{ letterSpacing: 'normal' }}
              >
                {item.title}
              </h2>
              <p
                className="mt-3 text-sm sm:text-base font-normal text-[var(--color-text)] leading-[1.6]"
                style={{ letterSpacing: 'normal' }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Where to Find Us */}
      <section className="w-full bg-[var(--color-bg)] py-[64px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1100px] mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-navy)] leading-tight text-left"
            style={{ letterSpacing: 'normal' }}
          >
            {whereToFindUs.heading}
          </h2>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column: Plain Details Block */}
            <div
              className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] p-6"
              style={{ borderTopColor: 'var(--color-kraft)' }}
            >
              <dl className="divide-y divide-[var(--color-border)]">
                {[
                  {
                    key: 'address',
                    Icon: MapPin,
                    label: whereToFindUs.labels.address,
                    content: (
                      <>
                        <span className="block">{officeAddress}</span>
                        <a
                          href={mapsSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-block text-sm font-medium text-[var(--color-navy)] hover:underline underline-offset-4 rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                          style={{ letterSpacing: 'normal' }}
                        >
                          {whereToFindUs.openInMapsLabel}
                        </a>
                      </>
                    )
                  },
                  {
                    key: 'businessHours',
                    Icon: Clock,
                    label: whereToFindUs.labels.businessHours,
                    content: (
                      <>
                        <span className="block">{officeHours}</span>
                        <span
                          className="block mt-0.5 text-xs font-normal text-[var(--color-text-muted)]"
                          style={{ letterSpacing: 'normal' }}
                        >
                          {officeTimezoneNote}
                        </span>
                      </>
                    )
                  },
                  {
                    key: 'phone',
                    Icon: Phone,
                    label: whereToFindUs.labels.phone,
                    content: phoneLinks.hasConfirmedPhone ? (
                      <a
                        href={phoneLinks.telHref}
                        className="text-[var(--color-text)] hover:text-[var(--color-navy)] hover:underline underline-offset-4 rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                        style={{ letterSpacing: 'normal' }}
                      >
                        {phoneLinks.display}
                      </a>
                    ) : (
                      <span>{phoneLinks.display}</span>
                    )
                  },
                  {
                    key: 'email',
                    Icon: Mail,
                    label: whereToFindUs.labels.email,
                    content: (
                      <a
                        href={`mailto:${officeEmail}`}
                        className="text-[var(--color-text)] hover:text-[var(--color-navy)] hover:underline underline-offset-4 break-all rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                        style={{ letterSpacing: 'normal' }}
                      >
                        {officeEmail}
                      </a>
                    )
                  }
                ].map(({ key, Icon, label, content }) => (
                  <div key={key} className="py-4 first:pt-0 last:pb-0 flex items-start gap-3.5">
                    <Icon className="w-5 h-5 text-[var(--color-navy)] shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="min-w-0">
                      <dt
                        className="text-xs font-medium text-[var(--color-text-muted)]"
                        style={{ letterSpacing: 'normal' }}
                      >
                        {label}
                      </dt>
                      <dd
                        className="mt-1 text-sm sm:text-base font-normal text-[var(--color-text)] leading-relaxed"
                        style={{ letterSpacing: 'normal' }}
                      >
                        {content}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Right Column: Google Maps Embed with Fallback */}
            <div className="w-full border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden bg-[var(--color-surface)] aspect-[3/2] sm:aspect-[4/3]">
              {mapEmbedFailed ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[var(--color-bg)]">
                  <p
                    className="text-sm font-normal text-[var(--color-text-muted)]"
                    style={{ letterSpacing: 'normal' }}
                  >
                    {whereToFindUs.mapUnavailableText}
                  </p>
                  <a
                    href={mapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-[var(--color-navy)] hover:underline underline-offset-4 rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                    style={{ letterSpacing: 'normal' }}
                  >
                    {whereToFindUs.openInMapsLabel}
                  </a>
                </div>
              ) : (
                <iframe
                  src={mapsEmbedUrl}
                  title={`${whereToFindUs.mapTitlePrefix} ${officeAddress}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onError={() => setMapEmbedFailed(true)}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA Band */}
      <section className="w-full bg-[var(--color-surface)] border-t-4 border-[var(--color-kraft)] py-[64px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1100px] mx-auto text-left">
          <h2
            className="text-[28px] sm:text-4xl font-bold font-heading text-[var(--color-navy)] leading-[1.2] max-w-2xl"
            style={{ letterSpacing: 'normal' }}
          >
            {closingCta.heading}
          </h2>
          <p
            className="mt-3.5 text-sm sm:text-base font-normal text-[var(--color-text-muted)] leading-relaxed max-w-xl"
            style={{ letterSpacing: 'normal' }}
          >
            {closingCta.subtext}
          </p>

          <div className="mt-7 flex flex-col sm:flex-row sm:items-center items-start gap-4 sm:gap-7">
            <button
              type="button"
              onClick={handleQuoteClick}
              className="w-full sm:w-auto px-6 py-3 bg-[var(--color-orange)] hover:bg-[var(--color-orange-hover)] text-[var(--color-on-navy)] rounded-[var(--radius)] font-semibold text-sm sm:text-base transition-colors cursor-pointer text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
              style={{ letterSpacing: 'normal' }}
            >
              {closingCta.primaryLabel}
            </button>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleContactClick();
              }}
              className="inline-block text-sm sm:text-base font-medium text-[var(--color-navy)] hover:text-[var(--color-orange)] hover:underline underline-offset-4 py-1 rounded-[2px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)] transition-colors"
              style={{ letterSpacing: 'normal' }}
            >
              {closingCta.secondaryLabel}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
