import React, { useState, useEffect, useRef } from 'react';
import { useLogistics } from '../context/LogisticsContext';
import { trackingService } from '../services/tracking';
import { getRateLimitStatus, recordRateLimitAttempt } from '../utils/rateLimiter';
import { 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Package, 
  ArrowRight, 
  Copy, 
  Check, 
  RotateCw,
  HelpCircle,
  Truck
} from 'lucide-react';

export const TrackShipmentPage = ({ setActiveTab }) => {
  const { activeTrackingId, setActiveTrackingId } = useLogistics();

  const [searchInput, setSearchInput] = useState(activeTrackingId || '');
  const [shipmentData, setShipmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);
  const [copied, setCopied] = useState(false);

  // Rate limiter countdown timer
  useEffect(() => {
    if (rateLimitSeconds <= 0) return;
    const interval = setInterval(() => {
      setRateLimitSeconds((prev) => {
        if (prev <= 1) {
          setErrorMessage('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [rateLimitSeconds]);

  // Check rate limit on component mount
  useEffect(() => {
    const status = getRateLimitStatus('track_shipment', 10, 60000);
    if (!status.allowed) {
      setRateLimitSeconds(status.retryAfter);
      setErrorMessage(`Rate limit reached: Maximum 10 tracking queries per minute allowed. Please wait ${status.retryAfter}s before trying again.`);
    }
  }, []);

  // Format date and time in Singapore Time (SGT)
  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'Pending update';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat('en-SG', {
        timeZone: 'Asia/Singapore',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(d) + ' (SGT)';
    } catch (e) {
      return String(dateStr);
    }
  };

  // Perform tracking search calling the Edge Function
  const handleSearch = async (queryOverride) => {
    const rawQuery = queryOverride !== undefined ? queryOverride : searchInput;
    const cleanQuery = (rawQuery || '').trim().toUpperCase();

    if (!cleanQuery) {
      setErrorMessage('Please enter a valid tracking number.');
      return;
    }

    // 1. Enforce rate limiting: 10 attempts per minute per visitor
    const status = getRateLimitStatus('track_shipment', 10, 60000);
    if (!status.allowed) {
      setRateLimitSeconds(status.retryAfter);
      setErrorMessage(`Rate limit reached: Maximum 10 tracking queries per minute allowed. Please wait ${status.retryAfter}s before trying again.`);
      return;
    }

    // Record the attempt against rate limiter
    recordRateLimitAttempt('track_shipment', 60000);

    setIsLoading(true);
    setNotFound(false);
    setErrorMessage('');

    try {
      // Calls Edge Function "track-shipment" which executes database function track_shipment()
      // The browser NEVER reads the shipments table directly.
      const data = await trackingService.trackPublicShipment(cleanQuery);

      if (!data || !data.tracking_number) {
        // Neutral message that does not reveal whether a number exists elsewhere
        setNotFound(true);
        setShipmentData(null);
        if (setActiveTrackingId) setActiveTrackingId('');
      } else {
        setNotFound(false);
        setShipmentData(data);
        if (setActiveTrackingId) setActiveTrackingId(data.tracking_number);
      }
    } catch (err) {
      console.warn('[TrackShipmentPage] Tracking lookup notice:', err);
      // Consistent neutral response on any error
      setNotFound(true);
      setShipmentData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-search on mount if activeTrackingId was set
  const initialSearchDone = useRef(false);
  useEffect(() => {
    if (activeTrackingId && !initialSearchDone.current) {
      initialSearchDone.current = true;
      setSearchInput(activeTrackingId);
      handleSearch(activeTrackingId);
    }
  }, [activeTrackingId]);

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
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-400',
        label: 'DELIVERED'
      };
    }
    if (s.includes('TRANSIT')) {
      return {
        bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        dot: 'bg-blue-400 animate-pulse',
        label: 'IN TRANSIT'
      };
    }
    if (s.includes('DELAY')) {
      return {
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        dot: 'bg-amber-400',
        label: 'DELAYED'
      };
    }
    return {
      bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      dot: 'bg-indigo-400',
      label: s || 'BOOKED'
    };
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Secure Tracking Lookup
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Track Your Shipment
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Real-time status updates and delivery timeline directly from our logistics network.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-[#121829] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/40">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter tracking number"
                disabled={isLoading || rateLimitSeconds > 0}
                className="w-full bg-[#0D121F] border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || rateLimitSeconds > 0}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:shadow-none"
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
          </form>

          {/* Rate Limiting Warning */}
          {rateLimitSeconds > 0 && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>
                Rate limit active (max 10 queries per minute). Please wait{' '}
                <strong className="font-semibold text-white">{rateLimitSeconds}s</strong> before querying again.
              </span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && rateLimitSeconds <= 0 && (
            <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs sm:text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Not Found Message (Neutral - does not reveal whether a number exists elsewhere) */}
        {notFound && (
          <div className="bg-[#121829] border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">No Tracking Information Found</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              No tracking details available for the provided reference number. Please check your tracking number and try again.
            </p>
          </div>
        )}

        {/* Shipment Details Result Card - Showing ONLY required fields */}
        {shipmentData && (
          <div className="bg-[#121829] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
            
            {/* Top Bar: Tracking Number, Status Badge & Last Updated */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tracking Number</span>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-mono font-bold text-white tracking-wide">
                    {shipmentData.tracking_number}
                  </h2>
                  <button
                    onClick={() => handleCopy(shipmentData.tracking_number)}
                    title="Copy tracking number"
                    className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
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
                {/* Last updated - ALWAYS shown */}
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    Last updated: {formatDateTime(shipmentData.last_updated)}
                  </span>
                </div>
              </div>
            </div>

            {/* Route & Delivery Overview (Origin City, Destination City, Estimated Delivery) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl bg-[#0D121F] border border-slate-800/60">
              {/* Origin City */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" /> Origin City
                </span>
                <p className="text-base sm:text-lg font-semibold text-white">
                  {shipmentData.origin_city || 'Not specified'}
                </p>
              </div>

              {/* Destination City */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Destination City
                </span>
                <p className="text-base sm:text-lg font-semibold text-white">
                  {shipmentData.destination_city || 'Not specified'}
                </p>
              </div>

              {/* Estimated Delivery */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Estimated Delivery
                </span>
                <p className="text-base sm:text-lg font-semibold text-white">
                  {formatDateTime(shipmentData.estimated_delivery)}
                </p>
              </div>
            </div>

            {/* Shipment Timeline */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-400" /> Tracking Timeline
              </h3>

              {Array.isArray(shipmentData.events) && shipmentData.events.length > 0 ? (
                <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {shipmentData.events.map((evt, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-6 sm:-left-8 top-1 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-[#121829] border-2 border-blue-500 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-sm sm:text-base font-semibold text-white">
                            {evt.stage || 'Status Update'}
                          </h4>
                          <span className="text-xs text-slate-400 font-mono">
                            {formatDateTime(evt.occurred_at)}
                          </span>
                        </div>
                        {evt.location && (
                          <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span>{evt.location}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800/60 text-slate-400 text-xs sm:text-sm">
                  Shipment is recorded in the network. Check back shortly for transit milestone updates.
                </div>
              )}
            </div>

          </div>
        )}

        {/* Empty State Help Card */}
        {!shipmentData && !notFound && (
          <div className="bg-[#121829]/60 border border-slate-800/80 rounded-2xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Truck className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-white">Tracking Number Guidelines</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
                Enter the consignment or reference number provided on your booking confirmation email or transport voucher to view its current transit milestone.
              </p>
            </div>
          </div>
        )}

        {/* Footer Support Prompt */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-500">
            Need assistance with your consignment?{' '}
            <button
              onClick={() => setActiveTab && setActiveTab('contact')}
              className="text-blue-400 hover:text-blue-300 font-medium underline transition-colors"
            >
              Contact operations support
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
