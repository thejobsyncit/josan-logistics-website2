import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { initialWebsiteContent } from '../data/adminCrmData';
import { getPhoneLinks } from '../config/siteConfig';
import { 
  Check,
  ChevronDown,
  Phone
} from 'lucide-react';

export const RoadFreightPage = ({ setActiveTab }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const { 
    currentUser, 
    setIsAuthModalOpen, 
    setAuthRedirectTab, 
    showToast,
    websiteContent
  } = useLogistics();

  const roadFreightContent = websiteContent?.roadFreight || initialWebsiteContent.roadFreight;
  const heroCopy = roadFreightContent?.hero || initialWebsiteContent.roadFreight.hero;
  const introCopy = roadFreightContent?.intro || initialWebsiteContent.roadFreight.intro;
  const whatWeDoBlock = introCopy?.whatWeDoBlock || initialWebsiteContent.roadFreight.intro.whatWeDoBlock;
  const servicesCopy = roadFreightContent?.services || initialWebsiteContent.roadFreight.services;
  const serviceCards = servicesCopy?.cards || initialWebsiteContent.roadFreight.services.cards;
  const goodsWeMoveCopy = roadFreightContent?.goodsWeMove || initialWebsiteContent.roadFreight.goodsWeMove;
  const goodsWeMoveItems = goodsWeMoveCopy?.items || initialWebsiteContent.roadFreight.goodsWeMove.items;
  const goodsWeMoveFlags = goodsWeMoveCopy?.flags || initialWebsiteContent.roadFreight.goodsWeMove.flags || {};
  const notMovedBlock = goodsWeMoveCopy?.notMovedBlock || initialWebsiteContent.roadFreight.goodsWeMove.notMovedBlock || {};

  const visibleGoodsItems = (goodsWeMoveItems || []).filter((item) => {
    const key = item.flagKey;
    if (!key) return true;
    if (typeof goodsWeMoveCopy?.[key] === 'boolean') return goodsWeMoveCopy[key];
    if (typeof goodsWeMoveFlags?.[key] === 'boolean') return goodsWeMoveFlags[key];
    return false;
  });

  const goodsGridColsClass = visibleGoodsItems.length >= 4 
    ? 'lg:grid-cols-4' 
    : visibleGoodsItems.length === 3 
      ? 'lg:grid-cols-3' 
      : 'lg:grid-cols-2';
  const processBgClass = visibleGoodsItems.length > 0 ? 'bg-[var(--color-bg-alt)]' : 'bg-[var(--color-bg)]';
  const whatWeNeedBgClass = processBgClass === 'bg-[var(--color-bg-alt)]' ? 'bg-[var(--color-bg)]' : 'bg-[var(--color-bg-alt)]';
  const processCopy = roadFreightContent?.process || initialWebsiteContent.roadFreight.process;
  const processSteps = processCopy?.steps || initialWebsiteContent.roadFreight.process.steps;
  const whatWeNeedCopy = roadFreightContent?.whatWeNeed || initialWebsiteContent.roadFreight.whatWeNeed;
  const whatWeNeedItems = whatWeNeedCopy?.items || initialWebsiteContent.roadFreight.whatWeNeed.items;
  const showDocumentationCard = whatWeNeedCopy?.showDocumentationCard ?? initialWebsiteContent.roadFreight.whatWeNeed.showDocumentationCard;
  const documentationCardCopy = whatWeNeedCopy?.documentationCard || initialWebsiteContent.roadFreight.whatWeNeed.documentationCard;
  const airCrossLinkCopy = roadFreightContent?.airCrossLink || initialWebsiteContent.roadFreight.airCrossLink;
  const whereWeOperateCopy = roadFreightContent?.whereWeOperate || initialWebsiteContent.roadFreight.whereWeOperate;
  const faqBgClass = whatWeNeedBgClass === 'bg-[var(--color-bg-alt)]' ? 'bg-[var(--color-bg)]' : 'bg-[var(--color-bg-alt)]';
  const faqSectionCopy = roadFreightContent?.faqSection || initialWebsiteContent.roadFreight.faqSection;
  const roadFaqs = roadFreightContent?.faqs || initialWebsiteContent.roadFreight.faqs;

  const formatGoodsNames = (items) => {
    const names = (items || []).map((item) => (item.title || '').trim().toLowerCase()).filter(Boolean);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  };

  const goodsFaqAnswer = visibleGoodsItems.length > 0
    ? `${faqSectionCopy.goodsAnswerPrefix || 'We arrange road transport for '}${formatGoodsNames(visibleGoodsItems)}${faqSectionCopy.goodsAnswerSuffix || '. We do not move oversize goods, dangerous goods or electronics. If you are not sure whether your goods fit, contact us and we will tell you.'}`
    : (faqSectionCopy.goodsAnswerEmpty || 'We do not move oversize goods, dangerous goods or electronics. Contact us to ask whether we can move your goods.');

  const roadFaqList = [
    {
      id: 'goods-moved',
      q: faqSectionCopy.goodsQuestion || 'What types of goods can you move?',
      a: goodsFaqAnswer
    },
    ...(roadFaqs || [])
  ];
  const closingCtaCopy = roadFreightContent?.closingCta || initialWebsiteContent.roadFreight.closingCta;
  const phoneLinks = getPhoneLinks(websiteContent?.contact?.phone);
  const whatsappHref = phoneLinks.whatsappHref || closingCtaCopy.whatsappHref;

  const handleWhatWeNeedClick = (e) => {
    e.preventDefault();
    const targetSection = document.getElementById('what-we-need-road');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAirFreightClick = (e) => {
    e.preventDefault();
    setActiveTab('air-freight');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    setActiveTab('contact');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleTrackClick = (e) => {
    e.preventDefault();
    setActiveTab('track');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleQuoteClick = () => {
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState(null, '', '?service=road#quote');
    }
    if (!currentUser) {
      if (setAuthRedirectTab) setAuthRedirectTab('quote');
      setIsAuthModalOpen(true);
      if (showToast) showToast('Please sign in to generate a road transportation quote.', 'warning');
      return;
    }
    setActiveTab('quote');
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
            className="w-full h-full object-cover object-[65%_72%] sm:object-[75%_72%] lg:object-[82%_70%]"
          />
          <div
            className="absolute inset-0 hero-navy-overlay"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-navy) 64%, transparent)' }}
          />
        </div>

        <div className="max-w-[1100px] mx-auto relative z-10">
          <div className="max-w-2xl space-y-5 text-left">
            <h1
              className="text-[32px] sm:text-[44px] lg:text-[50px] font-bold font-heading text-[var(--color-on-navy)] leading-[1.15]"
              style={{ letterSpacing: 'normal' }}
            >
              {heroCopy.heading}
            </h1>

            <p
              className="max-w-2xl text-sm sm:text-base text-[var(--color-on-navy)] leading-relaxed font-normal"
              style={{ letterSpacing: 'normal' }}
            >
              {heroCopy.paragraph}
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

      {/* 2. INTRODUCTION */}
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
                href={introCopy.linkTarget || '#what-we-need-road'}
                onClick={handleWhatWeNeedClick}
                className="inline-block text-sm sm:text-base font-medium text-[var(--color-navy)] hover:underline underline-offset-4 rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                style={{ letterSpacing: 'normal' }}
              >
                {introCopy.linkLabel}
              </a>
            </div>
          </div>

          <div>
            {introCopy.useRealPhoto && introCopy.realPhoto ? (
              <div className="aspect-[4/3] w-full rounded-[var(--radius)] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
                <img
                  src={introCopy.realPhoto}
                  alt={introCopy.realPhotoAlt}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ) : (
              <div
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-6 sm:p-7 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-kraft)] hover:shadow-sm"
                style={{ letterSpacing: 'normal' }}
              >
                <h3
                  className="text-lg sm:text-xl font-bold font-heading text-[var(--color-navy)] leading-snug"
                  style={{ letterSpacing: 'normal' }}
                >
                  {whatWeDoBlock.heading}
                </h3>

                <div className="mt-5">
                  <h4
                    className="text-sm font-semibold font-heading text-[var(--color-navy)] mb-2"
                    style={{ letterSpacing: 'normal' }}
                  >
                    {whatWeDoBlock.doHeading}
                  </h4>
                  <ul role="list" className="list-none divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
                    {(whatWeDoBlock.doItems || []).map((item, idx) => (
                      <li
                        key={idx}
                        className="py-2.5 flex items-start gap-2.5 text-sm text-[var(--color-text)] font-normal leading-relaxed"
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

                <div className="mt-5">
                  <h4
                    className="text-sm font-semibold font-heading text-[var(--color-navy)] mb-2"
                    style={{ letterSpacing: 'normal' }}
                  >
                    {whatWeDoBlock.doNotHeading}
                  </h4>
                  <ul role="list" className="list-none divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
                    {(whatWeDoBlock.doNotItems || []).map((item, idx) => (
                      <li
                        key={idx}
                        className="py-2.5 flex items-start gap-2.5 text-sm text-[var(--color-text)] font-normal leading-relaxed"
                        style={{ letterSpacing: 'normal' }}
                      >
                        <span
                          aria-hidden="true"
                          className="w-3 h-[2px] bg-[var(--color-text-muted)] shrink-0 mt-[10px]"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="!mt-0 section-divider" aria-hidden="true" />

      {/* 3. WHAT WE DO FOR ROAD TRANSPORT */}
      <section className="!mt-0 bg-[var(--color-bg-alt)] py-[72px] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-divider)] text-left">
        <div className="max-w-[1100px] mx-auto space-y-10">
          <div className="max-w-2xl space-y-3 text-left">
            <h2
              className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-navy)] leading-tight"
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
            {(serviceCards || []).map((card) => (
              <div
                key={card.id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] border-t-[var(--color-kraft)] rounded-[var(--radius)] p-6 flex flex-col h-full shadow-none"
                style={{ letterSpacing: 'normal' }}
              >
                <h3
                  className="text-lg font-bold font-heading text-[var(--color-navy)] leading-snug min-h-[3.25rem]"
                  style={{ letterSpacing: 'normal' }}
                >
                  {card.title}
                </h3>
                <p
                  className="mt-2 text-sm text-[var(--color-text)] font-normal leading-relaxed"
                  style={{ letterSpacing: 'normal' }}
                >
                  {card.description}
                </p>
                <div
                  className="w-full border-t border-[var(--color-border)] my-5"
                  aria-hidden="true"
                />
                <ul role="list" className="space-y-3 list-none p-0 m-0">
                  {(card.items || []).map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="flex items-start gap-2.5 text-sm sm:text-[15px] text-[var(--color-text)] font-normal leading-relaxed"
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

          <div className="pt-2 text-left">
            <a
              href={servicesCopy.linkTarget || '#quote'}
              onClick={(e) => {
                e.preventDefault();
                handleQuoteClick();
              }}
              className="inline-block text-sm sm:text-base font-semibold text-[var(--color-navy)] hover:underline underline-offset-4 rounded-[2px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
              style={{ letterSpacing: 'normal' }}
            >
              {servicesCopy.linkLabel || 'Get a Quote'}
            </a>
          </div>
        </div>
      </section>

      {/* 4. GOODS WE MOVE */}
      {visibleGoodsItems.length > 0 && (
        <section className="!mt-0 bg-[var(--color-bg)] py-[72px] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-divider)] text-left">
          <div className="max-w-[1100px] mx-auto space-y-10">
            <div className="max-w-2xl space-y-3 text-left">
              <h2
                className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-navy)] leading-tight"
                style={{ letterSpacing: 'normal' }}
              >
                {goodsWeMoveCopy.heading}
              </h2>
              <p
                className="text-sm sm:text-base text-[var(--color-text-muted)] font-normal leading-relaxed"
                style={{ letterSpacing: 'normal' }}
              >
                {goodsWeMoveCopy.subheading}
              </p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 ${goodsGridColsClass} gap-6 items-stretch`}>
              {visibleGoodsItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] border-t-[var(--color-kraft)] rounded-[var(--radius)] p-6 flex flex-col h-full shadow-none"
                  style={{ letterSpacing: 'normal' }}
                >
                  <h3
                    className="text-lg font-bold font-heading text-[var(--color-navy)] leading-snug min-h-[3rem] sm:min-h-[3.25rem]"
                    style={{ letterSpacing: 'normal' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mt-2 text-sm text-[var(--color-text)] font-normal leading-relaxed"
                    style={{ letterSpacing: 'normal' }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] border-t-[var(--color-kraft)] rounded-[var(--radius)] p-5 shadow-none"
                style={{ letterSpacing: 'normal' }}
              >
                <h3
                  className="text-base sm:text-lg font-bold font-heading text-[var(--color-navy)] leading-snug"
                  style={{ letterSpacing: 'normal' }}
                >
                  {notMovedBlock.heading || 'We do not move'}
                </h3>
                <p
                  className="mt-1.5 text-sm sm:text-base text-[var(--color-text)] font-normal leading-relaxed"
                  style={{ letterSpacing: 'normal' }}
                >
                  {notMovedBlock.text}
                </p>
              </div>

              <p
                className="text-sm text-[var(--color-text-muted)] font-normal leading-relaxed text-left"
                style={{ letterSpacing: 'normal' }}
              >
                {notMovedBlock.footnotePrefix || 'Not sure whether your goods fit? '}
                <a
                  href={notMovedBlock.contactTarget || '#contact'}
                  onClick={handleContactClick}
                  className="link-inline"
                  style={{ letterSpacing: 'normal' }}
                >
                  {notMovedBlock.contactLabel || 'Contact us'}
                </a>
                {notMovedBlock.footnoteSuffix || ' and we will tell you.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 5. HOW A ROAD TRANSPORT JOB WORKS */}
      <section className={`!mt-0 ${processBgClass} py-[72px] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-divider)] text-left`}>
        <div className="max-w-[1100px] mx-auto space-y-10">
          <div className="max-w-2xl space-y-3 text-left">
            <h2
              className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-navy)] leading-tight"
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
            className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start"
          >
            {processSteps.map((step) => (
              <li
                key={step.number}
                className="relative flex flex-col pl-5 pb-8 last:pb-0 md:pl-0 md:pb-0 border-l border-[var(--color-border)] md:border-l-0 text-left"
              >
                {/* Mobile: 8px square on the vertical left line */}
                <div
                  className="md:hidden absolute -left-[4.5px] top-1 w-2 h-2 bg-[var(--color-kraft)]"
                  aria-hidden="true"
                />

                {/* Desktop / tablet: 1px top border line with flat 8px kraft square at left end */}
                <div className="hidden md:flex items-center w-full mb-4" aria-hidden="true">
                  <span className="w-2 h-2 shrink-0 bg-[var(--color-kraft)]" />
                  <span className="h-[1px] w-full bg-[var(--color-border)]" />
                </div>

                {/* Step number: plain text "1" to "6" in kraft-dark, weight 700, font-body */}
                <div
                  className="text-base sm:text-lg font-bold font-body text-[var(--color-kraft-dark)] leading-tight"
                  style={{ letterSpacing: 'normal' }}
                >
                  {step.number}
                </div>

                {/* Title: weight 700, font-heading, navy */}
                <h3
                  className="mt-2 text-base sm:text-lg font-bold font-heading text-[var(--color-navy)] leading-snug"
                  style={{ letterSpacing: 'normal' }}
                >
                  {step.title}
                </h3>

                {/* Description: color-text, line-height 1.6 */}
                <p
                  className="mt-2 text-sm sm:text-base text-[var(--color-text)] font-normal leading-[1.6]"
                  style={{ letterSpacing: 'normal' }}
                >
                  {step.trackLinkLabel ? (
                    <>
                      {step.descriptionPrefix}
                      <a
                        href={step.trackLinkTarget || '#track'}
                        onClick={handleTrackClick}
                        className="link-inline"
                        style={{ letterSpacing: 'normal' }}
                      >
                        {step.trackLinkLabel}
                      </a>
                      {step.descriptionSuffix}
                    </>
                  ) : (
                    step.description
                  )}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5B. WHAT WE NEED TO QUOTE YOUR JOB, AIR FREIGHT CROSS-LINK & WHERE WE OPERATE */}
      <section
        id="what-we-need-road"
        className={`!mt-0 ${whatWeNeedBgClass} py-[72px] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-divider)] text-left`}
      >
        <div className="max-w-[1100px] mx-auto space-y-10">
          {/* Part A: Heading, Subtext, 2x2 List, Note and Button */}
          <div className="space-y-6">
            <div className="max-w-2xl space-y-3 text-left">
              <h2
                className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-navy)] leading-tight"
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

            <div
              className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] border-t-[var(--color-kraft)] rounded-[var(--radius)] p-6 shadow-none"
              style={{ letterSpacing: 'normal' }}
            >
              <ul
                role="list"
                className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2"
              >
                {(whatWeNeedItems || []).map((item, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-3 py-3 md:py-3.5 text-sm sm:text-base text-[var(--color-text)] font-normal leading-relaxed ${
                      idx < 2 ? 'md:border-b md:border-[var(--color-border)]' : ''
                    } ${
                      idx % 2 === 0 ? 'md:border-r md:border-[var(--color-border)] md:pr-6' : 'md:pl-6'
                    } ${
                      idx !== (whatWeNeedItems.length - 1) ? 'border-b border-[var(--color-border)] md:border-b-0' : ''
                    }`}
                    style={{ letterSpacing: 'normal' }}
                  >
                    <Check
                      className="w-4 h-4 text-[var(--color-kraft-dark)] shrink-0 mt-1"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 text-left">
              <p
                className="text-sm text-[var(--color-text-muted)] font-normal leading-relaxed"
                style={{ letterSpacing: 'normal' }}
              >
                {whatWeNeedCopy.note}
              </p>
              <div>
                <button
                  type="button"
                  onClick={handleQuoteClick}
                  className="px-6 py-3 bg-[var(--color-orange)] hover:bg-[var(--color-orange-hover)] text-[var(--color-on-navy)] rounded-[var(--radius)] font-semibold text-sm transition-colors cursor-pointer shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                  style={{ letterSpacing: 'normal' }}
                >
                  {whatWeNeedCopy.buttonLabel || 'Get a Quote'}
                </button>
              </div>
            </div>
          </div>

          {/* Part B: Navy Cards Replacement */}
          {showDocumentationCard && (
            <div
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] border-t-[var(--color-kraft)] rounded-[var(--radius)] p-6 shadow-none text-left"
              style={{ letterSpacing: 'normal' }}
            >
              <h3
                className="text-lg font-bold font-heading text-[var(--color-navy)] leading-snug"
                style={{ letterSpacing: 'normal' }}
              >
                {documentationCardCopy.heading}
              </h3>
              <p
                className="mt-2 text-sm sm:text-base text-[var(--color-text)] font-normal leading-relaxed"
                style={{ letterSpacing: 'normal' }}
              >
                {documentationCardCopy.text}
              </p>
              <div className="mt-3">
                <a
                  href={documentationCardCopy.linkTarget || '#shipment-documentation-support'}
                  className="inline-block text-sm sm:text-base font-semibold text-[var(--color-navy)] hover:underline underline-offset-4 rounded-[2px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                  style={{ letterSpacing: 'normal' }}
                >
                  {documentationCardCopy.linkLabel}
                </a>
              </div>
            </div>
          )}

          <div
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] border-t-[var(--color-kraft)] rounded-[var(--radius)] p-6 shadow-none text-left"
            style={{ letterSpacing: 'normal' }}
          >
            <h3
              className="text-lg font-bold font-heading text-[var(--color-navy)] leading-snug"
              style={{ letterSpacing: 'normal' }}
            >
              {airCrossLinkCopy.heading || 'Need air freight documents?'}
            </h3>
            <p
              className="mt-2 text-sm sm:text-base text-[var(--color-text)] font-normal leading-relaxed"
              style={{ letterSpacing: 'normal' }}
            >
              {airCrossLinkCopy.text || 'We also prepare Air Waybills and the billing and shipment documents for air freight.'}
            </p>
            <div className="mt-3">
              <a
                href={airCrossLinkCopy.linkTarget || '#air-freight'}
                onClick={handleAirFreightClick}
                className="inline-block text-sm sm:text-base font-semibold text-[var(--color-navy)] hover:underline underline-offset-4 rounded-[2px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                style={{ letterSpacing: 'normal' }}
              >
                {airCrossLinkCopy.linkLabel || 'See air freight documents'}
              </a>
            </div>
          </div>

          {/* Part C: Where We Operate Line */}
          <p
            className="text-sm sm:text-base text-[var(--color-text-muted)] font-normal leading-relaxed text-left"
            style={{ letterSpacing: 'normal' }}
          >
            <strong className="font-bold text-[var(--color-navy)]">{whereWeOperateCopy.lead || 'Where we operate:'}</strong>{' '}
            {whereWeOperateCopy.text || 'Singapore only.'}
          </p>
        </div>
      </section>

      {/* 6C. FREQUENTLY ASKED QUESTIONS */}
      <section
        id="faq"
        className={`!mt-0 ${faqBgClass} py-[72px] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-divider)] text-left`}
      >
        <span id="faq-road" className="sr-only" aria-hidden="true" />
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
            {roadFaqList.map((faq, idx) => {
              const isOpen = openFaq === idx;
              const triggerId = `road-faq-trigger-${idx}`;
              const panelId = `road-faq-panel-${idx}`;
              return (
                <div
                  key={faq.id || idx}
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
                      className="px-4 sm:px-5 pb-5 text-sm sm:text-base text-[var(--color-text)] font-normal"
                      style={{ lineHeight: 1.6, letterSpacing: 'normal' }}
                    >
                      {faq.linkLabel ? (
                        <>
                          {faq.aPrefix}
                          <a
                            href={faq.linkTarget || '#track'}
                            onClick={handleTrackClick}
                            className="link-inline"
                            style={{ letterSpacing: 'normal' }}
                          >
                            {faq.linkLabel}
                          </a>
                          {faq.aSuffix}
                        </>
                      ) : (
                        faq.a
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: roadFaqList.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.a
                }
              }))
            })
          }}
        />
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
              className="w-full sm:w-auto px-6 py-3 bg-[var(--color-orange)] hover:bg-[var(--color-orange-hover)] text-[var(--color-on-navy)] rounded-[var(--radius)] font-semibold text-sm sm:text-base transition-colors cursor-pointer text-center shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
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

            {phoneLinks.hasConfirmedPhone && phoneLinks.telHref && (
              <a
                href={phoneLinks.telHref}
                className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-[var(--color-navy)] hover:underline underline-offset-4 py-1 rounded-[2px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                style={{ letterSpacing: 'normal' }}
              >
                <Phone className="w-4 h-4 text-[var(--color-navy)] shrink-0" aria-hidden="true" />
                <span>{closingCtaCopy.callLabel || 'Call us'}</span>
              </a>
            )}

            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-[var(--color-navy)] hover:underline underline-offset-4 py-1 rounded-[2px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                style={{ letterSpacing: 'normal' }}
              >
                <svg className="w-5 h-5 fill-current text-[var(--color-navy)] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>{closingCtaCopy.whatsappLabel}</span>
              </a>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
