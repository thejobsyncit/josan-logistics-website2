import React from 'react';
import { LegalPageLayout } from '../components/LegalPageLayout';

export const TermsOfServicePage = ({ setActiveTab }) => {
  return (
    <LegalPageLayout
      activeTabKey="terms"
      title="Terms & Conditions"
      subtitle="Standard commercial terms governing freight coordination services, quotation requests, Air Waybill documentation support, and portal access provided by Josan Logistics Pte. Ltd."
      effectiveDate="1 November 2026"
      lastUpdated="1 November 2026"
      jurisdiction="Singapore Commercial Jurisdiction"
      setActiveTab={setActiveTab}
    >
      {/* 1. Agreement and Nature of Services */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          1. Agreement and Nature of Services
        </h2>
        <p>
          These Terms &amp; Conditions ("Terms") constitute a legally binding agreement between you (the "Customer", "Shipper", or "Client") and Josan Logistics Pte. Ltd. ("Josan Logistics", "we", "our", or "us"). By accessing our website, creating an account, requesting quotations, or booking logistics services, you agree to comply with and be bound by these Terms.
        </p>
        <p>
          Josan Logistics operates as a commercial <strong>freight coordinator</strong> in Singapore. Our commercial scope comprises two distinct core offerings:
        </p>
        <ul className="space-y-2 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Commercial Road Transportation Coordination:</strong> Arranging point-to-point road freight, warehouse transfers, and distribution across Singapore through an established network of independent, verified transport partner carriers.
          </li>
          <li>
            <strong className="text-slate-900">Air Freight Documentation Support:</strong> Assisting commercial shippers with the preparation, review, and organization of Air Waybills (AWBs), cargo manifests, commercial invoices, and packing lists for commercial air cargo.
          </li>
        </ul>
        <div className="border-l-2 border-[var(--color-orange,#FF6B00)] pl-4 py-1 text-slate-600 bg-slate-50/70 rounded-r text-xs sm:text-sm">
          Josan Logistics does not directly operate commercial aircraft or motor vehicle fleets, nor do we act as a customs broker or clearance agent. Transport carriage is executed by appointed partner hauliers and commercial airlines.
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
