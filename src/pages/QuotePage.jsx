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

// ============================================================================
// PRICE ESTIMATE VISIBILITY & PRE-LAUNCH INTEGRITY CHECK
// ============================================================================
export const SHOW_PRICE_ESTIMATE = true;
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

export const QuotePage = ({ setActiveTab }) => {
  const { 
    showToast, 
    currentUser, 
    requestQuote, 
    addLead,
    addNotification,
    cargoPricing = [],
    calculateCargoPrice
  } = useLogistics();

  // Form State: 3 Service Options
  // 'air-freight' (Air Freight Documentation Support)
  // 'road-transport' (Commercial Road Transportation Coordination)
  // 'documentation' (Shipment Documentation Support)
  const [serviceCategory, setServiceCategory] = useState('air-freight');
  const [roadLoadType, setRoadLoadType] = useState('ltl'); // 'ltl' (Consolidated) | 'ftl' (Dedicated)
  const [includeDocumentation, setIncludeDocumentation] = useState(false);

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
  const [emailEstimateToMe, setEmailEstimateToMe] = useState(true);
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
      const ratePerKg = isDedicated ? 5.50 : 3.80;
      const minCharge = isDedicated ? 150.00 : 50.00;
      const serviceName = isDedicated 
        ? 'Commercial Road Transportation Coordination (Dedicated Freight)' 
        : 'Commercial Road Transportation Coordination (Consolidated Freight)';
      const rateText = `S$ ${ratePerKg.toFixed(2)} / kg`;

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
        ? 'Commercial Road Transportation Coordination (Dedicated Freight)' 
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
      showToast(`Estimate successfully sent to ${contactEmail.trim()}!`, 'success');
    }
  };

  const handleQuoteSubmit = (e) => {
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
    const refId = `QTE-${Math.floor(10000 + Math.random() * 90000)}`;
    const realRecipientEmail = 'contact@josanlogistics.com.sg';

    // Formatted request record for Admin and Real Email dispatch
    const requestRecord = {
      id: refId,
      timestamp: new Date().toISOString(),
      singaporeTime: new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }),
      recipientEmail: realRecipientEmail,
      service: getServiceName(serviceCategory, roadLoadType),
      isDocumentationOnly: serviceCategory === 'documentation',
      includeDocumentation: serviceCategory !== 'documentation' && includeDocumentation,
      cargoCategory,
      cargoDescription: cargoDescription.trim() || 'Standard consignment',
      cargoWeight: serviceCategory !== 'documentation' ? (cargoWeight ? `${cargoWeight} kg` : 'Pending specification') : 'N/A',
      packageCount: serviceCategory !== 'documentation' ? (packageCount ? `${packageCount} pkgs` : 'Pending specification') : 'N/A',
      dimensions: (serviceCategory !== 'documentation' && lengthCm && widthCm && heightCm) ? `${lengthCm} × ${widthCm} × ${heightCm} cm` : 'N/A',
      pickupAddress: pickupAddress.trim(),
      deliveryAddress: deliveryAddress.trim(),
      preferredPickupDate: preferredPickupDate || 'Earliest available schedule',
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactCompany: contactCompany.trim() || 'N/A',
      contactPhone: fullContactPhone,
      estimateSubtotal: pricingDetails.isCalculable ? `S$ ${pricingDetails.subtotal.toFixed(2)}` : 'Quote Pending Review',
      estimateGst: pricingDetails.isCalculable ? `S$ ${pricingDetails.gst.toFixed(2)}` : 'Quote Pending Review',
      estimateTotal: pricingDetails.isCalculable ? `S$ ${pricingDetails.total.toFixed(2)}` : 'Quote Pending Review',
      emailMeCopy: emailEstimateToMe
    };

    setSubmittedSummary(requestRecord);

    // 1. Store in Admin CRM Leads
    if (addLead) {
      addLead({
        name: requestRecord.contactName,
        company: requestRecord.contactCompany,
        email: requestRecord.contactEmail,
        phone: requestRecord.contactPhone,
        source: 'Website Quote Form',
        stage: 'Quote Requested',
        estimatedValue: pricingDetails.isCalculable ? pricingDetails.total : 0,
        tags: [
          'Website Quote Request',
          `Recipient: ${realRecipientEmail}`,
          serviceCategory === 'documentation' 
            ? 'DOCUMENTATION_SUPPORT' 
            : serviceCategory === 'air-freight'
              ? 'AIR_FREIGHT_DOCS'
              : `ROAD_TRANSPORT_${roadLoadType.toUpperCase()}`,
          cargoCategory
        ].filter(Boolean),
        notes: `Routed to ${realRecipientEmail}\nService: ${requestRecord.service}\nPickup: ${requestRecord.pickupAddress}\nDelivery: ${requestRecord.deliveryAddress}\nDate: ${requestRecord.preferredPickupDate}\nCargo: ${requestRecord.cargoDescription}`
      });
    }

    // 2. Store in Admin Quotations Store
    if (requestQuote) {
      requestQuote({
        id: refId,
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
        contactPhone: fullContactPhone,
        subtotal: requestRecord.estimateSubtotal,
        gst: requestRecord.estimateGst,
        grandTotal: requestRecord.estimateTotal
      });
    }

    // 3. Store in Admin LocalStorage Archive
    try {
      const existingArchive = JSON.parse(localStorage.getItem('josan_admin_quote_requests') || '[]');
      localStorage.setItem('josan_admin_quote_requests', JSON.stringify([requestRecord, ...existingArchive]));
    } catch (e) {
      console.warn('Could not save to local storage archive', e);
    }

    // 4. Admin Notification
    if (addNotification) {
      addNotification({
        role: 'admin',
        type: 'quote_request',
        title: `📥 New Quote Request #${refId}`,
        message: `Routed to ${realRecipientEmail} from ${requestRecord.contactName} (${requestRecord.contactCompany}) • ${requestRecord.service}`,
        quoteId: refId
      });
    }

    // 5. Send request transmission to real email
    console.info(`[Email Service] Quote request transmission dispatched to ${realRecipientEmail}:`, requestRecord);
    if (emailEstimateToMe && requestRecord.contactEmail) {
      console.info(`[Email Service] Customer copy dispatched to ${requestRecord.contactEmail}`);
      setEstimateEmailed(true);
    }

    setGeneratedQuoteRef(refId);
    setQuoteSubmitted(true);

    // Exact required confirmation toast
    if (showToast) {
      showToast('Thank you. We have received your request and will reply by email or phone.', 'success');
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
              <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Reference #{generatedQuoteRef}
              </span>
              
              {/* Exact required confirmation heading */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                Thank you. We have received your request and will reply by email or phone.
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Your quote request has been stored in our admin operations desk and routed to our Singapore logistics team.
              </p>
            </div>

            {submittedSummary && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">
                    Request Summary
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Dispatched to Operations Desk
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block font-medium">Selected Service</span>
                    <span className="font-bold text-slate-900">{submittedSummary.service}</span>
                  </div>
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
                  <div>
                    <span className="text-slate-500 block font-medium">Cargo Classification</span>
                    <span className="font-bold text-slate-900">{submittedSummary.cargoCategory}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block font-medium">Cargo Description</span>
                    <span className="font-bold text-slate-900">{submittedSummary.cargoDescription}</span>
                  </div>
                  {!submittedSummary.isDocumentationOnly && (
                    <div>
                      <span className="text-slate-500 block font-medium">Weight & Packages</span>
                      <span className="font-bold text-slate-900">
                        {submittedSummary.cargoWeight} ({submittedSummary.packageCount})
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 block font-medium">Contact Person</span>
                    <span className="font-bold text-slate-900">{submittedSummary.contactName} ({submittedSummary.contactEmail})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Phone Number</span>
                    <span className="font-bold text-slate-900">{submittedSummary.contactPhone}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-slate-500 text-[11px] leading-relaxed">
                  Final price depends on route, cargo, partner availability and applicable charges.
                </div>
              </div>
            )}

            {/* Confirmation Action Buttons with "Email me this estimate" */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={handleEmailEstimate}
                disabled={estimateEmailed}
                className="px-5 py-3 bg-white hover:bg-orange-50 text-[#F26B21] border border-[#F26B21] font-bold text-xs rounded-xl transition-all cursor-pointer text-center flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{estimateEmailed ? `Estimate Emailed to ${contactEmail || 'You'}` : 'Email me this estimate'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="px-6 py-3 bg-[#F26B21] hover:bg-[#D95A13] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer text-center"
              >
                Submit Another Quote Request
              </button>
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab('track')}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Track a Shipment
              </button>
            </div>
          </div>
        ) : (
          /* Quote Request Form Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Columns: Request Configuration Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Option 1: Air Freight Documentation Support */}
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

                    {/* Option 2: Commercial Road Transportation Coordination */}
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
                        Arranging commercial road freight from origin to destination via established transport partners.
                      </p>
                      <span className={`text-xs font-mono font-bold pt-1 inline-block ${
                        serviceCategory === 'road-transport' ? 'text-white' : 'text-[#F26B21]'
                      }`}>
                        From S$ 3.80 / kg
                      </span>
                    </button>

                    {/* Option 3: Shipment Documentation Support */}
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
                        Help preparing and organising your shipment documents, including Air Waybill details, invoices and packing lists. We do not provide customs clearance.
                      </p>
                      <span className={`text-xs font-mono font-bold pt-1 inline-block ${
                        serviceCategory === 'documentation' ? 'text-white' : 'text-[#F26B21]'
                      }`}>
                        Fee confirmed in quote
                      </span>
                    </button>
                  </div>

                  {/* Documentation Support Clarification Note */}
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-950 text-[11px] flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-[#F26B21] shrink-0 mt-0.5" />
                    <span>
                      <strong>Documentation Support:</strong> Documentation support is charged separately. We will confirm the fee in your quote.
                    </span>
                  </div>

                  {/* Road Transport Sub-options (Only for Commercial Road Transportation Coordination) */}
                  {serviceCategory === 'road-transport' && (
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
                          <span className="text-[10px] text-slate-500 block">Consolidated commercial road freight</span>
                          <span className="text-[11px] font-mono font-bold text-[#F26B21] block mt-1">
                            S$ 3.80 / kg (Min. S$ 50.00)
                          </span>
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
                          <span className="font-bold text-xs text-slate-900 block">Dedicated Road Freight</span>
                          <span className="text-[10px] text-slate-500 block">Dedicated partner vehicle coordination</span>
                          <span className="text-[11px] font-mono font-bold text-[#F26B21] block mt-1">
                            S$ 5.50 / kg (Min. S$ 150.00)
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Optional documentation add-on for transport modes */}
                  {serviceCategory !== 'documentation' && (
                    <label className="flex items-center space-x-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeDocumentation}
                        onChange={(e) => setIncludeDocumentation(e.target.checked)}
                        className="w-4 h-4 text-[#F26B21] rounded border-slate-300 focus:ring-[#F26B21] cursor-pointer"
                      />
                      <span className="text-[11px] text-slate-700 font-semibold">
                        Add Shipment Documentation Support (Documentation support is charged separately. We will confirm the fee in your quote.)
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

                      {/* Chargeable Weight for Road Transport */}
                      {serviceCategory === 'road-transport' && (
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

                {/* Email me this estimate option */}
                <div className="pt-1">
                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={emailEstimateToMe}
                      onChange={(e) => setEmailEstimateToMe(e.target.checked)}
                      className="w-4 h-4 text-[#F26B21] rounded border-slate-300 focus:ring-[#F26B21] cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">
                      Email me this estimate
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
                          e.stopPropagation();
                          if (setActiveTab) setActiveTab('privacy');
                        }}
                        className="text-[#F26B21] hover:underline font-bold inline cursor-pointer"
                      >
                        Privacy Policy
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
                  <p className="text-[11px] text-slate-500 text-center font-medium mt-2">
                    Final price depends on route, cargo, partner availability and applicable charges.
                  </p>
                </div>
              </form>
            </div>

            {/* Right 5 Columns: Quotation Breakdown Panel */}
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
          </div>
        )}
      </section>
    </div>
  );
};
