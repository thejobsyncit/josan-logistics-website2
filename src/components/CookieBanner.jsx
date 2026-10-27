import React, { useState, useEffect } from 'react';
import { 
  Cookie, 
  X, 
  ShieldCheck, 
  Settings, 
  CheckCircle2, 
  Table,
  ChevronDown,
  ChevronUp,
  Lock
} from 'lucide-react';
import { openLegalDialog } from './LegalDialog';

// Cookie retention duration: 12 months per standard privacy guidelines
export const COOKIE_CATEGORY_VERSION = '2026.2';
export const COOKIE_RETENTION_MS = 365 * 24 * 60 * 60 * 1000;

// Whether the application stores optional, non-essential user preference settings
// (Currently false: the site stores only essential session, security, and chat state)
export const HAS_NON_ESSENTIAL_PREFERENCES = false;

// Audited inventory of cookies and storage items ACTUALLY used on josanlogistics.com.sg
// Strictly necessary: login, security, Cloudflare Turnstile, chat session
// (No analytics, Meta Pixel, advertising, or marketing trackers are used)
export const COOKIE_AUDIT_DATA = [
  {
    name: 'josan_auth_token / sb-*-auth-token',
    provider: 'Josan Logistics / Supabase',
    purpose: 'Authenticates customer and staff login sessions for secure dashboard and booking access.',
    category: 'Strictly Necessary',
    duration: 'Session / Persistent until logout',
    type: 'Local Storage'
  },
  {
    name: '__cf_bm / cf_clearance',
    provider: 'Cloudflare',
    purpose: 'Cloudflare Turnstile security cookies to mitigate automated bots and verify human visitors on Quote and Contact forms.',
    category: 'Strictly Necessary',
    duration: '30 mins to 1 year',
    type: 'HTTP Cookie'
  },
  {
    name: 'rate_limit_*',
    provider: 'Josan Logistics',
    purpose: 'Prevents automated form submission floods and brute-force attempts on public quote and contact endpoints.',
    category: 'Strictly Necessary',
    duration: '15 mins to 24 hours',
    type: 'Local Storage'
  },
  {
    name: 'josan_session_chat_id',
    provider: 'Josan Logistics',
    purpose: 'Maintains active conversation session with JOSAN AI chatbot strictly during your browser session.',
    category: 'Strictly Necessary',
    duration: 'Browser Session (cleared when session ends)',
    type: 'Session Storage'
  },
  {
    name: 'josan_session_chat_messages',
    provider: 'Josan Logistics',
    purpose: 'Keeps chat messages strictly within your active browser tab/session so conversation is retained only while browsing.',
    category: 'Strictly Necessary',
    duration: 'Browser Session (cleared when session ends)',
    type: 'Session Storage'
  },
  {
    name: 'josan_cookie_consent_record',
    provider: 'Josan Logistics',
    purpose: 'Stores your cookie notice acknowledgement timestamp to prevent re-prompting on every visit.',
    category: 'Strictly Necessary',
    duration: '12 Months',
    type: 'Local Storage'
  }
];

// Helper function to check if consent has been granted for any category.
// Strictly necessary is always allowed; analytics/marketing always default to false.
export const hasCookieConsent = (category = 'necessary') => {
  if (category === 'necessary') return true;
  try {
    const raw = localStorage.getItem('josan_cookie_consent_record');
    if (!raw) return false;
    const record = JSON.parse(raw);
    if (!record || Date.now() > (record.expiresAt || 0) || record.version !== COOKIE_CATEGORY_VERSION) {
      return false;
    }
    return Boolean(record.preferences?.[category]);
  } catch (e) {
    return false;
  }
};

// Guard function: blocks any future analytics or marketing tools until explicit consent is granted
export const runWithConsent = (category, callback) => {
  if (hasCookieConsent(category)) {
    callback();
  } else {
    const handler = (e) => {
      if (e.detail?.preferences?.[category]) {
        window.removeEventListener('josan-cookie-consent-updated', handler);
        callback();
      }
    };
    window.addEventListener('josan-cookie-consent-updated', handler);
  }
};

// Global helper function so footer links, buttons, or legal dialogs can open Cookie Settings
export const openCookiePreferences = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
  }
};

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInventoryTable, setShowInventoryTable] = useState(false);
  const [preferencesToggle, setPreferencesToggle] = useState(false);

  // Check consent on mount: show small notice only on first visit (or after 12 months expiry)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('josan_cookie_consent_record');
      if (raw) {
        const record = JSON.parse(raw);
        const isExpired = Date.now() > (record.expiresAt || 0);
        const isOldVersion = record.version !== COOKIE_CATEGORY_VERSION;

        if (isExpired || isOldVersion) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
          if (record.preferences?.preferences) {
            setPreferencesToggle(record.preferences.preferences);
          }
        }
      } else {
        // First visit: show small card at bottom left (delayed slightly for smooth entry)
        const timer = setTimeout(() => setIsVisible(true), 600);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      setIsVisible(true);
    }
  }, []);

  // Listen for global open event (from footer, navigation, or privacy policy)
  useEffect(() => {
    const handleOpen = () => setShowSettingsModal(true);
    window.addEventListener('open-cookie-preferences', handleOpen);
    return () => window.removeEventListener('open-cookie-preferences', handleOpen);
  }, []);

  // Save consent record for 12 months
  const saveConsent = (customPreferences = {}) => {
    try {
      const now = Date.now();
      const record = {
        version: COOKIE_CATEGORY_VERSION,
        timestamp: now,
        expiresAt: now + COOKIE_RETENTION_MS,
        preferences: {
          necessary: true,
          preferences: HAS_NON_ESSENTIAL_PREFERENCES ? Boolean(customPreferences.preferences) : false,
          analytics: false, // We do not use analytics
          marketing: false  // We do not use marketing
        }
      };

      localStorage.setItem('josan_cookie_consent_record', JSON.stringify(record));
      localStorage.setItem('josan_cookie_preferences', JSON.stringify(record.preferences));
      localStorage.setItem('josan_cookie_consent', 'acknowledged');

      // Dispatch event to unblock any conditionally registered scripts
      window.dispatchEvent(new CustomEvent('josan-cookie-consent-updated', { detail: record }));
    } catch (e) {}

    setIsVisible(false);
    setShowSettingsModal(false);
  };

  const handleOk = () => {
    saveConsent({ preferences: preferencesToggle });
  };

  return (
    <>
      {/* ===================================================================== */}
      {/* 1. SMALL BOTTOM-LEFT COOKIE NOTICE (DOES NOT OVERLAP JOSAN AI)        */}
      {/* ===================================================================== */}
      {isVisible && !showSettingsModal && (
        <div 
          role="region" 
          aria-label="Cookie notice" 
          className="fixed bottom-4 left-4 z-[90] max-w-sm sm:max-w-md w-[calc(100%-2rem)] sm:w-auto animate-fadeIn"
        >
          <div className="bg-[#0B1F3A] text-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#1E3A5F] shadow-2xl backdrop-blur-md space-y-3.5">
            {/* Header */}
            <div className="flex items-center space-x-2 text-[#F26B21]">
              <Cookie className="w-4 h-4 shrink-0" />
              <span className="font-extrabold text-[11px] uppercase tracking-wider text-orange-400">
                Cookie Notice
              </span>
            </div>

            {/* Notice Text */}
            <p className="text-xs text-slate-300 leading-relaxed">
              We use only the cookies needed to run this site, such as login, security and chat. You can review your choices at any time. See our{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  openLegalDialog('privacy', e.currentTarget);
                }}
                className="text-[#F26B21] hover:underline font-bold inline cursor-pointer"
                title="Open Privacy Policy pop-up"
              >
                Privacy Policy
              </button>.
            </p>

            {/* Buttons: OK and Cookie settings */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleOk}
                className="flex-1 py-2 px-4 rounded-xl bg-[#F26B21] hover:bg-[#D95A13] text-white text-xs font-bold transition-all cursor-pointer text-center shadow-xs"
              >
                OK
              </button>

              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/20 text-xs font-bold transition-all cursor-pointer text-center whitespace-nowrap"
              >
                Cookie settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. FLOATING COOKIE BUTTON (BOTTOM-LEFT AFTER NOTICE DISMISSED)         */}
      {/* ===================================================================== */}
      {!isVisible && !showSettingsModal && (
        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          className="fixed bottom-4 left-4 z-[80] w-9 h-9 rounded-full bg-[#0B1F3A] hover:bg-[#F26B21] text-white border border-[#1E3A5F] shadow-lg flex items-center justify-center transition-all cursor-pointer group hover:scale-105"
          title="Cookie settings"
          aria-label="Open Cookie Settings"
        >
          <Cookie className="w-4 h-4 text-orange-400 group-hover:text-white transition-colors" />
        </button>
      )}

      {/* ===================================================================== */}
      {/* 3. COOKIE SETTINGS DIALOG                                            */}
      {/* ===================================================================== */}
      {showSettingsModal && (
        <div 
          className="fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
          onClick={() => setShowSettingsModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F26B21]">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="cookie-settings-title" className="text-slate-900 font-extrabold text-base sm:text-lg">
                    Cookie settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    We use only the cookies and storage items needed to run this site.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close settings"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Sections */}
            <div className="space-y-3.5 text-xs">
              
              {/* SECTION: Strictly Necessary (Always On) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      Strictly necessary
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Always on
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  These items are strictly required for core website operation, security, and customer service. They cannot be switched off:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <li className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-start space-x-2">
                    <span className="text-[#2463EB] font-bold">&bull;</span>
                    <div>
                      <strong className="text-slate-900 block font-semibold">Login</strong>
                      <span className="text-slate-500 text-[10px]">Session authentication tokens for portal access</span>
                    </div>
                  </li>
                  <li className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-start space-x-2">
                    <span className="text-[#2463EB] font-bold">&bull;</span>
                    <div>
                      <strong className="text-slate-900 block font-semibold">Security</strong>
                      <span className="text-slate-500 text-[10px]">Anti-flood rate limits &amp; abuse mitigation</span>
                    </div>
                  </li>
                  <li className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-start space-x-2">
                    <span className="text-[#2463EB] font-bold">&bull;</span>
                    <div>
                      <strong className="text-slate-900 block font-semibold">Cloudflare Turnstile</strong>
                      <span className="text-slate-500 text-[10px]">Spam protection &amp; human verification</span>
                    </div>
                  </li>
                  <li className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-start space-x-2">
                    <span className="text-[#2463EB] font-bold">&bull;</span>
                    <div>
                      <strong className="text-slate-900 block font-semibold">Chat session</strong>
                      <span className="text-slate-500 text-[10px]">Conversation continuity with JOSAN AI chatbot</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* SECTION: Preferences (Only shown if non-essential settings exist; otherwise no toggle) */}
              {HAS_NON_ESSENTIAL_PREFERENCES ? (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm block">Preferences</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Remembers non-essential interface preferences on this device.
                    </p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferencesToggle} 
                    onChange={(e) => setPreferencesToggle(e.target.checked)}
                    className="w-4 h-4 text-[#F26B21] rounded cursor-pointer mt-1 focus:ring-[#F26B21]" 
                  />
                </div>
              ) : null}

              {/* SECTION: Analytics & Marketing Note (No toggles because we don't use them) */}
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1">
                <span className="font-bold text-blue-900 text-[11px] block">
                  No Analytics or Marketing Trackers
                </span>
                <p className="text-blue-800 text-[10px] leading-relaxed">
                  We do not use Google Analytics, Meta Pixel, or marketing cookies. If non-essential tools are introduced in the future, they will remain blocked until your prior consent.
                </p>
              </div>

              {/* SECTION: Audited Cookies & Storage Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowInventoryTable(!showInventoryTable)}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Table className="w-4 h-4 text-[#F26B21]" />
                    <span>Cookies &amp; storage items in use ({COOKIE_AUDIT_DATA.length})</span>
                  </div>
                  {showInventoryTable ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>

                {showInventoryTable && (
                  <div className="p-3 bg-white overflow-x-auto text-[11px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                          <th className="py-2 px-2 font-bold">Item Name</th>
                          <th className="py-2 px-2 font-bold">Category</th>
                          <th className="py-2 px-2 font-bold">Provider</th>
                          <th className="py-2 px-2 font-bold">Duration</th>
                          <th className="py-2 px-2 font-bold">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {COOKIE_AUDIT_DATA.map((item) => (
                          <tr key={item.name} className="hover:bg-slate-50/70">
                            <td className="py-2 px-2 font-mono text-[10px] text-slate-900 font-semibold">{item.name}</td>
                            <td className="py-2 px-2 whitespace-nowrap">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-2 px-2 whitespace-nowrap text-slate-600">{item.provider}</td>
                            <td className="py-2 px-2 whitespace-nowrap text-slate-600">{item.duration}</td>
                            <td className="py-2 px-2 text-slate-600 leading-snug">{item.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

            {/* Retention Note & Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Notice acknowledgement saved for 12 months.
              </span>
              <button
                type="button"
                onClick={handleOk}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#F26B21] hover:bg-[#D95A13] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>OK</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
