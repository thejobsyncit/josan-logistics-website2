import React, { useState } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, Clock, Building2, Globe } from 'lucide-react';

export const ContactPage = () => {
  const { showToast } = useLogistics();
  const [formData, setFormData] = useState({ name: '', email: '', trackingId: '', subject: 'General Support', message: '' });
  const [activeFaq, setActiveFaq] = useState(null);

  const validateEmail = (emailStr) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailStr.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (/[0-9]/.test(formData.name)) {
      showToast('Full Name cannot contain numbers', 'warning');
      return;
    }

    if (!validateEmail(formData.email)) {
      showToast('Please enter a valid corporate email address (e.g. name@company.com)', 'warning');
      return;
    }

    showToast('Your inquiry has been submitted to Josan Dispatch Support!', 'success');
    setFormData({ name: '', email: '', trackingId: '', subject: 'General Support', message: '' });
  };

  const faqs = [
    { q: 'How do I track my shipment in real-time?', a: 'Enter your tracking ID (e.g., JOS-89421-US) in the search bar at the top or on the Track Shipment page. You will see minute-by-minute status updates and live delivery steppers.' },
    { q: 'What is the cutoff time for same-day express air dispatch?', a: 'Same-day express air cargo pickup must be booked before 12:00 PM local hub time for guaranteed same-night airport loading.' },
    { q: 'What happens if my package is delayed due to weather?', a: 'Our automated telematics system flags traffic or weather delays immediately on your tracking timeline. You will receive real-time SMS and email notifications.' },
    { q: 'Are all shipments insured against loss or damage?', a: 'Yes! Every shipment booked through Josan Logistics includes baseline freight coverage up to $10,000, with optional 100% full-value insurance policies during booking.' }
  ];

  return (
    <div className="space-y-16 pb-20">

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-orange-400 font-bold uppercase text-xs tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            24/7 Customer & Fleet Support
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-sans">
            Get In Touch With Our Dispatch Team
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Have questions regarding cargo bookings, tracking updates, or custom enterprise supply chain quotes? Our team is active 24/7.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Office Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Send Us A Message</h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">Fill out the details below and an operations agent will respond within 15 minutes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const lettersOnly = e.target.value.replace(/[0-9]/g, '');
                      setFormData({ ...formData, name: lettersOnly });
                    }}
                    placeholder="John Doe"
                    className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange"
                    required
                  />
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Strictly letters only (no numbers)</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Email Address *</label>
                  <input
                    type="email"
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    title="Please enter a valid email address with domain extension (e.g. john@company.com)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange"
                    required
                  />
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Must be valid email format (e.g. name@company.com)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tracking ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.trackingId}
                    onChange={(e) => setFormData({ ...formData, trackingId: e.target.value })}
                    placeholder="e.g. JOS-89421-US"
                    className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange font-semibold"
                  >
                    <option value="General Support">General Support & Tracking</option>
                    <option value="Corporate Freight Quote">Enterprise Freight Quote</option>
                    <option value="Billing & Invoices">Billing & Invoices</option>
                    <option value="Claims & Insurance">Claims & Insurance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message / Cargo Specs *</label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide shipment details or your query..."
                  className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus-orange"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-orange-gradient hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-orange-glow transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>

          {/* Hub Locations & Direct Hotlines */}
          <div className="lg:col-span-5 space-y-6">

            <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-extrabold flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-orange-400" />
                <span>Singapore HQ & Global Hubs</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="border-b border-slate-800 pb-3 space-y-1">
                  <p className="font-bold text-orange-400 text-sm">🇸🇬 Singapore Regional HQ - Mapletree City</p>
                  <p className="text-slate-300">10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438</p>
                  <p className="text-slate-400">Phone: +65 6789 0123 | Email: contact@josanlogistics.com.sg</p>
                </div>

                <div className="border-b border-slate-800 pb-3 space-y-1">
                  <p className="font-bold text-orange-400 text-sm">🇸🇬 Changi Airport Air Cargo Hub</p>
                  <p className="text-slate-300">1 Freight Close, Changi Air Cargo Complex, Singapore 819830</p>
                  <p className="text-slate-400">Phone: +65 6542 1100 | Email: changi-hub@josanlogistics.com.sg</p>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-orange-400 text-sm">🇸🇬 Tuas Mega Port Sea Logistics Center</p>
                  <p className="text-slate-300">20 Tuas South Avenue 2, Singapore 637560</p>
                  <p className="text-slate-400">Phone: +65 6861 9900 | Email: tuas-port@josanlogistics.com.sg</p>
                </div>
              </div>
            </div>

            {/* Quick 24/7 Hotline Badge with Water Sinking & Spring Jumping Animation */}
            <div className="bg-orange-50/90 border-2 border-orange-200 p-6 rounded-2xl flex items-center space-x-4 animate-water-sink cursor-pointer hover:border-orange-400 transition-all relative overflow-hidden group">
              {/* Subtle Animated Water Wave Surface Line */}
              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-cyan-400 via-orange-400 to-cyan-500 opacity-80 animate-pulse"></div>
              
              <div className="w-12 h-12 rounded-xl bg-orange-gradient text-white flex items-center justify-center font-bold shrink-0 shadow-orange-sm group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">24/7 Singapore Hotline</h4>
                <p className="text-orange-600 font-extrabold text-lg font-mono tracking-tight">+65 6789 0123</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-orange-600 font-bold uppercase text-xs tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Got Questions? We Have Answers</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 text-sm hover:text-orange-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-orange-500' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-slate-600 text-xs leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
