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

  // Hide cookie banner and floating icon on all /admin and /crm routes
  const isExcludedRoute = typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/admin') ||
    window.location.pathname.startsWith('/crm') ||
    window.location.hash.includes('admin') ||
    window.location.hash.includes('crm')
  );

  if (isExcludedRoute) return null;

  return (
    <>
      {/* ===================================================================== */}
      {/* 1. SLIM BOTTOM COOKIE BAR (FIRST VISIT ONLY, NO FLOATING CIRCLE)      */}
      {/* ===================================================================== */}
      {isVisible && !showSettingsModal && (
        <div
          role="region"
          aria-label="Cookie notice"
          className="fixed bottom-0 inset-x-0 z-[90] bg-[var(--color-navy)] text-[var(--color-on-navy)] border-t border-[var(--color-navy-border)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 pr-16 sm:pr-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p
              className="text-xs sm:text-sm text-[var(--color-on-navy-muted)] leading-relaxed"
              style={{ letterSpacing: 'normal' }}
            >
              We use only the cookies needed to run this site, such as login, security and chat. You can review your choices at any time. See our{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  openLegalDialog('privacy', e.currentTarget);
                }}
                className="text-[var(--color-on-navy)] underline underline-offset-4 hover:text-[var(--color-on-navy-muted)] font-medium inline cursor-pointer rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-on-navy)]"
                style={{ letterSpacing: 'normal' }}
                title="Open Privacy Policy pop-up"
              >
                Privacy Policy
              </button>.
            </p>

            {/* Buttons: Accept and Cookie settings (4px corners) */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleOk}
                className="px-4 py-2 rounded-[var(--radius)] bg-[var(--color-surface)] hover:bg-[var(--color-bg)] text-[var(--color-navy)] text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-on-navy)]"
                style={{ letterSpacing: 'normal' }}
              >
                Accept
              </button>

              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="px-4 py-2 rounded-[var(--radius)] bg-transparent hover:bg-[var(--color-navy-hover)] text-[var(--color-on-navy)] border border-[var(--color-on-navy-muted)] text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-on-navy)]"
                style={{ letterSpacing: 'normal' }}
              >
                Cookie settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. COOKIE SETTINGS DIALOG                                             */}
      {/* ===================================================================== */}
      {showSettingsModal && (
        <div
          className="fixed inset-0 z-[110] bg-[var(--color-navy)]/75 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setShowSettingsModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
        >
          <div
            className="bg-[var(--color-surface)] rounded-[var(--radius)] max-w-xl w-full p-5 sm:p-7 border border-[var(--color-border)] space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <div className="flex items-center space-x-2.5">
                <Settings className="w-5 h-5 text-[var(--color-navy)] shrink-0" aria-hidden="true" />
                <div>
                  <h3
                    id="cookie-settings-title"
                    className="text-[var(--color-text)] font-bold text-base sm:text-lg"
                    style={{ letterSpacing: 'normal' }}
                  >
                    Cookie settings
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]" style={{ letterSpacing: 'normal' }}>
                    We use only the cookies and storage items needed to run this site.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-[var(--radius)] bg-[var(--color-bg-alt)] hover:bg-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                aria-label="Close settings"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Content Sections */}
            <div className="space-y-3.5 text-xs">
              
              {/* SECTION: Strictly Necessary (Always On) */}
              <div className="p-4 bg-[var(--color-bg)] rounded-[var(--radius)] border border-[var(--color-border)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[var(--color-navy)]" aria-hidden="true" />
                    <span className="font-bold text-[var(--color-text)] text-xs sm:text-sm" style={{ letterSpacing: 'normal' }}>
                      Strictly necessary
                    </span>
                  </div>
                  <span
                    className="text-[11px] font-semibold text-[var(--color-navy)] bg-[var(--color-bg-alt)] border border-[var(--color-border)] px-2 py-0.5 rounded-[2px]"
                    style={{ letterSpacing: 'normal' }}
                  >
                    Always on
                  </span>
                </div>
                <p className="text-[var(--color-text-muted)] text-[11px] leading-relaxed" style={{ letterSpacing: 'normal' }}>
                  These items are strictly required for core website operation, security, and customer service. They cannot be switched off:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <li className="bg-[var(--color-surface)] p-2.5 rounded-[var(--radius)] border border-[var(--color-border)] flex items-start space-x-2">
                    <span className="text-[var(--color-navy)] font-bold">&bull;</span>
                    <div>
                      <strong className="text-[var(--color-text)] block font-semibold">Login</strong>
                      <span className="text-[var(--color-text-muted)] text-[10px]">Session authentication tokens for portal access</span>
                    </div>
                  </li>
                  <li className="bg-[var(--color-surface)] p-2.5 rounded-[var(--radius)] border border-[var(--color-border)] flex items-start space-x-2">
                    <span className="text-[var(--color-navy)] font-bold">&bull;</span>
                    <div>
                      <strong className="text-[var(--color-text)] block font-semibold">Security</strong>
                      <span className="text-[var(--color-text-muted)] text-[10px]">Anti-flood rate limits &amp; abuse mitigation</span>
                    </div>
                  </li>
                  <li className="bg-[var(--color-surface)] p-2.5 rounded-[var(--radius)] border border-[var(--color-border)] flex items-start space-x-2">
                    <span className="text-[var(--color-navy)] font-bold">&bull;</span>
                    <div>
                      <strong className="text-[var(--color-text)] block font-semibold">Cloudflare Turnstile</strong>
                      <span className="text-[var(--color-text-muted)] text-[10px]">Spam protection &amp; human verification</span>
                    </div>
                  </li>
                  <li className="bg-[var(--color-surface)] p-2.5 rounded-[var(--radius)] border border-[var(--color-border)] flex items-start space-x-2">
                    <span className="text-[var(--color-navy)] font-bold">&bull;</span>
                    <div>
                      <strong className="text-[var(--color-text)] block font-semibold">Chat session</strong>
                      <span className="text-[var(--color-text-muted)] text-[10px]">Conversation continuity with JOSAN AI chatbot</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* SECTION: Preferences (Only shown if non-essential settings exist; otherwise no toggle) */}
              {HAS_NON_ESSENTIAL_PREFERENCES ? (
                <div className="p-4 bg-[var(--color-surface)] rounded-[var(--radius)] border border-[var(--color-border)] flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-[var(--color-text)] text-xs sm:text-sm block">Preferences</span>
                    <p className="text-[var(--color-text-muted)] text-[11px] leading-relaxed">
                      Remembers non-essential interface preferences on this device.
                    </p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferencesToggle} 
                    onChange={(e) => setPreferencesToggle(e.target.checked)}
                    className="w-4 h-4 text-[var(--color-navy)] rounded-[2px] cursor-pointer mt-1 focus:ring-[var(--color-navy)]" 
                  />
                </div>
              ) : null}

              {/* SECTION: Analytics & Marketing Note (No toggles because we don't use them) */}
              <div className="p-3.5 bg-[var(--color-bg)] rounded-[var(--radius)] border border-[var(--color-border)] space-y-1">
                <span className="font-bold text-[var(--color-navy)] text-[11px] block" style={{ letterSpacing: 'normal' }}>
                  No Analytics or Marketing Trackers
                </span>
                <p className="text-[var(--color-text-muted)] text-[11px] leading-relaxed" style={{ letterSpacing: 'normal' }}>
                  We do not use Google Analytics, Meta Pixel, or marketing cookies. If non-essential tools are introduced in the future, they will remain blocked until your prior consent.
                </p>
              </div>

              {/* SECTION: Audited Cookies & Storage Table */}
              <div className="border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowInventoryTable(!showInventoryTable)}
                  className="w-full p-3 bg-[var(--color-bg)] hover:bg-[var(--color-bg-alt)] flex items-center justify-between text-xs font-bold text-[var(--color-text)] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                  style={{ letterSpacing: 'normal' }}
                >
                  <div className="flex items-center space-x-2">
                    <Table className="w-4 h-4 text-[var(--color-navy)]" aria-hidden="true" />
                    <span>Cookies &amp; storage items in use ({COOKIE_AUDIT_DATA.length})</span>
                  </div>
                  {showInventoryTable ? <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" aria-hidden="true" /> : <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" aria-hidden="true" />}
                </button>

                {showInventoryTable && (
                  <div className="p-3 bg-[var(--color-surface)] overflow-x-auto text-[11px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)] text-[11px]" style={{ letterSpacing: 'normal' }}>
                          <th className="py-2 px-2 font-semibold">Item Name</th>
                          <th className="py-2 px-2 font-semibold">Category</th>
                          <th className="py-2 px-2 font-semibold">Provider</th>
                          <th className="py-2 px-2 font-semibold">Duration</th>
                          <th className="py-2 px-2 font-semibold">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text-muted)]">
                        {COOKIE_AUDIT_DATA.map((item) => (
                          <tr key={item.name} className="hover:bg-[var(--color-bg)]">
                            <td className="py-2 px-2 font-mono text-[10px] text-[var(--color-text)] font-semibold">{item.name}</td>
                            <td className="py-2 px-2 whitespace-nowrap">
                              <span className="px-1.5 py-0.5 rounded-[2px] text-[10px] font-semibold bg-[var(--color-bg-alt)] text-[var(--color-navy)] border border-[var(--color-border)]">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-2 px-2 whitespace-nowrap text-[var(--color-text-muted)]">{item.provider}</td>
                            <td className="py-2 px-2 whitespace-nowrap text-[var(--color-text-muted)]">{item.duration}</td>
                            <td className="py-2 px-2 text-[var(--color-text-muted)] leading-snug">{item.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

            {/* Retention Note & Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--color-border)]">
              <span className="text-[11px] text-[var(--color-text-muted)]" style={{ letterSpacing: 'normal' }}>
                Notice acknowledgement saved for 12 months.
              </span>
              <button
                type="button"
                onClick={handleOk}
                className="w-full sm:w-auto px-6 py-2.5 rounded-[var(--radius)] bg-[var(--color-navy)] hover:bg-[var(--color-navy-hover)] text-[var(--color-on-navy)] text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                style={{ letterSpacing: 'normal' }}
              >
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Accept</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
