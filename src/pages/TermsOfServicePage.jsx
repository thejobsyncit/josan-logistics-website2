import React from 'react';
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
  Truck
} from 'lucide-react';

export const TermsOfServicePage = ({ setActiveTab }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Hero */}
        <div className="bg-[#0B1F3A] text-white p-8 sm:p-12 rounded-3xl border border-[#1E3A5F] shadow-card space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold">Singapore Jurisdiction</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            These Terms of Service govern commercial road transportation coordination, Air Waybill (AWB) preparation, billing, tracking, and shipment documentation services provided by Josan Logistics Pte. Ltd.
          </p>
          <p className="text-xs text-slate-400">
            Last Updated: 26 October 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          
          {/* Section 1: Scope of Services */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">1</span>
              <span>Scope of Services</span>
            </h2>
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
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">2</span>
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
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">3</span>
              <span>Documentation and Customer Responsibility</span>
            </h2>
            <p>
              We provide documentation support only. We do not provide customs clearance or act as a customs broker. While Josan Logistics assists in preparing Air Waybills, consignment notes, and trade paperwork, the customer remains legally and financially responsible for all duties, GST, tariffs, customs inspections, declarations, and penalties assessed by Singapore Customs or overseas port authorities.
            </p>
          </section>

          {/* Section 4: Quotes and Payment */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">4</span>
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
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">5</span>
              <span>Cancellation and Changes</span>
            </h2>
            <p className="text-slate-600">
              Booking modifications or cancellations must be communicated to Josan Logistics in writing prior to vehicle dispatch. Cancellations made after a vehicle has been dispatched or resulting in an abortive journey may be subject to cancellation charges or abortive haulage fees reflecting actual partner costs incurred <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">[LAWYER]</span>.
            </p>
          </section>

          {/* Section 6: Loading, Demurrage & Detention Standards */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">6</span>
              <span>Loading, Demurrage &amp; Detention Standards</span>
            </h2>
            <p className="text-slate-600">
              A standard loading and unloading window of <strong>45 minutes</strong> is allocated per commercial road consignment. Detention time exceeding standard allowances may incur waiting fees in accordance with our tariff schedules <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">[LAWYER]</span>.
            </p>
          </section>

          {/* Section 7: Tracking Information */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">7</span>
              <span>Tracking Information</span>
            </h2>
            <p className="text-slate-600">
              Shipment progress updates displayed on our Track Shipment page are entered and updated by our operations dispatch team and are indicative only. Milestone timestamps reflect reported telematics and manual operational logs. For current status, always refer to the "Last updated" time displayed on the tracking screen. Josan Logistics is not liable for minor display latencies or partner telematics transmission delays.
            </p>
          </section>

          {/* Section 8: Limit of Liability */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">8</span>
              <span>Limit of Liability <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">[LAWYER TO CONFIRM]</span></span>
            </h2>
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
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">9</span>
              <span>Claims &amp; Discrepancy Reporting</span>
            </h2>
            <p className="text-slate-600">
              Any visible package damage, seal tampering, or piece count discrepancy must be endorsed immediately upon the electronic Proof of Delivery (e-POD). Formal claims must be submitted in writing within <strong>48 hours</strong> of consignment delivery <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">[LAWYER]</span>.
            </p>
          </section>

          {/* Section 10: Use of the Website */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">10</span>
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

          {/* Section 11: Changes to These Terms */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">11</span>
              <span>Changes to These Terms</span>
            </h2>
            <p className="text-slate-600">
              We reserve the right to revise these Terms of Service periodically to reflect operational, commercial, or legal developments. When changes are published, the "Last Updated" date at the top of this page will be updated accordingly. Continued use of our logistics services or digital platforms after revised terms are posted constitutes acceptance of those revisions.
            </p>
          </section>

          {/* Section 12: Governing Law & Jurisdiction */}
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#F26B21] text-xs font-black flex items-center justify-center shrink-0">12</span>
              <span>Governing Law &amp; Jurisdiction</span>
            </h2>
            <p className="text-slate-600">
              These Terms of Service are governed by and construed in accordance with the laws of the Republic of Singapore. Any disputes arising in connection with our services shall be subject to the exclusive jurisdiction of the Singapore courts <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">[LAWYER]</span>.
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
