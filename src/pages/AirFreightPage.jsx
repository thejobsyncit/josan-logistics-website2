import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { initialWebsiteContent } from '../data/adminCrmData';
import { getPhoneLinks } from '../config/siteConfig';
import { 
  Check,
  Phone,
  ChevronDown
} from 'lucide-react';

export const AirFreightPage = ({ setActiveTab }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const { 
    currentUser, 
    setIsAuthModalOpen, 
    setAuthRedirectTab, 
    showToast,
    websiteContent
  } = useLogistics();

  const airFreightContent = websiteContent?.airFreight || initialWebsiteContent.airFreight;
  const heroCopy = airFreightContent.hero || initialWebsiteContent.airFreight.hero;
  const introCopy = airFreightContent.intro || initialWebsiteContent.airFreight.intro;
  const servicesCopy = airFreightContent.services || initialWebsiteContent.airFreight.services;
  const serviceCards = servicesCopy.cards || initialWebsiteContent.airFreight.services.cards;
  const showCargoTypes = Boolean(airFreightContent.showCargoTypes);
  const cargoTypesCopy = airFreightContent.cargoTypes || initialWebsiteContent.airFreight.cargoTypes;
  const cargoTypeFlags = cargoTypesCopy.enabled || initialWebsiteContent.airFreight.cargoTypes.enabled;
  const enabledCargoCards = (cargoTypesCopy.cards || []).filter((card) => Boolean(cargoTypeFlags[card.key]));
  const hasVisibleCargoTypes = showCargoTypes && enabledCargoCards.length > 0;
  const processCopy = airFreightContent.process || initialWebsiteContent.airFreight.process;
  const processBgClass = hasVisibleCargoTypes ? 'bg-[var(--color-bg-alt)]' : 'bg-[var(--color-bg)]';
  const whatWeNeedBgClass = hasVisibleCargoTypes ? 'bg-[var(--color-bg)]' : 'bg-[var(--color-bg-alt)]';
  const faqBgClass = hasVisibleCargoTypes ? 'bg-[var(--color-bg-alt)]' : 'bg-[var(--color-bg)]';
  const whatWeNeedCopy = airFreightContent.whatWeNeed || initialWebsiteContent.airFreight.whatWeNeed;
  const roadCrossLinkCopy = airFreightContent.roadCrossLink || initialWebsiteContent.airFreight.roadCrossLink;
  const faqSectionCopy = airFreightContent.faqSection || initialWebsiteContent.airFreight.faqSection;
  const closingCtaCopy = airFreightContent.closingCta || initialWebsiteContent.airFreight.closingCta;
  const phoneLinks = getPhoneLinks(websiteContent?.contact?.phone);
  const whatsappHref = phoneLinks.whatsappHref || closingCtaCopy.whatsappHref;
  const baseFaqs = airFreightContent.faqs || initialWebsiteContent.airFreight.faqs;
  const formatCargoNames = (cards) => {
    const names = cards.map((card) => (card.title || '').trim().toLowerCase()).filter(Boolean);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  };
  const airFreightFaqs = hasVisibleCargoTypes
    ? [
        ...baseFaqs,
        {
          q: faqSectionCopy.cargoTypesQuestion,
          a: `${faqSectionCopy.cargoTypesAnswerPrefix}${formatCargoNames(enabledCargoCards)}${faqSectionCopy.cargoTypesAnswerSuffix}`
        }
      ]
    : baseFaqs;

  const handleWhatWeNeedClick = (e) => {
    e.preventDefault();
    const targetById = document.getElementById('what-we-need');
    if (targetById) {
      targetById.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const targetHeading = Array.from(document.querySelectorAll('h2')).find(
      (el) => el.textContent?.trim() === 'What We Need From You'
    );
    const targetSection = targetHeading?.closest('section') || targetHeading;
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleQuoteClick = () => {
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState(null, '', '?service=air#quote');
    }
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('quote');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in to request air freight services.', 'warning');
      return;
    }
    setActiveTab('quote');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    setActiveTab('contact');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[var(--color-bg)] min-h-screen text-slate-800 space-y-16 sm:space-y-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[var(--color-navy)] text-[var(--color-on-navy)] py-16 sm:py-[72px] px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src={heroCopy.image} 
            alt={heroCopy.imageAlt} 
            className="w-full h-full object-cover object-[70%_center] sm:object-[78%_center] lg:object-[82%_center]"
          />
          <div className="absolute inset-0 hero-navy-overlay" />
        </div>

        <div className="max-w-[1100px] mx-auto relative z-10">
          <div className="max-w-2xl space-y-5 text-left">
            <h1
              className="text-[32px] sm:text-[42px] lg:text-[48px] font-bold font-heading text-[var(--color-on-navy)] leading-[1.15]"
              style={{ letterSpacing: 'normal' }}
            >
              {heroCopy.title}
            </h1>

            <p
              className="max-w-xl text-sm sm:text-base text-[var(--color-on-navy)] leading-relaxed font-normal"
              style={{ letterSpacing: 'normal' }}
            >
              {heroCopy.subtitle}
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={handleQuoteClick}
                className="px-6 py-3 bg-[var(--color-orange)] hover:bg-[var(--color-orange-hover)] text-[var(--color-on-navy)] rounded-[var(--radius)] font-semibold text-sm transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-on-navy)]"
                style={{ letterSpacing: 'normal' }}
              >
                {heroCopy.ctaLabel}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRO SECTION */}
      <section className="!mt-0 bg-[var(--color-bg)] py-[72px] px-4 sm:px-6 lg:px-8 text-left">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-5">
            <h2
              className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-navy)] leading-tight"
              style={{ letterSpacing: 'normal' }}
            >
              {introCopy.heading}
            </h2>
            <div
              className="space-y-4 text-sm sm:text-base text-[var(--color-text)] leading-relaxed font-normal"
              style={{ letterSpacing: 'normal' }}
            >
              {(introCopy.paragraphs || []).map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            <div className="pt-1">
              <a
                href={introCopy.linkTarget || '#what-we-need'}
                onClick={handleWhatWeNeedClick}
                className="inline-block text-sm sm:text-base font-medium text-[var(--color-navy)] hover:underline underline-offset-4 rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                style={{ letterSpacing: 'normal' }}
              >
                {introCopy.linkLabel}
              </a>
            </div>
          </div>

          <div>
            <div className="aspect-[4/3] w-full rounded-[var(--radius)] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
              <img 
                src={introCopy.image} 
                alt={introCopy.imageAlt} 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="!mt-0 section-divider" aria-hidden="true" />

      {/* 3. OUR AIR FREIGHT SERVICES */}
      <section className="!mt-0 bg-[var(--color-bg-alt)] py-[72px] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-divider)] text-left">
        <div className="max-w-[1100px] mx-auto space-y-10">
          <div className="max-w-2xl space-y-3 text-left">
            <h2
              className="text-2xl sm:text-3xl font-bold text-[var(--color-navy)] font-heading leading-tight"
              style={{ letterSpacing: 'normal' }}
            >
              {servicesCopy.heading}
            </h2>
            <p
              className="text-sm sm:text-base text-[var(--color-text-muted)] font-normal leading-relaxed"
              style={{ letterSpacing: 'normal' }}
            >
              {servicesCopy.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {serviceCards.map((card) => (
              <div
                key={card.id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] p-6 flex flex-col h-full"
                style={{ borderTopColor: 'var(--color-kraft)', letterSpacing: 'normal' }}
              >
                <h3
                  className="text-lg font-bold font-heading text-[var(--color-navy)] leading-6 min-h-[3rem]"
                  style={{ letterSpacing: 'normal' }}
                >
                  {card.title}
                </h3>
                <p
                  className="mt-2 text-sm text-[var(--color-text-muted)] font-normal leading-6 md:min-h-[4.5rem]"
                  style={{ letterSpacing: 'normal' }}
                >
                  {card.description}
                </p>

                <ul className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-2.5">
                  {(card.items || []).map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-[var(--color-text)] font-normal leading-snug"
                      style={{ letterSpacing: 'normal' }}
                    >
                      <Check
                        className="w-4 h-4 text-[var(--color-kraft-dark)] shrink-0 mt-[3px]"
                        strokeWidth={2.25}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CARGO TYPES WE PREPARE DOCUMENTS FOR (HIDDEN UNTIL CONFIRMED) */}
      {hasVisibleCargoTypes && (
        <section className="!mt-0 bg-[var(--color-bg)] py-[72px] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-divider)] text-left">
          <div className="max-w-[1100px] mx-auto space-y-10">
            <div className="max-w-2xl space-y-3 text-left">
              <h2
                className="text-2xl sm:text-3xl font-bold text-[var(--color-navy)] font-heading leading-tight"
                style={{ letterSpacing: 'normal' }}
              >
                {cargoTypesCopy.heading}
              </h2>
              <p
                className="text-sm sm:text-base text-[var(--color-text-muted)] font-normal leading-relaxed"
                style={{ letterSpacing: 'normal' }}
              >
                {cargoTypesCopy.subheading}
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {enabledCargoCards.map((card) => (
                  <div
                    key={card.key}
                    className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] p-6 flex flex-col h-full"
                    style={{ borderTopColor: 'var(--color-kraft)', letterSpacing: 'normal' }}
                  >
                    <h3
                      className="text-lg font-bold font-heading text-[var(--color-navy)] leading-snug"
                      style={{ letterSpacing: 'normal' }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="mt-2 text-sm text-[var(--color-text-muted)] font-normal leading-relaxed"
                      style={{ letterSpacing: 'normal' }}
                    >
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>

              <p
                className="text-sm text-[var(--color-text-muted)] font-normal leading-relaxed text-left"
                style={{ letterSpacing: 'normal' }}
              >
                {cargoTypesCopy.footnote}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 5. HOW AN AIR FREIGHT JOB WORKS */}
      <section className={`!mt-0 ${processBgClass} py-[72px] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-divider)] text-left`}>
        <div className="max-w-[1100px] mx-auto space-y-12">
          <div className="max-w-2xl space-y-3 text-left">
            <h2
              className="text-2xl sm:text-3xl font-bold text-[var(--color-navy)] font-heading leading-tight"
              style={{ letterSpacing: 'normal' }}
            >
              {processCopy.heading}
            </h2>
            <p
              className="text-sm sm:text-base text-[var(--color-text-muted)] font-normal leading-relaxed"
              style={{ letterSpacing: 'normal' }}
            >
              {processCopy.subheading}
            </p>
          </div>

          <ol
            role="list"
            className="list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
          >
            {(processCopy.steps || []).map((step) => (
              <li
                key={step.number}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] p-6 flex flex-col h-full"
                style={{ borderTopColor: 'var(--color-kraft)', letterSpacing: 'normal' }}
              >
                <div
                  className="text-sm font-bold text-[var(--color-kraft-dark)] leading-none"
                  style={{ letterSpacing: 'normal' }}
                >
                  {step.number}
                </div>
                <h3
                  className="mt-2.5 text-lg font-bold font-heading text-[var(--color-navy)] leading-snug"
                  style={{ letterSpacing: 'normal' }}
                >
                  {step.title}
                </h3>
                <p
                  className="mt-2 text-sm text-[var(--color-text)] font-normal"
                  style={{ lineHeight: 1.6, letterSpacing: 'normal' }}
                >
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5B. WHAT WE NEED FROM YOU & ROAD CROSS-LINK */}
      <section
        id="what-we-need"
        className={`!mt-0 ${whatWeNeedBgClass} py-[72px] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-divider)] text-left`}
      >
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_1fr] gap-x-12 gap-y-5 items-start">
          {/* Header & Intro */}
          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1 space-y-3 text-left">
            <h2
              className="text-2xl sm:text-3xl font-bold text-[var(--color-navy)] font-heading leading-tight"
              style={{ letterSpacing: 'normal' }}
            >
              {whatWeNeedCopy.heading}
            </h2>
            <p
              className="text-sm sm:text-base text-[var(--color-text-muted)] font-normal leading-relaxed"
              style={{ letterSpacing: 'normal' }}
            >
              {whatWeNeedCopy.subheading}
            </p>
          </div>

          {/* Right Column: Ruled Checklist Sheet */}
          <div
            className="lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:row-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] border-l-[3px] rounded-[var(--radius)]"
            style={{ borderLeftColor: 'var(--color-navy)' }}
          >
            <ul role="list" className="list-none divide-y divide-[var(--color-border)]">
              {(whatWeNeedCopy.items || []).map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3.5 px-6 py-4"
                >
                  <Check
                    className="w-4 h-4 text-[var(--color-kraft-dark)] shrink-0 mt-[3px]"
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                  <span
                    className="text-sm text-[var(--color-text)] font-normal leading-relaxed"
                    style={{ letterSpacing: 'normal' }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom-Left Actions & Road Cross-Link */}
          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-2 text-left">
            <p
              className="text-sm text-[var(--color-text-muted)] font-normal leading-relaxed"
              style={{ letterSpacing: 'normal' }}
            >
              {whatWeNeedCopy.note}
            </p>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleQuoteClick}
                className="inline-flex items-center justify-center px-6 py-3 bg-[var(--color-orange)] hover:bg-[var(--color-orange-hover)] text-white rounded-[var(--radius)] text-sm font-semibold transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                style={{ letterSpacing: 'normal' }}
              >
                {whatWeNeedCopy.ctaLabel}
              </button>
            </div>

            <div
              className="mt-8 bg-[var(--color-surface)] border border-[var(--color-border)] border-l-[3px] rounded-[var(--radius)] p-5 text-left"
              style={{ borderLeftColor: 'var(--color-kraft)', letterSpacing: 'normal' }}
            >
              <h3
                className="text-base font-bold font-heading text-[var(--color-navy)] leading-snug"
                style={{ letterSpacing: 'normal' }}
              >
                {roadCrossLinkCopy.heading}
              </h3>
              <p
                className="mt-1.5 text-sm text-[var(--color-text-muted)] font-normal leading-relaxed"
                style={{ letterSpacing: 'normal' }}
              >
                {roadCrossLinkCopy.text}
              </p>
              <div className="mt-3">
                <a
                  href="#road-freight"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('road-freight');
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  className="inline-block text-sm font-medium text-[var(--color-navy)] hover:underline underline-offset-4 rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                  style={{ letterSpacing: 'normal' }}
                >
                  {roadCrossLinkCopy.linkLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6B. FREQUENTLY ASKED QUESTIONS */}
      <section
        id="faq"
        className={`!mt-0 ${faqBgClass} py-[72px] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-divider)] text-left`}
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="max-w-[800px] space-y-3 text-left">
            <h2
              className="text-2xl sm:text-3xl font-bold text-[var(--color-navy)] font-heading leading-tight"
              style={{ letterSpacing: 'normal' }}
            >
              {faqSectionCopy.heading}
            </h2>
            <p
              className="text-sm sm:text-base text-[var(--color-text-muted)] font-normal leading-relaxed"
              style={{ letterSpacing: 'normal' }}
            >
              {faqSectionCopy.subheading}
            </p>
          </div>

          <div className="mt-10 max-w-[800px] border-b border-[var(--color-border)]">
            {airFreightFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              const triggerId = `air-faq-trigger-${idx}`;
              const panelId = `air-faq-panel-${idx}`;
              return (
                <div
                  key={idx}
                  className={`border-t border-[var(--color-border)] ${
                    isOpen
                      ? 'bg-[var(--color-bg-alt)] border-l-[3px] rounded-[var(--radius)]'
                      : 'bg-transparent'
                  }`}
                  style={isOpen ? { borderLeftColor: 'var(--color-kraft)' } : undefined}
                >
                  <button
                    type="button"
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full min-h-[44px] py-5 px-4 sm:px-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                    style={{ letterSpacing: 'normal' }}
                  >
                    <span className="text-base font-semibold text-[var(--color-text)] leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--color-text-muted)] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className="px-4 sm:px-5 pb-5 text-sm text-[var(--color-text)] font-normal"
                      style={{ lineHeight: 1.6, letterSpacing: 'normal' }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM QUOTE CTA BAND */}
      <section className="!mt-0 w-full bg-[var(--color-surface)] text-[var(--color-text)] border-t-4 border-[var(--color-kraft)] py-[64px] px-4 sm:px-6 lg:px-8 text-left">
        <div className="max-w-[1100px] mx-auto">
          <h2
            className="text-[28px] sm:text-4xl font-bold font-heading text-[var(--color-navy)] leading-[1.2] max-w-3xl"
            style={{ letterSpacing: 'normal' }}
          >
            {closingCtaCopy.heading}
          </h2>
          <p
            className="mt-3.5 text-sm sm:text-base font-normal text-[var(--color-text-muted)] leading-relaxed max-w-2xl"
            style={{ letterSpacing: 'normal' }}
          >
            {closingCtaCopy.subtext}
          </p>

          <div className="mt-7 flex flex-col sm:flex-row sm:items-center items-start gap-4 sm:gap-7">
            <button
              type="button"
              onClick={handleQuoteClick}
              className="w-full sm:w-auto px-6 py-3 bg-[var(--color-orange)] hover:bg-[var(--color-orange-hover)] text-[var(--color-on-navy)] rounded-[var(--radius)] font-semibold text-sm sm:text-base transition-colors cursor-pointer text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
              style={{ letterSpacing: 'normal' }}
            >
              {closingCtaCopy.primaryLabel}
            </button>

            <a
              href="#contact"
              onClick={handleContactClick}
              className="inline-block text-sm sm:text-base font-medium text-[var(--color-navy)] hover:underline underline-offset-4 py-1 rounded-[2px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
              style={{ letterSpacing: 'normal' }}
            >
              {closingCtaCopy.contactLabel}
            </a>

            {phoneLinks.hasConfirmedPhone && (
              <a
                href={phoneLinks.telHref}
                className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-[var(--color-navy)] hover:underline underline-offset-4 py-1 rounded-[2px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                style={{ letterSpacing: 'normal' }}
              >
                <Phone className="w-4 h-4 text-[var(--color-navy)] shrink-0" aria-hidden="true" />
                <span>{closingCtaCopy.callLabel}</span>
              </a>
            )}

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-[var(--color-navy)] hover:underline underline-offset-4 py-1 rounded-[2px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
              style={{ letterSpacing: 'normal' }}
            >
              <svg className="w-5 h-5 fill-current text-[var(--color-navy)] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>{closingCtaCopy.whatsappLabel}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
