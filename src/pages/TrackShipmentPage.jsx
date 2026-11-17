import React, { useState, useEffect } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { formatSingaporeDateTime } from '../utils/dateTime';
import { TurnstileCaptcha } from '../components/TurnstileCaptcha';
import { initialWebsiteContent } from '../data/adminCrmData';
import { 
  RotateCw, 
  Copy 
} from 'lucide-react';

const RATE_LIMIT_STORAGE_KEY = 'josan_rate_limit_track_shipment';

const getRateLimitStatus = (maxAttempts = 10, windowMs = 60000) => {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    const now = Date.now();
    let timestamps = raw ? JSON.parse(raw) : [];
    timestamps = timestamps.filter(t => typeof t === 'number' && now - t < windowMs);

    if (timestamps.length >= maxAttempts) {
      const oldest = timestamps[0];
      const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
      return { allowed: false, retryAfter };
    }
    return { allowed: true, retryAfter: 0 };
  } catch (_e) {
    return { allowed: true, retryAfter: 0 };
  }
};

const recordRateLimitAttempt = (windowMs = 60000) => {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    const now = Date.now();
    let timestamps = raw ? JSON.parse(raw) : [];
    timestamps = timestamps.filter(t => typeof t === 'number' && now - t < windowMs);
    timestamps.push(now);
    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(timestamps));
  } catch (_e) {}
};

export const TrackShipmentPage = ({ setActiveTab }) => {
  const { activeTrackingId, setActiveTrackingId, websiteContent } = useLogistics();

  const trackingContent = websiteContent?.tracking || initialWebsiteContent.tracking;
  const heroCopy = trackingContent?.hero || initialWebsiteContent.tracking.hero;
  const formCopy = trackingContent?.form || initialWebsiteContent.tracking.form;
  const guidelinesCopy = trackingContent?.guidelines || initialWebsiteContent.tracking.guidelines;
  const helpCopy = trackingContent?.help || initialWebsiteContent.tracking.help;
  const notFoundCopy = trackingContent?.notFound || initialWebsiteContent.tracking.notFound;
  const eventsCopy = trackingContent?.events || initialWebsiteContent.tracking.events;

  const heroSubtext = heroCopy?.subtext || 'Enter your tracking number to see the latest status of your road shipment. Updates are entered by our team, and the time of the last update is shown.';
  const guidelinesText = guidelinesCopy?.text || 'Our team will send you a tracking number after we book your carrier. Enter it above to see the latest status of your road shipment.';

  const [searchInput, setSearchInput] = useState(activeTrackingId || '');
  const [shipmentData, setShipmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);
  const [rateLimitMessage, setRateLimitMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Cloudflare Turnstile verification states
  const [turnstileToken, setTurnstileToken] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);

  // Rate limiter countdown timer
  useEffect(() => {
    if (rateLimitSeconds <= 0) return;
    const interval = setInterval(() => {
      setRateLimitSeconds((prev) => {
        if (prev <= 1) {
          setRateLimitMessage('');
          setErrorMessage('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [rateLimitSeconds]);

  // Check client-side rate limit on component mount
  useEffect(() => {
    const status = getRateLimitStatus(10, 60000);
    if (!status.allowed) {
      setRateLimitSeconds(status.retryAfter);
      setRateLimitMessage(formCopy.clientRateLimitError || 'Rate limit reached: Maximum 10 tracking queries per minute allowed.');
    }
  }, [formCopy.clientRateLimitError]);

  // Perform tracking search calling the Edge Function
  const handleSearch = async (queryOverride) => {
    const rawQuery = queryOverride !== undefined ? queryOverride : searchInput;
    const cleanQuery = (rawQuery || '').trim().toUpperCase();

    if (!cleanQuery) {
      setErrorMessage('Please enter a valid tracking number.');
      return;
    }

    // Validate format: 6 to 40 characters, letters, digits, and hyphens only
    if (!/^[A-Za-z0-9\-]{6,40}$/.test(cleanQuery)) {
      setNotFound(true);
      setShipmentData(null);
      setErrorMessage('');
      setRateLimitMessage('');
      setRateLimitSeconds(0);
      return;
    }

    // Require Cloudflare Turnstile verification
    if (!captchaVerified || !turnstileToken) {
      setCaptchaError('Please complete security verification first.');
      return;
    }

    // Enforce rate limiting: 10 attempts per minute per visitor
    const status = getRateLimitStatus(10, 60000);
    if (!status.allowed) {
      setRateLimitSeconds(status.retryAfter);
      setRateLimitMessage(formCopy.clientRateLimitError || 'Rate limit reached: Maximum 10 tracking queries per minute allowed.');
      return;
    }

    recordRateLimitAttempt(60000);

    setIsLoading(true);
    setNotFound(false);
    setErrorMessage('');
    setRateLimitMessage('');
    setCaptchaError('');

    try {
      let status = 404;
      let retryAfter = null;
      let errorMsg = null;
      let shipment = null;
      let invokeHandled = false;

      // Primary invocation via supabase.functions.invoke
      if (isSupabaseConfigured && supabase?.functions) {
        try {
          const { data: resData, error: funcError } = await supabase.functions.invoke('track-shipment', {
            body: {
              tracking_number: cleanQuery,
              turnstile_token: turnstileToken || ''
            }
          });

          if (!funcError) {
            invokeHandled = true;
            status = 200;
            shipment = resData?.data !== undefined ? resData.data : resData;
          } else if (funcError.context) {
            invokeHandled = true;
            status = funcError.context.status;
            retryAfter = funcError.context.headers?.get('retry-after');
            const body = await funcError.context.json().catch(() => null);
            errorMsg = body?.error || null;
          }
        } catch (_invokeErr) {
          invokeHandled = false;
        }
      }

      // Direct fetch fallback if supabase client invoke was unavailable
      if (!invokeHandled) {
        const supabaseUrl = (import.meta.env?.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
        const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';
        if (supabaseUrl && supabaseAnonKey) {
          const response = await fetch(`${supabaseUrl}/functions/v1/track-shipment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'apikey': supabaseAnonKey
            },
            body: JSON.stringify({
              tracking_number: cleanQuery,
              turnstile_token: turnstileToken || ''
            })
          });

          status = response.status;
          retryAfter = response.headers.get('retry-after');
          const resJson = await response.json().catch(() => null);
          if (response.ok) {
            shipment = resJson?.data !== undefined ? resJson.data : resJson;
          } else {
            errorMsg = resJson?.error || null;
          }
        }
      }

      // 1. HTTP 429: Rate limit exceeded
      if (status === 429) {
        const parsedSeconds = retryAfter ? parseInt(retryAfter, 10) : 3600;
        const countdownSeconds = (!isNaN(parsedSeconds) && parsedSeconds > 0) ? parsedSeconds : 3600;
        setRateLimitSeconds(countdownSeconds);
        setRateLimitMessage(errorMsg || 'Too many lookups. Please try again later.');
        setErrorMessage('');
        setNotFound(false);
        setShipmentData(null);
        if (setActiveTrackingId) setActiveTrackingId('');
        return;
      }

      // 2. HTTP 503: Tracking temporarily unavailable
      if (status === 503) {
        setErrorMessage(errorMsg || 'Tracking is temporarily unavailable.');
        setRateLimitSeconds(0);
        setRateLimitMessage('');
        setNotFound(false);
        setShipmentData(null);
        if (setActiveTrackingId) setActiveTrackingId('');
        return;
      }

      // 3. HTTP 404 or missing shipment data: Neutral not found
      if (status === 404 || !shipment || !shipment.tracking_number) {
        setNotFound(true);
        setErrorMessage('');
        setRateLimitSeconds(0);
        setRateLimitMessage('');
        setShipmentData(null);
        if (setActiveTrackingId) setActiveTrackingId('');
        return;
      }

      // 4. HTTP 200: Successful lookup
      setNotFound(false);
      setErrorMessage('');
      setRateLimitSeconds(0);
      setRateLimitMessage('');
      setShipmentData(shipment);
      if (setActiveTrackingId) setActiveTrackingId(shipment.tracking_number);
    } catch (_err) {
      console.warn('[TrackShipmentPage] Tracking lookup notice');
      setNotFound(true);
      setErrorMessage('');
      setShipmentData(null);
    } finally {
      setIsLoading(false);
      // Reset Turnstile token for next lookup
      setTurnstileKey(prev => prev + 1);
      setCaptchaVerified(false);
      setTurnstileToken('');
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatStatusLabel = (status) => {
    if (!status) return 'Booked';
    const s = status.trim();
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* 2. HERO: flat --color-navy band, straight bottom edge, 4px --color-kraft strip along bottom edge */}
      <section className="w-full bg-[var(--color-navy)] text-[var(--color-on-navy)] border-b-4 border-[var(--color-kraft)] py-[64px] px-4 sm:px-6 lg:px-8 text-left">
        <div className="max-w-[1100px] mx-auto">
          <h1
            className="text-[32px] sm:text-5xl font-bold font-heading text-[var(--color-on-navy)] leading-[1.2] max-w-3xl"
            style={{ letterSpacing: 'normal' }}
          >
            {heroCopy.heading}
          </h1>
          <p
            className="mt-3.5 text-sm sm:text-base font-normal text-[var(--color-on-navy-muted)] leading-relaxed max-w-2xl"
            style={{ letterSpacing: 'normal' }}
          >
            {heroSubtext}
          </p>
        </div>
      </section>

      {/* 3. TRACKING FORM & DETAILS SECTION - TWO COLUMNS (DESKTOP) */}
      <section className="w-full bg-[var(--color-bg)] py-[72px] px-4 sm:px-6 lg:px-8 text-left">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT COLUMN (about 60%): Form, Error, Result, Help line */}
            <div className="lg:col-span-7 w-full space-y-6">

              {/* FORM BLOCK: white, 1px border, 4px corners, no shadow, 3px kraft top border, 24px padding */}
              <div
                className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] p-6 shadow-none"
                style={{ borderTopColor: 'var(--color-kraft)' }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="tracking-number-input"
                      className="block text-sm font-semibold text-[var(--color-navy)] mb-2"
                      style={{ letterSpacing: 'normal' }}
                    >
                      {formCopy.label}
                    </label>
                    <input
                      id="tracking-number-input"
                      type="text"
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                        setErrorMessage('');
                        setNotFound(false);
                      }}
                      placeholder={formCopy.placeholder}
                      disabled={isLoading || rateLimitSeconds > 0}
                      className="w-full h-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] px-4 text-sm sm:text-base text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] focus:border-transparent transition-colors disabled:opacity-50"
                      style={{ letterSpacing: 'normal' }}
                    />
                  </div>

                  {/* Cloudflare Turnstile Verification Widget - 16px spacing above and below (my-4) */}
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

                  {/* Track button - ONLY orange element on the page */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading || rateLimitSeconds > 0 || !captchaVerified || !turnstileToken}
                      className="w-full sm:w-auto px-6 py-3 bg-[var(--color-orange)] hover:bg-[var(--color-orange-hover)] disabled:opacity-65 text-[var(--color-on-navy)] font-semibold text-sm sm:text-base rounded-[var(--radius)] transition-colors cursor-pointer disabled:cursor-not-allowed shadow-none text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"
                      style={{ letterSpacing: 'normal' }}
                    >
                      {isLoading ? (
                        <span className="inline-flex items-center justify-center gap-2">
                          <RotateCw className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                          <span>{formCopy.buttonLoadingLabel || 'Searching...'}</span>
                        </span>
                      ) : (
                        <span>{formCopy.buttonLabel}</span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Rate Limiting Warning (429) */}
                {rateLimitSeconds > 0 && (
                  <div className="mt-4 p-4 rounded-[var(--radius)] bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-text)] text-xs sm:text-sm" role="alert" aria-live="polite">
                    <span>
                      {rateLimitMessage || formCopy.rateLimitWarning || 'Too many lookups. Please try again later.'} Please wait{' '}
                      <strong className="font-semibold">{rateLimitSeconds}s</strong> before querying again.
                    </span>
                  </div>
                )}

                {/* Generic / 503 Error Message */}
                {errorMessage && rateLimitSeconds <= 0 && (
                  <div className="mt-4 p-4 rounded-[var(--radius)] bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-text)] text-xs sm:text-sm" role="alert" aria-live="polite">
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* 4. NOT FOUND ERROR STATE (appears under the form in left column) */}
              {notFound && (
                <div
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] p-6 shadow-none text-left"
                  style={{ borderTopColor: 'var(--color-kraft)' }}
                  role="alert"
                  aria-live="polite"
                >
                  <p className="text-sm sm:text-base text-[var(--color-text)] leading-relaxed" style={{ letterSpacing: 'normal' }}>
                    {notFoundCopy.messagePrefix || 'We could not find this tracking number. Check the number or '}
                    <button
                      type="button"
                      onClick={() => setActiveTab && setActiveTab('contact')}
                      className="link-inline"
                    >
                      {notFoundCopy.linkLabel || 'contact us'}
                    </button>
                    {notFoundCopy.messageSuffix || '.'}
                  </p>
                </div>
              )}

              {/* 4. SHIPMENT DETAILS RESULT CARD (appears under the form in left column) */}
              {shipmentData && (
                <div
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] p-6 space-y-6 shadow-none text-left"
                  style={{ borderTopColor: 'var(--color-kraft)' }}
                >
                  {/* Top Bar: Status (first & large), Tracking Number + Copy, Last Updated */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[var(--color-border)]">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-[var(--color-text-muted)] block">
                          Status
                        </span>
                        <div className="text-2xl font-bold text-[var(--color-text)] leading-tight">
                          {formatStatusLabel(shipmentData.status)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[var(--color-navy)] tabular-nums">
                          {shipmentData.tracking_number}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(shipmentData.tracking_number)}
                          aria-label="Copy tracking number"
                          title="Copy tracking number"
                          className="w-9 h-9 rounded-[var(--radius)] bg-[var(--color-surface)] hover:bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-navy)] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)] shrink-0"
                        >
                          <Copy className="w-4 h-4 text-[var(--color-navy)]" aria-hidden="true" />
                        </button>
                        {copied && (
                          <span className="text-xs text-[var(--color-text-muted)]" role="status">
                            Copied
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-[var(--color-text-muted)] tabular-nums sm:text-right shrink-0">
                      Last updated: {shipmentData.last_updated ? (formatSingaporeDateTime(shipmentData.last_updated) || 'Not available') : 'Not available'}
                    </div>
                  </div>

                  {/* Route & Service Overview: Origin, Destination, Service type ("Road transport") */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 rounded-[var(--radius)] bg-[var(--color-bg-alt)] border border-[var(--color-border)] shadow-none">
                    <div className="space-y-1">
                      <span className="text-xs text-[var(--color-text-muted)] block">
                        Origin
                      </span>
                      <p className="text-sm sm:text-base font-semibold text-[var(--color-text)]">
                        {shipmentData.origin || shipmentData.origin_city || 'Not specified'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-[var(--color-text-muted)] block">
                        Destination
                      </span>
                      <p className="text-sm sm:text-base font-semibold text-[var(--color-text)]">
                        {shipmentData.destination || shipmentData.destination_city || 'Not specified'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-[var(--color-text-muted)] block">
                        Service type
                      </span>
                      <p className="text-sm sm:text-base font-semibold text-[var(--color-text)]">
                        Road transport
                      </p>
                    </div>
                  </div>

                  {/* Shipment Events Timeline: Ordered list with square markers */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-base sm:text-lg font-bold font-heading text-[var(--color-navy)]" style={{ letterSpacing: 'normal' }}>
                      {eventsCopy.heading || 'Tracking events'}
                    </h3>

                    {Array.isArray(shipmentData.events) && shipmentData.events.length > 0 ? (
                      <ol className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--color-border)] list-none">
                        {shipmentData.events.map((evt, idx) => {
                          const isLatest = idx === shipmentData.events.length - 1;
                          return (
                            <li key={idx} className="relative">
                              <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-[2px] bg-[var(--color-navy)]" />
                              <div className="space-y-0.5">
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                                  <span
                                    className={`text-sm sm:text-base text-[var(--color-text)] ${
                                      isLatest ? 'font-bold' : 'font-normal'
                                    }`}
                                  >
                                    {evt.status || evt.stage || 'Status update'}
                                  </span>
                                  <span className="text-xs text-[var(--color-text-muted)] tabular-nums sm:text-right shrink-0">
                                    {formatSingaporeDateTime(evt.time || evt.occurred_at)}
                                  </span>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    ) : (
                      <div className="p-4 rounded-[var(--radius)] bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-text-muted)] text-xs sm:text-sm">
                        {eventsCopy.emptyText || 'Shipment is recorded. Updates are entered by our team as they occur.'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 6. HELP LINE: Left-aligned, muted text, 24px below blocks */}
              <div className="pt-2 text-left">
                <p className="text-sm text-[var(--color-text-muted)]" style={{ letterSpacing: 'normal' }}>
                  {helpCopy.text || 'Need help with your shipment? '}
                  <button
                    type="button"
                    onClick={() => setActiveTab && setActiveTab('contact')}
                    className="link-inline"
                  >
                    {helpCopy.linkLabel || 'Contact us'}
                  </button>
                </p>
              </div>

            </div>

            {/* RIGHT COLUMN (about 40%): Guidelines block aligned at top */}
            <div className="lg:col-span-5 w-full">
              {/* 5. GUIDELINES BLOCK: white, 1px border, 4px corners, no shadow, 3px kraft top border, 24px padding */}
              <div
                className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-[3px] rounded-[var(--radius)] p-6 shadow-none text-left space-y-2"
                style={{ borderTopColor: 'var(--color-kraft)' }}
              >
                <h2
                  className="text-base sm:text-lg font-bold font-heading text-[var(--color-navy)]"
                  style={{ letterSpacing: 'normal' }}
                >
                  {guidelinesCopy.heading}
                </h2>
                <p
                  className="text-sm sm:text-base text-[var(--color-text)] leading-relaxed"
                  style={{ letterSpacing: 'normal' }}
                >
                  {guidelinesText}
                </p>
                <p
                  className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed pt-1"
                  style={{ letterSpacing: 'normal' }}
                >
                  {guidelinesCopy.airFreightNotice}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
