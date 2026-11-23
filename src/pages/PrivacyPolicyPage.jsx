import React from 'react';
import { LegalPageLayout } from '../components/LegalPageLayout';
import { openCookiePreferences } from '../components/CookieBanner';

export const PrivacyPolicyPage = ({ setActiveTab }) => {
  return (
    <LegalPageLayout
      activeTabKey="privacy"
      title="Privacy Policy"
      subtitle="How Josan Logistics collects, uses, protects, and manages customer and shipment information in accordance with the Singapore Personal Data Protection Act 2012 (PDPA)."
      effectiveDate="1 November 2026"
      lastUpdated="1 November 2026"
      jurisdiction="Singapore PDPA 2012"
      setActiveTab={setActiveTab}
    >
      {/* 1. Introduction and Scope */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          1. Introduction and Scope
        </h2>
        <p>
          Josan Logistics Pte. Ltd. ("Josan Logistics", "we", "our", or "us") provides commercial logistics coordination services in Singapore, specializing in commercial road freight coordination and air freight documentation support. We respect the privacy of every individual and business organization that interacts with our digital platforms and services.
        </p>
        <p>
          This Privacy Policy sets out how we collect, use, process, disclose, and safeguard personal and operational data gathered when you browse our website, request quotations, register a customer account, book transportation, or contact our support team. All personal data is processed strictly in accordance with the Singapore Personal Data Protection Act 2012 (PDPA) and related statutory regulations.
        </p>
        <div className="border-l-2 border-[var(--color-orange,#FF6B00)] pl-4 py-1 text-slate-600 bg-slate-50/70 rounded-r text-xs sm:text-sm">
          Our services and online platforms are directed primarily to commercial shippers, cargo owners, and corporate enterprises operating in Singapore.
        </div>
      </section>

      {/* 2. Information We Collect */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          2. Information We Collect
        </h2>
        <p>
          We collect information directly from you when you register an account, submit quotation requests, book freight services, track shipments, or correspond with our staff. The categories of information we collect include:
        </p>
        
        <h3 className="text-sm sm:text-base font-semibold text-slate-900 pt-1">
          Account Registration Details
        </h3>
        <p>
          When you create an account on the Josan Logistics Portal, we collect your full legal name, company or trading name, corporate email address, contact telephone number, and secure login credentials. Passwords are cryptographically hashed and never stored in plain text.
        </p>

        <h3 className="text-sm sm:text-base font-semibold text-slate-900 pt-1">
          Consignment and Shipment Information
        </h3>
        <p>
          To coordinate physical transportation and prepare trade paperwork, we collect consignment parameters supplied by the shipper. This includes sender and consignee business names, pickup and delivery physical addresses in Singapore, on-site contact persons, dispatch telephone numbers, cargo descriptions, piece counts, package dimensions, gross scale weights, volumetric measurements, declared commercial values, and special cargo handling requirements.
        </p>

        <h3 className="text-sm sm:text-base font-semibold text-slate-900 pt-1">
          Shipment Identifiers and Milestone Data
        </h3>
        <p>
          When bookings are confirmed, unique reference numbers are generated (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">JOS-XXXXX</code> for road freight and <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">AWS-XXXXX</code> for airway documentation). We maintain records of tracking searches and milestone progress updates entered by our operations staff.
        </p>

        <h3 className="text-sm sm:text-base font-semibold text-slate-900 pt-1">
          Commercial Invoicing &amp; Customer Support
        </h3>
        <p>
          For corporate billing, we collect company registered addresses, Singapore GST registration numbers (where applicable), billing contact details, and records of payments received. We also retain correspondence, email communications, and support inquiries submitted to our operations desk.
        </p>
      </section>

      {/* 3. How We Use Information */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          3. How We Use Information
        </h2>
        <p>
          Josan Logistics uses collected information solely for legitimate operational and business purposes, including:
        </p>
        <ul className="space-y-2 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Coordinating Transport Services:</strong> Scheduling vehicle dispatches with our verified Singapore transport partner carriers, managing cargo collections, organizing warehouse transfers, and issuing electronic Proof of Delivery (e-POD) records.
          </li>
          <li>
            <strong className="text-slate-900">Preparing Air Freight Documentation:</strong> Drafting Air Waybills (AWBs), cargo manifests, commercial invoices, and packing lists required by commercial airlines and export freight terminals.
          </li>
          <li>
            <strong className="text-slate-900">Shipment Tracking &amp; Customer Support:</strong> Providing real-time shipment milestone updates, responding to rate requests, confirming schedules, and addressing operational queries.
          </li>
          <li>
            <strong className="text-slate-900">Invoicing &amp; Financial Compliance:</strong> Generating tax invoices, verifying payments, maintaining audit trails, and fulfilling Singapore tax compliance obligations (including IRAS GST reporting).
          </li>
          <li>
            <strong className="text-slate-900">Platform Security:</strong> Authenticating user access, enforcing registration rate limits, maintaining automated 15-minute inactivity session timeouts, and preventing unauthorized or fraudulent bookings.
          </li>
        </ul>
        <p>
          We do not use customer personal data for automated behavioral profiling, nor do we sell customer lists to third-party marketing companies.
        </p>
      </section>

      {/* 4. Payment Processing and Financial Data */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          4. Payment Processing and Financial Data
        </h2>
        <p>
          Josan Logistics processes commercial payments via corporate bank transfers (including PayNow Corporate, FAST, and GIRO) and authorized electronic payment gateways compliant with the Payment Card Industry Data Security Standard (PCI-DSS).
        </p>
        <p>
          Josan Logistics does not store full credit card numbers, debit card numbers, or card CVV/CVC verification codes on our servers or in our databases. Transaction IDs, remittance advices, and bank confirmation receipts are retained strictly for payment reconciliation and accounting records.
        </p>
      </section>

      {/* 5. Cookies, Bot Protection, and Website Analytics */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          5. Cookies, Bot Protection, and Website Analytics
        </h2>
        <p>
          Our website uses limited, privacy-respecting technologies essential for website security and normal operations:
        </p>
        <ul className="space-y-2 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Essential Session Cookies:</strong> Used to maintain your logged-in authentication state, enforce session security, and keep your preferences active during portal navigation.
          </li>
          <li>
            <strong className="text-slate-900">Cloudflare Turnstile Verification:</strong> We utilize Cloudflare Turnstile on our public quote, tracking, and account registration forms. Turnstile verifies that inquiries are submitted by genuine visitors rather than automated spam bots, protecting our infrastructure without tracking your browsing habits across unrelated websites or serving targeted advertisements.
          </li>
        </ul>
        <p>
          You can inspect, manage, or withdraw cookie preferences at any time by clicking{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              openCookiePreferences();
            }}
            className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline cursor-pointer"
          >
            Cookie Settings
          </button>{' '}
          in our website footer.
        </p>
      </section>

      {/* 6. Data Sharing and Disclosure */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          6. Data Sharing and Disclosure
        </h2>
        <p>
          We do not sell, rent, trade, or disclose your personal data to external parties for commercial gain. We share data only with trusted partners strictly necessary to fulfill logistics services:
        </p>
        <ul className="space-y-2 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Appointed Transport Partners:</strong> Disclosing pickup locations, delivery destinations, site contact details, and cargo specifications to verified Singapore road hauliers and commercial airlines to execute transport.
          </li>
          <li>
            <strong className="text-slate-900">Technical Service Providers:</strong> Secure cloud infrastructure providers, database hosting partners, and email delivery services operating under strict confidentiality and data protection obligations.
          </li>
          <li>
            <strong className="text-slate-900">Regulatory &amp; Statutory Authorities:</strong> Disclosing consignment information when required by Singapore law, court subpoena, or authorized statutory agencies, including Singapore Customs, the Civil Aviation Authority of Singapore (CAAS), the Immigration &amp; Checkpoints Authority (ICA), and the Singapore Police Force.
          </li>
        </ul>
      </section>

      {/* 7. Information Security and Access Controls */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          7. Information Security and Access Controls
        </h2>
        <p>
          Josan Logistics maintains robust technical, physical, and administrative safeguards designed to protect personal and shipment information against accidental loss, unauthorized access, destruction, misuse, or alteration:
        </p>
        <ul className="space-y-1.5 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>Transport Layer Security (TLS 1.3) encryption for all website communications and portal interactions.</li>
          <li>PostgreSQL database security utilizing Row-Level Security (RLS) policies to isolate customer data.</li>
          <li>Administrative privileges restricted strictly to authorized staff on a role-based, need-to-know basis.</li>
          <li>Automated 15-minute inactivity session timeouts on authenticated portal sessions.</li>
          <li>Server-side rate limiting on public inquiry forms to prevent automated harvesting or credential stuffing.</li>
        </ul>
      </section>

      {/* 8. Data Retention and Disposal */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          8. Data Retention and Disposal
        </h2>
        <p>
          We retain personal and shipment data only for as long as necessary to achieve the operational purposes described in this policy, or as required by applicable statutory and legal frameworks:
        </p>
        <ul className="space-y-1.5 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Statutory Tax &amp; Audit Records:</strong> Consignment records, invoices, delivery notes, and transaction files are retained for a minimum of seven (7) years to comply with Singapore Inland Revenue (IRAS) and Companies Act accounting requirements.
          </li>
          <li>
            <strong className="text-slate-900">Secure Destruction:</strong> When personal data is no longer necessary for operational or legal purposes, it is securely deleted, permanently overwritten, or irreversibly anonymized.
          </li>
        </ul>
      </section>

      {/* 9. Customer Rights Under the PDPA */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          9. Customer Rights Under the PDPA
        </h2>
        <p>
          Subject to exceptions under the Singapore Personal Data Protection Act 2012, you have the right to:
        </p>
        <ul className="space-y-1.5 text-slate-700 list-disc list-inside pl-1 text-sm sm:text-base">
          <li>
            <strong className="text-slate-900">Access:</strong> Request access to personal data held by Josan Logistics and receive details about how your data has been used or disclosed within the past 12 months.
          </li>
          <li>
            <strong className="text-slate-900">Correction:</strong> Request correction of inaccurate, incomplete, or outdated personal information.
          </li>
          <li>
            <strong className="text-slate-900">Withdraw Consent:</strong> Withdraw your consent for the ongoing collection, use, or disclosure of your personal data, subject to reasonable notice. (Please note that withdrawing consent for essential data processing may prevent us from fulfilling active shipment bookings or coordinating transport).
          </li>
        </ul>
      </section>

      {/* 10. Privacy Enquiries and Data Protection Officer */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
          10. Privacy Enquiries and Data Protection Officer
        </h2>
        <p>
          If you have questions regarding this Privacy Policy, wish to exercise your data rights, or have a data privacy concern, please contact our designated Data Protection Officer:
        </p>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 text-sm">
          <p className="font-semibold text-slate-900">Data Protection Officer &bull; Josan Logistics Pte. Ltd.</p>
          <p className="text-slate-600">Email: <a href="mailto:dpo@josanlogistics.com.sg" className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">dpo@josanlogistics.com.sg</a></p>
          <p className="text-slate-600">General Enquiries: <a href="mailto:contact@josanlogistics.com.sg" className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">contact@josanlogistics.com.sg</a></p>
          <p className="text-slate-600">Registered Office: 10 Anson Road, #26-04 International Plaza, Singapore 079903</p>
        </div>
      </section>
    </LegalPageLayout>
  );
};
