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
  const [emailInput, setEmailInput] = useState('');
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | 'sla' | null

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      showToast('Thank you for subscribing to Josan Logistics newsletter!');
      setEmailInput('');
    }
  };

  const quickLinks = currentUser 
    ? ['Home', 'About Us', 'Services', 'Track Shipment', 'Book Shipment', 'Contact Us']
    : ['Home', 'About Us', 'Services', 'Track Shipment', 'Book Shipment', 'Contact Us'];

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
                Singapore's premier express road haulage network and interstate highway linehaul. Dedicated fleet telematics, tamper-evident transit security, and guaranteed SLA freight handling.
              </p>
              <div className="flex items-center space-x-2 text-xs text-slate-200 font-semibold bg-[#132A4A] border border-[#1E3A5F] px-3 py-2 rounded-xl w-fit">
                <ShieldCheck className="w-4 h-4 text-[#B6C2D1] shrink-0" />
                <span>Certified Road Logistics Coordinator &bull; ISO-9001 Quality Operations</span>
              </div>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#B6C2D1] bg-[#132A4A] px-3 py-1.5 rounded-lg border border-[#1E3A5F]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>24/7 Road Dispatch & Telematics Monitoring</span>
                </span>
              </div>
            </div>

            {/* Quick Links (Clean without arrows) */}
            <div>
              <h4 className="text-white text-base font-bold mb-4 font-sans border-b border-[#1E3A5F] pb-2">Quick Navigation</h4>
              <ul className="space-y-2.5 text-sm">
                {quickLinks.map((item) => {
                  const tabId = item.toLowerCase().replace(' ', '').replace('us', '');
                  return (
                    <li key={item}>
                      <button
                        onClick={() => {
                          if (tabId === 'bookshipment') {
                            if (!currentUser) {
                              if (setAuthRedirectTab) setAuthRedirectTab('book');
                              setIsAuthModalOpen(true);
                              if (showToast) showToast('Please sign in or create an account to book a shipment.', 'warning');
                              return;
                            }
                            resetShipmentScope();
                            setActiveTab('book');
                          } else if (tabId === 'trackshipment') {
                            if (!currentUser) {
                              if (setAuthRedirectTab) setAuthRedirectTab('track');
                              setIsAuthModalOpen(true);
                              if (showToast) showToast('Please sign in to track road shipments.', 'warning');
                              return;
                            }
                            setActiveTab('track');
                          } else {
                            setActiveTab(tabId);
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
              <ul className="space-y-2.5 text-sm text-[#B6C2D1]">
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('road-freight')}>Commercial Road Transportation</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('air-freight')}>Airway Services &amp; AWB Support</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('customs-clearance')}>Shipment &amp; Customs Documentation</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('airway-request')}>Request Airway Service</li>
              </ul>
            </div>

            {/* 24/7 Global Dispatch & Contact Info */}
            <div>
              <div className="border-b border-[#1E3A5F] pb-3 mb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-white text-base font-extrabold font-sans">Singapore HQ & Dispatch</h4>
                  <span className="inline-flex items-center space-x-1.5 text-[11px] font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40 shrink-0 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 absolute"></span>
                    <span className="ml-3 font-mono">24/7 LIVE</span>
                  </span>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-300 mb-4">
                <div className="bg-[#132A4A] p-3 rounded-xl border border-[#1E3A5F] space-y-1">
                  <p className="text-[10px] text-[#B6C2D1] font-bold uppercase tracking-wider">Singapore Dispatch Hotline</p>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-[#B6C2D1] shrink-0" />
                    <a href="tel:+6567890123" className="text-white font-extrabold text-sm hover:text-white transition-colors">+65 6789 0123</a>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-1">
                  <MapPin className="w-4 h-4 text-[#B6C2D1] shrink-0 mt-0.5" />
                  <span className="text-slate-200 font-medium">Regional HQ: 10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#B6C2D1] shrink-0" />
                  <a href="mailto:contact@josanlogistics.com.sg" className="text-slate-300 hover:text-white transition-colors font-medium">contact@josanlogistics.com.sg</a>
                </div>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Subscribe for Freight Updates</label>
                <div className="flex">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter corporate email..."
                    className="w-full px-3 py-2 bg-[#132A4A] border border-[#1E3A5F] rounded-l-lg text-xs text-white focus:outline-none focus:border-[#F26B21] placeholder:text-slate-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-r-lg font-bold text-xs transition-colors shrink-0 shadow-sm cursor-pointer"
                  >
                    Join
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Bottom copyright and legal modal triggers */}
          <div className="pt-8 border-t border-[#1E3A5F] flex flex-col sm:flex-row items-center justify-between text-xs text-[#B6C2D1] font-medium">
            <p>© {new Date().getFullYear()} Josan Logistics Pte. Ltd. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-0">
              <button 
                type="button" 
                onClick={() => setLegalModal('privacy')} 
                className="hover:text-white text-[#B6C2D1] cursor-pointer transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                type="button" 
                onClick={() => setLegalModal('terms')} 
                className="hover:text-white text-[#B6C2D1] cursor-pointer transition-colors"
              >
                Terms of Service
              </button>
              <button 
                type="button" 
                onClick={() => setLegalModal('sla')} 
                className="hover:text-white text-[#B6C2D1] cursor-pointer transition-colors"
              >
                Security SLAs
              </button>
              <a href="/crm" className="hover:text-white cursor-pointer text-[#B6C2D1] hover:underline transition-colors">CRM Portal</a>
              <a href="/admin" className="hover:text-white cursor-pointer text-[#B6C2D1] hover:underline transition-colors">Admin Portal</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* JOSAN LOGISTICS LEGAL & COMPLIANCE MODAL                                  */}
      {/* ========================================================================= */}
      {legalModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setLegalModal(null)}
        >
          <div 
            className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#1E3A5F] flex items-center justify-between bg-[#132A4A]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  {legalModal === 'privacy' && <Lock className="w-5 h-5" />}
                  {legalModal === 'terms' && <FileText className="w-5 h-5" />}
                  {legalModal === 'sla' && <Activity className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-white text-lg sm:text-xl font-bold font-heading">
                    {legalModal === 'privacy' && 'Privacy Policy'}
                    {legalModal === 'terms' && 'Terms of Service'}
                    {legalModal === 'sla' && 'Security SLAs & Transit Standards'}
                  </h3>
                  <p className="text-xs text-[#B6C2D1]">
                    Josan Logistics Pte. Ltd. &bull; Singapore
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Selector */}
            <div className="flex border-b border-slate-800 bg-slate-900/60 px-5 pt-3 gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setLegalModal('privacy')}
                className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  legalModal === 'privacy'
                    ? 'border-[#FF6B00] text-[#FF6B00]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Privacy Policy (PDPA)
              </button>
              <button
                type="button"
                onClick={() => setLegalModal('terms')}
                className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  legalModal === 'terms'
                    ? 'border-[#FF6B00] text-[#FF6B00]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => setLegalModal('sla')}
                className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  legalModal === 'sla'
                    ? 'border-[#FF6B00] text-[#FF6B00]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Security SLAs (24/7)
              </button>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div className="p-5 sm:p-7 overflow-y-auto text-slate-300 text-xs sm:text-sm leading-relaxed space-y-5">
              
              {/* 1. PRIVACY POLICY */}
              {legalModal === 'privacy' && (
                <>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Singapore PDPA Compliance Statement</span>
                    <p className="text-xs text-slate-300">
                      Josan Logistics Pte. Ltd. is committed to protecting corporate and personal data in strict compliance with the Singapore Personal Data Protection Act 2012 (PDPA) and international freight data security benchmarks.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm sm:text-base">1. Information We Collect</h4>
                    <p>To provide commercial road transport, Air Waybill (AWB) preparation, and customs documentation, we collect:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                      <li><strong className="text-slate-200">Consignment Data:</strong> Shipper and consignee names, business registration numbers, delivery addresses, billing contacts, and authorized contact persons.</li>
                      <li><strong className="text-slate-200">Cargo &amp; Documentation Records:</strong> Commercial invoices, packing lists, HS commodity codes, declared customs values, and Air Waybill consignment numbers.</li>
                      <li><strong className="text-slate-200">Telematics &amp; Operational Data:</strong> GPS coordinates, route milestone timestamps, vehicle speeds, proof-of-delivery (e-POD) digital signatures, and cargo inspection records.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm sm:text-base">2. How We Use Consignment Data</h4>
                    <p>Your data is used strictly for operational logistics fulfillment, including:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                      <li>Coordinating origin-to-destination vehicle dispatch with vetted transportation partners.</li>
                      <li>Generating standardized Air Waybill (AWB) paperwork and billing summaries.</li>
                      <li>Real-time shipment tracking alerts and proof-of-handover dispatch records.</li>
                      <li>Compliance with Singapore Customs (Customs Act) and statutory regulatory filings.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm sm:text-base">3. Data Security &amp; Storage</h4>
                    <p>
                      All digital transactions, quotation requests, and CRM consignment documents are encrypted using TLS 1.3 in transit and AES-256 at rest. Access is restricted to authorized operations dispatchers and certified logistics coordinators.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm sm:text-base">4. Data Protection Officer (DPO) Contact</h4>
                    <p>For data access requests, corrections, or inquiries regarding our data handling policies, please contact:</p>
                    <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 text-xs space-y-1">
                      <p><strong className="text-white">Data Protection Officer</strong> &bull; Josan Logistics Pte. Ltd.</p>
                      <p>10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438</p>
                      <p>Email: <a href="mailto:privacy@josanlogistics.com.sg" className="text-[#FF6B00] hover:underline">privacy@josanlogistics.com.sg</a> &bull; Hotline: +65 6789 0123</p>
                    </div>
                  </div>
                </>
              )}

              {/* 2. TERMS OF SERVICE */}
              {legalModal === 'terms' && (
                <>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Commercial Freight Terms &amp; Conditions</span>
                    <p className="text-xs text-slate-300">
                      These Terms of Service govern all commercial road freight coordination, Air Waybill (AWB) processing, billing, and shipment documentation services contracted through Josan Logistics Pte. Ltd.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm sm:text-base">1. Shipper &amp; Consignor Obligations</h4>
                    <p>The customer warrants that:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                      <li>All cargo dimensions, gross weights, volume metrics, and commodity classifications provided are complete and accurate.</li>
                      <li>Consignments are appropriately packed, labeled, and marked to withstand the standard rigors of road and multimodal air transit.</li>
                      <li>Shipments do not contain undeclared hazardous materials, restricted contraband, or illegal commodities under Singapore and international aviation regulations.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm sm:text-base">2. Carriage Limitations &amp; Liability</h4>
                    <p>
                      Josan Logistics operates as a freight coordinator and transport operator. Unless the customer has declared a higher insured value in writing and paid applicable transit insurance premiums:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                      <li>Standard carriage liability for loss or damage is limited according to Singapore Logistics Association (SLA) standard trading conditions.</li>
                      <li>Josan Logistics shall not be liable for consequential losses, commercial loss of profits, or force majeure events (severe weather, civil unrest, border post closures).</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm sm:text-base">3. Documentation &amp; Customs Responsibility</h4>
                    <p>
                      While Josan Logistics coordinates AWB generation and customs declaration documents, the customer remains legally and financially responsible for all duties, tariffs, fines, and compliance penalties levied by Singapore Customs or destination authorities.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm sm:text-base">4. Demurrage &amp; Detention Standards</h4>
                    <p>
                      Standard loading and unloading windows of 45 minutes are included per commercial road consignment. Detention exceeding standard windows will be invoiced according to our established tariff schedules.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm sm:text-base">5. Claims &amp; Discrepancy Reporting</h4>
                    <p>
                      Any visible package damage or count discrepancy must be endorsed immediately upon the electronic Proof of Delivery (e-POD). Formal claims must be submitted in writing within 48 hours of cargo handover.
                    </p>
                  </div>
                </>
              )}

              {/* 3. SECURITY SLAS */}
              {legalModal === 'sla' && (
                <>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Service Level Agreement (SLA) &bull; 99.2% Dispatch Guarantee</span>
                    <p className="text-xs text-slate-300">
                      Josan Logistics delivers enterprise-grade freight reliability backed by 24/7 operations monitoring, certified logistics coordinators, and tamper-evident security frameworks.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[#FF6B00] font-black text-lg block">99.2%</span>
                      <span className="text-white font-bold text-xs block">On-Time Dispatch Guarantee</span>
                      <p className="text-[11px] text-slate-400">Scheduled pickup windows adhered to within &plusmn;15 minutes across Singapore industrial corridors.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-emerald-400 font-black text-lg block">24/7/365</span>
                      <span className="text-white font-bold text-xs block">Live Telematics Monitoring</span>
                      <p className="text-[11px] text-slate-400">Active GPS tracking, route deviation alerts, and Singapore centralized dispatch coordination.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm sm:text-base">1. Chain of Custody &amp; Tamper-Evident Transit</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                      <li><strong className="text-slate-200">Serialized Security Seals:</strong> All full-truckload (FTL) and bonded airway transfers are secured with serialized tamper-evident bolt or cable seals recorded in the digital manifest.</li>
                      <li><strong className="text-slate-200">Digital Handover Verification:</strong> Consignments require dual-party identity verification and time-stamped digital signatures upon physical delivery.</li>
                      <li><strong className="text-slate-200">Vetted Partner Operators:</strong> Third-party vehicle partners undergo rigorous background verification, vehicle roadworthiness checks, and mandatory safety compliance audits.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm sm:text-base">2. ISO-9001 Quality Operations Framework</h4>
                    <p>
                      Our road haulage and airway documentation workflows follow ISO-9001 quality management guidelines. Operational performance metrics are reviewed monthly to ensure continuous SLA compliance.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm sm:text-base">3. Incident Response &amp; Contingency Dispatch</h4>
                    <p>
                      In the event of road traffic accidents, highway bottlenecks, or mechanical breakdown, Josan activates contingency vehicle dispatch within <strong>30 minutes</strong>, coordinated directly by our Singapore 24/7 Command Desk.
                    </p>
                  </div>
                </>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#10182D] flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Official documentation &bull; Josan Logistics Pte. Ltd.
              </span>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-5 py-2 bg-[#FF6B00] hover:bg-[#E55C00] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
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
