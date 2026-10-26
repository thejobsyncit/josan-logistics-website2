import React from 'react';
import { ShieldCheck, Lock, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage = ({ setActiveTab }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Back Button */}
        {setActiveTab && (
          <button
            onClick={() => setActiveTab('contact')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#FF6B00] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Contact Page</span>
          </button>
        )}

        {/* Header Hero */}
        <div className="bg-[#0B1F3A] text-white p-8 sm:p-12 rounded-3xl border border-[#1E3A5F] shadow-card space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Legal Compliance
            </span>
            <span className="text-xs text-slate-400">Singapore PDPA 2012</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Josan Logistics Pte. Ltd. is committed to protecting corporate and personal data in strict compliance with the Singapore Personal Data Protection Act 2012 (PDPA) and international freight data security benchmarks.
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
              <span>Information We Collect</span>
            </h2>
            <p>
              When you submit an enquiry, request a freight quotation, or engage our logistics services, we collect information necessary to fulfill your request:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li><strong>Contact Information:</strong> Full name, company name, corporate or personal email address, and contact telephone number.</li>
              <li><strong>Enquiry &amp; Consignment Data:</strong> Cargo descriptions, origin and destination points, shipment weight, special handling instructions, and tracking identifiers.</li>
              <li><strong>Documentation Records:</strong> Air Waybill (AWB) preparation paperwork, commercial invoices, and customs documentation where applicable.</li>
              <li><strong>Technical Data:</strong> IP address and anti-spam verification tokens (Cloudflare Turnstile) to protect our website from malicious automated submissions.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B00] text-xs font-black flex items-center justify-center shrink-0">2</span>
              <span>How We Use Your Information</span>
            </h2>
            <p>Your information is used strictly for legitimate business and operational logistics purposes, including:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>Responding to your specific enquiries, questions, or support requests.</li>
              <li>Preparing accurate freight quotes and commercial transportation proposals.</li>
              <li>Coordinating logistics services with verified road transport partners and air cargo handlers.</li>
              <li>Maintaining operational records in compliance with Singapore regulatory requirements.</li>
            </ul>
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              We do not sell, rent, or trade your personal data to third parties for marketing purposes.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B00] text-xs font-black flex items-center justify-center shrink-0">3</span>
              <span>Data Protection &amp; Security</span>
            </h2>
            <p>
              We apply technical and organizational security measures to protect your personal data against unauthorized access, collection, use, disclosure, copying, modification, or leakage. Digital communications and stored records are encrypted using industry-standard protocols (TLS in transit and AES-256 at rest).
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B00] text-xs font-black flex items-center justify-center shrink-0">4</span>
              <span>Data Protection Officer (DPO) Contact</span>
            </h2>
            <p>
              If you have any questions, feedback, or wish to access or correct your personal data, please contact our Data Protection Officer:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <p className="font-bold text-slate-900 text-sm">Data Protection Officer &bull; Josan Logistics Pte. Ltd.</p>
              <p className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Email: <a href="mailto:privacy@josanlogistics.com.sg" className="text-orange-600 font-bold hover:underline">privacy@josanlogistics.com.sg</a></span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Phone: <a href="tel:+6567890123" className="text-slate-900 font-bold hover:underline">+65 6789 0123</a></span>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
