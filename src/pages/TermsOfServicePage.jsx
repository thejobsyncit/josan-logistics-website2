import React from 'react';
import { LegalPageLayout } from '../components/LegalPageLayout';

export const TermsOfServicePage = ({ setActiveTab }) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 px-4 sm:px-6 lg:px-8">
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
              Transport services are performed by independent road hauliers and commercial airlines appointed by us. We do not operate an airline or commercial road fleet directly, nor do we act as a customs broker or clearance agent.
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
              Booking modifications or cancellations must be communicated to Josan Logistics in writing prior to the carrier collecting the cargo. Cancellations made after a vehicle has been sent for collection or resulting in an abortive journey may be subject to cancellation charges or abortive haulage fees reflecting actual partner costs incurred.
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
              Shipment updates are entered manually by our operations team, are indicative only, and show a Last updated time. Josan Logistics is not liable for minor delays in updates shown on the Track Shipment page.
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
              <li>Cargo insurance is not included unless arranged in writing before the carrier collects the cargo.</li>
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
              <span>Registered Office: {siteSettings?.registered_office || COMPANY_INFO.address}</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Email: <a href={`mailto:${siteSettings?.contact_email || 'contact@josanlogistics.com.sg'}`} className="text-[#F26B21] font-bold hover:underline">{siteSettings?.contact_email || 'contact@josanlogistics.com.sg'}</a></span>
            </p>
            {isDisplayablePhone(siteSettings?.phone) && (
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Hotline: <a href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`} className="text-slate-900 font-bold hover:underline">{siteSettings.phone}</a></span>
              </p>
            )}
          </div>

        </div>
      </section>

      {/* 2. Account Registration and Accurate Information */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          2. Account Registration and Accurate Information
        </h2>
        <p>
          Access to certain features of our platform—including formal quotation generation, shipment booking, and portal tracking dashboards—requires registering a corporate account.
        </p>
        <p>
          You warrant that all information provided during registration and booking is true, accurate, current, and complete. Accounts must be registered by authorized corporate representatives. You are responsible for maintaining the confidentiality of your login credentials and for all activities conducted under your authenticated account.
        </p>
        <p>
          Josan Logistics reserves the right to suspend or terminate accounts that provide misleading information, fail identity verification, or engage in unauthorized system use.
        </p>
      </section>

      {/* 3. Shipment Bookings and Quotation Terms */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          3. Shipment Bookings and Quotation Terms
        </h2>
        <p>
          Quotations generated via our website or provided by our commercial team are based on the specific cargo weights, dimensions, piece counts, and collection/delivery locations provided by the Shipper.
        </p>
        <ul className="space-y-2 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Quotation Validity:</strong> Unless stated otherwise in writing, quotations are valid for fourteen (14) calendar days from the date of issuance and are subject to equipment and carrier availability at the time of confirmed booking.
          </li>
          <li>
            <strong className="text-slate-900">Rate Verification:</strong> All rates are subject to physical verification upon cargo collection. If actual scale weights, dimensions, or volumetric measurements exceed declared figures, invoiced charges will be adjusted to reflect actual parameters.
          </li>
          <li>
            <strong className="text-slate-900">Binding Bookings:</strong> A booking becomes binding upon written confirmation from Josan Logistics, issuance of a Booking Reference Number, and verification of payment arrangements.
          </li>
        </ul>
      </section>

      {/* 4. Shipper Responsibilities and Packaging Standards */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          4. Shipper Responsibilities and Packaging Standards
        </h2>
        <p>
          The Shipper is solely responsible for ensuring that consignments are properly prepared for commercial transport:
        </p>
        <ul className="space-y-2 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Packaging Integrity:</strong> Cargo must be packed, strapped, cushioned, and wrapped to withstand the standard handling conditions of commercial road carriage, forklift operations, and air freight transit. Josan Logistics is not liable for cargo damage resulting from defective or inadequate packaging.
          </li>
          <li>
            <strong className="text-slate-900">Labeling &amp; Markings:</strong> Every package or pallet must bear clear, durable shipping labels showing recipient business names, physical delivery addresses, contact numbers, and unique shipment identifiers.
          </li>
          <li>
            <strong className="text-slate-900">Loading &amp; Unloading Access:</strong> The Shipper must ensure safe vehicle access, suitable loading docks or ground-floor collection points, and appropriate handling equipment (such as pallet jacks or forklifts where required). Standard loading and discharge allowance is forty-five (45) minutes per vehicle; detention beyond this allowance may incur waiting fees.
          </li>
        </ul>
      </section>

      {/* 5. Restricted and Prohibited Cargo */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          5. Restricted and Prohibited Cargo
        </h2>
        <p>
          The Customer warrants that shipments tendered to Josan Logistics do not contain unlawful, dangerous, or restricted items unless declared and approved in writing prior to collection.
        </p>
        <p>
          <strong className="text-slate-900">Prohibited Items Include:</strong> Illegal contraband, narcotics, undeclared hazardous chemicals, radioactive substances, firearms, explosives, ammunition, counterfeit articles, human remains, live animals, and commodities prohibited under Singapore law or destination international regulations.
        </p>
        <p>
          Any dangerous goods subject to the IATA Dangerous Goods Regulations or Singapore Environmental Public Health requirements must be declared with valid Safety Data Sheets (SDS) and certified packaging before booking. Josan Logistics and appointed carriers reserve the right to inspect packages and reject any consignment suspected of containing undeclared hazardous materials.
        </p>
      </section>

      {/* 6. Charges, Invoicing, and Payment Terms */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          6. Charges, Invoicing, and Payment Terms
        </h2>
        <p>
          Commercial invoices are issued following booking confirmation or service execution. Payment terms are strictly as agreed in writing or prior to cargo collection for non-credit accounts.
        </p>
        <ul className="space-y-1.5 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Singapore GST:</strong> Singapore Goods and Services Tax (GST, currently 9%) applies to domestic road transport coordination and documentation services rendered in Singapore.
          </li>
          <li>
            <strong className="text-slate-900">Accepted Payment Methods:</strong> Corporate bank transfer (PayNow Corporate, FAST, GIRO) or authorized electronic payment.
          </li>
          <li>
            <strong className="text-slate-900">Operational Surcharges:</strong> Additional charges supported by operational records may apply for abortive collections, waiting time exceeding 45 minutes, re-delivery attempts caused by recipient unavailability, or tail-gate vehicle requirements.
          </li>
        </ul>
      </section>

      {/* 7. Customs Clearance, Duties, and Taxes */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          7. Customs Clearance, Duties, and Taxes
        </h2>
        <p>
          Josan Logistics provides trade documentation support only (such as Air Waybill drafting and export paperwork compilation). We do not provide customs clearance or act as a licensed customs broker.
        </p>
        <p>
          The Customer remains the legal exporter or importer of record and is solely responsible for lodging trade declarations through Singapore Customs TradeNet, obtaining strategic goods permits, and settling all applicable import duties, GST, tariffs, port inspection fees, and customs penalties.
        </p>
      </section>

      {/* 8. Delivery Delays and Circumstances Outside Control (Force Majeure) */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          8. Delivery Delays and Circumstances Outside Control (Force Majeure)
        </h2>
        <p>
          Transit schedules and delivery dates provided by Josan Logistics are operational estimates provided in good faith. We do not provide fixed or guaranteed delivery deadlines.
        </p>
        <p>
          Neither party shall be held liable for delay, interruption, or failure to perform services where such failure results from events beyond reasonable operational control, including severe monsoons, flash floods, highway closures, traffic accidents, airport ramp congestions, airline flight schedule cancellations, port congestion, customs inspections, border closures, pandemics, strikes, or acts of government authorities.
        </p>
      </section>

      {/* 9. Limitation of Liability and Cargo Insurance */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          9. Limitation of Liability and Cargo Insurance
        </h2>
        <p>
          Because Josan Logistics acts as a freight coordinator, our liability for cargo loss or physical damage during transit is strictly limited:
        </p>
        <ul className="space-y-1.5 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>For commercial road carriage, liability is limited in accordance with statutory road carriage limits or the standard terms of the appointed partner haulier.</li>
          <li>For air cargo, liability is governed by the provisions of the Warsaw Convention or Montreal Convention 1999 as incorporated into the operating airline's Air Waybill.</li>
          <li>Josan Logistics does not provide automatic full-value cargo insurance. Shippers are strongly advised to procure their own comprehensive Marine Cargo Insurance for high-value consignments prior to dispatch.</li>
          <li>In no event shall Josan Logistics be liable for indirect, consequential, or economic loss, including loss of profits, commercial revenue, production stoppage, or loss of business opportunity.</li>
        </ul>
      </section>

      {/* 10. Claims, Discrepancies, and Reporting Periods */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          10. Claims, Discrepancies, and Reporting Periods
        </h2>
        <p>
          Any visible packaging damage, seal tampering, or piece count discrepancy must be endorsed immediately upon the electronic Proof of Delivery (e-POD) or physical consignment note at the time of delivery.
        </p>
        <p>
          Formal written notice of claim must be submitted to Josan Logistics within forty-eight (48) hours of delivery for visible damage or non-delivery, and within seven (7) calendar days for concealed damage discovered upon unpacking. All original outer packaging and damaged cargo must be retained for physical inspection.
        </p>
      </section>

      {/* 11. Cancellation, Dispute Resolution, and Governing Law */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          11. Cancellation, Dispute Resolution, and Governing Law
        </h2>
        <p>
          Shipment cancellation and refund requests are governed by our Refund &amp; Cancellation Policy. Any disputes arising from or in connection with these Terms shall be resolved amicably through good-faith commercial negotiation.
        </p>
        <p>
          These Terms &amp; Conditions are governed by and construed in accordance with the laws of the Republic of Singapore. The parties submit to the exclusive jurisdiction of the Courts of Singapore.
        </p>
      </section>

      {/* 12. Amendments to Terms */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          12. Amendments to Terms
        </h2>
        <p>
          Josan Logistics reserves the right to amend these Terms from time to time to reflect operational, contractual, or legal requirements. Revised Terms will be published on our website with the updated effective date. Continued use of our services following publication constitutes acceptance of the amended Terms.
        </p>
      </section>
    </LegalPageLayout>
  );
};
