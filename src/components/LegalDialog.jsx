import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  FileText, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Cookie, 
  Clock, 
  AlertCircle,
  Scale,
  Settings,
  ChevronRight
} from 'lucide-react';
import { COOKIE_AUDIT_DATA, openCookiePreferences } from './CookieBanner';

// Global helper function so any component can open the dialog without navigating or clearing form state
export const openLegalDialog = (type = 'privacy', triggerElement = null) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-legal-dialog', { 
      detail: { 
        type: type === 'terms' || type === 'terms-of-service' ? 'terms' : 'privacy', 
        trigger: triggerElement || document.activeElement 
      } 
    }));
  }
};

export const LegalDialog = ({ isOpen: propIsOpen, onClose: propOnClose, initialType = 'privacy' }) => {
  const [isOpen, setIsOpen] = useState(propIsOpen || false);
  const [activeType, setActiveType] = useState(initialType || 'privacy'); // 'privacy' | 'terms'

  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Synchronize propIsOpen
  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsOpen(propIsOpen);
    }
  }, [propIsOpen]);

  // Synchronize initialType
  useEffect(() => {
    if (initialType) {
      setActiveType(initialType === 'terms' || initialType === 'terms-of-service' ? 'terms' : 'privacy');
    }
  }, [initialType]);

  // Listen for global custom events to open dialog from anywhere on the site
  useEffect(() => {
    const handleGlobalOpen = (e) => {
      const type = e.detail?.type === 'terms' ? 'terms' : 'privacy';
      if (e.detail?.trigger) {
        triggerRef.current = e.detail.trigger;
      } else {
        triggerRef.current = document.activeElement;
      }
      setActiveType(type);
      setIsOpen(true);
    };

    window.addEventListener('open-legal-dialog', handleGlobalOpen);
    return () => window.removeEventListener('open-legal-dialog', handleGlobalOpen);
  }, []);

  // Handle closing
  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (propOnClose) propOnClose();

    // If current URL is /privacy or /terms, restore URL without reloading
    if (typeof window !== 'undefined' && window.history) {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path === '/privacy' || 
        path === '/privacy-policy' || 
        path === '/terms' || 
        path === '/terms-of-service' ||
        hash === '#privacy' || 
        hash === '#privacy-policy' || 
        hash === '#terms' || 
        hash === '#terms-of-service'
      ) {
        window.history.replaceState(null, '', window.location.pathname === '/' ? '/' : '/#');
      }
    }

    // Return focus to triggering element
    setTimeout(() => {
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    }, 50);
  }, [propOnClose]);

  // Keyboard navigation: Escape to close & Tab focus trapping
  useEffect(() => {
    if (!isOpen) return;

    // Lock page scroll
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Focus the dialog on mount
    const timer = setTimeout(() => {
      if (dialogRef.current) {
        const closeBtn = dialogRef.current.querySelector('[data-dialog-close="true"]');
        if (closeBtn) closeBtn.focus();
      }
    }, 100);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements);
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // Print Handler

  // Print Handler
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Download PDF / Text Handler
  const handleDownloadPDF = () => {
    if (typeof window !== 'undefined') {
      // Directs to clean print-to-PDF dialog
      window.print();
    }
  };

  // Smooth scroll to a section inside the dialog
  const scrollToSection = (sectionId) => {
    if (!scrollContainerRef.current) return;
    const target = scrollContainerRef.current.querySelector(`#${sectionId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isOpen) return null;

  // Table of Contents lists
  const privacyToc = [
    { id: 'sec-p-scope', label: '1. Scope' },
    { id: 'sec-p-1', label: '2. Information We Collect' },
    { id: 'sec-p-2', label: '3. How We Use Data' },
    { id: 'sec-p-3', label: '4. Who We Share Data With' },
    { id: 'sec-p-4', label: '5. Overseas Transfers' },
    { id: 'sec-p-5', label: '6. Retention Period' },
    { id: 'sec-p-6', label: '7. Your Rights (30 Days)' },
    { id: 'sec-p-7', label: '8. JOSAN AI & Tracking' },
    { id: 'sec-p-8', label: '9. Cookies' },
    { id: 'sec-p-9', label: '10. Security' },
    { id: 'sec-p-10', label: '11. Changes' },
    { id: 'sec-p-11', label: '12. DPO Contact' },
  ];

  const termsToc = [
    { id: 'sec-t-1', label: '1. Scope of Services' },
    { id: 'sec-t-2', label: '2. Shipper Obligations' },
    { id: 'sec-t-3', label: '3. Documentation Responsibility' },
    { id: 'sec-t-4', label: '4. Quotes & Payment' },
    { id: 'sec-t-5', label: '5. Cancellation & Changes' },
    { id: 'sec-t-6', label: '6. Loading & Demurrage' },
    { id: 'sec-t-7', label: '7. Tracking Info' },
    { id: 'sec-t-8', label: '8. Limit of Liability' },
    { id: 'sec-t-9', label: '9. Claims & Discrepancies' },
    { id: 'sec-t-10', label: '10. Website Use' },
    { id: 'sec-t-11', label: '11. Changes to Terms' },
    { id: 'sec-t-12', label: '12. Governing Law' },
  ];

  return (
    <div 
      className="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 md:p-6 animate-fadeIn overflow-hidden"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-dialog-title"
      aria-describedby="legal-dialog-subtitle"
    >
      {/* Dialog Window: Desktop centred (max ~800px), Mobile full-screen sheet */}
      <div 
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full h-full sm:h-auto sm:max-h-[92vh] max-w-[820px] rounded-none sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative"
      >
        {/* ========================================================================= */}
        {/* FIXED HEADER                                                              */}
        {/* ========================================================================= */}
        <header className="bg-[#0B1F3A] text-white px-5 sm:px-8 py-4 sm:py-5 shrink-0 border-b border-[#1E3A5F] shadow-sm relative z-20">
          <div className="flex items-center justify-between gap-3">
            
            {/* Title & Metadata */}
            <div className="space-y-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  {activeType === 'privacy' ? 'Singapore PDPA 2012' : 'Singapore Jurisdiction'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Last updated: 26 October 2026
                </span>
              </div>
              <h2 id="legal-dialog-title" className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                {activeType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h2>
            </div>

            {/* Header Action Buttons: Print, Download, Close */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {/* Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                title="Print Document"
                aria-label="Print legal document"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              {/* Download PDF Button */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                title="Download as PDF"
                aria-label="Download legal document as PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              {/* Close Button (X) */}
              <button
                type="button"
                data-dialog-close="true"
                onClick={handleClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#F26B21] text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dialog"
                title="Close dialog (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Toggle Pills between Privacy Policy and Terms of Service */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setActiveType('privacy')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeType === 'privacy'
                  ? 'bg-[#F26B21] text-white shadow-sm'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveType('terms')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeType === 'terms'
                  ? 'bg-[#F26B21] text-white shadow-sm'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Service</span>
            </button>

            {/* Mobile Print Icon */}
            <div className="ml-auto sm:hidden flex items-center space-x-1">
              <button
                type="button"
                onClick={handlePrint}
                className="p-1.5 rounded-lg bg-white/10 text-slate-200 hover:text-white"
                title="Print"
                aria-label="Print"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* TABLE OF CONTENTS LIST                                                    */}
        {/* ========================================================================= */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-5 sm:px-8 py-2.5 shrink-0 overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-bold shrink-0 uppercase tracking-wider text-[10px]">Jump to:</span>
            <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
              {(activeType === 'privacy' ? privacyToc : termsToc).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-50 text-slate-700 hover:text-[#F26B21] border border-slate-200 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer shadow-2xs shrink-0"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCROLLABLE DIALOG BODY                                                    */}
        {/* ========================================================================= */}
        <div 
          ref={scrollContainerRef}
          id="legal-dialog-subtitle"
          className="p-5 sm:p-8 overflow-y-auto text-slate-700 text-sm leading-relaxed space-y-8 bg-white flex-1"
        >
          {/* ===================================================================== */}
          {/* CONTENT: PRIVACY POLICY                                               */}
          {/* ===================================================================== */}
          {activeType === 'privacy' && (
            <>
              {/* PDPA Intro Statement */}
              <div className="bg-orange-50/70 p-4 sm:p-5 rounded-2xl border border-orange-200 space-y-1">
                <p className="text-slate-900 font-semibold text-xs sm:text-sm leading-relaxed">
                  Josan Logistics Pte. Ltd. handles personal data in accordance with the Singapore Personal Data Protection Act 2012 (PDPA).
                </p>
                <p className="text-slate-600 text-xs">
                  We are committed to safeguarding commercial consignment records and personal details entrusted to us by customers, shipping partners, and website visitors.
                </p>
              </div>

              {/* Section 1: Scope */}
              <section id="sec-p-scope" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">1</span>
                  <span>Scope &amp; Intended Audience</span>
                </h3>
                <div className="p-3.5 bg-orange-50/60 rounded-xl border border-orange-200 text-xs space-y-1">
                  <p className="font-extrabold text-slate-900">
                    This website is intended for customers in Singapore.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Josan Logistics Pte. Ltd. provides shipment documentation support and commercial road transportation coordination in Singapore. Our online quote requests, customer portals, and customer communications are directed to commercial shippers and individuals located in Singapore.
                  </p>
                </div>
              </section>

              {/* Section 2: Information We Collect */}
              <section id="sec-p-1" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">2</span>
                  <span>Information We Collect</span>
                </h3>
                <p>When you submit an enquiry, request a freight quote, or engage our services, we collect:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                  <li><strong className="text-slate-800">Contact Details:</strong> Your full name, company name, business or personal email address, and telephone number.</li>
                  <li><strong className="text-slate-800">Quote &amp; Consignment Data:</strong> Cargo descriptions, pickup and delivery addresses, package count, cargo dimensions, weight, and preferred schedule.</li>
                  <li><strong className="text-slate-800">Shipment Documents:</strong> Air Waybill (AWB) preparation details, packing lists, commercial invoices, and customs-related documents supplied by you.</li>
                  <li><strong className="text-slate-800">Security &amp; Bot Defense:</strong> IP address and anti-spam verification tokens (Cloudflare Turnstile) to protect our website from automated submissions.</li>
                </ul>
              </section>

              {/* Section 3: How We Use Data */}
              <section id="sec-p-2" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">3</span>
                  <span>How We Use Your Information</span>
                </h3>
                <p>Your data is used strictly for legitimate business and operational logistics purposes, including:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                  <li>Responding to your specific enquiries and preparing accurate freight quotations.</li>
                  <li>Coordinating transportation services with our transport partners and airlines.</li>
                  <li>Keeping records of our services as required by law and for our business purposes.</li>
                </ul>
                <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  We do not sell, rent, or trade your personal data to third parties for marketing purposes.
                </p>
              </section>

              {/* Section 4: Who We Share Data With */}
              <section id="sec-p-3" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">4</span>
                  <span>Who We Share Data With</span>
                </h3>
                <p>We share information strictly on a need-to-know basis with:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                  <li><strong className="text-slate-800">Our transport partners and airlines:</strong> For fulfilling your physical cargo movement.</li>
                  <li><strong className="text-slate-800">Service providers:</strong> Such as email and hosting providers who supply our secure IT and database infrastructure.</li>
                  <li><strong className="text-slate-800">Cloudflare:</strong> For spam protection and bot defense on our quote and contact forms.</li>
                  <li><strong className="text-slate-800">Authorities:</strong> Government or regulatory authorities where required by Singapore law.</li>
                </ul>
              </section>

              {/* Section 5: Overseas Transfers */}
              <section id="sec-p-4" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">5</span>
                  <span>Overseas Transfers</span>
                </h3>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
                  <p>Our services and website are intended for customers in Singapore.</p>
                  <p>
                    Some service providers may process data outside Singapore (such as our email and cloud hosting infrastructure providers). Where data is processed outside Singapore, we ensure our service providers maintain a standard of data protection comparable to the Singapore Personal Data Protection Act 2012 (PDPA).
                  </p>
                </div>
              </section>

              {/* Section 6: How Long We Keep Data */}
              <section id="sec-p-5" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">6</span>
                  <span>How Long We Keep Data</span>
                </h3>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                  <li><strong className="text-slate-800">Shipping, Invoicing &amp; Billing Records:</strong> Retained for <strong>5 years</strong> in accordance with statutory accounting and tax retention standards.</li>
                  <li><strong className="text-slate-800">Enquiries and Chats:</strong> Enquiries and stored chats are deleted after <strong>30 days</strong>. Regular chats are kept only in the browser session and deleted when the session ends.</li>
                </ul>
              </section>

              {/* Section 7: Your Rights */}
              <section id="sec-p-6" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">7</span>
                  <span>Your Rights</span>
                </h3>
                <p>Under the Singapore Personal Data Protection Act (PDPA), you have the right to:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                  <li>Request access to your personal data that we hold.</li>
                  <li>Request correction of inaccurate or incomplete information.</li>
                  <li>Withdraw consent for data collection or processing at any time.</li>
                  <li>Contact our Data Protection Officer (DPO).</li>
                </ul>
                <p className="text-xs text-slate-500 mt-1">
                  We acknowledge all verified requests promptly and aim to provide a formal resolution within <strong>30 days</strong>.
                </p>
              </section>

              {/* Section 8: JOSAN AI Chat and Track Shipment */}
              <section id="sec-p-7" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">8</span>
                  <span>JOSAN AI Chat and Track Shipment</span>
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong className="text-slate-800">JOSAN AI Chat &amp; Quotes:</strong> We store the <strong>name</strong> and the <strong>description of the quote</strong> so our operations team can accurately calculate, formulate, and deliver your quotation. Chat messages are kept only in your browser session (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs text-slate-800">sessionStorage</code>) and deleted when the session ends, unless you submit a quote or contact request (attached to that reference number) or choose &quot;Send this chat to our team&quot;. Stored chats are deleted after <strong>30 days</strong> and are visible to admin staff only. Customers may request deletion of their chats at any time through our operations team or using the chat trash icon.
                  </p>
                  <p>
                    <strong className="text-slate-800">Track Shipment Page:</strong> Stores and queries your tracking number or Air Waybill (AWB) code to retrieve milestone logs entered by our dispatch team. We do not profile visitors or track browsing behavior across websites.
                  </p>
                </div>
              </section>

              {/* Section 9: Cookies */}
              <section id="sec-p-8" className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">9</span>
                    <span>Cookies</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => openCookiePreferences()}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#F26B21] border border-orange-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Cookie Settings</span>
                  </button>
                </div>
                <p>
                  We use <strong>only essential cookies</strong> (login, security and chat); we do not use analytics or advertising cookies. You can adjust your preferences at any time using the <strong>Cookie Settings</strong> button above.
                </p>

                {/* Audited Cookies & Storage Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden mt-3 shadow-2xs">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">Inventory of Cookies &amp; Storage Items in Use</span>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">No marketing or advertising trackers</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 text-[10px] uppercase tracking-wider font-bold">
                          <th className="py-2.5 px-3">Item Name</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Provider</th>
                          <th className="py-2.5 px-3">Duration</th>
                          <th className="py-2.5 px-3">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {COOKIE_AUDIT_DATA.map((item) => (
                          <tr key={item.name} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-slate-900">{item.name}</td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.category === 'Strictly Necessary'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-blue-50 text-blue-800 border border-blue-200'
                              }`}>
                                {item.category}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">{item.provider}</td>
                            <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{item.duration}</td>
                            <td className="py-2.5 px-3 text-slate-600 leading-snug">{item.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Section 10: Security */}
              <section id="sec-p-9" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">10</span>
                  <span>Data Protection &amp; Security</span>
                </h3>
                <p>
                  All electronic transactions and quote requests are protected with TLS encryption in transit and encrypted data storage at rest. Access is strictly restricted to certified operations dispatchers.
                </p>
              </section>

              {/* Section 11: Changes to this Policy */}
              <section id="sec-p-10" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">11</span>
                  <span>Changes to this Policy</span>
                </h3>
                <p>
                  We may update this policy periodically to reflect operational or regulatory changes. Revisions take effect immediately upon posting with an updated "Last updated" date.
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  Last updated: 26 October 2026
                </p>
              </section>

              {/* Section 12: DPO Contact */}
              <section id="sec-p-11" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">12</span>
                  <span>Data Protection Officer (DPO) Contact</span>
                </h3>
                <p>To exercise your data protection rights or contact our appointed DPO:</p>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <p><strong className="text-slate-900">Data Protection Officer</strong> &bull; Josan Logistics Pte. Ltd.</p>
                  <p>10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438</p>
                  <p>Email: <a href="mailto:privacy@josanlogistics.com.sg" className="text-[#F26B21] font-bold hover:underline">privacy@josanlogistics.com.sg</a> &bull; Hotline: +65 6789 0123</p>
                </div>
              </section>
            </>
          )}

          {/* ===================================================================== */}
          {/* CONTENT: TERMS OF SERVICE                                             */}
          {/* ===================================================================== */}
          {activeType === 'terms' && (
            <>
              {/* Terms Intro */}
              <div className="bg-blue-50/70 p-4 sm:p-5 rounded-2xl border border-blue-200 space-y-1.5">
                <p className="text-slate-900 font-semibold text-xs sm:text-sm leading-relaxed">
                  These Terms of Service govern commercial road transportation coordination, Air Waybill (AWB) preparation, billing, tracking, and shipment documentation services provided by Josan Logistics Pte. Ltd.
                </p>
                <p className="text-blue-900 text-xs font-bold">
                  This website and our services are intended for customers in Singapore.
                </p>
              </div>

              {/* Section 1: Scope of Services */}
              <section id="sec-t-1" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">1</span>
                  <span>Scope of Services</span>
                </h3>
                <p>
                  Josan Logistics Pte. Ltd. operates strictly as a <strong>freight coordinator</strong>. Our services comprise commercial road transportation coordination through independent transport partners and shipment documentation support (including Air Waybill preparation for partner airlines).
                </p>
                <p className="text-slate-600">
                  Transport services are performed by independent, verified road hauliers and commercial airlines appointed by us. We do not operate an airline or commercial road fleet directly, nor do we act as a customs broker or clearance agent.
                </p>
                <p className="text-slate-600 font-medium">
                  This website and our services are intended for customers in Singapore.
                </p>
              </section>

              {/* Section 2: Shipper & Consignor Obligations */}
              <section id="sec-t-2" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">2</span>
                  <span>Shipper &amp; Consignor Obligations</span>
                </h3>
                <p>The customer warrants and agrees that:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                  <li>All cargo dimensions, gross weights, volume metrics, and commodity classifications provided to Josan Logistics are complete, accurate, and up to date.</li>
                  <li>Consignments are appropriately packaged, labeled, and marked to withstand the standard handling conditions of commercial road carriage and air transit.</li>
                  <li>Shipments do not contain undeclared hazardous materials, restricted contraband, dangerous goods, or commodities prohibited under Singapore and international civil aviation standards.</li>
                </ul>
              </section>

              {/* Section 3: Documentation and Customer Responsibility */}
              <section id="sec-t-3" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">3</span>
                  <span>Documentation and Customer Responsibility</span>
                </h3>
                <p>
                  We provide documentation support only. We do not provide customs clearance or act as a customs broker. While Josan Logistics assists in preparing Air Waybills, consignment notes, and trade paperwork, the customer remains legally and financially responsible for all duties, GST, tariffs, customs inspections, declarations, and penalties assessed by Singapore Customs or overseas port authorities.
                </p>
              </section>

              {/* Section 4: Quotes and Payment */}
              <section id="sec-t-4" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">4</span>
                  <span>Quotes and Payment</span>
                </h3>
                <p className="text-slate-700 font-medium">
                  Payment terms and quote validity are stated in your quote or invoice.
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                  <li><strong className="text-slate-800">Invoices:</strong> Formal commercial invoices are issued following booking confirmation and rate acceptance.</li>
                  <li><strong className="text-slate-800">Singapore GST:</strong> Singapore Goods and Services Tax (GST, currently 9%) applies to domestic services where required under Singapore tax legislation.</li>
                </ul>
              </section>

              {/* Section 5: Cancellation and Changes */}
              <section id="sec-t-5" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">5</span>
                  <span>Cancellation and Changes</span>
                </h3>
                <p className="text-slate-600">
                  Booking modifications or cancellations must be communicated to Josan Logistics in writing prior to vehicle dispatch. Cancellations made after a vehicle has been dispatched or resulting in an abortive journey may be subject to cancellation charges or abortive haulage fees reflecting actual partner costs incurred <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">[LAWYER]</span>.
                </p>
              </section>

              {/* Section 6: Loading, Demurrage & Detention Standards */}
              <section id="sec-t-6" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">6</span>
                  <span>Loading, Demurrage &amp; Detention Standards</span>
                </h3>
                <p className="text-slate-600">
                  A standard loading and unloading window of <strong>45 minutes</strong> is allocated per commercial road consignment. Detention time exceeding standard allowances may incur waiting fees in accordance with our tariff schedules <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">[LAWYER]</span>.
                </p>
              </section>

              {/* Section 7: Tracking Information */}
              <section id="sec-t-7" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">7</span>
                  <span>Tracking Information</span>
                </h3>
                <p className="text-slate-600">
                  Shipment progress updates displayed on our Track Shipment page are entered and updated by our operations dispatch team and are indicative only. Milestone timestamps reflect reported telematics and manual operational logs. For current status, always refer to the "Last updated" time displayed on the tracking screen. Josan Logistics is not liable for minor display latencies or partner telematics transmission delays.
                </p>
              </section>

              {/* Section 8: Limit of Liability */}
              <section id="sec-t-8" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">8</span>
                  <span>Limit of Liability <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">[LAWYER TO CONFIRM]</span></span>
                </h3>
                <p className="text-slate-600">
                  Josan Logistics operates as a freight coordinator. Transport services are performed by independent transport partners and airlines appointed by us:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                  <li>
                    Standard carriage liability for cargo loss or damage is limited in accordance with applicable statutory freight carriage regulations and conventions <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">[LAWYER]</span>.
                  </li>
                  <li>
                    Cargo insurance is not included unless arranged in writing before dispatch. <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">[LAWYER TO CONFIRM]</span>
                  </li>
                  <li>
                    Josan Logistics shall not be liable for consequential loss, indirect commercial damages, loss of business profits, loss of opportunity, or delays caused by force majeure events (severe weather, highway bottlenecks, border delays, civil disruptions) <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">[LAWYER]</span>.
                  </li>
                </ul>
              </section>

              {/* Section 9: Claims & Discrepancy Reporting */}
              <section id="sec-t-9" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">9</span>
                  <span>Claims &amp; Discrepancy Reporting</span>
                </h3>
                <p className="text-slate-600">
                  Any visible package damage, seal tampering, or piece count discrepancy must be endorsed immediately upon the electronic Proof of Delivery (e-POD). Formal claims must be submitted in writing within <strong>48 hours</strong> of consignment delivery <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">[LAWYER]</span>.
                </p>
              </section>

              {/* Section 10: Use of the Website */}
              <section id="sec-t-10" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">10</span>
                  <span>Use of the Website</span>
                </h3>
                <p className="text-slate-600">
                  By accessing this website, the Quote Request portal, and the JOSAN AI chatbot, you agree to use them solely for legitimate commercial freight inquiries and logistics coordination:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                  <li>You agree not to engage in unauthorized data scraping, automated harvesting, crawling, or systematic extraction of website content, tariff rates, or code.</li>
                  <li>You warrant that all company details, consignment metrics, and contact emails submitted through our forms are accurate and legitimate.</li>
                  <li>You agree not to introduce malicious code, denial-of-service attempts, or disrupt the operation of our digital platforms.</li>
                </ul>
              </section>

              {/* Section 11: Changes to These Terms */}
              <section id="sec-t-11" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">11</span>
                  <span>Changes to These Terms</span>
                </h3>
                <p className="text-slate-600">
                  We reserve the right to revise these Terms of Service periodically to reflect operational, commercial, or legal developments. When changes are published, the "Last Updated" date at the top of this page will be updated accordingly. Continued use of our logistics services or digital platforms after revised terms are posted constitutes acceptance of those revisions.
                </p>
              </section>

              {/* Section 12: Governing Law & Jurisdiction */}
              <section id="sec-t-12" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">12</span>
                  <span>Governing Law &amp; Jurisdiction</span>
                </h3>
                <p className="text-slate-600">
                  These Terms of Service are governed by and construed in accordance with the laws of the Republic of Singapore. Any disputes arising in connection with our services shall be subject to the exclusive jurisdiction of the Singapore courts <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">[LAWYER]</span>.
                </p>
              </section>
            </>
          )}

          {/* Contact & Office Footer Box inside modal */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
            <p className="font-bold text-slate-900 text-sm">Commercial Inquiries &bull; Josan Logistics Pte. Ltd.</p>
            <p className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Head Office: 10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Email: <a href="mailto:contact@josanlogistics.com.sg" className="text-[#F26B21] font-bold hover:underline">contact@josanlogistics.com.sg</a></span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Hotline: <a href="tel:+6567890123" className="text-slate-900 font-bold hover:underline">+65 6789 0123</a></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
