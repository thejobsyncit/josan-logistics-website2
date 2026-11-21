import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { countryCodesList, getPhoneLength } from '../data/countryCodes';
import { TurnstileCaptcha } from '../components/TurnstileCaptcha';
import { openLegalDialog } from '../components/LegalDialog';

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

const GOODS_OPTIONS_ROAD = [
  'General Commercial Goods',
  'Industrial Spares & Hardware',
  'Consumer Retail Products',
  'Exhibition & Event Materials'
];

const GOODS_OPTIONS_AIR = [
  'General Commercial Goods',
  'Industrial Spares & Hardware',
  'Consumer Retail Products',
  'Commercial Documents & Paperwork',
  'Exhibition & Event Materials',
  'Custom Commercial Cargo'
];

export const QuotePage = ({ setActiveTab }) => {
  const { 
    showToast, 
    currentUser, 
    managedServices = {},
    setCustomerSubTab
  } = useLogistics();

  const isAirActive = managedServices?.airway?.active !== false;
  const isRoadActive = managedServices?.road?.active !== false;

  // Preselect based on query parameter (?service=air or ?service=road) or default to empty
  const [serviceCategory, setServiceCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get('service');
      if (serviceParam === 'air' && isAirActive) return 'air-freight';
      if (serviceParam === 'road' && isRoadActive) return 'road-transport';
    }
    return '';
  });

  // Watch for URL query changes or service availability updates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get('service');
      if (serviceParam === 'air' && isAirActive) {
        setServiceCategory('air-freight');
      } else if (serviceParam === 'road' && isRoadActive) {
        setServiceCategory('road-transport');
      }
    }
  }, [isAirActive, isRoadActive]);

  // If active service gets paused, reset selection
  useEffect(() => {
    if (serviceCategory === 'air-freight' && !isAirActive) {
      setServiceCategory('');
    } else if (serviceCategory === 'road-transport' && !isRoadActive) {
      setServiceCategory('');
    }
  }, [isAirActive, isRoadActive, serviceCategory]);

  // Route and date inputs
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [preferredPickupDate, setPreferredPickupDate] = useState('');

  // Goods details
  const [cargoCategory, setCargoCategory] = useState('General Commercial Goods');
  const [packageCount, setPackageCount] = useState('');
  const [cargoDescription, setCargoDescription] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [lengthCm, setLengthCm] = useState('');
  const [widthCm, setWidthCm] = useState('');
  const [heightCm, setHeightCm] = useState('');

  // Adjust goods category if switching between services
  useEffect(() => {
    if (serviceCategory === 'road-transport') {
      if (!GOODS_OPTIONS_ROAD.includes(cargoCategory)) {
        setCargoCategory('General Commercial Goods');
      }
    }
  }, [serviceCategory, cargoCategory]);

  // Contact details
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [contactCompany, setContactCompany] = useState(currentUser?.company || '');

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

  // Prefill if currentUser updates
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

  // Options and consent
  const emailCopy = false;
  const [consentAgreed, setConsentAgreed] = useState(false);

  // Cloudflare Turnstile
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [websiteHoneypot, setWebsiteHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submission result state
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [submittedSummary, setSubmittedSummary] = useState(null);
  const successHeadingRef = useRef(null);

  useEffect(() => {
    if (quoteSubmitted && successHeadingRef.current) {
      successHeadingRef.current.focus();
    }
  }, [quoteSubmitted]);

  const resetTurnstile = () => {
    setTurnstileToken('');
    setCaptchaVerified(false);
    setCaptchaError('');
    setTurnstileKey(prev => prev + 1);
    if (typeof window !== 'undefined' && window.turnstile && typeof window.turnstile.reset === 'function') {
      try {
        window.turnstile.reset();
      } catch (_) {}
    }
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();

    if (!serviceCategory) {
      if (showToast) showToast('Please choose a service to continue.', 'warning');
      return;
    }

    if (!pickupAddress.trim()) {
      const fieldName = serviceCategory === 'air-freight' ? 'origin city or airport' : 'pickup address';
      if (showToast) showToast(`Please enter your ${fieldName}.`, 'warning');
      return;
    }

    if (!deliveryAddress.trim()) {
      const fieldName = serviceCategory === 'air-freight' ? 'destination city or airport' : 'delivery address';
      if (showToast) showToast(`Please enter your ${fieldName}.`, 'warning');
      return;
    }

    if (!contactName.trim()) {
      if (showToast) showToast('Please enter your contact name.', 'warning');
      return;
    }

    if (!contactEmail.trim()) {
      if (showToast) showToast('Please enter your email address.', 'warning');
      return;
    }

    const maxDigits = getPhoneLength(quoteCountryCode);
    const minDigits = Math.max(6, maxDigits - 1);
    if (!quotePhoneDigits || quotePhoneDigits.length < minDigits) {
      if (showToast) showToast('Please enter a valid phone number.', 'warning');
      return;
    }

    if (!consentAgreed) {
      if (showToast) showToast('Please check the consent box to proceed.', 'warning');
      return;
    }

    if (!captchaVerified || !turnstileToken) {
      setCaptchaError('Please complete the Cloudflare verification.');
      if (showToast) {
        showToast('Please verify with Cloudflare before sending your request.', 'warning');
      }
      return;
    }

    const fullContactPhone = `${quoteCountryCode} ${quotePhoneDigits}`.trim();

    // Map service category
    const serviceTypeEnum = serviceCategory === 'road-transport' 
      ? 'ROAD_TRANSPORT' 
      : 'AIR_FREIGHT_DOCS';

    // Parse numeric dimensions and weight safely
    const parsedPackages = packageCount ? parseInt(packageCount, 10) : null;
    const parsedGrossWeight = cargoWeight ? parseFloat(cargoWeight) : null;
    const parsedLength = lengthCm ? parseFloat(lengthCm) : null;
    const parsedWidth = widthCm ? parseFloat(widthCm) : null;
    const parsedHeight = heightCm ? parseFloat(heightCm) : null;

    // Backend validation requires a valid date format; fallback to tomorrow if optional date left blank
    const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const backendDate = preferredPickupDate || tomorrowDate;

    const payload = {
      service_type: serviceTypeEnum,
      road_load_type: null,
      add_documentation: false,
      pickup_location: pickupAddress.trim(),
      delivery_location: deliveryAddress.trim(),
      preferred_pickup_date: backendDate,
      cargo_classification: cargoCategory || 'General Commercial Goods',
      cargo_description: cargoDescription.trim() || 'General Commercial Goods',
      packages: parsedPackages,
      gross_weight_kg: parsedGrossWeight,
      length_cm: parsedLength,
      width_cm: parsedWidth,
      height_cm: parsedHeight,
      contact_name: contactName.trim(),
      contact_email: contactEmail.trim(),
      contact_phone: fullContactPhone,
      company_name: contactCompany.trim() || null,
      consent_given: Boolean(consentAgreed),
      copy_to_customer: false,
      turnstile_token: turnstileToken,
      website: websiteHoneypot || ''
    };

    setIsSubmitting(true);

    try {
      const supabaseUrl = (import.meta.env?.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
      const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';
      const endpoint = `${supabaseUrl}/functions/v1/submit-quote`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 429) {
        resetTurnstile();
        if (showToast) {
          showToast('Too many requests. Please try again later.', 'error');
        }
        return;
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        const errMsg = errJson?.error || 'Unable to submit quote request. Please try again.';
        resetTurnstile();
        if (showToast) {
          showToast(errMsg, 'error');
        }
        return;
      }

      const resData = await response.json().catch(() => null);
      const referenceId = resData?.reference || 'QR-RECEIVED';

      resetTurnstile();

      setSubmittedSummary({
        referenceId,
        service: serviceCategory === 'air-freight' ? 'Air freight documents' : 'Road transport',
        serviceCategory,
        pickupAddress: pickupAddress.trim(),
        deliveryAddress: deliveryAddress.trim(),
        preferredPickupDate: preferredPickupDate || '',
        cargoCategory,
        cargoDescription: cargoDescription.trim(),
        packageCount: packageCount ? formatPackageCount(packageCount) : '',
        cargoWeight: cargoWeight ? `${cargoWeight} kg` : '',
        dimensions: (lengthCm && widthCm && heightCm) ? `${lengthCm} × ${widthCm} × ${heightCm} cm` : '',
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        contactCompany: contactCompany.trim(),
        contactPhone: fullContactPhone,
        emailCopy
      });

      setQuoteSubmitted(true);

      if (showToast) {
        showToast('Thank you. We have received your request and our team will email you a quote.', 'success');
      }

      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (networkError) {
      console.error('[quote-submit-error]', networkError);
      resetTurnstile();
      if (showToast) {
        showToast('Network error while submitting request. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentGoodsOptions = serviceCategory === 'road-transport' 
    ? GOODS_OPTIONS_ROAD 
    : GOODS_OPTIONS_AIR;

  return (
    <div className="bg-[var(--color-bg)] pb-20">
      {/* 1. Hero Section */}
      <section className="bg-[var(--color-navy)] py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[var(--color-kraft)] text-left">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Request a quote
          </h1>
          <p className="text-[#C9CFDA] text-base mt-2 max-w-2xl">
            Tell us about your shipment and we will email you a quote.
          </p>
        </div>
      </section>

      {/* 2. Main Content Layout */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Form or Success Card (~62% on desktop) */}
          <div className="w-full lg:w-[62%]">
            {quoteSubmitted && submittedSummary ? (
              /* 10. Success State Card */
              <div 
                className="bg-[var(--color-surface,#fff)] border border-[var(--color-border)] rounded-[var(--radius,4px)] border-t-[3px] border-t-[var(--color-kraft)] p-6 sm:p-8 space-y-6 shadow-none text-left"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-[var(--radius,4px)] bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 
                      ref={successHeadingRef}
                      tabIndex={-1}
                      className="text-xl font-bold text-[var(--color-text)] outline-none"
                    >
                      We have received your request
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      Our team will contact you about your quote.
                    </p>
                    {submittedSummary.emailCopy && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        A copy of your request has been sent to <strong className="text-[var(--color-text)]">{submittedSummary.contactEmail}</strong>.
                      </p>
                    )}
                  </div>
                </div>

                {/* Summary Details */}
                <div className="bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-[var(--radius,4px)] p-4 space-y-3 text-xs">
                  <div className="border-b border-[var(--color-border)] pb-2 flex justify-between items-center">
                    <span className="font-bold text-[var(--color-text)] uppercase tracking-wider text-[11px]">
                      Request summary
                    </span>
                    <span className="text-[var(--color-text-muted)] [font-variant-numeric:tabular-nums]">
                      Reference: {submittedSummary.referenceId}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[var(--color-text-muted)] block">Service</span>
                      <span className="font-bold text-[var(--color-text)]">{submittedSummary.service}</span>
                    </div>

                    <div>
                      <span className="text-[var(--color-text-muted)] block">
                        {submittedSummary.serviceCategory === 'air-freight' ? 'Planned shipping date' : 'Preferred pickup date'}
                      </span>
                      <span className="font-bold text-[var(--color-text)] [font-variant-numeric:tabular-nums]">
                        {submittedSummary.preferredPickupDate || 'Not specified'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[var(--color-text-muted)] block">
                        {submittedSummary.serviceCategory === 'air-freight' ? 'Origin' : 'Pickup address'}
                      </span>
                      <span className="font-bold text-[var(--color-text)]">{submittedSummary.pickupAddress}</span>
                    </div>

                    <div>
                      <span className="text-[var(--color-text-muted)] block">
                        {submittedSummary.serviceCategory === 'air-freight' ? 'Destination' : 'Delivery address'}
                      </span>
                      <span className="font-bold text-[var(--color-text)]">{submittedSummary.deliveryAddress}</span>
                    </div>

                    <div>
                      <span className="text-[var(--color-text-muted)] block">Type of goods</span>
                      <span className="font-bold text-[var(--color-text)]">{submittedSummary.cargoCategory}</span>
                    </div>

                    {submittedSummary.packageCount && (
                      <div>
                        <span className="text-[var(--color-text-muted)] block">Packages</span>
                        <span className="font-bold text-[var(--color-text)] [font-variant-numeric:tabular-nums]">{submittedSummary.packageCount}</span>
                      </div>
                    )}

                    {submittedSummary.cargoDescription && (
                      <div className="sm:col-span-2">
                        <span className="text-[var(--color-text-muted)] block">Description</span>
                        <span className="font-bold text-[var(--color-text)]">{submittedSummary.cargoDescription}</span>
                      </div>
                    )}

                    {(submittedSummary.cargoWeight || submittedSummary.dimensions) && (
                      <div className="sm:col-span-2">
                        <span className="text-[var(--color-text-muted)] block">Weight & dimensions</span>
                        <span className="font-bold text-[var(--color-text)] [font-variant-numeric:tabular-nums]">
                          {[submittedSummary.cargoWeight, submittedSummary.dimensions].filter(Boolean).join(' • ')}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="text-[var(--color-text-muted)] block">Contact name</span>
                      <span className="font-bold text-[var(--color-text)]">{submittedSummary.contactName}</span>
                    </div>

                    <div>
                      <span className="text-[var(--color-text-muted)] block">Email</span>
                      <span className="font-bold text-[var(--color-text)]">{submittedSummary.contactEmail}</span>
                    </div>

                    {submittedSummary.contactCompany && (
                      <div>
                        <span className="text-[var(--color-text-muted)] block">Company</span>
                        <span className="font-bold text-[var(--color-text)]">{submittedSummary.contactCompany}</span>
                      </div>
                    )}

                    <div>
                      <span className="text-[var(--color-text-muted)] block">Phone</span>
                      <span className="font-bold text-[var(--color-text)] [font-variant-numeric:tabular-nums]">{submittedSummary.contactPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab && setActiveTab('home')}
                    className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-[var(--radius,4px)] font-bold text-sm hover:bg-[var(--color-bg-alt)] transition-colors cursor-pointer"
                  >
                    Back to home
                  </button>
                </div>
              </div>
            ) : (
              /* 3. The Form Container */
              <div className="bg-[var(--color-surface,#fff)] border border-[var(--color-border)] rounded-[var(--radius,4px)] border-t-[3px] border-t-[var(--color-kraft)] p-5 sm:p-8 shadow-none text-left">
                
                <p className="text-[13px] text-[var(--color-text-muted)] mb-6">
                  Fields marked (required) must be filled in.
                </p>

                <form onSubmit={handleQuoteSubmit} className="space-y-6">
                  {/* Anti-spam honeypot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-9999px',
                      top: '-9999px',
                      width: '1px',
                      height: '1px',
                      opacity: 0,
                      overflow: 'hidden',
                      pointerEvents: 'none'
                    }}
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    <label htmlFor="website-honeypot">Website</label>
                    <input
                      id="website-honeypot"
                      type="text"
                      name="website"
                      value={websiteHoneypot}
                      onChange={(e) => setWebsiteHoneypot(e.target.value)}
                      autoComplete="off"
                      tabIndex={-1}
                    />
                  </div>

                  {/* 4. Group 1: Service */}
                  <fieldset>
                    <legend className="text-sm font-bold text-[var(--color-text)] mb-3">
                      1. Service
                    </legend>

                    {(!isAirActive && !isRoadActive) ? (
                      <div className="p-4 bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-[var(--radius,4px)] text-xs text-[var(--color-text)] flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                        <span>Online quote requests are temporarily paused for scheduled maintenance. Please contact our team at contact@josanlogistics.com.sg.</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Option 1: Air freight documents */}
                        {isAirActive && (
                          <label
                            className={`p-4 rounded-[var(--radius,4px)] text-left transition-colors cursor-pointer block relative ${
                              serviceCategory === 'air-freight'
                                ? 'border-2 border-[var(--color-navy)] bg-[var(--color-bg-alt)]'
                                : 'border border-[var(--color-border)] bg-[var(--color-surface,#fff)] hover:border-[var(--color-kraft)]'
                            }`}
                          >
                            <input
                              type="radio"
                              name="serviceCategory"
                              value="air-freight"
                              checked={serviceCategory === 'air-freight'}
                              onChange={() => setServiceCategory('air-freight')}
                              className="sr-only"
                            />
                            {serviceCategory === 'air-freight' && (
                              <div className="absolute top-3.5 right-3.5 w-4 h-4 rounded-full bg-[var(--color-navy)] text-white flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                            <span className="font-bold text-sm text-[var(--color-text)] block pr-6">
                              Air freight documents
                            </span>
                            <span className="text-xs text-[var(--color-text-muted)] block mt-1.5 leading-relaxed">
                              We prepare Air Waybills and billing and shipment documents. We do not book flights, move cargo or collect cargo.
                            </span>
                          </label>
                        )}

                        {/* Option 2: Road transport */}
                        {isRoadActive && (
                          <label
                            className={`p-4 rounded-[var(--radius,4px)] text-left transition-colors cursor-pointer block relative ${
                              serviceCategory === 'road-transport'
                                ? 'border-2 border-[var(--color-navy)] bg-[var(--color-bg-alt)]'
                                : 'border border-[var(--color-border)] bg-[var(--color-surface,#fff)] hover:border-[var(--color-kraft)]'
                            }`}
                          >
                            <input
                              type="radio"
                              name="serviceCategory"
                              value="road-transport"
                              checked={serviceCategory === 'road-transport'}
                              onChange={() => setServiceCategory('road-transport')}
                              className="sr-only"
                            />
                            {serviceCategory === 'road-transport' && (
                              <div className="absolute top-3.5 right-3.5 w-4 h-4 rounded-full bg-[var(--color-navy)] text-white flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                            <span className="font-bold text-sm text-[var(--color-text)] block pr-6">
                              Road transport
                            </span>
                            <span className="text-xs text-[var(--color-text-muted)] block mt-1.5 leading-relaxed">
                              Commercial road transport in Singapore arranged through partner carriers. We do not own vehicles.
                            </span>
                          </label>
                        )}
                      </div>
                    )}

                    {!serviceCategory && (
                      <p className="text-sm text-[var(--color-text-muted)] mt-3">
                        Choose a service to continue.
                      </p>
                    )}
                  </fieldset>

                  {/* Groups 2, 3 and 4 appear only once a service is chosen */}
                  {serviceCategory && (
                    <>
                      {/* 5. Group 2: Route and date */}
                      <fieldset className="pt-2">
                        <legend className="text-sm font-bold text-[var(--color-text)] mb-3">
                          2. Route and date
                        </legend>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {serviceCategory === 'air-freight' ? (
                            <>
                              <div>
                                <label htmlFor="quote-origin" className="block text-[13px] font-bold text-[var(--color-text)] mb-1">
                                  Origin city or airport (required)
                                </label>
                                <input
                                  id="quote-origin"
                                  type="text"
                                  required
                                  value={pickupAddress}
                                  onChange={(e) => setPickupAddress(e.target.value)}
                                  placeholder="e.g. Singapore (SIN)"
                                  className="w-full px-3 py-2.5 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
                                />
                              </div>

                              <div>
                                <label htmlFor="quote-destination" className="block text-[13px] font-bold text-[var(--color-text)] mb-1">
                                  Destination city or airport (required)
                                </label>
                                <input
                                  id="quote-destination"
                                  type="text"
                                  required
                                  value={deliveryAddress}
                                  onChange={(e) => setDeliveryAddress(e.target.value)}
                                  placeholder="e.g. London Heathrow (LHR)"
                                  className="w-full px-3 py-2.5 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label htmlFor="quote-shipping-date" className="block text-[13px] font-bold text-[var(--color-text)] mb-1">
                                  Planned shipping date (optional)
                                </label>
                                <input
                                  id="quote-shipping-date"
                                  type="date"
                                  min={new Date().toISOString().split('T')[0]}
                                  value={preferredPickupDate}
                                  onChange={(e) => setPreferredPickupDate(e.target.value)}
                                  className="w-full px-3 py-2.5 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] [font-variant-numeric:tabular-nums] cursor-pointer"
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <label htmlFor="quote-pickup" className="block text-[13px] font-bold text-[var(--color-text)] mb-1">
                                  Pickup address in Singapore (required)
                                </label>
                                <input
                                  id="quote-pickup"
                                  type="text"
                                  required
                                  value={pickupAddress}
                                  onChange={(e) => setPickupAddress(e.target.value)}
                                  placeholder="e.g. 10 Jalan Besar, Singapore 208787"
                                  className="w-full px-3 py-2.5 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
                                />
                              </div>

                              <div>
                                <label htmlFor="quote-delivery" className="block text-[13px] font-bold text-[var(--color-text)] mb-1">
                                  Delivery address in Singapore (required)
                                </label>
                                <input
                                  id="quote-delivery"
                                  type="text"
                                  required
                                  value={deliveryAddress}
                                  onChange={(e) => setDeliveryAddress(e.target.value)}
                                  placeholder="e.g. 25 Pioneer Sector 1, Singapore 628437"
                                  className="w-full px-3 py-2.5 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label htmlFor="quote-pickup-date" className="block text-[13px] font-bold text-[var(--color-text)] mb-1">
                                  Preferred pickup date (optional)
                                </label>
                                <input
                                  id="quote-pickup-date"
                                  type="date"
                                  min={new Date().toISOString().split('T')[0]}
                                  value={preferredPickupDate}
                                  onChange={(e) => setPreferredPickupDate(e.target.value)}
                                  className="w-full px-3 py-2.5 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] [font-variant-numeric:tabular-nums] cursor-pointer"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </fieldset>

                      {/* 6. Group 3: Your goods */}
                      <fieldset className="pt-2">
                        <legend className="text-sm font-bold text-[var(--color-text)] mb-3">
                          3. Your goods
                        </legend>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="quote-goods-type" className="block text-[13px] font-bold text-[var(--color-text)] mb-1">
                              Type of goods
                            </label>
                            <select
                              id="quote-goods-type"
                              value={cargoCategory}
                              onChange={(e) => setCargoCategory(e.target.value)}
                              className="w-full px-3 py-2.5 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] cursor-pointer"
                            >
                              {currentGoodsOptions.map(option => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label htmlFor="quote-packages" className="block text-[13px] font-bold text-[var(--color-text)] mb-1">
                              Number of packages
                            </label>
                            <div className="relative">
                              <input
                                id="quote-packages"
                                type="number"
                                min="1"
                                max="1000"
                                placeholder="e.g. 4"
                                value={packageCount}
                                onChange={(e) => setPackageCount(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10) || 1))}
                                className="w-full px-3 py-2.5 pr-20 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] [font-variant-numeric:tabular-nums]"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)] pointer-events-none">
                                packages
                              </span>
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label htmlFor="quote-goods-desc" className="block text-[13px] font-bold text-[var(--color-text)] mb-1">
                              Describe your goods
                            </label>
                            <textarea
                              id="quote-goods-desc"
                              rows={3}
                              value={cargoDescription}
                              onChange={(e) => setCargoDescription(e.target.value)}
                              placeholder="For example: 4 cartons of machinery spare parts"
                              className="w-full px-3 py-2.5 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] leading-relaxed"
                            />
                          </div>
                        </div>

                        {/* Weight and size */}
                        <fieldset className="mt-4 pt-4 border-t border-[var(--color-border)]">
                          <legend className="text-[13px] font-bold text-[var(--color-text)] mb-2">
                            Weight and size (optional)
                          </legend>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                              <label htmlFor="quote-weight" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                                Gross weight (kg)
                              </label>
                              <input
                                id="quote-weight"
                                type="number"
                                min="0.1"
                                step="any"
                                value={cargoWeight}
                                onChange={(e) => setCargoWeight(e.target.value)}
                                placeholder="e.g. 250"
                                className="w-full px-3 py-2 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] [font-variant-numeric:tabular-nums]"
                              />
                            </div>

                            <div>
                              <label htmlFor="quote-length" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                                Length (cm)
                              </label>
                              <input
                                id="quote-length"
                                type="number"
                                min="1"
                                value={lengthCm}
                                onChange={(e) => setLengthCm(e.target.value)}
                                placeholder="e.g. 80"
                                className="w-full px-3 py-2 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] [font-variant-numeric:tabular-nums]"
                              />
                            </div>

                            <div>
                              <label htmlFor="quote-width" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                                Width (cm)
                              </label>
                              <input
                                id="quote-width"
                                type="number"
                                min="1"
                                value={widthCm}
                                onChange={(e) => setWidthCm(e.target.value)}
                                placeholder="e.g. 60"
                                className="w-full px-3 py-2 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] [font-variant-numeric:tabular-nums]"
                              />
                            </div>

                            <div>
                              <label htmlFor="quote-height" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                                Height (cm)
                              </label>
                              <input
                                id="quote-height"
                                type="number"
                                min="1"
                                value={heightCm}
                                onChange={(e) => setHeightCm(e.target.value)}
                                placeholder="e.g. 50"
                                className="w-full px-3 py-2 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] [font-variant-numeric:tabular-nums]"
                              />
                            </div>
                          </div>

                          <p className="text-xs text-[var(--color-text-muted)] mt-2">
                            Enter the dimensions of one package if all packages are the same size. If they differ, tell us in the description above.
                          </p>
                        </fieldset>
                      </fieldset>

                      {/* 7. Group 4: Your contact details */}
                      <fieldset className="pt-2">
                        <legend className="text-sm font-bold text-[var(--color-text)] mb-3">
                          4. Your contact details
                        </legend>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="quote-contact-name" className="block text-[13px] font-bold text-[var(--color-text)] mb-1">
                              Contact name (required)
                            </label>
                            <input
                              id="quote-contact-name"
                              type="text"
                              required
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              placeholder="e.g. John Tan"
                              className="w-full px-3 py-2.5 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
                            />
                          </div>

                          <div>
                            <label htmlFor="quote-contact-email" className="block text-[13px] font-bold text-[var(--color-text)] mb-1">
                              Email address (required)
                            </label>
                            <input
                              id="quote-contact-email"
                              type="email"
                              required
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              placeholder="e.g. john.tan@company.com"
                              className="w-full px-3 py-2.5 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
                            />
                          </div>

                          <div>
                            <label htmlFor="quote-company-name" className="block text-[13px] font-bold text-[var(--color-text)] mb-1">
                              Company name (optional)
                            </label>
                            <input
                              id="quote-company-name"
                              type="text"
                              value={contactCompany}
                              onChange={(e) => setContactCompany(e.target.value)}
                              placeholder="e.g. Apex Pte Ltd"
                              className="w-full px-3 py-2.5 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)]"
                            />
                          </div>

                          <div>
                            <label htmlFor="quote-phone-digits" className="block text-[13px] font-bold text-[var(--color-text)] mb-1">
                              Phone number (required)
                            </label>
                            <div className="flex items-center">
                              <select
                                aria-label="Country Code"
                                value={quoteCountryCode}
                                onChange={(e) => {
                                  const newCode = e.target.value;
                                  setQuoteCountryCode(newCode);
                                  setQuotePhoneDigits(prev => prev.slice(0, getPhoneLength(newCode)));
                                }}
                                className="px-2.5 py-2.5 bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-l-[var(--radius,4px)] text-[var(--color-text)] font-bold text-xs shrink-0 cursor-pointer border-r-0 focus:outline-none"
                              >
                                {countryCodesList.map((item) => (
                                  <option key={item.code} value={item.code}>
                                    {item.flag} {item.code} ({item.country})
                                  </option>
                                ))}
                              </select>
                              <input
                                id="quote-phone-digits"
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
                                className="w-full px-3 py-2.5 text-sm text-[var(--color-text)] bg-white border border-[var(--color-border)] rounded-r-[var(--radius,4px)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] [font-variant-numeric:tabular-nums]"
                              />
                            </div>
                          </div>
                        </div>



                        {/* Exact required consent checkbox */}
                        <div className="mt-3">
                          <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-[var(--color-text-muted)]">
                            <input
                              type="checkbox"
                              required
                              checked={consentAgreed}
                              onChange={(e) => setConsentAgreed(e.target.checked)}
                              className="mt-0.5 w-4 h-4 text-[var(--color-navy)] rounded border-[var(--color-border)] focus:ring-[var(--color-navy)] cursor-pointer shrink-0"
                            />
                            <span className="leading-relaxed">
                              I agree to Josan Logistics contacting me by email about this quote request and to the{' '}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  openLegalDialog('privacy', e.currentTarget);
                                }}
                                className="text-[var(--color-navy)] underline font-bold inline cursor-pointer hover:opacity-80"
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
                                className="text-[var(--color-navy)] underline font-bold inline cursor-pointer hover:opacity-80"
                              >
                                Terms of Service
                              </button>
                              .
                            </span>
                          </label>
                        </div>
                      </fieldset>

                      {/* 8. Verification and Submit Button */}
                      <div className="my-4">
                        <TurnstileCaptcha
                          key={turnstileKey}
                          isVerified={captchaVerified}
                          onVerify={(token) => {
                            setTurnstileToken(token || '');
                            setCaptchaVerified(true);
                            setCaptchaError('');
                          }}
                          onExpire={() => {
                            setTurnstileToken('');
                            setCaptchaVerified(false);
                          }}
                          error={captchaError}
                        />
                      </div>

                      {/* Notice above Send button */}
                      <div className="p-3 my-3 bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-[var(--radius,4px)] text-xs text-[var(--color-text-muted)] leading-relaxed">
                        Please don't send documents here. Do not include NRIC numbers, passwords or payment details.
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto sm:min-w-[200px] px-6 py-3 font-bold text-[15px] rounded-[var(--radius,4px)] text-white bg-[var(--color-orange)] hover:bg-[var(--color-orange-hover)] disabled:bg-[var(--color-bg-alt)] disabled:text-[var(--color-text-muted)] disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center space-x-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>Sending request...</span>
                            </>
                          ) : (
                            <span>Send quote request</span>
                          )}
                        </button>

                        <p className="text-xs text-[var(--color-text-muted)] mt-3 leading-relaxed">
                          After you send your request, our team reviews it and emails you a quote. When you confirm the quote, we send you an invoice with payment details.
                        </p>
                      </div>
                    </>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Right Column: Sticky "What happens next" Block (~38% on desktop) */}
          <div className="w-full lg:w-[38%] self-start lg:sticky lg:top-6">
            <div className="bg-[var(--color-surface,#fff)] border border-[var(--color-border)] rounded-[var(--radius,4px)] border-t-[3px] border-t-[var(--color-kraft)] p-6 text-left shadow-none">
              <h2 className="text-base font-bold text-[var(--color-text)] mb-5">
                What happens next
              </h2>

              <div className="space-y-4 text-xs">
                {/* Step 1 */}
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-[var(--color-kraft-dark)] text-sm shrink-0 [font-variant-numeric:tabular-nums]">
                    1.
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--color-text)]">
                      You send your request
                    </h3>
                    <p className="text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                      Tell us what you are shipping and where it is going.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-[var(--color-kraft-dark)] text-sm shrink-0 [font-variant-numeric:tabular-nums]">
                    2.
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--color-text)]">
                      Our team reviews it
                    </h3>
                    <p className="text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                      We check the route, goods and dates and email you a quote.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-[var(--color-kraft-dark)] text-sm shrink-0 [font-variant-numeric:tabular-nums]">
                    3.
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--color-text)]">
                      You confirm and pay
                    </h3>
                    <p className="text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                      When you are ready, confirm the quote and pay the invoice.
                    </p>
                  </div>
                </div>

                {/* Step 4: Adapts dynamically based on service selected */}
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-[var(--color-kraft-dark)] text-sm shrink-0 [font-variant-numeric:tabular-nums]">
                    4.
                  </span>
                  <div>
                    {serviceCategory === 'air-freight' ? (
                      <>
                        <h3 className="font-bold text-sm text-[var(--color-text)]">
                          We prepare your documents
                        </h3>
                        <p className="text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                          We prepare your Air Waybill and billing documents and email them to you.
                        </p>
                      </>
                    ) : serviceCategory === 'road-transport' ? (
                      <>
                        <h3 className="font-bold text-sm text-[var(--color-text)]">
                          We book the carrier
                        </h3>
                        <p className="text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                          We book a partner carrier and email you a tracking number so you can follow the delivery.
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-bold text-sm text-[var(--color-text)]">
                          We start the job
                        </h3>
                        <p className="text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                          For air freight we prepare your documents. For road transport we book the partner carrier.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Questions? Email us at contact@josanlogistics.com.sg
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
