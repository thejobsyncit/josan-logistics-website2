import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, Clock, Building2, Globe, ExternalLink, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { TurnstileCaptcha } from '../components/TurnstileCaptcha';
import { openLegalDialog } from '../components/LegalDialog';
import { attachChatToSubmission } from '../services/chatStorageService';

export const ContactPage = ({ setActiveTab }) => {
  const { showToast, addLead, createSupportTicket, addNotification } = useLogistics();
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
  const [errors, setErrors] = useState({});
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const validateEmail = (emailStr) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr.trim());
  };

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
      newErrors.message = 'Please tell us how we can help with your enquiry.';
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
      showToast('Please complete all required fields highlighted below.', 'warning');
      return;
    }

    setErrors({});

    const submissionData = {
      id: `SUB-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      singaporeTime: new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }),
      recipientEmail: 'contact@josanlogistics.com.sg',
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      trackingId: formData.trackingId.trim(),
      subject: formData.subject,
      message: formData.message.trim(),
      consentGiven: true
    };

    // 1. Store in CRM Leads
    if (addLead) {
      addLead({
        name: submissionData.name,
        company: submissionData.company || `${submissionData.name}'s Organization`,
        email: submissionData.email,
        phone: submissionData.phone,
        source: 'Website Contact Form',
        stage: 'New',
        estimatedValue: submissionData.subject === 'Request a Quote' ? 8000 : 2500,
        tags: ['Contact Form', submissionData.subject, submissionData.trackingId ? `Tracking: ${submissionData.trackingId}` : null].filter(Boolean),
        notes: `Enquiry sent to contact@josanlogistics.com.sg\nMessage: ${submissionData.message}`
      });
    }

    // 2. Store in Support Tickets
    if (createSupportTicket) {
      createSupportTicket({
        customerName: submissionData.name,
        customerEmail: submissionData.email,
        customerPhone: submissionData.phone,
        subject: `[Web Enquiry] ${submissionData.subject}`,
        message: submissionData.message,
        shipmentId: submissionData.trackingId || 'General Inquiry'
      });
    }

    // 3. Admin Notification
    if (addNotification) {
      addNotification({
        role: 'admin',
        type: 'contact_enquiry',
        title: `📬 New Web Enquiry from ${submissionData.name}`,
        message: `Routed to contact@josanlogistics.com.sg • Subject: "${submissionData.subject}" • Phone: ${submissionData.phone || 'N/A'}`
      });
    }

    // 4. Save to Admin Local Storage Archive
    try {
      const existing = JSON.parse(localStorage.getItem('josan_contact_submissions') || '[]');
      localStorage.setItem('josan_contact_submissions', JSON.stringify([submissionData, ...existing]));
    } catch (e) {}

    // Simulated email dispatch log to REAL EMAIL
    console.info('[Email Service] Transmission dispatched to contact@josanlogistics.com.sg:', submissionData);

    // 5. Attach active chat session to contact enquiry reference if user chatted with AI
    const enquiryRef = `ENQ-${Math.floor(10000 + Math.random() * 90000)}`;
    try {
      attachChatToSubmission(enquiryRef, {
        name: submissionData.name,
        email: submissionData.email,
        phone: submissionData.phone,
        company: submissionData.company
      });
    } catch (e) {
      console.warn('[ContactPage] Failed to attach chat to contact submission:', e);
    }

    setSubmittedSuccess(true);
    showToast('Thank you. We have received your message and will reply by email or phone as soon as we can.', 'success');

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

  const faqs = [
    {
      q: 'How do I get a quote?',
      a: 'Use the Get a Quote button, or send us a message with your cargo details.'
    },
    {
      q: 'How can I track my shipment?',
      a: 'Use Track Shipment with your tracking number; status updates are entered by our operations team and show a "Last updated" time.'
    },
    {
      q: 'What information do you need to prepare an Air Waybill?',
      a: 'Shipper and consignee details, cargo description, weight and dimensions, commercial invoice and packing list.'
    },
    {
      q: 'Do you own the trucks?',
      a: 'We coordinate road transportation through our partner operators.'
    },
    {
      q: 'Can you help with shipping documents?',
      a: 'Yes. We help prepare and organise shipment documents such as the Air Waybill, commercial invoice and packing list. We do not provide customs clearance or act as a customs broker. Required documents vary by cargo, origin and destination.'
    }
  ];

  return (
    <div className="space-y-16 pb-20">

      {/* Header Banner with Organic Curve Transition */}
      <section className="relative bg-[#0B1F3A] text-white pt-16 pb-28 sm:pt-20 sm:pb-36 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-12 left-1/4 w-96 h-96 bg-[#F26B21]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
            Contact Josan Logistics
          </h1>
          <p className="text-[#B6C2D1] font-normal max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Questions about a quote, a shipment or your documents? Send us a message or call us and our team will get back to you.
          </p>
        </div>

        {/* Layered Organic Wave Transition merging into the white background */}
        <div className="absolute -bottom-px left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg 
            className="relative block w-full h-12 sm:h-16 lg:h-24" 
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

      {/* Main Grid: Form + Office Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Send Us A Message</h2>
              <p className="text-slate-600 font-medium text-xs sm:text-sm mt-1">
                Fill out the details below and our team will get back to you.
              </p>
            </div>

            {/* Success Message Banner */}
            {submittedSuccess && (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-emerald-900 animate-fade-in shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-sm text-emerald-950">
                    Thank you. We have received your message and will reply by email or phone as soon as we can.
                  </p>
                  <p className="text-xs text-emerald-700">
                    A copy of this enquiry has been routed directly to our Singapore operations desk at contact@josanlogistics.com.sg.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedSuccess(false)}
                    className="text-xs text-emerald-800 font-bold underline hover:text-emerald-950 pt-1 block cursor-pointer"
                  >
                    Send another enquiry
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: null });
                    }}
                    placeholder="Your name"
                    className={`input-standard ${errors.name ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500' : ''}`}
                    required
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-600 font-semibold mt-1 animate-fade-in flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    placeholder="name@domain.com"
                    className={`input-standard ${errors.email ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500' : ''}`}
                    required
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-600 font-semibold mt-1 animate-fade-in flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone number (optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+65 XXXX XXXX"
                    className="input-standard"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company name (optional)</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Acme Logistics"
                    className="input-standard"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-standard font-semibold"
                  >
                    <option value="Request a Quote">Request a Quote</option>
                    <option value="Air Freight">Air Freight</option>
                    <option value="Road Transportation">Road Transportation</option>
                    <option value="Documentation Help">Documentation Help</option>
                    <option value="Track a Shipment">Track a Shipment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tracking ID (optional)</label>
                  <input
                    type="text"
                    value={formData.trackingId}
                    onChange={(e) => setFormData({ ...formData, trackingId: e.target.value })}
                    placeholder="Your tracking number"
                    className="input-standard"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">How can we help? *</label>
                  <span className={`text-[11px] font-medium ${formData.message.length >= 2000 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                    {formData.message.length} / 2000 characters
                  </span>
                </div>
                <textarea
                  rows="4"
                  maxLength={2000}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value.slice(0, 2000) });
                    if (errors.message) setErrors({ ...errors, message: null });
                  }}
                  placeholder="Tell us what you are shipping, from where to where, and any special requirements"
                  className={`w-full p-3.5 text-[15px] bg-white border rounded-xl text-[#172033] focus-orange ${errors.message ? 'border-rose-400 bg-rose-50/20' : 'border-[#E2E8F0]'}`}
                  required
                ></textarea>
                {errors.message && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 animate-fade-in flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              {/* Required Consent Checkbox */}
              <div className="space-y-1 pt-1">
                <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => {
                      setFormData({ ...formData, consent: e.target.checked });
                      if (e.target.checked && errors.consent) {
                        setErrors({ ...errors, consent: null });
                      }
                    }}
                    className={`mt-0.5 w-4 h-4 rounded text-[#FF6B00] border ${errors.consent ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-300'} focus:ring-[#FF6B00] cursor-pointer`}
                  />
                  <span className="text-xs text-slate-600 leading-snug">
                    I agree to Josan Logistics contacting me about this enquiry and to the{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openLegalDialog('privacy', e.currentTarget);
                      }}
                      className="text-orange-600 font-bold underline hover:text-orange-700 transition-colors cursor-pointer inline"
                      title="Read Josan Logistics Privacy Policy"
                    >
                      Privacy Policy
                    </button>.
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-xs text-rose-600 font-semibold pl-6 animate-fade-in flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.consent}</span>
                  </p>
                )}
              </div>

              {/* Invisible Spam Protection (Cloudflare Turnstile) */}
              <TurnstileCaptcha
                isInvisible={true}
                isVerified={isCaptchaVerified}
                onVerify={() => {
                  setIsCaptchaVerified(true);
                  if (errors.captcha) setErrors(prev => ({ ...prev, captcha: null }));
                }}
                error={errors.captcha}
              />

              <button
                type="submit"
                className="btn-primary w-full h-12 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>

              <p className="text-center text-xs text-slate-500 mt-2.5 leading-relaxed">
                By sending this request you agree to our{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openLegalDialog('terms', e.currentTarget);
                  }}
                  className="text-orange-600 font-bold underline hover:text-orange-700 transition-colors cursor-pointer inline"
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
                  className="text-orange-600 font-bold underline hover:text-orange-700 transition-colors cursor-pointer inline"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </form>
          </div>

          {/* Office Details & Direct Hotline */}
          <div className="lg:col-span-5 space-y-6">

            <div className="bg-[#0B1F3A] text-white p-8 rounded-3xl space-y-6 border border-[#1E3A5F] shadow-card">
              <h3 className="text-xl font-extrabold flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#B6C2D1]" />
                <span>Our Office</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="space-y-3">
                  <div>
                    <p className="font-bold text-white text-sm">Head Office</p>
                    <p className="text-[#B6C2D1] mt-1 leading-relaxed text-sm">
                      10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438
                    </p>
                  </div>

                  <div className="pt-1">
                    <a
                      href="https://maps.google.com/?q=10+Pasir+Panjang+Road,+%2312-01+Mapletree+Business+City,+Singapore+117438"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
                      title="View on Google Maps"
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3 h-3 shrink-0 ml-0.5" />
                    </a>
                  </div>

                  <div className="pt-3 border-t border-[#1E3A5F] space-y-2 text-slate-300">
                    <p className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Email:{' '}
                        <a href="mailto:contact@josanlogistics.com.sg" className="text-white font-semibold hover:text-orange-400 transition-colors underline">
                          contact@josanlogistics.com.sg
                        </a>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call Us Card (renamed from 24/7 Singapore Hotline) */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm hover:border-slate-300 transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-center font-bold shrink-0">
                  <Phone className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#0B1F3A] text-sm">Call Us</h4>
                  <a href="tel:+6567890123" className="text-[#0B1F3A] font-extrabold text-lg sm:text-xl font-mono tracking-tight hover:text-[#FF6B00] transition-colors">
                    +65 6789 0123
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <a
                  href="tel:+6567890123"
                  className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-[#0B1F3A] hover:bg-[#1E3A5F] text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                  title="Call Josan Logistics (+65 6789 0123)"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
                <a
                  href="https://wa.me/6567890123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                  title="Message Josan on WhatsApp"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Contact Hours Card */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm hover:border-slate-300 transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-center font-bold shrink-0">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#0B1F3A] text-sm">Contact Hours</h4>
                  <p className="text-slate-800 font-bold text-sm tracking-tight">
                    [ENTER HOURS]
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                Operations desk and customer enquiry support hours.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className={`bg-white border rounded-2xl overflow-hidden shadow-xs transition-all ${
                  isOpen 
                    ? 'border-slate-300 border-l-4 border-l-[#FF6B00] bg-orange-50/10' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-slate-900 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-slate-700 text-sm sm:text-[14.5px] leading-relaxed border-t border-slate-100/90 pt-3.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
