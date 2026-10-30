import { jsPDF } from 'jspdf';
import { safeDownloadPdf } from './pdfDownload.js';

/**
 * Generates and downloads a clean, professional PDF for Terms of Service or Privacy Policy.
 * 
 * @param {'terms' | 'privacy'} type 
 */
export function generateLegalPdf(type = 'terms', customSettings = null) {
  let settings = customSettings;
  if (!settings) {
    try {
      const saved = localStorage.getItem('josan_site_settings');
      if (saved) settings = JSON.parse(saved);
    } catch (e) {}
  }

  const companyName = settings?.company_name || 'Josan Logistics Pte. Ltd.';
  const registeredOffice = settings?.registered_office || '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438';
  const contactEmail = settings?.contact_email || 'contact@josanlogistics.com.sg';
  const phone = settings?.phone || '+65 6789 0123';

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'PRIVACY POLICY' : 'TERMS OF SERVICE';
  const subtitle = isPrivacy 
    ? 'Singapore Personal Data Protection Act 2012 (PDPA)'
    : 'Commercial Road Freight Coordination & Documentation Services';
  const filename = isPrivacy 
    ? 'Josan_Logistics_Privacy_Policy.pdf' 
    : 'Josan_Logistics_Terms_of_Service.pdf';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2);

  let y = 20;

  // Header banner
  doc.setFillColor(11, 31, 58); // #0B1F3A Navy
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent stripe
  doc.setFillColor(242, 107, 33); // #F26B21 Orange
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Company Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(companyName.toUpperCase(), margin, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(182, 194, 209);
  doc.text('Singapore Registered Freight Coordinator | Reg No. 202400000A', margin, 19);

  // Document Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(242, 107, 33);
  doc.text(title, pageWidth - margin, 13, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 210, 225);
  doc.text('Effective: 29 October 2026', pageWidth - margin, 19, { align: 'right' });

  y = 38;

  // Title Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(11, 31, 58);
  doc.text(isPrivacy ? 'Privacy Policy' : 'Terms of Service', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(subtitle, margin, y);
  y += 8;

  // Thin separator
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Helper function to check and handle page breaks
  function ensureSpace(neededMm) {
    if (y + neededMm > pageHeight - 20) {
      doc.addPage();
      
      // Mini running header on subsequent pages
      doc.setFillColor(11, 31, 58);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setFillColor(242, 107, 33);
      doc.rect(0, 12, pageWidth, 1, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(`JOSAN LOGISTICS PTE. LTD. — ${title}`, margin, 8);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(182, 194, 209);
      doc.text('Confidential & Legal Document', pageWidth - margin, 8, { align: 'right' });

      y = 20;
    }
  }

  // Helper for Section Heading
  function addSectionHeading(num, headingText) {
    ensureSpace(14);
    
    // Circle or tag for section number
    doc.setFillColor(254, 243, 199); // amber/orange tint
    doc.roundedRect(margin, y - 4, 6, 6, 1, 1, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(217, 90, 19);
    doc.text(String(num), margin + 3, y + 0.3, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(11, 31, 58);
    doc.text(headingText, margin + 9, y + 0.5);
    y += 6.5;
  }

  // Helper for Paragraph Text
  function addParagraph(text, isBold = false, indent = 0) {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    const lines = doc.splitTextToSize(text, contentWidth - indent);
    const blockHeight = lines.length * 4.2;
    ensureSpace(blockHeight + 2);

    doc.text(lines, margin + indent, y);
    y += blockHeight + 2.5;
  }

  // Helper for Bullet Point
  function addBullet(bulletTitle, bulletText) {
    ensureSpace(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);

    const prefix = `•  ${bulletTitle ? bulletTitle + ': ' : ''}`;
    const prefixWidth = doc.getTextWidth(prefix);
    
    doc.text('•', margin + 2, y);

    if (bulletTitle) {
      doc.text(bulletTitle + ': ', margin + 5, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      
      const remainingWidth = contentWidth - 5 - (prefixWidth - 3);
      const lines = doc.splitTextToSize(bulletText, contentWidth - 8);
      // If single line fits after prefix
      const firstLineWords = doc.splitTextToSize(bulletText, contentWidth - 5 - doc.getTextWidth(bulletTitle + ': '));
      if (firstLineWords.length === 1) {
        doc.text(firstLineWords[0], margin + 5 + doc.getTextWidth(bulletTitle + ': '), y);
        y += 4.5;
      } else {
        const fullLines = doc.splitTextToSize(bulletTitle + ': ' + bulletText, contentWidth - 6);
        const bHeight = fullLines.length * 4.2;
        ensureSpace(bHeight);
        // re-render clean bullet
        doc.text(fullLines, margin + 5, y);
        y += bHeight + 1.5;
      }
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const lines = doc.splitTextToSize(bulletText, contentWidth - 8);
      const bHeight = lines.length * 4.2;
      ensureSpace(bHeight);
      doc.text(lines, margin + 5, y);
      y += bHeight + 1.5;
    }
  }

  // =========================================================
  // DOCUMENT CONTENT
  // =========================================================
  if (isPrivacy) {
    addParagraph('Josan Logistics Pte. Ltd. ("we", "our", or "us") is dedicated to protecting your privacy and complying with the Singapore Personal Data Protection Act 2012 (PDPA). This Privacy Policy explains how we collect, use, disclose, and safeguard personal and consignment information when you visit our website, submit quotation requests, track shipments, or engage our services.', true);

    addSectionHeading(1, 'Scope & Singapore Jurisdiction');
    addParagraph('This website and our logistics services are primarily directed to commercial businesses and individual shippers located in the Republic of Singapore. Our online quote requests, customer account portals, shipment tracking systems, and communications are tailored for Singapore domestic operations and international freight coordination originating from or terminating in Singapore.');

    addSectionHeading(2, 'Information We Collect');
    addParagraph('In the course of providing freight logistics and documentation services, we collect:');
    addBullet('Contact Information', 'Full name, company name, business and personal email address, and telephone number.');
    addBullet('Consignment Details', 'Cargo descriptions, collection and delivery addresses, gross weight, volume/dimensions, parcel count, and handling requirements.');
    addBullet('Shipment Documents', 'Commercial invoices, packing lists, Air Waybill (AWB) instructions, and customs-related paperwork provided by the shipper.');
    addBullet('Security & Verification', 'IP addresses, browser details, and anti-spam verification tokens (Cloudflare Turnstile) to prevent automated abuse.');

    addSectionHeading(3, 'Purposes of Data Collection & Use');
    addParagraph('Your personal and consignment data is processed solely for legitimate operational logistics purposes, including:');
    addBullet('Quotation & Booking', 'Preparing competitive freight quotations, confirming bookings, and processing dispatch instructions.');
    addBullet('Operations Coordination', 'Coordinating collection, road transportation, and delivery with our verified road hauliers and commercial airline partners.');
    addBullet('Tracking & Status Updates', 'Providing milestone tracking notifications and electronic Proof of Delivery (e-POD) records.');
    addBullet('Legal & Regulatory Compliance', 'Maintaining statutory trade records and financial documentation required under Singapore law.');

    addSectionHeading(4, 'Third-Party Service Providers Policy');
    addParagraph('Josan Logistics Pte. Ltd. may share personal data with authorised third-party service providers, including transport partners, airlines, freight handlers, cloud hosting providers, email service providers, and technology vendors, where necessary to deliver our services. We take reasonable steps to ensure that these providers protect personal data, maintain confidentiality, and process information only for authorised purposes and in accordance with applicable data protection laws.');

    addSectionHeading(5, 'Overseas Transfers');
    addParagraph('Where international freight requires sharing shipment details with overseas airlines, freight handlers, or foreign destination partners, we take reasonable steps to ensure that the recipient provides a standard of data protection comparable to Singapore PDPA requirements.');

    addSectionHeading(6, 'Data Retention and Secure Deletion Policy');
    addParagraph('Josan Logistics Pte. Ltd. retains personal data only for as long as necessary to fulfil business purposes, provide logistics services, comply with legal and regulatory obligations, and resolve disputes.');
    addBullet('Commercial & Financial Records', 'Commercial, tax, customs, and accounting records may be retained for five to seven years, where applicable under Singapore law.');
    addBullet('Enquiries & Chatbot Logs', 'Website enquiries and chatbot communication logs may be deleted after 30 days where they are no longer required.');
    addBullet('Secure Disposal', 'When data is no longer needed, we take reasonable steps to securely delete, anonymise, or dispose of it, subject to applicable legal requirements.');

    addSectionHeading(7, 'Consent and Communication Preferences');
    addParagraph('Josan Logistics Pte. Ltd. collects, uses, and discloses personal data in accordance with applicable data protection laws. Where consent is required, we will obtain it before processing personal data for the relevant purpose. Individuals may withdraw their consent by contacting our Data Protection Officer, subject to legal and contractual restrictions. We may continue to send essential service-related communications, including shipment updates, booking confirmations, and legal notices, where necessary.');

    addSectionHeading(8, "Children's Privacy Policy");
    addParagraph('The Josan Logistics website and services are primarily intended for businesses and adults arranging logistics and freight services. We do not knowingly collect personal data from children unless necessary for a legitimate and lawful service-related purpose. Any such information will be handled in accordance with applicable laws. If you believe that a child has provided personal data to us inappropriately, contact our Data Protection Officer so that we can review the matter and take appropriate action.');

    addSectionHeading(9, 'Do Not Track and Cookie Preferences');
    addParagraph('Our website may use cookies and similar technologies to support website functionality, security, and user preferences. Where analytics or other non-essential cookies are used, relevant information and available choices will be provided through the website or an appropriate cookie notice. Users may manage or disable cookies through their browser settings, although some website features may not function properly as a result. We will handle tracking preferences in accordance with applicable laws and the technologies actually implemented on our website.');

    addSectionHeading(10, 'Data Security Safeguards');
    addParagraph('We maintain administrative, technical, and physical safeguards to prevent unauthorized access, disclosure, or alteration of your records. All web transmission is protected by TLS encryption, passwords are encrypted using bcrypt hashing, and staff access requires Two-Factor Authentication (2FA).');

    addSectionHeading(11, 'Policy Updates and Effective Date');
    addParagraph('Josan Logistics Pte. Ltd. may update this Privacy Policy from time to time to reflect changes in our services, business operations, technology, or applicable legal requirements. The revised policy will be published on our website with an updated "Last Updated" date. Where required by law, we will provide additional notice or obtain consent before implementing relevant changes. Users are encouraged to review this policy periodically.');
    addBullet('Effective Date', '29 October 2026');

    addSectionHeading(12, 'Complaints and Dispute Resolution');
    addParagraph('Individuals who have questions, concerns, or complaints regarding the collection, use, disclosure, or protection of their personal data may contact our Data Protection Officer. We will review complaints, investigate relevant circumstances, and take appropriate corrective action where necessary. We aim to respond within the timeframe required by applicable law. If a complaint cannot be resolved directly, individuals may refer the matter to the relevant Singapore authority, including the Personal Data Protection Commission (PDPC), where appropriate.');

    addSectionHeading(13, 'Data Protection Officer (DPO) Contact Details');
    addParagraph('Individuals who have questions, concerns, or wish to exercise their data rights may contact our appointed Data Protection Officer:');
    addBullet('Organization', companyName);
    addBullet('Email', contactEmail);
    addBullet('Address', registeredOffice);
    addBullet('Telephone', phone);

  } else {
    // TERMS OF SERVICE
    addParagraph('These Terms of Service ("Terms") govern commercial road transportation coordination, Air Waybill (AWB) preparation, tracking, billing, and shipment documentation services provided by Josan Logistics Pte. Ltd. ("Josan Logistics", "we", or "us"). By engaging our services, requesting a quotation, or using our digital platforms, you ("Shipper", "Customer", or "User") agree to be bound by these Terms.', true);

    addSectionHeading(1, 'Scope of Services & Capacity');
    addParagraph('Josan Logistics Pte. Ltd. operates strictly as an independent freight coordinator and logistics agent. Our services comprise commercial road transportation coordination through independent, verified road hauliers and shipment documentation support (including AWB preparation for partner commercial airlines). Josan Logistics does not directly operate a commercial air carrier fleet or act as a licensed customs broker.');

    addSectionHeading(2, 'Shipper Obligations & Declarations');
    addParagraph('The Shipper represents and warrants that:');
    addBullet('Cargo Lawfulness', 'All cargo tendered is lawful, complies with Singapore laws and international aviation regulations, and contains no undeclared dangerous goods (DGR), prohibited contraband, or restricted items.');
    addBullet('Packaging Standards', 'All consignments are adequately packed, labeled, cushioned, and sealed to withstand normal rigors of road and air transit.');
    addBullet('Accurate Information', 'Weight, dimensions, piece count, commodity descriptions, and pickup/delivery addresses provided are complete and accurate.');

    addSectionHeading(3, 'Documentation Responsibility');
    addParagraph('While Josan Logistics assists in preparing Air Waybills (AWBs), delivery notes, and export consignment paperwork, the Shipper bears ultimate responsibility for ensuring that commercial invoices, packing lists, certificates of origin, and import/export declarations satisfy all destination and Singapore customs mandates.');

    addSectionHeading(4, 'Quotations, Rates & Payment Terms');
    addParagraph('All quotations are provided in Singapore Dollars (SGD) unless expressly stated otherwise and are valid for 7 calendar days from issuance. Rates are based on information supplied by the Shipper and are subject to verification of actual gross weight and volumetric dimensions (chargeable weight). Payment terms are strictly 7 days from invoice date for approved commercial credit accounts, or full prepayment for non-account holders.');

    addSectionHeading(5, 'Cancellations & Amendments');
    addParagraph('Shipment booking cancellations made less than 4 hours prior to scheduled pickup, or after dispatch of transport equipment, may incur a standard abortive trip fee of 50% to 100% of the transport charge.');

    addSectionHeading(6, 'Loading, Unloading & Demurrage');
    addParagraph('A standard grace period of 60 minutes is allocated for cargo loading and unloading at each location. Waiting time exceeding the grace period will be billed as vehicle demurrage at standard hourly rates.');

    addSectionHeading(7, 'Tracking & Status Disclaimers');
    addParagraph('Shipment tracking numbers and transit milestone updates provided through our website or customer portal are operational estimates subject to road traffic conditions, terminal wait times, and flight schedules.');

    addSectionHeading(8, 'Limitation of Liability & Cargo Insurance');
    addParagraph('Cargo insurance is NOT included in standard freight quotations unless requested and confirmed in writing prior to dispatch. Where liability is established by law:');
    addBullet('Road Freight', 'Liability for loss or damage during road carriage coordinated by us is strictly limited in accordance with the standard terms of the appointed haulier or a maximum of SGD 5.00 per kilogram of gross weight affected, whichever is lower.');
    addBullet('Air Freight', 'Air carriage coordination is governed by the rules and liability limits of the Warsaw Convention or Montreal Convention as applicable to the issuing airline.');
    addBullet('Consequential Loss', 'In no event shall Josan Logistics be liable for indirect, incidental, special, or consequential damages, including loss of profits, business opportunity, or market delay.');

    addSectionHeading(9, 'Claims & Discrepancy Reporting');
    addParagraph('Any notice of loss, shortage, or external damage must be endorsed on the physical or electronic Proof of Delivery (e-POD) upon handover. Formal written notice of claim must be submitted to Josan Logistics within 48 hours of delivery.');

    addSectionHeading(10, 'Use of the Website');
    addParagraph('By accessing this website, the Quote Request portal, and the JOSAN AI chatbot, you agree to use them solely for legitimate commercial freight inquiries and logistics coordination, without engaging in automated data harvesting, malicious disruption, or submission of fraudulent information.');

    addSectionHeading(11, 'Governing Law & Jurisdiction');
    addParagraph('These Terms of Service and all service agreements between Josan Logistics Pte. Ltd. and the Customer shall be governed by and construed in accordance with the laws of the Republic of Singapore. Any disputes arising out of or in connection with our services shall be subject to the exclusive jurisdiction of the Courts of Singapore.');

    addSectionHeading(12, 'Force Majeure');
    addParagraph('Neither party shall be held liable for any delay, interruption, or failure to perform its obligations under these Terms where such delay or failure results from events beyond its reasonable control (including natural disasters, floods, extreme weather, fires, epidemics, strikes, civil unrest, war, government restrictions, or transport disruptions). Affected obligations shall be suspended for the duration of the event to the extent permitted by applicable law.');

    addSectionHeading(13, 'Additional Charges and Surcharges');
    addParagraph('All quotations are based on shipment information provided at the time of quotation. Additional charges may apply for variations in cargo weight, dimensions, characteristics, locations, fuel surcharges, storage, extended waiting time, additional handling, re-delivery, return transportation, customs expenses, or unforeseen operational requirements. Supported additional charges remain the responsibility of the Customer.');

    addSectionHeading(14, 'Failed Delivery and Return Shipments');
    addParagraph('The Customer is responsible for accurate addresses and recipient information. If delivery cannot be completed due to incorrect address, unavailability, refusal, documentation defects, or regulatory restrictions, the shipment may be held, stored, returned, or re-delivered, with applicable storage and transport charges payable by the Customer.');

    addSectionHeading(15, 'Prohibited Goods and Regulatory Compliance');
    addParagraph('The Customer shall ensure all goods comply with applicable Singapore laws, destination regulations, and carrier policies. Prohibited, undeclared dangerous, illegal, or counterfeit goods must not be tendered. Josan Logistics reserves the right to refuse or cancel non-compliant consignments, and the Customer shall be responsible for losses, penalties, or claims arising from unlawful or misdeclared cargo.');

    addSectionHeading(16, 'Data Privacy and Confidentiality');
    addParagraph('Josan Logistics may collect and process personal, commercial, and shipment-related information necessary to provide logistics coordination, documentation, transport arrangements, and legal compliance in accordance with the Singapore Personal Data Protection Act 2012 (PDPA). Information is protected with technical security safeguards and shared only with authorized partners on a need-to-know basis.');

    addSectionHeading(17, 'Third-Party Service Providers');
    addParagraph('Josan Logistics may engage independent third-party hauliers, airlines, warehouses, and logistics providers to facilitate requested services. Services performed by third-party providers may be subject to their respective operational conditions and statutory liability limits.');

    addSectionHeading(18, 'Suspension or Termination of Services');
    addParagraph('Josan Logistics may suspend, refuse, or terminate services where the Customer materially breaches these Terms, defaults on payments, provides false information, tenders prohibited goods, or creates safety concerns. Incurred charges remain payable.');

    addSectionHeading(19, 'Amendments to Terms');
    addParagraph('Josan Logistics may revise these Terms from time to time. The latest version shall be published on the company website with the applicable effective date (Effective Date: 29 October 2026). Revised terms apply to services booked on or after their effective date.');

    addSectionHeading(20, 'Severability and Entire Agreement');
    addParagraph('If any provision is held invalid or unenforceable, remaining provisions remain in full force. These Terms, together with confirmed quotations or booking agreements, constitute the entire agreement between Josan Logistics and the Customer.');

    addSectionHeading(21, 'Corporate Contact & Notices');
    addParagraph('Formal legal notices and inquiries regarding these Terms should be addressed to:');
    addBullet('Company', companyName);
    addBullet('Email', contactEmail);
    addBullet('Address', registeredOffice);
    addBullet('Hotline', phone);
  }

  // Multi-page footer pagination (Page X of Y)
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Josan Logistics Pte. Ltd. — Official Singapore Legal Terms', margin, pageHeight - 7);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  // Trigger safe download
  safeDownloadPdf(doc, filename);
  return filename;
}
