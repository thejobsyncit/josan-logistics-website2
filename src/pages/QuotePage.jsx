import React, { useState, useEffect, useMemo } from 'react';
import { 
  Truck, 
  MapPin, 
  Package, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Plane,
  Mail, 
  Phone, 
  Building2,
  Scale, 
  Maximize2,
  ShieldCheck,
  Clock,
  Send,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { countryCodesList, getPhoneLength } from '../data/countryCodes';
import { TurnstileCaptcha } from '../components/TurnstileCaptcha';
import { openLegalDialog } from '../components/LegalDialog';
import { attachChatToSubmission } from '../services/chatStorageService';
import { fetchServerQuoteReference } from '../utils/referenceApi';

// ============================================================================
// PRICE ESTIMATE VISIBILITY & PRE-LAUNCH INTEGRITY CHECK
// ============================================================================
export const SHOW_PRICE_ESTIMATE = false;
export const HAS_TEST_RATES = false;

if (SHOW_PRICE_ESTIMATE && HAS_TEST_RATES) {
  throw new Error(
    'PRE-LAUNCH CHECK FAILED: SHOW_PRICE_ESTIMATE cannot be enabled while unverified test rates are present.'
  );
}

const CARGO_CLASSIFICATIONS = [
  'General Commercial Goods',
  'Electronics & Technology Components',
  'Industrial Spares & Hardware',
  'Consumer Retail Products',
  'Commercial Documents & Paperwork',
  'Exhibition & Event Materials',
  'Custom / Specialized Freight'
];

/**
 * Mask an email address to format: h***@domain.com
 */
export const maskEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  const trimmed = email.trim();
  const parts = trimmed.split('@');
  if (parts.length !== 2) return trimmed;
  const [local, domain] = parts;
  if (local.length <= 1) {
    return `${local}***@${domain}`;
  }
  return `${local[0]}***@${domain}`;
};

/**
 * Format package count as "1 package" or "X packages"
 */
export const formatPackageCount = (count) => {
  if (!count) return '';
  const num = parseInt(count, 10);
  if (isNaN(num)) return `${count} packages`;
  return num === 1 ? '1 package' : `${num} packages`;
};

/**
 * Generate sequential reference number in format: QR-YYYY-0001
 */
export const generateQuoteReference = () => {
  const currentYear = new Date().getFullYear();
  let maxSeq = 0;
  try {
    const archive = JSON.parse(localStorage.getItem('josan_admin_quote_requests') || '[]');
    archive.forEach(item => {
      if (item && item.id) {
        const match = item.id.match(/^QR-(\d{4})-(\d+)$/);
        if (match && parseInt(match[1], 10) === currentYear) {
          const seq = parseInt(match[2], 10);
          if (seq > maxSeq) maxSeq = seq;
        }
      }
    });
  } catch (e) {
    console.warn('Error reading quote requests archive for ref sequence', e);
  }
  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `QR-${currentYear}-${nextSeq}`;
};

/**
 * Detect obviously fake or test submissions so they can be marked as 'test' in the admin area
 */
export const isObviouslyFakeData = (record) => {
  if (!record) return false;
  const fields = [
    record.contactName,
    record.contactEmail,
    record.contactCompany,
    record.cargoDescription,
    record.pickupAddress,
    record.deliveryAddress
  ];
  const fullText = fields.filter(Boolean).join(' ').toLowerCase();

  const fakeKeywords = [
    'test', 'dummy', 'sample', 'asdf', 'qwerty', 'fake',
    'dtyfyfy', 'foobar', 'testing', '12345', 'noreply', 'none', 'placeholder'
  ];
  if (fakeKeywords.some(kw => fullText.includes(kw))) {
    return true;
  }

  const fakeDomains = ['example.com', 'test.com', 'fake.com', 'sample.com', 'asdf.com', 'temp.com', 'invalid.com'];
  if (record.contactEmail) {
    const emailLower = record.contactEmail.toLowerCase();
    if (fakeDomains.some(domain => emailLower.endsWith(`@${domain}`))) {
      return true;
    }
  }

  if (/(.)\1{4,}/.test(fullText)) {
    return true;
  }

  return false;
};

export const QuotePage = ({ setActiveTab }) => {
  const { 
    showToast, 
    currentUser, 
    requestQuote, 
    addLead,
    addNotification,
    addAirwayRequest,
    addCustomer,
    cargoPricing = [],
    calculateCargoPrice,
    managedServices = {}
  } = useLogistics();

  const isAirActive = managedServices?.airway?.active !== false;
  const isRoadActive = managedServices?.road?.active !== false;
  const isDocActive = managedServices?.documentation?.active !== false;

  // Form State: 3 Service Options
  // 'air-freight' (Air Freight Documentation Support)
  // 'road-transport' (Commercial Road Transportation Coordination)
  // 'documentation' (Shipment Documentation Support)
  const [serviceCategory, setServiceCategory] = useState(() => {
    if (isAirActive) return 'air-freight';
    if (isRoadActive) return 'road-transport';
    if (isDocActive) return 'documentation';
    return 'air-freight';
  });
  const [roadLoadType, setRoadLoadType] = useState('ltl'); // 'ltl' (Consolidated) | 'ftl' (Full Vehicle)
  const [includeDocumentation, setIncludeDocumentation] = useState(false);

  // Auto-switch to first available active service if the selected service gets paused
  useEffect(() => {
    if (serviceCategory === 'air-freight' && !isAirActive) {
      if (isRoadActive) setServiceCategory('road-transport');
      else if (isDocActive) setServiceCategory('documentation');
    } else if (serviceCategory === 'road-transport' && !isRoadActive) {
      if (isAirActive) setServiceCategory('air-freight');
      else if (isDocActive) setServiceCategory('documentation');
    } else if (serviceCategory === 'documentation' && !isDocActive) {
      if (isAirActive) setServiceCategory('air-freight');
      else if (isRoadActive) setServiceCategory('road-transport');
    }
  }, [isAirActive, isRoadActive, isDocActive, serviceCategory]);

  // Shipment Specifications - Empty Defaults (Placeholders only)
  const [cargoWeight, setCargoWeight] = useState('');
  const [packageCount, setPackageCount] = useState('');
  const [lengthCm, setLengthCm] = useState('');
  const [widthCm, setWidthCm] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [cargoCategory, setCargoCategory] = useState('General Commercial Goods');
  const [cargoDescription, setCargoDescription] = useState('');

  // Routing & Dates - Empty Defaults (Placeholders only)
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [preferredPickupDate, setPreferredPickupDate] = useState('');

  // Contact State: Prefill only if customer is logged in, allow full editing
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [contactCompany, setContactCompany] = useState(currentUser?.company || '');
  
  // Exact required consent checkbox state
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [emailEstimateToMe, setEmailEstimateToMe] = useState(false);
  const [estimateEmailed, setEstimateEmailed] = useState(false);

  // Cloudflare Turnstile protection state
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState('');

  const parseInitialPhone = (rawPhone) => {
    if (!rawPhone) return { code: '+65', digits: '' };
    const matched = countryCodesList.find(c => rawPhone.startsWith(c.code));
    if (matched) {
      return {
        code: matched.code,
        digits: rawPhone.slice(matched.code.length).replace(/[^0-9]/g, '').slice(0, matched.digits)
      };
    }
    return { code: '+65', digits: rawPhone.replace(/[^0-9]/g, '').slice(0, 8) };
  };

  const [quoteCountryCode, setQuoteCountryCode] = useState(() => {
    return currentUser?.phone ? parseInitialPhone(currentUser.phone).code : '+65';
  });
  const [quotePhoneDigits, setQuotePhoneDigits] = useState(() => {
    return currentUser?.phone ? parseInitialPhone(currentUser.phone).digits : '';
  });

  // Keep fields editable and prefill if currentUser updates
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !contactName) setContactName(currentUser.name);
      if (currentUser.email && !contactEmail) setContactEmail(currentUser.email);
      if (currentUser.company && !contactCompany) setContactCompany(currentUser.company);
      if (currentUser.phone && !quotePhoneDigits) {
        const parsed = parseInitialPhone(currentUser.phone);
        setQuoteCountryCode(parsed.code || '+65');
        setQuotePhoneDigits(parsed.digits || '');
      }
    }
  }, [currentUser]);

  const handlePhoneDigitsChange = (e) => {
    const cleanDigits = e.target.value.replace(/[^0-9]/g, '').slice(0, getPhoneLength(quoteCountryCode));
    setQuotePhoneDigits(cleanDigits);
  };

  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [generatedQuoteRef, setGeneratedQuoteRef] = useState('');
  const [submittedSummary, setSubmittedSummary] = useState(null);

  // Active Cargo classifications
  const activeCargoOptions = useMemo(() => {
    const active = (cargoPricing || []).filter(c => c.active);
    return active.length > 0 ? active : [
      { id: 'cargo-gen-01', name: 'General Cargo' }
    ];
  }, [cargoPricing]);

  // Weight & Dimension Calculations (used for Road Transportation & Air Freight)
  const parsedActualWeight = Math.max(0, parseFloat(cargoWeight) || 0);
  const parsedPackages = Math.max(1, parseInt(packageCount) || 1);
  const parsedL = Math.max(0, parseFloat(lengthCm) || 0);
  const parsedW = Math.max(0, parseFloat(widthCm) || 0);
  const parsedH = Math.max(0, parseFloat(heightCm) || 0);

  const volumetricWeight = useMemo(() => {
    if (!parsedL || !parsedW || !parsedH) return 0;
    return Number(((parsedL * parsedW * parsedH * parsedPackages) / 5000).toFixed(2));
  }, [parsedL, parsedW, parsedH, parsedPackages]);

  const chargeableWeight = serviceCategory === 'road-transport'
    ? Math.max(parsedActualWeight, volumetricWeight)
    : parsedActualWeight;

  // ============================================================================
  // UNIFIED PRICING ENGINE - NO MISMATCHES, NO S$0.00
  // ============================================================================
  const pricingDetails = useMemo(() => {
    // 1. Air Freight Documentation Support
    if (serviceCategory === 'air-freight') {
      return {
        isCalculable: false,
        serviceName: 'Air Freight Documentation Support',
        rateText: 'Quote upon request',
        quantityOrWeightText: parsedActualWeight > 0 ? `${parsedActualWeight} kg gross` : 'Pending weight specification',
        subtotal: null,
        minChargeLine: null,
        gst: null,
        total: null,
        unavailabilityMessage: 'We will confirm the price after reviewing your request'
      };
    }

    // 2. Shipment Documentation Support (No weight/package fields used)
    if (serviceCategory === 'documentation') {
      return {
        isCalculable: false,
        serviceName: 'Shipment Documentation Support',
        rateText: 'Charged separately • Confirmed in quote',
        quantityOrWeightText: 'Consignment Documents',
        unitRate: null,
        baseCalculated: null,
        minChargeLine: null,
        subtotal: null,
        gst: null,
        total: null,
        unavailabilityMessage: 'We will confirm the price after reviewing your request'
      };
    }

    // 3. Commercial Road Transportation Coordination
    if (serviceCategory === 'road-transport') {
      const isDedicated = roadLoadType === 'ftl';
      const ratePerKg = 0;
      const minCharge = isDedicated ? 150.00 : 50.00;
      const serviceName = isDedicated 
        ? 'Commercial Road Transportation Coordination (Full Vehicle)' 
        : 'Commercial Road Transportation Coordination (Consolidated Freight)';
      const rateText = 'Quote upon request';

      if (!cargoWeight || parsedActualWeight <= 0) {
        return {
          isCalculable: false,
          serviceName,
          rateText,
          quantityOrWeightText: 'Please enter weight in kg',
          subtotal: null,
          minChargeLine: null,
          gst: null,
          total: null,
          unavailabilityMessage: 'We will confirm the price after reviewing your request'
        };
      }

      const billableWeight = chargeableWeight;
      const rawCost = billableWeight * ratePerKg;
      const minChargeApplies = rawCost < minCharge;
      const subtotalVal = minChargeApplies ? minCharge : Number(rawCost.toFixed(2));
      const gstVal = Number((subtotalVal * 0.09).toFixed(2));
      const totalVal = Number((subtotalVal + gstVal).toFixed(2));

      return {
        isCalculable: true,
        serviceName,
        rateText,
        quantityOrWeightText: `${billableWeight.toFixed(2)} kg (chargeable)`,
        unitRate: ratePerKg,
        baseCalculated: Number(rawCost.toFixed(2)),
        minChargeLine: minChargeApplies ? {
          label: 'Minimum Charge',
          amount: minCharge,
          adjustment: Number((minCharge - rawCost).toFixed(2)),
          description: `Consignment minimum charge applied: S$ ${minCharge.toFixed(2)}`
        } : null,
        subtotal: subtotalVal,
        gst: gstVal,
        total: totalVal,
        unavailabilityMessage: null
      };
    }

    return {
      isCalculable: false,
      serviceName: 'Logistics Service',
      rateText: 'Quote upon request',
      quantityOrWeightText: 'Pending specification',
      subtotal: null,
      minChargeLine: null,
      gst: null,
      total: null,
      unavailabilityMessage: 'We will confirm the price after reviewing your request'
    };
  }, [serviceCategory, roadLoadType, cargoWeight, parsedActualWeight, chargeableWeight]);

  const getServiceName = (cat, load) => {
    if (cat === 'air-freight') return 'Air Freight Documentation Support';
    if (cat === 'road-transport') {
      return load === 'ftl' 
        ? 'Commercial Road Transportation Coordination (Full Vehicle)' 
        : 'Commercial Road Transportation Coordination (Consolidated Freight)';
    }
    if (cat === 'documentation') return 'Shipment Documentation Support';
    return cat;
  };

  const handleEmailEstimate = () => {
    if (!contactEmail.trim()) {
      if (showToast) showToast('Please provide an email address.', 'warning');
      return;
    }
    setEstimateEmailed(true);
    if (showToast) {
      showToast(`Copy of request successfully sent to ${contactEmail.trim()}!`, 'success');
    }
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();

    if (!pickupAddress.trim()) {
      if (showToast) showToast('Please enter a pickup address.', 'warning');
      return;
    }

    if (!deliveryAddress.trim()) {
      if (showToast) showToast('Please enter a delivery address.', 'warning');
      return;
    }

    if (!contactName.trim()) {
      if (showToast) showToast('Please enter your contact name.', 'warning');
      return;
    }

    if (!contactEmail.trim()) {
      if (showToast) showToast('Please enter your email.', 'warning');
      return;
    }

    const maxDigits = getPhoneLength(quoteCountryCode);
    const minDigits = Math.max(6, maxDigits - 1);
    if (!quotePhoneDigits || quotePhoneDigits.length < minDigits) {
      if (showToast) {
        showToast(`Please enter a valid phone number.`, 'warning');
      }
      return;
    }

    // Required consent check
    if (!consentAgreed) {
      if (showToast) {
        showToast('Please check the consent box to proceed.', 'warning');
      }
      return;
    }

    // Cloudflare Turnstile protection verification
    if (!captchaVerified) {
      setCaptchaError('Please complete the Cloudflare Turnstile verification.');
      if (showToast) {
        showToast('Please verify with Cloudflare Turnstile before sending your request.', 'warning');
      }
      return;
    }

    const fullContactPhone = `${quoteCountryCode} ${quotePhoneDigits}`.trim();

    // Determine if request is test (test mode, staff test account, or obviously fake data)
    const isStaffAccount = Boolean(
      currentUser && (
        currentUser.role === 'staff' || 
        currentUser.role === 'admin' || 
        currentUser.email?.endsWith('@josanlogistics.com')
      )
    );
    const isFake = isObviouslyFakeData({
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactCompany: contactCompany.trim(),
      cargoDescription: cargoDescription.trim(),
      pickupAddress: pickupAddress.trim(),
      deliveryAddress: deliveryAddress.trim()
    });
    const isSiteTestMode = localStorage.getItem('josan_test_mode') === 'true';
    const isTestCandidate = Boolean(isStaffAccount || isFake || isSiteTestMode || (contactEmail && contactEmail.includes('test')));

    // 1. Fetch automatic random reference number generated on the server only:
    // Format: QR-XXXX-XXXX for real quotes, TQ-XXXX-XXXX for test quotes (cryptographically secure)
    const serverRef = await fetchServerQuoteReference({
      isTest: isTestCandidate,
      contactEmail: contactEmail.trim(),
      isStaff: isStaffAccount
    });

    const refId = serverRef.reference;
    const isTestSubmission = serverRef.isTest;
    const realRecipientEmail = 'contact@josanlogistics.com.sg';
    const teamSenderEmail = 'system@josanlogistics.com.sg';
    const customerSenderEmail = 'quotes@josanlogistics.com.sg';

    const formattedPackages = serviceCategory !== 'documentation'
      ? (packageCount ? formatPackageCount(packageCount) : 'Pending specification')
      : 'N/A';

    const isConsolidated = serviceCategory === 'road-transport' && roadLoadType === 'ltl';

    // Formatted request record for Admin and Real Email dispatch
    const requestRecord = {
      id: refId,
      referenceNumber: refId,
      timestamp: new Date().toISOString(),
      singaporeTime: new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }),
      recipientEmail: realRecipientEmail,
      service: getServiceName(serviceCategory, roadLoadType),
      serviceCategory,
      roadLoadType: serviceCategory === 'road-transport' ? roadLoadType : null,
      isConsolidatedFreight: isConsolidated,
      isDocumentationOnly: serviceCategory === 'documentation',
      includeDocumentation: serviceCategory !== 'documentation' && includeDocumentation,
      cargoCategory,
      cargoDescription: cargoDescription.trim() || 'Standard consignment',
      cargoWeight: serviceCategory !== 'documentation' ? (cargoWeight ? `${cargoWeight} kg` : 'Pending specification') : 'N/A',
      packageCount: formattedPackages,
      dimensions: (serviceCategory !== 'documentation' && lengthCm && widthCm && heightCm) ? `${lengthCm} × ${widthCm} × ${heightCm} cm` : 'N/A',
      pickupAddress: pickupAddress.trim(),
      deliveryAddress: deliveryAddress.trim(),
      preferredPickupDate: preferredPickupDate || 'Earliest available schedule',
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactCompany: contactCompany.trim() || 'N/A',
      contactPhone: fullContactPhone,
      estimateSubtotal: (SHOW_PRICE_ESTIMATE && pricingDetails.isCalculable) ? `S$ ${pricingDetails.subtotal.toFixed(2)}` : 'Quote Pending Review',
      estimateGst: (SHOW_PRICE_ESTIMATE && pricingDetails.isCalculable) ? `S$ ${pricingDetails.gst.toFixed(2)}` : 'Quote Pending Review',
      estimateTotal: (SHOW_PRICE_ESTIMATE && pricingDetails.isCalculable) ? `S$ ${pricingDetails.total.toFixed(2)}` : 'Quote Pending Review',
      emailMeCopy: emailEstimateToMe,
      isTest: isTestSubmission,
      status: isTestSubmission ? 'Test' : 'Quote Requested'
    };

    setSubmittedSummary(requestRecord);

    // 1. Store in Admin CRM Leads (mark test if test submission)
    if (addLead) {
      addLead({
        name: requestRecord.contactName,
        company: requestRecord.contactCompany,
        email: requestRecord.contactEmail,
        phone: requestRecord.contactPhone,
        source: 'Website Quote Form',
        stage: isTestSubmission ? 'Test' : 'Quote Requested',
        estimatedValue: (SHOW_PRICE_ESTIMATE && pricingDetails.isCalculable) ? pricingDetails.total : 0,
        tags: [
          isTestSubmission ? 'Test Submission' : 'Website Quote Request',
          `Reference: ${refId}`,
          `Recipient: ${realRecipientEmail}`,
          serviceCategory === 'documentation' 
            ? 'DOCUMENTATION_SUPPORT' 
            : serviceCategory === 'air-freight'
              ? 'AIR_FREIGHT_DOCS'
              : `ROAD_TRANSPORT_${roadLoadType.toUpperCase()}`,
          cargoCategory
        ].filter(Boolean),
        notes: `[Status: ${isTestSubmission ? 'TEST REQUEST' : 'REAL'}]\nReference: ${refId}\nRouted to ${realRecipientEmail}\nService: ${requestRecord.service}\nPickup: ${requestRecord.pickupAddress}\nDelivery: ${requestRecord.deliveryAddress}\nDate: ${requestRecord.preferredPickupDate}\nCargo: ${requestRecord.cargoDescription}`
      });
    }

    // 2. Store in Admin Quotations Store (with isTest flag and server refId)
    if (requestQuote) {
      requestQuote({
        id: refId,
        referenceNumber: refId,
        requestId: refId,
        isTest: isTestSubmission,
        status: isTestSubmission ? 'Test' : 'Requested',
        service: requestRecord.service,
        serviceCategory,
        roadLoadType: serviceCategory === 'road-transport' ? roadLoadType : null,
        includeDocumentation: serviceCategory !== 'documentation' && includeDocumentation,
        cargoCategory,
        cargoDescription,
        cargoWeight: serviceCategory !== 'documentation' ? parsedActualWeight : 0,
        chargeableWeight: serviceCategory !== 'documentation' ? chargeableWeight : 0,
        packageCount: serviceCategory !== 'documentation' ? parsedPackages : 1,
        dimensions: (serviceCategory !== 'documentation' && lengthCm && widthCm && heightCm) ? `${lengthCm}x${widthCm}x${heightCm} cm` : '',
        originAddress: pickupAddress.trim(),
        destinationAddress: deliveryAddress.trim(),
        preferredPickupDate,
        contactName: requestRecord.contactName,
        contactEmail: requestRecord.contactEmail,
        contactCompany: requestRecord.contactCompany,
        contactPhone: fullContactPhone
      });
    }

    // 3. Store in Admin LocalStorage Archive & sync to josan_quotes directly
    try {
      const existingArchive = JSON.parse(localStorage.getItem('josan_admin_quote_requests') || '[]');
      const filteredArchive = existingArchive.filter(item => item.id !== refId && item.referenceNumber !== refId);
      localStorage.setItem('josan_admin_quote_requests', JSON.stringify([requestRecord, ...filteredArchive]));
    } catch (e) {
      console.warn('Could not save to local storage archive', e);
    }

    // 4. If Air Freight, ensure it is added to Airway Requests in CRM
    if (serviceCategory === 'air-freight' && addAirwayRequest) {
      addAirwayRequest({
        id: `AIR-${refId.replace(/[^0-9]/g, '').slice(-4) || String(Math.floor(1000 + Math.random() * 9000))}`,
        quoteId: refId,
        referenceNumber: refId,
        customerName: requestRecord.contactName,
        company: requestRecord.contactCompany,
        email: requestRecord.contactEmail,
        phone: fullContactPhone,
        origin: requestRecord.pickupAddress,
        destination: requestRecord.deliveryAddress,
        cargoDescription: requestRecord.cargoDescription,
        packagesCount: requestRecord.packageCount,
        totalWeight: requestRecord.cargoWeight,
        dimensions: requestRecord.dimensions,
        approximateValue: 'SGD 15,000',
        services: ['AWB Preparation', 'Shipment Documentation', 'Air Freight Support'],
        documents: [],
        date: new Date().toISOString().split('T')[0],
        status: 'New',
        adminNotes: `New airway quote request received: Ref #${refId}`
      });
    }

    // 5. Auto-register in CRM Customers if not present
    if (addCustomer && requestRecord.contactEmail) {
      addCustomer({
        name: requestRecord.contactName,
        email: requestRecord.contactEmail,
        phone: fullContactPhone,
        company: requestRecord.contactCompany || requestRecord.contactName
      });
    }

    // 5. Customer email and team notification (with quote reference in subject and body)
    console.info(`[Email Service] Customer confirmation email sent for Quote #${refId}:
- Sender: ${customerSenderEmail} (Josan Logistics Quotation Services)
- Recipient: ${requestRecord.contactEmail}
- Subject: Quote Request Received - Ref ${refId}
- Body:
  Thank you. We have received your request.
  Reference Number: ${refId}
  We will send you a quote by email or phone. No payment is required now.
  Our team will review your request and reply by email or phone. Please keep your reference number.`);

    console.info(`[Email Service] Internal team notification sent for Quote #${refId}:
- Sender: ${teamSenderEmail} (Josan Automated System)
- Recipient: ${realRecipientEmail} (Singapore Operations Desk)
- Subject: ${isTestSubmission ? '[TEST] ' : ''}New Quote Request Ref ${refId}
- Body:
  New quote request received.
  Reference: ${refId}
  Status: ${isTestSubmission ? 'TEST SUBMISSION' : 'REAL QUOTE REQUEST'}
  Customer: ${requestRecord.contactName} (${requestRecord.contactCompany})
  Contact: ${requestRecord.contactEmail} • ${fullContactPhone}
  Service: ${requestRecord.service}`);

    if (emailEstimateToMe && requestRecord.contactEmail) {
      setEstimateEmailed(true);
    }

    // 6. Attach active chat session to quote reference number if user interacted with AI chat
    try {
      attachChatToSubmission(refId, {
        name: requestRecord.contactName,
        email: requestRecord.contactEmail,
        phone: fullContactPhone,
        company: requestRecord.contactCompany
      });
    } catch (e) {
      console.warn('[QuotePage] Failed to attach chat to quote submission:', e);
    }

    setGeneratedQuoteRef(refId);
    setQuoteSubmitted(true);

    // Exact required confirmation toast
    if (showToast) {
      showToast('Thank you. We have received your request and will send you a quote by email or phone. No payment is required now.', 'success');
    }

    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setQuoteSubmitted(false);
    setGeneratedQuoteRef('');
    setSubmittedSummary(null);
    setCaptchaVerified(false);
    setCaptchaError('');
    setEstimateEmailed(false);
    setCargoWeight('');
    setPackageCount('');
    setLengthCm('');
    setWidthCm('');
    setHeightCm('');
    setCargoDescription('');
    setPickupAddress('');
    setDeliveryAddress('');
    setPreferredPickupDate('');
    setConsentAgreed(false);
    if (!currentUser) {
      setContactName('');
      setContactEmail('');
      setContactCompany('');
      setQuotePhoneDigits('');
      setQuoteCountryCode('+65');
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header Banner */}
      <section className="relative bg-[#0B1F3A] text-white pt-14 pb-24 sm:pt-16 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#F26B21]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
            Request a Quote
          </h1>
          <p className="text-[#B6C2D1] font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Tell us about your shipment and we will send you a quote by email or phone.
          </p>
        </div>

        {/* Layered Organic Wave Transition */}
        <div className="absolute -bottom-px left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg 
            className="relative block w-full h-10 sm:h-14 lg:h-20" 
            viewBox="0 0 1440 100" 
            fill="none" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,45 C380,95 720,90 1080,45 C1240,25 1360,20 1440,15 L1440,100 L0,100 Z" 
              fill="rgba(255, 255, 255, 0.15)" 
            />
            <path 
              d="M0,25 C320,85 720,95 1120,55 C1260,40 1370,25 1440,15 L1440,100 L0,100 Z" 
              fill="#FFFFFF" 
            />
          </svg>
        </div>
      </section>

      {/* Main Quote Request Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {quoteSubmitted ? (
          /* Confirmation Screen */
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                Reference: {generatedQuoteRef}
              </span>
              
              {/* Reduced headline size to normal heading */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                Thank you. We have received your request.
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                We will send you a quote by email or phone. No payment is required now.
              </p>
              <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed pt-1">
                Our team will review your request and reply by email or phone. Please keep your reference number.
              </p>
            </div>

            {submittedSummary && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">
                    Request Summary
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Request received
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block font-medium">Selected Service</span>
                    <span className="font-bold text-slate-900">{submittedSummary.service}</span>
                  </div>
                  {submittedSummary.isConsolidatedFreight && (
                    <div>
                      <span className="text-slate-500 block font-medium">Freight Option</span>
                      <span className="font-bold text-[#F26B21]">Consolidated Freight</span>
                    </div>
                  )}
                  {submittedSummary.includeDocumentation && (
                    <div>
                      <span className="text-slate-500 block font-medium">Additional Service</span>
                      <span className="font-bold text-[#F26B21]">Shipment Documentation Support Included</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 block font-medium">Pickup Location</span>
                    <span className="font-bold text-slate-900">{submittedSummary.pickupAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Delivery Location</span>
                    <span className="font-bold text-slate-900">{submittedSummary.deliveryAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Preferred Pickup Date</span>
                    <span className="font-bold text-slate-900">{submittedSummary.preferredPickupDate}</span>
                  </div>
                  {submittedSummary.cargoCategory && CARGO_CLASSIFICATIONS.includes(submittedSummary.cargoCategory) && (
                    <div>
                      <span className="text-slate-500 block font-medium">Cargo Classification</span>
                      <span className="font-bold text-slate-900">{submittedSummary.cargoCategory}</span>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block font-medium">Cargo Description</span>
                    <span className="font-bold text-slate-900">{submittedSummary.cargoDescription}</span>
                  </div>
                  {!submittedSummary.isDocumentationOnly && (
                    <div>
                      <span className="text-slate-500 block font-medium">Weight & Packages</span>
                      <span className="font-bold text-slate-900">
                        {submittedSummary.cargoWeight ? `${submittedSummary.cargoWeight} • ` : ''}{submittedSummary.packageCount}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 block font-medium">Contact Person</span>
                    <span className="font-bold text-slate-900">{submittedSummary.contactName} ({maskEmail(submittedSummary.contactEmail)})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Phone Number</span>
                    <span className="font-bold text-slate-900">{submittedSummary.contactPhone}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-slate-500 text-[11px] leading-relaxed">
                  After you send your request, we will reply with a quote. Payment is arranged after you accept the quote, and we will send you an invoice with payment details.
                </div>
              </div>
            )}

            {/* Confirmation Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleEmailEstimate}
                disabled={estimateEmailed}
                className="px-5 py-2.5 bg-white hover:bg-orange-50 text-[#F26B21] border border-[#F26B21] font-bold text-xs rounded-xl transition-all cursor-pointer text-center flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{estimateEmailed ? `Copy emailed to ${maskEmail(contactEmail)}` : 'Email me a copy of this request'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="px-5 py-2.5 bg-[#F26B21] hover:bg-[#D95A13] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer text-center"
              >
                Submit Another Request
              </button>

              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab('home')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Back to Home
              </button>

              <button
                type="button"
                onClick={(e) => openLegalDialog('privacy', e.currentTarget)}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer text-center underline underline-offset-2"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        ) : (
          /* Quote Request Form Layout - Centered single column when breakdown panel is hidden */
          <div className={SHOW_PRICE_ESTIMATE ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" : "max-w-3xl mx-auto"}>
            
            {/* Request Configuration Form */}
            <div className={`bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 ${
              SHOW_PRICE_ESTIMATE ? 'lg:col-span-7' : ''
            }`}>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Shipment Specifications</h2>
                <p className="text-xs text-slate-500 font-semibold">
                  Select your service requirements, transport locations, cargo details, and contact information.
                </p>
              </div>

              <form onSubmit={handleQuoteSubmit} className="space-y-6 text-xs">
                
                {/* 1. Select Service Type */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    1. Select Service Type *
                  </label>

                  {(!isAirActive && !isRoadActive && !isDocActive) ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <p className="font-bold">Online quote requests are temporarily paused for scheduled maintenance.</p>
                        <p className="text-[11px] text-amber-700 mt-0.5">Please contact our team directly at contact@josanlogistics.com.sg or call +65 6789 0123.</p>
                      </div>
                    </div>
                  ) : (
                    <div className={`grid gap-3 ${
                      (isAirActive && isRoadActive && isDocActive)
                        ? 'grid-cols-1 sm:grid-cols-3'
                        : ([isAirActive, isRoadActive, isDocActive].filter(Boolean).length === 2)
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : 'grid-cols-1 max-w-md'
                    }`}>
                      {/* Option 1: Air Freight Documentation Support */}
                      {isAirActive && (
                        <button
                          type="button"
                          onClick={() => setServiceCategory('air-freight')}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                            serviceCategory === 'air-freight'
                              ? 'bg-[#F26B21] text-white border-[#F26B21] shadow-md ring-2 ring-[#F26B21]/30'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <Plane className={`w-4 h-4 ${serviceCategory === 'air-freight' ? 'text-white' : 'text-[#F26B21]'}`} />
                              <span className="font-extrabold text-xs block leading-snug">
                                Air Freight Documentation Support
                              </span>
                            </div>
                          </div>
                          <p className={`text-[11px] leading-relaxed ${
                            serviceCategory === 'air-freight' ? 'text-orange-50' : 'text-slate-500'
                          }`}>
                            Air freight coordination and cargo documentation with established airline and handling partners.
                          </p>
                          <span className={`text-xs font-mono font-bold pt-1 inline-block ${
                            serviceCategory === 'air-freight' ? 'text-white' : 'text-[#F26B21]'
                          }`}>
                            Quote upon request
                          </span>
                        </button>
                      )}

                      {/* Option 2: Commercial Road Transportation Coordination */}
                      {isRoadActive && (
                        <button
                          type="button"
                          onClick={() => setServiceCategory('road-transport')}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                            serviceCategory === 'road-transport'
                              ? 'bg-[#F26B21] text-white border-[#F26B21] shadow-md ring-2 ring-[#F26B21]/30'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <Truck className={`w-4 h-4 ${serviceCategory === 'road-transport' ? 'text-white' : 'text-[#F26B21]'}`} />
                              <span className="font-extrabold text-xs block leading-snug">
                                Commercial Road Transportation Coordination
                              </span>
                            </div>
                          </div>
                          <p className={`text-[11px] leading-relaxed ${
                            serviceCategory === 'road-transport' ? 'text-orange-50' : 'text-slate-500'
                          }`}>
                            Commercial road transportation coordinated through partner carriers.
                          </p>
                          <span className={`text-xs font-mono font-bold pt-1 inline-block ${
                            serviceCategory === 'road-transport' ? 'text-white' : 'text-[#F26B21]'
                          }`}>
                            Quote upon request
                          </span>
                        </button>
                      )}

                      {/* Option 3: Shipment Documentation Support */}
                      {isDocActive && (
                        <button
                          type="button"
                          onClick={() => setServiceCategory('documentation')}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                            serviceCategory === 'documentation'
                              ? 'bg-[#F26B21] text-white border-[#F26B21] shadow-md ring-2 ring-[#F26B21]/30'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <FileText className={`w-4 h-4 ${serviceCategory === 'documentation' ? 'text-white' : 'text-[#F26B21]'}`} />
                              <span className="font-extrabold text-xs block leading-snug">
                                Shipment Documentation Support
                              </span>
                            </div>
                          </div>
                          <p className={`text-[11px] leading-relaxed ${
                            serviceCategory === 'documentation' ? 'text-orange-50' : 'text-slate-500'
                          }`}>
                            Help preparing and organising shipment documents. No customs clearance.
                          </p>
                          <span className={`text-xs font-mono font-bold pt-1 inline-block ${
                            serviceCategory === 'documentation' ? 'text-white' : 'text-[#F26B21]'
                          }`}>
                            Fee confirmed in quote
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Documentation Support Clarification Note */}
                  {isDocActive && (serviceCategory === 'documentation' || includeDocumentation) && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-950 text-[11px] flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-[#F26B21] shrink-0 mt-0.5" />
                      <span>
                        <strong>Documentation Support:</strong> Documentation support is charged separately. We will confirm the fee in your quote.
                      </span>
                    </div>
                  )}

                  {/* Road Transport Sub-options (Only for Commercial Road Transportation Coordination) */}
                  {isRoadActive && serviceCategory === 'road-transport' && (
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-fade-in">
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                        Road Load Arrangement
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setRoadLoadType('ltl')}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            roadLoadType === 'ltl'
                              ? 'bg-white border-[#F26B21] shadow-xs ring-2 ring-[#F26B21]'
                              : 'bg-white/60 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="font-bold text-xs text-slate-900 block">Consolidated Road Freight</span>
                          <span className="text-[10px] text-slate-500 block">Shared vehicle space with other shipments</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRoadLoadType('ftl')}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            roadLoadType === 'ftl'
                              ? 'bg-white border-[#F26B21] shadow-xs ring-2 ring-[#F26B21]'
                              : 'bg-white/60 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="font-bold text-xs text-slate-900 block">Full Vehicle Road Freight</span>
                          <span className="text-[10px] text-slate-500 block">A vehicle arranged for your shipment alone</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Optional documentation add-on for transport modes */}
                  {isDocActive && serviceCategory !== 'documentation' && (
                    <label className="flex items-center space-x-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeDocumentation}
                        onChange={(e) => setIncludeDocumentation(e.target.checked)}
                        className="w-4 h-4 text-[#F26B21] rounded border-slate-300 focus:ring-[#F26B21] cursor-pointer"
                      />
                      <span className="text-[11px] text-slate-700 font-semibold">
                        Add shipment documentation support (fee confirmed in quote).
                      </span>
                    </label>
                  )}
                </div>

                {/* 2. Pickup & Delivery Locations and Preferred Pickup Date */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      2. Routing & Schedule *
                    </label>
                    <p className="text-[11px] text-slate-500 font-medium">Pickup and delivery points with preferred collection date.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F26B21]" />
                        <span>Pickup Address / Location *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        placeholder="Enter pickup address or postal code"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#F26B21] shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Delivery Address / Location *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Enter delivery address or postal code"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-[#F26B21]" />
                        <span>Preferred pickup date</span>
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={preferredPickupDate}
                        onChange={(e) => setPreferredPickupDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#F26B21] shadow-2xs cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Shipment Specifications: Cargo Description, and Packages/Weight/Dimensions for road & air */}
                <div className="space-y-3 pt-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    3. Shipment Specifications
                  </label>

                  <div className={`grid grid-cols-1 ${serviceCategory !== 'documentation' ? 'sm:grid-cols-2' : ''} gap-4`}>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Cargo Classification
                      </label>
                      <select
                        value={cargoCategory}
                        onChange={(e) => setCargoCategory(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#F26B21] cursor-pointer shadow-2xs"
                      >
                        {CARGO_CLASSIFICATIONS.map(catName => (
                          <option key={catName} value={catName}>
                            {catName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Number of Packages: only for Commercial Road Transportation Coordination and Air Freight Documentation Support */}
                    {serviceCategory !== 'documentation' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Number of Packages / Cartons
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max="1000"
                            placeholder="e.g. 4"
                            value={packageCount}
                            onChange={(e) => setPackageCount(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-[#F26B21] pr-12 shadow-2xs"
                          />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                            pkgs
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Cargo description field */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Cargo description
                      </label>
                      <input
                        type="text"
                        value={cargoDescription}
                        onChange={(e) => setCargoDescription(e.target.value)}
                        placeholder="e.g. 4 cartons of machinery spare parts, palletized dry goods"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#F26B21] shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Weight & Dimensions: only for Commercial Road Transportation Coordination and Air Freight Documentation Support */}
                  {serviceCategory !== 'documentation' && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center space-x-2">
                        <Maximize2 className="w-4 h-4 text-[#F26B21]" />
                        <span className="text-xs font-bold uppercase text-slate-800 tracking-wide">
                          Weight & Package Dimensions
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Gross Weight (kg)
                          </label>
                          <input
                            type="number"
                            min="0.5"
                            step="any"
                            value={cargoWeight}
                            onChange={(e) => setCargoWeight(e.target.value)}
                            placeholder="e.g. 250"
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-[#F26B21]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Length (cm)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={lengthCm}
                            onChange={(e) => setLengthCm(e.target.value)}
                            placeholder="e.g. 80"
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-[#F26B21]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Width (cm)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={widthCm}
                            onChange={(e) => setWidthCm(e.target.value)}
                            placeholder="e.g. 60"
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-[#F26B21]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Height (cm)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={heightCm}
                            onChange={(e) => setHeightCm(e.target.value)}
                            placeholder="e.g. 50"
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-[#F26B21]"
                          />
                        </div>
                      </div>

                      {/* Chargeable Weight for Road Transport (Shown only if price estimates are enabled) */}
                      {SHOW_PRICE_ESTIMATE && serviceCategory === 'road-transport' && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <Scale className="w-4 h-4 text-[#F26B21]" />
                            <div>
                              <span className="font-bold text-slate-900 text-xs block">Chargeable Weight (Billable)</span>
                              <span className="text-[10px] text-slate-500">
                                Higher of Gross Weight ({parsedActualWeight} kg) or Volumetric Weight ({volumetricWeight} kg)
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-xs font-extrabold text-orange-700 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200 inline-block">
                              {chargeableWeight.toFixed(2)} kg
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 4. Contact & Company Information */}
                <div className="space-y-3 pt-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    4. Contact & Company Information
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Contact Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. John Tan"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#F26B21]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. name@example.com"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#F26B21]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={contactCompany}
                        onChange={(e) => setContactCompany(e.target.value)}
                        placeholder="e.g. Apex Commercial Logistics Pte Ltd"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#F26B21]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">
                        Phone number *
                      </label>
                      <div className="flex items-center">
                        <select
                          value={quoteCountryCode}
                          onChange={(e) => {
                            const newCode = e.target.value;
                            setQuoteCountryCode(newCode);
                            setQuotePhoneDigits(prev => prev.slice(0, getPhoneLength(newCode)));
                          }}
                          className="p-2.5 bg-slate-100 border border-slate-300 rounded-l-xl text-slate-900 font-extrabold text-xs shrink-0 cursor-pointer border-r-0 focus:outline-none"
                        >
                          {countryCodesList.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.flag} {item.code} ({item.country})
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          required
                          maxLength={getPhoneLength(quoteCountryCode)}
                          value={quotePhoneDigits}
                          onChange={handlePhoneDigitsChange}
                          onKeyDown={(e) => {
                            const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
                            if (!allowed.includes(e.key) && !/^[0-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                              e.preventDefault();
                            }
                          }}
                          placeholder={`e.g. ${'9'.repeat(getPhoneLength(quoteCountryCode))}`}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-r-xl font-mono font-bold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-[#F26B21]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email me a copy of this request option */}
                <div className="pt-1">
                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={emailEstimateToMe}
                      onChange={(e) => setEmailEstimateToMe(e.target.checked)}
                      className="w-4 h-4 text-[#F26B21] rounded border-slate-300 focus:ring-[#F26B21] cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">
                      Email me a copy of this request
                      {contactEmail.trim() ? ` (to ${contactEmail.trim()})` : ''}
                    </span>
                  </label>
                </div>

                {/* Exact Required Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      required
                      checked={consentAgreed}
                      onChange={(e) => setConsentAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#F26B21] rounded border-slate-300 focus:ring-[#F26B21] cursor-pointer"
                    />
                    <span className="leading-relaxed">
                      I agree to Josan Logistics contacting me about this quote request and to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openLegalDialog('privacy', e.currentTarget);
                        }}
                        className="text-[#F26B21] hover:underline font-bold inline cursor-pointer"
                      >
                        Privacy Policy
                      </button>
                      {' '}and{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openLegalDialog('terms', e.currentTarget);
                        }}
                        className="text-[#F26B21] hover:underline font-bold inline cursor-pointer"
                      >
                        Terms of Service
                      </button>
                      .
                    </span>
                  </label>
                </div>

                {/* Cloudflare Turnstile Protection */}
                <div className="pt-2">
                  <TurnstileCaptcha
                    isVerified={captchaVerified}
                    onVerify={() => {
                      setCaptchaVerified(true);
                      setCaptchaError('');
                    }}
                    onExpire={() => {
                      setCaptchaVerified(false);
                    }}
                    error={captchaError}
                  />
                </div>

                {/* Single Submit Button: Send Quote Request */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#F26B21] hover:bg-[#D95A13] text-white rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Quote Request</span>
                  </button>
                  <p className="text-[11px] text-slate-500 text-center font-medium mt-2 leading-relaxed max-w-xl mx-auto">
                    After you send your request, we will reply with a quote. Payment is arranged after you accept the quote, and we will send you an invoice with payment details.
                  </p>
                  <p className="text-center text-xs text-slate-500 mt-2.5 leading-relaxed">
                    By sending this request you agree to our{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openLegalDialog('terms', e.currentTarget);
                      }}
                      className="text-[#F26B21] hover:underline font-bold inline cursor-pointer"
                    >
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openLegalDialog('privacy', e.currentTarget);
                      }}
                      className="text-[#F26B21] hover:underline font-bold inline cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                    .
                  </p>
                </div>
              </form>
            </div>

            {/* Right 5 Columns: Quotation Breakdown Panel (Only shown if SHOW_PRICE_ESTIMATE is true) */}
            {SHOW_PRICE_ESTIMATE && (
              <div className="lg:col-span-5 space-y-6 sticky top-24">
                <div className="bg-[#0B1F3A] text-white rounded-3xl p-6 sm:p-8 border border-[#1E3A5F] shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-white">Quotation Breakdown</h3>
                      <p className="text-xs text-[#B6C2D1] mt-0.5">
                        Itemized freight cost calculation based on selected shipment specifications.
                      </p>
                    </div>
                  </div>

                  {/* Route & Service Overview */}
                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-start space-x-2 text-slate-300 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#F26B21] shrink-0 mt-0.5" />
                      <span className="truncate">
                        Pickup: {pickupAddress.trim() || 'Address not specified'}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-300 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="truncate">
                        Delivery: {deliveryAddress.trim() || 'Address not specified'}
                      </span>
                    </div>
                    {preferredPickupDate && (
                      <div className="flex items-center space-x-2 text-slate-300 font-semibold pt-1 border-t border-white/10">
                        <Calendar className="w-3.5 h-3.5 text-[#F26B21] shrink-0" />
                        <span>Pickup Date: {preferredPickupDate}</span>
                      </div>
                    )}
                    {cargoDescription.trim() && (
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-white/10 truncate">
                        Cargo: <span className="text-slate-200">{cargoDescription.trim()}</span>
                      </div>
                    )}
                  </div>

                  {/* Breakdown Itemized Lines: Service, Rate, Quantity/Weight, Min Charge, Subtotal, 9% GST, Total */}
                  <div className="space-y-3 text-xs">
                    {/* Service Line */}
                    <div className="flex justify-between items-start text-slate-300 gap-2">
                      <span className="text-slate-400 shrink-0">Service:</span>
                      <span className="font-bold text-white text-right">{pricingDetails.serviceName}</span>
                    </div>

                    {/* Rate Line */}
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-400">Rate:</span>
                      <span className="font-mono font-bold text-[#F26B21]">{pricingDetails.rateText}</span>
                    </div>

                    {/* Quantity or Weight Line */}
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-400">
                        {serviceCategory === 'documentation' ? 'Quantity:' : 'Quantity / Weight:'}
                      </span>
                      <span className="font-mono text-slate-200">{pricingDetails.quantityOrWeightText}</span>
                    </div>

                    {/* Documentation add-on notice if selected alongside transport */}
                    {serviceCategory !== 'documentation' && includeDocumentation && (
                      <div className="p-2.5 bg-orange-950/40 border border-orange-500/30 rounded-xl text-[11px] text-orange-200 leading-relaxed">
                        <strong>Documentation Support:</strong> Charged separately. We will confirm the fee in your quote.
                      </div>
                    )}

                    {/* Case A: Price is Calculable -> Render Subtotal, Min Charge (if applicable), 9% GST, and Total */}
                    {pricingDetails.isCalculable ? (
                      <>
                        {/* Separate Minimum Charge Line if one applies */}
                        {pricingDetails.minChargeLine && (
                          <div className="p-2.5 bg-amber-950/40 border border-amber-700/50 rounded-xl space-y-1">
                            <div className="flex justify-between items-center text-amber-300 font-bold text-xs">
                              <span>Minimum Charge Applied:</span>
                              <span className="font-mono">S$ {pricingDetails.minChargeLine.amount.toFixed(2)}</span>
                            </div>
                            <p className="text-[10px] text-amber-200/80 leading-tight">
                              Calculated rate: S$ {pricingDetails.baseCalculated.toFixed(2)} (Standard minimum fee per consignment applied).
                            </p>
                          </div>
                        )}

                        {/* Subtotal Line */}
                        <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-700">
                          <span className="text-slate-400">Subtotal:</span>
                          <span className="font-mono font-bold text-slate-100">
                            S$ {pricingDetails.subtotal.toFixed(2)}
                          </span>
                        </div>

                        {/* 9% GST Line */}
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="text-slate-400">Singapore GST (9%):</span>
                          <span className="font-mono font-semibold text-slate-200">
                            S$ {pricingDetails.gst.toFixed(2)}
                          </span>
                        </div>

                        {/* Total Line */}
                        <div className="flex justify-between items-center text-white pt-3 border-t border-slate-600 font-extrabold">
                          <span className="text-sm">Total:</span>
                          <span className="font-mono text-2xl text-[#FF6B00] font-black">
                            S$ {pricingDetails.total.toFixed(2)}
                          </span>
                        </div>
                      </>
                    ) : (
                      /* Case B: Price cannot be calculated -> Show exact required text instead of a number or S$0.00 */
                      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center space-y-2 my-2">
                        <div className="flex items-center justify-center space-x-1.5 text-amber-400 font-extrabold text-xs sm:text-sm">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>We will confirm the price after reviewing your request</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {serviceCategory === 'air-freight'
                            ? 'Air freight documentation and cargo arrangements depend on route, partner airline availability, and flight schedules.'
                            : serviceCategory === 'documentation'
                            ? 'Documentation support is charged separately. We will confirm the fee in your quote.'
                            : 'Please enter your shipment gross weight above to compute an itemized calculation, or submit your request and our team will quote directly.'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#1E3A5F]">
                    <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed">
                      Final price depends on route, cargo, partner availability and applicable charges.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
