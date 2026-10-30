import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Calendar,
  Eye,
  Scale,
  Globe,
  RefreshCw,
  Truck,
  Download,
  Printer,
  Loader2,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  Ban
} from 'lucide-react';
import { generateLegalPdf } from '../utils/legalPdfGenerator';
import { useLogistics } from '../context/LogisticsContext';

export const TermsOfServicePage = ({ setActiveTab }) => {
  const { siteSettings } = useLogistics?.() || {};
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    try {
      setIsDownloading(true);
      generateLegalPdf('terms', siteSettings);
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
                Singapore Jurisdiction
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight pt-2">
                Terms of Service
              </h1>
            </div>

            {/* Download & Print Actions */}
            <div className="flex items-center space-x-2.5 shrink-0">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#F26B21] hover:bg-[#D95A13] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md disabled:opacity-75"
                title="Download Terms of Service as PDF"
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
            These Terms of Service govern commercial road transportation coordination, Air Waybill (AWB) preparation, billing, tracking, and shipment documentation services provided by Josan Logistics Pte. Ltd.
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
          
          {/* Section 1: Scope of Services */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">1</span>
              <span>Scope of Services</span>
            </h2>
            <p>
              Josan Logistics Pte. Ltd. operates strictly as a <strong>freight coordinator</strong>. Our services comprise commercial road transportation coordination through independent transport partners and shipment documentation support (including Air Waybill preparation for partner airlines).
            </p>
            <p className="text-slate-600">
              Transport services are performed by independent, verified road hauliers and commercial airlines appointed by us. We do not operate an airline or commercial road fleet directly, nor do we act as a customs broker or clearance agent.
            </p>
            <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-200 text-xs font-semibold text-slate-800">
              This website and our services are intended for customers in Singapore.
            </div>
          </section>

          {/* Section 2: Shipper & Consignor Obligations */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">2</span>
              <span>Shipper &amp; Consignor Obligations</span>
            </h2>
            <p>The customer warrants and agrees that:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>All cargo dimensions, gross weights, volume metrics, and commodity classifications provided to Josan Logistics are complete, accurate, and up to date.</li>
              <li>Consignments are appropriately packaged, labeled, and marked to withstand the standard handling conditions of commercial road carriage and air transit.</li>
              <li>Shipments do not contain undeclared hazardous materials, restricted contraband, dangerous goods, or commodities prohibited under Singapore and international civil aviation standards.</li>
            </ul>
          </section>

          {/* Section 3: Documentation and Customer Responsibility */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">3</span>
              <span>Documentation and Customer Responsibility</span>
            </h2>
            <p>
              We provide documentation support only. We do not provide customs clearance or act as a customs broker. While Josan Logistics assists in preparing Air Waybills, consignment notes, and trade paperwork, the customer remains legally and financially responsible for all duties, GST, tariffs, customs inspections, declarations, and penalties assessed by Singapore Customs or overseas port authorities.
            </p>
          </section>

          {/* Section 4: Quotes and Payment */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">4</span>
              <span>Quotes and Payment</span>
            </h2>
            <p className="text-slate-700 font-medium">
              Payment terms and quote validity are stated in your quote or invoice.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li><strong className="text-slate-800">Invoices:</strong> Formal commercial invoices are issued following booking confirmation and rate acceptance.</li>
              <li><strong className="text-slate-800">Singapore GST:</strong> Singapore Goods and Services Tax (GST, currently 9%) applies to domestic services where required under Singapore tax legislation.</li>
            </ul>
          </section>

          {/* Section 5: Cancellation and Changes */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">5</span>
              <span>Cancellation and Changes</span>
            </h2>
            <p className="text-slate-600">
              Booking modifications or cancellations must be communicated to Josan Logistics in writing prior to vehicle dispatch. Cancellations made after a vehicle has been dispatched or resulting in an abortive journey may be subject to cancellation charges or abortive haulage fees reflecting actual partner costs incurred.
            </p>
          </section>

          {/* Section 6: Loading, Demurrage & Detention Standards */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">6</span>
              <span>Loading, Demurrage &amp; Detention Standards</span>
            </h2>
            <p className="text-slate-600">
              A standard loading and unloading window of <strong>45 minutes</strong> is allocated per commercial road consignment. Detention time exceeding standard allowances may incur waiting fees in accordance with our tariff schedules.
            </p>
          </section>

          {/* Section 7: Tracking Information */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">7</span>
              <span>Tracking Information</span>
            </h2>
            <p className="text-slate-600">
              Shipment progress updates displayed on our Track Shipment page are entered and updated by our operations dispatch team and are indicative only. Milestone timestamps reflect reported telematics and manual operational logs. For current status, always refer to the "Last updated" time displayed on the tracking screen. Josan Logistics is not liable for minor display latencies or partner telematics transmission delays.
            </p>
          </section>

          {/* Section 8: Limit of Liability */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">8</span>
              <span>Limit of Liability</span>
            </h2>
            <p className="text-slate-600">
              Josan Logistics operates as a freight coordinator. Transport services are performed by independent transport partners and airlines appointed by us:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>Standard carriage liability for cargo loss or damage is limited in accordance with applicable statutory freight carriage regulations and conventions.</li>
              <li>Cargo insurance is not included unless arranged in writing before dispatch.</li>
              <li>Josan Logistics shall not be liable for consequential loss, indirect commercial damages, loss of business profits, loss of opportunity, or delays caused by force majeure events.</li>
            </ul>
          </section>

          {/* Section 9: Claims & Discrepancy Reporting */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">9</span>
              <span>Claims &amp; Discrepancy Reporting</span>
            </h2>
            <p className="text-slate-600">
              Any visible package damage, seal tampering, or piece count discrepancy must be endorsed immediately upon the electronic Proof of Delivery (e-POD). Formal claims must be submitted in writing within <strong>48 hours</strong> of consignment delivery.
            </p>
          </section>

          {/* Section 10: Use of the Website */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">10</span>
              <span>Use of the Website</span>
            </h2>
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
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">11</span>
              <span>Governing Law &amp; Jurisdiction</span>
            </h2>
            <p className="text-slate-600">
              These Terms of Service are governed by and construed in accordance with the laws of the Republic of Singapore. Any disputes arising in connection with our services shall be subject to the exclusive jurisdiction of the Courts of Singapore.
            </p>
          </section>

          {/* =================================================================== */}
          {/* ADDITIONAL TERMS AND CONDITIONS (SECTIONS 12 TO 20)                 */}
          {/* =================================================================== */}

          {/* Section 12: Force Majeure */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">12</span>
              <span>Force Majeure</span>
            </h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700">
              <p>
                Neither party shall be held liable for any delay, interruption, or failure to perform its obligations under these Terms where such delay or failure results from events beyond its reasonable control. Such events may include natural disasters, floods, earthquakes, extreme weather conditions, fires, epidemics, pandemics, strikes, civil unrest, war, acts of terrorism, government restrictions, transport disruptions, or other unforeseen circumstances.
              </p>
              <p>
                The affected party shall notify the other party as soon as reasonably practicable and take reasonable steps to minimize the impact of such events. Any affected obligations shall be suspended for the duration of the event to the extent permitted by applicable law.
              </p>
            </div>
          </section>

          {/* Section 13: Additional Charges and Surcharges */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">13</span>
              <span>Additional Charges and Surcharges</span>
            </h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700">
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
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">14</span>
              <span>Failed Delivery and Return Shipments</span>
            </h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700">
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
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">15</span>
              <span>Prohibited Goods and Regulatory Compliance</span>
            </h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700">
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
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">16</span>
              <span>Data Privacy and Confidentiality</span>
            </h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700">
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
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">17</span>
              <span>Third-Party Service Providers</span>
            </h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700">
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
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">18</span>
              <span>Suspension or Termination of Services</span>
            </h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700">
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
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">19</span>
              <span>Amendments to Terms</span>
            </h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700">
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
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">20</span>
              <span>Severability and Entire Agreement</span>
            </h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700">
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

          {/* Contact & Office Information */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700">
            <p className="font-extrabold text-slate-900 text-sm">Commercial Enquiries &bull; {siteSettings?.company_name || 'Josan Logistics Pte. Ltd.'}</p>
            <p className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Registered Office: {siteSettings?.registered_office || '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438'}</span>
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
