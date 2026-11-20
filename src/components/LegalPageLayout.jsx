import React from 'react';
import { Printer, ArrowLeft, Shield, FileText, Truck, RotateCcw } from 'lucide-react';
import { COMPANY_INFO, SITE_CONTACT, isDisplayablePhone } from '../config/siteConfig';
import { useLogistics } from '../context/LogisticsContext';

export const LEGAL_TABS = [
  { id: 'privacy-policy', tabKey: 'privacy', label: 'Privacy Policy', icon: Shield },
  { id: 'terms-of-service', tabKey: 'terms', label: 'Terms & Conditions', icon: FileText },
  { id: 'shipping-policy', tabKey: 'shipping', label: 'Shipping Policy', icon: Truck },
  { id: 'refund-policy', tabKey: 'refund', label: 'Refund & Cancellation', icon: RotateCcw }
];

export const LegalPageLayout = ({
  activeTabKey = 'privacy',
  title,
  subtitle,
  effectiveDate = '1 November 2026',
  lastUpdated = '1 November 2026',
  jurisdiction = 'Republic of Singapore',
  setActiveTab,
  children
}) => {
  const { siteSettings } = useLogistics?.() || {};

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const navigateToTab = (dest) => {
    if (typeof setActiveTab === 'function') {
      setActiveTab(dest);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg,#f8fafc)] text-[var(--color-text,#0f172a)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500 pb-2 border-b border-slate-200/80">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => navigateToTab('home')}
              className="inline-flex items-center space-x-1 text-slate-600 hover:text-[var(--color-orange,#FF6B00)] font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium">Corporate Legal &amp; Compliance</span>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Print official document"
              aria-label="Print official document"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Document</span>
            </button>
          </div>
        </div>

        {/* Corporate Header - Dignified, Clean, Minimalist */}
        <header className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              {jurisdiction}
            </span>
            <span className="text-xs text-slate-500 font-normal">
              UEN: {COMPANY_INFO.uen} &bull; Registered in Singapore
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
                {subtitle}
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-500 font-medium">
            <span>Effective: <strong className="text-slate-700">{effectiveDate}</strong></span>
            <span>Last Reviewed: <strong className="text-slate-700">{lastUpdated}</strong></span>
            <span>Entity: <strong className="text-slate-700">{COMPANY_INFO.name}</strong></span>
          </div>
        </header>

        {/* Legal Policy Navigation Tabs */}
        <nav 
          aria-label="Legal documents navigation"
          className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs flex items-center overflow-x-auto scrollbar-none gap-1"
        >
          {LEGAL_TABS.map((tab) => {
            const isActive = tab.tabKey === activeTabKey || tab.id === activeTabKey;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => navigateToTab(tab.id)}
                className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center space-x-2 text-center shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[var(--color-orange,#FF6B00)]' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Main Document Body */}
        <main className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-12 shadow-xs text-left text-slate-700 text-sm sm:text-base leading-relaxed space-y-8">
          {children}

          {/* Official Contact & Legal Entity Footer Block */}
          <section className="mt-12 pt-8 border-t border-slate-200/80 bg-slate-50/60 -mx-6 sm:-mx-12 -mb-6 sm:-mb-12 p-6 sm:p-10 rounded-b-2xl space-y-4 text-xs sm:text-sm text-slate-600">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Corporate Enquiries &amp; Legal Notices
              </h2>
              <p className="text-slate-600">
                Official notices and commercial inquiries should be addressed to our registered office in Singapore:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">{COMPANY_INFO.name}</p>
                <p className="text-slate-600">{siteSettings?.registered_office || COMPANY_INFO.address}</p>
                <p className="text-slate-500">Business Registration (UEN): {COMPANY_INFO.uen}</p>
              </div>

              <div className="space-y-1">
                <p>
                  <strong className="text-slate-700">General Enquiries:</strong>{' '}
                  <a href={`mailto:${siteSettings?.contact_email || SITE_CONTACT.email}`} className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">
                    {siteSettings?.contact_email || SITE_CONTACT.email}
                  </a>
                </p>
                <p>
                  <strong className="text-slate-700">Data Protection Officer:</strong>{' '}
                  <a href="mailto:dpo@josanlogistics.com.sg" className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">
                    dpo@josanlogistics.com.sg
                  </a>
                </p>
                <p>
                  <strong className="text-slate-700">Billing &amp; Accounts:</strong>{' '}
                  <a href="mailto:billing@josanlogistics.com.sg" className="text-[var(--color-orange,#FF6B00)] font-semibold hover:underline">
                    billing@josanlogistics.com.sg
                  </a>
                </p>
                {isDisplayablePhone(siteSettings?.phone) && (
                  <p>
                    <strong className="text-slate-700">Operations Desk:</strong>{' '}
                    <a href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`} className="text-slate-900 font-semibold hover:underline">
                      {siteSettings.phone}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 text-slate-500 text-xs">
              <p>
                Operating Hours: Monday – Friday, 9:00 AM – 6:00 PM SGT &bull; Saturday, 9:00 AM – 1:00 PM SGT (Closed on Sundays and Singapore Public Holidays).
              </p>
            </div>
          </section>
        </main>

      </div>
    </div>
  );
};

