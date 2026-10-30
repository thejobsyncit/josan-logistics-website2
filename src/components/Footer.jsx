import React, { useState } from 'react';
import { 
  Truck, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Globe, 
  Clock, 
  CheckCircle2, 
  X, 
  Shield, 
  FileText, 
  Lock, 
  Activity, 
  AlertCircle 
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { openLegalDialog } from './LegalDialog';
import { openCookiePreferences } from './CookieBanner';

export const Footer = ({ setActiveTab }) => {
  const { showToast, currentUser, resetShipmentScope, setIsAuthModalOpen, setAuthRedirectTab, websiteContent, managedServices, siteSettings } = useLogistics();
  const contactInfo = websiteContent?.contact || {};
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | 'sla' | null

  const quickLinks = ['Home', 'About Us', 'Track Shipment', 'Get a Quote', 'Contact Us'];

  return (
    <>
      <footer className="bg-[#0B1F3A] text-slate-300 pt-16 pb-8 border-t border-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            
            {/* Company Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
                <img 
                  src="/assets/josan_logo.png" 
                  alt="Josan Logistics Logo" 
                  className="h-10 w-auto object-contain" 
                />
                <div className="flex flex-col">
                  <span className="text-white font-black text-lg tracking-wider leading-none">
                    JOSAN
                  </span>
                  <span className="text-[#B6C2D1] font-bold text-[9px] tracking-widest uppercase mt-0.5">
                    LOGISTICS PTE. LTD.
                  </span>
                </div>
              </div>
              <p className="text-[#B6C2D1] text-sm leading-relaxed max-w-sm">
                Josan Logistics Pte. Ltd. provides air freight documentation support and commercial road transportation coordination in Singapore.
              </p>
            </div>

            {/* Quick Links (Clean without arrows) */}
            <div>
              <h4 className="text-white text-base font-bold mb-4 font-sans border-b border-[#1E3A5F] pb-2">Quick Navigation</h4>
              <ul className="space-y-2.5 text-sm">
                {quickLinks.map((item) => {
                  return (
                    <li key={item}>
                      <button
                        onClick={() => {
                          if (item === 'Get a Quote') {
                            if (!currentUser) {
                              if (setAuthRedirectTab) setAuthRedirectTab('quote');
                              setIsAuthModalOpen(true);
                              if (showToast) showToast('Please sign in or create an account to get an instant quote.', 'warning');
                              return;
                            }
                            setActiveTab('quote');
                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                          } else if (item === 'Track Shipment') {
                            if (!currentUser) {
                              if (setAuthRedirectTab) setAuthRedirectTab('track');
                              setIsAuthModalOpen(true);
                              if (showToast) showToast('Please sign in to track road shipments.', 'warning');
                              return;
                            }
                            setActiveTab('track');
                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                          } else if (item === 'Home') {
                            setActiveTab('home');
                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                          } else if (item === 'About Us') {
                            setActiveTab('about');
                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                          } else if (item === 'Services') {
                            setActiveTab('services');
                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                          } else if (item === 'Contact Us') {
                            setActiveTab('contact');
                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                          }
                        }}
                        className="hover:text-white transition-colors cursor-pointer text-[#B6C2D1] block"
                      >
                        {item}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white text-base font-bold mb-4 font-sans border-b border-[#1E3A5F] pb-2">Our Solutions</h4>
              <ul className="space-y-2.5 text-sm">
                {managedServices?.airway?.active !== false && (
                  <li>
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveTab('air-freight');
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white transition-colors cursor-pointer text-[#B6C2D1] block text-left"
                    >
                      Air Freight Services
                    </button>
                  </li>
                )}
                {managedServices?.road?.active !== false && (
                  <li>
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveTab('road-freight');
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white transition-colors cursor-pointer text-[#B6C2D1] block text-left"
                    >
                      Commercial Road Transportation
                    </button>
                  </li>
                )}
                {Boolean(managedServices?.documentation?.active) && (
                  <li>
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveTab('shipment-documentation-support');
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white transition-colors cursor-pointer text-[#B6C2D1] block text-left"
                    >
                      Shipment Documentation Support
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <div className="border-b border-[#1E3A5F] pb-3 mb-4">
                <h4 className="text-white text-base font-extrabold font-sans">Contact &amp; Support</h4>
              </div>
              <div className="space-y-3 text-xs text-slate-300 mb-4">
                <div className="bg-[#132A4A] p-3 rounded-xl border border-[#1E3A5F] space-y-1.5">
                  <p className="text-[10px] text-[#B6C2D1] font-bold uppercase tracking-wider">Customer Hotline</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#F26B21] shrink-0" />
                      <a href={`tel:${(contactInfo.phone || '+6567890123').replace(/\s+/g, '')}`} className="text-white font-extrabold text-sm hover:text-[#F26B21] transition-colors">
                        {contactInfo.phone || '+65 6789 0123'}
                      </a>
                    </div>
                    <a
                      href={`https://wa.me/${(contactInfo.phone || '6567890123').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-bold text-xs transition-colors"
                      title="WhatsApp Us"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-1">
                  <MapPin className="w-4 h-4 text-[#B6C2D1] shrink-0 mt-0.5" />
                  <span className="text-slate-200 font-medium">Head Office: {contactInfo.address || '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438'}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#B6C2D1] shrink-0" />
                  <a href={`mailto:${contactInfo.email || 'contact@josanlogistics.com.sg'}`} className="text-slate-300 hover:text-white transition-colors font-medium">
                    {contactInfo.email || 'contact@josanlogistics.com.sg'}
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom copyright and legal page links */}
          <div className="pt-8 border-t border-[#1E3A5F] flex flex-col sm:flex-row items-center justify-between text-xs text-[#B6C2D1] font-medium xl:pr-36">
            <p>© {new Date().getFullYear()} Josan Logistics Pte. Ltd. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-0">
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  openLegalDialog('privacy', e.currentTarget);
                }} 
                className="hover:text-white text-[#B6C2D1] cursor-pointer transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  openLegalDialog('terms', e.currentTarget);
                }} 
                className="hover:text-white text-[#B6C2D1] cursor-pointer transition-colors"
              >
                Terms of Service
              </button>
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  openCookiePreferences();
                }} 
                className="hover:text-white text-[#B6C2D1] cursor-pointer transition-colors"
                title="Manage or withdraw cookie consent"
              >
                Cookie settings
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* JOSAN LOGISTICS LEGAL & COMPLIANCE MODAL                                  */}
      {/* ========================================================================= */}
      {legalModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setLegalModal(null)}
        >
          <div 
            className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F26B21]">
                  {legalModal === 'privacy' && <Lock className="w-5 h-5" />}
                  {legalModal === 'terms' && <FileText className="w-5 h-5" />}
                  {legalModal === 'sla' && <Activity className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-slate-900 text-lg sm:text-xl font-bold font-heading">
                    {legalModal === 'privacy' && 'Privacy Policy'}
                    {legalModal === 'terms' && 'Terms of Service'}
                    {legalModal === 'sla' && 'Security SLAs & Transit Standards'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Josan Logistics Pte. Ltd. &bull; Singapore
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="w-9 h-9 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Selector */}
            <div className="flex border-b border-slate-200 bg-slate-50/60 px-5 pt-3 gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setLegalModal('privacy')}
                className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  legalModal === 'privacy'
                    ? 'border-[#F26B21] text-[#F26B21]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Privacy Policy (PDPA)
              </button>
              <button
                type="button"
                onClick={() => setLegalModal('terms')}
                className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  legalModal === 'terms'
                    ? 'border-[#F26B21] text-[#F26B21]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => setLegalModal('sla')}
                className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  legalModal === 'sla'
                    ? 'border-[#F26B21] text-[#F26B21]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Security SLAs (24/7)
              </button>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div className="p-5 sm:p-7 overflow-y-auto text-slate-600 text-xs sm:text-sm leading-relaxed space-y-5 bg-white">
              
              {/* 1. PRIVACY POLICY */}
              {legalModal === 'privacy' && (
                <>
                  <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200/80 space-y-1">
                    <p className="text-xs text-amber-950 font-bold leading-relaxed">
                      This website is intended for customers in Singapore.
                    </p>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      Josan Logistics Pte. Ltd. handles personal data in accordance with the Singapore Personal Data Protection Act 2012 (PDPA).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">1. Information We Collect</h4>
                    <p>When you request a quote or contact us, we collect:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                      <li><strong className="text-slate-800">Contact Details:</strong> Your name, company name, email address, and phone number.</li>
                      <li><strong className="text-slate-800">Quote &amp; Shipment Details:</strong> Cargo description, pickup and delivery locations, dimensions, weight, and preferred schedule.</li>
                      <li><strong className="text-slate-800">Shipment Documents:</strong> Commercial invoices, packing lists, and customs-related documents supplied by you.</li>
                      <li><strong className="text-slate-800">Security Data:</strong> IP address and anti-spam verification tokens (Cloudflare Turnstile).</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">2. How We Use Your Information</h4>
                    <p>We use your information strictly for logistics coordination, preparing quotes, fulfilling shipments with partners, and keeping statutory records. We do not sell or trade personal data.</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">3. Third-Party Service Providers Policy</h4>
                    <p>
                      Josan Logistics Pte. Ltd. may share personal data with authorised third-party service providers, including transport partners, airlines, freight handlers, cloud hosting providers, email service providers, and technology vendors, where necessary to deliver our services under strict confidentiality and PDPA compliance.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">4. Overseas Transfers</h4>
                    <p>
                      Our services are intended for customers in Singapore. Where international air freight requires processing data outside Singapore, we ensure service providers maintain comparable PDPA standards of protection.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">5. Data Retention and Secure Deletion Policy</h4>
                    <p>
                      Personal data is retained only as long as necessary. Commercial, tax, and accounting records are retained for <strong>five to seven years</strong>. Website enquiries and chatbot communication logs are deleted after <strong>30 days</strong>. Expired data is securely deleted or anonymised.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">6. Consent, Preferences &amp; Children's Privacy</h4>
                    <p>
                      Individuals may withdraw consent by contacting our DPO (essential service updates may continue where necessary). Our services are intended for adults and commercial businesses; we do not knowingly collect personal data from children.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">7. Complaints, Dispute Resolution &amp; DPO Contact</h4>
                    <p>
                      Contact our Data Protection Officer for inquiries, consent withdrawal, or complaints at <a href={`mailto:${siteSettings?.contact_email || contactInfo.email || 'contact@josanlogistics.com.sg'}`} className="text-[#F26B21] font-bold hover:underline">{siteSettings?.contact_email || contactInfo.email || 'contact@josanlogistics.com.sg'}</a> or call <strong>{siteSettings?.phone || contactInfo.phone || '+65 6789 0123'}</strong>. Address: {siteSettings?.registered_office || contactInfo.address || '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438'}. Unresolved matters may be referred to the Personal Data Protection Commission (PDPC).
                    </p>
                    <p className="text-xs text-slate-400 font-mono pt-1">Effective Date: 29 October 2026</p>
                  </div>
                </>
              )}

              {/* 2. TERMS OF SERVICE */}
              {legalModal === 'terms' && (
                <>
                  <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200/80 space-y-1">
                    <p className="text-xs text-blue-950 font-medium leading-relaxed">
                      These Terms of Service govern commercial road transportation coordination, Air Waybill (AWB) preparation, billing, tracking, and shipment documentation services provided by Josan Logistics Pte. Ltd.
                    </p>
                    <p className="text-xs text-blue-900 font-bold">
                      This website and our services are intended for customers in Singapore.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">1. Scope of Services</h4>
                    <p>
                      Josan Logistics operates strictly as a <strong>freight coordinator</strong> providing shipment documentation support and commercial road transportation coordination through independent transport partners and airlines appointed by us. We do not operate an airline or commercial road fleet directly, nor do we act as a customs broker or clearance agent.
                    </p>
                    <p className="text-slate-600 font-medium text-xs">
                      This website and our services are intended for customers in Singapore.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">2. Shipper &amp; Consignor Obligations</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                      <li>All cargo dimensions, gross weights, volume metrics, and commodity classifications provided are complete and accurate.</li>
                      <li>Consignments are appropriately packed, labeled, and marked to withstand standard road and air transit.</li>
                      <li>Shipments do not contain undeclared hazardous materials, restricted contraband, or illegal commodities under Singapore and international aviation regulations.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">3. Documentation and Customer Responsibility</h4>
                    <p>
                      We provide documentation support only. We do not provide customs clearance or act as a customs broker. While Josan Logistics coordinates AWB generation and customs declaration documents, the customer remains legally and financially responsible for all duties, tariffs, fines, and compliance penalties levied by Singapore Customs or destination authorities.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">4. Quotes and Payment</h4>
                    <p className="text-xs text-slate-700 font-medium">
                      Payment terms and quote validity are stated in your quote or invoice.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                      <li><strong>Invoices:</strong> Formal commercial invoices are issued upon quotation confirmation or booking acceptance.</li>
                      <li><strong>GST:</strong> Singapore Goods and Services Tax (GST, currently 9%) applies to domestic services where required by law.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">5. Cancellation and Changes</h4>
                    <p>
                      Booking cancellations or changes must be notified in writing prior to vehicle dispatch. Cancellations after vehicle dispatch has commenced or abortive haulage may incur cancellation fees reflecting partner costs incurred <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1 rounded ml-1">[LAWYER]</span>.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">6. Tracking Information</h4>
                    <p>
                      Shipment updates on Track Shipment are entered by our operations dispatch team and are indicative only. Milestone timestamps reflect reported telematics and operational logs; always check the "Last updated" time on the tracking screen.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">7. Limit of Liability &amp; Force Majeure</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                      <li>Standard carriage liability for loss or damage is limited according to applicable statutory freight carriage regulations and conventions.</li>
                      <li>Cargo insurance is not included unless arranged in writing before dispatch.</li>
                      <li>Neither party is liable for failure or delay caused by Force Majeure events (natural disasters, weather, epidemics, strikes, war, government restrictions).</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">8. Surcharges, Prohibited Goods &amp; Termination</h4>
                    <p>
                      Additional charges apply for weight/dimension variances, fuel, waiting time, or storage. Prohibited or hazardous goods must be fully declared or will be refused. Either party may suspend or terminate services for material breach. All terms governed by Singapore Law.
                    </p>
                    <p className="text-xs text-slate-400 font-mono pt-1">Effective Date: 29 October 2026</p>
                  </div>
                </>
              )}

              {/* 3. SECURITY SLAS */}
              {legalModal === 'sla' && (
                <>
                  <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Service Level Agreement (SLA) &bull; 99.2% Dispatch Guarantee</span>
                    <p className="text-xs text-emerald-950/90 leading-relaxed">
                      Josan Logistics delivers enterprise-grade freight reliability backed by 24/7 operations monitoring, certified logistics coordinators, and tamper-evident security frameworks.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-100 space-y-1">
                      <span className="text-[#F26B21] font-black text-lg block">99.2%</span>
                      <span className="text-slate-900 font-bold text-xs block">On-Time Dispatch Guarantee</span>
                      <p className="text-[11px] text-slate-500">Scheduled pickup windows adhered to within &plusmn;15 minutes across Singapore industrial corridors.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                      <span className="text-emerald-600 font-black text-lg block">24/7/365</span>
                      <span className="text-slate-900 font-bold text-xs block">Live Telematics Monitoring</span>
                      <p className="text-[11px] text-slate-600">Active GPS tracking, route deviation alerts, and Singapore centralized dispatch coordination.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">1. Chain of Custody &amp; Tamper-Evident Transit</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                      <li><strong className="text-slate-800">Serialized Security Seals:</strong> All full-truckload and bonded airway transfers are secured with serialized tamper-evident bolt or cable seals recorded in the digital manifest.</li>
                      <li><strong className="text-slate-800">Digital Handover Verification:</strong> Consignments require dual-party identity verification and time-stamped digital signatures upon physical delivery.</li>
                      <li><strong className="text-slate-800">Established Partner Operators:</strong> Commercial road transportation is coordinated with established partner carriers committed to vehicle roadworthiness and transit safety.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">2. ISO-9001 Quality Operations Framework</h4>
                    <p>
                      Our road haulage and air freight documentation workflows follow ISO-9001 quality management guidelines. Operational performance metrics are reviewed monthly to ensure continuous SLA compliance.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">3. Incident Response &amp; Contingency Dispatch</h4>
                    <p>
                      In the event of road traffic accidents, highway bottlenecks, or mechanical breakdown, Josan activates contingency vehicle dispatch within <strong>30 minutes</strong>, coordinated directly by our Singapore 24/7 Command Desk.
                    </p>
                  </div>
                </>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Official documentation &bull; Josan Logistics Pte. Ltd.
              </span>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-5 py-2 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
