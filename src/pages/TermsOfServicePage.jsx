import React from 'react';
import { FileText, ShieldCheck, Mail, Phone, MapPin, ArrowLeft, Clock, AlertCircle } from 'lucide-react';

export const TermsOfServicePage = ({ setActiveTab }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Back Button */}
        {setActiveTab && (
          <button
            onClick={() => setActiveTab('home')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#FF6B00] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        )}

        {/* Header Hero */}
        <div className="bg-[#0B1F3A] text-white p-8 sm:p-12 rounded-3xl border border-[#1E3A5F] shadow-card space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Commercial Freight Terms
            </span>
            <span className="text-xs text-slate-400">Singapore Jurisdiction</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            These Terms of Service govern commercial road transportation coordination, Air Waybill (AWB) preparation, billing, and shipment documentation services provided by Josan Logistics Pte. Ltd.
          </p>
          <p className="text-xs text-slate-400">
            Last Updated: 23 October 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B00] text-xs font-black flex items-center justify-center shrink-0">1</span>
              <span>Shipper &amp; Consignor Obligations</span>
            </h2>
            <p>The customer warrants and agrees that:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>All cargo dimensions, gross weights, volume metrics, and commodity classifications provided to Josan Logistics are complete, accurate, and up to date.</li>
              <li>Consignments are appropriately packaged, labeled, and marked to withstand the standard handling conditions of commercial road carriage and air transit.</li>
              <li>Shipments do not contain undeclared hazardous materials, restricted contraband, dangerous goods, or commodities prohibited under Singapore and international civil aviation standards.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B00] text-xs font-black flex items-center justify-center shrink-0">2</span>
              <span>Carriage Limitations &amp; Standard Liability</span>
            </h2>
            <p>
              Josan Logistics operates as a freight coordinator and transport operator. Unless the customer has declared a higher valuation in writing prior to dispatch and paid applicable cargo insurance premiums:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>Standard liability for loss or damage is determined in accordance with Singapore Logistics Association (SLA) standard trading conditions.</li>
              <li>Josan Logistics shall not be liable for consequential loss, indirect commercial damages, loss of business profits, or delays caused by force majeure events (severe weather, highway bottlenecks, border delays, civil disruptions).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B00] text-xs font-black flex items-center justify-center shrink-0">3</span>
              <span>Documentation &amp; Regulatory Compliance</span>
            </h2>
            <p>
              While Josan Logistics assists in preparing Air Waybills, consignment notes, and trade documentation, the customer remains legally and financially responsible for all duties, GST, tariffs, customs inspections, and penalties assessed by Singapore Customs or overseas port authorities.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B00] text-xs font-black flex items-center justify-center shrink-0">4</span>
              <span>Loading, Demurrage &amp; Detention Standards</span>
            </h2>
            <p>
              A standard loading and unloading window of <strong>45 minutes</strong> is allocated per commercial road consignment. Detention time exceeding standard allowances may incur waiting fees in accordance with our tariff schedules.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B00] text-xs font-black flex items-center justify-center shrink-0">5</span>
              <span>Claims &amp; Discrepancy Reporting</span>
            </h2>
            <p>
              Any visible package damage, seal tampering, or piece count discrepancy must be endorsed immediately upon the electronic Proof of Delivery (e-POD). Formal claims must be submitted in writing within <strong>48 hours</strong> of consignment delivery.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B00] text-xs font-black flex items-center justify-center shrink-0">6</span>
              <span>Governing Law &amp; Jurisdiction</span>
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the Republic of Singapore. Any disputes arising in connection with our services shall be subject to the exclusive jurisdiction of the Singapore courts.
            </p>
          </section>

          {/* Contact & Office Information */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
            <p className="font-bold text-slate-900 text-sm">Commercial Enquiries &bull; Josan Logistics Pte. Ltd.</p>
            <p className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Head Office: 10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Email: <a href="mailto:contact@josanlogistics.com.sg" className="text-orange-600 font-bold hover:underline">contact@josanlogistics.com.sg</a></span>
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
