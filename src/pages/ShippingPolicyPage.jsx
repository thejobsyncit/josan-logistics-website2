import React from 'react';
import { LegalPageLayout } from '../components/LegalPageLayout';

export const ShippingPolicyPage = ({ setActiveTab }) => {
  return (
    <LegalPageLayout
      activeTabKey="shipping"
      title="Shipping Policy"
      subtitle="Operational standards and procedures governing commercial shipment booking, pickup scheduling, road transport coordination, documentation support, and tracking at Josan Logistics."
      effectiveDate="1 November 2026"
      lastUpdated="1 November 2026"
      jurisdiction="Singapore Operations"
      setActiveTab={setActiveTab}
    >
      {/* 1. Overview and Operational Framework */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          1. Overview and Operational Framework
        </h2>
        <p>
          This Shipping Policy outlines the operational procedures, standards, and conditions governing shipment processing, collections, road freight coordination, trade documentation, and delivery coordination managed by Josan Logistics Pte. Ltd. ("Josan Logistics").
        </p>
        <p>
          As an established freight coordinator in Singapore, we coordinate point-to-point commercial road transportation through our network of verified partner hauliers and provide shipment documentation support for commercial air cargo. We operate transparently, communicating realistic operational timelines without misleading delivery guarantees.
        </p>
      </section>

      {/* 2. Booking and Order Processing */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          2. Booking and Order Processing
        </h2>
        <p>
          Shipments may be booked online through the Josan Logistics Portal, via our quote request tool, or directly with our operations desk:
        </p>
        <ul className="space-y-2 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Operating Hours:</strong> Our operations and dispatch desk operates Monday to Friday, 9:00 AM – 6:00 PM SGT, and Saturday, 9:00 AM – 1:00 PM SGT. Bookings submitted outside these hours are reviewed at the start of the next business day.
          </li>
          <li>
            <strong className="text-slate-900">Unique Tracking Identifiers:</strong> Upon booking confirmation, every consignment is assigned an official tracking reference:
            <ul className="pl-6 pt-1 space-y-1 list-circle">
              <li><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">JOS-XXXXX</code> for commercial road transportation consignments.</li>
              <li><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">AWS-XXXXX</code> for air freight documentation support requests.</li>
            </ul>
          </li>
          <li>
            <strong className="text-slate-900">Booking Confirmation:</strong> A formal Booking Confirmation detailing scheduled collection windows, declared cargo specifications, and transport partner assignment is issued to the Shipper upon order review.
          </li>
        </ul>
      </section>

      {/* 3. Pickup and Collection Arrangements */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          3. Pickup and Collection Arrangements
        </h2>
        <p>
          We coordinate collections across all primary industrial hubs, commercial clusters, and freight centers in Singapore, including Jurong Industrial Estate, Tuas, Changi Logistics Park, Airport Logistics Park of Singapore (ALPS), Changi Airfreight Centre, and commercial business districts.
        </p>
        <p>
          To ensure timely collection, the Shipper must ensure the following conditions are met prior to the arrival of the collection vehicle:
        </p>
        <ul className="space-y-1.5 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>All packages are fully packed, sealed, and strapped in accordance with commercial standards.</li>
          <li>Every package or pallet bears a clear, legible shipping label showing recipient details and the Josan reference number.</li>
          <li>Vehicular access to loading bays, ground-floor docks, or ramp areas is confirmed and authorized with facility building management.</li>
          <li>Required material handling equipment (such as forklifts or pallet jacks) is available for heavy palletized consignments.</li>
          <li>An authorized representative is available on-site to sign the physical or electronic handover receipt.</li>
        </ul>
      </section>

      {/* 4. Shipment Acceptance and Handling Standards */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          4. Shipment Acceptance and Handling Standards
        </h2>
        <p>
          Appointed partner carriers conduct a visual inspection of outer packaging upon arrival at the collection location:
        </p>
        <ul className="space-y-1.5 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Inspection &amp; Verification:</strong> Drivers verify external carton condition, check piece counts against consignment notes, and inspect for signs of leakage, crushed packaging, or structural instability.
          </li>
          <li>
            <strong className="text-slate-900">Right to Refuse:</strong> Carriers reserve the right to decline collection of cargo that is improperly packaged, un-palletized (where palletization is commercially necessary), leaking, or poses a safety risk to other freight or personnel.
          </li>
          <li>
            <strong className="text-slate-900">Special Handling:</strong> Fragile or oversized cargo must be declared during the quotation stage to ensure appropriate vehicle allocation (such as tail-gate trucks or specialized box lorries).
          </li>
        </ul>
      </section>

      {/* 5. Transit Timelines and Delivery Schedules */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          5. Transit Timelines and Delivery Schedules
        </h2>
        <p>
          We coordinate deliveries based on realistic operational schedules:
        </p>
        <ul className="space-y-2 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Domestic Commercial Road Transport:</strong> Standard domestic delivery is scheduled for the next business day following cargo collection. Same-day dedicated transport is available upon request, subject to route confirmation and vehicle availability.
          </li>
          <li>
            <strong className="text-slate-900">Air Freight Documentation Support:</strong> Air Waybills (AWBs), commercial invoices, and cargo manifests are prepared and delivered in alignment with commercial airline cut-off deadlines and flight schedules.
          </li>
        </ul>
        <div className="border-l-2 border-[var(--color-orange,#FF6B00)] pl-4 py-1 text-slate-600 bg-slate-50/70 rounded-r text-xs sm:text-sm">
          All delivery timelines are operational estimates provided in good faith. Because commercial road transport is subject to external road conditions, port queueing, and terminal clearance, Josan Logistics does not provide guaranteed time-definite warranties.
        </div>
      </section>

      {/* 6. Shipment Tracking and Milestone Updates */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          6. Shipment Tracking and Milestone Updates
        </h2>
        <p>
          You can check the status of your shipment at any time using our dedicated online tracking portal:
        </p>
        <ul className="space-y-1.5 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>Enter your 5-character tracking identifier (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">JOS-XXXXX</code> or <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">AWS-XXXXX</code>) on the Track Shipment page.</li>
          <li>Tracking milestones are logged manually into the system by our operations team as events occur (e.g., <em>Request received</em>, <em>Carrier booked</em>, <em>In transit</em>, <em>Delivered</em>).</li>
          <li>Every tracking query displays a clear "Last Updated" timestamp reflecting the latest verified log. Minor operational delays in manual log entry do not affect physical cargo transit.</li>
        </ul>
      </section>

      {/* 7. Operational Delays and External Factors */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          7. Operational Delays and External Factors
        </h2>
        <p>
          While we strive for consistent punctuality, shipments may experience delays resulting from external conditions outside our reasonable control:
        </p>
        <ul className="space-y-1.5 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>Severe tropical weather, monsoon downpours, or localized flash floods.</li>
          <li>Heavy highway congestion, vehicle breakdowns, or road traffic accidents.</li>
          <li>Congestion or queueing at air cargo terminal docks, airport ramp facilities, or sea port gates.</li>
          <li>Customs inspections, scanning delays, or regulatory paperwork audits by Singapore authorities.</li>
          <li>Restricted site access, closed recipient premises, or delays at customer unloading bays.</li>
        </ul>
        <p>
          Our operations team actively tracks transit exceptions and communicates significant delays directly to the registered shipper.
        </p>
      </section>

      {/* 8. International Air Freight Documentation and Customs Responsibilities */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          8. International Air Freight Documentation and Customs Responsibilities
        </h2>
        <p>
          For air freight documentation services, Josan Logistics prepares trade documentation based on the commercial details and descriptions provided by the Customer:
        </p>
        <ul className="space-y-1.5 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>We assist with drafting Master &amp; House Air Waybills, packing lists, and commercial invoices.</li>
          <li>
            <strong className="text-slate-900">Customs Clearance Responsibility:</strong> Josan Logistics provides documentation support only and does not operate as a customs broker. The Shipper or Consignee is legally responsible for submitting Singapore Customs TradeNet declarations, obtaining strategic goods permits, and settling all customs tariffs, GST, inspection charges, and overseas port fees.
          </li>
        </ul>
      </section>

      {/* 9. Delivery Procedures and Proof of Delivery (e-POD) */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          9. Delivery Procedures and Proof of Delivery (e-POD)
        </h2>
        <p>
          Consignments are delivered to the recipient address specified in the booking confirmation:
        </p>
        <ul className="space-y-1.5 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Delivery Handover:</strong> Goods are handed over against an authorized electronic or physical Proof of Delivery (e-POD) signature. The signatory's name, timestamp, and any visible package endorsements are recorded.
          </li>
          <li>
            <strong className="text-slate-900">Unsuccessful Deliveries:</strong> If delivery cannot be completed due to closed premises, recipient unavailability, or refusal to accept, the cargo will be returned to secure holding. Re-delivery or additional storage charges will apply in accordance with operational schedules.
          </li>
        </ul>
      </section>

      {/* 10. Operations Support and Enquiries */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          10. Operations Support and Enquiries
        </h2>
        <p>
          For real-time delivery support, schedule updates, or special collection coordination, please contact our Singapore operations team:
        </p>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 text-sm">
          <p className="font-semibold text-slate-900">Operations Desk &bull; Josan Logistics Pte. Ltd.</p>
          <p className="text-slate-600">Email: <a href="mailto:contact@josanlogistics.com.sg" className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">contact@josanlogistics.com.sg</a></p>
          <p className="text-slate-600">Registered Office: 10 Anson Road, #26-04 International Plaza, Singapore 079903</p>
          <p className="text-slate-500 text-xs pt-1">Operating Hours: Monday – Friday, 9:00 AM – 6:00 PM SGT &bull; Saturday, 9:00 AM – 1:00 PM SGT</p>
        </div>
      </section>
    </LegalPageLayout>
  );
};

