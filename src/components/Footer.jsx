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

export const Footer = ({ setActiveTab }) => {
  const { showToast, currentUser, resetShipmentScope, setIsAuthModalOpen, setAuthRedirectTab } = useLogistics();
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
                      <a href="tel:+6567890123" className="text-white font-extrabold text-sm hover:text-[#F26B21] transition-colors">+65 6789 0123</a>
                    </div>
                    <a
                      href="https://wa.me/6567890123"
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
                  <span className="text-slate-200 font-medium">Head Office: 10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#B6C2D1] shrink-0" />
                  <a href="mailto:contact@josanlogistics.com.sg" className="text-slate-300 hover:text-white transition-colors font-medium">contact@josanlogistics.com.sg</a>
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
                onClick={() => {
                  if (typeof window !== 'undefined') window.location.hash = '#privacy-policy';
                  if (setActiveTab) setActiveTab('privacy-policy');
                }} 
                className="hover:text-white text-[#B6C2D1] cursor-pointer transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (typeof window !== 'undefined') window.location.hash = '#terms-of-service';
                  if (setActiveTab) setActiveTab('terms-of-service');
                }} 
                className="hover:text-white text-[#B6C2D1] cursor-pointer transition-colors"
              >
                Terms of Service
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
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Singapore PDPA Compliance Statement</span>
                    <p className="text-xs text-amber-950/90 leading-relaxed">
                      Josan Logistics Pte. Ltd. is committed to protecting corporate and personal data in strict compliance with the Singapore Personal Data Protection Act 2012 (PDPA) and international freight data security benchmarks.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">1. Information We Collect</h4>
                    <p>To provide commercial road transport, Air Waybill (AWB) preparation, and customs documentation, we collect:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                      <li><strong className="text-slate-800">Consignment Data:</strong> Shipper and consignee names, business registration numbers, delivery addresses, billing contacts, and authorized contact persons.</li>
                      <li><strong className="text-slate-800">Cargo &amp; Documentation Records:</strong> Commercial invoices, packing lists, HS commodity codes, declared customs values, and Air Waybill consignment numbers.</li>
                      <li><strong className="text-slate-800">Telematics &amp; Operational Data:</strong> GPS coordinates, route milestone timestamps, vehicle speeds, proof-of-delivery (e-POD) digital signatures, and cargo inspection records.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">2. How We Use Consignment Data</h4>
                    <p>Your data is used strictly for operational logistics fulfillment, including:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                      <li>Coordinating origin-to-destination vehicle dispatch with established transportation partners.</li>
                      <li>Generating standardized Air Waybill (AWB) paperwork and billing summaries.</li>
                      <li>Real-time shipment tracking alerts and proof-of-handover dispatch records.</li>
                      <li>Compliance with Singapore Customs (Customs Act) and statutory regulatory filings.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">3. Data Security &amp; Storage</h4>
                    <p>
                      All digital transactions, quotation requests, and CRM consignment documents are encrypted using TLS 1.3 in transit and AES-256 at rest. Access is restricted to authorized operations dispatchers and certified logistics coordinators.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">4. Data Protection Officer (DPO) Contact</h4>
                    <p>For data access requests, corrections, or inquiries regarding our data handling policies, please contact:</p>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
                      <p><strong className="text-slate-900">Data Protection Officer</strong> &bull; Josan Logistics Pte. Ltd.</p>
                      <p>10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438</p>
                      <p>Email: <a href="mailto:privacy@josanlogistics.com.sg" className="text-[#F26B21] font-semibold hover:underline">privacy@josanlogistics.com.sg</a> &bull; Hotline: +65 6789 0123</p>
                    </div>
                  </div>
                </>
              )}

              {/* 2. TERMS OF SERVICE */}
              {legalModal === 'terms' && (
                <>
                  <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">Commercial Freight Terms &amp; Conditions</span>
                    <p className="text-xs text-blue-950/90 leading-relaxed">
                      These Terms of Service govern all commercial road freight coordination, Air Waybill (AWB) processing, billing, and shipment documentation services contracted through Josan Logistics Pte. Ltd.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">1. Shipper &amp; Consignor Obligations</h4>
                    <p>The customer warrants that:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                      <li>All cargo dimensions, gross weights, volume metrics, and commodity classifications provided are complete and accurate.</li>
                      <li>Consignments are appropriately packed, labeled, and marked to withstand the standard rigors of road and multimodal air transit.</li>
                      <li>Shipments do not contain undeclared hazardous materials, restricted contraband, or illegal commodities under Singapore and international aviation regulations.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">2. Carriage Limitations &amp; Liability</h4>
                    <p>
                      Josan Logistics operates as a freight coordinator and transport operator. Unless the customer has declared a higher insured value in writing and paid applicable transit insurance premiums:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                      <li>Standard carriage liability for loss or damage is limited according to Singapore Logistics Association (SLA) standard trading conditions.</li>
                      <li>Josan Logistics shall not be liable for consequential losses, commercial loss of profits, or force majeure events (severe weather, civil unrest, border post closures).</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">3. Documentation &amp; Customs Responsibility</h4>
                    <p>
                      While Josan Logistics coordinates AWB generation and customs declaration documents, the customer remains legally and financially responsible for all duties, tariffs, fines, and compliance penalties levied by Singapore Customs or destination authorities.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">4. Demurrage &amp; Detention Standards</h4>
                    <p>
                      Standard loading and unloading windows of 45 minutes are included per commercial road consignment. Detention exceeding standard windows will be invoiced according to our established tariff schedules.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">5. Claims &amp; Discrepancy Reporting</h4>
                    <p>
                      Any visible package damage or count discrepancy must be endorsed immediately upon the electronic Proof of Delivery (e-POD). Formal claims must be submitted in writing within 48 hours of cargo handover.
                    </p>
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
                      <li><strong className="text-slate-800">Serialized Security Seals:</strong> All full-truckload (FTL) and bonded airway transfers are secured with serialized tamper-evident bolt or cable seals recorded in the digital manifest.</li>
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
