import React, { useState, useEffect, useRef } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { formatSingaporeDateTime } from '../utils/dateTime';
import { TurnstileCaptcha } from '../components/TurnstileCaptcha';
import { 
  Search, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Package, 
  Copy, 
  Check, 
  RotateCw,
  Truck
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
  const { activeTrackingId, setActiveTrackingId } = useLogistics();

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
      setRateLimitMessage('Rate limit reached: Maximum 10 tracking queries per minute allowed.');
    }
  }, []);

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
      setRateLimitMessage('Rate limit reached: Maximum 10 tracking queries per minute allowed.');
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

  // Status badge styling
  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s.includes('DELIVERED')) {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'DELIVERED'
      };
    }
    if (s.includes('TRANSIT')) {
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500 animate-pulse',
        label: 'IN TRANSIT'
      };
    }
    if (s.includes('DELAY')) {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        label: 'DELAYED'
      };
    }
    return {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dot: 'bg-indigo-500',
      label: s || 'BOOKED'
    };
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Header - No prohibited claims */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-navy)] text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Secure Tracking Lookup
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-navy)] tracking-tight">
            Track Your Shipment
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm sm:text-base max-w-xl mx-auto">
            Enter your tracking number to see the latest status. Updates are entered by our team, and the time of the last update is shown.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 shadow-card space-y-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="space-y-4"
          >
            <div className="relative w-full">
              <Search className="w-5 h-5 text-[var(--color-text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Enter tracking number"
                disabled={isLoading || rateLimitSeconds > 0}
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl pl-12 pr-4 py-3.5 text-[var(--color-text)] placeholder-[var(--color-text-muted)] text-sm sm:text-base focus:bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-navy)] focus:ring-1 focus:ring-[var(--color-navy)] transition-colors disabled:opacity-50"
              />
            </div>

            {/* Cloudflare Turnstile Verification Widget - Positioned ABOVE the Track button */}
            <div className="pt-1">
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

            {/* Track Button - Disabled until Turnstile passes */}
            <div>
              <button
                type="submit"
                disabled={isLoading || rateLimitSeconds > 0 || !captchaVerified || !turnstileToken}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--color-navy)] hover:bg-[var(--color-navy-hover)] disabled:bg-slate-200 disabled:text-slate-500 text-[var(--color-on-navy)] font-medium px-6 py-3.5 rounded-xl transition-all shadow-sm disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Track Shipment</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Rate Limiting Warning / 429 Message with countdown from Retry-After */}
          {rateLimitSeconds > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>
                {rateLimitMessage || 'Too many lookups. Please try again later.'} Please wait{' '}
                <strong className="font-semibold text-amber-950">{rateLimitSeconds}s</strong> before querying again.
              </span>
            </div>
          )}

          {/* Error Message (503 shown as it is) */}
          {errorMessage && rateLimitSeconds <= 0 && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Not Found Message (404 only) */}
        {notFound && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 text-center shadow-card">
            <p className="text-base font-semibold text-[var(--color-navy)]">Tracking number not found or unavailable.</p>
          </div>
        )}

        {/* Shipment Details Result Card - Showing ONLY required, non-sensitive fields */}
        {shipmentData && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-8 shadow-card">
            
            {/* Top Bar: Tracking Number, Status Badge & Last Updated (Singapore Time) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Tracking Number</span>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-mono font-bold text-[var(--color-navy)] tracking-wide">
                    {shipmentData.tracking_number}
                  </h2>
                  <button
                    onClick={() => handleCopy(shipmentData.tracking_number)}
                    title="Copy tracking number"
                    className="p-1.5 rounded-lg bg-[var(--color-bg)] hover:bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-navy)] transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5">
                {(() => {
                  const badge = getStatusBadge(shipmentData.status);
                  return (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide ${badge.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </div>
                  );
                })()}
                {/* Last updated: Singapore Time */}
                <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span>
                    Last updated: {shipmentData.last_updated ? (formatSingaporeDateTime(shipmentData.last_updated) || 'Not available') : 'Not available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Route & Service Overview: Origin city, Destination city, Service type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
              {/* Origin City / Area */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Origin
                </span>
                <p className="text-base sm:text-lg font-semibold text-[var(--color-navy)]">
                  {shipmentData.origin || shipmentData.origin_city || 'Not specified'}
                </p>
              </div>

              {/* Destination City / Area */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Destination
                </span>
                <p className="text-base sm:text-lg font-semibold text-[var(--color-navy)]">
                  {shipmentData.destination || shipmentData.destination_city || 'Not specified'}
                </p>
              </div>

              {/* Service Type */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Service Type
                </span>
                <p className="text-base sm:text-lg font-semibold text-[var(--color-navy)]">
                  {shipmentData.service_type || 'Not specified'}
                </p>
              </div>
            </div>

            {/* Shipment Events Timeline: Status text and time */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-[var(--color-navy)] uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-[var(--color-navy)]" /> Tracking Events
              </h3>

              {Array.isArray(shipmentData.events) && shipmentData.events.length > 0 ? (
                <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--color-border)]">
                  {shipmentData.events.map((evt, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-6 sm:-left-8 top-1 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-navy)] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-navy)]" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-sm sm:text-base font-semibold text-[var(--color-text)]">
                            {evt.status || evt.stage || 'Status Update'}
                          </h4>
                          <span className="text-xs text-[var(--color-text-muted)] font-mono">
                            {formatSingaporeDateTime(evt.time || evt.occurred_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)] text-xs sm:text-sm">
                  Shipment is recorded in the network. Milestone updates will be posted here as they occur.
                </div>
              )}
            </div>

          </div>
        )}

        {/* Empty State Help Card */}
        {!shipmentData && !notFound && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 text-center space-y-4 shadow-card">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-navy)] flex items-center justify-center mx-auto">
              <Truck className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-[var(--color-navy)]">Tracking Number Guidelines</h3>
              <p className="text-[var(--color-text-muted)] text-xs sm:text-sm max-w-lg mx-auto">
                Enter the consignment or reference number provided on your booking confirmation or transport document to view its current milestone.
              </p>
            </div>
          </div>
        )}

        {/* Footer Support Prompt */}
        <div className="text-center pt-4">
          <p className="text-xs text-[var(--color-text-muted)]">
            Need assistance with your consignment?{' '}
            <button
              onClick={() => setActiveTab && setActiveTab('contact')}
              className="text-[var(--color-navy)] hover:underline font-medium transition-colors cursor-pointer"
            >
              Contact operations support
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
