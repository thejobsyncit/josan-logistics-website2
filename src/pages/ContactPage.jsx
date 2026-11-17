import React, { useState, useRef, useEffect } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { ChevronDown } from 'lucide-react';
import { TurnstileCaptcha } from '../components/TurnstileCaptcha';
import { openLegalDialog } from '../components/LegalDialog';
import { attachChatToSubmission } from '../services/chatStorageService';
import { COMPANY_INFO, getPhoneLinks, isDisplayablePhone } from '../config/siteConfig';

export const ContactPage = ({ setActiveTab }) => {
  const { showToast, addLead, createSupportTicket, addNotification, websiteContent, siteSettings } = useLogistics();
  const contactContent = websiteContent?.contact || {};
  const displayEmail = (siteSettings?.contact_email || contactContent.email || COMPANY_INFO.email || '').trim();
  const sharedEmail = displayEmail || COMPANY_INFO.email;
  const sharedAddress = siteSettings?.registered_office || contactContent.address || COMPANY_INFO.address;
  const phoneLinks = getPhoneLinks(siteSettings?.phone || contactContent.phone);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    trackingId: '',
    subject: 'Request a Quote',
    message: '',
    consent: false
  });
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const successHeadingRef = useRef(null);

  useEffect(() => {
    document.title = 'Contact | Josan Logistics';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Contact Josan Logistics. Use Get a Quote for quote requests, or email us.');
    }
  }, []);

  useEffect(() => {
    if (submittedSuccess && successHeadingRef.current) {
      successHeadingRef.current.focus();
    }
  }, [submittedSuccess]);

  const validateEmail = (emailStr) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr.trim());
  };

  // Subject options in sentence case (filter display layer for customs, insurance, claims, special handling)
  const allSubjectOptions = [
    { value: 'Request a Quote', label: 'Request a quote' },
    { value: 'Air Freight', label: 'Air freight' },
    { value: 'Road Transportation', label: 'Road transport' },
    { value: 'Documentation Help', label: 'Documentation help' },
    { value: 'Track a Shipment', label: 'Track a shipment' },
    { value: 'Other', label: 'Other' }
  ];

  const visibleSubjectOptions = allSubjectOptions.filter(opt => {
    const text = (opt.value + ' ' + opt.label).toLowerCase();
    return !text.includes('customs') && !text.includes('insurance') && !text.includes('claim') && !text.includes('special handling');
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please tell us how we can help with your request.';
    } else if (formData.message.length > 2000) {
      newErrors.message = 'Message cannot exceed 2000 characters.';
    }

    if (!formData.consent) {
      newErrors.consent = 'Please agree to the contact consent and Privacy Policy to proceed.';
    }

    if (!isCaptchaVerified) {
      newErrors.captcha = 'Anti-spam protection verification is in progress. Please wait a moment.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitError(true);
      showToast('Please complete all required fields highlighted below.', 'warning');
      return;
    }

    setErrors({});
    setSubmitError(false);
    setIsSubmitting(true);

    const submissionData = {
      id: `SUB-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      singaporeTime: new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }),
      recipientEmail: sharedEmail,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      trackingId: formData.trackingId.trim(),
      subject: formData.subject,
      message: formData.message.trim(),
      consentGiven: true
    };

    setSubmittedEmail(submissionData.email);
    setSubmittedSuccess(true);
    setIsSubmitting(false);
    showToast('This form is not connected to our team yet. Please use Get a Quote or email us.', 'info');

    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      trackingId: '',
      subject: 'Request a Quote',
      message: '',
      consent: false
    });
  };

  const faqList = [
    {
      q: 'How do I get a quote?',
      a: (
        <>
          Fill in our{' '}
          <a
            href="#quote"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('quote');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[var(--color-navy)] underline hover:text-[var(--color-navy-hover)]"
          >
            quote form
          </a>
          . Our team reviews your request and emails you a quote.
        </>
      ),
      plainA: 'Fill in our quote form. Our team reviews your request and emails you a quote.'
    },
    {
      q: 'How can I track my shipment?',
      a: (
        <>
          For road shipments, our team will send you a tracking number after we book your carrier. Enter it on our{' '}
          <a
            href="#track"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('track');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[var(--color-navy)] underline hover:text-[var(--color-navy-hover)]"
          >
            Track road shipment page
          </a>
          . Our team enters the updates, and the page shows when the last update was made. Air freight shipments cannot be tracked here, because for air freight we only prepare documents.
        </>
      ),
      plainA: 'For road shipments, our team will send you a tracking number after we book your carrier. Enter it on our Track road shipment page. Our team enters the updates, and the page shows when the last update was made. Air freight shipments cannot be tracked here, because for air freight we only prepare documents.'
    },
    {
      q: 'What information do you need to prepare an Air Waybill?',
      a: 'We need the shipper and consignee details, a description of the cargo with the quantity, weight and dimensions, your commercial invoice and packing list, and the origin and destination. The documents we need can vary by shipment, and we will tell you what is needed.',
      plainA: 'We need the shipper and consignee details, a description of the cargo with the quantity, weight and dimensions, your commercial invoice and packing list, and the origin and destination. The documents we need can vary by shipment, and we will tell you what is needed.'
    },
    {
      q: 'Do you own the trucks?',
      a: 'No. We do not own or run vehicles. After you pay the quote, we book a partner carrier for your job.',
      plainA: 'No. We do not own or run vehicles. After you pay the quote, we book a partner carrier for your job.'
    },
    {
      q: 'What documents do you prepare?',
      a: 'For air freight, we prepare the Air Waybill and the billing and shipment documents. We do not book flights. For road transport, you do not need to send us any documents.',
      plainA: 'For air freight, we prepare the Air Waybill and the billing and shipment documents. We do not book flights. For road transport, you do not need to send us any documents.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.plainA
      }
    }))
  };

  return (
    <div className="font-sans text-[var(--color-text)]">
      {/* FAQ Schema for structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. HERO */}
      <section className="bg-[var(--color-navy)] py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-b-[var(--color-kraft)] text-left">
        <div className="max-w-[1200px] mx-auto space-y-3">
          <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-white font-heading tracking-normal leading-tight">
            Contact us
          </h1>
          <p className="text-[var(--color-on-navy-muted)] text-sm sm:text-base max-w-2xl leading-relaxed tracking-normal">
            Questions about a quote, a shipment or your documents? Please use Get a Quote or email us.
          </p>
        </div>
      </section>

      {/* 2. MAIN LAYOUT: Form + Office & Hours */}
      <section className="bg-[var(--color-bg)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left Column: Form (approx 62%) */}
            <div className="w-full lg:w-[62%]">
              {submittedSuccess ? (
                /* 4. SUCCESS STATE: Replaces the form */
                <div
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] shadow-none border-t-[3px] border-t-[var(--color-kraft)] p-5 sm:p-8 space-y-4"
                  role="region"
                  aria-live="polite"
                >
                  <h2
                    ref={successHeadingRef}
                    tabIndex={-1}
                    className="text-2xl font-bold text-[var(--color-text)] font-heading focus:outline-none"
                  >
                    This form is not connected yet
                  </h2>
                  <p className="text-sm text-[var(--color-text)] leading-relaxed">
                    Thank you. This form is not connected to our team yet. To reach us, please use Get a Quote or email {sharedEmail}.
                  </p>
                  <div className="pt-2">
                    <a
                      href="#home"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('home');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-[var(--color-navy)] underline hover:text-[var(--color-navy-hover)] text-sm font-normal"
                    >
                      Back to home
                    </a>
                  </div>
                </div>
              ) : (
                /* 3. FORM CONTAINER */
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] shadow-none border-t-[3px] border-t-[var(--color-kraft)] p-5 sm:p-8 space-y-6">
                  <div className="bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-[var(--radius)] p-3 text-xs text-[var(--color-text-muted)]">
                    This form is not connected to our team yet. Please use Get a Quote or email {sharedEmail}.
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text)] font-heading">
                      Send us a message
                    </h2>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      Fields marked (required) must be filled in.
                    </p>
                  </div>

                  {/* Error Alert Block */}
                  {submitError && (
                    <div
                      className="border-l-[3px] border-l-[var(--color-kraft-dark)] bg-[var(--color-bg-alt)] p-4 rounded-[var(--radius)] text-sm text-[var(--color-text)]"
                      role="alert"
                      aria-live="assertive"
                    >
                      Something went wrong. Please try again, or email us at{' '}
                      <a
                        href={`mailto:${sharedEmail}`}
                        className="text-[var(--color-navy)] underline hover:text-[var(--color-navy-hover)]"
                      >
                        {sharedEmail}
                      </a>.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* Full Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-semibold text-[var(--color-text)] mb-1.5"
                        >
                          Full name <span className="text-[var(--color-text-muted)] font-normal">(required)</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: null });
                          }}
                          placeholder="Your name"
                          aria-required="true"
                          aria-describedby={errors.name ? 'name-error' : undefined}
                          className="w-full h-[48px] px-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] shadow-none focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] focus:ring-offset-2"
                        />
                        {errors.name && (
                          <p id="name-error" className="text-xs text-[var(--brand-error)] font-medium mt-1">
                            Error: {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-semibold text-[var(--color-text)] mb-1.5"
                        >
                          Email <span className="text-[var(--color-text-muted)] font-normal">(required)</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: null });
                          }}
                          placeholder="name@example.com"
                          aria-required="true"
                          aria-describedby={errors.email ? 'email-error' : undefined}
                          className="w-full h-[48px] px-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] shadow-none focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] focus:ring-offset-2"
                        />
                        {errors.email && (
                          <p id="email-error" className="text-xs text-[var(--brand-error)] font-medium mt-1">
                            Error: {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone Number & Company Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-sm font-semibold text-[var(--color-text)] mb-1.5"
                        >
                          Phone number <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 91234567"
                          className="w-full h-[48px] px-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] shadow-none focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] focus:ring-offset-2"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-company"
                          className="block text-sm font-semibold text-[var(--color-text)] mb-1.5"
                        >
                          Company name <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
                        </label>
                        <input
                          id="contact-company"
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. ABC Trading Pte Ltd"
                          className="w-full h-[48px] px-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] shadow-none focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] focus:ring-offset-2"
                        />
                      </div>
                    </div>

                    {/* Subject & Tracking Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-subject"
                          className="block text-sm font-semibold text-[var(--color-text)] mb-1.5"
                        >
                          Subject
                        </label>
                        <select
                          id="contact-subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full h-[48px] px-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-sm text-[var(--color-text)] shadow-none focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] focus:ring-offset-2 cursor-pointer"
                        >
                          {visibleSubjectOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {formData.subject === 'Request a Quote' && (
                          <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                            Our quote form asks for everything we need.{' '}
                            <a
                              href="#quote"
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveTab('quote');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="text-[var(--color-navy)] underline hover:text-[var(--color-navy-hover)]"
                            >
                              Open the quote form
                            </a>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-tracking"
                          className="block text-sm font-semibold text-[var(--color-text)] mb-1.5"
                        >
                          Tracking number <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
                        </label>
                        <input
                          id="contact-tracking"
                          type="text"
                          value={formData.trackingId}
                          onChange={(e) => setFormData({ ...formData, trackingId: e.target.value })}
                          placeholder="Your tracking number"
                          className="w-full h-[48px] px-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] shadow-none focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] focus:ring-offset-2"
                        />
                        <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                          Road shipments only.
                        </p>
                      </div>
                    </div>

                    {/* How can we help? */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="contact-message"
                          className="block text-sm font-semibold text-[var(--color-text)]"
                        >
                          How can we help? <span className="text-[var(--color-text-muted)] font-normal">(required)</span>
                        </label>
                        <span className="text-xs text-[var(--color-text-muted)] font-normal">
                          {formData.message.length} of 2000 characters
                        </span>
                      </div>
                      <textarea
                        id="contact-message"
                        rows={4}
                        maxLength={2000}
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value.slice(0, 2000) });
                          if (errors.message) setErrors({ ...errors, message: null });
                        }}
                        placeholder="Tell us what you need and, if it is about a shipment, where it is going."
                        aria-required="true"
                        aria-describedby={errors.message ? 'message-error' : undefined}
                        className="w-full min-h-[140px] p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] shadow-none focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] focus:ring-offset-2"
                      />
                      {errors.message && (
                        <p id="message-error" className="text-xs text-[var(--brand-error)] font-medium mt-1">
                          Error: {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Required Consent Checkbox */}
                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer select-none min-h-[44px]">
                        <input
                          id="contact-consent"
                          type="checkbox"
                          checked={formData.consent}
                          onChange={(e) => {
                            setFormData({ ...formData, consent: e.target.checked });
                            if (e.target.checked && errors.consent) {
                              setErrors({ ...errors, consent: null });
                            }
                          }}
                          aria-required="true"
                          aria-describedby={errors.consent ? 'consent-error' : undefined}
                          className="mt-0.5 w-5 h-5 min-w-[20px] min-h-[20px] rounded-[var(--radius)] border border-[var(--color-border)] text-[var(--color-navy)] focus:ring-2 focus:ring-[var(--color-navy)] focus:ring-offset-2 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm text-[var(--color-text)] leading-relaxed">
                          I agree to Josan Logistics contacting me about this message and to the{' '}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openLegalDialog('privacy', e.currentTarget);
                            }}
                            className="text-[var(--color-navy)] underline hover:text-[var(--color-navy-hover)] font-normal cursor-pointer"
                          >
                            Privacy Policy
                          </button>
                          .
                        </span>
                      </label>
                      {errors.consent && (
                        <p id="consent-error" className="text-xs text-[var(--brand-error)] font-medium mt-1">
                          Error: {errors.consent}
                        </p>
                      )}
                    </div>

                    {/* Turnstile: 16px spacing above and below, no shield icon */}
                    <div className="my-4">
                      <TurnstileCaptcha
                        isInvisible={true}
                        hideShield={true}
                        isVerified={isCaptchaVerified}
                        onVerify={() => {
                          setIsCaptchaVerified(true);
                          if (errors.captcha) setErrors(prev => ({ ...prev, captcha: null }));
                        }}
                        error={errors.captcha}
                      />
                    </div>

                    {/* Button: Only orange element on the page */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto min-w-[200px] h-[48px] px-6 text-sm font-semibold rounded-[var(--radius)] shadow-none text-white bg-[var(--color-orange)] hover:bg-[var(--color-orange-hover)] disabled:bg-[var(--color-bg-alt)] disabled:text-[var(--color-text-muted)] disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        {isSubmitting ? 'Sending...' : 'Send message'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right Column: Office & Hours (approx 38%, sticky) */}
            <div className="w-full lg:w-[38%] lg:sticky lg:top-6 self-start space-y-6">

              {/* Block 1: Our office */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] shadow-none border-t-[3px] border-t-[var(--color-kraft)] p-6">
                <h2 className="text-base font-bold text-[var(--color-text)] font-heading mb-4">
                  Our office
                </h2>
                <dl className="divide-y divide-[var(--color-border)] text-sm">
                  {/* Head office */}
                  <div className="pb-4">
                    <dt className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                      Head office
                    </dt>
                    <dd className="text-[var(--color-text)] leading-relaxed">
                      {sharedAddress}
                      <div className="mt-1.5">
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(sharedAddress)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-navy)] underline hover:text-[var(--color-navy-hover)] text-xs font-normal"
                        >
                          Open in Google Maps
                        </a>
                      </div>
                    </dd>
                  </div>

                  {/* Email */}
                  {displayEmail && (
                    <div className="py-4">
                      <dt className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                        Email
                      </dt>
                      <dd className="text-[var(--color-text)]">
                        <a
                          href={`mailto:${displayEmail}`}
                          className="text-[var(--color-navy)] underline hover:text-[var(--color-navy-hover)] break-all"
                        >
                          {displayEmail}
                        </a>
                      </dd>
                    </div>
                  )}

                  {/* Phone (rendered only if confirmed and displayable) */}
                  {phoneLinks.hasConfirmedPhone && isDisplayablePhone(phoneLinks.display) && (
                    <div className="py-4">
                      <dt className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                        Phone
                      </dt>
                      <dd className="text-[var(--color-text)]">
                        <a
                          href={phoneLinks.telHref}
                          className="text-[var(--color-navy)] underline hover:text-[var(--color-navy-hover)]"
                        >
                          {phoneLinks.display}
                        </a>
                      </dd>
                    </div>
                  )}

                  {/* WhatsApp (rendered only if confirmed and displayable) */}
                  {phoneLinks.hasConfirmedPhone && isDisplayablePhone(phoneLinks.display) && phoneLinks.whatsappHref && (
                    <div className="pt-4">
                      <dt className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                        WhatsApp
                      </dt>
                      <dd className="text-[var(--color-text)]">
                        <a
                          href={phoneLinks.whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-navy)] underline hover:text-[var(--color-navy-hover)]"
                        >
                          {phoneLinks.display}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Block 2: Hours */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] shadow-none border-t-[3px] border-t-[var(--color-kraft)] p-6 space-y-3">
                <h2 className="text-base font-bold text-[var(--color-text)] font-heading">
                  Hours
                </h2>
                <div>
                  <p className="text-sm font-normal text-[var(--color-text)]">
                    {COMPANY_INFO.businessHours}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {COMPANY_INFO.timezoneNote}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section
        id="faq-contact"
        className="bg-[var(--color-bg-alt)] py-[72px] px-4 sm:px-6 lg:px-8 text-left"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-[800px]">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-navy)] font-heading leading-tight">
              Frequently asked questions
            </h2>

            <div className="mt-8 border-b border-[var(--color-border)]">
              {faqList.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                const triggerId = `contact-faq-trigger-${idx}`;
                const panelId = `contact-faq-panel-${idx}`;
                return (
                  <div
                    key={idx}
                    className={`border-t border-[var(--color-border)] ${
                      isOpen
                        ? 'bg-[var(--color-bg-alt)] border-l-[3px] border-l-[var(--color-kraft)]'
                        : 'bg-transparent'
                    }`}
                  >
                    <button
                      type="button"
                      id={triggerId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full min-h-[44px] py-5 px-4 sm:px-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] focus:ring-offset-2"
                    >
                      <span className="text-base font-semibold text-[var(--color-text)] leading-snug">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[var(--color-text-muted)] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        className="px-4 sm:px-5 pb-5 text-sm sm:text-base text-[var(--color-text)] font-normal leading-relaxed"
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
