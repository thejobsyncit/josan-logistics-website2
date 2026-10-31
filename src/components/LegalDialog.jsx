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
  ChevronRight,
  Loader2
} from 'lucide-react';
import { COOKIE_AUDIT_DATA, openCookiePreferences } from './CookieBanner';
import { useLogistics } from '../context/LogisticsContext';

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
  const { siteSettings } = useLogistics?.() || {};
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
    { id: 'sec-p-3', label: '4. Third-Party Service Providers' },
    { id: 'sec-p-4', label: '5. Overseas Transfers' },
    { id: 'sec-p-5', label: '6. Retention & Secure Deletion' },
    { id: 'sec-p-6', label: '7. Consent & Preferences' },
    { id: 'sec-p-children', label: "8. Children's Privacy" },
    { id: 'sec-p-dnt', label: '9. Do Not Track & Cookies' },
    { id: 'sec-p-7', label: '10. JOSAN AI & Tracking' },
    { id: 'sec-p-8', label: '11. Cookie Inventory' },
    { id: 'sec-p-9', label: '12. Security' },
    { id: 'sec-p-10', label: '13. Updates & Effective Date' },
    { id: 'sec-p-complaints', label: '14. Complaints & Dispute Resolution' },
    { id: 'sec-p-11', label: '15. DPO Contact' },
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
    { id: 'sec-t-11', label: '11. Governing Law' },
    { id: 'sec-t-12', label: '12. Force Majeure' },
    { id: 'sec-t-13', label: '13. Additional Charges' },
    { id: 'sec-t-14', label: '14. Failed Delivery & Returns' },
    { id: 'sec-t-15', label: '15. Prohibited Goods' },
    { id: 'sec-t-16', label: '16. Privacy & Confidentiality' },
    { id: 'sec-t-17', label: '17. Third-Party Providers' },
    { id: 'sec-t-18', label: '18. Suspension / Termination' },
    { id: 'sec-t-19', label: '19. Amendments' },
    { id: 'sec-t-20', label: '20. Severability & Entire Agreement' },
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
                  Last updated: 29 October 2026
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

            {/* Mobile Download and Print Icons */}
            <div className="ml-auto sm:hidden flex items-center space-x-1.5">
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

              {/* Section 4: Third-Party Service Providers Policy */}
              <section id="sec-p-3" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">4</span>
                  <span>Third-Party Service Providers Policy</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <p>
                    Josan Logistics Pte. Ltd. may share personal data with authorised third-party service providers, including transport partners, airlines, freight handlers, cloud hosting providers, email service providers, and technology vendors, where necessary to deliver our services.
                  </p>
                  <p className="text-slate-600">
                    We take reasonable steps to ensure that these providers protect personal data, maintain confidentiality, and process information only for authorised purposes and in accordance with applicable data protection laws.
                  </p>
                </div>
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

              {/* Section 6: Data Retention and Secure Deletion Policy */}
              <section id="sec-p-5" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">6</span>
                  <span>Data Retention and Secure Deletion Policy</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                  <p>
                    Josan Logistics Pte. Ltd. retains personal data only for as long as necessary to fulfil business purposes, provide logistics services, comply with legal and regulatory obligations, and resolve disputes.
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600">
                    <li><strong className="text-slate-800">Commercial &amp; Tax Records:</strong> Certain commercial, tax, and accounting records may be retained for <strong>five to seven years</strong>, where applicable.</li>
                    <li><strong className="text-slate-800">Enquiries &amp; Chatbot Logs:</strong> Website enquiries and chatbot logs may be deleted after <strong>30 days</strong> where they are no longer required.</li>
                    <li><strong className="text-slate-800">Secure Deletion:</strong> When data is no longer needed, we take reasonable steps to securely delete, anonymise, or dispose of it, subject to applicable legal requirements.</li>
                  </ul>
                </div>
              </section>

              {/* Section 7: Consent and Communication Preferences */}
              <section id="sec-p-6" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">7</span>
                  <span>Consent and Communication Preferences</span>
                </h3>
                <p>
                  Josan Logistics Pte. Ltd. collects, uses, and discloses personal data in accordance with applicable data protection laws. Where consent is required, we will obtain it before processing personal data for the relevant purpose.
                </p>
                <div className="p-3.5 bg-orange-50/70 rounded-xl border border-orange-200 text-xs space-y-1.5 text-slate-700">
                  <p>
                    <strong>Withdrawal of Consent:</strong> Individuals may withdraw their consent by contacting our Data Protection Officer, subject to legal and contractual restrictions.
                  </p>
                  <p>
                    <strong>Essential Communications:</strong> We may continue to send essential service-related communications, including shipment updates, booking confirmations, and legal notices, where necessary.
                  </p>
                </div>
              </section>

              {/* Section 8: Children's Privacy Policy */}
              <section id="sec-p-children" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">8</span>
                  <span>Children's Privacy Policy</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <p>
                    The Josan Logistics website and services are primarily intended for businesses and adults arranging logistics and freight services. We do not knowingly collect personal data from children unless necessary for a legitimate and lawful service-related purpose.
                  </p>
                  <p className="text-slate-600">
                    Any such information will be handled in accordance with applicable laws. If you believe that a child has provided personal data to us inappropriately, contact our Data Protection Officer so that we can review the matter and take appropriate action.
                  </p>
                </div>
              </section>

              {/* Section 9: Do Not Track and Cookie Preferences */}
              <section id="sec-p-dnt" className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">9</span>
                    <span>Do Not Track and Cookie Preferences</span>
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
                  Our website may use cookies and similar technologies to support website functionality, security, and user preferences. Where analytics or other non-essential cookies are used, relevant information and available choices will be provided through the website or an appropriate cookie notice.
                </p>
                <p className="text-xs text-slate-600">
                  Users may manage or disable cookies through their browser settings, although some website features may not function properly as a result. We will handle tracking preferences in accordance with applicable laws and the technologies actually implemented on our website.
                </p>
              </section>

              {/* Section 10: JOSAN AI Chat and Track Shipment */}
              <section id="sec-p-7" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">10</span>
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

              {/* Section 11: Cookies & Storage Inventory */}
              <section id="sec-p-8" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">11</span>
                  <span>Inventory of Cookies &amp; Storage Items in Use</span>
                </h3>
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

              {/* Section 12: Security */}
              <section id="sec-p-9" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">12</span>
                  <span>Data Protection &amp; Security</span>
                </h3>
                <p>
                  All electronic transactions and quote requests are protected with TLS encryption in transit and encrypted data storage at rest. Access is strictly restricted to certified operations personnel and logistics coordinators.
                </p>
              </section>

              {/* Section 13: Policy Updates and Effective Date */}
              <section id="sec-p-10" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">13</span>
                  <span>Policy Updates and Effective Date</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <p>
                    Josan Logistics Pte. Ltd. may update this Privacy Policy from time to time to reflect changes in our services, business operations, technology, or applicable legal requirements. The revised policy will be published on our website with an updated “Last Updated” date.
                  </p>
                  <p>
                    Where required by law, we will provide additional notice or obtain consent before implementing relevant changes. Users are encouraged to review this policy periodically.
                  </p>
                  <p className="font-bold text-slate-900 pt-1">
                    Effective Date: 29 October 2026
                  </p>
                </div>
              </section>

              {/* Section 14: Complaints and Dispute Resolution */}
              <section id="sec-p-complaints" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">14</span>
                  <span>Complaints and Dispute Resolution</span>
                </h3>
                <div className="p-3.5 bg-orange-50/70 rounded-xl border border-orange-200 text-xs space-y-1.5 text-slate-700">
                  <p>
                    Individuals who have questions, concerns, or complaints regarding the collection, use, disclosure, or protection of their personal data may contact our Data Protection Officer. We will review complaints, investigate relevant circumstances, and take appropriate corrective action where necessary.
                  </p>
                  <p>
                    We aim to respond within the timeframe required by applicable law. If a complaint cannot be resolved directly, individuals may refer the matter to the relevant Singapore authority, including the <strong>Personal Data Protection Commission (PDPC)</strong>, where appropriate.
                  </p>
                </div>
              </section>

              {/* Section 15: DPO Contact */}
              <section id="sec-p-11" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">15</span>
                  <span>Data Protection Officer Contact Details</span>
                </h3>
                <p>To exercise your data protection rights or contact our appointed DPO:</p>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-700">
                  <p><strong className="text-slate-900">Data Protection Officer &bull; {siteSettings?.company_name || 'Josan Logistics Pte. Ltd.'}</strong></p>
                  <p><strong>Address:</strong> {siteSettings?.registered_office || '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438'}</p>
                  <p>
                    <strong>Email:</strong> <a href={`mailto:${siteSettings?.contact_email || 'contact@josanlogistics.com.sg'}`} className="text-[#F26B21] font-bold hover:underline">{siteSettings?.contact_email || 'contact@josanlogistics.com.sg'}</a>
                  </p>
                  <p><strong>Telephone:</strong> <a href={`tel:${(siteSettings?.phone || '+65 6789 0123').replace(/\s+/g, '')}`} className="text-slate-900 font-bold hover:underline">{siteSettings?.phone || '+65 6789 0123'}</a></p>
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

              {/* Section 11: Governing Law & Jurisdiction */}
              <section id="sec-t-11" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">11</span>
                  <span>Governing Law &amp; Jurisdiction</span>
                </h3>
                <p className="text-slate-600">
                  These Terms of Service are governed by and construed in accordance with the laws of the Republic of Singapore. Any disputes arising in connection with our services shall be subject to the exclusive jurisdiction of the Courts of Singapore.
                </p>
              </section>

              {/* Section 12: Force Majeure */}
              <section id="sec-t-12" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">12</span>
                  <span>Force Majeure</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                  <p>
                    Neither party shall be held liable for any delay, interruption, or failure to perform its obligations under these Terms where such delay or failure results from events beyond its reasonable control. Such events may include natural disasters, floods, earthquakes, extreme weather conditions, fires, epidemics, pandemics, strikes, civil unrest, war, acts of terrorism, government restrictions, transport disruptions, or other unforeseen circumstances.
                  </p>
                  <p>
                    The affected party shall notify the other party as soon as reasonably practicable and take reasonable steps to minimize the impact of such events. Any affected obligations shall be suspended for the duration of the event to the extent permitted by applicable law.
                  </p>
                </div>
              </section>

              {/* Section 13: Additional Charges and Surcharges */}
              <section id="sec-t-13" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">13</span>
                  <span>Additional Charges and Surcharges</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                  <p>
                    All quotations are based on the shipment information provided by the Customer and the applicable service conditions at the time of quotation. Additional charges may apply if there are changes in shipment weight, dimensions, cargo characteristics, pickup or delivery locations, or service requirements.
                  </p>
                  <p>
                    Additional charges may also arise from fuel surcharges, storage, extended waiting time, additional handling, re-delivery, return transportation, customs-related expenses, or other unforeseen operational requirements.
                  </p>
                  <p>
                    Where reasonably practicable, Josan Logistics shall inform the Customer of such additional charges before they are incurred. The Customer shall be responsible for applicable additional charges supported by the relevant service records or invoices.
                  </p>
                </div>
              </section>

              {/* Section 14: Failed Delivery and Return Shipments */}
              <section id="sec-t-14" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">14</span>
                  <span>Failed Delivery and Return Shipments</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                  <p>
                    The Customer is responsible for providing accurate pickup and delivery addresses, recipient contact details, and other information necessary for successful shipment delivery.
                  </p>
                  <p>
                    If delivery cannot be completed due to an incorrect address, recipient unavailability, refusal to accept the shipment, incomplete documentation, regulatory restrictions, or other circumstances beyond the reasonable control of Josan Logistics, the shipment may be held, stored, returned, or scheduled for re-delivery, subject to applicable operational and legal requirements.
                  </p>
                  <p>
                    Additional charges for storage, re-delivery, return transportation, or related services may apply. Josan Logistics shall communicate the available options and applicable charges to the Customer wherever reasonably practicable.
                  </p>
                </div>
              </section>

              {/* Section 15: Prohibited Goods and Regulatory Compliance */}
              <section id="sec-t-15" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">15</span>
                  <span>Prohibited Goods and Regulatory Compliance</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                  <p>
                    The Customer shall ensure that all goods submitted for transportation comply with applicable Singapore laws, destination-country regulations, international transportation requirements, and relevant carrier policies.
                  </p>
                  <p>
                    The Customer must accurately declare the contents, nature, quantity, weight, and any hazardous or restricted characteristics of the shipment before booking. Prohibited, undeclared dangerous, illegal, counterfeit, or otherwise restricted goods must not be tendered for transportation.
                  </p>
                  <p>
                    Josan Logistics reserves the right to refuse, suspend, or cancel a shipment where there are reasonable grounds to believe that the shipment violates applicable laws, regulatory requirements, safety standards, or carrier restrictions.
                  </p>
                  <p>
                    The Customer shall be responsible for losses, penalties, expenses, or claims arising from inaccurate declarations, unlawful cargo, or the Customer's failure to comply with applicable requirements, to the extent permitted by law.
                  </p>
                </div>
              </section>

              {/* Section 16: Data Privacy and Confidentiality */}
              <section id="sec-t-16" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">16</span>
                  <span>Data Privacy and Confidentiality</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                  <p>
                    Josan Logistics may collect and process personal, commercial, and shipment-related information as necessary to provide logistics coordination, prepare shipment documentation, arrange transportation, process payments, communicate with customers, and comply with legal and regulatory obligations.
                  </p>
                  <p>
                    Such information may include customer names, contact details, pickup and delivery addresses, shipment descriptions, invoices, and transaction records. Information may be shared with authorized carriers, airlines, service providers, payment processors, and regulatory authorities where necessary for legitimate business operations or legal compliance.
                  </p>
                  <p>
                    Josan Logistics shall take reasonable measures to protect personal and confidential information against unauthorized access, disclosure, alteration, or loss and shall handle such information in accordance with applicable data protection laws.
                  </p>
                  <p>
                    Customers should contact Josan Logistics through its official communication channels regarding questions about personal data, access requests, corrections, or other applicable data protection rights.
                  </p>
                </div>
              </section>

              {/* Section 17: Third-Party Service Providers */}
              <section id="sec-t-17" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">17</span>
                  <span>Third-Party Service Providers</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                  <p>
                    Josan Logistics may engage independent third-party hauliers, airlines, warehouses, documentation providers, and other logistics service providers to facilitate the services requested by the Customer.
                  </p>
                  <p>
                    The services performed by such providers may be subject to their respective terms, operational conditions, and applicable legal liability limits. Josan Logistics shall coordinate such services within the scope of its agreed responsibilities.
                  </p>
                  <p>
                    The use of third-party service providers does not automatically exclude or limit any responsibility that Josan Logistics may have under applicable law or an agreed written contract.
                  </p>
                </div>
              </section>

              {/* Section 18: Suspension or Termination of Services */}
              <section id="sec-t-18" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">18</span>
                  <span>Suspension or Termination of Services</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                  <p>
                    Josan Logistics may suspend, refuse, or terminate services where the Customer materially breaches these Terms, fails to make payments when due, provides materially false or misleading information, submits prohibited goods, or engages in activities that violate applicable laws or create a reasonable safety or compliance concern.
                  </p>
                  <p>
                    Where reasonably practicable, Josan Logistics shall notify the Customer of the reason for suspension or termination and provide an opportunity to resolve the issue when appropriate.
                  </p>
                  <p>
                    Suspension or termination shall not remove the Customer's obligation to pay charges properly incurred before the effective date of suspension or termination. Any outstanding shipments shall be handled in accordance with applicable law, safety requirements, and the agreed service arrangements.
                  </p>
                </div>
              </section>

              {/* Section 19: Amendments to Terms */}
              <section id="sec-t-19" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">19</span>
                  <span>Amendments to Terms</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                  <p>
                    Josan Logistics may revise these Terms from time to time to reflect changes in its services, operational procedures, contractual arrangements, or applicable legal and regulatory requirements.
                  </p>
                  <p>
                    The latest version of these Terms shall be published on the relevant company website or made available to Customers through appropriate communication channels, together with the applicable effective date.
                  </p>
                  <p>
                    Unless otherwise required by law or agreed in writing, revised Terms shall apply to services booked or agreements entered into on or after their effective date. Changes to existing contractual arrangements shall be subject to applicable law and any agreed contractual requirements.
                  </p>
                </div>
              </section>

              {/* Section 20: Severability and Entire Agreement */}
              <section id="sec-t-20" className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">20</span>
                  <span>Severability and Entire Agreement</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                  <p>
                    If any provision of these Terms is determined by a competent court or authority to be invalid, unlawful, or unenforceable, that provision shall be limited or severed to the extent necessary, and the remaining provisions shall continue in effect.
                  </p>
                  <p>
                    These Terms, together with any applicable written quotation, confirmed booking, service agreement, or other expressly incorporated contractual document, constitute the agreement between Josan Logistics and the Customer concerning the services covered by those documents.
                  </p>
                  <p>
                    In the event of any inconsistency between these Terms and a separately signed written agreement, the terms of that written agreement shall prevail to the extent of the inconsistency, unless otherwise agreed or required by applicable law.
                  </p>
                </div>
              </section>
            </>
          )}

          {/* Contact & Office Footer Box inside modal */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
            <p className="font-bold text-slate-900 text-sm">Commercial Inquiries &bull; {siteSettings?.company_name || 'Josan Logistics Pte. Ltd.'}</p>
            <p className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Office: {siteSettings?.registered_office || '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438'}</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Email: <a href={`mailto:${siteSettings?.contact_email || 'contact@josanlogistics.com.sg'}`} className="text-[#F26B21] font-bold hover:underline">{siteSettings?.contact_email || 'contact@josanlogistics.com.sg'}</a></span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Hotline: <a href={`tel:${(siteSettings?.phone || '+65 6789 0123').replace(/\s+/g, '')}`} className="text-slate-900 font-bold hover:underline">{siteSettings?.phone || '+65 6789 0123'}</a></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
