import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  FileText, 
  Phone, 
  HelpCircle, 
  Megaphone, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Sparkles, 
  Sliders,
  X
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

export const WebsiteContentTab = ({
  websiteContent = {},
  onUpdateContent,
  onAddFaq,
  onUpdateFaq,
  onDeleteFaq
}) => {
  const { siteSettings, updateSiteSettings } = useLogistics?.() || {};
  const [activeSection, setActiveSection] = useState('hero');

  // Form states initialized from websiteContent
  const [heroForm, setHeroForm] = useState(websiteContent.hero || {});
  const [aboutForm, setAboutForm] = useState(websiteContent.about || {});
  const [servicesForm, setServicesForm] = useState(websiteContent.services || {});
  const [contactForm, setContactForm] = useState(websiteContent.contact || {});
  const [bannerForm, setBannerForm] = useState(websiteContent.banner || {});

  // FAQ Modal
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({ q: '', a: '' });

  const handleSaveSection = (sectionKey, data) => {
    onUpdateContent(sectionKey, data);
    if (sectionKey === 'contact' && updateSiteSettings) {
      updateSiteSettings({
        phone: data.phone || siteSettings?.phone,
        contact_email: data.email || siteSettings?.contact_email,
        registered_office: data.address || siteSettings?.registered_office
      });
    }
  };

  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqForm({ q: '', a: '' });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (faq) => {
    setEditingFaq(faq);
    setFaqForm({ q: faq.q, a: faq.a });
    setIsFaqModalOpen(true);
  };

  const handleFaqSubmit = (e) => {
    e.preventDefault();
    if (!faqForm.q.trim() || !faqForm.a.trim()) return;

    if (editingFaq) {
      onUpdateFaq(editingFaq.id, faqForm);
    } else {
      onAddFaq(faqForm);
    }
    setIsFaqModalOpen(false);
  };

  const sections = [
    { id: 'hero', label: 'Homepage Hero', icon: Globe },
    { id: 'about', label: 'About Us Content', icon: FileText },
    { id: 'services', label: 'Service Descriptions', icon: Sliders },
    { id: 'contact', label: 'Contact Information', icon: Phone },
    { id: 'faqs', label: 'Website FAQs', icon: HelpCircle },
    { id: 'banner', label: 'Announcement Banner', icon: Megaphone },
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-black text-slate-900 font-heading">Public Website Content Management</h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
            Live Synchronized
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Update public copy, headlines, contact details, FAQs, and announcement banners. Changes automatically reflect on the public customer website.
        </p>
      </div>

      {/* 2. Section Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {sections.map(s => {
          const IconComp = s.icon;
          const isSelected = activeSection === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSection(s.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-2 border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isSelected ? 'text-[#2463EB]' : 'text-slate-400'}`} />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. SECTION EDITORS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8">
        {/* TAB 1: HERO */}
        {activeSection === 'hero' && (
          <form
            onSubmit={(e) => { e.preventDefault(); handleSaveSection('hero', heroForm); }}
            className="space-y-5"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Homepage Hero Banner Content</h3>
              <p className="text-xs text-slate-500">Edit the prominent headline, subtitle, and badges displayed on the homepage.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Main Headline Title</label>
                <input
                  type="text"
                  value={heroForm.title || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  placeholder="Reliable Logistics Solutions For Every Journey"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Subtitle Description</label>
                <textarea
                  rows="3"
                  value={heroForm.subtitle || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  placeholder="From Air Waybill preparation and shipment documentation to commercial road transportation, we provide reliable logistics support for businesses moving goods from one location to another."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Primary CTA Button Label</label>
                <input
                  type="text"
                  value={heroForm.ctaPrimary || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, ctaPrimary: e.target.value, ctaSecondary: '' })}
                  placeholder="Get a Freight Quote"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Homepage Content</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: ABOUT */}
        {activeSection === 'about' && (
          <form
            onSubmit={(e) => { e.preventDefault(); handleSaveSection('about', aboutForm); }}
            className="space-y-5"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">About Us Information</h3>
              <p className="text-xs text-slate-500">Manage company background, mission, vision, and core operational principles.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Tagline</label>
                <input
                  type="text"
                  value={aboutForm.tagline || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Mission Statement</label>
                <textarea
                  rows="2"
                  value={aboutForm.mission || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, mission: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Vision Statement</label>
                <textarea
                  rows="2"
                  value={aboutForm.vision || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2463EB]/20"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save About Content</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: SERVICES DESCRIPTIONS */}
        {activeSection === 'services' && (
          <form
            onSubmit={(e) => { e.preventDefault(); handleSaveSection('services', servicesForm); }}
            className="space-y-6"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Website Service Descriptions</h3>
              <p className="text-xs text-slate-500">Descriptions for Josan's three core commercial services.</p>
            </div>

            <div className="space-y-5">
              {/* Airway */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-black uppercase text-slate-900 block">1. Air Freight Services</span>
                <input
                  type="text"
                  value={servicesForm.airway?.title || ''}
                  onChange={(e) => setServicesForm({
                    ...servicesForm,
                    airway: { ...servicesForm.airway, title: e.target.value }
                  })}
                  placeholder="Service Title"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                />
                <textarea
                  rows="2"
                  value={servicesForm.airway?.shortDesc || ''}
                  onChange={(e) => setServicesForm({
                    ...servicesForm,
                    airway: { ...servicesForm.airway, shortDesc: e.target.value }
                  })}
                  placeholder="Short summary description"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              {/* Road */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-black uppercase text-slate-900 block">2. Commercial Road Transportation</span>
                <input
                  type="text"
                  value={servicesForm.road?.title || ''}
                  onChange={(e) => setServicesForm({
                    ...servicesForm,
                    road: { ...servicesForm.road, title: e.target.value }
                  })}
                  placeholder="Service Title"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                />
                <textarea
                  rows="2"
                  value={servicesForm.road?.shortDesc || ''}
                  onChange={(e) => setServicesForm({
                    ...servicesForm,
                    road: { ...servicesForm.road, shortDesc: e.target.value }
                  })}
                  placeholder="Short summary description"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              {/* Documentation */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-black uppercase text-slate-900 block">3. Shipment Documentation Support</span>
                <input
                  type="text"
                  value={servicesForm.documentation?.title || ''}
                  onChange={(e) => setServicesForm({
                    ...servicesForm,
                    documentation: { ...servicesForm.documentation, title: e.target.value }
                  })}
                  placeholder="Shipment Documentation Support"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                />
                <textarea
                  rows="2"
                  value={servicesForm.documentation?.shortDesc || ''}
                  onChange={(e) => setServicesForm({
                    ...servicesForm,
                    documentation: { ...servicesForm.documentation, shortDesc: e.target.value }
                  })}
                  placeholder="Help preparing and organising shipment documents. Documentation support only; we do not provide customs clearance."
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Service Descriptions</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: CONTACT */}
        {activeSection === 'contact' && (
          <form
            onSubmit={(e) => { e.preventDefault(); handleSaveSection('contact', contactForm); }}
            className="space-y-5"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Contact & Support Information</h3>
              <p className="text-xs text-slate-500">Phone number, email, office address and opening hours.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Headquarters Telephone</label>
                <input
                  type="text"
                  value={contactForm.phone || siteSettings?.phone || '+65 6789 0123'}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="+65 6789 0123"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
                <span className="text-[10px] text-slate-400 block">Single site phone from site_settings.</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">General Enquiries Email</label>
                <input
                  type="email"
                  value={contactForm.email || siteSettings?.contact_email || 'contact@josanlogistics.com.sg'}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="contact@josanlogistics.com.sg"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
                <span className="text-[10px] text-slate-400 block">Single site contact email from site_settings (.com.sg).</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Physical Office Address</label>
              <input
                type="text"
                value={contactForm.address || siteSettings?.registered_office || '10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438'}
                onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                placeholder="10 Pasir Panjang Road, #12-01 Mapletree Business City, Singapore 117438"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Operating Hours</label>
              <input
                type="text"
                value={contactForm.operatingHours || '[ENTER REAL HOURS]'}
                onChange={(e) => setContactForm({ ...contactForm, operatingHours: e.target.value })}
                placeholder="[ENTER REAL HOURS]"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 font-mono"
              />
              <span className="text-[10px] text-slate-400 block">Operating hours: [ENTER REAL HOURS].</span>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Contact Info</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 5: FAQS */}
        {activeSection === 'faqs' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Website Frequently Asked Questions</h3>
                <p className="text-xs text-slate-500">Manage FAQs displayed on customer contact and support pages.</p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddFaq}
                className="px-3.5 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {(websiteContent.faqs || []).map((faq, idx) => (
                <div key={faq.id || idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-extrabold text-slate-900">{faq.q}</p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditFaq(faq)}
                      className="p-1.5 text-slate-500 hover:text-[#2463EB] cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteFaq(faq.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: BANNER */}
        {activeSection === 'banner' && (
          <form
            onSubmit={(e) => { e.preventDefault(); handleSaveSection('banner', bannerForm); }}
            className="space-y-5"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Website Announcement Banner</h3>
              <p className="text-xs text-slate-500">Configure global notice bar visible across public website header.</p>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <input
                type="checkbox"
                id="bannerActive"
                checked={bannerForm.active || false}
                onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
                className="w-4 h-4 text-[#FF6B00] rounded focus:ring-[#FF6B00] cursor-pointer"
              />
              <label htmlFor="bannerActive" className="text-xs font-bold text-slate-800 cursor-pointer">
                Display Announcement Banner on Public Website (Keep Disabled)
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Banner Message Text</label>
              <input
                type="text"
                value={bannerForm.text || 'Air freight documentation support and road transportation coordination in Singapore.'}
                onChange={(e) => setBannerForm({ ...bannerForm, text: e.target.value })}
                placeholder="Air freight documentation support and road transportation coordination in Singapore."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Banner Settings</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Add / Edit FAQ Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">
                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
              </h3>
              <button type="button" onClick={() => setIsFaqModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFaqSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Question</label>
                <input
                  type="text"
                  required
                  value={faqForm.q}
                  onChange={(e) => setFaqForm({ ...faqForm, q: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Answer</label>
                <textarea
                  rows="3"
                  required
                  value={faqForm.a}
                  onChange={(e) => setFaqForm({ ...faqForm, a: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
