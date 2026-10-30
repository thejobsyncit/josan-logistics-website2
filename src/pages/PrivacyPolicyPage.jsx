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
  Download,
  Printer,
  Loader2,
  Settings,
  Scale,
  Shield,
  FileText,
  AlertCircle
} from 'lucide-react';
import { COOKIE_AUDIT_DATA, openCookiePreferences } from '../components/CookieBanner';
import { generateLegalPdf } from '../utils/legalPdfGenerator';
import { useLogistics } from '../context/LogisticsContext';

export const PrivacyPolicyPage = ({ setActiveTab }) => {
  const { siteSettings } = useLogistics?.() || {};
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    try {
      setIsDownloading(true);
      generateLegalPdf('privacy', siteSettings);
    } catch (err) {
      console.error('PDF error:', err);
      window.print();
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Hero */}
        <div className="bg-[#0B1F3A] text-white p-8 sm:p-12 rounded-3xl border border-[#1E3A5F] shadow-card space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                Singapore PDPA 2012 Compliance
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight pt-2">
                Privacy Policy
              </h1>
            </div>

            {/* Download & Print Actions */}
            <div className="flex items-center space-x-2.5 shrink-0">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#F26B21] hover:bg-[#D95A13] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md disabled:opacity-75"
                title="Download Privacy Policy as PDF"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                title="Print Document"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Josan Logistics Pte. Ltd. handles personal data in accordance with the Singapore Personal Data Protection Act 2012 (PDPA).
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
            <span className="bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded border border-orange-500/30 font-semibold">
              Effective Date: 29 October 2026
            </span>
            <span>Last Updated: 29 October 2026</span>
          </div>
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

          {/* Section 4: Third-Party Service Providers Policy */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">4</span>
              <span>Third-Party Service Providers Policy</span>
            </h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <p>
                Josan Logistics Pte. Ltd. may share personal data with authorised third-party service providers, including transport partners, airlines, freight handlers, cloud hosting providers, email service providers, and technology vendors, where necessary to deliver our services.
              </p>
              <p className="text-xs text-slate-600">
                We take reasonable steps to ensure that these providers protect personal data, maintain confidentiality, and process information only for authorised purposes and in accordance with applicable data protection laws.
              </p>
            </div>
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

          {/* Section 6: Data Retention and Secure Deletion Policy */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">6</span>
              <span>Data Retention and Secure Deletion Policy</span>
            </h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <p>
                Josan Logistics Pte. Ltd. retains personal data only for as long as necessary to fulfil business purposes, provide logistics services, comply with legal and regulatory obligations, and resolve disputes.
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600 text-xs">
                <li><strong>Commercial &amp; Financial Records:</strong> Certain commercial, tax, and accounting records may be retained for <strong>five to seven years</strong>, where applicable.</li>
                <li><strong>Enquiries &amp; Chatbot Logs:</strong> Website enquiries and chatbot logs may be deleted after <strong>30 days</strong> where they are no longer required.</li>
                <li><strong>Secure Disposal:</strong> When data is no longer needed, we take reasonable steps to securely delete, anonymise, or dispose of it, subject to applicable legal requirements.</li>
              </ul>
            </div>
          </section>

          {/* Section 7: Consent and Communication Preferences */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">7</span>
              <span>Consent and Communication Preferences</span>
            </h2>
            <p>
              Josan Logistics Pte. Ltd. collects, uses, and discloses personal data in accordance with applicable data protection laws. Where consent is required, we will obtain it before processing personal data for the relevant purpose.
            </p>
            <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200 text-xs space-y-2 text-slate-700">
              <p>
                <strong>Withdrawal of Consent:</strong> Individuals may withdraw their consent by contacting our Data Protection Officer, subject to legal and contractual restrictions.
              </p>
              <p>
                <strong>Essential Communications:</strong> We may continue to send essential service-related communications, including shipment updates, booking confirmations, and legal notices, where necessary.
              </p>
            </div>
          </section>

          {/* Section 8: Children's Privacy Policy */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">8</span>
              <span>Children's Privacy Policy</span>
            </h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <p>
                The Josan Logistics website and services are primarily intended for businesses and adults arranging logistics and freight services. We do not knowingly collect personal data from children unless necessary for a legitimate and lawful service-related purpose.
              </p>
              <p className="text-slate-600">
                Any such information will be handled in accordance with applicable laws. If you believe that a child has provided personal data to us inappropriately, contact our Data Protection Officer so that we can review the matter and take appropriate action.
              </p>
            </div>
          </section>

          {/* Section 9: Do Not Track and Cookie Preferences */}
          <section className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">9</span>
                <span>Do Not Track and Cookie Preferences</span>
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
              Our website may use cookies and similar technologies to support website functionality, security, and user preferences. Where analytics or other non-essential cookies are used, relevant information and available choices will be provided through the website or an appropriate cookie notice.
            </p>
            <p className="text-xs text-slate-600">
              Users may manage or disable cookies through their browser settings, although some website features may not function properly as a result. We will handle tracking preferences in accordance with applicable laws and the technologies actually implemented on our website.
            </p>
          </section>

          {/* Section 10: JOSAN AI Chat and Track Shipment */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">10</span>
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

          {/* Section 11: Inventory of Cookies & Storage Items in Use */}
          <section className="space-y-3" id="cookie-section">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">11</span>
              <span>Inventory of Cookies &amp; Storage Items in Use</span>
            </h2>
            
            <p className="text-xs text-slate-600">
              We use <strong>only essential cookies</strong> (login, security and chat); we do not use third-party marketing or cross-site tracking cookies.
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

          {/* Section 12: Data Protection & Security */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">12</span>
              <span>Data Protection &amp; Security</span>
            </h2>
            <p>
              We apply technical and organizational security measures to protect your personal data against unauthorized access, collection, use, disclosure, copying, modification, or leakage. Access to personal and commercial shipment records is strictly limited to authorized personnel who require it to perform their official duties.
            </p>
          </section>

          {/* Section 13: Policy Updates and Effective Date */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">13</span>
              <span>Policy Updates and Effective Date</span>
            </h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
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
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">14</span>
              <span>Complaints and Dispute Resolution</span>
            </h2>
            <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200 space-y-2 text-xs text-slate-700">
              <p>
                Individuals who have questions, concerns, or complaints regarding the collection, use, disclosure, or protection of their personal data may contact our Data Protection Officer. We will review complaints, investigate relevant circumstances, and take appropriate corrective action where necessary.
              </p>
              <p>
                We aim to respond within the timeframe required by applicable law. If a complaint cannot be resolved directly, individuals may refer the matter to the relevant Singapore authority, including the <strong>Personal Data Protection Commission (PDPC)</strong>, where appropriate.
              </p>
            </div>
          </section>

          {/* Section 15: Data Protection Officer (DPO) Contact Details */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">15</span>
              <span>Data Protection Officer Contact Details</span>
            </h2>
            <p>
              Individuals who have questions, concerns, or wish to exercise their data rights may contact our appointed Data Protection Officer:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#F26B21]" />
                <p className="font-extrabold text-slate-900 text-sm">Josan Logistics Pte. Ltd. &bull; Data Protection Officer</p>
              </div>
              <p className="text-slate-500 font-medium">Overseeing PDPA compliance, data subject rights, and security policies.</p>
              
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <p className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span><strong>Address:</strong> {siteSettings?.registered_office || '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438'}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <span><strong>Email:</strong> <a href={`mailto:${siteSettings?.contact_email || 'contact@josanlogistics.com.sg'}`} className="text-[#F26B21] font-bold hover:underline">{siteSettings?.contact_email || 'contact@josanlogistics.com.sg'}</a></span>
                </p>
                <p className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <span><strong>Telephone:</strong> <a href={`tel:${(siteSettings?.phone || '+65 6789 0123').replace(/\s+/g, '')}`} className="text-slate-900 font-bold hover:underline">{siteSettings?.phone || '+65 6789 0123'}</a></span>
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
