import React from 'react';
import { LegalPageLayout } from '../components/LegalPageLayout';

export const RefundPolicyPage = ({ setActiveTab }) => {
  return (
    <LegalPageLayout
      activeTabKey="refund"
      title="Refund & Cancellation Policy"
      subtitle="Commercial terms, operational conditions, and procedures governing shipment cancellations, abortive haulage charges, billing adjustments, and refund requests at Josan Logistics."
      effectiveDate="1 November 2026"
      lastUpdated="1 November 2026"
      jurisdiction="Singapore Commercial Operations"
      setActiveTab={setActiveTab}
    >
      {/* 1. Purpose and Scope */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          1. Purpose and Scope
        </h2>
        <p>
          This Refund &amp; Cancellation Policy sets out the commercial guidelines, operational conditions, and procedures that apply when a customer requests to cancel, modify, or obtain a refund for freight coordination or documentation services provided by Josan Logistics Pte. Ltd. ("Josan Logistics").
        </p>
        <p>
          Because Josan Logistics coordinates physical transport through independent partner carriers and prepares specialized air cargo documentation, our policy reflects the actual operational expenses, carrier dispatch commitments, and administrative resources involved in executing logistics services.
        </p>
      </section>

      {/* 2. Booking Cancellation Stages */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          2. Booking Cancellation Stages
        </h2>
        <p>
          Cancellation eligibility and applicable charges depend on the operational stage of your consignment at the time your written cancellation notice is received by our operations desk:
        </p>

        <h3 className="text-sm sm:text-base font-semibold text-slate-900 pt-1">
          Stage 1: Cancellation Before Vehicle Dispatch or Document Drafting
        </h3>
        <p>
          If you notify Josan Logistics in writing before an appointed carrier's vehicle has been dispatched for collection, and before Air Waybill (AWB) or trade documentation drafting has commenced, your booking may be cancelled without service penalty. Any advance freight charges received will be refunded in full, subject only to non-recoverable third-party banking or electronic payment processing fees.
        </p>

        <h3 className="text-sm sm:text-base font-semibold text-slate-900 pt-1">
          Stage 2: Cancellation After Vehicle Dispatch (Abortive Haulage)
        </h3>
        <p>
          If a booking cancellation is requested after a transport partner's vehicle has been dispatched and is en route to or has arrived at the collection address, an <strong>abortive haulage charge</strong> will apply. This charge covers the direct vehicle transit costs, driver allocation, and fuel incurred by our partner carrier. Any remaining balance of prepaid freight will be credited or refunded to the customer.
        </p>

        <h3 className="text-sm sm:text-base font-semibold text-slate-900 pt-1">
          Stage 3: Cancellation After Cargo Has Been Collected / In Active Transit
        </h3>
        <p>
          Once cargo has been loaded onto a collection vehicle, departed the shipper's premises, or lodged with an air freight terminal, the consignment is in active transit. The booking cannot be cancelled or recalled without payment of the full agreed transportation charges, plus any applicable return haulage and terminal handling fees required to return the cargo to the shipper.
        </p>

        <h3 className="text-sm sm:text-base font-semibold text-slate-900 pt-1">
          Stage 4: Shipment Documentation Support Services
        </h3>
        <p>
          Service charges for Air Waybill preparation, cargo manifest drafting, and trade documentation are earned upon document preparation. Once documents have been drafted, verified, or submitted to an operating airline, documentation service fees are strictly non-refundable.
        </p>
      </section>

      {/* 3. Failed Pickups and Delivery Attempts */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          3. Failed Pickups and Delivery Attempts
        </h2>
        <ul className="space-y-2 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Shipper-Related Operational Failures:</strong> If an appointed vehicle attends a scheduled collection or delivery but the service cannot be executed due to shipper or consignee circumstances—such as incorrect site addresses, premises closed during confirmed hours, cargo not ready, lack of vehicle loading access, or refusal by the recipient—the attempt is treated as abortive. Initial haulage and re-delivery charges apply; such attempts are not eligible for a refund.
          </li>
          <li>
            <strong className="text-slate-900">Company-Related Operational Failures:</strong> If Josan Logistics or its appointed carrier partner fails to attend a confirmed booking due to an operational failure directly attributable to us (excluding force majeure events, severe monsoons, or external road closures), we will reschedule the service as a matter of priority at no additional cost. If rescheduling is not acceptable to the Customer, a full refund of the prepaid service fee for the affected consignment will be processed promptly.
          </li>
        </ul>
      </section>

      {/* 4. Duplicate Payments and Billing Inaccuracies */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          4. Duplicate Payments and Billing Inaccuracies
        </h2>
        <p>
          In the event of an accidental duplicate payment, clerical billing error, or verified overcharge on a commercial invoice, Josan Logistics will issue an immediate credit adjustment or refund.
        </p>
        <p>
          Customers should notify our finance department at <a href="mailto:billing@josanlogistics.com.sg" className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">billing@josanlogistics.com.sg</a> within fourteen (14) calendar days of payment, providing bank transaction reference numbers and the relevant invoice number for expedited reconciliation.
        </p>
      </section>

      {/* 5. Summary of Refund Eligibility */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          5. Summary of Refund Eligibility
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold">
              <tr>
                <th className="p-3">Scenario / Service Stage</th>
                <th className="p-3">Eligibility</th>
                <th className="p-3">Conditions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="p-3 font-medium text-slate-900">Cancellation before vehicle dispatch &amp; doc drafting</td>
                <td className="p-3 text-emerald-700 font-semibold">Eligible for Full Refund</td>
                <td className="p-3 text-slate-500">Subject to non-recoverable bank processing fees</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-900">Cancellation after carrier vehicle dispatched</td>
                <td className="p-3 text-amber-700 font-semibold">Partial Refund</td>
                <td className="p-3 text-slate-500">Less partner carrier abortive haulage fee</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-900">Cargo collected or in active transit</td>
                <td className="p-3 text-rose-700 font-semibold">Non-Refundable</td>
                <td className="p-3 text-slate-500">Full freight applies plus return haulage if recalled</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-900">Completed Air Waybill / documentation support</td>
                <td className="p-3 text-rose-700 font-semibold">Non-Refundable</td>
                <td className="p-3 text-slate-500">Service completed and delivered upon drafting</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-900">Duplicate payment or verified billing error</td>
                <td className="p-3 text-emerald-700 font-semibold">Eligible for Full Refund</td>
                <td className="p-3 text-slate-500">Credited upon finance desk verification</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-900">Failed pickup due to shipper site closure/unavailability</td>
                <td className="p-3 text-rose-700 font-semibold">Non-Refundable</td>
                <td className="p-3 text-slate-500">Initial haulage charged; re-attendance fees apply</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Refund Request and Processing Procedure */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          6. Refund Request and Processing Procedure
        </h2>
        <p>
          To ensure an accurate and auditable commercial record, all cancellation and refund requests must be submitted in writing:
        </p>
        <ul className="space-y-1.5 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Email Submission:</strong> Send an official written request to <a href="mailto:billing@josanlogistics.com.sg" className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">billing@josanlogistics.com.sg</a> and copy <a href="mailto:contact@josanlogistics.com.sg" className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">contact@josanlogistics.com.sg</a>.
          </li>
          <li>
            <strong className="text-slate-900">Required Details:</strong> Please include:
            <ul className="pl-6 pt-1 space-y-0.5 list-circle">
              <li>Company Name and authorized representative's contact information</li>
              <li>Unique Shipment Reference Number (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">JOS-XXXXX</code> or <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">AWS-XXXXX</code>)</li>
              <li>Invoice Number, payment date, and transaction remittance advice</li>
              <li>Detailed commercial explanation for the cancellation or refund request</li>
              <li>Designated corporate bank account details for refund transfer</li>
            </ul>
          </li>
          <li>
            <strong className="text-slate-900">Review Timeline:</strong> Our finance and operations team evaluates requests against carrier dispatch records and operational timestamps within two to three (2–3) business days.
          </li>
          <li>
            <strong className="text-slate-900">Disbursement Method:</strong> Approved refunds are credited directly to the original corporate bank account or payment method within seven to fourteen (7–14) business days. In compliance with commercial accounting standards, refunds are not disbursed in cash.
          </li>
        </ul>
      </section>

      {/* 7. Dispute Handling and Commercial Inquiries */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          7. Dispute Handling and Commercial Inquiries
        </h2>
        <p>
          If you have questions regarding an invoice calculation, abortive haulage fee, or refund assessment, we encourage open, good-faith dialogue. Our finance and operations team will review dispatch logs and operational timestamps transparently with your team.
        </p>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 text-sm">
          <p className="font-semibold text-slate-900">Billing Desk &bull; Josan Logistics Pte. Ltd.</p>
          <p className="text-slate-600">Billing Enquiries: <a href="mailto:billing@josanlogistics.com.sg" className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">billing@josanlogistics.com.sg</a></p>
          <p className="text-slate-600">Operations Desk: <a href="mailto:contact@josanlogistics.com.sg" className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">contact@josanlogistics.com.sg</a></p>
          <p className="text-slate-600">Registered Office: 10 Anson Road, #26-04 International Plaza, Singapore 079903</p>
        </div>
      </section>
    </LegalPageLayout>
  );
};

