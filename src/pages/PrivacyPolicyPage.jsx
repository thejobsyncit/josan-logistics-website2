import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  Users, 
  Globe, 
  Clock, 
  UserCheck, 
  Search, 
  Bot, 
  Cookie, 
  RefreshCw,
  CheckCircle2,
  X,
  Settings
} from 'lucide-react';
import { COOKIE_AUDIT_DATA, openCookiePreferences } from '../components/CookieBanner';

export const PrivacyPolicyPage = ({ setActiveTab }) => {

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Hero */}
        <div className="bg-[#0B1F3A] text-white p-8 sm:p-12 rounded-3xl border border-[#1E3A5F] shadow-card space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold">Singapore PDPA 2012</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Josan Logistics Pte. Ltd. handles personal data in accordance with the Singapore Personal Data Protection Act 2012 (PDPA).
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Last Updated: 26 October 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-10 text-slate-700 text-sm leading-relaxed">
          
          {/* Section 1: Scope */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">1</span>
              <span>Scope &amp; Intended Audience</span>
            </h2>
            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-1">
              <p className="font-extrabold text-slate-900 text-sm">
                This website is intended for customers in Singapore.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Josan Logistics Pte. Ltd. provides shipment documentation support and commercial road transportation coordination in Singapore. Our online quote requests, customer portals, and customer communications are directed to commercial shippers and individuals located in Singapore.
              </p>
            </div>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">2</span>
              <span>Information We Collect</span>
            </h2>
            <p>
              When you submit an enquiry, request a freight quotation, or engage our logistics coordination services, we collect only the information necessary to fulfill your request:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li><strong>Contact Information:</strong> Your full name, company name, corporate or personal email address, and telephone number.</li>
              <li><strong>Quote &amp; Shipment Details:</strong> Cargo description, origin and delivery addresses, package count, cargo dimensions, weight, and preferred schedule.</li>
              <li><strong>Shipment Documentation:</strong> Air Waybill (AWB) preparation details, packing lists, commercial invoices, and customs-related documents supplied by you.</li>
              <li><strong>Technical Security Data:</strong> IP address and anti-spam verification tokens (Cloudflare Turnstile) to protect our website from automated malicious requests.</li>
            </ul>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">3</span>
              <span>How We Use Your Information</span>
            </h2>
            <p>Your information is used strictly for legitimate business and operational logistics purposes, including:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>Responding to your enquiries and preparing your freight quotation.</li>
              <li>Coordinating logistics services with our transport partners and airlines.</li>
              <li>Keeping records of our services as required by law and for our business purposes.</li>
            </ul>
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              We do not sell, rent, or trade your personal data to third parties for marketing purposes.
            </p>
          </section>

          {/* Section 4: Who We Share Data With */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">4</span>
              <span>Who We Share Data With</span>
            </h2>
            <p>
              We share your information strictly on a need-to-know basis with:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li><strong>Our transport partners and airlines:</strong> For coordinating and fulfilling your physical shipment.</li>
              <li><strong>Service providers:</strong> Such as email and hosting providers who supply our secure IT and database infrastructure.</li>
              <li><strong>Cloudflare:</strong> For spam protection and bot defense on our website forms.</li>
              <li><strong>Authorities:</strong> Government or regulatory authorities where required by Singapore law.</li>
            </ul>
          </section>

          {/* Section 5: Overseas Transfers */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">5</span>
              <span>Overseas Transfers</span>
            </h2>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <p>
                Our services and website are intended for customers in Singapore.
              </p>
              <p>
                Some service providers may process data outside Singapore (such as our email and cloud hosting infrastructure providers). Where data is processed outside Singapore, we ensure our service providers maintain a standard of data protection comparable to the Singapore Personal Data Protection Act 2012 (PDPA).
              </p>
            </div>
          </section>

          {/* Section 6: How Long We Keep Data */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">6</span>
              <span>How Long We Keep Data</span>
            </h2>
            <p>
              We keep your information only as long as necessary for business, legal, and operational purposes:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li><strong>Shipping, Invoicing &amp; Billing Records:</strong> Retained for <strong>5 years</strong> in accordance with statutory accounting and tax retention standards.</li>
              <li><strong>Enquiries and Chats:</strong> Enquiries and stored chats are deleted after <strong>30 days</strong>. Regular chats are kept only in the browser session and deleted when the session ends.</li>
            </ul>
          </section>

          {/* Section 7: Your Rights */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">7</span>
              <span>Your Rights</span>
            </h2>
            <p>
              Under the Singapore Personal Data Protection Act (PDPA), you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>Request access to your personal data that we hold.</li>
              <li>Request correction of inaccurate or outdated information.</li>
              <li>Withdraw your consent for data collection or processing at any time.</li>
              <li>Contact our Data Protection Officer (DPO).</li>
            </ul>
            <p className="text-xs text-slate-500 bg-orange-50/70 p-3 rounded-xl border border-orange-200 text-orange-950">
              <strong>Response Timeline:</strong> We aim to respond to all verified access and correction requests within <strong>30 days</strong>.
            </p>
          </section>

          {/* Section 8: JOSAN AI Chat and Track Shipment */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">8</span>
              <span>JOSAN AI Chat and Track Shipment</span>
            </h2>
            <p>Here is what our public tools collect, store, and why:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center space-x-2 text-[#F26B21] font-bold">
                  <Bot className="w-4 h-4" />
                  <span className="text-slate-900 font-extrabold">JOSAN AI Chat &amp; Quotes</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  We store the <strong>name</strong> and the <strong>description of the quote</strong> so our team can accurately calculate, formulate, and reply to your freight quotation. Chat messages are kept only in your browser session (<code className="text-orange-700 bg-orange-100/50 px-1 py-0.5 rounded">sessionStorage</code>) and deleted when the session ends, unless you submit a quote or contact request (attached to that reference number) or choose &quot;Send this chat to our team&quot;. Stored chats are deleted after <strong>30 days</strong> and are visible to admin staff only. Customers may request deletion of their chats at any time through our team or by using the chat window trash icon.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center space-x-2 text-[#F26B21] font-bold">
                  <Search className="w-4 h-4" />
                  <span className="text-slate-900 font-extrabold">Track Shipment</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Stores and looks up your tracking number or Air Waybill (AWB) code to retrieve milestone logs entered by our dispatch team. We do not profile visitors or track browsing behavior across websites.
                </p>
              </div>
            </div>
          </section>

          {/* Section 9: Cookies & Cookie Settings */}
          <section className="space-y-3" id="cookie-section">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">9</span>
                <span>Cookies</span>
              </h2>
              
              <button
                type="button"
                onClick={() => openCookiePreferences()}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-[#F26B21] text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Cookie Settings</span>
              </button>
            </div>
            
            <p>
              We use <strong>only essential cookies</strong> (login, security and chat); we do not use analytics or advertising cookies.
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

          {/* Section 10: Data Protection & Security */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">10</span>
              <span>Data Protection &amp; Security</span>
            </h2>
            <p>
              We apply technical and organizational security measures to protect your personal data against unauthorized access, collection, use, disclosure, copying, modification, or leakage. Access to personal and commercial shipment records is strictly limited to authorized personnel who require it to perform their official duties.
            </p>
          </section>

          {/* Section 11: Changes to this Policy */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">11</span>
              <span>Changes to this Policy</span>
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our legal obligations, operational procedures, or website features. When revisions occur, we will update the "Last Updated" date at the top of this page. We encourage you to review this page periodically to stay informed about how we protect your information.
            </p>
          </section>

          {/* Section 12: Data Protection Officer (DPO) Contact */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">12</span>
              <span>Data Protection Officer (DPO) Contact</span>
            </h2>
            <p>
              If you have any questions, feedback, or wish to exercise your rights of access, correction, or consent withdrawal, please contact our Data Protection Officer:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#F26B21]" />
                <p className="font-bold text-slate-900 text-sm">Data Protection Officer &bull; Josan Logistics Pte. Ltd.</p>
              </div>
              <p className="text-slate-500 font-medium">Monitored by the appointed Data Protection Officer and compliance team.</p>
              
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <p className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Email: <a href="mailto:privacy@josanlogistics.com.sg" className="text-[#F26B21] font-bold hover:underline">privacy@josanlogistics.com.sg</a></span>
                </p>
                <p className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Phone: <a href="tel:+6567890123" className="text-slate-900 font-bold hover:underline">+65 6789 0123</a></span>
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
