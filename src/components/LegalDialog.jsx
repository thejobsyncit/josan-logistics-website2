import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  FileText, 
  Truck, 
  RotateCcw,
  MapPin, 
  Mail, 
  Phone
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { COMPANY_INFO, SITE_CONTACT, isDisplayablePhone } from '../config/siteConfig';
import { openCookiePreferences } from './CookieBanner';

export const openLegalDialog = (type = 'privacy', triggerElement = null) => {
  let normalizedType = 'privacy';
  if (type === 'terms' || type === 'terms-of-service' || type === 'terms-and-conditions') {
    normalizedType = 'terms';
  } else if (type === 'shipping' || type === 'shipping-policy') {
    normalizedType = 'shipping';
  } else if (type === 'refund' || type === 'refund-policy' || type === 'cancellation-policy') {
    normalizedType = 'refund';
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-legal-dialog', { 
      detail: { 
        type: normalizedType, 
        trigger: triggerElement || document.activeElement 
      } 
    }));
  }
};

export const LegalDialog = ({ isOpen: propIsOpen, onClose: propOnClose, initialType = 'privacy' }) => {
  const { siteSettings } = useLogistics?.() || {};
  const [isOpen, setIsOpen] = useState(propIsOpen || false);
  const [activeType, setActiveType] = useState('privacy'); // 'privacy' | 'terms' | 'shipping' | 'refund'

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
      if (initialType === 'terms' || initialType === 'terms-of-service') setActiveType('terms');
      else if (initialType === 'shipping' || initialType === 'shipping-policy') setActiveType('shipping');
      else if (initialType === 'refund' || initialType === 'refund-policy') setActiveType('refund');
      else setActiveType('privacy');
    }
  }, [initialType]);

  // Listen for global custom events to open dialog from anywhere on the site
  useEffect(() => {
    const handleGlobalOpen = (e) => {
      const type = e.detail?.type || 'privacy';
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

    setTimeout(() => {
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    }, 50);
  }, [propOnClose]);

  // Keyboard navigation: Escape to close & Tab focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

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
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 md:p-6 animate-fadeIn overflow-hidden font-sans"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-dialog-title"
    >
      <div 
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] max-w-4xl rounded-none sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative text-left"
      >
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{COMPANY_INFO.name}</span>
                <span>&bull;</span>
                <span>UEN: {COMPANY_INFO.uen}</span>
              </div>
              <h2 id="legal-dialog-title" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                {activeType === 'privacy' && 'Privacy Policy'}
                {activeType === 'terms' && 'Terms & Conditions'}
                {activeType === 'shipping' && 'Shipping Policy'}
                {activeType === 'refund' && 'Refund & Cancellation Policy'}
              </h2>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                title="Print Document"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print</span>
              </button>

              <button
                type="button"
                data-dialog-close="true"
                onClick={handleClose}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Policy Switcher Pills */}
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveType('privacy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                activeType === 'privacy'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-orange,#FF6B00)]" />
              <span>Privacy Policy</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveType('terms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                activeType === 'terms'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[var(--color-orange,#FF6B00)]" />
              <span>Terms &amp; Conditions</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveType('shipping')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                activeType === 'shipping'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-[var(--color-orange,#FF6B00)]" />
              <span>Shipping Policy</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveType('refund')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                activeType === 'refund'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-[var(--color-orange,#FF6B00)]" />
              <span>Refund &amp; Cancellation</span>
            </button>
          </div>
        </header>

        {/* Scrollable Body Content */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed"
        >
          {/* TAB 1: PRIVACY POLICY */}
          {activeType === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <p className="text-xs text-slate-500 font-medium">Jurisdiction: Singapore PDPA 2012 &bull; Effective: 1 November 2026</p>
                <p className="mt-1 text-slate-700">
                  Josan Logistics Pte. Ltd. ("Josan Logistics") is committed to protecting the privacy of personal and commercial data in accordance with the Singapore Personal Data Protection Act 2012 (PDPA).
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">1. Information We Collect</h3>
                <p>
                  We collect information necessary to coordinate transport and prepare trade documentation: full name, corporate email address, contact phone number, company name, sender and recipient physical addresses, cargo descriptions, piece counts, package dimensions, weights, and declared values. When you use our portal, tracking IDs (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">JOS-XXXXX</code> and <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">AWS-XXXXX</code>) and milestone queries are recorded.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">2. How We Use Information</h3>
                <p>
                  Information is used to dispatch transport vehicles with verified partner carriers, draft Air Waybills (AWBs) and cargo manifests, communicate milestone updates, generate electronic Proof of Delivery (e-POD) records, process corporate invoices, enforce security rate-limits, and comply with Singapore tax (IRAS) requirements. We do not sell or monetize customer data.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">3. Payment Information &amp; Financial Security</h3>
                <p>
                  Commercial payments are processed via corporate bank transfers (PayNow Corporate, FAST, GIRO) or certified PCI-DSS payment gateways. Josan Logistics does not store customer credit or debit card numbers on its servers.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">4. Cookies &amp; Bot Protection</h3>
                <p>
                  We use essential session cookies to maintain your authenticated login state and Cloudflare Turnstile bot verification to block automated spam. We do not engage in cross-site behavioral tracking or profiling. You can adjust preferences anytime via{' '}
                  <button type="button" onClick={openCookiePreferences} className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline cursor-pointer">Cookie Settings</button>.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">5. Data Sharing &amp; Disclosures</h3>
                <p>
                  Data is disclosed only to appointed Singapore road hauliers and commercial airlines to execute transport, IT infrastructure partners under strict confidentiality, or statutory authorities (Singapore Customs, CAAS, Singapore Police) when required by Singapore law.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">6. Security, Retention &amp; Customer Rights</h3>
                <p>
                  We implement TLS 1.3 encryption, Row-Level Security database protection, and automated 15-minute inactivity session timeouts. Consignment and invoice records are retained for seven (7) years to satisfy Singapore tax regulations. You may request access, correction, or withdrawal of consent under the PDPA by contacting our Data Protection Officer at <a href="mailto:dpo@josanlogistics.com.sg" className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">dpo@josanlogistics.com.sg</a>.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: TERMS & CONDITIONS */}
          {activeType === 'terms' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <p className="text-xs text-slate-500 font-medium">Jurisdiction: Republic of Singapore &bull; Effective: 1 November 2026</p>
                <p className="mt-1 text-slate-700">
                  These Terms &amp; Conditions govern freight coordination, quotation requests, and trade documentation support provided by Josan Logistics Pte. Ltd.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">1. Scope of Services</h3>
                <p>
                  Josan Logistics operates as a commercial freight coordinator in Singapore. We coordinate commercial road transportation through verified transport partner carriers and assist shippers with Air Waybill (AWB) and cargo documentation. We do not directly operate an airline fleet or motor vehicle fleet, nor do we act as a customs broker or clearance agent.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">2. Shipper Obligations &amp; Packaging</h3>
                <p>
                  The Shipper warrants that all cargo specifications (dimensions, weights, commodity descriptions) are accurate. Consignments must be packaged, cushioned, strapped, and labeled to endure commercial road and air transport. The Shipper must ensure safe loading access and personnel during collection. Standard loading allowance is 45 minutes; detention beyond this allowance may incur waiting fees.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">3. Restricted &amp; Prohibited Cargo</h3>
                <p>
                  Illegal contraband, narcotics, undeclared hazardous chemicals, firearms, explosives, and prohibited goods under Singapore law or international aviation rules are strictly barred. Dangerous goods must be declared with valid Safety Data Sheets (SDS) prior to quotation. Josan Logistics reserves the right to inspect packages and reject non-compliant cargo.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">4. Charges, GST &amp; Customs Responsibility</h3>
                <p>
                  Quotations are valid for 14 days and subject to physical verification of scale and volumetric weight. Singapore GST (9%) applies to domestic services. The Customer remains the legal declarant responsible for Singapore Customs TradeNet permits, import/export duties, tariffs, and customs fees.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">5. Limitation of Liability &amp; Force Majeure</h3>
                <p>
                  Carriage liability is limited to statutory road carriage limits or the Warsaw/Montreal Conventions for air freight. Josan Logistics does not provide automatic full-value cargo insurance; shippers are advised to secure Marine Cargo Insurance. Josan Logistics is not liable for consequential loss or delays caused by severe monsoons, road closures, customs inspections, port congestion, or force majeure events.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">6. Claims &amp; Governing Law</h3>
                <p>
                  Visible damage must be noted on the electronic Proof of Delivery (e-POD) at handover. Written claim notice must be submitted within 48 hours (7 days for concealed damage). These Terms are governed by the laws of the Republic of Singapore, subject to the exclusive jurisdiction of Singapore Courts.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: SHIPPING POLICY */}
          {activeType === 'shipping' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <p className="text-xs text-slate-500 font-medium">Scope: Singapore Operations &bull; Effective: 1 November 2026</p>
                <p className="mt-1 text-slate-700">
                  Operational guidelines governing shipment bookings, collections, road transit, tracking, and trade documentation support.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">1. Booking Processing &amp; Tracking Identifiers</h3>
                <p>
                  Bookings are reviewed during operational hours (Monday–Friday 9:00 AM – 6:00 PM, Saturday 9:00 AM – 1:00 PM SGT). Each shipment receives an official reference: <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">JOS-XXXXX</code> for road freight or <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">AWS-XXXXX</code> for air documentation.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">2. Collection Across Singapore Hubs</h3>
                <p>
                  We coordinate pickups across Jurong Industrial Estate, Tuas, Changi Logistics Park, ALPS, Changi Airfreight Centre, and commercial premises. Shippers must have cargo packed, labeled, and accessible at designated loading bays with an on-site contact person.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">3. Transit Timelines &amp; Realistic Schedules</h3>
                <p>
                  Standard domestic road freight is scheduled for next-business-day delivery following collection. Same-day transport is available on request. Timelines are operational estimates provided in good faith; we do not provide guaranteed time-critical warranties due to traffic, weather, and terminal queueing.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">4. Tracking &amp; Milestone Logs</h3>
                <p>
                  Milestones (Request received, Carrier booked, In transit, Delivered) are entered into our tracking portal by our operations staff with clear "Last Updated" timestamps.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">5. Delivery Handover &amp; Proof of Delivery (e-POD)</h3>
                <p>
                  Goods are delivered against electronic Proof of Delivery (e-POD) signatures. Unsuccessful deliveries resulting from closed recipient premises or refusal will be held securely, with re-delivery arranged subject to standard haulage charges.
                </p>
              </section>
            </div>
          )}

          {/* TAB 4: REFUND & CANCELLATION */}
          {activeType === 'refund' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <p className="text-xs text-slate-500 font-medium">Scope: Financial &amp; Commercial Terms &bull; Effective: 1 November 2026</p>
                <p className="mt-1 text-slate-700">
                  Rules and procedures governing booking cancellations, abortive haulage charges, billing adjustments, and refund disbursements.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">1. Cancellation Before Vehicle Dispatch</h3>
                <p>
                  Bookings cancelled in writing before an appointed carrier vehicle has departed for collection, and before trade documentation drafting has commenced, are refunded in full, minus non-recoverable payment processing transaction fees.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">2. Cancellation After Vehicle Dispatch (Abortive Haulage)</h3>
                <p>
                  If cancellation is requested after a carrier vehicle has been dispatched or arrived on-site, an abortive haulage charge applies to cover the partner carrier's incurred vehicle and transit expenses. Any remaining advance freight balance is refunded.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">3. In-Transit Consignments &amp; Documentation</h3>
                <p>
                  Once cargo is loaded onto a vehicle or lodged with an airline, the shipment is in active transit and cannot be cancelled without full freight charges plus return haulage fees. Completed Air Waybill and documentation support fees are non-refundable once drafted.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">4. Duplicate Payments &amp; Billing Errors</h3>
                <p>
                  Duplicate payments or clerical billing errors are refunded or credited immediately upon verification by our finance department.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">5. How to Submit a Refund Request</h3>
                <p>
                  Submit requests via email to <a href="mailto:billing@josanlogistics.com.sg" className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">billing@josanlogistics.com.sg</a> quoting your shipment reference (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">JOS-XXXXX</code> or <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">AWS-XXXXX</code>) and invoice number. Approved refunds are credited to the original corporate bank account within 7 to 14 business days.
                </p>
              </section>
            </div>
          )}

          {/* Contact Details in Dialog */}
          <div className="pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-1 bg-slate-50 p-4 rounded-xl">
            <p className="font-semibold text-slate-900">{COMPANY_INFO.name} &bull; UEN: {COMPANY_INFO.uen}</p>
            <p>Registered Office: {siteSettings?.registered_office || COMPANY_INFO.address}</p>
            <p>
              General Enquiries: <a href="mailto:contact@josanlogistics.com.sg" className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">contact@josanlogistics.com.sg</a> &bull;{' '}
              Billing: <a href="mailto:billing@josanlogistics.com.sg" className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">billing@josanlogistics.com.sg</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
